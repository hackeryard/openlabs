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
  TrendingUp,
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
  Mountain,
  Thermometer,
  Shuffle,
  Route,
  FastForward,
} from "lucide-react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

// ── Types & Mathematical Formulations ──────────────────────────────────
type AlgorithmType =
  | "steepest_ascent"
  | "stochastic"
  | "random_restart"
  | "simulated_annealing"
  | "first_choice";

type FunctionPreset1D = "multimodal" | "foothills" | "plateau" | "rastrigin" | "convex";
type SearchDimension = "1D" | "2D";

interface StepRecord {
  step: number;
  x: number;
  y: number;
  fVal: number;
  deltaE: number;
  acceptProb: number;
  decision: "accepted_uphill" | "accepted_downhill" | "rejected" | "local_max" | "global_max";
  temperature?: number;
}

// ── 1D Mathematical Functions & Derivatives ────────────────────────────
const FUNCTIONS_1D: Record<
  FunctionPreset1D,
  {
    name: string;
    formula: string;
    domain: [number, number];
    fn: (x: number) => number;
    globalOptimum: { x: number; val: number };
    desc: string;
  }
> = {
  multimodal: {
    name: "Ackley-Style Multi-Modal",
    formula: "f(x) = 2.5·cos(2.8x) - 0.15x² + 0.8·sin(6x) + 4.5",
    domain: [-6, 6],
    fn: (x: number) => 2.5 * Math.cos(2.8 * x) - 0.15 * x * x + 0.8 * Math.sin(6 * x) + 4.5,
    globalOptimum: { x: 0, val: 7.0 },
    desc: "Dense local maxima traps surrounding a dominant central global peak. Severe local optima challenge.",
  },
  foothills: {
    name: "Asymmetric Foothills",
    formula: "f(x) = sin(x) + sin(2.5x) + cos(0.8x) - 0.05x² + 3.2",
    domain: [-5, 7],
    fn: (x: number) => Math.sin(x) + Math.sin(2.5 * x) + Math.cos(0.8 * x) - 0.05 * x * x + 3.2,
    globalOptimum: { x: 1.85, val: 5.68 },
    desc: "Uneven local peaks with wide basins of attraction leading to premature convergence in standard hill climbing.",
  },
  plateau: {
    name: "Shoulder & Saddle Plateau",
    formula: "f(x) = tanh(x - 1.5) - 0.08(x - 1.5)³ + 4.0",
    domain: [-3, 5],
    fn: (x: number) => Math.tanh(x - 1.5) - 0.08 * Math.pow(x - 1.5, 3) + 4.0,
    globalOptimum: { x: 3.12, val: 4.88 },
    desc: "Zero-gradient saddle regions where greedy search halts due to lack of local slope.",
  },
  rastrigin: {
    name: "Rastrigin High-Frequency Benchmark",
    formula: "f(x) = 10 - (x² - 10·cos(2πx)) + 12",
    domain: [-4, 4],
    fn: (x: number) => 10 - (x * x - 10 * Math.cos(2 * Math.PI * x)) + 12,
    globalOptimum: { x: 0, val: 32 },
    desc: "Highly oscillatory benchmark with dozens of deceptive sub-optimal peaks.",
  },
  convex: {
    name: "Smooth Quadratic Paraboloid",
    formula: "f(x) = -(x - 1.5)² + 8",
    domain: [-4, 7],
    fn: (x: number) => -Math.pow(x - 1.5, 2) + 8,
    globalOptimum: { x: 1.5, val: 8.0 },
    desc: "Convex objective where steepest ascent is mathematically guaranteed to find the global optimum.",
  },
};

// ── 2D Mathematical Energy Surfaces ───────────────────────────────────
type FunctionPreset2D = "peaks" | "himmelblau" | "rastrigin2d";
const FUNCTIONS_2D: Record<
  FunctionPreset2D,
  {
    name: string;
    domain: [number, number]; // [min, max] for both x and y
    fn: (x: number, y: number) => number;
    globalOptimum: { x: number; y: number; val: number };
  }
