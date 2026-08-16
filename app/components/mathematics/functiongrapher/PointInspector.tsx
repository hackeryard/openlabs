"use client";

import React, { useState } from "react";
import { GraphFunction, PinnedPoint } from "./types";
import { TangentInfo, numericalDerivative } from "./lib/analysis";
import { evaluateAt } from "./lib/evaluator";
import { Crosshair, Pin, PinOff, TrendingUp, Compass, ArrowRight, Table } from "lucide-react";

interface PointInspectorProps {
  functions: GraphFunction[];
  pinnedPoint: PinnedPoint | null;
  onPinPoint: (point: PinnedPoint | null) => void;
  hoveredX: number | null;
  tangentInfo: TangentInfo | null;
  primaryFunction: GraphFunction | null;
}

export default function PointInspector({
  functions,
  pinnedPoint,
  onPinPoint,
  hoveredX,
  tangentInfo,
  primaryFunction,
}: PointInspectorProps) {
  const [manualX, setManualX] = useState<string>("0");

  const activeX = pinnedPoint ? pinnedPoint.x : hoveredX !== null ? hoveredX : parseFloat(manualX) || 0;

  const handleManualInspect = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(manualX);
    if (!isNaN(val) && primaryFunction?.parsed.compiled) {
      const y = evaluateAt(primaryFunction.parsed.compiled, val, primaryFunction.transform);
      onPinPoint({
        x: Number(val.toFixed(4)),
        y: Number(y.toFixed(4)),
        functionId: primaryFunction.id,
      });
    }
  };

  const handleUnpin = () => {
    onPinPoint(null);
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5 shadow-md space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <Crosshair size={16} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Point Inspector & Tangents
          </span>
        </div>

        {pinnedPoint ? (
          <button
            onClick={handleUnpin}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase tracking-wider transition-all"
          >
            <PinOff size={12} />
            <span>Unpin Point</span>
          </button>
        ) : (
          <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
            <Pin size={12} /> Hover or click to pin
          </span>
        )}
      </div>

      {/* Manual Point Input */}
      <form onSubmit={handleManualInspect} className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground font-bold">
            x =
          </span>
          <input
            type="number"
            step="any"
            value={manualX}
            onChange={(e) => setManualX(e.target.value)}
            placeholder="Inspect x value"
            className="w-full pl-10 pr-3 py-2 bg-muted border border-border rounded-xl font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="px-3.5 py-2 bg-muted hover:bg-accent border border-border rounded-xl text-xs font-bold text-foreground transition-colors active:scale-95"
        >
          Inspect
        </button>
      </form>

      {/* Active Point Coordinates & Derivatives Readout */}
      {tangentInfo && tangentInfo.isDefined ? (
        <div className="space-y-3">
          {/* Coordinates Big Badge */}
          <div className="p-4 bg-muted/60 border border-border rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground block mb-0.5">
                Evaluated Coordinate
              </span>
              <div className="font-mono text-xl font-black text-foreground">
                ({tangentInfo.x.toFixed(3)}, {tangentInfo.y.toFixed(3)})
              </div>
            </div>
            {primaryFunction && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-card border border-border shadow-sm">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: primaryFunction.color }}
                />
                <span className="font-mono text-xs font-bold text-foreground">
                  {primaryFunction.name}
                </span>
              </div>
            )}
          </div>

          {/* Tangent Slope & Angle Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted/40 border border-border rounded-2xl">
              <div className="flex items-center gap-1.5 text-pink-600 dark:text-pink-400 mb-1">
                <TrendingUp size={14} />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  Derivative f&apos;(x)
                </span>
              </div>
              <div className="font-mono text-base font-bold text-foreground">
                m = {tangentInfo.slope.toFixed(4)}
              </div>
            </div>

            <div className="p-3 bg-muted/40 border border-border rounded-2xl">
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 mb-1">
                <Compass size={14} />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  Inclination Angle
                </span>
              </div>
              <div className="font-mono text-base font-bold text-foreground">
                θ = {tangentInfo.angleDegrees.toFixed(1)}°
              </div>
            </div>
          </div>

          {/* Tangent Line Equation */}
          <div className="p-3 bg-card border border-border rounded-2xl shadow-sm">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
              Tangent Line Equation
            </div>
            <div className="font-mono text-xs font-black text-pink-600 dark:text-pink-400">
              {tangentInfo.equation}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-muted-foreground bg-muted/30 border border-dashed border-border rounded-2xl">
          Hover over graph or type an x-coordinate above to inspect tangents.
        </div>
      )}

      {/* Multi-Function Comparison Table at x = activeX */}
      {functions.filter((f) => f.isVisible).length > 1 && (
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            <span>Multi-Function Comparison (x = {activeX.toFixed(2)})</span>
            <Table size={13} />
          </div>

          <div className="border border-border rounded-2xl overflow-hidden bg-card text-xs">
            <table className="w-full text-left font-mono">
              <thead className="bg-muted text-[10px] uppercase font-bold text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-3 py-2">Function</th>
                  <th className="px-3 py-2 text-right">Value f(x)</th>
                  <th className="px-3 py-2 text-right">Slope f&apos;(x)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {functions
                  .filter((f) => f.isVisible)
                  .map((fn) => {
                    const yVal = fn.parsed.compiled
                      ? evaluateAt(fn.parsed.compiled, activeX, fn.transform)
                      : NaN;
                    const slopeVal = fn.parsed.compiled
                      ? numericalDerivative(fn.parsed.compiled, activeX, fn.transform)
                      : NaN;

                    return (
                      <tr key={fn.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-3 py-2 flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: fn.color }}
                          />
                          <span className="font-bold">{fn.name}</span>
                        </td>
                        <td className="px-3 py-2 text-right font-bold text-foreground">
                          {isNaN(yVal) ? "Undefined" : yVal.toFixed(3)}
                        </td>
                        <td className="px-3 py-2 text-right text-muted-foreground">
                          {isNaN(slopeVal) ? "—" : slopeVal.toFixed(3)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
