"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Activity,
  Layers,
  Zap,
  Gauge,
  Compass,
  ArrowDown,
  ArrowUp,
  Download,
  Info,
  Maximize2,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  Globe,
  Wind,
  Orbit,
  Flame,
  Award,
  SlidersHorizontal,
  Circle,
  CircleDot,
  Disc,
  Clock,
  Waves,
  Scale,
  Crosshair,
  TrendingUp,
  HelpCircle,
} from "lucide-react";

// ── Environment Presets ────────────────────────────────────────────────
export type EnvIconType = "earth" | "zerog" | "moon" | "mars" | "jupiter" | "custom";

export interface EnvironmentPreset {
  id: string;
  name: string;
  iconType: EnvIconType;
  gravity: number; // m/s^2
  color: string;
  skyGradient: [string, string];
  description: string;
}

export const PLANETARY_PRESETS: EnvironmentPreset[] = [
  {
    id: "earth",
    name: "Earth (Sea Level)",
    iconType: "earth",
    gravity: 9.81,
    color: "#3b82f6",
    skyGradient: ["#0f172a", "#1e293b"],
    description: "Standard terrestrial gravity ($g = 9.81\\text{ m/s}^2$). Reference baseline for spring displacement.",
  },
  {
    id: "moon",
    name: "Moon (Apollo 15)",
    iconType: "moon",
    gravity: 1.62,
    color: "#94a3b8",
    skyGradient: ["#050505", "#111827"],
    description: "Lunar gravity ($g = 1.62\\text{ m/s}^2$) producing ~6x less static extension for the same mass.",
  },
  {
    id: "mars",
    name: "Mars",
    iconType: "mars",
    gravity: 3.72,
    color: "#ef4444",
    skyGradient: ["#1c0a00", "#3b1408"],
    description: "Martian gravity ($g = 3.72\\text{ m/s}^2$) creating moderate static spring extension.",
  },
  {
    id: "jupiter",
    name: "Jupiter Cloud Tops",
    iconType: "jupiter",
    gravity: 24.79,
    color: "#f59e0b",
    skyGradient: ["#261505", "#451a03"],
    description: "Intense jovian gravity ($g = 24.79\\text{ m/s}^2$) causing substantial spring elongation.",
  },
  {
    id: "zerog",
    name: "Zero-G Space Station",
    iconType: "zerog",
    gravity: 0.0,
    color: "#8b5cf6",
    skyGradient: ["#09090b", "#18181b"],
    description: "Zero-gravity orbital environment ($g = 0\\text{ m/s}^2$). Equilibrium position is the unstretched spring length.",
  },
];

// Helper to render Environment Icon
function RenderEnvIcon({ type, size = 15, className = "" }: { type: EnvIconType; size?: number; className?: string }) {
  switch (type) {
    case "earth":
      return <Globe size={size} className={className} />;
    case "zerog":
      return <Sparkles size={size} className={className} />;
    case "moon":
      return <Orbit size={size} className={className} />;
    case "mars":
      return <Flame size={size} className={className} />;
    case "jupiter":
      return <Disc size={size} className={className} />;
    default:
      return <SlidersHorizontal size={size} className={className} />;
  }
}

// ── Multi-Spring Configurations ─────────────────────────────────────────
export type SpringArrangement = "single" | "series" | "parallel";

// ── Mystery Mass Calibration ────────────────────────────────────────────
export interface MysteryMass {
  id: string;
  name: string;
  mass: number; // kg
  color: string;
}

export const MYSTERY_MASSES: MysteryMass[] = [
  { id: "standard", name: "Known Load", mass: 1.0, color: "#38bdf8" },
  { id: "mystery_1", name: "Red Mystery Mass", mass: 0.75, color: "#f43f5e" },
  { id: "mystery_2", name: "Green Mystery Mass", mass: 1.85, color: "#10b981" },
  { id: "mystery_3", name: "Amber Mystery Mass", mass: 3.20, color: "#f59e0b" },
];

// ── Guided Discovery Presets ──────────────────────────────────────────
export interface GuidedPreset {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  env: string;
  arrangement: SpringArrangement;
  k1: number;
  k2: number;
  mass: number;
  damping: number;
  explanation: string;
}

