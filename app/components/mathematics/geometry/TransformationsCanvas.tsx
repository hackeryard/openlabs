"use client";

import React, { useState, useMemo } from "react";
import { TransformationType } from "./types";
import { transformPoint } from "./lib/geometryMath";
import {
  Share2,
  Sliders,
  RotateCw,
  Maximize2,
  FlipHorizontal,
  Move,
} from "lucide-react";

export default function TransformationsCanvas() {
  const [transformType, setTransformType] = useState<TransformationType>("rotation");

  // Transformation parameters
  const [dx, setDx] = useState<number>(60);
  const [dy, setDy] = useState<number>(-40);
  const [angleDeg, setAngleDeg] = useState<number>(45);
  const [scale, setScale] = useState<number>(1.5);
  const [reflectAxis, setReflectAxis] = useState<"x" | "y" | "y=x">("y");

  // Center of transformation
  const center = { x: 300, y: 220 };

  // Base polygon (Flag/House shape)
  const basePolygon = useMemo(
    () => [
      { id: "P1", label: "A", x: 260, y: 260 },
      { id: "P2", label: "B", x: 340, y: 260 },
      { id: "P3", label: "C", x: 340, y: 180 },
      { id: "P4", label: "D", x: 300, y: 140 },
      { id: "P5", label: "E", x: 260, y: 180 },
    ],
    []
  );

  // Transformed image vertices
  const transformedPolygon = useMemo(() => {
    return basePolygon.map((p) => {
      const trans = transformPoint(p, transformType, {
        dx,
        dy,
        angleDeg,
        center,
        scale,
        reflectAxis,
      });
      return {
        ...p,
        transX: Math.round(trans.x),
        transY: Math.round(trans.y),
      };
    });
  }, [basePolygon, transformType, dx, dy, angleDeg, center, scale, reflectAxis]);

  const basePointsStr = basePolygon.map((p) => `${p.x},${p.y}`).join(" ");
  const transPointsStr = transformedPolygon
    .map((p) => `${p.transX},${p.transY}`)
    .join(" ");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: SVG Transformations Canvas (7 cols) ───────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Share2 size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              2D Geometric Transformations Sandbox
            </span>
          </div>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl border border-border flex-wrap">
            {[
              ["rotation", "Rotation"],
              ["translation", "Translation"],
              ["reflection", "Reflection"],
              ["dilation", "Dilation"],
            ].map(([tKey, label]) => (
              <button
                key={tKey}
                onClick={() => setTransformType(tKey as TransformationType)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  transformType === tKey
                    ? "bg-primary text-primary-foreground shadow-sm font-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Canvas */}
        <div className="flex-1 flex items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 overflow-hidden relative select-none">
          <svg viewBox="0 0 600 440" className="w-full h-full max-h-[440px]">
            {/* Coordinate Grid & Axes */}
            <defs>
              <pattern id="trans-grid-fixed" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="600" height="440" fill="url(#trans-grid-fixed)" />

            {/* Axes passing through center */}
            <line x1="0" y1={center.y} x2="600" y2={center.y} stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1={center.x} y1="0" x2={center.x} y2="440" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />
            <circle cx={center.x} cy={center.y} r="5" fill="#f59e0b" />
            <text x={center.x + 8} y={center.y - 8} className="fill-amber-500 font-mono text-[9px] font-black">
              Center ({center.x}, {center.y})
            </text>

            {/* Original Pre-Image Polygon (Ghost) */}
            <polygon
              points={basePointsStr}
              fill="#64748b"
              fillOpacity="0.1"
              stroke="#64748b"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            {basePolygon.map((p) => (
              <g key={`base-${p.id}`} transform={`translate(${p.x}, ${p.y})`}>
                <circle r="4" fill="#64748b" />
                <text x="6" y="3" className="fill-muted-foreground font-mono text-[9px]">
                  {p.label}
                </text>
              </g>
            ))}

            {/* Transformed Image Polygon */}
            <polygon
              points={transPointsStr}
              fill="#6366f1"
              fillOpacity="0.25"
              stroke="#6366f1"
              strokeWidth="2.5"
            />
            {transformedPolygon.map((p) => (
              <g key={`trans-${p.id}`} transform={`translate(${p.transX}, ${p.transY})`}>
                <circle r="6" fill="#6366f1" stroke="#fff" strokeWidth="1.5" />
                <text x="8" y="4" className="fill-primary font-mono text-[10px] font-black">
                  {p.label}&apos;
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* ── Right: Transformation Controls & Coordinates (5 cols) */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Transformation Parameters
            </span>
          </div>
        </div>

        {/* Dynamic Controls based on transformation type */}
        {transformType === "translation" && (
          <div className="space-y-4">
            <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Horizontal Shift (Δx)</span>
                <span className="font-mono text-primary font-black">{dx} px</span>
              </div>
              <input
                type="range"
                min="-150"
                max="150"
                step="1"
                value={dx}
                onChange={(e) => setDx(parseInt(e.target.value, 10) || 0)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Vertical Shift (Δy)</span>
                <span className="font-mono text-primary font-black">{dy} px</span>
              </div>
              <input
                type="range"
                min="-150"
                max="150"
                step="1"
                value={dy}
                onChange={(e) => setDy(parseInt(e.target.value, 10) || 0)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        )}

        {transformType === "rotation" && (
          <div className="space-y-3">
            <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Rotation Angle (θ)</span>
                <span className="font-mono text-primary font-black">{angleDeg}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={angleDeg}
                onChange={(e) => setAngleDeg(parseInt(e.target.value, 10) || 0)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        )}

        {transformType === "dilation" && (
          <div className="space-y-3">
            <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Scale Factor (k)</span>
                <span className="font-mono text-primary font-black">{scale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value) || 1)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        )}

        {transformType === "reflection" && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-foreground block">Reflection Axis Line</span>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-xs font-bold">
              {[
                ["y", "Y-Axis (x=0)"],
                ["x", "X-Axis (y=0)"],
                ["y=x", "Line y = x"],
              ].map(([axis, label]) => (
                <button
                  key={axis}
                  onClick={() => setReflectAxis(axis as any)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    reflectAxis === axis
                      ? "bg-primary text-primary-foreground border-primary font-black shadow-sm"
                      : "bg-muted border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
