"use client";

import React, { useState, useRef, useMemo } from "react";
import { Vector3D, Plane3D } from "./types";
import { project3DTo2D, pointToPlaneDistance, magnitude3D } from "./lib/vectorMath";
import {
  Layers,
  Sliders,
  Rotate3d,
  Sparkles,
  Edit3,
} from "lucide-react";

export default function LinesPlanes3DCanvas() {
  const [viewType, setViewType] = useState<"line" | "plane">("plane");

  // 3D Line params: r(t) = a + t*d
  const [linePoint, setLinePoint] = useState<Vector3D>({ x: 30, y: 40, z: 20 });
  const [lineDir, setLineDir] = useState<Vector3D>({ x: 60, y: 40, z: 50 });
  const [paramT, setParamT] = useState<number>(0.5);

  // 3D Plane params: Ax + By + Cz = D
  const [planeNormal, setPlaneNormal] = useState<Vector3D>({ x: 1, y: 2, z: 2 });
  const [planeD, setPlaneD] = useState<number>(60);
  const [testPoint, setTestPoint] = useState<Vector3D>({ x: 40, y: 60, z: 50 });

  const [rotX, setRotX] = useState<number>(20);
  const [rotY, setRotY] = useState<number>(35);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const origin = { x: 300, y: 220 };

  const handlePointerDown = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch (_) {}
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

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    } catch (_) {}
    setIsDragging(false);
  };

  // 3D Line points
  const pLineStart = project3DTo2D(
    {
      x: linePoint.x - 1.5 * lineDir.x,
      y: linePoint.y - 1.5 * lineDir.y,
      z: linePoint.z - 1.5 * lineDir.z,
    },
    rotX,
    rotY,
    origin
  );

  const pLineEnd = project3DTo2D(
    {
      x: linePoint.x + 1.5 * lineDir.x,
      y: linePoint.y + 1.5 * lineDir.y,
      z: linePoint.z + 1.5 * lineDir.z,
    },
    rotX,
    rotY,
    origin
  );

  const currentLinePt = {
    x: linePoint.x + paramT * lineDir.x,
    y: linePoint.y + paramT * lineDir.y,
    z: linePoint.z + paramT * lineDir.z,
  };
  const pCurrent = project3DTo2D(currentLinePt, rotX, rotY, origin);

  // Plane Distance
  const planeObj: Plane3D = {
    point: { x: 0, y: 0, z: 0 },
    normal: planeNormal,
    d: planeD,
  };
  const distanceToPlane = pointToPlaneDistance(testPoint, planeObj);

  const magNormSq = Math.max(1, magnitude3D(planeNormal) ** 2);
  const pPlaneCenter = project3DTo2D(
    {
      x: (planeD * planeNormal.x) / magNormSq * 50,
      y: (planeD * planeNormal.y) / magNormSq * 50,
      z: (planeD * planeNormal.z) / magNormSq * 50,
    },
    rotX,
    rotY,
    origin
  );

  const pTest = project3DTo2D(testPoint, rotX, rotY, origin);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: 3D Lines & Planes Canvas (7 cols) ─────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              3D Vector Lines & Planes (Drag to Rotate)
            </span>
          </div>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl border border-border">
            <button
              onClick={() => setViewType("line")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                viewType === "line"
                  ? "bg-primary text-primary-foreground font-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              3D Line: r(t) = a + td
            </button>

            <button
              onClick={() => setViewType("plane")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                viewType === "plane"
                  ? "bg-primary text-primary-foreground font-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              3D Plane: Ax + By + Cz = D
            </button>
          </div>
        </div>

        {/* 3D Canvas */}
        <div
          className="flex-1 flex items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 overflow-hidden relative select-none cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <svg viewBox="0 0 600 440" className="w-full h-full max-h-[440px] pointer-events-none">
            {/* Grid */}
            <defs>
              <pattern id="lp-grid-robust" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="600" height="440" fill="url(#lp-grid-robust)" />

            {viewType === "line" ? (
              /* ── 3D Line Drawing ── */
              <g>
                {/* Line r(t) */}
                <line
                  x1={pLineStart.x}
                  y1={pLineStart.y}
                  x2={pLineEnd.x}
                  y2={pLineEnd.y}
                  stroke="#3b82f6"
                  strokeWidth="3"
                />

                {/* Point a */}
                <circle cx={project3DTo2D(linePoint, rotX, rotY, origin).x} cy={project3DTo2D(linePoint, rotX, rotY, origin).y} r="6" fill="#ec4899" />
                <text x={project3DTo2D(linePoint, rotX, rotY, origin).x + 8} y={project3DTo2D(linePoint, rotX, rotY, origin).y} className="fill-pink-500 font-mono text-xs font-black">
                  a (Anchor)
                </text>

                {/* Current parametric point r(t) */}
                <circle cx={pCurrent.x} cy={pCurrent.y} r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                <text x={pCurrent.x + 8} y={pCurrent.y} className="fill-amber-500 font-mono text-xs font-black">
                  r({paramT.toFixed(1)})
                </text>
              </g>
            ) : (
              /* ── 3D Plane Drawing ── */
              <g>
                {/* Plane polygon disc */}
                <circle cx={pPlaneCenter.x} cy={pPlaneCenter.y} r="110" fill="#6366f1" fillOpacity="0.2" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 2" />

                {/* Test Point P */}
                <circle cx={pTest.x} cy={pTest.y} r="6" fill="#ec4899" stroke="#ffffff" strokeWidth="1.5" />
                <text x={pTest.x + 8} y={pTest.y} className="fill-pink-500 font-mono text-xs font-black">P ({testPoint.x}, {testPoint.y}, {testPoint.z})</text>

                {/* Distance line */}
                <line x1={pTest.x} y1={pTest.y} x2={pPlaneCenter.x} y2={pPlaneCenter.y} stroke="#10b981" strokeWidth="2" strokeDasharray="3 2" />
                <g transform={`translate(${(pTest.x + pPlaneCenter.x) / 2}, ${(pTest.y + pPlaneCenter.y) / 2})`}>
                  <rect x="-24" y="-8" width="48" height="16" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                  <text y="3.5" textAnchor="middle" className="fill-emerald-400 font-mono text-[9px] font-bold">
                    d={distanceToPlane.toFixed(1)}
                  </text>
                </g>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* ── Right: Editable Equations & Sliders (5 cols) ────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Edit3 size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              {viewType === "line" ? "Editable 3D Line Equation" : "Editable 3D Plane Equation"}
            </span>
          </div>
        </div>

        {viewType === "line" ? (
          <div className="space-y-4">
            {/* Equation Box */}
            <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-primary block">
                Parametric Vector Equation
              </span>
              <div className="font-mono text-sm font-black text-foreground bg-background/80 p-2.5 rounded-xl border border-border text-center">
                r(t) = ({linePoint.x}, {linePoint.y}, {linePoint.z}) + t · ({lineDir.x}, {lineDir.y}, {lineDir.z})
              </div>
            </div>

            {/* Editable Anchor Point A */}
            <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-pink-500 block">Anchor Point a = ({linePoint.x}, {linePoint.y}, {linePoint.z})</span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={linePoint.x}
                  onChange={(e) => setLinePoint({ ...linePoint, x: parseInt(e.target.value, 10) || 0 })}
                  className="p-1.5 bg-background border border-border rounded-lg text-xs font-mono font-bold"
                  placeholder="x"
                />
                <input
                  type="number"
                  value={linePoint.y}
                  onChange={(e) => setLinePoint({ ...linePoint, y: parseInt(e.target.value, 10) || 0 })}
                  className="p-1.5 bg-background border border-border rounded-lg text-xs font-mono font-bold"
                  placeholder="y"
                />
                <input
                  type="number"
                  value={linePoint.z}
                  onChange={(e) => setLinePoint({ ...linePoint, z: parseInt(e.target.value, 10) || 0 })}
                  className="p-1.5 bg-background border border-border rounded-lg text-xs font-mono font-bold"
                  placeholder="z"
                />
              </div>
            </div>

            {/* Editable Direction Vector D */}
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-blue-500 block">Direction Vector d = ({lineDir.x}, {lineDir.y}, {lineDir.z})</span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={lineDir.x}
                  onChange={(e) => setLineDir({ ...lineDir, x: parseInt(e.target.value, 10) || 0 })}
                  className="p-1.5 bg-background border border-border rounded-lg text-xs font-mono font-bold"
                  placeholder="d_x"
                />
                <input
                  type="number"
                  value={lineDir.y}
                  onChange={(e) => setLineDir({ ...lineDir, y: parseInt(e.target.value, 10) || 0 })}
                  className="p-1.5 bg-background border border-border rounded-lg text-xs font-mono font-bold"
                  placeholder="d_y"
                />
                <input
                  type="number"
                  value={lineDir.z}
                  onChange={(e) => setLineDir({ ...lineDir, z: parseInt(e.target.value, 10) || 0 })}
                  className="p-1.5 bg-background border border-border rounded-lg text-xs font-mono font-bold"
                  placeholder="d_z"
                />
              </div>
            </div>

            {/* Slider t */}
            <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Parameter t</span>
                <span className="font-mono text-primary font-black">{paramT.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.05"
                value={paramT}
                onChange={(e) => setParamT(parseFloat(e.target.value) || 0)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Plane Equation Box */}
            <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-primary block">
                Plane Cartesian Equation
              </span>
              <div className="font-mono text-sm font-black text-foreground bg-background/80 p-2.5 rounded-xl border border-border text-center">
                {planeNormal.x}x + {planeNormal.y}y + {planeNormal.z}z = {planeD}
              </div>
            </div>

            {/* Editable Plane Coefficients A, B, C, D */}
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-indigo-500 block">Normal Vector n = (A, B, C) & Constant D</span>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[9px] text-muted-foreground block">A</label>
                  <input
                    type="number"
                    value={planeNormal.x}
                    onChange={(e) => setPlaneNormal({ ...planeNormal, x: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-1 bg-background border border-border rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground block">B</label>
                  <input
                    type="number"
                    value={planeNormal.y}
                    onChange={(e) => setPlaneNormal({ ...planeNormal, y: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-1 bg-background border border-border rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground block">C</label>
                  <input
                    type="number"
                    value={planeNormal.z}
                    onChange={(e) => setPlaneNormal({ ...planeNormal, z: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-1 bg-background border border-border rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground block">D</label>
                  <input
                    type="number"
                    value={planeD}
                    onChange={(e) => setPlaneD(parseInt(e.target.value, 10) || 0)}
                    className="w-full p-1 bg-background border border-border rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Editable Test Point P */}
            <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-pink-500 block">Test Point P = (x₀, y₀, z₀)</span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={testPoint.x}
                  onChange={(e) => setTestPoint({ ...testPoint, x: parseInt(e.target.value, 10) || 0 })}
                  className="p-1 bg-background border border-border rounded-lg text-xs font-mono font-bold"
                  placeholder="x₀"
                />
                <input
                  type="number"
                  value={testPoint.y}
                  onChange={(e) => setTestPoint({ ...testPoint, y: parseInt(e.target.value, 10) || 0 })}
                  className="p-1 bg-background border border-border rounded-lg text-xs font-mono font-bold"
                  placeholder="y₀"
                />
                <input
                  type="number"
                  value={testPoint.z}
                  onChange={(e) => setTestPoint({ ...testPoint, z: parseInt(e.target.value, 10) || 0 })}
                  className="p-1 bg-background border border-border rounded-lg text-xs font-mono font-bold"
                  placeholder="z₀"
                />
              </div>
            </div>

            {/* Point-to-Plane Distance readout */}
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl font-mono text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-500 block">Shortest Distance to Plane</span>
              <div className="text-foreground font-black text-base">
                δ = {distanceToPlane.toFixed(2)} units
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
