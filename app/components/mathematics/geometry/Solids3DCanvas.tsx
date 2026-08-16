"use client";

import React, { useState, useRef, useMemo } from "react";
import { PlatonicSolidType } from "./types";
import { get3DSolidData } from "./lib/geometryMath";
import {
  Box,
  Sliders,
  Rotate3d,
  Sparkles,
  Layers,
} from "lucide-react";

export default function Solids3DCanvas() {
  const [solid, setSolid] = useState<PlatonicSolidType>("cube");
  const [size, setSize] = useState<number>(100);
  const [rotX, setRotX] = useState<number>(25);
  const [rotY, setRotY] = useState<number>(35);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const { projectedVertices, edges, metrics } = useMemo(
    () => get3DSolidData(solid, size, rotX, rotY),
    [solid, size, rotX, rotY]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch (_) {}
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setRotY((prev) => (prev + dx * 0.8) % 360);
    setRotX((prev) => Math.max(-85, Math.min(85, prev - dy * 0.8)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    } catch (_) {}
    setIsDragging(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive 3D Canvas (7 cols) ─────────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Box size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              3D Solid Polyhedra Viewer (Drag to Rotate)
            </span>
          </div>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl border border-border flex-wrap">
            {[
              ["cube", "Cube"],
              ["tetrahedron", "Tetrahedron"],
              ["octahedron", "Octahedron"],
              ["cylinder", "Cylinder"],
            ].map(([sKey, label]) => (
              <button
                key={sKey}
                onClick={() => setSolid(sKey as PlatonicSolidType)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  solid === sKey
                    ? "bg-primary text-primary-foreground shadow-sm font-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Wireframe Canvas */}
        <div
          className="flex-1 flex items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 overflow-hidden relative select-none cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <svg viewBox="0 0 600 440" className="w-full h-full max-h-[440px] touch-none pointer-events-none">
            {/* Grid */}
            <defs>
              <pattern id="solids-grid-robust" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="600" height="440" fill="url(#solids-grid-robust)" />

            {/* 3D Wireframe Edges */}
            {edges.map(([i1, i2], idx) => {
              const v1 = projectedVertices[i1];
              const v2 = projectedVertices[i2];
              if (!v1 || !v2) return null;

              const avgZ = (v1.z + v2.z) / 2;
              const opacity = avgZ < 0 ? 0.35 : 0.9;
              const width = avgZ < 0 ? 1.5 : 2.5;

              return (
                <line
                  key={`edge-${idx}`}
                  x1={v1.x}
                  y1={v1.y}
                  x2={v2.x}
                  y2={v2.y}
                  stroke="#6366f1"
                  strokeOpacity={opacity}
                  strokeWidth={width}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Vertices */}
            {projectedVertices.map((v, i) => (
              <g key={`vert-${i}`} transform={`translate(${v.x}, ${v.y})`}>
                <circle r={v.z < 0 ? 4 : 6} fill={v.z < 0 ? "#818cf8" : "#4f46e5"} stroke="#ffffff" strokeWidth="1.5" />
              </g>
            ))}
          </svg>
        </div>

        {/* 3D Polyhedra metric strip */}
        <div className="grid grid-cols-4 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs mt-2 font-mono">
          <div>
            <span className="text-[9px] font-bold uppercase text-muted-foreground block">Vertices (V)</span>
            <span className="font-black text-primary text-sm">{metrics.vertices}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase text-muted-foreground block">Edges (E)</span>
            <span className="font-black text-foreground text-sm">{metrics.edges}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase text-muted-foreground block">Faces (F)</span>
            <span className="font-black text-foreground text-sm">{metrics.faces}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase text-emerald-500 block">V - E + F</span>
            <span className="font-black text-emerald-500 text-sm">2 (Euler)</span>
          </div>
        </div>
      </div>

      {/* ── Right: Formulas & Size Control (5 cols) ─────────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              {metrics.name}
            </span>
          </div>
        </div>

        {/* Size Slider */}
        <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">Edge / Dimension Scale</span>
            <span className="font-mono text-primary font-black">{size} px</span>
          </div>
          <input
            type="range"
            min="40"
            max="140"
            step="1"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value, 10) || 40)}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Euler Characteristic Theorem */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-primary block">
            Euler&apos;s Polyhedral Formula
          </span>
          <div className="font-mono text-sm font-black text-foreground bg-background/80 p-3 rounded-xl border border-border text-center">
            V - E + F = 2 &nbsp;&rarr;&nbsp; {metrics.vertices} - {metrics.edges} + {metrics.faces} = 2
          </div>
          <p className="text-xs text-muted-foreground text-center">
            For any convex polyhedron, the number of vertices and faces together always exceeds the number of edges by exactly 2!
          </p>
        </div>

        {/* Surface Area & Volume */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-3 bg-muted/50 rounded-2xl border border-border space-y-1">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">Surface Area (S)</span>
            <span className="font-bold text-primary text-xs block">{metrics.surfaceAreaFormula}</span>
            <span className="font-black text-foreground">{metrics.surfaceAreaValue.toFixed(1)} u²</span>
          </div>

          <div className="p-3 bg-muted/50 rounded-2xl border border-border space-y-1">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">Volume (V)</span>
            <span className="font-bold text-emerald-500 text-xs block">{metrics.volumeFormula}</span>
            <span className="font-black text-foreground">{metrics.volumeValue.toFixed(1)} u³</span>
          </div>
        </div>
      </div>
    </div>
  );
}
