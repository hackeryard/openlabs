"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import NextLabModal from "@/app/components/NextLabModal";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Shuffle,
  Volume2,
  VolumeX,
  Compass,
  Sliders,
  Award,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Activity,
  Code2,
  Split,
  ChevronRight,
  Maximize2,
  Flame,
  Info,
  Square,
  Droplets,
  Trees,
  Eraser,
  Target,
  Navigation,
  Eye,
  Settings2,
  Gauge,
  Smartphone,
  Monitor,
  Tablet,
  Check,
  RefreshCw,
} from "lucide-react";

// ─── TYPES & DATA STRUCTURES ─────────────────────────────────────────────────

export type AlgorithmType =
  | "astar"
  | "dijkstra"
  | "greedy_bfs"
  | "bfs"
  | "dfs";

export type HeuristicType = "manhattan" | "euclidean" | "chebyshev" | "octile";

export type ToolMode = "wall" | "mud" | "water" | "eraser" | "inspect";

export type CellType = "empty" | "wall" | "mud" | "water";

export type GridPreset = "compact" | "studio" | "expansive";

export interface CellNode {
  row: number;
  col: number;
  type: CellType;
  weight: number; // empty=1, mud=5, water=10, wall=Infinity
  gCost: number; // cost from start
  hCost: number; // heuristic cost to target
  fCost: number; // g + h
  isVisited: boolean;
  isOpen: boolean;
  isPath: boolean;
  parentRow: number | null;
  parentCol: number | null;
}

export interface SearchStats {
  pathLength: number;
  totalCost: number;
  nodesVisited: number;
  openSetSize: number;
  executionTimeMs: number;
  found: boolean;
}

export interface GuidedChallenge {
  id: string;
  title: string;
  objective: string;
  recommendedAlgo: AlgorithmType;
  recommendedHeuristic: HeuristicType;
  mazePreset: "swamp_pass" | "concave_trap" | "recursive_maze" | "chokepoint";
  targetMaxVisited: number;
  description: string;
}

export const GUIDED_CHALLENGES: GuidedChallenge[] = [
  {
    id: "ch_swamp",
    title: "Challenge 1: The Muddy Detour",
    objective: "Route intelligently through low-cost road without sinking into the high-cost swamp.",
    recommendedAlgo: "astar",
    recommendedHeuristic: "manhattan",
    mazePreset: "swamp_pass",
    targetMaxVisited: 160,
    description: "Notice how A* balances taking a slightly longer geometric path to bypass high-cost mud tiles (weight 5).",
  },
  {
    id: "ch_concave",
    title: "Challenge 2: Escaping the Concave Trap",
    objective: "Compare how Greedy Best-First gets trapped in a U-shape while A* escapes cleanly.",
    recommendedAlgo: "astar",
    recommendedHeuristic: "euclidean",
    mazePreset: "concave_trap",
    targetMaxVisited: 190,
    description: "Greedy BFS charges directly toward the goal and fills the dead-end chamber. A* balances g(n) to find the exit path.",
  },
  {
    id: "ch_maze",
    title: "Challenge 3: Labyrinth Navigation",
    objective: "Solve a recursive division labyrinth exploring under 280 nodes.",
    recommendedAlgo: "astar",
    recommendedHeuristic: "manhattan",
    mazePreset: "recursive_maze",
    targetMaxVisited: 280,
    description: "Test the admissible Manhattan heuristic against branching corridors and dead ends.",
  },
];

// Grid dimensions presets
const GRID_PRESETS: Record<GridPreset, { rows: number; cols: number; label: string; icon: typeof Smartphone }> = {
  compact: { rows: 15, cols: 21, label: "Mobile Fit (21×15)", icon: Smartphone },
  studio: { rows: 17, cols: 29, label: "Studio (29×17)", icon: Tablet },
  expansive: { rows: 21, cols: 39, label: "Expansive (39×21)", icon: Monitor },
};

