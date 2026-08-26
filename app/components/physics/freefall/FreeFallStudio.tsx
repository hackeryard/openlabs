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
  User,
  Disc,
  Feather,
} from "lucide-react";

// ── Environment Preset Definitions ─────────────────────────────────────
export type EnvIconType = "earth" | "vacuum" | "moon" | "mars" | "jupiter" | "custom";

export interface EnvironmentPreset {
  id: string;
  name: string;
  iconType: EnvIconType;
  gravity: number; // m/s^2
  airDensity: number; // kg/m^3
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
    airDensity: 1.225,
    color: "#3b82f6",
    skyGradient: ["#0f172a", "#1e293b"],
    description: "Standard terrestrial atmosphere ($1.225\\text{ kg/m}^3$) and nominal gravity ($9.81\\text{ m/s}^2$).",
  },
  {
    id: "vacuum",
    name: "Vacuum Chamber (Galileo)",
    iconType: "vacuum",
    gravity: 9.81,
    airDensity: 0.0,
    color: "#8b5cf6",
    skyGradient: ["#09090b", "#18181b"],
    description: "Pure Galilean free fall with zero aerodynamic drag. All masses fall with identical acceleration.",
  },
  {
    id: "moon",
    name: "Moon (Apollo 15)",
    iconType: "moon",
    gravity: 1.62,
    airDensity: 0.0,
    color: "#94a3b8",
    skyGradient: ["#050505", "#111827"],
    description: "Lunar vacuum where Commander David Scott dropped a falcon feather and steel hammer in 1971.",
  },
  {
    id: "mars",
    name: "Mars",
    iconType: "mars",
    gravity: 3.72,
    airDensity: 0.02,
    color: "#ef4444",
    skyGradient: ["#1c0a00", "#3b1408"],
    description: "Low surface gravity ($3.72\\text{ m/s}^2$) with a thin carbon dioxide atmosphere.",
  },
  {
    id: "jupiter",
    name: "Jupiter Cloud Tops",
    iconType: "jupiter",
    gravity: 24.79,
    airDensity: 1.33,
    color: "#f59e0b",
    skyGradient: ["#261505", "#451a03"],
    description: "Crushing gravity ($24.79\\text{ m/s}^2$) accelerating objects into rapid terminal velocity.",
  },
];

