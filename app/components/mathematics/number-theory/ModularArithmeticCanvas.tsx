"use client";

import React, { useState, useMemo } from "react";
import { modInverse, solveCRT, extendedEuclidean } from "./lib/numberTheoryMath";
import {
  Clock,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Table,
  Plus,
  Trash2,
} from "lucide-react";

export default function ModularArithmeticCanvas() {
  const [activeTab, setActiveTab] = useState<"clock_inverse" | "crt">("clock_inverse");

  // Clock & Inverse State
  const [modM, setModM] = useState<number>(12);
  const [valA, setValA] = useState<number>(5);
  const [valB, setValB] = useState<number>(7);
  const [operation, setOperation] = useState<"add" | "multiply">("multiply");

  // Chinese Remainder Theorem State
  const [crtSystem, setCrtSystem] = useState<{ a: number; m: number }[]>([
    { a: 2, m: 3 },
    { a: 3, m: 5 },
    { a: 2, m: 7 },
  ]);

  // Clock computation
  const clockResult = operation === "add" ? (valA + valB) % modM : (valA * valB) % modM;
  const inverseA = modInverse(valA, modM);

  // CRT Solution
  const crtResult = useMemo(() => solveCRT(crtSystem), [crtSystem]);

  // Modular Clock Visual Points
  const clockRadius = 100;
  const clockCenter = { x: 180, y: 160 };
  const clockPoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i < modM; i++) {
      const angle = (i * 2 * Math.PI) / modM - Math.PI / 2;
      pts.push({
        val: i,
        x: clockCenter.x + clockRadius * Math.cos(angle),
        y: clockCenter.y + clockRadius * Math.sin(angle),
      });
    }
    return pts;
  }, [modM, clockCenter.x, clockCenter.y, clockRadius]);

  const pA = clockPoints[((valA % modM) + modM) % modM];
  const pRes = clockPoints[((clockResult % modM) + modM) % modM];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive Modular Canvas (7 cols) ───────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              {activeTab === "clock_inverse"
                ? `Modular Clock Arithmetic (Z_${modM})`
                : `Chinese Remainder Theorem (CRT)`}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl border border-border">
            <button
              onClick={() => setActiveTab("clock_inverse")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeTab === "clock_inverse"
                  ? "bg-primary text-primary-foreground font-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Clock &amp; Inverses
            </button>
            <button
              onClick={() => setActiveTab("crt")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeTab === "crt"
                  ? "bg-primary text-primary-foreground font-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              CRT Solver
            </button>
          </div>
        </div>

        {activeTab === "clock_inverse" ? (
          /* ── Modular Clock SVG View ── */
          <div className="flex-1 flex flex-col items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 p-4 select-none">
            <svg viewBox="0 0 360 320" className="w-full h-full max-h-[320px]">
              {/* Clock Circle */}
              <circle
                cx={clockCenter.x}
                cy={clockCenter.y}
                r={clockRadius}
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeDasharray="4 2"
              />

              {/* Hand to A */}
              {pA && (
                <line
                  x1={clockCenter.x}
                  y1={clockCenter.y}
                  x2={pA.x}
                  y2={pA.y}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="2 2"
                />
              )}

              {/* Hand to Result */}
              {pRes && (
                <line
                  x1={clockCenter.x}
                  y1={clockCenter.y}
                  x2={pRes.x}
                  y2={pRes.y}
                  stroke="#10b981"
                  strokeWidth="3.5"
                />
              )}

              {/* Center */}
              <circle cx={clockCenter.x} cy={clockCenter.y} r="5" fill="#6366f1" />

              {/* Clock Ticks & Numbers */}
              {clockPoints.map((pt) => {
                const isSelectedA = pt.val === ((valA % modM) + modM) % modM;
                const isRes = pt.val === ((clockResult % modM) + modM) % modM;

                let nodeBg = "#1e1b4b";
                let stroke = "#6366f1";
                if (isRes) {
                  nodeBg = "#10b981";
                  stroke = "#ffffff";
                } else if (isSelectedA) {
                  nodeBg = "#3b82f6";
                  stroke = "#ffffff";
                }

                return (
                  <g key={`clock-${pt.val}`} transform={`translate(${pt.x}, ${pt.y})`}>
                    <circle
                      r={isRes || isSelectedA ? 11 : 9}
                      fill={nodeBg}
                      stroke={stroke}
                      strokeWidth="2"
                      className="cursor-pointer hover:scale-125 transition-transform"
                      onClick={() => setValA(pt.val)}
                    />
                    <text
                      y="3.5"
                      textAnchor="middle"
                      className="fill-white font-mono text-[9px] font-black pointer-events-none"
                    >
                      {pt.val}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="font-mono text-xs text-muted-foreground mt-1">
              Result hand pointing to {clockResult} &equiv; {valA} {operation === "add" ? "+" : "·"} {valB} (mod {modM})
            </div>
          </div>
        ) : (
          /* ── Chinese Remainder Theorem System View ── */
          <div className="flex-1 flex flex-col justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 p-4 space-y-3">
            <span className="text-xs font-bold text-foreground block">
              Simultaneous System of Congruences:
            </span>

            <div className="space-y-2">
              {crtSystem.map((eq, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-card rounded-xl border border-border flex items-center justify-between font-mono text-xs"
                >
                  <span className="text-muted-foreground font-bold">Eq #{idx + 1}:</span>
                  <div className="flex items-center gap-2">
                    <span>x &equiv;</span>
                    <input
                      type="number"
                      value={eq.a}
                      onChange={(e) => {
                        const ns = [...crtSystem];
                        ns[idx].a = parseInt(e.target.value, 10) || 0;
                        setCrtSystem(ns);
                      }}
                      className="w-14 p-1 bg-background border border-border rounded-lg text-center font-bold"
                    />
                    <span>(mod</span>
                    <input
                      type="number"
                      min="2"
                      value={eq.m}
                      onChange={(e) => {
                        const ns = [...crtSystem];
                        ns[idx].m = Math.max(2, parseInt(e.target.value, 10) || 2);
                        setCrtSystem(ns);
                      }}
                      className="w-14 p-1 bg-background border border-border rounded-lg text-center font-bold text-primary"
                    />
                    <span>)</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CRT Solution Box */}
            <div className="p-4 bg-background/80 rounded-2xl border border-border text-center space-y-1 mt-2">
              <span className="text-[10px] uppercase font-bold text-primary block">
                Unique Solution Modulo M = {crtResult ? crtResult.M : "N/A"}
              </span>
              <div className="font-mono text-base font-black text-foreground">
                {crtResult ? `x ≡ ${crtResult.x} (mod ${crtResult.M})` : "Moduli not pairwise coprime!"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Right: Formulas & Inverses (5 cols) ─────────────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              {activeTab === "clock_inverse" ? "Modular Inverses & Solver" : "CRT Theory"}
            </span>
          </div>
        </div>

        {activeTab === "clock_inverse" ? (
          <div className="space-y-4">
            {/* Equation Result Box */}
            <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-primary block">
                Congruence Arithmetic
              </span>
              <div className="font-mono text-base font-black text-foreground bg-background/80 p-2.5 rounded-xl border border-border text-center">
                {valA} {operation === "add" ? "+" : "·"} {valB} &equiv; {clockResult} (mod {modM})
              </div>
            </div>

            {/* Multiplicative Inverse Box */}
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl font-mono text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-500 block">
                Modular Multiplicative Inverse (a⁻¹ mod m)
              </span>
              <div className="font-bold text-foreground text-sm">
                {inverseA !== null
                  ? `${valA}⁻¹ ≡ ${inverseA} (mod ${modM})  —  since ${valA} · ${inverseA} ≡ 1`
                  : `No inverse exists (gcd(${valA}, ${modM}) ≠ 1)`}
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-3 p-3 bg-muted/30 border border-border rounded-2xl">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-muted-foreground block font-bold">Input a</label>
                  <input
                    type="number"
                    value={valA}
                    onChange={(e) => setValA(parseInt(e.target.value, 10) || 0)}
                    className="w-full p-1.5 bg-background border border-border rounded-xl font-mono text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground block font-bold">Input b</label>
                  <input
                    type="number"
                    value={valB}
                    onChange={(e) => setValB(parseInt(e.target.value, 10) || 0)}
                    className="w-full p-1.5 bg-background border border-border rounded-xl font-mono text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] text-muted-foreground block font-bold">Modulus m</label>
                <input
                  type="number"
                  min="2"
                  max="24"
                  value={modM}
                  onChange={(e) => setModM(Math.max(2, Math.min(24, parseInt(e.target.value, 10) || 2)))}
                  className="w-full p-1.5 bg-background border border-border rounded-xl font-mono text-xs font-bold text-primary"
                />
              </div>

              {/* Operation Toggle */}
              <div className="grid grid-cols-2 gap-1 pt-1">
                <button
                  onClick={() => setOperation("add")}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                    operation === "add"
                      ? "bg-primary text-primary-foreground border-primary font-black shadow-sm"
                      : "bg-muted border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Addition (+)
                </button>
                <button
                  onClick={() => setOperation("multiply")}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                    operation === "multiply"
                      ? "bg-primary text-primary-foreground border-primary font-black shadow-sm"
                      : "bg-muted border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Multiplication (&times;)
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-primary block">
                Sunzi&apos;s Theorem (Ancient China)
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If the moduli m_1, m_2, ..., m_k are pairwise coprime, there exists a unique solution x modulo M = m_1 · m_2 · ... · m_k.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
