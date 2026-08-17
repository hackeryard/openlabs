"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { SolverMethod, TrajectoryPoint2D } from "./types";
import { eulerSolve, heunSolve, rk4Solve } from "./lib/odeSolvers";
import {
  Compass,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2,
  RotateCcw,
  Activity,
  Lightbulb,
  Play,
} from "lucide-react";

interface EquationPreset {
  id: string;
  name: string;
  latex: string;
  explanation: string;
  f: (x: number, y: number) => number;
}

const PRESETS: EquationPreset[] = [
  {
    id: "linear_decay",
    name: "Linear Flow (y' = x - y)",
    latex: "dy/dx = x - y",
    explanation: "Solutions are pulled toward the diagonal line y = x - 1.",
    f: (x, y) => x - y,
  },
  {
    id: "logistic",
    name: "Logistic Population (y' = y(1 - y))",
    latex: "dy/dx = y(1 - y)",
    explanation: "Population starts small, grows exponentially, then flattens at carrying capacity y = 1.",
    f: (_x, y) => y * (1 - y),
  },
  {
    id: "sine_flow",
    name: "Wave Drift (y' = sin(x) - y)",
    latex: "dy/dx = \\sin(x) - y",
    explanation: "Trajectories oscillate smoothly with sine waves while decaying toward equilibrium.",
    f: (x, y) => Math.sin(x) - y,
  },
  {
    id: "circular",
    name: "Circular Whirlpool (y' = -x / y)",
    latex: "dy/dx = -x/y",
    explanation: "At every point, slope is perpendicular to radius, forming perfect concentric circles (x² + y² = C).",
    f: (x, y) => (Math.abs(y) < 0.01 ? 0 : -x / y),
  },
  {
    id: "hyperbolic",
    name: "Saddle Flow (y' = x² - y²)",
    latex: "dy/dx = x^2 - y^2",
    explanation: "Non-linear landscape with acceleration along x-axis and deceleration along y-axis.",
    f: (x, y) => x * x - y * y,
  },
  {
    id: "parabolic",
    name: "Pure Acceleration (y' = 2x)",
    latex: "dy/dx = 2x",
    explanation: "Slope depends only on x position. Solutions form a family of parabolas y = x² + C.",
    f: (x, _y) => 2 * x,
  },
];

