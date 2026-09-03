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
  Split,
  Network,
  GitFork,
  FastForward,
  Droplets,
  FlaskConical,
  Beaker,
  MoveRight,
} from "lucide-react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

// ── Types & Mathematical Formulations ──────────────────────────────────
type SearchAlgorithm = "bfs" | "dfs" | "a_star" | "manual";
type JugMode = "2_jugs" | "3_jugs";

interface StateNode2D {
  j1: number;
  j2: number;
  path: { j1: number; j2: number; action: string; ruleId: string }[];
}

interface StateNode3D {
  j1: number;
  j2: number;
  j3: number;
  path: { j1: number; j2: number; j3: number; action: string; ruleId: string }[];
}

interface StepAction {
  j1: number;
  j2: number;
  j3?: number;
  action: string;
  ruleId: string;
}

// ── Number Theory Solvability Proof (Bézout's Identity) ────────────────
function computeGCD(a: number, b: number): number {
  return b === 0 ? a : computeGCD(b, a % b);
}

function extendedGCD(a: number, b: number): { gcd: number; x: number; y: number } {
  if (b === 0) return { gcd: a, x: 1, y: 0 };
  const next = extendedGCD(b, a % b);
  return {
    gcd: next.gcd,
    x: next.y,
    y: next.x - Math.floor(a / b) * next.y,
  };
}

