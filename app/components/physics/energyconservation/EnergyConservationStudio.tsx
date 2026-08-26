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
  Globe,
  Compass,
  Flame,
  TrendingUp,
  Cpu,
  Move,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────
export type TrackGeometryType = "loop_the_loop" | "double_valley" | "hill_slope" | "freeform_spline";

export interface SplineNode {
  id: string;
  x: number;
  y: number;
}

export interface PlanetaryPreset {
  id: string;
  name: string;
  g: number;
  icon: any;
  accent: string;
}

export const PLANETARY_PRESETS: PlanetaryPreset[] = [
  { id: "earth", name: "Earth", g: 9.81, icon: Globe, accent: "#38bdf8" },
  { id: "moon", name: "Moon", g: 1.62, icon: Compass, accent: "#cbd5e1" },
  { id: "mars", name: "Mars", g: 3.72, icon: Flame, accent: "#fb923c" },
  { id: "jupiter", name: "Jupiter", g: 24.79, icon: Zap, accent: "#facc15" },
  { id: "zero_g", name: "Zero-G Lab", g: 0.0, icon: Sparkles, accent: "#c084fc" },
];

export interface GuidedPreset {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  trackType: TrackGeometryType;
  massKg: number;
  frictionMu: number;
  planetId: string;
  explanation: string;
}

export const GUIDED_PRESETS: GuidedPreset[] = [
  {
    id: "loop_apex_critical",
    title: "Critical Loop-the-Loop (h_min = 2.5R)",
    subtitle: "Verify minimum drop height required so normal force FN ≥ 0 at apex",
    tag: "Centripetal",
    trackType: "loop_the_loop",
    massKg: 500,
    frictionMu: 0.0,
    planetId: "earth",
    explanation: "To complete a vertical loop of radius R = 11.5m without falling off at the apex, normal force FN ≥ 0 requires v_apex ≥ √(gR) = 10.6 m/s. Under conservative energy conservation, the required minimum drop height is h_min = 2.5R = 28.75m.",
  },
  {
    id: "conservative_double_hill",
    title: "Frictionless Mechanical Energy Interchange",
    subtitle: "Continuous PE ↔ KE interchange with strictly constant total energy",
    tag: "Conservation",
    trackType: "double_valley",
    massKg: 400,
    frictionMu: 0.0,
    planetId: "earth",
    explanation: "In zero friction (μ = 0), total mechanical energy E_total = mgy + ½mv² is strictly constant. Gravitational PE converts completely into kinetic energy at track valleys and returns to identical PE at matching crests.",
  },
  {
    id: "thermal_friction_dissipation",
    title: "Thermal Energy Dissipation & Braking",
    subtitle: "Tracking mechanical energy conversion into thermal friction heat",
    tag: "Thermodynamics",
    trackType: "double_valley",
    massKg: 600,
    frictionMu: 0.04,
    planetId: "earth",
    explanation: "With friction (μ = 0.04), non-conservative friction work fk = μk·mg·cos(θ) continuously performs negative work, transforming mechanical energy into thermal dissipation (Eth), dampening cart oscillations.",
  },
  {
    id: "lunar_gravity_coaster",
    title: "Apollo Lunar Coaster (g = 1.62 m/s²)",
    subtitle: "Slow-motion low-gravity kinematics across lunar hills",
    tag: "Astrophysics",
    trackType: "hill_slope",
    massKg: 300,
    frictionMu: 0.01,
    planetId: "moon",
    explanation: "Under lunar gravity (1.62 m/s²), potential energy per unit height is reduced by 83.5%, producing graceful, slow-motion acceleration and lower peak kinetic energy.",
  },
  {
    id: "apex_weightlessness",
    title: "Apex Zero-G Weightlessness",
    subtitle: "Normal force reaches exactly 0g at crest top",
    tag: "G-Forces",
    trackType: "double_valley",
    massKg: 500,
    frictionMu: 0.0,
    planetId: "earth",
    explanation: "When a coaster crests a hill with velocity v = √(g·r_curve), the required centripetal acceleration equals gravity (a_c = g), causing riders to experience pure zero-G weightlessness (FN = 0).",
  },
];

