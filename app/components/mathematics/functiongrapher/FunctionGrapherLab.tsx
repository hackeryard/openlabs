"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { GraphFunction, DomainRange, PinnedPoint, GraphOverlayOptions, IntegralConfig, COLOR_PALETTE } from "./types";
import { parseExpression, FunctionPreset, PRESET_FUNCTIONS } from "./lib/parser";
import { DEFAULT_TRANSFORM, TransformParams } from "./lib/evaluator";
import { analyzeFunction, getTangentInfo, findRoots, findExtrema, findYIntercept } from "./lib/analysis";
import GraphCanvas from "./GraphCanvas";
import FunctionInputPanel from "./FunctionInputPanel";
import FunctionList from "./FunctionList";
import GraphControls from "./GraphControls";
import PointInspector from "./PointInspector";
import TransformPanel from "./TransformPanel";
import AnalysisPanel from "./AnalysisPanel";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  Sigma,
  Layers,
  Sliders,
  Activity,
  Crosshair,
  Maximize2,
  RotateCcw,
  Sparkles,
  Download,
  Share2,
  Trash2,
} from "lucide-react";

export default function FunctionGrapherLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "mathematics/functiongrapher",
    "mathematics",
    "exploration"
  );

  // Initial standard functions
  const initialFunctions: GraphFunction[] = [
    {
      id: "fn-1",
      name: "f(x)",
      rawExpression: "x^3 - 3*x",
      parsed: parseExpression("x^3 - 3*x"),
      color: COLOR_PALETTE[0],
      isVisible: true,
      isPrimary: true,
      transform: { ...DEFAULT_TRANSFORM },
    },
    {
      id: "fn-2",
      name: "g(x)",
      rawExpression: "sin(x)",
      parsed: parseExpression("sin(x)"),
      color: COLOR_PALETTE[1],
      isVisible: false,
      isPrimary: false,
      transform: { ...DEFAULT_TRANSFORM },
    },
  ];

  const [functions, setFunctions] = useState<GraphFunction[]>(initialFunctions);
  const [domain, setDomain] = useState<DomainRange>({
    xMin: -6,
    xMax: 6,
    yMin: -6,
    yMax: 6,
  });

  const [overlays, setOverlays] = useState<GraphOverlayOptions>({
    showGrid: true,
    showAxes: true,
    showRoots: true,
    showExtrema: true,
    showTangent: false,
    showIntegralShading: false,
  });

  const [pinnedPoint, setPinnedPoint] = useState<PinnedPoint | null>(null);
  const [hoveredX, setHoveredX] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"functions" | "transform" | "analysis" | "inspect">("functions");
  const [integralConfig, setIntegralConfig] = useState<IntegralConfig | null>({
    functionId: "fn-1",
    lowerBound: -1.732,
    upperBound: 1.732,
  });

  // Track exploration metrics for Daily Challenges & XP
  const [transformCount, setTransformCount] = useState(0);
  const [completedAwarded, setCompletedAwarded] = useState(false);

  // AI Assistant Context Registration
  useEffect(() => {
    setExperimentData({
      title: "Function Grapher",
      theory: `Interactive 2D function plotting engine with real-time transformations, numerical calculus, root-finding, and local extrema detection.
Users can analyze curves of the form y = a·f(b(x - h)) + k, inspect tangent slopes f'(x), and approximate definite integrals ∫ f(x) dx using Simpson's rule.`,
      extraContext: {
        activeFunctionsCount: functions.filter((f) => f.isVisible).length,
        currentDomain: domain,
        primaryFunction: functions.find((f) => f.isPrimary)?.rawExpression || "None",
      },
    });
  }, [functions, domain, setExperimentData]);

  // Primary active function
  const primaryFunction = useMemo(() => {
    return functions.find((f) => f.isPrimary && f.isVisible) || functions.find((f) => f.isVisible) || functions[0] || null;
  }, [functions]);

  // Numerical analysis data for the primary function
  const analysis = useMemo(() => {
    if (!primaryFunction || !primaryFunction.parsed.compiled) {
      return { roots: [], yIntercept: null, extrema: [] };
    }
    return analyzeFunction(
      primaryFunction.parsed.compiled,
      domain.xMin,
      domain.xMax,
      primaryFunction.transform
    );
  }, [primaryFunction, domain.xMin, domain.xMax]);

  // Tangent line info at active inspection point
  const activeInspectX = pinnedPoint ? pinnedPoint.x : hoveredX;
  const tangentInfo = useMemo(() => {
    if (activeInspectX === null || !primaryFunction?.parsed.compiled) return null;
    return getTangentInfo(
      primaryFunction.parsed.compiled,
      activeInspectX,
      primaryFunction.transform
    );
  }, [activeInspectX, primaryFunction]);

  // Award exploration completion after exploring multiple functions or transformations
  useEffect(() => {
    if (!completedAwarded && (functions.length >= 2 || transformCount >= 3)) {
      completeExperiment();
      setCompletedAwarded(true);
    }
  }, [functions.length, transformCount, completedAwarded, completeExperiment]);

  // Add new function
  const handleAddFunction = (expr: string, color: string) => {
    const nextChar = String.fromCharCode(102 + functions.length); // f, g, h, i, j...
    const newFn: GraphFunction = {
      id: `fn-${Date.now()}`,
      name: `${nextChar}(x)`,
      rawExpression: expr,
      parsed: parseExpression(expr),
      color: color || COLOR_PALETTE[functions.length % COLOR_PALETTE.length],
      isVisible: true,
      isPrimary: functions.length === 0,
      transform: { ...DEFAULT_TRANSFORM },
    };

    setFunctions((prev) => [...prev, newFn]);
  };

  // Preset applied
  const handleApplyPreset = (preset: FunctionPreset) => {
    const newFn: GraphFunction = {
      id: `fn-${Date.now()}`,
      name: `f(x)`,
      rawExpression: preset.expression,
      parsed: parseExpression(preset.expression),
      color: COLOR_PALETTE[0],
      isVisible: true,
      isPrimary: true,
      transform: { ...DEFAULT_TRANSFORM },
    };

    setFunctions([newFn]);

    if (preset.recommendedDomain && preset.recommendedRange) {
      setDomain({
        xMin: preset.recommendedDomain[0],
        xMax: preset.recommendedDomain[1],
        yMin: preset.recommendedRange[0],
        yMax: preset.recommendedRange[1],
      });
    }
  };

  // Toggle function visibility
  const handleToggleVisibility = (id: string) => {
    setFunctions((prev) =>
      prev.map((fn) => (fn.id === id ? { ...fn, isVisible: !fn.isVisible } : fn))
    );
  };

  // Set primary function
  const handleSetPrimary = (id: string) => {
    setFunctions((prev) =>
      prev.map((fn) => ({ ...fn, isPrimary: fn.id === id }))
    );
  };

  // Delete function
  const handleDeleteFunction = (id: string) => {
    setFunctions((prev) => {
      const filtered = prev.filter((fn) => fn.id !== id);
      if (filtered.length > 0 && !filtered.some((f) => f.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  // Duplicate function
  const handleDuplicateFunction = (id: string) => {
    const target = functions.find((f) => f.id === id);
    if (!target) return;
    const nextChar = String.fromCharCode(102 + functions.length);
    const newFn: GraphFunction = {
      ...target,
      id: `fn-${Date.now()}`,
      name: `${nextChar}(x)`,
      isPrimary: false,
      color: COLOR_PALETTE[functions.length % COLOR_PALETTE.length],
    };
    setFunctions((prev) => [...prev, newFn]);
  };

  // Update expression
  const handleUpdateExpression = (id: string, newExpr: string) => {
    setFunctions((prev) =>
      prev.map((fn) =>
        fn.id === id
          ? {
              ...fn,
              rawExpression: newExpr,
              parsed: parseExpression(newExpr),
            }
          : fn
      )
    );
  };

  // Change curve color
  const handleChangeColor = (id: string, newColor: string) => {
    setFunctions((prev) =>
      prev.map((fn) => (fn.id === id ? { ...fn, color: newColor } : fn))
    );
  };

  // Update transformation params
  const handleUpdateTransform = (id: string, newTransform: TransformParams) => {
    setTransformCount((prev) => prev + 1);
    setFunctions((prev) =>
      prev.map((fn) => (fn.id === id ? { ...fn, transform: newTransform } : fn))
    );
  };

  // Toggle overlay layer
  const handleToggleOverlay = (key: keyof GraphOverlayOptions) => {
    setOverlays((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Auto-fit domain to features
  const handleAutoFit = () => {
    if (analysis.roots.length > 0 || analysis.extrema.length > 0) {
      const allX = [
        ...analysis.roots.map((r) => r.x),
        ...analysis.extrema.map((e) => e.x),
      ];
      const allY = [
        0,
        ...analysis.extrema.map((e) => e.y),
      ];

      const minX = Math.min(...allX) - 2;
      const maxX = Math.max(...allX) + 2;
      const minY = Math.min(...allY) - 2;
      const maxY = Math.max(...allY) + 2;

      setDomain({
        xMin: Number(minX.toFixed(2)),
        xMax: Number(maxX.toFixed(2)),
        yMin: Number(minY.toFixed(2)),
        yMax: Number(maxY.toFixed(2)),
      });
    } else {
      setDomain({ xMin: -8, xMax: 8, yMin: -8, yMax: 8 });
    }
  };

  // Pin coordinate from analysis table click
  const handleSelectCoordinate = (x: number, y: number) => {
    if (primaryFunction) {
      setPinnedPoint({
        x: Number(x.toFixed(4)),
        y: Number(y.toFixed(4)),
        functionId: primaryFunction.id,
      });
    }
  };

  // Clear all functions
  const handleClearAll = () => {
    setFunctions([]);
    setPinnedPoint(null);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* ── Floating Daily Challenge Pill/Card ────────────────── */}
      <DailyChallengeCard
        labId="mathematics/functiongrapher"
        currentParams={{
          rootsFound: analysis.roots.length,
          functionsPlotted: functions.filter((f) => f.isVisible).length,
          transformationsApplied: transformCount,
        }}
      />

      {/* ── Top Header Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <Sigma size={24} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Function Grapher
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Mathematics Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Real-time mathematical plotting, coordinate geometry, transformations, and calculus analysis
            </p>
          </div>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAutoFit}
            className="px-3 py-2 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-bold text-foreground flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            title="Auto-fit domain to features"
          >
            <Maximize2 size={14} className="text-primary" />
            <span>Auto-Fit</span>
          </button>
          <button
            onClick={() => setDomain({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 })}
            className="px-3 py-2 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-bold text-foreground flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            title="Reset domain to standard [-10, 10]"
          >
            <RotateCcw size={14} />
            <span>Reset View</span>
          </button>
          <button
            onClick={handleClearAll}
            className="px-3 py-2 rounded-xl bg-muted hover:bg-rose-500/10 hover:border-rose-500/30 text-xs font-bold text-muted-foreground hover:text-rose-600 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            title="Clear all plotted functions"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace Grid (Left: D3 Canvas, Right: Tabbed Control Sidebar) ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: D3 Canvas */}
        <div className="lg:col-span-7 xl:col-span-8 h-[580px] lg:h-[720px]">
          <GraphCanvas
            functions={functions}
            domain={domain}
            onDomainChange={setDomain}
            overlays={overlays}
            pinnedPoint={pinnedPoint}
            onPinPoint={setPinnedPoint}
            hoveredX={hoveredX}
            onHoverX={setHoveredX}
            roots={analysis.roots}
            extrema={analysis.extrema}
            tangentInfo={tangentInfo}
            integralConfig={integralConfig}
          />
        </div>

        {/* Right 5 Columns: Interactive Controls & Analysis Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          {/* Navigation Tabs Bar */}
          <div className="bg-card border border-border rounded-2xl p-1.5 grid grid-cols-4 gap-1 shadow-sm text-xs font-bold">
            <button
              onClick={() => setActiveTab("functions")}
              className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
                activeTab === "functions"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Layers size={15} />
              <span className="text-[10px] uppercase tracking-wider">Functions</span>
            </button>

            <button
              onClick={() => setActiveTab("transform")}
              className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
                activeTab === "transform"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Sliders size={15} />
              <span className="text-[10px] uppercase tracking-wider">Transform</span>
            </button>

            <button
              onClick={() => setActiveTab("analysis")}
              className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
                activeTab === "analysis"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Activity size={15} />
              <span className="text-[10px] uppercase tracking-wider">Analysis</span>
            </button>

            <button
              onClick={() => setActiveTab("inspect")}
              className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
                activeTab === "inspect"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Crosshair size={15} />
              <span className="text-[10px] uppercase tracking-wider">Inspect</span>
            </button>
          </div>

          {/* Tab 1: Functions Manager & Input */}
          {activeTab === "functions" && (
            <div className="space-y-4">
              <FunctionInputPanel
                onAddFunction={handleAddFunction}
                onApplyPreset={handleApplyPreset}
                activeColorIndex={functions.length}
              />
              <FunctionList
                functions={functions}
                onToggleVisibility={handleToggleVisibility}
                onSetPrimary={handleSetPrimary}
                onDeleteFunction={handleDeleteFunction}
                onDuplicateFunction={handleDuplicateFunction}
                onUpdateExpression={handleUpdateExpression}
                onChangeColor={handleChangeColor}
              />
              <GraphControls
                domain={domain}
                onDomainChange={setDomain}
                overlays={overlays}
                onToggleOverlay={handleToggleOverlay}
                onAutoFit={handleAutoFit}
              />
            </div>
          )}

          {/* Tab 2: Transformations Panel */}
          {activeTab === "transform" && (
            <div className="space-y-4">
              <TransformPanel
                primaryFunction={primaryFunction}
                onUpdateTransform={handleUpdateTransform}
              />
            </div>
          )}

          {/* Tab 3: Numerical Calculus & Analysis */}
          {activeTab === "analysis" && (
            <div className="space-y-4">
              <AnalysisPanel
                primaryFunction={primaryFunction}
                roots={analysis.roots}
                yIntercept={analysis.yIntercept}
                extrema={analysis.extrema}
                integralConfig={integralConfig}
                onUpdateIntegralConfig={setIntegralConfig}
                onSelectCoordinate={handleSelectCoordinate}
              />
            </div>
          )}

          {/* Tab 4: Point Inspector & Tangents */}
          {activeTab === "inspect" && (
            <div className="space-y-4">
              <PointInspector
                functions={functions}
                pinnedPoint={pinnedPoint}
                onPinPoint={setPinnedPoint}
                hoveredX={hoveredX}
                tangentInfo={tangentInfo}
                primaryFunction={primaryFunction}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
