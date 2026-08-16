"use client";

import React, { useMemo, useState, useCallback } from "react";
import { CalculusFunctionPreset, RiemannMethod, RiemannSumResult } from "./types";
import { computeRiemannSum } from "./lib/calculusMath";
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Sliders,
  Sparkles,
  Layers,
  BookOpen,
} from "lucide-react";

interface RiemannSumCanvasProps {
  preset: CalculusFunctionPreset;
  a: number;
  onChangeA: (a: number) => void;
  b: number;
  onChangeB: (b: number) => void;
  partitionsN: number;
  onChangePartitionsN: (n: number) => void;
  method: RiemannMethod;
  onChangeMethod: (m: RiemannMethod) => void;
  onIntegralComputed?: () => void;
}

export default function RiemannSumCanvas({
  preset,
  a,
  onChangeA,
  b,
  onChangeB,
  partitionsN,
  onChangePartitionsN,
  method,
  onChangeMethod,
  onIntegralComputed,
}: RiemannSumCanvasProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const { fn, expression } = preset;

  // Compute Riemann Sum
  const riemannResult: RiemannSumResult = useMemo(
    () => computeRiemannSum(fn, a, b, partitionsN, method),
    [fn, a, b, partitionsN, method]
  );

  // SVG Canvas scale
  const width = 600;
  const height = 450;
  const domainRadius = 5 / zoomLevel;

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

  const handlePartitionChange = (n: number) => {
    onChangePartitionsN(n);
    onIntegralComputed?.();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive Canvas (7 cols) ────────────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Riemann Partition Surface (N = {partitionsN})
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

        {/* SVG Riemann Slices Rendering */}
        <div className="flex-1 flex items-center justify-center min-h-[340px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full max-h-[460px] cursor-crosshair select-none"
          >
            <defs>
              <clipPath id="riemann-canvas-clip">
                <rect x="0" y="0" width={width} height={height} rx="20" ry="20" />
              </clipPath>
            </defs>

            <g clipPath="url(#riemann-canvas-clip)">
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

              {/* Riemann Partitions Slices */}
              {riemannResult.slices.map((sl, idx) => {
                const px1 = xScale(sl.xLeft);
                const px2 = xScale(sl.xRight);
                const pyTop = yScale(sl.height);
                const pyBase = originY;

                if (method === "trapezoid") {
                  const pyLeft = yScale(sl.yLeft);
                  const pyRight = yScale(sl.yRight);
                  return (
                    <polygon
                      key={`slice-${idx}`}
                      points={`${px1},${pyBase} ${px1},${pyLeft} ${px2},${pyRight} ${px2},${pyBase}`}
                      fill="#6366f1"
                      fillOpacity="0.25"
                      stroke="#6366f1"
                      strokeWidth="1"
                    />
                  );
                }

                // Rectangular slices for left, right, midpoint, simpson
                const sliceHeight = Math.abs(pyTop - pyBase);
                const sliceY = Math.min(pyTop, pyBase);

                return (
                  <rect
                    key={`slice-${idx}`}
                    x={px1}
                    y={sliceY}
                    width={Math.max(1, px2 - px1)}
                    height={sliceHeight}
                    fill="#6366f1"
                    fillOpacity="0.22"
                    stroke="#6366f1"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Function Curve f(x) */}
              <path
                d={curvePath}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Integration Lower Bound Line x = a */}
              <line
                x1={xScale(a)}
                y1={0}
                x2={xScale(a)}
                y2={height}
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <text
                x={xScale(a) + 4}
                y={20}
                className="fill-emerald-500 font-mono text-[10px] font-bold"
              >
                a = {a.toFixed(2)}
              </text>

              {/* Integration Upper Bound Line x = b */}
              <line
                x1={xScale(b)}
                y1={0}
                x2={xScale(b)}
                y2={height}
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <text
                x={xScale(b) - 4}
                y={20}
                textAnchor="end"
                className="fill-rose-500 font-mono text-[10px] font-bold"
              >
                b = {b.toFixed(2)}
              </text>
            </g>
          </svg>
        </div>

        {/* Bottom Area Calculation Summary Strip */}
        <div className="grid grid-cols-3 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Riemann Approx
            </span>
            <span className="font-mono font-bold text-primary text-sm">
              {riemannResult.approxArea.toFixed(4)}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Exact Integral ∫ₐᵇ f(x)dx
            </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {riemannResult.exactArea.toFixed(4)}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Absolute Error (|ε|)
            </span>
            <span className="font-mono font-bold text-rose-500 text-sm">
              {riemannResult.error.toFixed(4)} ({riemannResult.percentError.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: Riemann Method Controls (5 cols) ──────────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Riemann Sum Configuration
            </span>
          </div>
        </div>

        {/* Method Switcher Pills */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground block">
            Approximation Rule
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
            {(
              [
                ["left", "Left Sum (L_N)"],
                ["right", "Right Sum (R_N)"],
                ["midpoint", "Midpoint (M_N)"],
                ["trapezoid", "Trapezoid (T_N)"],
                ["simpson", "Simpson (S_N)"],
              ] as [RiemannMethod, string][]
            ).map(([mId, mLabel]) => (
              <button
                key={mId}
                onClick={() => onChangeMethod(mId)}
                className={`py-2 rounded-xl text-center transition-all ${
                  method === mId
                    ? "bg-primary text-primary-foreground shadow-md font-extrabold"
                    : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
                } ${mId === "simpson" ? "col-span-2" : ""}`}
              >
                {mLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders: Partitions N, Lower Bound a, Upper Bound b */}
        <div className="space-y-3.5 pt-2 border-t border-border">
          {/* Partitions N */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground">
                Partitions <span className="font-mono text-primary">(N)</span>
              </span>
              <span className="font-mono text-primary font-black">{partitionsN} slices</span>
            </div>
            <input
              type="range"
              min="2"
              max="80"
              step="1"
              value={partitionsN}
              onChange={(e) => handlePartitionChange(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Lower Bound a */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground">
                Lower Bound <span className="font-mono text-emerald-500">(a)</span>
              </span>
              <span className="font-mono text-emerald-500">{a.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-4"
              max={b - 0.5}
              step="0.1"
              value={a}
              onChange={(e) => onChangeA(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Upper Bound b */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground">
                Upper Bound <span className="font-mono text-rose-500">(b)</span>
              </span>
              <span className="font-mono text-rose-500">{b.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={a + 0.5}
              max="4"
              step="0.1"
              value={b}
              onChange={(e) => onChangeB(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>
        </div>

        {/* Fundamental Theorem of Calculus Card */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl text-xs space-y-1.5">
          <h4 className="font-bold text-foreground flex items-center gap-1.5">
            <BookOpen size={14} className="text-primary" />
            <span>Fundamental Theorem of Calculus</span>
          </h4>
          <p className="text-muted-foreground">
            As the partition count <code>N → ∞</code> (and width <code>Δx → 0</code>), all Riemann sums converge to the definite integral:
          </p>
          <div className="font-mono text-xs font-bold text-primary bg-background/60 p-2 rounded-xl text-center border border-border/80">
            ∫ₐᵇ f(x) dx = F(b) - F(a) = lim[N→∞] ∑ᵢ₌₁ᴺ f(xᵢ*) Δx
          </div>
        </div>
      </div>
    </div>
  );
}
