"use client";

import React, { useState, useMemo } from "react";
import {
  catalanNumber,
  generateDyckPaths,
  generateBalancedParentheses,
} from "./lib/combinatoricsMath";
import {
  Sparkles,
  Sliders,
  Layers,
  CheckCircle2,
  Maximize2,
  Grid,
} from "lucide-react";

export default function CatalanCanvas() {
  const [n, setN] = useState<number>(3);
  const [selectedPathIdx, setSelectedPathIdx] = useState<number>(0);

  const totalCatalan = catalanNumber(n);
  const dyckPaths = useMemo(() => generateDyckPaths(n), [n]);
  const balancedParens = useMemo(() => generateBalancedParentheses(n), [n]);

  const currentPath = dyckPaths[selectedPathIdx] || dyckPaths[0] || "";

  // Convert current Dyck path string ("UUDD...") into grid coordinate points
  const pathPoints = useMemo(() => {
    let currX = 0;
    let currY = 0;
    const pts = [{ x: 0, y: 0 }];
    for (const step of currentPath) {
      if (step === "U") currX += 1;
      if (step === "D") currY += 1;
      pts.push({ x: currX, y: currY });
    }
    return pts;
  }, [currentPath]);

  const gridScale = 220 / Math.max(1, n);
  const svgOrigin = { x: 40, y: 260 };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive Dyck Path Grid Canvas (7 cols) ──── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Grid size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Dyck Paths Grid & Catalan Numbers (C_{n} = {totalCatalan})
            </span>
          </div>

          <span className="text-xs font-mono font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Path #{selectedPathIdx + 1} of {totalCatalan}
          </span>
        </div>

        {/* SVG Dyck Grid Canvas */}
        <div className="flex-1 flex items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 overflow-hidden relative select-none">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-[340px]">
            {/* Grid Lines */}
            {Array.from({ length: n + 1 }).map((_, i) => (
              <React.Fragment key={`grid-${i}`}>
                {/* Horizontal line */}
                <line
                  x1={svgOrigin.x}
                  y1={svgOrigin.y - i * gridScale}
                  x2={svgOrigin.x + n * gridScale}
                  y2={svgOrigin.y - i * gridScale}
                  stroke="#64748b"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
                {/* Vertical line */}
                <line
                  x1={svgOrigin.x + i * gridScale}
                  y1={svgOrigin.y}
                  x2={svgOrigin.x + i * gridScale}
                  y2={svgOrigin.y - n * gridScale}
                  stroke="#64748b"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
              </React.Fragment>
            ))}

            {/* Diagonal boundary y = x (path cannot cross above this) */}
            <line
              x1={svgOrigin.x}
              y1={svgOrigin.y}
              x2={svgOrigin.x + n * gridScale}
              y2={svgOrigin.y - n * gridScale}
              stroke="#ec4899"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <text
              x={svgOrigin.x + n * gridScale + 6}
              y={svgOrigin.y - n * gridScale + 4}
              className="fill-pink-500 font-mono text-[9px] font-bold"
            >
              Diagonal y = x
            </text>

            {/* Dyck Path line */}
            {pathPoints.map((pt, idx) => {
              if (idx === 0) return null;
              const prev = pathPoints[idx - 1];
              return (
                <line
                  key={`path-seg-${idx}`}
                  x1={svgOrigin.x + prev.x * gridScale}
                  y1={svgOrigin.y - prev.y * gridScale}
                  x2={svgOrigin.x + pt.x * gridScale}
                  y2={svgOrigin.y - pt.y * gridScale}
                  stroke="#6366f1"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Path Nodes */}
            {pathPoints.map((pt, idx) => (
              <circle
                key={`node-${idx}`}
                cx={svgOrigin.x + pt.x * gridScale}
                cy={svgOrigin.y - pt.y * gridScale}
                r="4.5"
                fill="#6366f1"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>

        {/* Balanced Parentheses Tag */}
        <div className="p-3 bg-muted/40 border border-border rounded-2xl mt-2 flex items-center justify-between text-xs font-mono">
          <span className="text-muted-foreground font-bold">Equivalent Parentheses:</span>
          <span className="font-black text-primary text-sm tracking-wider">
            {balancedParens[selectedPathIdx]}
          </span>
        </div>
      </div>

      {/* ── Right: Catalan Formulas & Paths Selector (5 cols) ── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Catalan Number Formula
            </span>
          </div>
        </div>

        {/* Formula Box */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-primary block">
            n-th Catalan Number: C_n
          </span>
          <div className="font-mono text-base font-black text-foreground bg-background/80 p-2.5 rounded-xl border border-border text-center">
            C_{n} = 1/({n}+1) · C({2 * n}, {n}) = {totalCatalan}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Counts Dyck paths, balanced parentheses expressions, and triangulations of convex ({n + 2})-gons.
          </p>
        </div>

        {/* Slider for n */}
        <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">Order / Steps (n)</span>
            <span className="font-mono text-primary font-black">{n}</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={n}
            onChange={(e) => {
              setN(parseInt(e.target.value, 10) || 1);
              setSelectedPathIdx(0);
            }}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* All Dyck Paths Selector */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground block">
            All {totalCatalan} Dyck Paths / Expressions
          </span>
          <div className="max-h-[220px] overflow-y-auto space-y-1 pr-1 font-mono text-xs">
            {dyckPaths.map((path, pIdx) => (
              <button
                key={pIdx}
                onClick={() => setSelectedPathIdx(pIdx)}
                className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                  selectedPathIdx === pIdx
                    ? "bg-primary text-primary-foreground border-primary font-black shadow-sm"
                    : "bg-muted hover:bg-accent border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>#{pIdx + 1}: {balancedParens[pIdx]}</span>
                <span className="text-[10px] opacity-75">{path}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
