"use client";

import React, { useState, useMemo } from "react";
import { GraphData, ColoringResult } from "./types";
import { computeGraphColoring, COLOR_PALETTE } from "./lib/graphMath";
import {
  Palette,
  Sliders,
  BookOpen,
  RotateCcw,
  MousePointer,
} from "lucide-react";

interface GraphColoringCanvasProps {
  graph: GraphData;
  onColoringComputed?: () => void;
}

export default function GraphColoringCanvas({
  graph,
  onColoringComputed,
}: GraphColoringCanvasProps) {
  const [manualColorMap, setManualColorMap] = useState<Record<string, string>>({});
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_PALETTE[0]);

  // Compute coloring (auto or manual)
  const coloring: ColoringResult = useMemo(() => {
    if (isManualMode && Object.keys(manualColorMap).length > 0) {
      return computeGraphColoring(graph, manualColorMap);
    }
    const autoRes = computeGraphColoring(graph);
    onColoringComputed?.();
    return autoRes;
  }, [graph, isManualMode, manualColorMap, onColoringComputed]);

  const handleNodeClick = (nodeId: string) => {
    if (isManualMode) {
      setManualColorMap((prev) => ({
        ...prev,
        [nodeId]: selectedColor,
      }));
    }
  };

  const handleResetColoring = () => {
    setManualColorMap({});
    setIsManualMode(false);
  };

  const conflictSet = useMemo(() => new Set(coloring.conflicts), [coloring.conflicts]);
  const width = 600;
  const height = 440;

  const colorClasses: Record<string, string[]> = useMemo(() => {
    const map: Record<string, string[]> = {};
    graph.nodes.forEach((n) => {
      const color = coloring.colorMap[n.id] || "#6366f1";
      if (!map[color]) map[color] = [];
      map[color].push(n.label);
    });
    return map;
  }, [graph.nodes, coloring.colorMap]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: SVG Colored Graph Canvas (7 cols) ─────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Vertex Coloring (χ(G) = {coloring.chromaticNumber})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setIsManualMode((m) => !m);
                if (!isManualMode) setManualColorMap({});
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isManualMode
                  ? "bg-primary text-primary-foreground shadow-sm font-black"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {isManualMode ? "Manual: ON" : "Auto Mode"}
            </button>

            <button
              onClick={handleResetColoring}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Reset Colors"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* Conflict Alert Banner */}
        {coloring.conflicts.length > 0 && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-2xl p-2.5 mb-2 text-xs flex items-center justify-between font-bold animate-pulse">
            <span>Conflict Detected! {coloring.conflicts.length} edge(s) connect vertices with the same color!</span>
          </div>
        )}

        {/* SVG Canvas */}
        <div className="flex-1 flex items-center justify-center min-h-[320px] bg-muted/20 rounded-2xl border border-border/50 overflow-hidden relative">
          {isManualMode && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-black px-2.5 py-1 rounded-xl shadow-md z-10 flex items-center gap-1">
              <MousePointer size={11} />
              <span>Click nodes to apply selected swatch</span>
            </div>
          )}

          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-h-[440px] select-none">
            <defs>
              <clipPath id="color-clip-cs">
                <rect x="0" y="0" width={width} height={height} rx="20" ry="20" />
              </clipPath>
            </defs>

            <g clipPath="url(#color-clip-cs)">
              {/* Edges */}
              {graph.edges.map((edge) => {
                const u = graph.nodes.find((n) => n.id === edge.source);
                const v = graph.nodes.find((n) => n.id === edge.target);
                if (!u || !v) return null;

                const hasConflict = conflictSet.has(edge.id);

                return (
                  <line
                    key={edge.id}
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke={hasConflict ? "#ef4444" : "currentColor"}
                    strokeOpacity={hasConflict ? 1 : 0.4}
                    strokeWidth={hasConflict ? 4.5 : 2.5}
                    strokeDasharray={hasConflict ? "5 3" : undefined}
                  />
                );
              })}

              {/* Nodes */}
              {graph.nodes.map((node) => {
                const nodeColor = coloring.colorMap[node.id] || "#6366f1";

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => handleNodeClick(node.id)}
                    className={isManualMode ? "cursor-pointer" : undefined}
                  >
                    <circle
                      r="16"
                      fill={nodeColor}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="transition-all hover:scale-110 shadow-lg"
                    />
                    <text
                      y="4"
                      textAnchor="middle"
                      className="fill-white font-mono text-[11px] font-black pointer-events-none"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Metric strip */}
        <div className="grid grid-cols-3 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs mt-2">
          <div>
            <span className="text-[10px] font-bold uppercase text-primary block">
              Colors Used (χ)
            </span>
            <span className="font-mono font-black text-primary text-base">
              {coloring.chromaticNumber} Colors
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Valid Coloring?
            </span>
            <span
              className={`font-mono font-bold text-xs ${
                coloring.conflicts.length === 0 ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {coloring.conflicts.length === 0 ? "Proper (0 Conflicts)" : `${coloring.conflicts.length} Conflicts!`}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Bipartite 2-Colorable?
            </span>
            <span className="font-mono font-bold text-foreground text-sm">
              {coloring.isBipartite ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: Color Palette & Partitions (5 cols) ──────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Palette & Independent Sets
            </span>
          </div>
        </div>

        {/* Swatches for manual coloring */}
        {isManualMode && (
          <div className="space-y-1.5 p-3 rounded-2xl bg-muted/40 border border-border">
            <span className="text-xs font-bold text-foreground block">
              Choose Color Swatch to Paint
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PALETTE.map((hex) => (
                <button
                  key={hex}
                  onClick={() => setSelectedColor(hex)}
                  className={`w-7 h-7 rounded-full transition-transform shadow-sm ${
                    selectedColor === hex ? "scale-125 ring-2 ring-foreground" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Independent Color Classes */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-foreground block">
            Independent Vertex Partitions
          </span>

          <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
            {Object.entries(colorClasses).map(([colorHex, nodeLabels], idx) => (
              <div
                key={`color-class-${idx}`}
                className="p-2.5 bg-muted/50 border border-border rounded-2xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-4 h-4 rounded-full shadow-sm shrink-0"
                    style={{ backgroundColor: colorHex }}
                  />
                  <span className="font-bold text-foreground">Color Class {idx + 1}</span>
                </div>
                <span className="font-mono font-bold text-primary">
                  [{nodeLabels.join(", ")}]
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Four Color Theorem Card */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl text-xs space-y-1.5">
          <h4 className="font-bold text-foreground flex items-center gap-1.5">
            <BookOpen size={14} className="text-primary" />
            <span>The Four Color Theorem</span>
          </h4>
          <p className="text-muted-foreground">
            Any planar graph (a graph that can be drawn on a plane without crossing edges) requires <strong>at most 4 colors</strong> to properly color its vertices:
          </p>
          <div className="font-mono text-xs font-bold text-primary bg-background/60 p-2 rounded-xl text-center border border-border/80">
            χ(G) ≤ 4  (for planar G)
          </div>
        </div>
      </div>
    </div>
  );
}
