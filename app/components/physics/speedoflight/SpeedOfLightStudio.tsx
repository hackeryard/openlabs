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
  Flame,
  Maximize2,
  CircleDot,
  Lightbulb,
} from "lucide-react";

// ── Physical Constants ──────────────────────────────────────────────────
export const C_VACUUM = 299792458; // exact SI speed of light in m/s (299,792.458 km/s)

export type ExperimentMode = "fizeau" | "media_race" | "interferometer";

export interface OpticalMedium {
  id: string;
  name: string;
  n: number;
  color: string;
  tag: string;
}

export const OPTICAL_MEDIA_LIST: OpticalMedium[] = [
  { id: "vacuum", name: "Vacuum", n: 1.000, color: "#10b981", tag: "Reference (c)" },
  { id: "air", name: "Air (STP)", n: 1.00029, color: "#38bdf8", tag: "Atmosphere" },
  { id: "water", name: "Water (20°C)", n: 1.333, color: "#06b6d4", tag: "Liquid" },
  { id: "glass", name: "Fused Glass", n: 1.517, color: "#a855f7", tag: "Crown Glass" },
  { id: "diamond", name: "Dense Diamond", n: 2.417, color: "#ec4899", tag: "High Index" },
];

export interface GuidedPreset {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  mode: ExperimentMode;
  distanceKm: number;
  teethCount: number;
  revPerSec: number;
  mediumId: string;
  explanation: string;
}

export const GUIDED_PRESETS: GuidedPreset[] = [
  {
    id: "fizeau_1849",
    title: "Fizeau's 1849 Suresnes-Montmartre Experiment",
    subtitle: "Historical Parisian baseline across 8.63 km using a 720-tooth spinning cogwheel",
    tag: "History (1849)",
    mode: "fizeau",
    distanceKm: 8.633,
    teethCount: 720,
    revPerSec: 12.6,
    mediumId: "air",
    explanation: "Armand Fizeau spun a 720-tooth wheel between Suresnes and Montmartre (D = 8.633 km). At ω = 12.6 rps, light passing through a gap returned exactly into an adjacent tooth, causing total extinction and yielding c ≈ 313,000 km/s.",
  },
  {
    id: "foucault_mirror",
    title: "Foucault's 1862 Rotating Mirror Apparatus",
    subtitle: "Compact laboratory baseline measuring angular beam deflection at high RPM",
    tag: "Lab Precision",
    mode: "fizeau",
    distanceKm: 0.020,
    teethCount: 400,
    revPerSec: 400,
    mediumId: "air",
    explanation: "Léon Foucault eliminated the need for kilometers of open space by substituting a rapidly spinning mirror (400 rps, D = 20m), yielding c = 298,000 km/s and proving light slows down in water.",
  },
  {
    id: "diamond_slowdown",
    title: "Extreme Refractive Slowdown in Diamond",
    subtitle: "Observing photon velocity deceleration to 124,000 km/s due to n = 2.417",
    tag: "Refraction",
    mode: "media_race",
    distanceKm: 0.001,
    teethCount: 720,
    revPerSec: 25,
    mediumId: "diamond",
    explanation: "In diamond (n = 2.417), electromagnetic waves interact intensely with atomic electron shells, reducing phase velocity to v = c / 2.417 = 124,035 km/s.",
  },
  {
    id: "transatlantic_fiber",
    title: "Transatlantic Subsea Fiber Optic Pulse",
    subtitle: "10,000 km silica optical cable (n = 1.468) time-of-flight latency",
    tag: "Telecom",
    mode: "media_race",
    distanceKm: 10000,
    teethCount: 720,
    revPerSec: 10,
    mediumId: "glass",
    explanation: "In transcontinental fiber optics (n ≈ 1.468), light travels at 204,218 km/s. Traversing a 10,000 km subsea link requires ~49 milliseconds of propagation time-of-flight.",
  },
  {
    id: "lunar_laser_ranging",
    title: "Apollo 11 Lunar Laser Ranging (LLR)",
    subtitle: "Earth-to-Moon retroreflector pulse round-trip (D = 384,400 km)",
    tag: "Astrophysics",
    mode: "media_race",
    distanceKm: 384400,
    teethCount: 720,
    revPerSec: 10,
    mediumId: "vacuum",
    explanation: "Nd:YAG laser pulses fired from Earth bounce off Apollo corner-cube retroreflectors on the Moon. Measuring the 2.564 second round-trip time enables millimeter-accurate lunar distance monitoring.",
  },
];