export default function AStarPathfindingLab() {
  // ─── OPENLABS HOOKS ──────────────────────────────────────────────────────────
  const {
    completeExperiment,
    xpResult,
    nextLabProgression,
    showNextLabModal,
    setShowNextLabModal,
  } = useLab("computer-science/dsa/pathfinding-astar", "computerScience", "simulation");

  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "A* Pathfinding & Heuristic Search Visualizer",
      theory:
        "A* Search evaluates f(n) = g(n) + h(n), where g(n) is the exact cost from start to n, and h(n) is an admissible heuristic estimate to the goal. It combines Dijkstra's optimality with Greedy Best-First speed.",
      extraContext:
        "Interactive responsive grid supporting A*, Dijkstra, Greedy BFS, BFS, DFS, weighted terrain (mud, water), procedural mazes, touch painting, and dynamic endpoint dragging.",
    });
  }, [setExperimentData]);

  // ─── STATE ──────────────────────────────────────────────────────────────────
  const [gridPreset, setGridPreset] = useState<GridPreset>("studio");
  const [rows, setRows] = useState(GRID_PRESETS.studio.rows);
  const [cols, setCols] = useState(GRID_PRESETS.studio.cols);

  // Endpoints
  const [startPos, setStartPos] = useState<[number, number]>([8, 3]);
  const [targetPos, setTargetPos] = useState<[number, number]>([8, 25]);
  const [draggingPin, setDraggingPin] = useState<"start" | "target" | null>(null);

  // Settings
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("astar");
  const [heuristic, setHeuristic] = useState<HeuristicType>("manhattan");
  const [heuristicWeight, setHeuristicWeight] = useState<number>(1.0);
  const [allowDiagonal, setAllowDiagonal] = useState<boolean>(false);
  const [activeTool, setActiveTool] = useState<ToolMode>("wall");
  const [speed, setSpeed] = useState<number>(25); // ms per tick
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Split-screen comparison mode
  const [compareAlgo, setCompareAlgo] = useState<AlgorithmType>("dijkstra");

  // Active Challenge
  const [activeChallenge, setActiveChallenge] = useState<GuidedChallenge | null>(null);

  // Tabbed sub-navigation on smaller viewports
  const [activeTab, setActiveTab] = useState<"visualizer" | "benchmarks" | "challenges">("visualizer");

  // Grid Data Structure
  const [grid, setGrid] = useState<CellNode[][]>(() => createInitialGrid(rows, cols, [8, 3], [8, 25]));
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  // Execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSolved, setIsSolved] = useState<boolean>(false);

  // Telemetry & Stats
  const [stats, setStats] = useState<SearchStats>({
    pathLength: 0,
    totalCost: 0,
    nodesVisited: 0,
    openSetSize: 0,
    executionTimeMs: 0,
    found: false,
  });

  const [compareStats, setCompareStats] = useState<SearchStats | null>(null);

  // Hover node tooltip / touch inspect
  const [hoveredNode, setHoveredNode] = useState<CellNode | null>(null);

  // Audio Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Grid DOM ref for touch calculations
  const gridContainerRef = useRef<HTMLDivElement | null>(null);

  // Animation Refs
  const cancelExecutionRef = useRef<boolean>(false);
  const pauseExecutionRef = useRef<boolean>(false);

  // Auto-detect mobile screen on mount for initial grid preset
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) {
        switchGridPreset("compact");
      } else if (window.innerWidth >= 1280) {
        switchGridPreset("expansive");
      }
    }
  }, []);

  // Initialize Audio Context on user interaction
  const playNodeBeep = useCallback(
    (frequency: number) => {
      if (!soundEnabled) return;
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new AudioContextClass();
        }
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(Math.min(1400, Math.max(160, frequency)), ctx.currentTime);

        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.045);
      } catch {
        // audio context suppressed or unsupported
      }
    },
    [soundEnabled]
  );

  const playVictoryChord = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const notes = [440, 554.37, 659.25, 880]; // A-major arpeggio
      notes.forEach((freq, idx) => {
        setTimeout(() => playNodeBeep(freq), idx * 80);
      });
    } catch {
      // suppressed
    }
  }, [soundEnabled, playNodeBeep]);

  // ─── GRID GENERATION & MANAGEMENT ──────────────────────────────────────────

  function createInitialGrid(
    numRows: number,
    numCols: number,
    start: [number, number],
    target: [number, number]
  ): CellNode[][] {
    const newGrid: CellNode[][] = [];
    for (let r = 0; r < numRows; r++) {
      const rowArr: CellNode[] = [];
      for (let c = 0; c < numCols; c++) {
        rowArr.push({
          row: r,
          col: c,
          type: "empty",
          weight: 1,
          gCost: r === start[0] && c === start[1] ? 0 : Infinity,
          hCost: 0,
          fCost: Infinity,
          isVisited: false,
          isOpen: false,
          isPath: false,
          parentRow: null,
          parentCol: null,
        });
      }
      newGrid.push(rowArr);
    }
    return newGrid;
  }

  // Switch Grid Preset dynamically
  const switchGridPreset = (preset: GridPreset) => {
    cancelExecutionRef.current = true;
    setIsRunning(false);
    setIsPaused(false);
    setIsSolved(false);

    const config = GRID_PRESETS[preset];
    const newRows = config.rows;
    const newCols = config.cols;

    const newStart: [number, number] = [Math.floor(newRows / 2), 2];
    const newTarget: [number, number] = [Math.floor(newRows / 2), newCols - 3];

    setGridPreset(preset);
    setRows(newRows);
    setCols(newCols);
    setStartPos(newStart);
    setTargetPos(newTarget);
    setHoveredNode(null);

    setGrid(createInitialGrid(newRows, newCols, newStart, newTarget));
    setStats({
      pathLength: 0,
      totalCost: 0,
      nodesVisited: 0,
      openSetSize: 0,
      executionTimeMs: 0,
      found: false,
    });
    setCompareStats(null);
  };

  // Clear visual exploration (keeps walls and weights)
  const clearSearchVisuals = useCallback(() => {
    cancelExecutionRef.current = true;
    setIsRunning(false);
    setIsPaused(false);
    setIsSolved(false);

    setGrid((prev) =>
      prev.map((row) =>
        row.map((cell) => ({
          ...cell,
          gCost: cell.row === startPos[0] && cell.col === startPos[1] ? 0 : Infinity,
          hCost: 0,
          fCost: Infinity,
          isVisited: false,
          isOpen: false,
          isPath: false,
          parentRow: null,
          parentCol: null,
        }))
      )
    );

    setStats({
      pathLength: 0,
      totalCost: 0,
      nodesVisited: 0,
      openSetSize: 0,
      executionTimeMs: 0,
      found: false,
    });
    setCompareStats(null);
  }, [startPos]);

  // Clear walls, weights and paths
  const clearAllGrid = useCallback(() => {
    cancelExecutionRef.current = true;
    setIsRunning(false);
    setIsPaused(false);
    setIsSolved(false);

    setGrid(createInitialGrid(rows, cols, startPos, targetPos));
    setStats({
      pathLength: 0,
      totalCost: 0,
      nodesVisited: 0,
      openSetSize: 0,
      executionTimeMs: 0,
      found: false,
    });
    setCompareStats(null);
  }, [rows, cols, startPos, targetPos]);

  // ─── HEURISTIC CALCULATIONS ────────────────────────────────────────────────

  const calculateHeuristic = useCallback(
    (r1: number, c1: number, r2: number, c2: number): number => {
      const dr = Math.abs(r1 - r2);
      const dc = Math.abs(c1 - c2);

      switch (heuristic) {
        case "euclidean":
          return Math.sqrt(dr * dr + dc * dc);
        case "chebyshev":
          return Math.max(dr, dc);
        case "octile":
          return Math.min(dr, dc) * Math.SQRT2 + Math.abs(dr - dc);
        case "manhattan":
        default:
          return dr + dc;
      }
    },
    [heuristic]
  );

  // ─── PROCEDURAL MAZE GENERATORS ────────────────────────────────────────────

  const generateRecursiveDivisionMaze = useCallback(() => {
    clearAllGrid();
    const newGrid = createInitialGrid(rows, cols, startPos, targetPos);

    // Border walls
    for (let r = 0; r < rows; r++) {
      newGrid[r][0].type = "wall";
      newGrid[r][0].weight = Infinity;
      newGrid[r][cols - 1].type = "wall";
      newGrid[r][cols - 1].weight = Infinity;
    }
    for (let c = 0; c < cols; c++) {
      newGrid[0][c].type = "wall";
      newGrid[0][c].weight = Infinity;
      newGrid[rows - 1][c].type = "wall";
      newGrid[rows - 1][c].weight = Infinity;
    }

    function addInnerWalls(minR: number, maxR: number, minC: number, maxC: number) {
      const width = maxC - minC;
      const height = maxR - minR;

      if (width < 3 || height < 3) return;

      const isHorizontal = height > width;

      if (isHorizontal) {
        const wallR = Math.floor(Math.random() * (height - 2)) + minR + 1;
        const passageC = Math.floor(Math.random() * (width - 1)) + minC;

        for (let c = minC; c <= maxC; c++) {
          if (c !== passageC) {
            if (
              (wallR === startPos[0] && c === startPos[1]) ||
              (wallR === targetPos[0] && c === targetPos[1])
            ) {
              continue;
            }
            newGrid[wallR][c].type = "wall";
            newGrid[wallR][c].weight = Infinity;
          }
        }

        addInnerWalls(minR, wallR - 1, minC, maxC);
        addInnerWalls(wallR + 1, maxR, minC, maxC);
      } else {
        const wallC = Math.floor(Math.random() * (width - 2)) + minC + 1;
        const passageR = Math.floor(Math.random() * (height - 1)) + minR;

        for (let r = minR; r <= maxR; r++) {
          if (r !== passageR) {
            if (
              (r === startPos[0] && wallC === startPos[1]) ||
              (r === targetPos[0] && wallC === targetPos[1])
            ) {
              continue;
            }
            newGrid[r][wallC].type = "wall";
            newGrid[r][wallC].weight = Infinity;
          }
        }

        addInnerWalls(minR, maxR, minC, wallC - 1);
        addInnerWalls(minR, maxR, wallC + 1, maxC);
      }
    }

    addInnerWalls(1, rows - 2, 1, cols - 2);

    // Safeguard endpoints
    newGrid[startPos[0]][startPos[1]].type = "empty";
    newGrid[startPos[0]][startPos[1]].weight = 1;
    newGrid[targetPos[0]][targetPos[1]].type = "empty";
    newGrid[targetPos[0]][targetPos[1]].weight = 1;

    setGrid(newGrid);
  }, [rows, cols, startPos, targetPos, clearAllGrid]);

  const generateRandomScatterMaze = useCallback(
    (density: number) => {
      clearAllGrid();
      const newGrid = createInitialGrid(rows, cols, startPos, targetPos);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (
            (r === startPos[0] && c === startPos[1]) ||
            (r === targetPos[0] && c === targetPos[1])
          ) {
            continue;
          }
          if (Math.random() < density) {
            const randType = Math.random();
            if (randType < 0.7) {
              newGrid[r][c].type = "wall";
              newGrid[r][c].weight = Infinity;
            } else if (randType < 0.88) {
              newGrid[r][c].type = "mud";
              newGrid[r][c].weight = 5;
            } else {
              newGrid[r][c].type = "water";
              newGrid[r][c].weight = 10;
            }
          }
        }
      }
      setGrid(newGrid);
    },
    [rows, cols, startPos, targetPos, clearAllGrid]
  );

  const generatePresetMaze = useCallback(
    (preset: "swamp_pass" | "concave_trap" | "recursive_maze" | "chokepoint") => {
      if (preset === "recursive_maze") {
        generateRecursiveDivisionMaze();
        return;
      }

      clearAllGrid();
      const newGrid = createInitialGrid(rows, cols, startPos, targetPos);

      if (preset === "swamp_pass") {
        const midCol = Math.floor(cols / 2);
        const radius = Math.min(5, Math.floor(cols / 5));
        for (let r = 0; r < rows; r++) {
          for (let c = midCol - radius; c <= midCol + radius; c++) {
            if (r > 2 && r < rows - 3) {
              newGrid[r][c].type = "mud";
              newGrid[r][c].weight = 5;
            }
          }
        }
        for (let r = 4; r < rows - 5; r++) {
          for (let c = midCol - 1; c <= midCol + 1; c++) {
            newGrid[r][c].type = "water";
            newGrid[r][c].weight = 10;
          }
        }
        for (let c = midCol - radius; c <= midCol + radius; c++) {
          newGrid[1][c].type = "empty";
          newGrid[1][c].weight = 1;
          newGrid[rows - 2][c].type = "empty";
          newGrid[rows - 2][c].weight = 1;
        }
      } else if (preset === "concave_trap") {
        const centerR = targetPos[0];
        const centerC = Math.max(1, targetPos[1] - Math.min(6, Math.floor(cols / 4)));
        const armLength = Math.min(4, Math.floor(rows / 3));

        for (let r = Math.max(0, centerR - armLength); r <= Math.min(rows - 1, centerR + armLength); r++) {
          newGrid[r][centerC].type = "wall";
          newGrid[r][centerC].weight = Infinity;
        }
        for (let c = centerC; c <= Math.min(cols - 1, centerC + 6); c++) {
          if (centerR - armLength >= 0) {
            newGrid[centerR - armLength][c].type = "wall";
            newGrid[centerR - armLength][c].weight = Infinity;
          }
          if (centerR + armLength < rows) {
            newGrid[centerR + armLength][c].type = "wall";
            newGrid[centerR + armLength][c].weight = Infinity;
          }
        }
      } else if (preset === "chokepoint") {
        const midC = Math.floor(cols / 2);
        const passRow = Math.floor(rows / 2);
        for (let r = 0; r < rows; r++) {
          if (r !== passRow) {
            newGrid[r][midC].type = "wall";
            newGrid[r][midC].weight = Infinity;
          }
        }
      }

      setGrid(newGrid);
    },
    [rows, cols, startPos, targetPos, clearAllGrid, generateRecursiveDivisionMaze]
  );

  // ─── TILE EDITING (PAINTING & ERASING) ──────────────────────────────────────

  const handleTileAction = (r: number, c: number) => {
    if (
      (r === startPos[0] && c === startPos[1]) ||
      (r === targetPos[0] && c === targetPos[1])
    ) {
      return;
    }

    if (activeTool === "inspect") {
      setHoveredNode(grid[r][c]);
      return;
    }

    setGrid((prev) => {
      const next = prev.map((rowArr) => rowArr.map((cell) => ({ ...cell })));
      const cell = next[r][c];

      if (activeTool === "wall") {
        cell.type = cell.type === "wall" ? "empty" : "wall";
        cell.weight = cell.type === "wall" ? Infinity : 1;
      } else if (activeTool === "mud") {
        cell.type = cell.type === "mud" ? "empty" : "mud";
        cell.weight = cell.type === "mud" ? 5 : 1;
      } else if (activeTool === "water") {
        cell.type = cell.type === "water" ? "empty" : "water";
        cell.weight = cell.type === "water" ? 10 : 1;
      } else if (activeTool === "eraser") {
        cell.type = "empty";
        cell.weight = 1;
      }

      return next;
    });
  };

  const handleMouseDown = (r: number, c: number) => {
    setIsMouseDown(true);
    setHoveredNode(grid[r][c]);

    if (r === startPos[0] && c === startPos[1]) {
      setDraggingPin("start");
      return;
    }
    if (r === targetPos[0] && c === targetPos[1]) {
      setDraggingPin("target");
      return;
    }
    handleTileAction(r, c);
  };

  const handleMouseEnter = (r: number, c: number) => {
    setHoveredNode(grid[r][c]);

    if (!isMouseDown) return;

    if (draggingPin === "start") {
      if (grid[r][c].type !== "wall" && !(r === targetPos[0] && c === targetPos[1])) {
        setStartPos([r, c]);
        if (isSolved) {
          executeInstantSearch(algorithm, [r, c], targetPos);
        }
      }
      return;
    }

    if (draggingPin === "target") {
      if (grid[r][c].type !== "wall" && !(r === startPos[0] && c === startPos[1])) {
        setTargetPos([r, c]);
        if (isSolved) {
          executeInstantSearch(algorithm, startPos, [r, c]);
        }
      }
      return;
    }

    handleTileAction(r, c);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setDraggingPin(null);
  };

  // ─── TOUCH EVENT HANDLERS (FOR MOBILE & TABLET ERGONOMICS) ──────────────────

  const getCoordinatesFromTouch = (touch: React.Touch) => {
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!el) return null;
    const tileEl = el.closest("[data-cell-row]") as HTMLElement | null;
    if (!tileEl) return null;
    const r = parseInt(tileEl.dataset.cellRow || "", 10);
    const c = parseInt(tileEl.dataset.cellCol || "", 10);
    if (isNaN(r) || isNaN(c)) return null;
    return [r, c] as [number, number];
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const coords = getCoordinatesFromTouch(e.touches[0]);
    if (!coords) return;
    const [r, c] = coords;
    setIsMouseDown(true);
    setHoveredNode(grid[r][c]);

    if (r === startPos[0] && c === startPos[1]) {
      setDraggingPin("start");
      return;
    }
    if (r === targetPos[0] && c === targetPos[1]) {
      setDraggingPin("target");
      return;
    }
    handleTileAction(r, c);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMouseDown || e.touches.length !== 1) return;
    const coords = getCoordinatesFromTouch(e.touches[0]);
    if (!coords) return;
    const [r, c] = coords;

    setHoveredNode(grid[r][c]);

    if (draggingPin === "start") {
      if (grid[r][c].type !== "wall" && !(r === targetPos[0] && c === targetPos[1])) {
        setStartPos([r, c]);
        if (isSolved) {
          executeInstantSearch(algorithm, [r, c], targetPos);
        }
      }
      return;
    }

    if (draggingPin === "target") {
      if (grid[r][c].type !== "wall" && !(r === startPos[0] && c === startPos[1])) {
        setTargetPos([r, c]);
        if (isSolved) {
          executeInstantSearch(algorithm, startPos, [r, c]);
        }
      }
      return;
    }

    handleTileAction(r, c);
  };

  const handleTouchEnd = () => {
    setIsMouseDown(false);
    setDraggingPin(null);
  };

  // ─── SEARCH ALGORITHMIC IMPLEMENTATION ────────────────────────────────────

  const getNeighbors = useCallback(
    (curr: CellNode, currentGrid: CellNode[][]): CellNode[] => {
      const neighbors: CellNode[] = [];
      const { row: r, col: c } = curr;

      const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];

      if (allowDiagonal) {
        dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
      }

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const neighbor = currentGrid[nr][nc];
          if (neighbor.type !== "wall") {
            neighbors.push(neighbor);
          }
        }
      }

      return neighbors;
    },
    [rows, cols, allowDiagonal]
  );

  const executeInstantSearch = useCallback(
    (
      algo: AlgorithmType,
      customStart = startPos,
      customTarget = targetPos
    ): SearchStats => {
      const startTime = performance.now();

      const tempGrid: CellNode[][] = grid.map((rowArr) =>
        rowArr.map((cell) => ({
          ...cell,
          gCost: cell.row === customStart[0] && cell.col === customStart[1] ? 0 : Infinity,
          hCost: calculateHeuristic(cell.row, cell.col, customTarget[0], customTarget[1]),
          fCost: cell.row === customStart[0] && cell.col === customStart[1] ? 0 : Infinity,
          isVisited: false,
          isOpen: false,
          isPath: false,
          parentRow: null,
          parentCol: null,
        }))
      );

      const openSet: CellNode[] = [tempGrid[customStart[0]][customStart[1]]];
      tempGrid[customStart[0]][customStart[1]].isOpen = true;

      let nodesVisited = 0;
      let found = false;
      let endNode: CellNode | null = null;

      while (openSet.length > 0) {
        if (algo === "astar") {
          openSet.sort((a, b) => a.fCost - b.fCost || a.hCost - b.hCost);
        } else if (algo === "dijkstra") {
          openSet.sort((a, b) => a.gCost - b.gCost);
        } else if (algo === "greedy_bfs") {
          openSet.sort((a, b) => a.hCost - b.hCost);
        }

        const current = algo === "dfs" ? openSet.pop()! : openSet.shift()!;
        current.isOpen = false;
        current.isVisited = true;
        nodesVisited++;

        if (current.row === customTarget[0] && current.col === customTarget[1]) {
          found = true;
          endNode = current;
          break;
        }

        const neighbors = getNeighbors(current, tempGrid);
        for (const neighbor of neighbors) {
          if (neighbor.isVisited) continue;

          const movementCost =
            Math.abs(neighbor.row - current.row) === 1 &&
            Math.abs(neighbor.col - current.col) === 1
              ? neighbor.weight * Math.SQRT2
              : neighbor.weight;

          const tentativeG = current.gCost + movementCost;

          if (tentativeG < neighbor.gCost) {
            neighbor.parentRow = current.row;
            neighbor.parentCol = current.col;
            neighbor.gCost = tentativeG;
            neighbor.hCost = calculateHeuristic(neighbor.row, neighbor.col, customTarget[0], customTarget[1]);

            if (algo === "astar") {
              neighbor.fCost = neighbor.gCost + neighbor.hCost * heuristicWeight;
            } else if (algo === "greedy_bfs") {
              neighbor.fCost = neighbor.hCost;
            } else {
              neighbor.fCost = neighbor.gCost;
            }

            if (!neighbor.isOpen) {
              neighbor.isOpen = true;
              openSet.push(neighbor);
            }
          }
        }
      }

      let pathLen = 0;
      let totalCost = 0;
      if (found && endNode) {
        let curr: CellNode | null = endNode;
        while (curr && (curr.row !== customStart[0] || curr.col !== customStart[1])) {
          curr.isPath = true;
          totalCost += curr.weight;
          pathLen++;
          if (curr.parentRow !== null && curr.parentCol !== null) {
            curr = tempGrid[curr.parentRow][curr.parentCol];
          } else {
            curr = null;
          }
        }
        if (curr) curr.isPath = true;
      }

      const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

      const resultStats: SearchStats = {
        pathLength: pathLen,
        totalCost,
        nodesVisited,
        openSetSize: openSet.length,
        executionTimeMs,
        found,
      };

      setGrid(tempGrid);
      setStats(resultStats);
      setIsSolved(true);

      return resultStats;
    },
    [grid, startPos, targetPos, calculateHeuristic, heuristicWeight, getNeighbors]
  );

  const startAnimatedSearch = async () => {
    clearSearchVisuals();
    setIsRunning(true);
    setIsPaused(false);
    cancelExecutionRef.current = false;
    pauseExecutionRef.current = false;

    const currentGrid: CellNode[][] = grid.map((r) =>
      r.map((c) => ({
        ...c,
        gCost: c.row === startPos[0] && c.col === startPos[1] ? 0 : Infinity,
        hCost: calculateHeuristic(c.row, c.col, targetPos[0], targetPos[1]),
        fCost: c.row === startPos[0] && c.col === startPos[1] ? 0 : Infinity,
        isVisited: false,
        isOpen: false,
        isPath: false,
        parentRow: null,
        parentCol: null,
      }))
    );

    const startTime = performance.now();
    const openSet: CellNode[] = [currentGrid[startPos[0]][startPos[1]]];
    currentGrid[startPos[0]][startPos[1]].isOpen = true;

    let nodesVisitedCount = 0;
    let found = false;
    let endNode: CellNode | null = null;

    while (openSet.length > 0) {
      if (cancelExecutionRef.current) return;

      while (pauseExecutionRef.current) {
        await new Promise((res) => setTimeout(res, 80));
        if (cancelExecutionRef.current) return;
      }

      if (algorithm === "astar") {
        openSet.sort((a, b) => a.fCost - b.fCost || a.hCost - b.hCost);
      } else if (algorithm === "dijkstra") {
        openSet.sort((a, b) => a.gCost - b.gCost);
      } else if (algorithm === "greedy_bfs") {
        openSet.sort((a, b) => a.hCost - b.hCost);
      }

      const current = algorithm === "dfs" ? openSet.pop()! : openSet.shift()!;
      current.isOpen = false;
      current.isVisited = true;
      nodesVisitedCount++;

      if (nodesVisitedCount % 3 === 0) {
        playNodeBeep(240 + current.hCost * 18);
      }

      if (current.row === targetPos[0] && current.col === targetPos[1]) {
        found = true;
        endNode = current;
        break;
      }

      const neighbors = getNeighbors(current, currentGrid);
      for (const neighbor of neighbors) {
        if (neighbor.isVisited) continue;

        const movementCost =
          Math.abs(neighbor.row - current.row) === 1 &&
          Math.abs(neighbor.col - current.col) === 1
            ? neighbor.weight * Math.SQRT2
            : neighbor.weight;

        const tentativeG = current.gCost + movementCost;

        if (tentativeG < neighbor.gCost) {
          neighbor.parentRow = current.row;
          neighbor.parentCol = current.col;
          neighbor.gCost = tentativeG;
          neighbor.hCost = calculateHeuristic(neighbor.row, neighbor.col, targetPos[0], targetPos[1]);

          if (algorithm === "astar") {
            neighbor.fCost = neighbor.gCost + neighbor.hCost * heuristicWeight;
          } else if (algorithm === "greedy_bfs") {
            neighbor.fCost = neighbor.hCost;
          } else {
            neighbor.fCost = neighbor.gCost;
          }

          if (!neighbor.isOpen) {
            neighbor.isOpen = true;
            openSet.push(neighbor);
          }
        }
      }

      if (speed > 0) {
        if (nodesVisitedCount % 2 === 0) {
          setGrid([...currentGrid]);
          setStats((s) => ({
            ...s,
            nodesVisited: nodesVisitedCount,
            openSetSize: openSet.length,
          }));
          await new Promise((res) => setTimeout(res, speed));
        }
      }
    }

    let pathLen = 0;
    let pathCost = 0;
    if (found && endNode) {
      let curr: CellNode | null = endNode;
      const pathNodes: CellNode[] = [];
      while (curr && (curr.row !== startPos[0] || curr.col !== startPos[1])) {
        pathNodes.push(curr);
        pathCost += curr.weight;
        pathLen++;
        if (curr.parentRow !== null && curr.parentCol !== null) {
          curr = currentGrid[curr.parentRow][curr.parentCol];
        } else {
          curr = null;
        }
      }
      if (curr) pathNodes.push(curr);

      playVictoryChord();

      for (let i = pathNodes.length - 1; i >= 0; i--) {
        if (cancelExecutionRef.current) return;
        pathNodes[i].isPath = true;
        if (speed > 0) {
          setGrid([...currentGrid]);
          await new Promise((res) => setTimeout(res, Math.min(speed, 20)));
        }
      }
    }

    const elapsed = Math.round((performance.now() - startTime) * 100) / 100;

    const finalStats: SearchStats = {
      pathLength: pathLen,
      totalCost: pathCost,
      nodesVisited: nodesVisitedCount,
      openSetSize: openSet.length,
      executionTimeMs: elapsed,
      found,
    };

    setGrid(currentGrid);
    setStats(finalStats);
    setIsRunning(false);
    setIsSolved(true);

    if (found) {
      completeExperiment();
    }
  };

  const runAlgorithmRace = () => {
    const stat1 = executeInstantSearch(algorithm);
    const stat2 = executeInstantSearch(compareAlgo);
    setCompareStats(stat2);
    setStats(stat1);
  };

  // Math Formula dynamic card helper
  const formulaInfo = useMemo(() => {
    switch (algorithm) {
      case "astar":
        return {
          equation: "f(n) = g(n) + ε·h(n)",
          desc:
            heuristicWeight === 1
              ? "Standard A*: Guarantees mathematically optimal shortest path."
              : heuristicWeight < 1
              ? `Sub-weighted A* (ε = ${heuristicWeight}): Leans toward Dijkstra uniform exploration.`
              : `Weighted A* (ε = ${heuristicWeight}): Greedy bias speeds search by up to 3x, yielding near-optimal path.`,
          admissible: heuristicWeight <= 1 ? "Admissible" : "Sub-Optimal Speedup",
        };
      case "dijkstra":
        return {
          equation: "f(n) = g(n)  [h=0]",
          desc: "Uniform-cost exploration. Guaranteed optimal path, but explores in concentric circular rings.",
          admissible: "Exhaustive / Optimal",
        };
      case "greedy_bfs":
        return {
          equation: "f(n) = h(n)",
          desc: "Greedy heuristic-only. Extremely fast directly toward goal, but easily trapped in concave obstacles.",
          admissible: "Inadmissible",
        };
      case "bfs":
        return {
          equation: "FIFO Queue (Unweighted)",
          desc: "Breadth-first search exploring level-by-level. Optimal only when all terrain edge weights = 1.",
          admissible: "Unit-Cost Optimal",
        };
      case "dfs":
        return {
          equation: "LIFO Stack (Exploratory)",
          desc: "Depth-first search diving deep down branches. Rarely optimal; high path variance.",
          admissible: "Non-Optimal",
        };
    }
  }, [algorithm, heuristicWeight]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-28 sm:pb-12">
      {/* ─── COMMAND CENTER SCI-FI HEADER ──────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-card/90 via-card/50 to-background backdrop-blur-xl">
        {/* Subtle radial sci-fi glow overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.09),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.07),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_24px_rgba(16,185,129,0.2)] shrink-0">
                <Compass size={28} className="animate-spin-slow" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
                    A* Pathfinding &amp; Heuristic Search
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-bold shadow-xs">
                    RUNTIME v2.5
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                  Informed graph traversal laboratory with weighted topography, dynamic obstacles, procedural mazes, and heuristic admissibility.
                </p>
              </div>
            </div>

            {/* Quick Actions & Header Metrics */}
            <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-center">
              {/* Density Preset Picker */}
              <div className="flex items-center bg-card border border-border rounded-2xl p-1 shadow-xs">
                {(["compact", "studio", "expansive"] as GridPreset[]).map((p) => {
                  const Icon = GRID_PRESETS[p].icon;
                  const isSel = gridPreset === p;
                  return (
                    <button
                      key={p}
                      onClick={() => switchGridPreset(p)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isSel
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                      title={GRID_PRESETS[p].label}
                    >
                      <Icon size={13} />
                      <span className="hidden sm:inline capitalize">{p}</span>
                    </button>
                  );
                })}
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled((s) => !s)}
                className={`p-2.5 rounded-2xl border transition shadow-xs cursor-pointer ${
                  soundEnabled
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
                title={soundEnabled ? "Mute Acoustic Synthesizer" : "Enable Sound"}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              {/* Reset All */}
              <button
                onClick={clearAllGrid}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-card border border-border text-xs font-bold text-muted-foreground hover:text-destructive hover:border-destructive/40 transition shadow-xs cursor-pointer"
                title="Reset Entire Matrix"
              >
                <RefreshCw size={13} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Dynamic Scientific Formula HUD Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/25 font-mono text-xs font-black text-primary">
                {formulaInfo.equation}
              </div>
              <div className="text-[11px] font-semibold text-muted-foreground truncate">
                {formulaInfo.desc}
              </div>
            </div>

            <div className="flex items-center gap-2 md:justify-center">
              <span className="text-[10px] font-black uppercase text-muted-foreground">Heuristic:</span>
              <span className="px-2 py-0.5 rounded-lg bg-background border border-border text-[11px] font-mono font-bold capitalize text-foreground">
                {heuristic} ({heuristicWeight}x)
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                [{formulaInfo.admissible}]
              </span>
            </div>

            <div className="flex items-center gap-2 justify-between md:justify-end text-xs font-mono">
              <span className="text-muted-foreground text-[11px]">Grid:</span>
              <span className="font-bold text-foreground">{cols} × {rows} cells</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground text-[11px]">Diagonal:</span>
              <button
                onClick={() => setAllowDiagonal((d) => !d)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition cursor-pointer ${
                  allowDiagonal
                    ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/40"
                    : "bg-background text-muted-foreground border-border"
                }`}
              >
                {allowDiagonal ? "ON (Octile)" : "OFF (4-Way)"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN WORKSPACE CONTENT ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 space-y-5">
        {/* Navigation Tabs on Mobile & Tablet */}
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab("visualizer")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "visualizer"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers size={14} />
              <span>Visualizer Grid</span>
            </button>
            <button
              onClick={() => setActiveTab("benchmarks")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "benchmarks"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Split size={14} />
              <span>Benchmark Race</span>
            </button>
            <button
              onClick={() => setActiveTab("challenges")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "challenges"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Award size={14} />
              <span>Challenges ({GUIDED_CHALLENGES.length})</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Interactive Terrain Engine Ready</span>
          </div>
        </div>

        {/* ─── TAB 1: VISUALIZER MATRIX & CONTROL SYSTEM ──────────────────── */}
        {activeTab === "visualizer" && (
          <div className="space-y-5">
            {/* Desktop / Tablet Parameter Settings Deck */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-card/80 backdrop-blur-xl border border-border/90 rounded-3xl p-4 sm:p-5 shadow-sm text-xs">
              {/* 1. Algorithm Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center justify-between">
                  <span>Search Algorithm</span>
                  <Activity size={12} className="text-primary" />
                </label>
                <select
                  value={algorithm}
                  onChange={(e) => {
                    setAlgorithm(e.target.value as AlgorithmType);
                    clearSearchVisuals();
                  }}
                  disabled={isRunning}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer shadow-xs transition"
                >
                  <option value="astar">A* Search (Optimal f = g + h)</option>
                  <option value="dijkstra">Dijkstra's Algorithm (Uniform h = 0)</option>
                  <option value="greedy_bfs">Greedy Best-First (f = h)</option>
                  <option value="bfs">Breadth-First Search (BFS)</option>
                  <option value="dfs">Depth-First Search (DFS)</option>
                </select>
              </div>

              {/* 2. Heuristic Metric */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">
                    Distance Metric
                  </label>
                  <span className="text-[10px] font-mono font-bold text-primary">
                    Weight ε: {heuristicWeight}x
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={heuristic}
                    onChange={(e) => {
                      setHeuristic(e.target.value as HeuristicType);
                      if (isSolved) executeInstantSearch(algorithm);
                    }}
                    disabled={isRunning || algorithm === "dijkstra" || algorithm === "bfs" || algorithm === "dfs"}
                    className="flex-1 bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary disabled:opacity-40 cursor-pointer shadow-xs transition"
                  >
                    <option value="manhattan">Manhattan (|Δx| + |Δy|)</option>
                    <option value="euclidean">Euclidean (Straight Line)</option>
                    <option value="chebyshev">Chebyshev (Diagonal Uniform)</option>
                    <option value="octile">Octile (√2 Diagonal)</option>
                  </select>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.25"
                    value={heuristicWeight}
                    onChange={(e) => {
                      setHeuristicWeight(parseFloat(e.target.value));
                      if (isSolved) executeInstantSearch(algorithm);
                    }}
                    className="w-16 sm:w-20 accent-primary cursor-pointer"
                    title="Heuristic Weight Multiplier (ε)"
                  />
                </div>
              </div>

              {/* 3. Procedural Maze Presets */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center justify-between">
                  <span>Procedural Mazes</span>
                  <Shuffle size={12} className="text-muted-foreground" />
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value === "recursive") generateRecursiveDivisionMaze();
                    else if (e.target.value === "scatter_20") generateRandomScatterMaze(0.2);
                    else if (e.target.value === "scatter_35") generateRandomScatterMaze(0.35);
                    else if (e.target.value === "swamp") generatePresetMaze("swamp_pass");
                    else if (e.target.value === "trap") generatePresetMaze("concave_trap");
                    e.target.value = "";
                  }}
                  defaultValue=""
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer shadow-xs transition"
                >
                  <option value="" disabled>Generate Maze Terrain...</option>
                  <option value="recursive">Recursive Division Maze</option>
                  <option value="swamp">Muddy Swamp Pass</option>
                  <option value="trap">Concave U-Trap</option>
                  <option value="scatter_20">Random Scatter (20%)</option>
                  <option value="scatter_35">Dense Obstacles (35%)</option>
                </select>
              </div>

              {/* 4. Animation Speed */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center justify-between">
                  <span>Execution Speed</span>
                  <FastForward size={12} className="text-muted-foreground" />
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer shadow-xs transition"
                  >
                    <option value={50}>Slow Cadence (50ms)</option>
                    <option value={25}>Normal Speed (25ms)</option>
                    <option value={10}>Hyper Speed (10ms)</option>
                    <option value={0}>Instantaneous (0ms)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tool Brush Strip */}
            <div className="flex items-center justify-between gap-2 p-2.5 bg-card border border-border rounded-2xl overflow-x-auto text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-muted-foreground px-2 hidden sm:inline">
                  Brush:
                </span>
                <button
                  onClick={() => setActiveTool("wall")}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition cursor-pointer ${
                    activeTool === "wall"
                      ? "bg-zinc-800 text-white border-zinc-700 shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                      : "bg-background border border-border text-muted-foreground hover:bg-muted"
                  }`}
                  title="Draw Impassable Wall"
                >
                  <Square size={13} fill="currentColor" />
                  <span>Wall</span>
                </button>
                <button
                  onClick={() => setActiveTool("mud")}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition cursor-pointer ${
                    activeTool === "mud"
                      ? "bg-amber-600/25 text-amber-600 border border-amber-500/50 shadow-sm"
                      : "bg-background border border-border text-muted-foreground hover:bg-muted"
                  }`}
                  title="Paint Mud (Cost 5)"
                >
                  <Trees size={13} />
                  <span>Mud (5)</span>
                </button>
                <button
                  onClick={() => setActiveTool("water")}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition cursor-pointer ${
                    activeTool === "water"
                      ? "bg-cyan-500/25 text-cyan-600 border border-cyan-500/50 shadow-sm"
                      : "bg-background border border-border text-muted-foreground hover:bg-muted"
                  }`}
                  title="Paint Water (Cost 10)"
                >
                  <Droplets size={13} />
                  <span>Water (10)</span>
                </button>
                <button
                  onClick={() => setActiveTool("eraser")}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition cursor-pointer ${
                    activeTool === "eraser"
                      ? "bg-rose-500/25 text-rose-500 border border-rose-500/50 shadow-sm"
                      : "bg-background border border-border text-muted-foreground hover:bg-muted"
                  }`}
                  title="Eraser (Clear cell back to free road)"
                >
                  <Eraser size={13} />
                  <span>Eraser</span>
                </button>
                <button
                  onClick={() => setActiveTool("inspect")}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition cursor-pointer ${
                    activeTool === "inspect"
                      ? "bg-primary/25 text-primary border border-primary/50 shadow-sm"
                      : "bg-background border border-border text-muted-foreground hover:bg-muted"
                  }`}
                  title="Inspect Cell Node Score HUD"
                >
                  <Eye size={13} />
                  <span>Inspect</span>
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={clearSearchVisuals}
                  className="px-3 py-2 rounded-xl bg-background border border-border text-xs font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
                  title="Clear Path & Visited Wavefront"
                >
                  <RotateCcw size={13} className="inline mr-1" />
                  <span>Clear Path</span>
                </button>
              </div>
            </div>

            {/* ─── ADAPTIVE CANVAS GRID WITH TOUCH & DRAG ─────────────────── */}
            <div className="bg-card border border-border/80 rounded-3xl p-2.5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <Navigation size={14} className="text-emerald-500 rotate-45" />
                  <span className="hidden sm:inline">Drag Green Start / Red Target to reroute</span>
                  <span className="sm:hidden">Touch to draw or drag pins</span>
                </div>
                <div className="text-[11px] font-mono text-muted-foreground">
                  {cols} × {rows} Matrix
                </div>
              </div>

              {/* Grid Canvas Wrapper */}
              <div
                ref={gridContainerRef}
                className="overflow-x-auto no-scrollbar select-none touch-none rounded-2xl bg-muted/20 border border-border/60 p-2 sm:p-3 mx-auto w-fit"
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="grid gap-[2px] bg-border/40 p-1 rounded-xl mx-auto w-fit"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  }}
                >
                  {grid.map((rowArr, r) =>
                    rowArr.map((cell, c) => {
                      const isStart = r === startPos[0] && c === startPos[1];
                      const isTarget = r === targetPos[0] && c === targetPos[1];

                      let cellBg = "bg-background hover:bg-muted/70";

                      if (cell.type === "wall") {
                        cellBg = "bg-zinc-800 dark:bg-zinc-900 border border-zinc-700/80 shadow-inner";
                      } else if (cell.type === "mud") {
                        cellBg = "bg-amber-900/30 dark:bg-amber-800/30 text-amber-500 border border-amber-600/30";
                      } else if (cell.type === "water") {
                        cellBg = "bg-cyan-900/30 dark:bg-cyan-800/30 text-cyan-500 border border-cyan-600/30";
                      }

                      if (cell.isVisited && cell.type !== "wall") {
                        cellBg = "bg-indigo-600/25 dark:bg-indigo-500/25 border border-indigo-400/30";
                      }
                      if (cell.isOpen && cell.type !== "wall") {
                        cellBg = "bg-cyan-500/30 dark:bg-cyan-400/35 border border-cyan-400/70 shadow-[0_0_8px_rgba(6,182,212,0.35)] animate-pulse";
                      }
                      if (cell.isPath && cell.type !== "wall") {
                        cellBg = "bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-amber-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.8)] scale-105 z-10";
                      }

                      return (
                        <div
                          key={`${r}-${c}`}
                          data-cell-row={r}
                          data-cell-col={c}
                          onMouseDown={() => handleMouseDown(r, c)}
                          onMouseEnter={() => handleMouseEnter(r, c)}
                          onMouseUp={handleMouseUp}
                          className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center rounded-[3px] text-[8px] sm:text-[9px] font-mono cursor-pointer transition-all duration-75 select-none ${cellBg}`}
                        >
                          {isStart ? (
                            <div className="w-full h-full flex items-center justify-center bg-emerald-500/25 rounded-[3px] border border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)] animate-pulse">
                              <Navigation
                                size={12}
                                className="text-emerald-500 rotate-45 filter drop-shadow-md"
                              />
                            </div>
                          ) : isTarget ? (
                            <div className="w-full h-full flex items-center justify-center bg-rose-500/25 rounded-[3px] border border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.7)] animate-pulse">
                              <Target
                                size={12}
                                className="text-rose-500 filter drop-shadow-md"
                              />
                            </div>
                          ) : cell.type === "mud" ? (
                            <span className="text-[7px] sm:text-[8px] opacity-70">5</span>
                          ) : cell.type === "water" ? (
                            <span className="text-[7px] sm:text-[8px] opacity-70">10</span>
                          ) : null}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Grid Legend Strip */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 mt-4 flex-wrap text-[11px] sm:text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-cyan-500/35 border border-cyan-400" />
                  <span>Open Set (Frontier)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-indigo-600/25 border border-indigo-500" />
                  <span>Closed Set (Visited)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-amber-400 border border-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
                  <span>Shortest Path</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-zinc-800 dark:bg-zinc-900 border border-zinc-700" />
                  <span>Wall</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-amber-900/30 border border-amber-600/40" />
                  <span>Mud (5)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-cyan-900/30 border border-cyan-600/40" />
                  <span>Water (10)</span>
                </div>
              </div>
            </div>

            {/* ─── LIVE TELEMETRY DASHBOARD ──────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 bg-card border border-border rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-black uppercase text-muted-foreground block">
                  Path Length
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                    {stats.pathLength}
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground">steps</span>
                </div>
              </div>

              <div className="p-3.5 bg-card border border-border rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-black uppercase text-muted-foreground block">
                  Weighted Cost
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-amber-500 font-mono">
                    {stats.totalCost}
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground">units</span>
                </div>
              </div>

              <div className="p-3.5 bg-card border border-border rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-black uppercase text-muted-foreground block">
                  Nodes Visited
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-primary font-mono">
                    {stats.nodesVisited}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    ({Math.round((stats.nodesVisited / (rows * cols)) * 100)}%)
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-card border border-border rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-black uppercase text-muted-foreground block">
                  Frontier Peak
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-emerald-500 font-mono">
                    {stats.openSetSize}
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground">in queue</span>
                </div>
              </div>

              <div className="p-3.5 bg-card border border-border rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-black uppercase text-muted-foreground block">
                  Compute Time
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                    {stats.executionTimeMs}
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground">ms</span>
                </div>
              </div>

              <div className="p-3.5 bg-card border border-border rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-black uppercase text-muted-foreground block">
                  Search Status
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  {stats.found ? (
                    <span className="flex items-center gap-1 text-xs font-black text-emerald-500">
                      <CheckCircle2 size={15} /> Optimal Path
                    </span>
                  ) : isRunning ? (
                    <span className="flex items-center gap-1 text-xs font-black text-primary animate-pulse">
                      <Activity size={15} /> Searching...
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground">Awaiting Search</span>
                  )}
                </div>
              </div>
            </div>

            {/* Cell Node Inspector HUD */}
            <div className="bg-card border border-border rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2">
                  <Target size={15} className="text-primary" />
                  <h3 className="text-xs font-black text-foreground">Cell Node Telemetry HUD</h3>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Tap or hover any tile on the canvas
                </span>
              </div>

              {hoveredNode ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <span className="text-[10px] text-muted-foreground block">Coordinates</span>
                    <span className="font-bold text-foreground">[{hoveredNode.row}, {hoveredNode.col}]</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <span className="text-[10px] text-muted-foreground block">Terrain / Weight</span>
                    <span className="font-bold uppercase text-foreground">
                      {hoveredNode.type} ({hoveredNode.weight})
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <span className="text-[10px] text-muted-foreground block">g(n) Cost from Start</span>
                    <span className="font-bold text-foreground">
                      {hoveredNode.gCost === Infinity ? "Infinity" : Math.round(hoveredNode.gCost * 10) / 10}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <span className="text-[10px] text-muted-foreground block">h(n) Heuristic to Target</span>
                    <span className="font-bold text-foreground">
                      {Math.round(hoveredNode.hCost * 10) / 10}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 col-span-2 sm:col-span-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-primary block font-bold">Total Evaluation Score f(n)</span>
                      <span className="font-black text-primary text-base">
                        {hoveredNode.fCost === Infinity ? "Infinity" : Math.round(hoveredNode.fCost * 10) / 10}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground block font-bold">Node State</span>
                      <span className="text-xs font-black text-foreground">
                        {hoveredNode.isPath
                          ? "Shortest Path"
                          : hoveredNode.isVisited
                          ? "Closed Set (Visited)"
                          : hoveredNode.isOpen
                          ? "Open Set (Frontier)"
                          : "Unvisited"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic py-3 text-center">
                  Touch or hover over any grid cell to view real-time g(n), h(n), and f(n) calculations.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 2: BENCHMARK RACE MODE ─────────────────────────────────── */}
        {activeTab === "benchmarks" && (
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
                  <Split size={20} className="text-primary" />
                  <span>Algorithmic Benchmark Race</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Compare two algorithms simultaneously on the identical obstacle matrix and heuristic configuration.
                </p>
              </div>

              <button
                onClick={runAlgorithmRace}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-black rounded-2xl shadow-md transition cursor-pointer self-start sm:self-auto"
              >
                <Play size={14} fill="currentColor" />
                <span>Run Benchmark Race</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primary Algo */}
              <div className="p-4 sm:p-5 bg-muted/30 rounded-2xl border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-foreground uppercase tracking-wide">
                    {algorithm.replace("_", " ")}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-primary/15 text-primary font-mono text-[10px] font-bold">
                    Primary Tested
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Nodes Visited:</span>
                    <strong className="text-foreground text-sm">{stats.nodesVisited}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Total Path Cost:</span>
                    <strong className="text-foreground text-sm">{stats.totalCost}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Path Length:</span>
                    <strong className="text-foreground text-sm">{stats.pathLength} steps</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Computation:</span>
                    <strong className="text-foreground text-sm">{stats.executionTimeMs} ms</strong>
                  </div>
                </div>
              </div>

              {/* Benchmark Algo */}
              <div className="p-4 sm:p-5 bg-muted/30 rounded-2xl border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <select
                    value={compareAlgo}
                    onChange={(e) => setCompareAlgo(e.target.value as AlgorithmType)}
                    className="bg-transparent text-sm font-black text-foreground focus:outline-none cursor-pointer uppercase tracking-wide"
                  >
                    <option value="dijkstra">DIJKSTRA</option>
                    <option value="greedy_bfs">GREEDY BFS</option>
                    <option value="bfs">BFS</option>
                    <option value="dfs">DFS</option>
                  </select>
                  <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[10px] font-bold">
                    Benchmark Target
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Nodes Visited:</span>
                    <strong className="text-foreground text-sm">{compareStats?.nodesVisited ?? "—"}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Total Path Cost:</span>
                    <strong className="text-foreground text-sm">{compareStats?.totalCost ?? "—"}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Path Length:</span>
                    <strong className="text-foreground text-sm">{compareStats?.pathLength ? `${compareStats.pathLength} steps` : "—"}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Computation:</span>
                    <strong className="text-foreground text-sm">
                      {compareStats?.executionTimeMs !== undefined ? `${compareStats.executionTimeMs} ms` : "—"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {compareStats && (
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" />
                  <span className="font-bold text-foreground">Efficiency Telemetry:</span>
                  <span className="text-muted-foreground">
                    {stats.nodesVisited < compareStats.nodesVisited
                      ? `${algorithm.toUpperCase()} searched ${Math.round(
                          ((compareStats.nodesVisited - stats.nodesVisited) / compareStats.nodesVisited) * 100
                        )}% fewer nodes than ${compareAlgo.toUpperCase()}!`
                      : stats.nodesVisited === compareStats.nodesVisited
                      ? "Both algorithms explored identical node volumes."
                      : `${compareAlgo.toUpperCase()} searched ${Math.round(
                          ((stats.nodesVisited - compareStats.nodesVisited) / stats.nodesVisited) * 100
                        )}% fewer nodes.`}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: GUIDED CHALLENGES ───────────────────────────────────── */}
        {activeTab === "challenges" && (
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Award size={20} className="text-amber-500" />
              <div>
                <h2 className="text-base sm:text-lg font-black text-foreground">
                  Guided Algorithmic Scenarios
                </h2>
                <p className="text-xs text-muted-foreground">
                  Test heuristics, obstacle traps, and terrain cost routing across structured engineering tests.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {GUIDED_CHALLENGES.map((ch) => {
                const isActive = activeChallenge?.id === ch.id;
                return (
                  <div
                    key={ch.id}
                    onClick={() => {
                      setActiveChallenge(ch);
                      setAlgorithm(ch.recommendedAlgo);
                      setHeuristic(ch.recommendedHeuristic);
                      generatePresetMaze(ch.mazePreset);
                      setActiveTab("visualizer");
                    }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                      isActive
                        ? "bg-primary/10 border-primary shadow-sm"
                        : "bg-background border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-foreground">{ch.title}</span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{ch.description}</p>
                    </div>

                    <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs font-mono font-bold text-primary">
                      <span>Goal: &lt;{ch.targetMaxVisited} nodes</span>
                      <span className="flex items-center gap-1">Load Challenge <ChevronRight size={13} /></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── STICKY BOTTOM DOCKED CONTROLLER (MOBILE & DESKTOP) ─────────────── */}
      <div className="fixed bottom-3 inset-x-3 sm:max-w-xl sm:mx-auto z-40">
        <div className="bg-card/95 backdrop-blur-2xl border border-border/80 rounded-2xl p-2 sm:p-2.5 shadow-2xl flex items-center justify-between gap-2">
          {!isRunning ? (
            <button
              onClick={startAnimatedSearch}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs sm:text-sm shadow-md transition transform active:scale-95 cursor-pointer"
            >
              <Play size={16} fill="currentColor" />
              <span>Visualize {algorithm.toUpperCase()}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                pauseExecutionRef.current = !pauseExecutionRef.current;
                setIsPaused((p) => !p);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              {isPaused ? <Play size={16} fill="currentColor" /> : <Pause size={16} />}
              <span>{isPaused ? "Resume Search" : "Pause Search"}</span>
            </button>
          )}

          <button
            onClick={() => executeInstantSearch(algorithm)}
            disabled={isRunning}
            className="flex items-center justify-center gap-1.5 py-3 px-3.5 rounded-xl bg-background border border-border hover:bg-muted text-foreground text-xs font-bold transition disabled:opacity-40 cursor-pointer"
            title="Instantaneous Computation"
          >
            <Zap size={14} className="text-amber-500" />
            <span className="hidden sm:inline">Instant</span>
          </button>

          <button
            onClick={clearSearchVisuals}
            className="flex items-center justify-center gap-1.5 py-3 px-3.5 rounded-xl bg-background border border-border hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
            title="Clear Path & Exploration"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* ─── NEXT LAB MODAL & GAMIFICATION ───────────────────────────────── */}
      {showNextLabModal && nextLabProgression && (
        <NextLabModal
          isOpen={showNextLabModal}
          onClose={() => setShowNextLabModal(false)}
          xpEarned={xpResult?.xpEarned || 50}
          track={nextLabProgression.track}
          nextStep={nextLabProgression.nextStep}
          isFinalStep={nextLabProgression.isFinalStep}
          trackPercentage={nextLabProgression.trackPercentage}
        />
      )}
    </div>
  );
}
