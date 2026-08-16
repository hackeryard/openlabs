"use client";

import React, { useState, useMemo } from "react";
import { collatzSequence, continuedFraction } from "./lib/numberTheoryMath";
import {
  TrendingUp,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2,
  Activity,
} from "lucide-react";

export default function CollatzFractionsCanvas() {
  const [activeTab, setActiveTab] = useState<"collatz" | "fractions">("collatz");

  // Collatz State
  const [collatzStart, setCollatzStart] = useState<number>(27);

  // Continued Fraction State
  const [fracNum, setFracNum] = useState<number>(355);
  const [fracDen, setFracDen] = useState<number>(113);

  const collatz = useMemo(() => collatzSequence(collatzStart), [collatzStart]);
  const cfTerms = useMemo(() => continuedFraction(fracNum, fracDen), [fracNum, fracDen]);

  // Collatz Plot Coordinates
  const maxVal = Math.max(...collatz.steps, 1);
  const totalSteps = collatz.steps.length;

  const pointsStr = useMemo(() => {
    return collatz.steps
      .map((val, idx) => {
        const x = 30 + (idx / Math.max(1, totalSteps - 1)) * 340;
        const y = 200 - (val / maxVal) * 160;
        return `${x},${y}`;
      })
      .join(" ");
  }, [collatz.steps, totalSteps, maxVal]);

  const collatzPresets = [
    { label: "n = 27 (111 steps, peak 9232!)", n: 27 },
    { label: "n = 19 (20 steps, peak 88)", n: 19 },
    { label: "n = 12 (9 steps, peak 16)", n: 12 },
    { label: "n = 97 (118 steps)", n: 97 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive Canvas (7 cols) ───────────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              {activeTab === "collatz"
                ? `Collatz Orbit Trajectory (n = ${collatzStart})`
                : `Continued Fraction [${cfTerms.join("; ")}]`}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl border border-border">
            <button
              onClick={() => setActiveTab("collatz")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeTab === "collatz"
                  ? "bg-primary text-primary-foreground font-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Collatz 3n + 1
            </button>
            <button
              onClick={() => setActiveTab("fractions")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeTab === "fractions"
                  ? "bg-primary text-primary-foreground font-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Continued Fractions
            </button>
          </div>
        </div>

        {activeTab === "collatz" ? (
          /* ── Collatz Trajectory Plot SVG ── */
          <div className="flex-1 flex flex-col items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 p-4 select-none">
            <svg viewBox="0 0 400 240" className="w-full h-full max-h-[240px]">
              {/* Axes */}
              <line x1="30" y1="200" x2="380" y2="200" stroke="#64748b" strokeWidth="1.5" />
              <line x1="30" y1="20" x2="30" y2="200" stroke="#64748b" strokeWidth="1.5" />

              {/* Trajectory Polyline */}
              <polyline
                points={pointsStr}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Peak Node */}
              <circle
                cx={
                  30 +
                  (collatz.steps.indexOf(collatz.peakValue) / Math.max(1, totalSteps - 1)) *
                    340
                }
                cy={200 - (collatz.peakValue / maxVal) * 160}
                r="5"
                fill="#ec4899"
              />
              <text
                x={
                  30 +
                  (collatz.steps.indexOf(collatz.peakValue) / Math.max(1, totalSteps - 1)) *
                    340
                }
                y={200 - (collatz.peakValue / maxVal) * 160 - 8}
                textAnchor="middle"
                className="fill-pink-500 font-mono text-[9px] font-black"
              >
                Peak: {collatz.peakValue}
              </text>
            </svg>

            {/* Orbit sequence excerpt */}
            <div className="w-full overflow-x-auto p-2 bg-background/80 rounded-xl border border-border mt-2 font-mono text-xs text-muted-foreground whitespace-nowrap">
              Orbit: {collatz.steps.slice(0, 15).join(" &rarr; ")}
              {collatz.steps.length > 15 && ` ... &rarr; 4 &rarr; 2 &rarr; 1`}
            </div>
          </div>
        ) : (
          /* ── Continued Fraction View ── */
          <div className="flex-1 flex flex-col items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 p-4 space-y-4">
            <div className="font-mono text-base font-black text-foreground bg-background/80 p-4 rounded-2xl border border-border text-center">
              {fracNum} / {fracDen} &approx; {(fracNum / fracDen).toFixed(6)}
            </div>

            <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-center space-y-1 font-mono text-xs">
              <span className="text-[10px] uppercase font-bold text-primary block">
                Continued Fraction Notation
              </span>
              <div className="text-xl font-black text-foreground">
                [{cfTerms[0]}; {cfTerms.slice(1).join(", ")}]
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Right: Controls & Metrics (5 cols) ──────────────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              {activeTab === "collatz" ? "Collatz Metrics & Presets" : "Fraction Inputs"}
            </span>
          </div>
        </div>

        {activeTab === "collatz" ? (
          <div className="space-y-4">
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-center">
              <div className="p-3 bg-muted/50 rounded-2xl border border-border space-y-1">
                <span className="text-[9px] uppercase font-bold text-muted-foreground block">
                  Stopping Time (Steps)
                </span>
                <span className="font-black text-primary text-base">{collatz.stoppingTime}</span>
              </div>

              <div className="p-3 bg-muted/50 rounded-2xl border border-border space-y-1">
                <span className="text-[9px] uppercase font-bold text-muted-foreground block">
                  Peak Maximum Value
                </span>
                <span className="font-black text-pink-500 text-base">{collatz.peakValue}</span>
              </div>
            </div>

            {/* Input Slider */}
            <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Starting Integer (n)</span>
                <span className="font-mono text-primary font-black">{collatzStart}</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={collatzStart}
                onChange={(e) => setCollatzStart(parseInt(e.target.value, 10) || 1)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Presets */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <span className="text-xs font-bold text-foreground block">Famous Collatz Orbits</span>
              <div className="space-y-1">
                {collatzPresets.map((pr) => (
                  <button
                    key={pr.label}
                    onClick={() => setCollatzStart(pr.n)}
                    className="w-full p-2 bg-muted hover:bg-accent border border-border rounded-xl text-left font-mono text-xs transition-all text-muted-foreground hover:text-foreground"
                  >
                    {pr.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-3 bg-muted/40 border border-border rounded-2xl space-y-1">
                <label className="text-[9px] text-muted-foreground block font-bold">Numerator</label>
                <input
                  type="number"
                  value={fracNum}
                  onChange={(e) => setFracNum(parseInt(e.target.value, 10) || 1)}
                  className="w-full p-1 bg-background border border-border rounded-lg font-bold"
                />
              </div>
              <div className="p-3 bg-muted/40 border border-border rounded-2xl space-y-1">
                <label className="text-[9px] text-muted-foreground block font-bold">Denominator</label>
                <input
                  type="number"
                  min="1"
                  value={fracDen}
                  onChange={(e) => setFracDen(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full p-1 bg-background border border-border rounded-lg font-bold"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
