"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { LinearAlgebraState, Matrix2x2, Vector2D, TransformShapeType } from "./types";
import { calculateDeterminant, multiplyMatrices } from "./lib/linearMath";
import MatrixCanvas from "./MatrixCanvas";
import MatrixControlPanel from "./MatrixControlPanel";
import EigenPanel from "./EigenPanel";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  Compass,
  Layers,
  Activity,
  Sliders,
  RotateCcw,
  Sparkles,
  Play,
  Grid,
  Divide,
  Shuffle,
  Target,
} from "lucide-react";

export default function LinearAlgebraLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "mathematics/linear-algebra",
    "mathematics",
    "exploration"
  );

  // ── Core Lab State ──────────────────────────────────────────
  const [labState, setLabState] = useState<LinearAlgebraState>({
    activeTab: "canvas",
    matrix: [
      [1.5, 0.5],
      [0.5, 1.2],
    ],
    matrixB: [
      [0, -1],
      [1, 0],
    ],
    useComposition: false,
    tAnim: 1.0,
    isAnimating: false,
    animSpeed: 1,
    activeShape: "unit_square",
    showOriginalGrid: true,
    showTransformedGrid: true,
    showUnitSquare: true,
    showBasisVectors: true,
    showEigenLines: true,
    showSVD: false,
    showCustomVector: false,
    customVector: { x: 1, y: 1 },
    targetVectorB: { x: 2, y: 1 },
    rotationAngleDeg: 45,
  });

  const [isSolvingSystem, setIsSolvingSystem] = useState(false);

  // Daily Challenge & XP Tracking
  const [determinantsCount, setDeterminantsCount] = useState(1);
  const [eigenCount, setEigenCount] = useState(0);
  const [transformsCount, setTransformsCount] = useState(0);
  const [experimentCompleted, setExperimentCompleted] = useState(false);

  // Active combined matrix (if matrix composition is enabled: B * A)
  const effectiveMatrix = labState.useComposition
    ? multiplyMatrices(labState.matrixB, labState.matrix)
    : labState.matrix;

  // ── AI Chat Context Registration ─────────────────────────────
  useEffect(() => {
    const det = calculateDeterminant(effectiveMatrix);
    setExperimentData({
      title: "Linear Algebra & Matrix Transformations",
      theory: `Interactive 2D Linear Algebra laboratory.
Examines linear transformations of space T(v) = Av, basis vectors î = [a, c]ᵀ and ĵ = [b, d]ᵀ, and determinant area scaling det(A) = ad - bc.
Visualizes orientation preservation vs chiral inversion (det < 0), singular collapsed dimensions (det = 0), SVD singular values, and invariant eigen-lines where Av = λv.`,
      extraContext: {
        activeTab: labState.activeTab,
        matrix: effectiveMatrix,
        determinant: det,
        orientation: det > 0 ? "Preserved" : det < 0 ? "Flipped" : "Collapsed",
        activeShape: labState.activeShape,
        isSolvingSystem,
      },
    });
  }, [labState.activeTab, effectiveMatrix, labState.activeShape, isSolvingSystem, setExperimentData]);

  // ── Smooth Animation Loop ───────────────────────────────────
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!labState.isAnimating) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let startTime = performance.now();
    const duration = 1600 / labState.animSpeed;

    const loop = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setLabState((prev) => ({ ...prev, tAnim: ease }));

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        setLabState((prev) => ({ ...prev, isAnimating: false, tAnim: 1 }));
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [labState.isAnimating, labState.animSpeed]);

  const handleToggleAnimation = useCallback(() => {
    setLabState((prev) => {
      if (!prev.isAnimating) {
        return { ...prev, isAnimating: true, tAnim: 0 };
      } else {
        return { ...prev, isAnimating: false, tAnim: 1 };
      }
    });
    setTransformsCount((prev) => prev + 1);
  }, []);

  const handleUpdateMatrix = useCallback((m: Matrix2x2) => {
    setLabState((prev) => ({ ...prev, matrix: m }));
    setDeterminantsCount((prev) => prev + 1);
  }, []);

  // Award XP
  useEffect(() => {
    if (!experimentCompleted && (determinantsCount >= 3 || transformsCount >= 2)) {
      completeExperiment();
      setExperimentCompleted(true);
    }
  }, [determinantsCount, transformsCount, experimentCompleted, completeExperiment]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* ── Daily Challenge Floating Card ─────────────────────── */}
      <DailyChallengeCard
        labId="mathematics/linear-algebra"
        currentParams={{
          determinantsComputed: determinantsCount,
          eigenvectorsFound: eigenCount + (determinantsCount > 2 ? 1 : 0),
          transformsApplied: transformsCount,
        }}
      />

      {/* ── Top Header Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm shrink-0">
            <Grid size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Linear Algebra & Matrix Transformations
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Mathematics Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Interactive 2D space transformation, basis vectors î & ĵ, determinant scaling, SVD, and eigenvalues
            </p>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border">
          <button
            onClick={() => setLabState((prev) => ({ ...prev, activeTab: "canvas" }))}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              labState.activeTab === "canvas"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Grid size={14} />
            <span>Matrix & Canvas</span>
          </button>

          <button
            onClick={() => {
              setLabState((prev) => ({ ...prev, activeTab: "eigen" }));
              setEigenCount((prev) => prev + 1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              labState.activeTab === "eigen"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Activity size={14} />
            <span>Eigen & SVD</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace Views ───────────────────────────────── */}
      {labState.activeTab === "canvas" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: 2D Matrix Canvas (7/12 cols) */}
          <div className="lg:col-span-7 h-[560px] lg:h-[600px]">
            <MatrixCanvas
              matrix={effectiveMatrix}
              onUpdateMatrix={handleUpdateMatrix}
              tAnim={labState.tAnim}
              isAnimating={labState.isAnimating}
              onToggleAnimation={handleToggleAnimation}
              activeShape={labState.activeShape}
              onChangeShape={(sh) => setLabState((prev) => ({ ...prev, activeShape: sh }))}
              showOriginalGrid={labState.showOriginalGrid}
              showTransformedGrid={labState.showTransformedGrid}
              showUnitSquare={labState.showUnitSquare}
              showBasisVectors={labState.showBasisVectors}
              showEigenLines={labState.showEigenLines}
              showSVD={labState.showSVD}
              showCustomVector={labState.showCustomVector}
              customVector={labState.customVector}
              onChangeCustomVector={(v) => setLabState((prev) => ({ ...prev, customVector: v }))}
              targetVectorB={labState.targetVectorB}
              onChangeTargetB={(b) => setLabState((prev) => ({ ...prev, targetVectorB: b }))}
              isSolvingSystem={isSolvingSystem}
            />
          </div>

          {/* Right: Matrix & Determinant Control Panel (5/12 cols) */}
          <div className="lg:col-span-5">
            <MatrixControlPanel
              matrix={labState.matrix}
              onUpdateMatrix={handleUpdateMatrix}
              tAnim={labState.tAnim}
              onChangeTAnim={(t) => setLabState((prev) => ({ ...prev, tAnim: t }))}
              rotationAngleDeg={labState.rotationAngleDeg}
              onChangeRotationAngle={(deg) =>
                setLabState((prev) => ({ ...prev, rotationAngleDeg: deg }))
              }
              showOriginalGrid={labState.showOriginalGrid}
              onToggleOriginalGrid={() =>
                setLabState((prev) => ({
                  ...prev,
                  showOriginalGrid: !prev.showOriginalGrid,
                }))
              }
              showTransformedGrid={labState.showTransformedGrid}
              onToggleTransformedGrid={() =>
                setLabState((prev) => ({
                  ...prev,
                  showTransformedGrid: !prev.showTransformedGrid,
                }))
              }
              showUnitSquare={labState.showUnitSquare}
              onToggleUnitSquare={() =>
                setLabState((prev) => ({
                  ...prev,
                  showUnitSquare: !prev.showUnitSquare,
                }))
              }
              showBasisVectors={labState.showBasisVectors}
              onToggleBasisVectors={() =>
                setLabState((prev) => ({
                  ...prev,
                  showBasisVectors: !prev.showBasisVectors,
                }))
              }
              showEigenLines={labState.showEigenLines}
              onToggleEigenLines={() =>
                setLabState((prev) => ({
                  ...prev,
                  showEigenLines: !prev.showEigenLines,
                }))
              }
              showSVD={labState.showSVD}
              onToggleSVD={() =>
                setLabState((prev) => ({
                  ...prev,
                  showSVD: !prev.showSVD,
                }))
              }
              showCustomVector={labState.showCustomVector}
              onToggleCustomVector={() =>
                setLabState((prev) => ({
                  ...prev,
                  showCustomVector: !prev.showCustomVector,
                }))
              }
              isSolvingSystem={isSolvingSystem}
              onToggleSolvingSystem={() => setIsSolvingSystem((v) => !v)}
              onDeterminantAnalyzed={() => setDeterminantsCount((prev) => prev + 1)}
            />
          </div>
        </div>
      )}

      {labState.activeTab === "eigen" && (
        <EigenPanel
          matrix={effectiveMatrix}
          onEigenAnalyzed={() => setEigenCount((prev) => prev + 1)}
        />
      )}
    </div>
  );
}
