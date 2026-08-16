"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import { CircleTheoremType } from "./types";
import { createAngleArcSvg } from "./lib/geometryMath";
import {
  Circle as CircleIcon,
  Sliders,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function CircleTheoremsCanvas() {
  const [theorem, setTheorem] = useState<CircleTheoremType>("inscribed_angle");

  // Angles around circle in degrees [0, 360)
  const [angleA, setAngleA] = useState(210);
  const [angleB, setAngleB] = useState(330);
  const [angleC, setAngleC] = useState(90);
  const [angleD, setAngleD] = useState(45);

  const [draggingPoint, setDraggingPoint] = useState<"A" | "B" | "C" | "D" | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const cx = 300;
  const cy = 220;
  const r = 140;

  const getPoint = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const ptA = useMemo(() => getPoint(theorem === "semicircle_thales" ? 180 : angleA), [angleA, theorem]);
  const ptB = useMemo(() => getPoint(theorem === "semicircle_thales" ? 0 : angleB), [angleB, theorem]);
  const ptC = useMemo(() => getPoint(angleC), [angleC]);
  const ptD = useMemo(() => getPoint(angleD), [angleD]);
  const centerPt = { x: cx, y: cy };

  // Central and inscribed angles
  const centralAngle = Math.abs(
    (theorem === "semicircle_thales" ? 180 : (angleB - angleA + 360) % 360)
  );
  const inscribedAngle = centralAngle / 2;

  // SVG Angle Arcs
  const arcCenter = useMemo(() => createAngleArcSvg(ptA, centerPt, ptB, 28), [ptA, centerPt, ptB]);
  const arcC = useMemo(() => createAngleArcSvg(ptA, ptC, ptB, 26), [ptA, ptC, ptB]);
  const arcD = useMemo(() => createAngleArcSvg(ptA, ptD, ptB, 26), [ptA, ptD, ptB]);

  const screenToAngle = useCallback(
    (clientX: number, clientY: number) => {
      if (!svgRef.current) return 0;
      const rect = svgRef.current.getBoundingClientRect();
      const svgX = ((clientX - rect.left) / rect.width) * 600;
      const svgY = ((clientY - rect.top) / rect.height) * 440;
      const rad = Math.atan2(svgY - cy, svgX - cx);
      let deg = (rad * 180) / Math.PI;
      if (deg < 0) deg += 360;
      return Math.round(deg);
    },
    [cx, cy]
  );

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingPoint) return;
    const deg = screenToAngle(e.clientX, e.clientY);
    if (draggingPoint === "A" && theorem !== "semicircle_thales") setAngleA(deg);
    if (draggingPoint === "B" && theorem !== "semicircle_thales") setAngleB(deg);
    if (draggingPoint === "C") setAngleC(deg);
    if (draggingPoint === "D") setAngleD(deg);
  };

  const handlePointerUp = () => {
    setDraggingPoint(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: SVG Circle Theorem Canvas (7 cols) ────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <CircleIcon size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Circle Theorems & Direct Angle Readouts
            </span>
          </div>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl border border-border flex-wrap">
            {[
              ["inscribed_angle", "Inscribed Angle"],
              ["semicircle_thales", "Thales (90°)"],
              ["same_segment", "Same Segment"],
              ["cyclic_quadrilateral", "Cyclic Quad"],
            ].map(([tKey, label]) => (
              <button
                key={tKey}
                onClick={() => setTheorem(tKey as CircleTheoremType)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  theorem === tKey
                    ? "bg-primary text-primary-foreground shadow-sm font-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Circle Canvas */}
        <div className="flex-1 flex items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 overflow-hidden relative select-none">
          <svg
            ref={svgRef}
            viewBox="0 0 600 440"
            className="w-full h-full max-h-[440px] touch-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Main Circle */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#64748b" strokeWidth="2.5" />
            <circle cx={cx} cy={cy} r={4} fill="#6366f1" />

            {/* Subtended Arc Wedge */}
            {(theorem === "inscribed_angle" || theorem === "semicircle_thales") && (
              <g>
                {/* Central angle lines OA and OB */}
                <line x1={cx} y1={cy} x2={ptA.x} y2={ptA.y} stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 2" />
                <line x1={cx} y1={cy} x2={ptB.x} y2={ptB.y} stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 2" />

                {/* Inscribed angle lines CA and CB */}
                <line x1={ptC.x} y1={ptC.y} x2={ptA.x} y2={ptA.y} stroke="#ec4899" strokeWidth="2.5" />
                <line x1={ptC.x} y1={ptC.y} x2={ptB.x} y2={ptB.y} stroke="#ec4899" strokeWidth="2.5" />

                {/* Arc at Center O */}
                <path d={arcCenter.pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                <g transform={`translate(${arcCenter.textX}, ${arcCenter.textY})`}>
                  <rect x="-20" y="-9" width="40" height="18" rx="5" fill="#1e1b4b" stroke="#3b82f6" strokeWidth="1.5" />
                  <text y="3.5" textAnchor="middle" className="fill-blue-400 font-mono text-[9px] font-black">
                    {centralAngle.toFixed(0)}°
                  </text>
                </g>

                {/* Arc at Point C */}
                <path d={arcC.pathD} fill="none" stroke="#ec4899" strokeWidth="2.5" />
                <g transform={`translate(${arcC.textX}, ${arcC.textY})`}>
                  <rect x="-20" y="-9" width="40" height="18" rx="5" fill="#1e1b4b" stroke="#ec4899" strokeWidth="1.5" />
                  <text y="3.5" textAnchor="middle" className="fill-pink-400 font-mono text-[9px] font-black">
                    {inscribedAngle.toFixed(0)}°
                  </text>
                </g>
              </g>
            )}

            {theorem === "same_segment" && (
              <g>
                <line x1={ptC.x} y1={ptC.y} x2={ptA.x} y2={ptA.y} stroke="#ec4899" strokeWidth="2" />
                <line x1={ptC.x} y1={ptC.y} x2={ptB.x} y2={ptB.y} stroke="#ec4899" strokeWidth="2" />
                <line x1={ptD.x} y1={ptD.y} x2={ptA.x} y2={ptA.y} stroke="#10b981" strokeWidth="2" />
                <line x1={ptD.x} y1={ptD.y} x2={ptB.x} y2={ptB.y} stroke="#10b981" strokeWidth="2" />
                <line x1={ptA.x} y1={ptA.y} x2={ptB.x} y2={ptB.y} stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />

                {/* Arc C */}
                <g transform={`translate(${arcC.textX}, ${arcC.textY})`}>
                  <rect x="-20" y="-9" width="40" height="18" rx="5" fill="#1e1b4b" stroke="#ec4899" strokeWidth="1.5" />
                  <text y="3.5" textAnchor="middle" className="fill-pink-400 font-mono text-[9px] font-black">
                    {inscribedAngle.toFixed(0)}°
                  </text>
                </g>

                {/* Arc D */}
                <g transform={`translate(${arcD.textX}, ${arcD.textY})`}>
                  <rect x="-20" y="-9" width="40" height="18" rx="5" fill="#1e1b4b" stroke="#10b981" strokeWidth="1.5" />
                  <text y="3.5" textAnchor="middle" className="fill-emerald-400 font-mono text-[9px] font-black">
                    {inscribedAngle.toFixed(0)}°
                  </text>
                </g>
              </g>
            )}

            {theorem === "cyclic_quadrilateral" && (
              <g>
                <polygon
                  points={`${ptA.x},${ptA.y} ${ptB.x},${ptB.y} ${ptC.x},${ptC.y} ${ptD.x},${ptD.y}`}
                  fill="#6366f1"
                  fillOpacity="0.15"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                />
              </g>
            )}

            {/* Draggable Points */}
            {[
              { id: "A", pt: ptA, color: "#3b82f6" },
              { id: "B", pt: ptB, color: "#3b82f6" },
              { id: "C", pt: ptC, color: "#ec4899" },
              ...(theorem === "same_segment" || theorem === "cyclic_quadrilateral"
                ? [{ id: "D", pt: ptD, color: "#10b981" }]
                : []),
            ].map(({ id, pt, color }) => (
              <g
                key={id}
                transform={`translate(${pt.x}, ${pt.y})`}
                onPointerDown={() => setDraggingPoint(id as any)}
                className="cursor-grab active:cursor-grabbing"
              >
                <circle r="13" fill={color} stroke="#ffffff" strokeWidth="2.5" className="transition-transform hover:scale-125 shadow-sm" />
                <text y="4" textAnchor="middle" className="fill-white font-mono text-[10px] font-black pointer-events-none">
                  {id}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* ── Right: Theorem Formula & Real-Time Proof (5 cols) ── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Theorem Statement & Proof
            </span>
          </div>
        </div>

        {theorem === "inscribed_angle" && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-primary block">
                Inscribed Angle Theorem
              </span>
              <div className="font-mono text-sm font-black text-foreground bg-background/80 p-3 rounded-xl border border-border text-center">
                ∠AOB = 2 · ∠ACB
              </div>
              <p className="text-xs text-muted-foreground text-center">
                The angle subtended by an arc at the center is double the angle subtended by it at any point on the circumference.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-center">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-blue-500 block">Center ∠AOB</span>
                <span className="text-base font-black text-blue-500">{centralAngle.toFixed(1)}°</span>
              </div>
              <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-pink-500 block">Inscribed ∠ACB</span>
                <span className="text-base font-black text-pink-500">{inscribedAngle.toFixed(1)}°</span>
              </div>
            </div>
          </div>
        )}

        {theorem === "semicircle_thales" && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-emerald-500 block">
                Thales&apos; Theorem (Angle in a Semicircle)
              </span>
              <div className="font-mono text-sm font-black text-emerald-500 bg-background/80 p-3 rounded-xl border border-border text-center">
                ∠ACB = 90.0° (Right Angle)
              </div>
              <p className="text-xs text-muted-foreground text-center">
                If A and B are the endpoints of a diameter, any point C on the circumference forms a right-angled triangle ΔABC with hypotenuse AB.
              </p>
            </div>
          </div>
        )}

        {theorem === "cyclic_quadrilateral" && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-purple-500 block">
                Cyclic Quadrilateral Theorem
              </span>
              <div className="font-mono text-sm font-black text-foreground bg-background/80 p-3 rounded-xl border border-border text-center">
                ∠A + ∠C = 180° &nbsp;|&nbsp; ∠B + ∠D = 180°
              </div>
              <p className="text-xs text-muted-foreground text-center">
                The opposite interior angles of any quadrilateral inscribed inside a circle always sum to exactly 180 degrees.
              </p>
            </div>
          </div>
        )}

        {theorem === "same_segment" && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-amber-500 block">
                Angles in the Same Segment Theorem
              </span>
              <div className="font-mono text-sm font-black text-foreground bg-background/80 p-3 rounded-xl border border-border text-center">
                ∠ACB = ∠ADB = {inscribedAngle.toFixed(1)}°
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Angles subtended by the same arc (or chord AB) at the circumference in the same segment are equal.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
