"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PolyLabState, QuadraticParams, QuadraticForm } from "./types";
import QuadraticCanvas from "./QuadraticCanvas";
import DiscriminantPanel from "./DiscriminantPanel";
import PolynomialCanvas from "./PolynomialCanvas";
import SyntheticDivisionPanel from "./SyntheticDivisionPanel";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  TrendingUp,
  Sliders,
  Divide,
  Layers,
  Sparkles,
  RotateCcw,
  Activity,
  Compass,
} from "lucide-react";

export default function PolynomialLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "mathematics/polynomials",
    "mathematics",
    "exploration"
  );

  // ── Core Lab State ──────────────────────────────────────────
  const [labState, setLabState] = useState<PolyLabState>({
    activeTab: "quadratic",
    quadraticForm: "standard",
    quadParams: {
      a: 1,
      b: -2,
      c: -3,
      h: 1,
      k: -4,
      r1: 3,
      r2: -1,
    },
    polyDegree: 3,
    polyCoeffs: [1, 0, -3, 0], // y = x^3 - 3x
    syntheticDivisorC: 2,
    showVertex: true,
    showAxisOfSymmetry: true,
    showRoots: true,
    showFocusDirectrix: false,
    showTangent: false,
    tangentX: 1,
  });

  // Daily Challenge & XP Exploration Trackers
  const [rootsFoundCount, setRootsFoundCount] = useState(1);
  const [discriminantCount, setDiscriminantCount] = useState(0);
  const [divisionCount, setDivisionCount] = useState(0);
  const [experimentCompleted, setExperimentCompleted] = useState(false);

  // ── AI Chat Context Integration ─────────────────────────────
  useEffect(() => {
    setExperimentData({
      title: "Quadratic & Polynomial Explorer",
      theory: `Interactive Polynomial & Parabola laboratory.
Explores quadratic curves y = ax² + bx + c, vertex form y = a(x - h)² + k, and discriminant analysis Δ = b² - 4ac (real vs complex conjugate roots).
Provides higher-degree polynomial analysis (degrees 1 to 5) with turning points and end-behavior, plus step-by-step synthetic polynomial division with the Remainder & Factor Theorems.`,
      extraContext: {
        activeTab: labState.activeTab,
        quadraticCoeffs: { a: labState.quadParams.a, b: labState.quadParams.b, c: labState.quadParams.c },
        polyDegree: labState.polyDegree,
        polyCoeffs: labState.polyCoeffs,
      },
    });
  }, [
    labState.activeTab,
    labState.quadParams.a,
    labState.quadParams.b,
    labState.quadParams.c,
    labState.polyDegree,
    labState.polyCoeffs,
    setExperimentData,
  ]);

  // ── Handlers ────────────────────────────────────────────────
  const handleUpdateQuadParams = useCallback((updates: Partial<QuadraticParams>) => {
    setLabState((prev) => ({
      ...prev,
      quadParams: { ...prev.quadParams, ...updates },
    }));
  }, []);

  const handleDiscriminantAnalyzed = useCallback(() => {
    setDiscriminantCount((prev) => prev + 1);
    setRootsFoundCount((prev) => prev + 1);
  }, []);

  const handleDivisionSolved = useCallback(() => {
    setDivisionCount((prev) => prev + 1);
  }, []);

  // Award XP
  useEffect(() => {
    if (!experimentCompleted && (discriminantCount >= 3 || divisionCount >= 2)) {
      completeExperiment();
      setExperimentCompleted(true);
    }
  }, [discriminantCount, divisionCount, experimentCompleted, completeExperiment]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* ── Daily Challenge Floating Card ─────────────────────── */}
      <DailyChallengeCard
        labId="mathematics/polynomials"
        currentParams={{
          rootsFound: rootsFoundCount,
          discriminantAnalyzed: discriminantCount,
          polynomialsSolved: divisionCount + (discriminantCount > 2 ? 1 : 0),
        }}
      />

      {/* ── Top Header Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Quadratic & Polynomial Explorer
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Mathematics Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Parabola geometry, discriminant analysis, higher-degree curves (degree 1–5), and synthetic division
            </p>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border">
          <button
            onClick={() => setLabState((prev) => ({ ...prev, activeTab: "quadratic" }))}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              labState.activeTab === "quadratic"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <TrendingUp size={14} />
            <span>Quadratic & Parabola</span>
          </button>

          <button
            onClick={() => setLabState((prev) => ({ ...prev, activeTab: "polynomial" }))}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              labState.activeTab === "polynomial"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Sliders size={14} />
            <span>Polynomials (1–5)</span>
          </button>

          <button
            onClick={() => setLabState((prev) => ({ ...prev, activeTab: "synthetic" }))}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              labState.activeTab === "synthetic"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Divide size={14} />
            <span>Synthetic Division</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace Views ───────────────────────────────── */}
      {labState.activeTab === "quadratic" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Parabola Coordinate Canvas (7/12 cols) */}
          <div className="lg:col-span-7 h-[540px] lg:h-[580px]">
            <QuadraticCanvas
              params={labState.quadParams}
              onUpdateParams={handleUpdateQuadParams}
              showVertex={labState.showVertex}
              showAxisOfSymmetry={labState.showAxisOfSymmetry}
              showRoots={labState.showRoots}
              showFocusDirectrix={labState.showFocusDirectrix}
              showTangent={labState.showTangent}
              tangentX={labState.tangentX}
              onUpdateTangentX={(x) => setLabState((prev) => ({ ...prev, tangentX: x }))}
            />
          </div>

          {/* Right: Discriminant & Quadratic Studio (5/12 cols) */}
          <div className="lg:col-span-5">
            <DiscriminantPanel
              form={labState.quadraticForm}
              onChangeForm={(f) => setLabState((prev) => ({ ...prev, quadraticForm: f }))}
              params={labState.quadParams}
              onUpdateParams={handleUpdateQuadParams}
              showVertex={labState.showVertex}
              onToggleVertex={() =>
                setLabState((prev) => ({ ...prev, showVertex: !prev.showVertex }))
              }
              showAxisOfSymmetry={labState.showAxisOfSymmetry}
              onToggleAxisOfSymmetry={() =>
                setLabState((prev) => ({
                  ...prev,
                  showAxisOfSymmetry: !prev.showAxisOfSymmetry,
                }))
              }
              showRoots={labState.showRoots}
              onToggleRoots={() =>
                setLabState((prev) => ({ ...prev, showRoots: !prev.showRoots }))
              }
              showFocusDirectrix={labState.showFocusDirectrix}
              onToggleFocusDirectrix={() =>
                setLabState((prev) => ({
                  ...prev,
                  showFocusDirectrix: !prev.showFocusDirectrix,
                }))
              }
              showTangent={labState.showTangent}
              onToggleTangent={() =>
                setLabState((prev) => ({ ...prev, showTangent: !prev.showTangent }))
              }
              tangentX={labState.tangentX}
              onUpdateTangentX={(x) => setLabState((prev) => ({ ...prev, tangentX: x }))}
              onAnalyzeDiscriminant={handleDiscriminantAnalyzed}
            />
          </div>
        </div>
      )}

      {labState.activeTab === "polynomial" && (
        <PolynomialCanvas
          degree={labState.polyDegree}
          onChangeDegree={(deg) => setLabState((prev) => ({ ...prev, polyDegree: deg }))}
          coeffs={labState.polyCoeffs}
          onChangeCoeffs={(c) => setLabState((prev) => ({ ...prev, polyCoeffs: c }))}
        />
      )}

      {labState.activeTab === "synthetic" && (
        <SyntheticDivisionPanel
          coeffs={labState.polyCoeffs}
          divisorC={labState.syntheticDivisorC}
          onChangeDivisorC={(c) => setLabState((prev) => ({ ...prev, syntheticDivisorC: c }))}
          onDivisionSolved={handleDivisionSolved}
        />
      )}
    </div>
  );
}
