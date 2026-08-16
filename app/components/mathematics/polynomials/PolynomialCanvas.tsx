"use client";

import React, { useMemo, useState, useCallback } from "react";
import {
  evaluatePolynomial,
  formatPolynomial,
  findPolynomialLandmarks,
} from "./lib/polynomialMath";
import { CriticalPoint } from "./types";
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Sliders,
  Layers,
} from "lucide-react";

interface PolynomialCanvasProps {
  degree: number;
  onChangeDegree: (deg: number) => void;
  coeffs: number[];
  onChangeCoeffs: (coeffs: number[]) => void;
}

export default function PolynomialCanvas({
  degree,
  onChangeDegree,
  coeffs,
  onChangeCoeffs,
}: PolynomialCanvasProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  // Width & bounds
  const width = 600;
  const height = 450;
  const domainRadius = 6 / zoomLevel;

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

  // Detect landmarks (extrema & inflection points)
  const landmarks: CriticalPoint[] = useMemo(
    () => findPolynomialLandmarks(coeffs, -domainRadius, domainRadius),
    [coeffs, domainRadius]
  );

  // Generate continuous SVG Path
  const curvePath = useMemo(() => {
    const points: string[] = [];
    const steps = 300;
    const xMin = -domainRadius;
    const xMax = domainRadius;
    const dx = (xMax - xMin) / steps;

    for (let i = 0; i <= steps; i++) {
      const x = xMin + i * dx;
      const y = evaluatePolynomial(coeffs, x);
      const px = xScale(x);
      const py = yScale(y);

      if (i === 0) points.push(`M ${px.toFixed(1)} ${py.toFixed(1)}`);
      else points.push(`L ${px.toFixed(1)} ${py.toFixed(1)}`);
    }

    return points.join(" ");
  }, [coeffs, domainRadius, xScale, yScale]);

  // Handle coefficient change
  const handleCoeffChange = (idx: number, val: number) => {
    const next = [...coeffs];
    next[idx] = val;
    onChangeCoeffs(next);
  };

  // Change degree preset
  const handleDegreeSelect = (deg: number) => {
    onChangeDegree(deg);
    if (deg === 1) onChangeCoeffs([1, 0]); // y = x
    else if (deg === 2) onChangeCoeffs([1, 0, -4]); // y = x^2 - 4
    else if (deg === 3) onChangeCoeffs([1, 0, -3, 0]); // y = x^3 - 3x
    else if (deg === 4) onChangeCoeffs([0.5, 0, -3, 0, 2]); // y = 0.5x^4 - 3x^2 + 2
    else if (deg === 5) onChangeCoeffs([0.2, 0, -2, 0, 1.5, 0]); // y = 0.2x^5 - 2x^3 + 1.5x
  };

  // End-behavior description
  const leadingA = coeffs[0] || 1;
  const isDegreeEven = degree % 2 === 0;
  const endBehavior = useMemo(() => {
    if (isDegreeEven) {
      return leadingA > 0
        ? "Both ends rise to +∞ (↑ ... ↑)"
        : "Both ends fall to -∞ (↓ ... ↓)";
    } else {
      return leadingA > 0
        ? "Falls left to -∞, rises right to +∞ (↓ ... ↑)"
        : "Rises left to +∞, falls right to -∞ (↑ ... ↓)";
    }
  }, [leadingA, isDegreeEven]);

  const powerLabels = useMemo(() => {
    const list: string[] = [];
    for (let i = 0; i <= degree; i++) {
      const p = degree - i;
      if (p === 0) list.push("constant c");
      else if (p === 1) list.push("x term");
      else list.push(`x^${p} term`);
    }
    return list;
  }, [degree]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive Canvas (7 cols) ────────────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Degree {degree} Polynomial Plane
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

        {/* SVG Plot */}
        <div className="flex-1 flex items-center justify-center min-h-[340px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full max-h-[460px] cursor-crosshair select-none"
          >
            <defs>
              <clipPath id="poly-canvas-clip">
                <rect x="0" y="0" width={width} height={height} rx="20" ry="20" />
              </clipPath>
            </defs>

            <g clipPath="url(#poly-canvas-clip)">
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

              {/* Curve */}
              <path
                d={curvePath}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Critical Landmarks (Minima, Maxima, Inflections) */}
              {landmarks.map((pt, idx) => {
                const px = xScale(pt.x);
                const py = yScale(pt.y);
                if (px < 0 || px > width || py < 0 || py > height) return null;

                const isMin = pt.type === "local_min";
                const isMax = pt.type === "local_max";
                const color = isMin ? "#10b981" : isMax ? "#ef4444" : "#f59e0b";

                return (
                  <g key={`crit-${idx}`}>
                    <circle
                      cx={px}
                      cy={py}
                      r="5.5"
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={px}
                      y={isMax ? py - 8 : py + 14}
                      textAnchor="middle"
                      className="font-mono text-[9px] font-black"
                      fill={color}
                    >
                      {pt.type === "local_min"
                        ? `Min ${pt.formatted}`
                        : pt.type === "local_max"
                        ? `Max ${pt.formatted}`
                        : `Inflection ${pt.formatted}`}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Bottom equation */}
        <div className="p-3 bg-muted/60 border border-border rounded-2xl text-center">
          <span className="text-sm sm:text-base font-black font-mono text-primary">
            {formatPolynomial(coeffs)}
          </span>
        </div>
      </div>

      {/* ── Right: Polynomial Degree Controls & Sliders (5 cols) */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Degree & Coefficients
            </span>
          </div>
        </div>

        {/* Degree Selector */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground block">Select Degree (n)</span>
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5].map((d) => (
              <button
                key={d}
                onClick={() => handleDegreeSelect(d)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  degree === d
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
                }`}
              >
                {d === 1 ? "1 (Linear)" : d === 2 ? "2 (Quad)" : d === 3 ? "3 (Cubic)" : d === 4 ? "4 (Quartic)" : "5 (Quintic)"}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders for each coefficient */}
        <div className="space-y-3 pt-2 border-t border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Coefficients Console [aₙ ... a₀]
          </span>

          {coeffs.map((coeffVal, idx) => {
            const power = degree - idx;
            return (
              <div key={`coeff-${idx}`} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-foreground">
                    {powerLabels[idx]} <span className="font-mono text-primary">(a{power})</span>
                  </span>
                  <span className="font-mono text-primary">{coeffVal.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="0.1"
                  value={coeffVal}
                  onChange={(e) => handleCoeffChange(idx, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            );
          })}
        </div>

        {/* End-Behavior Info Card */}
        <div className="p-3.5 bg-muted/60 border border-border rounded-2xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            End Behavior Analysis
          </span>
          <p className="text-xs font-medium text-foreground">{endBehavior}</p>
        </div>
      </div>
    </div>
  );
}
