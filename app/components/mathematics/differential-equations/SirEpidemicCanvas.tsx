"use client";

import React, { useState, useMemo } from "react";
import { SirParams } from "./types";
import { solveSirModel } from "./lib/odeSolvers";
import {
  Activity,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  ShieldAlert,
  Users,
  Lightbulb,
} from "lucide-react";

export default function SirEpidemicCanvas() {
  const [params, setParams] = useState<SirParams>({
    beta: 0.35,   // Infection transmission rate
    gamma: 0.1,   // Recovery rate (10 days illness)
    totalPop: 1000,
    initialInfected: 5,
  });

  const [socialDistancing, setSocialDistancing] = useState<number>(0); // 0% to 70% reduction in beta

  const effectiveBeta = params.beta * (1 - socialDistancing / 100);
  const R0 = params.gamma > 0 ? effectiveBeta / params.gamma : 0;
  const herdImmunityThreshold = R0 > 1 ? (1 - 1 / R0) * 100 : 0;

  const results = useMemo(
    () =>
      solveSirModel(
        { ...params, beta: effectiveBeta },
        80,
        0.2
      ),
    [params, effectiveBeta]
  );

  const maxPop = params.totalPop;
  const tMax = 80;

  const sCurve = useMemo(() => {
    return results.map((d) => `${35 + (d.t / tMax) * 320},${210 - (d.s / maxPop) * 180}`).join(" ");
  }, [results, maxPop, tMax]);

  const iCurve = useMemo(() => {
    return results.map((d) => `${35 + (d.t / tMax) * 320},${210 - (d.i / maxPop) * 180}`).join(" ");
  }, [results, maxPop, tMax]);

  const rCurve = useMemo(() => {
    return results.map((d) => `${35 + (d.t / tMax) * 320},${210 - (d.r / maxPop) * 180}`).join(" ");
  }, [results, maxPop, tMax]);

  const peakInfected = Math.max(...results.map((d) => d.i), 0);

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
              How Pandemics Spread &amp; Stop
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              If <strong>R₀ &gt; 1</strong>, each sick person infects more than 1 other person (outbreak blows up). If <strong>R₀ &lt; 1</strong>, the chain of transmission breaks and the disease disappears!
            </p>
          </div>
        </div>

        {/* 1-Click Try This Scenarios */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">1-Click Scenarios:</span>
          <button
            onClick={() => {
              setParams({ beta: 0.45, gamma: 0.1, totalPop: 1000, initialInfected: 5 });
              setSocialDistancing(0);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-rose-500"
          >
            🔥 Unmitigated Outbreak (R₀ = 4.5)
          </button>
          <button
            onClick={() => {
              setParams({ beta: 0.45, gamma: 0.1, totalPop: 1000, initialInfected: 5 });
              setSocialDistancing(50);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-indigo-500"
          >
            🛡️ 50% Social Distancing
          </button>
          <button
            onClick={() => {
              setParams({ beta: 0.15, gamma: 0.2, totalPop: 1000, initialInfected: 5 });
              setSocialDistancing(0);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-emerald-500"
          >
            ✅ Contained (R₀ &lt; 1)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ── Left: SIR Curves Plot (7 cols) ───────────────────── */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Infection Curve: Susceptible &rarr; Infected &rarr; Recovered
              </span>
            </div>

            <span
              className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full border ${
                R0 > 1
                  ? "bg-rose-500/20 text-rose-500 border-rose-500/30"
                  : "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
              }`}
            >
              R₀ = {R0.toFixed(2)} {R0 > 1 ? "(Exponential Spread)" : "(Contained)"}
            </span>
          </div>

          {/* Curves SVG */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 p-3 select-none">
            <div className="flex items-center justify-between w-full text-xs font-bold mb-2">
              <span>Population Trajectory Over 80 Days</span>
              <div className="flex items-center gap-3 font-mono text-[10px]">
                <span className="text-blue-500 font-bold">● Healthy (S)</span>
                <span className="text-rose-500 font-bold">● Sick (I)</span>
                <span className="text-emerald-500 font-bold">● Immune (R)</span>
              </div>
            </div>

            <svg viewBox="0 0 380 240" className="w-full h-full max-h-[240px]">
              <line x1="35" y1="210" x2="365" y2="210" stroke="#64748b" strokeWidth="1.5" />
              <line x1="35" y1="20" x2="35" y2="210" stroke="#64748b" strokeWidth="1.5" />

              {/* Susceptible (Blue) */}
              <polyline points={sCurve} fill="none" stroke="#3b82f6" strokeWidth="2.5" />

              {/* Infected (Rose) */}
              <polyline points={iCurve} fill="none" stroke="#ef4444" strokeWidth="3" />

              {/* Recovered (Green) */}
              <polyline points={rCurve} fill="none" stroke="#10b981" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border mt-2 text-xs font-mono">
            <div className="p-2 bg-muted/40 rounded-xl flex justify-between">
              <span className="text-muted-foreground font-bold">Peak Overload:</span>
              <span className="font-black text-rose-500">{Math.round(peakInfected)} people ({((peakInfected / maxPop) * 100).toFixed(1)}%)</span>
            </div>
            <div className="p-2 bg-muted/40 rounded-xl flex justify-between">
              <span className="text-muted-foreground font-bold">Herd Immunity Goal:</span>
              <span className="font-black text-emerald-500">{herdImmunityThreshold.toFixed(1)}% Immune</span>
            </div>
          </div>
        </div>

        {/* ── Right: Epidemic Controls & Transmission Sliders (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Outbreak Controls
              </span>
            </div>
          </div>

          {/* Social Distancing / Flatten the Curve Slider */}
          <div className="space-y-1.5 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-indigo-500">🛡️ Flatten the Curve (Masks / Distancing)</span>
              <span className="font-mono text-indigo-500 font-black">{socialDistancing}% reduction</span>
            </div>
            <input
              type="range"
              min="0"
              max="70"
              step="5"
              value={socialDistancing}
              onChange={(e) => setSocialDistancing(parseInt(e.target.value, 10) || 0)}
              className="w-full h-2 bg-indigo-200 dark:bg-indigo-950 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-[10px] text-muted-foreground">
              Reduces contact rate, lowering the red peak below hospital capacity.
            </p>
          </div>

          {/* Sliders */}
          <div className="space-y-3">
            <div className="space-y-1 p-2.5 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Base Contagion Rate (&beta;)</span>
                <span className="font-mono text-primary font-black">{params.beta}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={params.beta}
                onChange={(e) => setParams({ ...params, beta: parseFloat(e.target.value) || 0.35 })}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1 p-2.5 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Recovery Rate (&gamma; = 1/days sick)</span>
                <span className="font-mono text-primary font-black">{params.gamma}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.3"
                step="0.01"
                value={params.gamma}
                onChange={(e) => setParams({ ...params, gamma: parseFloat(e.target.value) || 0.1 })}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* Initial Conditions */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-3 bg-muted/40 border border-border rounded-2xl space-y-1">
              <label className="text-[9px] uppercase font-bold text-muted-foreground block">City Population (N)</label>
              <input
                type="number"
                min="100"
                max="10000"
                value={params.totalPop}
                onChange={(e) => setParams({ ...params, totalPop: parseInt(e.target.value, 10) || 1000 })}
                className="w-full p-1 bg-background border border-border rounded-lg text-center font-bold"
              />
            </div>

            <div className="p-3 bg-muted/40 border border-border rounded-2xl space-y-1">
              <label className="text-[9px] uppercase font-bold text-muted-foreground block">Patient Zero (Infected)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={params.initialInfected}
                onChange={(e) => setParams({ ...params, initialInfected: parseInt(e.target.value, 10) || 1 })}
                className="w-full p-1 bg-background border border-border rounded-lg text-center font-bold"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
