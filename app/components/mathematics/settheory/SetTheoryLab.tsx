"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SetTabId, VennMode, SetElement } from "./types";
import { getPresetCollection } from "./lib/setMath";
import VennDiagramCanvas from "./VennDiagramCanvas";
import SetOperationsCanvas from "./SetOperationsCanvas";
import InclusionExclusionCanvas from "./InclusionExclusionCanvas";
import RelationsFunctionsCanvas from "./RelationsFunctionsCanvas";
import TruthTableCanvas from "./TruthTableCanvas";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  Layers,
  Calculator,
  PieChart,
  Share2,
  Table,
} from "lucide-react";

export default function SetTheoryLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "mathematics/set-theory",
    "mathematics",
    "exploration"
  );

  const [activeTab, setActiveTab] = useState<SetTabId>("venn");
  const [vennMode, setVennMode] = useState<VennMode>("2-set");
  const [elements, setElements] = useState<SetElement[]>(() =>
    getPresetCollection("integers_1_to_10")
  );
  const [highlightedRegions, setHighlightedRegions] = useState<string[]>([
    "AB_intersect",
  ]);

  // Challenge metrics
  const [regionsShadedCount, setRegionsShadedCount] = useState(1);
  const [operationsEvaluatedCount, setOperationsEvaluatedCount] = useState(0);
  const [functionsMappedCount, setFunctionsMappedCount] = useState(0);
  const [experimentCompleted, setExperimentCompleted] = useState(false);

  // ── AI Chat Context Registration ─────────────────────────────
  useEffect(() => {
    setExperimentData({
      title: "Set Theory & Boolean Algebra Lab",
      theory: `Interactive Set Theory, Venn Diagrams, and Boolean Algebra Laboratory.
Examines set operations (Union A ∪ B, Intersection A ∩ B, Set Difference A \\ B, Symmetric Difference A Δ B, Complement A'), Principle of Inclusion-Exclusion (PIE), De Morgan's Laws, Relations and Function Mapping types (Injective, Surjective, Bijective), and Propositional Logic Truth Tables.`,
      extraContext: {
        activeTab,
        vennMode,
        numElements: elements.length,
        highlightedRegions,
      },
    });
  }, [activeTab, vennMode, elements, highlightedRegions, setExperimentData]);

  // Handlers
  const handleToggleRegion = useCallback((region: string) => {
    setHighlightedRegions((prev) => {
      const next = prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region];
      setRegionsShadedCount((c) => c + 1);
      return next;
    });
  }, []);

  const handleApplyRegions = useCallback((regions: string[]) => {
    setHighlightedRegions(regions);
    setOperationsEvaluatedCount((c) => c + 1);
  }, []);

  // Award XP
  useEffect(() => {
    if (
      !experimentCompleted &&
      (regionsShadedCount >= 2 || operationsEvaluatedCount >= 2 || functionsMappedCount >= 1)
    ) {
      completeExperiment();
      setExperimentCompleted(true);
    }
  }, [regionsShadedCount, operationsEvaluatedCount, functionsMappedCount, experimentCompleted, completeExperiment]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* ── Daily Challenge Floating Card ─────────────────────── */}
      <DailyChallengeCard
        labId="mathematics/set-theory"
        currentParams={{
          regionsShaded: regionsShadedCount,
          operationsEvaluated: operationsEvaluatedCount + (regionsShadedCount > 1 ? 1 : 0),
          functionsMapped: functionsMappedCount + (activeTab === "relations" ? 1 : 0),
        }}
      />

      {/* ── Top Header Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <Layers size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Set Theory & Boolean Algebra Lab
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Mathematics Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Interactive 2/3-set Venn diagrams, set operations evaluator, Inclusion-Exclusion, function mappings, and truth tables
            </p>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border flex-wrap">
          <button
            onClick={() => setActiveTab("venn")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "venn"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Layers size={14} />
            <span>Venn Diagram</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("operations");
              setOperationsEvaluatedCount((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "operations"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Calculator size={14} />
            <span>Operations & Laws</span>
          </button>

          <button
            onClick={() => setActiveTab("inclusion_exclusion")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "inclusion_exclusion"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <PieChart size={14} />
            <span>Inclusion-Exclusion</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("relations");
              setFunctionsMappedCount((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "relations"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Share2 size={14} />
            <span>Functions (1-to-1 / Onto)</span>
          </button>

          <button
            onClick={() => setActiveTab("truth_tables")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "truth_tables"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Table size={14} />
            <span>Truth Tables</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace Views ───────────────────────────────── */}
      {activeTab === "venn" && (
        <VennDiagramCanvas
          mode={vennMode}
          onChangeMode={setVennMode}
          elements={elements}
          onChangeElements={setElements}
          highlightedRegions={highlightedRegions}
          onToggleRegion={handleToggleRegion}
        />
      )}

      {activeTab === "operations" && (
        <SetOperationsCanvas
          mode={vennMode}
          elements={elements}
          onApplyRegions={handleApplyRegions}
        />
      )}

      {activeTab === "inclusion_exclusion" && (
        <InclusionExclusionCanvas elements={elements} />
      )}

      {activeTab === "relations" && <RelationsFunctionsCanvas />}

      {activeTab === "truth_tables" && <TruthTableCanvas />}
    </div>
  );
}
