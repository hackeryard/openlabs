"use client";

import React, { useState, useMemo, useEffect } from "react";
import { GraphData, PathAlgorithm, PathStep } from "./types";
import {
  generateDijkstraSteps,
  generateBFSSteps,
  generateBellmanFordSteps,
} from "./lib/graphMath";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sliders,
  MapPin,
} from "lucide-react";

interface ShortestPathCanvasProps {
  graph: GraphData;
  onPathCalculated?: () => void;
}

export default function ShortestPathCanvas({
  graph,
  onPathCalculated,
}: ShortestPathCanvasProps) {
  const [algorithm, setAlgorithm] = useState<PathAlgorithm>("dijkstra");
  const [startNodeId, setStartNodeId] = useState<string>(() => graph.nodes[0]?.id || "S");
  const [targetNodeId, setTargetNodeId] = useState<string>(
    () => graph.nodes[graph.nodes.length - 1]?.id || "T"
  );
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeedMs, setPlaySpeedMs] = useState<number>(700);

  // Sync default node IDs
  useEffect(() => {
    if (graph.nodes.length > 0) {
      if (!graph.nodes.some((n) => n.id === startNodeId)) {
        setStartNodeId(graph.nodes[0].id);
      }
      if (!graph.nodes.some((n) => n.id === targetNodeId)) {
        setTargetNodeId(graph.nodes[graph.nodes.length - 1].id);
      }
    }
  }, [graph.nodes, startNodeId, targetNodeId]);

  // Generate step sequence
  const steps: PathStep[] = useMemo(() => {
    if (!startNodeId || !targetNodeId || graph.nodes.length === 0) return [];
    switch (algorithm) {
      case "bfs":
        return generateBFSSteps(graph, startNodeId, targetNodeId);
      case "bellman_ford":
        return generateBellmanFordSteps(graph, startNodeId, targetNodeId);
      case "dijkstra":
      default:
        return generateDijkstraSteps(graph, startNodeId, targetNodeId);
    }
  }, [graph, algorithm, startNodeId, targetNodeId]);

  const currentStep: PathStep | undefined = steps[stepIndex] || steps[0];

  // Auto playback loop
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStepIndex((idx) => {
        if (idx < steps.length - 1) {
          return idx + 1;
        } else {
          setIsPlaying(false);
          onPathCalculated?.();
          return idx;
        }
      });
    }, playSpeedMs);
    return () => clearInterval(timer);
  }, [isPlaying, playSpeedMs, steps.length, onPathCalculated]);

  // Reconstruct path
  const shortestPathEdgeIds = useMemo(() => {
    if (!currentStep) return new Set<string>();
    const pathEdges = new Set<string>();
    let curr = targetNodeId;

    while (curr && currentStep.previousNodes[curr]) {
      const prev = currentStep.previousNodes[curr]!;
      const edge = graph.edges.find(
        (e) =>
          (e.source === prev && e.target === curr) ||
          (!e.isDirected && e.source === curr && e.target === prev)
      );
      if (edge) pathEdges.add(edge.id);
      curr = prev;
    }

    return pathEdges;
  }, [currentStep, targetNodeId, graph.edges]);

  const width = 600;
  const height = 440;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: SVG Pathfinding Canvas (7 cols) ───────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary truncate max-w-[280px]">
              {algorithm === "dijkstra" ? "Dijkstra" : algorithm === "bfs" ? "BFS" : "Bellman-Ford"} ({startNodeId} → {targetNodeId})
            </span>
          </div>

          {/* Stepper controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              disabled={stepIndex === 0}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border disabled:opacity-40 text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Step Back"
            >
              <ChevronLeft size={13} />
            </button>

            <button
              onClick={() => setIsPlaying((p) => !p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                isPlaying
                  ? "bg-amber-500 text-white"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? "Pause" : "Play Trace"}</span>
            </button>

            <button
              onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
              disabled={stepIndex >= steps.length - 1}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border disabled:opacity-40 text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Step Forward"
            >
              <ChevronRight size={13} />
            </button>

            <button
              onClick={() => {
                setStepIndex(0);
                setIsPlaying(false);
              }}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Reset Steps"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* Step Banner */}
        {currentStep && (
          <div className="bg-muted/50 border border-border rounded-2xl p-2.5 mb-2 text-xs flex items-center justify-between">
            <span className="font-medium text-foreground truncate max-w-[420px]">
              {currentStep.description}
            </span>
            <span className="font-mono text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
              Step {stepIndex + 1}/{steps.length}
            </span>
          </div>
        )}

        {/* SVG Canvas */}
        <div className="flex-1 flex items-center justify-center min-h-[320px] bg-muted/20 rounded-2xl border border-border/50 overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-h-[440px] select-none">
            <defs>
              <clipPath id="path-clip-cs">
                <rect x="0" y="0" width={width} height={height} rx="20" ry="20" />
              </clipPath>
              <marker
                id="arrow-path-cs"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
              </marker>
            </defs>

            <g clipPath="url(#path-clip-cs)">
              {/* Edges */}
              {graph.edges.map((edge) => {
                const u = graph.nodes.find((n) => n.id === edge.source);
                const v = graph.nodes.find((n) => n.id === edge.target);
                if (!u || !v) return null;

                const isShortestPath = shortestPathEdgeIds.has(edge.id);
                const isActiveScanning = currentStep?.activeEdgeId === edge.id;

                const midX = (u.x + v.x) / 2;
                const midY = (u.y + v.y) / 2;

                return (
                  <g key={edge.id}>
                    <line
                      x1={u.x}
                      y1={u.y}
                      x2={v.x}
                      y2={v.y}
                      stroke={
                        isShortestPath
                          ? "#f59e0b"
                          : isActiveScanning
                          ? "#06b6d4"
                          : "currentColor"
                      }
                      strokeOpacity={isShortestPath ? 1 : isActiveScanning ? 0.9 : 0.25}
                      strokeWidth={isShortestPath ? 4.5 : isActiveScanning ? 3.5 : 2}
                      markerEnd={edge.isDirected ? "url(#arrow-path-cs)" : undefined}
                      strokeLinecap="round"
                    />

                    {/* Weight badge */}
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-12"
                        y="-9"
                        width="24"
                        height="18"
                        rx="6"
                        fill="currentColor"
                        className={`${
                          isShortestPath
                            ? "fill-amber-500 stroke-amber-300"
                            : isActiveScanning
                            ? "fill-cyan-500 stroke-cyan-300"
                            : "fill-card stroke-border"
                        } stroke-[1.5]`}
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        className={`font-mono text-[10px] font-black ${
                          isShortestPath || isActiveScanning ? "fill-white" : "fill-foreground"
                        }`}
                      >
                        {edge.weight}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Nodes */}
              {graph.nodes.map((node) => {
                const isStart = node.id === startNodeId;
                const isTarget = node.id === targetNodeId;
                const isCurrent = currentStep?.currentNodeId === node.id;
                const isVisited = currentStep?.visitedNodes.includes(node.id);
                const dist = currentStep?.distances[node.id];

                return (
                  <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                    {isCurrent && (
                      <circle
                        r="20"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                        className="animate-spin"
                        style={{ animationDuration: "5s" }}
                      />
                    )}

                    <circle
                      r="14"
                      fill={
                        isCurrent
                          ? "#f59e0b"
                          : isTarget
                          ? "#ec4899"
                          : isStart
                          ? "#10b981"
                          : isVisited
                          ? "#6366f1"
                          : "#64748b"
                      }
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />

                    <text
                      y="4"
                      textAnchor="middle"
                      className="fill-white font-mono text-[11px] font-black pointer-events-none"
                    >
                      {node.label}
                    </text>

                    {/* Distance label floating above node */}
                    <text
                      y="-18"
                      textAnchor="middle"
                      className="fill-foreground font-mono text-[10px] font-black"
                    >
                      {dist === Infinity ? "∞" : dist !== undefined ? `d=${dist}` : ""}
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
            <span className="text-[10px] font-bold uppercase text-emerald-500 block">
              Start Node (S)
            </span>
            <span className="font-mono font-black text-foreground text-sm">
              {startNodeId}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-pink-500 block">
              Target Node (T)
            </span>
            <span className="font-mono font-black text-foreground text-sm">
              {targetNodeId}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-amber-500 block">
              Shortest Distance
            </span>
            <span className="font-mono font-black text-amber-500 text-sm">
              {currentStep && currentStep.distances[targetNodeId] !== Infinity
                ? currentStep.distances[targetNodeId]
                : "No path"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: Algorithm Selector & Distance Table (5 cols) ─ */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Routing Algorithm & Queue
            </span>
          </div>
        </div>

        {/* Algorithm Choices */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground block">
            Algorithm Choice
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
            {(
              [
                ["dijkstra", "Dijkstra"],
                ["bfs", "BFS (Hops)"],
                ["bellman_ford", "Bellman-Ford"],
              ] as [PathAlgorithm, string][]
            ).map(([algo, label]) => (
              <button
                key={algo}
                onClick={() => {
                  setAlgorithm(algo);
                  setStepIndex(0);
                  setIsPlaying(false);
                }}
                className={`py-2 px-1 rounded-xl text-center transition-all ${
                  algorithm === algo
                    ? "bg-primary text-primary-foreground shadow-sm font-black"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Start / Target Pickers */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-500 block">Start Vertex (S)</label>
            <select
              value={startNodeId}
              onChange={(e) => {
                setStartNodeId(e.target.value);
                setStepIndex(0);
                setIsPlaying(false);
              }}
              className="w-full p-2.5 rounded-xl bg-muted border border-border text-foreground font-mono text-xs font-bold"
            >
              {graph.nodes.map((n) => (
                <option key={`start-${n.id}`} value={n.id}>
                  Node {n.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-pink-500 block">Target Vertex (T)</label>
            <select
              value={targetNodeId}
              onChange={(e) => {
                setTargetNodeId(e.target.value);
                setStepIndex(0);
                setIsPlaying(false);
              }}
              className="w-full p-2.5 rounded-xl bg-muted border border-border text-foreground font-mono text-xs font-bold"
            >
              {graph.nodes.map((n) => (
                <option key={`target-${n.id}`} value={n.id}>
                  Node {n.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Playback speed slider */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">Animation Step Interval</span>
            <span className="font-mono text-primary">{playSpeedMs}ms</span>
          </div>
          <input
            type="range"
            min="200"
            max="1500"
            step="100"
            value={playSpeedMs}
            onChange={(e) => setPlaySpeedMs(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Distance Table */}
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Distance Table (dist[v] & Prev[v])
          </span>

          <div className="max-h-[170px] overflow-y-auto space-y-1 pr-1 font-mono text-xs">
            {graph.nodes.map((n) => {
              const dist = currentStep?.distances[n.id];
              const prev = currentStep?.previousNodes[n.id];
              const isVisited = currentStep?.visitedNodes.includes(n.id);

              return (
                <div
                  key={`dist-row-${n.id}`}
                  className={`p-2 rounded-xl flex items-center justify-between transition-all ${
                    n.id === currentStep?.currentNodeId
                      ? "bg-amber-500/15 border border-amber-500/30 text-amber-500 font-black"
                      : isVisited
                      ? "bg-muted text-foreground"
                      : "bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <span className="font-bold">Node {n.label}</span>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span>dist: {dist === Infinity ? "∞" : dist}</span>
                    <span className="text-muted-foreground">prev: {prev || "—"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
