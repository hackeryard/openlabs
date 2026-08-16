"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import { computeTriangleCenters, distance, midpoint, createAngleArcSvg } from "./lib/geometryMath";
import {
  Activity,
  Sliders,
  Sparkles,
  CheckCircle2,
  Layers,
  RotateCcw,
  Eye,
} from "lucide-react";

export default function TriangleCentersCanvas() {
  const [pointA, setPointA] = useState({ x: 200, y: 140 });
  const [pointB, setPointB] = useState({ x: 440, y: 140 });
  const [pointC, setPointC] = useState({ x: 280, y: 340 });

  const [showCentroid, setShowCentroid] = useState(true);
  const [showCircumcenter, setShowCircumcenter] = useState(true);
  const [showIncenter, setShowIncenter] = useState(true);
  const [showOrthocenter, setShowOrthocenter] = useState(true);
  const [showEulerLine, setShowEulerLine] = useState(true);
  const [showNinePointCircle, setShowNinePointCircle] = useState(false);

  // Overlay settings for lengths & angles
  const [showLengths, setShowLengths] = useState(true);
  const [showAngles, setShowAngles] = useState(true);

  const [draggingVertex, setDraggingVertex] = useState<"A" | "B" | "C" | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const width = 600;
  const height = 440;

  // Calculate all centers & metrics
  const results = useMemo(
    () => computeTriangleCenters(pointA, pointB, pointC),
    [pointA, pointB, pointC]
  );

  const screenToSvg = useCallback(
    (clientX: number, clientY: number) => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * width;
      const y = ((clientY - rect.top) / rect.height) * height;
      return {
        x: Math.max(30, Math.min(width - 30, Math.round(x))),
        y: Math.max(30, Math.min(height - 30, Math.round(y))),
      };
    },
    [width, height]
  );

  const handlePointerDown = (vertex: "A" | "B" | "C") => {
    setDraggingVertex(vertex);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingVertex) return;
    const { x, y } = screenToSvg(e.clientX, e.clientY);
    if (draggingVertex === "A") setPointA({ x, y });
    if (draggingVertex === "B") setPointB({ x, y });
    if (draggingVertex === "C") setPointC({ x, y });
  };

  const handlePointerUp = () => {
    setDraggingVertex(null);
  };

  // Midpoints for medians & length badges
  const mAB = midpoint(pointA, pointB);
  const mBC = midpoint(pointB, pointC);
  const mCA = midpoint(pointC, pointA);

  // Angle arc SVGs at each vertex
  const arcA = useMemo(() => createAngleArcSvg(pointB, pointA, pointC, 30), [pointA, pointB, pointC]);
  const arcB = useMemo(() => createAngleArcSvg(pointC, pointB, pointA, 30), [pointA, pointB, pointC]);
  const arcC = useMemo(() => createAngleArcSvg(pointA, pointC, pointB, 30), [pointA, pointB, pointC]);

  const distOG = distance(results.circumcenter, results.centroid);
  const distGH = distance(results.centroid, results.orthocenter);
  const eulerRatio = distOG > 0.1 ? (distGH / distOG).toFixed(2) : "2.00";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive SVG Triangle Canvas (7 cols) ──── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Triangle Centers & Direct Angle/Length Canvas
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowAngles(!showAngles)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                showAngles
                  ? "bg-primary text-primary-foreground font-black shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              ∠ Angles: {showAngles ? "ON" : "OFF"}
            </button>

            <button
              onClick={() => setShowLengths(!showLengths)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                showLengths
                  ? "bg-primary text-primary-foreground font-black shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Side Lengths: {showLengths ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* SVG Triangle Canvas */}
        <div className="flex-1 flex items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 overflow-hidden relative select-none">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full max-h-[440px] touch-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Grid */}
            <defs>
              <pattern id="tri-grid-2" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={width} height={height} fill="url(#tri-grid-2)" />

            {/* Circumcircle */}
            {showCircumcenter && results.circumcenter.radius > 0 && results.circumcenter.radius < 500 && (
              <circle
                cx={results.circumcenter.x}
                cy={results.circumcenter.y}
                r={results.circumcenter.radius}
                fill="#3b82f6"
                fillOpacity="0.05"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            )}

            {/* Incircle */}
            {showIncenter && results.incenter.radius > 0 && (
              <circle
                cx={results.incenter.x}
                cy={results.incenter.y}
                r={results.incenter.radius}
                fill="#10b981"
                fillOpacity="0.08"
                stroke="#10b981"
                strokeWidth="2"
              />
            )}

            {/* Nine Point Circle */}
            {showNinePointCircle && results.ninePointCenter.radius > 0 && results.ninePointCenter.radius < 300 && (
              <circle
                cx={results.ninePointCenter.x}
                cy={results.ninePointCenter.y}
                r={results.ninePointCenter.radius}
                fill="#a855f7"
                fillOpacity="0.06"
                stroke="#a855f7"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />
            )}

            {/* Euler Line */}
            {showEulerLine && (
              <line
                x1={results.circumcenter.x + (results.orthocenter.x - results.circumcenter.x) * -0.5}
                y1={results.circumcenter.y + (results.orthocenter.y - results.circumcenter.y) * -0.5}
                x2={results.orthocenter.x + (results.orthocenter.x - results.circumcenter.x) * 0.5}
                y2={results.orthocenter.y + (results.orthocenter.y - results.circumcenter.y) * 0.5}
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="6 3"
              />
            )}

            {/* Medians */}
            {showCentroid && (
              <g stroke="#ec4899" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.6">
                <line x1={pointA.x} y1={pointA.y} x2={mBC.x} y2={mBC.y} />
                <line x1={pointB.x} y1={pointB.y} x2={mCA.x} y2={mCA.y} />
                <line x1={pointC.x} y1={pointC.y} x2={mAB.x} y2={mAB.y} />
              </g>
            )}

            {/* Triangle Edges */}
            <polygon
              points={`${pointA.x},${pointA.y} ${pointB.x},${pointB.y} ${pointC.x},${pointC.y}`}
              fill="#6366f1"
              fillOpacity="0.12"
              stroke="#6366f1"
              strokeWidth="3"
              strokeLinejoin="round"
            />

            {/* Angle Arcs & Real-time Degree Badges */}
            {showAngles && (
              <g>
                {/* Arc A */}
                <path d={arcA.pathD} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                <g transform={`translate(${arcA.textX}, ${arcA.textY})`}>
                  <rect x="-18" y="-9" width="36" height="18" rx="5" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.5" />
                  <text y="3.5" textAnchor="middle" className="fill-amber-400 font-mono text-[9px] font-black">
                    {results.anglesDeg.A.toFixed(1)}°
                  </text>
                </g>

                {/* Arc B */}
                <path d={arcB.pathD} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                <g transform={`translate(${arcB.textX}, ${arcB.textY})`}>
                  <rect x="-18" y="-9" width="36" height="18" rx="5" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.5" />
                  <text y="3.5" textAnchor="middle" className="fill-amber-400 font-mono text-[9px] font-black">
                    {results.anglesDeg.B.toFixed(1)}°
                  </text>
                </g>

                {/* Arc C */}
                <path d={arcC.pathD} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                <g transform={`translate(${arcC.textX}, ${arcC.textY})`}>
                  <rect x="-18" y="-9" width="36" height="18" rx="5" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.5" />
                  <text y="3.5" textAnchor="middle" className="fill-amber-400 font-mono text-[9px] font-black">
                    {results.anglesDeg.C.toFixed(1)}°
                  </text>
                </g>
              </g>
            )}

            {/* Side Length Badges along edges */}
            {showLengths && (
              <g>
                {/* Side c (AB) */}
                <g transform={`translate(${mAB.x}, ${mAB.y - 12})`}>
                  <rect x="-24" y="-8" width="48" height="16" rx="4" fill="#0f172a" stroke="#6366f1" strokeWidth="1.5" />
                  <text y="3.5" textAnchor="middle" className="fill-white font-mono text-[9px] font-bold">
                    c = {results.sideLengths.c.toFixed(1)}
                  </text>
                </g>

                {/* Side a (BC) */}
                <g transform={`translate(${mBC.x + 18}, ${mBC.y})`}>
                  <rect x="-24" y="-8" width="48" height="16" rx="4" fill="#0f172a" stroke="#6366f1" strokeWidth="1.5" />
                  <text y="3.5" textAnchor="middle" className="fill-white font-mono text-[9px] font-bold">
                    a = {results.sideLengths.a.toFixed(1)}
                  </text>
                </g>

                {/* Side b (CA) */}
                <g transform={`translate(${mCA.x - 18}, ${mCA.y})`}>
                  <rect x="-24" y="-8" width="48" height="16" rx="4" fill="#0f172a" stroke="#6366f1" strokeWidth="1.5" />
                  <text y="3.5" textAnchor="middle" className="fill-white font-mono text-[9px] font-bold">
                    b = {results.sideLengths.b.toFixed(1)}
                  </text>
                </g>
              </g>
            )}

            {/* Center Points Badges */}
            {showCentroid && (
              <g transform={`translate(${results.centroid.x}, ${results.centroid.y})`}>
                <circle r="6" fill="#ec4899" stroke="#fff" strokeWidth="2" />
                <text x="8" y="4" className="fill-pink-500 font-mono text-[10px] font-black">G (Centroid)</text>
              </g>
            )}

            {showCircumcenter && (
              <g transform={`translate(${results.circumcenter.x}, ${results.circumcenter.y})`}>
                <circle r="6" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                <text x="8" y="4" className="fill-blue-500 font-mono text-[10px] font-black">O (Circumcenter)</text>
              </g>
            )}

            {showIncenter && (
              <g transform={`translate(${results.incenter.x}, ${results.incenter.y})`}>
                <circle r="6" fill="#10b981" stroke="#fff" strokeWidth="2" />
                <text x="8" y="4" className="fill-emerald-500 font-mono text-[10px] font-black">I (Incenter)</text>
              </g>
            )}

            {showOrthocenter && (
              <g transform={`translate(${results.orthocenter.x}, ${results.orthocenter.y})`}>
                <circle r="6" fill="#ef4444" stroke="#fff" strokeWidth="2" />
                <text x="8" y="4" className="fill-rose-500 font-mono text-[10px] font-black">H (Orthocenter)</text>
              </g>
            )}

            {showNinePointCircle && (
              <g transform={`translate(${results.ninePointCenter.x}, ${results.ninePointCenter.y})`}>
                <circle r="5" fill="#a855f7" stroke="#fff" strokeWidth="1.5" />
                <text x="8" y="4" className="fill-purple-500 font-mono text-[10px] font-black">N (9-Point)</text>
              </g>
            )}

            {/* Draggable Vertices */}
            {[
              { id: "A", pt: pointA },
              { id: "B", pt: pointB },
              { id: "C", pt: pointC },
            ].map(({ id, pt }) => (
              <g
                key={id}
                transform={`translate(${pt.x}, ${pt.y})`}
                onPointerDown={() => handlePointerDown(id as "A" | "B" | "C")}
                className="cursor-grab active:cursor-grabbing"
              >
                <circle r="14" fill="#6366f1" stroke="#ffffff" strokeWidth="2.5" className="transition-transform hover:scale-125 shadow-md" />
                <text y="4" textAnchor="middle" className="fill-white font-mono text-[11px] font-black pointer-events-none">
                  {id}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Toggles Strip */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2">
          {[
            { label: "G: Centroid", active: showCentroid, set: setShowCentroid },
            { label: "O: Circumcenter", active: showCircumcenter, set: setShowCircumcenter },
            { label: "I: Incenter", active: showIncenter, set: setShowIncenter },
            { label: "H: Orthocenter", active: showOrthocenter, set: setShowOrthocenter },
            { label: "Euler Line (O-G-H)", active: showEulerLine, set: setShowEulerLine },
            { label: "9-Point Circle", active: showNinePointCircle, set: setShowNinePointCircle },
          ].map((t) => (
            <button
              key={t.label}
              onClick={() => t.set(!t.active)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                t.active
                  ? "bg-primary text-primary-foreground border-primary font-black shadow-sm"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: Triangle Metrics & Euler Theorem (5 cols) ── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Live Angle & Length Metrics
            </span>
          </div>
          <span className="text-xs font-mono font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
            {results.triangleType}
          </span>
        </div>

        {/* Euler Line Theorem Card */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-amber-500 block">
            Euler Line Collinearity Theorem
          </span>
          <div className="font-mono text-xs font-black text-foreground bg-background/80 p-2.5 rounded-xl border border-border text-center">
            HG = 2 · GO (Ratio: {eulerRatio} : 1)
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Orthocenter (H), Centroid (G), and Circumcenter (O) lie on one straight line for all triangles!
          </p>
        </div>

        {/* Side Lengths & Angles Matrix */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-3 bg-muted/50 rounded-2xl border border-border space-y-1">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">Side Lengths</span>
            <div>a (BC): <span className="font-bold text-primary">{results.sideLengths.a.toFixed(1)} px</span></div>
            <div>b (AC): <span className="font-bold text-primary">{results.sideLengths.b.toFixed(1)} px</span></div>
            <div>c (AB): <span className="font-bold text-primary">{results.sideLengths.c.toFixed(1)} px</span></div>
          </div>

          <div className="p-3 bg-muted/50 rounded-2xl border border-border space-y-1">
            <span className="text-[9px] uppercase font-bold text-amber-500 block">Interior Angles</span>
            <div>∠A: <span className="font-bold text-foreground">{results.anglesDeg.A.toFixed(1)}°</span></div>
            <div>∠B: <span className="font-bold text-foreground">{results.anglesDeg.B.toFixed(1)}°</span></div>
            <div>∠C: <span className="font-bold text-foreground">{results.anglesDeg.C.toFixed(1)}°</span></div>
          </div>
        </div>

        {/* Area & Radii */}
        <div className="grid grid-cols-3 gap-2 bg-muted/60 border border-border rounded-2xl p-3 text-center text-xs">
          <div>
            <span className="text-[9px] font-bold uppercase text-muted-foreground block">Area (Heron)</span>
            <span className="font-mono font-black text-primary text-xs">{results.area.toFixed(0)} px²</span>
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase text-muted-foreground block">Inradius r</span>
            <span className="font-mono font-black text-emerald-500 text-xs">{results.incenter.radius.toFixed(1)} px</span>
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase text-muted-foreground block">Circumradius R</span>
            <span className="font-mono font-black text-blue-500 text-xs">{results.circumcenter.radius.toFixed(1)} px</span>
          </div>
        </div>
      </div>
    </div>
  );
}
