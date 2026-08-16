"use client";

import React, { useRef, useState, useMemo, useCallback } from "react";
import { QuadraticParams, QuadraticRoots, ParabolaLandmarks } from "./types";
import {
  calculateQuadraticRoots,
  calculateParabolaLandmarks,
  formatQuadraticStandard,
  formatQuadraticVertex,
} from "./lib/polynomialMath";
import {
  Maximize2,
  Minimize2,
  Crosshair,
  Sliders,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";

interface QuadraticCanvasProps {
  params: QuadraticParams;
  onUpdateParams: (updates: Partial<QuadraticParams>) => void;
  showVertex: boolean;
  showAxisOfSymmetry: boolean;
  showRoots: boolean;
  showFocusDirectrix: boolean;
  showTangent: boolean;
  tangentX: number;
  onUpdateTangentX?: (x: number) => void;
}

export default function QuadraticCanvas({
  params,
  onUpdateParams,
  showVertex,
  showAxisOfSymmetry,
  showRoots,
  showFocusDirectrix,
  showTangent,
  tangentX,
  onUpdateTangentX,
}: QuadraticCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const { a, b, c } = params;

  // Parabola calculations
  const landmarks: ParabolaLandmarks = useMemo(
    () => calculateParabolaLandmarks(a, b, c),
    [a, b, c]
  );
  const roots: QuadraticRoots = useMemo(
    () => calculateQuadraticRoots(a, b, c),
    [a, b, c]
  );

  // Canvas bounds & coordinate scales
  const width = 600;
  const height = 450;
  const domainRadius = 8 / zoomLevel;

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

  // Generate SVG Path for Parabola: y = ax^2 + bx + c
  const parabolaPath = useMemo(() => {
    const points: string[] = [];
    const steps = 240;
    const xMin = -domainRadius;
    const xMax = domainRadius;
    const dx = (xMax - xMin) / steps;

    for (let i = 0; i <= steps; i++) {
      const x = xMin + i * dx;
      const y = a * x * x + b * x + c;
      const px = xScale(x);
      const py = yScale(y);

      if (i === 0) points.push(`M ${px.toFixed(1)} ${py.toFixed(1)}`);
      else points.push(`L ${px.toFixed(1)} ${py.toFixed(1)}`);
    }

    return points.join(" ");
  }, [a, b, c, domainRadius, xScale, yScale]);

  // Tangent line coordinates at tangentX: slope m = 2ax + b, y_t = ax^2 + bx + c
  const tangentLine = useMemo(() => {
    if (!showTangent) return null;
    const x0 = tangentX;
    const y0 = a * x0 * x0 + b * x0 + c;
    const slope = 2 * a * x0 + b;

    const span = 4;
    const x1 = x0 - span;
    const y1 = y0 - slope * span;
    const x2 = x0 + span;
    const y2 = y0 + slope * span;

    return {
      x1: xScale(x1),
      y1: yScale(y1),
      x2: xScale(x2),
      y2: yScale(y2),
      px: xScale(x0),
      py: yScale(y0),
      slope,
      x0,
      y0,
    };
  }, [showTangent, tangentX, a, b, c, xScale, yScale]);

  // Generate grid ticks
  const ticks = useMemo(() => {
    const list: number[] = [];
    const step = zoomLevel >= 2 ? 1 : 2;
    for (let t = -Math.floor(domainRadius); t <= Math.floor(domainRadius); t += step) {
      if (t !== 0) list.push(t);
    }
    return list;
  }, [domainRadius, zoomLevel]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative"
    >
      {/* ── Top Header Strip ─────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
        <div className="flex items-center gap-2">
          <Crosshair size={16} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Parabola Coordinate Plane
          </span>
        </div>

        {/* Zoom and Reset Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z * 1.25, 4))}
            className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Zoom In"
          >
            <Maximize2 size={13} />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z / 1.25, 0.5))}
            className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Zoom Out"
          >
            <Minimize2 size={13} />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Reset Zoom"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* ── Interactive SVG Plotting Surface ─────────────────── */}
      <div className="flex-1 flex items-center justify-center relative min-h-[340px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full max-h-[460px] cursor-crosshair select-none"
        >
          <defs>
            <clipPath id="quad-canvas-clip">
              <rect x="0" y="0" width={width} height={height} rx="20" ry="20" />
            </clipPath>
          </defs>

          <g clipPath="url(#quad-canvas-clip)">
            {/* 1. Background Coordinate Grid */}
            <g className="opacity-30">
              {ticks.map((t) => {
                const px = xScale(t);
                const py = yScale(t);
                return (
                  <g key={`grid-${t}`}>
                    {/* Vertical grid line */}
                    <line
                      x1={px}
                      y1={0}
                      x2={px}
                      y2={height}
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      className="text-border"
                    />
                    {/* Horizontal grid line */}
                    <line
                      x1={0}
                      y1={py}
                      x2={width}
                      y2={py}
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      className="text-border"
                    />
                  </g>
                );
              })}
            </g>

            {/* 2. X and Y Axes */}
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

            {/* Axis Tick Numbers */}
            {ticks.map((t) => (
              <g key={`label-${t}`} className="font-mono text-[9px] fill-muted-foreground select-none">
                <text x={xScale(t)} y={originY + 12} textAnchor="middle">
                  {t}
                </text>
                <text x={originX - 6} y={yScale(t) + 3} textAnchor="end">
                  {t}
                </text>
              </g>
            ))}

            {/* 3. Directrix Line: y = directrix (if enabled) */}
            {showFocusDirectrix && (
              <g>
                <line
                  x1={0}
                  y1={yScale(landmarks.directrix)}
                  x2={width}
                  y2={yScale(landmarks.directrix)}
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={12}
                  y={yScale(landmarks.directrix) - 5}
                  className="fill-rose-500 font-mono text-[9px] font-bold"
                >
                  Directrix: y = {landmarks.directrix.toFixed(2)}
                </text>
              </g>
            )}

            {/* 4. Axis of Symmetry (if enabled) */}
            {showAxisOfSymmetry && (
              <g>
                <line
                  x1={xScale(landmarks.axisOfSymmetry)}
                  y1={0}
                  x2={xScale(landmarks.axisOfSymmetry)}
                  y2={height}
                  stroke="#6366f1"
                  strokeWidth="1.5"
                  strokeDasharray="5 3"
                  strokeOpacity="0.8"
                />
                <text
                  x={xScale(landmarks.axisOfSymmetry) + 6}
                  y={20}
                  className="fill-primary font-mono text-[9px] font-bold"
                >
                  x = {landmarks.axisOfSymmetry.toFixed(2)}
                </text>
              </g>
            )}

            {/* 5. Parabola Curve */}
            <path
              d={parabolaPath}
              fill="none"
              stroke="#6366f1"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 6. Tangent Line (if enabled) */}
            {tangentLine && (
              <g>
                <line
                  x1={tangentLine.x1}
                  y1={tangentLine.y1}
                  x2={tangentLine.x2}
                  y2={tangentLine.y2}
                  stroke="#ec4899"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <circle
                  cx={tangentLine.px}
                  cy={tangentLine.py}
                  r="5"
                  fill="#ec4899"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text
                  x={tangentLine.px + 8}
                  y={tangentLine.py - 8}
                  className="fill-pink-500 font-mono text-[9px] font-bold"
                >
                  m = {tangentLine.slope.toFixed(2)}
                </text>
              </g>
            )}

            {/* 7. Focus Point (if enabled) */}
            {showFocusDirectrix && (
              <g>
                <circle
                  cx={xScale(landmarks.focus.x)}
                  cy={yScale(landmarks.focus.y)}
                  r="5"
                  fill="#ef4444"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <text
                  x={xScale(landmarks.focus.x) + 7}
                  y={yScale(landmarks.focus.y) + 3}
                  className="fill-rose-500 font-mono text-[9px] font-bold"
                >
                  Focus ({landmarks.focus.x.toFixed(1)}, {landmarks.focus.y.toFixed(1)})
                </text>
              </g>
            )}

            {/* 8. Vertex Point (if enabled) */}
            {showVertex && (
              <g>
                <circle
                  cx={xScale(landmarks.vertex.x)}
                  cy={yScale(landmarks.vertex.y)}
                  r="6"
                  fill="#3b82f6"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text
                  x={xScale(landmarks.vertex.x)}
                  y={
                    landmarks.opensUpward
                      ? yScale(landmarks.vertex.y) + 16
                      : yScale(landmarks.vertex.y) - 8
                  }
                  textAnchor="middle"
                  className="fill-blue-500 font-mono text-[10px] font-extrabold"
                >
                  V({landmarks.vertex.x.toFixed(2)}, {landmarks.vertex.y.toFixed(2)})
                </text>
              </g>
            )}

            {/* 9. Real Roots Markers (if enabled) */}
            {showRoots && roots.type !== "two_complex" && (
              <g>
                {/* Root 1 */}
                <circle
                  cx={xScale(roots.r1Real)}
                  cy={originY}
                  r="5"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <text
                  x={xScale(roots.r1Real)}
                  y={originY - 8}
                  textAnchor="middle"
                  className="fill-emerald-500 font-mono text-[9px] font-bold"
                >
                  {roots.r1Real.toFixed(2)}
                </text>

                {/* Root 2 (if distinct) */}
                {roots.type === "two_real" && (
                  <>
                    <circle
                      cx={xScale(roots.r2Real)}
                      cy={originY}
                      r="5"
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x={xScale(roots.r2Real)}
                      y={originY - 8}
                      textAnchor="middle"
                      className="fill-emerald-500 font-mono text-[9px] font-bold"
                    >
                      {roots.r2Real.toFixed(2)}
                    </text>
                  </>
                )}
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* ── Bottom Landmarks Badge Strip ─────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs mt-2">
        <div>
          <span className="text-[10px] font-bold uppercase text-muted-foreground block">
            Vertex (h, k)
          </span>
          <span className="font-mono font-bold text-blue-500">
            ({landmarks.vertex.x.toFixed(2)}, {landmarks.vertex.y.toFixed(2)})
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase text-muted-foreground block">
            Axis of Symmetry
          </span>
          <span className="font-mono font-bold text-primary">
            x = {landmarks.axisOfSymmetry.toFixed(2)}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase text-muted-foreground block">
            Discriminant (Δ)
          </span>
          <span
            className={`font-mono font-bold ${
              roots.discriminant > 0
                ? "text-emerald-500"
                : roots.discriminant === 0
                ? "text-blue-500"
                : "text-amber-500"
            }`}
          >
            {roots.discriminant.toFixed(2)}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase text-muted-foreground block">
            y-Intercept
          </span>
          <span className="font-mono font-bold text-foreground">
            (0, {c.toFixed(2)})
          </span>
        </div>
      </div>
    </div>
  );
}
