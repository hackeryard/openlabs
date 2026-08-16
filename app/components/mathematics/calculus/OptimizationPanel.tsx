"use client";

import React, { useMemo } from "react";
import { CalculusFunctionPreset, CalculusCriticalPoint } from "./types";
import { CALCULUS_PRESETS, findCalculusLandmarks } from "./lib/calculusMath";
import {
  Sparkles,
  TrendingUp,
  Activity,
  BookOpen,
  CheckCircle2,
  Sliders,
} from "lucide-react";

interface OptimizationPanelProps {
  currentPreset: CalculusFunctionPreset;
  onSelectPreset: (preset: CalculusFunctionPreset) => void;
  onExtremaFound?: () => void;
}

export default function OptimizationPanel({
  currentPreset,
  onSelectPreset,
  onExtremaFound,
}: OptimizationPanelProps) {
  const { fn, dfn, d2fn, expression, derivativeExpr } = currentPreset;

  // Detect critical points
  const criticalPoints: CalculusCriticalPoint[] = useMemo(
    () => findCalculusLandmarks(fn, dfn, d2fn, -5, 5),
    [fn, dfn, d2fn]
  );

  return (
    <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-lg space-y-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Calculus Presets & Optimization Studio
          </span>
        </div>
      </div>

      {/* ── Preset Grid ────────────────────────────────────── */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-foreground block">
          Select Calculus Test Function
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CALCULUS_PRESETS.map((preset) => {
            const isSelected = preset.id === currentPreset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  onExtremaFound?.();
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "bg-primary/15 border-primary text-foreground shadow-sm ring-1 ring-primary/30"
                    : "bg-muted hover:bg-accent border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="text-xs font-bold text-foreground">{preset.name}</div>
                <div className="text-[10px] font-mono text-primary font-bold mt-0.5 truncate">
                  {preset.expression}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Critical Points & Second Derivative Test Table ──── */}
      <div className="p-4 bg-muted/50 border border-border rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-foreground">
            Stationary Critical Points (f&apos;(x) = 0)
          </span>
          <span className="text-[10px] font-bold text-muted-foreground">
            {criticalPoints.length} points detected
          </span>
        </div>

        {criticalPoints.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {criticalPoints.map((pt, idx) => (
              <div
                key={`crit-${idx}`}
                className="p-3 bg-background/80 border border-border/80 rounded-xl space-y-1 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      pt.type === "local_min"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : pt.type === "local_max"
                        ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {pt.type === "local_min"
                      ? "Local Minimum"
                      : pt.type === "local_max"
                      ? "Local Maximum"
                      : "Saddle Point"}
                  </span>
                  <span className="font-bold text-foreground">{pt.formatted}</span>
                </div>

                <div className="text-[10px] text-muted-foreground pt-1 border-t border-border/50 flex justify-between">
                  <span>f&apos;&apos;(x) = {pt.secondDerivative.toFixed(2)}</span>
                  <span className="font-bold text-primary">
                    {pt.secondDerivative > 0 ? "Concave Up (∪)" : "Concave Down (∩)"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-background/50 rounded-xl text-center text-xs text-muted-foreground">
            No stationary points in visible interval (monotonic function).
          </div>
        )}
      </div>

      {/* ── Fundamental Derivative & Integral Reference ─────── */}
      <div className="pt-2 border-t border-border space-y-2">
        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <BookOpen size={14} className="text-primary" />
          <span>Core Calculus Rules Quick Reference</span>
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
          <div className="p-2.5 bg-muted/60 rounded-xl border border-border/80">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">Power Rule</span>
            <span className="font-bold text-foreground">d/dx [xⁿ] = n·xⁿ⁻¹</span>
          </div>
          <div className="p-2.5 bg-muted/60 rounded-xl border border-border/80">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">Product Rule</span>
            <span className="font-bold text-foreground">(u·v)&apos; = u&apos;v + uv&apos;</span>
          </div>
          <div className="p-2.5 bg-muted/60 rounded-xl border border-border/80">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">Chain Rule</span>
            <span className="font-bold text-foreground">[f(g(x))]&apos; = f&apos;(g)·g&apos;</span>
          </div>
          <div className="p-2.5 bg-muted/60 rounded-xl border border-border/80">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">Fundamental Theorem</span>
            <span className="font-bold text-foreground">d/dx [∫ₐˣ f(t)dt] = f(x)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
