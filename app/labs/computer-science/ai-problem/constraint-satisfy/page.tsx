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
} from "lucide-react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

// ── Types & CSP Formulations ──────────────────────────────────────────
type CSPPreset = "australia_map" | "n_queens_4" | "simple_graph" | "bipartite_trap";
type SearchAlgorithm = "backtracking_mrv_lcv" | "pure_backtracking" | "forward_checking" | "ac3_preprocessing";

interface VariableNode {
  id: string;
  name: string;
  x: number;
  y: number;
  domain: string[];
}

interface ConstraintEdge {
  var1: string;
  var2: string;
}

interface CSPProblemDef {
  name: string;
  subtitle: string;
  desc: string;
  variables: VariableNode[];
  domainValues: string[];
  constraints: ConstraintEdge[];
}

// ── Color Schemes ──────────────────────────────────────────────────────
const COLOR_PALETTE: Record<string, { bg: string; border: string; text: string; name: string }> = {
  red: { bg: "rgba(239, 68, 68, 0.85)", border: "#ef4444", text: "#fee2e2", name: "Red" },
  green: { bg: "rgba(16, 185, 129, 0.85)", border: "#10b981", text: "#d1fae5", name: "Green" },
  blue: { bg: "rgba(59, 130, 246, 0.85)", border: "#3b82f6", text: "#dbeafe", name: "Blue" },
  amber: { bg: "rgba(245, 158, 11, 0.85)", border: "#f59e0b", text: "#fef3c7", name: "Amber" },
};

// ── Classic CSP Benchmark Problems ────────────────────────────────────
const CSP_PRESETS: Record<CSPPreset, CSPProblemDef> = {
  australia_map: {
    name: "Australia Map Coloring (Russell & Norvig)",
    subtitle: "7 Variables, 3 Colors, 9 Binary Constraints",
    desc: "The classic AI benchmark: Color Western Australia (WA), Northern Territory (NT), South Australia (SA), Queensland (Q), New South Wales (NSW), Victoria (V), and Tasmania (T) such that no adjacent regions share the same color.",
    domainValues: ["red", "green", "blue"],
    variables: [
      { id: "WA", name: "Western Australia (WA)", x: 80, y: 150, domain: ["red", "green", "blue"] },
      { id: "NT", name: "Northern Territory (NT)", x: 210, y: 80, domain: ["red", "green", "blue"] },
      { id: "SA", name: "South Australia (SA)", x: 210, y: 220, domain: ["red", "green", "blue"] },
      { id: "Q", name: "Queensland (Q)", x: 340, y: 100, domain: ["red", "green", "blue"] },
      { id: "NSW", name: "New South Wales (NSW)", x: 360, y: 220, domain: ["red", "green", "blue"] },
      { id: "V", name: "Victoria (V)", x: 310, y: 300, domain: ["red", "green", "blue"] },
      { id: "T", name: "Tasmania (T)", x: 420, y: 320, domain: ["red", "green", "blue"] },
    ],
    constraints: [
      { var1: "WA", var2: "NT" },
      { var1: "WA", var2: "SA" },
      { var1: "NT", var2: "SA" },
      { var1: "NT", var2: "Q" },
      { var1: "SA", var2: "Q" },
      { var1: "SA", var2: "NSW" },
      { var1: "SA", var2: "V" },
      { var1: "Q", var2: "NSW" },
      { var1: "NSW", var2: "V" },
    ],
  },
  simple_graph: {
    name: "5-Node Planar Wheel Graph",
    subtitle: "5 Variables, 3 Colors, 7 Constraints",
    desc: "A central hub node connected to 4 perimeter cycle vertices. Demonstrates Degree Heuristic and MRV tie-breaking.",
    domainValues: ["red", "green", "blue"],
    variables: [
      { id: "A", name: "Hub Node (A)", x: 250, y: 190, domain: ["red", "green", "blue"] },
      { id: "B", name: "North (B)", x: 250, y: 70, domain: ["red", "green", "blue"] },
      { id: "C", name: "East (C)", x: 380, y: 190, domain: ["red", "green", "blue"] },
      { id: "D", name: "South (D)", x: 250, y: 310, domain: ["red", "green", "blue"] },
      { id: "E", name: "West (E)", x: 120, y: 190, domain: ["red", "green", "blue"] },
    ],
    constraints: [
      { var1: "A", var2: "B" },
      { var1: "A", var2: "C" },
      { var1: "A", var2: "D" },
      { var1: "A", var2: "E" },
      { var1: "B", var2: "C" },
      { var1: "C", var2: "D" },
      { var1: "D", var2: "E" },
      { var1: "E", var2: "B" },
    ],
  },
  n_queens_4: {
    name: "4-Queens Column Allocation",
    subtitle: "4 Variables (Q1-Q4), 4 Row Positions, Non-Attacking Arcs",
    desc: "Place 4 queens on a 4×4 chessboard such that no two queens attack each other along rows, columns, or diagonals.",
    domainValues: ["red", "green", "blue", "amber"],
    variables: [
      { id: "Q1", name: "Column 1 (Q1)", x: 100, y: 180, domain: ["red", "green", "blue", "amber"] },
      { id: "Q2", name: "Column 2 (Q2)", x: 200, y: 180, domain: ["red", "green", "blue", "amber"] },
      { id: "Q3", name: "Column 3 (Q3)", x: 300, y: 180, domain: ["red", "green", "blue", "amber"] },
      { id: "Q4", name: "Column 4 (Q4)", x: 400, y: 180, domain: ["red", "green", "blue", "amber"] },
    ],
    constraints: [
      { var1: "Q1", var2: "Q2" },
      { var1: "Q1", var2: "Q3" },
      { var1: "Q1", var2: "Q4" },
      { var1: "Q2", var2: "Q3" },
      { var1: "Q2", var2: "Q4" },
      { var1: "Q3", var2: "Q4" },
    ],
  },
  bipartite_trap: {
    name: "K4 Complete Graph (Coloring Trap)",
    subtitle: "4 Fully Connected Nodes with only 2 Colors Available",
    desc: "An unsolvable constraint configuration that demonstrates early failure detection and domain wipeout in AC-3.",
    domainValues: ["red", "green"],
    variables: [
      { id: "V1", name: "Vertex 1", x: 160, y: 100, domain: ["red", "green"] },
      { id: "V2", name: "Vertex 2", x: 340, y: 100, domain: ["red", "green"] },
      { id: "V3", name: "Vertex 3", x: 340, y: 280, domain: ["red", "green"] },
      { id: "V4", name: "Vertex 4", x: 160, y: 280, domain: ["red", "green"] },
    ],
    constraints: [
      { var1: "V1", var2: "V2" },
      { var1: "V1", var2: "V3" },
      { var1: "V1", var2: "V4" },
      { var1: "V2", var2: "V3" },
      { var1: "V2", var2: "V4" },
      { var1: "V3", var2: "V4" },
    ],
  },
};

