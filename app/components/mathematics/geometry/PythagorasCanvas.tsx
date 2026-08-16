"use client";

import React, { useState } from "react";
import {
  Square,
  Sliders,
  Sparkles,
  CheckCircle2,
  Maximize2,
} from "lucide-react";

export default function PythagorasCanvas() {
  const [legA, setLegA] = useState<number>(70); // base (horizontal)
  const [legB, setLegB] = useState<number>(60); // height (vertical)

  const legC = Math.hypot(legA, legB);
  const areaA = legA * legA;
  const areaB = legB * legB;
  const areaC = legC * legC;

  // Triangle coordinates on canvas
  const originX = 240;
  const originY = 240;

  const vRight = { x: originX, y: originY };
  const vA = { x: originX + legA, y: originY };
  const vB = { x: originX, y: originY - legB };

  // Square on leg A (hangs downwards from originX -> originX + legA)
  const sqAPoints = `${originX},${originY} ${originX + legA},${originY} ${originX + legA},${originY + legA} ${originX},${originY + legA}`;

  // Square on leg B (hangs to the left from originX -> originX, originY - legB)
  const sqBPoints = `${originX},${originY} ${originX},${originY - legB} ${originX - legB},${originY - legB} ${originX - legB},${originY}`;

  // Square on hypotenuse c (extends perpendicularly outward)
  const sqCPoints = `${vA.x},${vA.y} ${vB.x},${vB.y} ${vB.x + legB},${vB.y - legA} ${vA.x + legB},${vA.y - legA}`;

  const triples = [
    { label: "3 - 4 - 5", a: 60, b: 80 },
    { label: "5 - 12 - 13", a: 40, b: 96 },
    { label: "8 - 15 - 17", a: 48, b: 90 },
    { label: "1 - 1 - √2", a: 70, b: 70 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: SVG Pythagoras Squares Canvas (7 cols) ────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Square size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Pythagorean Area Proof: a² + b² = c²
            </span>
          </div>

          <span className="text-xs font-mono font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Right Angle: 90.0°
          </span>
        </div>

        {/* SVG Canvas */}
        <div className="flex-1 flex items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 overflow-hidden relative select-none">
          <svg viewBox="0 0 600 440" className="w-full h-full max-h-[440px]">
            {/* Grid */}
            <defs>
              <pattern id="pyth-grid-fixed" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="600" height="440" fill="url(#pyth-grid-fixed)" />

            {/* Square on Leg A (Blue) */}
            <polygon points={sqAPoints} fill="#3b82f6" fillOpacity="0.25" stroke="#3b82f6" strokeWidth="2" />
            <text x={originX + legA / 2} y={originY + legA / 2 + 4} textAnchor="middle" className="fill-blue-500 font-mono text-xs font-black">
              a² = {areaA.toFixed(0)}
            </text>

            {/* Square on Leg B (Pink) */}
            <polygon points={sqBPoints} fill="#ec4899" fillOpacity="0.25" stroke="#ec4899" strokeWidth="2" />
            <text x={originX - legB / 2} y={originY - legB / 2 + 4} textAnchor="middle" className="fill-pink-500 font-mono text-xs font-black">
              b² = {areaB.toFixed(0)}
            </text>

            {/* Square on Hypotenuse C (Purple) */}
            <polygon points={sqCPoints} fill="#8b5cf6" fillOpacity="0.3" stroke="#8b5cf6" strokeWidth="2" />
            <text x={(vA.x + vB.x + legB) / 2} y={(vA.y + vB.y - legA) / 2} textAnchor="middle" className="fill-purple-500 font-mono text-xs font-black">
              c² = {areaC.toFixed(0)}
            </text>

            {/* Central Right Triangle */}
            <polygon
              points={`${vRight.x},${vRight.y} ${vA.x},${vA.y} ${vB.x},${vB.y}`}
              fill="#6366f1"
              fillOpacity="0.4"
              stroke="#6366f1"
              strokeWidth="3"
            />

            {/* Right Angle Box */}
            <rect x={originX} y={originY - 14} width="14" height="14" fill="none" stroke="#f59e0b" strokeWidth="2" />

            {/* Side Length Badges */}
            <g transform={`translate(${originX + legA / 2}, ${originY + 14})`}>
              <rect x="-20" y="-8" width="40" height="16" rx="4" fill="#1e1b4b" stroke="#3b82f6" strokeWidth="1.5" />
              <text y="3.5" textAnchor="middle" className="fill-blue-400 font-mono text-[9px] font-bold">
                a = {legA}
              </text>
            </g>

            <g transform={`translate(${originX - 16}, ${originY - legB / 2})`}>
              <rect x="-20" y="-8" width="40" height="16" rx="4" fill="#1e1b4b" stroke="#ec4899" strokeWidth="1.5" />
              <text y="3.5" textAnchor="middle" className="fill-pink-400 font-mono text-[9px] font-bold">
                b = {legB}
              </text>
            </g>

            <g transform={`translate(${(vA.x + vB.x) / 2 + 16}, ${(vA.y + vB.y) / 2 - 8})`}>
              <rect x="-24" y="-8" width="48" height="16" rx="4" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5" />
              <text y="3.5" textAnchor="middle" className="fill-purple-400 font-mono text-[9px] font-bold">
                c = {legC.toFixed(1)}
              </text>
            </g>

            {/* Vertices */}
            <circle cx={vRight.x} cy={vRight.y} r="5" fill="#f59e0b" />
            <circle cx={vA.x} cy={vA.y} r="5" fill="#3b82f6" />
            <circle cx={vB.x} cy={vB.y} r="5" fill="#ec4899" />
          </svg>
        </div>
      </div>

      {/* ── Right: Controls & Area Identity (5 cols) ────────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Leg Dimensions & Triples
            </span>
          </div>
        </div>

        {/* Sliders with smooth range styling */}
        <div className="space-y-4">
          <div className="space-y-1.5 p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-blue-500">Base Leg a</span>
              <span className="font-mono text-foreground font-black">{legA} px</span>
            </div>
            <input
              type="range"
              min="20"
              max="105"
              step="1"
              value={legA}
              onChange={(e) => setLegA(Math.max(20, Math.min(105, parseInt(e.target.value, 10) || 20)))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="space-y-1.5 p-3 bg-pink-500/10 border border-pink-500/20 rounded-2xl">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-pink-500">Height Leg b</span>
              <span className="font-mono text-foreground font-black">{legB} px</span>
            </div>
            <input
              type="range"
              min="20"
              max="105"
              step="1"
              value={legB}
              onChange={(e) => setLegB(Math.max(20, Math.min(105, parseInt(e.target.value, 10) || 20)))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>
        </div>

        {/* Famous Pythagorean Triples Presets */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <span className="text-xs font-bold text-foreground block">
            Pythagorean Triples Presets
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {triples.map((t) => (
              <button
                key={t.label}
                onClick={() => {
                  setLegA(t.a);
                  setLegB(t.b);
                }}
                className="p-2 bg-muted hover:bg-accent border border-border rounded-xl text-xs font-mono font-bold text-muted-foreground hover:text-foreground transition-all truncate"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Equation Box */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-primary block">
            Area Equivalence Proof
          </span>
          <div className="font-mono text-sm font-black text-foreground bg-background/80 p-3 rounded-xl border border-border text-center">
            {areaA.toFixed(0)} + {areaB.toFixed(0)} = {areaC.toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground text-center font-mono">
            a² ({areaA.toFixed(0)}) + b² ({areaB.toFixed(0)}) = c² ({areaC.toFixed(0)})
          </div>
        </div>
      </div>
    </div>
  );
}
