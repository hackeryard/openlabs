"use client";

import React, { useState, useRef, useMemo } from "react";
import { Vector3D } from "./types";
import { computeTripleProductState, project3DTo2D } from "./lib/vectorMath";
import {
  Box,
  Sliders,
  Rotate3d,
  Sparkles,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function TripleProductCanvas() {
  const [vectorU, setVectorU] = useState<Vector3D>({ x: 80, y: 0, z: 20 });
  const [vectorV, setVectorV] = useState<Vector3D>({ x: 20, y: 70, z: 0 });
  const [vectorW, setVectorW] = useState<Vector3D>({ x: 10, y: 20, z: 80 });

  const [rotX, setRotX] = useState<number>(25);
  const [rotY, setRotY] = useState<number>(35);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const origin = { x: 300, y: 220 };

  const state = useMemo(
    () => computeTripleProductState(vectorU, vectorV, vectorW),
    [vectorU, vectorV, vectorW]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };

    setRotY((prev) => (prev + dx * 0.8) % 360);
    setRotX((prev) => Math.max(-85, Math.min(85, prev - dy * 0.8)));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // 8 Vertices of Parallelepiped
  // O, u, v, w, u+v, u+w, v+w, u+v+w
  const vO = project3DTo2D({ x: 0, y: 0, z: 0 }, rotX, rotY, origin);
  const vU = project3DTo2D(vectorU, rotX, rotY, origin);
  const vV = project3DTo2D(vectorV, rotX, rotY, origin);
  const vW = project3DTo2D(vectorW, rotX, rotY, origin);

  const vUV = project3DTo2D({ x: vectorU.x + vectorV.x, y: vectorU.y + vectorV.y, z: vectorU.z + vectorV.z }, rotX, rotY, origin);
  const vUW = project3DTo2D({ x: vectorU.x + vectorW.x, y: vectorU.y + vectorW.y, z: vectorU.z + vectorW.z }, rotX, rotY, origin);
  const vVW = project3DTo2D({ x: vectorV.x + vectorW.x, y: vectorV.y + vectorW.y, z: vectorV.z + vectorW.z }, rotX, rotY, origin);
  const vUVW = project3DTo2D({ x: vectorU.x + vectorV.x + vectorW.x, y: vectorU.y + vectorV.y + vectorW.y, z: vectorU.z + vectorV.z + vectorW.z }, rotX, rotY, origin);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: 3D Parallelepiped Canvas (7 cols) ─────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Box size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Scalar Triple Product & Parallelepiped Volume
            </span>
          </div>

          <span
            className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full border ${
              state.isCoplanar
                ? "bg-rose-500/15 text-rose-500 border-rose-500/30"
                : "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
            }`}
          >
            {state.isCoplanar ? "Coplanar (Vol = 0)" : "Linearly Independent (Vol > 0) ✨"}
          </span>
        </div>

        {/* 3D SVG Canvas */}
        <div
          className="flex-1 flex items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 overflow-hidden relative select-none cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <svg viewBox="0 0 600 440" className="w-full h-full max-h-[440px] pointer-events-none">
            {/* Grid */}
            <defs>
              <pattern id="stp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="600" height="440" fill="url(#stp-grid)" />

            {/* Parallelepiped 12 Edges */}
            {/* Bottom face: O, U, UV, V */}
            <line x1={vO.x} y1={vO.y} x2={vU.x} y2={vU.y} stroke="#3b82f6" strokeWidth="3" />
            <line x1={vU.x} y1={vU.y} x2={vUV.x} y2={vUV.y} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3 2" />
            <line x1={vUV.x} y1={vUV.y} x2={vV.x} y2={vV.y} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3 2" />
            <line x1={vV.x} y1={vV.y} x2={vO.x} y2={vO.y} stroke="#ec4899" strokeWidth="3" />

            {/* Top face: W, UW, UVW, VW */}
            <line x1={vW.x} y1={vW.y} x2={vUW.x} y2={vUW.y} stroke="#6366f1" strokeWidth="1.5" />
            <line x1={vUW.x} y1={vUW.y} x2={vUVW.x} y2={vUVW.y} stroke="#6366f1" strokeWidth="1.5" />
            <line x1={vUVW.x} y1={vUVW.y} x2={vVW.x} y2={vVW.y} stroke="#6366f1" strokeWidth="1.5" />
            <line x1={vVW.x} y1={vVW.y} x2={vW.x} y2={vW.y} stroke="#6366f1" strokeWidth="1.5" />

            {/* Vertical pillars */}
            <line x1={vO.x} y1={vO.y} x2={vW.x} y2={vW.y} stroke="#10b981" strokeWidth="3" />
            <line x1={vU.x} y1={vU.y} x2={vUW.x} y2={vUW.y} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3 2" />
            <line x1={vV.x} y1={vV.y} x2={vVW.x} y2={vVW.y} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3 2" />
            <line x1={vUV.x} y1={vUV.y} x2={vUVW.x} y2={vUVW.y} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3 2" />

            {/* Shaded base face */}
            <polygon
              points={`${vO.x},${vO.y} ${vU.x},${vU.y} ${vUV.x},${vUV.y} ${vV.x},${vV.y}`}
              fill="#6366f1"
              fillOpacity="0.15"
            />

            {/* Shaded top face */}
            <polygon
              points={`${vW.x},${vW.y} ${vUW.x},${vUW.y} ${vUVW.x},${vUVW.y} ${vVW.x},${vVW.y}`}
              fill="#6366f1"
              fillOpacity="0.2"
            />

            {/* Vertices */}
            <circle cx={vU.x} cy={vU.y} r="5" fill="#3b82f6" />
            <circle cx={vV.x} cy={vV.y} r="5" fill="#ec4899" />
            <circle cx={vW.x} cy={vW.y} r="5" fill="#10b981" />

            <text x={vU.x + 8} y={vU.y} className="fill-blue-500 font-mono text-xs font-black">u</text>
            <text x={vV.x + 8} y={vV.y} className="fill-pink-500 font-mono text-xs font-black">v</text>
            <text x={vW.x + 8} y={vW.y} className="fill-emerald-500 font-mono text-xs font-black">w</text>
          </svg>
        </div>
      </div>

      {/* ── Right: Triple Product Determinant Box (5 cols) ──── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Triple Product & Determinant
            </span>
          </div>
        </div>

        {/* Volume Box */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-primary block">
            Scalar Triple Product [u, v, w]
          </span>
          <div className="font-mono text-sm font-black text-foreground bg-background/80 p-2.5 rounded-xl border border-border text-center">
            [u, v, w] = u · (v × w) = {state.scalarTripleProduct.toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground text-center font-mono">
            Parallelepiped Volume = |[u, v, w]| = {state.parallelepipedVolume.toFixed(0)} u³
          </div>
        </div>

        {/* Determinant Matrix Display */}
        <div className="p-3 bg-muted/50 border border-border rounded-2xl space-y-1 font-mono text-xs text-center">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">3×3 Determinant Matrix</span>
          <div className="p-2 bg-background/80 rounded-xl border border-border inline-block px-4">
            <div>| {vectorU.x} &nbsp; {vectorU.y} &nbsp; {vectorU.z} |</div>
            <div>| {vectorV.x} &nbsp; {vectorV.y} &nbsp; {vectorV.z} |</div>
            <div>| {vectorW.x} &nbsp; {vectorW.y} &nbsp; {vectorW.z} |</div>
          </div>
        </div>

        {/* Coplanar Toggle preset */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <span className="text-xs font-bold text-foreground block">Test Configurations</span>
          <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
            <button
              onClick={() => {
                setVectorU({ x: 80, y: 0, z: 20 });
                setVectorV({ x: 20, y: 70, z: 0 });
                setVectorW({ x: 10, y: 20, z: 80 });
              }}
              className="p-2 bg-muted hover:bg-accent border border-border rounded-xl text-left text-emerald-500 font-bold"
            >
              Independent (Vol &gt; 0)
            </button>

            <button
              onClick={() => {
                setVectorU({ x: 80, y: 40, z: 0 });
                setVectorV({ x: 20, y: 60, z: 0 });
                setVectorW({ x: 100, y: 100, z: 0 }); // linear combination, in xy plane
              }}
              className="p-2 bg-muted hover:bg-accent border border-border rounded-xl text-left text-rose-500 font-bold"
            >
              Coplanar (Vol = 0)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
