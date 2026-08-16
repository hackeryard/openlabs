"use client";

import React, { useState, useRef, useMemo } from "react";
import { Vector3D } from "./types";
import { computeCrossProduct3DState, project3DTo2D } from "./lib/vectorMath";
import {
  Rotate3d,
  Sliders,
  Sparkles,
  Layers,
  Box,
} from "lucide-react";

export default function CrossProduct3DCanvas() {
  const [vectorU, setVectorU] = useState<Vector3D>({ x: 80, y: 0, z: 60 });
  const [vectorV, setVectorV] = useState<Vector3D>({ x: 20, y: 70, z: 0 });

  const [rotX, setRotX] = useState<number>(20);
  const [rotY, setRotY] = useState<number>(35);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const origin = { x: 300, y: 220 };

  const state = useMemo(
    () => computeCrossProduct3DState(vectorU, vectorV),
    [vectorU, vectorV]
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

  // Projected 3D vectors
  const pO = project3DTo2D({ x: 0, y: 0, z: 0 }, rotX, rotY, origin);
  const pU = project3DTo2D(vectorU, rotX, rotY, origin);
  const pV = project3DTo2D(vectorV, rotX, rotY, origin);
  const pCross = project3DTo2D(
    {
      x: state.crossProduct.x * 0.015,
      y: state.crossProduct.y * 0.015,
      z: state.crossProduct.z * 0.015,
    },
    rotX,
    rotY,
    origin
  );

  // Parallelogram fourth point
  const pSum = project3DTo2D(
    {
      x: vectorU.x + vectorV.x,
      y: vectorU.y + vectorV.y,
      z: vectorU.z + vectorV.z,
    },
    rotX,
    rotY,
    origin
  );

  // 3D Axes projections
  const pAxisX = project3DTo2D({ x: 120, y: 0, z: 0 }, rotX, rotY, origin);
  const pAxisY = project3DTo2D({ x: 0, y: 120, z: 0 }, rotX, rotY, origin);
  const pAxisZ = project3DTo2D({ x: 0, y: 0, z: 120 }, rotX, rotY, origin);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: 3D Cross Product Canvas (7 cols) ──────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Rotate3d size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              3D Cross Product (u × v) & Right-Hand Rule (Drag to Rotate)
            </span>
          </div>

          <span className="text-xs font-mono font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            u ⊥ (u × v) &nbsp;|&nbsp; v ⊥ (u × v)
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
            <defs>
              <pattern id="cp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
              </pattern>

              <marker id="cp-arrow-u" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
              </marker>
              <marker id="cp-arrow-v" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#ec4899" />
              </marker>
              <marker id="cp-arrow-w" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
              </marker>
            </defs>

            <rect width="600" height="440" fill="url(#cp-grid)" />

            {/* 3D Coordinate Axes */}
            <line x1={pO.x} y1={pO.y} x2={pAxisX.x} y2={pAxisX.y} stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 2" />
            <text x={pAxisX.x + 6} y={pAxisX.y} className="fill-muted-foreground font-mono text-[9px] font-bold">+X</text>

            <line x1={pO.x} y1={pO.y} x2={pAxisY.x} y2={pAxisY.y} stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 2" />
            <text x={pAxisY.x} y={pAxisY.y - 6} className="fill-muted-foreground font-mono text-[9px] font-bold">+Y</text>

            <line x1={pO.x} y1={pO.y} x2={pAxisZ.x} y2={pAxisZ.y} stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 2" />
            <text x={pAxisZ.x - 12} y={pAxisZ.y} className="fill-muted-foreground font-mono text-[9px] font-bold">+Z</text>

            {/* Parallelogram Spanned Area Surface */}
            <polygon
              points={`${pO.x},${pO.y} ${pU.x},${pU.y} ${pSum.x},${pSum.y} ${pV.x},${pV.y}`}
              fill="#6366f1"
              fillOpacity="0.25"
              stroke="#6366f1"
              strokeWidth="1.5"
            />

            {/* Vector u (Blue) */}
            <line x1={pO.x} y1={pO.y} x2={pU.x} y2={pU.y} stroke="#3b82f6" strokeWidth="3" markerEnd="url(#cp-arrow-u)" />

            {/* Vector v (Pink) */}
            <line x1={pO.x} y1={pO.y} x2={pV.x} y2={pV.y} stroke="#ec4899" strokeWidth="3" markerEnd="url(#cp-arrow-v)" />

            {/* Resultant Normal Vector w = u x v (Emerald) */}
            <line x1={pO.x} y1={pO.y} x2={pCross.x} y2={pCross.y} stroke="#10b981" strokeWidth="3.5" markerEnd="url(#cp-arrow-w)" />

            {/* Vector Labels */}
            <text x={pU.x + 8} y={pU.y} className="fill-blue-500 font-mono text-xs font-black">u</text>
            <text x={pV.x + 8} y={pV.y} className="fill-pink-500 font-mono text-xs font-black">v</text>
            <text x={pCross.x + 8} y={pCross.y} className="fill-emerald-500 font-mono text-xs font-black">u × v (Normal)</text>
          </svg>
        </div>
      </div>

      {/* ── Right: 3D Vector Sliders & Area Metrics (5 cols) ─── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Cross Product Components
            </span>
          </div>
        </div>

        {/* Vector u components */}
        <div className="space-y-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
          <span className="text-xs font-bold text-blue-500 block">Vector u = ({vectorU.x}, {vectorU.y}, {vectorU.z})</span>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[9px] text-muted-foreground block">u_x</label>
              <input
                type="number"
                value={vectorU.x}
                onChange={(e) => setVectorU({ ...vectorU, x: parseInt(e.target.value, 10) || 0 })}
                className="w-full p-1 bg-background border border-border rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-[9px] text-muted-foreground block">u_y</label>
              <input
                type="number"
                value={vectorU.y}
                onChange={(e) => setVectorU({ ...vectorU, y: parseInt(e.target.value, 10) || 0 })}
                className="w-full p-1 bg-background border border-border rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-[9px] text-muted-foreground block">u_z</label>
              <input
                type="number"
                value={vectorU.z}
                onChange={(e) => setVectorU({ ...vectorU, z: parseInt(e.target.value, 10) || 0 })}
                className="w-full p-1 bg-background border border-border rounded-lg text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Vector v components */}
        <div className="space-y-2 p-3 bg-pink-500/10 border border-pink-500/20 rounded-2xl">
          <span className="text-xs font-bold text-pink-500 block">Vector v = ({vectorV.x}, {vectorV.y}, {vectorV.z})</span>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[9px] text-muted-foreground block">v_x</label>
              <input
                type="number"
                value={vectorV.x}
                onChange={(e) => setVectorV({ ...vectorV, x: parseInt(e.target.value, 10) || 0 })}
                className="w-full p-1 bg-background border border-border rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-[9px] text-muted-foreground block">v_y</label>
              <input
                type="number"
                value={vectorV.y}
                onChange={(e) => setVectorV({ ...vectorV, y: parseInt(e.target.value, 10) || 0 })}
                className="w-full p-1 bg-background border border-border rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-[9px] text-muted-foreground block">v_z</label>
              <input
                type="number"
                value={vectorV.z}
                onChange={(e) => setVectorV({ ...vectorV, z: parseInt(e.target.value, 10) || 0 })}
                className="w-full p-1 bg-background border border-border rounded-lg text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Result Vector w Box */}
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1 font-mono text-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-500 block">u × v = det(î, ĵ, k̂ matrix)</span>
          <div className="font-bold text-foreground">
            w = ({state.crossProduct.x}î, {state.crossProduct.y}ĵ, {state.crossProduct.z}k̂)
          </div>
        </div>

        {/* Geometric Area Readouts */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-center">
          <div className="p-3 bg-muted/60 border border-border rounded-2xl space-y-1">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">Parallelogram Area</span>
            <span className="font-black text-primary text-sm">{state.parallelogramArea.toFixed(0)} u²</span>
          </div>

          <div className="p-3 bg-muted/60 border border-border rounded-2xl space-y-1">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">Triangle Area (½|u×v|)</span>
            <span className="font-black text-emerald-500 text-sm">{state.triangleArea.toFixed(0)} u²</span>
          </div>
        </div>
      </div>
    </div>
  );
}
