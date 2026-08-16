"use client";

import React, { useState, useEffect } from "react";
import { CombinatoricsTabId } from "./types";
import PermutationsCombinationsCanvas from "./PermutationsCombinationsCanvas";
import PascalsTriangleCanvas from "./PascalsTriangleCanvas";
import PigeonholeCanvas from "./PigeonholeCanvas";
import StarsAndBarsCanvas from "./StarsAndBarsCanvas";
import CatalanCanvas from "./CatalanCanvas";
import DerangementsCanvas from "./DerangementsCanvas";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  Hash,
  Triangle,
  Box,
  Sparkles,
  Shuffle,
  Grid,
} from "lucide-react";

export default function CombinatoricsLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "mathematics/combinatorics",
    "mathematics",
    "exploration"
  );

  const [activeTab, setActiveTab] = useState<CombinatoricsTabId>("permutations_combinations");

  // Challenge metrics
  const [countsComputed, setCountsComputed] = useState(1);
  const [trianglesExplored, setTrianglesExplored] = useState(0);
  const [partitionsGenerated, setPartitionsGenerated] = useState(0);
  const [experimentCompleted, setExperimentCompleted] = useState(false);

  // ── AI Chat Context Registration ─────────────────────────────
  useEffect(() => {
    setExperimentData({
      title: "Combinatorics & Discrete Counting Studio Lab",
      theory: `Interactive Combinatorics, Permutations & Combinations, Pascal's Triangle, Catalan Numbers, and Discrete Probability Laboratory.
Examines counting techniques: Permutations P(n, r), Combinations C(n, r), Multiset Anagrams (n! / (n1! n2! ... nk!)), Pascal's Triangle (Modulo prime fractals, Fibonacci diagonal sums, Hockey-stick theorem) with Binomial Theorem expansion ((ax + by)^n), Dirichlet's Generalized Pigeonhole Principle and Ramsey Theory R(3, 3) = 6, Stars and Bars integer solution distribution (C(n+k-1, k-1)), Ferrers/Young diagrams for integer partitions p(n), Catalan Numbers Cn with Dyck paths & balanced parentheses, and Subfactorial Derangements (!n) with Hat-Check asymptotic convergence to 1/e.`,
      extraContext: {
        activeTab,
      },
    });
  }, [activeTab, setExperimentData]);

  // Award XP
  useEffect(() => {
    if (
      !experimentCompleted &&
      (countsComputed >= 2 || trianglesExplored >= 1 || partitionsGenerated >= 1)
    ) {
      completeExperiment();
      setExperimentCompleted(true);
    }
  }, [countsComputed, trianglesExplored, partitionsGenerated, experimentCompleted, completeExperiment]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* ── Daily Challenge Floating Card ─────────────────────── */}
      <DailyChallengeCard
        labId="mathematics/combinatorics"
        currentParams={{
          countsComputed: countsComputed + (activeTab === "permutations_combinations" ? 1 : 0),
          trianglesExplored: trianglesExplored + (activeTab === "pascals_triangle" ? 1 : 0),
          partitionsGenerated: partitionsGenerated + (activeTab === "stars_and_bars" || activeTab === "catalan_numbers" ? 1 : 0),
        }}
      />

      {/* ── Top Header Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <Hash size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Combinatorics & Discrete Counting Studio
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Mathematics Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Permutations & combinations, anagrams, Pascal&apos;s triangle, Pigeonhole & Ramsey theory, Catalan numbers, and derangements
            </p>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border flex-wrap">
          <button
            onClick={() => {
              setActiveTab("permutations_combinations");
              setCountsComputed((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "permutations_combinations"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Hash size={14} />
            <span>P(n, r), C(n, r) & Anagrams</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("pascals_triangle");
              setTrianglesExplored((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "pascals_triangle"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Triangle size={14} />
            <span>Pascal&apos;s Triangle</span>
          </button>

          <button
            onClick={() => setActiveTab("pigeonhole")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "pigeonhole"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Box size={14} />
            <span>Pigeonhole & Ramsey</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("stars_and_bars");
              setPartitionsGenerated((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "stars_and_bars"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Sparkles size={14} />
            <span>Stars & Bars</span>
          </button>

          <button
            onClick={() => setActiveTab("catalan_numbers")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "catalan_numbers"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Grid size={14} />
            <span>Catalan Numbers</span>
          </button>

          <button
            onClick={() => setActiveTab("derangements")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "derangements"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Shuffle size={14} />
            <span>Derangements (!n)</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace Views ───────────────────────────────── */}
      {activeTab === "permutations_combinations" && <PermutationsCombinationsCanvas />}
      {activeTab === "pascals_triangle" && <PascalsTriangleCanvas />}
      {activeTab === "pigeonhole" && <PigeonholeCanvas />}
      {activeTab === "stars_and_bars" && <StarsAndBarsCanvas />}
      {activeTab === "catalan_numbers" && <CatalanCanvas />}
      {activeTab === "derangements" && <DerangementsCanvas />}
    </div>
  );
}
