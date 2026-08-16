"use client";

import React, { useState } from "react";
import { IDENTITIES, EXACT_ANGLES, normalizeDeg } from "./lib/trigMath";
import { CheckCircle2, BookOpen, Sparkles, Compass, ArrowRight } from "lucide-react";

interface IdentitiesPanelProps {
  currentAngleDeg: number;
  onSelectAngle: (deg: number) => void;
  onVerifyIdentity?: () => void;
}

export default function IdentitiesPanel({
  currentAngleDeg,
  onSelectAngle,
  onVerifyIdentity,
}: IdentitiesPanelProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "pythagorean" | "doubleAngle">("all");
  const normDeg = normalizeDeg(currentAngleDeg);

  const filteredIdentities =
    activeCategory === "all"
      ? IDENTITIES
      : IDENTITIES.filter((item) => item.category === activeCategory);

  return (
    <div className="bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Identities & Unit Circle Reference
          </span>
        </div>

        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveCategory("pythagorean")}
            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
              activeCategory === "pythagorean"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pythagoras
          </button>
          <button
            onClick={() => setActiveCategory("doubleAngle")}
            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
              activeCategory === "doubleAngle"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Double Angle
          </button>
        </div>
      </div>

      {/* ── Live Identity Verification Cards ───────────────── */}
      <div className="space-y-3">
        {filteredIdentities.map((item) => {
          const lhsVal = item.lhs(normDeg);
          const rhsVal = item.rhs(normDeg);
          const isMatch =
            !isNaN(lhsVal) && !isNaN(rhsVal) && Math.abs(lhsVal - rhsVal) < 1e-4;

          return (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-muted/40 border border-border hover:border-primary/40 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span>{item.name}</span>
                </h4>
                {isMatch ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={11} />
                    Verified (LHS = RHS)
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    Undefined at pole
                  </span>
                )}
              </div>

              <div className="font-mono text-xs font-bold text-primary bg-background/60 p-2 rounded-xl border border-border/70 text-center">
                {item.formula}
              </div>

              {/* Live Calculation at current angle */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-muted/60 p-2 rounded-xl text-center">
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground block">
                    LHS (θ = {normDeg.toFixed(1)}°)
                  </span>
                  <span className="font-bold text-foreground">
                    {isNaN(lhsVal) ? "Undefined" : lhsVal.toFixed(4)}
                  </span>
                </div>
                <div className="border-l border-border/80">
                  <span className="text-[9px] uppercase font-bold text-muted-foreground block">
                    RHS (θ = {normDeg.toFixed(1)}°)
                  </span>
                  <span className="font-bold text-foreground">
                    {isNaN(rhsVal) ? "Undefined" : rhsVal.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Exact Unit Circle Table Reference ──────────────── */}
      <div className="pt-3 border-t border-border space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground">
            Standard Unit Circle Table
          </span>
          <span className="text-[10px] text-muted-foreground">Click row to set angle</span>
        </div>

        <div className="max-h-48 overflow-y-auto rounded-2xl border border-border thin-scrollbar">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-muted text-[10px] uppercase font-bold text-muted-foreground sticky top-0 border-b border-border">
              <tr>
                <th className="p-2">Deg (θ)</th>
                <th className="p-2">Rad</th>
                <th className="p-2 text-emerald-500">sin(θ)</th>
                <th className="p-2 text-blue-500">cos(θ)</th>
                <th className="p-2 text-amber-500">tan(θ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {EXACT_ANGLES.filter((a) => a.deg < 360).map((row) => {
                const isCurrent = Math.abs(normalizeDeg(currentAngleDeg) - row.deg) < 1;
                return (
                  <tr
                    key={row.deg}
                    onClick={() => {
                      onSelectAngle(row.deg);
                      onVerifyIdentity?.();
                    }}
                    className={`cursor-pointer transition-colors ${
                      isCurrent
                        ? "bg-primary/15 font-bold text-foreground"
                        : "hover:bg-accent/70 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <td className="p-2 font-bold">{row.deg}°</td>
                    <td className="p-2 text-primary">{row.radStr}</td>
                    <td className="p-2 text-emerald-600 dark:text-emerald-400">{row.sinStr}</td>
                    <td className="p-2 text-blue-600 dark:text-blue-400">{row.cosStr}</td>
                    <td className="p-2 text-amber-600 dark:text-amber-400">{row.tanStr}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
