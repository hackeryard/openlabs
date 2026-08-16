"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GraphTabId, GraphData } from "./types";
import { getGraphPreset } from "./lib/graphMath";
import GraphStudioCanvas from "./GraphStudioCanvas";
import ShortestPathCanvas from "./ShortestPathCanvas";
import MSTCanvas from "./MSTCanvas";
import GraphColoringCanvas from "./GraphColoringCanvas";
import MaxFlowCanvas from "./MaxFlowCanvas";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  Network,
  MapPin,
  TreeDeciduous,
  Palette,
  Waves,
} from "lucide-react";

export default function GraphAlgorithmsLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "computer-science/dsa/graph-algorithms",
    "computerScience",
    "exploration"
  );

  const [activeTab, setActiveTab] = useState<GraphTabId>("studio");

  // Shared active graph data
  const [graph, setGraph] = useState<GraphData>(() =>
    getGraphPreset("weighted_network")
  );

  // Daily Challenge metrics
  const [pathsFoundCount, setPathsFoundCount] = useState(1);
  const [mstsComputedCount, setMstsComputedCount] = useState(0);
  const [graphsColoredCount, setGraphsColoredCount] = useState(0);
  const [flowsComputedCount, setFlowsComputedCount] = useState(0);
  const [experimentCompleted, setExperimentCompleted] = useState(false);

  // ── AI Chat Context Registration ─────────────────────────────
  useEffect(() => {
    setExperimentData({
      title: "Graph Algorithms & Network Flow Lab",
      theory: `Interactive Data Structures & Algorithms (DSA) Graph Laboratory.
Examines node-edge graph structures G = (V, E), topological invariants (degree sequences, density, connectivity, adjacency matrix), shortest path algorithms (Dijkstra, BFS, Bellman-Ford), Minimum Spanning Trees (Kruskal with DSU, Prim), proper vertex coloring / chromatic number χ(G), and Ford-Fulkerson Maximum Network Flow.`,
      extraContext: {
        activeTab,
        numVertices: graph.nodes.length,
        numEdges: graph.edges.length,
      },
    });
  }, [activeTab, graph, setExperimentData]);

  // Handlers
  const handleGraphModified = useCallback(() => {
    // triggers state propagation
  }, []);

  const handlePathCalculated = useCallback(() => {
    setPathsFoundCount((prev) => prev + 1);
  }, []);

  const handleMSTCalculated = useCallback(() => {
    setMstsComputedCount((prev) => prev + 1);
  }, []);

  const handleColoringComputed = useCallback(() => {
    setGraphsColoredCount((prev) => prev + 1);
  }, []);

  const handleFlowComputed = useCallback(() => {
    setFlowsComputedCount((prev) => prev + 1);
  }, []);

  // Award XP
  useEffect(() => {
    if (
      !experimentCompleted &&
      (pathsFoundCount >= 2 || mstsComputedCount >= 2 || graphsColoredCount >= 2 || flowsComputedCount >= 1)
    ) {
      completeExperiment();
      setExperimentCompleted(true);
    }
  }, [pathsFoundCount, mstsComputedCount, graphsColoredCount, flowsComputedCount, experimentCompleted, completeExperiment]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* ── Daily Challenge Floating Card ─────────────────────── */}
      <DailyChallengeCard
        labId="computer-science/dsa/graph-algorithms"
        currentParams={{
          pathsFound: pathsFoundCount,
          mstsComputed: mstsComputedCount + (pathsFoundCount > 1 ? 1 : 0),
          graphsColored: graphsColoredCount,
        }}
      />

      {/* ── Top Header Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm shrink-0">
            <Network size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Graph Algorithms & Network Flow
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                DSA Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Interactive node-edge graph studio, force-directed physics, Dijkstra, Kruskal/Prim MST, chromatic coloring, and Ford-Fulkerson Max Flow
            </p>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border flex-wrap">
          <button
            onClick={() => setActiveTab("studio")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "studio"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Network size={14} />
            <span>Studio</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("pathfinding");
              setPathsFoundCount((prev) => prev + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "pathfinding"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <MapPin size={14} />
            <span>Shortest Path</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("mst");
              setMstsComputedCount((prev) => prev + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "mst"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <TreeDeciduous size={14} />
            <span>Spanning Tree</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("coloring");
              setGraphsColoredCount((prev) => prev + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "coloring"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Palette size={14} />
            <span>Coloring</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("flow");
              setFlowsComputedCount((prev) => prev + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "flow"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Waves size={14} />
            <span>Max Flow</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace Views ───────────────────────────────── */}
      {activeTab === "studio" && (
        <GraphStudioCanvas
          graph={graph}
          onChangeGraph={setGraph}
          onGraphModified={handleGraphModified}
        />
      )}

      {activeTab === "pathfinding" && (
        <ShortestPathCanvas
          graph={graph}
          onPathCalculated={handlePathCalculated}
        />
      )}

      {activeTab === "mst" && (
        <MSTCanvas
          graph={graph}
          onMSTCalculated={handleMSTCalculated}
        />
      )}

      {activeTab === "coloring" && (
        <GraphColoringCanvas
          graph={graph}
          onColoringComputed={handleColoringComputed}
        />
      )}

      {activeTab === "flow" && (
        <MaxFlowCanvas
          graph={graph}
          onFlowComputed={handleFlowComputed}
        />
      )}
    </div>
  );
}
