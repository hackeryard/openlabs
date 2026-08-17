"use client";

import React, { useState, useMemo } from "react";
import { HarmonicParams } from "./types";
import { solveHarmonicOscillator } from "./lib/odeSolvers";
import {
  Activity,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2,
  Volume2,
  Lightbulb,
} from "lucide-react";

export default function HarmonicOscillatorCanvas() {
  const [params, setParams] = useState<HarmonicParams>({
    mass: 1.0,
    damping: 0.3,
    springK: 4.0,
    forceAmp: 0.0,
    forceFreq: 2.0,
  });

  const [initialX, setInitialX] = useState<number>(3.0);
  const [initialV, setInitialV] = useState<number>(0.0);

  // Invariants
  const omega0 = Math.sqrt(params.springK / params.mass);
  const criticalDamping = 2 * Math.sqrt(params.mass * params.springK);
  const zeta = params.damping / criticalDamping; // Damping ratio

  let dampingRegime = "Underdamped (Oscillating)";
  if (Math.abs(zeta - 1) < 0.05) dampingRegime = "Critically Damped (Fastest Recovery)";
  else if (zeta > 1) dampingRegime = "Overdamped (Sluggish Decay)";

  const { timeSeries, phaseTrajectory } = useMemo(
    () => solveHarmonicOscillator(params, initialX, initialV, 20, 0.03),
    [params, initialX, initialV]
  );

  // SVG Scales
  const maxDisp = 4.5;
  const tMax = 20;

  const timeSeriesStr = useMemo(() => {
    return timeSeries
      .map((d) => {
        const cx = 35 + (d.t / tMax) * 320;
        const cy = 120 - (d.x / maxDisp) * 80;
        return `${cx},${cy}`;
      })
      .join(" ");
  }, [timeSeries, maxDisp, tMax]);

  const phaseStr = useMemo(() => {
    return phaseTrajectory
      .map((pt) => {
        const cx = 190 + (pt.x / maxDisp) * 140;
        const cy = 120 - (pt.y / (maxDisp * omega0)) * 90;
        return `${cx},${cy}`;
      })
      .join(" ");
  }, [phaseTrajectory, maxDisp, omega0]);

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
              How Springs and Damping Work
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pull a mass on a spring and let go. <strong>No friction</strong> = bounces forever. <strong>Car shock absorbers</strong> = critically damped (stops in 1 motion). <strong>Pushing a child on a swing at the right rhythm</strong> = Resonance!
            </p>
          </div>
        </div>

        {/* 1-Click Try This Scenarios */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">1-Click Scenarios:</span>
          <button
            onClick={() => {
              setParams({ mass: 1, damping: 0.2, springK: 4, forceAmp: 0, forceFreq: 2 });
              setInitialX(3.5);
              setInitialV(0);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all"
          >
            🎸 Ringing Guitar String
          </button>
          <button
            onClick={() => {
              setParams({ mass: 1, damping: 4.0, springK: 4, forceAmp: 0, forceFreq: 2 });
              setInitialX(3.5);
              setInitialV(0);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-emerald-500"
          >
            🚗 Car Shock Absorber (Critical)
          </button>
          <button
            onClick={() => {
              setParams({ mass: 1, damping: 0.3, springK: 4, forceAmp: 2.5, forceFreq: 2.0 });
              setInitialX(0);
              setInitialV(0);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-indigo-500"
          >
            📢 Driven Resonance (&omega; = &omega;₀)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ── Left: Displacement Waveform & Phase Ellipse (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Motion Waveform &amp; Phase Ellipse
              </span>
            </div>

            <span
              className={`text-xs font-mono font-black uppercase px-2.5 py-0.5 rounded-full border ${
                zeta < 1
                  ? "bg-indigo-500/20 text-indigo-500 border-indigo-500/30"
                  : Math.abs(zeta - 1) < 0.05
                  ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-500 border-amber-500/30"
              }`}
            >
              &zeta; = {zeta.toFixed(2)} ({dampingRegime.split(" ")[0]})
            </span>
          </div>

          {/* Displacement Time Series */}
          <div className="flex-1 flex flex-col justify-between min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 p-3 select-none">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Displacement x(t) Over Time</span>
                <span className="font-mono text-primary font-bold">Natural Frequency &omega;₀ = {omega0.toFixed(2)} rad/s</span>
              </div>
              <svg viewBox="0 0 380 160" className="w-full h-full max-h-[150px]">
                <line x1="35" y1="120" x2="365" y2="120" stroke="#64748b" strokeWidth="1.5" />
                <line x1="35" y1="20" x2="35" y2="140" stroke="#64748b" strokeWidth="1.5" />

                <polyline points={timeSeriesStr} fill="none" stroke="#6366f1" strokeWidth="2.5" />
              </svg>
            </div>

            {/* Phase Space Portrait (x vs v) */}
            <div className="space-y-1 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Phase Orbit (Position x vs Speed v)</span>
                <span className="font-mono text-emerald-500 font-bold">Inward Spiral Drains Energy</span>
              </div>
              <svg viewBox="0 0 380 140" className="w-full h-full max-h-[130px]">
                <line x1="20" y1="70" x2="360" y2="70" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />
                <line x1="190" y1="10" x2="190" y2="130" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />

                <polyline points={phaseStr} fill="none" stroke="#10b981" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Right: Mass, Spring, Damping & Forcing Controls (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Physical Controls
              </span>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3">
            <div className="space-y-1 p-2.5 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Spring Stiffness (k)</span>
                <span className="font-mono text-primary font-black">{params.springK} N/m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={params.springK}
                onChange={(e) => setParams({ ...params, springK: parseFloat(e.target.value) || 4 })}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1 p-2.5 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Friction / Damping (c)</span>
                <span className="font-mono text-primary font-black">{params.damping} N·s/m</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="6.0"
                step="0.1"
                value={params.damping}
                onChange={(e) => setParams({ ...params, damping: parseFloat(e.target.value) || 0 })}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1 p-2.5 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">External Motor Push (F₀)</span>
                <span className="font-mono text-primary font-black">{params.forceAmp} N</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="5.0"
                step="0.2"
                value={params.forceAmp}
                onChange={(e) => setParams({ ...params, forceAmp: parseFloat(e.target.value) || 0 })}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {params.forceAmp > 0 && (
              <div className="space-y-1 p-2.5 bg-muted/40 border border-border rounded-2xl">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-foreground">Push Rhythm Frequency (&omega;)</span>
                  <span className="font-mono text-primary font-black">{params.forceFreq} rad/s</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={params.forceFreq}
                  onChange={(e) => setParams({ ...params, forceFreq: parseFloat(e.target.value) || 2 })}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Initial Conditions */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-3 bg-muted/40 border border-border rounded-2xl space-y-1">
              <label className="text-[9px] uppercase font-bold text-muted-foreground block">Initial Pull Position (x₀)</label>
              <input
                type="number"
                step="0.5"
                value={initialX}
                onChange={(e) => setInitialX(parseFloat(e.target.value) || 0)}
                className="w-full p-1 bg-background border border-border rounded-lg text-center font-bold"
              />
            </div>

            <div className="p-3 bg-muted/40 border border-border rounded-2xl space-y-1">
              <label className="text-[9px] uppercase font-bold text-muted-foreground block">Initial Push Velocity (v₀)</label>
              <input
                type="number"
                step="0.5"
                value={initialV}
                onChange={(e) => setInitialV(parseFloat(e.target.value) || 0)}
                className="w-full p-1 bg-background border border-border rounded-lg text-center font-bold"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