> = {
  peaks: {
    name: "MATLAB Peaks Surface",
    domain: [-3, 3],
    fn: (x, y) =>
      3 * Math.pow(1 - x, 2) * Math.exp(-x * x - Math.pow(y + 1, 2)) -
      10 * (x / 5 - Math.pow(x, 3) - Math.pow(y, 5)) * Math.exp(-x * x - y * y) -
      (1 / 3) * Math.exp(-Math.pow(x + 1, 2) - y * y) +
      5,
    globalOptimum: { x: -0.01, y: 1.58, val: 13.1 },
  },
  himmelblau: {
    name: "Himmelblau Function (Multi-Modal)",
    domain: [-5, 5],
    fn: (x, y) =>
      200 - (Math.pow(x * x + y - 11, 2) + Math.pow(x + y * y - 7, 2)),
    globalOptimum: { x: 3.0, y: 2.0, val: 200 },
  },
  rastrigin2d: {
    name: "2D Rastrigin Optimization",
    domain: [-4, 4],
    fn: (x, y) =>
      40 - (x * x - 10 * Math.cos(2 * Math.PI * x) + (y * y - 10 * Math.cos(2 * Math.PI * y))),
    globalOptimum: { x: 0, y: 0, val: 60 },
  },
};

export default function ReworkedHillClimbingLab() {
  const { completeExperiment } = useLab(
    "computer-science/ai-problem/hill-climb",
    "computerScience",
    "exploration"
  );

  // ── Hyperparameters & Algorithm Controls ─────────────────────────────
  const [dimension, setDimension] = useState<SearchDimension>("1D");
  const [preset1D, setPreset1D] = useState<FunctionPreset1D>("multimodal");
  const [preset2D, setPreset2D] = useState<FunctionPreset2D>("peaks");
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("steepest_ascent");
  const [stepSize, setStepSize] = useState<number>(0.2);
  const [initialTemp, setInitialTemp] = useState<number>(10.0);
  const [coolingRate, setCoolingRate] = useState<number>(0.96);
  const [maxRestarts, setMaxRestarts] = useState<number>(10);

  // ── Simulation Engine State ──────────────────────────────────────────
  const [currentX, setCurrentX] = useState<number>(-3.5);
  const [currentY, setCurrentY] = useState<number>(0);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(10.0);
  const [stepCount, setStepCount] = useState<number>(0);
  const [restartCount, setRestartCount] = useState<number>(0);
  const [isStuckLocalMax, setIsStuckLocalMax] = useState<boolean>(false);
  const [isGlobalOptimum, setIsGlobalOptimum] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(60);

  // History & Step Log
  const [trajectory, setTrajectory] = useState<{ x: number; y?: number; val: number }[]>([]);
  const [stepHistory, setStepHistory] = useState<StepRecord[]>([]);
  const [restartsHistory, setRestartsHistory] = useState<{ startX: number; endX: number; endVal: number; foundGlobal: boolean }[]>([]);

  // Navigation View Tab
  const [activeTab, setActiveTab] = useState<"landscape" | "tensor_log" | "theory" | "diagnostics">("landscape");

  // Milestones State
  const [milestones, setMilestones] = useState({
    escapedLocalMax: false,
    foundGlobalOptimum: false,
    testedAnnealing: false,
    testedRestarts: false,
    analyzedMetropolis: false,
  });

  // Canvas Refs
  const canvas1DRef = useRef<HTMLCanvasElement | null>(null);
  const canvas2DRef = useRef<HTMLCanvasElement | null>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // ── Current Objective Function Helpers ────────────────────────────────
  const activeObj1D = FUNCTIONS_1D[preset1D];
  const activeObj2D = FUNCTIONS_2D[preset2D];

  // Initialize or Reset Problem Seed
  const initSearch = useCallback(
    (customX?: number) => {
      const dom = activeObj1D.domain;
      const startX = customX !== undefined ? customX : dom[0] + Math.random() * (dom[1] - dom[0]);
      const startY = 0;
      const startVal = activeObj1D.fn(startX);

      setCurrentX(startX);
      setCurrentY(startY);
      setCurrentScore(startVal);
      setTemperature(initialTemp);
      setStepCount(0);
      setIsStuckLocalMax(false);
      setIsGlobalOptimum(false);
      setTrajectory([{ x: startX, val: startVal }]);
      setStepHistory([]);
    },
    [activeObj1D, initialTemp]
  );

  useEffect(() => {
    initSearch();
  }, [preset1D, preset2D, initSearch]);

  // ── Single Optimization Step ──────────────────────────────────────────
  const stepOptimization = useCallback(() => {
    if (isGlobalOptimum || (isStuckLocalMax && algorithm !== "random_restart")) {
      return;
    }

    const curX = currentX;
    const curVal = activeObj1D.fn(curX);
    const h = stepSize;
    const dom = activeObj1D.domain;

    // Generate Candidate Neighborhood $\mathcal{N}(x)$
    const leftX = Math.max(dom[0], curX - h);
    const rightX = Math.min(dom[1], curX + h);
    const leftVal = activeObj1D.fn(leftX);
    const rightVal = activeObj1D.fn(rightX);

    let nextX = curX;
    let nextVal = curVal;
    let decision: StepRecord["decision"] = "rejected";
    let acceptProb = 0;
    let deltaE = 0;

    // Check if at local maximum (both neighbors worse)
    const isLocalMax = leftVal <= curVal && rightVal <= curVal;

    // 1. Steepest-Ascent Hill Climbing
    if (algorithm === "steepest_ascent") {
      if (isLocalMax) {
        setIsStuckLocalMax(true);
        decision = "local_max";
      } else {
        nextX = rightVal > leftVal ? rightX : leftX;
        nextVal = activeObj1D.fn(nextX);
        decision = "accepted_uphill";
      }
    }
    // 2. Simulated Annealing (Metropolis-Hastings Criterion)
    else if (algorithm === "simulated_annealing") {
      // Pick random neighbor
      const candX = Math.random() < 0.5 ? leftX : rightX;
      const candVal = activeObj1D.fn(candX);
      deltaE = candVal - curVal;

      if (deltaE > 0) {
        // Uphill move: always accept
        nextX = candX;
        nextVal = candVal;
        decision = "accepted_uphill";
        acceptProb = 1.0;
      } else {
        // Downhill move: accept with probability P = exp(deltaE / T)
        acceptProb = Math.exp(deltaE / Math.max(0.001, temperature));
        if (Math.random() < acceptProb) {
          nextX = candX;
          nextVal = candVal;
          decision = "accepted_downhill";
          setMilestones((p) => ({ ...p, escapedLocalMax: true, testedAnnealing: true }));
        } else {
          decision = "rejected";
        }
      }

      // Cool temperature
      setTemperature((prev) => Math.max(0.01, prev * coolingRate));
    }
    // 3. Stochastic Hill Climbing
    else if (algorithm === "stochastic") {
      if (isLocalMax) {
        setIsStuckLocalMax(true);
        decision = "local_max";
      } else {
        const dLeft = Math.max(0, leftVal - curVal);
        const dRight = Math.max(0, rightVal - curVal);
        const sumD = dLeft + dRight;
        if (sumD > 0) {
          nextX = Math.random() < dLeft / sumD ? leftX : rightX;
          nextVal = activeObj1D.fn(nextX);
          decision = "accepted_uphill";
        }
      }
    }
    // 4. Random Restart Hill Climbing
    else if (algorithm === "random_restart") {
      if (isLocalMax) {
        // Record restart and respawn at uniform random location
        setRestartsHistory((prev) => [
          ...prev,
          {
            startX: trajectory[0].x,
            endX: curX,
            endVal: curVal,
            foundGlobal: Math.abs(curX - activeObj1D.globalOptimum.x) < 0.15,
          },
        ]);

        if (restartCount < maxRestarts) {
          setRestartCount((p) => p + 1);
          setMilestones((p) => ({ ...p, testedRestarts: true }));
          const newStartX = dom[0] + Math.random() * (dom[1] - dom[0]);
          setCurrentX(newStartX);
          setCurrentScore(activeObj1D.fn(newStartX));
          setTrajectory([{ x: newStartX, val: activeObj1D.fn(newStartX) }]);
          setIsStuckLocalMax(false);
          return;
        } else {
          setIsStuckLocalMax(true);
          decision = "local_max";
        }
      } else {
        nextX = rightVal > leftVal ? rightX : leftX;
        nextVal = activeObj1D.fn(nextX);
        decision = "accepted_uphill";
      }
    }

    // Check if reached Global Optimum
    const atGlobal = Math.abs(nextX - activeObj1D.globalOptimum.x) < 0.12;
    if (atGlobal) {
      setIsGlobalOptimum(true);
      decision = "global_max";
      setMilestones((p) => ({ ...p, foundGlobalOptimum: true }));
      completeExperiment();
    }

    // Update state
    if (nextX !== curX) {
      setCurrentX(nextX);
      setCurrentScore(nextVal);
      setTrajectory((prev) => [...prev, { x: nextX, val: nextVal }]);
    }

    setStepCount((p) => p + 1);
    setStepHistory((prev) => [
      ...prev.slice(-30),
      {
        step: stepCount + 1,
        x: Number(nextX.toFixed(3)),
        y: 0,
        fVal: Number(nextVal.toFixed(3)),
        deltaE: Number(deltaE.toFixed(3)),
        acceptProb: Number(acceptProb.toFixed(3)),
        decision,
        temperature: Number(temperature.toFixed(2)),
      },
    ]);
  }, [
    isGlobalOptimum,
    isStuckLocalMax,
    algorithm,
    currentX,
    stepSize,
    activeObj1D,
    temperature,
    coolingRate,
    stepCount,
    trajectory,
    restartCount,
    maxRestarts,
    completeExperiment,
  ]);

  // Loop runner
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isRunning) {
      intervalId = setInterval(() => {
        stepOptimization();
      }, speedMs);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, speedMs, stepOptimization]);

  // ── High-DPI 1D Landscape Canvas Renderer ──────────────────────────────
  useEffect(() => {
    const canvas = canvas1DRef.current;
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

    const dom = activeObj1D.domain;
    const domWidth = dom[1] - dom[0];

    // Find function min & max in domain
    const samples = 300;
    let minF = Infinity;
    let maxF = -Infinity;
    for (let i = 0; i <= samples; i++) {
      const x = dom[0] + (i / samples) * domWidth;
      const v = activeObj1D.fn(x);
      if (v < minF) minF = v;
      if (v > maxF) maxF = v;
    }
    const fRange = Math.max(1, maxF - minF);

    const toCanvasX = (x: number) => ((x - dom[0]) / domWidth) * (width - 80) + 40;
    const toCanvasY = (val: number) => height - 35 - ((val - minF) / fRange) * (height - 80);

    // 1. Gridlines & Axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let y = 30; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(width - 30, y);
      ctx.stroke();
    }

    // 2. Landscape Curve Gradient & Line
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(168, 85, 247, 0.35)");
    gradient.addColorStop(1, "rgba(168, 85, 247, 0.0)");

    ctx.beginPath();
    for (let i = 0; i <= samples; i++) {
      const x = dom[0] + (i / samples) * domWidth;
      const v = activeObj1D.fn(x);
      const cx = toCanvasX(x);
      const cy = toCanvasY(v);
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.lineTo(toCanvasX(dom[1]), height);
    ctx.lineTo(toCanvasX(dom[0]), height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Stroke outline
    ctx.beginPath();
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 3;
    for (let i = 0; i <= samples; i++) {
      const x = dom[0] + (i / samples) * domWidth;
      const v = activeObj1D.fn(x);
      const cx = toCanvasX(x);
      const cy = toCanvasY(v);
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    // 3. Global Optimum Crown / Star
    const gOptX = toCanvasX(activeObj1D.globalOptimum.x);
    const gOptY = toCanvasY(activeObj1D.globalOptimum.val);

    ctx.beginPath();
    ctx.arc(gOptX, gOptY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#10b981";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("GLOBAL OPT", gOptX, gOptY - 14);

    // 4. Trajectory Path Line & Breadcrumb Dots
    if (trajectory.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      for (let i = 0; i < trajectory.length; i++) {
        const pt = trajectory[i];
        const tx = toCanvasX(pt.x);
        const ty = toCanvasY(pt.val);
        if (i === 0) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Breadcrumb dots
      for (const pt of trajectory) {
        ctx.beginPath();
        ctx.arc(toCanvasX(pt.x), toCanvasY(pt.val), 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fill();
      }
    }

    // 5. Active Agent Glowing Orb
    const agX = toCanvasX(currentX);
    const agY = toCanvasY(currentScore);

    // Halo glow
    ctx.beginPath();
    ctx.arc(agX, agY, 16, 0, Math.PI * 2);
    ctx.fillStyle = isGlobalOptimum
      ? "rgba(16, 185, 129, 0.4)"
      : isStuckLocalMax
      ? "rgba(245, 158, 11, 0.4)"
      : "rgba(168, 85, 247, 0.4)";
    ctx.fill();

    // Core
    ctx.beginPath();
    ctx.arc(agX, agY, 8, 0, Math.PI * 2);
    ctx.fillStyle = isGlobalOptimum
      ? "#10b981"
      : isStuckLocalMax
      ? "#f59e0b"
      : "#a855f7";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Coordinates tooltip
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`x=${currentX.toFixed(2)}, f(x)=${currentScore.toFixed(2)}`, agX, agY + 22);

    ctx.restore();
  }, [activeObj1D, currentX, currentScore, trajectory, isGlobalOptimum, isStuckLocalMax]);

  // Click on Canvas to Set Custom Seed
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvas1DRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    const dom = activeObj1D.domain;
    const domWidth = dom[1] - dom[0];
    const normX = Math.max(0, Math.min(1, (clickX - 40) / (rect.width - 80)));
    const selectedX = dom[0] + normX * domWidth;

    initSearch(selectedX);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-purple-500/20">
      {/* ── Top Engineering Header ── */}
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
              <Mountain size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-foreground">
                  Hill Climbing &amp; Simulated Annealing Lab
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                  Heuristic State-Space Optimization
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Steepest ascent, Metropolis-Hastings simulated annealing, random restarts, and local optima escape
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
              isRunning
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25"
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25"
            }`}
          >
            {isRunning ? <Pause size={14} /> : <Play size={14} />}
            <span>{isRunning ? "Pause Search" : "Climb Peak"}</span>
          </button>

          <button
            type="button"
            onClick={stepOptimization}
            disabled={isRunning}
            className="px-3 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted transition shadow-2xs cursor-pointer disabled:opacity-40"
            title="Step 1 Evaluation"
          >
            Step
          </button>

          <button
            type="button"
            onClick={() => initSearch()}
            className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-2xs cursor-pointer"
            title="Spawn Random Initial State"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </header>

      {/* ── Main Studio Grid ── */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: "landscape", label: "Objective Function Landscape & Search Path", icon: Mountain },
            { id: "tensor_log", label: "State Transition & Metropolis Acceptance Tensor", icon: Layers },
            { id: "theory", label: "Metropolis-Hastings & Heuristic Formulary", icon: Calculator },
            { id: "diagnostics", label: "Local Optima Trapping & Annealing Cooling", icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === "theory") setMilestones((p) => ({ ...p, analyzedMetropolis: true }));
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

        {/* ── Hyperparameter Controls Bar ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 p-4 sm:p-5 bg-card border border-border rounded-3xl shadow-sm">
          {/* 1. Objective Function Landscape */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Optimization Landscape
            </label>
            <select
              value={preset1D}
              onChange={(e) => setPreset1D(e.target.value as FunctionPreset1D)}
              className="w-full px-2.5 py-1.5 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="multimodal">Multi-Modal Ackley (Hard)</option>
              <option value="foothills">Asymmetric Foothills</option>
              <option value="plateau">Shoulder &amp; Saddle Plateau</option>
              <option value="rastrigin">Rastrigin High-Frequency</option>
              <option value="convex">Convex Paraboloid (Easy)</option>
            </select>
          </div>

          {/* 2. Algorithm Mode */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Search Strategy
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
              className="w-full px-2.5 py-1.5 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="steepest_ascent">Steepest-Ascent Greedy</option>
              <option value="simulated_annealing">Simulated Annealing (T)</option>
              <option value="random_restart">Random-Restart (Multi-Seed)</option>
              <option value="stochastic">Stochastic Hill Climbing</option>
            </select>
          </div>

          {/* 3. Step Size (h) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <span>Step Size (Δx)</span>
              <span className="font-mono text-foreground font-bold">{stepSize}</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={0.8}
              step={0.05}
              value={stepSize}
              onChange={(e) => setStepSize(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* 4. Temperature (Simulated Annealing) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <span>Init Temp (T₀)</span>
              <span className="font-mono text-foreground font-bold">{initialTemp}</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={30.0}
              step={1.0}
              value={initialTemp}
              onChange={(e) => setInitialTemp(parseFloat(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* 5. Cooling Schedule Alpha */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <span>Cooling Rate (α)</span>
              <span className="font-mono text-foreground font-bold">{coolingRate}</span>
            </div>
            <input
              type="range"
              min={0.85}
              max={0.99}
              step={0.01}
              value={coolingRate}
              onChange={(e) => setCoolingRate(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* 6. Max Restarts */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <span>Max Restarts (N)</span>
              <span className="font-mono text-foreground font-bold">{maxRestarts}</span>
            </div>
            <input
              type="range"
              min={2}
              max={30}
              step={1}
              value={maxRestarts}
              onChange={(e) => setMaxRestarts(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </section>

        {/* ── TAB 1: Landscape Visualizer ── */}
        {activeTab === "landscape" && (
          <div className="space-y-6">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Canvas (7 Cols): High-DPI 1D Continuous Landscape */}
              <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        {activeObj1D.name}
                      </h3>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {activeObj1D.formula}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-muted-foreground font-mono bg-muted/60 px-2 py-1 rounded-lg">
                    Click canvas to set custom starting seed
                  </span>
                </div>

                {/* Canvas Arena */}
                <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border border-border flex items-center justify-center">
                  <canvas
                    ref={canvas1DRef}
                    width={560}
                    height={350}
                    onClick={handleCanvasClick}
                    className="w-full h-full object-contain cursor-crosshair"
                  />
                </div>

                {/* State Status Banner */}
                <div className="flex items-center justify-between gap-3 p-3 bg-muted/30 border border-border rounded-2xl flex-wrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-mono font-black uppercase border ${
                        isGlobalOptimum
                          ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                          : isStuckLocalMax
                          ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
                          : "bg-purple-500/15 text-purple-400 border-purple-500/30"
                      }`}
                    >
                      {isGlobalOptimum
                        ? "GLOBAL OPTIMUM CONVERGED"
                        : isStuckLocalMax
                        ? "TRAPPED AT LOCAL MAXIMUM"
                        : "ASCENDING GRADIENT"}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-muted-foreground">
                    Total Search Steps: <strong className="text-foreground">{stepCount}</strong>
                  </span>
                </div>
              </div>

              {/* Right: Live Telemetry & Inspector (5 Cols) */}
              <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-indigo-500" />
                    <h3 className="text-sm font-bold text-foreground">
                      State Coordinates &amp; Optimization Metrics
                    </h3>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    T = {temperature.toFixed(2)}
                  </span>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/40 border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      Current State x
                    </span>
                    <span className="text-xl font-black font-mono text-purple-400 mt-0.5 block">
                      {currentX.toFixed(3)}
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      Objective Score f(x)
                    </span>
                    <span
                      className={`text-xl font-black font-mono mt-0.5 block ${
                        isGlobalOptimum ? "text-emerald-500" : "text-foreground"
                      }`}
                    >
                      {currentScore.toFixed(3)}
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      Global Target f(x*)
                    </span>
                    <span className="text-xl font-black font-mono text-emerald-400 mt-0.5 block">
                      {activeObj1D.globalOptimum.val.toFixed(2)}
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      Restarts Count
                    </span>
                    <span className="text-xl font-black font-mono text-cyan-400 mt-0.5 block">
                      {restartCount} / {maxRestarts}
                    </span>
                  </div>
                </div>

                {/* Metropolis Probability Inspector */}
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
                    <span>Metropolis Acceptance Probability P(ΔE, T)</span>
                    <span className="font-mono text-muted-foreground">T = {temperature.toFixed(2)}</span>
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-xl font-mono text-xs text-purple-300 border border-border space-y-1">
                    <div>{"P(accept downhill) = exp(ΔE / T)"}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {"When ΔE < 0, stochastic annealing allows escaping local maxima traps."}
                    </div>
                  </div>
                </div>

                {/* Random Restarts History Pill List */}
                {restartsHistory.length > 0 && (
                  <div className="p-3 bg-muted/20 border border-border rounded-2xl space-y-1.5 max-h-32 overflow-y-auto">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                      Recent Random Restarts
                    </span>
                    {restartsHistory.slice(-4).map((r, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-[11px] font-mono p-1.5 bg-card rounded-lg border border-border"
                      >
                        <span>Seed: x={r.startX.toFixed(2)}</span>
                        <span className={r.foundGlobal ? "text-emerald-400 font-bold" : "text-amber-400"}>
                          Result: f(x)={r.endVal.toFixed(2)} {r.foundGlobal ? "★" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ── TAB 2: Step Transition Tensor Log ── */}
        {activeTab === "tensor_log" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
              <div>
                <h3 className="text-base font-black text-foreground">
                  Optimization State-Transition Tensor &amp; Decisions
                </h3>
                <p className="text-xs text-muted-foreground">
                  Step-by-step history of candidate evaluations, energy deltas (ΔE), and stochastic acceptance decisions.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-purple-500">
                Algorithm: {algorithm.replace("_", " ").toUpperCase()}
              </span>
            </div>

            <div className="overflow-x-auto p-4 bg-slate-950 rounded-2xl border border-border max-h-96">
              <table className="w-full text-center font-mono text-xs text-slate-200">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground text-[10px] font-black uppercase">
                    <th className="p-2 text-left">Step #</th>
                    <th className="p-2">Coordinate (x)</th>
                    <th className="p-2">Score f(x)</th>
                    <th className="p-2">Energy Delta ΔE</th>
                    <th className="p-2">Acceptance Prob P</th>
                    <th className="p-2">Temp T</th>
                    <th className="p-2 text-purple-400">Decision Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {stepHistory.map((s) => (
                    <tr key={s.step} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-2 text-left font-bold text-slate-400">{s.step}</td>
                      <td className="p-2">{s.x}</td>
                      <td className="p-2 font-bold text-purple-400">{s.fVal}</td>
                      <td className={`p-2 font-bold ${s.deltaE >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {s.deltaE > 0 ? `+${s.deltaE}` : s.deltaE}
                      </td>
                      <td className="p-2 text-slate-300">{(s.acceptProb * 100).toFixed(1)}%</td>
                      <td className="p-2 text-slate-400">{s.temperature}</td>
                      <td className="p-2 font-black uppercase text-xs">
                        <span
                          className={`px-2 py-0.5 rounded-md ${
                            s.decision === "global_max"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : s.decision === "accepted_uphill"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : s.decision === "accepted_downhill"
                              ? "bg-amber-500/20 text-amber-400"
                              : s.decision === "local_max"
                              ? "bg-rose-500/20 text-rose-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {s.decision.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── TAB 3: Mathematical Theory & Proofs ── */}
        {activeTab === "theory" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-foreground">
                Mathematical Foundations: Local Search, Gradient Heuristics &amp; Annealing
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Formal mathematical formulations for local search, heuristic optimization, and stochastic cooling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Steepest-Ascent Equation */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                  <Mountain size={16} />
                  <span>1. Steepest-Ascent Hill Climbing</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-cyan-300 space-y-1.5 border border-border">
                  <div>{"x_{t+1} = argmax_{x' ∈ N(x_t)} f(x')"}</div>
                  <div>{"Stop condition: f(x') ≤ f(x_t)  ∀ x' ∈ N(x_t)"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {"Greedily ascends the steepest local slope. Incomplete and sub-optimal in non-convex landscapes with local maxima traps."}
                </p>
              </div>

              {/* 2. Simulated Annealing Metropolis Criterion */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                  <Thermometer size={16} />
                  <span>2. Metropolis-Hastings Acceptance Criterion</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-rose-300 space-y-1.5 border border-border">
                  <div>{"ΔE = f(x_{candidate}) - f(x_{current})"}</div>
                  <div>{"P(accept) = 1  if ΔE ≥ 0,   exp(ΔE / T)  if ΔE < 0"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {"Allows controlled downhill moves with probability decaying exponentially with negative delta and cooling temperature."}
                </p>
              </div>

              {/* 3. Cooling Schedule */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                  <Zap size={16} />
                  <span>3. Geometric Annealing Cooling Schedule</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-amber-300 space-y-1.5 border border-border">
                  <div>{"T_{k+1} = α · T_k,    where 0.8 ≤ α < 1.0"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {"As T → 0, simulated annealing smoothly transitions from stochastic random exploration to pure deterministic greedy exploitation."}
                </p>
              </div>

              {/* 4. Random-Restart Completeness Proof */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                  <Shuffle size={16} />
                  <span>4. Random-Restart Asymptotic Completeness</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-emerald-300 space-y-1.5 border border-border">
                  <div>{"P(success in k restarts) = 1 - (1 - p)^k"}</div>
                  <div>{"lim_{k → ∞} P(success) = 1"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {"Where p is the probability of a uniform random seed landing within the basin of attraction of the global optimum."}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── TAB 4: Diagnostics ── */}
        {activeTab === "diagnostics" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-black text-foreground">
                Convergence Diagnostics &amp; Local Optima Analysis
              </h3>
              <p className="text-xs text-muted-foreground">
                Examine basins of attraction, escape probabilities, and temperature decay rates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Current State Status</span>
                <span className="text-2xl font-black font-mono text-purple-500">
                  {isGlobalOptimum ? "OPTIMUM" : isStuckLocalMax ? "LOCAL TRAP" : "CLIMBING"}
                </span>
                <p className="text-[10px] text-muted-foreground">
                  {isStuckLocalMax
                    ? "Greedy search has halted at a zero-gradient boundary."
                    : "Active trajectory is evaluating local neighborhood."}
                </p>
              </div>

              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Active Strategy</span>
                <span className="text-2xl font-black font-mono text-indigo-500 uppercase">{algorithm.replace("_", " ")}</span>
                <p className="text-[10px] text-muted-foreground">
                  {algorithm === "simulated_annealing"
                    ? "Stochastic energy transitions enable tunnel through saddles."
                    : "Deterministic greedy gradient ascent."}
                </p>
              </div>

              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Global Peak Proximity</span>
                <span className="text-2xl font-black font-mono text-emerald-500">
                  {Math.abs(currentX - activeObj1D.globalOptimum.x).toFixed(3)}
                </span>
                <p className="text-[10px] text-muted-foreground">
                  Euclidean distance to true global optimum in state domain.
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
                Heuristic Optimization Mastery Objectives
              </h4>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-500">+50 XP Per Milestone</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                id: "foundGlobalOptimum",
                label: "Attain Global Maximum ($x^*$)",
                desc: "Navigate local maxima traps to converge at the true global objective optimum.",
                done: milestones.foundGlobalOptimum,
              },
              {
                id: "escapedLocalMax",
                label: "Escape Local Maximum via Annealing",
                desc: "Trigger a stochastic downhill transition using the Metropolis criterion $P = \\exp(\\Delta E / T)$.",
                done: milestones.escapedLocalMax,
              },
              {
                id: "testedAnnealing",
                label: "Tune Geometric Cooling Schedule ($\\alpha$)",
                desc: "Adjust temperature decay parameters to balance global exploration vs local exploitation.",
                done: milestones.testedAnnealing,
              },
              {
                id: "testedRestarts",
                label: "Deploy Random-Restart Multi-Seed",
                desc: "Execute multi-seed restarts to prove asymptotic completeness over multi-modal basins.",
                done: milestones.testedRestarts,
              },
              {
                id: "analyzedMetropolis",
                label: "Inspect State Transition Tensor",
                desc: "Study the step-by-step tensor log of evaluated candidate neighbors.",
                done: milestones.analyzedMetropolis,
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
          labId="computer-science/ai-problem/hill-climb"
          currentParams={{
            currentX,
            currentScore,
            algorithm,
            stepSize,
            temperature,
            preset1D,
          }}
        />
      </main>
    </div>
  );
}
