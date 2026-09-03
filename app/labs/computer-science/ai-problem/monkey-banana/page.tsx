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
  Box,
  CornerDownRight,
  Footprints,
  ArrowUpCircle,
  Check,
} from "lucide-react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

// ── Types & STRIPS Planning Formalisms ─────────────────────────────────
type RoomLocation = "door" | "window" | "center" | "corner";
type MonkeyElevation = "floor" | "box";
type BananaStatus = "hanging" | "grasped";

interface WorldState {
  monkeyPos: RoomLocation;
  monkeyElevation: MonkeyElevation;
  boxPos: RoomLocation;
  bananaStatus: BananaStatus;
}

interface STRIPSOperator {
  id: string;
  name: string;
  actionType: "walk" | "push" | "climb" | "grasp";
  preconditions: string[];
  addList: string[];
  deleteList: string[];
  description: string;
}

interface PlanStep {
  stepNum: number;
  op: STRIPSOperator;
  fromState: WorldState;
  toState: WorldState;
  explanation: string;
}

// ── Room Anchor Layout Coordinates (Normalized %) ─────────────────────
const ROOM_ANCHORS: Record<RoomLocation, { name: string; xPct: number; label: string }> = {
  door: { name: "Door", xPct: 0.18, label: "🚪 Door" },
  center: { name: "Center (Under Banana)", xPct: 0.5, label: "📍 Center" },
  window: { name: "Window", xPct: 0.82, label: "🪟 Window" },
  corner: { name: "Far Corner", xPct: 0.92, label: "📦 Corner" },
};

// ── STRIPS Domain Operators ────────────────────────────────────────────
const STRIPS_OPERATORS: STRIPSOperator[] = [
  {
    id: "OP_WALK",
    name: "Walk(X, Y)",
    actionType: "walk",
    preconditions: ["At(Monkey, X)", "On(Monkey, Floor)", "X ≠ Y"],
    addList: ["At(Monkey, Y)"],
    deleteList: ["At(Monkey, X)"],
    description: "Monkey walks across the room floor from location X to location Y.",
  },
  {
    id: "OP_PUSH",
    name: "Push(Box, X, Y)",
    actionType: "push",
    preconditions: ["At(Monkey, X)", "At(Box, X)", "On(Monkey, Floor)", "X ≠ Y"],
    addList: ["At(Monkey, Y)", "At(Box, Y)"],
    deleteList: ["At(Monkey, X)", "At(Box, X)"],
    description: "Monkey pushes the heavy wooden crate from location X to location Y.",
  },
  {
    id: "OP_CLIMB",
    name: "ClimbUp(Box, X)",
    actionType: "climb",
    preconditions: ["At(Monkey, X)", "At(Box, X)", "On(Monkey, Floor)"],
    addList: ["On(Monkey, Box)"],
    deleteList: ["On(Monkey, Floor)"],
    description: "Monkey climbs onto the wooden crate at location X.",
  },
  {
    id: "OP_GRASP",
    name: "GraspBanana(Center)",
    actionType: "grasp",
    preconditions: ["At(Box, Center)", "On(Monkey, Box)", "Hanging(Banana, Center)"],
    addList: ["Has(Monkey, Banana)"],
    deleteList: ["Hanging(Banana, Center)"],
    description: "Monkey reaches up from on top of the crate to grasp the bananas.",
  },
];

