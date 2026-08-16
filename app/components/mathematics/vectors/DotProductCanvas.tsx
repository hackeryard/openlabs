"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import { Vector2D } from "./types";
import { computeDotProductState, magnitude2D } from "./lib/vectorMath";
import {
  Maximize2,
  Sliders,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Edit3,
} from "lucide-react";

export default function DotProductCanvas() {
  const [vectorU, setVectorU] = useState<Vector2D>({ x: 100, y: 80 });
  const [vectorV, setVectorV] = useState<Vector2D>({ x: 140, y: 20 });

  const [showProjection, setShowProjection] = useState<boolean>(true);
  const [draggingVector, setDraggingVector] = useState<"u" | "v" | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const origin = { x: 300, y: 220 };
  const width = 600;
  const height = 440;

  const state = useMemo(
    () => computeDotProductState(vectorU, vectorV),
    [vectorU, vectorV]
  );

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

  const handlePointerDown = (vec: "u" | "v") => {
    setDraggingVector(vec);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingVector) return;
    const { x, y } = screenToMath(e.clientX, e.clientY);
    if (draggingVector === "u") setVectorU({ x, y });
    if (draggingVector === "v") setVectorV({ x, y });
  };

  const handlePointerUp = () => {
    setDraggingVector(null);
  };

  const pU = mathToSvg(vectorU.x, vectorU.y);
  const pV = mathToSvg(vectorV.x, vectorV.y);
  const pProj = mathToSvg(state.projection.x, state.projection.y);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive Dot Product SVG Canvas (7 cols) ─ */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Maximize2 size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Dot Product & Orthogonal Projection
            </span>
          </div>

          <span
            className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full border ${
              state.classification === "orthogonal"
                ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                : state.classification === "acute"
                ? "bg-blue-500/15 text-blue-500 border-blue-500/30"
                : "bg-rose-500/15 text-rose-500 border-rose-500/30"
            }`}
          >
            {state.classification === "orthogonal"
              ? "Orthogonal (u ⊥ v) ✨"
              : state.classification === "acute"
              ? "Acute (u · v > 0)"
              : "Obtuse (u · v < 0)"}
          </span>
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
              <pattern id="dot-grid-edit" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
              </pattern>

              <marker id="dot-arrow-u-edit" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
              </marker>
              <marker id="dot-arrow-v-edit" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#ec4899" />
              </marker>
              <marker id="dot-arrow-proj-edit" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
              </marker>
            </defs>

            <rect width={width} height={height} fill="url(#dot-grid-edit)" />

            {/* Axes */}
            <line x1="0" y1={origin.y} x2={width} y2={origin.y} stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />
            <line x1={origin.x} y1="0" x2={origin.x} y2={height} stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />

            {/* Perpendicular drop from u head to projection point */}
            {showProjection && (
              <g stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2">
                <line x1={pU.x} y1={pU.y} x2={pProj.x} y2={pProj.y} />
              </g>
            )}

            {/* Vector v (Pink) */}
            <line x1={origin.x} y1={origin.y} x2={pV.x} y2={pV.y} stroke="#ec4899" strokeWidth="3" markerEnd="url(#dot-arrow-v-edit)" />

            {/* Projection vector proj_v(u) (Emerald) */}
            {showProjection && (
              <line x1={origin.x} y1={origin.y} x2={pProj.x} y2={pProj.y} stroke="#10b981" strokeWidth="4" markerEnd="url(#dot-arrow-proj-edit)" />
            )}

            {/* Vector u (Blue) */}
            <line x1={origin.x} y1={origin.y} x2={pU.x} y2={pU.y} stroke="#3b82f6" strokeWidth="3" markerEnd="url(#dot-arrow-u-edit)" />

            {/* Direct On-Canvas Angle Arc & Badge */}
            <g transform={`translate(${origin.x + 35}, ${origin.y - 35})`}>
              <rect x="-18" y="-9" width="36" height="18" rx="5" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.5" />
              <text y="3.5" textAnchor="middle" className="fill-amber-400 font-mono text-[9px] font-black">
                {state.angleDeg.toFixed(1)}°
              </text>
            </g>

            {/* Draggable Vector Heads */}
            <g transform={`translate(${pU.x}, ${pU.y})`} onPointerDown={() => handlePointerDown("u")} className="cursor-grab active:cursor-grabbing">
              <circle r="12" fill="#3b82f6" stroke="#ffffff" strokeWidth="2.5" className="transition-transform hover:scale-125 shadow-md" />
              <text y="4" textAnchor="middle" className="fill-white font-mono text-[9px] font-black pointer-events-none">u</text>
            </g>

            <g transform={`translate(${pV.x}, ${pV.y})`} onPointerDown={() => handlePointerDown("v")} className="cursor-grab active:cursor-grabbing">
              <circle r="12" fill="#ec4899" stroke="#ffffff" strokeWidth="2.5" className="transition-transform hover:scale-125 shadow-md" />
              <text y="4" textAnchor="middle" className="fill-white font-mono text-[9px] font-black pointer-events-none">v</text>
            </g>
          </svg>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2">
          <button
            onClick={() => setShowProjection(!showProjection)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
              showProjection ? "bg-primary text-primary-foreground border-primary font-black shadow-sm" : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Orthogonal Projection: {showProjection ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* ── Right: Editable Inputs & Dot Product (5 cols) ────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Edit3 size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Editable Dot Product Inputs
            </span>
          </div>
        </div>

        {/* Dot Product Calculation Box */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-primary block">
            Dot Product Equation
          </span>
          <div className="font-mono text-sm font-black text-foreground bg-background/80 p-2.5 rounded-xl border border-border text-center">
            u · v = {vectorU.x}·{vectorV.x} + {vectorU.y}·{vectorV.y} = {state.dotProduct.toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground text-center font-mono leading-relaxed">
            = |u| |v| cos(θ) = {state.magnitudeU.toFixed(1)} · {state.magnitudeV.toFixed(1)} · {state.cosTheta.toFixed(3)}
          </div>
        </div>

        {/* Direct Vector Component Editors */}
        <div className="space-y-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-blue-500 block">Vector u = ({vectorU.x}î, {vectorU.y}ĵ)</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] text-muted-foreground block font-mono">u_x</label>
                <input
                  type="number"
                  value={vectorU.x}
                  onChange={(e) => setVectorU({ ...vectorU, x: parseInt(e.target.value, 10) || 0 })}
                  className="w-full p-1.5 bg-background border border-border rounded-xl font-mono text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[9px] text-muted-foreground block font-mono">u_y</label>
                <input
                  type="number"
                  value={vectorU.y}
                  onChange={(e) => setVectorU({ ...vectorU, y: parseInt(e.target.value, 10) || 0 })}
                  className="w-full p-1.5 bg-background border border-border rounded-xl font-mono text-xs font-bold"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-pink-500 block">Vector v = ({vectorV.x}î, {vectorV.y}ĵ)</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] text-muted-foreground block font-mono">v_x</label>
                <input
                  type="number"
                  value={vectorV.x}
                  onChange={(e) => setVectorV({ ...vectorV, x: parseInt(e.target.value, 10) || 0 })}
                  className="w-full p-1.5 bg-background border border-border rounded-xl font-mono text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[9px] text-muted-foreground block font-mono">v_y</label>
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
      </div>
    </div>
  );
}