export default function ConstraintSatisfactionLab() {
  const { completeExperiment } = useLab(
    "computer-science/ai-problem/constraint-satisfy",
    "computerScience",
    "simulation"
  );

  // ── Problem & Algorithm Controls ─────────────────────────────────────
  const [preset, setPreset] = useState<CSPPreset>("australia_map");
  const [algorithm, setAlgorithm] = useState<SearchAlgorithm>("backtracking_mrv_lcv");
  const [speedMs, setSpeedMs] = useState<number>(120);

  // ── CSP Solver State ─────────────────────────────────────────────────
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [domains, setDomains] = useState<Record<string, string[]>>({});
  const [currentVar, setCurrentVar] = useState<string | null>(null);
  const [activeEdge, setActiveEdge] = useState<ConstraintEdge | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [isUnsolvable, setIsUnsolvable] = useState<boolean>(false);

  // Search Telemetry
  const [stepCount, setStepCount] = useState<number>(0);
  const [constraintChecks, setConstraintChecks] = useState<number>(0);
  const [backtracksCount, setBacktracksCount] = useState<number>(0);
  const [searchLog, setSearchLog] = useState<
    { step: number; action: string; variable?: string; value?: string; status: "success" | "backtrack" | "prune" | "check" }[]
  >([]);

  // UI Tabs & Milestones
  const [activeTab, setActiveTab] = useState<"visualizer" | "domain_tensor" | "theory" | "diagnostics">("visualizer");
  const [milestones, setMilestones] = useState({
    solvedWithoutBacktracks: false,
    executedAC3: false,
    prunedWithMRV: false,
    analyzedFormulary: false,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeProblem = CSP_PRESETS[preset];

  // ── Initialize or Reset CSP Problem ──────────────────────────────────
  const initCSP = useCallback(() => {
    const initD: Record<string, string[]> = {};
    for (const v of activeProblem.variables) {
      initD[v.id] = [...activeProblem.domainValues];
    }
    setDomains(initD);
    setAssignments({});
    setCurrentVar(null);
    setActiveEdge(null);
    setIsRunning(false);
    setIsSolved(false);
    setIsUnsolvable(false);
    setStepCount(0);
    setConstraintChecks(0);
    setBacktracksCount(0);
    setSearchLog([
      {
        step: 0,
        action: `Initialized CSP '${activeProblem.name}' with ${activeProblem.variables.length} variables and ${activeProblem.constraints.length} constraints.`,
        status: "success",
      },
    ]);
  }, [activeProblem]);

  useEffect(() => {
    initCSP();
  }, [preset, initCSP]);

  // ── Consistency Check Helper ──────────────────────────────────────────
  const checkConsistent = useCallback(
    (varId: string, val: string, currentAssigns: Record<string, string>): boolean => {
      setConstraintChecks((p) => p + 1);
      for (const edge of activeProblem.constraints) {
        if (edge.var1 === varId && currentAssigns[edge.var2] === val) return false;
        if (edge.var2 === varId && currentAssigns[edge.var1] === val) return false;
      }
      return true;
    },
    [activeProblem]
  );

  // ── Heuristics: MRV (Minimum Remaining Values) & Degree Heuristic ──────
  const selectUnassignedVariable = useCallback(
    (currentAssigns: Record<string, string>, currentDom: Record<string, string[]>): string | null => {
      const unassigned = activeProblem.variables.filter((v) => !currentAssigns[v.id]);
      if (unassigned.length === 0) return null;

      if (algorithm === "pure_backtracking") {
        return unassigned[0].id; // Simple static order
      }

      // MRV (Minimum Remaining Values)
      let minDomSize = Infinity;
      let candidates: VariableNode[] = [];

      for (const v of unassigned) {
        const dSize = (currentDom[v.id] || []).length;
        if (dSize < minDomSize) {
          minDomSize = dSize;
          candidates = [v];
        } else if (dSize === minDomSize) {
          candidates.push(v);
        }
      }

      if (candidates.length === 1) return candidates[0].id;

      // Degree Heuristic tie-breaker: Variable with most constraints on other unassigned vars
      let maxDegree = -1;
      let bestVar = candidates[0].id;

      for (const cand of candidates) {
        const deg = activeProblem.constraints.filter((e) => {
          const other = e.var1 === cand.id ? e.var2 : e.var2 === cand.id ? e.var1 : null;
          return other && !currentAssigns[other];
        }).length;

        if (deg > maxDegree) {
          maxDegree = deg;
          bestVar = cand.id;
        }
      }

      return bestVar;
    },
    [activeProblem, algorithm]
  );

  // ── AC-3 Arc Consistency Preprocessing ─────────────────────────────────
  const runAC3 = () => {
    const queue: [string, string][] = [];
    for (const e of activeProblem.constraints) {
      queue.push([e.var1, e.var2]);
      queue.push([e.var2, e.var1]);
    }

    const newDom: Record<string, string[]> = {};
    for (const v of activeProblem.variables) {
      newDom[v.id] = [...(domains[v.id] || activeProblem.domainValues)];
    }

    let prunedCount = 0;

    while (queue.length > 0) {
      const [xi, xj] = queue.shift()!;
      let revised = false;

      const xiVals = [...newDom[xi]];
      for (const x of xiVals) {
        // Is there any y in D(xj) satisfying constraint (x != y)?
        const hasSupport = newDom[xj].some((y) => y !== x);
        if (!hasSupport) {
          newDom[xi] = newDom[xi].filter((v) => v !== x);
          revised = true;
          prunedCount++;
        }
      }

      if (revised) {
        if (newDom[xi].length === 0) {
          setIsUnsolvable(true);
          setSearchLog((prev) => [
            { step: stepCount + 1, action: `AC-3 detected Domain Wipeout on ${xi}. Problem is unsolvable.`, status: "backtrack" },
            ...prev,
          ]);
          return;
        }

        // Add all neighbors of Xi (except Xj) back to queue
        const neighbors = activeProblem.constraints
          .filter((e) => e.var1 === xi || e.var2 === xi)
          .map((e) => (e.var1 === xi ? e.var2 : e.var1))
          .filter((k) => k !== xj);

        for (const xk of neighbors) {
          queue.push([xk, xi]);
        }
      }
    }

    setDomains(newDom);
    setMilestones((p) => ({ ...p, executedAC3: true }));
    setSearchLog((prev) => [
      { step: stepCount + 1, action: `AC-3 Arc Consistency complete. Pruned ${prunedCount} incompatible domain values.`, status: "prune" },
      ...prev,
    ]);
  };

  // ── Single Step CSP Search Engine ─────────────────────────────────────
  const stepCSPSearch = useCallback(() => {
    if (isSolved || isUnsolvable) return;

    const nextVar = selectUnassignedVariable(assignments, domains);

    // If all variables are assigned -> Problem Solved!
    if (!nextVar) {
      setIsSolved(true);
      setIsRunning(false);
      setMilestones((p) => ({
        ...p,
        solvedWithoutBacktracks: backtracksCount === 0,
        prunedWithMRV: true,
      }));
      completeExperiment();
      setSearchLog((prev) => [
        { step: stepCount + 1, action: "Complete Valid Assignment Found! CSP Solved Successfully.", status: "success" },
        ...prev,
      ]);
      return;
    }

    setCurrentVar(nextVar);
    const availableValues = domains[nextVar] || activeProblem.domainValues;

    // Find first consistent value
    let assignedValue: string | null = null;
    for (const val of availableValues) {
      if (checkConsistent(nextVar, val, assignments)) {
        assignedValue = val;
        break;
      }
    }

    // 1. Consistent value found -> Assign!
    if (assignedValue) {
      const nextAssigns = { ...assignments, [nextVar]: assignedValue };
      setAssignments(nextAssigns);
      setStepCount((p) => p + 1);

      // Forward Checking (Prune neighbors' domains)
      if (algorithm === "forward_checking" || algorithm === "backtracking_mrv_lcv") {
        const nextDomains = { ...domains };
        for (const e of activeProblem.constraints) {
          const neighbor = e.var1 === nextVar ? e.var2 : e.var2 === nextVar ? e.var1 : null;
          if (neighbor && !nextAssigns[neighbor]) {
            nextDomains[neighbor] = (nextDomains[neighbor] || activeProblem.domainValues).filter(
              (v) => v !== assignedValue
            );
          }
        }
        setDomains(nextDomains);
      }

      setSearchLog((prev) => [
        {
          step: stepCount + 1,
          action: `Assigned ${assignedValue.toUpperCase()} to ${nextVar}`,
          variable: nextVar,
          value: assignedValue,
          status: "success",
        },
        ...prev.slice(0, 40),
      ]);
    }
    // 2. No consistent value found -> Backtrack!
    else {
      setBacktracksCount((p) => p + 1);
      setStepCount((p) => p + 1);

      // Backtrack: Remove most recent assignment and restore domains
      const assignedKeys = Object.keys(assignments);
      if (assignedKeys.length === 0) {
        setIsUnsolvable(true);
        setIsRunning(false);
        setSearchLog((prev) => [
          { step: stepCount + 1, action: "Search tree exhausted. Problem is unsolvable with given constraints.", status: "backtrack" },
          ...prev,
        ]);
        return;
      }

      const lastVar = assignedKeys[assignedKeys.length - 1];
      const nextAssigns = { ...assignments };
      delete nextAssigns[lastVar];
      setAssignments(nextAssigns);

      setSearchLog((prev) => [
        {
          step: stepCount + 1,
          action: `Conflict detected on ${nextVar}. Backtracked from ${lastVar}`,
          variable: nextVar,
          status: "backtrack",
        },
        ...prev.slice(0, 40),
      ]);
    }
  }, [
    isSolved,
    isUnsolvable,
    assignments,
    domains,
    selectUnassignedVariable,
    activeProblem,
    checkConsistent,
    algorithm,
    stepCount,
    backtracksCount,
    completeExperiment,
  ]);

  // Simulation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        stepCSPSearch();
      }, speedMs);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, speedMs, stepCSPSearch]);

  // ── High-DPI Retina Canvas Visualizer ──────────────────────────────────
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

    // Normalized coordinate scaling
    const scaleX = width / 500;
    const scaleY = height / 400;

    // 1. Draw Constraint Arcs (Edges)
    for (const edge of activeProblem.constraints) {
      const v1 = activeProblem.variables.find((v) => v.id === edge.var1);
      const v2 = activeProblem.variables.find((v) => v.id === edge.var2);
      if (!v1 || !v2) continue;

      const x1 = v1.x * scaleX;
      const y1 = v1.y * scaleY;
      const x2 = v2.x * scaleX;
      const y2 = v2.y * scaleY;

      const c1 = assignments[v1.id];
      const c2 = assignments[v2.id];
      const hasConflict = c1 && c2 && c1 === c2;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = hasConflict
        ? "#ef4444"
        : c1 && c2
        ? "rgba(16, 185, 129, 0.4)"
        : "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = hasConflict ? 3.5 : 2;
      ctx.stroke();

      // Constraint Conflict Indicator icon
      if (hasConflict) {
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        ctx.beginPath();
        ctx.arc(midX, midY, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444";
        ctx.fill();
      }
    }

    // 2. Draw Variable Nodes
    for (const v of activeProblem.variables) {
      const x = v.x * scaleX;
      const y = v.y * scaleY;
      const assignedColor = assignments[v.id];
      const isCurrent = currentVar === v.id;
      const remDomain = domains[v.id] || activeProblem.domainValues;

      // Outer Halo for active variable
      if (isCurrent) {
        ctx.beginPath();
        ctx.arc(x, y, 28, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(168, 85, 247, 0.25)";
        ctx.fill();
        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Solid Node Body
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fillStyle = assignedColor ? COLOR_PALETTE[assignedColor].bg : "#1e293b";
      ctx.fill();
      ctx.strokeStyle = assignedColor
        ? COLOR_PALETTE[assignedColor].border
        : isCurrent
        ? "#a855f7"
        : "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Variable Name Label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(v.id, x, y);

      // Remaining Domain Size Badge
      ctx.beginPath();
      ctx.arc(x + 15, y - 15, 8, 0, Math.PI * 2);
      ctx.fillStyle = remDomain.length === 0 ? "#ef4444" : "#0f172a";
      ctx.fill();
      ctx.strokeStyle = remDomain.length === 0 ? "#f87171" : "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = remDomain.length === 0 ? "#ffffff" : "#38bdf8";
      ctx.font = "bold 9px monospace";
      ctx.fillText(String(remDomain.length), x + 15, y - 15);
    }

    ctx.restore();
  }, [activeProblem, assignments, domains, currentVar]);

  // Instant Solve Handler
  const instantSolve = () => {
    let assigns: Record<string, string> = {};
    const doms: Record<string, string[]> = {};
    for (const v of activeProblem.variables) {
      doms[v.id] = [...activeProblem.domainValues];
    }

    // Solve using Backtracking with MRV
    const solveRecursive = (curr: Record<string, string>): boolean => {
      const unassigned = activeProblem.variables.filter((v) => !curr[v.id]);
      if (unassigned.length === 0) return true;

      // Pick MRV
      unassigned.sort((a, b) => (doms[a.id]?.length || 0) - (doms[b.id]?.length || 0));
      const next = unassigned[0].id;

      for (const val of doms[next]) {
        let consistent = true;
        for (const edge of activeProblem.constraints) {
          if (edge.var1 === next && curr[edge.var2] === val) consistent = false;
          if (edge.var2 === next && curr[edge.var1] === val) consistent = false;
        }

        if (consistent) {
          curr[next] = val;
          if (solveRecursive(curr)) return true;
          delete curr[next];
        }
      }
      return false;
    };

    const success = solveRecursive(assigns);
    if (success) {
      setAssignments(assigns);
      setIsSolved(true);
      completeExperiment();
      setMilestones((p) => ({ ...p, solvedWithoutBacktracks: true, prunedWithMRV: true }));
    } else {
      setIsUnsolvable(true);
    }
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
              <Network size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-foreground">
                  Constraint Satisfaction Problems (CSP) &amp; AC-3 Studio
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                  Arc Consistency Engine
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Constraint graph networks, MRV &amp; Degree heuristics, AC-3 arc pruning, and backtracking trees
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={instantSolve}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-sm shadow-emerald-500/25 cursor-pointer"
            title="Compute consistent assignment instantly"
          >
            <Sparkles size={14} />
            <span>Instant Solve</span>
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
            <span>{isRunning ? "Pause" : "Run Solver"}</span>
          </button>

          <button
            type="button"
            onClick={stepCSPSearch}
            disabled={isRunning || isSolved}
            className="px-3 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted transition shadow-2xs cursor-pointer disabled:opacity-40"
            title="Step 1 Variable Assignment"
          >
            Step
          </button>

          <button
            type="button"
            onClick={runAC3}
            className="px-3 py-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-500/25 transition shadow-2xs cursor-pointer"
            title="Execute AC-3 Arc Consistency Preprocessing"
          >
            AC-3 Prune
          </button>

          <button
            type="button"
            onClick={initCSP}
            className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-2xs cursor-pointer"
            title="Reset CSP Problem"
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
            { id: "visualizer", label: "Constraint Graph & Topological Canvas", icon: Network },
            { id: "domain_tensor", label: "Domain Tensor & AC-3 Arc Queue Matrix", icon: Layers },
            { id: "theory", label: "Formal CSP & AC-3 Mathematical Formulary", icon: Calculator },
            { id: "diagnostics", label: "Backtracking Diagnostics & Pruning Ratio", icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === "theory") setMilestones((p) => ({ ...p, analyzedFormulary: true }));
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
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-5 bg-card border border-border rounded-3xl shadow-sm">
          {/* 1. Problem Preset */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              CSP Benchmark Problem
            </label>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value as CSPPreset)}
              className="w-full px-3 py-2 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="australia_map">Australia Map Coloring (7-Region)</option>
              <option value="simple_graph">5-Node Wheel Graph (Degree Tie-Break)</option>
              <option value="n_queens_4">4-Queens Placement Grid</option>
              <option value="bipartite_trap">K4 Complete Graph (Unsolvable Trap)</option>
            </select>
          </div>

          {/* 2. Search Algorithm */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Search Heuristic / Inference Strategy
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as SearchAlgorithm)}
              className="w-full px-3 py-2 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="backtracking_mrv_lcv">Backtracking + MRV &amp; Degree Heuristic</option>
              <option value="forward_checking">Forward Checking (FC Pruning)</option>
              <option value="pure_backtracking">Pure Backtracking (No Inference)</option>
              <option value="ac3_preprocessing">AC-3 Arc Consistency + Backtracking</option>
            </select>
          </div>

          {/* 3. Speed Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <span>Step Delay</span>
              <span className="font-mono text-foreground font-bold">{speedMs}ms</span>
            </div>
            <input
              type="range"
              min={20}
              max={400}
              step={20}
              value={speedMs}
              onChange={(e) => setSpeedMs(parseInt(e.target.value, 10))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* 4. Active Domain Colors */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Domain Colors Available (|D|)
            </label>
            <div className="flex items-center gap-2 pt-1">
              {activeProblem.domainValues.map((color) => (
                <div
                  key={color}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold"
                  style={{
                    backgroundColor: COLOR_PALETTE[color].bg,
                    borderColor: COLOR_PALETTE[color].border,
                    color: "#ffffff",
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span>{COLOR_PALETTE[color].name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TAB 1: Constraint Graph Visualizer ── */}
        {activeTab === "visualizer" && (
          <div className="space-y-6">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: High-DPI Topological Graph Canvas (7 Cols) */}
              <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        {activeProblem.name}
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        {activeProblem.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-muted-foreground font-mono bg-muted/60 px-2 py-1 rounded-lg">
                    Numbers on node badges indicate remaining |D(X)|
                  </span>
                </div>

                {/* Canvas Arena */}
                <div className="relative w-full aspect-[16/11] bg-slate-950 rounded-2xl overflow-hidden border border-border flex items-center justify-center">
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
                        isSolved
                          ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                          : isUnsolvable
                          ? "bg-rose-500/15 text-rose-500 border-rose-500/30"
                          : "bg-purple-500/15 text-purple-400 border-purple-500/30"
                      }`}
                    >
                      {isSolved
                        ? "ALL CONSTRAINTS SATISFIED"
                        : isUnsolvable
                        ? "UNSOLVABLE / DOMAIN WIPEOUT"
                        : currentVar
                        ? `EVALUATING ${currentVar}`
                        : "READY TO SOLVE"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                    <span>
                      Assigned: <strong className="text-foreground">{Object.keys(assignments).length} / {activeProblem.variables.length}</strong>
                    </span>
                    <span>
                      Checks: <strong className="text-foreground">{constraintChecks}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Live Telemetry & Step Log (5 Cols) */}
              <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-purple-500" />
                    <h3 className="text-sm font-bold text-foreground">
                      Search Telemetry &amp; Backtrack Tracker
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Algorithm: {algorithm.toUpperCase()}
                  </span>
                </div>

                {/* 4 Key Stat Metric Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/40 border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      Search Step
                    </span>
                    <span className="text-xl font-black font-mono text-purple-400 mt-0.5 block">
                      {stepCount}
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      Constraint Checks
                    </span>
                    <span className="text-xl font-black font-mono text-cyan-400 mt-0.5 block">
                      {constraintChecks}
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      Backtracks (Prunes)
                    </span>
                    <span
                      className={`text-xl font-black font-mono mt-0.5 block ${
                        backtracksCount > 0 ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      {backtracksCount}
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      Variables Assigned
                    </span>
                    <span className="text-xl font-black font-mono text-emerald-400 mt-0.5 block">
                      {Object.keys(assignments).length} / {activeProblem.variables.length}
                    </span>
                  </div>
                </div>

                {/* Real-Time Search Event Log */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-end">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    <span>Live Inference Stream</span>
                    <span>Recent Transitions</span>
                  </div>
                  <div className="h-44 overflow-y-auto bg-slate-950 p-3 rounded-2xl border border-border space-y-1.5 font-mono text-xs">
                    {searchLog.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-1.5 rounded-lg border flex items-start justify-between text-[11px] ${
                          item.status === "success"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                            : item.status === "backtrack"
                            ? "bg-rose-500/10 border-rose-500/20 text-rose-300"
                            : "bg-purple-500/10 border-purple-500/20 text-purple-300"
                        }`}
                      >
                        <span>{item.action}</span>
                        <span className="text-[9px] opacity-60">#{item.step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── TAB 2: Domain Tensor & AC-3 Arc Matrix ── */}
        {activeTab === "domain_tensor" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
              <div>
                <h3 className="text-base font-black text-foreground">
                  Variable Domain Tensors &amp; Arc Consistency Support Matrix
                </h3>
                <p className="text-xs text-muted-foreground">
                  Inspect remaining domain elements for each variable node and active binary constraint relations.
                </p>
              </div>

              <button
                type="button"
                onClick={runAC3}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Run AC-3 Queue Reduction
              </button>
            </div>

            <div className="overflow-x-auto p-4 bg-slate-950 rounded-2xl border border-border">
              <table className="w-full text-left font-mono text-xs text-slate-200">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground text-[10px] font-black uppercase">
                    <th className="p-2.5">Variable (X_i)</th>
                    <th className="p-2.5">Current Value</th>
                    <th className="p-2.5">Remaining Domain D(X_i)</th>
                    <th className="p-2.5">Constraint Neighbors</th>
                    <th className="p-2.5 text-purple-400">MRV Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {activeProblem.variables.map((v) => {
                    const assigned = assignments[v.id];
                    const remD = domains[v.id] || activeProblem.domainValues;
                    const neighbors = activeProblem.constraints
                      .filter((e) => e.var1 === v.id || e.var2 === v.id)
                      .map((e) => (e.var1 === v.id ? e.var2 : e.var1));

                    return (
                      <tr key={v.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="p-2.5 font-bold text-white">{v.name}</td>
                        <td className="p-2.5">
                          {assigned ? (
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-black uppercase"
                              style={{
                                backgroundColor: COLOR_PALETTE[assigned].bg,
                                color: "#ffffff",
                              }}
                            >
                              {assigned}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">UNASSIGNED</span>
                          )}
                        </td>
                        <td className="p-2.5">
                          <div className="flex gap-1.5">
                            {remD.map((c) => (
                              <span
                                key={c}
                                className="px-2 py-0.5 rounded text-[10px] font-bold"
                                style={{
                                  backgroundColor: COLOR_PALETTE[c].bg,
                                  color: "#ffffff",
                                }}
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-2.5 text-slate-400">
                          {neighbors.join(", ")}
                        </td>
                        <td className="p-2.5 font-bold text-purple-400">
                          {assigned ? "-" : `${remD.length} values remaining`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── TAB 3: Formal Mathematical Formulary ── */}
        {activeTab === "theory" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-foreground">
                Mathematical Foundations: Constraint Satisfaction Problems (CSP) &amp; AC-3
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Formal mathematical definitions of CSP triples, hyperedge constraints, and arc consistency propagation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Formal CSP Triple */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                  <Network size={16} />
                  <span>1. Formal CSP Definition (Triple)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-cyan-300 space-y-1.5 border border-border">
                  <div>{"CSP = ⟨ X, D, C ⟩"}</div>
                  <div>{"X = {X_1, X_2, ..., X_n}  (Variables)"}</div>
                  <div>{"D = {D_1, D_2, ..., D_n}  (Domains)"}</div>
                  <div>{"C = {C_1, C_2, ..., C_m}  (Constraints)"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A state is an assignment of values to some or all variables. An assignment is consistent if it violates no constraints.
                </p>
              </div>

              {/* 2. AC-3 Arc Consistency Algorithm */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  <Calculator size={16} />
                  <span>2. AC-3 Arc Consistency Algorithm</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-indigo-300 space-y-1.5 border border-border">
                  <div>{"Arc (X_i, X_j) is consistent iff:"}</div>
                  <div>{"∀ x ∈ D_i,  ∃ y ∈ D_j  such that (x, y) satisfies C_{ij}"}</div>
                  <div>{"Complexity: O(c · d^3), where c = |C|, d = max|D|"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  AC-3 maintains a queue of directed arcs. If Revise(Xi, Xj) removes a value from Di, all incoming arcs (Xk, Xi) are re-queued.
                </p>
              </div>

              {/* 3. MRV Heuristic */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                  <Zap size={16} />
                  <span>3. Minimum Remaining Values (MRV / Fail-First)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-amber-300 space-y-1.5 border border-border">
                  <div>{"X_{next} = argmin_{X_i ∉ Assigned} |D(X_i)|"}</div>
                  <div>{"Tie-breaker (Degree): argmax |{X_j ∉ Assigned : C_{ij} ∈ C}|"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Chooses the variable most likely to fail soonest, pruning subtrees early in the search space.
                </p>
              </div>

              {/* 4. LCV (Least Constraining Value) */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                  <ShieldCheck size={16} />
                  <span>4. Least Constraining Value (LCV)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-emerald-300 space-y-1.5 border border-border">
                  <div>{"v_{best} = argmin_{v ∈ D(X_i)} ∑_{X_j ∈ Neighbors(X_i)} (count ruled out in D(X_j))"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Leaves the maximum flexibility for neighboring unassigned variables to find consistent assignments.
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
                Inference &amp; Search Space Diagnostics
              </h3>
              <p className="text-xs text-muted-foreground">
                Examine constraint tightness, domain pruning efficiency, and backtracking reduction rates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Constraint Graph Density</span>
                <span className="text-2xl font-black font-mono text-purple-500">
                  {((2 * activeProblem.constraints.length) / (activeProblem.variables.length * (activeProblem.variables.length - 1))).toFixed(2)}
                </span>
                <p className="text-[10px] text-muted-foreground">
                  Ratio of active binary constraint edges to complete graph edges.
                </p>
              </div>

              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Search Efficiency</span>
                <span className="text-2xl font-black font-mono text-emerald-500">
                  {backtracksCount === 0 ? "100% (No Backtracks)" : `${Math.round((stepCount / (stepCount + backtracksCount)) * 100)}%`}
                </span>
                <p className="text-[10px] text-muted-foreground">
                  Ratio of successful variable assignments to total search tree evaluations.
                </p>
              </div>

              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Active Inference Mode</span>
                <span className="text-2xl font-black font-mono text-indigo-500 uppercase">
                  {algorithm === "backtracking_mrv_lcv" ? "MRV + Degree" : algorithm.replace("_", " ")}
                </span>
                <p className="text-[10px] text-muted-foreground">
                  Dynamic domain pruning and variable ordering heuristic.
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
                Constraint Satisfaction Mastery Objectives
              </h4>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-500">+50 XP Per Milestone</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: "solvedWithoutBacktracks",
                label: "Backtrack-Free Map Coloring",
                desc: "Solve the Australia Map Coloring CSP using MRV heuristics with 0 backtracks.",
                done: milestones.solvedWithoutBacktracks,
              },
              {
                id: "executedAC3",
                label: "Execute AC-3 Arc Consistency",
                desc: "Run the AC-3 arc pruning algorithm to enforce 2-consistency across constraint edges.",
                done: milestones.executedAC3,
              },
              {
                id: "prunedWithMRV",
                label: "Deploy MRV & Degree Heuristics",
                desc: "Select the most constrained variable first to minimize search tree depth.",
                done: milestones.prunedWithMRV,
              },
              {
                id: "analyzedFormulary",
                label: "Inspect CSP Theory & Proofs",
                desc: "Review the formal mathematical definitions of CSP triples and arc revision.",
                done: milestones.analyzedFormulary,
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
          labId="computer-science/ai-problem/constraint-satisfy"
          currentParams={{
            preset,
            algorithm,
            stepCount,
            backtracksCount,
            isSolved,
          }}
        />
      </main>
    </div>
  );
}