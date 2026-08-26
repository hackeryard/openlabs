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
  Zap,
  Download,
  ChevronRight,
  Gauge,
  Layers,
  Compass,
  Radio,
  Timer,
  Eye,
  TrendingUp,
  Car,
  Flag,
  ArrowRight,
  ShieldAlert,
  Crosshair,
  Award,
} from "lucide-react";

export type KinematicsMode = "single" | "pursuit" | "tickertape";
export type GraphViewMode = "x-t" | "v-t" | "a-t";

export interface GuidedPreset {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  mode: KinematicsMode;
  x0: number;
  v0: number;
  a: number;
  carB_x0?: number;
  carB_v0?: number;
  carB_a?: number;
  explanation: string;
}

export const GUIDED_PRESETS: GuidedPreset[] = [
  {
    id: "pure_uniform",
    title: "Pure Uniform Linear Motion (a = 0)",
    subtitle: "Constant velocity with linear displacement x(t) = v₀t and zero acceleration",
    tag: "Constant Velocity",
    mode: "single",
    x0: 0,
    v0: 15,
    a: 0,
    explanation: "With zero net force, velocity remains strictly constant at 15 m/s. The position graph is a straight line whose slope equals velocity.",
  },
  {
    id: "drag_race",
    title: "Constant Acceleration Drag Launch",
    subtitle: "Accelerating from rest at a = 4.0 m/s² producing quadratic parabolic trajectory",
    tag: "Uniform Acceleration",
    mode: "single",
    x0: 0,
    v0: 0,
    a: 4.0,
    explanation: "Starting from rest (v₀ = 0), position grows quadratically: x(t) = ½at² = 2t². At t = 5s, the cart reaches 50m at 20 m/s (72 km/h).",
  },
  {
    id: "emergency_braking",
    title: "Emergency Braking & Stopping Distance",
    subtitle: "Vehicle traveling at 25 m/s decelerates at a = -5.0 m/s² to a complete stop",
    tag: "Braking Physics",
    mode: "single",
    x0: 0,
    v0: 25,
    a: -5.0,
    explanation: "Decelerating at -5.0 m/s², the vehicle takes t_stop = v₀/|a| = 5.0 seconds and travels d_stop = v₀²/(2|a|) = 62.5 meters to stop.",
  },
  {
    id: "police_pursuit",
    title: "Police Interceptor Pursuit & Overtake",
    subtitle: "Speeding car at constant 20 m/s overtaken by stationary cruiser accelerating at 2.5 m/s²",
    tag: "Multi-Body Kinematics",
    mode: "pursuit",
    x0: 0,
    v0: 20,
    a: 0,
    carB_x0: 0,
    carB_v0: 0,
    carB_a: 2.5,
    explanation: "Car A travels at constant 20 m/s while Car B accelerates at 2.5 m/s². Setting x_A = x_B gives 20t = ½(2.5)t², intercepting at t = 16.0s at x = 320m.",
  },
  {
    id: "apex_reversal",
    title: "Negative Acceleration & Velocity Reversal",
    subtitle: "Cart launched forward at 18 m/s against opposing deceleration of -3.0 m/s²",
    tag: "Reversal & Apex",
    mode: "single",
    x0: 0,
    v0: 18,
    a: -3.0,
    explanation: "Velocity drops to zero at the turning apex t = 6.0s (x_max = 54m), after which the cart moves in the negative direction, crossing the origin at t = 12.0s.",
  },
];