export const GUIDED_PRESETS: GuidedPreset[] = [
  {
    id: "linear_hooke",
    title: "Linear Elastic Restoring Force (F = -kΔx)",
    subtitle: "Testing direct proportionality between force and stretch",
    tag: "Fundamental",
    env: "earth",
    arrangement: "single",
    k1: 25.0,
    k2: 25.0,
    mass: 1.5,
    damping: 0.05,
    explanation: "Hooke's Law states restoring force Fs = -kΔx. At static equilibrium, mg = kΔx. For k = 25 N/m and m = 1.5kg on Earth, static extension is exactly Δx = (1.5 × 9.81)/25 = 0.589m.",
  },
  {
    id: "parallel_stiffness",
    title: "Springs in Parallel (k_eff = k₁ + k₂)",
    subtitle: "Doubling stiffness and reducing extension by half",
    tag: "Multi-Spring",
    env: "earth",
    arrangement: "parallel",
    k1: 20.0,
    k2: 20.0,
    mass: 2.0,
    damping: 0.04,
    explanation: "In parallel, both springs stretch identically and share the suspended load: keff = k₁ + k₂ = 40 N/m. The combined system is twice as stiff, halving the equilibrium stretch and increasing oscillation frequency.",
  },
  {
    id: "series_compliance",
    title: "Springs in Series (1/k_eff = 1/k₁ + 1/k₂)",
    subtitle: "Increased compliance and doubled total extension",
    tag: "Multi-Spring",
    env: "earth",
    arrangement: "series",
    k1: 30.0,
    k2: 30.0,
    mass: 1.0,
    damping: 0.03,
    explanation: "In series, the same tension passes through both springs: 1/keff = 1/30 + 1/30 ⇒ keff = 15 N/m. The combined system is half as stiff as either spring individually, doubling total stretch.",
  },
  {
    id: "mystery_balance",
    title: "Unknown Mass Gravitational Calibration",
    subtitle: "Deducing load mass from static extension Δx_eq",
    tag: "Measurement",
    env: "earth",
    arrangement: "single",
    k1: 20.0,
    k2: 20.0,
    mass: 1.85,
    damping: 0.25,
    explanation: "By letting the mystery mass settle at equilibrium and measuring extension Δx on the ruler, the mass is directly computed via m = (k × Δx)/g without a kitchen scale.",
  },
  {
    id: "zerog_oscillation",
    title: "Zero-G Inertial Oscillation",
    subtitle: "Pure harmonic motion about natural unstretched length",
    tag: "Space Physics",
    env: "zerog",
    arrangement: "single",
    k1: 35.0,
    k2: 35.0,
    mass: 1.2,
    damping: 0.0,
    explanation: "In zero gravity (g = 0), there is no static gravitational extension (Δxeq = 0). When pulled and released, the mass oscillates symmetrically about the unstretched spring length with period T = 2π√(m/k).",
  },
];

