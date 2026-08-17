"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { analyzeLinearSystem, solveLinearTrajectory } from "./lib/odeSolvers";
import { TrajectoryPoint2D } from "./types";
import {
  Activity,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2,
  RotateCcw,
  Lightbulb,
} from "lucide-react";

export default function PhasePlaneCanvas() {
  const [matrixA, setMatrixA] = useState<{ a: number; b: number; c: number; d: number }>({
    a: -1,
    b: -3,
    c: 3,
    d: -1,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Analyze Trace, Determinant, Eigenvalues, Stability
  const analysis = useMemo(
    () => analyzeLinearSystem(matrixA.a, matrixA.b, matrixA.c, matrixA.d),
    [matrixA]
  );

  const presets = [
    {
      label: "🌀 Inward Spiral (Sink)",
      desc: "Swirls toward equilibrium (stable decay)",
      a: -1,
      b: -3,
      c: 3,
      d: -1,
    },
    {
      label: "🔄 Endless Loop (Center)",
      desc: "Concentric circular orbits (conserved energy)",
      a: 0,
      b: -2,
      c: 2,
      d: 0,
    },
    {
      label: "🪓 Mountain Pass (Saddle)",
      desc: "Attracted in one direction, flung away in another",
      a: 1,
      b: 0,
      c: 0,
      d: -2,
    },
    {
      label: "🌊 Smooth Drain (Stable Node)",
      desc: "Flows directly into equilibrium without spinning",
      a: -2,
      b: 0,
      c: 1,
      d: -3,
    },
    {
      label: "💥 Outward Spiral (Source)",
      desc: "Spins outward exponentially (unstable explosion)",
      a: 1,
      b: 3,
      c: -3,
      d: 1,
    },
    {
      label: "🚀 Outward Blowup (Unstable Node)",
      desc: "Flies away from the center directly",
      a: 2,
      b: 1,
      c: 0,
      d: 3,
    },
  ];

  // Boundaries
  const bound = 5;

  // Render Phase Portrait on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const toCanvasX = (x: number) => ((x + bound) / (2 * bound)) * width;
    const toCanvasY = (y: number) => height - ((y + bound) / (2 * bound)) * height;

    ctx.clearRect(0, 0, width, height);

    // Draw Axes
    ctx.strokeStyle = "rgba(100, 116, 139, 0.4)";
    ctx.lineWidth = 1.5;

    const cx = toCanvasX(0);
    const cy = toCanvasY(0);

    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();

    // Draw Vector Field
    const density = 14;
    const step = (2 * bound) / density;

    for (let x = -bound; x <= bound; x += step) {
      for (let y = -bound; y <= bound; y += step) {
        if (Math.abs(x) < 0.1 && Math.abs(y) < 0.1) continue;

        const vx = matrixA.a * x + matrixA.b * y;
        const vy = matrixA.c * x + matrixA.d * y;
        const mag = Math.sqrt(vx * vx + vy * vy) || 1;

        const arrowLen = 14;
        const normVx = (vx / mag) * arrowLen;
        const normVy = (vy / mag) * arrowLen;

        const startX = toCanvasX(x);
        const startY = toCanvasY(y);
        const endX = startX + normVx;
        const endY = startY - normVy;

        ctx.strokeStyle = "rgba(99, 102, 241, 0.35)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }

    // Seed test orbits from circle
    const seedR = [1.5, 3.2];
    seedR.forEach((r) => {
      for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 4) {
        const x0 = r * Math.cos(angle);
        const y0 = r * Math.sin(angle);
        const traj = solveLinearTrajectory(matrixA.a, matrixA.b, matrixA.c, matrixA.d, x0, y0, 220, 0.04);

        if (traj.length > 1) {
          ctx.strokeStyle = "#818cf8";
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(toCanvasX(traj[0].x), toCanvasY(traj[0].y));
          for (let i = 1; i < traj.length; i++) {
            ctx.lineTo(toCanvasX(traj[i].x), toCanvasY(traj[i].y));
          }
          ctx.stroke();
        }
      }
    });

    // Fixed Origin Node (0, 0)
    ctx.fillStyle = "#ec4899";
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [matrixA, bound]);

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
              How to think about Phase Portraits
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              The center dot (0, 0) is the balance point. The lines show what happens to any starting point over time: does it <strong>drain smoothly inward</strong>, <strong>swirl into a vortex</strong>, or <strong>shoot away</strong>?
            </p>
          </div>
        </div>

        {/* 1-Click Try This Scenarios */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">1-Click Scenarios:</span>
          <button
            onClick={() => setMatrixA({ a: -1, b: -3, c: 3, d: -1 })}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all"
          >
            🌀 Galaxy Swirl
          </button>
          <button
            onClick={() => setMatrixA({ a: 0, b: -2, c: 2, d: 0 })}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all"
          >
            🔄 Infinite Orbit
          </button>
          <button
            onClick={() => setMatrixA({ a: 1, b: 0, c: 0, d: -2 })}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all"
          >
            🪓 Saddle Divergence
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ── Left: Phase Portrait Canvas (7 cols) ─────────────── */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                2D Phase Plane: [ẋ, ẏ]ᵀ = A · [x, y]ᵀ
              </span>
            </div>

            <span
              className={`text-xs font-mono font-black uppercase px-2.5 py-0.5 rounded-full border ${
                analysis.stability === "saddle"
                  ? "bg-rose-500/20 text-rose-500 border-rose-500/30"
                  : analysis.stability.includes("stable")
                  ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-500 border-amber-500/30"
              }`}
            >
              {analysis.stability.replace("_", " ")}
            </span>
          </div>

          {/* Phase Canvas */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 p-2 relative select-none">
            <canvas
              ref={canvasRef}
              width={600}
              height={380}
              className="w-full h-full max-h-[380px] rounded-xl"
            />
          </div>

          {/* Eigenvalues Banner */}
          <div className="p-3 bg-muted/40 border border-border rounded-2xl mt-2 flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground font-bold">Eigenvalues (&lambda;):</span>
            <span className="font-black text-primary">
              &lambda;₁ = {analysis.eigenvalue1.real.toFixed(2)}{" "}
              {analysis.eigenvalue1.imag ? `± ${analysis.eigenvalue1.imag.toFixed(2)}i` : ""},{" "}
              &lambda;₂ = {analysis.eigenvalue2.real.toFixed(2)}
            </span>
          </div>
        </div>

        {/* ── Right: Matrix Inputs & Trace-Determinant (5 cols) ── */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Matrix A &amp; Flow Presets
              </span>
            </div>
          </div>

          {/* Presets List */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-foreground block">Canonical Behaviors:</span>
            <div className="grid grid-cols-1 gap-1.5 text-xs font-mono">
              {presets.map((pr) => (
                <button
                  key={pr.label}
                  onClick={() => setMatrixA({ a: pr.a, b: pr.b, c: pr.c, d: pr.d })}
                  className="p-2.5 bg-muted/40 hover:bg-accent border border-border rounded-2xl text-left transition-all text-muted-foreground hover:text-foreground"
                >
                  <div className="font-bold text-foreground">{pr.label}</div>
                  <div className="text-[10px] font-sans font-normal opacity-75 mt-0.5">{pr.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2x2 Matrix Editable Inputs */}
          <div className="p-3 bg-muted/30 border border-border rounded-2xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-primary block">
              Custom Matrix A = [[a, b], [c, d]]
            </span>
            <div className="grid grid-cols-2 gap-2 font-mono">
              <div>
                <label className="text-[9px] text-muted-foreground block font-bold">a</label>
                <input
                  type="number"
                  step="0.5"
                  value={matrixA.a}
                  onChange={(e) => setMatrixA({ ...matrixA, a: parseFloat(e.target.value) || 0 })}
                  className="w-full p-1.5 bg-background border border-border rounded-xl text-center font-black"
                />
              </div>
              <div>
                <label className="text-[9px] text-muted-foreground block font-bold">b</label>
                <input
                  type="number"
                  step="0.5"
                  value={matrixA.b}
                  onChange={(e) => setMatrixA({ ...matrixA, b: parseFloat(e.target.value) || 0 })}
                  className="w-full p-1.5 bg-background border border-border rounded-xl text-center font-black"
                />
              </div>
              <div>
                <label className="text-[9px] text-muted-foreground block font-bold">c</label>
                <input
                  type="number"
                  step="0.5"
                  value={matrixA.c}
                  onChange={(e) => setMatrixA({ ...matrixA, c: parseFloat(e.target.value) || 0 })}
                  className="w-full p-1.5 bg-background border border-border rounded-xl text-center font-black"
                />
              </div>
              <div>
                <label className="text-[9px] text-muted-foreground block font-bold">d</label>
                <input
                  type="number"
                  step="0.5"
                  value={matrixA.d}
                  onChange={(e) => setMatrixA({ ...matrixA, d: parseFloat(e.target.value) || 0 })}
                  className="w-full p-1.5 bg-background border border-border rounded-xl text-center font-black"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
