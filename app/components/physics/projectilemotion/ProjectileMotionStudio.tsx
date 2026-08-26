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
  Target,
  Crosshair,
  Trash2,
  Circle,
  CircleDot,
  Disc,
  Rocket,
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
    description: "Standard terrestrial atmosphere and nominal gravity ($9.81\\text{ m/s}^2$).",
  },
  {
    id: "vacuum",
    name: "Vacuum (Pure Galilean)",
    iconType: "vacuum",
    gravity: 9.81,
    airDensity: 0.0,
    color: "#8b5cf6",
    skyGradient: ["#09090b", "#18181b"],
    description: "Ideal parabolic kinematics without aerodynamic drag: $R = \\frac{v_0^2\\sin(2\\theta)}{g}$.",
  },
  {
    id: "moon",
    name: "Moon (Lunar Surface)",
    iconType: "moon",
    gravity: 1.62,
    airDensity: 0.0,
    color: "#94a3b8",
    skyGradient: ["#050505", "#111827"],
    description: "Low gravity ($1.62\\text{ m/s}^2$) providing $\\approx 6\\times$ greater range and flight time.",
  },
  {
    id: "mars",
    name: "Mars",
    iconType: "mars",
    gravity: 3.72,
    airDensity: 0.02,
    color: "#ef4444",
    skyGradient: ["#1c0a00", "#3b1408"],
    description: "Surface gravity ($3.72\\text{ m/s}^2$) with thin carbon dioxide atmosphere.",
  },
  {
    id: "jupiter",
    name: "Jupiter Cloud Tops",
    iconType: "jupiter",
    gravity: 24.79,
    airDensity: 1.33,
    color: "#f59e0b",
    skyGradient: ["#261505", "#451a03"],
    description: "Intense gravitation ($24.79\\text{ m/s}^2$) resulting in rapid drop and steep arc.",
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

// ── Projectile Preset Definitions ──────────────────────────────────────
export type ProjectileIconType = "cannonball" | "baseball" | "golf_ball" | "tank_shell" | "foam_arrow";

export interface ProjectilePreset {
  id: string;
  name: string;
  iconType: ProjectileIconType;
  mass: number; // kg
  radius: number; // m
  dragCoeff: number; // Cd
  color: string;
  trailColor: string;
}

export const PROJECTILE_PRESETS: ProjectilePreset[] = [
  {
    id: "cannonball",
    name: "Iron Cannonball",
    iconType: "cannonball",
    mass: 12.0,
    radius: 0.09,
    dragCoeff: 0.47,
    color: "#38bdf8",
    trailColor: "rgba(56, 189, 248, 0.7)",
  },
  {
    id: "baseball",
    name: "Baseball",
    iconType: "baseball",
    mass: 0.145,
    radius: 0.037,
    dragCoeff: 0.3,
    color: "#e2e8f0",
    trailColor: "rgba(226, 232, 240, 0.7)",
  },
  {
    id: "golf_ball",
    name: "Golf Ball",
    iconType: "golf_ball",
    mass: 0.046,
    radius: 0.021,
    dragCoeff: 0.25,
    color: "#10b981",
    trailColor: "rgba(16, 185, 129, 0.7)",
  },
  {
    id: "tank_shell",
    name: "Artillery Shell",
    iconType: "tank_shell",
    mass: 45.0,
    radius: 0.077,
    dragCoeff: 0.15,
    color: "#f59e0b",
    trailColor: "rgba(245, 158, 11, 0.7)",
  },
  {
    id: "foam_arrow",
    name: "Light Vane Arrow",
    iconType: "foam_arrow",
    mass: 0.025,
    radius: 0.04,
    dragCoeff: 1.2,
    color: "#f43f5e",
    trailColor: "rgba(244, 63, 94, 0.7)",
  },
];

// Helper to render Projectile Icon
function RenderProjIcon({ type, size = 15, className = "" }: { type: ProjectileIconType; size?: number; className?: string }) {
  switch (type) {
    case "cannonball":
      return <Circle size={size} className={className} />;
    case "baseball":
      return <CircleDot size={size} className={className} />;
    case "golf_ball":
      return <Disc size={size} className={className} />;
    case "tank_shell":
      return <Rocket size={size} className={className} />;
    case "foam_arrow":
      return <Wind size={size} className={className} />;
    default:
      return <Circle size={size} className={className} />;
  }
}

// ── Guided Ballistics Discovery Presets ────────────────────────────────
export interface GuidedPreset {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  env: string;
  speed: number;
  angle: number;
  height: number;
  wind: number;
  projectile: string;
  targetDist?: number;
  explanation: string;
}

export const GUIDED_PRESETS: GuidedPreset[] = [
  {
    id: "max_range_45",
    title: "Maximum Range Angle (45°)",
    subtitle: "Level ground theoretical maximum in vacuum",
    tag: "Fundamental",
    env: "vacuum",
    speed: 30,
    angle: 45,
    height: 0,
    wind: 0,
    projectile: "cannonball",
    targetDist: 91.7,
    explanation: "On level ground with no air resistance, R = (v0^2 * sin(2*theta)) / g. The maximum range occurs at theta = 45° where sin(90°) = 1.",
  },
  {
    id: "complementary_angles",
    title: "Complementary Launch Angles (30° vs 60°)",
    subtitle: "Equal horizontal range with different flight times & apex heights",
    tag: "Symmetry",
    env: "vacuum",
    speed: 28,
    angle: 30,
    height: 0,
    wind: 0,
    projectile: "baseball",
    targetDist: 69.2,
    explanation: "Because sin(2*theta) = sin(2*(90° - theta)), complementary angle pairs (like 30° & 60°, or 15° & 75°) yield identical landing ranges in vacuum, but higher angles produce longer hang-time and greater apex height.",
  },
  {
    id: "cliff_elevation",
    title: "Elevated Cliff Platform Toss",
    subtitle: "Why the optimal launch angle drops below 45°",
    tag: "Elevation",
    env: "earth",
    speed: 25,
    angle: 35,
    height: 30,
    wind: 0,
    projectile: "cannonball",
    targetDist: 92.4,
    explanation: "When launching from an elevated cliff (y0 > 0), the projectile spends additional time falling below the launch plane. The optimal launch angle for maximum range decreases to theta_opt = arctan(v0 / sqrt(v0^2 + 2*g*y0)) < 45°.",
  },
  {
    id: "aerodynamic_drag",
    title: "Atmospheric Drag & Tear-Drop Trajectory",
    subtitle: "Symmetry breaking caused by velocity-squared air resistance",
    tag: "Aerodynamics",
    env: "earth",
    speed: 45,
    angle: 50,
    height: 0,
    wind: 0,
    projectile: "foam_arrow",
    explanation: "Air resistance creates quadratic drag F_d = 0.5 * rho * Cd * A * v^2, steepening the descent arc and producing an asymmetric non-parabolic tear-drop path.",
  },
  {
    id: "lunar_super_range",
    title: "Apollo Lunar Ballistics",
    subtitle: "High-velocity trajectory in Moon's 1/6th gravity",
    tag: "Astrodynamics",
    env: "moon",
    speed: 25,
    angle: 45,
    height: 0,
    wind: 0,
    projectile: "golf_ball",
    targetDist: 385.8,
    explanation: "In lunar vacuum (g = 1.62 m/s^2), astronaut Alan Shepard hit a golf ball on Apollo 14 that traveled hundreds of meters due to zero atmosphere and 1/6th Earth gravity.",
  },
];

interface TrajectoryRecord {
  id: number;
  label: string;
  color: string;
  points: { x: number; y: number; t: number; vx: number; vy: number }[];
  range: number;
  maxHeight: number;
  flightTime: number;
  v0: number;
  angle: number;
  h0: number;
}

export default function ProjectileMotionStudio() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "physics/projectilemotion",
    "physics",
    "simulation"
  );

  // ── Launch Controls ───────────────────────────────────────────────────
  const [selectedEnvId, setSelectedEnvId] = useState<string>("earth");
  const [selectedProjId, setSelectedProjId] = useState<string>("cannonball");

  const [launchSpeed, setLaunchSpeed] = useState<number>(30); // m/s [5..100]
  const [launchAngle, setLaunchAngle] = useState<number>(45); // deg [0..90]
  const [launchHeight, setLaunchHeight] = useState<number>(0); // m [0..100]
  const [windSpeed, setWindSpeed] = useState<number>(0); // m/s [-20..20]

  const [customGravity, setCustomGravity] = useState<number>(9.81);
  const [customAirDensity, setCustomAirDensity] = useState<number>(1.225);

  // Target Range Controls
  const [targetDistance, setTargetDistance] = useState<number>(85); // meters
  const [targetRadius, setTargetRadius] = useState<number>(4.0); // meters
  const [targetScore, setTargetScore] = useState<{ hits: number; totalShots: number; lastAccuracy: number | null }>({
    hits: 0,
    totalShots: 0,
    lastAccuracy: null,
  });

  // Playback & Animation
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0); // 0.2x, 0.5x, 1x, 2x

  // Visual Overlays
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showTheoretical, setShowTheoretical] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"aim" | "world" | "telemetry" | "presets">("aim");
  const [activeGraphTab, setActiveGraphTab] = useState<"trajectory" | "velocity" | "energy">("trajectory");

  // Trajectory History Archive
  const [trajectories, setTrajectories] = useState<TrajectoryRecord[]>([]);

  // Active Environment & Projectile
  const activeEnv = useMemo(() => {
    const preset = PLANETARY_PRESETS.find((p) => p.id === selectedEnvId);
    if (!preset) {
      return {
        id: "custom",
        name: "Custom Environment",
        iconType: "custom" as EnvIconType,
        gravity: customGravity,
        airDensity: customAirDensity,
        color: "#06b6d4",
        skyGradient: ["#022c22", "#0f172a"] as [string, string],
        description: `Custom gravity (${customGravity} m/s²) and air density (${customAirDensity} kg/m³).`,
      };
    }
    return preset;
  }, [selectedEnvId, customGravity, customAirDensity]);

  const activeProj = useMemo(() => {
    return PROJECTILE_PRESETS.find((p) => p.id === selectedProjId) || PROJECTILE_PRESETS[0];
  }, [selectedProjId]);

  // Theoretical Kinematics Calculations (Vacuum Approximation)
  const theoreticalMetrics = useMemo(() => {
    const rad = (launchAngle * Math.PI) / 180;
    const v0x = launchSpeed * Math.cos(rad);
    const v0y = launchSpeed * Math.sin(rad);
    const g = activeEnv.gravity;
    const h = launchHeight;

    const apexHeight = h + (v0y * v0y) / (2 * g);
    const timeToApex = v0y / g;
    const totalFlightTime = (v0y + Math.sqrt(v0y * v0y + 2 * g * h)) / g;
    const horizontalRange = v0x * totalFlightTime;

    return {
      v0x,
      v0y,
      apexHeight,
      timeToApex,
      totalFlightTime,
      horizontalRange,
    };
  }, [launchSpeed, launchAngle, launchHeight, activeEnv.gravity]);

  // Current Instantaneous Ballistic State
  const [currentState, setCurrentState] = useState<{
    t: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    ax: number;
    ay: number;
    ke: number;
    pe: number;
    totalE: number;
    hasHitGround: boolean;
  }>({
    t: 0,
    x: 0,
    y: launchHeight,
    vx: theoreticalMetrics.v0x,
    vy: theoreticalMetrics.v0y,
    ax: 0,
    ay: -activeEnv.gravity,
    ke: 0.5 * activeProj.mass * launchSpeed * launchSpeed,
    pe: activeProj.mass * activeEnv.gravity * launchHeight,
    totalE: 0.5 * activeProj.mass * launchSpeed * launchSpeed + activeProj.mass * activeEnv.gravity * launchHeight,
    hasHitGround: false,
  });

  // Current flight path points
  const activeTrailRef = useRef<{ x: number; y: number; t: number; vx: number; vy: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const rafRef = useRef<number | null>(null);

  // Sync AI Chatbot Knowledge Context
  useEffect(() => {
    setExperimentData({
      title: "Projectile Motion & Ballistics Studio",
      theory: `2D Projectile Kinematics: x(t) = v_{0x} t, y(t) = y_0 + v_{0y} t - 0.5 g t^2. Theoretical Range R = (v_0^2 sin(2theta))/g. With drag: F_d = 0.5 rho C_d A v^2.`,
      extraContext: `Environment: ${activeEnv.name} (g = ${activeEnv.gravity} m/s^2, rho = ${activeEnv.airDensity} kg/m^3). Speed: ${launchSpeed} m/s, Angle: ${launchAngle}°, Elevation: ${launchHeight}m, Wind: ${windSpeed} m/s. Projectile: ${activeProj.name} (${activeProj.mass} kg).`,
    });
  }, [activeEnv, launchSpeed, launchAngle, launchHeight, windSpeed, activeProj, setExperimentData]);

  // Reset Simulation Launch
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);

    const rad = (launchAngle * Math.PI) / 180;
    const v0x = launchSpeed * Math.cos(rad);
    const v0y = launchSpeed * Math.sin(rad);
    const pe = activeProj.mass * activeEnv.gravity * launchHeight;
    const ke = 0.5 * activeProj.mass * launchSpeed * launchSpeed;

    setCurrentState({
      t: 0,
      x: 0,
      y: launchHeight,
      vx: v0x,
      vy: v0y,
      ax: 0,
      ay: -activeEnv.gravity,
      ke,
      pe,
      totalE: ke + pe,
      hasHitGround: false,
    });

    activeTrailRef.current = [{ x: 0, y: launchHeight, t: 0, vx: v0x, vy: v0y }];
  }, [launchSpeed, launchAngle, launchHeight, activeProj, activeEnv]);

  // Handle Preset Selection
  const handleApplyPreset = (preset: GuidedPreset) => {
    setSelectedEnvId(preset.env);
    setLaunchSpeed(preset.speed);
    setLaunchAngle(preset.angle);
    setLaunchHeight(preset.height);
    setWindSpeed(preset.wind);
    setSelectedProjId(preset.projectile);
    if (preset.targetDist) setTargetDistance(preset.targetDist);
    setTimeout(() => handleReset(), 50);
  };

  // Launch Projectile Fire
  const handleFire = () => {
    handleReset();
    setIsRunning(true);
    setIsPaused(false);
    setTargetScore((prev) => ({ ...prev, totalShots: prev.totalShots + 1 }));
  };

  // Clear Trajectory History
  const handleClearHistory = () => {
    setTrajectories([]);
  };

  // ── Physics Numerical Solver Loop (Runge-Kutta / Sub-stepping) ──────
  useEffect(() => {
    if (!isRunning || isPaused) return;

    let localState = { ...currentState };
    lastTimeRef.current = performance.now();

    const g = activeEnv.gravity;
    const rho = activeEnv.airDensity;
    const mass = activeProj.mass;
    const cd = activeProj.dragCoeff;
    const area = Math.PI * activeProj.radius * activeProj.radius;

    const stepSimulation = (now: number) => {
      const realDt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      const subSteps = 10;
      const dt = (realDt * playbackSpeed) / subSteps;

      for (let s = 0; s < subSteps; s++) {
        if (localState.y > 0 || localState.vy > 0 || localState.t === 0) {
          // Relative airflow velocity considering wind
          const relVx = localState.vx - windSpeed;
          const relVy = localState.vy;
          const relSpeed = Math.sqrt(relVx * relVx + relVy * relVy);

          // Aerodynamic quadratic drag forces
          const dragMagnitude = 0.5 * rho * cd * area * relSpeed * relSpeed;
          const dragFx = relSpeed > 0.001 ? -dragMagnitude * (relVx / relSpeed) : 0;
          const dragFy = relSpeed > 0.001 ? -dragMagnitude * (relVy / relSpeed) : 0;

          // Accelerations
          const ax = dragFx / mass;
          const ay = -g + dragFy / mass;

          localState.vx += ax * dt;
          localState.vy += ay * dt;
          localState.x += localState.vx * dt;
          localState.y += localState.vy * dt;
          localState.t += dt;
          localState.ax = ax;
          localState.ay = ay;

          // Check Ground Impact
          if (localState.y <= 0 && localState.t > 0.05) {
            localState.y = 0;
            localState.hasHitGround = true;
            break;
          }
        }
      }

      // Compute Energies
      const pe = mass * g * Math.max(0, localState.y);
      const ke = 0.5 * mass * (localState.vx * localState.vx + localState.vy * localState.vy);
      localState.pe = pe;
      localState.ke = ke;
      localState.totalE = pe + ke;

      setCurrentState({ ...localState });
      activeTrailRef.current.push({
        x: localState.x,
        y: localState.y,
        t: localState.t,
        vx: localState.vx,
        vy: localState.vy,
      });

      // Ground Impact Termination & Target Scoring
      if (localState.hasHitGround) {
        setIsRunning(false);

        // Check target hit
        const hitDistance = Math.abs(localState.x - targetDistance);
        const isHit = hitDistance <= targetRadius;
        setTargetScore((prev) => ({
          hits: isHit ? prev.hits + 1 : prev.hits,
          totalShots: prev.totalShots,
          lastAccuracy: Number(hitDistance.toFixed(2)),
        }));

        // Archive Trajectory
        const points = [...activeTrailRef.current];
        const maxH = Math.max(...points.map((p) => p.y));
        const newRecord: TrajectoryRecord = {
          id: Date.now(),
          label: `${launchSpeed}m/s @ ${launchAngle}° (${activeEnv.name.split(" ")[0]})`,
          color: activeProj.color,
          points,
          range: Number(localState.x.toFixed(1)),
          maxHeight: Number(maxH.toFixed(1)),
          flightTime: Number(localState.t.toFixed(2)),
          v0: launchSpeed,
          angle: launchAngle,
          h0: launchHeight,
        };

        setTrajectories((prev) => [newRecord, ...prev].slice(0, 6)); // Keep last 6 trails
        completeExperiment();
        return;
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
    activeProj,
    windSpeed,
    playbackSpeed,
    targetDistance,
    targetRadius,
    launchSpeed,
    launchAngle,
    launchHeight,
    completeExperiment,
  ]);

  // ── Render Main Ballistics Canvas ─────────────────────────────────────
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

      // Coordinate Scaling Layout
      const groundMargin = 55;
      const leftMargin = 70;
      const rightMargin = 40;
      const topMargin = 45;

      const visualFieldW = w - leftMargin - rightMargin;
      const visualFieldH = h - groundMargin - topMargin;

      // Dynamic Range & Height Scaling
      const maxFieldX = Math.max(theoreticalMetrics.horizontalRange * 1.25, targetDistance * 1.25, 60);
      const maxFieldY = Math.max(theoreticalMetrics.apexHeight * 1.35, launchHeight + 20, 25);

      const pxPerM_X = visualFieldW / maxFieldX;
      const pxPerM_Y = visualFieldH / maxFieldY;

      const toScreenX = (mX: number) => leftMargin + mX * pxPerM_X;
      const toScreenY = (mY: number) => h - groundMargin - mY * pxPerM_Y;

      // 2. Coordinate Grid & Distance Markings
      if (showGrid) {
        // Distance X-Axis Ticks
        const stepX = maxFieldX > 200 ? 50 : maxFieldX > 80 ? 20 : 10;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.font = "8px monospace";
        ctx.textAlign = "center";

        for (let x = 0; x <= maxFieldX; x += stepX) {
          const sx = toScreenX(x);
          ctx.beginPath();
          ctx.moveTo(sx, topMargin);
          ctx.lineTo(sx, h - groundMargin);
          ctx.stroke();
          ctx.fillText(`${x}m`, sx, h - groundMargin + 14);
        }

        // Height Y-Axis Ticks
        const stepY = maxFieldY > 100 ? 20 : maxFieldY > 40 ? 10 : 5;
        ctx.textAlign = "right";
        for (let y = 0; y <= maxFieldY; y += stepY) {
          const sy = toScreenY(y);
          ctx.beginPath();
          ctx.moveTo(leftMargin, sy);
          ctx.lineTo(w - rightMargin, sy);
          ctx.stroke();
          ctx.fillText(`${y}m`, leftMargin - 6, sy + 3);
        }
      }

      // 3. Ground & Launch Cliff Platform
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

      // Launch Elevation Platform / Cliff
      if (launchHeight > 0) {
        const cliffTopY = toScreenY(launchHeight);
        const cliffW = leftMargin + 10;

        ctx.fillStyle = "#334155";
        ctx.fillRect(0, cliffTopY, cliffW, groundY - cliffTopY);

        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, cliffTopY);
        ctx.lineTo(cliffW, cliffTopY);
        ctx.lineTo(cliffW, groundY);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`+${launchHeight}m`, cliffW * 0.5, cliffTopY - 6);
      }

      // 4. Bullseye Target on Ground
      const targetScreenX = toScreenX(targetDistance);
      const targetScreenR = Math.max(8, targetRadius * pxPerM_X);

      ctx.fillStyle = "rgba(244, 63, 94, 0.25)";
      ctx.beginPath();
      ctx.ellipse(targetScreenX, groundY + 4, targetScreenR, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(targetScreenX, groundY + 4, targetScreenR, 5, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Target Flag
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(targetScreenX, groundY);
      ctx.lineTo(targetScreenX, groundY - 22);
      ctx.stroke();

      ctx.fillStyle = "#f43f5e";
      ctx.beginPath();
      ctx.moveTo(targetScreenX, groundY - 22);
      ctx.lineTo(targetScreenX + 12, groundY - 17);
      ctx.lineTo(targetScreenX, groundY - 12);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${targetDistance}m`, targetScreenX, groundY + 22);

      // 5. Theoretical Vacuum Parabolic Arc (Dashed Line)
      if (showTheoretical) {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();

        const samples = 60;
        const totalT = theoreticalMetrics.totalFlightTime;
        for (let i = 0; i <= samples; i++) {
          const t = (i / samples) * totalT;
          const tx = theoreticalMetrics.v0x * t;
          const ty = launchHeight + theoreticalMetrics.v0y * t - 0.5 * activeEnv.gravity * t * t;
          const sx = toScreenX(tx);
          const sy = toScreenY(Math.max(0, ty));

          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 6. Archived Past Trajectories
      trajectories.forEach((traj) => {
        ctx.strokeStyle = `${traj.color}40`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        traj.points.forEach((p, idx) => {
          const sx = toScreenX(p.x);
          const sy = toScreenY(p.y);
          if (idx === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });
        ctx.stroke();
      });

      // 7. Active Live Flight Trail
      const livePoints = activeTrailRef.current;
      if (livePoints.length > 0) {
        ctx.strokeStyle = activeProj.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        livePoints.forEach((p, idx) => {
          const sx = toScreenX(p.x);
          const sy = toScreenY(p.y);
          if (idx === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });
        ctx.stroke();
      }

      // 8. Launch Cannon Barrel & Rotary Aim
      const launchSX = toScreenX(0);
      const launchSY = toScreenY(launchHeight);
      const cannonAngleRad = (launchAngle * Math.PI) / 180;
      const cannonLen = 28;

      const barrelEndX = launchSX + Math.cos(cannonAngleRad) * cannonLen;
      const barrelEndY = launchSY - Math.sin(cannonAngleRad) * cannonLen;

      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(launchSX, launchSY);
      ctx.lineTo(barrelEndX, barrelEndY);
      ctx.stroke();
      ctx.lineCap = "butt";

      // Cannon Base Turret
      ctx.fillStyle = "#64748b";
      ctx.beginPath();
      ctx.arc(launchSX, launchSY, 8, 0, Math.PI * 2);
      ctx.fill();

      // 9. Active Projectile Body & Vector Overlays (Clean Vector Spheres)
      const currSX = toScreenX(currentState.x);
      const currSY = toScreenY(currentState.y);

      // Projectile Shadow on Ground
      const shadowScale = Math.max(0.1, 1 - currentState.y / 50);
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.beginPath();
      ctx.ellipse(currSX, groundY + 3, 10 * shadowScale, 3 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Projectile Body with Vector Spherical Highlight
      const pGrad = ctx.createRadialGradient(currSX - 2, currSY - 2, 1, currSX, currSY, 7);
      pGrad.addColorStop(0, "#ffffff");
      pGrad.addColorStop(0.3, activeProj.color);
      pGrad.addColorStop(1, "#020617");

      ctx.shadowColor = activeProj.color;
      ctx.shadowBlur = isRunning ? 10 : 3;
      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.arc(currSX, currSY, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Dynamic Velocity Vector Arrow
      if (showVectors && isRunning && (currentState.x > 0 || currentState.t > 0)) {
        const vScale = 0.8;
        const arrowVx = currentState.vx * vScale;
        const arrowVy = -currentState.vy * vScale;

        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(currSX, currSY);
        ctx.lineTo(currSX + arrowVx, currSY + arrowVy);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [
    activeEnv,
    activeProj,
    currentState,
    launchAngle,
    launchHeight,
    launchSpeed,
    isRunning,
    showGrid,
    showTheoretical,
    showVectors,
    targetDistance,
    targetRadius,
    theoreticalMetrics,
    trajectories,
  ]);

  // ── Render Telemetry Graphs Canvas ───────────────────────────────────
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

    const points = activeTrailRef.current;
    if (points.length < 2) {
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Fire projectile to plot real-time telemetry curves...", w * 0.5, h * 0.5);
      return;
    }

    if (activeGraphTab === "trajectory") {
      // y vs x trajectory curve
      const maxX = Math.max(...points.map((p) => p.x), 10);
      const maxY = Math.max(...points.map((p) => p.y), 10);

      ctx.strokeStyle = activeProj.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      points.forEach((p, idx) => {
        const xPx = padX + (p.x / maxX) * graphW;
        const yPx = padY + graphH - (p.y / maxY) * graphH;
        if (idx === 0) ctx.moveTo(xPx, yPx);
        else ctx.lineTo(xPx, yPx);
      });
      ctx.stroke();
    } else if (activeGraphTab === "velocity") {
      // vx(t) and vy(t)
      const maxT = Math.max(points[points.length - 1].t, 1);
      const allV = points.map((p) => Math.sqrt(p.vx * p.vx + p.vy * p.vy));
      const maxV = Math.max(...allV, launchSpeed, 10);

      // |v| total speed (Emerald)
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.beginPath();
      points.forEach((p, idx) => {
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const xPx = padX + (p.t / maxT) * graphW;
        const yPx = padY + graphH - (speed / maxV) * graphH;
        if (idx === 0) ctx.moveTo(xPx, yPx);
        else ctx.lineTo(xPx, yPx);
      });
      ctx.stroke();
    }
  }, [activeGraphTab, activeProj, currentState, launchSpeed]);

  // Export CSV Telemetry Data
  const handleExportCSV = () => {
    const rows = [["Time (s)", "X Position (m)", "Y Position (m)", "Vx (m/s)", "Vy (m/s)", "Speed (m/s)"]];
    activeTrailRef.current.forEach((p) => {
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      rows.push([p.t.toFixed(3), p.x.toFixed(3), p.y.toFixed(3), p.vx.toFixed(3), p.vy.toFixed(3), speed.toFixed(3)]);
    });
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `projectile_telemetry_${Date.now()}.csv`);
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
              <Crosshair size={22} />
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
              Projectile Motion & Ballistics Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-mono font-bold">
              2D Kinematics
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Explore 2D trajectory dynamics, launch angle optimization, elevation cliffs, air drag, and target ballistics.
          </p>
        </div>

        {/* Primary Simulation Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleFire}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-black text-xs sm:text-sm hover:bg-primary/90 transition shadow-xs cursor-pointer"
          >
            <Play size={15} fill="currentColor" />
            <span>Fire Cannon</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-card border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition cursor-pointer"
            title="Reset Position"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          {trajectories.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="flex items-center gap-1 px-3 py-2.5 rounded-2xl bg-card border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              title="Clear Trajectory Trails"
            >
              <Trash2 size={13} />
              <span className="hidden sm:inline">Clear Trails</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-card border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition cursor-pointer"
            title="Export CSV Telemetry"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace: Central Stage + Control Deck ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Ballistics Visualizer Canvas (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
            {/* Canvas Floating HUD Badges */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/10 flex items-center gap-1.5">
                <RenderEnvIcon type={activeEnv.iconType} size={13} className="text-primary" />
                <span>{activeEnv.name.split(" ")[0]}</span>
                <span className="text-primary font-mono text-[11px]">({activeEnv.gravity} m/s²)</span>
              </span>

              {targetScore.totalShots > 0 && (
                <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-rose-400 text-xs font-mono font-bold border border-rose-500/20 flex items-center gap-1">
                  <Target size={12} />
                  <span>{targetScore.hits}/{targetScore.totalShots} Hits</span>
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
                onClick={() => setShowTheoretical(!showTheoretical)}
                className={`px-2 py-0.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                  showTheoretical ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white"
                }`}
              >
                Ideal Arc
              </button>
            </div>

            {/* Main Stage Canvas */}
            <canvas
              ref={canvasRef}
              width={720}
              height={460}
              className="w-full h-[380px] sm:h-[450px] block"
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

              {/* Time & Flight Readout */}
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-muted-foreground font-bold text-[11px]">Flight Time:</span>
                <span className="font-black text-foreground bg-muted px-2 py-0.5 rounded-md">
                  {currentState.t.toFixed(2)}s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Tab Ballistics Studio Console + Live Telemetry Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-card border border-border rounded-3xl p-5 shadow-xs space-y-4">
            {/* Console Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-border">
              {[
                { id: "aim", label: "Cannon & Aim", icon: Crosshair },
                { id: "world", label: "World & Wind", icon: Globe },
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

            {/* ── TAB 1: CANNON & AIM CONTROLS ── */}
            {activeConsoleTab === "aim" && (
              <div className="space-y-4">
                {/* Launch Angle Slider + Manual Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Launch Angle (θ):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="90"
                        step="1"
                        value={launchAngle}
                        onChange={(e) => setLaunchAngle(Math.min(90, Math.max(0, Number(e.target.value) || 0)))}
                        disabled={isRunning}
                        className="w-16 px-2 py-0.5 rounded-lg bg-muted border border-border text-foreground font-mono font-black text-right text-xs focus:border-primary focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">deg</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    step="1"
                    value={launchAngle}
                    onChange={(e) => setLaunchAngle(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                    <span>0° (Horizontal)</span>
                    <span>45° (Max Range)</span>
                    <span>90° (Vertical)</span>
                  </div>
                </div>

                {/* Launch Velocity Slider + Manual Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Initial Velocity (v₀):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="120"
                        step="0.5"
                        value={launchSpeed}
                        onChange={(e) => setLaunchSpeed(Math.min(150, Math.max(1, Number(e.target.value) || 1)))}
                        disabled={isRunning}
                        className="w-16 px-2 py-0.5 rounded-lg bg-muted border border-border text-emerald-500 font-mono font-black text-right text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">m/s</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={launchSpeed}
                    onChange={(e) => setLaunchSpeed(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                    <span>v₀x: {theoreticalMetrics.v0x.toFixed(1)} m/s</span>
                    <span>v₀y: {theoreticalMetrics.v0y.toFixed(1)} m/s</span>
                  </div>
                </div>

                {/* Platform Elevation Slider + Manual Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Cliff Elevation (y₀):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="150"
                        step="1"
                        value={launchHeight}
                        onChange={(e) => setLaunchHeight(Math.min(150, Math.max(0, Number(e.target.value) || 0)))}
                        disabled={isRunning}
                        className="w-16 px-2 py-0.5 rounded-lg bg-muted border border-border text-sky-400 font-mono font-black text-right text-xs focus:border-sky-400 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">m</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={launchHeight}
                    onChange={(e) => setLaunchHeight(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                {/* Target Distance Slider + Manual Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Target Distance:</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="5"
                        max="500"
                        step="1"
                        value={targetDistance}
                        onChange={(e) => setTargetDistance(Math.min(600, Math.max(5, Number(e.target.value) || 10)))}
                        disabled={isRunning}
                        className="w-16 px-2 py-0.5 rounded-lg bg-muted border border-border text-rose-400 font-mono font-black text-right text-xs focus:border-rose-400 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">m</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    step="1"
                    value={targetDistance}
                    onChange={(e) => setTargetDistance(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full accent-rose-400 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* ── TAB 2: WORLD, GRAVITY & WIND ── */}
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

                {/* Projectile Type Selection */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <label className="text-xs font-bold text-foreground">Projectile Payload:</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {PROJECTILE_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProjId(p.id)}
                        className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                          selectedProjId === p.id
                            ? "border-primary bg-primary/10 shadow-2xs font-bold text-foreground"
                            : "border-border hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <RenderProjIcon type={p.iconType} size={15} className="text-primary" />
                        <div className="text-[10px] truncate">{p.name.split(" ")[0]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wind Speed Control + Manual Input */}
                <div className="space-y-1.5 pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Headwind / Tailwind:</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="-30"
                        max="30"
                        step="1"
                        value={windSpeed}
                        onChange={(e) => setWindSpeed(Math.min(30, Math.max(-30, Number(e.target.value) || 0)))}
                        disabled={isRunning}
                        className="w-16 px-2 py-0.5 rounded-lg bg-muted border border-border text-amber-500 font-mono font-black text-right text-xs focus:border-amber-500 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">m/s</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    step="1"
                    value={windSpeed}
                    onChange={(e) => setWindSpeed(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* ── TAB 3: TELEMETRY & MULTI-TRAIL PLOTS ── */}
            {activeConsoleTab === "telemetry" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl">
                    {[
                      { id: "trajectory", label: "y(x) Path" },
                      { id: "velocity", label: "|v|(t) Speed" },
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

                {/* Trajectory History Table */}
                {trajectories.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                    <div className="text-[11px] font-bold text-muted-foreground">Recent Shots:</div>
                    {trajectories.map((t, idx) => (
                      <div
                        key={t.id}
                        className="p-2 rounded-xl bg-muted/40 border border-border text-[11px] flex items-center justify-between font-mono"
                      >
                        <span className="text-foreground font-bold">#{idx + 1} {t.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-bold">{t.range}m</span>
                          <span className="text-muted-foreground">({t.flightTime}s)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Range</span>
              <div className="text-base sm:text-lg font-black font-mono text-foreground mt-0.5">
                {currentState.x.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">m</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Apex Height</span>
              <div className="text-base sm:text-lg font-black font-mono text-sky-500 mt-0.5">
                {theoreticalMetrics.apexHeight.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">m</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Speed</span>
              <div className="text-base sm:text-lg font-black font-mono text-emerald-500 mt-0.5">
                {Math.sqrt(currentState.vx * currentState.vx + currentState.vy * currentState.vy).toFixed(1)} <span className="text-xs font-normal text-muted-foreground">m/s</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Target Dist</span>
              <div className="text-base sm:text-lg font-black font-mono text-rose-500 mt-0.5">
                {targetDistance} <span className="text-xs font-normal text-muted-foreground">m</span>
              </div>
            </div>
          </div>

          {/* Daily Challenge Card */}
          <DailyChallengeCard
            labId="physics/projectilemotion"
            currentParams={{
              range: Number(currentState.x.toFixed(1)),
              maxHeight: Number(theoreticalMetrics.apexHeight.toFixed(1)),
              time: Number(currentState.t.toFixed(1)),
            }}
          />
        </div>
      </div>
    </div>
  );
}
