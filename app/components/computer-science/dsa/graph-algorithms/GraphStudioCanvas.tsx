"use client";

import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { GraphData, GraphNode, GraphEdge, GraphPresetType } from "./types";
import {
  computeGraphInvariants,
  getGraphPreset,
  runForceDirectedSimulationStep,
} from "./lib/graphMath";
import {
  Sliders,
  Trash2,
  RotateCcw,
  Network,
  Table,
  Play,
  Pause,
} from "lucide-react";

interface GraphStudioCanvasProps {
  graph: GraphData;
  onChangeGraph: (g: GraphData) => void;
  onGraphModified?: () => void;
}

type StudioTool = "select" | "add_node" | "add_edge" | "delete";

export default function GraphStudioCanvas({
  graph,
  onChangeGraph,
  onGraphModified,
}: GraphStudioCanvasProps) {
  const [activeTool, setActiveTool] = useState<StudioTool>("select");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [edgeSourceNodeId, setEdgeSourceNodeId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [showAdjMatrix, setShowAdjMatrix] = useState(false);
  const [isPhysicsRunning, setIsPhysicsRunning] = useState(false);
  const [isDirectedMode, setIsDirectedMode] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const width = 600;
  const height = 440;

  // Graph invariants
  const invariants = useMemo(() => computeGraphInvariants(graph), [graph]);

  // Spring Physics loop
  useEffect(() => {
    if (!isPhysicsRunning) return;
    const interval = setInterval(() => {
      const relaxed = runForceDirectedSimulationStep(graph.nodes, graph.edges, width, height);
      onChangeGraph({ nodes: relaxed, edges: graph.edges });
    }, 30);
    return () => clearInterval(interval);
  }, [isPhysicsRunning, graph.nodes, graph.edges, width, height, onChangeGraph]);

  // Screen to SVG coordinate conversion
  const screenToSvg = useCallback(
    (clientX: number, clientY: number) => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * width;
      const y = ((clientY - rect.top) / rect.height) * height;
      return {
        x: Math.max(25, Math.min(width - 25, Math.round(x))),
        y: Math.max(25, Math.min(height - 25, Math.round(y))),
      };
    },
    [width, height]
  );

  // Canvas Click (Add Node)
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool === "add_node") {
      const { x, y } = screenToSvg(e.clientX, e.clientY);
      const nextId = (graph.nodes.length + 1).toString();
      const newNode: GraphNode = {
        id: nextId,
        label: nextId,
        x,
        y,
      };
      onChangeGraph({
        nodes: [...graph.nodes, newNode],
        edges: graph.edges,
      });
      onGraphModified?.();
    } else {
      setSelectedNodeId(null);
      setEdgeSourceNodeId(null);
    }
  };

  // Node Click handler
  const handleNodeClick = (e: React.MouseEvent, node: GraphNode) => {
    e.stopPropagation();

    if (activeTool === "delete") {
      onChangeGraph({
        nodes: graph.nodes.filter((n) => n.id !== node.id),
        edges: graph.edges.filter((edge) => edge.source !== node.id && edge.target !== node.id),
      });
      onGraphModified?.();
      return;
    }

    if (activeTool === "add_edge") {
      if (!edgeSourceNodeId) {
        setEdgeSourceNodeId(node.id);
      } else if (edgeSourceNodeId !== node.id) {
        const edgeId = `e_${edgeSourceNodeId}_${node.id}_${Date.now()}`;
        const newEdge: GraphEdge = {
          id: edgeId,
          source: edgeSourceNodeId,
          target: node.id,
          weight: Math.floor(Math.random() * 8) + 2,
          isDirected: isDirectedMode,
        };
        onChangeGraph({
          nodes: graph.nodes,
          edges: [...graph.edges, newEdge],
        });
        setEdgeSourceNodeId(null);
        onGraphModified?.();
      }
      return;
    }

    setSelectedNodeId(node.id);
  };

  // Node Drag handlers
  const handlePointerDownNode = (e: React.PointerEvent, nodeId: string) => {
    if (activeTool === "select") {
      e.stopPropagation();
      setDraggingNodeId(nodeId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingNodeId) return;
    const { x, y } = screenToSvg(e.clientX, e.clientY);
    onChangeGraph({
      nodes: graph.nodes.map((n) => (n.id === draggingNodeId ? { ...n, x, y } : n)),
      edges: graph.edges,
    });
  };

  const handlePointerUp = () => {
    if (draggingNodeId) {
      setDraggingNodeId(null);
      onGraphModified?.();
    }
  };

  // Delete Edge
  const handleDeleteEdge = (edgeId: string) => {
    if (activeTool === "delete") {
      onChangeGraph({
        nodes: graph.nodes,
        edges: graph.edges.filter((e) => e.id !== edgeId),
      });
      onGraphModified?.();
    }
  };

  // Change Edge Weight
  const handleChangeEdgeWeight = (edgeId: string, delta: number) => {
    onChangeGraph({
      nodes: graph.nodes,
      edges: graph.edges.map((e) =>
        e.id === edgeId ? { ...e, weight: Math.max(1, Math.min(99, e.weight + delta)) } : e
      ),
    });
    onGraphModified?.();
  };

  // Clear Graph
  const handleClearGraph = () => {
    onChangeGraph({ nodes: [], edges: [] });
    setSelectedNodeId(null);
    setEdgeSourceNodeId(null);
    onGraphModified?.();
  };

  // Load Preset
  const handleApplyPreset = (preset: GraphPresetType) => {
    const data = getGraphPreset(preset);
    onChangeGraph(data);
    setSelectedNodeId(null);
    setEdgeSourceNodeId(null);
    onGraphModified?.();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive SVG Graph Canvas (7 cols) ─────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Network size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Graph Studio (|V|={graph.nodes.length}, |E|={graph.edges.length})
            </span>
          </div>

          {/* Tools Palette */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl border border-border">
            <button
              onClick={() => {
                setActiveTool("select");
                setEdgeSourceNodeId(null);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                activeTool === "select"
                  ? "bg-primary text-primary-foreground shadow-sm font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Select/Drag
            </button>

            <button
              onClick={() => {
                setActiveTool("add_node");
                setEdgeSourceNodeId(null);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                activeTool === "add_node"
                  ? "bg-primary text-primary-foreground shadow-sm font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              + Node
            </button>

            <button
              onClick={() => setActiveTool("add_edge")}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                activeTool === "add_edge"
                  ? "bg-primary text-primary-foreground shadow-sm font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              + Edge
            </button>

            <button
              onClick={() => {
                setActiveTool("delete");
                setEdgeSourceNodeId(null);
              }}
              className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTool === "delete"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Delete Nodes or Edges"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Action Top Bar */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPhysicsRunning((p) => !p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                isPhysicsRunning
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-muted hover:bg-accent border border-border text-foreground"
              }`}
              title="Toggle force-directed physics layout"
            >
              {isPhysicsRunning ? <Pause size={12} /> : <Play size={12} />}
              <span>{isPhysicsRunning ? "Relaxing..." : "Physics Relax"}</span>
            </button>

            <button
              onClick={() => setIsDirectedMode((d) => !d)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isDirectedMode
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Directed: {isDirectedMode ? "ON" : "OFF"}
            </button>
          </div>

          <button
            onClick={handleClearGraph}
            className="p-1.5 rounded-xl bg-muted hover:bg-rose-500/10 hover:text-rose-500 border border-border text-muted-foreground text-xs font-bold transition-all"
            title="Clear All Elements"
          >
            <RotateCcw size={13} />
          </button>
        </div>

        {/* SVG Canvas */}
        <div className="flex-1 flex items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 overflow-hidden relative">
          {activeTool === "add_edge" && edgeSourceNodeId && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-black px-2.5 py-1 rounded-xl shadow-md animate-pulse z-10">
              Click second node to connect edge from &quot;{edgeSourceNodeId}&quot;
            </div>
          )}

          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full max-h-[460px] select-none cursor-crosshair touch-none"
            onClick={handleCanvasClick}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <defs>
              <clipPath id="studio-clip-cs">
                <rect x="0" y="0" width={width} height={height} rx="20" ry="20" />
              </clipPath>
              <marker
                id="arrow-cs"
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

            <g clipPath="url(#studio-clip-cs)">
              {/* Edges */}
              {graph.edges.map((edge) => {
                const u = graph.nodes.find((n) => n.id === edge.source);
                const v = graph.nodes.find((n) => n.id === edge.target);
                if (!u || !v) return null;

                const midX = (u.x + v.x) / 2;
                const midY = (u.y + v.y) / 2;

                return (
                  <g
                    key={edge.id}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEdge(edge.id);
                    }}
                  >
                    <line
                      x1={u.x}
                      y1={u.y}
                      x2={v.x}
                      y2={v.y}
                      stroke="currentColor"
                      strokeOpacity="0.4"
                      strokeWidth="2.5"
                      markerEnd={edge.isDirected ? "url(#arrow-cs)" : undefined}
                      className="group-hover:stroke-primary group-hover:stroke-opacity-80 transition-all"
                    />

                    {/* Weight Badge */}
                    <g
                      transform={`translate(${midX}, ${midY})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeTool === "select") {
                          handleChangeEdgeWeight(edge.id, 1);
                        } else if (activeTool === "delete") {
                          handleDeleteEdge(edge.id);
                        }
                      }}
                    >
                      <rect
                        x="-12"
                        y="-9"
                        width="24"
                        height="18"
                        rx="6"
                        fill="currentColor"
                        className="fill-card stroke-border stroke-[1.5]"
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        className="fill-foreground font-mono text-[10px] font-black pointer-events-none"
                      >
                        {edge.weight}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Nodes */}
              {graph.nodes.map((node) => {
                const isSelected = node.id === selectedNodeId;
                const isEdgeSource = node.id === edgeSourceNodeId;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={(e) => handleNodeClick(e, node)}
                    onPointerDown={(e) => handlePointerDownNode(e, node.id)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    {(isSelected || isEdgeSource) && (
                      <circle
                        r="20"
                        fill="none"
                        stroke={isEdgeSource ? "#f59e0b" : "#6366f1"}
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                        className="animate-spin"
                        style={{ animationDuration: "6s" }}
                      />
                    )}

                    <circle
                      r="14"
                      fill={isEdgeSource ? "#f59e0b" : "#6366f1"}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="transition-transform hover:scale-110"
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

        {/* Metric Summary Strip */}
        <div className="grid grid-cols-4 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs mt-2">
          <div>
            <span className="text-[9px] font-bold uppercase text-muted-foreground block">
              Vertices (|V|)
            </span>
            <span className="font-mono font-black text-primary text-sm">
              {invariants.numVertices}
            </span>
          </div>

          <div>
            <span className="text-[9px] font-bold uppercase text-muted-foreground block">
              Edges (|E|)
            </span>
            <span className="font-mono font-bold text-foreground text-sm">
              {invariants.numEdges}
            </span>
          </div>

          <div>
            <span className="text-[9px] font-bold uppercase text-muted-foreground block">
              Average Degree (d̄)
            </span>
            <span className="font-mono font-bold text-foreground text-sm">
              {invariants.avgDegree.toFixed(2)}
            </span>
          </div>

          <div>
            <span className="text-[9px] font-bold uppercase text-muted-foreground block">
              Connected?
            </span>
            <span
              className={`font-mono font-bold text-xs ${
                invariants.isConnected ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {invariants.isConnected ? "Connected" : `${invariants.componentsCount} Parts`}
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: Presets & Invariants Console (5 cols) ────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Graph Presets & Invariants
            </span>
          </div>

          <button
            onClick={() => setShowAdjMatrix((m) => !m)}
            className={`p-1.5 rounded-xl border text-xs font-bold transition-all ${
              showAdjMatrix
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
            title="Toggle Adjacency Matrix"
          >
            <Table size={13} />
          </button>
        </div>

        {/* Presets Gallery */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground block">
            Load Famous Graph Presets
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
            {(
              [
                ["petersen", "Petersen Graph (10v, 15e)"],
                ["complete5", "Complete K₅ (5v, 10e)"],
                ["bipartite33", "Bipartite K₃,₃ (Utility)"],
                ["binary_tree", "Binary Tree (7v, 6e)"],
                ["wheel6", "Wheel Graph W₆ (7v, 12e)"],
                ["grid2x3", "Grid Mesh 2×3 (6v, 7e)"],
                ["weighted_network", "Weighted Network (6v, 9e)"],
                ["flow_network", "Flow Network (6v, 8e)"],
              ] as [GraphPresetType, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                onClick={() => handleApplyPreset(preset)}
                className="p-2.5 bg-muted hover:bg-accent border border-border rounded-2xl text-left text-muted-foreground hover:text-foreground transition-all shadow-sm active:scale-95 text-xs truncate"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Adjacency Matrix View if toggled */}
        {showAdjMatrix ? (
          <div className="space-y-2 pt-2 border-t border-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Adjacency Matrix (A)
            </span>
            <div className="max-h-[160px] overflow-auto bg-muted/40 p-2.5 rounded-2xl border border-border">
              <table className="w-full text-center font-mono text-[10px]">
                <thead>
                  <tr>
                    <th className="p-1 text-muted-foreground"></th>
                    {graph.nodes.map((n) => (
                      <th key={`th-${n.id}`} className="p-1 text-primary font-bold">
                        {n.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invariants.matrix.map((row, i) => (
                    <tr key={`tr-${i}`} className="border-t border-border/40">
                      <td className="p-1 text-primary font-bold">{graph.nodes[i]?.label}</td>
                      {row.map((val, j) => (
                        <td
                          key={`td-${i}-${j}`}
                          className={`p-1 ${val > 0 ? "text-foreground font-black bg-primary/10 rounded" : "text-muted-foreground/40"}`}
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Degree Sequence (d₁ ≥ d₂ ≥ ... ≥ dₙ)
              </span>
              <div className="font-mono text-xs font-bold text-foreground bg-muted/40 p-2.5 rounded-xl border border-border">
                [{invariants.degreeSeq.join(", ")}]
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Graph Density
              </span>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-muted-foreground">Edges / Max Possible</span>
                <span className="font-mono text-primary font-black">{invariants.density.toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${invariants.density}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
