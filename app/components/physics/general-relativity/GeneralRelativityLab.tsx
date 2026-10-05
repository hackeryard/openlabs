// app/components/physics/general-relativity/GeneralRelativityLab.tsx
"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLab } from "@/app/hooks/useXP";
import { useDailyChallenge } from "@/app/hooks/useDailyChallenge";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import NextLabModal from "@/app/components/NextLabModal";
import PotentialCurvePanel from "./PotentialCurvePanel";
import SpectrometerPanel from "./SpectrometerPanel";
import TwinParadoxPanel from "./TwinParadoxPanel";
import InvestigationGuidePanel from "./InvestigationGuidePanel";
import MetricTensorPanel from "./MetricTensorPanel";
import GravitationalWavesPanel from "./GravitationalWavesPanel";
import TheoryModal from "./TheoryModal";
import {
  RelativityMode,
  CelestialPreset,
  GeodesicParticle,
  RelativisticTelemetry,
  RelativityTrialRecord,
  GuidedInvestigation,
} from "./types";
import {
  CELESTIAL_PRESETS,
  computeRelativisticTelemetry,
  stepGeodesicRK4,
  computeSchwarzschildRadiusKm,
  C_SPEED,
  GUIDED_INVESTIGATIONS,
} from "./engine";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Activity,
  Download,
  BookOpen,
  Layers,
  Compass,
  Zap,
  Clock,
  Eye,
  Radio,
  ShieldAlert,
  Volume2,
  VolumeX,
  Target,
  FileSpreadsheet,
  Rocket,
  Flame,
  Info,
  Waves,
  Cpu,
} from "lucide-react";

