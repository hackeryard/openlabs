"use client";

import React, { useState, useMemo, useEffect } from "react";
import { GraphData, MSTAlgorithm, MSTStep } from "./types";
import { generateKruskalSteps, generatePrimSteps } from "./lib/graphMath";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sliders,
  TreeDeciduous,
} from "lucide-react";

interface MSTCanvasProps {
  graph: GraphData;
  onMSTCalculated?: () => void;
}

export default function MSTCanvas({ graph, onMSTCalculated }: MSTCanvasProps) {
  const [algorithm, setAlgorithm] = useState<MSTAlgorithm>("kruskal");
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeedMs, setPlaySpeedMs] = useState<number>(700);

  // Generate steps based on algorithm
  const steps: MSTStep[] = useMemo(() => {
    if (graph.nodes.length === 0) return [];
    if (algorithm === "kruskal") {
      return generateKruskalSteps(graph);
    } else {
      const startId = graph.nodes[0].id;
      return generatePrimSteps(graph, startId);
    }
  }, [graph, algorithm]);

  const currentStep: MSTStep | undefined = steps[stepIndex] || steps[0];

  // Auto playback loop
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStepIndex((idx) => {
        if (idx < steps.length - 1) {
          return idx + 1;
        } else {
          setIsPlaying(false);
          onMSTCalculated?.();
          return idx;
        }
      });
    }, playSpeedMs);
    return () => clearInterval(timer);
  }, [isPlaying, playSpeedMs, steps.length, onMSTCalculated]);

  const acceptedSet = useMemo(
    () => new Set(currentStep?.acceptedEdgeIds || []),
    [currentStep]
  );
  const rejectedSet = useMemo(
    () => new Set(currentStep?.rejectedEdgeIds || []),
    [currentStep]
  );

  const width = 600;
  const height = 440;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: SVG MST Canvas (7 cols) ───────────────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <TreeDeciduous size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              {algorithm === "kruskal" ? "Kruskal's" : "Prim's"} Spanning Tree (Total Weight: {currentStep?.totalWeight || 0})
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
              <span>{isPlaying ? "Pause" : "Play MST"}</span>
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
              <clipPath id="mst-clip-cs">
                <rect x="0" y="0" width={width} height={height} rx="20" ry="20" />
              </clipPath>
            </defs>

            <g clipPath="url(#mst-clip-cs)">
              {/* Edges */}
              {graph.edges.map((edge) => {
                const u = graph.nodes.find((n) => n.id === edge.source);
                const v = graph.nodes.find((n) => n.id === edge.target);
                if (!u || !v) return null;

                const isAccepted = acceptedSet.has(edge.id);
                const isRejected = rejectedSet.has(edge.id);
                const isEvaluated = currentStep?.evaluatedEdgeId === edge.id;

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
                        isAccepted
                          ? "#10b981"
                          : isRejected
                          ? "#ef4444"
                          : isEvaluated
                          ? "#f59e0b"
                          : "currentColor"
                      }
                      strokeOpacity={isAccepted || isRejected || isEvaluated ? 1 : 0.25}
                      strokeWidth={isAccepted ? 4.5 : isEvaluated ? 3.5 : 2}
                      strokeDasharray={isRejected ? "4 3" : undefined}
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
                          isAccepted
                            ? "fill-emerald-500 stroke-emerald-300"
                            : isRejected
                            ? "fill-rose-500 stroke-rose-300"
                            : isEvaluated
                            ? "fill-amber-500 stroke-amber-300"
                            : "fill-card stroke-border"
                        } stroke-[1.5]`}
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        className={`font-mono text-[10px] font-black ${
                          isAccepted || isRejected || isEvaluated ? "fill-white" : "fill-foreground"
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
                const isInTree = currentStep?.visitedNodes.includes(node.id);

                return (
                  <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                    <circle
                      r="14"
                      fill={isInTree ? "#10b981" : "#6366f1"}
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
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Metric strip */}
        <div className="grid grid-cols-3 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs mt-2">
          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Tree Edges Count
            </span>
            <span className="font-mono font-black text-primary text-sm">
              {currentStep?.acceptedEdgeIds.length || 0} / {Math.max(0, graph.nodes.length - 1)}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-500 block">
              MST Total Weight
            </span>
            <span className="font-mono font-black text-emerald-500 text-sm">
              {currentStep?.totalWeight || 0}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-rose-500 block">
              Cycles Avoided
            </span>
            <span className="font-mono font-black text-rose-500 text-sm">
              {currentStep?.rejectedEdgeIds.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: Algorithm Controls & History (5 cols) ────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              MST Algorithm & Execution
            </span>
          </div>
        </div>

        {/* Algorithm Switcher */}
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            onClick={() => {
              setAlgorithm("kruskal");
              setStepIndex(0);
              setIsPlaying(false);
            }}
            className={`p-3 rounded-2xl text-left transition-all ${
              algorithm === "kruskal"
                ? "bg-primary text-primary-foreground shadow-md font-black"
                : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="block font-bold">Kruskal&apos;s Algorithm</span>
            <span className="text-[10px] font-normal opacity-80">Global edge sorting (DSU)</span>
          </button>

          <button
            onClick={() => {
              setAlgorithm("prim");
              setStepIndex(0);
              setIsPlaying(false);
            }}
            className={`p-3 rounded-2xl text-left transition-all ${
              algorithm === "prim"
                ? "bg-primary text-primary-foreground shadow-md font-black"
                : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="block font-bold">Prim&apos;s Algorithm</span>
            <span className="text-[10px] font-normal opacity-80">Cut property tree growth</span>
          </button>
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

        {/* Step Log History */}
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Algorithm Step History
          </span>

          <div className="max-h-[190px] overflow-y-auto space-y-1 pr-1 font-mono text-xs">
            {steps.map((st, idx) => {
              const isCurrent = idx === stepIndex;
              return (
                <div
                  key={`mst-step-${idx}`}
                  onClick={() => setStepIndex(idx)}
                  className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    isCurrent
                      ? "bg-primary text-primary-foreground font-black shadow-sm"
                      : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="text-[11px] truncate max-w-[260px]">
                    {idx + 1}. {st.description}
                  </span>
                  <span className="text-[10px] opacity-80 shrink-0">W={st.totalWeight}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
