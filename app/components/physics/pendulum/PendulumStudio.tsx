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
} from "lucide-react";

// ── Environment Preset Definitions ─────────────────────────────────────
export type EnvIconType = "earth" | "vacuum" | "moon" | "mars" | "jupiter" | "custom";

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
    description: "Standard terrestrial gravity ($g = 9.81\\text{ m/s}^2$). Reference baseline for harmonic oscillation.",
  },
  {
    id: "moon",
    name: "Moon (Apollo 15)",
    iconType: "moon",
    gravity: 1.62,
    color: "#94a3b8",
    skyGradient: ["#050505", "#111827"],
    description: "Lunar gravity ($g = 1.62\\text{ m/s}^2$) elongating the period by a factor of $\\sqrt{9.81/1.62} \\approx 2.46\\times$.",
  },
  {
    id: "mars",
    name: "Mars",
    iconType: "mars",
    gravity: 3.72,
    color: "#ef4444",
    skyGradient: ["#1c0a00", "#3b1408"],
    description: "Martian gravity ($g = 3.72\\text{ m/s}^2$) providing moderately slower harmonic oscillations.",
  },
  {
    id: "jupiter",
    name: "Jupiter Cloud Tops",
    iconType: "jupiter",
    gravity: 24.79,
    color: "#f59e0b",
    skyGradient: ["#261505", "#451a03"],
    description: "Crushing jovian gravity ($g = 24.79\\text{ m/s}^2$) creating rapid high-frequency oscillations.",
  },
  {
    id: "vacuum",
    name: "Vacuum Lab (Zero Damping)",
    iconType: "vacuum",
    gravity: 9.81,
    color: "#8b5cf6",
    skyGradient: ["#09090b", "#18181b"],
    description: "Pure lossless harmonic oscillator preserving exact mechanical energy indefinitely.",
  },
];

