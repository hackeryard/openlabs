"use client";

import React, { useState, useMemo } from "react";
import { extendedEuclidean } from "./lib/numberTheoryMath";
import {
  Maximize2,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Table,
  Grid,
} from "lucide-react";

export default function EuclideanGcdCanvas() {
  const [numA, setNumA] = useState<number>(84);
  const [numB, setNumB] = useState<number>(36);

  const result = useMemo(() => extendedEuclidean(numA, numB), [numA, numB]);

  const presets = [
    { label: "84 & 36 (GCD = 12)", a: 84, b: 36 },
    { label: "Fibonacci 89 & 55 (Worst Case, GCD = 1)", a: 89, b: 55 },
    { label: "Coprime 105 & 38 (GCD = 1)", a: 105, b: 38 },
    { label: "252 & 105 (GCD = 21)", a: 252, b: 105 },
  ];

  // Geometric Rectangle Dimensions for Tiling
  const scale = 240 / Math.max(numA, numB);
  const rectW = numA * scale;
  const rectH = numB * scale;
  const tileSize = result.gcd * scale;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Geometric Tiling & Division Steps Canvas (7 cols) */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Maximize2 size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Euclidean Algorithm & Geometric Square Tiling
            </span>
          </div>

          <span className="text-xs font-mono font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            GCD({numA}, {numB}) = {result.gcd}
          </span>
        </div>

        {/* Geometric Tiling SVG */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[220px] bg-muted/20 rounded-2xl border border-border/50 p-4 select-none">
          <svg viewBox="0 0 400 240" className="w-full h-full max-h-[220px]">
            {/* Outer Rectangle a x b */}
            <rect
              x={(400 - rectW) / 2}
              y={(240 - rectH) / 2}
              width={rectW}
              height={rectH}
              fill="#6366f1"
              fillOpacity="0.15"
              stroke="#6366f1"
              strokeWidth="2.5"
            />

            {/* Square Tiles of size gcd x gcd */}
            {tileSize > 3 &&
              Array.from({ length: Math.min(25, Math.floor(numA / result.gcd)) }).map((_, c) =>
                Array.from({ length: Math.min(25, Math.floor(numB / result.gcd)) }).map((_, r) => (
                  <rect
                    key={`tile-${c}-${r}`}
                    x={(400 - rectW) / 2 + c * tileSize}
                    y={(240 - rectH) / 2 + r * tileSize}
                    width={tileSize}
                    height={tileSize}
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="1"
                    strokeOpacity="0.5"
                  />
                ))
              )}

            {/* Dimension labels */}
            <text
              x={200}
              y={(240 - rectH) / 2 - 8}
              textAnchor="middle"
              className="fill-primary font-mono text-xs font-black"
            >
              Width a = {numA}
            </text>
            <text
              x={(400 - rectW) / 2 - 8}
              y={120}
              textAnchor="end"
              className="fill-primary font-mono text-xs font-black"
            >
              Height b = {numB}
            </text>
          </svg>
          <span className="text-[10px] font-mono text-muted-foreground mt-1">
            Exact tiling by {numA / result.gcd} &times; {numB / result.gcd} = {(numA * numB) / (result.gcd * result.gcd)} squares of size {result.gcd}&times;{result.gcd}
          </span>
        </div>

        {/* Division Steps Table */}
        <div className="mt-3 pt-3 border-t border-border overflow-y-auto max-h-[140px]">
          <span className="text-xs font-bold text-foreground block mb-1.5">
            Step-by-Step Division Algorithm ({result.steps.length} Steps):
          </span>
          <div className="space-y-1 font-mono text-xs">
            {result.steps.map((st) => (
              <div
                key={st.step}
                className="p-1.5 px-3 bg-muted/40 rounded-xl border border-border flex items-center justify-between"
              >
                <span className="text-muted-foreground font-bold">Step #{st.step}:</span>
                <span className="text-foreground font-bold">{st.equation}</span>
                <span className="text-emerald-500 font-bold">r = {st.r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Bézout's Identity & LCM (5 cols) ─────────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Bézout&apos;s Identity & Inputs
            </span>
          </div>
        </div>

        {/* Editable Inputs for a and b */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-muted/40 border border-border rounded-2xl space-y-1">
            <label className="text-[9px] text-muted-foreground uppercase font-bold block">Integer a</label>
            <input
              type="number"
              min="1"
              value={numA}
              onChange={(e) => setNumA(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full p-1.5 bg-background border border-border rounded-xl font-mono text-sm font-black"
            />
          </div>

          <div className="p-3 bg-muted/40 border border-border rounded-2xl space-y-1">
            <label className="text-[9px] text-muted-foreground uppercase font-bold block">Integer b</label>
            <input
              type="number"
              min="1"
              value={numB}
              onChange={(e) => setNumB(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full p-1.5 bg-background border border-border rounded-xl font-mono text-sm font-black"
            />
          </div>
        </div>

        {/* Bézout's Identity Box */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-amber-500 block">
            Bézout&apos;s Identity: ax + by = gcd(a, b)
          </span>
          <div className="font-mono text-sm font-black text-foreground bg-background/80 p-3 rounded-xl border border-border text-center">
            {numA}({result.x}) + {numB}({result.y}) = {result.gcd}
          </div>
          <div className="text-xs text-muted-foreground text-center font-mono">
            Bézout Coefficients: x = {result.x}, y = {result.y}
          </div>
        </div>

        {/* LCM Box */}
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1 font-mono text-xs text-center">
          <span className="text-[10px] uppercase font-bold text-emerald-500 block">
            Least Common Multiple: LCM(a, b)
          </span>
          <div className="text-foreground font-black text-base">
            LCM({numA}, {numB}) = |a·b| / gcd = {result.lcm.toLocaleString()}
          </div>
        </div>

        {/* Presets */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <span className="text-xs font-bold text-foreground block">Classic Euclidean Presets</span>
          <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
            {presets.map((pr) => (
              <button
                key={pr.label}
                onClick={() => {
                  setNumA(pr.a);
                  setNumB(pr.b);
                }}
                className="p-2 bg-muted hover:bg-accent border border-border rounded-xl text-left transition-all truncate text-muted-foreground hover:text-foreground"
              >
                {pr.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