export default function GeneralRelativityLab() {
  const { setExperimentData } = useChat();
  const {
    completeExperiment,
    xpResult,
    nextLabProgression,
    showNextLabModal,
    setShowNextLabModal,
  } = useLab("physics/general-relativity", "physics", "simulation");

  const { challenge } = useDailyChallenge("physics/general-relativity");

  // ── Mode & State ──────────────────────────────────────────────────────────
  const [activeMode, setActiveMode] = useState<RelativityMode>("spacetime");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("cygnus-x1");
  const [massSolar, setMassSolar] = useState<number>(21.2);
  const [probeDistanceRs, setProbeDistanceRs] = useState<number>(3.5);
  const [impactParameterRs, setImpactParameterRs] = useState<number>(4.0);
  const [kerrSpin, setKerrSpin] = useState<number>(0.95);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showErgosphere, setShowErgosphere] = useState<boolean>(true);

  // 3D Canvas camera angles
  const [camPitch, setCamPitch] = useState<number>(0.65); // elevation
  const [camYaw, setCamYaw] = useState<number>(0.4);      // azimuth
  const isDraggingCanvasRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Geodesic test particles
  const [particles, setParticles] = useState<GeodesicParticle[]>([]);
  const nextParticleIdRef = useRef<number>(1);

  // Trial records
  const [trials, setTrials] = useState<RelativityTrialRecord[]>([]);
  const [activeConsoleTab, setActiveConsoleTab] = useState<
    "controls" | "investigations" | "metric" | "theory" | "data"
  >("controls");
  const [isTheoryModalOpen, setIsTheoryModalOpen] = useState<boolean>(false);
  const [activeInvestigationId, setActiveInvestigationId] = useState<string>("mercury-precession");

  // Time dilation clocks state
  const [simElapsedSeconds, setSimElapsedSeconds] = useState<number>(0);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Selected preset object
  const currentPreset = useMemo<CelestialPreset>(() => {
    return CELESTIAL_PRESETS.find((p) => p.id === selectedPresetId) || CELESTIAL_PRESETS[3];
  }, [selectedPresetId]);

  // Compute live relativistic telemetry
  const telemetry = useMemo<RelativisticTelemetry>(() => {
    return computeRelativisticTelemetry(massSolar, probeDistanceRs, kerrSpin);
  }, [massSolar, probeDistanceRs, kerrSpin]);

  // Web Audio Context for relativistic tone generation
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playRelativisticChirp = useCallback(
    (freqMultiplier: number = 1.0) => {
      if (!soundEnabled) return;
      try {
        if (!audioCtxRef.current) {
          const AudioCtxClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new AudioCtxClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        const baseFreq = 260 * freqMultiplier;
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } catch {
        // audio not supported
      }
    },
    [soundEnabled]
  );

  // ── Sync with OpenLabs AI Chat Context ──────────────────────────────────
  useEffect(() => {
    setExperimentData({
      title: "General Relativity & Spacetime Simulator",
      theory:
        "Einstein's General Relativity: Spacetime geometry g_μν is dynamically curved by mass-energy (G_μν = 8πG/c⁴ T_μν). Schwarzschild and Kerr metrics dictate event horizons, ergospheres, geodesic orbits with Mercury's precession, photon spheres (1.5 r_s), gravitational light deflection α = 4GM/(c² b), gravitational time dilation dτ = dt √(1 - r_s/r), and tidal spaghettification forces.",
      extraContext: {
        activeMode,
        preset: currentPreset.name,
        massSolar: `${massSolar.toFixed(2)} M_sun`,
        kerrSpin: kerrSpin.toFixed(3),
        schwarzschildRadiusKm: `${telemetry.schwarzschildRadiusKm.toFixed(2)} km`,
        timeDilationFactor: telemetry.timeDilationFactor.toFixed(4),
        gravitationalRedshiftZ: telemetry.gravitationalRedshiftZ.toFixed(4),
        escapeVelocityC: `${(telemetry.escapeVelocityC * 100).toFixed(2)}% c`,
        lightDeflectionArcsec: `${telemetry.lightDeflectionArcsec.toFixed(2)} arcsec`,
        tidalHumanG: `${telemetry.tidal.humanTidalG.toFixed(2)} g`,
        spaghettificationStatus: telemetry.tidal.spaghettificationStatus,
      },
    });
  }, [activeMode, currentPreset, massSolar, kerrSpin, telemetry, setExperimentData]);

  // Handle Preset Change
  const handleSelectPreset = (preset: CelestialPreset) => {
    setSelectedPresetId(preset.id);
    setMassSolar(preset.massSolar);
    setProbeDistanceRs(preset.defaultProbeDistanceRs);
    setKerrSpin(preset.spinParam);
    setParticles([]);
    playRelativisticChirp(1.2);
  };

  // Handle Apply Investigation Setup
  const handleApplyInvestigation = (inv: GuidedInvestigation) => {
    setSelectedPresetId(inv.targetPresetId);
    setMassSolar(inv.targetMassSolar);
    setProbeDistanceRs(inv.targetProbeDistanceRs);
    if (inv.targetImpactParameterRs !== undefined) {
      setImpactParameterRs(inv.targetImpactParameterRs);
    }
    if (inv.targetKerrSpin !== undefined) {
      setKerrSpin(inv.targetKerrSpin);
    }
    setActiveMode(inv.recommendedMode);
    setParticles([]);
    if (inv.recommendedMode === "spacetime") {
      handleLaunchProbe("precession");
    }
    playRelativisticChirp(1.3);
  };

  // Launch a new Geodesic Test Particle
  const handleLaunchProbe = (mode: "circular" | "precession" | "zoom-whirl" = "precession") => {
    const angle = -Math.PI / 4;
    let initialDistRs = probeDistanceRs;
    let speedFactor = 0.98;

    if (mode === "zoom-whirl") {
      initialDistRs = 2.1;
      speedFactor = 1.01;
    } else if (mode === "circular") {
      initialDistRs = Math.max(3.2, probeDistanceRs);
      speedFactor = 1.0;
    }

    const initialDistance = Math.min(220, Math.max(45, initialDistRs * 18));
    const initX = Math.cos(angle) * initialDistance;
    const initY = Math.sin(angle) * initialDistance;

    const baseSpeed = Math.sqrt(100 / Math.max(1, initialDistance)) * speedFactor;
    const perpAngle = angle + Math.PI / 2;

    const newParticle: GeodesicParticle = {
      id: nextParticleIdRef.current++,
      x: initX,
      y: initY,
      vx: Math.cos(perpAngle) * baseSpeed,
      vy: Math.sin(perpAngle) * baseSpeed,
      trail: [{ x: initX, y: initY }],
      active: true,
      absorbed: false,
      color: particles.length % 2 === 0 ? "#38bdf8" : "#f43f5e",
    };

    setParticles((prev) => [...prev.slice(-4), newParticle]);
    playRelativisticChirp(0.9);
  };

  // Record trial
  const handleRecordTrial = () => {
    const record: RelativityTrialRecord = {
      id: `trial-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
      objectName: currentPreset.name,
      massSolar,
      probeRadiusKm: telemetry.probeRadiusKm,
      schwarzschildRadiusKm: telemetry.schwarzschildRadiusKm,
      timeDilationFactor: telemetry.timeDilationFactor,
      gravitationalRedshiftZ: telemetry.gravitationalRedshiftZ,
      escapeVelocityC: telemetry.escapeVelocityC,
      deflectionArcsec: telemetry.lightDeflectionArcsec,
      tidalG: telemetry.tidal.humanTidalG,
    };
    setTrials((prev) => [record, ...prev.slice(0, 19)]);
    playRelativisticChirp(1.4);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (trials.length === 0) return;
    const headers = [
      "ID",
      "Timestamp",
      "Object",
      "Mass (M_sun)",
      "Radius (km)",
      "Schwarzschild r_s (km)",
      "Time Dilation Factor (gamma)",
      "Gravitational Redshift (z)",
      "Escape Velocity (c)",
      "Deflection (arcsec)",
      "Tidal Force (g)",
    ];
    const rows = trials.map((t) => [
      t.id,
      t.timestamp,
      `"${t.objectName}"`,
      t.massSolar.toFixed(2),
      t.probeRadiusKm.toFixed(1),
      t.schwarzschildRadiusKm.toFixed(2),
      t.timeDilationFactor.toFixed(4),
      t.gravitationalRedshiftZ.toFixed(4),
      t.escapeVelocityC.toFixed(4),
      t.deflectionArcsec.toFixed(2),
      t.tidalG.toFixed(2),
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `openlabs-general-relativity-trials-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset simulation
  const handleReset = () => {
    setParticles([]);
    setSimElapsedSeconds(0);
    playRelativisticChirp(0.8);
  };

  // Mouse Drag Camera
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingCanvasRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingCanvasRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setCamYaw((prev) => prev + dx * 0.008);
    setCamPitch((prev) => Math.max(0.15, Math.min(1.4, prev + dy * 0.008)));
  };

  const handleMouseUp = () => {
    isDraggingCanvasRef.current = false;
  };

  // ── Physics Animation Loop ───────────────────────────────────────────────
  useEffect(() => {
    let animId: number;
    let last = performance.now();

    const loop = (now: number) => {
      const dtSec = Math.max(0.001, Math.min(0.05, (now - last) / 1000));
      last = now;

      if (isPlaying) {
        setSimElapsedSeconds((prev) => prev + dtSec * simSpeed);

        // Step active geodesic test particles with Kerr frame dragging
        setParticles((prevParticles) =>
          prevParticles.map((p) => {
            if (!p.active) return p;
            return stepGeodesicRK4(p, dtSec * 14 * simSpeed, 100, 18, 14, kerrSpin);
          })
        );
      }

      // Render Canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);

          if (activeMode === "spacetime") {
            renderSpacetimeCurvature(ctx, w, h);
          } else if (activeMode === "lensing") {
            renderGravitationalLensing(ctx, w, h, now * 0.001);
          } else if (activeMode === "timedilation") {
            renderTimeDilationClocks(ctx, w, h);
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [
    isPlaying,
    simSpeed,
    activeMode,
    camPitch,
    camYaw,
    particles,
    showGrid,
    showVectors,
    showErgosphere,
    probeDistanceRs,
    massSolar,
    kerrSpin,
    currentPreset,
  ]);

  // ── Mode 1: 3D Spacetime Curvature & Kerr Ergosphere ─────────────────────
  const renderSpacetimeCurvature = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2 + 30;

    const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, w * 0.7);
    bgGrad.addColorStop(0, "#090d16");
    bgGrad.addColorStop(1, "#030712");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const project = (x: number, y: number, z: number) => {
      const cosY = Math.cos(camYaw);
      const sinY = Math.sin(camYaw);
      const xRot = x * cosY - y * sinY;
      const yRot = x * sinY + y * cosY;

      const cosP = Math.cos(camPitch);
      const sinP = Math.sin(camPitch);
      const yProj = yRot * cosP - z * sinP;
      const zProj = yRot * sinP + z * cosP;

      const scale = 360 / (360 + zProj * 0.25);
      return {
        px: cx + xRot * scale,
        py: cy + yProj * scale,
        scale,
      };
    };

    // Draw Curvature Rubber Sheet Wireframe Mesh
    if (showGrid) {
      const gridSize = 16;
      const step = 20;
      const extent = (gridSize * step) / 2;

      ctx.lineWidth = 1;
      for (let r = 20; r <= extent; r += 24) {
        ctx.beginPath();
        const segments = 48;
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          const x = Math.cos(theta) * r;
          const y = Math.sin(theta) * r;
          const dist = Math.max(12, Math.sqrt(x * x + y * y));
          const depth = -Math.min(180, (2800 / dist) * Math.log10(Math.max(1.1, massSolar * 0.5 + 1.2)));

          const p = project(x, y, depth);
          if (i === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0.12, 0.45 - r / (extent * 1.5))})`;
        ctx.stroke();
      }

      const spokes = 16;
      for (let s = 0; s < spokes; s++) {
        const theta = (s / spokes) * Math.PI * 2;
        ctx.beginPath();
        for (let r = 16; r <= extent; r += 8) {
          const x = Math.cos(theta) * r;
          const y = Math.sin(theta) * r;
          const dist = Math.max(12, Math.sqrt(x * x + y * y));
          const depth = -Math.min(180, (2800 / dist) * Math.log10(Math.max(1.1, massSolar * 0.5 + 1.2)));

          const p = project(x, y, depth);
          if (r === 16) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.strokeStyle = "rgba(99, 102, 241, 0.22)";
        ctx.stroke();
      }
    }

    const coreDepth = -Math.min(180, (2800 / 14) * Math.log10(Math.max(1.1, massSolar * 0.5 + 1.2)));
    const coreProj = project(0, 0, coreDepth);

    // Oblate Ergosphere for spinning Kerr black hole
    const glowRadius = Math.max(18, Math.min(50, 16 + Math.log10(Math.max(1, massSolar)) * 12));

    if (kerrSpin > 0.05 && showErgosphere) {
      ctx.save();
      ctx.translate(coreProj.px, coreProj.py);
      ctx.scale(1.0 + kerrSpin * 0.25, 0.85);
      ctx.strokeStyle = "rgba(234, 179, 8, 0.6)";
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(0, 0, glowRadius * 1.35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Glowing Event Horizon
    const massGrad = ctx.createRadialGradient(
      coreProj.px,
      coreProj.py,
      glowRadius * 0.15,
      coreProj.px,
      coreProj.py,
      glowRadius * 2.2
    );
    massGrad.addColorStop(0, currentPreset.color);
    massGrad.addColorStop(0.4, currentPreset.glowColor);
    massGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = massGrad;
    ctx.beginPath();
    ctx.arc(coreProj.px, coreProj.py, glowRadius * 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = currentPreset.color;
    ctx.beginPath();
    ctx.arc(coreProj.px, coreProj.py, glowRadius * 0.8, 0, Math.PI * 2);
    ctx.fill();

    if (currentPreset.category === "blackhole") {
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(coreProj.px, coreProj.py, glowRadius * 0.65, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ea580c";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Geodesic Test Particles
    particles.forEach((particle) => {
      if (particle.trail.length > 1) {
        ctx.beginPath();
        for (let i = 0; i < particle.trail.length; i++) {
          const pt = particle.trail[i];
          const dist = Math.max(12, Math.sqrt(pt.x * pt.x + pt.y * pt.y));
          const depth = -Math.min(180, (2800 / dist) * Math.log10(Math.max(1.1, massSolar * 0.5 + 1.2)));
          const pr = project(pt.x, pt.y, depth);
          if (i === 0) ctx.moveTo(pr.px, pr.py);
          else ctx.lineTo(pr.px, pr.py);
        }
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      if (particle.active && !particle.absorbed) {
        const curDist = Math.max(12, Math.sqrt(particle.x * particle.x + particle.y * particle.y));
        const curDepth = -Math.min(180, (2800 / curDist) * Math.log10(Math.max(1.1, massSolar * 0.5 + 1.2)));
        const headProj = project(particle.x, particle.y, curDepth);

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(headProj.px, headProj.py, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(headProj.px, headProj.py, 8, 0, Math.PI * 2);
        ctx.stroke();

        if (showVectors) {
          const arrowProj = project(
            particle.x + particle.vx * 6,
            particle.y + particle.vy * 6,
            curDepth
          );
          ctx.strokeStyle = "#22c55e";
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(headProj.px, headProj.py);
          ctx.lineTo(arrowProj.px, arrowProj.py);
          ctx.stroke();
        }
      }
    });

    ctx.fillStyle = "rgba(148, 163, 184, 0.75)";
    ctx.font = "12px sans-serif";
    ctx.fillText("🖱️ Drag canvas to rotate 3D curvature perspective (pitch / yaw)", 16, h - 20);
  };

  // ── Mode 2: Gravitational Lensing & Accretion Disk ─────────────────────────
  const renderGravitationalLensing = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    timeSec: number
  ) => {
    const cx = w / 2;
    const cy = h / 2;

    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, w, h);

    // Deflected background star grid
    const numStars = 64;
    for (let i = 0; i < numStars; i++) {
      const angle = (i / numStars) * Math.PI * 2;
      const baseDist = 70 + (i % 6) * 32;
      const origX = cx + Math.cos(angle) * baseDist;
      const origY = cy + Math.sin(angle) * baseDist;

      const thetaE = Math.min(100, Math.sqrt(massSolar * 18));
      const distFromCenter = Math.max(1, Math.hypot(origX - cx, origY - cy));
      const deflection = (thetaE * thetaE) / distFromCenter;
      const lensedX = cx + Math.cos(angle) * (distFromCenter + deflection);
      const lensedY = cy + Math.sin(angle) * (distFromCenter + deflection);

      ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + (i % 3) * 0.25})`;
      ctx.beginPath();
      ctx.arc(lensedX, lensedY, 1.5 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
    }

    // Accretion disk
    const diskInnerR = Math.max(25, Math.min(60, 20 + Math.log10(Math.max(1, massSolar)) * 14));
    const diskOuterR = diskInnerR * 2.8;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1.0, 0.35);

    const diskGrad = ctx.createLinearGradient(-diskOuterR, 0, diskOuterR, 0);
    diskGrad.addColorStop(0, "rgba(56, 189, 248, 0.85)");
    diskGrad.addColorStop(0.35, "rgba(245, 158, 11, 0.95)");
    diskGrad.addColorStop(0.7, "rgba(239, 68, 68, 0.65)");
    diskGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = diskGrad;
    ctx.beginPath();
    ctx.arc(0, 0, diskOuterR, 0, Math.PI * 2);
    ctx.arc(0, 0, diskInnerR, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();

    // Black Hole Shadow
    const shadowR = diskInnerR * 0.9;
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(cx, cy, shadowR, 0, Math.PI * 2);
    ctx.fill();

    // Photon Sphere Ring (1.5 r_s)
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(cx, cy, shadowR * 1.15, 0, Math.PI * 2);
    ctx.stroke();

    // Light ray tracing
    const bPixels = impactParameterRs * 16;
    const rayStartY = cy - bPixels;
    const rayStartX = 30;
    const alphaRad = Math.min(Math.PI * 0.9, (4 * massSolar * 4.5) / Math.max(14, bPixels));

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#38bdf8";
    ctx.beginPath();
    ctx.moveTo(rayStartX, rayStartY);

    const bendX = cx;
    const bendY = rayStartY + Math.tan(alphaRad * 0.5) * (cx - rayStartX);
    const endX = w - 40;
    const endY = bendY + Math.tan(alphaRad) * (endX - cx);

    ctx.quadraticCurveTo(bendX, rayStartY, endX, endY);
    ctx.stroke();

    ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - bPixels);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "12px monospace";
    ctx.fillText(`b = ${impactParameterRs.toFixed(1)} r_s`, cx + 8, cy - bPixels / 2);
    ctx.fillText(`Deflection: ${telemetry.lightDeflectionArcsec.toFixed(1)}"`, endX - 140, endY - 10);
  };

  // ── Mode 3: Gravitational Time Dilation Clocks ────────────────────────────
  const renderTimeDilationClocks = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, w, h);

    const clockY = h / 2 - 20;
    const clockR = 52;

    const c1X = w * 0.22;
    drawClockFace(ctx, c1X, clockY, clockR, simElapsedSeconds, "Distant Observer (t_∞)", "#38bdf8", "Flat Minkowski Spacetime");

    const c2X = w * 0.5;
    const dilatedElapsed = simElapsedSeconds / telemetry.timeDilationFactor;
    drawClockFace(
      ctx,
      c2X,
      clockY,
      clockR,
      dilatedElapsed,
      `Local Clock (r = ${probeDistanceRs.toFixed(1)} r_s)`,
      "#f43f5e",
      `γ = ${telemetry.timeDilationFactor.toFixed(3)}x Slower`
    );

    const c3X = w * 0.78;
    const gpsDriftFraction = 38.7e-6 / 86400;
    const gpsElapsed = simElapsedSeconds * (1 + gpsDriftFraction * 1000);
    drawClockFace(
      ctx,
      c3X,
      clockY,
      clockR,
      gpsElapsed,
      "GPS Constellation",
      "#22c55e",
      "+38.7 μs/day Net Drift"
    );

    const barY = h - 55;
    ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
    ctx.fillRect(40, barY - 20, w - 80, 50);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
    ctx.strokeRect(40, barY - 20, w - 80, 50);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "12px sans-serif";
    ctx.fillText("GPS Einstein Correction Breakdown:", 55, barY - 2);

    ctx.fillStyle = "#22c55e";
    ctx.fillText("• General Relativistic Clock Speedup (Weaker Gravity at 20,200 km): +45.9 μs/day", 55, barY + 16);
    ctx.fillStyle = "#f43f5e";
    ctx.fillText("• Special Relativistic Kinematic Slowdown (Orbital Speed 3.87 km/s): -7.2 μs/day", w * 0.52, barY + 16);
  };

  const drawClockFace = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    seconds: number,
    title: string,
    accentColor: string,
    subtitle: string
  ) => {
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.fill();

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const innerX = cx + Math.cos(angle) * (r - 6);
      const innerY = cy + Math.sin(angle) * (r - 6);
      const outerX = cx + Math.cos(angle) * r;
      const outerY = cy + Math.sin(angle) * r;

      ctx.strokeStyle = i % 3 === 0 ? accentColor : "rgba(148, 163, 184, 0.4)";
      ctx.lineWidth = i % 3 === 0 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(innerX, innerY);
      ctx.lineTo(outerX, outerY);
      ctx.stroke();
    }

    const secAngle = ((seconds % 60) / 60) * Math.PI * 2 - Math.PI / 2;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(secAngle) * (r * 0.75), cy + Math.sin(secAngle) * (r * 0.75));
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${seconds.toFixed(2)} s`, cx, cy + r + 22);

    ctx.font = "12px sans-serif";
    ctx.fillStyle = accentColor;
    ctx.fillText(title, cx, cy - r - 12);

    ctx.font = "11px sans-serif";
    ctx.fillStyle = "rgba(148, 163, 184, 0.85)";
    ctx.fillText(subtitle, cx, cy + r + 38);
    ctx.textAlign = "start";
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans select-none">
      {/* ── Top Navigation Bar ────────────────────────────────────────── */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md px-4 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-sm">
            <OrbitIcon className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
              General Relativity & Spacetime Studio
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 font-medium border border-sky-500/20">
                Physics Lab
              </span>
            </h1>
            <p className="text-xs text-muted-foreground">
              Schwarzschild & Kerr Geometry • Lensing • Time Dilation • Redshift Spectrometer
            </p>
          </div>
        </div>

        {/* 4 Mode Selector Tabs */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveMode("spacetime")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeMode === "spacetime"
                ? "bg-card text-foreground shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            3D Spacetime & Orbits
          </button>
          <button
            onClick={() => setActiveMode("lensing")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeMode === "lensing"
                ? "bg-card text-foreground shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            Lensing & Shadow
          </button>
          <button
            onClick={() => setActiveMode("timedilation")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeMode === "timedilation"
                ? "bg-card text-foreground shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            Time Dilation & GPS
          </button>
          <button
            onClick={() => setActiveMode("redshift")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeMode === "redshift"
                ? "bg-card text-foreground shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            Redshift & Twin Paradox
          </button>
          <button
            onClick={() => setActiveMode("waves")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeMode === "waves"
                ? "bg-card text-foreground shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-purple-400" />
            Gravitational Waves & Penrose
          </button>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTheoryModalOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-muted font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            title="Open General Relativity Theory Handbook"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Theory Handbook</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
            title={soundEnabled ? "Mute Relativistic Audio" : "Unmute Audio"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? "Pause" : "Resume"}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => completeExperiment()}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:brightness-110 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Finish Lab (+50 XP)
          </button>
        </div>
      </header>

      {/* ── Main Workspace ───────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 max-w-[1600px] w-full mx-auto">
        {/* Left Column: Interactive Simulation Visualizer */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Mode 1, 2, 3 Viewport Canvas */}
          {activeMode !== "redshift" ? (
            <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-lg group">
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {activeMode === "spacetime" && "3D Schwarzschild & Kerr Metric Embedding"}
                  {activeMode === "lensing" && "Ray-Traced Light Deflection & Black Hole Shadow"}
                  {activeMode === "timedilation" && "Relativistic Clocks & GPS Synchronization"}
                </span>

                <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-sky-400">
                  {currentPreset.name}
                </span>
              </div>

              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-lg border border-white/10">
                {activeMode === "spacetime" && (
                  <>
                    <button
                      onClick={() => setShowGrid(!showGrid)}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        showGrid ? "bg-sky-500/20 text-sky-300" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Grid {showGrid ? "On" : "Off"}
                    </button>
                    <button
                      onClick={() => setShowErgosphere(!showErgosphere)}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        showErgosphere ? "bg-amber-500/20 text-amber-300" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Ergosphere
                    </button>
                    <button
                      onClick={() => handleLaunchProbe("precession")}
                      className="px-2.5 py-1 rounded bg-sky-500 text-white font-semibold text-[11px] flex items-center gap-1 hover:bg-sky-400 shadow-sm"
                    >
                      <Zap className="w-3 h-3" />
                      Precession
                    </button>
                    <button
                      onClick={() => handleLaunchProbe("zoom-whirl")}
                      className="px-2.5 py-1 rounded bg-amber-500 text-white font-semibold text-[11px] flex items-center gap-1 hover:bg-amber-400 shadow-sm"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Zoom-Whirl
                    </button>
                  </>
                )}

                {activeMode === "lensing" && (
                  <div className="flex items-center gap-2 px-2 text-xs text-slate-300">
                    <span>Impact b:</span>
                    <input
                      type="range"
                      min="1.8"
                      max="10.0"
                      step="0.1"
                      value={impactParameterRs}
                      onChange={(e) => setImpactParameterRs(parseFloat(e.target.value))}
                      className="w-24 accent-sky-400 cursor-pointer"
                    />
                    <span className="font-mono text-sky-400 font-bold">{impactParameterRs.toFixed(1)} r_s</span>
                  </div>
                )}
              </div>

              <canvas
                ref={canvasRef}
                width={800}
                height={420}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="w-full h-[420px] block cursor-grab active:cursor-grabbing bg-black"
              />
            </div>
          ) : activeMode === "redshift" ? (
            /* Mode 4: Gravitational Redshift Spectrometer & Twin Paradox */
            <div className="flex flex-col gap-4">
              <SpectrometerPanel
                gravitationalRedshiftZ={telemetry.gravitationalRedshiftZ}
                probeRadiusRs={probeDistanceRs}
                timeDilationFactor={telemetry.timeDilationFactor}
              />
              <TwinParadoxPanel />
            </div>
          ) : (
            /* Mode 5: Binary Inspiral & Gravitational Waves & Penrose */
            <div className="flex flex-col gap-4">
              <GravitationalWavesPanel soundEnabled={soundEnabled} />
            </div>
          )}

          {/* Interactive Parameters Quick Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-border bg-card">
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-sky-400" />
                  Central Mass (M)
                </span>
                <span className="font-mono font-bold text-sky-400">
                  {massSolar >= 1000 ? `${(massSolar / 1e6).toFixed(2)}M M☉` : `${massSolar.toFixed(1)} M☉`}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="50"
                step="0.5"
                value={Math.min(50, massSolar)}
                onChange={(e) => setMassSolar(parseFloat(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  Probe Radius (r / r_s)
                </span>
                <span className="font-mono font-bold text-amber-400">{probeDistanceRs.toFixed(2)} r_s</span>
              </div>
              <input
                type="range"
                min="1.05"
                max="10.0"
                step="0.05"
                value={probeDistanceRs}
                onChange={(e) => setProbeDistanceRs(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-yellow-400" />
                  Kerr Spin (a*)
                </span>
                <span className="font-mono font-bold text-yellow-400">{kerrSpin.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.998"
                step="0.01"
                value={kerrSpin}
                onChange={(e) => setKerrSpin(parseFloat(e.target.value))}
                className="w-full accent-yellow-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  Time Warp Rate
                </span>
                <span className="font-mono font-bold text-rose-400">{simSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.2"
                value={simSpeed}
                onChange={(e) => setSimSpeed(parseFloat(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Relativistic Effective Potential Well & Tidal Stress Gauge */}
          {activeMode === "spacetime" && (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <PotentialCurvePanel currentProbeRs={probeDistanceRs} rsKm={telemetry.schwarzschildRadiusKm} />
              </div>
              <div className="sm:col-span-4 p-3.5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      Tidal Force & Spaghettification
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-2"
                    style={{
                      backgroundColor: `${telemetry.tidal.statusColor}20`,
                      color: telemetry.tidal.statusColor,
                    }}
                  >
                    {telemetry.tidal.spaghettificationStatus}
                  </span>
                  <div className="text-2xl font-bold font-mono text-foreground mb-1">
                    {telemetry.tidal.humanTidalG >= 1000
                      ? `${(telemetry.tidal.humanTidalG / 1000).toFixed(1)}k g`
                      : `${telemetry.tidal.humanTidalG.toFixed(2)} g`}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Head-to-toe differential acceleration across a 1.8m human body.
                    {massSolar > 100000 && (
                      <span className="block text-emerald-400 mt-1 font-semibold">
                        💡 Supermassive black hole: Event horizon can be crossed safely without lethal tidal forces!
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/80">
                  Roche Limit: {telemetry.tidal.rocheRadiusKm.toFixed(0)} km
                </div>
              </div>
            </div>
          )}

          {/* Live Relativistic Telemetry Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-card border border-border shadow-sm">
              <span className="text-[11px] font-medium text-muted-foreground block mb-0.5">Schwarzschild Radius (r_s)</span>
              <span className="text-base font-bold font-mono text-sky-400">
                {telemetry.schwarzschildRadiusKm >= 1000
                  ? `${(telemetry.schwarzschildRadiusKm / 1e6).toFixed(2)}M km`
                  : `${telemetry.schwarzschildRadiusKm.toFixed(2)} km`}
              </span>
              <span className="text-[10px] text-muted-foreground block mt-0.5">2GM / c²</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border shadow-sm">
              <span className="text-[11px] font-medium text-muted-foreground block mb-0.5">Time Dilation Factor (γ)</span>
              <span className="text-base font-bold font-mono text-rose-400">
                {telemetry.timeDilationFactor.toFixed(4)}x
              </span>
              <span className="text-[10px] text-muted-foreground block mt-0.5">1 / √(1 - r_s / r)</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border shadow-sm">
              <span className="text-[11px] font-medium text-muted-foreground block mb-0.5">Escape Velocity (v_esc)</span>
              <span className="text-base font-bold font-mono text-emerald-400">
                {(telemetry.escapeVelocityC * 100).toFixed(1)}% c
              </span>
              <span className="text-[10px] text-muted-foreground block mt-0.5">
                {(telemetry.escapeVelocityKms).toFixed(0)} km/s
              </span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border shadow-sm">
              <span className="text-[11px] font-medium text-muted-foreground block mb-0.5">Light Deflection (Δθ)</span>
              <span className="text-base font-bold font-mono text-amber-400">
                {telemetry.lightDeflectionArcsec.toFixed(2)}"
              </span>
              <span className="text-[10px] text-muted-foreground block mt-0.5">4GM / (c² b)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-tab Control Console, Presets, Daily Challenge & Trials */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Daily Challenge Card Component */}
          {challenge && (
            <DailyChallengeCard
              labId="physics/general-relativity"
              currentParams={{
                schwarzschildRadiusKm: telemetry.schwarzschildRadiusKm,
                timeDilationFactor: telemetry.timeDilationFactor,
                deflectionAngleArcsec: telemetry.lightDeflectionArcsec,
                escapeVelocityC: telemetry.escapeVelocityC,
              }}
            />
          )}

          {/* Console Tab Selector */}
          <div className="bg-card border border-border rounded-xl p-1 flex gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveConsoleTab("controls")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors whitespace-nowrap ${
                activeConsoleTab === "controls" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Presets
            </button>
            <button
              onClick={() => setActiveConsoleTab("investigations")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors whitespace-nowrap ${
                activeConsoleTab === "investigations" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Investigations
            </button>
            <button
              onClick={() => setActiveConsoleTab("metric")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors whitespace-nowrap ${
                activeConsoleTab === "metric" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Metric g_μν
            </button>
            <button
              onClick={() => setActiveConsoleTab("theory")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors whitespace-nowrap ${
                activeConsoleTab === "theory" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Theory
            </button>
            <button
              onClick={() => setActiveConsoleTab("data")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors whitespace-nowrap ${
                activeConsoleTab === "data" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Trials ({trials.length})
            </button>
          </div>

          {/* Tab 1: Celestial Presets */}
          {activeConsoleTab === "controls" && (
            <div className="flex flex-col gap-2.5 bg-card border border-border rounded-2xl p-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Astrophysical Curvature Scenarios
              </span>
              <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
                {CELESTIAL_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedPresetId === preset.id
                        ? "border-sky-500/80 bg-sky-500/10 shadow-sm"
                        : "border-border/60 hover:border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: preset.color }}
                        />
                        {preset.name}
                      </span>
                      <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {preset.massSolar >= 1000
                          ? `${(preset.massSolar / 1e6).toFixed(1)}M M☉`
                          : `${preset.massSolar} M☉`}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Action: Record Trial */}
              <div className="pt-2 border-t border-border flex items-center gap-2">
                <button
                  onClick={handleRecordTrial}
                  className="flex-1 py-2 px-3 rounded-xl bg-card border border-border text-foreground hover:bg-muted font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                  Log Data Point
                </button>
                <button
                  onClick={handleExportCSV}
                  disabled={trials.length === 0}
                  className="py-2 px-3 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  title="Export Trials to CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Guided Laboratory Investigations */}
          {activeConsoleTab === "investigations" && (
            <InvestigationGuidePanel
              onApplyInvestigation={handleApplyInvestigation}
              activeInvestigationId={activeInvestigationId}
              onSelectInvestigationId={setActiveInvestigationId}
            />
          )}

          {/* Tab 3: Metric Tensor Matrix & Curvature */}
          {activeConsoleTab === "metric" && (
            <MetricTensorPanel
              telemetry={telemetry}
              kerrSpin={kerrSpin}
            />
          )}

          {/* Tab 4: Theory & Mathematical Principles */}
          {activeConsoleTab === "theory" && (
            <div className="flex flex-col gap-3 bg-card border border-border rounded-2xl p-4 text-xs leading-relaxed max-h-[500px] overflow-y-auto shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-sky-400" />
                  General Relativity & Kerr Spacetime
                </h3>
                <button
                  onClick={() => setIsTheoryModalOpen(true)}
                  className="px-2 py-1 rounded bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/30 text-[11px] font-semibold"
                >
                  Full Handbook ↗
                </button>
              </div>
              <p className="text-muted-foreground">
                In 1915, Albert Einstein published the <strong>Field Equations</strong> relating dynamic geometry to energy-momentum:
              </p>
              <div className="p-2.5 rounded-lg bg-muted/60 font-mono text-center text-sky-400 font-semibold border border-border">
                G_μν = (8πG / c⁴) T_μν
              </div>

              <h4 className="font-semibold text-foreground text-xs pt-1">1. The Schwarzschild & Kerr Geometry</h4>
              <p className="text-muted-foreground">
                For a static mass, the event horizon is at r_s = 2GM/c². For a spinning Kerr black hole with angular momentum J (spin a* = J/Mc), the outer horizon contracts to:
              </p>
              <div className="p-2 rounded bg-muted/60 font-mono text-center text-amber-400">
                r_+ = (r_s / 2) [1 + √(1 - a*²)]
              </div>
              <p className="text-muted-foreground">
                Outside r_+, the <strong>Ergosphere</strong> drags spacetime into corotation, allowing rotational energy extraction via the Penrose process.
              </p>

              <h4 className="font-semibold text-foreground text-xs pt-1">2. Gravitational Time Dilation</h4>
              <p className="text-muted-foreground">
                Clocks tick slower in deeper gravitational potentials relative to infinity:
              </p>
              <div className="p-2 rounded bg-muted/60 font-mono text-center text-rose-400">
                dτ = dt_∞ √(1 - r_s / r)
              </div>

              <h4 className="font-semibold text-foreground text-xs pt-1">3. Light Bending & Einstein Ring</h4>
              <p className="text-muted-foreground">
                Photons grazing a mass with impact parameter <em>b</em> bend by:
              </p>
              <div className="p-2 rounded bg-muted/60 font-mono text-center text-emerald-400">
                Δθ = 4GM / (c² b) = 2 r_s / b
              </div>

              <h4 className="font-semibold text-foreground text-xs pt-1">4. Spaghettification Tidal Forces</h4>
              <p className="text-muted-foreground">
                The differential stretching force between head and feet is inversely proportional to r³:
              </p>
              <div className="p-2 rounded bg-muted/60 font-mono text-center text-sky-400">
                Δa_tidal = (2GM · Δr) / r³
              </div>
            </div>
          )}

          {/* Tab 3: Recorded Trials Table */}
          {activeConsoleTab === "data" && (
            <div className="flex flex-col gap-3 bg-card border border-border rounded-2xl p-4 shadow-sm max-h-[500px] overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Recorded Trial Notebook
                </span>
                {trials.length > 0 && (
                  <button
                    onClick={handleExportCSV}
                    className="text-xs text-sky-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Download className="w-3 h-3" />
                    Download CSV
                  </button>
                )}
              </div>

              {trials.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-xs">
                  No data points recorded yet.
                  <br />
                  Click <strong>Log Data Point</strong> to capture experimental measurements.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {trials.map((t) => (
                    <div
                      key={t.id}
                      className="p-2.5 rounded-xl border border-border/80 bg-muted/30 text-xs flex flex-col gap-1"
                    >
                      <div className="flex justify-between font-semibold">
                        <span className="text-foreground">{t.objectName}</span>
                        <span className="font-mono text-muted-foreground text-[10px]">{t.timestamp}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-muted-foreground">
                        <span>Mass: {t.massSolar.toFixed(1)} M☉</span>
                        <span>r_s: {t.schwarzschildRadiusKm.toFixed(1)} km</span>
                        <span>γ: {t.timeDilationFactor.toFixed(3)}x</span>
                        <span>Tidal: {t.tidalG.toFixed(1)} g</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Gamification Next Lab Modal */}
      {showNextLabModal && nextLabProgression && (
        <NextLabModal
          isOpen={showNextLabModal}
          onClose={() => setShowNextLabModal(false)}
          xpEarned={xpResult?.xpEarned || 50}
          completedLabTitle="General Relativity & Spacetime Curvature"
          track={nextLabProgression.track}
          nextStep={nextLabProgression.nextStep}
          isFinalStep={nextLabProgression.isFinalStep}
          trackPercentage={nextLabProgression.trackPercentage}
        />
      )}

      {/* Comprehensive Theory Handbook Modal */}
      <TheoryModal
        isOpen={isTheoryModalOpen}
        onClose={() => setIsTheoryModalOpen(false)}
      />
    </div>
  );
}

function OrbitIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)" />
    </svg>
  );
}
