"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Layers,
  Sparkles,
  ChevronRight,
  HelpCircle,
  BarChart3,
  Sliders,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Info,
  Maximize2,
  RefreshCw,
  Eye,
  Crosshair,
  TrendingDown,
  Gauge,
  CircleDot,
  Compass,
  Activity,
  Calculator,
  Binary,
  Cpu,
  Flame,
  AlertTriangle,
  FileCode,
  Grid,
  ShieldCheck,
  BookOpen,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Navigation,
  Footprints,
  FastForward,
  TrendingUp,
  Sparkle,
} from "lucide-react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

// ── Mathematical Types & RL Models ─────────────────────────────────────
type Action = "up" | "right" | "down" | "left";
const ACTIONS: Action[] = ["up", "right", "down", "left"];

type RLAlgorithm = "q_learning" | "sarsa" | "expected_sarsa";
type ExplorationStrategy = "epsilon_greedy" | "boltzmann_softmax";
type EnvironmentPreset = "cliff_walking" | "simple" | "obstacles" | "frozen_lake" | "complex";
type VisualizationMode = "wedges" | "policy" | "state_values" | "visits";

interface Position {
  x: number;
  y: number;
}

interface CellData {
  type: "start" | "goal" | "empty" | "wall" | "pit" | "mud";
  reward: number;
}

// ── Environment Maps ───────────────────────────────────────────────────
const PRESET_MAPS: Record<EnvironmentPreset, { name: string; subtitle: string; desc: string; grid: string[][] }> = {
  cliff_walking: {
    name: "Sutton-Barto Cliff Walking",
    subtitle: "4 × 8 Classical Benchmark",
    desc: "Stepping off the cliff incurs a severe -100 penalty and sends the agent back to start. Tests risk-averse SARSA vs optimal Q-Learning.",
    grid: [
      [".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", "."],
      ["S", "P", "P", "P", "P", "P", "P", "G"],
    ],
  },
  simple: {
    name: "Standard GridWorld",
    subtitle: "5 × 5 Navigation",
    desc: "Single optimal corridor with corner barriers. Ideal for quick policy convergence visualization.",
    grid: [
      ["S", ".", ".", ".", "."],
      ["#", "#", "#", ".", "#"],
      [".", ".", ".", ".", "#"],
      [".", "#", "#", "#", "#"],
      [".", ".", ".", ".", "G"],
    ],
  },
  obstacles: {
    name: "Obstacle Course",
    subtitle: "6 × 6 Dynamic Multi-Path",
    desc: "Branching paths containing hazardous penalty pits and detour choices.",
    grid: [
      ["S", ".", "#", ".", ".", "G"],
      [".", "#", ".", ".", "#", "."],
      [".", ".", "P", ".", ".", "."],
      ["#", "#", ".", "#", ".", "."],
      [".", ".", ".", "P", ".", "."],
      [".", "#", ".", ".", ".", "."],
    ],
  },
  frozen_lake: {
    name: "Frozen Lake Grid",
    subtitle: "4 × 4 Ice Field",
    desc: "Fragile ice surface surrounded by deadly holes. Requires careful exploration.",
    grid: [
      ["S", ".", ".", "."],
      [".", "P", ".", "P"],
      [".", ".", ".", "P"],
      ["P", ".", ".", "G"],
    ],
  },
  complex: {
    name: "Deep Multi-Room Maze",
    subtitle: "7 × 7 High State-Space",
    desc: "Complex topological rooms with multiple dead-ends, traps, and long credit-assignment horizons.",
    grid: [
      ["S", ".", ".", "#", "P", ".", "G"],
      ["#", "#", ".", "#", ".", "#", "."],
      [".", ".", ".", ".", "P", ".", "."],
      [".", "#", "#", "#", ".", "#", "."],
      [".", "P", ".", ".", ".", ".", "#"],
      [".", "#", ".", "#", "#", ".", "."],
      [".", ".", ".", ".", ".", "P", "."],
    ],
  },
};

function parseEnvironment(mapGrid: string[][]) {
  const height = mapGrid.length;
  const width = mapGrid[0].length;
  const grid: CellData[][] = [];
  let start: Position = { x: 0, y: 0 };
  let goal: Position = { x: width - 1, y: height - 1 };

  for (let y = 0; y < height; y++) {
    const row: CellData[] = [];
    for (let x = 0; x < width; x++) {
      const char = mapGrid[y][x];
      switch (char) {
        case "S":
          row.push({ type: "start", reward: 0 });
          start = { x, y };
          break;
        case "G":
          row.push({ type: "goal", reward: 100 });
          goal = { x, y };
          break;
        case "P":
          row.push({ type: "pit", reward: -100 });
          break;
        case "M":
          row.push({ type: "mud", reward: -10 });
          break;
        case "#":
          row.push({ type: "wall", reward: -5 });
          break;
        default:
          row.push({ type: "empty", reward: -1 });
      }
    }
    grid.push(row);
  }

  return { grid, start, goal, width, height };
}

