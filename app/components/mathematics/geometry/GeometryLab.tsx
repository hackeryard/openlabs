"use client";

import React, { useState, useEffect } from "react";
import { GeometryTabId } from "./types";
import ConstructionStudioCanvas from "./ConstructionStudioCanvas";
import TriangleCentersCanvas from "./TriangleCentersCanvas";
import CircleTheoremsCanvas from "./CircleTheoremsCanvas";
import PythagorasCanvas from "./PythagorasCanvas";
import TransformationsCanvas from "./TransformationsCanvas";
import RegularPolygonsCanvas from "./RegularPolygonsCanvas";
import Solids3DCanvas from "./Solids3DCanvas";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  Compass,
  Activity,
  Circle as CircleIcon,
  Square,
  Share2,
  Hexagon,
  Box,
} from "lucide-react";

export default function GeometryLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "mathematics/geometry",
    "mathematics",
    "exploration"
  );

  const [activeTab, setActiveTab] = useState<GeometryTabId>("construction");

  // Challenge metrics
  const [constructionsMadeCount, setConstructionsMadeCount] = useState(1);
  const [centersExploredCount, setCentersExploredCount] = useState(0);
  const [theoremsTestedCount, setTheoremsTestedCount] = useState(0);
  const [experimentCompleted, setExperimentCompleted] = useState(false);

  // ── AI Chat Context Registration ─────────────────────────────
  useEffect(() => {
    setExperimentData({
      title: "Interactive Geometry Studio Lab",
      theory: `Interactive Euclidean Geometry and Geometric Constructions Laboratory.
Examines dynamic geometric constructions, Triangle Centers (Centroid G, Incenter I, Circumcenter O, Orthocenter H, and the collinear Euler Line with 2:1 ratio), Circle Theorems (Inscribed Angle Theorem, Thales' Right Angle Semicircle, Cyclic Quadrilaterals), Pythagorean Theorem Geometric Area Decomposition (a² + b² = c²), 2D Rigid Transformations (Translation, Rotation, Reflection, Dilation), Regular n-gon Polygons, and 3D Polyhedra (Euler's formula V - E + F = 2, surface area, and volume).`,
      extraContext: {
        activeTab,
      },
    });
  }, [activeTab, setExperimentData]);

  // Award XP
  useEffect(() => {
    if (
      !experimentCompleted &&
      (constructionsMadeCount >= 2 || centersExploredCount >= 1 || theoremsTestedCount >= 1)
    ) {
      completeExperiment();
      setExperimentCompleted(true);
    }
  }, [constructionsMadeCount, centersExploredCount, theoremsTestedCount, experimentCompleted, completeExperiment]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* ── Daily Challenge Floating Card ─────────────────────── */}
      <DailyChallengeCard
        labId="mathematics/geometry"
        currentParams={{
          constructionsMade: constructionsMadeCount + (activeTab === "construction" ? 1 : 0),
          centersExplored: centersExploredCount + (activeTab === "triangle_centers" ? 1 : 0),
          theoremsTested: theoremsTestedCount + (activeTab === "circle_theorems" ? 1 : 0),
        }}
      />

      {/* ── Top Header Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <Compass size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Interactive Geometry Studio
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Mathematics Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Interactive constructions, triangle centers & Euler line, circle theorems, Pythagorean area proof, 2D transformations, and 3D polyhedra
            </p>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border flex-wrap">
          <button
            onClick={() => {
              setActiveTab("construction");
              setConstructionsMadeCount((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "construction"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Compass size={14} />
            <span>Constructions</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("triangle_centers");
              setCentersExploredCount((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "triangle_centers"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Activity size={14} />
            <span>Triangle Centers</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("circle_theorems");
              setTheoremsTestedCount((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "circle_theorems"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <CircleIcon size={14} />
            <span>Circle Theorems</span>
          </button>

          <button
            onClick={() => setActiveTab("pythagoras")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "pythagoras"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Square size={14} />
            <span>Pythagoras (a²+b²=c²)</span>
          </button>

          <button
            onClick={() => setActiveTab("transformations")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "transformations"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Share2 size={14} />
            <span>Transformations</span>
          </button>

          <button
            onClick={() => setActiveTab("polygons")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "polygons"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Hexagon size={14} />
            <span>Polygons</span>
          </button>

          <button
            onClick={() => setActiveTab("solids3d")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "solids3d"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Box size={14} />
            <span>3D Polyhedra</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace Views ───────────────────────────────── */}
      {activeTab === "construction" && <ConstructionStudioCanvas />}
      {activeTab === "triangle_centers" && <TriangleCentersCanvas />}
      {activeTab === "circle_theorems" && <CircleTheoremsCanvas />}
      {activeTab === "pythagoras" && <PythagorasCanvas />}
      {activeTab === "transformations" && <TransformationsCanvas />}
      {activeTab === "polygons" && <RegularPolygonsCanvas />}
      {activeTab === "solids3d" && <Solids3DCanvas />}
    </div>
  );
}