// Helper to render Environment Icon
function RenderEnvIcon({ type, size = 16, className = "" }: { type: EnvIconType; size?: number; className?: string }) {
  switch (type) {
    case "earth":
      return <Globe size={size} className={className} />;
    case "vacuum":
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

// ── Object Preset Definitions ──────────────────────────────────────────
export type ObjectIconType = "bowling_ball" | "feather" | "tennis_ball" | "skydiver" | "steel_bearing";

export interface ObjectPreset {
  id: string;
  name: string;
  iconType: ObjectIconType;
  mass: number; // kg
  radius: number; // m
  dragCoeff: number; // Cd
  restitution: number; // bounce elasticity [0..0.95]
  color: string;
  description: string;
}

export const OBJECT_PRESETS: ObjectPreset[] = [
  {
    id: "bowling_ball",
    name: "Bowling Ball",
    iconType: "bowling_ball",
    mass: 7.2,
    radius: 0.108,
    dragCoeff: 0.47,
    restitution: 0.35,
    color: "#38bdf8",
    description: "Dense rigid sphere with high mass-to-area ratio.",
  },
  {
    id: "feather",
    name: "Falcon Feather",
    iconType: "feather",
    mass: 0.005,
    radius: 0.07,
    dragCoeff: 1.45,
    restitution: 0.05,
    color: "#f43f5e",
    description: "Ultra-light flat vane dominated by aerodynamic drag.",
  },
  {
    id: "tennis_ball",
    name: "Tennis Ball",
    iconType: "tennis_ball",
    mass: 0.058,
    radius: 0.033,
    dragCoeff: 0.55,
    restitution: 0.75,
    color: "#84cc16",
    description: "Fuzzy sphere with high elasticity and moderate drag.",
  },
  {
    id: "skydiver",
    name: "Skydiver (Belly)",
    iconType: "skydiver",
    mass: 80.0,
    radius: 0.47,
    dragCoeff: 1.2,
    restitution: 0.0,
    color: "#eab308",
    description: "Human skydiver falling in belly-to-earth spread eagle orientation.",
  },
  {
    id: "steel_bearing",
    name: "Steel Bearing",
    iconType: "steel_bearing",
    mass: 0.5,
    radius: 0.025,
    dragCoeff: 0.47,
    restitution: 0.6,
    color: "#e2e8f0",
    description: "Compact heavy steel sphere with minimal drag cross-section.",
  },
];

// Helper to render Object Icon
function RenderObjectIcon({ type, size = 16, className = "" }: { type: ObjectIconType; size?: number; className?: string }) {
  switch (type) {
    case "bowling_ball":
      return <Circle size={size} className={className} />;
    case "feather":
      return <Wind size={size} className={className} />;
    case "tennis_ball":
      return <CircleDot size={size} className={className} />;
    case "skydiver":
      return <User size={size} className={className} />;
    case "steel_bearing":
      return <Disc size={size} className={className} />;
    default:
      return <Circle size={size} className={className} />;
  }
}

// ── Guided Discovery Presets ──────────────────────────────────────────
export interface GuidedPreset {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  env: string;
  initialHeight: number;
  initialVelocity: number;
  dualMode: boolean;
  objA: string;
  objB: string;
  customGravity?: number;
  customAirDensity?: number;
  explanation: string;
}

export const GUIDED_PRESETS: GuidedPreset[] = [
  {
    id: "galileo_vacuum",
    title: "Galileo's Pisa Experiment (Vacuum)",
    subtitle: "Do heavy and light bodies fall at the same rate in vacuum?",
    tag: "Fundamental",
    env: "vacuum",
    initialHeight: 50,
    initialVelocity: 0,
    dualMode: true,
    objA: "bowling_ball",
    objB: "feather",
    explanation: "In a pure vacuum without air resistance, gravitational acceleration is independent of object mass: a = g. Both feather and bowling ball hit simultaneously!",
  },
  {
    id: "air_drag_divergence",
    title: "Atmospheric Drag & Divergence",
    subtitle: "Bowling Ball vs Feather in Earth's Atmosphere",
    tag: "Fluid Dynamics",
    env: "earth",
    initialHeight: 50,
    initialVelocity: 0,
    dualMode: true,
    objA: "bowling_ball",
    objB: "feather",
    explanation: "Air resistance creates drag F_d = 0.5 * rho * Cd * A * v^2. The lightweight feather reaches terminal velocity almost instantly, while the bowling ball continues accelerating.",
  },
  {
    id: "apollo_15",
    title: "Apollo 15 Lunar Demonstration",
    subtitle: "Commander David Scott's Hammer & Feather on the Moon",
    tag: "Space Physics",
    env: "moon",
    initialHeight: 30,
    initialVelocity: 0,
    dualMode: true,
    objA: "steel_bearing",
    objB: "feather",
    explanation: "On the Moon (g = 1.62 m/s^2, rho = 0), Commander Scott proved Galileo's theorem on live television in August 1971 by dropping a geological hammer and feather together.",
  },
  {
    id: "skydiver_terminal",
    title: "Terminal Velocity of a Skydiver",
    subtitle: "Reaching Aerodynamic Equilibrium (a = 0)",
    tag: "Kinematics",
    env: "earth",
    initialHeight: 120,
    initialVelocity: 0,
    dualMode: false,
    objA: "skydiver",
    objB: "tennis_ball",
    explanation: "As speed increases, upward drag balances downward gravitational force (F_drag = mg). The net acceleration drops to zero, capping speed at terminal velocity (~54 m/s).",
  },
  {
    id: "vertical_toss",
    title: "Vertical Projectile Toss & Apex",
    subtitle: "Upward launch, deceleration, and momentary zero velocity",
    tag: "Motion Analysis",
    env: "earth",
    initialHeight: 10,
    initialVelocity: 25,
    dualMode: false,
    objA: "tennis_ball",
    objB: "bowling_ball",
    explanation: "When launched upward with initial velocity +25 m/s, gravity decelerates the projectile until velocity is exactly zero at maximum apex height, then reverses downward.",
  },
];

interface SimulationState {
  t: number;
  y: number;
  v: number;
  a: number;
  ke: number;
  pe: number;
  totalE: number;
  dragWork: number;
  impactCount: number;
}

export default function FreeFallStudio() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "physics/freefall",
    "physics",
    "simulation"
  );

  // ── Experiment Controls & Settings ──────────────────────────────────
  const [selectedEnvId, setSelectedEnvId] = useState<string>("earth");
  const [dualDropMode, setDualDropMode] = useState<boolean>(false);
  const [selectedObjAId, setSelectedObjAId] = useState<string>("bowling_ball");
  const [selectedObjBId, setSelectedObjBId] = useState<string>("feather");

  const [initialHeight, setInitialHeight] = useState<number>(50); // meters [5..150]
  const [initialVelocity, setInitialVelocity] = useState<number>(0); // m/s [-20..40]
  const [customGravity, setCustomGravity] = useState<number>(9.81);
  const [customAirDensity, setCustomAirDensity] = useState<number>(1.225);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0); // 0.2x, 0.5x, 1x, 2x

  // Visualizer Overlay Toggles
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showStrobe, setShowStrobe] = useState<boolean>(true);
  const [strobeInterval, setStrobeInterval] = useState<number>(0.35); // seconds
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"environment" | "payloads" | "graphs" | "experiments">("environment");
  const [activeGraphTab, setActiveGraphTab] = useState<"v-t" | "y-t" | "a-t" | "energy">("v-t");

  // Active Environment & Object Definitions
  const activeEnv = useMemo(() => {
    const preset = PLANETARY_PRESETS.find((p) => p.id === selectedEnvId);
    if (!preset) {
      return {
        id: "custom",
        name: "Custom Atmosphere",
        iconType: "custom" as EnvIconType,
        gravity: customGravity,
        airDensity: customAirDensity,
        color: "#06b6d4",
        skyGradient: ["#022c22", "#0f172a"] as [string, string],
        description: `Custom configured gravity (${customGravity} m/s²) and fluid density (${customAirDensity} kg/m³).`,
      };
    }
    return preset;
  }, [selectedEnvId, customGravity, customAirDensity]);

  const activeObjA = useMemo(() => {
    return OBJECT_PRESETS.find((o) => o.id === selectedObjAId) || OBJECT_PRESETS[0];
  }, [selectedObjAId]);

  const activeObjB = useMemo(() => {
    return OBJECT_PRESETS.find((o) => o.id === selectedObjBId) || OBJECT_PRESETS[1];
  }, [selectedObjBId]);

  // Terminal Velocity Theoretical Calculations
  const calculateTerminalVelocity = useCallback(
    (mass: number, radius: number, cd: number, g: number, rho: number) => {
      if (rho <= 0.0001 || cd <= 0.0001) return null; // No terminal velocity in vacuum
      const area = Math.PI * radius * radius;
      return Math.sqrt((2 * mass * g) / (rho * cd * area));
    },
    []
  );

  const terminalVelocityA = useMemo(() => {
    return calculateTerminalVelocity(
      activeObjA.mass,
      activeObjA.radius,
      activeObjA.dragCoeff,
      activeEnv.gravity,
      activeEnv.airDensity
    );
  }, [activeObjA, activeEnv, calculateTerminalVelocity]);

  const terminalVelocityB = useMemo(() => {
    return calculateTerminalVelocity(
      activeObjB.mass,
      activeObjB.radius,
      activeObjB.dragCoeff,
      activeEnv.gravity,
      activeEnv.airDensity
    );
  }, [activeObjB, activeEnv, calculateTerminalVelocity]);

  // ── Physics Numerical Solver State ──────────────────────────────────
  const [telemetryA, setTelemetryA] = useState<SimulationState>({
    t: 0,
    y: initialHeight,
    v: initialVelocity,
    a: -activeEnv.gravity,
    ke: 0,
    pe: activeObjA.mass * activeEnv.gravity * initialHeight,
    totalE: activeObjA.mass * activeEnv.gravity * initialHeight,
    dragWork: 0,
    impactCount: 0,
  });

  const [telemetryB, setTelemetryB] = useState<SimulationState>({
    t: 0,
    y: initialHeight,
    v: initialVelocity,
    a: -activeEnv.gravity,
    ke: 0,
    pe: activeObjB.mass * activeEnv.gravity * initialHeight,
    totalE: activeObjB.mass * activeEnv.gravity * initialHeight,
    dragWork: 0,
    impactCount: 0,
  });

  // History buffer for graphing
  const historyRefA = useRef<{ t: number; y: number; v: number; a: number; ke: number; pe: number; totalE: number }[]>([]);
  const historyRefB = useRef<{ t: number; y: number; v: number; a: number; ke: number; pe: number; totalE: number }[]>([]);
  const strobeGhostRefA = useRef<{ y: number; t: number; v: number }[]>([]);
  const strobeGhostRefB = useRef<{ y: number; t: number; v: number }[]>([]);

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const nextStrobeTimeRef = useRef<number>(strobeInterval);

  // Synchronize AI Chatbot context
  useEffect(() => {
    setExperimentData({
      title: "Free Fall & Terminal Velocity Physics Studio",
      theory: `Galileo's Free Fall in vacuum: y(t) = y_0 + v_0 t - 0.5 g t^2, a = -g. In fluid atmosphere: F_drag = 0.5 * rho * C_d * A * v^2, v_t = sqrt(2mg / (rho * C_d * A)).`,
      extraContext: `Environment: ${activeEnv.name} (g = ${activeEnv.gravity} m/s^2, air density = ${activeEnv.airDensity} kg/m^3). Object A: ${activeObjA.name} (Mass = ${activeObjA.mass} kg, Cd = ${activeObjA.dragCoeff}). Height: ${initialHeight}m, v0: ${initialVelocity} m/s.`,
    });
  }, [activeEnv, activeObjA, initialHeight, initialVelocity, setExperimentData]);

  // Reset Simulation
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);

    const initialPE_A = activeObjA.mass * activeEnv.gravity * initialHeight;
    const initialKE_A = 0.5 * activeObjA.mass * initialVelocity * initialVelocity;
    const initialPE_B = activeObjB.mass * activeEnv.gravity * initialHeight;
    const initialKE_B = 0.5 * activeObjB.mass * initialVelocity * initialVelocity;

    setTelemetryA({
      t: 0,
      y: initialHeight,
      v: initialVelocity,
      a: -activeEnv.gravity,
      ke: initialKE_A,
      pe: initialPE_A,
      totalE: initialPE_A + initialKE_A,
      dragWork: 0,
      impactCount: 0,
    });

    setTelemetryB({
      t: 0,
      y: initialHeight,
      v: initialVelocity,
      a: -activeEnv.gravity,
      ke: initialKE_B,
      pe: initialPE_B,
      totalE: initialPE_B + initialKE_B,
      dragWork: 0,
      impactCount: 0,
    });

    historyRefA.current = [{ t: 0, y: initialHeight, v: initialVelocity, a: -activeEnv.gravity, ke: initialKE_A, pe: initialPE_A, totalE: initialPE_A + initialKE_A }];
    historyRefB.current = [{ t: 0, y: initialHeight, v: initialVelocity, a: -activeEnv.gravity, ke: initialKE_B, pe: initialPE_B, totalE: initialPE_B + initialKE_B }];
    strobeGhostRefA.current = [{ y: initialHeight, t: 0, v: initialVelocity }];
    strobeGhostRefB.current = [{ y: initialHeight, t: 0, v: initialVelocity }];
    nextStrobeTimeRef.current = strobeInterval;
  }, [activeEnv, activeObjA, activeObjB, initialHeight, initialVelocity, strobeInterval]);

  // Handle Preset Selection
  const handleApplyPreset = (preset: GuidedPreset) => {
    setSelectedEnvId(preset.env);
    if (preset.customGravity) setCustomGravity(preset.customGravity);
    if (preset.customAirDensity !== undefined) setCustomAirDensity(preset.customAirDensity);
    setInitialHeight(preset.initialHeight);
    setInitialVelocity(preset.initialVelocity);
    setDualDropMode(preset.dualMode);
    setSelectedObjAId(preset.objA);
    setSelectedObjBId(preset.objB);
    setTimeout(() => handleReset(), 50);
  };

  // Reset when key parameters change while stopped
  useEffect(() => {
    if (!isRunning) {
      handleReset();
    }
  }, [initialHeight, initialVelocity, selectedEnvId, selectedObjAId, selectedObjBId, customGravity, customAirDensity, handleReset, isRunning]);

  // ── Physics Integration Loop (RK4 / Substepping) ─────────────────────
  useEffect(() => {
    if (!isRunning || isPaused) return;

    let localStateA = { ...telemetryA };
    let localStateB = { ...telemetryB };
    lastTimeRef.current = performance.now();

    const g = activeEnv.gravity;
    const rho = activeEnv.airDensity;

    // Aerodynamic Acceleration Function: a(v) = -g - sign(v) * (0.5 * rho * Cd * A * v^2) / m
    const computeAcceleration = (v: number, mass: number, radius: number, cd: number) => {
      const area = Math.PI * radius * radius;
      const dragMagnitude = 0.5 * rho * cd * area * v * v;
      const dragDir = v >= 0 ? -1 : 1; // Drag opposes instantaneous velocity vector
      const netForce = -mass * g + dragDir * dragMagnitude;
      return netForce / mass;
    };

    const stepSimulation = (now: number) => {
      const realDt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // Sub-stepping for smooth numerical integration
      const subSteps = 10;
      const dt = (realDt * playbackSpeed) / subSteps;

      for (let s = 0; s < subSteps; s++) {
        // Integrate Object A
        if (localStateA.y > 0 || localStateA.v > 0) {
          const a1 = computeAcceleration(localStateA.v, activeObjA.mass, activeObjA.radius, activeObjA.dragCoeff);
          localStateA.v += a1 * dt;
          localStateA.y += localStateA.v * dt;
          localStateA.t += dt;
          localStateA.a = a1;

          // Ground Collision Check for Object A
          if (localStateA.y <= 0) {
            localStateA.y = 0;
            localStateA.impactCount += 1;
            if (activeObjA.restitution > 0.05 && Math.abs(localStateA.v) > 0.5) {
              localStateA.v = -localStateA.v * activeObjA.restitution;
            } else {
              localStateA.v = 0;
              localStateA.a = 0;
            }
          }
        }

        // Integrate Object B (if in Dual Mode)
        if (dualDropMode && (localStateB.y > 0 || localStateB.v > 0)) {
          const a2 = computeAcceleration(localStateB.v, activeObjB.mass, activeObjB.radius, activeObjB.dragCoeff);
          localStateB.v += a2 * dt;
          localStateB.y += localStateB.v * dt;
          localStateB.t += dt;
          localStateB.a = a2;

          // Ground Collision Check for Object B
          if (localStateB.y <= 0) {
            localStateB.y = 0;
            localStateB.impactCount += 1;
            if (activeObjB.restitution > 0.05 && Math.abs(localStateB.v) > 0.5) {
              localStateB.v = -localStateB.v * activeObjB.restitution;
            } else {
              localStateB.v = 0;
              localStateB.a = 0;
            }
          }
        }

        // Check Stroboscopic Flash Recording
        if (localStateA.t >= nextStrobeTimeRef.current) {
          strobeGhostRefA.current.push({ y: localStateA.y, t: localStateA.t, v: localStateA.v });
          if (dualDropMode) {
            strobeGhostRefB.current.push({ y: localStateB.y, t: localStateB.t, v: localStateB.v });
          }
          nextStrobeTimeRef.current += strobeInterval;
        }
      }

      // Energy Telemetry Computation
      const peA = activeObjA.mass * g * Math.max(0, localStateA.y);
      const keA = 0.5 * activeObjA.mass * localStateA.v * localStateA.v;
      localStateA.pe = peA;
      localStateA.ke = keA;
      localStateA.totalE = peA + keA;

      const peB = activeObjB.mass * g * Math.max(0, localStateB.y);
      const keB = 0.5 * activeObjB.mass * localStateB.v * localStateB.v;
      localStateB.pe = peB;
      localStateB.ke = keB;
      localStateB.totalE = peB + keB;

      // Update State & History Buffers
      setTelemetryA({ ...localStateA });
      setTelemetryB({ ...localStateB });

      historyRefA.current.push({
        t: Number(localStateA.t.toFixed(3)),
        y: Number(localStateA.y.toFixed(3)),
        v: Number(localStateA.v.toFixed(3)),
        a: Number(localStateA.a.toFixed(3)),
        ke: Number(localStateA.ke.toFixed(2)),
        pe: Number(localStateA.pe.toFixed(2)),
        totalE: Number(localStateA.totalE.toFixed(2)),
      });

      if (dualDropMode) {
        historyRefB.current.push({
          t: Number(localStateB.t.toFixed(3)),
          y: Number(localStateB.y.toFixed(3)),
          v: Number(localStateB.v.toFixed(3)),
          a: Number(localStateB.a.toFixed(3)),
          ke: Number(localStateB.ke.toFixed(2)),
          pe: Number(localStateB.pe.toFixed(2)),
          totalE: Number(localStateB.totalE.toFixed(2)),
        });
      }

      // Complete Lab XP Trigger on Ground Landing
      if (localStateA.y <= 0 && (!dualDropMode || localStateB.y <= 0)) {
        if (Math.abs(localStateA.v) < 0.1 && (!dualDropMode || Math.abs(localStateB.v) < 0.1)) {
          setIsRunning(false);
          completeExperiment();
          return;
        }
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
    activeEnv,
    activeObjA,
    activeObjB,
    dualDropMode,
    playbackSpeed,
    strobeInterval,
    completeExperiment,
  ]);

  // ── Render Simulation Canvas ──────────────────────────────────────────
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

      // 1. Sky & Atmospheric Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, activeEnv.skyGradient[0]);
      skyGrad.addColorStop(1, activeEnv.skyGradient[1]);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Starfield for Space/Vacuum
      if (activeEnv.id === "moon" || activeEnv.id === "vacuum") {
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        for (let i = 0; i < 45; i++) {
          const sx = ((i * 97) % (w - 20)) + 10;
          const sy = ((i * 73) % (h - 100)) + 10;
          ctx.fillRect(sx, sy, 1.5, 1.5);
        }
      }

      // 2. Coordinate System Layout
      const groundMargin = 60;
      const topMargin = 50;
      const maxVisualHeight = Math.max(initialHeight * 1.15, 20);
      const visualTowerH = h - groundMargin - topMargin;
      const pxPerMeter = visualTowerH / maxVisualHeight;

      // Drop Channels (Chamber A & Chamber B)
      const chamberAX = dualDropMode ? w * 0.35 : w * 0.5;
      const chamberBX = w * 0.68;

      // 3. Grid & Altitude Ruler Tape
      if (showGrid) {
        const rulerX = dualDropMode ? w * 0.12 : w * 0.16;

        // Ruler Line
        ctx.beginPath();
        ctx.moveTo(rulerX, topMargin);
        ctx.lineTo(rulerX, h - groundMargin);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const stepMeters = maxVisualHeight > 100 ? 20 : maxVisualHeight > 40 ? 10 : 5;
        for (let m = 0; m <= maxVisualHeight; m += stepMeters) {
          const yPx = h - groundMargin - m * pxPerMeter;
          if (yPx < topMargin - 5) continue;

          ctx.beginPath();
          ctx.moveTo(rulerX - 5, yPx);
          ctx.lineTo(rulerX + 5, yPx);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
          ctx.stroke();

          ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "right";
          ctx.fillText(`${m}m`, rulerX - 8, yPx + 3);

          // Horizontal grid line across canvas
          ctx.beginPath();
          ctx.moveTo(rulerX + 10, yPx);
          ctx.lineTo(w - 20, yPx);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
          ctx.stroke();
        }
      }

      // 4. Ground Surface & Landing Platform
      const groundY = h - groundMargin;
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, h);
      groundGrad.addColorStop(0, "#1e293b");
      groundGrad.addColorStop(1, "#0f172a");
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, w, groundMargin);

      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(w, groundY);
      ctx.stroke();

      // Launch Platforms
      const launchY = h - groundMargin - initialHeight * pxPerMeter;
      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      ctx.fillRect(chamberAX - 30, launchY - 3, 60, 6);
      if (dualDropMode) {
        ctx.fillRect(chamberBX - 30, launchY - 3, 60, 6);
      }

      // Helper function to render a falling object using clean vector graphics
      const renderObject = (
        state: SimulationState,
        obj: ObjectPreset,
        xPos: number,
        strobeGhosts: { y: number; t: number; v: number }[],
        label: string
      ) => {
        const objYPx = h - groundMargin - state.y * pxPerMeter;
        const radiusPx = Math.max(8, Math.min(26, obj.radius * pxPerMeter * 8));

        // Stroboscopic Ghost Flashes
        if (showStrobe) {
          strobeGhosts.forEach((ghost) => {
            const gyPx = h - groundMargin - ghost.y * pxPerMeter;
            ctx.fillStyle = `${obj.color}20`;
            ctx.strokeStyle = `${obj.color}50`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(xPos, gyPx, radiusPx * 0.75, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Small time tag
            ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
            ctx.font = "8px monospace";
            ctx.textAlign = "center";
            ctx.fillText(`${ghost.t.toFixed(1)}s`, xPos + radiusPx + 14, gyPx + 3);
          });
        }

        // Ground Contact Shadow
        const shadowDist = Math.max(0, state.y);
        const shadowScale = Math.max(0.1, 1 - shadowDist / 40);
        const shadowAlpha = Math.max(0.05, 0.35 - shadowDist / 30);
        ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
        ctx.beginPath();
        ctx.ellipse(xPos, groundY + 3, radiusPx * shadowScale * 1.4, 4 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Object Body Vector Drawing with Spherical Gradient
        const sphereGrad = ctx.createRadialGradient(
          xPos - radiusPx * 0.3,
          objYPx - radiusPx * 0.3,
          radiusPx * 0.1,
          xPos,
          objYPx,
          radiusPx
        );
        sphereGrad.addColorStop(0, "#ffffff");
        sphereGrad.addColorStop(0.3, obj.color);
        sphereGrad.addColorStop(1, "#020617");

        ctx.shadowColor = obj.color;
        ctx.shadowBlur = isRunning ? 10 : 4;
        ctx.fillStyle = sphereGrad;
        ctx.beginPath();
        ctx.arc(xPos, objYPx, radiusPx, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Object Label & Speed Badge
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(label, xPos, objYPx - radiusPx - 10);

        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.font = "9px monospace";
        ctx.fillText(`${Math.abs(state.v).toFixed(1)} m/s`, xPos, objYPx + radiusPx + 14);

        // Force & Kinematic Vectors Overlay
        if (showVectors && isRunning) {
          // A. Gravity Vector (Blue Downward)
          const gVectorLen = Math.min(45, activeEnv.gravity * 2.2);
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(xPos, objYPx);
          ctx.lineTo(xPos, objYPx + gVectorLen);
          ctx.stroke();

          // B. Velocity Vector (Emerald)
          if (Math.abs(state.v) > 0.5) {
            const vVectorLen = Math.min(60, Math.abs(state.v) * 1.4);
            const vDir = state.v < 0 ? 1 : -1;
            ctx.strokeStyle = "#10b981";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(xPos - 10, objYPx);
            ctx.lineTo(xPos - 10, objYPx + vVectorLen * vDir);
            ctx.stroke();
          }

          // C. Aerodynamic Drag Vector (Rose Upward)
          if (activeEnv.airDensity > 0 && Math.abs(state.v) > 1) {
            const area = Math.PI * obj.radius * obj.radius;
            const dragForce = 0.5 * activeEnv.airDensity * obj.dragCoeff * area * state.v * state.v;
            const dragVectorLen = Math.min(55, dragForce * 0.7);
            const dragDir = state.v < 0 ? -1 : 1;

            ctx.strokeStyle = "#f43f5e";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(xPos + 10, objYPx);
            ctx.lineTo(xPos + 10, objYPx + dragVectorLen * dragDir);
            ctx.stroke();
          }
        }
      };

      // Draw Chamber A
      renderObject(telemetryA, activeObjA, chamberAX, strobeGhostRefA.current, activeObjA.name);

      // Draw Chamber B (if Dual Mode)
      if (dualDropMode) {
        renderObject(telemetryB, activeObjB, chamberBX, strobeGhostRefB.current, activeObjB.name);
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [
    activeEnv,
    activeObjA,
    activeObjB,
    dualDropMode,
    initialHeight,
    isRunning,
    showGrid,
    showStrobe,
    showVectors,
    telemetryA,
    telemetryB,
  ]);

  // ── Render Telemetry Charts Canvas ────────────────────────────────────
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const dataA = historyRefA.current;
    const dataB = historyRefB.current;
    if (dataA.length === 0) return;

    const padX = 40;
    const padY = 25;
    const graphW = w - padX - 15;
    const graphH = h - padY - 20;

    // Background & Box
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.strokeRect(padX, padY, graphW, graphH);

    // Compute Extents
    const maxT = Math.max(dataA[dataA.length - 1]?.t || 1, 2);

    let minY = 0;
    let maxY = 100;

    if (activeGraphTab === "y-t") {
      minY = 0;
      maxY = Math.max(initialHeight * 1.1, 10);
    } else if (activeGraphTab === "v-t") {
      const allV = dataA.map((d) => Math.abs(d.v)).concat(dualDropMode ? dataB.map((d) => Math.abs(d.v)) : []);
      maxY = Math.max(...allV, terminalVelocityA || 20, 10) * 1.1;
      minY = 0;
    } else if (activeGraphTab === "a-t") {
      const allA = dataA.map((d) => Math.abs(d.a)).concat(dualDropMode ? dataB.map((d) => Math.abs(d.a)) : []);
      maxY = Math.max(...allA, activeEnv.gravity * 1.2, 5);
      minY = 0;
    } else if (activeGraphTab === "energy") {
      const allE = dataA.map((d) => d.totalE).concat(dualDropMode ? dataB.map((d) => d.totalE) : []);
      maxY = Math.max(...allE, 100) * 1.15;
      minY = 0;
    }

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "8px monospace";
    ctx.textAlign = "right";

    for (let i = 0; i <= 4; i++) {
      const val = minY + (i / 4) * (maxY - minY);
      const yPx = padY + graphH - (i / 4) * graphH;

      ctx.beginPath();
      ctx.moveTo(padX, yPx);
      ctx.lineTo(padX + graphW, yPx);
      ctx.stroke();

      ctx.fillText(val.toFixed(val > 100 ? 0 : 1), padX - 5, yPx + 3);
    }

    ctx.textAlign = "center";
    for (let i = 0; i <= 5; i++) {
      const tVal = (i / 5) * maxT;
      const xPx = padX + (i / 5) * graphW;

      ctx.beginPath();
      ctx.moveTo(xPx, padY);
      ctx.lineTo(xPx, padY + graphH);
      ctx.stroke();

      ctx.fillText(`${tVal.toFixed(1)}s`, xPx, padY + graphH + 12);
    }

    // Terminal velocity asymptote line
    if (activeGraphTab === "v-t" && terminalVelocityA) {
      const vtYPx = padY + graphH - (terminalVelocityA / maxY) * graphH;
      ctx.strokeStyle = "rgba(244, 63, 94, 0.6)";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(padX, vtYPx);
      ctx.lineTo(padX + graphW, vtYPx);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#f43f5e";
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`v_t = ${terminalVelocityA.toFixed(1)} m/s`, padX + 6, vtYPx - 3);
    }

    // Helper to plot curve
    const plotCurve = (history: typeof dataA, extractor: (d: (typeof dataA)[0]) => number, color: string) => {
      if (history.length === 0) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      history.forEach((d, idx) => {
        const xPx = padX + (d.t / maxT) * graphW;
        const val = extractor(d);
        const yPx = padY + graphH - (Math.max(0, val - minY) / (maxY - minY)) * graphH;

        if (idx === 0) ctx.moveTo(xPx, yPx);
        else ctx.lineTo(xPx, yPx);
      });
      ctx.stroke();
    };

    if (activeGraphTab === "y-t") {
      plotCurve(dataA, (d) => d.y, activeObjA.color);
      if (dualDropMode) plotCurve(dataB, (d) => d.y, activeObjB.color);
    } else if (activeGraphTab === "v-t") {
      plotCurve(dataA, (d) => Math.abs(d.v), activeObjA.color);
      if (dualDropMode) plotCurve(dataB, (d) => Math.abs(d.v), activeObjB.color);
    } else if (activeGraphTab === "a-t") {
      plotCurve(dataA, (d) => Math.abs(d.a), activeObjA.color);
      if (dualDropMode) plotCurve(dataB, (d) => Math.abs(d.a), activeObjB.color);
    } else if (activeGraphTab === "energy") {
      plotCurve(dataA, (d) => d.pe, "#38bdf8");
      plotCurve(dataA, (d) => d.ke, "#10b981");
      plotCurve(dataA, (d) => d.totalE, "#e2e8f0");
    }
  }, [activeGraphTab, activeEnv, activeObjA, activeObjB, dualDropMode, initialHeight, telemetryA, terminalVelocityA]);

  // Export Data to CSV
  const handleExportCSV = () => {
    const rows = [["Time (s)", "Height A (m)", "Velocity A (m/s)", "Accel A (m/s2)", "PE A (J)", "KE A (J)"]];
    historyRefA.current.forEach((d) => {
      rows.push([d.t.toString(), d.y.toString(), d.v.toString(), d.a.toString(), d.pe.toString(), d.ke.toString()]);
    });
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `freefall_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-5 lg:p-6 space-y-5">
      {/* ── Executive Header & Action Bar ──────────────────────────── */}
      <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-2xl bg-primary/10 text-primary">
              <Compass size={22} />
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
              Free Fall & Terminal Velocity Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-mono font-bold">
              Physics Simulation
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Kinematic acceleration in vacuum vs fluid drag and terminal velocity across planetary bodies.
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
                <span>Drop Object</span>
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
            title="Reset Simulation"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-card border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition cursor-pointer"
            title="Export Telemetry CSV"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace: Central Stage + Control Deck ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left / Center Column: Drop Chamber Visualizer (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
            {/* Top Canvas Floating HUD Badges */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/10 flex items-center gap-1.5">
                <RenderEnvIcon type={activeEnv.iconType} size={13} className="text-primary" />
                <span>{activeEnv.name.split(" ")[0]}</span>
                <span className="text-primary font-mono text-[11px]">({activeEnv.gravity} m/s²)</span>
              </span>

              {activeEnv.airDensity === 0 && (
                <span className="px-2.5 py-1 bg-purple-950/80 backdrop-blur-md rounded-full text-purple-300 text-[10px] font-mono font-black border border-purple-500/30">
                  VACUUM
                </span>
              )}
            </div>

            {/* Quick Overlays Toggle Bar */}
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
                onClick={() => setShowStrobe(!showStrobe)}
                className={`px-2 py-0.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                  showStrobe ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white"
                }`}
              >
                Strobe
              </button>
              <button
                type="button"
                onClick={() => setDualDropMode(!dualDropMode)}
                className={`px-2 py-0.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                  dualDropMode ? "bg-amber-500 text-black font-black" : "text-white/70 hover:text-white"
                }`}
              >
                Dual Drop
              </button>
            </div>

            {/* Simulation Canvas */}
            <canvas
              ref={canvasRef}
              width={700}
              height={480}
              className="w-full h-[380px] sm:h-[460px] block"
            />

            {/* Bottom Playback Bar */}
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

              {/* Time Counter */}
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-muted-foreground font-bold text-[11px]">Time:</span>
                <span className="font-black text-foreground bg-muted px-2 py-0.5 rounded-md">
                  {telemetryA.t.toFixed(2)}s
                </span>
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
                { id: "environment", label: "World & Gravity", icon: Globe },
                { id: "payloads", label: "Objects", icon: Layers },
                { id: "graphs", label: "Telemetry", icon: Activity },
                { id: "experiments", label: "Presets", icon: Sparkles },
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

            {/* ── TAB 1: ENVIRONMENT & GRAVITY ── */}
            {activeConsoleTab === "environment" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PLANETARY_PRESETS.map((env) => (
                    <button
                      key={env.id}
                      type="button"
                      onClick={() => setSelectedEnvId(env.id)}
                      className={`p-2.5 rounded-2xl border text-left transition flex items-center gap-2 cursor-pointer ${
                        selectedEnvId === env.id
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                          : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                        <RenderEnvIcon type={env.iconType} size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{env.name.split(" ")[0]}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">{env.gravity} m/s²</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Drop Height & Initial Velocity Sliders + Manual Inputs */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-muted-foreground">Drop Height:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          max="250"
                          step="1"
                          value={initialHeight}
                          onChange={(e) => setInitialHeight(Math.min(300, Math.max(1, Number(e.target.value) || 5)))}
                          disabled={isRunning}
                          className="w-16 px-2 py-0.5 rounded-lg bg-muted border border-border text-foreground font-mono font-black text-right text-xs focus:border-primary focus:outline-none"
                        />
                        <span className="text-xs font-mono font-bold text-muted-foreground">m</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="150"
                      step="1"
                      value={initialHeight}
                      onChange={(e) => setInitialHeight(Number(e.target.value))}
                      disabled={isRunning}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-muted-foreground">Initial Velocity:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="-50"
                          max="60"
                          step="1"
                          value={initialVelocity}
                          onChange={(e) => setInitialVelocity(Math.min(60, Math.max(-50, Number(e.target.value) || 0)))}
                          disabled={isRunning}
                          className="w-16 px-2 py-0.5 rounded-lg bg-muted border border-border text-primary font-mono font-black text-right text-xs focus:border-primary focus:outline-none"
                        />
                        <span className="text-xs font-mono font-bold text-muted-foreground">m/s</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="-20"
                      max="40"
                      step="1"
                      value={initialVelocity}
                      onChange={(e) => setInitialVelocity(Number(e.target.value))}
                      disabled={isRunning}
                      className="w-full accent-primary cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                      <span>-20 m/s (Downward)</span>
                      <span>0 m/s (Rest)</span>
                      <span>+40 m/s (Upward)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-muted/40 border border-border text-xs space-y-1">
                  <div className="font-bold text-foreground flex items-center justify-between">
                    <span>{activeEnv.name}</span>
                    <span className="font-mono text-primary font-bold">ρ = {activeEnv.airDensity} kg/m³</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {activeEnv.description}
                  </p>
                </div>
              </div>
            )}

            {/* ── TAB 2: OBJECTS & DUAL DROP ── */}
            {activeConsoleTab === "payloads" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span>Object A: {activeObjA.name}</span>
                    <span className="font-mono text-primary text-[11px]">Mass: {activeObjA.mass} kg</span>
                  </label>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {OBJECT_PRESETS.map((obj) => (
                      <button
                        key={obj.id}
                        type="button"
                        onClick={() => setSelectedObjAId(obj.id)}
                        className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                          selectedObjAId === obj.id
                            ? "border-primary bg-primary/10 shadow-2xs font-bold text-foreground"
                            : "border-border hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <RenderObjectIcon type={obj.iconType} size={15} className="text-primary" />
                        <div className="text-[10px] truncate">{obj.name.split(" ")[0]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {dualDropMode && (
                  <div className="space-y-2 pt-3 border-t border-border">
                    <label className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span>Object B (Chamber 2): {activeObjB.name}</span>
                      <span className="font-mono text-amber-500 text-[11px]">Mass: {activeObjB.mass} kg</span>
                    </label>

                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {OBJECT_PRESETS.map((obj) => (
                        <button
                          key={obj.id}
                          type="button"
                          onClick={() => setSelectedObjBId(obj.id)}
                          className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                            selectedObjBId === obj.id
                              ? "border-amber-500 bg-amber-500/10 shadow-2xs font-bold text-amber-600 dark:text-amber-400"
                              : "border-border hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          <RenderObjectIcon type={obj.iconType} size={15} className="text-amber-500" />
                          <div className="text-[10px] truncate">{obj.name.split(" ")[0]}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: TELEMETRY PLOTS ── */}
            {activeConsoleTab === "graphs" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl">
                    {[
                      { id: "v-t", label: "v(t)" },
                      { id: "y-t", label: "y(t)" },
                      { id: "a-t", label: "a(t)" },
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
                  height={180}
                  className="w-full h-[180px] rounded-2xl block border border-border"
                />

                {/* Energy Bar Indicator */}
                <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-sky-400 font-bold">PE: {telemetryA.pe.toFixed(0)} J</span>
                    <span className="text-emerald-400 font-bold">KE: {telemetryA.ke.toFixed(0)} J</span>
                    <span className="text-foreground font-bold">Total: {telemetryA.totalE.toFixed(0)} J</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="bg-sky-400 transition-all duration-75"
                      style={{
                        width: `${Math.min(100, Math.max(0, (telemetryA.pe / (telemetryA.totalE || 1)) * 100))}%`,
                      }}
                    />
                    <div
                      className="bg-emerald-400 transition-all duration-75"
                      style={{
                        width: `${Math.min(100, Math.max(0, (telemetryA.ke / (telemetryA.totalE || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 4: GUIDED EXPERIMENTS ── */}
            {activeConsoleTab === "experiments" && (
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

          {/* ── Live Kinematics Metric Bar (Docked in Right Column) ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Altitude</span>
              <div className="text-base sm:text-lg font-black font-mono text-foreground mt-0.5">
                {telemetryA.y.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">m</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Velocity</span>
              <div className="text-base sm:text-lg font-black font-mono text-emerald-500 mt-0.5">
                {Math.abs(telemetryA.v).toFixed(1)} <span className="text-xs font-normal text-muted-foreground">m/s</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Acceleration</span>
              <div className="text-base sm:text-lg font-black font-mono text-sky-500 mt-0.5">
                {Math.abs(telemetryA.a).toFixed(1)} <span className="text-xs font-normal text-muted-foreground">m/s²</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Terminal Speed</span>
              <div className="text-base sm:text-lg font-black font-mono text-rose-500 mt-0.5">
                {terminalVelocityA ? `${terminalVelocityA.toFixed(1)} m/s` : "∞ (Vacuum)"}
              </div>
            </div>
          </div>

          {/* Daily Challenge Card Integration */}
          <DailyChallengeCard
            labId="physics/freefall"
            currentParams={{
              height: Number(telemetryA.y.toFixed(1)),
              velocity: Number(Math.abs(telemetryA.v).toFixed(1)),
              time: Number(telemetryA.t.toFixed(1)),
            }}
          />
        </div>
      </div>
    </div>
  );
}
