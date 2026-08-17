"use client";

import React, { useState, useMemo } from "react";
import { LotkaVolterraParams } from "./types";
import { solveLotkaVolterra } from "./lib/odeSolvers";
import {
  Activity,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

export default function LotkaVolterraCanvas() {
  const [params, setParams] = useState<LotkaVolterraParams>({
    alpha: 1.0,  // Prey growth
    beta: 0.1,   // Predation rate
    gamma: 1.5,  // Predator death
    delta: 0.075,// Predator birth per prey eaten
  });

  const [initialPrey, setInitialPrey] = useState<number>(20);
  const [initialPredator, setInitialPredator] = useState<number>(10);

  // Equilibrium Point (x*, y*) = (gamma / delta, alpha / beta)
  const eqPrey = params.delta > 0 ? params.gamma / params.delta : 0;
  const eqPredator = params.beta > 0 ? params.alpha / params.beta : 0;

  const { trajectory, timeSeries } = useMemo(
    () => solveLotkaVolterra(params, initialPrey, initialPredator, 25, 0.03),
    [params, initialPrey, initialPredator]
  );

  // SVG Scales
  const maxPrey = Math.max(...timeSeries.map((d) => d.prey), eqPrey, 30);
  const maxPredator = Math.max(...timeSeries.map((d) => d.predator), eqPredator, 20);
  const tMax = 25;

  // Phase Space Points
  const phasePointsStr = useMemo(() => {
    return trajectory
      .map((pt) => {
        const cx = 35 + (pt.x / maxPrey) * 320;
        const cy = 210 - (pt.y / maxPredator) * 180;
        return `${cx},${cy}`;
      })
      .join(" ");
  }, [trajectory, maxPrey, maxPredator]);

  // Time Series Points
  const preyTimeStr = useMemo(() => {
    return timeSeries
      .map((d) => {
        const cx = 35 + (d.t / tMax) * 320;
        const cy = 210 - (d.prey / maxPrey) * 180;
        return `${cx},${cy}`;
      })
      .join(" ");
  }, [timeSeries, maxPrey, tMax]);

  const predatorTimeStr = useMemo(() => {
    return timeSeries
      .map((d) => {
        const cx = 35 + (d.t / tMax) * 320;
        const cy = 210 - (d.predator / maxPredator) * 180;
        return `${cx},${cy}`;
      })
      .join(" ");
  }, [timeSeries, maxPredator, tMax]);

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
              How the Predator-Prey Cycle Works
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              1. <strong>Rabbits reproduce</strong> &rarr; 2. <strong>Foxes feast &amp; multiply</strong> &rarr; 3. <strong>Overhunted rabbits crash</strong> &rarr; 4. <strong>Starving foxes decline</strong> &rarr; Cycle repeats!
            </p>
          </div>
        </div>

        {/* 1-Click Try This Scenarios */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">1-Click Scenarios:</span>
          <button
            onClick={() => {
              setParams({ alpha: 1.0, beta: 0.1, gamma: 1.5, delta: 0.075 });
              setInitialPrey(20);
              setInitialPredator(10);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all"
          >
            ⚖️ Balanced Coexistence
          </button>
          <button
            onClick={() => {
              setParams({ alpha: 2.2, beta: 0.08, gamma: 1.2, delta: 0.04 });
              setInitialPrey(35);
              setInitialPredator(5);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-emerald-500"
          >
            🐇 Rapid Rabbit Boom
          </button>
          <button
            onClick={() => {
              setParams({ alpha: 0.6, beta: 0.2, gamma: 0.8, delta: 0.15 });
              setInitialPrey(12);
              setInitialPredator(25);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-rose-500"
          >
            🦊 Heavy Fox Overpopulation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ── Left: Phase Space & Time Series Plots (7 cols) ───── */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Predator-Prey Populations Over Time
              </span>
            </div>

            <span className="text-xs font-mono font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Center Equilibrium: ({eqPrey.toFixed(1)} rabbits, {eqPredator.toFixed(1)} foxes)
            </span>
          </div>

          {/* Phase Space & Time Series Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 min-h-[320px]">
            {/* Time Series Evolution */}
            <div className="bg-muted/20 rounded-2xl border border-border/50 p-3 flex flex-col items-center justify-between select-none">
              <div className="flex items-center justify-between w-full text-[11px] font-bold">
                <span>Population Waves</span>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-emerald-500 font-bold">● Rabbits x(t)</span>
                  <span className="text-rose-500 font-bold">● Foxes y(t)</span>
                </div>
              </div>

              <svg viewBox="0 0 380 240" className="w-full h-full max-h-[190px]">
                {/* Axes */}
                <line x1="35" y1="210" x2="365" y2="210" stroke="#64748b" strokeWidth="1.5" />
                <line x1="35" y1="20" x2="35" y2="210" stroke="#64748b" strokeWidth="1.5" />

                {/* Prey Curve (Green) */}
                <polyline
                  points={preyTimeStr}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />

                {/* Predator Curve (Rose) */}
                <polyline
                  points={predatorTimeStr}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                />
              </svg>
              <span className="text-[10px] font-medium text-muted-foreground text-center">
                Fox peaks trail behind rabbit peaks with a natural time delay
              </span>
            </div>

            {/* Phase Space (Prey vs Predator) */}
            <div className="bg-muted/20 rounded-2xl border border-border/50 p-3 flex flex-col items-center justify-between select-none">
              <span className="text-[11px] font-bold text-foreground self-start">
                Cyclic Orbit (Rabbits vs Foxes)
              </span>
              <svg viewBox="0 0 380 240" className="w-full h-full max-h-[190px]">
                {/* Axes */}
                <line x1="35" y1="210" x2="365" y2="210" stroke="#64748b" strokeWidth="1.5" />
                <line x1="35" y1="20" x2="35" y2="210" stroke="#64748b" strokeWidth="1.5" />

                {/* Axis Labels */}
                <text x="365" y="225" textAnchor="end" className="fill-emerald-500 font-mono text-[9px] font-bold">
                  Rabbits &rarr;
                </text>
                <text x="25" y="30" textAnchor="end" className="fill-rose-500 font-mono text-[9px] font-bold">
                  Foxes &uarr;
                </text>

                {/* Equilibrium Fixed Point */}
                <circle
                  cx={35 + (eqPrey / maxPrey) * 320}
                  cy={210 - (eqPredator / maxPredator) * 180}
                  r="5"
                  fill="#f59e0b"
                />

                {/* Orbit Polyline */}
                <polyline
                  points={phasePointsStr}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                />

                {/* Start Node */}
                <circle
                  cx={35 + (initialPrey / maxPrey) * 320}
                  cy={210 - (initialPredator / maxPredator) * 180}
                  r="5"
                  fill="#ec4899"
                />
              </svg>
              <span className="text-[10px] font-medium text-muted-foreground text-center">
                Closed ring shows steady loop without extinction
              </span>
            </div>
          </div>
        </div>

        {/* ── Right: Parameters & Ecological Sliders (5 cols) ──── */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Ecological Rate Controls
              </span>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3">
            <div className="space-y-1 p-2.5 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Rabbit Birth Rate (&alpha;)</span>
                <span className="font-mono text-primary font-black">{params.alpha}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={params.alpha}
                onChange={(e) => setParams({ ...params, alpha: parseFloat(e.target.value) || 1 })}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1 p-2.5 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Fox Hunting Efficiency (&beta;)</span>
                <span className="font-mono text-primary font-black">{params.beta}</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.3"
                step="0.01"
                value={params.beta}
                onChange={(e) => setParams({ ...params, beta: parseFloat(e.target.value) || 0.1 })}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1 p-2.5 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Fox Mortality / Hunger (&gamma;)</span>
                <span className="font-mono text-primary font-black">{params.gamma}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={params.gamma}
                onChange={(e) => setParams({ ...params, gamma: parseFloat(e.target.value) || 1.5 })}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1 p-2.5 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Fox Reproduction per Kill (&delta;)</span>
                <span className="font-mono text-primary font-black">{params.delta}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.2"
                step="0.005"
                value={params.delta}
                onChange={(e) => setParams({ ...params, delta: parseFloat(e.target.value) || 0.075 })}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* Initial Populations */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1">
              <label className="text-[9px] uppercase font-bold text-emerald-500 block">Initial Rabbits (x₀)</label>
              <input
                type="number"
                min="1"
                max="80"
                value={initialPrey}
                onChange={(e) => setInitialPrey(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full p-1 bg-background border border-border rounded-lg text-center font-bold"
              />
            </div>

            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-1">
              <label className="text-[9px] uppercase font-bold text-rose-500 block">Initial Foxes (y₀)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={initialPredator}
                onChange={(e) => setInitialPredator(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full p-1 bg-background border border-border rounded-lg text-center font-bold"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