export default function UniformMotionStudio() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "physics/uniformmotionlab",
    "physics",
    "simulation"
  );

  // ── Kinematics Parameters ─────────────────────────────────────────────
  const [activeMode, setActiveMode] = useState<KinematicsMode>("single");
  const [graphMode, setGraphMode] = useState<GraphViewMode>("x-t");
  
  // Car A / Single Cart
  const [x0, setX0] = useState<number>(0); // initial position in meters
  const [v0, setV0] = useState<number>(15); // initial velocity in m/s
  const [a, setA] = useState<number>(0); // acceleration in m/s²
  
  // Car B (Pursuit mode Interceptor)
  const [carB_x0, setCarB_x0] = useState<number>(0);
  const [carB_v0, setCarB_v0] = useState<number>(0);
  const [carB_a, setCarB_a] = useState<number>(2.5);

  const [activePursuitTab, setActivePursuitTab] = useState<"carA" | "carB">("carB");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [time, setTime] = useState<number>(0);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"controls" | "presets" | "theory">("controls");

  // Animation & Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const trajectoryHistoryRef = useRef<Array<{ t: number; xA: number; vA: number; aA: number; xB: number; vB: number; aB: number }>>([]);
  const tickerDotsRef = useRef<number[]>([]);
  const lastTickerTimeRef = useRef<number>(0);

  // ── Analytical Kinematics Solver ──────────────────────────────────────
  const currentPhysics = useMemo(() => {
    // Single cart / Car A
    const carA_X = x0 + v0 * time + 0.5 * a * time * time;
    const carA_V = v0 + a * time;
    const carA_A = a;
    const carA_Displacement = carA_X - x0;

    // Car B
    const carB_X = carB_x0 + carB_v0 * time + 0.5 * carB_a * time * time;
    const carB_V = carB_v0 + carB_a * time;
    const carB_A = carB_a;
    const carB_Displacement = carB_X - carB_x0;

    // Relative kinematics
    const pursuitGap = carA_X - carB_X;
    const relativeSpeed = carB_V - carA_V; // positive if Car B is catching up

    // Emergency stopping metrics (Car A)
    let stoppingTime = 0;
    let stoppingDistance = 0;
    if (a < 0 && v0 > 0) {
      stoppingTime = -v0 / a;
      stoppingDistance = -(v0 * v0) / (2 * a);
    }

    // Interception calculation: xA(t) = xB(t)
    // 0.5 * (aB - aA) * t^2 + (v0B - v0A) * t + (x0B - x0A) = 0
    let interceptionTime: number | null = null;
    let interceptionDist: number | null = null;

    const deltaA = carB_a - a;
    const deltaV = carB_v0 - v0;
    const deltaX = carB_x0 - x0;

    if (Math.abs(deltaA) < 0.0001) {
      // Linear case: deltaV * t + deltaX = 0
      if (Math.abs(deltaV) > 0.0001) {
        const tLin = -deltaX / deltaV;
        if (tLin > 0) {
          interceptionTime = tLin;
          interceptionDist = x0 + v0 * tLin + 0.5 * a * tLin * tLin;
        }
      }
    } else {
      // Quadratic case: 0.5 * deltaA * t^2 + deltaV * t + deltaX = 0
      const A_quad = 0.5 * deltaA;
      const B_quad = deltaV;
      const C_quad = deltaX;
      const disc = B_quad * B_quad - 4 * A_quad * C_quad;
      if (disc >= 0) {
        const t1 = (-B_quad + Math.sqrt(disc)) / (2 * A_quad);
        const t2 = (-B_quad - Math.sqrt(disc)) / (2 * A_quad);
        const positiveRoots = [t1, t2].filter((r) => r > 0.001).sort((r1, r2) => r1 - r2);
        if (positiveRoots.length > 0) {
          interceptionTime = positiveRoots[0];
          interceptionDist = x0 + v0 * interceptionTime + 0.5 * a * interceptionTime * interceptionTime;
        }
      }
    }

    return {
      currentX: carA_X,
      currentV: carA_V,
      currentA: carA_A,
      displacement: carA_Displacement,
      stoppingTime,
      stoppingDistance,
      carA_X,
      carA_V,
      carA_A,
      carB_X,
      carB_V,
      carB_A,
      carB_Displacement,
      pursuitGap,
      relativeSpeed,
      interceptionTime,
      interceptionDist,
    };
  }, [x0, v0, a, time, carB_x0, carB_v0, carB_a]);

  // Sync AI Chatbot
  useEffect(() => {
    setExperimentData({
      title: "Uniform Motion & Kinematics Studio",
      theory: `Kinematic equations: x(t) = x₀ + v₀t + ½at², v(t) = v₀ + at, v² = v₀² + 2aΔx. Area under v-t curve equals displacement Δx; slope equals acceleration a.`,
      extraContext: `Mode = ${activeMode}, Time = ${time.toFixed(2)}s, Car A: [x = ${currentPhysics.carA_X.toFixed(1)}m, v = ${currentPhysics.carA_V.toFixed(1)}m/s, a = ${a}m/s²], Car B: [x = ${currentPhysics.carB_X.toFixed(1)}m, v = ${currentPhysics.carB_V.toFixed(1)}m/s, a = ${carB_a}m/s²], Gap = ${Math.abs(currentPhysics.pursuitGap).toFixed(1)}m.`,
    });
  }, [activeMode, time, currentPhysics, x0, v0, a, carB_a, setExperimentData]);

  // Trigger XP Reward
  const triggerCompletion = useCallback(() => {
    completeExperiment();
  }, [completeExperiment]);

  // Apply Preset
  const handleApplyPreset = (preset: GuidedPreset) => {
    setActiveMode(preset.mode);
    setX0(preset.x0);
    setV0(preset.v0);
    setA(preset.a);
    if (preset.carB_x0 !== undefined) setCarB_x0(preset.carB_x0);
    if (preset.carB_v0 !== undefined) setCarB_v0(preset.carB_v0);
    if (preset.carB_a !== undefined) setCarB_a(preset.carB_a);
    setTime(0);
    trajectoryHistoryRef.current = [];
    tickerDotsRef.current = [];
    lastTickerTimeRef.current = 0;
    triggerCompletion();
  };

  // Reset
  const handleReset = () => {
    setTime(0);
    trajectoryHistoryRef.current = [];
    tickerDotsRef.current = [];
    lastTickerTimeRef.current = 0;
    setIsPlaying(true);
  };

  // ── Main Animation & Canvas Render Loop ───────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isMounted = true;

    const render = (timeNow: number) => {
      if (!isMounted) return;

      const dt = Math.min((timeNow - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timeNow;

      if (isPlaying) {
        setTime((prev) => {
          const nextT = prev + dt;
          // Record history for graphs
          const curXA = x0 + v0 * nextT + 0.5 * a * nextT * nextT;
          const curVA = v0 + a * nextT;
          const curXB = carB_x0 + carB_v0 * nextT + 0.5 * carB_a * nextT * nextT;
          const curVB = carB_v0 + carB_a * nextT;

          trajectoryHistoryRef.current.push({
            t: nextT,
            xA: curXA,
            vA: curVA,
            aA: a,
            xB: curXB,
            vB: curVB,
            aB: carB_a,
          });

          // Downsample if array exceeds 2000 frames to preserve memory while keeping initial origin
          if (trajectoryHistoryRef.current.length > 2000) {
            const first = trajectoryHistoryRef.current[0];
            trajectoryHistoryRef.current = [first, ...trajectoryHistoryRef.current.filter((_, i) => i % 2 === 0)];
          }

          // 50 Hz Ticker Timer: dot every 0.04s
          if (nextT - lastTickerTimeRef.current >= 0.04) {
            lastTickerTimeRef.current = nextT;
            tickerDotsRef.current.push(curXA);
            if (tickerDotsRef.current.length > 80) tickerDotsRef.current.shift();
          }

          return nextT;
        });
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Deep Space / Asphalt Stage Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, "#030712");
      bgGrad.addColorStop(0.5, "#0b1329");
      bgGrad.addColorStop(1, "#020617");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Grid Pattern
      ctx.strokeStyle = "rgba(56, 189, 248, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      const trackPadding = 45;
      const trackWidth = w - trackPadding * 2;
      const xMin = -10;
      const xMax = 190;
      const metersToPixels = (m: number) => trackPadding + ((m - xMin) / (xMax - xMin)) * trackWidth;

      if (activeMode === "single" || activeMode === "tickertape") {
        // ── MODE 1 / 3: SINGLE CART TRACK ──
        const trackY = h * 0.62;

        // Track Rails
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(trackPadding - 10, trackY, trackWidth + 20, 16);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(trackPadding - 10, trackY);
        ctx.lineTo(trackPadding + trackWidth + 10, trackY);
        ctx.stroke();

        // Scale Ticks
        for (let m = 0; m <= 180; m += 10) {
          const px = metersToPixels(m);
          const isMajor = m % 20 === 0;
          ctx.strokeStyle = isMajor ? "rgba(56, 189, 248, 0.8)" : "rgba(148, 163, 184, 0.4)";
          ctx.lineWidth = isMajor ? 2 : 1;
          ctx.beginPath();
          ctx.moveTo(px, trackY);
          ctx.lineTo(px, trackY + (isMajor ? 14 : 7));
          ctx.stroke();

          if (isMajor) {
            ctx.fillStyle = "#94a3b8";
            ctx.font = "bold 9px monospace";
            ctx.textAlign = "center";
            ctx.fillText(`${m}m`, px, trackY + 26);
          }
        }

        // Origin Flag (x = 0)
        const originPx = metersToPixels(0);
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(originPx, trackY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText("x=0", originPx, trackY + 38);

        // Ticker Tape Trail
        if (activeMode === "tickertape") {
          ctx.fillStyle = "rgba(254, 240, 138, 0.85)";
          ctx.fillRect(trackPadding, trackY - 45, trackWidth, 10);
          ctx.fillStyle = "#000000";
          tickerDotsRef.current.forEach((dotM) => {
            const dpx = metersToPixels(dotM % 200);
            ctx.beginPath();
            ctx.arc(dpx, trackY - 40, 2, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.fillStyle = "#fde047";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "left";
          ctx.fillText("TICKER TAPE (50 Hz VIBRATING PIN DOTS)", trackPadding, trackY - 52);
        }

        // Cart Chassis
        const cartX_px = metersToPixels(currentPhysics.currentX % 200);
        const cartY_px = trackY - 24;
        const cartW = 44;
        const cartH = 22;

        ctx.save();
        ctx.translate(cartX_px, cartY_px);
        const cartGrad = ctx.createLinearGradient(-cartW / 2, -cartH / 2, cartW / 2, cartH / 2);
        cartGrad.addColorStop(0, "#0284c7");
        cartGrad.addColorStop(1, "#0369a1");
        ctx.fillStyle = cartGrad;
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-cartW / 2, -cartH / 2, cartW, cartH, 6);
        ctx.fill();
        ctx.stroke();

        // Wheels
        ctx.fillStyle = "#0f172a";
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1.5;
        [-cartW / 3, cartW / 3].forEach((wx) => {
          ctx.beginPath();
          ctx.arc(wx, cartH / 2 + 2, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });

        // Label
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px monospace";
        ctx.textAlign = "center";
        ctx.fillText("CART", 0, 3);
        ctx.restore();

        // Real-Time Velocity Vector Arrow v⃗ (Emerald Green)
        const vLength = Math.max(-60, Math.min(60, currentPhysics.currentV * 2.2));
        if (Math.abs(vLength) > 2) {
          ctx.strokeStyle = "#10b981";
          ctx.fillStyle = "#10b981";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cartX_px, cartY_px - 14);
          ctx.lineTo(cartX_px + vLength, cartY_px - 14);
          ctx.stroke();

          const arrowDir = vLength >= 0 ? 1 : -1;
          ctx.beginPath();
          ctx.moveTo(cartX_px + vLength, cartY_px - 14);
          ctx.lineTo(cartX_px + vLength - 6 * arrowDir, cartY_px - 18);
          ctx.lineTo(cartX_px + vLength - 6 * arrowDir, cartY_px - 10);
          ctx.closePath();
          ctx.fill();

          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.fillText(`v⃗ = ${currentPhysics.currentV.toFixed(1)} m/s`, cartX_px + vLength / 2, cartY_px - 22);
        }

        // Real-Time Acceleration Vector Arrow a⃗ (Amber)
        const aLength = Math.max(-50, Math.min(50, a * 5.0));
        if (Math.abs(aLength) > 2) {
          ctx.strokeStyle = "#f59e0b";
          ctx.fillStyle = "#f59e0b";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(cartX_px, cartY_px + 30);
          ctx.lineTo(cartX_px + aLength, cartY_px + 30);
          ctx.stroke();

          const arrowDir = aLength >= 0 ? 1 : -1;
          ctx.beginPath();
          ctx.moveTo(cartX_px + aLength, cartY_px + 30);
          ctx.lineTo(cartX_px + aLength - 5 * arrowDir, cartY_px + 26);
          ctx.lineTo(cartX_px + aLength - 5 * arrowDir, cartY_px + 34);
          ctx.closePath();
          ctx.fill();

          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.fillText(`a⃗ = ${a.toFixed(1)} m/s²`, cartX_px + aLength / 2, cartY_px + 44);
        }
      } else {
        // ── MODE 2: DUAL-LANE PURSUIT RACING ARENA ──
        const lane1_Y = h * 0.42; // Lane 1: Car A (Cruiser)
        const lane2_Y = h * 0.72; // Lane 2: Car B (Interceptor)

        // Draw Lane 1 Road Asphalt
        ctx.fillStyle = "#111827";
        ctx.fillRect(trackPadding - 10, lane1_Y - 20, trackWidth + 20, 36);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(trackPadding - 10, lane1_Y - 20, trackWidth + 20, 36);

        // Draw Lane 2 Road Asphalt
        ctx.fillStyle = "#111827";
        ctx.fillRect(trackPadding - 10, lane2_Y - 20, trackWidth + 20, 36);
        ctx.strokeStyle = "rgba(240, 171, 252, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(trackPadding - 10, lane2_Y - 20, trackWidth + 20, 36);

        // Distance Ticks for Lanes
        for (let m = 0; m <= 180; m += 20) {
          const px = metersToPixels(m);
          ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px, lane1_Y - 20);
          ctx.lineTo(px, lane2_Y + 16);
          ctx.stroke();

          ctx.fillStyle = "#94a3b8";
          ctx.font = "bold 8px monospace";
          ctx.textAlign = "center";
          ctx.fillText(`${m}m`, px, lane2_Y + 28);
        }

        // Start Line (x = 0)
        const startPx = metersToPixels(0);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startPx, lane1_Y - 20);
        ctx.lineTo(startPx, lane2_Y + 16);
        ctx.stroke();

        // Interception Projection Line if calculated
        if (currentPhysics.interceptionDist !== null && currentPhysics.interceptionDist <= 190) {
          const intPx = metersToPixels(currentPhysics.interceptionDist);
          ctx.strokeStyle = "#eab308";
          ctx.setLineDash([4, 3]);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(intPx, lane1_Y - 20);
          ctx.lineTo(intPx, lane2_Y + 16);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = "#eab308";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.fillText(`⚡ OVERTAKE @ ${currentPhysics.interceptionDist.toFixed(0)}m (${currentPhysics.interceptionTime?.toFixed(1)}s)`, intPx, lane1_Y - 24);
        }

        // Lane Labels
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "left";
        ctx.fillText("LANE 1: CAR A (CRUISER)", trackPadding - 5, lane1_Y - 24);

        ctx.fillStyle = "#f0abfc";
        ctx.fillText("LANE 2: CAR B (INTERCEPTOR)", trackPadding - 5, lane2_Y - 24);

        // ── CAR A (Lane 1 - Cyan) ──
        const carA_px = metersToPixels(currentPhysics.carA_X % 200);
        ctx.save();
        ctx.translate(carA_px, lane1_Y);
        const carAGrad = ctx.createLinearGradient(-22, -11, 22, 11);
        carAGrad.addColorStop(0, "#0284c7");
        carAGrad.addColorStop(1, "#0369a1");
        ctx.fillStyle = carAGrad;
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-22, -11, 44, 22, 5);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px monospace";
        ctx.textAlign = "center";
        ctx.fillText("CAR A", 0, 3);
        ctx.restore();

        // Car A Velocity Vector
        const vA_len = Math.max(-50, Math.min(50, currentPhysics.carA_V * 2.0));
        if (Math.abs(vA_len) > 2) {
          ctx.strokeStyle = "#38bdf8";
          ctx.fillStyle = "#38bdf8";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(carA_px, lane1_Y - 14);
          ctx.lineTo(carA_px + vA_len, lane1_Y - 14);
          ctx.stroke();
          ctx.font = "bold 8px monospace";
          ctx.textAlign = "center";
          ctx.fillText(`vA = ${currentPhysics.carA_V.toFixed(1)} m/s`, carA_px + vA_len / 2, lane1_Y - 18);
        }

        // ── CAR B (Lane 2 - Fuchsia) ──
        const carB_px = metersToPixels(currentPhysics.carB_X % 200);
        ctx.save();
        ctx.translate(carB_px, lane2_Y);
        const carBGrad = ctx.createLinearGradient(-22, -11, 22, 11);
        carBGrad.addColorStop(0, "#c026d3");
        carBGrad.addColorStop(1, "#9333ea");
        ctx.fillStyle = carBGrad;
        ctx.strokeStyle = "#f0abfc";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-22, -11, 44, 22, 5);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px monospace";
        ctx.textAlign = "center";
        ctx.fillText("CAR B", 0, 3);
        ctx.restore();

        // Car B Velocity Vector
        const vB_len = Math.max(-50, Math.min(50, currentPhysics.carB_V * 2.0));
        if (Math.abs(vB_len) > 2) {
          ctx.strokeStyle = "#f0abfc";
          ctx.fillStyle = "#f0abfc";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(carB_px, lane2_Y + 18);
          ctx.lineTo(carB_px + vB_len, lane2_Y + 18);
          ctx.stroke();
          ctx.font = "bold 8px monospace";
          ctx.textAlign = "center";
          ctx.fillText(`vB = ${currentPhysics.carB_V.toFixed(1)} m/s`, carB_px + vB_len / 2, lane2_Y + 28);
        }

        // Real-Time Dynamic Gap Connector Between Vehicles
        ctx.strokeStyle = "rgba(234, 179, 8, 0.7)";
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(carB_px, lane2_Y);
        ctx.lineTo(carA_px, lane1_Y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Gap Badge
        const gapMidX = (carA_px + carB_px) / 2;
        const gapMidY = (lane1_Y + lane2_Y) / 2;
        ctx.fillStyle = "#0f172a";
        ctx.strokeStyle = "#eab308";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(gapMidX - 45, gapMidY - 9, 90, 18, 5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#fde047";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`GAP: ${Math.abs(currentPhysics.pursuitGap).toFixed(1)}m`, gapMidX, gapMidY + 3.5);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeMode, x0, v0, a, carB_x0, carB_v0, carB_a, isPlaying, currentPhysics]);

  // ── Graph Render Loop (x-t, v-t, a-t) ─────────────────────────────────
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Deep Dark Graph Background
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, w, h);

    // Axes
    const originX = 35;
    const originY = h - 25;
    const plotW = w - originX - 15;
    const plotH = h - 45;

    ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(originX, 15);
    ctx.lineTo(originX, originY);
    ctx.lineTo(originX + plotW, originY);
    ctx.stroke();

    // Axis Labels & Grid
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 8px monospace";
    ctx.textAlign = "right";
    ctx.fillText("t (s)", originX + plotW, originY + 14);

    // Explicit origin label (t = 0)
    ctx.textAlign = "center";
    ctx.fillText("0", originX, originY + 12);

    const maxT = Math.max(10, time);
    const timeToPx = (t: number) => originX + (t / maxT) * plotW;

    // Time axis ticks
    for (let tTick = 2; tTick <= maxT; tTick += Math.ceil(maxT / 5)) {
      const tx = timeToPx(tTick);
      ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
      ctx.beginPath();
      ctx.moveTo(tx, originY);
      ctx.lineTo(tx, originY + 4);
      ctx.stroke();
      ctx.fillText(`${tTick}s`, tx, originY + 12);
    }

    // Always ensure trajectory points start strictly at t = 0
    const rawHistory = trajectoryHistoryRef.current;
    const history = [
      { t: 0, xA: x0, vA: v0, aA: a, xB: carB_x0, vB: carB_v0, aB: carB_a },
      ...rawHistory.filter((pt) => pt.t > 0),
    ];

    if (graphMode === "x-t") {
      // Position-Time Graph
      ctx.textAlign = "left";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(activeMode === "pursuit" ? "x(t) [m] (Cyan: Car A, Fuchsia: Car B)" : "x(t) [m]", originX + 5, 14);

      const allX = activeMode === "pursuit" 
        ? [...history.map((pt) => pt.xA), ...history.map((pt) => pt.xB)]
        : history.map((pt) => pt.xA);

      const maxY = Math.max(50, x0 + 10, ...allX);
      const minY = Math.min(0, x0 - 10, ...allX);
      const rangeY = maxY - minY || 1;
      const yToPx = (xVal: number) => originY - ((xVal - minY) / rangeY) * plotH;

      // Draw y = 0 origin line
      if (minY <= 0 && maxY >= 0) {
        const zeroYPx = yToPx(0);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(originX, zeroYPx);
        ctx.lineTo(originX + plotW, zeroYPx);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(56, 189, 248, 0.6)";
        ctx.textAlign = "right";
        ctx.fillText("x=0", originX - 4, zeroYPx + 3);
      }

      // Plot Car A (Cyan)
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      history.forEach((pt, idx) => {
        const px = timeToPx(pt.t);
        const py = yToPx(pt.xA);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Plot Car B in Pursuit mode (Fuchsia)
      if (activeMode === "pursuit") {
        ctx.strokeStyle = "#f0abfc";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        history.forEach((pt, idx) => {
          const px = timeToPx(pt.t);
          const py = yToPx(pt.xB);
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }

      // Current Point
      const lastPt = history[history.length - 1];
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(timeToPx(lastPt.t), yToPx(lastPt.xA), 4, 0, Math.PI * 2);
      ctx.fill();

      if (activeMode === "pursuit") {
        ctx.fillStyle = "#f0abfc";
        ctx.beginPath();
        ctx.arc(timeToPx(lastPt.t), yToPx(lastPt.xB), 4, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (graphMode === "v-t") {
      // Velocity-Time Graph
      ctx.textAlign = "left";
      ctx.fillStyle = "#10b981";
      ctx.fillText("v(t) [m/s] (Slope = a, Area = Δx)", originX + 5, 14);

      const allV = activeMode === "pursuit"
        ? [...history.map((pt) => pt.vA), ...history.map((pt) => pt.vB)]
        : history.map((pt) => pt.vA);

      const maxV = Math.max(30, v0 + 10, ...allV);
      const minV = Math.min(-10, v0 - 10, ...allV);
      const rangeV = maxV - minV || 1;
      const vToPx = (vVal: number) => originY - ((vVal - minV) / rangeV) * plotH;

      // Draw v = 0 baseline
      const zeroVPx = vToPx(0);
      ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(originX, zeroVPx);
      ctx.lineTo(originX + plotW, zeroVPx);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(16, 185, 129, 0.6)";
      ctx.textAlign = "right";
      ctx.fillText("v=0", originX - 4, zeroVPx + 3);

      // Shaded Area Under Curve for Car A (Displacement Δx)
      ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
      ctx.beginPath();
      ctx.moveTo(timeToPx(0), zeroVPx);
      history.forEach((pt) => {
        ctx.lineTo(timeToPx(pt.t), vToPx(pt.vA));
      });
      ctx.lineTo(timeToPx(history[history.length - 1].t), zeroVPx);
      ctx.closePath();
      ctx.fill();

      // Car A Curve (Green/Cyan)
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      history.forEach((pt, idx) => {
        const px = timeToPx(pt.t);
        const py = vToPx(pt.vA);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Car B Curve (Fuchsia) in Pursuit
      if (activeMode === "pursuit") {
        ctx.strokeStyle = "#f0abfc";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        history.forEach((pt, idx) => {
          const px = timeToPx(pt.t);
          const py = vToPx(pt.vB);
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }

      // Current Point
      const lastPt = history[history.length - 1];
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(timeToPx(lastPt.t), vToPx(lastPt.vA), 4, 0, Math.PI * 2);
      ctx.fill();

      if (activeMode === "pursuit") {
        ctx.fillStyle = "#f0abfc";
        ctx.beginPath();
        ctx.arc(timeToPx(lastPt.t), vToPx(lastPt.vB), 4, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Acceleration-Time Graph
      ctx.textAlign = "left";
      ctx.fillStyle = "#f59e0b";
      ctx.fillText("a(t) [m/s²]", originX + 5, 14);

      const maxA = Math.max(10, Math.abs(a) * 1.5, Math.abs(carB_a) * 1.5);
      const aToPx = (aVal: number) => originY - ((aVal + maxA) / (2 * maxA)) * plotH;

      // Draw a = 0 baseline
      const zeroAPx = aToPx(0);
      ctx.strokeStyle = "rgba(245, 158, 11, 0.3)";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(originX, zeroAPx);
      ctx.lineTo(originX + plotW, zeroAPx);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(245, 158, 11, 0.6)";
      ctx.textAlign = "right";
      ctx.fillText("a=0", originX - 4, zeroAPx + 3);

      // Car A
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      history.forEach((pt, idx) => {
        const px = timeToPx(pt.t);
        const py = aToPx(pt.aA);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Car B in Pursuit
      if (activeMode === "pursuit") {
        ctx.strokeStyle = "#f0abfc";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        history.forEach((pt, idx) => {
          const px = timeToPx(pt.t);
          const py = aToPx(pt.aB);
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }

      // Current Point
      const lastPt = history[history.length - 1];
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(timeToPx(lastPt.t), aToPx(lastPt.aA), 4, 0, Math.PI * 2);
      ctx.fill();

      if (activeMode === "pursuit") {
        ctx.fillStyle = "#f0abfc";
        ctx.beginPath();
        ctx.arc(timeToPx(lastPt.t), aToPx(lastPt.aB), 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [graphMode, time, a, carB_a, activeMode, x0, v0, carB_x0, carB_v0]);

  // Export CSV
  const handleExportCSV = () => {
    const rows = [
      ["Time (s)", "Car A x (m)", "Car A v (m/s)", "Car A a (m/s^2)", "Car B x (m)", "Car B v (m/s)", "Car B a (m/s^2)"],
      ...trajectoryHistoryRef.current.map((pt) => [
        pt.t.toFixed(3),
        pt.xA.toFixed(3),
        pt.vA.toFixed(3),
        pt.aA.toFixed(3),
        pt.xB.toFixed(3),
        pt.vB.toFixed(3),
        pt.aB.toFixed(3),
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kinematics_telemetry_${Date.now()}.csv`);
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
              <Car size={22} />
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
              Uniform Motion & Kinematics Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-mono font-bold">
              v = v₀ + at | x = x₀ + v₀t + ½at²
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Linear kinematics, vector overlay dynamics, dual-vehicle pursuit race, and synchronized x-t, v-t, a-t graphs.
          </p>
        </div>

        {/* Simulation Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer shadow-xs ${
              isPlaying
                ? "bg-amber-500 hover:bg-amber-600 text-black"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? "Pause" : "Simulate"}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-card border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition cursor-pointer"
            title="Reset to t = 0"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-card border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition cursor-pointer"
            title="Export CSV"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace: Central Stage (Left 7 cols) + Control Deck (Right 5 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Physical Motion Canvas + Synchronized Graphs (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Main Simulation Stage */}
          <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
            {/* Top Floating Badges */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/10 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-xs" />
                <span>t = {time.toFixed(2)} s</span>
              </span>

              {activeMode === "pursuit" ? (
                <span className="px-2.5 py-1 bg-fuchsia-950/80 backdrop-blur-md rounded-full text-fuchsia-300 text-[10px] font-mono font-black border border-fuchsia-500/30 flex items-center gap-1">
                  <Crosshair size={11} />
                  <span>Gap: {Math.abs(currentPhysics.pursuitGap).toFixed(1)}m</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-sky-950/80 backdrop-blur-md rounded-full text-sky-300 text-[10px] font-mono font-black border border-sky-500/30">
                  x = {currentPhysics.currentX.toFixed(1)} m
                </span>
              )}
            </div>

            {/* Mode Switcher Badges */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/10">
              {[
                { id: "single", label: "Single Cart" },
                { id: "pursuit", label: "Pursuit Race" },
                { id: "tickertape", label: "Ticker Tape" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setActiveMode(m.id as KinematicsMode);
                    triggerCompletion();
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                    activeMode === m.id
                      ? "bg-primary text-primary-foreground font-black"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Main Interactive Motion Canvas */}
            <canvas
              ref={canvasRef}
              width={720}
              height={300}
              className="w-full h-[250px] sm:h-[300px] block"
            />
          </div>

          {/* Synchronized Kinematics Graphs Panel */}
          <div className="bg-card border border-border rounded-3xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
                  Synchronized Kinematic Graphs
                </h3>
              </div>

              {/* Graph Mode Switcher */}
              <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
                {[
                  { id: "x-t", label: "x(t) Position" },
                  { id: "v-t", label: "v(t) Velocity" },
                  { id: "a-t", label: "a(t) Acceleration" },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGraphMode(g.id as GraphViewMode)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      graphMode === g.id
                        ? "bg-primary text-primary-foreground font-black"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <canvas
              ref={graphCanvasRef}
              width={720}
              height={140}
              className="w-full h-[120px] rounded-2xl block border border-border/50"
            />
          </div>
        </div>

        {/* Right Column: Multi-Tab Console Deck + Live Telemetry Cards + Daily Challenge (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-card border border-border rounded-3xl p-5 shadow-xs space-y-4">
            {/* Console Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-border">
              {[
                { id: "controls", label: "Controls", icon: Sliders },
                { id: "presets", label: "Guided Presets", icon: Layers },
                { id: "theory", label: "Formulas & Proofs", icon: Sparkles },
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

            {/* ── TAB 1: CONTROLS ── */}
            {activeConsoleTab === "controls" && (
              <div className="space-y-4">
                {activeMode === "pursuit" ? (
                  /* ── DUAL VEHICLE PURSUIT CONTROLS ── */
                  <div className="space-y-3">
                    {/* Vehicle Sub-Tabs */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-muted/60 rounded-2xl border border-border">
                      <button
                        type="button"
                        onClick={() => setActivePursuitTab("carA")}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                          activePursuitTab === "carA"
                            ? "bg-sky-500 text-white shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Car size={13} />
                        <span>Car A (Cruiser)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActivePursuitTab("carB")}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                          activePursuitTab === "carB"
                            ? "bg-fuchsia-600 text-white shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Car size={13} />
                        <span>Car B (Interceptor)</span>
                      </button>
                    </div>

                    {/* CAR A CONTROLS */}
                    {activePursuitTab === "carA" ? (
                      <div className="p-4 bg-sky-950/20 border border-sky-500/30 rounded-2xl space-y-3.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-black text-sky-400">Car A: Position x₀A</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="-20"
                              max="100"
                              value={x0}
                              onChange={(e) => setX0(Number(e.target.value))}
                              className="w-16 px-2 py-0.5 rounded-lg bg-card border border-border text-sky-400 font-mono font-bold text-right text-xs"
                            />
                            <span className="text-muted-foreground font-mono">m</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="-20"
                          max="80"
                          step="1"
                          value={x0}
                          onChange={(e) => setX0(Number(e.target.value))}
                          className="w-full accent-sky-400 cursor-pointer"
                        />

                        <div className="flex items-center justify-between text-xs">
                          <span className="font-black text-sky-400">Car A: Initial Speed v₀A</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="-20"
                              max="50"
                              step="0.5"
                              value={v0}
                              onChange={(e) => setV0(Number(e.target.value))}
                              className="w-16 px-2 py-0.5 rounded-lg bg-card border border-border text-sky-400 font-mono font-bold text-right text-xs"
                            />
                            <span className="text-muted-foreground font-mono">m/s</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="-10"
                          max="40"
                          step="0.5"
                          value={v0}
                          onChange={(e) => setV0(Number(e.target.value))}
                          className="w-full accent-sky-400 cursor-pointer"
                        />

                        <div className="flex items-center justify-between text-xs">
                          <span className="font-black text-sky-400">Car A: Acceleration aA</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="-10"
                              max="10"
                              step="0.2"
                              value={a}
                              onChange={(e) => setA(Number(e.target.value))}
                              className="w-16 px-2 py-0.5 rounded-lg bg-card border border-border text-sky-400 font-mono font-bold text-right text-xs"
                            />
                            <span className="text-muted-foreground font-mono">m/s²</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="-8"
                          max="8"
                          step="0.2"
                          value={a}
                          onChange={(e) => setA(Number(e.target.value))}
                          className="w-full accent-sky-400 cursor-pointer"
                        />
                      </div>
                    ) : (
                      /* CAR B CONTROLS */
                      <div className="p-4 bg-fuchsia-950/20 border border-fuchsia-500/30 rounded-2xl space-y-3.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-black text-fuchsia-400">Car B: Position x₀B</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="-20"
                              max="100"
                              value={carB_x0}
                              onChange={(e) => setCarB_x0(Number(e.target.value))}
                              className="w-16 px-2 py-0.5 rounded-lg bg-card border border-border text-fuchsia-400 font-mono font-bold text-right text-xs"
                            />
                            <span className="text-muted-foreground font-mono">m</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="-20"
                          max="80"
                          step="1"
                          value={carB_x0}
                          onChange={(e) => setCarB_x0(Number(e.target.value))}
                          className="w-full accent-fuchsia-400 cursor-pointer"
                        />

                        <div className="flex items-center justify-between text-xs">
                          <span className="font-black text-fuchsia-400">Car B: Initial Speed v₀B</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="-20"
                              max="50"
                              step="0.5"
                              value={carB_v0}
                              onChange={(e) => setCarB_v0(Number(e.target.value))}
                              className="w-16 px-2 py-0.5 rounded-lg bg-card border border-border text-fuchsia-400 font-mono font-bold text-right text-xs"
                            />
                            <span className="text-muted-foreground font-mono">m/s</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="-10"
                          max="40"
                          step="0.5"
                          value={carB_v0}
                          onChange={(e) => setCarB_v0(Number(e.target.value))}
                          className="w-full accent-fuchsia-400 cursor-pointer"
                        />

                        <div className="flex items-center justify-between text-xs">
                          <span className="font-black text-fuchsia-400">Car B: Acceleration aB</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="-10"
                              max="10"
                              step="0.2"
                              value={carB_a}
                              onChange={(e) => setCarB_a(Number(e.target.value))}
                              className="w-16 px-2 py-0.5 rounded-lg bg-card border border-border text-fuchsia-400 font-mono font-bold text-right text-xs"
                            />
                            <span className="text-muted-foreground font-mono">m/s²</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="-8"
                          max="8"
                          step="0.2"
                          value={carB_a}
                          onChange={(e) => setCarB_a(Number(e.target.value))}
                          className="w-full accent-fuchsia-400 cursor-pointer"
                        />
                      </div>
                    )}

                    {/* Interception Solver Live Banner */}
                    <div className="p-3 bg-muted/60 border border-border rounded-2xl text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Analytical Overtake:</span>
                        <span className="font-black font-mono text-amber-400">
                          {currentPhysics.interceptionTime !== null
                            ? `t = ${currentPhysics.interceptionTime.toFixed(1)}s (at x = ${currentPhysics.interceptionDist?.toFixed(1)}m)`
                            : "No Interception"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── SINGLE CART KINEMATICS CONTROLS ── */
                  <>
                    {/* Initial Position x0 */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-muted-foreground">Initial Position (x₀):</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="-50"
                            max="100"
                            step="1"
                            value={x0}
                            onChange={(e) => setX0(Number(e.target.value))}
                            className="w-18 px-2 py-0.5 rounded-lg bg-muted border border-border text-sky-400 font-mono font-black text-right text-xs focus:border-sky-400 focus:outline-none"
                          />
                          <span className="text-xs font-mono font-bold text-muted-foreground">m</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="-20"
                        max="80"
                        step="1"
                        value={x0}
                        onChange={(e) => setX0(Number(e.target.value))}
                        className="w-full accent-sky-400 cursor-pointer"
                      />
                    </div>

                    {/* Initial Velocity v0 */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-muted-foreground">Initial Velocity (v₀):</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="-30"
                            max="50"
                            step="0.5"
                            value={v0}
                            onChange={(e) => setV0(Number(e.target.value))}
                            className="w-18 px-2 py-0.5 rounded-lg bg-muted border border-border text-emerald-400 font-mono font-black text-right text-xs focus:border-emerald-400 focus:outline-none"
                          />
                          <span className="text-xs font-mono font-bold text-muted-foreground">m/s</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="-20"
                        max="40"
                        step="0.5"
                        value={v0}
                        onChange={(e) => setV0(Number(e.target.value))}
                        className="w-full accent-emerald-400 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                        <span>-20 m/s (Reverse)</span>
                        <span>0 m/s</span>
                        <span>40 m/s (Forward)</span>
                      </div>
                    </div>

                    {/* Acceleration a */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-muted-foreground">Acceleration (a):</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="-15"
                            max="15"
                            step="0.2"
                            value={a}
                            onChange={(e) => setA(Number(e.target.value))}
                            className="w-18 px-2 py-0.5 rounded-lg bg-muted border border-border text-amber-400 font-mono font-black text-right text-xs focus:border-amber-400 focus:outline-none"
                          />
                          <span className="text-xs font-mono font-bold text-muted-foreground">m/s²</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        step="0.2"
                        value={a}
                        onChange={(e) => setA(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                        <span>-10 m/s² (Braking)</span>
                        <span>0 m/s² (Uniform)</span>
                        <span>+10 m/s² (Thrust)</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── TAB 2: GUIDED PRESETS ── */}
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

            {/* ── TAB 3: FORMULAS & PROOFS ── */}
            {activeConsoleTab === "theory" && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-muted/50 rounded-2xl border border-border space-y-2 font-mono text-[11px]">
                  <div className="text-muted-foreground">1. Velocity Equation:</div>
                  <div className="text-emerald-400 font-bold">v(t) = v₀ + a · t</div>
                  <div className="text-muted-foreground mt-2">2. Position-Time Equation:</div>
                  <div className="text-sky-400 font-bold">x(t) = x₀ + v₀ · t + ½ · a · t²</div>
                  <div className="text-muted-foreground mt-2">3. Timeless Equation (Torricelli):</div>
                  <div className="text-amber-400 font-bold">v² = v₀² + 2 · a · Δx</div>
                  <div className="text-muted-foreground mt-2">4. Interception Equation:</div>
                  <div className="text-fuchsia-400 font-bold">x_A(t) = x_B(t)</div>
                </div>
              </div>
            )}
          </div>

          {/* ── Live Kinematics Telemetry Grid (Docked in Right Column) ── */}
          {activeMode === "pursuit" ? (
            /* Pursuit Mode Dual Vehicle Telemetry */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Car A x(t)</span>
                <div className="text-base font-black font-mono text-sky-400 mt-0.5">
                  {currentPhysics.carA_X.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">m</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">vA: {currentPhysics.carA_V.toFixed(1)} m/s</div>
              </div>

              <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
                <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider">Car B x(t)</span>
                <div className="text-base font-black font-mono text-fuchsia-400 mt-0.5">
                  {currentPhysics.carB_X.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">m</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">vB: {currentPhysics.carB_V.toFixed(1)} m/s</div>
              </div>

              <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Pursuit Gap</span>
                <div className="text-base font-black font-mono text-amber-400 mt-0.5">
                  {Math.abs(currentPhysics.pursuitGap).toFixed(1)} <span className="text-xs font-normal text-muted-foreground">m</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {currentPhysics.relativeSpeed > 0 ? `Closing: +${currentPhysics.relativeSpeed.toFixed(1)}m/s` : `Opening: ${currentPhysics.relativeSpeed.toFixed(1)}m/s`}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Overtake</span>
                <div className="text-base font-black font-mono text-emerald-400 mt-0.5">
                  {currentPhysics.interceptionTime !== null ? `${currentPhysics.interceptionTime.toFixed(1)}s` : "None"}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {currentPhysics.interceptionDist !== null ? `@ ${currentPhysics.interceptionDist.toFixed(0)}m` : "No catch"}
                </div>
              </div>
            </div>
          ) : (
            /* Single Cart Telemetry */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Position x(t)</span>
                <div className="text-base sm:text-lg font-black font-mono text-sky-400 mt-0.5">
                  {currentPhysics.currentX.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">m</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Velocity v(t)</span>
                <div className="text-base sm:text-lg font-black font-mono text-emerald-400 mt-0.5">
                  {currentPhysics.currentV.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">m/s</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Acceleration (a)</span>
                <div className="text-base sm:text-lg font-black font-mono text-amber-400 mt-0.5">
                  {a.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">m/s²</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Displacement (Δx)</span>
                <div className="text-base sm:text-lg font-black font-mono text-pink-400 mt-0.5">
                  {currentPhysics.displacement.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">m</span>
                </div>
              </div>
            </div>
          )}

          {/* Daily Challenge Card */}
          <DailyChallengeCard
            labId="physics/uniformmotionlab"
            currentParams={{
              position: currentPhysics.currentX,
              time,
              speed: currentPhysics.currentV,
            }}
          />
        </div>
      </div>
    </div>
  );
}