export default function HookeLawStudio() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "physics/hookelaw",
    "physics",
    "simulation"
  );

  // ── Spring System Parameters ─────────────────────────────────────────
  const [selectedEnvId, setSelectedEnvId] = useState<string>("earth");
  const [arrangement, setArrangement] = useState<SpringArrangement>("single");
  const [k1, setK1] = useState<number>(25.0); // N/m [5..100]
  const [k2, setK2] = useState<number>(25.0); // N/m [5..100]
  const [mass, setMass] = useState<number>(1.0); // kg [0.1..10.0]
  const [damping, setDamping] = useState<number>(0.05); // damping coeff gamma [0..0.5]
  const [selectedMysteryId, setSelectedMysteryId] = useState<string>("standard");
  const [customGravity, setCustomGravity] = useState<number>(9.81);

  // Initial Displacement Stretch from unstretched reference (meters)
  const [initialDisplacement, setInitialDisplacement] = useState<number>(0.5);

  // Playback & Simulation Engine State
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Visual Overlays & Console Tabs
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [showEquilibriumLine, setShowEquilibriumLine] = useState<boolean>(true);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"controls" | "multi-spring" | "telemetry" | "presets">("controls");
  const [activeGraphTab, setActiveGraphTab] = useState<"x-t" | "f-x" | "energy">("x-t");

  // Active Environment
  const activeEnv = useMemo(() => {
    const preset = PLANETARY_PRESETS.find((p) => p.id === selectedEnvId);
    if (!preset) {
      return {
        id: "custom",
        name: "Custom Gravity",
        iconType: "custom" as EnvIconType,
        gravity: customGravity,
        color: "#06b6d4",
        skyGradient: ["#022c22", "#0f172a"] as [string, string],
        description: `Custom configured gravity (${customGravity} m/s²).`,
      };
    }
    return preset;
  }, [selectedEnvId, customGravity]);

  // Effective Spring Constant (k_eff)
  const effectiveK = useMemo(() => {
    if (arrangement === "single") return k1;
    if (arrangement === "parallel") return k1 + k2;
    if (arrangement === "series") {
      return (k1 * k2) / Math.max(0.1, k1 + k2);
    }
    return k1;
  }, [arrangement, k1, k2]);

  // Active Effective Mass (accounting for mystery mass selection)
  const activeMass = useMemo(() => {
    const mystery = MYSTERY_MASSES.find((m) => m.id === selectedMysteryId);
    return mystery && mystery.id !== "standard" ? mystery.mass : mass;
  }, [selectedMysteryId, mass]);

  // Theoretical Calculations
  const theoreticalMetrics = useMemo(() => {
    const g = activeEnv.gravity;
    const k = Math.max(0.1, effectiveK);
    const m = Math.max(0.05, activeMass);

    // Static Equilibrium Displacement: mg = k * x_eq => x_eq = mg / k
    const xEq = (m * g) / k;

    // Natural Angular Frequency ω0 = sqrt(k / m)
    const omega0 = Math.sqrt(k / m);

    // Period T = 2π / ω0 = 2π * sqrt(m / k)
    const period = (2 * Math.PI) / omega0;
    const frequency = 1 / period;

    return {
      xEq: Number(xEq.toFixed(3)),
      omega0: Number(omega0.toFixed(3)),
      period: Number(period.toFixed(3)),
      frequency: Number(frequency.toFixed(3)),
    };
  }, [activeEnv.gravity, effectiveK, activeMass]);

  // Instantaneous State
  const [currentState, setCurrentState] = useState<{
    t: number;
    x: number; // displacement from unstretched spring top (meters)
    v: number; // velocity (m/s)
    a: number; // acceleration (m/s^2)
    fs: number; // restoring force (N)
    fg: number; // gravitational force (N)
    ue: number; // elastic potential energy (J)
    ug: number; // gravitational potential energy (J)
    ke: number; // kinetic energy (J)
    totalE: number; // total mechanical energy (J)
    oscillationCount: number;
  }>({
    t: 0,
    x: initialDisplacement,
    v: 0,
    a: (activeMass * activeEnv.gravity - effectiveK * initialDisplacement) / activeMass,
    fs: -effectiveK * initialDisplacement,
    fg: activeMass * activeEnv.gravity,
    ue: 0.5 * effectiveK * initialDisplacement * initialDisplacement,
    ug: -activeMass * activeEnv.gravity * initialDisplacement,
    ke: 0,
    totalE: 0.5 * effectiveK * initialDisplacement * initialDisplacement,
    oscillationCount: 0,
  });

  // Telemetry History Ref
  const historyRef = useRef<{ t: number; x: number; v: number; fs: number; ue: number; ke: number; totalE: number }[]>([]);
  const lastEqCrossingRef = useRef<{ t: number; dir: number } | null>(null);

  // Dragging State on Canvas
  const [isDraggingMass, setIsDraggingMass] = useState<boolean>(false);

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Synchronize AI Chatbot Knowledge Context
  useEffect(() => {
    setExperimentData({
      title: "Hooke's Law & Coupled Spring Oscillations Studio",
      theory: `Hooke's Law: Fs = -k·Δx. Equation of Motion: m·d²x/dt² = -k_eff·x - γ·v + m·g. Arrangement: ${arrangement} (k_eff = ${effectiveK.toFixed(1)} N/m). Period: T = 2π√(m/k). Energy: Ue = ½k(Δx)², Ke = ½mv².`,
      extraContext: `Environment: ${activeEnv.name} (g = ${activeEnv.gravity} m/s²). Load: ${activeMass}kg, Initial Stretch: ${initialDisplacement}m, Damping: ${damping}. Theoretical Equilibrium: ${theoreticalMetrics.xEq}m, Period: ${theoreticalMetrics.period}s.`,
    });
  }, [activeEnv, arrangement, effectiveK, activeMass, initialDisplacement, damping, theoreticalMetrics, setExperimentData]);

  // Reset Simulation Launch
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);

    const x0 = initialDisplacement;
    const fs0 = -effectiveK * x0;
    const fg0 = activeMass * activeEnv.gravity;
    const a0 = (fg0 + fs0) / activeMass;
    const ue0 = 0.5 * effectiveK * x0 * x0;
    const ug0 = -activeMass * activeEnv.gravity * x0;

    setCurrentState({
      t: 0,
      x: x0,
      v: 0,
      a: a0,
      fs: fs0,
      fg: fg0,
      ue: ue0,
      ug: ug0,
      ke: 0,
      totalE: ue0 + ug0,
      oscillationCount: 0,
    });

    historyRef.current = [{
      t: 0,
      x: Number(x0.toFixed(3)),
      v: 0,
      fs: Number(fs0.toFixed(2)),
      ue: Number(ue0.toFixed(2)),
      ke: 0,
      totalE: Number((ue0 + ug0).toFixed(2)),
    }];

    lastEqCrossingRef.current = null;
  }, [initialDisplacement, effectiveK, activeMass, activeEnv.gravity]);

  // Apply Guided Preset
  const handleApplyPreset = (preset: GuidedPreset) => {
    setSelectedEnvId(preset.env);
    setArrangement(preset.arrangement);
    setK1(preset.k1);
    setK2(preset.k2);
    setMass(preset.mass);
    setDamping(preset.damping);
    setSelectedMysteryId("standard");
    setTimeout(() => handleReset(), 50);
  };

  // Reset when key parameters change while stopped
  useEffect(() => {
    if (!isRunning) {
      handleReset();
    }
  }, [effectiveK, activeMass, initialDisplacement, selectedEnvId, damping, handleReset, isRunning]);

  // ── Physics Integration Loop (Runge-Kutta RK4 Solver) ───────────────
  useEffect(() => {
    if (!isRunning || isPaused || isDraggingMass) return;

    let localState = { ...currentState };
    lastTimeRef.current = performance.now();

    const g = activeEnv.gravity;
    const m = activeMass;
    const k = effectiveK;
    const gamma = damping;

    // Acceleration Function: a(x, v) = g - (k/m)x - (gamma/m)v
    const accel = (xPos: number, vVel: number) => {
      return g - (k / m) * xPos - (gamma / m) * vVel;
    };

    const stepSimulation = (now: number) => {
      const realDt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // Sub-stepping with RK4
      const subSteps = 12;
      const dt = (realDt * playbackSpeed) / subSteps;

      for (let s = 0; s < subSteps; s++) {
        const x = localState.x;
        const v = localState.v;

        // RK4 Step
        const k1_x = v;
        const k1_v = accel(x, v);

        const k2_x = v + 0.5 * dt * k1_v;
        const k2_v = accel(x + 0.5 * dt * k1_x, v + 0.5 * dt * k1_v);

        const k3_x = v + 0.5 * dt * k2_v;
        const k3_v = accel(x + 0.5 * dt * k2_x, v + 0.5 * dt * k2_v);

        const k4_x = v + dt * k3_v;
        const k4_v = accel(x + dt * k3_x, v + dt * k3_v);

        const prevX = localState.x;
        localState.x += (dt / 6) * (k1_x + 2 * k2_x + 2 * k3_x + k4_x);
        localState.v += (dt / 6) * (k1_v + 2 * k2_v + 2 * k3_v + k4_v);
        localState.a = accel(localState.x, localState.v);
        localState.t += dt;

        // Hard ceiling stop (cannot compress higher than support ceiling)
        if (localState.x < 0.05) {
          localState.x = 0.05;
          localState.v = -localState.v * 0.4;
        }

        // Equilibrium Zero-Crossing Detector (x = x_eq)
        const xEq = (m * g) / k;
        if ((prevX - xEq) * (localState.x - xEq) <= 0 && Math.abs(prevX - localState.x) < 0.3) {
          const currentDir = localState.v >= 0 ? 1 : -1;
          if (lastEqCrossingRef.current && lastEqCrossingRef.current.dir === currentDir) {
            localState.oscillationCount += 1;
            if (localState.oscillationCount >= 3) {
              completeExperiment();
            }
          }
          lastEqCrossingRef.current = { t: localState.t, dir: currentDir };
        }
      }

      // Forces & Energy Breakdown
      localState.fs = -k * localState.x;
      localState.fg = m * g;
      const ue = 0.5 * k * localState.x * localState.x;
      const ug = -m * g * localState.x;
      const ke = 0.5 * m * localState.v * localState.v;
      localState.ue = ue;
      localState.ug = ug;
      localState.ke = ke;
      localState.totalE = ue + ug + ke;

      setCurrentState({ ...localState });

      // Telemetry buffer
      historyRef.current.push({
        t: Number(localState.t.toFixed(3)),
        x: Number(localState.x.toFixed(3)),
        v: Number(localState.v.toFixed(2)),
        fs: Number(localState.fs.toFixed(2)),
        ue: Number(localState.ue.toFixed(2)),
        ke: Number(localState.ke.toFixed(2)),
        totalE: Number(localState.totalE.toFixed(2)),
      });

      if (historyRef.current.length > 500) {
        historyRef.current.shift();
      }

      rafRef.current = requestAnimationFrame(stepSimulation);
    };

    rafRef.current = requestAnimationFrame(stepSimulation);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [
    isRunning,
    isPaused,
    isDraggingMass,
    activeEnv.gravity,
    activeMass,
    effectiveK,
    damping,
    playbackSpeed,
    completeExperiment,
  ]);

  // ── Helper Function: Draw Coiled Vector Spring ─────────────────────────
  const drawSpringCoil = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    coils: number = 14,
    radius: number = 12,
    color: string = "#38bdf8"
  ) => {
    const totalLen = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    if (totalLen <= 10) return;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Top straight lead
    const leadLen = 15;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY + leadLen);
    ctx.stroke();

    // Bottom straight lead
    ctx.beginPath();
    ctx.moveTo(endX, endY - leadLen);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Coiled zigzag / sine wire
    const activeLen = totalLen - leadLen * 2;
    const dy = activeLen / (coils * 2);

    ctx.beginPath();
    ctx.moveTo(startX, startY + leadLen);

    for (let i = 1; i <= coils * 2; i++) {
      const cy = startY + leadLen + i * dy;
      const cx = startX + (i % 2 === 1 ? radius : -radius);
      if (i === coils * 2) {
        ctx.lineTo(startX, startY + leadLen + activeLen);
      } else {
        ctx.lineTo(cx, cy);
      }
    }
    ctx.stroke();
    ctx.restore();
  };

  // ── Render Canvas Stage ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // 1. Sky & Chamber Atmospheric Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, activeEnv.skyGradient[0]);
      skyGrad.addColorStop(1, activeEnv.skyGradient[1]);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Starfield for Moon & ZeroG
      if (activeEnv.id === "moon" || activeEnv.id === "zerog") {
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        for (let i = 0; i < 35; i++) {
          const sx = ((i * 137) % (w - 20)) + 10;
          const sy = ((i * 83) % (h - 60)) + 10;
          ctx.fillRect(sx, sy, 1.5, 1.5);
        }
      }

      // Ceiling Support Beam
      const ceilingY = 50;
      ctx.fillStyle = "#334155";
      ctx.fillRect(40, ceilingY - 14, w - 80, 14);

      // Diagonal cross-hatch mounting brackets
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 1.5;
      for (let bx = 50; bx < w - 60; bx += 20) {
        ctx.beginPath();
        ctx.moveTo(bx, ceilingY - 14);
        ctx.lineTo(bx + 12, ceilingY);
        ctx.stroke();
      }

      // Scale Geometry: 1.0 meter stretch = ~180px on canvas
      const pxPerMeter = 180;
      const naturalSpringLenPx = 100;
      const currentStretchPx = Math.max(10, currentState.x * pxPerMeter);
      const totalVisualLenPx = naturalSpringLenPx + currentStretchPx;

      const mountCenterX = w * 0.45;
      const loadY = ceilingY + totalVisualLenPx;
      const loadRadius = Math.max(16, Math.min(32, 16 + Math.cbrt(activeMass) * 4));

      // 2. Interactive Measuring Ruler
      if (showRuler) {
        const rulerX = w * 0.82;
        const rulerY = ceilingY;
        const rulerH = h - ceilingY - 30;

        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1.5;
        ctx.fillRect(rulerX, rulerY, 32, rulerH);
        ctx.strokeRect(rulerX, rulerY, 32, rulerH);

        // Meter and centimeter ticks
        for (let m = 0; m <= 2.0; m += 0.1) {
          const tickY = rulerY + naturalSpringLenPx + m * pxPerMeter;
          if (tickY > rulerY + rulerH - 5) break;

          const isMajor = Math.abs(m * 10 - Math.round(m * 10)) < 0.01 && Math.round(m * 10) % 5 === 0;
          ctx.strokeStyle = isMajor ? "#38bdf8" : "rgba(255,255,255,0.3)";
          ctx.lineWidth = isMajor ? 1.5 : 1;

          ctx.beginPath();
          ctx.moveTo(rulerX, tickY);
          ctx.lineTo(rulerX + (isMajor ? 14 : 7), tickY);
          ctx.stroke();

          if (isMajor) {
            ctx.fillStyle = "#38bdf8";
            ctx.font = "8px monospace";
            ctx.textAlign = "right";
            ctx.fillText(`${m.toFixed(1)}m`, rulerX + 30, tickY + 3);
          }
        }
      }

      // 3. Equilibrium Marker Line (mg = k*x)
      if (showEquilibriumLine) {
        const eqY = ceilingY + naturalSpringLenPx + theoreticalMetrics.xEq * pxPerMeter;
        ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(80, eqY);
        ctx.lineTo(w - 80, eqY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#38bdf8";
        ctx.font = "9px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`Equilibrium (x_eq = ${theoreticalMetrics.xEq}m)`, 85, eqY - 4);

        // Unstretched Reference Line (x = 0)
        const unstretchY = ceilingY + naturalSpringLenPx;
        ctx.strokeStyle = "rgba(244, 63, 94, 0.3)";
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(80, unstretchY);
        ctx.lineTo(w - 80, unstretchY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#f43f5e";
        ctx.fillText("Unstretched (x = 0)", 85, unstretchY - 4);
      }

      // 4. Render Physical Springs according to Arrangement
      if (arrangement === "single") {
        // Single Spring
        drawSpringCoil(ctx, mountCenterX, ceilingY, mountCenterX, loadY, 16, 14, "#38bdf8");
      } else if (arrangement === "parallel") {
        // Parallel Springs (Side by Side)
        const spacing = 32;
        drawSpringCoil(ctx, mountCenterX - spacing, ceilingY, mountCenterX - spacing, loadY, 14, 11, "#38bdf8");
        drawSpringCoil(ctx, mountCenterX + spacing, ceilingY, mountCenterX + spacing, loadY, 14, 11, "#06b6d4");

        // Horizontal connecting crossbar at bottom
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(mountCenterX - spacing - 4, loadY);
        ctx.lineTo(mountCenterX + spacing + 4, loadY);
        ctx.stroke();
      } else if (arrangement === "series") {
        // Series Springs (End to End connected via coupling bead)
        const midY = ceilingY + totalVisualLenPx * 0.5;
        drawSpringCoil(ctx, mountCenterX, ceilingY, mountCenterX, midY, 10, 12, "#38bdf8");

        // Coupling Bead
        ctx.fillStyle = "#e2e8f0";
        ctx.beginPath();
        ctx.arc(mountCenterX, midY, 5, 0, Math.PI * 2);
        ctx.fill();

        drawSpringCoil(ctx, mountCenterX, midY, mountCenterX, loadY, 10, 12, "#06b6d4");
      }

      // 5. Suspended Mass Load (Cylinder / Sphere)
      const mystery = MYSTERY_MASSES.find((m) => m.id === selectedMysteryId);
      const massColor = mystery?.color || "#38bdf8";

      const massGrad = ctx.createRadialGradient(
        mountCenterX - loadRadius * 0.3,
        loadY + loadRadius * 0.7,
        loadRadius * 0.1,
        mountCenterX,
        loadY + loadRadius,
        loadRadius
      );
      massGrad.addColorStop(0, "#ffffff");
      massGrad.addColorStop(0.3, massColor);
      massGrad.addColorStop(1, "#0f172a");

      ctx.shadowColor = massColor;
      ctx.shadowBlur = isRunning ? 8 : 2;
      ctx.fillStyle = massGrad;

      // Suspended Mass Block
      ctx.beginPath();
      ctx.arc(mountCenterX, loadY + loadRadius, loadRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = isDraggingMass ? "#f59e0b" : "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Mass Label inside bob
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        selectedMysteryId === "standard" ? `${activeMass}kg` : "?",
        mountCenterX,
        loadY + loadRadius + 3
      );

      // 6. Dynamic Force Vector Overlays
      if (showVectors) {
        // A. Gravity Force Vector (Downward - Blue)
        const fgLen = Math.min(60, currentState.fg * 2.5);
        if (fgLen > 2) {
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(mountCenterX, loadY + loadRadius * 2);
          ctx.lineTo(mountCenterX, loadY + loadRadius * 2 + fgLen);
          ctx.stroke();

          // Arrow head
          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.moveTo(mountCenterX - 4, loadY + loadRadius * 2 + fgLen - 6);
          ctx.lineTo(mountCenterX + 4, loadY + loadRadius * 2 + fgLen - 6);
          ctx.lineTo(mountCenterX, loadY + loadRadius * 2 + fgLen);
          ctx.fill();
        }

        // B. Spring Restoring Force Vector (Upward - Rose)
        const fsLen = Math.min(60, Math.abs(currentState.fs) * 2.5);
        if (fsLen > 2) {
          ctx.strokeStyle = "#f43f5e";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(mountCenterX, loadY);
          ctx.lineTo(mountCenterX, loadY - fsLen);
          ctx.stroke();

          // Arrow head
          ctx.fillStyle = "#f43f5e";
          ctx.beginPath();
          ctx.moveTo(mountCenterX - 4, loadY - fsLen + 6);
          ctx.lineTo(mountCenterX + 4, loadY - fsLen + 6);
          ctx.lineTo(mountCenterX, loadY - fsLen);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [
    activeEnv,
    activeMass,
    arrangement,
    currentState,
    isDraggingMass,
    isRunning,
    selectedMysteryId,
    showEquilibriumLine,
    showRuler,
    showVectors,
    theoreticalMetrics,
  ]);

  // ── Render Telemetry & Force-Displacement Canvas ───────────────────────
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padX = 40;
    const padY = 20;
    const graphW = w - padX - 15;
    const graphH = h - padY - 20;

    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.strokeRect(padX, padY, graphW, graphH);

    const history = historyRef.current;
    if (history.length < 2) return;

    if (activeGraphTab === "x-t") {
      // Position Wave x(t)
      const maxX = Math.max(...history.map((d) => d.x), theoreticalMetrics.xEq * 1.5, 0.5) * 1.1;

      // Plot curve
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();

      const n = history.length;
      history.forEach((d, idx) => {
        const xPx = padX + (idx / (n - 1)) * graphW;
        const normY = d.x / maxX;
        const yPx = padY + normY * graphH;
        if (idx === 0) ctx.moveTo(xPx, yPx);
        else ctx.lineTo(xPx, yPx);
      });
      ctx.stroke();
    } else if (activeGraphTab === "f-x") {
      // Force vs Displacement Curve (F = k * x)
      const maxX = Math.max(...history.map((d) => d.x), 1.0) * 1.1;
      const maxF = effectiveK * maxX;

      // Zero Origin
      const zeroX = padX;
      const zeroY = padY + graphH;

      // Linear Slope Line (Theory)
      ctx.strokeStyle = "rgba(244, 63, 94, 0.35)";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(zeroX, zeroY);
      ctx.lineTo(padX + graphW, padY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Plot experimental Points
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.beginPath();
      history.forEach((d, idx) => {
        const xPx = padX + (d.x / maxX) * graphW;
        const yPx = zeroY - (Math.abs(d.fs) / maxF) * graphH;
        if (idx === 0) ctx.moveTo(xPx, yPx);
        else ctx.lineTo(xPx, yPx);
      });
      ctx.stroke();
    } else if (activeGraphTab === "energy") {
      // Elastic Potential & Kinetic Energy Curves
      const maxE = Math.max(...history.map((d) => d.totalE), 1) * 1.2;

      const plotEnergy = (extractor: (d: (typeof history)[0]) => number, color: string) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const n = history.length;
        history.forEach((d, idx) => {
          const xPx = padX + (idx / (n - 1)) * graphW;
          const yPx = padY + graphH - (extractor(d) / maxE) * graphH;
          if (idx === 0) ctx.moveTo(xPx, yPx);
          else ctx.lineTo(xPx, yPx);
        });
        ctx.stroke();
      };

      plotEnergy((d) => d.ue, "#38bdf8"); // Elastic PE
      plotEnergy((d) => d.ke, "#10b981"); // Kinetic Energy
      plotEnergy((d) => d.totalE, "#e2e8f0"); // Total Energy
    }
  }, [activeGraphTab, currentState, effectiveK, theoreticalMetrics]);

  // Export CSV Telemetry Data
  const handleExportCSV = () => {
    const rows = [["Time (s)", "Displacement (m)", "Velocity (m/s)", "Restoring Force (N)", "Elastic PE (J)", "Kinetic E (J)", "Total Energy (J)"]];
    historyRef.current.forEach((d) => {
      rows.push([d.t.toString(), d.x.toString(), d.v.toString(), d.fs.toString(), d.ue.toString(), d.ke.toString(), d.totalE.toString()]);
    });
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hooke_law_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-5 lg:p-6 space-y-5">
      {/* ── Executive Header Bar ───────────────────────────────────── */}
      <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-2xl bg-primary/10 text-primary">
              <Scale size={22} />
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
              Hooke&apos;s Law, Springs & Coupled Oscillations Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-mono font-bold">
              Elasticity & SHM
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Multi-spring configurations, linear elastic restoration, damped harmonic decay, and mystery mass weighing.
          </p>
        </div>

        {/* Primary Simulation Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              if (!isRunning) {
                setIsRunning(true);
                setIsPaused(false);
              } else {
                setIsPaused(!isPaused);
              }
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition shadow-xs cursor-pointer ${
              !isRunning
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : isPaused
                ? "bg-emerald-600 text-white hover:bg-emerald-500"
                : "bg-amber-500 text-black hover:bg-amber-400"
            }`}
          >
            {!isRunning ? (
              <>
                <Play size={15} fill="currentColor" />
                <span>Start Oscillation</span>
              </>
            ) : isPaused ? (
              <>
                <Play size={15} fill="currentColor" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause size={15} fill="currentColor" />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-card border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition cursor-pointer"
            title="Reset to Initial Stretch"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-card border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition cursor-pointer"
            title="Export CSV Telemetry"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace: Central Stage + Control Deck ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Visualizer Stage Canvas (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
            {/* Top Floating Badges */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/10 flex items-center gap-1.5">
                <RenderEnvIcon type={activeEnv.iconType} size={13} className="text-primary" />
                <span>{activeEnv.name.split(" ")[0]}</span>
                <span className="text-primary font-mono text-[11px]">({activeEnv.gravity} m/s²)</span>
              </span>

              <span className="px-2.5 py-1 bg-sky-950/80 backdrop-blur-md rounded-full text-sky-300 text-[10px] font-mono font-black border border-sky-500/30 uppercase">
                {arrangement} (k_eff = {effectiveK.toFixed(1)} N/m)
              </span>
            </div>

            {/* Quick Overlays Bar */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setShowVectors(!showVectors)}
                className={`px-2 py-0.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                  showVectors ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white"
                }`}
              >
                Vectors
              </button>
              <button
                type="button"
                onClick={() => setShowRuler(!showRuler)}
                className={`px-2 py-0.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                  showRuler ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white"
                }`}
              >
                Ruler
              </button>
              <button
                type="button"
                onClick={() => setShowEquilibriumLine(!showEquilibriumLine)}
                className={`px-2 py-0.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                  showEquilibriumLine ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white"
                }`}
              >
                Equilibrium
              </button>
            </div>

            {/* Stage Canvas */}
            <canvas
              ref={canvasRef}
              width={720}
              height={470}
              className="w-full h-[390px] sm:h-[460px] block cursor-ns-resize"
            />

            {/* Bottom Playback & Speed Bar */}
            <div className="p-3 bg-card/95 border-t border-border flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-muted-foreground text-[11px]">Speed:</span>
                {[0.2, 0.5, 1.0, 2.0].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPlaybackSpeed(s)}
                    className={`px-2 py-0.5 rounded-lg font-mono font-bold transition text-[11px] ${
                      playbackSpeed === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Time & Oscillation Counter */}
              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground font-bold text-[11px]">Cycles:</span>
                  <span className="font-black text-foreground bg-muted px-2 py-0.5 rounded-md">
                    {currentState.oscillationCount}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground font-bold text-[11px]">Time:</span>
                  <span className="font-black text-foreground bg-muted px-2 py-0.5 rounded-md">
                    {currentState.t.toFixed(2)}s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Tab Studio Console + Live Telemetry Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-card border border-border rounded-3xl p-5 shadow-xs space-y-4">
            {/* Console Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-border">
              {[
                { id: "controls", label: "Spring & Load", icon: Sliders },
                { id: "multi-spring", label: "Arrangement", icon: Layers },
                { id: "telemetry", label: "Telemetry", icon: Activity },
                { id: "presets", label: "Presets", icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveConsoleTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      activeConsoleTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon size={13} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ── TAB 1: SPRING & LOAD CONTROLS ── */}
            {activeConsoleTab === "controls" && (
              <div className="space-y-4">
                {/* Spring Constant (k1) Slider + Manual Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Spring Constant (k₁):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="5"
                        max="150"
                        step="1"
                        value={k1}
                        onChange={(e) => setK1(Math.min(200, Math.max(5, Number(e.target.value) || 5)))}
                        disabled={isRunning}
                        className="w-16 px-2 py-0.5 rounded-lg bg-muted border border-border text-foreground font-mono font-black text-right text-xs focus:border-primary focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">N/m</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={k1}
                    onChange={(e) => setK1(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                    <span>5 N/m (Soft)</span>
                    <span>50 N/m (Medium)</span>
                    <span>100 N/m (Stiff)</span>
                  </div>
                </div>

                {/* Suspended Mass Selection or Manual Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Suspended Load:</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0.1"
                        max="10.0"
                        step="0.1"
                        value={mass}
                        onChange={(e) => {
                          setSelectedMysteryId("standard");
                          setMass(Math.min(15, Math.max(0.1, Number(e.target.value) || 0.1)));
                        }}
                        disabled={isRunning}
                        className="w-16 px-2 py-0.5 rounded-lg bg-muted border border-border text-sky-400 font-mono font-black text-right text-xs focus:border-sky-400 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">kg</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="5.0"
                    step="0.1"
                    value={mass}
                    onChange={(e) => {
                      setSelectedMysteryId("standard");
                      setMass(Number(e.target.value));
                    }}
                    disabled={isRunning}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                {/* Mystery Masses Quick Chips */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-bold text-muted-foreground">Mystery Mass Weighing Mode:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {MYSTERY_MASSES.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMysteryId(m.id)}
                        className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-0.5 cursor-pointer ${
                          selectedMysteryId === m.id
                            ? "border-primary bg-primary/10 shadow-2xs font-bold text-foreground"
                            : "border-border hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <Scale size={13} style={{ color: m.color }} />
                        <div className="text-[10px] truncate">{m.name.split(" ")[0]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Initial Displacement Stretch Slider + Manual Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Initial Release Stretch (x₀):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0.05"
                        max="1.5"
                        step="0.05"
                        value={initialDisplacement}
                        onChange={(e) => setInitialDisplacement(Math.min(1.8, Math.max(0.05, Number(e.target.value) || 0.1)))}
                        disabled={isRunning}
                        className="w-16 px-2 py-0.5 rounded-lg bg-muted border border-border text-emerald-500 font-mono font-black text-right text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">m</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.2"
                    step="0.05"
                    value={initialDisplacement}
                    onChange={(e) => setInitialDisplacement(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Viscous Damping Slider + Manual Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Viscous Damping (γ):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="0.5"
                        step="0.01"
                        value={damping}
                        onChange={(e) => setDamping(Math.min(1.0, Math.max(0, Number(e.target.value) || 0)))}
                        disabled={isRunning}
                        className="w-16 px-2 py-0.5 rounded-lg bg-muted border border-border text-amber-500 font-mono font-black text-right text-xs focus:border-amber-500 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">N·s/m</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.3"
                    step="0.01"
                    value={damping}
                    onChange={(e) => setDamping(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* ── TAB 2: MULTI-SPRING ARRANGEMENTS ── */}
            {activeConsoleTab === "multi-spring" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "single", label: "Single Spring", sub: "k_eff = k₁" },
                    { id: "parallel", label: "Parallel", sub: "k_eff = k₁ + k₂" },
                    { id: "series", label: "Series", sub: "1/k = 1/k₁ + 1/k₂" },
                  ].map((arr) => (
                    <button
                      key={arr.id}
                      type="button"
                      onClick={() => setArrangement(arr.id as SpringArrangement)}
                      className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                        arrangement === arr.id
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                          : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Layers size={15} />
                      <div className="text-xs font-bold">{arr.label}</div>
                      <div className="text-[9px] font-mono text-muted-foreground">{arr.sub}</div>
                    </button>
                  ))}
                </div>

                {arrangement !== "single" && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-muted-foreground">Spring 2 Constant (k₂):</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="5"
                            max="150"
                            step="1"
                            value={k2}
                            onChange={(e) => setK2(Math.min(200, Math.max(5, Number(e.target.value) || 5)))}
                            disabled={isRunning}
                            className="w-16 px-2 py-0.5 rounded-lg bg-muted border border-border text-cyan-400 font-mono font-black text-right text-xs focus:border-cyan-400 focus:outline-none"
                          />
                          <span className="text-xs font-mono font-bold text-muted-foreground">N/m</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        step="1"
                        value={k2}
                        onChange={(e) => setK2(Number(e.target.value))}
                        disabled={isRunning}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Planetary Gravity Selection */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <label className="text-xs font-bold text-foreground">Planetary Gravity Chamber:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PLANETARY_PRESETS.map((env) => (
                      <button
                        key={env.id}
                        type="button"
                        onClick={() => setSelectedEnvId(env.id)}
                        className={`p-2 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                          selectedEnvId === env.id
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                            : "border-border bg-card hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <RenderEnvIcon type={env.iconType} size={13} className="text-primary" />
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold truncate">{env.name.split(" ")[0]}</div>
                          <div className="text-[9px] font-mono text-muted-foreground">{env.gravity} m/s²</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 3: TELEMETRY & MULTI-PLOTS ── */}
            {activeConsoleTab === "telemetry" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl">
                    {[
                      { id: "x-t", label: "x(t) Wave" },
                      { id: "f-x", label: "F vs Δx (Slope = k)" },
                      { id: "energy", label: "Energy" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveGraphTab(tab.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          activeGraphTab === tab.id
                            ? "bg-card text-foreground shadow-2xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <canvas
                  ref={graphCanvasRef}
                  width={460}
                  height={170}
                  className="w-full h-[170px] rounded-2xl block border border-border"
                />

                {/* Energy Balance Split Bar */}
                <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-sky-400 font-bold">Elastic PE: {currentState.ue.toFixed(2)} J</span>
                    <span className="text-emerald-400 font-bold">KE: {currentState.ke.toFixed(2)} J</span>
                    <span className="text-foreground font-bold">Total: {currentState.totalE.toFixed(2)} J</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="bg-sky-400 transition-all duration-75"
                      style={{
                        width: `${Math.min(100, Math.max(0, (currentState.ue / (currentState.totalE || 1)) * 100))}%`,
                      }}
                    />
                    <div
                      className="bg-emerald-400 transition-all duration-75"
                      style={{
                        width: `${Math.min(100, Math.max(0, (currentState.ke / (currentState.totalE || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 4: GUIDED EXPERIMENTS ── */}
            {activeConsoleTab === "presets" && (
              <div className="space-y-2.5">
                {GUIDED_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="w-full p-3 bg-muted/40 border border-border hover:border-primary/50 hover:bg-muted/70 rounded-2xl text-left transition flex items-center justify-between gap-2 shadow-2xs group cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded bg-primary/10 text-primary text-[9px] font-mono font-bold">
                          {preset.tag}
                        </span>
                        <h4 className="text-xs font-black text-foreground group-hover:text-primary transition">
                          {preset.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">
                        {preset.subtitle}
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Live Kinematics Telemetry Grid (Docked in Right Column) ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Stretch (Δx)</span>
              <div className="text-base sm:text-lg font-black font-mono text-foreground mt-0.5">
                {currentState.x.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">m</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Restoring Force</span>
              <div className="text-base sm:text-lg font-black font-mono text-rose-500 mt-0.5">
                {Math.abs(currentState.fs).toFixed(1)} <span className="text-xs font-normal text-muted-foreground">N</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Effective k</span>
              <div className="text-base sm:text-lg font-black font-mono text-sky-400 mt-0.5">
                {effectiveK.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">N/m</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Frequency (f)</span>
              <div className="text-base sm:text-lg font-black font-mono text-emerald-400 mt-0.5">
                {theoreticalMetrics.frequency} <span className="text-xs font-normal text-muted-foreground">Hz</span>
              </div>
            </div>
          </div>

          {/* Daily Challenge Card */}
          <DailyChallengeCard
            labId="physics/hookelaw"
            currentParams={{
              springConstant: effectiveK,
              displacement: currentState.x,
              force: Math.abs(currentState.fs),
            }}
          />
        </div>
      </div>
    </div>
  );
}
