"use client";

import React, { useMemo, useState, useCallback } from "react";
import { CalculusFunctionPreset } from "./types";
import {
  Sliders,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  Maximize2,
  Minimize2,
  CheckCircle2,
} from "lucide-react";

interface DerivativeLimitCanvasProps {
  preset: CalculusFunctionPreset;
  x0: number;
  onChangeX0: (x0: number) => void;
  h: number;
  onChangeH: (h: number) => void;
  showSecantLine: boolean;
  onToggleSecantLine: () => void;
  showTangentLine: boolean;
  onToggleTangentLine: () => void;
  showDerivativeGraph: boolean;
  onToggleDerivativeGraph: () => void;
  onLimitApproached?: () => void;
}

export default function DerivativeLimitCanvas({
  preset,
  x0,
  onChangeX0,
  h,
  onChangeH,
  showSecantLine,
  onToggleSecantLine,
  showTangentLine,
  onToggleTangentLine,
  showDerivativeGraph,
  onToggleDerivativeGraph,
  onLimitApproached,
}: DerivativeLimitCanvasProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const { fn, dfn, expression, derivativeExpr } = preset;

  // Evaluation points
  const y0 = fn(x0);
  const xQ = x0 + h;
  const yQ = fn(xQ);
  const deltaY = yQ - y0;
  const deltaX = h;
  const secantSlope = Math.abs(h) > 1e-5 ? deltaY / deltaX : dfn(x0);
  const tangentSlope = dfn(x0);

  // SVG dimensions
  const width = 600;
  const height = 450;
  const domainRadius = 4 / zoomLevel;

  const xScale = useCallback(
    (x: number) => ((x + domainRadius) / (2 * domainRadius)) * width,
    [domainRadius, width]
  );

  const yScale = useCallback(
    (y: number) => height - ((y + domainRadius) / (2 * domainRadius)) * height,
    [domainRadius, height]
  );

  const originX = xScale(0);
  const originY = yScale(0);

  // Generate main function curve f(x)
  const curvePath = useMemo(() => {
    const points: string[] = [];
    const steps = 300;
    const xMin = -domainRadius;
    const xMax = domainRadius;
    const dx = (xMax - xMin) / steps;

    for (let i = 0; i <= steps; i++) {
      const x = xMin + i * dx;
      const y = fn(x);
      if (isNaN(y) || !isFinite(y)) continue;
      const px = xScale(x);
      const py = yScale(y);
      if (points.length === 0) points.push(`M ${px.toFixed(1)} ${py.toFixed(1)}`);
      else points.push(`L ${px.toFixed(1)} ${py.toFixed(1)}`);
    }

    return points.join(" ");
  }, [fn, domainRadius, xScale, yScale]);

  // Generate derivative function curve f'(x)
  const derivCurvePath = useMemo(() => {
    if (!showDerivativeGraph) return null;
    const points: string[] = [];
    const steps = 300;
    const xMin = -domainRadius;
    const xMax = domainRadius;
    const dx = (xMax - xMin) / steps;

    for (let i = 0; i <= steps; i++) {
      const x = xMin + i * dx;
      const y = dfn(x);
      if (isNaN(y) || !isFinite(y)) continue;
      const px = xScale(x);
      const py = yScale(y);
      if (points.length === 0) points.push(`M ${px.toFixed(1)} ${py.toFixed(1)}`);
      else points.push(`L ${px.toFixed(1)} ${py.toFixed(1)}`);
    }

    return points.join(" ");
  }, [showDerivativeGraph, dfn, domainRadius, xScale, yScale]);

  // Secant Line coordinates: through P(x0, y0) and Q(xQ, yQ)
  const secantLine = useMemo(() => {
    if (!showSecantLine) return null;
    const span = 4;
    const x1 = x0 - span;
    const y1 = y0 - secantSlope * span;
    const x2 = x0 + span;
    const y2 = y0 + secantSlope * span;

    return {
      x1: xScale(x1),
      y1: yScale(y1),
      x2: xScale(x2),
      y2: yScale(y2),
    };
  }, [showSecantLine, x0, y0, secantSlope, xScale, yScale]);

  // Tangent Line coordinates: through P(x0, y0) with slope f'(x0)
  const tangentLine = useMemo(() => {
    if (!showTangentLine) return null;
    const span = 4;
    const x1 = x0 - span;
    const y1 = y0 - tangentSlope * span;
    const x2 = x0 + span;
    const y2 = y0 + tangentSlope * span;

    return {
      x1: xScale(x1),
      y1: yScale(y1),
      x2: xScale(x2),
      y2: yScale(y2),
    };
  }, [showTangentLine, x0, y0, tangentSlope, xScale, yScale]);

  // Handle h slider change
  const handleHChange = (val: number) => {
    onChangeH(val);
    if (Math.abs(val) < 0.05) {
      onLimitApproached?.();
    }
  };

  const pxP = xScale(x0);
  const pyP = yScale(y0);
  const pxQ = xScale(xQ);
  const pyQ = yScale(yQ);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive Canvas (7 cols) ────────────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Secant-to-Tangent Limit Canvas
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z * 1.25, 4))}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Maximize2 size={13} />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z / 1.25, 0.5))}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Minimize2 size={13} />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* SVG Surface */}
        <div className="flex-1 flex items-center justify-center min-h-[340px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full max-h-[460px] cursor-crosshair select-none"
          >
            <defs>
              <clipPath id="calc-deriv-clip">
                <rect x="0" y="0" width={width} height={height} rx="20" ry="20" />
              </clipPath>
            </defs>

            <g clipPath="url(#calc-deriv-clip)">
              {/* Axes */}
              <line
                x1={0}
                y1={originY}
                x2={width}
                y2={originY}
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="2"
              />
              <line
                x1={originX}
                y1={0}
                x2={originX}
                y2={height}
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="2"
              />

              {/* Derivative Curve f'(x) (if enabled) */}
              {derivCurvePath && (
                <path
                  d={derivCurvePath}
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="2.5"
                  strokeDasharray="5 3"
                  strokeOpacity="0.8"
                />
              )}

              {/* Primary Curve f(x) */}
              <path
                d={curvePath}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Secant Slope Triangle (Delta X & Delta Y) */}
              {showSecantLine && Math.abs(h) > 0.05 && (
                <g className="opacity-80">
                  {/* Delta X horizontal leg */}
                  <line
                    x1={pxP}
                    y1={pyP}
                    x2={pxQ}
                    y2={pyP}
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="3 2"
                  />
                  {/* Delta Y vertical leg */}
                  <line
                    x1={pxQ}
                    y1={pyP}
                    x2={pxQ}
                    y2={pyQ}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="3 2"
                  />
                </g>
              )}

              {/* Secant Line (Purple) */}
              {secantLine && (
                <line
                  x1={secantLine.x1}
                  y1={secantLine.y1}
                  x2={secantLine.x2}
                  y2={secantLine.y2}
                  stroke="#a855f7"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
              )}

              {/* Tangent Line (Amber) */}
              {tangentLine && (
                <line
                  x1={tangentLine.x1}
                  y1={tangentLine.y1}
                  x2={tangentLine.x2}
                  y2={tangentLine.y2}
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />
              )}

              {/* Fixed Point P(x0, y0) */}
              <circle cx={pxP} cy={pyP} r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
              <text
                x={pxP - 10}
                y={pyP - 10}
                textAnchor="end"
                className="fill-amber-500 font-mono text-[10px] font-black"
              >
                P({x0.toFixed(2)}, {y0.toFixed(2)})
              </text>

              {/* Moving Point Q(x0 + h, y0 + deltaY) */}
              {showSecantLine && Math.abs(h) > 0.02 && (
                <g>
                  <circle cx={pxQ} cy={pyQ} r="5.5" fill="#a855f7" stroke="#ffffff" strokeWidth="2" />
                  <text
                    x={pxQ + 10}
                    y={pyQ + 14}
                    textAnchor="start"
                    className="fill-purple-500 font-mono text-[10px] font-black"
                  >
                    Q({xQ.toFixed(2)}, {yQ.toFixed(2)})
                  </text>
                </g>
              )}
            </g>
          </svg>
        </div>

        {/* Bottom Legend */}
        <div className="grid grid-cols-3 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              f(x) at x₀
            </span>
            <span className="font-mono font-bold text-foreground">
              {y0.toFixed(3)}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-purple-500 block">
              Secant Slope (Δy/Δx)
            </span>
            <span className="font-mono font-bold text-purple-500">
              m = {secantSlope.toFixed(4)}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-amber-500 block">
              Exact Tangent f&apos;(x₀)
            </span>
            <span className="font-mono font-bold text-amber-500">
              f&apos;({x0.toFixed(2)}) = {tangentSlope.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: Differential Calculus Controls (5 cols) ───── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Derivative Limit Console
            </span>
          </div>
        </div>

        {/* Active Function Card */}
        <div className="p-3.5 bg-muted/50 border border-border rounded-2xl space-y-1.5 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
            {preset.name}
          </span>
          <div className="text-base sm:text-lg font-black font-mono text-primary bg-background/70 py-2 px-3 rounded-xl border border-border/80">
            {expression}
          </div>
          <div className="text-xs font-mono font-bold text-pink-500">
            {derivativeExpr}
          </div>
        </div>

        {/* Point x0 and Step Size h Sliders */}
        <div className="space-y-4">
          {/* x0 slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground">
                Base Point Position <span className="font-mono text-amber-500">(x₀)</span>
              </span>
              <span className="font-mono text-amber-500">{x0.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={x0}
              onChange={(e) => onChangeX0(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* h slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground">
                Step Size <span className="font-mono text-purple-500">(h → 0)</span>
              </span>
              <span className="font-mono text-purple-500 font-black">
                h = {h.toFixed(3)}
              </span>
            </div>
            <input
              type="range"
              min="0.001"
              max="2.5"
              step="0.01"
              value={h}
              onChange={(e) => handleHChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>

        {/* Difference Quotient Step-by-Step Card */}
        <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between text-foreground font-bold">
            <span>Difference Quotient Expansion</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground">
              Δy / Δx
            </span>
          </div>

          <div className="bg-background/80 p-2.5 rounded-xl border border-border/80 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Δx (Run):</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                h = {deltaX.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Δy (Rise):</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                f({xQ.toFixed(2)}) - f({x0.toFixed(2)}) = {deltaY.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-border/60">
              <span className="text-muted-foreground">Secant Slope m:</span>
              <span className="font-black text-purple-600 dark:text-purple-400">
                {secantSlope.toFixed(4)}
              </span>
            </div>
          </div>

          {Math.abs(h) < 0.05 && (
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
              <CheckCircle2 size={12} />
              <span>Limit converged: secant line has snapped to the tangent line!</span>
            </div>
          )}
        </div>

        {/* Feature Toggles */}
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Graph Overlays
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              onClick={onToggleSecantLine}
              className={`p-2 rounded-xl border font-bold text-center transition-all ${
                showSecantLine
                  ? "bg-purple-500/15 border-purple-500 text-purple-600 dark:text-purple-400"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Secant Line
            </button>

            <button
              onClick={onToggleTangentLine}
              className={`p-2 rounded-xl border font-bold text-center transition-all ${
                showTangentLine
                  ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Tangent Line
            </button>

            <button
              onClick={onToggleDerivativeGraph}
              className={`p-2 rounded-xl border font-bold text-center transition-all ${
                showDerivativeGraph
                  ? "bg-pink-500/15 border-pink-500 text-pink-600 dark:text-pink-400"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              f&apos;(x) Curve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
