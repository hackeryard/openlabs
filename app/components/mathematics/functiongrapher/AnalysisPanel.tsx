"use client";

import React, { useState } from "react";
import { GraphFunction, IntegralConfig } from "./types";
import {
  RootPoint,
  ExtremaPoint,
  computeDefiniteIntegral,
  IntegralResult,
} from "./lib/analysis";
import {
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Calculator,
  ArrowRight,
} from "lucide-react";

interface AnalysisPanelProps {
  primaryFunction: GraphFunction | null;
  roots: RootPoint[];
  yIntercept: { x: number; y: number; formatted: string } | null;
  extrema: ExtremaPoint[];
  integralConfig: IntegralConfig | null;
  onUpdateIntegralConfig: (config: IntegralConfig | null) => void;
  onSelectCoordinate: (x: number, y: number) => void;
}

export default function AnalysisPanel({
  primaryFunction,
  roots,
  yIntercept,
  extrema,
  integralConfig,
  onUpdateIntegralConfig,
  onSelectCoordinate,
}: AnalysisPanelProps) {
  const [lowerBound, setLowerBound] = useState<string>(
    integralConfig ? String(integralConfig.lowerBound) : "-2"
  );
  const [upperBound, setUpperBound] = useState<string>(
    integralConfig ? String(integralConfig.upperBound) : "2"
  );

  if (!primaryFunction) {
    return (
      <div className="bg-card border border-border rounded-3xl p-8 text-center text-muted-foreground shadow-md">
        <Activity className="mx-auto mb-2 opacity-30 text-primary" size={28} />
        <p className="text-sm font-semibold">No active function selected for analysis.</p>
        <p className="text-xs opacity-75 mt-1">Plot or select a primary function to view mathematical features.</p>
      </div>
    );
  }

  const numA = parseFloat(lowerBound);
  const numB = parseFloat(upperBound);
  const isValidBounds = !isNaN(numA) && !isNaN(numB);

  const integralResult: IntegralResult = isValidBounds && primaryFunction.parsed.compiled
    ? computeDefiniteIntegral(primaryFunction.parsed.compiled, numA, numB, primaryFunction.transform)
    : { a: numA, b: numB, value: NaN, isDefined: false, formatted: "N/A" };

  const handleApplyIntegral = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidBounds) {
      onUpdateIntegralConfig({
        functionId: primaryFunction.id,
        lowerBound: numA,
        upperBound: numB,
      });
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5 shadow-md space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Calculus & Mathematical Analysis
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-muted border border-border">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: primaryFunction.color }}
          />
          <span className="font-mono text-xs font-bold text-foreground">
            {primaryFunction.name}
          </span>
        </div>
      </div>

      {/* 1. Roots (x-Intercepts) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Roots / x-Intercepts [f(x) = 0]
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {roots.length} found
          </span>
        </div>

        {roots.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {roots.map((root, idx) => (
              <button
                key={`root-${idx}`}
                onClick={() => onSelectCoordinate(root.x, root.y)}
                className="p-2.5 rounded-xl bg-muted/50 hover:bg-emerald-500/10 border border-border hover:border-emerald-500/30 text-left transition-all group"
              >
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-emerald-600">
                  Root #{idx + 1}
                </div>
                <div className="font-mono text-xs font-black text-foreground group-hover:text-emerald-600">
                  x = {root.x}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-3 px-4 rounded-xl bg-muted/30 border border-dashed border-border text-xs text-muted-foreground">
            No real roots found within current visible domain.
          </div>
        )}
      </div>

      {/* 2. y-Intercept & Extrema */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
        {/* y-Intercept */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
            y-Intercept [f(0)]
          </span>
          {yIntercept ? (
            <button
              onClick={() => onSelectCoordinate(yIntercept.x, yIntercept.y)}
              className="w-full p-2.5 rounded-xl bg-muted/50 hover:bg-muted border border-border text-left transition-colors font-mono"
            >
              <div className="text-xs font-black text-foreground">
                (0, {yIntercept.y})
              </div>
            </button>
          ) : (
            <div className="p-2.5 rounded-xl bg-muted/30 border border-dashed border-border text-xs text-muted-foreground">
              Undefined
            </div>
          )}
        </div>

        {/* Extrema Summary Count */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
            Turning Points
          </span>
          <div className="p-2.5 rounded-xl bg-muted/50 border border-border font-mono text-xs font-black text-foreground">
            {extrema.length} Local Extrema
          </div>
        </div>
      </div>

      {/* 3. Local Extrema List */}
      {extrema.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Stationary Points & Extrema
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {extrema.map((ex, idx) => (
              <button
                key={`extrema-${idx}`}
                onClick={() => onSelectCoordinate(ex.x, ex.y)}
                className="w-full p-2.5 rounded-xl bg-muted/40 hover:bg-amber-500/10 border border-border hover:border-amber-500/30 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-2">
                  {ex.type === "maximum" ? (
                    <TrendingUp size={14} className="text-amber-500" />
                  ) : (
                    <TrendingDown size={14} className="text-blue-500" />
                  )}
                  <span className="text-xs font-bold text-foreground group-hover:text-amber-600">
                    Local {ex.type === "maximum" ? "Max" : "Min"}
                  </span>
                </div>
                <div className="font-mono text-xs font-black text-foreground">
                  ({ex.x}, {ex.y})
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Definite Integral Calculator */}
      <div className="space-y-3 pt-2 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            <Calculator size={14} className="text-primary" />
            <span>Definite Integral ∫ f(x) dx</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold">
            Simpson&apos;s Rule
          </span>
        </div>

        <form onSubmit={handleApplyIntegral} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-muted-foreground">Lower Bound (a)</label>
              <input
                type="number"
                step="any"
                value={lowerBound}
                onChange={(e) => setLowerBound(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-muted border border-border rounded-xl font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-muted-foreground">Upper Bound (b)</label>
              <input
                type="number"
                step="any"
                value={upperBound}
                onChange={(e) => setUpperBound(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-muted border border-border rounded-xl font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all active:scale-98"
          >
            Compute & Shade Area
          </button>
        </form>

        {/* Integral Result Display */}
        <div className="p-3.5 bg-muted/60 border border-border rounded-2xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">
              Net Area
            </span>
            <div className="font-mono text-lg font-black text-indigo-600 dark:text-indigo-400">
              ∫_{lowerBound}^{upperBound} f(x) dx = {integralResult.formatted}
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Layers size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
