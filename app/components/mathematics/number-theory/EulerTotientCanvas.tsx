"use client";

import React, { useState, useMemo } from "react";
import { eulerTotient, fastModExp } from "./lib/numberTheoryMath";
import {
  Sparkles,
  Sliders,
  Layers,
  CheckCircle2,
  Maximize2,
  Binary,
} from "lucide-react";

export default function EulerTotientCanvas() {
  const [n, setN] = useState<number>(12);
  const [baseA, setBaseA] = useState<number>(5);

  const { phi, coprimes } = useMemo(() => eulerTotient(n), [n]);
  const eulerExpResult = useMemo(() => fastModExp(baseA, phi, n).result, [baseA, phi, n]);

  // Coprimality Wheel Coordinates
  const wheelRadius = 100;
  const wheelCenter = { x: 180, y: 160 };
  const wheelNodes = useMemo(() => {
    const nodes = [];
    for (let i = 1; i <= n; i++) {
      const angle = ((i - 1) * 2 * Math.PI) / n - Math.PI / 2;
      const isCoprime = coprimes.includes(i);
      nodes.push({
        val: i,
        isCoprime,
        x: wheelCenter.x + wheelRadius * Math.cos(angle),
        y: wheelCenter.y + wheelRadius * Math.sin(angle),
      });
    }
    return nodes;
  }, [n, coprimes, wheelCenter.x, wheelCenter.y, wheelRadius]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive Coprimality Wheel (7 cols) ────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Binary size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Euler&apos;s Totient Coprimality Wheel (&phi;({n}) = {phi})
            </span>
          </div>

          <span className="text-xs font-mono font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            {phi} Coprime Numbers
          </span>
        </div>

        {/* Coprimality Wheel SVG */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 p-4 select-none">
          <svg viewBox="0 0 360 320" className="w-full h-full max-h-[320px]">
            {/* Base Circle */}
            <circle
              cx={wheelCenter.x}
              cy={wheelCenter.y}
              r={wheelRadius}
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
              strokeDasharray="3 2"
            />

            {/* Hub Center */}
            <circle cx={wheelCenter.x} cy={wheelCenter.y} r="6" fill="#6366f1" />

            {/* Wheel Spokes to Coprime Elements */}
            {wheelNodes.map((node) => {
              if (!node.isCoprime) return null;
              return (
                <line
                  key={`spoke-${node.val}`}
                  x1={wheelCenter.x}
                  y1={wheelCenter.y}
                  x2={node.x}
                  y2={node.y}
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />
              );
            })}

            {/* Nodes */}
            {wheelNodes.map((node) => (
              <g key={`node-${node.val}`} transform={`translate(${node.x}, ${node.y})`}>
                <circle
                  r={node.isCoprime ? 11 : 8}
                  fill={node.isCoprime ? "#3b82f6" : "#1e1b4b"}
                  stroke={node.isCoprime ? "#ffffff" : "#64748b"}
                  strokeWidth={node.isCoprime ? "2" : "1"}
                  className="cursor-pointer hover:scale-125 transition-transform"
                  onClick={() => setBaseA(node.val)}
                />
                <text
                  y="3.5"
                  textAnchor="middle"
                  className={`font-mono text-[9px] font-black pointer-events-none ${
                    node.isCoprime ? "fill-white" : "fill-muted-foreground"
                  }`}
                >
                  {node.val}
                </text>
              </g>
            ))}
          </svg>

          {/* Coprimes list */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center font-mono text-xs mt-1">
            <span className="text-muted-foreground font-bold">Coprimes (gcd(k, {n}) = 1):</span>
            {coprimes.map((c) => (
              <span key={c} className="px-1.5 py-0.5 bg-blue-500/20 text-blue-500 font-black rounded">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Modular Theorems & Equations (5 cols) ─────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Modular Power Theorems
            </span>
          </div>
        </div>

        {/* Euler's Theorem Box */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-primary block">
            Euler&apos;s Totient Theorem: a^&phi;(n) &equiv; 1 (mod n)
          </span>
          <div className="font-mono text-base font-black text-foreground bg-background/80 p-2.5 rounded-xl border border-border text-center">
            {baseA}^&phi;({n}) = {baseA}^{phi} &equiv; {eulerExpResult} (mod {n})
          </div>
          <div className="text-xs text-muted-foreground text-center font-mono">
            Holds whenever gcd(a, n) = 1!
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground">Modulus n</span>
              <span className="font-mono text-primary font-black">{n}</span>
            </div>
            <input
              type="range"
              min="2"
              max="24"
              step="1"
              value={n}
              onChange={(e) => setN(parseInt(e.target.value, 10) || 2)}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground">Base a</span>
              <span className="font-mono text-primary font-black">{baseA}</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={baseA}
              onChange={(e) => setBaseA(parseInt(e.target.value, 10) || 1)}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        {/* Wilson's Theorem Info */}
        <div className="p-3 bg-muted/30 border border-border rounded-2xl text-xs space-y-1">
          <span className="font-bold text-foreground block">Wilson&apos;s Theorem</span>
          <p className="text-muted-foreground">
            An integer p &gt; 1 is prime if and only if (p - 1)! &equiv; -1 (mod p).
          </p>
        </div>
      </div>
    </div>
  );
}
