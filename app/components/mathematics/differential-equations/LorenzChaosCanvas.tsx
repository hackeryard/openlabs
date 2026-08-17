"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { LorenzParams, TrajectoryPoint3D } from "./types";
import { solveLorenzSystem } from "./lib/odeSolvers";
import {
  Sparkles,
  Sliders,
  Layers,
  CheckCircle2,
  Maximize2,
  RotateCcw,
  Play,
  Pause,
  Lightbulb,
} from "lucide-react";

export default function LorenzChaosCanvas() {
  const [params, setParams] = useState<LorenzParams>({
    sigma: 10.0,
    rho: 28.0,
    beta: 2.667,
  });

  const [initialSeed, setInitialSeed] = useState<{ x: number; y: number; z: number }>({
    x: 0.1,
    y: 0.0,
    z: 0.0,
  });

  const [showDivergence, setShowDivergence] = useState<boolean>(true);
  const [rotX, setRotX] = useState<number>(0.4);
  const [rotY, setRotY] = useState<number>(0.8);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute Base Trajectory 1
  const traj1 = useMemo(
    () => solveLorenzSystem(params, initialSeed.x, initialSeed.y, initialSeed.z, 2000, 0.01),
    [params, initialSeed]
  );

  // Compute Perturbed Trajectory 2 (separated by 10^-4)
  const traj2 = useMemo(
    () =>
      solveLorenzSystem(
        params,
        initialSeed.x + 0.0001,
        initialSeed.y,
        initialSeed.z,
        2000,
        0.01
      ),
    [params, initialSeed]
  );

  // 3D Projection & Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 30;
    const scale = 7.5;

    // 3D Rotation Math
    const project = (pt: TrajectoryPoint3D) => {
      const px = pt.x;
      const py = pt.y;
      const pz = pt.z - 25;

      const x1 = px * Math.cos(rotY) + pz * Math.sin(rotY);
      const y1 = py;
      const z1 = -px * Math.sin(rotY) + pz * Math.cos(rotY);

      const x2 = x1;
      const y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX);

      return {
        screenX: cx + x2 * scale,
        screenY: cy - y2 * scale,
      };
    };

    const renderPath = (pts: TrajectoryPoint3D[], strokeColor: string, widthLine: number) => {
      if (pts.length === 0) return;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = widthLine;
      ctx.beginPath();
      const p0 = project(pts[0]);
      ctx.moveTo(p0.screenX, p0.screenY);

      for (let i = 1; i < pts.length; i++) {
        const p = project(pts[i]);
        ctx.lineTo(p.screenX, p.screenY);
      }
      ctx.stroke();
    };

    renderPath(traj1, "rgba(99, 102, 241, 0.8)", 1.5);

    if (showDivergence) {
      renderPath(traj2, "rgba(236, 72, 153, 0.85)", 1.5);
    }
  }, [traj1, traj2, rotX, rotY, showDivergence]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setRotY((y) => y + dx * 0.01);
    setRotX((x) => Math.max(-1.4, Math.min(1.4, x + dy * 0.01)));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
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
              What is the Butterfly Effect?
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              The two lines below (<strong className="text-indigo-500">Indigo</strong> and <strong className="text-pink-500">Pink</strong>) start separated by just <strong>0.0001</strong> (like the flap of a butterfly's wing). Watch how they track together initially, then suddenly split into completely different wings!
            </p>
          </div>
        </div>

        {/* 1-Click Try This Scenarios */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">1-Click Scenarios:</span>
          <button
            onClick={() => {
              setParams({ sigma: 10, rho: 28, beta: 2.667 });
              setShowDivergence(true);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-pink-500"
          >
            🦋 Classic Butterfly Chaos
          </button>
          <button
            onClick={() => {
              setParams({ sigma: 10, rho: 15, beta: 2.667 });
              setShowDivergence(false);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all"
          >
            ⚪ Low Heat (No Chaos, Steady Sink)
          </button>
          <button
            onClick={() => {
              setParams({ sigma: 10, rho: 38, beta: 2.667 });
              setShowDivergence(true);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-amber-500"
          >
            🌪️ Super Turbulent Convection
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ── Left: 3D Lorenz Strange Attractor Canvas (7 cols) ── */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                3D Lorenz Strange Attractor
              </span>
            </div>

            <span className="text-xs font-mono font-black text-pink-500 bg-pink-500/10 px-2.5 py-0.5 rounded-full border border-pink-500/20">
              Initial Delta = 0.0001
            </span>
          </div>

          {/* 3D Canvas */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 p-2 relative select-none">
            <canvas
              ref={canvasRef}
              width={600}
              height={380}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-full h-full max-h-[380px] rounded-xl cursor-grab active:cursor-grabbing"
            />
            <div className="absolute bottom-3 left-4 text-[11px] font-mono text-muted-foreground bg-background/80 px-2.5 py-1 rounded-lg border border-border">
              🖱️ Drag mouse on canvas to spin the 3D butterfly wings
            </div>
          </div>

          {/* Divergence Legend */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-border mt-2 text-xs flex-wrap">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-bold text-indigo-500">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                Original Forecast (x₀ = 0.1)
              </span>
              {showDivergence && (
                <span className="flex items-center gap-1.5 font-bold text-pink-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  Perturbed Forecast (+0.0001)
                </span>
              )}
            </div>

            <button
              onClick={() => setShowDivergence(!showDivergence)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                showDivergence
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              Toggle 2nd Line
            </button>
          </div>
        </div>

        {/* ── Right: Lorenz System Parameters (5 cols) ─────────── */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Atmospheric Parameters
              </span>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3">
            <div className="space-y-1 p-2.5 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Atmosphere Heating (&rho; - Chaos at &ge; 24.74)</span>
                <span className="font-mono text-primary font-black">{params.rho}</span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                step="0.5"
                value={params.rho}
                onChange={(e) => setParams({ ...params, rho: parseFloat(e.target.value) || 28 })}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1 p-2.5 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Fluid Viscosity (&sigma;)</span>
                <span className="font-mono text-primary font-black">{params.sigma}</span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                step="0.5"
                value={params.sigma}
                onChange={(e) => setParams({ ...params, sigma: parseFloat(e.target.value) || 10 })}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1 p-2.5 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Convection Shape (&beta;)</span>
                <span className="font-mono text-primary font-black">{params.beta}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={params.beta}
                onChange={(e) => setParams({ ...params, beta: parseFloat(e.target.value) || 2.667 })}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* Simple Explanation Box */}
          <div className="p-3.5 bg-muted/30 border border-border rounded-2xl text-xs space-y-1.5">
            <span className="font-bold text-foreground block">Why Long-Term Weather Forecasts Fail:</span>
            <p className="text-muted-foreground leading-relaxed">
              Because real weather sensors cannot measure temperature to infinite decimal places, microscopic measurement errors grow exponentially over 10-14 days into entirely different weather outcomes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