export default function SpeedOfLightStudio() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "physics/speedoflight",
    "physics",
    "simulation"
  );

  // ── Studio Modes & Parameters ─────────────────────────────────────────
  const [activeMode, setActiveMode] = useState<ExperimentMode>("fizeau");
  const [distanceKm, setDistanceKm] = useState<number>(8.633); // 0.001 .. 384400 km
  const [teethCount, setTeethCount] = useState<number>(720); // 100 .. 1440 teeth
  const [revPerSec, setRevPerSec] = useState<number>(12.6); // 0 .. 100 rps
  const [selectedMedium, setSelectedMedium] = useState<string>("vacuum");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [laserWavelengthNm, setLaserWavelengthNm] = useState<number>(632.8); // He-Ne Red
  const [activeConsoleTab, setActiveConsoleTab] = useState<"controls" | "presets" | "theory">("controls");

  // Animation & Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wheelAngleRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const pulseProgressRef = useRef<number>(0);

  // Current Medium
  const currentMedium = useMemo(() => {
    return OPTICAL_MEDIA_LIST.find((m) => m.id === selectedMedium) || OPTICAL_MEDIA_LIST[0];
  }, [selectedMedium]);

  // ── Physics Calculations: Time-of-Flight & Fizeau Extinction ───────────
  const physicsData = useMemo(() => {
    const D_meters = distanceKm * 1000;
    const n = currentMedium.n;
    const v_medium = C_VACUUM / n;

    // Time of flight (round trip: 2D)
    const timeOfFlightSec = (2 * D_meters) / v_medium;
    const timeOfFlightUs = timeOfFlightSec * 1e6; // in microseconds
    const timeOfFlightNs = timeOfFlightSec * 1e9; // in nanoseconds

    // Fizeau Extinction Equation:
    // Angle turned during round-trip: deltaTheta = 2 * PI * omega * t_roundtrip
    // Angular width of one tooth or gap = PI / N radians
    // First extinction (eclipse) occurs when deltaTheta = (2m + 1) * (PI / N) => for m=0: deltaTheta = PI / N
    // 2 * PI * omega * (2D / c) = PI / N => c_calc = 4 * N * D * omega
    const angularSpeedRadPerSec = 2 * Math.PI * revPerSec;
    const toothAngleRad = Math.PI / teethCount; // angle of half tooth-period

    // Intensity transmission modulation: I/I0 = cos^2( (2 * N * D * omega / c) * PI )
    const phaseFactor = (2 * teethCount * D_meters * revPerSec) / C_VACUUM;
    const transmissionIntensity = Math.pow(Math.cos(phaseFactor * Math.PI), 2);

    // Speed calculated from first extinction condition: c = 4 * N * D * omega_crit
    const measuredC = 4 * teethCount * D_meters * revPerSec;
    const relativeSpeedRatio = v_medium / C_VACUUM; // 1 / n

    return {
      v_medium,
      timeOfFlightSec,
      timeOfFlightUs,
      timeOfFlightNs,
      transmissionIntensity,
      measuredC,
      relativeSpeedRatio,
      toothAngleRad,
    };
  }, [distanceKm, currentMedium, teethCount, revPerSec]);

  // Sync AI Chatbot Knowledge
  useEffect(() => {
    setExperimentData({
      title: "Speed of Light Measurement & Time-of-Flight Studio",
      theory: `Speed of light in vacuum c = 299,792,458 m/s. Medium phase velocity v = c / n. Fizeau Extinction formula: c = 4 · N · D · ω. Time-of-flight: Δt = 2D / v.`,
      extraContext: `Mode = ${activeMode}, Baseline Distance D = ${distanceKm} km, Medium = ${currentMedium.name} (n = ${currentMedium.n}), Toothed Wheel N = ${teethCount} teeth, Rotation Speed ω = ${revPerSec} rps. Time of Flight = ${physicsData.timeOfFlightUs.toFixed(3)} µs, Medium Speed = ${(physicsData.v_medium / 1000).toFixed(0)} km/s, Transmission = ${(physicsData.transmissionIntensity * 100).toFixed(1)}%.`,
    });
  }, [activeMode, distanceKm, currentMedium, teethCount, revPerSec, physicsData, setExperimentData]);

  // Trigger XP Reward
  const triggerCompletion = useCallback(() => {
    completeExperiment();
  }, [completeExperiment]);

  // Apply Preset
  const handleApplyPreset = (preset: GuidedPreset) => {
    setActiveMode(preset.mode);
    setDistanceKm(preset.distanceKm);
    setTeethCount(preset.teethCount);
    setRevPerSec(preset.revPerSec);
    setSelectedMedium(preset.mediumId);
    triggerCompletion();
  };

  // Reset to default
  const handleReset = () => {
    setActiveMode("fizeau");
    setDistanceKm(8.633);
    setTeethCount(720);
    setRevPerSec(12.6);
    setSelectedMedium("vacuum");
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
        // Spin wheel
        wheelAngleRef.current = (wheelAngleRef.current + 2 * Math.PI * revPerSec * dt) % (2 * Math.PI);
        // Pulse wave packet
        pulseProgressRef.current = (pulseProgressRef.current + dt * 1.8) % 1.0;
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Deep Space / Dark Optical Laboratory Stage
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, "#030712");
      bgGrad.addColorStop(0.6, "#0a0f1d");
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

      if (activeMode === "fizeau") {
        // ── FIZEAU TOOTHED-WHEEL APPARATUS STAGE ─────────────────────────
        const laserX = 65;
        const laserY = h * 0.42;
        const wheelX = 175;
        const wheelY = h * 0.42;
        const mirrorX = w - 75;
        const mirrorY = h * 0.42;
        const detectorY = h * 0.72;

        // 1. Monochromatic Laser Emitter (He-Ne Laser)
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(laserX - 45, laserY - 14, 45, 28, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("LASER", laserX - 22, laserY + 3);

        // 2. Beam Splitter (Half-Silvered Mirror) at 45°
        const splitterX = 115;
        const splitterY = laserY;

        ctx.strokeStyle = "rgba(56, 189, 248, 0.8)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(splitterX - 10, splitterY - 14);
        ctx.lineTo(splitterX + 10, splitterY + 14);
        ctx.stroke();

        ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
        ctx.font = "bold 8px monospace";
        ctx.fillText("50/50 Splitter", splitterX, splitterY - 20);

        // 3. Spinning Toothed Wheel (Gear Cog)
        const wheelRadius = 55;
        ctx.save();
        ctx.translate(wheelX, wheelY);
        ctx.rotate(wheelAngleRef.current);

        // Wheel Hub
        ctx.fillStyle = "#334155";
        ctx.strokeStyle = "#64748b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, wheelRadius * 0.55, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Teeth Geometry
        const teethToDraw = 24; // simplified visual teeth
        for (let i = 0; i < teethToDraw; i++) {
          const angle = (i * 2 * Math.PI) / teethToDraw;
          ctx.save();
          ctx.rotate(angle);
          ctx.fillStyle = i % 2 === 0 ? "#475569" : "transparent";
          if (i % 2 === 0) {
            ctx.fillRect(wheelRadius * 0.55, -4, wheelRadius * 0.45, 8);
          }
          ctx.restore();
        }

        // Center Axle
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Wheel Label & RPM
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`N = ${teethCount} Teeth`, wheelX, wheelY + wheelRadius + 16);
        ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
        ctx.fillText(`ω = ${revPerSec.toFixed(1)} rps`, wheelX, wheelY + wheelRadius + 26);

        // 4. Distant Retroreflector Mirror (Suresnes -> Montmartre)
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(mirrorX, mirrorY - 25, 14, 50, 4);
        ctx.fill();
        ctx.stroke();

        // Mirror Glow Line
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mirrorX, mirrorY - 22);
        ctx.lineTo(mirrorX, mirrorY + 22);
        ctx.stroke();

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("RETROREFLECTOR", mirrorX + 7, mirrorY - 32);
        ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
        ctx.fillText(`D = ${distanceKm} km`, mirrorX + 7, mirrorY + 38);

        // 5. Laser Ray Paths (Outbound & Return)
        // Outbound beam: Laser -> Splitter -> Wheel Gap -> Mirror
        ctx.strokeStyle = "rgba(239, 68, 68, 0.8)";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(laserX, laserY);
        ctx.lineTo(mirrorX, mirrorY);
        ctx.stroke();

        // Animated Outbound Photon Wave packet
        const outX = wheelX + (mirrorX - wheelX) * pulseProgressRef.current;
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(outX, laserY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Return beam: Mirror -> Wheel -> Splitter -> Eyepiece Detector
        const returnAlpha = Math.max(0.08, physicsData.transmissionIntensity);
        ctx.strokeStyle = `rgba(239, 68, 68, ${returnAlpha})`;
        ctx.beginPath();
        ctx.moveTo(mirrorX, mirrorY);
        ctx.lineTo(splitterX, laserY);
        ctx.lineTo(splitterX, detectorY);
        ctx.stroke();

        // 6. Photodetector Eyepiece & Analog Transmission Meter
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(splitterX - 25, detectorY, 50, 30, 8);
        ctx.fill();
        ctx.stroke();

        // Transmission Gauge Dial
        const dialR = 10;
        const dialAngle = -Math.PI * 0.75 + physicsData.transmissionIntensity * Math.PI * 1.5;
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(splitterX, detectorY + 15, dialR, -Math.PI * 0.75, Math.PI * 0.75);
        ctx.stroke();

        ctx.strokeStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(splitterX, detectorY + 15);
        ctx.lineTo(splitterX + Math.cos(dialAngle) * (dialR - 2), detectorY + 15 + Math.sin(dialAngle) * (dialR - 2));
        ctx.stroke();

        ctx.fillStyle = "#10b981";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`I/I₀ = ${(physicsData.transmissionIntensity * 100).toFixed(0)}%`, splitterX, detectorY + 44);

        // Extinction Banner when near zero
        if (physicsData.transmissionIntensity < 0.1) {
          ctx.fillStyle = "#ef4444";
          ctx.font = "bold 11px monospace";
          ctx.fillText("● ECLIPSE / EXTINCTION OCCURRED (TOOTH BLOCKED BEAM)", w * 0.58, laserY - 35);
        }
      } else if (activeMode === "media_race") {
        // ── MULTI-MEDIA REFRACTIVE SPEED RACE ───────────────────────────
        const mediaCount = OPTICAL_MEDIA_LIST.length;
        const trackH = (h - 40) / mediaCount;
        const startX = 140;
        const endX = w - 70;
        const trackW = endX - startX;

        OPTICAL_MEDIA_LIST.forEach((med, idx) => {
          const trackY = 25 + idx * trackH;
          const v = C_VACUUM / med.n;
          const progress = (pulseProgressRef.current * (1 / med.n)) % 1.0;
          const photonX = startX + progress * trackW;

          // Conduit Pipe
          ctx.fillStyle = "rgba(30, 41, 59, 0.6)";
          ctx.strokeStyle = med.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(startX, trackY + 4, trackW, trackH - 12, 8);
          ctx.fill();
          ctx.stroke();

          // Medium Label
          ctx.fillStyle = med.color;
          ctx.font = "bold 10px monospace";
          ctx.textAlign = "right";
          ctx.fillText(med.name, startX - 10, trackY + (trackH - 12) / 2 + 5);
          ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
          ctx.fillText(`n = ${med.n.toFixed(3)}`, startX - 10, trackY + (trackH - 12) / 2 + 15);

          // Moving Laser Wave Packet
          ctx.save();
          ctx.fillStyle = med.color;
          ctx.shadowColor = med.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(photonX, trackY + (trackH - 12) / 2 + 4, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Velocity Telemetry on Track
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "left";
          ctx.fillText(`v = ${(v / 1000).toLocaleString("en-US", { maximumFractionDigits: 0 })} km/s`, endX + 8, trackY + (trackH - 12) / 2 + 8);
        });
      } else {
        // ── MICHELSON INTERFEROMETER APPARATUS ──────────────────────────
        const centerX = w * 0.45;
        const centerY = h * 0.52;
        const armLength = 80;

        // Beam Splitter at Center
        ctx.strokeStyle = "rgba(56, 189, 248, 0.9)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX - 12, centerY - 12);
        ctx.lineTo(centerX + 12, centerY + 12);
        ctx.stroke();

        // Arm 1 (Horizontal Mirror)
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX + armLength, centerY - 16);
        ctx.lineTo(centerX + armLength, centerY + 16);
        ctx.stroke();

        // Arm 2 (Vertical Mirror)
        ctx.beginPath();
        ctx.moveTo(centerX - 16, centerY - armLength);
        ctx.lineTo(centerX + 16, centerY - armLength);
        ctx.stroke();

        // Light Beams
        ctx.strokeStyle = "rgba(239, 68, 68, 0.8)";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(centerX - armLength - 20, centerY);
        ctx.lineTo(centerX + armLength, centerY);
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX, centerY - armLength);
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX, centerY + armLength);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Optical Screen with Interference Rings
        const screenX = centerX;
        const screenY = centerY + armLength + 25;
        ctx.fillStyle = "#000000";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(screenX, screenY, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Concentric Interference Rings
        for (let r = 5; r <= 28; r += 5) {
          ctx.strokeStyle = "rgba(239, 68, 68, 0.8)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(screenX, screenY, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("INTERFERENCE FRINGES (NULL AETHER DRIFT)", screenX, screenY + 48);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeMode, distanceKm, teethCount, revPerSec, currentMedium, isPlaying, physicsData, pulseProgressRef]);

  // Export CSV
  const handleExportCSV = () => {
    const rows = [
      ["Parameter", "Value", "Unit"],
      ["Experiment Mode", activeMode, ""],
      ["Baseline Distance (D)", distanceKm.toString(), "km"],
      ["Wheel Teeth Count (N)", teethCount.toString(), ""],
      ["Rotation Speed (omega)", revPerSec.toString(), "rev/sec (rps)"],
      ["Optical Medium", currentMedium.name, ""],
      ["Refractive Index (n)", currentMedium.n.toString(), ""],
      ["Speed in Medium (v)", (physicsData.v_medium / 1000).toFixed(2), "km/s"],
      ["Round-Trip Time of Flight (Delta t)", physicsData.timeOfFlightUs.toFixed(4), "microseconds (µs)"],
      ["Fizeau Transmission Intensity (I/I0)", (physicsData.transmissionIntensity * 100).toFixed(2), "%"],
      ["Speed of Light (c)", (C_VACUUM / 1000).toFixed(3), "km/s (exact)"],
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `speed_of_light_telemetry_${Date.now()}.csv`);
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
              <Radio size={22} />
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
              Speed of Light Measurement & Time-of-Flight Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-mono font-bold">
              c = 299,792,458 m/s (Exact SI Constant)
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Fizeau 1849 toothed wheel, Foucault rotating mirror, multi-media refractive race, and time-of-flight picosecond telemetry.
          </p>
        </div>

        {/* Primary Simulation Toolbar */}
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
            title="Reset to Defaults"
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
        {/* Left Column: Optical Bench Canvas + Time-of-Flight Oscilloscope (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Main Simulation Stage */}
          <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
            {/* Top Floating Badges */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/10 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-xs" />
                <span>D = {distanceKm} km</span>
              </span>

              <span className="px-2.5 py-1 bg-sky-950/80 backdrop-blur-md rounded-full text-sky-300 text-[10px] font-mono font-black border border-sky-500/30">
                Δt = {physicsData.timeOfFlightUs > 1000 ? `${(physicsData.timeOfFlightUs / 1000).toFixed(3)} ms` : `${physicsData.timeOfFlightUs.toFixed(3)} µs`}
              </span>
            </div>

            {/* Mode Selector Badges */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/10">
              {[
                { id: "fizeau", label: "Fizeau Wheel" },
                { id: "media_race", label: "Media Race" },
                { id: "interferometer", label: "Interferometer" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setActiveMode(m.id as ExperimentMode);
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

            {/* Main Interactive Canvas */}
            <canvas
              ref={canvasRef}
              width={720}
              height={330}
              className="w-full h-[260px] sm:h-[320px] block"
            />
          </div>

          {/* Real-Time Transmission & Extinction Gauge */}
          <div className="bg-card border border-border rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-primary/10 text-primary">
                <Gauge size={16} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
                  Fizeau Extinction Condition
                </h3>
                <p className="text-[11px] font-mono text-muted-foreground">
                  c = 4 · N · D · ω  (Tooth blocks returning light at first minimum)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] text-muted-foreground font-bold uppercase">Transmission I/I₀</div>
                <div className="text-sm font-black font-mono text-emerald-400">
                  {(physicsData.transmissionIntensity * 100).toFixed(1)}%
                </div>
              </div>
              <div className="w-28 bg-muted rounded-full h-2.5 overflow-hidden border border-border">
                <div
                  className="bg-emerald-400 h-full transition-all duration-100"
                  style={{ width: `${Math.max(2, physicsData.transmissionIntensity * 100)}%` }}
                />
              </div>
            </div>
          </div>
          {/* ── Live Optical Telemetry Grid (Docked in Left Column Bottom) ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Speed of Light</span>
              <div className="text-base sm:text-lg font-black font-mono text-emerald-400 mt-0.5">
                299,792 <span className="text-xs font-normal text-muted-foreground">km/s</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Time of Flight (Δt)</span>
              <div className="text-base sm:text-lg font-black font-mono text-sky-400 mt-0.5">
                {physicsData.timeOfFlightUs > 1000 ? (
                  <>
                    {(physicsData.timeOfFlightUs / 1000).toFixed(2)} <span className="text-xs font-normal text-muted-foreground">ms</span>
                  </>
                ) : (
                  <>
                    {physicsData.timeOfFlightUs.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">µs</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Speed in Medium (v)</span>
              <div className="text-base sm:text-lg font-black font-mono text-amber-400 mt-0.5">
                {(physicsData.v_medium / 1000).toLocaleString("en-US", { maximumFractionDigits: 0 })}{" "}
                <span className="text-xs font-normal text-muted-foreground">km/s</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ratio (v/c)</span>
              <div className="text-base sm:text-lg font-black font-mono text-pink-400 mt-0.5">
                {(physicsData.relativeSpeedRatio * 100).toFixed(1)} <span className="text-xs font-normal text-muted-foreground">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Tab Console + Daily Challenge (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-card border border-border rounded-3xl p-5 shadow-xs space-y-4">
            {/* Console Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-border">
              {[
                { id: "controls", label: "Apparatus Controls", icon: Sliders },
                { id: "presets", label: "Guided Presets", icon: Layers },
                { id: "theory", label: "SI Constants", icon: Sparkles },
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

            {/* ── TAB 1: APPARATUS CONTROLS ── */}
            {activeConsoleTab === "controls" && (
              <div className="space-y-4">
                {/* Distance D Slider + Numeric Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Baseline Distance (D):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0.001"
                        max="384400"
                        step="0.1"
                        value={distanceKm}
                        onChange={(e) => setDistanceKm(Math.min(384400, Math.max(0.001, Number(e.target.value) || 0.001)))}
                        className="w-24 px-2 py-0.5 rounded-lg bg-muted border border-border text-emerald-400 font-mono font-black text-right text-xs focus:border-emerald-400 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">km</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="50"
                    step="0.1"
                    value={Math.min(50, distanceKm)}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                    <span>100m (Lab)</span>
                    <span>8.63km (Fizeau)</span>
                    <span>50km (Long)</span>
                  </div>
                </div>

                {/* Toothed Wheel N Slider + Numeric Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Wheel Teeth Count (N):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="100"
                        max="1440"
                        step="10"
                        value={teethCount}
                        onChange={(e) => setTeethCount(Math.min(1440, Math.max(100, Number(e.target.value) || 100)))}
                        className="w-20 px-2 py-0.5 rounded-lg bg-muted border border-border text-sky-400 font-mono font-black text-right text-xs focus:border-sky-400 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">teeth</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1440"
                    step="20"
                    value={teethCount}
                    onChange={(e) => setTeethCount(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                {/* Rotational Speed omega Slider + Numeric Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Rotation Speed (ω):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={revPerSec}
                        onChange={(e) => setRevPerSec(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                        className="w-20 px-2 py-0.5 rounded-lg bg-muted border border-border text-amber-400 font-mono font-black text-right text-xs focus:border-amber-400 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">rps</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="0.2"
                    value={revPerSec}
                    onChange={(e) => setRevPerSec(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                    <span>0 rps</span>
                    <span>12.6 rps (Extinction)</span>
                    <span>50 rps</span>
                  </div>
                </div>

                {/* Optical Medium Selector */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-muted-foreground">Optical Medium & Refractive Index:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {OPTICAL_MEDIA_LIST.map((med) => (
                      <button
                        key={med.id}
                        type="button"
                        onClick={() => {
                          setSelectedMedium(med.id);
                          triggerCompletion();
                        }}
                        className={`p-2 rounded-2xl border text-left transition space-y-0.5 cursor-pointer ${
                          selectedMedium === med.id
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                            : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black">{med.name}</span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-primary/15 text-primary">
                            n = {med.n}
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">{med.tag}</div>
                      </button>
                    ))}
                  </div>
                </div>
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

            {/* ── TAB 3: SI CONSTANTS & THEORY ── */}
            {activeConsoleTab === "theory" && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-muted/50 rounded-2xl border border-border space-y-2">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles size={13} className="text-primary" />
                    <span>SI Definition of the Metre (1983):</span>
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    In 1983, the 17th CGPM defined the metre as the length of the path travelled by light in vacuum during a time interval of 1 / 299,792,458 of a second. Thus, c is an exact defined constant.
                  </p>
                </div>

                <div className="p-3 bg-muted/50 rounded-2xl border border-border space-y-1 font-mono text-[11px]">
                  <div className="text-muted-foreground">Phase Velocity in Medium:</div>
                  <div className="text-primary font-bold">v = c / n</div>
                  <div className="text-muted-foreground mt-2">Fizeau 1st Extinction:</div>
                  <div className="text-primary font-bold">c = 4 · N · D · ω</div>
                </div>
              </div>
            )}
          </div>

          {/* Daily Challenge Card */}
          <DailyChallengeCard
            labId="physics/speedoflight"
            currentParams={{
              distanceKm,
              timeOfFlightUs: physicsData.timeOfFlightUs,
              mediumSpeed: physicsData.v_medium,
            }}
          />
        </div>
      </div>
    </div>
  );
}
