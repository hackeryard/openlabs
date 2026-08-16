"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { TrigLabState, WaveTransform } from "./types";
import { degToRad, normalizeDeg } from "./lib/trigMath";
import UnitCircleCanvas from "./UnitCircleCanvas";
import WaveUnfoldingCanvas from "./WaveUnfoldingCanvas";
import WaveTransformPanel from "./WaveTransformPanel";
import IdentitiesPanel from "./IdentitiesPanel";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  Compass,
  Waves,
  BookOpen,
  Sliders,
  RotateCcw,
  Sparkles,
  Layers,
  Activity,
} from "lucide-react";

export default function TrigonometryLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "mathematics/trigonometry",
    "mathematics",
    "exploration"
  );

  // ── Core Lab State ──────────────────────────────────────────
  const [labState, setLabState] = useState<TrigLabState>({
    angleDeg: 45,
    angleRad: degToRad(45),
    selectedFunction: "sin",
    showSinLeg: true,
    showCosLeg: true,
    showTanLeg: true,
    showSecCscCot: false,
    showReferenceTriangle: true,
    showAngleArc: true,
    showExactRays: true,
    isPlaying: false,
    playSpeed: 1,
  });

  const [waveTransform, setWaveTransform] = useState<WaveTransform>({
    func: "sin",
    amplitude: 1,
    frequency: 1,
    phaseShift: 0,
    verticalShift: 0,
    showHarmonic: false,
    harmonicAmplitude: 0.5,
    harmonicMultiple: 2,
  });

  const [activeTab, setActiveTab] = useState<"unfolding" | "transform" | "identities">("unfolding");

  // Exploration Metrics for Daily Challenge & XP
  const [anglesExplored, setAnglesExplored] = useState<Set<number>>(new Set([45]));
  const [identitiesCount, setIdentitiesCount] = useState(0);
  const [transformCount, setTransformCount] = useState(0);
  const [experimentCompleted, setExperimentCompleted] = useState(false);

  // ── AI Assistant Context Registration ───────────────────────
  useEffect(() => {
    setExperimentData({
      title: "Trigonometry Visualizer",
      theory: `Interactive Trigonometry and Unit Circle exploration lab.
Examines the geometric definition of sine (vertical leg y), cosine (horizontal leg x), and tangent (ratio y/x) on the unit circle (r = 1).
Demonstrates how circular motion unrolls into periodic sinusoidal waves, verifies Pythagorean identities (sin²θ + cos²θ = 1), and models wave harmonic transformations (y = A·sin(B(x - C)) + D).`,
      extraContext: {
        currentAngleDeg: labState.angleDeg,
        activeTab,
        sinValue: Math.sin(degToRad(labState.angleDeg)),
        cosValue: Math.cos(degToRad(labState.angleDeg)),
      },
    });
  }, [labState.angleDeg, activeTab, setExperimentData]);

  // ── Animation Loop for Play/Pause ───────────────────────────
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!labState.isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTime = performance.now();
    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // 45 degrees per second * playSpeed
      setLabState((prev) => {
        const nextDeg = (prev.angleDeg + 45 * delta * prev.playSpeed) % 720;
        return {
          ...prev,
          angleDeg: nextDeg,
          angleRad: degToRad(nextDeg),
        };
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [labState.isPlaying, labState.playSpeed]);

  // ── Angle Change Handler ────────────────────────────────────
  const handleChangeAngle = useCallback((deg: number) => {
    setLabState((prev) => ({
      ...prev,
      angleDeg: deg,
      angleRad: degToRad(deg),
    }));

    const rounded = Math.round(normalizeDeg(deg));
    setAnglesExplored((prev) => new Set(prev).add(rounded));
  }, []);

  // ── Award XP completion ─────────────────────────────────────
  useEffect(() => {
    if (!experimentCompleted && (anglesExplored.size >= 4 || transformCount >= 2 || identitiesCount >= 2)) {
      completeExperiment();
      setExperimentCompleted(true);
    }
  }, [anglesExplored.size, transformCount, identitiesCount, experimentCompleted, completeExperiment]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* ── Floating Daily Challenge Card ─────────────────────── */}
      <DailyChallengeCard
        labId="mathematics/trigonometry"
        currentParams={{
          anglesExplored: anglesExplored.size,
          identitiesVerified: identitiesCount + (anglesExplored.size > 2 ? 1 : 0),
          wavesTransformed: transformCount,
        }}
      />

      {/* ── Top Header Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <Compass size={24} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Trigonometry Visualizer
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Mathematics Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Interactive Unit Circle, right-triangle geometry, continuous wave unfolding, and identities
            </p>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border">
          <button
            onClick={() => setActiveTab("unfolding")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "unfolding"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Compass size={14} />
            <span>Unit Circle & Waves</span>
          </button>

          <button
            onClick={() => setActiveTab("transform")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "transform"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Sliders size={14} />
            <span>Wave Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab("identities")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "identities"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <BookOpen size={14} />
            <span>Identities Matrix</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace Grid Layout ─────────────────────────── */}
      {activeTab === "unfolding" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Unit Circle Canvas (5/12 cols) */}
          <div className="lg:col-span-5 h-[520px] lg:h-[580px]">
            <UnitCircleCanvas
              state={labState}
              onChangeAngle={handleChangeAngle}
            />
          </div>

          {/* Right: Wave Unfolding Canvas (7/12 cols) */}
          <div className="lg:col-span-7 h-[520px] lg:h-[580px]">
            <WaveUnfoldingCanvas
              state={labState}
              onChangeAngle={handleChangeAngle}
              onUpdateState={(updates) => setLabState((prev) => ({ ...prev, ...updates }))}
            />
          </div>
        </div>
      )}

      {activeTab === "transform" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Wave Canvas with transformed equation */}
          <div className="lg:col-span-7 h-[520px] lg:h-[580px]">
            <WaveUnfoldingCanvas
              state={labState}
              onChangeAngle={handleChangeAngle}
              onUpdateState={(updates) => setLabState((prev) => ({ ...prev, ...updates }))}
            />
          </div>

          {/* Right: Transformation Sliders Panel */}
          <div className="lg:col-span-5">
            <WaveTransformPanel
              transform={waveTransform}
              onUpdateTransform={(updates) =>
                setWaveTransform((prev) => ({ ...prev, ...updates }))
              }
              onIncrementTransformCount={() => setTransformCount((prev) => prev + 1)}
            />
          </div>
        </div>
      )}

      {activeTab === "identities" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Unit Circle Interactive Angle Reference */}
          <div className="lg:col-span-5 h-[520px] lg:h-[580px]">
            <UnitCircleCanvas
              state={labState}
              onChangeAngle={handleChangeAngle}
            />
          </div>

          {/* Right: Identities & Exact Angle Matrix */}
          <div className="lg:col-span-7">
            <IdentitiesPanel
              currentAngleDeg={labState.angleDeg}
              onSelectAngle={handleChangeAngle}
              onVerifyIdentity={() => setIdentitiesCount((prev) => prev + 1)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
