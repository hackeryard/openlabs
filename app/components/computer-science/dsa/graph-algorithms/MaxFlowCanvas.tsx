"use client";

import React, { useState, useMemo, useEffect } from "react";
import { GraphData, FlowStep } from "./types";
import { generateMaxFlowSteps } from "./lib/graphMath";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Waves,
} from "lucide-react";

interface MaxFlowCanvasProps {
  graph: GraphData;
  onFlowComputed?: () => void;
}

export default function MaxFlowCanvas({
  graph,
  onFlowComputed,
}: MaxFlowCanvasProps) {
  const [sourceId, setSourceId] = useState<string>(() => graph.nodes[0]?.id || "Source");
  const [sinkId, setSinkId] = useState<string>(
    () => graph.nodes[graph.nodes.length - 1]?.id || "Sink"
  );
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeedMs, setPlaySpeedMs] = useState<number>(800);

  // Sync default node IDs
  useEffect(() => {
    if (graph.nodes.length > 0) {
      if (!graph.nodes.some((n) => n.id === sourceId)) {
        setSourceId(graph.nodes[0].id);
      }
      if (!graph.nodes.some((n) => n.id === sinkId)) {
        setSinkId(graph.nodes[graph.nodes.length - 1].id);
      }
    }
  }, [graph.nodes, sourceId, sinkId]);

  const steps: FlowStep[] = useMemo(() => {
    if (!sourceId || !sinkId || graph.nodes.length === 0) return [];
    return generateMaxFlowSteps(graph, sourceId, sinkId);
  }, [graph, sourceId, sinkId]);

  const currentStep: FlowStep | undefined = steps[stepIndex] || steps[0];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStepIndex((idx) => {
        if (idx < steps.length - 1) {
          return idx + 1;
        } else {
          setIsPlaying(false);
          onFlowComputed?.();
          return idx;
        }
      });
    }, playSpeedMs);
    return () => clearInterval(timer);
  }, [isPlaying, playSpeedMs, steps.length, onFlowComputed]);

  const augmentingEdgeSet = useMemo(
    () => new Set(currentStep?.augmentingEdgeIds || []),
    [currentStep]
  );

  const width = 600;
  const height = 440;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: SVG Network Flow Canvas (7 cols) ─────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Waves size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Ford-Fulkerson Max Flow (Max: {currentStep?.currentMaxFlow || 0})
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
              <span>{isPlaying ? "Pause" : "Augment Flow"}</span>
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
              <clipPath id="flow-clip-cs">
                <rect x="0" y="0" width={width} height={height} rx="20" ry="20" />
              </clipPath>
              <marker
                id="arrow-flow-cs"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
              </marker>
            </defs>

            <g clipPath="url(#flow-clip-cs)">
              {/* Edges */}
              {graph.edges.map((edge) => {
                const u = graph.nodes.find((n) => n.id === edge.source);
                const v = graph.nodes.find((n) => n.id === edge.target);
                if (!u || !v) return null;

                const isAugmenting = augmentingEdgeSet.has(edge.id);
                const cap = edge.capacity || edge.weight || 5;

                const midX = (u.x + v.x) / 2;
                const midY = (u.y + v.y) / 2;

                return (
                  <g key={edge.id}>
                    <line
                      x1={u.x}
                      y1={u.y}
                      x2={v.x}
                      y2={v.y}
                      stroke={isAugmenting ? "#06b6d4" : "currentColor"}
                      strokeOpacity={isAugmenting ? 1 : 0.3}
                      strokeWidth={isAugmenting ? 4.5 : 2.5}
                      markerEnd="url(#arrow-flow-cs)"
                    />

                    {/* Capacity badge */}
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-16"
                        y="-9"
                        width="32"
                        height="18"
                        rx="6"
                        fill="currentColor"
                        className={`${
                          isAugmenting ? "fill-cyan-500 stroke-cyan-300" : "fill-card stroke-border"
                        } stroke-[1.5]`}
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        className={`font-mono text-[10px] font-black ${
                          isAugmenting ? "fill-white" : "fill-foreground"
                        }`}
                      >
                        cap:{cap}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Nodes */}
              {graph.nodes.map((node) => {
                const isSource = node.id === sourceId;
                const isSink = node.id === sinkId;
                const inPath = currentStep?.augmentingPath.includes(node.id);

                return (
                  <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                    <circle
                      r="16"
                      fill={isSource ? "#10b981" : isSink ? "#ec4899" : inPath ? "#06b6d4" : "#6366f1"}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="transition-transform hover:scale-110 shadow-lg"
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
            <span className="text-[10px] font-bold uppercase text-emerald-500 block">
              Source (Src)
            </span>
            <span className="font-mono font-black text-foreground text-sm">
              {sourceId}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-pink-500 block">
              Sink (Snk)
            </span>
            <span className="font-mono font-black text-foreground text-sm">
              {sinkId}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-cyan-500 block">
              Maximum Network Flow
            </span>
            <span className="font-mono font-black text-cyan-500 text-base">
              {currentStep?.currentMaxFlow || 0} Units
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: Flow Settings & Augmenting Path Log (5 cols) */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Network Flow Settings
            </span>
          </div>
        </div>

        {/* Source / Sink selectors */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-500 block">Source Node (S)</label>
            <select
              value={sourceId}
              onChange={(e) => {
                setSourceId(e.target.value);
                setStepIndex(0);
                setIsPlaying(false);
              }}
              className="w-full p-2.5 rounded-xl bg-muted border border-border text-foreground font-mono text-xs font-bold"
            >
              {graph.nodes.map((n) => (
                <option key={`src-${n.id}`} value={n.id}>
                  Node {n.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-pink-500 block">Sink Node (T)</label>
            <select
              value={sinkId}
              onChange={(e) => {
                setSinkId(e.target.value);
                setStepIndex(0);
                setIsPlaying(false);
              }}
              className="w-full p-2.5 rounded-xl bg-muted border border-border text-foreground font-mono text-xs font-bold"
            >
              {graph.nodes.map((n) => (
                <option key={`snk-${n.id}`} value={n.id}>
                  Node {n.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Playback speed slider */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">Step Speed</span>
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

        {/* Augmenting Paths History */}
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Augmenting Path History
          </span>

          <div className="max-h-[190px] overflow-y-auto space-y-1 pr-1 font-mono text-xs">
            {steps.map((st, idx) => {
              const isCurrent = idx === stepIndex;
              return (
                <div
                  key={`flow-step-${idx}`}
                  onClick={() => setStepIndex(idx)}
                  className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    isCurrent
                      ? "bg-primary text-primary-foreground font-black shadow-sm"
                      : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="text-[11px] truncate max-w-[240px]">
                    {idx + 1}. {st.description}
                  </span>
                  <span className="text-[10px] opacity-80 shrink-0">Flow={st.currentMaxFlow}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
