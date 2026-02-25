"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, RotateCcw, Play, Pause, Zap, 
  Eye, Activity, Settings, Info, ArrowRight
} from 'lucide-react';

// ==================== TYPES ====================
interface Position {
  x: number;
  y: number;
}

interface MazeCell {
  type: 'wall' | 'empty' | 'start' | 'goal' | 'pit';
  reward: number;
}

// ==================== MAZE CONFIGURATIONS ====================
const MAZES = {
  simple: {
    name: 'Simple Path',
    description: 'Basic maze with one optimal path',
    grid: [
      ['S', '.', '.', '.', '.'],
      ['#', '#', '#', '.', '#'],
      ['.', '.', '.', '.', '#'],
      ['.', '#', '#', '#', '#'],
      ['.', '.', '.', '.', 'G']
    ]
  },
  obstacles: {
    name: 'With Obstacles',
    description: 'Multiple paths, some with negative rewards',
    grid: [
      ['S', '.', '#', '.', 'G'],
      ['.', '#', '.', '.', '#'],
      ['.', '.', 'P', '.', '.'],
      ['#', '#', '.', '#', '.'],
      ['.', '.', '.', 'P', '.']
    ]
  },
  complex: {
    name: 'Complex Maze',
    description: 'Traps, multiple routes, learn to avoid dangers',
    grid: [
      ['S', '.', '.', '#', 'P', '.', 'G'],
      ['#', '#', '.', '#', '.', '#', '.'],
      ['.', '.', '.', '.', 'P', '.', '.'],
      ['.', '#', '#', '#', '.', '#', '.'],
      ['.', 'P', '.', '.', '.', '.', '#'],
      ['.', '#', '.', '#', '#', '.', '.'],
      ['.', '.', '.', '.', '.', 'P', '.']
    ]
  }
};

// ==================== MAZE PARSER ====================
const parseMaze = (mazeConfig: string[][]): { 
  grid: MazeCell[][]; 
  start: Position; 
  goal: Position;
} => {
  const grid: MazeCell[][] = [];
  let start: Position = { x: 0, y: 0 };
  let goal: Position = { x: 0, y: 0 };

  mazeConfig.forEach((row, y) => {
    const gridRow: MazeCell[] = [];
    row.forEach((cell, x) => {
      switch(cell) {
        case 'S':
          gridRow.push({ type: 'start', reward: 0 });
          start = { x, y };
          break;
        case 'G':
          gridRow.push({ type: 'goal', reward: 100 });
          goal = { x, y };
          break;
        case 'P':
          gridRow.push({ type: 'pit', reward: -50 });
          break;
        case '#':
          gridRow.push({ type: 'wall', reward: -10 });
          break;
        default:
          gridRow.push({ type: 'empty', reward: -1 });
      }
    });
    grid.push(gridRow);
  });

  return { grid, start, goal };
};