export default function ReworkedQLearningLab() {
  const { completeExperiment } = useLab(
    "computer-science/ai-problem/maze-qlearn",
    "computerScience",
    "simulation"
  );

  // ── Hyperparameters ───────────────────────────────────────────────────
  const [preset, setPreset] = useState<EnvironmentPreset>("cliff_walking");
  const [algorithm, setAlgorithm] = useState<RLAlgorithm>("q_learning");
  const [strategy, setStrategy] = useState<ExplorationStrategy>("epsilon_greedy");
  const [alpha, setAlpha] = useState<number>(0.2); // Learning rate
  const [gamma, setGamma] = useState<number>(0.95); // Discount factor
  const [epsilon, setEpsilon] = useState<number>(0.25); // Exploration probability
  const [temperature, setTemperature] = useState<number>(1.0); // Softmax temperature
  const [epsilonDecay, setEpsilonDecay] = useState<number>(0.997);

  // ── Visualization & UI Modes ──────────────────────────────────────────
  const [visMode, setVisMode] = useState<VisualizationMode>("wedges");
  const [activeTab, setActiveTab] = useState<"environment" | "qtable" | "theory" | "diagnostics">("environment");
  const [speedMs, setSpeedMs] = useState<number>(35); // 35ms = smooth rapid training

  // ── Simulation Engine State ───────────────────────────────────────────
  const [env, setEnv] = useState(() => parseEnvironment(PRESET_MAPS.cliff_walking.grid));
  const [agentPos, setAgentPos] = useState<Position>({ x: 0, y: 0 });
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [episode, setEpisode] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [episodeReward, setEpisodeReward] = useState<number>(0);
  const [successCount, setSuccessCount] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [lastTDError, setLastTDError] = useState<number>(0);

  // Hover & Inspector State
  const [hoveredCell, setHoveredCell] = useState<Position | null>(null);
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);

  // Reward History & Chart Data
  const [rewardHistory, setRewardHistory] = useState<number[]>([]);
  const [movingAvgReward, setMovingAvgReward] = useState<number>(-100);

  // Canvas Refs
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Q-Table Tensor & Visit Counts
  const qTableRef = useRef<Map<string, Record<Action, number>>>(new Map());
  const visitCountsRef = useRef<Map<string, number>>(new Map());
  const agentPosRef = useRef<Position>(env.start);
  const episodeRewardRef = useRef<number>(0);
  const currentStepRef = useRef<number>(0);
  const episodeTrajectoryRef = useRef<{ pos: Position; action: Action; reward: number; nextPos: Position }[]>([]);

  // Milestones State
  const [milestones, setMilestones] = useState({
    reachedGoal: false,
    convergedPolicy: false,
    testedSarsa: false,
    analyzedBellman: false,
    inspectedQTable: false,
  });

  const posKey = (pos: Position) => `${pos.x},${pos.y}`;

  // Initialize or Reset Q-Table
  const initQTable = useCallback(() => {
    const table = new Map<string, Record<Action, number>>();
    const visits = new Map<string, number>();

    for (let y = 0; y < env.height; y++) {
      for (let x = 0; x < env.width; x++) {
        table.set(`${x},${y}`, { up: 0, right: 0, down: 0, left: 0 });
        visits.set(`${x},${y}`, 0);
      }
    }

    qTableRef.current = table;
    visitCountsRef.current = visits;
    agentPosRef.current = env.start;
    episodeTrajectoryRef.current = [];
    setAgentPos(env.start);
    setEpisode(0);
    setCurrentStep(0);
    setEpisodeReward(0);
    setSuccessCount(0);
    setTotalSteps(0);
    setLastTDError(0);
    setRewardHistory([]);
    setMovingAvgReward(-100);
  }, [env]);

  // Handle Preset Change
  const handlePresetChange = (p: EnvironmentPreset) => {
    setPreset(p);
    const parsed = parseEnvironment(PRESET_MAPS[p].grid);
    setEnv(parsed);
    agentPosRef.current = parsed.start;
    episodeTrajectoryRef.current = [];
    setAgentPos(parsed.start);
  };

  useEffect(() => {
    initQTable();
  }, [initQTable]);

  // ── Action Selection Policies ──────────────────────────────────────────
  const selectAction = useCallback(
    (pos: Position, currentEpsilon: number): Action => {
      const key = posKey(pos);
      const qVals = qTableRef.current.get(key) || { up: 0, right: 0, down: 0, left: 0 };

      if (strategy === "epsilon_greedy") {
        if (Math.random() < currentEpsilon) {
          return ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
        }
        let maxVal = -Infinity;
        let bestActions: Action[] = [];
        for (const a of ACTIONS) {
          if (qVals[a] > maxVal) {
            maxVal = qVals[a];
            bestActions = [a];
          } else if (qVals[a] === maxVal) {
            bestActions.push(a);
          }
        }
        return bestActions[Math.floor(Math.random() * bestActions.length)];
      }

      // Boltzmann Softmax
      const tau = Math.max(0.05, temperature);
      const expValues = ACTIONS.map((a) => Math.exp(qVals[a] / tau));
      const sumExp = expValues.reduce((acc, v) => acc + v, 0);
      const probs = expValues.map((v) => v / sumExp);

      const r = Math.random();
      let cumulative = 0;
      for (let i = 0; i < ACTIONS.length; i++) {
        cumulative += probs[i];
        if (r <= cumulative) return ACTIONS[i];
      }
      return ACTIONS[0];
    },
    [strategy, temperature]
  );

  const getNextPosition = (pos: Position, action: Action): { nextPos: Position; hitWall: boolean } => {
    let nx = pos.x;
    let ny = pos.y;

    if (action === "up") ny = pos.y - 1;
    else if (action === "right") nx = pos.x + 1;
    else if (action === "down") ny = pos.y + 1;
    else if (action === "left") nx = pos.x - 1;

    // Out of bounds or wall collision
    if (nx < 0 || nx >= env.width || ny < 0 || ny >= env.height || env.grid[ny][nx].type === "wall") {
      return { nextPos: pos, hitWall: true };
    }
    return { nextPos: { x: nx, y: ny }, hitWall: false };
  };

  // ── Single RL Step Engine ──────────────────────────────────────────────
  const stepSimulation = useCallback(() => {
    const current = agentPosRef.current;
    const currentKey = posKey(current);
    const qVals = qTableRef.current.get(currentKey) || { up: 0, right: 0, down: 0, left: 0 };

    const visits = visitCountsRef.current.get(currentKey) || 0;
    visitCountsRef.current.set(currentKey, visits + 1);

    const action = selectAction(current, epsilon);
    const { nextPos: next, hitWall } = getNextPosition(current, action);
    const nextKey = posKey(next);
    const nextCell = env.grid[next.y][next.x];
    
    // Reward calculation: wall collision penalty (-3), pit (-50/-100), goal (+100), step (-1)
    const reward = hitWall ? -3 : nextCell.reward;

    const reachedGoal = !hitWall && nextCell.type === "goal";
    const fellInPit = !hitWall && nextCell.type === "pit";
    const isTerminal = reachedGoal;

    const actualNext = fellInPit ? env.start : next;
    const actualNextKey = posKey(actualNext);
    const actualNextQ = qTableRef.current.get(actualNextKey) || { up: 0, right: 0, down: 0, left: 0 };

    // Record trajectory transition for Bellman credit flow
    episodeTrajectoryRef.current.push({ pos: current, action, reward, nextPos: actualNext });

    let tdTarget = reward;
    if (!isTerminal) {
      if (algorithm === "q_learning") {
        const maxQ = Math.max(actualNextQ.up, actualNextQ.right, actualNextQ.down, actualNextQ.left);
        tdTarget = reward + gamma * maxQ;
      } else if (algorithm === "sarsa") {
        const nextAction = selectAction(actualNext, epsilon);
        tdTarget = reward + gamma * actualNextQ[nextAction];
      } else if (algorithm === "expected_sarsa") {
        let bestA = "right" as Action;
        let maxV = -Infinity;
        for (const a of ACTIONS) {
          if (actualNextQ[a] > maxV) {
            maxV = actualNextQ[a];
            bestA = a;
          }
        }
        let expectedQ = 0;
        for (const a of ACTIONS) {
          const prob = a === bestA ? 1 - epsilon + epsilon / 4 : epsilon / 4;
          expectedQ += prob * actualNextQ[a];
        }
        tdTarget = reward + gamma * expectedQ;
      }
    }

    const currentQ = qVals[action];
    const tdError = tdTarget - currentQ;
    setLastTDError(tdError);

    qVals[action] = currentQ + alpha * tdError;
    qTableRef.current.set(currentKey, qVals);

    episodeRewardRef.current += reward;
    currentStepRef.current += 1;
    setTotalSteps((p) => p + 1);

    const maxStepsPerEpisode = env.width * env.height * 12;
    const timedOut = currentStepRef.current >= maxStepsPerEpisode;

    if (isTerminal || timedOut) {
      const finalRew = episodeRewardRef.current;
      setEpisode((prev) => prev + 1);
      setEpisodeReward(finalRew);
      setCurrentStep(currentStepRef.current);

      setRewardHistory((prev) => {
        const nextHist = [...prev.slice(-45), finalRew];
        const sum = nextHist.reduce((acc, v) => acc + v, 0);
        setMovingAvgReward(Math.round(sum / nextHist.length));
        return nextHist;
      });

      if (reachedGoal) {
        setSuccessCount((prev) => prev + 1);
        setMilestones((p) => ({ ...p, reachedGoal: true }));
        completeExperiment();

        // 🌟 Backward TD Credit Propagation along the winning path
        const traj = episodeTrajectoryRef.current;
        for (let i = traj.length - 1; i >= 0; i--) {
          const t = traj[i];
          const sKey = posKey(t.pos);
          const nsKey = posKey(t.nextPos);
          const sQ = qTableRef.current.get(sKey) || { up: 0, right: 0, down: 0, left: 0 };
          const nsQ = qTableRef.current.get(nsKey) || { up: 0, right: 0, down: 0, left: 0 };
          const maxN = Math.max(nsQ.up, nsQ.right, nsQ.down, nsQ.left);
          const td = t.reward + gamma * maxN - sQ[t.action];
          sQ[t.action] += alpha * td;
          qTableRef.current.set(sKey, sQ);
        }
      }

      episodeTrajectoryRef.current = [];
      setEpsilon((prev) => Math.max(0.01, prev * epsilonDecay));

      agentPosRef.current = env.start;
      setAgentPos(env.start);
      episodeRewardRef.current = 0;
      currentStepRef.current = 0;

      if (episode > 4 && successCount > 2) {
        setMilestones((p) => ({ ...p, convergedPolicy: true }));
      }
    } else {
      agentPosRef.current = actualNext;
      setAgentPos(actualNext);
      setEpisodeReward(episodeRewardRef.current);
      setCurrentStep(currentStepRef.current);
    }
  }, [
    env,
    preset,
    selectAction,
    epsilon,
    algorithm,
    alpha,
    gamma,
    epsilonDecay,
    episode,
    successCount,
    completeExperiment,
  ]);

  // Loop runner
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isRunning) {
      intervalId = setInterval(() => {
        stepSimulation();
      }, speedMs);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, speedMs, stepSimulation]);

  // ── High-DPI GridWorld Canvas Renderer ─────────────────────────────────
  useEffect(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const displayW = Math.round(rect.width * dpr);
    const displayH = Math.round(rect.height * dpr);

    if (canvas.width !== displayW || canvas.height !== displayH) {
      canvas.width = displayW;
      canvas.height = displayH;
    }

    const width = rect.width;
    const height = rect.height;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const cellW = width / env.width;
    const cellH = height / env.height;

    // Find global min and max Q values for dynamic color scaling
    let minQ = -20;
    let maxQ = 50;
    for (const q of qTableRef.current.values()) {
      for (const a of ACTIONS) {
        if (q[a] < minQ) minQ = q[a];
        if (q[a] > maxQ) maxQ = q[a];
      }
    }

    const getQColor = (val: number, alphaMultiplier = 1) => {
      if (val >= 0) {
        const norm = Math.min(1, val / Math.max(1, maxQ));
        // Emerald/Cyan hue
        return `rgba(16, 185, 129, ${Math.max(0.15, norm * 0.85 * alphaMultiplier)})`;
      } else {
        const norm = Math.min(1, Math.abs(val) / Math.max(1, Math.abs(minQ)));
        // Rose/Amber hue
        return `rgba(244, 63, 94, ${Math.max(0.15, norm * 0.85 * alphaMultiplier)})`;
      }
    };

    // 1. Draw Cell Backgrounds & Q-Wedges
    for (let y = 0; y < env.height; y++) {
      for (let x = 0; x < env.width; x++) {
        const cell = env.grid[y][x];
        const px = x * cellW;
        const py = y * cellH;
        const cx = px + cellW / 2;
        const cy = py + cellH / 2;

        const isStart = env.start.x === x && env.start.y === y;
        const isGoal = env.goal.x === x && env.goal.y === y;
        const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;
        const isSelected = selectedCell?.x === x && selectedCell?.y === y;
        const qVals = qTableRef.current.get(`${x},${y}`) || { up: 0, right: 0, down: 0, left: 0 };

        // Base cell background
        if (cell.type === "wall") {
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(px, py, cellW, cellH);

          // Diagonal hatch texture for walls
          ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + cellW, py + cellH);
          ctx.moveTo(px + cellW, py);
          ctx.lineTo(px, py + cellH);
          ctx.stroke();
        } else if (cell.type === "pit") {
          ctx.fillStyle = "rgba(225, 29, 72, 0.25)";
          ctx.fillRect(px, py, cellW, cellH);
        } else if (isGoal) {
          ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
          ctx.fillRect(px, py, cellW, cellH);
        } else {
          ctx.fillStyle = "#090d16";
          ctx.fillRect(px, py, cellW, cellH);
        }

        // Draw 4 Directional Wedges if empty & visMode === 'wedges'
        if (cell.type !== "wall" && !isGoal && cell.type !== "pit" && visMode === "wedges") {
          // UP Wedge
          ctx.fillStyle = getQColor(qVals.up);
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + cellW, py);
          ctx.lineTo(cx, cy);
          ctx.closePath();
          ctx.fill();

          // RIGHT Wedge
          ctx.fillStyle = getQColor(qVals.right);
          ctx.beginPath();
          ctx.moveTo(px + cellW, py);
          ctx.lineTo(px + cellW, py + cellH);
          ctx.lineTo(cx, cy);
          ctx.closePath();
          ctx.fill();

          // DOWN Wedge
          ctx.fillStyle = getQColor(qVals.down);
          ctx.beginPath();
          ctx.moveTo(px + cellW, py + cellH);
          ctx.lineTo(px, py + cellH);
          ctx.lineTo(cx, cy);
          ctx.closePath();
          ctx.fill();

          // LEFT Wedge
          ctx.fillStyle = getQColor(qVals.left);
          ctx.beginPath();
          ctx.moveTo(px, py + cellH);
          ctx.lineTo(px, py);
          ctx.lineTo(cx, cy);
          ctx.closePath();
          ctx.fill();
        }

        // Draw Optimal Policy Arrow (only for explored/evaluated states)
        const hasLearned = qVals.up !== 0 || qVals.right !== 0 || qVals.down !== 0 || qVals.left !== 0;

        if (cell.type !== "wall" && !isGoal && cell.type !== "pit" && (visMode === "policy" || visMode === "wedges") && hasLearned) {
          let bestA: Action = "right";
          let maxVal = -Infinity;
          for (const a of ACTIONS) {
            if (qVals[a] > maxVal) {
              maxVal = qVals[a];
              bestA = a;
            }
          }

          const arrowLen = Math.min(cellW, cellH) * 0.28;
          const isPositivePath = maxVal > 0;
          ctx.strokeStyle = isPositivePath ? "#34d399" : "rgba(255, 255, 255, 0.85)";
          ctx.fillStyle = isPositivePath ? "#34d399" : "rgba(255, 255, 255, 0.85)";
          ctx.lineWidth = 2.5;

          ctx.save();
          ctx.translate(cx, cy);
          if (bestA === "up") ctx.rotate(-Math.PI / 2);
          else if (bestA === "down") ctx.rotate(Math.PI / 2);
          else if (bestA === "left") ctx.rotate(Math.PI);

          ctx.beginPath();
          ctx.moveTo(-arrowLen, 0);
          ctx.lineTo(arrowLen, 0);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(arrowLen, 0);
          ctx.lineTo(arrowLen - 5, -4);
          ctx.lineTo(arrowLen - 5, 4);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // Cell Borders
        ctx.strokeStyle = isSelected
          ? "#a855f7"
          : isHovered
          ? "rgba(255, 255, 255, 0.4)"
          : "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = isSelected ? 2.5 : 1;
        ctx.strokeRect(px, py, cellW, cellH);

        // Cell Labels & Icons
        if (isStart) {
          ctx.fillStyle = "#38bdf8";
          ctx.font = "black 12px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("START", cx, cy);
        } else if (isGoal) {
          ctx.fillStyle = "#34d399";
          ctx.font = "black 12px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("GOAL", cx, cy - 6);
          ctx.font = "bold 9px monospace";
          ctx.fillText("+100", cx, cy + 8);
        } else if (cell.type === "pit") {
          ctx.fillStyle = "#f43f5e";
          ctx.font = "black 11px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("CLIFF", cx, cy - 6);
          ctx.font = "bold 9px monospace";
          ctx.fillText("-100", cx, cy + 8);
        }
      }
    }

    // 2. Draw Agent Holographic Orb
    const agentPx = agentPos.x * cellW + cellW / 2;
    const agentPy = agentPos.y * cellH + cellH / 2;
    const agentRadius = Math.min(cellW, cellH) * 0.32;

    // Glowing outer ring
    ctx.beginPath();
    ctx.arc(agentPx, agentPy, agentRadius * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(168, 85, 247, 0.35)";
    ctx.fill();

    // Solid core
    ctx.beginPath();
    ctx.arc(agentPx, agentPy, agentRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#a855f7";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Inner eye
    ctx.beginPath();
    ctx.arc(agentPx, agentPy, agentRadius * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.restore();
  }, [env, agentPos, visMode, hoveredCell, selectedCell, totalSteps]);

  // ── Episodic Return & Loss Chart Renderer ───────────────────────────────
  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas || rewardHistory.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let y = 15; y < height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const minR = -120;
    const maxR = 120;
    const range = maxR - minR;
    const stepX = width / Math.max(1, rewardHistory.length - 1);

    // Area Gradient Fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(168, 85, 247, 0.35)");
    gradient.addColorStop(1, "rgba(168, 85, 247, 0.0)");

    ctx.beginPath();
    for (let i = 0; i < rewardHistory.length; i++) {
      const lx = i * stepX;
      const normY = (rewardHistory[i] - minR) / range;
      const ly = height - normY * (height - 20) - 10;
      if (i === 0) ctx.moveTo(lx, ly);
      else ctx.lineTo(lx, ly);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Stroke line
    ctx.beginPath();
    ctx.strokeStyle = "#c084fc";
    ctx.lineWidth = 2.2;
    for (let i = 0; i < rewardHistory.length; i++) {
      const lx = i * stepX;
      const normY = (rewardHistory[i] - minR) / range;
      const ly = height - normY * (height - 20) - 10;
      if (i === 0) ctx.moveTo(lx, ly);
      else ctx.lineTo(lx, ly);
    }
    ctx.stroke();
  }, [rewardHistory]);

  // Handle Canvas Mouse Hover for Instant Inspection
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const cellW = rect.width / env.width;
    const cellH = rect.height / env.height;

    const gx = Math.floor(mx / cellW);
    const gy = Math.floor(my / cellH);

    if (gx >= 0 && gx < env.width && gy >= 0 && gy < env.height) {
      setHoveredCell({ x: gx, y: gy });
    }
  };

  // ── Fast-Forward Batch Episodes Runner ─────────────────────────────
  const trainBatchEpisodes = (count = 25) => {
    for (let e = 0; e < count; e++) {
      let isDone = false;
      let steps = 0;
      const maxSteps = env.width * env.height * 20;
      let curPos = env.start;
      let epRew = 0;
      const epTraj: { pos: Position; action: Action; reward: number; nextPos: Position }[] = [];

      while (!isDone && steps < maxSteps) {
        steps++;
        const curKey = posKey(curPos);
        const qVals = qTableRef.current.get(curKey) || { up: 0, right: 0, down: 0, left: 0 };
        const act = selectAction(curPos, epsilon);
        const { nextPos: next, hitWall } = getNextPosition(curPos, act);
        const nextCell = env.grid[next.y][next.x];
        const rew = hitWall ? -3 : nextCell.reward;
        epRew += rew;

        const reachedGoal = !hitWall && nextCell.type === "goal";
        const fellInPit = !hitWall && nextCell.type === "pit";
        const isTerminal = reachedGoal;

        const actualNext = fellInPit ? env.start : next;
        const actualNextKey = posKey(actualNext);
        const actualNextQ = qTableRef.current.get(actualNextKey) || { up: 0, right: 0, down: 0, left: 0 };

        epTraj.push({ pos: curPos, action: act, reward: rew, nextPos: actualNext });

        let target = rew;
        if (!isTerminal) {
          if (algorithm === "q_learning") {
            const maxQ = Math.max(actualNextQ.up, actualNextQ.right, actualNextQ.down, actualNextQ.left);
            target = rew + gamma * maxQ;
          } else {
            const nextAct = selectAction(actualNext, epsilon);
            target = rew + gamma * actualNextQ[nextAct];
          }
        }

        const curQ = qVals[act];
        qVals[act] = curQ + alpha * (target - curQ);
        qTableRef.current.set(curKey, qVals);

        if (isTerminal) {
          isDone = true;
          setSuccessCount((p) => p + 1);

          // Backward credit assignment along the route
          for (let i = epTraj.length - 1; i >= 0; i--) {
            const t = epTraj[i];
            const sKey = posKey(t.pos);
            const nsKey = posKey(t.nextPos);
            const sQ = qTableRef.current.get(sKey) || { up: 0, right: 0, down: 0, left: 0 };
            const nsQ = qTableRef.current.get(nsKey) || { up: 0, right: 0, down: 0, left: 0 };
            const maxN = Math.max(nsQ.up, nsQ.right, nsQ.down, nsQ.left);
            const td = t.reward + gamma * maxN - sQ[t.action];
            sQ[t.action] += alpha * td;
            qTableRef.current.set(sKey, sQ);
          }
        } else {
          curPos = actualNext;
        }
      }

      setEpsilon((prev) => Math.max(0.01, prev * epsilonDecay));
      setEpisode((p) => p + 1);
      setRewardHistory((prev) => {
        const nextHist = [...prev.slice(-45), epRew];
        const sum = nextHist.reduce((acc, v) => acc + v, 0);
        setMovingAvgReward(Math.round(sum / nextHist.length));
        return nextHist;
      });
    }

    agentPosRef.current = env.start;
    setAgentPos(env.start);
    completeExperiment();
    setMilestones((p) => ({ ...p, reachedGoal: true, convergedPolicy: true }));
  };

  // Instant Solve & Walk Path
  const instantSolveAndRun = () => {
    trainBatchEpisodes(50);
    setEpsilon(0.01); // Pure exploitation
    agentPosRef.current = env.start;
    setAgentPos(env.start);
    setIsRunning(true);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredCell) {
      setSelectedCell(hoveredCell);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-purple-500/20">
      {/* ── Top Premium Glass Header ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/computer-science/ai-problem"
            className="p-2 rounded-xl bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition cursor-pointer"
            title="Back to AI Problems"
          >
            <ArrowRight className="rotate-180" size={16} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-500 shadow-sm">
              <Compass size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-foreground">
                  Reinforcement Learning Studio: Q-Learning &amp; SARSA
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                  Bellman MDP Engine
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Interactive GridWorld, directional Q-wedges, optimal policy vector fields, and Bellman TD equations
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={instantSolveAndRun}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-sm shadow-emerald-500/25 cursor-pointer"
            title="Auto-learn optimal path and watch the agent navigate smoothly across the cliff"
          >
            <Sparkles size={14} />
            <span>Auto-Solve &amp; Walk</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
              isRunning
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25"
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25"
            }`}
          >
            {isRunning ? <Pause size={14} /> : <Play size={14} />}
            <span>{isRunning ? "Pause" : "Run Agent"}</span>
          </button>

          <button
            type="button"
            onClick={() => trainBatchEpisodes(25)}
            className="px-3 py-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-500/25 transition shadow-2xs cursor-pointer"
            title="Train 25 Episodes Instantly"
          >
            +25 Episodes
          </button>

          <button
            type="button"
            onClick={stepSimulation}
            disabled={isRunning}
            className="px-3 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted transition shadow-2xs cursor-pointer disabled:opacity-40"
            title="Step One Action"
          >
            Step
          </button>

          <button
            type="button"
            onClick={initQTable}
            className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-2xs cursor-pointer"
            title="Reset Environment & Q-Table"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </header>

      {/* ── Main Laboratory Container ── */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: "environment", label: "GridWorld Studio & Policy Vector Field", icon: Grid },
            { id: "qtable", label: "Q-Table State-Action Tensor Inspector", icon: Layers },
            { id: "theory", label: "Bellman Equations & TD Mathematical Formulary", icon: Calculator },
            { id: "diagnostics", label: "Temporal Difference Convergence & Telemetry", icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === "qtable") setMilestones((p) => ({ ...p, inspectedQTable: true }));
                  if (tab.id === "theory") setMilestones((p) => ({ ...p, analyzedBellman: true }));
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Hyperparameter & Strategy Bar ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 p-4 sm:p-5 bg-card border border-border rounded-3xl shadow-sm">
          {/* 1. Environment Preset */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Environment Map
            </label>
            <select
              value={preset}
              onChange={(e) => handlePresetChange(e.target.value as EnvironmentPreset)}
              className="w-full px-2.5 py-1.5 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="cliff_walking">Sutton Cliff Walking (4x8)</option>
              <option value="simple">Standard GridWorld (5x5)</option>
              <option value="obstacles">Obstacle Course (6x6)</option>
              <option value="frozen_lake">Frozen Lake (4x4)</option>
              <option value="complex">Deep Multi-Room Maze (7x7)</option>
            </select>
          </div>

          {/* 2. Algorithm */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              TD Algorithm
            </label>
            <select
              value={algorithm}
              onChange={(e) => {
                setAlgorithm(e.target.value as RLAlgorithm);
                if (e.target.value === "sarsa") setMilestones((p) => ({ ...p, testedSarsa: true }));
              }}
              className="w-full px-2.5 py-1.5 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="q_learning">Q-Learning (Off-Policy TD)</option>
              <option value="sarsa">SARSA (On-Policy TD)</option>
              <option value="expected_sarsa">Expected SARSA</option>
            </select>
          </div>

          {/* 3. Action Selection Policy */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Exploration Policy
            </label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as ExplorationStrategy)}
              className="w-full px-2.5 py-1.5 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="epsilon_greedy">ε-Greedy Exploration</option>
              <option value="boltzmann_softmax">Boltzmann Softmax (τ)</option>
            </select>
          </div>

          {/* 4. Learning Rate Alpha (α) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <span>Learning Rate (α)</span>
              <span className="font-mono text-foreground font-bold">{alpha}</span>
            </div>
            <input
              type="range"
              min={0.01}
              max={0.5}
              step={0.01}
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* 5. Discount Factor Gamma (γ) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <span>Discount Factor (γ)</span>
              <span className="font-mono text-foreground font-bold">{gamma}</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={0.99}
              step={0.01}
              value={gamma}
              onChange={(e) => setGamma(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* 6. Exploration Rate Epsilon (ε) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <span>Exploration (ε)</span>
              <span className="font-mono text-foreground font-bold">{epsilon.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.01}
              max={0.8}
              step={0.02}
              value={epsilon}
              onChange={(e) => setEpsilon(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </section>

        {/* ── TAB 1: GridWorld Studio ── */}
        {activeTab === "environment" && (
          <div className="space-y-6">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: High-DPI GridWorld Canvas (7 Cols) */}
              <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        {PRESET_MAPS[preset].name}
                      </h3>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {PRESET_MAPS[preset].subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Visualization Mode Switcher */}
                  <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border">
                    {[
                      { id: "wedges", label: "Q-Wedges" },
                      { id: "policy", label: "Policy π*" },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setVisMode(mode.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          visMode === mode.id
                            ? "bg-card text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* High-DPI Retina Canvas */}
                <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border border-border flex items-center justify-center">
                  <canvas
                    ref={gridCanvasRef}
                    width={560}
                    height={350}
                    onMouseMove={handleCanvasMouseMove}
                    onClick={handleCanvasClick}
                    className="w-full h-full object-contain cursor-crosshair"
                  />
                </div>

                {/* Speed Controls & Step Status */}
                <div className="flex items-center justify-between gap-3 p-3 bg-muted/30 border border-border rounded-2xl flex-wrap">
                  <div className="flex items-center gap-2">
                    <FastForward size={14} className="text-purple-500" />
                    <span className="text-xs font-bold text-foreground">Speed:</span>
                    <button
                      type="button"
                      onClick={() => setSpeedMs(120)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold cursor-pointer ${
                        speedMs === 120 ? "bg-purple-600 text-white" : "bg-card text-muted-foreground"
                      }`}
                    >
                      Slow
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpeedMs(35)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold cursor-pointer ${
                        speedMs === 35 ? "bg-purple-600 text-white" : "bg-card text-muted-foreground"
                      }`}
                    >
                      Fast
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpeedMs(5)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold cursor-pointer ${
                        speedMs === 5 ? "bg-purple-600 text-white" : "bg-card text-muted-foreground"
                      }`}
                    >
                      Hyper
                    </button>
                  </div>

                  <span className="text-xs font-mono text-muted-foreground">
                    Total Steps: <strong className="text-foreground">{totalSteps}</strong>
                  </span>
                </div>
              </div>

              {/* Right: Live Telemetry, Return Curves & Inspector (5 Cols) */}
              <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-indigo-500" />
                    <h3 className="text-sm font-bold text-foreground">
                      Episodic Return &amp; Value Convergence
                    </h3>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Episode #{episode}
                  </span>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/40 border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      {"Episode Return G_t"}
                    </span>
                    <span
                      className={`text-lg font-black font-mono mt-0.5 block ${
                        episodeReward > 0 ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {episodeReward}
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      Moving Avg Return
                    </span>
                    <span className="text-lg font-black font-mono text-purple-400 mt-0.5 block">
                      {movingAvgReward}
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      Success Goals
                    </span>
                    <span className="text-lg font-black font-mono text-emerald-500 mt-0.5 block">
                      {successCount}
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      {"TD Error δ_t"}
                    </span>
                    <span className="text-lg font-black font-mono text-amber-500 mt-0.5 block">
                      {lastTDError.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Real-time Return History Canvas */}
                <div className="p-3.5 bg-muted/20 border border-border rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                    <span>Learning Curve (Episodic Return)</span>
                    <span className="font-mono text-purple-400">Last 45 Episodes</span>
                  </div>
                  <div className="w-full h-24 bg-slate-950 rounded-xl overflow-hidden border border-border">
                    <canvas ref={chartCanvasRef} width={340} height={96} className="w-full h-full" />
                  </div>
                </div>

                {/* Interactive State Hover Inspector */}
                <div className="p-3.5 bg-purple-500/10 border border-purple-500/20 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      {`State Inspector: S = (${hoveredCell ? `${hoveredCell.x}, ${hoveredCell.y}` : `${agentPos.x}, ${agentPos.y}`})`}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      Visits: {visitCountsRef.current.get(`${hoveredCell ? hoveredCell.x : agentPos.x},${hoveredCell ? hoveredCell.y : agentPos.y}`) || 0}
                    </span>
                  </div>

                  {(() => {
                    const inspectX = hoveredCell ? hoveredCell.x : agentPos.x;
                    const inspectY = hoveredCell ? hoveredCell.y : agentPos.y;
                    const q = qTableRef.current.get(`${inspectX},${inspectY}`) || { up: 0, right: 0, down: 0, left: 0 };
                    return (
                      <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-xs pt-0.5">
                        <div className="p-1.5 bg-card rounded-xl border border-border">
                          <span className="text-[8px] text-muted-foreground block font-sans font-bold">UP</span>
                          <span className={`font-bold ${q.up > 0 ? "text-emerald-400" : q.up < 0 ? "text-rose-400" : "text-foreground"}`}>
                            {q.up.toFixed(1)}
                          </span>
                        </div>
                        <div className="p-1.5 bg-card rounded-xl border border-border">
                          <span className="text-[8px] text-muted-foreground block font-sans font-bold">RIGHT</span>
                          <span className={`font-bold ${q.right > 0 ? "text-emerald-400" : q.right < 0 ? "text-rose-400" : "text-foreground"}`}>
                            {q.right.toFixed(1)}
                          </span>
                        </div>
                        <div className="p-1.5 bg-card rounded-xl border border-border">
                          <span className="text-[8px] text-muted-foreground block font-sans font-bold">DOWN</span>
                          <span className={`font-bold ${q.down > 0 ? "text-emerald-400" : q.down < 0 ? "text-rose-400" : "text-foreground"}`}>
                            {q.down.toFixed(1)}
                          </span>
                        </div>
                        <div className="p-1.5 bg-card rounded-xl border border-border">
                          <span className="text-[8px] text-muted-foreground block font-sans font-bold">LEFT</span>
                          <span className={`font-bold ${q.left > 0 ? "text-emerald-400" : q.left < 0 ? "text-rose-400" : "text-foreground"}`}>
                            {q.left.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── TAB 2: Q-Table State-Action Tensor Inspector ── */}
        {activeTab === "qtable" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
              <div>
                <h3 className="text-base font-black text-foreground">
                  Q-Table State-Action Tensor Q(s, a)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Complete discrete value function matrix mapping each Cartesian state coordinate (x, y) to 4 cardinal actions.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-purple-500">
                States: {env.width * env.height} &times; Actions: 4 = {env.width * env.height * 4} Parameters
              </span>
            </div>

            <div className="overflow-x-auto p-4 bg-slate-950 rounded-2xl border border-border max-h-96">
              <table className="w-full text-center font-mono text-xs text-slate-200">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground text-[10px] font-black uppercase">
                    <th className="p-2 text-left">Coordinate State (x, y)</th>
                    <th className="p-2">Cell Type</th>
                    <th className="p-2">Q(s, UP)</th>
                    <th className="p-2">Q(s, RIGHT)</th>
                    <th className="p-2">Q(s, DOWN)</th>
                    <th className="p-2">Q(s, LEFT)</th>
                    <th className="p-2 text-purple-400">{"Optimal Action π*(s)"}</th>
                    <th className="p-2 text-emerald-400">{"Value V(s) = max_a Q"}</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(qTableRef.current.entries()).map(([key, q]) => {
                    const [x, y] = key.split(",").map(Number);
                    const cell = env.grid[y][x];
                    let bestA: Action = "right";
                    let maxV = -Infinity;
                    for (const a of ACTIONS) {
                      if (q[a] > maxV) {
                        maxV = q[a];
                        bestA = a;
                      }
                    }

                    return (
                      <tr key={key} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="p-2 text-left font-bold text-slate-400">({x}, {y})</td>
                        <td className="p-2 text-[10px] text-muted-foreground uppercase">{cell.type}</td>
                        <td className={`p-2 font-bold ${q.up > 0 ? "text-emerald-400" : q.up < 0 ? "text-rose-400" : "text-slate-500"}`}>
                          {q.up.toFixed(2)}
                        </td>
                        <td className={`p-2 font-bold ${q.right > 0 ? "text-emerald-400" : q.right < 0 ? "text-rose-400" : "text-slate-500"}`}>
                          {q.right.toFixed(2)}
                        </td>
                        <td className={`p-2 font-bold ${q.down > 0 ? "text-emerald-400" : q.down < 0 ? "text-rose-400" : "text-slate-500"}`}>
                          {q.down.toFixed(2)}
                        </td>
                        <td className={`p-2 font-bold ${q.left > 0 ? "text-emerald-400" : q.left < 0 ? "text-rose-400" : "text-slate-500"}`}>
                          {q.left.toFixed(2)}
                        </td>
                        <td className="p-2 font-black text-purple-400 uppercase">{bestA}</td>
                        <td className="p-2 font-black text-emerald-400">{maxV.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── TAB 3: Bellman Equations & TD Theory ── */}
        {activeTab === "theory" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-foreground">
                Mathematical Foundations: Markov Decision Processes &amp; Temporal Difference Control
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Formal mathematical equations and update rules for Temporal Difference Reinforcement Learning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Bellman Optimality Equation */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                  <Calculator size={16} />
                  <span>1. Bellman Optimality Equation for Q*(s, a)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-cyan-300 space-y-1.5 border border-border">
                  <div>{"Q*(s, a) = R(s, a) + γ ∑ P(s'|s, a) max_{a'} Q*(s', a')"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {"In model-free reinforcement learning, the agent does not know the transition probabilities P(s'|s, a) and must learn via sampled experience."}
                </p>
              </div>

              {/* 2. Q-Learning TD Update */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                  <RotateCcw size={16} />
                  <span>2. Q-Learning (Off-Policy TD Control)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-emerald-300 space-y-1.5 border border-border">
                  <div>{"Q(S_t, A_t) ← Q(S_t, A_t) + α [ R_{t+1} + γ max_a Q(S_{t+1}, a) - Q(S_t, A_t) ]"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {"Q-Learning directly estimates Q* regardless of the action policy being followed (Off-policy), leading to aggressive greedy trajectories."}
                </p>
              </div>

              {/* 3. SARSA On-Policy Update */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                  <Zap size={16} />
                  <span>3. SARSA (On-Policy TD Control)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-amber-300 space-y-1.5 border border-border">
                  <div>{"Q(S_t, A_t) ← Q(S_t, A_t) + α [ R_{t+1} + γ Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t) ]"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {"SARSA updates using the action A_{t+1} actually selected by the exploration policy π, making it safer near dangerous cliff boundaries."}
                </p>
              </div>

              {/* 4. Action Selection Policies */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  <Compass size={16} />
                  <span>4. Exploration vs. Exploitation Policies</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-indigo-300 space-y-1.5 border border-border">
                  <div>{"π(a|s) = 1 - ε + (ε / |A|)  if a = argmax Q(s, a)"}</div>
                  <div>{"π(a|s) = exp(Q(s, a) / τ) / ∑ exp(Q(s, b) / τ)"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {"Balances greedy exploitation of known rewards with random or temperature-weighted exploration of unvisited states."}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── TAB 4: TD Error Diagnostics ── */}
        {activeTab === "diagnostics" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-black text-foreground">
                Convergence Diagnostics &amp; Learning Stability
              </h3>
              <p className="text-xs text-muted-foreground">
                Observe episodic reward curves, step efficiency, and Robbins-Monro convergence conditions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Current Epsilon (ε)</span>
                <span className="text-2xl font-black font-mono text-purple-500">{epsilon.toFixed(3)}</span>
                <p className="text-[10px] text-muted-foreground">
                  Decaying exploration rate drives the policy from stochastic exploration towards greedy optimality.
                </p>
              </div>

              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Active Algorithm</span>
                <span className="text-2xl font-black font-mono text-indigo-500 uppercase">{algorithm.replace("_", " ")}</span>
                <p className="text-[10px] text-muted-foreground">
                  {algorithm === "q_learning"
                    ? "Off-policy: Targets max Q(s', a') regardless of exploratory actions."
                    : "On-policy: Accounts for exploratory stochasticity in next state."}
                </p>
              </div>

              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Total Episodes</span>
                <span className="text-2xl font-black font-mono text-emerald-500">{episode}</span>
                <p className="text-[10px] text-muted-foreground">
                  {successCount > 0
                    ? `Success Rate: ${Math.round((successCount / Math.max(1, episode)) * 100)}%`
                    : "Agent is currently exploring the state space."}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── Student Mastery Milestones ── */}
        <section className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-amber-500" />
              <h4 className="text-sm font-bold text-foreground">
                Reinforcement Learning Mastery Objectives
              </h4>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-500">+50 XP Per Milestone</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                id: "reachedGoal",
                label: "Find First Optimal Goal Route",
                desc: "Discover the terminal goal state (+100) and propagate first positive Bellman credit.",
                done: milestones.reachedGoal,
              },
              {
                id: "convergedPolicy",
                label: "Attain Policy Convergence (10+ Goals)",
                desc: "Stabilize the value function Q(s, a) such that the agent consistently chooses optimal paths.",
                done: milestones.convergedPolicy,
              },
              {
                id: "testedSarsa",
                label: "Evaluate On-Policy SARSA vs. Q-Learning",
                desc: "Test how SARSA takes a safer route further from the cliff compared to risky optimal Q-Learning.",
                done: milestones.testedSarsa,
              },
              {
                id: "analyzedBellman",
                label: "Study Bellman Optimality Formulary",
                desc: "Inspect formal dynamic programming and TD error mathematical equations.",
                done: milestones.analyzedBellman,
              },
              {
                id: "inspectedQTable",
                label: "Inspect Discrete Q-Table Matrix",
                desc: "Analyze the state-action value table for every (x, y) coordinate.",
                done: milestones.inspectedQTable,
              },
            ].map((m) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-2xl border transition ${
                  m.done
                    ? "bg-emerald-500/10 border-emerald-500/30 text-foreground"
                    : "bg-muted/30 border-border text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2
                    size={14}
                    className={m.done ? "text-emerald-500" : "text-muted-foreground/40"}
                  />
                  <span className={m.done ? "text-emerald-600 dark:text-emerald-400" : ""}>
                    {m.label}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Floating Daily Challenge Integration */}
        <DailyChallengeCard
          labId="computer-science/ai-problem/maze-qlearn"
          currentParams={{
            episode,
            successCount,
            alpha,
            gamma,
            epsilon,
            algorithm,
            strategy,
            preset,
          }}
        />
      </main>
    </div>
  );
}
