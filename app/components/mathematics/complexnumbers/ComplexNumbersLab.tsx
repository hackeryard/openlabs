"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ComplexTabId, ComplexNumber, ComplexOperation } from "./types";
import ArgandPlaneCanvas from "./ArgandPlaneCanvas";
import RootsOfUnityCanvas from "./RootsOfUnityCanvas";
import EulerFormulaCanvas from "./EulerFormulaCanvas";
import FractalExplorerCanvas from "./FractalExplorerCanvas";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  Compass,
  Layers,
  Sparkles,
  RotateCw,
} from "lucide-react";

export default function ComplexNumbersLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "mathematics/complex-numbers",
    "mathematics",
    "exploration"
  );

  const [activeTab, setActiveTab] = useState<ComplexTabId>("argand");

  // Argand state
  const [z1, setZ1] = useState<ComplexNumber>({ re: 2, im: 1.5 });
  const [z2, setZ2] = useState<ComplexNumber>({ re: 1, im: 2 });
  const [operation, setOperation] = useState<ComplexOperation>("multiply");
  const [powerN, setPowerN] = useState<number>(3);
  const [combAlpha, setCombAlpha] = useState<number>(1.5);
  const [combBeta, setCombBeta] = useState<number>(-0.5);
  const [showConjugate, setShowConjugate] = useState<boolean>(true);
  const [showParallelogram, setShowParallelogram] = useState<boolean>(true);
  const [showAxisProjections, setShowAxisProjections] = useState<boolean>(true);

  // Roots state: z^n = targetW
  const [rootsN, setRootsN] = useState<number>(5);
  const [targetW, setTargetW] = useState<ComplexNumber>({ re: 1, im: 0 });

  // Euler state
  const [eulerAngleDeg, setEulerAngleDeg] = useState<number>(180);
  const [eulerRadius, setEulerRadius] = useState<number>(1.0);

  // Daily Challenge & XP Tracking
  const [operationsCount, setOperationsCount] = useState(1);
  const [rootsCount, setRootsCount] = useState(0);
  const [fractalsCount, setFractalsCount] = useState(0);
  const [experimentCompleted, setExperimentCompleted] = useState(false);

  // ── AI Chat Context Registration ─────────────────────────────
  useEffect(() => {
    setExperimentData({
      title: "Complex Numbers & Fractals Explorer",
      theory: `Interactive Complex Analysis and Fractal Dynamics laboratory.
Examines the 2D Argand plane z = a + bi, polar coordinates r e^(iθ), complex multiplication as rotation and dilation, roots of arbitrary equations z^n = W, Euler's formula r·e^(iθ) = r(cos(θ) + i·sin(θ)), and real-time escape-time rendering of the Mandelbrot, Julia, Multibrot, and Burning Ship fractals.`,
      extraContext: {
        activeTab,
        z1,
        z2,
        operation,
        rootsN,
        targetW,
        eulerAngleDeg,
        eulerRadius,
      },
    });
  }, [activeTab, z1, z2, operation, rootsN, targetW, eulerAngleDeg, eulerRadius, setExperimentData]);

  // Handlers
  const handleOperationEvaluated = useCallback(() => {
    setOperationsCount((prev) => prev + 1);
  }, []);

  const handleRootsExplored = useCallback(() => {
    setRootsCount((prev) => prev + 1);
  }, []);

  const handleFractalRendered = useCallback(() => {
    setFractalsCount((prev) => prev + 1);
  }, []);

  // Award XP
  useEffect(() => {
    if (
      !experimentCompleted &&
      (operationsCount >= 3 || rootsCount >= 2 || fractalsCount >= 2)
    ) {
      completeExperiment();
      setExperimentCompleted(true);
    }
  }, [operationsCount, rootsCount, fractalsCount, experimentCompleted, completeExperiment]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* ── Daily Challenge Floating Card ─────────────────────── */}
      <DailyChallengeCard
        labId="mathematics/complex-numbers"
        currentParams={{
          complexOperationsPerformed: operationsCount,
          rootsExplored: rootsCount + (operationsCount > 1 ? 1 : 0),
          fractalsRendered: fractalsCount,
        }}
      />

      {/* ── Top Header Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm shrink-0">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Complex Numbers & Fractals Explorer
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Mathematics Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Argand plane, complex rotation-dilation, arbitrary polynomial roots zⁿ = W, Euler&apos;s formula, and Mandelbrot/Burning Ship fractal universe
            </p>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border flex-wrap">
          <button
            onClick={() => setActiveTab("argand")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "argand"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Compass size={14} />
            <span>Argand Plane</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("roots");
              setRootsCount((prev) => prev + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "roots"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Layers size={14} />
            <span>Roots of Equations</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("euler");
              setOperationsCount((prev) => prev + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "euler"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <RotateCw size={14} />
            <span>Euler&apos;s Formula</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("fractals");
              setFractalsCount((prev) => prev + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "fractals"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Sparkles size={14} />
            <span>Fractal Universe</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace Views ───────────────────────────────── */}
      {activeTab === "argand" && (
        <ArgandPlaneCanvas
          z1={z1}
          onChangeZ1={setZ1}
          z2={z2}
          onChangeZ2={setZ2}
          operation={operation}
          onChangeOperation={setOperation}
          powerN={powerN}
          onChangePowerN={setPowerN}
          combAlpha={combAlpha}
          onChangeCombAlpha={setCombAlpha}
          combBeta={combBeta}
          onChangeCombBeta={setCombBeta}
          showConjugate={showConjugate}
          onToggleConjugate={() => setShowConjugate((c) => !c)}
          showParallelogram={showParallelogram}
          onToggleParallelogram={() => setShowParallelogram((p) => !p)}
          showAxisProjections={showAxisProjections}
          onToggleAxisProjections={() => setShowAxisProjections((a) => !a)}
          onOperationEvaluated={handleOperationEvaluated}
        />
      )}

      {activeTab === "roots" && (
        <RootsOfUnityCanvas
          rootsN={rootsN}
          onChangeRootsN={setRootsN}
          targetW={targetW}
          onChangeTargetW={setTargetW}
          onRootsExplored={handleRootsExplored}
        />
      )}

      {activeTab === "euler" && (
        <EulerFormulaCanvas
          angleDeg={eulerAngleDeg}
          onChangeAngleDeg={setEulerAngleDeg}
          radius={eulerRadius}
          onChangeRadius={setEulerRadius}
          onEulerExplored={handleOperationEvaluated}
        />
      )}

      {activeTab === "fractals" && (
        <FractalExplorerCanvas
          onFractalRendered={handleFractalRendered}
        />
      )}
    </div>
  );
}