export default function WaterJugStudioLab() {
  const { completeExperiment } = useLab(
    "computer-science/ai-problem/water-jug",
    "computerScience",
    "simulation"
  );

  // ── Problem Capacities & Target ──────────────────────────────────────
  const [jugMode, setJugMode] = useState<JugMode>("2_jugs");
  const [cap1, setCap1] = useState<number>(5);
  const [cap2, setCap2] = useState<number>(3);
  const [cap3, setCap3] = useState<number>(8); // For 3-jug mode
  const [target, setTarget] = useState<number>(4);

  // ── Search & Algorithm Controls ──────────────────────────────────────
  const [algorithm, setAlgorithm] = useState<SearchAlgorithm>("bfs");
  const [speedMs, setSpeedMs] = useState<number>(250);

  // ── Current State & Playback ─────────────────────────────────────────
  const [currentJ1, setCurrentJ1] = useState<number>(0);
  const [currentJ2, setCurrentJ2] = useState<number>(0);
  const [currentJ3, setCurrentJ3] = useState<number>(8);
  const [solutionSteps, setSolutionSteps] = useState<StepAction[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [isImpossible, setIsImpossible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Telemetry & Metrics
  const [nodesExplored, setNodesExplored] = useState<number>(0);
  const [visitedSet, setVisitedSet] = useState<Set<string>>(new Set());

  // UI Tabs & Milestones
  const [activeTab, setActiveTab] = useState<"visualizer" | "production_rules" | "theory" | "diagnostics">("visualizer");
  const [milestones, setMilestones] = useState({
    solvedDieHard: false,
    analyzedBezoutGCD: false,
    comparedBFSDFS: false,
    analyzedStateSpace: false,
  });

  const liquidCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateSpaceCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // ── Mathematical Solvability Verification ─────────────────────────────
  const gcdVal = useMemo(() => computeGCD(cap1, cap2), [cap1, cap2]);
  const bezoutResult = useMemo(() => extendedGCD(cap1, cap2), [cap1, cap2]);

  const isSolvableMath = useMemo(() => {
    if (jugMode === "2_jugs") {
      if (target > Math.max(cap1, cap2)) return false;
      return target % gcdVal === 0;
    } else {
      const g = computeGCD(computeGCD(cap1, cap2), cap3);
      if (target > Math.max(cap1, cap2, cap3)) return false;
      return target % g === 0;
    }
  }, [jugMode, target, cap1, cap2, cap3, gcdVal]);

  // ── 2-Jug State Space Search Engine (BFS, DFS, A*) ────────────────────
  const solve2Jugs = useCallback((): StepAction[] | null => {
    if (!isSolvableMath) return null;

    const startNode: StateNode2D = {
      j1: 0,
      j2: 0,
      path: [{ j1: 0, j2: 0, action: "Initial Empty State (0, 0)", ruleId: "INIT" }],
    };

    const queue: StateNode2D[] = [startNode];
    const visited = new Set<string>(["0,0"]);
    let exploredCount = 0;

    while (queue.length > 0) {
      exploredCount++;
      let current: StateNode2D;

      if (algorithm === "bfs") {
        current = queue.shift()!;
      } else if (algorithm === "dfs") {
        current = queue.pop()!;
      } else {
        // A* with heuristic h = |j1 - target| + |j2 - target|
        queue.sort((a, b) => {
          const hA = Math.min(Math.abs(a.j1 - target), Math.abs(a.j2 - target));
          const hB = Math.min(Math.abs(b.j1 - target), Math.abs(b.j2 - target));
          return a.path.length + hA - (b.path.length + hB);
        });
        current = queue.shift()!;
      }

      if (current.j1 === target || current.j2 === target) {
        setNodesExplored(exploredCount);
        setVisitedSet(visited);
        return current.path;
      }

      // Generate 8 Production Rules for 2 Jugs
      const j1 = current.j1;
      const j2 = current.j2;
      const transitions: { j1: number; j2: number; action: string; ruleId: string }[] = [
        // R1: Fill Jug 1
        { j1: cap1, j2, action: `Fill Jug 1 (from ${j1}L → ${cap1}L)`, ruleId: "R1 (Fill J1)" },
        // R2: Fill Jug 2
        { j1, j2: cap2, action: `Fill Jug 2 (from ${j2}L → ${cap2}L)`, ruleId: "R2 (Fill J2)" },
        // R3: Empty Jug 1
        { j1: 0, j2, action: `Empty Jug 1 (${j1}L → 0L)`, ruleId: "R3 (Empty J1)" },
        // R4: Empty Jug 2
        { j1, j2: 0, action: `Empty Jug 2 (${j2}L → 0L)`, ruleId: "R4 (Empty J2)" },
        // R5: Pour Jug 1 into Jug 2 until J2 is full
        {
          j1: Math.max(0, j1 - (cap2 - j2)),
          j2: Math.min(cap2, j2 + j1),
          action: `Pour Jug 1 → Jug 2 (${j1}, ${j2}) → (${Math.max(0, j1 - (cap2 - j2))}, ${Math.min(cap2, j2 + j1)})`,
          ruleId: "R5 (Pour J1→J2)",
        },
        // R6: Pour Jug 2 into Jug 1 until J1 is full
        {
          j1: Math.min(cap1, j1 + j2),
          j2: Math.max(0, j2 - (cap1 - j1)),
          action: `Pour Jug 2 → Jug 1 (${j1}, ${j2}) → (${Math.min(cap1, j1 + j2)}, ${Math.max(0, j2 - (cap1 - j1))})`,
          ruleId: "R6 (Pour J2→J1)",
        },
      ];

      for (const t of transitions) {
        const key = `${t.j1},${t.j2}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({
            j1: t.j1,
            j2: t.j2,
            path: [...current.path, t],
          });
        }
      }
    }

    setNodesExplored(exploredCount);
    setVisitedSet(visited);
    return null;
  }, [cap1, cap2, target, algorithm, isSolvableMath]);

  // ── Reset & Initialize ────────────────────────────────────────────────
  const initProblem = useCallback(() => {
    setCurrentJ1(0);
    setCurrentJ2(0);
    setCurrentJ3(jugMode === "3_jugs" ? cap3 : 0);
    setCurrentStepIndex(0);
    setIsRunning(false);
    setIsSolved(false);

    if (!isSolvableMath) {
      setIsImpossible(true);
      setErrorMessage(`Target (${target}L) is not solvable. By Bézout's identity, target must be a multiple of GCD(${cap1}, ${cap2}) = ${gcdVal}L.`);
      setSolutionSteps([]);
    } else {
      setIsImpossible(false);
      setErrorMessage("");
      const steps = solve2Jugs();
      if (steps) {
        setSolutionSteps(steps);
      }
    }
  }, [jugMode, cap1, cap2, cap3, target, isSolvableMath, gcdVal, solve2Jugs]);

  useEffect(() => {
    initProblem();
  }, [initProblem]);

  // ── Step Execution ────────────────────────────────────────────────────
  const stepForward = useCallback(() => {
    if (solutionSteps.length === 0) return;
    if (currentStepIndex < solutionSteps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      const step = solutionSteps[nextIdx];
      setCurrentStepIndex(nextIdx);
      setCurrentJ1(step.j1);
      setCurrentJ2(step.j2);

      if (step.j1 === target || step.j2 === target) {
        setIsSolved(true);
        setIsRunning(false);
        if (cap1 === 5 && cap2 === 3 && target === 4) {
          setMilestones((p) => ({ ...p, solvedDieHard: true }));
        }
        completeExperiment();
      }
    } else {
      setIsRunning(false);
    }
  }, [solutionSteps, currentStepIndex, target, cap1, cap2, completeExperiment]);

  // Simulation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        stepForward();
      }, speedMs);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, speedMs, stepForward]);

  // ── High-DPI Fluid Simulation Canvas ──────────────────────────────────
  useEffect(() => {
    const canvas = liquidCanvasRef.current;
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

    // Draw Jug Function
    const drawGlassJug = (
      centerX: number,
      centerY: number,
      jugW: number,
      jugH: number,
      amount: number,
      capacity: number,
      label: string,
      accentColor: string
    ) => {
      const x = centerX - jugW / 2;
      const y = centerY - jugH / 2;
      const fillRatio = Math.max(0, Math.min(1, amount / capacity));
      const liquidH = jugH * fillRatio;
      const liquidY = y + jugH - liquidH;

      // 1. Glass Shadow & Ambient Glow
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = amount === target ? 25 : 8;
      ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
      ctx.fillRect(x, y, jugW, jugH);
      ctx.shadowBlur = 0;

      // 2. Realistic Liquid Gradient & Fill
      if (amount > 0) {
        const liquidGradient = ctx.createLinearGradient(x, liquidY, x + jugW, y + jugH);
        liquidGradient.addColorStop(0, amount === target ? "#10b981" : "#0284c7");
        liquidGradient.addColorStop(1, amount === target ? "#059669" : "#0369a1");

        ctx.fillStyle = liquidGradient;
        ctx.fillRect(x + 2, liquidY, jugW - 4, liquidH - 2);

        // Meniscus surface wave
        ctx.beginPath();
        ctx.ellipse(centerX, liquidY, (jugW - 4) / 2, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = amount === target ? "#34d399" : "#38bdf8";
        ctx.fill();
      }

      // 3. Glass Outline & Spout
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, jugW, jugH);

      // Glass highlights
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 8, y + 10);
      ctx.lineTo(x + 8, y + jugH - 10);
      ctx.stroke();

      // 4. Tick Marks / Graduations
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 1.5;
      for (let i = 1; i <= capacity; i++) {
        const tickY = y + jugH - (jugH * (i / capacity));
        ctx.beginPath();
        ctx.moveTo(x + jugW - 12, tickY);
        ctx.lineTo(x + jugW, tickY);
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.font = "bold 8px monospace";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(`${i}L`, x + jugW - 14, tickY);
      }

      // 5. Jug Title & Amount Badges
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.fillText(label, centerX, y - 20);

      ctx.font = "black 18px monospace";
      ctx.fillStyle = amount === target ? "#34d399" : "#38bdf8";
      ctx.fillText(`${amount} / ${capacity} L`, centerX, y + jugH + 28);
    };

    // Draw 2 Jugs side by side
    drawGlassJug(width * 0.32, height * 0.46, 110, 160, currentJ1, cap1, `Jug 1 (${cap1}L Capacity)`, "rgba(56, 189, 248, 0.4)");
    drawGlassJug(width * 0.68, height * 0.46, 100, 140, currentJ2, cap2, `Jug 2 (${cap2}L Capacity)`, "rgba(168, 85, 247, 0.4)");

    // Arrow transition indicator
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(width * 0.44, height * 0.46);
    ctx.lineTo(width * 0.56, height * 0.46);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
  }, [currentJ1, currentJ2, cap1, cap2, target]);

  // ── High-DPI 2D State Lattice Canvas Renderer ─────────────────────────
  useEffect(() => {
    const canvas = stateSpaceCanvasRef.current;
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

    const pad = 40;
    const gridW = width - pad * 2;
    const gridH = height - pad * 2;

    const toCanvasX = (j1: number) => pad + (j1 / cap1) * gridW;
    const toCanvasY = (j2: number) => height - pad - (j2 / cap2) * gridH;

    // 1. Gridlines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= cap1; x++) {
      ctx.beginPath();
      ctx.moveTo(toCanvasX(x), pad);
      ctx.lineTo(toCanvasX(x), height - pad);
      ctx.stroke();
    }
    for (let y = 0; y <= cap2; y++) {
      ctx.beginPath();
      ctx.moveTo(pad, toCanvasY(y));
      ctx.lineTo(width - pad, toCanvasY(y));
      ctx.stroke();
    }

    // 2. Solution Path Trajectory (Emerald Line)
    if (solutionSteps.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2.5;
      for (let i = 0; i < solutionSteps.length; i++) {
        const pt = solutionSteps[i];
        const cx = toCanvasX(pt.j1);
        const cy = toCanvasY(pt.j2);
        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }

    // 3. Draw State Lattice Nodes (x, y)
    for (let x = 0; x <= cap1; x++) {
      for (let y = 0; y <= cap2; y++) {
        const cx = toCanvasX(x);
        const cy = toCanvasY(y);
        const isCurrent = currentJ1 === x && currentJ2 === y;
        const isGoal = x === target || y === target;
        const isVisited = visitedSet.has(`${x},${y}`);

        ctx.beginPath();
        ctx.arc(cx, cy, isCurrent ? 8 : isGoal ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isCurrent
          ? "#a855f7"
          : isGoal
          ? "#10b981"
          : isVisited
          ? "rgba(56, 189, 248, 0.6)"
          : "rgba(255, 255, 255, 0.2)";
        ctx.fill();

        if (isCurrent) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    }

    ctx.restore();
  }, [currentJ1, currentJ2, cap1, cap2, target, solutionSteps, visitedSet]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-purple-500/20">
      {/* ── Top Glass Navigation Header ── */}
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
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-500 shadow-sm">
              <FlaskConical size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-foreground">
                  Water Jug State-Space Search &amp; Production Rules Studio
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                  Bézout GCD Engine
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                State-space graph traversal, production rule system (R1–R8), and Diophantine solvability proofs
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              initProblem();
              setIsRunning(true);
            }}
            disabled={isImpossible}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-sm shadow-emerald-500/25 cursor-pointer disabled:opacity-40"
            title="Auto-solve and animate step-by-step state transitions"
          >
            <Sparkles size={14} />
            <span>Auto Solve</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            disabled={isImpossible || isSolved}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-40 ${
              isRunning
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25"
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25"
            }`}
          >
            {isRunning ? <Pause size={14} /> : <Play size={14} />}
            <span>{isRunning ? "Pause" : "Play"}</span>
          </button>

          <button
            type="button"
            onClick={stepForward}
            disabled={isRunning || isSolved || isImpossible}
            className="px-3 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted transition shadow-2xs cursor-pointer disabled:opacity-40"
            title="Step 1 Production Rule"
          >
            Step
          </button>

          <button
            type="button"
            onClick={initProblem}
            className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-2xs cursor-pointer"
            title="Reset Jugs"
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
            { id: "visualizer", label: "Fluid Simulation & 2D State Lattice", icon: FlaskConical },
            { id: "production_rules", label: "Production Rules & Search Trajectory", icon: Layers },
            { id: "theory", label: "Bézout's Identity & Diophantine Formulary", icon: Calculator },
            { id: "diagnostics", label: "State Lattice Density & Optimality", icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === "theory") setMilestones((p) => ({ ...p, analyzedBezoutGCD: true }));
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
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 p-4 sm:p-5 bg-card border border-border rounded-3xl shadow-sm">
          {/* 1. Jug 1 Capacity */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <span>Jug 1 Capacity ($C_1$)</span>
              <span className="font-mono text-cyan-400 font-bold">{cap1}L</span>
            </div>
            <input
              type="range"
              min={2}
              max={12}
              step={1}
              value={cap1}
              onChange={(e) => setCap1(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* 2. Jug 2 Capacity */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <span>Jug 2 Capacity ($C_2$)</span>
              <span className="font-mono text-purple-400 font-bold">{cap2}L</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={cap2}
              onChange={(e) => setCap2(parseInt(e.target.value, 10))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* 3. Target Water Amount */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <span>Target Amount ($T$)</span>
              <span className="font-mono text-emerald-400 font-bold">{target}L</span>
            </div>
            <input
              type="range"
              min={1}
              max={Math.max(cap1, cap2)}
              step={1}
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* 4. Search Algorithm */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              State Search Strategy
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as SearchAlgorithm)}
              className="w-full px-3 py-1.5 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="bfs">BFS (Shortest Path / Min Pours)</option>
              <option value="a_star">A* Heuristic Search (Manhattan h)</option>
              <option value="dfs">DFS (Deep Exploration)</option>
            </select>
          </div>

          {/* 5. Playback Speed */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <span>Animation Delay</span>
              <span className="font-mono text-foreground font-bold">{speedMs}ms</span>
            </div>
            <input
              type="range"
              min={50}
              max={600}
              step={50}
              value={speedMs}
              onChange={(e) => setSpeedMs(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </section>

        {/* ── TAB 1: Visualizer ── */}
        {activeTab === "visualizer" && (
          <div className="space-y-6">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Canvas (7 Cols): Realistic Glass Jugs Fluid Canvas */}
              <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        Fluid Decanting &amp; Liquid Level Simulation
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        Target goal: Isolate exactly {target}L in either container
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20">
                    GCD({cap1}, {cap2}) = {gcdVal}L (Solvable: {isSolvableMath ? "YES" : "NO"})
                  </span>
                </div>

                {/* Glass Fluid Arena Canvas */}
                <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border border-border flex items-center justify-center">
                  <canvas
                    ref={liquidCanvasRef}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between gap-3 p-3 bg-muted/30 border border-border rounded-2xl flex-wrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-mono font-black uppercase border ${
                        isSolved
                          ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                          : isImpossible
                          ? "bg-rose-500/15 text-rose-500 border-rose-500/30"
                          : isRunning
                          ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                          : "bg-purple-500/15 text-purple-400 border-purple-500/30"
                      }`}
                    >
                      {isSolved
                        ? `TARGET REACHED (${target}L ISOLATED)`
                        : isImpossible
                        ? "MATHEMATICALLY IMPOSSIBLE"
                        : isRunning
                        ? `STEP ${currentStepIndex} / ${solutionSteps.length - 1}`
                        : "READY"}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-muted-foreground">
                    Action: <strong className="text-foreground">{solutionSteps[currentStepIndex]?.action || "Waiting"}</strong>
                  </span>
                </div>
              </div>

              {/* Right: 2D State Lattice & Telemetry (5 Cols) */}
              <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Grid size={14} className="text-purple-500" />
                    <h3 className="text-sm font-bold text-foreground">
                      2D State Lattice (J1, J2) in Z²
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    States: {(cap1 + 1) * (cap2 + 1)}
                  </span>
                </div>

                {/* State Space Mini-Canvas */}
                <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border border-border flex items-center justify-center">
                  <canvas
                    ref={stateSpaceCanvasRef}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* 4 Quick Stat Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/40 border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      Current State
                    </span>
                    <span className="text-xl font-black font-mono text-purple-400 mt-0.5 block">
                      ({currentJ1}, {currentJ2})
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      Shortest Path Steps
                    </span>
                    <span className="text-xl font-black font-mono text-emerald-400 mt-0.5 block">
                      {solutionSteps.length > 0 ? solutionSteps.length - 1 : 0} pours
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      Nodes Explored
                    </span>
                    <span className="text-xl font-black font-mono text-cyan-400 mt-0.5 block">
                      {nodesExplored}
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      Bézout Solution
                    </span>
                    <span className="text-xs font-black font-mono text-foreground mt-1.5 block">
                      {cap1}({bezoutResult.x}) + {cap2}({bezoutResult.y}) = {bezoutResult.gcd}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── TAB 2: Production Rules & Search Trajectory ── */}
        {activeTab === "production_rules" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-base font-black text-foreground">
                Production Rule Trajectory &amp; State Transitions
              </h3>
              <p className="text-xs text-muted-foreground">
                Step-by-step trace of state transitions $(x, y) \to (x', y')$ generated by production rules $R_1 \dots R_8$.
              </p>
            </div>

            <div className="overflow-x-auto p-4 bg-slate-950 rounded-2xl border border-border max-h-96">
              <table className="w-full text-left font-mono text-xs text-slate-200">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground text-[10px] font-black uppercase">
                    <th className="p-2.5">Step #</th>
                    <th className="p-2.5">Production Rule</th>
                    <th className="p-2.5">State (J1, J2)</th>
                    <th className="p-2.5">Applied Action Description</th>
                    <th className="p-2.5 text-emerald-400">Target Proximity</th>
                  </tr>
                </thead>
                <tbody>
                  {solutionSteps.map((s, idx) => {
                    const isTargetReached = s.j1 === target || s.j2 === target;
                    return (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="p-2.5 font-bold text-slate-400">#{idx}</td>
                        <td className="p-2.5 text-purple-400 font-bold">{s.ruleId}</td>
                        <td className="p-2.5 font-black text-cyan-300">({s.j1}L, {s.j2}L)</td>
                        <td className="p-2.5 text-slate-300">{s.action}</td>
                        <td className="p-2.5 font-bold">
                          {isTargetReached ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                              ★ GOAL REACHED
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Δ = {Math.min(Math.abs(s.j1 - target), Math.abs(s.j2 - target))}L
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── TAB 3: Mathematical Theory & Diophantine Solvability ── */}
        {activeTab === "theory" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-foreground">
                Mathematical Foundations: State-Space Production Systems &amp; Diophantine Solvability
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Formal mathematical formulation of the Water Jug problem via Bézout&apos;s Identity, GCD Number Theory, and State Transition Operators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Bézout's Identity & GCD Proof */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-cyan-500 font-bold text-sm">
                  <Calculator size={16} />
                  <span>1. Bézout&apos;s Identity &amp; Linear Diophantine Proof</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-cyan-300 space-y-1.5 border border-border">
                  <div>{"a·x + b·y = d,    where d = gcd(a, b)"}</div>
                  <div>{"Target T is solvable iff:  T ≤ max(a, b)  AND  T ≡ 0 (mod gcd(a, b))"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every pour operation adds or subtracts multiples of capacities $a$ and $b$. Thus, any reachable volume must be an exact multiple of $\gcd(a, b)$.
                </p>
              </div>

              {/* 2. Formal Production Rules */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                  <Layers size={16} />
                  <span>2. Production Rule System (R1–R8)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-purple-300 space-y-1.5 border border-border">
                  <div>{"R1: If x < a → (a, y)  [Fill J1]"}</div>
                  <div>{"R2: If y < b → (x, b)  [Fill J2]"}</div>
                  <div>{"R5: If x + y ≥ b → (x - (b - y), b)  [Pour J1→J2 until full]"}</div>
                  <div>{"R6: If x + y ≤ b → (0, x + y)  [Pour all J1→J2]"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Defines the complete set of discrete transition operators transforming current state $(x, y)$ into successors.
                </p>
              </div>

              {/* 3. State Lattice Space Complexity */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                  <Grid size={16} />
                  <span>3. State-Space Lattice Cardinality</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-amber-300 space-y-1.5 border border-border">
                  <div>{"|S| = (a + 1) · (b + 1)"}</div>
                  <div>{"BFS Time Complexity: O(|V| + |E|) = O(a · b)"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Because state space is finite and discrete, BFS is guaranteed to find the globally minimal number of decanting steps.
                </p>
              </div>

              {/* 4. A* Admissible Heuristic */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                  <Sparkles size={16} />
                  <span>4. A* Admissible Heuristic Distance</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-emerald-300 space-y-1.5 border border-border">
                  <div>{"h(x, y) = min(|x - T|, |y - T|) / gcd(a, b)"}</div>
                  <div>{"h(s) ≤ h*(s)  (Admissible & Consistent)"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Guides search frontier towards states nearest to the target volume without overestimating remaining pour steps.
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
                Search Efficiency &amp; State Space Coverage
              </h3>
              <p className="text-xs text-muted-foreground">
                Analyze total reachable states, frontier expansion, and search algorithm comparison.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Lattice State Coverage</span>
                <span className="text-2xl font-black font-mono text-cyan-400">
                  {Math.round((visitedSet.size / ((cap1 + 1) * (cap2 + 1))) * 100)}%
                </span>
                <p className="text-[10px] text-muted-foreground">
                  {visitedSet.size} visited states out of {(cap1 + 1) * (cap2 + 1)} total possible configurations.
                </p>
              </div>

              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Optimality Guarantee</span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {algorithm === "bfs" ? "OPTIMAL" : algorithm === "a_star" ? "A* OPTIMAL" : "SUB-OPTIMAL (DFS)"}
                </span>
                <p className="text-[10px] text-muted-foreground">
                  {algorithm === "bfs"
                    ? "BFS guarantees minimum step sequence."
                    : "Heuristic search prunes non-promising branches."}
                </p>
              </div>

              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Branching Factor</span>
                <span className="text-2xl font-black font-mono text-purple-400">b ≈ 6</span>
                <p className="text-[10px] text-muted-foreground">
                  Up to 6 valid production rules applicable at each state.
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
                State-Space Search &amp; Decanting Mastery Objectives
              </h4>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-500">+50 XP Per Milestone</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: "solvedDieHard",
                label: "Solve Die Hard 5L/3L → 4L",
                desc: "Isolate exactly 4L using 5L and 3L jugs in minimal decanting steps.",
                done: milestones.solvedDieHard,
              },
              {
                id: "analyzedBezoutGCD",
                label: "Analyze Bézout GCD Condition",
                desc: "Verify Diophantine solvability using the Extended Euclidean algorithm.",
                done: milestones.analyzedBezoutGCD,
              },
              {
                id: "comparedBFSDFS",
                label: "Compare BFS vs A* Optimality",
                desc: "Benchmark shortest path BFS against heuristic A* exploration.",
                done: milestones.comparedBFSDFS,
              },
              {
                id: "analyzedStateSpace",
                label: "Study 2D State Lattice",
                desc: "Inspect discrete $(J_1, J_2)$ coordinate trajectories on the state graph.",
                done: milestones.analyzedStateSpace,
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
          labId="computer-science/ai-problem/water-jug"
          currentParams={{
            cap1,
            cap2,
            target,
            algorithm,
            isSolved,
          }}
        />
      </main>
    </div>
  );
}