// ==================== MAIN COMPONENT ====================
export default function QLearningVisualizer() {
  const [selectedMaze, setSelectedMaze] = useState<keyof typeof MAZES>('simple');
  const [mazeData, setMazeData] = useState(parseMaze(MAZES.simple.grid));
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [showQValues, setShowQValues] = useState(false);
  const [highlightedCell, setHighlightedCell] = useState<Position | null>(null);
  
  // Q-Learning state
  const [episode, setEpisode] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [epsilon, setEpsilon] = useState(0.3);
  const alpha = 0.1;
  const gamma = 0.9;
  const [currentPos, setCurrentPos] = useState<Position>({ x: 0, y: 0 });
  const [path, setPath] = useState<Position[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  
  // Q-Table storage - use useRef to avoid stale closures
  const qTableRef = useRef<Map<string, Map<string, number>>>(new Map());
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep qTable in sync with ref for rendering
  const [qTable, setQTable] = useState<Map<string, Map<string, number>>>(new Map());

  // Refs to avoid stale closures in the interval
  const currentPosRef = useRef(currentPos);
  const pathRef = useRef(path);
  const epsilonRef = useRef(epsilon);
  const mazeDataRef = useRef(mazeData);
  
  // Keep refs in sync
  useEffect(() => {
    currentPosRef.current = currentPos;
  }, [currentPos]);
  
  useEffect(() => {
    pathRef.current = path;
  }, [path]);
  
  useEffect(() => {
    epsilonRef.current = epsilon;
  }, [epsilon]);
  
  useEffect(() => {
    mazeDataRef.current = mazeData;
  }, [mazeData]);

  // Initialize maze
  useEffect(() => {
    const newMazeData = parseMaze(MAZES[selectedMaze].grid);
    setMazeData(newMazeData);
    resetSimulation();
  }, [selectedMaze]);

  // Drawing on canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    drawMaze();
  }, [mazeData, currentPos, path, highlightedCell, showQValues, qTable]);

  const getStateKey = (pos: Position): string => {
    return `${pos.x},${pos.y}`;
  };

  const getQValue = (state: string, action: string): number => {
    const stateActions = qTableRef.current.get(state);
    if (!stateActions) return 0;
    return stateActions.get(action) || 0;
  };

  const updateQValue = (
    state: string,
    action: string,
    reward: number,
    nextState: string
  ) => {
    const qTable = qTableRef.current;
    
    // Get available actions for next state
    const nextActions = getAvailableActions(stringToPos(nextState));
    
    // Find max Q for next state
    let maxNextQ = 0;
    nextActions.forEach(nextAction => {
      const q = getQValue(nextState, nextAction);
      maxNextQ = Math.max(maxNextQ, q);
    });

    // Current Q value
    let stateActions = qTable.get(state);
    if (!stateActions) {
      stateActions = new Map();
    }
    const currentQ = stateActions.get(action) || 0;

    // Q-learning update
    const newQ = currentQ + alpha * (reward + gamma * maxNextQ - currentQ);
    
    stateActions.set(action, newQ);
    qTable.set(state, stateActions);
    
    // Update both ref and state for rendering
    qTableRef.current = qTable;
    setQTable(new Map(qTable));
  };

  const stringToPos = (state: string): Position => {
    const [x, y] = state.split(',').map(Number);
    return { x, y };
  };

  const getAvailableActions = (pos: Position): string[] => {
    const actions: string[] = [];
    if (isValidMove({ x: pos.x, y: pos.y - 1 })) actions.push('up');
    if (isValidMove({ x: pos.x, y: pos.y + 1 })) actions.push('down');
    if (isValidMove({ x: pos.x - 1, y: pos.y })) actions.push('left');
    if (isValidMove({ x: pos.x + 1, y: pos.y })) actions.push('right');
    return actions;
  };

  const isValidMove = (pos: Position): boolean => {
    if (pos.y < 0 || pos.y >= mazeDataRef.current.grid.length) return false;
    if (pos.x < 0 || pos.x >= mazeDataRef.current.grid[0].length) return false;
    return mazeDataRef.current.grid[pos.y][pos.x].type !== 'wall';
  };

  const getNextPosition = (pos: Position, action: string): Position => {
    const newPos = { ...pos };
    switch(action) {
      case 'up': newPos.y--; break;
      case 'down': newPos.y++; break;
      case 'left': newPos.x--; break;
      case 'right': newPos.x++; break;
    }
    return newPos;
  };

  const chooseAction = (state: string, availableActions: string[]): string => {
    // Epsilon-greedy
    if (Math.random() < epsilonRef.current) {
      // Explore
      return availableActions[Math.floor(Math.random() * availableActions.length)];
    } else {
      // Exploit
      let bestAction = availableActions[0];
      let bestValue = getQValue(state, bestAction);
      
      for (const action of availableActions) {
        const value = getQValue(state, action);
        if (value > bestValue) {
          bestValue = value;
          bestAction = action;
        }
      }
      return bestAction;
    }
  };

  const runStep = useCallback(() => {
    const pos = currentPosRef.current;
    const currentPath = pathRef.current;
    const eps = epsilonRef.current;
    const maze = mazeDataRef.current;
    
    const state = getStateKey(pos);
    const availableActions = getAvailableActions(pos);
    
    if (availableActions.length === 0) return;

    // Choose action
    const action = chooseAction(state, availableActions);
    const nextPos = getNextPosition(pos, action);
    
    // Get reward
    const cell = maze.grid[nextPos.y][nextPos.x];
    const reward = cell.reward;
    
    // Update Q-value
    const nextState = getStateKey(nextPos);
    updateQValue(state, action, reward, nextState);

    // Update path
    const newPath = [...currentPath, nextPos];

    // Check if episode ended
    const isGoal = cell.type === 'goal';
    const isPit = cell.type === 'pit';
    
    setCurrentPos(nextPos);
    setPath(newPath);
    setTotalReward(prev => prev + reward);
    setCurrentStep(prev => prev + 1);

    if (isGoal) {
      // Success!
      setSuccessCount(prev => prev + 1);
      setEpisode(prev => prev + 1);
      const newEpsilon = Math.max(0.01, eps * 0.99);
      setEpsilon(newEpsilon);
      epsilonRef.current = newEpsilon;
      setCurrentPos(maze.start);
      setPath([]);
      setCurrentStep(0);
      setTotalReward(0);
    } else if (isPit || newPath.length > 50) {
      // Failed episode
      setEpisode(prev => prev + 1);
      const newEpsilon = Math.max(0.01, eps * 0.99);
      setEpsilon(newEpsilon);
      epsilonRef.current = newEpsilon;
      setCurrentPos(maze.start);
      setPath([]);
      setCurrentStep(0);
      setTotalReward(0);
    }
  }, []);

  const resetSimulation = useCallback(() => {
    const maze = mazeDataRef.current;
    setEpisode(0);
    setCurrentStep(0);
    setTotalReward(0);
    setEpsilon(0.3);
    epsilonRef.current = 0.3;
    setSuccessCount(0);
    setPath([]);
    setCurrentPos(maze.start);
    qTableRef.current = new Map();
    setQTable(new Map());
  }, []);

  useEffect(() => {
    if (isRunning) {
      animationRef.current = setInterval(runStep, speed);
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    }
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isRunning, speed, runStep]);

  const drawMaze = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { grid } = mazeData;
    const cellSize = Math.min(600 / grid[0].length, 600 / grid.length);

    canvas.width = grid[0].length * cellSize;
    canvas.height = grid.length * cellSize;

    // Draw grid
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const cell = grid[y][x];
        const cellX = x * cellSize;
        const cellY = y * cellSize;

        // Cell background
        if (cell.type === 'wall') {
          ctx.fillStyle = '#2D3748';
          ctx.fillRect(cellX, cellY, cellSize, cellSize);
          ctx.fillStyle = '#718096';
          ctx.font = 'bold 16px monospace';
          ctx.fillText('█', cellX + cellSize/2 - 8, cellY + cellSize/2 + 6);
        } else if (cell.type === 'goal') {
          ctx.fillStyle = '#FBBF24';
          ctx.fillRect(cellX, cellY, cellSize, cellSize);
          ctx.font = 'bold 20px monospace';
          ctx.fillText('🏆', cellX + cellSize/2 - 12, cellY + cellSize/2 + 8);
        } else if (cell.type === 'pit') {
          ctx.fillStyle = '#FCA5A5';
          ctx.fillRect(cellX, cellY, cellSize, cellSize);
          ctx.font = 'bold 20px monospace';
          ctx.fillText('💀', cellX + cellSize/2 - 12, cellY + cellSize/2 + 8);
        } else if (cell.type === 'start') {
          ctx.fillStyle = '#6EE7B7';
          ctx.fillRect(cellX, cellY, cellSize, cellSize);
          ctx.font = 'bold 20px monospace';
          ctx.fillText('🚀', cellX + cellSize/2 - 12, cellY + cellSize/2 + 8);
        } else {
          ctx.fillStyle = '#1F2937';
          ctx.fillRect(cellX, cellY, cellSize, cellSize);
        }

        // Grid lines
        ctx.strokeStyle = '#4B5563';
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX, cellY, cellSize, cellSize);

        // Show Q-values if enabled
        if (showQValues && cell.type !== 'wall') {
          const stateKey = getStateKey({ x, y });
          const actions = qTable.get(stateKey);
          if (actions) {
            const maxQ = Math.max(...Array.from(actions.values()));
            if (maxQ > 0) {
              ctx.fillStyle = '#10B981';
              ctx.globalAlpha = Math.min(maxQ / 100, 0.5);
              ctx.fillRect(cellX, cellY, cellSize, cellSize);
              ctx.globalAlpha = 1;
              
              ctx.fillStyle = '#FFFFFF';
              ctx.font = 'bold 10px monospace';
              ctx.fillText(maxQ.toFixed(1), cellX + 5, cellY + 15);
            }
          }
        }

        // Highlight hovered cell
        if (highlightedCell && highlightedCell.x === x && highlightedCell.y === y) {
          ctx.strokeStyle = '#FBBF24';
          ctx.lineWidth = 4;
          ctx.strokeRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4);
        }
      }
    }

    // Draw path
    if (path.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      
      for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        
        ctx.moveTo(from.x * cellSize + cellSize/2, from.y * cellSize + cellSize/2);
        ctx.lineTo(to.x * cellSize + cellSize/2, to.y * cellSize + cellSize/2);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw current agent position
    if (currentPos) {
      const { x, y } = currentPos;
      const centerX = x * cellSize + cellSize/2;
      const centerY = y * cellSize + cellSize/2;
      
      // Glow effect
      ctx.shadowColor = '#FBBF24';
      ctx.shadowBlur = 15;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, cellSize/3, 0, 2 * Math.PI);
      ctx.fillStyle = '#FBBF24';
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, cellSize/4, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('🤖', centerX - 10, centerY + 6);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-2xl font-light">
                  <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Q-LEARNING MAZE NAVIGATOR
                  </span>
                </h1>
                <p className="text-xs text-slate-400">Watch an AI agent learn through trial and error in real-time</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                  isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isRunning ? 'Pause' : 'Start'} Learning</span>
              </button>
              <button
                onClick={resetSimulation}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
                title="Reset Agent"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Panel - Controls & Explanations */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Algorithm Explanation */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6"
            >
              <h2 className="text-sm font-medium text-purple-400 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" />
                HOW Q-LEARNING WORKS
              </h2>
              
              <div className="space-y-3 text-sm">
                <p className="text-slate-300">
                  <span className="text-purple-400 font-bold">Q-Learning</span> is a reinforcement learning algorithm where an agent learns to make decisions by trial and error.
                </p>
                
                <div className="bg-black/30 p-3 rounded-lg">
                  <div className="text-xs text-slate-400 mb-2">The Q-Value Update Formula:</div>
                  <div className="font-mono text-sm text-cyan-400 bg-black/50 p-2 rounded">
                    Q(s,a) = Q(s,a) + α[R + γ·maxQ(s',a') - Q(s,a)]
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/20 p-2 rounded">
                    <span className="text-yellow-400">α (Alpha)</span>
                    <p className="text-slate-400">Learning rate: {alpha}</p>
                  </div>
                  <div className="bg-black/20 p-2 rounded">
                    <span className="text-green-400">γ (Gamma)</span>
                    <p className="text-slate-400">Discount: {gamma}</p>
                  </div>
                  <div className="bg-black/20 p-2 rounded">
                    <span className="text-blue-400">ε (Epsilon)</span>
                    <p className="text-slate-400">Exploration: {epsilon.toFixed(2)}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  <span className="text-purple-400">Exploration vs Exploitation:</span> The agent randomly explores (ε chance) or exploits known best actions (1-ε chance)
                </p>
              </div>
            </motion.div>

            {/* Live Stats */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6"
            >
              <h2 className="text-sm font-medium text-pink-400 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                LIVE LEARNING STATS
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/30 p-3 rounded-lg">
                    <div className="text-xs text-slate-400">Episode</div>
                    <div className="text-2xl font-bold text-purple-400">{episode}</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg">
                    <div className="text-xs text-slate-400">Step</div>
                    <div className="text-2xl font-bold text-pink-400">{currentStep}</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg">
                    <div className="text-xs text-slate-400">Total Reward</div>
                    <div className="text-xl font-bold text-green-400">{totalReward}</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg">
                    <div className="text-xs text-slate-400">Success Rate</div>
                    <div className="text-xl font-bold text-blue-400">
                      {episode > 0 ? ((successCount / episode) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                </div>

                {/* Progress bars */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Learning Progress</span>
                      <span className="text-cyan-400">{Math.min(100, (episode / 30) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (episode / 30) * 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Exploration Rate</span>
                      <span className="text-yellow-400">{(epsilon * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        className="bg-yellow-500 h-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${epsilon * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Successful Episodes</span>
                      <span className="text-green-400">{successCount}</span>
                    </div>
                    <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        className="bg-green-500 h-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${episode > 0 ? (successCount / episode) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Maze Selection & Controls */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6"
            >
              <h2 className="text-sm font-medium text-cyan-400 mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                EXPERIMENT CONTROLS
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-2">Select Maze:</label>
                  <div className="grid grid-cols-1 gap-2">
                    {(Object.keys(MAZES) as Array<keyof typeof MAZES>).map(key => (
                      <button
                        key={key}
                        onClick={() => setSelectedMaze(key)}
                        className={`p-3 rounded-lg text-left transition ${
                          selectedMaze === key 
                            ? 'bg-purple-500 border-purple-400' 
                            : 'bg-black/30 hover:bg-black/50 border border-white/5'
                        }`}
                      >
                        <div className="font-medium">{MAZES[key].name}</div>
                        <div className="text-xs text-slate-400">{MAZES[key].description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-2">
                    Learning Speed: {speed}ms per step
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowQValues(!showQValues)}
                    className={`flex-1 p-2 rounded-lg text-xs flex items-center justify-center gap-1 transition ${
                      showQValues ? 'bg-purple-500' : 'bg-black/30 hover:bg-black/50'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    {showQValues ? 'Hide' : 'Show'} Q-Values
                  </button>
                  <button
                    onClick={runStep}
                    disabled={isRunning}
                    className="flex-1 p-2 rounded-lg text-xs bg-black/30 hover:bg-black/50 transition flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Single Step
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Legend */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded" />
                  <span>Start (🚀)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded" />
                  <span>Goal (🏆) +100</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-400 rounded" />
                  <span>Pit (💀) -50</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-700 rounded" />
                  <span>Wall (█)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded" />
                  <span>Path</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full" />
                  <span>Agent (🤖)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Maze Visualization */}
          <div className="col-span-12 lg:col-span-8">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden"
              style={{ minHeight: '600px' }}
            >
              {/* Canvas for maze */}
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ minHeight: '600px' }}
                onMouseMove={(e) => {
                  const canvas = canvasRef.current;
                  if (!canvas) return;
                  
                  const rect = canvas.getBoundingClientRect();
                  const scaleX = canvas.width / rect.width;
                  const scaleY = canvas.height / rect.height;
                  
                  const mouseX = (e.clientX - rect.left) * scaleX;
                  const mouseY = (e.clientY - rect.top) * scaleY;
                  
                  const cellSize = canvas.width / mazeData.grid[0].length;
                  const x = Math.floor(mouseX / cellSize);
                  const y = Math.floor(mouseY / cellSize);
                  
                  if (x >= 0 && x < mazeData.grid[0].length && y >= 0 && y < mazeData.grid.length) {
                    setHighlightedCell({ x, y });
                  } else {
                    setHighlightedCell(null);
                  }
                }}
                onMouseLeave={() => setHighlightedCell(null)}
              />

              {/* Current Action Explanation */}
              <AnimatePresence>
                {highlightedCell && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-6 left-6 bg-black/90 backdrop-blur rounded-lg p-4 border border-white/10 max-w-sm"
                  >
                    <h3 className="text-sm font-medium text-purple-400 mb-2">
                      Cell Information
                    </h3>
                    <div className="space-y-1 text-xs">
                      <div>Position: ({highlightedCell.x}, {highlightedCell.y})</div>
                      <div>Type: {mazeData.grid[highlightedCell.y][highlightedCell.x].type}</div>
                      <div>Reward: {mazeData.grid[highlightedCell.y][highlightedCell.x].reward}</div>
                      {showQValues && (
                        <div>
                          Q-Value: {getQValue(getStateKey(highlightedCell), 'up').toFixed(2)}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Learning Tips */}
              <div className="absolute top-6 left-6 bg-black/50 backdrop-blur rounded-lg p-3 text-xs text-slate-300">
                <p className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  {epsilon > 0.2 
                    ? "🔍 Exploring - trying random actions to discover rewards"
                    : "🎯 Exploiting - using learned Q-values to find best path"}
                </p>
              </div>
            </motion.div>

            {/* Quick Learning Guide */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur rounded-lg p-3">
                <h4 className="text-xs font-medium text-purple-400 mb-1">Phase 1: Exploration</h4>
                <p className="text-xs text-slate-400">Agent tries random paths, builds initial Q-table</p>
              </div>
              <div className="bg-white/5 backdrop-blur rounded-lg p-3">
                <h4 className="text-xs font-medium text-purple-400 mb-1">Phase 2: Learning</h4>
                <p className="text-xs text-slate-400">Q-values update, better paths discovered</p>
              </div>
              <div className="bg-white/5 backdrop-blur rounded-lg p-3">
                <h4 className="text-xs font-medium text-purple-400 mb-1">Phase 3: Mastery</h4>
                <p className="text-xs text-slate-400">Agent consistently finds optimal path</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