export default function MonkeyBananaPlanningLab() {
  const { completeExperiment } = useLab(
    "computer-science/ai-problem/monkey-banana",
    "computerScience",
    "simulation"
  );

  // ── Initial State Configurations ─────────────────────────────────────
  const [initMonkeyPos, setInitMonkeyPos] = useState<RoomLocation>("door");
  const [initBoxPos, setInitBoxPos] = useState<RoomLocation>("window");

  // ── Current Dynamic Simulation State ─────────────────────────────────
  const [worldState, setWorldState] = useState<WorldState>({
    monkeyPos: "door",
    monkeyElevation: "floor",
    boxPos: "window",
    bananaStatus: "hanging",
  });

  // ── Automated STRIPS Planner State ───────────────────────────────────
  const [planSequence, setPlanSequence] = useState<PlanStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isGoalReached, setIsGoalReached] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(600);

  // Goal Stack representation
  const [goalStack, setGoalStack] = useState<string[]>(["Has(Monkey, Banana)"]);

  // UI Tabs & Milestones
  const [activeTab, setActiveTab] = useState<"visualizer" | "strips_tensor" | "theory" | "diagnostics">("visualizer");
  const [milestones, setMilestones] = useState({
    executedSTRIPSPlan: false,
    synthesizedGoalStack: false,
    resolvedBoxAlignment: false,
    analyzedOperators: false,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ── STRIPS Automated Planner (BFS State-Space Search) ────────────────
  const generateSTRIPSPlan = useCallback((start: WorldState): PlanStep[] => {
    interface QueueNode {
      state: WorldState;
      path: PlanStep[];
    }

    const stateKey = (s: WorldState) =>
      `${s.monkeyPos}|${s.monkeyElevation}|${s.boxPos}|${s.bananaStatus}`;

    const queue: QueueNode[] = [{ state: { ...start }, path: [] }];
    const visited = new Set<string>([stateKey(start)]);

    const locations: RoomLocation[] = ["door", "window", "center"];

    while (queue.length > 0) {
      const { state: curr, path } = queue.shift()!;

      // Goal Test: Has(Monkey, Banana)
      if (curr.bananaStatus === "grasped") {
        return path;
      }

      // Generate Valid STRIPS Transitions:
      // 1. Grasp
      if (
        curr.boxPos === "center" &&
        curr.monkeyPos === "center" &&
        curr.monkeyElevation === "box" &&
        curr.bananaStatus === "hanging"
      ) {
        const nextState: WorldState = { ...curr, bananaStatus: "grasped" };
        const op = STRIPS_OPERATORS.find((o) => o.actionType === "grasp")!;
        const step: PlanStep = {
          stepNum: path.length + 1,
          op,
          fromState: curr,
          toState: nextState,
          explanation: "Monkey is on the box at Center directly underneath the bananas. Grasps bananas!",
        };
        const k = stateKey(nextState);
        if (!visited.has(k)) {
          visited.add(k);
          queue.push({ state: nextState, path: [...path, step] });
        }
      }

      // 2. Climb Up
      if (
        curr.monkeyElevation === "floor" &&
        curr.monkeyPos === curr.boxPos
      ) {
        const nextState: WorldState = { ...curr, monkeyElevation: "box" };
        const op = STRIPS_OPERATORS.find((o) => o.actionType === "climb")!;
        const step: PlanStep = {
          stepNum: path.length + 1,
          op,
          fromState: curr,
          toState: nextState,
          explanation: `Monkey climbs onto the wooden crate at ${curr.boxPos.toUpperCase()}.`,
        };
        const k = stateKey(nextState);
        if (!visited.has(k)) {
          visited.add(k);
          queue.push({ state: nextState, path: [...path, step] });
        }
      }

      // 3. Push Box
      if (
        curr.monkeyElevation === "floor" &&
        curr.monkeyPos === curr.boxPos
      ) {
        for (const loc of locations) {
          if (loc !== curr.boxPos) {
            const nextState: WorldState = {
              ...curr,
              monkeyPos: loc,
              boxPos: loc,
            };
            const op = STRIPS_OPERATORS.find((o) => o.actionType === "push")!;
            const step: PlanStep = {
              stepNum: path.length + 1,
              op,
              fromState: curr,
              toState: nextState,
              explanation: `Monkey pushes crate from ${curr.boxPos.toUpperCase()} to ${loc.toUpperCase()}.`,
            };
            const k = stateKey(nextState);
            if (!visited.has(k)) {
              visited.add(k);
              queue.push({ state: nextState, path: [...path, step] });
            }
          }
        }
      }

      // 4. Walk
      if (curr.monkeyElevation === "floor") {
        for (const loc of locations) {
          if (loc !== curr.monkeyPos) {
            const nextState: WorldState = { ...curr, monkeyPos: loc };
            const op = STRIPS_OPERATORS.find((o) => o.actionType === "walk")!;
            const step: PlanStep = {
              stepNum: path.length + 1,
              op,
              fromState: curr,
              toState: nextState,
              explanation: `Monkey walks from ${curr.monkeyPos.toUpperCase()} to ${loc.toUpperCase()}.`,
            };
            const k = stateKey(nextState);
            if (!visited.has(k)) {
              visited.add(k);
              queue.push({ state: nextState, path: [...path, step] });
            }
          }
        }
      }
    }

    return [];
  }, []);

  // ── Initialize Problem & Compute Plan ────────────────────────────────
  const initProblem = useCallback(() => {
    const startState: WorldState = {
      monkeyPos: initMonkeyPos,
      monkeyElevation: "floor",
      boxPos: initBoxPos,
      bananaStatus: "hanging",
    };

    setWorldState(startState);
    setCurrentStepIdx(0);
    setIsRunning(false);
    setIsGoalReached(false);
    setGoalStack(["Has(Monkey, Banana)", "On(Monkey, Box)", "At(Box, Center)"]);

    const plan = generateSTRIPSPlan(startState);
    setPlanSequence(plan);
  }, [initMonkeyPos, initBoxPos, generateSTRIPSPlan]);

  useEffect(() => {
    initProblem();
  }, [initProblem]);

  // ── Step Execution ───────────────────────────────────────────────────
  const stepForward = useCallback(() => {
    if (planSequence.length === 0) return;

    if (currentStepIdx < planSequence.length) {
      const step = planSequence[currentStepIdx];
      setWorldState(step.toState);
      setCurrentStepIdx((p) => p + 1);

      if (step.toState.bananaStatus === "grasped") {
        setIsGoalReached(true);
        setIsRunning(false);
        setMilestones((p) => ({
          ...p,
          executedSTRIPSPlan: true,
          synthesizedGoalStack: true,
          resolvedBoxAlignment: true,
        }));
        completeExperiment();
      }
    } else {
      setIsRunning(false);
    }
  }, [planSequence, currentStepIdx, completeExperiment]);

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

  // ── High-DPI 2D Physical Environment Canvas ──────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
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

    const floorY = height - 55;

    // 1. Room Walls & Floor
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, width, height);

    // Floor Base
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, floorY, width, 55);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(width, floorY);
    ctx.stroke();

    // 2. Room Anchors (Door, Center, Window)
    const doorX = width * ROOM_ANCHORS.door.xPct;
    const centerX = width * ROOM_ANCHORS.center.xPct;
    const windowX = width * ROOM_ANCHORS.window.xPct;

    // Door Graphic
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.strokeRect(doorX - 25, floorY - 90, 50, 90);
    ctx.fillStyle = "rgba(56, 189, 248, 0.1)";
    ctx.fillRect(doorX - 25, floorY - 90, 50, 90);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("DOOR", doorX, floorY - 98);

    // Window Graphic
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 3;
    ctx.strokeRect(windowX - 30, floorY - 110, 60, 60);
    ctx.fillStyle = "rgba(168, 85, 247, 0.1)";
    ctx.fillRect(windowX - 30, floorY - 110, 60, 60);
    ctx.fillStyle = "#c084fc";
    ctx.font = "bold 10px monospace";
    ctx.fillText("WINDOW", windowX, floorY - 118);

    // 3. Bananas Hanging from Ceiling
    const bananaY = 65;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, bananaY);
    ctx.stroke();

    // Bananas Bunch (Yellow Glowing)
    if (worldState.bananaStatus === "hanging") {
      ctx.shadowColor = "#facc15";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(centerX - 6, bananaY + 8, 8, 0, Math.PI * 2);
      ctx.arc(centerX + 6, bananaY + 8, 8, 0, Math.PI * 2);
      ctx.arc(centerX, bananaY + 14, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px monospace";
      ctx.fillText("🍌 BANANAS (GOAL)", centerX, bananaY + 32);
    }

    // 4. Wooden Crate / Box
    const boxAnchorX = width * ROOM_ANCHORS[worldState.boxPos].xPct;
    const boxW = 55;
    const boxH = 45;
    const boxY = floorY - boxH;

    ctx.fillStyle = "#b45309";
    ctx.fillRect(boxAnchorX - boxW / 2, boxY, boxW, boxH);
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(boxAnchorX - boxW / 2, boxY, boxW, boxH);

    // Crate cross brace
    ctx.beginPath();
    ctx.moveTo(boxAnchorX - boxW / 2, boxY);
    ctx.lineTo(boxAnchorX + boxW / 2, boxY + boxH);
    ctx.moveTo(boxAnchorX + boxW / 2, boxY);
    ctx.lineTo(boxAnchorX - boxW / 2, boxY + boxH);
    ctx.stroke();

    ctx.fillStyle = "#fef3c7";
    ctx.font = "bold 9px monospace";
    ctx.fillText("CRATE", boxAnchorX, boxY + boxH / 2 + 3);

    // 5. Monkey Character
    const monkeyAnchorX = width * ROOM_ANCHORS[worldState.monkeyPos].xPct;
    const monkeyBaseY = worldState.monkeyElevation === "box" ? boxY - 35 : floorY - 35;

    // Monkey Glow
    ctx.shadowColor = "#10b981";
    ctx.shadowBlur = worldState.bananaStatus === "grasped" ? 25 : 8;

    // Monkey Body (Torso)
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(monkeyAnchorX, monkeyBaseY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Monkey Face & Ears
    ctx.fillStyle = "#34d399";
    ctx.beginPath();
    ctx.arc(monkeyAnchorX, monkeyBaseY - 14, 11, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(monkeyAnchorX - 4, monkeyBaseY - 15, 2.5, 0, Math.PI * 2);
    ctx.arc(monkeyAnchorX + 4, monkeyBaseY - 15, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Reaching Arms if grasping
    if (worldState.bananaStatus === "grasped") {
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(monkeyAnchorX - 10, monkeyBaseY - 10);
      ctx.lineTo(monkeyAnchorX - 12, monkeyBaseY - 38);
      ctx.moveTo(monkeyAnchorX + 10, monkeyBaseY - 10);
      ctx.lineTo(monkeyAnchorX + 12, monkeyBaseY - 38);
      ctx.stroke();

      // Bananas in hand
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(monkeyAnchorX, monkeyBaseY - 42, 9, 0, Math.PI * 2);
      ctx.fill();
    }

    // Label
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px monospace";
    ctx.fillText("🐒 MONKEY", monkeyAnchorX, monkeyBaseY - 30);

    ctx.restore();
  }, [worldState]);

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
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-sm">
              <Box size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-foreground">
                  STRIPS Classical Planning &amp; State-Space Studio
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  Means-Ends Analysis Engine
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Stanford Research Institute Problem Solver (STRIPS), Goal Stack Planning, and physical state transitions
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-sm shadow-emerald-500/25 cursor-pointer"
            title="Execute automated STRIPS planning sequence"
          >
            <Sparkles size={14} />
            <span>Auto Plan</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            disabled={isGoalReached}
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
            disabled={isRunning || isGoalReached}
            className="px-3 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted transition shadow-2xs cursor-pointer disabled:opacity-40"
            title="Step 1 STRIPS Action"
          >
            Step
          </button>

          <button
            type="button"
            onClick={initProblem}
            className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-2xs cursor-pointer"
            title="Reset Environment"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </header>

      {/* ── Main Studio Container ── */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: "visualizer", label: "2D Environment & Plan Execution", icon: Box },
            { id: "strips_tensor", label: "STRIPS Operators & Goal Stack", icon: Layers },
            { id: "theory", label: "Means-Ends Analysis (MEA) Formulary", icon: Calculator },
            { id: "diagnostics", label: "State Lattice & Plan Optimality", icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === "theory") setMilestones((p) => ({ ...p, analyzedOperators: true }));
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

        {/* ── Initial Room State Controls Bar ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-5 bg-card border border-border rounded-3xl shadow-sm">
          {/* 1. Initial Monkey Position */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Initial Monkey Location
            </label>
            <select
              value={initMonkeyPos}
              onChange={(e) => setInitMonkeyPos(e.target.value as RoomLocation)}
              className="w-full px-3 py-2 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="door">At Door (Default)</option>
              <option value="window">At Window</option>
              <option value="center">At Center</option>
            </select>
          </div>

          {/* 2. Initial Box Position */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Initial Wooden Crate Location
            </label>
            <select
              value={initBoxPos}
              onChange={(e) => setInitBoxPos(e.target.value as RoomLocation)}
              className="w-full px-3 py-2 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="window">At Window (Default)</option>
              <option value="door">At Door</option>
              <option value="center">At Center</option>
            </select>
          </div>

          {/* 3. Goal Condition Target */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Planning Goal Predicate
            </label>
            <div className="p-2 bg-muted/60 border border-border rounded-xl text-xs font-mono font-black text-amber-500 flex items-center gap-1.5">
              <Sparkles size={13} />
              <span>Has(Monkey, Banana)</span>
            </div>
          </div>

          {/* 4. Playback Speed */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <span>Step Transition Speed</span>
              <span className="font-mono text-foreground font-bold">{speedMs}ms</span>
            </div>
            <input
              type="range"
              min={200}
              max={1200}
              step={100}
              value={speedMs}
              onChange={(e) => setSpeedMs(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </section>

        {/* ── TAB 1: 2D Environment & Plan Execution ── */}
        {activeTab === "visualizer" && (
          <div className="space-y-6">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Canvas: Physical 2D Environment (7 Cols) */}
              <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        2D Physical Environment &amp; Anchor Positions
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        Classic AI benchmark problem originally proposed by John McCarthy (1963)
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-muted-foreground font-mono bg-muted/60 px-2 py-1 rounded-lg">
                    Plan length: {planSequence.length} actions
                  </span>
                </div>

                {/* Canvas Arena */}
                <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border border-border flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Status Indicator Bar */}
                <div className="flex items-center justify-between gap-3 p-3 bg-muted/30 border border-border rounded-2xl flex-wrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-mono font-black uppercase border ${
                        isGoalReached
                          ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                          : isRunning
                          ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
                          : "bg-purple-500/15 text-purple-400 border-purple-500/30"
                      }`}
                    >
                      {isGoalReached
                        ? "GOAL REACHED: HAS(MONKEY, BANANA)"
                        : isRunning
                        ? `ACTION ${currentStepIdx} / ${planSequence.length}`
                        : "READY"}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-muted-foreground">
                    Action: <strong className="text-foreground">{planSequence[currentStepIdx - 1]?.op.name || "Standing by"}</strong>
                  </span>
                </div>
              </div>

              {/* Right: STRIPS Plan Steps & Goal Stack (5 Cols) */}
              <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-amber-500" />
                    <h3 className="text-sm font-bold text-foreground">
                      Synthesized STRIPS Plan Steps
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Step {currentStepIdx} of {planSequence.length}
                  </span>
                </div>

                {/* Plan Step Timeline */}
                <div className="space-y-2 overflow-y-auto max-h-52 p-2 bg-slate-950 rounded-2xl border border-border">
                  {planSequence.map((step, idx) => {
                    const isExecuted = idx < currentStepIdx;
                    const isCurrent = idx === currentStepIdx - 1;

                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border transition ${
                          isCurrent
                            ? "bg-amber-500/15 border-amber-500/40 text-foreground"
                            : isExecuted
                            ? "bg-emerald-500/10 border-emerald-500/20 text-muted-foreground"
                            : "bg-muted/30 border-border text-muted-foreground/60"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono font-bold">
                          <span className={isCurrent ? "text-amber-400" : isExecuted ? "text-emerald-400" : ""}>
                            #{step.stepNum}: {step.op.name}
                          </span>
                          {isExecuted && <Check size={14} className="text-emerald-400" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">{step.explanation}</p>
                      </div>
                    );
                  })}
                </div>

                {/* 4 Stat Telemetry Badges */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/40 border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      Monkey State
                    </span>
                    <span className="text-xs font-black font-mono text-cyan-400 mt-1 block">
                      At({worldState.monkeyPos.toUpperCase()}), On({worldState.monkeyElevation.toUpperCase()})
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      Box State
                    </span>
                    <span className="text-xs font-black font-mono text-amber-400 mt-1 block">
                      At({worldState.boxPos.toUpperCase()})
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── TAB 2: STRIPS Operator Tensor ── */}
        {activeTab === "strips_tensor" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-base font-black text-foreground">
                STRIPS Planning Operators (Action, Preconditions, Add-List, Delete-List)
              </h3>
              <p className="text-xs text-muted-foreground">
                Formal state transition schemas mapping preconditions to add/delete predicate sets.
              </p>
            </div>

            <div className="overflow-x-auto p-4 bg-slate-950 rounded-2xl border border-border">
              <table className="w-full text-left font-mono text-xs text-slate-200">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground text-[10px] font-black uppercase">
                    <th className="p-2.5">Operator</th>
                    <th className="p-2.5">Preconditions (Pre)</th>
                    <th className="p-2.5 text-emerald-400">Add-List (Add)</th>
                    <th className="p-2.5 text-rose-400">Delete-List (Del)</th>
                    <th className="p-2.5">Operator Semantics</th>
                  </tr>
                </thead>
                <tbody>
                  {STRIPS_OPERATORS.map((op) => (
                    <tr key={op.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-2.5 font-bold text-amber-400">{op.name}</td>
                      <td className="p-2.5">
                        <div className="flex flex-wrap gap-1">
                          {op.preconditions.map((p) => (
                            <span key={p} className="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 text-[10px] font-bold">
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-2.5">
                        <div className="flex flex-wrap gap-1">
                          {op.addList.map((a) => (
                            <span key={a} className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                              +{a}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-2.5">
                        <div className="flex flex-wrap gap-1">
                          {op.deleteList.map((d) => (
                            <span key={d} className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                              -{d}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-2.5 text-slate-400">{op.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── TAB 3: Mathematical Theory & MEA Formulary ── */}
        {activeTab === "theory" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-foreground">
                Mathematical Foundations: STRIPS Classical Planning &amp; Means-Ends Analysis
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Formal mathematical definition of STRIPS planning state tuples $\langle P, O, I, G \rangle$ and Goal Stack Planning reduction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Formal STRIPS Problem Definition */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                  <Calculator size={16} />
                  <span>1. Formal STRIPS Quadruple</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-amber-300 space-y-1.5 border border-border">
                  <div>{"STRIPS = ⟨ P, O, I, G ⟩"}</div>
                  <div>{"P: Set of first-order propositional state fluents"}</div>
                  <div>{"O: Set of planning operators with (Pre, Add, Del)"}</div>
                  <div>{"I: Initial state conjunction, G: Goal state conjunction"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  State transition function: Result(S, a) = (S \ Del(a)) ∪ Add(a).
                </p>
              </div>

              {/* 2. Means-Ends Analysis (MEA) */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-cyan-500 font-bold text-sm">
                  <Split size={16} />
                  <span>2. Means-Ends Analysis (MEA) &amp; Difference Table</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-cyan-300 space-y-1.5 border border-border">
                  <div>{"Δ(S, G) = {g ∈ G : g ∉ S}  (Difference Set)"}</div>
                  <div>{"Select operator a ∈ O whose Add(a) eliminates largest difference in Δ(S, G)"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Recursively reduces the gap between current state $S$ and goal $G$ by inserting operators and sub-goaling their preconditions.
                </p>
              </div>

              {/* 3. Goal Stack Invariant */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                  <Layers size={16} />
                  <span>3. Goal Stack Planning Invariant</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-purple-300 space-y-1.5 border border-border">
                  <div>{"Top of Stack: Sub-goal to satisfy"}</div>
                  <div>{"If top ∈ CurrentState → Pop stack"}</div>
                  <div>{"If top is Operator → Apply (Del/Add) to CurrentState"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Maintains a LIFO goal stack to handle sub-goal dependencies and precondition un-satisfaction.
                </p>
              </div>

              {/* 4. The Frame Problem Resolution */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                  <ShieldCheck size={16} />
                  <span>4. STRIPS Assumption on the Frame Problem</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-emerald-300 space-y-1.5 border border-border">
                  <div>{"∀ p ∉ (Add(a) ∪ Del(a)): p remains true in Result(S, a)"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  STRIPS solves the classical AI Frame Problem by explicitly defining only what changes, leaving all untouched fluents invariant.
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
                State-Space Search &amp; Plan Optimality Diagnostics
              </h3>
              <p className="text-xs text-muted-foreground">
                Analyze total reachable states ($3 \times 2 \times 3 \times 2 = 36$ states) and plan sequence efficiency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Reachable State Space</span>
                <span className="text-2xl font-black font-mono text-amber-500">|S| = 36</span>
                <p className="text-[10px] text-muted-foreground">
                  3 Monkey Pos × 2 Monkey On × 3 Box Pos × 2 Banana Status.
                </p>
              </div>

              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Synthesized Plan Length</span>
                <span className="text-2xl font-black font-mono text-emerald-500">{planSequence.length} Actions</span>
                <p className="text-[10px] text-muted-foreground">
                  Minimal optimal action sequence to reach goal state.
                </p>
              </div>

              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Planner Guarantee</span>
                <span className="text-2xl font-black font-mono text-cyan-400">STRIPS SOUND</span>
                <p className="text-[10px] text-muted-foreground">
                  Every step strictly satisfies operator preconditions.
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
                Classical Planning Mastery Objectives
              </h4>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-500">+50 XP Per Milestone</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: "executedSTRIPSPlan",
                label: "Synthesize STRIPS Plan",
                desc: "Compute and execute the optimal action sequence to obtain the bananas.",
                done: milestones.executedSTRIPSPlan,
              },
              {
                id: "synthesizedGoalStack",
                label: "Means-Ends Goal Stack",
                desc: "Decompose the master goal into precondition sub-goals.",
                done: milestones.synthesizedGoalStack,
              },
              {
                id: "resolvedBoxAlignment",
                label: "Resolve Box Alignment",
                desc: "Push the heavy crate to the Center anchor to enable vertical climb.",
                done: milestones.resolvedBoxAlignment,
              },
              {
                id: "analyzedOperators",
                label: "Inspect STRIPS Add/Del Sets",
                desc: "Review formal mathematical definitions of state fluents and frame axioms.",
                done: milestones.analyzedOperators,
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
          labId="computer-science/ai-problem/monkey-banana"
          currentParams={{
            initMonkeyPos,
            initBoxPos,
            planLength: planSequence.length,
            isGoalReached,
          }}
        />
      </main>
    </div>
  );
}