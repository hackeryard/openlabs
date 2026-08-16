"use client";

import React, { useState, useRef, useCallback } from "react";
import { GeoPoint, GeoSegment, GeoCircle, ConstructionTool } from "./types";
import { distance, midpoint } from "./lib/geometryMath";
import {
  Compass,
  Sliders,
  Plus,
  Trash2,
  RotateCcw,
  Circle as CircleIcon,
  Minus,
  Maximize2,
  Share2,
} from "lucide-react";

export default function ConstructionStudioCanvas() {
  const [activeTool, setActiveTool] = useState<ConstructionTool>("select");

  // Geometric entities
  const [points, setPoints] = useState<GeoPoint[]>([
    { id: "A", label: "A", x: 180, y: 160, color: "#3b82f6" },
    { id: "B", label: "B", x: 420, y: 160, color: "#ec4899" },
    { id: "C", label: "C", x: 300, y: 320, color: "#10b981" },
  ]);

  const [segments, setSegments] = useState<GeoSegment[]>([
    { id: "sAB", p1: "A", p2: "B", color: "#6366f1" },
    { id: "sBC", p1: "B", p2: "C", color: "#6366f1" },
    { id: "sCA", p1: "C", p2: "A", color: "#6366f1" },
  ]);

  const [circles, setCircles] = useState<GeoCircle[]>([
    { id: "c1", centerId: "A", radiusPointId: "B", color: "#3b82f6" },
  ]);

  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [segmentStartId, setSegmentStartId] = useState<string | null>(null);
  const [circleCenterId, setCircleCenterId] = useState<string | null>(null);
  const [draggingPointId, setDraggingPointId] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const width = 600;
  const height = 440;

  const screenToSvg = useCallback(
    (clientX: number, clientY: number) => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * width;
      const y = ((clientY - rect.top) / rect.height) * height;
      return {
        x: Math.max(20, Math.min(width - 20, Math.round(x))),
        y: Math.max(20, Math.min(height - 20, Math.round(y))),
      };
    },
    [width, height]
  );

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool === "point") {
      const { x, y } = screenToSvg(e.clientX, e.clientY);
      const nextLabel = String.fromCharCode(65 + (points.length % 26)) + (points.length >= 26 ? Math.floor(points.length / 26) : "");
      const newPoint: GeoPoint = {
        id: `p-${Date.now()}`,
        label: nextLabel,
        x,
        y,
        color: "#6366f1",
      };
      setPoints([...points, newPoint]);
    } else {
      setSelectedPointId(null);
      setSegmentStartId(null);
      setCircleCenterId(null);
    }
  };

  const handlePointClick = (e: React.MouseEvent, pt: GeoPoint) => {
    e.stopPropagation();

    if (activeTool === "delete") {
      setPoints(points.filter((p) => p.id !== pt.id));
      setSegments(segments.filter((s) => s.p1 !== pt.id && s.p2 !== pt.id));
      setCircles(circles.filter((c) => c.centerId !== pt.id && c.radiusPointId !== pt.id));
      return;
    }

    if (activeTool === "segment") {
      if (!segmentStartId) {
        setSegmentStartId(pt.id);
      } else if (segmentStartId !== pt.id) {
        const newSeg: GeoSegment = {
          id: `seg-${Date.now()}`,
          p1: segmentStartId,
          p2: pt.id,
          color: "#6366f1",
        };
        setSegments([...segments, newSeg]);
        setSegmentStartId(null);
      }
      return;
    }

    if (activeTool === "circle") {
      if (!circleCenterId) {
        setCircleCenterId(pt.id);
      } else if (circleCenterId !== pt.id) {
        const newCirc: GeoCircle = {
          id: `circ-${Date.now()}`,
          centerId: circleCenterId,
          radiusPointId: pt.id,
          color: "#3b82f6",
        };
        setCircles([...circles, newCirc]);
        setCircleCenterId(null);
      }
      return;
    }

    if (activeTool === "midpoint") {
      if (!segmentStartId) {
        setSegmentStartId(pt.id);
      } else if (segmentStartId !== pt.id) {
        const p1 = points.find((p) => p.id === segmentStartId);
        if (p1) {
          const mid = midpoint(p1, pt);
          const newPt: GeoPoint = {
            id: `mid-${Date.now()}`,
            label: `M${points.length + 1}`,
            x: Math.round(mid.x),
            y: Math.round(mid.y),
            color: "#f59e0b",
          };
          setPoints([...points, newPt]);
        }
        setSegmentStartId(null);
      }
      return;
    }

    setSelectedPointId(pt.id);
  };

  const handlePointerDownPoint = (e: React.PointerEvent, ptId: string) => {
    if (activeTool === "select") {
      e.stopPropagation();
      setDraggingPointId(ptId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingPointId) return;
    const { x, y } = screenToSvg(e.clientX, e.clientY);
    setPoints(points.map((p) => (p.id === draggingPointId ? { ...p, x, y } : p)));
  };

  const handlePointerUp = () => {
    setDraggingPointId(null);
  };

  const handleReset = () => {
    setPoints([
      { id: "A", label: "A", x: 180, y: 160, color: "#3b82f6" },
      { id: "B", label: "B", x: 420, y: 160, color: "#ec4899" },
      { id: "C", label: "C", x: 300, y: 320, color: "#10b981" },
    ]);
    setSegments([
      { id: "sAB", p1: "A", p2: "B", color: "#6366f1" },
      { id: "sBC", p1: "B", p2: "C", color: "#6366f1" },
      { id: "sCA", p1: "C", p2: "A", color: "#6366f1" },
    ]);
    setCircles([{ id: "c1", centerId: "A", radiusPointId: "B", color: "#3b82f6" }]);
    setSelectedPointId(null);
    setSegmentStartId(null);
    setCircleCenterId(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: SVG Interactive Construction Canvas (7 cols) */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Geometry Construction Studio
            </span>
          </div>

          {/* Construction Tools */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl border border-border flex-wrap">
            <button
              onClick={() => setActiveTool("select")}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                activeTool === "select"
                  ? "bg-primary text-primary-foreground shadow-sm font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Select / Move
            </button>

            <button
              onClick={() => setActiveTool("point")}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                activeTool === "point"
                  ? "bg-primary text-primary-foreground shadow-sm font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              + Point
            </button>

            <button
              onClick={() => setActiveTool("segment")}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                activeTool === "segment"
                  ? "bg-primary text-primary-foreground shadow-sm font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              + Segment
            </button>

            <button
              onClick={() => setActiveTool("circle")}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                activeTool === "circle"
                  ? "bg-primary text-primary-foreground shadow-sm font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              + Circle
            </button>

            <button
              onClick={() => setActiveTool("midpoint")}
              className={`px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                activeTool === "midpoint"
                  ? "bg-primary text-primary-foreground shadow-sm font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Midpoint
            </button>

            <button
              onClick={() => setActiveTool("delete")}
              className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTool === "delete"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Delete Element"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Action prompt banner */}
        {(segmentStartId || circleCenterId) && (
          <div className="bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-3 py-1.5 rounded-xl mb-2 flex items-center gap-1.5 animate-pulse">
            {segmentStartId && <span>Click second point to finish segment.</span>}
            {circleCenterId && <span>Click point on circumference to define radius.</span>}
          </div>
        )}

        {/* SVG Canvas */}
        <div className="flex-1 flex items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 overflow-hidden relative select-none">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full max-h-[440px] cursor-crosshair touch-none"
            onClick={handleCanvasClick}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Grid Lines */}
            <defs>
              <pattern id="geo-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={width} height={height} fill="url(#geo-grid)" />

            {/* Circles */}
            {circles.map((circ) => {
              const center = points.find((p) => p.id === circ.centerId);
              const radPoint = points.find((p) => p.id === circ.radiusPointId);
              if (!center) return null;
              const rad = radPoint ? distance(center, radPoint) : circ.radius || 80;

              return (
                <circle
                  key={circ.id}
                  cx={center.x}
                  cy={center.y}
                  r={rad}
                  fill={circ.color || "#3b82f6"}
                  fillOpacity="0.08"
                  stroke={circ.color || "#3b82f6"}
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              );
            })}

            {/* Segments */}
            {segments.map((seg) => {
              const p1 = points.find((p) => p.id === seg.p1);
              const p2 = points.find((p) => p.id === seg.p2);
              if (!p1 || !p2) return null;

              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;
              const len = distance(p1, p2).toFixed(1);

              return (
                <g key={seg.id}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={seg.color || "#6366f1"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect x="-14" y="-8" width="28" height="16" rx="4" fill="currentColor" className="fill-card stroke-border stroke-[1]" />
                    <text y="3.5" textAnchor="middle" className="fill-foreground font-mono text-[9px] font-bold">
                      {len}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Points */}
            {points.map((pt) => {
              const isSelected = selectedPointId === pt.id;
              const isStart = segmentStartId === pt.id || circleCenterId === pt.id;

              return (
                <g
                  key={pt.id}
                  transform={`translate(${pt.x}, ${pt.y})`}
                  onClick={(e) => handlePointClick(e, pt)}
                  onPointerDown={(e) => handlePointerDownPoint(e, pt.id)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  {(isSelected || isStart) && (
                    <circle
                      r="18"
                      fill="none"
                      stroke={isStart ? "#f59e0b" : "#6366f1"}
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="animate-spin"
                      style={{ animationDuration: "6s" }}
                    />
                  )}
                  <circle
                    r="12"
                    fill={pt.color || "#6366f1"}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-transform hover:scale-125 shadow-sm"
                  />
                  <text y="4" textAnchor="middle" className="fill-white font-mono text-[10px] font-black pointer-events-none">
                    {pt.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Metric strip */}
        <div className="grid grid-cols-3 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs mt-2">
          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">Points Count</span>
            <span className="font-mono font-black text-primary text-sm">{points.length}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">Segments Count</span>
            <span className="font-mono font-black text-foreground text-sm">{segments.length}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">Circles Count</span>
            <span className="font-mono font-black text-foreground text-sm">{circles.length}</span>
          </div>
        </div>
      </div>

      {/* ── Right: Entity Inspector & Construction Table (5 cols) */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Construction Element Inspector
            </span>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all"
            title="Reset Triangle Construction"
          >
            <RotateCcw size={13} />
          </button>
        </div>

        {/* Points Table */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground block">
            Constructed Points Coordinates
          </span>
          <div className="max-h-[160px] overflow-y-auto space-y-1 font-mono text-xs pr-1">
            {points.map((p) => (
              <div
                key={p.id}
                className={`p-2 rounded-xl flex items-center justify-between transition-all ${
                  selectedPointId === p.id ? "bg-primary/15 border border-primary/30 font-black text-primary" : "bg-muted text-foreground"
                }`}
              >
                <span className="font-bold">Point {p.label}</span>
                <span className="text-muted-foreground text-[11px]">({p.x}, {p.y})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Segments Readout */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <span className="text-xs font-bold text-foreground block">
            Segment Lengths (Euclidean Distance)
          </span>
          <div className="max-h-[140px] overflow-y-auto space-y-1 font-mono text-xs pr-1">
            {segments.map((s) => {
              const p1 = points.find((p) => p.id === s.p1);
              const p2 = points.find((p) => p.id === s.p2);
              const len = p1 && p2 ? distance(p1, p2).toFixed(2) : "0";

              return (
                <div key={s.id} className="p-2 bg-muted/60 rounded-xl flex justify-between">
                  <span className="font-bold text-foreground">
                    Segment {p1?.label || "?"}{p2?.label || "?"}
                  </span>
                  <span className="text-primary font-bold">{len} px</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
