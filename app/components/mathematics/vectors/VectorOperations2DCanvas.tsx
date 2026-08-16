"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import { Vector2D } from "./types";
import { magnitude2D, angle2DDeg } from "./lib/vectorMath";
import {
  Move,
  Sliders,
  Sparkles,
  Layers,
  RotateCcw,
  CheckCircle2,
  Maximize2,
  Edit3,
} from "lucide-react";

export default function VectorOperations2DCanvas() {
  const [vectorU, setVectorU] = useState<Vector2D>({ x: 120, y: 70 });
  const [vectorV, setVectorV] = useState<Vector2D>({ x: 40, y: 130 });
  const [nameU, setNameU] = useState<string>("u");
  const [nameV, setNameV] = useState<string>("v");

  const [c1, setC1] = useState<number>(1);
  const [c2, setC2] = useState<number>(1);
  const [mode, setMode] = useState<"addition" | "subtraction" | "linear_combination">("addition");

  const [showParallelogram, setShowParallelogram] = useState<boolean>(true);
  const [showComponents, setShowComponents] = useState<boolean>(true);
  const [showUnitVectors, setShowUnitVectors] = useState<boolean>(false);
  const [showAngles, setShowAngles] = useState<boolean>(true);
  const [showLengths, setShowLengths] = useState<boolean>(true);

  const [draggingVector, setDraggingVector] = useState<"u" | "v" | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const origin = { x: 300, y: 220 };
  const width = 600;
  const height = 440;

  const mathToSvg = (x: number, y: number) => ({
    x: origin.x + x,
    y: origin.y - y,
  });

  const screenToMath = useCallback(
    (clientX: number, clientY: number) => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      const svgX = ((clientX - rect.left) / rect.width) * width;
      const svgY = ((clientY - rect.top) / rect.height) * height;
      return {
        x: Math.round(svgX - origin.x),
        y: Math.round(origin.y - svgY),
      };
    },
    [origin.x, origin.y, width, height]
  );

  const handlePointerDown = (e: React.PointerEvent, vec: "u" | "v") => {
    e.stopPropagation();
    try {
      (e.target as Element).setPointerCapture(e.pointerId);
    } catch (_) {}
    setDraggingVector(vec);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingVector) return;
    const { x, y } = screenToMath(e.clientX, e.clientY);
    if (draggingVector === "u") setVectorU({ x, y });
    if (draggingVector === "v") setVectorV({ x, y });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch (_) {}
    setDraggingVector(null);
  };

  const magU = magnitude2D(vectorU);
  const magV = magnitude2D(vectorV);
  const angU = angle2DDeg(vectorU);
  const angV = angle2DDeg(vectorV);

  // Resultant Vector R = c1*u + c2*v (or u - v)
  const resultant: Vector2D = useMemo(() => {
    if (mode === "addition") {
      return { x: vectorU.x + vectorV.x, y: vectorU.y + vectorV.y };
    } else if (mode === "subtraction") {
      return { x: vectorU.x - vectorV.x, y: vectorU.y - vectorV.y };
    } else {
      return { x: c1 * vectorU.x + c2 * vectorV.x, y: c1 * vectorU.y + c2 * vectorV.y };
    }
  }, [vectorU, vectorV, c1, c2, mode]);

  const magR = magnitude2D(resultant);
  const angR = angle2DDeg(resultant);

  const pU = mathToSvg(vectorU.x, vectorU.y);
  const pV = mathToSvg(vectorV.x, vectorV.y);
  const pR = mathToSvg(resultant.x, resultant.y);

  const unitU = magU > 0 ? { x: (vectorU.x / magU) * 40, y: (vectorU.y / magU) * 40 } : { x: 0, y: 0 };
  const unitV = magV > 0 ? { x: (vectorV.x / magV) * 40, y: (vectorV.y / magV) * 40 } : { x: 0, y: 0 };
  const pUnitU = mathToSvg(unitU.x, unitU.y);
  const pUnitV = mathToSvg(unitV.x, unitV.y);

  const presets = [
    { label: "Orthogonal (90°)", u: { x: 120, y: 0 }, v: { x: 0, y: 100 } },
    { label: "Collinear / Parallel", u: { x: 100, y: 60 }, v: { x: 50, y: 30 } },
    { label: "Force Balance (120°)", u: { x: 120, y: 0 }, v: { x: -60, y: 104 } },
    { label: "Equal 45° Pair", u: { x: 100, y: 100 }, v: { x: 100, y: -100 } },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive 2D Vector Canvas (7 cols) ──────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Move size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              2D Vector Workspace ({nameU}, {nameV})
            </span>
          </div>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl border border-border flex-wrap">
            {[
              ["addition", "Addition (u + v)"],
              ["subtraction", "Subtraction (u - v)"],
              ["linear_combination", "Linear Comb (c₁u + c₂v)"],
            ].map(([mKey, label]) => (
              <button
                key={mKey}
                onClick={() => setMode(mKey as any)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  mode === mKey
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
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full max-h-[440px] touch-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <defs>
              <pattern id="vec-grid-robust" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
              </pattern>

              <marker id="arrow-u-robust" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
              </marker>
              <marker id="arrow-v-robust" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#ec4899" />
              </marker>
              <marker id="arrow-r-robust" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
              </marker>
            </defs>

            <rect width={width} height={height} fill="url(#vec-grid-robust)" />

            {/* Axes */}
            <line x1="0" y1={origin.y} x2={width} y2={origin.y} stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 2" />
            <line x1={origin.x} y1="0" x2={origin.x} y2={height} stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx={origin.x} cy={origin.y} r="4" fill="#64748b" />
            <text x={origin.x + 6} y={origin.y + 14} className="fill-muted-foreground font-mono text-[9px]">O (0,0)</text>

            {/* Parallelogram Ghost Polygon */}
            {showParallelogram && (
              <polygon
                points={`${origin.x},${origin.y} ${pU.x},${pU.y} ${pR.x},${pR.y} ${pV.x},${pV.y}`}
                fill="#f59e0b"
                fillOpacity="0.08"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            )}

            {/* Component projections */}
            {showComponents && (
              <g stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.5">
                <line x1={pU.x} y1={origin.y} x2={pU.x} y2={pU.y} />
                <line x1={origin.x} y1={pU.y} x2={pU.x} y2={pU.y} />
                <line x1={pV.x} y1={origin.y} x2={pV.x} y2={pV.y} />
                <line x1={origin.x} y1={pV.y} x2={pV.x} y2={pV.y} />
              </g>
            )}

            {/* Unit Vectors */}
            {showUnitVectors && (
              <g>
                <line x1={origin.x} y1={origin.y} x2={pUnitU.x} y2={pUnitU.y} stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow-u-robust)" />
                <line x1={origin.x} y1={origin.y} x2={pUnitV.x} y2={pUnitV.y} stroke="#ec4899" strokeWidth="3" markerEnd="url(#arrow-v-robust)" />
              </g>
            )}

            {/* Vector u (Blue) */}
            <line x1={origin.x} y1={origin.y} x2={pU.x} y2={pU.y} stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow-u-robust)" />

            {/* Vector v (Pink) */}
            <line x1={origin.x} y1={origin.y} x2={pV.x} y2={pV.y} stroke="#ec4899" strokeWidth="3" markerEnd="url(#arrow-v-robust)" />

            {/* Resultant Vector R (Gold) */}
            <line x1={origin.x} y1={origin.y} x2={pR.x} y2={pR.y} stroke="#f59e0b" strokeWidth="3.5" markerEnd="url(#arrow-r-robust)" />

            {/* Direct On-Canvas Length / Angle Badges */}
            {showLengths && (
              <g>
                {/* u badge */}
                <g transform={`translate(${(origin.x + pU.x) / 2}, ${(origin.y + pU.y) / 2 - 10})`}>
                  <rect x="-24" y="-8" width="48" height="16" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
                  <text y="3.5" textAnchor="middle" className="fill-blue-400 font-mono text-[9px] font-bold">
                    |{nameU}|={magU.toFixed(1)}
                  </text>
                </g>

                {/* v badge */}
                <g transform={`translate(${(origin.x + pV.x) / 2 - 20}, ${(origin.y + pV.y) / 2})`}>
                  <rect x="-24" y="-8" width="48" height="16" rx="4" fill="#0f172a" stroke="#ec4899" strokeWidth="1.5" />
                  <text y="3.5" textAnchor="middle" className="fill-pink-400 font-mono text-[9px] font-bold">
                    |{nameV}|={magV.toFixed(1)}
                  </text>
                </g>

                {/* R badge */}
                <g transform={`translate(${(origin.x + pR.x) / 2 + 20}, ${(origin.y + pR.y) / 2})`}>
                  <rect x="-26" y="-8" width="52" height="16" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                  <text y="3.5" textAnchor="middle" className="fill-amber-400 font-mono text-[9px] font-black">
                    |R|={magR.toFixed(1)}
                  </text>
                </g>
              </g>
            )}

            {/* Draggable Vector Heads */}
            <g transform={`translate(${pU.x}, ${pU.y})`} onPointerDown={(e) => handlePointerDown(e, "u")} className="cursor-grab active:cursor-grabbing">
              <circle r="12" fill="#3b82f6" stroke="#ffffff" strokeWidth="2.5" className="transition-transform hover:scale-125 shadow-md" />
              <text y="4" textAnchor="middle" className="fill-white font-mono text-[9px] font-black pointer-events-none">{nameU}</text>
            </g>

            <g transform={`translate(${pV.x}, ${pV.y})`} onPointerDown={(e) => handlePointerDown(e, "v")} className="cursor-grab active:cursor-grabbing">
              <circle r="12" fill="#ec4899" stroke="#ffffff" strokeWidth="2.5" className="transition-transform hover:scale-125 shadow-md" />
              <text y="4" textAnchor="middle" className="fill-white font-mono text-[9px] font-black pointer-events-none">{nameV}</text>
            </g>
          </svg>
        </div>

        {/* Overlay Switches */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2">
          <button
            onClick={() => setShowParallelogram(!showParallelogram)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
              showParallelogram ? "bg-primary text-primary-foreground border-primary font-black shadow-sm" : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Parallelogram: {showParallelogram ? "ON" : "OFF"}
          </button>

          <button
            onClick={() => setShowComponents(!showComponents)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
              showComponents ? "bg-primary text-primary-foreground border-primary font-black shadow-sm" : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Components: {showComponents ? "ON" : "OFF"}
          </button>

          <button
            onClick={() => setShowLengths(!showLengths)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
              showLengths ? "bg-primary text-primary-foreground border-primary font-black shadow-sm" : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Magnitudes: {showLengths ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* ── Right: Editable Equations & Coordinates (5 cols) ── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Edit3 size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Editable Vector Equations & Values
            </span>
          </div>
        </div>

        {/* Resultant Formula Box */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-amber-500 block">
            Resultant Vector Equation
          </span>
          <div className="font-mono text-sm font-black text-foreground bg-background/80 p-2.5 rounded-xl border border-border text-center">
            R = {mode === "linear_combination" ? `${c1.toFixed(1)}${nameU} + ${c2.toFixed(1)}${nameV}` : mode === "subtraction" ? `${nameU} - ${nameV}` : `${nameU} + ${nameV}`} = ({resultant.x}î, {resultant.y}ĵ)
          </div>
          <div className="text-xs text-muted-foreground text-center font-mono">
            |R| = {magR.toFixed(2)} &nbsp;|&nbsp; Angle θ_R = {angR.toFixed(1)}°
          </div>
        </div>

        {/* Two-way Editable Vector Inputs */}
        <div className="space-y-3">
          {/* Vector U edit */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-blue-500">
              <div className="flex items-center gap-1.5">
                <span>Vector:</span>
                <input
                  type="text"
                  value={nameU}
                  onChange={(e) => setNameU(e.target.value)}
                  className="w-12 p-0.5 bg-background border border-border rounded font-bold text-xs text-center"
                />
              </div>
              <span className="font-mono">|{nameU}| = {magU.toFixed(1)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] text-muted-foreground block font-mono">X-component (î)</label>
                <input
                  type="number"
                  value={vectorU.x}
                  onChange={(e) => setVectorU({ ...vectorU, x: parseInt(e.target.value, 10) || 0 })}
                  className="w-full p-1.5 bg-background border border-border rounded-xl font-mono text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[9px] text-muted-foreground block font-mono">Y-component (ĵ)</label>
                <input
                  type="number"
                  value={vectorU.y}
                  onChange={(e) => setVectorU({ ...vectorU, y: parseInt(e.target.value, 10) || 0 })}
                  className="w-full p-1.5 bg-background border border-border rounded-xl font-mono text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Vector V edit */}
          <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-pink-500">
              <div className="flex items-center gap-1.5">
                <span>Vector:</span>
                <input
                  type="text"
                  value={nameV}
                  onChange={(e) => setNameV(e.target.value)}
                  className="w-12 p-0.5 bg-background border border-border rounded font-bold text-xs text-center"
                />
              </div>
              <span className="font-mono">|{nameV}| = {magV.toFixed(1)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] text-muted-foreground block font-mono">X-component (î)</label>
                <input
                  type="number"
                  value={vectorV.x}
                  onChange={(e) => setVectorV({ ...vectorV, x: parseInt(e.target.value, 10) || 0 })}
                  className="w-full p-1.5 bg-background border border-border rounded-xl font-mono text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[9px] text-muted-foreground block font-mono">Y-component (ĵ)</label>
                <input
                  type="number"
                  value={vectorV.y}
                  onChange={(e) => setVectorV({ ...vectorV, y: parseInt(e.target.value, 10) || 0 })}
                  className="w-full p-1.5 bg-background border border-border rounded-xl font-mono text-xs font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Linear Combination Sliders & Inputs */}
        {mode === "linear_combination" && (
          <div className="space-y-3 p-3 bg-muted/30 border border-border rounded-2xl">
            <span className="text-xs font-bold text-foreground block">Scalar Multipliers (c₁ & c₂)</span>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-blue-500">Scalar c₁ (on {nameU})</span>
                <span className="font-mono">{c1.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="3"
                step="0.1"
                value={c1}
                onChange={(e) => setC1(parseFloat(e.target.value) || 0)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-pink-500">Scalar c₂ (on {nameV})</span>
                <span className="font-mono">{c2.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="3"
                step="0.1"
                value={c2}
                onChange={(e) => setC2(parseFloat(e.target.value) || 0)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
