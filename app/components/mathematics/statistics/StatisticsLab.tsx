"use client";

import React, { useState, useEffect, useCallback } from "react";
import { StatisticsTabId } from "./types";
import GaltonBoardCanvas from "./GaltonBoardCanvas";
import CLTSandboxCanvas from "./CLTSandboxCanvas";
import DistributionExplorer from "./DistributionExplorer";
import RegressionStudioCanvas from "./RegressionStudioCanvas";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  Layers,
  Activity,
  TrendingUp,
  Sliders,
  Sparkles,
  BarChart3,
  ScatterChart,
} from "lucide-react";

export default function StatisticsLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "mathematics/statistics",
    "mathematics",
    "exploration"
  );

  const [activeTab, setActiveTab] = useState<StatisticsTabId>("galton");

  // Galton state
  const [galtonRows, setGaltonRows] = useState(10);
  const [galtonBiasP, setGaltonBiasP] = useState(0.5);

  // Daily Challenge & XP Tracking
  const [samplesCount, setSamplesCount] = useState(0);
  const [distributionsCount, setDistributionsCount] = useState(0);
  const [regressionsCount, setRegressionsCount] = useState(0);
  const [experimentCompleted, setExperimentCompleted] = useState(false);

  // ── AI Chat Context Registration ─────────────────────────────
  useEffect(() => {
    setExperimentData({
      title: "Probability & Statistics Sandbox",
      theory: `Interactive Probability and Mathematical Statistics laboratory.
Features the Galton Board (bean machine) demonstrating binomial-to-normal limiting convergence, the Central Limit Theorem (sample means distribution from uniform, exponential, and bimodal populations), PDF/CDF confidence intervals, and Ordinary Least Squares (OLS) linear regression.`,
      extraContext: {
        activeTab,
        galtonRows,
        galtonBiasP,
      },
    });
  }, [activeTab, galtonRows, galtonBiasP, setExperimentData]);

  // Handlers
  const handleBallsSampled = useCallback((count: number) => {
    setSamplesCount((prev) => prev + count);
  }, []);

  const handleCLTSampled = useCallback(() => {
    setSamplesCount((prev) => prev + 100);
  }, []);

  const handleDistributionExplored = useCallback(() => {
    setDistributionsCount((prev) => prev + 1);
  }, []);

  const handleRegressionFitted = useCallback(() => {
    setRegressionsCount((prev) => prev + 1);
  }, []);

  // Award XP
  useEffect(() => {
    if (
      !experimentCompleted &&
      (samplesCount >= 50 || distributionsCount >= 2 || regressionsCount >= 2)
    ) {
      completeExperiment();
      setExperimentCompleted(true);
    }
  }, [samplesCount, distributionsCount, regressionsCount, experimentCompleted, completeExperiment]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* ── Daily Challenge Floating Card ─────────────────────── */}
      <DailyChallengeCard
        labId="mathematics/statistics"
        currentParams={{
          samplesGenerated: samplesCount,
          distributionsExplored: distributionsCount + (samplesCount > 0 ? 1 : 0),
          regressionsFitted: regressionsCount,
        }}
      />

      {/* ── Top Header Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm shrink-0">
            <BarChart3 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Probability & Statistics Sandbox
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Mathematics Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Galton bean machine, Central Limit Theorem, probability distributions, and linear regression
            </p>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border flex-wrap">
          <button
            onClick={() => setActiveTab("galton")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "galton"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Layers size={14} />
            <span>Galton Board</span>
          </button>

          <button
            onClick={() => setActiveTab("clt")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "clt"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Activity size={14} />
            <span>Central Limit Theorem</span>
          </button>

          <button
            onClick={() => setActiveTab("distributions")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "distributions"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <TrendingUp size={14} />
            <span>Distributions (PDF/CDF)</span>
          </button>

          <button
            onClick={() => setActiveTab("regression")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "regression"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <ScatterChart size={14} />
            <span>Linear Regression</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace Views ───────────────────────────────── */}
      {activeTab === "galton" && (
        <GaltonBoardCanvas
          rowsN={galtonRows}
          onChangeRowsN={setGaltonRows}
          biasP={galtonBiasP}
          onChangeBiasP={setGaltonBiasP}
          onBallsSampled={handleBallsSampled}
        />
      )}

      {activeTab === "clt" && (
        <CLTSandboxCanvas onSamplesGenerated={handleCLTSampled} />
      )}

      {activeTab === "distributions" && (
        <DistributionExplorer
          onDistributionExplored={handleDistributionExplored}
        />
      )}

      {activeTab === "regression" && (
        <RegressionStudioCanvas
          onRegressionFitted={handleRegressionFitted}
        />
      )}
    </div>
  );
}
