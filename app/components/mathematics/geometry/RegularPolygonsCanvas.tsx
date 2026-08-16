"use client";

import React, { useState, useMemo } from "react";
import { generateRegularPolygonVertices } from "./lib/geometryMath";
import {
  Hexagon,
  Sliders,
  Sparkles,
  Layers,
} from "lucide-react";

export default function RegularPolygonsCanvas() {
  const [numSides, setNumSides] = useState<number>(6);
  const [radius, setRadius] = useState<number>(130);
  const [showTriangulation, setShowTriangulation] = useState<boolean>(true);
  const [showApothem, setShowApothem] = useState<boolean>(true);

  const cx = 300;
  const cy = 220;

  const vertices = useMemo(
    () => generateRegularPolygonVertices(numSides, radius, cx, cy),
    [numSides, radius, cx, cy]
  );

  const polygonPointsStr = vertices.map((v) => `${v.x},${v.y}`).join(" ");

  // Geometric Formulas
  const interiorAngle = ((numSides - 2) * 180) / numSides;
  const exteriorAngle = 360 / numSides;
  const sideLength = 2 * radius * Math.sin(Math.PI / numSides);
  const apothem = radius * Math.cos(Math.PI / numSides);
  const perimeter = numSides * sideLength;
  const area = 0.5 * numSides * radius * radius * Math.sin((2 * Math.PI) / numSides);

  const polygonNames: Record<number, string> = {
    3: "Equilateral Triangle",
    4: "Square (Tetragon)",
    5: "Regular Pentagon",
    6: "Regular Hexagon",
    7: "Regular Heptagon",
    8: "Regular Octagon",
    9: "Regular Nonagon",
    10: "Regular Decagon",
    11: "Regular Hendecagon",
    12: "Regular Dodecagon",
    16: "Regular Hexadecagon",
  };

  const polygonName = polygonNames[numSides] || `Regular ${numSides}-gon`;

  // Apothem midpoint
  const apothemMid = {
    x: (vertices[0].x + vertices[1].x) / 2,
    y: (vertices[0].y + vertices[1].y) / 2,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: SVG Polygon Canvas (7 cols) ────────────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Hexagon size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              {polygonName} (n = {numSides})
            </span>
          </div>

          <div className="flex items-center gap-1">
            {[3, 4, 5, 6, 8, 12].map((n) => (
              <button
                key={n}
                onClick={() => setNumSides(n)}
                className={`w-7 h-7 rounded-xl text-xs font-bold transition-all ${
                  numSides === n
                    ? "bg-primary text-primary-foreground font-black shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Canvas */}
        <div className="flex-1 flex items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 overflow-hidden relative select-none">
          <svg viewBox="0 0 600 440" className="w-full h-full max-h-[440px]">
            {/* Circumscribed circle */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />

            {/* Triangulation sectors from center */}
            {showTriangulation &&
              vertices.map((v, i) => (
                <line
                  key={`tri-sector-${i}`}
                  x1={cx}
                  y1={cy}
                  x2={v.x}
                  y2={v.y}
                  stroke="#3b82f6"
                  strokeWidth="1"
                  strokeDasharray="3 2"
                  strokeOpacity="0.6"
                />
              ))}

            {/* Inscribed Polygon */}
            <polygon
              points={polygonPointsStr}
              fill="#6366f1"
              fillOpacity="0.2"
              stroke="#6366f1"
              strokeWidth="3"
            />

            {/* Apothem Line */}
            {showApothem && (
              <g>
                <line
                  x1={cx}
                  y1={cy}
                  x2={apothemMid.x}
                  y2={apothemMid.y}
                  stroke="#ec4899"
                  strokeWidth="2.5"
                />
                <circle cx={apothemMid.x} cy={apothemMid.y} r="4" fill="#ec4899" />
                <text
                  x={(cx + apothemMid.x) / 2 + 10}
                  y={(cy + apothemMid.y) / 2}
                  className="fill-pink-500 font-mono text-[9px] font-black"
                >
                  a (Apothem)
                </text>
              </g>
            )}

            {/* Center node */}
            <circle cx={cx} cy={cy} r="5" fill="#6366f1" />

            {/* Vertices Badges */}
            {vertices.map((v, i) => (
              <g key={`poly-vert-${i}`} transform={`translate(${v.x}, ${v.y})`}>
                <circle r="8" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                <text y="3" textAnchor="middle" className="fill-white font-mono text-[8px] font-black">
                  {i + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2">
          <button
            onClick={() => setShowTriangulation(!showTriangulation)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
              showTriangulation
                ? "bg-primary text-primary-foreground border-primary font-black shadow-sm"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {showTriangulation ? "Triangulation Sectors: ON" : "Triangulation Sectors: OFF"}
          </button>

          <button
            onClick={() => setShowApothem(!showApothem)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
              showApothem
                ? "bg-primary text-primary-foreground border-primary font-black shadow-sm"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {showApothem ? "Apothem: ON" : "Apothem: OFF"}
          </button>
        </div>
      </div>

      {/* ── Right: Polygon Metrics & Formulas (5 cols) ──────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Polygon Metrics & Controls
            </span>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground">Number of Sides (n)</span>
              <span className="font-mono text-primary font-black">{numSides}</span>
            </div>
            <input
              type="range"
              min="3"
              max="16"
              step="1"
              value={numSides}
              onChange={(e) => setNumSides(Math.max(3, Math.min(16, parseInt(e.target.value, 10) || 3)))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground">Circumradius (r)</span>
              <span className="font-mono text-primary font-black">{radius} px</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              step="1"
              value={radius}
              onChange={(e) => setRadius(Math.max(50, Math.min(150, parseInt(e.target.value, 10) || 50)))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        {/* Angle Properties */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-3 bg-muted/50 rounded-2xl border border-border space-y-1">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">Interior Angle</span>
            <span className="font-black text-primary text-sm">{interiorAngle.toFixed(1)}°</span>
            <span className="text-[10px] text-muted-foreground block">(n - 2)·180° / n</span>
          </div>

          <div className="p-3 bg-muted/50 rounded-2xl border border-border space-y-1">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">Exterior Angle</span>
            <span className="font-black text-pink-500 text-sm">{exteriorAngle.toFixed(1)}°</span>
            <span className="text-[10px] text-muted-foreground block">360° / n</span>
          </div>
        </div>

        {/* Perimeter, Apothem, Area */}
        <div className="grid grid-cols-3 gap-2 bg-muted/60 border border-border rounded-2xl p-3 text-center text-xs">
          <div>
            <span className="text-[9px] font-bold uppercase text-muted-foreground block">Side (s)</span>
            <span className="font-mono font-black text-foreground text-xs">{sideLength.toFixed(1)} px</span>
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase text-muted-foreground block">Apothem (a)</span>
            <span className="font-mono font-black text-pink-500 text-xs">{apothem.toFixed(1)} px</span>
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase text-muted-foreground block">Exact Area</span>
            <span className="font-mono font-black text-primary text-xs">{area.toFixed(0)} px²</span>
          </div>
        </div>
      </div>
    </div>
  );
}
