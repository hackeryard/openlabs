"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CalculusLabState, CalculusFunctionPreset, RiemannMethod } from "./types";
import { CALCULUS_PRESETS, getPresetById } from "./lib/calculusMath";
import DerivativeLimitCanvas from "./DerivativeLimitCanvas";
import RiemannSumCanvas from "./RiemannSumCanvas";
import OptimizationPanel from "./OptimizationPanel";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  TrendingUp,
  Layers,
  Activity,
  Sliders,
  Sparkles,
  RotateCcw,
  Compass,
} from "lucide-react";

export default function CalculusLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "mathematics/calculus",
    "mathematics",
    "exploration"
  );

  // ── Core Lab State ──────────────────────────────────────────
  const [labState, setLabState] = useState<CalculusLabState>({
    activeTab: "derivatives",
    selectedFuncId: "cubic",
    x0: 1.5,
    h: 1.0,
    showSecantLine: true,
    showTangentLine: true,
    showDerivativeGraph: false,
    integralA: -2,
    integralB: 2,
    partitionsN: 16,
    riemannMethod: "midpoint",
    selectedCriticalPoint: null,
  });

  const currentPreset = getPresetById(labState.selectedFuncId);

  // Daily Challenge & XP metrics
  const [limitsCount, setLimitsCount] = useState(0);
  const [integralsCount, setIntegralsCount] = useState(0);
  const [extremaCount, setExtremaCount] = useState(0);
  const [experimentCompleted, setExperimentCompleted] = useState(false);

  // ── AI Assistant Context Registration ───────────────────────
  useEffect(() => {
    setExperimentData({
      title: "Calculus & Derivatives Sandbox",
      theory: `Interactive Differential and Integral Calculus laboratory.
Examines the limit definition of the derivative f'(x) = lim[h->0] (f(x+h) - f(x))/h as secant lines pivot into the instantaneous tangent line.
Simulates Riemann sums (Left, Right, Midpoint, Trapezoidal, Simpson) converging to the definite integral int_a^b f(x)dx, and detects stationary optimization extrema using the Second Derivative Test.`,
      extraContext: {
        activeTab: labState.activeTab,
        function: currentPreset.expression,
        derivative: currentPreset.derivativeExpr,
        currentX0: labState.x0,
        currentH: labState.h,
        riemannMethod: labState.riemannMethod,
        partitionsN: labState.partitionsN,
      },
    });
  }, [
    labState.activeTab,
    labState.selectedFuncId,
    labState.x0,
    labState.h,
    labState.riemannMethod,
    labState.partitionsN,
    currentPreset,
    setExperimentData,
  ]);

  // Handlers
  const handleSelectPreset = useCallback((preset: CalculusFunctionPreset) => {
    setLabState((prev) => ({
      ...prev,
      selectedFuncId: preset.id,
      x0: preset.defaultX0,
      integralA: preset.defaultA,
      integralB: preset.defaultB,
    }));
  }, []);

  const handleLimitApproached = useCallback(() => {
    setLimitsCount((prev) => prev + 1);
  }, []);

  const handleIntegralComputed = useCallback(() => {
    setIntegralsCount((prev) => prev + 1);
  }, []);

  const handleExtremaFound = useCallback(() => {
    setExtremaCount((prev) => prev + 1);
  }, []);

  // Award XP
  useEffect(() => {
    if (!experimentCompleted && (limitsCount >= 2 || integralsCount >= 2 || extremaCount >= 2)) {
      completeExperiment();
      setExperimentCompleted(true);
    }
  }, [limitsCount, integralsCount, extremaCount, experimentCompleted, completeExperiment]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* ── Daily Challenge Floating Card ─────────────────────── */}
      <DailyChallengeCard
        labId="mathematics/calculus"
        currentParams={{
          limitsApproached: limitsCount,
          integralsComputed: integralsCount,
          extremaFound: extremaCount + (limitsCount > 0 ? 1 : 0),
        }}
      />

      {/* ── Top Header Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm shrink-0">
            <Compass size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Calculus & Derivatives Sandbox
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Mathematics Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Secant-to-tangent limits, difference quotients, Riemann integral sums, and optimization extrema
            </p>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border">
          <button
            onClick={() => setLabState((prev) => ({ ...prev, activeTab: "derivatives" }))}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              labState.activeTab === "derivatives"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <TrendingUp size={14} />
            <span>Limits & Derivatives</span>
          </button>

          <button
            onClick={() => setLabState((prev) => ({ ...prev, activeTab: "riemann" }))}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              labState.activeTab === "riemann"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Layers size={14} />
            <span>Riemann Sums (Integrals)</span>
          </button>

          <button
            onClick={() => setLabState((prev) => ({ ...prev, activeTab: "optimization" }))}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              labState.activeTab === "optimization"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Activity size={14} />
            <span>Presets & Optimization</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace Views ───────────────────────────────── */}
      {labState.activeTab === "derivatives" && (
        <DerivativeLimitCanvas
          preset={currentPreset}
          x0={labState.x0}
          onChangeX0={(x) => setLabState((prev) => ({ ...prev, x0: x }))}
          h={labState.h}
          onChangeH={(hVal) => setLabState((prev) => ({ ...prev, h: hVal }))}
          showSecantLine={labState.showSecantLine}
          onToggleSecantLine={() =>
            setLabState((prev) => ({ ...prev, showSecantLine: !prev.showSecantLine }))
          }
          showTangentLine={labState.showTangentLine}
          onToggleTangentLine={() =>
            setLabState((prev) => ({ ...prev, showTangentLine: !prev.showTangentLine }))
          }
          showDerivativeGraph={labState.showDerivativeGraph}
          onToggleDerivativeGraph={() =>
            setLabState((prev) => ({
              ...prev,
              showDerivativeGraph: !prev.showDerivativeGraph,
            }))
          }
          onLimitApproached={handleLimitApproached}
        />
      )}

      {labState.activeTab === "riemann" && (
        <RiemannSumCanvas
          preset={currentPreset}
          a={labState.integralA}
          onChangeA={(aVal) => setLabState((prev) => ({ ...prev, integralA: aVal }))}
          b={labState.integralB}
          onChangeB={(bVal) => setLabState((prev) => ({ ...prev, integralB: bVal }))}
          partitionsN={labState.partitionsN}
          onChangePartitionsN={(nVal) =>
            setLabState((prev) => ({ ...prev, partitionsN: nVal }))
          }
          method={labState.riemannMethod}
          onChangeMethod={(m) => setLabState((prev) => ({ ...prev, riemannMethod: m }))}
          onIntegralComputed={handleIntegralComputed}
        />
      )}

      {labState.activeTab === "optimization" && (
        <OptimizationPanel
          currentPreset={currentPreset}
          onSelectPreset={handleSelectPreset}
          onExtremaFound={handleExtremaFound}
        />
      )}
    </div>
  );
}