export default function EnergyConservationStudio() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "physics/energyconservation",
    "physics",
    "simulation"
  );

  // ── Physics Parameters ────────────────────────────────────────────────
  const [trackType, setTrackType] = useState<TrackGeometryType>("loop_the_loop");
  const [cartMass, setCartMass] = useState<number>(500); // 10 .. 2000 kg
  const [frictionMu, setFrictionMu] = useState<number>(0.012); // 0 .. 0.15
  const [selectedPlanet, setSelectedPlanet] = useState<string>("earth");

  // Playback & UI State
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showPieChart, setShowPieChart] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [graphMode, setGraphMode] = useState<"waves" | "bars" | "phase">("waves");
  const [activeConsoleTab, setActiveConsoleTab] = useState<"controls" | "track" | "presets">("controls");

  // Control Nodes for Freeform
  const [splineNodes] = useState<SplineNode[]>([
    { id: "p0", x: 5, y: 44 },
    { id: "p1", x: 26, y: 8 },
    { id: "p2", x: 50, y: 32 },
    { id: "p3", x: 74, y: 8 },
    { id: "p4", x: 95, y: 22 },
  ]);

  // Planet Gravity
  const currentG = useMemo(() => {
    const p = PLANETARY_PRESETS.find((item) => item.id === selectedPlanet);
    return p ? p.g : 9.81;
  }, [selectedPlanet]);

  // ── High-Precision Smooth Track Path Builder ──────────────────────────
  const trackPath = useMemo(() => {
    const samples = 1000;
    const points: { x: number; y: number; s: number; mathAngle: number; rCurv: number }[] = [];
    let totalLen = 0;

    if (trackType === "loop_the_loop") {
      const rLoop = 11.5;
      for (let i = 0; i <= samples; i++) {
        const u = i / samples;
        let px = 0;
        let py = 0;

        if (u < 0.35) {
          // Entry Incline: smooth cosine S-ramp from (5, 44) down to (38, 4)
          const frac = u / 0.35;
          px = 5 + frac * 33;
          py = 4 + 40 * Math.pow(Math.cos(frac * Math.PI * 0.5), 2);
        } else if (u < 0.70) {
          // Teardrop Loop: from (38, 4) looping up to apex (45, 27) and down to (52, 4)
          const frac = (u - 0.35) / 0.35;
          const theta = frac * Math.PI * 2;
          px = 38 + 14 * frac + rLoop * Math.sin(theta);
          py = 4 + rLoop * (1 - Math.cos(theta));
        } else {
          // Exit Runout: smooth ramp from (52, 4) climbing to (95, 22)
          const frac = (u - 0.70) / 0.30;
          px = 52 + frac * 43;
          py = 4 + 18 * Math.pow(Math.sin(frac * Math.PI * 0.5), 2);
        }

        if (points.length > 0) {
          const prev = points[points.length - 1];
          const dx = px - prev.x;
          const dy = py - prev.y;
          const segLen = Math.hypot(dx, dy);
          totalLen += segLen;
          const mathAngle = Math.atan2(dy, dx);
          points.push({ x: px, y: py, s: totalLen, mathAngle, rCurv: rLoop });
        } else {
          points.push({ x: px, y: py, s: 0, mathAngle: -0.8, rCurv: rLoop });
        }
      }
    } else if (trackType === "double_valley") {
      for (let i = 0; i <= samples; i++) {
        const u = i / samples;
        const px = 5 + u * 90;
        const py = 22 + 20 * Math.cos(u * Math.PI * 3.2) * Math.exp(-u * 0.25);

        if (points.length > 0) {
          const prev = points[points.length - 1];
          const dx = px - prev.x;
          const dy = py - prev.y;
          const segLen = Math.hypot(dx, dy);
          totalLen += segLen;
          const mathAngle = Math.atan2(dy, dx);
          points.push({ x: px, y: py, s: totalLen, mathAngle, rCurv: 22 });
        } else {
          points.push({ x: px, y: py, s: 0, mathAngle: -0.4, rCurv: 22 });
        }
      }
    } else if (trackType === "hill_slope") {
      for (let i = 0; i <= samples; i++) {
        const u = i / samples;
        const px = 5 + u * 90;
        const py = 4 + 40 * Math.pow(1 - u, 2.2);

        if (points.length > 0) {
          const prev = points[points.length - 1];
          const dx = px - prev.x;
          const dy = py - prev.y;
          const segLen = Math.hypot(dx, dy);
          totalLen += segLen;
          const mathAngle = Math.atan2(dy, dx);
          points.push({ x: px, y: py, s: totalLen, mathAngle, rCurv: 25 });
        } else {
          points.push({ x: px, y: py, s: 0, mathAngle: -0.6, rCurv: 25 });
        }
      }
    } else {
      const pts = splineNodes;
      for (let i = 0; i <= samples; i++) {
        const t = (i / samples) * (pts.length - 1);
        const idx = Math.min(Math.floor(t), pts.length - 2);
        const frac = t - idx;

        const p0 = pts[Math.max(0, idx - 1)];
        const p1 = pts[idx];
        const p2 = pts[idx + 1];
        const p3 = pts[Math.min(pts.length - 1, idx + 2)];

        const t2 = frac * frac;
        const t3 = t2 * frac;
        const px = 0.5 * (2 * p1.x + (-p0.x + p2.x) * frac + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
        const py = 0.5 * (2 * p1.y + (-p0.y + p2.y) * frac + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

        if (points.length > 0) {
          const prev = points[points.length - 1];
          const dx = px - prev.x;
          const dy = py - prev.y;
          const segLen = Math.hypot(dx, dy);
          totalLen += segLen;
          const mathAngle = Math.atan2(dy, dx);
          points.push({ x: px, y: py, s: totalLen, mathAngle, rCurv: 24 });
        } else {
          points.push({ x: px, y: py, s: 0, mathAngle: 0, rCurv: 24 });
        }
      }
    }

    return { points, totalLength: totalLen };
  }, [trackType, splineNodes]);

  // Continuous Sub-Sample Arc-Length Interpolator
  const getTrackStateAtS = useCallback((sDist: number) => {
    const { points, totalLength } = trackPath;
    if (points.length === 0) return { x: 0, y: 0, mathAngle: 0, rCurv: 20 };

    const clampedS = Math.max(0, Math.min(sDist, totalLength));

    let low = 0;
    let high = points.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (points[mid].s < clampedS) low = mid + 1;
      else high = mid - 1;
    }

    const idx0 = Math.max(0, Math.min(low - 1, points.length - 2));
    const idx1 = idx0 + 1;
    const p0 = points[idx0];
    const p1 = points[idx1];

    const segLen = Math.max(0.0001, p1.s - p0.s);
    const alpha = Math.max(0, Math.min(1, (clampedS - p0.s) / segLen));

    const x = p0.x + (p1.x - p0.x) * alpha;
    const y = p0.y + (p1.y - p0.y) * alpha;
    const mathAngle = p0.mathAngle + (p1.mathAngle - p0.mathAngle) * alpha;
    const rCurv = p0.rCurv + (p1.rCurv - p0.rCurv) * alpha;

    return { x, y, s: clampedS, mathAngle, rCurv };
  }, [trackPath]);

  // Persistent Live Simulation Physics State (Stored in Ref to guarantee 60fps without React effect thrashing)
  const simStateRef = useRef<{
    s: number;
    x: number;
    y: number;
    v: number;
    pe: number;
    ke: number;
    thermal: number;
    totalEnergy: number;
    normalForce: number;
    normalG: number;
    isDetached: boolean;
    simTime: number;
  }>({
    s: 0.05,
    x: 5,
    y: 44,
    v: 0.1,
    pe: 500 * 9.81 * 44,
    ke: 0,
    thermal: 0,
    totalEnergy: 500 * 9.81 * 44,
    normalForce: 500 * 9.81,
    normalG: 1.0,
    isDetached: false,
    simTime: 0,
  });

  // UI State for React components
  const [cartState, setCartState] = useState({ ...simStateRef.current });

  // Telemetry History for Graph
  const historyRef = useRef<{ t: number; pe: number; ke: number; thermal: number; total: number; v: number }[]>([]);

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);

  // Reset Cart to initial drop position
  const handleReset = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    const startPoint = trackPath.points[0] || { x: 5, y: 44 };
    const initPe = cartMass * currentG * startPoint.y;

    simStateRef.current = {
      s: 0.05,
      x: startPoint.x,
      y: startPoint.y,
      v: 0.1,
      pe: initPe,
      ke: 0,
      thermal: 0,
      totalEnergy: initPe,
      normalForce: cartMass * currentG,
      normalG: 1.0,
      isDetached: false,
      simTime: 0,
    };

    setCartState({ ...simStateRef.current });

    historyRef.current = [{
      t: 0,
      pe: initPe,
      ke: 0,
      thermal: 0,
      total: initPe,
      v: 0.1,
    }];
  }, [cartMass, currentG, trackPath]);

  // Apply Preset
  const handleApplyPreset = (preset: GuidedPreset) => {
    setTrackType(preset.trackType);
    setCartMass(preset.massKg);
    setFrictionMu(preset.frictionMu);
    setSelectedPlanet(preset.planetId);
    setTimeout(() => handleReset(), 50);
  };

  // Sync AI Chatbot Knowledge
  useEffect(() => {
    setExperimentData({
      title: "Conservation of Mechanical Energy & Roller Coaster Studio",
      theory: `Law of Conservation of Energy: E_total = PE + KE + E_thermal = constant. Gravitational PE = m·g·y, Kinetic Energy KE = ½m·v². Work done by friction: E_thermal = ∫(μ·m·g·cosθ) ds. Loop apex condition: v_apex ≥ √(gR) requires drop height h_min = 2.5R.`,
      extraContext: `Mass = ${cartMass}kg, Friction μ = ${frictionMu}, Gravity g = ${currentG}m/s² (${selectedPlanet}). Track Mode = ${trackType}. Speed = ${cartState.v.toFixed(1)}m/s, PE = ${(cartState.pe / 1000).toFixed(1)}kJ, KE = ${(cartState.ke / 1000).toFixed(1)}kJ, Total = ${(cartState.totalEnergy / 1000).toFixed(1)}kJ.`,
    });
  }, [cartMass, frictionMu, currentG, selectedPlanet, trackType, cartState, setExperimentData]);

  // ── Physics Integration Loop (Continuous 60FPS in Ref) ────────────────
  useEffect(() => {
    lastTimeRef.current = performance.now();

    const stepSimulation = (now: number) => {
      const realDt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      if (isRunning && !isPaused) {
        const state = simStateRef.current;
        const g = currentG;
        const m = cartMass;
        const mu = frictionMu;
        const totalLen = trackPath.totalLength;

        const subSteps = 32;
        const dt = (realDt * playbackSpeed) / subSteps;

        for (let step = 0; step < subSteps; step++) {
          state.simTime += dt;

          const trackPt = getTrackStateAtS(state.s);
          state.x = trackPt.x;
          state.y = trackPt.y;

          // Tangential Acceleration along track
          const sinTheta = Math.sin(trackPt.mathAngle);
          const cosTheta = Math.abs(Math.cos(trackPt.mathAngle));

          const gravityTangential = -g * sinTheta;
          const frictionTangential = -Math.sign(state.v || 1) * (mu * g * cosTheta);
          const aTotal = gravityTangential + frictionTangential;

          state.v += aTotal * dt;

          const ds = state.v * dt;
          state.s += ds;
          state.thermal += Math.abs(mu * m * g * cosTheta * ds);

          // Turnaround at track ends
          if (state.s >= totalLen) {
            state.s = totalLen;
            state.v = -Math.abs(state.v) * 0.92;
            completeExperiment();
          } else if (state.s <= 0) {
            state.s = 0;
            state.v = Math.abs(state.v) * 0.92;
          }

          state.pe = Math.max(0, m * g * state.y);
          state.ke = 0.5 * m * state.v * state.v;
          state.totalEnergy = state.pe + state.ke + state.thermal;

          const rCurv = trackPt.rCurv || 20;
          const aCentripetal = (state.v * state.v) / rCurv;
          const normalForce = m * (aCentripetal + g * cosTheta);
          state.normalForce = normalForce;
          state.normalG = Number((normalForce / (m * (g || 1))).toFixed(2));

          if (trackType === "loop_the_loop" && trackPt.y > 20 && normalForce < 0) {
            state.isDetached = true;
          }
        }

        frameCountRef.current++;
        if (frameCountRef.current % 4 === 0) {
          setCartState({ ...state });

          historyRef.current.push({
            t: Number(state.simTime.toFixed(2)),
            pe: state.pe,
            ke: state.ke,
            thermal: state.thermal,
            total: state.totalEnergy,
            v: state.v,
          });
          if (historyRef.current.length > 250) {
            historyRef.current.shift();
          }
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
    cartMass,
    frictionMu,
    currentG,
    playbackSpeed,
    trackPath,
    getTrackStateAtS,
    trackType,
    completeExperiment,
  ]);

  // ── Render Coaster Canvas Stage with Screen-Space Tangent Alignment ───
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

      const padLeft = 45;
      const padRight = 35;
      const padTop = 30;
      const padBottom = 45;

      const scaleX = (w - padLeft - padRight) / 100;
      const scaleY = (h - padTop - padBottom) / 50;
      const originX = padLeft;
      const originY = h - padBottom;

      const toScreenX = (px: number) => originX + px * scaleX;
      const toScreenY = (py: number) => originY - py * scaleY;

      // 1. Scenic Atmospheric Planetary Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (selectedPlanet === "moon") {
        skyGrad.addColorStop(0, "#030712");
        skyGrad.addColorStop(0.7, "#0f172a");
        skyGrad.addColorStop(1, "#1e293b");
      } else if (selectedPlanet === "mars") {
        skyGrad.addColorStop(0, "#1c0a04");
        skyGrad.addColorStop(0.7, "#431407");
        skyGrad.addColorStop(1, "#7c2d12");
      } else if (selectedPlanet === "jupiter") {
        skyGrad.addColorStop(0, "#171206");
        skyGrad.addColorStop(0.7, "#451a03");
        skyGrad.addColorStop(1, "#78350f");
      } else {
        skyGrad.addColorStop(0, "#030b17");
        skyGrad.addColorStop(0.6, "#081b33");
        skyGrad.addColorStop(1, "#0c2b4d");
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Distant Stars / Space Particles
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      for (let s = 0; s < 25; s++) {
        const sx = (s * 37 + 19) % w;
        const sy = (s * 43 + 11) % (h * 0.5);
        ctx.fillRect(sx, sy, 1.2, 1.2);
      }

      // 2. Glowing Height Graduation Grid Lines & Ruler
      ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
      ctx.lineWidth = 1;
      for (let yM = 0; yM <= 50; yM += 10) {
        const sy = toScreenY(yM);
        ctx.beginPath();
        ctx.moveTo(originX, sy);
        ctx.lineTo(w - padRight, sy);
        ctx.stroke();

        ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "right";
        ctx.fillText(`${yM}m`, originX - 8, sy + 3);
      }

      // Ground Terrain Base
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, originY, w, padBottom);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(w, originY);
      ctx.stroke();

      // 3. Structural Steel Truss Pillars
      const pts = trackPath.points;
      if (pts.length > 0) {
        ctx.strokeStyle = "rgba(100, 116, 139, 0.3)";
        ctx.lineWidth = 2;
        for (let i = 0; i < pts.length; i += 25) {
          const pt = pts[i];
          const sx = toScreenX(pt.x);
          const sy = toScreenY(pt.y);
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx, originY);
          ctx.stroke();

          // Cross diagonal braces
          ctx.beginPath();
          ctx.moveTo(sx - 4, sy);
          ctx.lineTo(sx + 4, originY);
          ctx.stroke();
        }

        // 4. Main Metallic Tubular Coaster Rails (Double Rail)
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 4;
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        pts.forEach((p, idx) => {
          const sx = toScreenX(p.x);
          const sy = toScreenY(p.y);
          if (idx === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Rail Cross Ties
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1.8;
        for (let i = 0; i < pts.length - 1; i += 6) {
          const p1 = pts[i];
          const sx = toScreenX(p1.x);
          const sy = toScreenY(p1.y);
          const nx = Math.sin(p1.mathAngle) * 4;
          const ny = Math.cos(p1.mathAngle) * 4;
          ctx.beginPath();
          ctx.moveTo(sx - nx, sy - ny);
          ctx.lineTo(sx + nx, sy + ny);
          ctx.stroke();
        }
      }

      // 5. Coaster Cart Aligned to Screen Tangent (Read from Active simStateRef)
      const liveState = simStateRef.current;
      const cartX = toScreenX(liveState.x);
      const cartY = toScreenY(liveState.y);

      // Compute exact Screen-Space Tangent Angle from adjacent samples
      const sAhead = Math.min(trackPath.totalLength, liveState.s + 0.3);
      const sBehind = Math.max(0, liveState.s - 0.3);
      const ptAhead = getTrackStateAtS(sAhead);
      const ptBehind = getTrackStateAtS(sBehind);
      const screenDx = toScreenX(ptAhead.x) - toScreenX(ptBehind.x);
      const screenDy = toScreenY(ptAhead.y) - toScreenY(ptBehind.y);
      const screenTangent = Math.atan2(screenDy, screenDx);

      ctx.save();
      ctx.translate(cartX, cartY);
      ctx.rotate(screenTangent);

      // Motion Neon Light Trail behind cart
      if (Math.abs(liveState.v) > 2) {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-18, -6);
        ctx.lineTo(-38, -6);
        ctx.stroke();
      }

      // Aerodynamic Chassis Body
      ctx.fillStyle = liveState.isDetached ? "#ef4444" : "#0284c7";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-16, -17, 32, 12, 3);
      ctx.fill();
      ctx.stroke();

      // Front Cockpit Glass
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.beginPath();
      ctx.roundRect(4, -15, 8, 8, 2);
      ctx.fill();

      // Metallic Mag Wheels (Tangent strictly at y = 0)
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(-9, -4.5, 4.5, 0, Math.PI * 2);
      ctx.arc(9, -4.5, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Passenger Silhouette
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(-2, -21, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 6. Floating Energy Pie Chart over Cart
      if (showPieChart) {
        const totalE = Math.max(1, liveState.pe + liveState.ke + liveState.thermal);
        const peFrac = liveState.pe / totalE;
        const keFrac = liveState.ke / totalE;
        const thFrac = liveState.thermal / totalE;

        const pieX = cartX;
        const pieY = cartY - 38;
        const pieR = 13;

        let startAngle = -Math.PI * 0.5;

        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.moveTo(pieX, pieY);
        ctx.arc(pieX, pieY, pieR, startAngle, startAngle + peFrac * Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        startAngle += peFrac * Math.PI * 2;

        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.moveTo(pieX, pieY);
        ctx.arc(pieX, pieY, pieR, startAngle, startAngle + keFrac * Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        startAngle += keFrac * Math.PI * 2;

        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.moveTo(pieX, pieY);
        ctx.arc(pieX, pieY, pieR, startAngle, startAngle + thFrac * Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pieX, pieY, pieR, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 7. Vector Overlays (Velocity & Normal Force aligned with screen tangent)
      if (showVectors) {
        const vLen = Math.min(42, liveState.v * 1.6);
        if (Math.abs(vLen) > 2) {
          const vx = Math.cos(screenTangent) * vLen;
          const vy = Math.sin(screenTangent) * vLen;

          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(cartX, cartY);
          ctx.lineTo(cartX + vx, cartY + vy);
          ctx.stroke();

          ctx.fillStyle = "#10b981";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "left";
          ctx.fillText(`v = ${liveState.v.toFixed(1)}m/s`, cartX + vx + 4, cartY + vy);
        }

        const nLen = Math.min(38, (liveState.normalForce / (cartMass * (currentG || 1))) * 14);
        if (nLen > 1) {
          const nx = -Math.sin(screenTangent) * nLen;
          const ny = Math.cos(screenTangent) * nLen;

          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cartX, cartY);
          ctx.lineTo(cartX + nx, cartY + ny);
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [
    cartMass,
    currentG,
    getTrackStateAtS,
    selectedPlanet,
    showPieChart,
    showVectors,
    trackPath,
  ]);

  // ── Render High-Precision Digital Telemetry Graph ─────────────────────
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padLeft = 60;
    const padRight = 20;
    const padTop = 22;
    const padBottom = 26;
    const graphW = w - padLeft - padRight;
    const graphH = h - padTop - padBottom;

    // 1. Deep OLED Phosphor Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, "#040813");
    bgGrad.addColorStop(1, "#020409");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Frame Border
    ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(padLeft, padTop, graphW, graphH);

    // 2. High-Tech Grid with Graduation Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let x = padLeft; x <= padLeft + graphW; x += graphW / 8) {
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, padTop + graphH);
      ctx.stroke();
    }
    for (let y = padTop; y <= padTop + graphH; y += graphH / 4) {
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + graphW, y);
      ctx.stroke();
    }

    const history = historyRef.current;
    if (history.length < 2) return;

    const maxE = Math.max(...history.map((d) => d.total), cartState.totalEnergy, 5000);

    // 3. Y-Axis Scale Tick Labels (in kJ)
    ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const val = (maxE * (1 - i / 4)) / 1000;
      const yPos = padTop + (i / 4) * graphH;
      ctx.fillText(`${val.toFixed(0)} kJ`, padLeft - 8, yPos + 3);

      ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
      ctx.beginPath();
      ctx.moveTo(padLeft - 4, yPos);
      ctx.lineTo(padLeft, yPos);
      ctx.stroke();
    }

    // 4. X-Axis Time Ticks
    ctx.textAlign = "center";
    for (let i = 0; i <= 4; i++) {
      const xPos = padLeft + (i / 4) * graphW;
      const timeOffset = -((4 - i) * 2.5);
      ctx.fillText(`${timeOffset === 0 ? "Now" : `${timeOffset}s`}`, xPos, h - 8);
    }

    if (graphMode === "bars") {
      const totalE = Math.max(1, cartState.totalEnergy);
      const colWidth = 48;
      const spacing = (graphW - colWidth * 4) / 5;

      const bars = [
        { label: "PE (mgh)", val: cartState.pe, color: "#38bdf8", shadow: "#38bdf8" },
        { label: "KE (½mv²)", val: cartState.ke, color: "#10b981", shadow: "#10b981" },
        { label: "E_th (Heat)", val: cartState.thermal, color: "#f59e0b", shadow: "#f59e0b" },
        { label: "E_Total", val: cartState.totalEnergy, color: "#ffffff", shadow: "rgba(255,255,255,0.5)" },
      ];

      bars.forEach((b, idx) => {
        const bx = padLeft + spacing + idx * (colWidth + spacing);
        const barH = (b.val / maxE) * graphH;
        const by = padTop + graphH - barH;

        ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
        ctx.fillRect(bx, padTop, colWidth, graphH);

        ctx.save();
        ctx.shadowColor = b.shadow;
        ctx.shadowBlur = 8;
        const barGrad = ctx.createLinearGradient(0, by, 0, padTop + graphH);
        barGrad.addColorStop(0, b.color);
        barGrad.addColorStop(1, "rgba(0,0,0,0.5)");
        ctx.fillStyle = barGrad;
        ctx.fillRect(bx, by, colWidth, barH);
        ctx.restore();

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(bx, by, colWidth, 2);

        ctx.fillStyle = b.color;
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${(b.val / 1000).toFixed(1)}kJ`, bx + colWidth * 0.5, by - 6);
        ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
        ctx.fillText(b.label, bx + colWidth * 0.5, padTop + graphH + 16);
      });
    } else if (graphMode === "phase") {
      ctx.fillStyle = "rgba(56, 189, 248, 0.2)";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "left";
      ctx.fillText("PHASE SPACE TRAJECTORY: Velocity (v) vs Altitude (y)", padLeft + 10, padTop + 16);

      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      history.forEach((d, idx) => {
        const normX = (d.v + 30) / 60;
        const normY = d.pe / (cartMass * currentG * 50);
        const px = padLeft + Math.max(0, Math.min(1, normX)) * graphW;
        const py = padTop + graphH - Math.max(0, Math.min(1, normY)) * graphH;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      const curNormX = (cartState.v + 30) / 60;
      const curNormY = cartState.y / 50;
      const curPx = padLeft + Math.max(0, Math.min(1, curNormX)) * graphW;
      const curPy = padTop + graphH - Math.max(0, Math.min(1, curNormY)) * graphH;

      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(curPx, curPy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      const n = history.length;

      const plotArea = (extractor: (d: (typeof history)[0]) => number, fillColor: string, strokeColor: string, lineWidth: number = 2) => {
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        history.forEach((d, idx) => {
          const xPx = padLeft + (idx / (n - 1)) * graphW;
          const normY = extractor(d) / maxE;
          const yPx = padTop + graphH - normY * graphH;
          if (idx === 0) {
            ctx.moveTo(xPx, padTop + graphH);
            ctx.lineTo(xPx, yPx);
          } else {
            ctx.lineTo(xPx, yPx);
          }
        });
        ctx.lineTo(padLeft + graphW, padTop + graphH);
        ctx.closePath();
        ctx.fill();

        ctx.save();
        ctx.shadowColor = strokeColor;
        ctx.shadowBlur = 6;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        history.forEach((d, idx) => {
          const xPx = padLeft + (idx / (n - 1)) * graphW;
          const normY = extractor(d) / maxE;
          const yPx = padTop + graphH - normY * graphH;
          if (idx === 0) ctx.moveTo(xPx, yPx);
          else ctx.lineTo(xPx, yPx);
        });
        ctx.stroke();
        ctx.restore();
      };

      ctx.setLineDash([4, 4]);
      plotArea((d) => d.total, "transparent", "rgba(255, 255, 255, 0.45)", 1.5);
      ctx.setLineDash([]);

      plotArea((d) => d.thermal, "rgba(245, 158, 11, 0.12)", "#f59e0b", 2);
      plotArea((d) => d.pe, "rgba(56, 189, 248, 0.18)", "#38bdf8", 2);
      plotArea((d) => d.ke, "rgba(16, 185, 129, 0.22)", "#10b981", 2.5);

      const latestX = padLeft + graphW;
      const peY = padTop + graphH - (cartState.pe / maxE) * graphH;
      const keY = padTop + graphH - (cartState.ke / maxE) * graphH;
      const thY = padTop + graphH - (cartState.thermal / maxE) * graphH;

      ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(latestX, padTop);
      ctx.lineTo(latestX, padTop + graphH);
      ctx.stroke();

      const drawHeadDot = (y: number, color: string) => {
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(latestX, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(latestX, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      drawHeadDot(peY, "#38bdf8");
      drawHeadDot(keY, "#10b981");
      drawHeadDot(thY, "#f59e0b");
    }
  }, [cartMass, cartState, currentG, graphMode]);

  // Export CSV
  const handleExportCSV = () => {
    const rows = [
      ["Parameter", "Value", "Unit"],
      ["Cart Mass", cartMass.toString(), "kg"],
      ["Friction Coefficient", frictionMu.toString(), "dimensionless"],
      ["Gravity", currentG.toString(), "m/s^2"],
      ["Speed", cartState.v.toFixed(2), "m/s"],
      ["Altitude", cartState.y.toFixed(2), "m"],
      ["Potential Energy", (cartState.pe / 1000).toFixed(2), "kJ"],
      ["Kinetic Energy", (cartState.ke / 1000).toFixed(2), "kJ"],
      ["Thermal Energy", (cartState.thermal / 1000).toFixed(2), "kJ"],
      ["Total Energy", (cartState.totalEnergy / 1000).toFixed(2), "kJ"],
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `energy_conservation_telemetry_${Date.now()}.csv`);
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
              <Zap size={22} />
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
              Conservation of Mechanical Energy & Roller Coaster Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-mono font-bold">
              Classical Mechanics & Energy Interchange
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Interactive track spline builder, loop-the-loop critical apex velocity, kinetic/gravitational/thermal energy interchange, and normal force telemetry.
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
                <span>Launch Coaster</span>
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
            title="Reset Cart Position"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

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

      {/* ── Main Workspace: Central Stage (Left 7 cols) + Control Deck (Right 5 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Visual Roller Coaster Canvas + Integrated Energy Telemetry Graph (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Canvas Box */}
          <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
            {/* Top Floating Badges */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/10 flex items-center gap-1.5">
                <Globe size={13} className="text-sky-400" />
                <span>g = {currentG} m/s²</span>
                <span className="text-muted-foreground font-mono text-[11px]">({selectedPlanet})</span>
              </span>

              <span className="px-2.5 py-1 bg-emerald-950/80 backdrop-blur-md rounded-full text-emerald-300 text-[10px] font-mono font-black border border-emerald-500/30 uppercase">
                {trackType.replace("_", " ")}
              </span>
            </div>

            {/* Overlays Toggle */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setShowPieChart(!showPieChart)}
                className={`px-2 py-0.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                  showPieChart ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white"
                }`}
              >
                Energy Pie
              </button>
              <button
                type="button"
                onClick={() => setShowVectors(!showVectors)}
                className={`px-2 py-0.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                  showVectors ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white"
                }`}
              >
                Vectors
              </button>
            </div>

            {/* Main Coaster Canvas */}
            <canvas
              ref={canvasRef}
              width={720}
              height={290}
              className="w-full h-[240px] sm:h-[280px] block"
            />

            {/* Split Energy Bar at Bottom of Canvas */}
            <div className="p-3 bg-card/95 border-t border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-muted-foreground">Energy Balance (E_total = PE + KE + E_th):</span>
                <span className="font-mono font-bold text-foreground">
                  {(cartState.totalEnergy / 1000).toFixed(1)} kJ
                </span>
              </div>

              <div className="h-4 w-full rounded-xl overflow-hidden bg-muted/60 flex border border-border">
                <div
                  style={{
                    width: `${((cartState.pe / Math.max(1, cartState.totalEnergy)) * 100).toFixed(1)}%`,
                  }}
                  className="h-full bg-sky-400 transition-all duration-75 flex items-center justify-center text-[8px] font-mono font-bold text-black overflow-hidden"
                >
                  PE
                </div>
                <div
                  style={{
                    width: `${((cartState.ke / Math.max(1, cartState.totalEnergy)) * 100).toFixed(1)}%`,
                  }}
                  className="h-full bg-emerald-500 transition-all duration-75 flex items-center justify-center text-[8px] font-mono font-bold text-black overflow-hidden"
                >
                  KE
                </div>
                <div
                  style={{
                    width: `${((cartState.thermal / Math.max(1, cartState.totalEnergy)) * 100).toFixed(1)}%`,
                  }}
                  className="h-full bg-amber-500 transition-all duration-75 flex items-center justify-center text-[8px] font-mono font-bold text-black overflow-hidden"
                >
                  E_th
                </div>
              </div>
            </div>
          </div>

          {/* Integrated Real-Time Digital Telemetry Oscilloscope */}
          <div className="bg-card border border-border rounded-3xl p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-primary" />
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
                  Digital Telemetry Oscilloscope
                </h3>
              </div>

              {/* View Mode Toggle Switcher */}
              <div className="flex items-center gap-1 bg-muted/80 p-1 rounded-xl border border-border">
                {[
                  { id: "waves", label: "Glow Waves" },
                  { id: "bars", label: "LED Bars" },
                  { id: "phase", label: "Phase Space" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setGraphMode(mode.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      graphMode === mode.id
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Readout Legend Chips */}
            <div className="flex items-center justify-between text-[11px] font-mono font-bold bg-muted/40 p-2 rounded-2xl border border-border/50">
              <span className="text-sky-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-xs shadow-sky-400/50" />
                PE: {(cartState.pe / 1000).toFixed(1)} kJ
              </span>
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400/50" />
                KE: {(cartState.ke / 1000).toFixed(1)} kJ
              </span>
              <span className="text-amber-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs shadow-amber-400/50" />
                Thermal: {(cartState.thermal / 1000).toFixed(1)} kJ
              </span>
              <span className="text-foreground/80 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                Total: {(cartState.totalEnergy / 1000).toFixed(1)} kJ
              </span>
            </div>

            <canvas
              ref={graphCanvasRef}
              width={720}
              height={170}
              className="w-full h-[170px] rounded-2xl block border border-border"
            />
          </div>
        </div>

        {/* Right Column: Multi-Tab Console + Live Telemetry Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-card border border-border rounded-3xl p-5 shadow-xs space-y-4">
            {/* Console Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-border">
              {[
                { id: "controls", label: "Cart & Physics", icon: Sliders },
                { id: "track", label: "Track Geometry", icon: Layers },
                { id: "presets", label: "Guided Presets", icon: Sparkles },
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

            {/* ── TAB 1: CART & PHYSICS ── */}
            {activeConsoleTab === "controls" && (
              <div className="space-y-4">
                {/* Cart Mass Slider + Numeric Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Cart Mass (m):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="10"
                        max="2000"
                        step="50"
                        value={cartMass}
                        onChange={(e) => setCartMass(Math.min(2000, Math.max(10, Number(e.target.value) || 10)))}
                        className="w-20 px-2 py-0.5 rounded-lg bg-muted border border-border text-sky-400 font-mono font-black text-right text-xs focus:border-sky-400 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">kg</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1500"
                    step="50"
                    value={cartMass}
                    onChange={(e) => setCartMass(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                    <span>50kg (Light)</span>
                    <span>500kg (Standard)</span>
                    <span>1500kg (Heavy)</span>
                  </div>
                </div>

                {/* Track Friction Slider + Numeric Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Friction (μ_k):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="0.15"
                        step="0.005"
                        value={frictionMu}
                        onChange={(e) => setFrictionMu(Math.min(0.15, Math.max(0, Number(e.target.value) || 0)))}
                        className="w-20 px-2 py-0.5 rounded-lg bg-muted border border-border text-amber-500 font-mono font-black text-right text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.12"
                    step="0.005"
                    value={frictionMu}
                    onChange={(e) => setFrictionMu(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                    <span>μ = 0 (Frictionless)</span>
                    <span>μ = 0.012 (Steel Rail)</span>
                    <span>μ = 0.12 (High Drag)</span>
                  </div>
                </div>

                {/* Planetary Gravity Presets */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <span className="text-xs font-bold text-muted-foreground">Planetary Gravitation:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {PLANETARY_PRESETS.map((p) => {
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedPlanet(p.id)}
                          className={`p-2 rounded-2xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                            selectedPlanet === p.id
                              ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                              : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Icon size={14} />
                          <div className="text-xs font-bold">{p.name}</div>
                          <div className="text-[9px] font-mono text-muted-foreground">{p.g} m/s²</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: TRACK GEOMETRY ── */}
            {activeConsoleTab === "track" && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-muted-foreground">Select Track Configuration:</span>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "loop_the_loop", label: "Loop-the-Loop", sub: "Vertical Loop Challenge" },
                    { id: "double_valley", label: "Double Valley", sub: "Harmonic Oscillations" },
                    { id: "hill_slope", label: "Single Slope", sub: "Ramp into Runout" },
                    { id: "freeform_spline", label: "Custom Spline", sub: "Interactive 5-Node Spline" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => {
                        setTrackType(mode.id as TrackGeometryType);
                        setTimeout(() => handleReset(), 50);
                      }}
                      className={`p-3 rounded-2xl border text-left transition space-y-0.5 cursor-pointer ${
                        trackType === mode.id
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                          : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="text-xs font-black">{mode.label}</div>
                      <div className="text-[10px] text-muted-foreground">{mode.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB 3: GUIDED PRESETS ── */}
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
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Energy</span>
              <div className="text-base sm:text-lg font-black font-mono text-foreground mt-0.5">
                {(cartState.totalEnergy / 1000).toFixed(1)} <span className="text-xs font-normal text-muted-foreground">kJ</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Speed (v)</span>
              <div className="text-base sm:text-lg font-black font-mono text-emerald-400 mt-0.5">
                {cartState.v.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">m/s</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Altitude (y)</span>
              <div className="text-base sm:text-lg font-black font-mono text-sky-400 mt-0.5">
                {cartState.y.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">m</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">G-Force (FN)</span>
              <div className="text-base sm:text-lg font-black font-mono text-amber-400 mt-0.5">
                {cartState.normalG.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">g</span>
              </div>
            </div>
          </div>

          {/* Daily Challenge Card */}
          <DailyChallengeCard
            labId="physics/energyconservation"
            currentParams={{
              speed: cartState.v,
              potentialEnergy: cartState.pe,
              kineticEnergy: cartState.ke,
            }}
          />
        </div>
      </div>
    </div>
  );
}