// Helper to render Environment Icon
function RenderEnvIcon({ type, size = 15, className = "" }: { type: EnvIconType; size?: number; className?: string }) {
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

// ── Guided Discovery Presets ──────────────────────────────────────────
export interface GuidedPreset {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  env: string;
  length: number;
  mass: number;
  angleDeg: number;
  damping: number;
  explanation: string;
}

export const GUIDED_PRESETS: GuidedPreset[] = [
  {
    id: "small_angle_parity",
    title: "Small-Angle Harmonic Approximation (θ ≤ 15°)",
    subtitle: "Testing the linear restoring force approximation sin(θ) ≈ θ",
    tag: "Fundamental",
    env: "earth",
    length: 1.0,
    mass: 1.0,
    angleDeg: 12,
    damping: 0.0,
    explanation: "For small displacements (θ ≤ 15°), sin(θ) ≈ θ (in radians) with error < 1%. The motion simplifies to pure Simple Harmonic Motion with period T = 2π√(L/g) = 2.006s.",
  },
  {
    id: "large_angle_nonlinearity",
    title: "Large-Angle Non-Linearity (θ = 90°)",
    subtitle: "Observing period elongation from exact elliptic integrals",
    tag: "Nonlinear",
    env: "earth",
    length: 1.0,
    mass: 1.0,
    angleDeg: 90,
    damping: 0.0,
    explanation: "At 90° release angle, the true period T ≈ T0(1 + 1/4 sin²(θ/2) + 9/64 sin⁴(θ/2)) ≈ 1.18 T0. The pendulum takes ~18% longer to complete each swing than SHM predicts.",
  },
  {
    id: "lunar_slow_motion",
    title: "Apollo 15 Lunar Gravity Demonstration",
    subtitle: "Oscillation period scaling inversely with √g",
    tag: "Space Physics",
    env: "moon",
    length: 1.0,
    mass: 1.0,
    angleDeg: 25,
    damping: 0.0,
    explanation: "In Moon's 1/6th gravity (1.62 m/s²), the pendulum period increases from ~2.01s to ~4.94s (a 2.46× multiplier), producing graceful slow-motion oscillation.",
  },
  {
    id: "damped_decay",
    title: "Damped Harmonic Decay & Phase Spiral",
    subtitle: "Exponential amplitude decay and phase-space inward spiral",
    tag: "Damped Systems",
    env: "earth",
    length: 1.2,
    mass: 0.8,
    angleDeg: 45,
    damping: 0.15,
    explanation: "Viscous air resistance introduces damping force -b(dθ/dt), causing amplitude to decay exponentially as e^(-γt) while the phase portrait spirals smoothly into the center origin (0, 0).",
  },
  {
    id: "mass_independence",
    title: "Galileo's Mass Independence Theorem",
    subtitle: "Proving period depends only on length L and gravity g",
    tag: "Invariance",
    env: "earth",
    length: 1.5,
    mass: 5.0,
    angleDeg: 20,
    damping: 0.0,
    explanation: "Gravitational mass cancels inertial mass in the equation of motion (d²θ/dt² = -(g/L)sin θ). Changing the bob mass from 0.1kg to 10kg does not alter the oscillation period.",
  },
];

export default function PendulumStudio() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "physics/simplependulum",
    "physics",
    "simulation"
  );

  // ── Pendulum System Parameters ───────────────────────────────────────
  const [selectedEnvId, setSelectedEnvId] = useState<string>("earth");
  const [length, setLength] = useState<number>(1.0); // meters [0.1..5.0]
  const [mass, setMass] = useState<number>(1.0); // kg [0.1..10.0]
  const [initialAngleDeg, setInitialAngleDeg] = useState<number>(30); // deg [-170..170]
  const [damping, setDamping] = useState<number>(0.02); // viscous friction coeff [0..0.5]
  const [customGravity, setCustomGravity] = useState<number>(9.81);

  // Playback & Simulation Engine State
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0); // 0.2x, 0.5x, 1x, 2x

  // Visual Overlays & Tabs
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showProtractor, setShowProtractor] = useState<boolean>(true);
  const [showPhotogate, setShowPhotogate] = useState<boolean>(true);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"controls" | "world" | "telemetry" | "presets">("controls");
  const [activeGraphTab, setActiveGraphTab] = useState<"theta-t" | "phase-space" | "energy">("theta-t");

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

  // Theoretical Calculations
  const theoreticalPeriod = useMemo(() => {
    const g = activeEnv.gravity;
    const L = Math.max(0.01, length);
    // Linear SHM Period
    const t0 = 2 * Math.PI * Math.sqrt(L / g);
    // Borda's large-angle correction formula
    const theta0Rad = (Math.abs(initialAngleDeg) * Math.PI) / 180;
    const k = Math.sin(theta0Rad / 2);
    const correctedT = t0 * (1 + 0.25 * k * k + (9 / 64) * Math.pow(k, 4));
    const freq = 1 / correctedT;

    return {
      t0: Number(t0.toFixed(3)),
      exactT: Number(correctedT.toFixed(3)),
      frequency: Number(freq.toFixed(3)),
      angularFreq: Number((2 * Math.PI * freq).toFixed(3)),
    };
  }, [activeEnv.gravity, length, initialAngleDeg]);

  // Instantaneous Numerical State
  const [currentState, setCurrentState] = useState<{
    t: number;
    thetaRad: number;
    omegaRad: number;
    alphaRad: number;
    pe: number;
    ke: number;
    totalE: number;
    measuredPeriod: number | null;
    oscillationCount: number;
  }>({
    t: 0,
    thetaRad: (initialAngleDeg * Math.PI) / 180,
    omegaRad: 0,
    alphaRad: -(activeEnv.gravity / length) * Math.sin((initialAngleDeg * Math.PI) / 180),
    pe: mass * activeEnv.gravity * length * (1 - Math.cos((initialAngleDeg * Math.PI) / 180)),
    ke: 0,
    totalE: mass * activeEnv.gravity * length * (1 - Math.cos((initialAngleDeg * Math.PI) / 180)),
    measuredPeriod: null,
    oscillationCount: 0,
  });

  // History Buffers for Telemetry & Phase-Space Plots
  const historyRef = useRef<{ t: number; theta: number; omega: number; pe: number; ke: number; totalE: number }[]>([]);
  const lastZeroCrossingRef = useRef<{ t: number; dir: number } | null>(null);
  const measuredPeriodsRef = useRef<number[]>([]);

  // Dragging State on Canvas
  const [isDraggingBob, setIsDraggingBob] = useState<boolean>(false);

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Synchronize AI Chatbot Knowledge Context
  useEffect(() => {
    setExperimentData({
      title: "Simple Pendulum & Harmonic Motion Studio",
      theory: `Equation of Motion: d²θ/dt² = -(g/L)sin(θ) - γ(dθ/dt). Small angle approximation: T₀ = 2π√(L/g). Large angle period: T ≈ T₀(1 + ¼sin²(θ₀/2)). Energy: E = ½mL²ω² + mgL(1 - cos θ).`,
      extraContext: `Environment: ${activeEnv.name} (g = ${activeEnv.gravity} m/s²). Length: ${length}m, Mass: ${mass}kg, Initial Angle: ${initialAngleDeg}°, Damping: ${damping}. Theoretical Period: ${theoreticalPeriod.exactT}s.`,
    });
  }, [activeEnv, length, mass, initialAngleDeg, damping, theoreticalPeriod, setExperimentData]);

  // Reset Simulation Launch
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);

    const theta0Rad = (initialAngleDeg * Math.PI) / 180;
    const initialPE = mass * activeEnv.gravity * length * (1 - Math.cos(theta0Rad));

    setCurrentState({
      t: 0,
      thetaRad: theta0Rad,
      omegaRad: 0,
      alphaRad: -(activeEnv.gravity / length) * Math.sin(theta0Rad),
      pe: initialPE,
      ke: 0,
      totalE: initialPE,
      measuredPeriod: theoreticalPeriod.exactT,
      oscillationCount: 0,
    });

    historyRef.current = [{
      t: 0,
      theta: Number(initialAngleDeg.toFixed(2)),
      omega: 0,
      pe: Number(initialPE.toFixed(2)),
      ke: 0,
      totalE: Number(initialPE.toFixed(2)),
    }];

    lastZeroCrossingRef.current = null;
    measuredPeriodsRef.current = [];
  }, [initialAngleDeg, mass, activeEnv.gravity, length, theoreticalPeriod.exactT]);

  // Apply Guided Preset
  const handleApplyPreset = (preset: GuidedPreset) => {
    setSelectedEnvId(preset.env);
    setLength(preset.length);
    setMass(preset.mass);
    setInitialAngleDeg(preset.angleDeg);
    setDamping(preset.damping);
    setTimeout(() => handleReset(), 50);
  };

  // Reset when key parameters change while paused/stopped
  useEffect(() => {
    if (!isRunning) {
      handleReset();
    }
  }, [length, mass, initialAngleDeg, selectedEnvId, damping, handleReset, isRunning]);

  // ── Physics Integration Loop (Runge-Kutta RK4 Solver) ───────────────
  useEffect(() => {
    if (!isRunning || isPaused || isDraggingBob) return;

    let localState = { ...currentState };
    lastTimeRef.current = performance.now();

    const g = activeEnv.gravity;
    const L = length;
    const gamma = damping;

    // Acceleration Function: f(θ, ω) = -(g/L)sin(θ) - γ·ω
    const accel = (theta: number, omega: number) => {
      return -(g / L) * Math.sin(theta) - gamma * omega;
    };

    const stepSimulation = (now: number) => {
      const realDt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // Sub-stepping with RK4
      const subSteps = 12;
      const dt = (realDt * playbackSpeed) / subSteps;

      for (let s = 0; s < subSteps; s++) {
        const theta = localState.thetaRad;
        const omega = localState.omegaRad;

        // RK4 Step
        const k1_theta = omega;
        const k1_omega = accel(theta, omega);

        const k2_theta = omega + 0.5 * dt * k1_omega;
        const k2_omega = accel(theta + 0.5 * dt * k1_theta, omega + 0.5 * dt * k1_omega);

        const k3_theta = omega + 0.5 * dt * k2_omega;
        const k3_omega = accel(theta + 0.5 * dt * k2_theta, omega + 0.5 * dt * k2_omega);

        const k4_theta = omega + dt * k3_omega;
        const k4_omega = accel(theta + dt * k3_theta, omega + dt * k3_omega);

        const prevTheta = localState.thetaRad;
        localState.thetaRad += (dt / 6) * (k1_theta + 2 * k2_theta + 2 * k3_theta + k4_theta);
        localState.omegaRad += (dt / 6) * (k1_omega + 2 * k2_omega + 2 * k3_omega + k4_omega);
        localState.alphaRad = accel(localState.thetaRad, localState.omegaRad);
        localState.t += dt;

        // Photogate Zero-Crossing Detector (Equilibrium θ = 0)
        if (prevTheta * localState.thetaRad <= 0 && Math.abs(prevTheta - localState.thetaRad) < 1.0) {
          const currentDir = localState.omegaRad >= 0 ? 1 : -1;
          if (lastZeroCrossingRef.current && lastZeroCrossingRef.current.dir === currentDir) {
            const measuredT = localState.t - lastZeroCrossingRef.current.t;
            if (measuredT > 0.3) {
              localState.measuredPeriod = Number(measuredT.toFixed(3));
              localState.oscillationCount += 1;
              measuredPeriodsRef.current.push(measuredT);

              // Trigger complete experiment XP after 3 full oscillations
              if (localState.oscillationCount >= 3) {
                completeExperiment();
              }
            }
          }
          lastZeroCrossingRef.current = { t: localState.t, dir: currentDir };
        }
      }

      // Energy Conservation Breakdown
      const pe = mass * g * L * (1 - Math.cos(localState.thetaRad));
      const ke = 0.5 * mass * L * L * localState.omegaRad * localState.omegaRad;
      localState.pe = pe;
      localState.ke = ke;
      localState.totalE = pe + ke;

      setCurrentState({ ...localState });

      // Append to history buffer for plotting
      historyRef.current.push({
        t: Number(localState.t.toFixed(3)),
        theta: Number(((localState.thetaRad * 180) / Math.PI).toFixed(2)),
        omega: Number(localState.omegaRad.toFixed(2)),
        pe: Number(localState.pe.toFixed(2)),
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
    isDraggingBob,
    activeEnv.gravity,
    length,
    mass,
    damping,
    playbackSpeed,
    completeExperiment,
  ]);

  // ── Render Pendulum Canvas ───────────────────────────────────────────
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

      // Starfield for Moon & Vacuum
      if (activeEnv.id === "moon" || activeEnv.id === "vacuum") {
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        for (let i = 0; i < 40; i++) {
          const sx = ((i * 123) % (w - 20)) + 10;
          const sy = ((i * 79) % (h - 100)) + 10;
          ctx.fillRect(sx, sy, 1.5, 1.5);
        }
      }

      // Pivot Mount Geometry
      const pivotX = w * 0.5;
      const pivotY = 70;
      const maxVisualLength = Math.min(h - 140, 280);
      const pxPerMeter = maxVisualLength / Math.max(length, 1.2);
      const visualStringLen = length * pxPerMeter;

      const theta = currentState.thetaRad;
      const bobX = pivotX + Math.sin(theta) * visualStringLen;
      const bobY = pivotY + Math.cos(theta) * visualStringLen;
      const bobRadius = Math.max(12, Math.min(28, 14 + Math.cbrt(mass) * 4));

      // 2. Protractor Angle Dial Arc
      if (showProtractor) {
        const dialR = Math.min(visualStringLen * 0.7, 130);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, dialR, (Math.PI * 0.5) - (Math.PI * 0.45), (Math.PI * 0.5) + (Math.PI * 0.45));
        ctx.stroke();

        // Angle tick marks
        for (let deg = -80; deg <= 80; deg += 10) {
          const rad = (Math.PI * 0.5) + (deg * Math.PI) / 180;
          const innerR = deg % 30 === 0 ? dialR - 10 : dialR - 5;
          const x1 = pivotX + Math.cos(rad) * innerR;
          const y1 = pivotY + Math.sin(rad) * innerR;
          const x2 = pivotX + Math.cos(rad) * dialR;
          const y2 = pivotY + Math.sin(rad) * dialR;

          ctx.strokeStyle = deg === 0 ? "#38bdf8" : "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = deg === 0 ? 2 : 1;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          if (deg % 30 === 0 && deg !== 0) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.font = "8px monospace";
            ctx.textAlign = "center";
            ctx.fillText(`${Math.abs(deg)}°`, pivotX + Math.cos(rad) * (dialR + 10), pivotY + Math.sin(rad) * (dialR + 10));
          }
        }

        // Vertical Reference Line
        ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(pivotX, pivotY + visualStringLen + 30);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 3. Photogate Laser Sensor at Equilibrium
      if (showPhotogate) {
        const gateY = pivotY + visualStringLen;
        ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(pivotX - 35, gateY);
        ctx.lineTo(pivotX + 35, gateY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Photogate Sensor Bracket Posts
        ctx.fillStyle = "#475569";
        ctx.fillRect(pivotX - 40, gateY - 6, 8, 12);
        ctx.fillRect(pivotX + 32, gateY - 6, 8, 12);

        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(pivotX - 36, gateY, 2.5, 0, Math.PI * 2);
        ctx.arc(pivotX + 36, gateY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Pendulum Rod / String
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // Pivot Support Ceiling Bracket
      ctx.fillStyle = "#334155";
      ctx.fillRect(pivotX - 45, pivotY - 14, 90, 8);
      ctx.fillStyle = "#94a3b8";
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 6, 0, Math.PI * 2);
      ctx.fill();

      // 5. Pendulum Bob Spherical Vector Body
      const bobGrad = ctx.createRadialGradient(
        bobX - bobRadius * 0.3,
        bobY - bobRadius * 0.3,
        bobRadius * 0.1,
        bobX,
        bobY,
        bobRadius
      );
      bobGrad.addColorStop(0, "#ffffff");
      bobGrad.addColorStop(0.3, "#38bdf8");
      bobGrad.addColorStop(1, "#0f172a");

      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = isRunning ? 10 : 3;
      ctx.fillStyle = bobGrad;
      ctx.beginPath();
      ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = isDraggingBob ? "#f59e0b" : "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 6. Force & Kinematic Vectors Overlay
      if (showVectors) {
        // A. Gravity Vector (m*g Downward - Blue)
        const gLen = Math.min(50, activeEnv.gravity * 3.5);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bobX, bobY);
        ctx.lineTo(bobX, bobY + gLen);
        ctx.stroke();

        // B. Restoring Tangential Force Vector (F_net = -mg sin θ - Rose)
        if (Math.abs(theta) > 0.02) {
          const restLen = Math.sin(theta) * gLen * 0.9;
          const perpAngle = theta - Math.PI * 0.5;
          ctx.strokeStyle = "#f43f5e";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(bobX, bobY);
          ctx.lineTo(bobX + Math.cos(perpAngle) * restLen, bobY + Math.sin(perpAngle) * restLen);
          ctx.stroke();
        }

        // C. Velocity Vector (v = L*ω - Emerald)
        if (Math.abs(currentState.omegaRad) > 0.05) {
          const vLen = Math.min(55, currentState.omegaRad * length * 18);
          const vAngle = theta + (currentState.omegaRad > 0 ? 0 : Math.PI) - Math.PI * 0.5;
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(bobX, bobY);
          ctx.lineTo(bobX + Math.cos(vAngle) * Math.abs(vLen), bobY + Math.sin(vAngle) * Math.abs(vLen));
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [
    activeEnv,
    currentState,
    isDraggingBob,
    isRunning,
    length,
    mass,
    showPhotogate,
    showProtractor,
    showVectors,
  ]);

  // ── Render Telemetry & Phase-Space Canvas ────────────────────────────
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

    if (activeGraphTab === "theta-t") {
      // Angular displacement θ(t)
      const maxAngle = Math.max(Math.abs(initialAngleDeg) * 1.15, 10);
      const minAngle = -maxAngle;

      // Zero axis line
      const zeroY = padY + graphH * 0.5;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(padX, zeroY);
      ctx.lineTo(padX + graphW, zeroY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Plot curve
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();

      const n = history.length;
      history.forEach((d, idx) => {
        const xPx = padX + (idx / (n - 1)) * graphW;
        const normY = (d.theta - minAngle) / (maxAngle - minAngle);
        const yPx = padY + graphH - normY * graphH;
        if (idx === 0) ctx.moveTo(xPx, yPx);
        else ctx.lineTo(xPx, yPx);
      });
      ctx.stroke();
    } else if (activeGraphTab === "phase-space") {
      // Phase-Space Portrait (ω vs θ)
      const maxTheta = Math.max(Math.abs(initialAngleDeg) * 1.2, 10);
      const maxOmega = Math.max(...history.map((d) => Math.abs(d.omega)), 2) * 1.2;

      const centerX = padX + graphW * 0.5;
      const centerY = padY + graphH * 0.5;

      // Axes
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.beginPath();
      ctx.moveTo(padX, centerY);
      ctx.lineTo(padX + graphW, centerY);
      ctx.moveTo(centerX, padY);
      ctx.lineTo(centerX, padY + graphH);
      ctx.stroke();

      // Plot Phase Spiral / Ellipse
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      history.forEach((d, idx) => {
        const xPx = centerX + (d.theta / maxTheta) * (graphW * 0.45);
        const yPx = centerY - (d.omega / maxOmega) * (graphH * 0.45);
        if (idx === 0) ctx.moveTo(xPx, yPx);
        else ctx.lineTo(xPx, yPx);
      });
      ctx.stroke();
    } else if (activeGraphTab === "energy") {
      // Kinetic & Potential Energy Curves
      const maxE = Math.max(...history.map((d) => d.totalE), 1) * 1.15;

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

      plotEnergy((d) => d.pe, "#38bdf8"); // Potential Energy
      plotEnergy((d) => d.ke, "#10b981"); // Kinetic Energy
      plotEnergy((d) => d.totalE, "#e2e8f0"); // Total Mechanical Energy
    }
  }, [activeGraphTab, currentState, initialAngleDeg]);

  // Export CSV Telemetry Data
  const handleExportCSV = () => {
    const rows = [["Time (s)", "Angle (deg)", "Angular Velocity (rad/s)", "PE (J)", "KE (J)", "Total Energy (J)"]];
    historyRef.current.forEach((d) => {
      rows.push([d.t.toString(), d.theta.toString(), d.omega.toString(), d.pe.toString(), d.ke.toString(), d.totalE.toString()]);
    });
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pendulum_telemetry_${Date.now()}.csv`);
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
              <Clock size={22} />
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
              Simple Pendulum & Harmonic Motion Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-mono font-bold">
              Oscillations & SHM
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Non-linear large-angle physics, phase-space trajectories, energy conservation, and planetary gravitation.
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
                <span>Start Swing</span>
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
            title="Reset to Initial Angle"
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

              {damping === 0 && (
                <span className="px-2.5 py-1 bg-purple-950/80 backdrop-blur-md rounded-full text-purple-300 text-[10px] font-mono font-black border border-purple-500/30">
                  UNDAMPED
                </span>
              )}
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
                onClick={() => setShowProtractor(!showProtractor)}
                className={`px-2 py-0.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                  showProtractor ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white"
                }`}
              >
                Protractor
              </button>
              <button
                type="button"
                onClick={() => setShowPhotogate(!showPhotogate)}
                className={`px-2 py-0.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                  showPhotogate ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white"
                }`}
              >
                Photogate
              </button>
            </div>

            {/* Stage Canvas */}
            <canvas
              ref={canvasRef}
              width={720}
              height={460}
              className="w-full h-[380px] sm:h-[450px] block cursor-crosshair"
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

              {/* Time & Period Counter */}
              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground font-bold text-[11px]">Swings:</span>
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
                { id: "controls", label: "Parameters", icon: Sliders },
                { id: "world", label: "World & Gravity", icon: Globe },
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

            {/* ── TAB 1: PARAMETER CONTROLS ── */}
            {activeConsoleTab === "controls" && (
              <div className="space-y-4">
                {/* Length Slider + Manual Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">String Length (L):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0.1"
                        max="5.0"
                        step="0.05"
                        value={length}
                        onChange={(e) => setLength(Math.min(10, Math.max(0.1, Number(e.target.value) || 0.1)))}
                        disabled={isRunning}
                        className="w-16 px-2 py-0.5 rounded-lg bg-muted border border-border text-foreground font-mono font-black text-right text-xs focus:border-primary focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">m</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.05"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                    <span>0.2m (High freq)</span>
                    <span>1.0m (T ≈ 2.0s)</span>
                    <span>3.0m (Slow swing)</span>
                  </div>
                </div>

                {/* Initial Release Angle Slider + Manual Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Release Angle (θ₀):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="-170"
                        max="170"
                        step="1"
                        value={initialAngleDeg}
                        onChange={(e) => setInitialAngleDeg(Math.min(175, Math.max(-175, Number(e.target.value) || 0)))}
                        disabled={isRunning}
                        className="w-16 px-2 py-0.5 rounded-lg bg-muted border border-border text-emerald-500 font-mono font-black text-right text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">deg</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    step="1"
                    value={initialAngleDeg}
                    onChange={(e) => setInitialAngleDeg(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                    <span>-90° (Left)</span>
                    <span>0° (Rest)</span>
                    <span>+90° (Right)</span>
                  </div>
                </div>

                {/* Bob Mass Slider + Manual Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Bob Mass (m):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0.1"
                        max="10.0"
                        step="0.1"
                        value={mass}
                        onChange={(e) => setMass(Math.min(20, Math.max(0.1, Number(e.target.value) || 0.1)))}
                        disabled={isRunning}
                        className="w-16 px-2 py-0.5 rounded-lg bg-muted border border-border text-sky-400 font-mono font-black text-right text-xs focus:border-sky-400 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">kg</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.1"
                    value={mass}
                    onChange={(e) => setMass(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                {/* Viscous Damping Slider + Manual Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Air Friction / Damping (γ):</span>
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
                      <span className="text-xs font-mono font-bold text-muted-foreground">s⁻¹</span>
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

            {/* ── TAB 2: WORLD & GRAVITY ── */}
            {activeConsoleTab === "world" && (
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

                <div className="p-3 rounded-2xl bg-muted/40 border border-border text-xs space-y-1">
                  <div className="font-bold text-foreground flex items-center justify-between">
                    <span>{activeEnv.name}</span>
                    <span className="font-mono text-primary font-bold">g = {activeEnv.gravity} m/s²</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {activeEnv.description}
                  </p>
                </div>
              </div>
            )}

            {/* ── TAB 3: TELEMETRY & PHASE PORTRAITS ── */}
            {activeConsoleTab === "telemetry" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl">
                    {[
                      { id: "theta-t", label: "θ(t) Wave" },
                      { id: "phase-space", label: "Phase Portrait" },
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
                    <span className="text-sky-400 font-bold">PE: {currentState.pe.toFixed(2)} J</span>
                    <span className="text-emerald-400 font-bold">KE: {currentState.ke.toFixed(2)} J</span>
                    <span className="text-foreground font-bold">Total: {currentState.totalE.toFixed(2)} J</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="bg-sky-400 transition-all duration-75"
                      style={{
                        width: `${Math.min(100, Math.max(0, (currentState.pe / (currentState.totalE || 1)) * 100))}%`,
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
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Angle (θ)</span>
              <div className="text-base sm:text-lg font-black font-mono text-foreground mt-0.5">
                {((currentState.thetaRad * 180) / Math.PI).toFixed(1)}°
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Angular Speed</span>
              <div className="text-base sm:text-lg font-black font-mono text-emerald-500 mt-0.5">
                {Math.abs(currentState.omegaRad).toFixed(2)} <span className="text-xs font-normal text-muted-foreground">rad/s</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Exact Period (T)</span>
              <div className="text-base sm:text-lg font-black font-mono text-sky-400 mt-0.5">
                {theoreticalPeriod.exactT} <span className="text-xs font-normal text-muted-foreground">s</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Frequency (f)</span>
              <div className="text-base sm:text-lg font-black font-mono text-rose-400 mt-0.5">
                {theoreticalPeriod.frequency} <span className="text-xs font-normal text-muted-foreground">Hz</span>
              </div>
            </div>
          </div>

          {/* Daily Challenge Card */}
          <DailyChallengeCard
            labId="physics/simplependulum"
            currentParams={{
              period: theoreticalPeriod.exactT,
              frequency: theoreticalPeriod.frequency,
            }}
          />
        </div>
      </div>
    </div>
  );
}
