"use client";

import React, { useState, useEffect } from "react";
import { VectorTabId } from "./types";
import VectorOperations2DCanvas from "./VectorOperations2DCanvas";
import DotProductCanvas from "./DotProductCanvas";
import CrossProduct3DCanvas from "./CrossProduct3DCanvas";
import TripleProductCanvas from "./TripleProductCanvas";
import LinesPlanes3DCanvas from "./LinesPlanes3DCanvas";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  Move,
  Maximize2,
  Rotate3d,
  Box,
  Layers,
} from "lucide-react";

export default function VectorAlgebraLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "mathematics/vector-algebra",
    "mathematics",
    "exploration"
  );

  const [activeTab, setActiveTab] = useState<VectorTabId>("operations_2d");

  // Challenge metrics
  const [operationsCount, setOperationsCount] = useState(1);
  const [productsCount, setProductsCount] = useState(0);
  const [projectionsCount, setProjectionsCount] = useState(0);
  const [experimentCompleted, setExperimentCompleted] = useState(false);

  // ── AI Chat Context Registration ─────────────────────────────
  useEffect(() => {
    setExperimentData({
      title: "Vector Algebra & 3D Space Studio Lab",
      theory: `Interactive Vector Algebra, Dot/Cross Products, and 3D Euclidean Space Laboratory.
Examines 2D vector arithmetic, Parallelogram Law and Tip-to-Tail addition, Dot Product (u · v = |u||v|cosθ) and orthogonal vector projections (proj_v(u)), 3D Cross Product (u × v) and Right-Hand Rule with spanned parallelogram area, Scalar Triple Product [u, v, w] and 3D parallelepiped volume / coplanarity test, and 3D parametric lines (r = a + td) and planes (r · n = D).`,
      extraContext: {
        activeTab,
      },
    });
  }, [activeTab, setExperimentData]);

  // Award XP
  useEffect(() => {
    if (
      !experimentCompleted &&
      (operationsCount >= 2 || productsCount >= 1 || projectionsCount >= 1)
    ) {
      completeExperiment();
      setExperimentCompleted(true);
    }
  }, [operationsCount, productsCount, projectionsCount, experimentCompleted, completeExperiment]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* ── Daily Challenge Floating Card ─────────────────────── */}
      <DailyChallengeCard
        labId="mathematics/vector-algebra"
        currentParams={{
          operationsPerformed: operationsCount + (activeTab === "operations_2d" ? 1 : 0),
          productsComputed: productsCount + (activeTab === "cross_product_3d" || activeTab === "triple_product" ? 1 : 0),
          projectionsTested: projectionsCount + (activeTab === "dot_product" ? 1 : 0),
        }}
      />

      {/* ── Top Header Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <Move size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Vector Algebra & 3D Space Studio
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Mathematics Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Interactive 2D vector operations, dot & cross products, projections, scalar triple product, and 3D lines/planes
            </p>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border flex-wrap">
          <button
            onClick={() => {
              setActiveTab("operations_2d");
              setOperationsCount((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "operations_2d"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Move size={14} />
            <span>2D Operations</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("dot_product");
              setProjectionsCount((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "dot_product"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Maximize2 size={14} />
            <span>Dot Product & Projections</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("cross_product_3d");
              setProductsCount((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "cross_product_3d"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Rotate3d size={14} />
            <span>3D Cross Product</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("triple_product");
              setProductsCount((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "triple_product"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Box size={14} />
            <span>Triple Product & Volume</span>
          </button>

          <button
            onClick={() => setActiveTab("lines_planes_3d")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "lines_planes_3d"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Layers size={14} />
            <span>3D Lines & Planes</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace Views ───────────────────────────────── */}
      {activeTab === "operations_2d" && <VectorOperations2DCanvas />}
      {activeTab === "dot_product" && <DotProductCanvas />}
      {activeTab === "cross_product_3d" && <CrossProduct3DCanvas />}
      {activeTab === "triple_product" && <TripleProductCanvas />}
      {activeTab === "lines_planes_3d" && <LinesPlanes3DCanvas />}
    </div>
  );
}
