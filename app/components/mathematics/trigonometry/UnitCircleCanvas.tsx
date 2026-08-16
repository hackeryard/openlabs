"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { TrigLabState, ExactAngle } from "./types";
import {
  degToRad,
  radToDeg,
  normalizeDeg,
  getQuadrant,
  getQuadrantRule,
  EXACT_ANGLES,
  findClosestExactAngle,
} from "./lib/trigMath";
import {
  RotateCcw,
  Magnet,
  Compass,
  CheckCircle2,
  Sparkles,
  Info,
  Maximize2,
} from "lucide-react";

interface UnitCircleCanvasProps {
  state: TrigLabState;
  onChangeAngle: (deg: number) => void;
  onTogglePlay?: () => void;
}

export default function UnitCircleCanvas({
  state,
  onChangeAngle,
}: UnitCircleCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [snapToExact, setSnapToExact] = useState(true);

  // SVG Coordinate space: center at (200, 200), radius = 140
  const CX = 200;
  const CY = 200;
  const R = 140;

  const currentDeg = normalizeDeg(state.angleDeg);
  const currentRad = degToRad(currentDeg);

  const cosVal = Math.cos(currentRad);
  const sinVal = Math.sin(currentRad);
  const tanVal = Math.abs(cosVal) > 1e-4 ? Math.tan(currentRad) : null;

  // Point on circle (SVG coordinates)
  const px = CX + R * cosVal;
  const py = CY - R * sinVal; // SVG y is inverted

  // Tangent point (intersect with line x = 1 for Q1/Q4 or x = -1 for Q2/Q3)
  const tanX = cosVal >= 0 ? CX + R : CX - R;
  const tanY = CY - R * (cosVal >= 0 ? Math.tan(currentRad) : -Math.tan(currentRad));

  // Current exact angle match
  const exactAngle = findClosestExactAngle(currentDeg, 2);
  const quadrant = getQuadrant(currentDeg);
  const quadRule = getQuadrantRule(quadrant);

  // Drag interaction handler
  const handlePointerEvent = useCallback(
    (e: React.PointerEvent<SVGSVGElement> | MouseEvent | TouchEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      // Scale to internal SVG coordinate space (400x400)
      const scaleX = 400 / rect.width;
      const scaleY = 400 / rect.height;

      const svgX = (clientX - rect.left) * scaleX;
      const svgY = (clientY - rect.top) * scaleY;

      const dx = svgX - CX;
      const dy = CY - svgY; // Invert y

      let angleRad = Math.atan2(dy, dx);
      if (angleRad < 0) angleRad += 2 * Math.PI;

      let deg = radToDeg(angleRad);

      if (snapToExact) {
        const closest = findClosestExactAngle(deg, 4.5);
        if (closest) {
          deg = closest.deg;
        }
      }

      onChangeAngle(Math.round(deg * 10) / 10);
    },
    [snapToExact, onChangeAngle]
  );

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsDragging(true);
    (e.target as Element).setPointerCapture?.(e.pointerId);
    handlePointerEvent(e);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isDragging) {
      handlePointerEvent(e);
    }
  };

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    }
  };

  // Generate Angle Arc path
  const arcRadius = 32;
  const largeArcFlag = currentDeg > 180 ? 1 : 0;
  const arcEndX = CX + arcRadius * cosVal;
  const arcEndY = CY - arcRadius * sinVal;
  const arcPath =
    currentDeg === 0
      ? ""
      : `M ${CX + arcRadius} ${CY} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 0 ${arcEndX} ${arcEndY}`;

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
      {/* ── Top Bar: Angle readout & Snapping ───────────────── */}
      <div className="flex items-center justify-between gap-2 border-b border-border pb-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-primary font-black text-xs">
            θ
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-foreground tracking-tight">
                {currentDeg.toFixed(1)}°
              </span>
              <span className="text-xs font-semibold text-primary font-mono">
                {(currentRad / Math.PI).toFixed(2)}π rad
              </span>
            </div>
            {exactAngle && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Exact {exactAngle.radStr}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSnapToExact(!snapToExact)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
              snapToExact
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
            title="Snap angle to exact unit circle standard values"
          >
            <Magnet size={13} />
            <span className="hidden sm:inline">Snap</span>
          </button>

          <button
            onClick={() => onChangeAngle(0)}
            className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground transition-all shadow-sm active:scale-95"
            title="Reset to 0°"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* ── Main Interactive Unit Circle SVG Canvas ─────────── */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center relative min-h-[300px] select-none touch-none"
      >
        <svg
          ref={svgRef}
          viewBox="0 0 400 400"
          className="w-full h-full max-h-[380px] max-w-[380px] cursor-crosshair"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <defs>
            {/* Background Grid Pattern */}
            <pattern id="circleGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.04" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect width="400" height="400" fill="url(#circleGrid)" />

          {/* Quadrant Tint & Labels */}
          <g className="opacity-30 text-[10px] font-black uppercase fill-muted-foreground">
            <text x="320" y="80">Q I (+,+)</text>
            <text x="50" y="80">Q II (−,+)</text>
            <text x="50" y="340">Q III (−,−)</text>
            <text x="320" y="340">Q IV (+,−)</text>
          </g>

          {/* Coordinate Axes */}
          <line x1="20" y1={CY} x2="380" y2={CY} stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
          <line x1={CX} y1="20" x2={CX} y2="380" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />

          {/* Axis Labels */}
          <text x="385" y={CY + 4} className="text-[11px] font-bold fill-muted-foreground">x</text>
          <text x={CX - 4} y="15" className="text-[11px] font-bold fill-muted-foreground">y</text>
          <text x={CX + R + 4} y={CY + 14} className="text-[10px] font-semibold fill-muted-foreground">1</text>
          <text x={CX - R - 14} y={CY + 14} className="text-[10px] font-semibold fill-muted-foreground">-1</text>
          <text x={CX + 6} y={CY - R - 4} className="text-[10px] font-semibold fill-muted-foreground">1</text>
          <text x={CX + 6} y={CY + R + 12} className="text-[10px] font-semibold fill-muted-foreground">-1</text>

          {/* Unit Circle */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="currentColor"
            fillOpacity="0.02"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="2"
          />

          {/* Exact Standard Angle Radial Tick Marks */}
          {EXACT_ANGLES.filter((a) => a.deg > 0 && a.deg < 360).map((item) => {
            const rad = degToRad(item.deg);
            const tx = CX + R * Math.cos(rad);
            const ty = CY - R * Math.sin(rad);
            const isMatch = exactAngle?.deg === item.deg;

            return (
              <g key={item.deg}>
                <circle
                  cx={tx}
                  cy={ty}
                  r={isMatch ? 4 : 2.5}
                  className={`transition-all duration-200 ${
                    isMatch
                      ? "fill-primary stroke-background stroke-2"
                      : "fill-muted-foreground opacity-40 hover:opacity-100 cursor-pointer"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeAngle(item.deg);
                  }}
                />
              </g>
            );
          })}

          {/* Angle Arc */}
          {arcPath && (
            <path
              d={arcPath}
              fill="currentColor"
              fillOpacity="0.08"
              stroke="#6366f1"
              strokeWidth="2"
              strokeDasharray="2 2"
            />
          )}

          {/* ── Reference Right Triangle Decomposition ─────── */}
          {state.showReferenceTriangle && (
            <polygon
              points={`${CX},${CY} ${px},${CY} ${px},${py}`}
              fill="currentColor"
              fillOpacity="0.06"
              stroke="none"
            />
          )}

          {/* Cosine Base Leg (Horizontal - Blue) */}
          {state.showCosLeg && (
            <g>
              <line
                x1={CX}
                y1={CY}
                x2={px}
                y2={CY}
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {Math.abs(cosVal) > 0.15 && (
                <text
                  x={(CX + px) / 2}
                  y={CY + (sinVal >= 0 ? 16 : -8)}
                  textAnchor="middle"
                  className="text-[10px] font-extrabold fill-blue-500"
                >
                  cos(θ) = {cosVal.toFixed(2)}
                </text>
              )}
            </g>
          )}

          {/* Sine Altitude Leg (Vertical - Emerald) */}
          {state.showSinLeg && (
            <g>
              <line
                x1={px}
                y1={CY}
                x2={px}
                y2={py}
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {Math.abs(sinVal) > 0.15 && (
                <text
                  x={px + (cosVal >= 0 ? 8 : -8)}
                  y={(CY + py) / 2}
                  textAnchor={cosVal >= 0 ? "start" : "end"}
                  className="text-[10px] font-extrabold fill-emerald-500"
                >
                  sin(θ) = {sinVal.toFixed(2)}
                </text>
              )}
            </g>
          )}

          {/* Tangent Line Projection (Amber / Rose) */}
          {state.showTanLeg && tanVal !== null && Math.abs(tanVal) < 6 && (
            <g>
              <line
                x1={px}
                y1={py}
                x2={tanX}
                y2={tanY}
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4 3"
                strokeOpacity="0.85"
              />
              <line
                x1={tanX}
                y1={CY}
                x2={tanX}
                y2={tanY}
                stroke="#f59e0b"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Hypotenuse Radius Arm (r = 1) */}
          <line
            x1={CX}
            y1={CY}
            x2={px}
            y2={py}
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Right Angle Corner Marker */}
          {state.showReferenceTriangle && Math.abs(cosVal) > 0.2 && Math.abs(sinVal) > 0.2 && (
            <path
              d={`M ${px + (cosVal >= 0 ? -10 : 10)} ${CY} L ${px + (cosVal >= 0 ? -10 : 10)} ${CY + (sinVal >= 0 ? -10 : 10)} L ${px} ${CY + (sinVal >= 0 ? -10 : 10)}`}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.4"
              strokeWidth="1.5"
            />
          )}

          {/* Origin Center Point */}
          <circle cx={CX} cy={CY} r="3" fill="currentColor" />

          {/* Draggable Circle Coordinate Handle Point (P) */}
          <circle
            cx={px}
            cy={py}
            r="7"
            fill="#6366f1"
            stroke="#ffffff"
            strokeWidth="2"
            className="cursor-grab active:cursor-grabbing"
          />
        </svg>
      </div>

      {/* ── Bottom Live Coordinate Value Strip ─────────────── */}
      <div className="grid grid-cols-3 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-blue-500 tracking-wider">
            cos(θ) [x]
          </span>
          <p className="font-extrabold text-foreground font-mono">
            {exactAngle ? exactAngle.cosStr : cosVal.toFixed(3)}
          </p>
        </div>

        <div className="space-y-0.5 border-x border-border/60">
          <span className="text-[10px] font-bold uppercase text-emerald-500 tracking-wider">
            sin(θ) [y]
          </span>
          <p className="font-extrabold text-foreground font-mono">
            {exactAngle ? exactAngle.sinStr : sinVal.toFixed(3)}
          </p>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-amber-500 tracking-wider">
            tan(θ) [y/x]
          </span>
          <p className="font-extrabold text-foreground font-mono">
            {exactAngle ? exactAngle.tanStr : tanVal !== null ? tanVal.toFixed(3) : "undef"}
          </p>
        </div>
      </div>
    </div>
  );
}