export default function SlopeFieldsCanvas() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("logistic");
  const [initialCondition, setInitialCondition] = useState<{ x: number; y: number }>({ x: -3, y: 0.1 });
  const [stepSizeH, setStepSizeH] = useState<number>(0.05);

  // Active solver toggles
  const [showEuler, setShowEuler] = useState<boolean>(true);
  const [showHeun, setShowHeun] = useState<boolean>(true);
  const [showRk4, setShowRk4] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activePreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  // Grid boundaries
  const xMin = -4, xMax = 4;
  const yMin = -3, yMax = 3;

  // Trajectories from initial condition forward and backward
  const trajectories = useMemo(() => {
    const f = activePreset.f;
    const { x: x0, y: y0 } = initialCondition;

    // Forward
    const eulerFwd = eulerSolve(f, x0, y0, xMax, stepSizeH);
    const heunFwd = heunSolve(f, x0, y0, xMax, stepSizeH);
    const rk4Fwd = rk4Solve(f, x0, y0, xMax, stepSizeH);

    // Backward
    const eulerBwd = eulerSolve(f, x0, y0, xMin, stepSizeH);
    const heunBwd = heunSolve(f, x0, y0, xMin, stepSizeH);
    const rk4Bwd = rk4Solve(f, x0, y0, xMin, stepSizeH);

    return {
      euler: [...eulerBwd.reverse(), ...eulerFwd.slice(1)],
      heun: [...heunBwd.reverse(), ...heunFwd.slice(1)],
      rk4: [...rk4Bwd.reverse(), ...rk4Fwd.slice(1)],
    };
  }, [activePreset, initialCondition, stepSizeH]);

  // Render Direction Field and Solution Curves
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Coordinate mapping functions
    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toCanvasY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Axes
    ctx.strokeStyle = "rgba(100, 116, 139, 0.4)";
    ctx.lineWidth = 1.5;

    // X Axis
    const y0Pos = toCanvasY(0);
    ctx.beginPath();
    ctx.moveTo(0, y0Pos);
    ctx.lineTo(width, y0Pos);
    ctx.stroke();

    // Y Axis
    const x0Pos = toCanvasX(0);
    ctx.beginPath();
    ctx.moveTo(x0Pos, 0);
    ctx.lineTo(x0Pos, height);
    ctx.stroke();

    // Draw Direction Field Slopes
    const gridDensity = 16;
    const dx = (xMax - xMin) / gridDensity;
    const dy = (yMax - yMin) / gridDensity;
    const segmentLength = 11;

    for (let x = xMin; x <= xMax; x += dx) {
      for (let y = yMin; y <= yMax; y += dy) {
        const slope = activePreset.f(x, y);
        if (isNaN(slope)) continue;

        const angle = Math.atan(slope);
        const cx = toCanvasX(x);
        const cy = toCanvasY(y);

        const x1 = cx - (segmentLength / 2) * Math.cos(angle);
        const y1 = cy + (segmentLength / 2) * Math.sin(angle);
        const x2 = cx + (segmentLength / 2) * Math.cos(angle);
        const y2 = cy - (segmentLength / 2) * Math.sin(angle);

        ctx.strokeStyle = "rgba(99, 102, 241, 0.45)";
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }

    // Helper to draw a polyline trajectory
    const drawTrajectory = (pts: TrajectoryPoint2D[], color: string, lineWidth: number, dash: number[] = []) => {
      if (pts.length === 0) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.setLineDash(dash);
      ctx.beginPath();
      ctx.moveTo(toCanvasX(pts[0].x), toCanvasY(pts[0].y));
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(toCanvasX(pts[i].x), toCanvasY(pts[i].y));
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // Draw Solvers
    if (showEuler) drawTrajectory(trajectories.euler, "#ef4444", 2.5, [4, 4]); // Red Dashed
    if (showHeun) drawTrajectory(trajectories.heun, "#f59e0b", 2.5, [6, 2]); // Amber
    if (showRk4) drawTrajectory(trajectories.rk4, "#6366f1", 3.5); // Indigo Solid

    // Draw Initial Condition Node
    const initCx = toCanvasX(initialCondition.x);
    const initCy = toCanvasY(initialCondition.y);

    ctx.fillStyle = "#ec4899";
    ctx.beginPath();
    ctx.arc(initCx, initCy, 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [activePreset, initialCondition, trajectories, showEuler, showHeun, showRk4]);

  // Click on canvas to spawn new initial condition
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const mathX = xMin + (clickX / rect.width) * (xMax - xMin);
    const mathY = yMax - (clickY / rect.height) * (yMax - yMin);

    setInitialCondition({
      x: parseFloat(mathX.toFixed(2)),
      y: parseFloat(mathY.toFixed(2)),
    });
  };

  return (
    <div className="space-y-4">
      {/* ── Visual Intuition Banner ────────────────────────────── */}
      <div className="p-4 bg-primary/10 border border-primary/20 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <Lightbulb size={20} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-primary">
              How to think about Slope Fields
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Think of the small arrows like <strong>wind currents in the air</strong>. When you click anywhere on the canvas, you release a leaf into the wind and watch it follow the path!
            </p>
          </div>
        </div>

        {/* 1-Click Try This Scenarios */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Try 1-Click Demos:</span>
          <button
            onClick={() => {
              setSelectedPresetId("logistic");
              setInitialCondition({ x: -3.5, y: 0.1 });
              setStepSizeH(0.04);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all"
          >
            🌱 Population S-Curve
          </button>
          <button
            onClick={() => {
              setSelectedPresetId("circular");
              setInitialCondition({ x: 0, y: 2 });
              setStepSizeH(0.05);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all"
          >
            🌀 Circular Whirlpool
          </button>
          <button
            onClick={() => {
              setSelectedPresetId("linear_decay");
              setInitialCondition({ x: -3, y: 2 });
              setStepSizeH(0.25);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold text-red-500 transition-all"
          >
            💥 Watch Euler Fail (Big Step)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ── Left: Interactive Direction Field Canvas (7 cols) ─ */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                1st Order Slope Field: {activePreset.latex}
              </span>
            </div>

            <span className="text-xs font-mono font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Start Point (x₀, y₀) = ({initialCondition.x}, {initialCondition.y})
            </span>
          </div>

          {/* Canvas Visualizer */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 p-2 relative select-none">
            <canvas
              ref={canvasRef}
              width={600}
              height={380}
              onClick={handleCanvasClick}
              className="w-full h-full max-h-[380px] rounded-xl cursor-crosshair"
            />
            <div className="absolute bottom-3 left-4 text-[11px] font-mono text-muted-foreground bg-background/80 px-2.5 py-1 rounded-lg border border-border shadow-sm">
              👆 Click anywhere on the grid to change starting point
            </div>
          </div>

          {/* Solver Toggles Legend */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-border mt-2 text-xs flex-wrap">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowEuler(!showEuler)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border font-bold transition-all ${
                  showEuler ? "bg-red-500/20 text-red-500 border-red-500/40" : "bg-muted text-muted-foreground opacity-50"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                Euler Method (Fast/Coarse)
              </button>

              <button
                onClick={() => setShowHeun(!showHeun)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border font-bold transition-all ${
                  showHeun ? "bg-amber-500/20 text-amber-500 border-amber-500/40" : "bg-muted text-muted-foreground opacity-50"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Heun 2nd-Order
              </button>

              <button
                onClick={() => setShowRk4(!showRk4)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border font-bold transition-all ${
                  showRk4 ? "bg-indigo-500/20 text-indigo-500 border-indigo-500/40" : "bg-muted text-muted-foreground opacity-50"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                Runge-Kutta RK4 (Exact)
              </button>
            </div>

            <button
              onClick={() => setInitialCondition({ x: -2, y: 1 })}
              className="p-1.5 bg-muted hover:bg-accent border border-border rounded-xl text-muted-foreground hover:text-foreground"
              title="Reset initial condition"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* ── Right: Differential Equation Presets & Step Slider (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Equation &amp; Step Controls
              </span>
            </div>
          </div>

          {/* Equation Presets */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-foreground block">Select Equation:</span>
            <div className="grid grid-cols-1 gap-1.5 font-mono text-xs">
              {PRESETS.map((pr) => (
                <button
                  key={pr.id}
                  onClick={() => setSelectedPresetId(pr.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    selectedPresetId === pr.id
                      ? "bg-primary text-primary-foreground border-primary font-black shadow-md"
                      : "bg-muted/40 hover:bg-accent border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{pr.name}</span>
                    <span className="text-[10px] opacity-80">{pr.latex}</span>
                  </div>
                  <p className="text-[10px] font-sans font-normal opacity-75 mt-0.5">{pr.explanation}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step Size Slider */}
          <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground">Integrator Step Size (h)</span>
              <span className="font-mono text-primary font-black">{stepSizeH}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.3"
              step="0.01"
              value={stepSizeH}
              onChange={(e) => setStepSizeH(parseFloat(e.target.value) || 0.05)}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="text-[10px] text-muted-foreground flex justify-between">
              <span>High Precision (0.01)</span>
              <span>Large Steps / Fast (0.3)</span>
            </div>
          </div>

          {/* Method Accuracy Breakdown in Simple Terms */}
          <div className="p-3.5 bg-muted/30 border border-border rounded-2xl text-xs space-y-1.5">
            <span className="font-bold text-foreground block">Why RK4 is Better:</span>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <strong>Euler</strong> steps blindly along the current slope and drifts away quickly. <strong>RK4</strong> checks slopes ahead and averages 4 test points per step, making it thousands of times more accurate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
