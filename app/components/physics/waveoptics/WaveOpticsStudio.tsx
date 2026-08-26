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
  Sun,
  Eye,
  SlidersHorizontal,
  Waves,
  Ruler,
  Maximize2,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────
export type ApertureMode = "double" | "single" | "grating";

export interface LaserPreset {
  id: string;
  name: string;
  wavelengthNm: number;
  colorName: string;
  hex: string;
}

export const LASER_PRESETS: LaserPreset[] = [
  { id: "violet_diode", name: "Violet Diode", wavelengthNm: 405, colorName: "Violet", hex: "#8b5cf6" },
  { id: "argon_blue", name: "Argon Ion", wavelengthNm: 488, colorName: "Cyan-Blue", hex: "#06b6d4" },
  { id: "dpss_green", name: "DPSS Green", wavelengthNm: 532, colorName: "Green", hex: "#10b981" },
  { id: "yellow_helium", name: "Helium-Neon Yellow", wavelengthNm: 594, colorName: "Yellow", hex: "#eab308" },
  { id: "hene_red", name: "He-Ne Standard", wavelengthNm: 632.8, colorName: "Red", hex: "#ef4444" },
  { id: "ruby_deep_red", name: "Ruby Laser", wavelengthNm: 694.3, colorName: "Deep Red", hex: "#dc2626" },
];

export interface GuidedPreset {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  mode: ApertureMode;
  wavelengthNm: number;
  aMicron: number;
  dMicron: number;
  Nslits: number;
  distMeters: number;
  explanation: string;
}

export const GUIDED_PRESETS: GuidedPreset[] = [
  {
    id: "young_classic",
    title: "Young's Classic Double-Slit Experiment",
    subtitle: "Observe constructive interference fringes modulated by single-slit envelope",
    tag: "Interference",
    mode: "double",
    wavelengthNm: 632.8,
    aMicron: 30,
    dMicron: 150,
    Nslits: 2,
    distMeters: 1.5,
    explanation: "Fringe width β = λD/d = 6.33mm. The bright interference fringes (cos²α) are enveloped within the central broad single-slit diffraction pattern (sinc²β).",
  },
  {
    id: "fraunhofer_single",
    title: "Fraunhofer Single-Slit Diffraction",
    subtitle: "Central broad maximum bounded by primary destructive minima",
    tag: "Diffraction",
    mode: "single",
    wavelengthNm: 532,
    aMicron: 50,
    dMicron: 150,
    Nslits: 1,
    distMeters: 1.2,
    explanation: "Single slit produces intensity I = I₀ sinc²(π a sinθ / λ). First minima occur at sinθ = ±λ/a. Central maximum is twice as wide as secondary fringes.",
  },
  {
    id: "grating_spectroscopy",
    title: "High-Resolution Diffraction Grating (N = 8)",
    subtitle: "Extremely sharp principal maxima with suppressed secondary peaks",
    tag: "Spectroscopy",
    mode: "grating",
    wavelengthNm: 488,
    aMicron: 20,
    dMicron: 80,
    Nslits: 8,
    distMeters: 1.8,
    explanation: "With N = 8 slits, principal maxima intensity scales with N² = 64 while peak width narrows by 1/N, providing high resolving power R = N·m for spectral lines.",
  },
  {
    id: "missing_orders",
    title: "Missing Orders & Envelope Modulation (d = 4a)",
    subtitle: "When d = 4a, the 4th interference maximum coincides with the 1st diffraction minimum",
    tag: "Wave Physics",
    mode: "double",
    wavelengthNm: 632.8,
    aMicron: 40,
    dMicron: 160,
    Nslits: 2,
    distMeters: 1.4,
    explanation: "Because d/a = 4, the 4th interference order (m = 4) falls precisely where the single-slit envelope reaches its first zero (β = π), completely extinguishing the fringe.",
  },
  {
    id: "chromatic_dispersion",
    title: "Wavelength Dispersion Comparison",
    subtitle: "Violet (405nm) vs Deep Red (694nm) fringe spacing",
    tag: "Optics",
    mode: "double",
    wavelengthNm: 405,
    aMicron: 35,
    dMicron: 140,
    Nslits: 2,
    distMeters: 1.5,
    explanation: "Since fringe spacing β ∝ λ, short-wavelength violet light produces tight, closely packed fringes compared to wide red fringes.",
  },
];

// Helper: Convert Wavelength (nm) to accurate sRGB Color
export function wavelengthToRGB(wavelength: number): { r: number; g: number; b: number; hex: string; colorName: string; rgba: (a: number) => string } {
  let r = 0;
  let g = 0;
  let b = 0;

  if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380);
    g = 0;
    b = 1;
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0;
    g = (wavelength - 440) / (490 - 440);
    b = 1;
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0;
    g = 1;
    b = -(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1;
    g = -(wavelength - 645) / (645 - 580);
    b = 0;
  } else if (wavelength >= 645 && wavelength <= 750) {
    r = 1;
    g = 0;
    b = 0;
  }

  // Intensity falloff at spectral edges
  let factor = 1.0;
  if (wavelength >= 380 && wavelength < 420) {
    factor = 0.3 + (0.7 * (wavelength - 380)) / (420 - 380);
  } else if (wavelength >= 700 && wavelength <= 750) {
    factor = 0.3 + (0.7 * (750 - wavelength)) / (750 - 700);
  }

  const R = Math.round(r * factor * 255);
  const G = Math.round(g * factor * 255);
  const B = Math.round(b * factor * 255);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  const hex = `#${toHex(R)}${toHex(G)}${toHex(B)}`;

  let colorName = "Red";
  if (wavelength < 440) colorName = "Violet";
  else if (wavelength < 490) colorName = "Cyan-Blue";
  else if (wavelength < 510) colorName = "Cyan";
  else if (wavelength < 580) colorName = "Green";
  else if (wavelength < 645) colorName = "Orange-Red";
  else colorName = "Deep Red";

  return {
    r: R,
    g: G,
    b: B,
    hex,
    colorName,
    rgba: (a: number) => `rgba(${R}, ${G}, ${B}, ${a})`,
  };
}

function sinc(x: number): number {
  if (Math.abs(x) < 1e-8) return 1.0;
  return Math.sin(x) / x;
}

export default function WaveOpticsStudio() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "physics/waveoptics",
    "physics",
    "simulation"
  );

  // ── Optical Parameters ────────────────────────────────────────────────
  const [mode, setMode] = useState<ApertureMode>("double");
  const [wavelengthNm, setWavelengthNm] = useState<number>(632.8); // 380 .. 750 nm
  const [aMicron, setAMicron] = useState<number>(35); // Slit width: 5 .. 200 um
  const [dMicron, setDMicron] = useState<number>(150); // Slit spacing: 20 .. 800 um
  const [Nslits, setNslits] = useState<number>(5); // Grating slits: 2 .. 20
  const [distMeters, setDistMeters] = useState<number>(1.5); // Screen distance: 0.5 .. 4.0 m
  const [halfWidthMm, setHalfWidthMm] = useState<number>(30); // Half-screen view span in mm (10 .. 80 mm)

  // Simulation & UI state
  const [isWaveRunning, setIsWaveRunning] = useState<boolean>(true);
  const [showEnvelope, setShowEnvelope] = useState<boolean>(true);
  const [showWavelets, setShowWavelets] = useState<boolean>(true);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"controls" | "lasers" | "presets">("controls");
  const [hoverPosMm, setHoverPosMm] = useState<number | null>(null);

  // Canvas Refs
  const benchCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fringeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const wavePhaseRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Spectral Color
  const laserColor = useMemo(() => wavelengthToRGB(wavelengthNm), [wavelengthNm]);

  // Derived Physical Telemetry
  const telemetry = useMemo(() => {
    const λ = wavelengthNm * 1e-9;
    const a = aMicron * 1e-6;
    const d = dMicron * 1e-6;
    const D = distMeters;

    // Fringe spacing in mm (for double slit / grating)
    const fringeSpacingMm = d > 0 ? (λ * D / d) * 1000 : 0;
    // Central diffraction peak full width in mm (single slit)
    const centralPeakWidthMm = a > 0 ? (2 * λ * D / a) * 1000 : 0;
    // First order angular separation
    const theta1Deg = d > 0 ? (Math.asin(Math.min(1, λ / d)) * 180) / Math.PI : 0;
    // Grating resolving power for order m = 1
    const resolvingPower = mode === "grating" ? Nslits * 1 : 2;

    return {
      fringeSpacingMm,
      centralPeakWidthMm,
      theta1Deg,
      resolvingPower,
    };
  }, [wavelengthNm, aMicron, dMicron, distMeters, mode, Nslits]);

  // Compute 1D Fraunhofer Intensity Distribution Array
  const intensityData = useMemo(() => {
    const λ = wavelengthNm * 1e-9;
    const a = aMicron * 1e-6;
    const d = dMicron * 1e-6;
    const D = distMeters;
    const halfMm = halfWidthMm;
    const samples = 800;

    const points: { yMm: number; intensity: number; envelope: number }[] = [];
    const N = mode === "grating" ? Math.max(1, Math.floor(Nslits)) : mode === "double" ? 2 : 1;

    for (let i = 0; i <= samples; i++) {
      const yMm = -halfMm + (i / samples) * (2 * halfMm);
      const yM = yMm * 1e-3;

      // Small angle approximation / exact sin(theta)
      const sinTheta = yM / Math.sqrt(yM * yM + D * D);

      // Single-slit diffraction envelope: beta = pi * a * sin(theta) / lambda
      const beta = (Math.PI * a * sinTheta) / λ;
      const env = sinc(beta);
      const envelopeVal = env * env;

      // Interference factor
      let interferenceVal = 1.0;
      if (mode === "single") {
        interferenceVal = 1.0;
      } else if (mode === "double") {
        const gamma = (Math.PI * d * sinTheta) / λ;
        const cosG = Math.cos(gamma);
        interferenceVal = cosG * cosG;
      } else if (mode === "grating") {
        const gamma = (Math.PI * d * sinTheta) / λ;
        if (Math.abs(Math.sin(gamma)) < 1e-7) {
          interferenceVal = 1.0;
        } else {
          const num = Math.sin(N * gamma);
          const den = N * Math.sin(gamma);
          interferenceVal = (num / den) * (num / den);
        }
      }

      const totalI = envelopeVal * interferenceVal;
      points.push({
        yMm,
        intensity: Math.max(0, Math.min(1, totalI)),
        envelope: Math.max(0, Math.min(1, envelopeVal)),
      });
    }

    return points;
  }, [wavelengthNm, aMicron, dMicron, distMeters, halfWidthMm, mode, Nslits]);

  // Sync AI Chatbot Knowledge Base
  useEffect(() => {
    setExperimentData({
      title: "Wave Optics, Diffraction & Young's Double-Slit Studio",
      theory: `Fraunhofer Diffraction & Interference: Double-slit intensity I(θ) = I₀ cos²(π d sinθ / λ) · sinc²(π a sinθ / λ). Fringe width β = λD/d. Single slit minima: sinθ = mλ/a. Diffraction grating principal maxima: d sinθ = mλ with resolving power R = N·m.`,
      extraContext: `Mode = ${mode}, Wavelength λ = ${wavelengthNm}nm (${laserColor.colorName}), Slit Width a = ${aMicron}µm, Slit Spacing d = ${dMicron}µm, Screen Distance D = ${distMeters}m. Fringe Spacing = ${telemetry.fringeSpacingMm.toFixed(2)}mm, Central Maxima Width = ${telemetry.centralPeakWidthMm.toFixed(2)}mm.`,
    });
  }, [mode, wavelengthNm, aMicron, dMicron, distMeters, laserColor, telemetry, setExperimentData]);

  // Trigger XP Reward on meaningful interaction
  const triggerCompletion = useCallback(() => {
    completeExperiment();
  }, [completeExperiment]);

  // Apply Preset
  const handleApplyPreset = (preset: GuidedPreset) => {
    setMode(preset.mode);
    setWavelengthNm(preset.wavelengthNm);
    setAMicron(preset.aMicron);
    setDMicron(preset.dMicron);
    setNslits(preset.Nslits);
    setDistMeters(preset.distMeters);
    triggerCompletion();
  };

  // ── Render 2D Optical Bench & Propagating Wavefronts Canvas ───────────
  useEffect(() => {
    const canvas = benchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (isWaveRunning) {
        wavePhaseRef.current += 0.12;
      }

      // Background: Deep Optical Darkroom Lab
      const bgGrad = ctx.createLinearGradient(0, 0, w, 0);
      bgGrad.addColorStop(0, "#030712");
      bgGrad.addColorStop(0.35, "#0b0f19");
      bgGrad.addColorStop(1, "#020617");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      const laserSourceX = 40;
      const barrierX = 220;
      const screenX = w - 45;
      const centerY = h / 2;

      // 1. Monochromatic Laser Source Apparatus
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(10, centerY - 28, 55, 56, 8);
      ctx.fill();
      ctx.stroke();

      // Laser Emitter Barrel
      ctx.fillStyle = laserColor.hex;
      ctx.shadowColor = laserColor.hex;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(65, centerY - 10, 18, 20, 3);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Laser Label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${wavelengthNm}nm`, 37, centerY + 3);

      // 2. Incident Monochromatic Plane Waves (Laser to Barrier)
      ctx.strokeStyle = laserColor.rgba(0.55);
      ctx.lineWidth = 2;
      const lambdaPixel = 18; // scaled visual wavelength
      for (let x = 85; x < barrierX - 4; x += lambdaPixel) {
        const animOffset = (wavePhaseRef.current * 3) % lambdaPixel;
        const lineX = x + animOffset;
        if (lineX < barrierX - 2) {
          ctx.beginPath();
          ctx.moveTo(lineX, centerY - 45);
          ctx.lineTo(lineX, centerY + 45);
          ctx.stroke();
        }
      }

      // Incident Central Laser Core Beam
      ctx.strokeStyle = laserColor.rgba(0.85);
      ctx.lineWidth = 4;
      ctx.shadowColor = laserColor.hex;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(83, centerY);
      ctx.lineTo(barrierX - 2, centerY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 3. Aperture Slit Barrier Mask
      ctx.fillStyle = "#334155";
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 2;

      const maskHeight = h - 20;
      const maskTop = 10;

      // Slit positions in screen pixels
      let slitPositions: number[] = [];
      const slitPixelSpacing = Math.max(10, Math.min(60, (dMicron / 300) * 36));
      const slitPixelWidth = Math.max(3, Math.min(14, (aMicron / 100) * 8));

      if (mode === "single") {
        slitPositions = [centerY];
      } else if (mode === "double") {
        slitPositions = [centerY - slitPixelSpacing * 0.5, centerY + slitPixelSpacing * 0.5];
      } else {
        // Multi-slit grating
        const N = Math.min(7, Nslits);
        const startY = centerY - ((N - 1) * slitPixelSpacing) * 0.5;
        for (let s = 0; s < N; s++) {
          slitPositions.push(startY + s * slitPixelSpacing);
        }
      }

      // Draw Slit Barrier with Cutout Openings
      ctx.beginPath();
      ctx.rect(barrierX, maskTop, 8, maskHeight);
      ctx.fill();
      ctx.stroke();

      // Clear the slit apertures (glowing transparent openings)
      slitPositions.forEach((sy) => {
        ctx.clearRect(barrierX - 1, sy - slitPixelWidth * 0.5, 10, slitPixelWidth);
        ctx.fillStyle = laserColor.hex;
        ctx.shadowColor = laserColor.hex;
        ctx.shadowBlur = 8;
        ctx.fillRect(barrierX, sy - slitPixelWidth * 0.5, 8, slitPixelWidth);
        ctx.shadowBlur = 0;
      });

      // 4. Propagating Huygens Cylindrical Wavefronts (Barrier to Screen)
      if (showWavelets) {
        ctx.save();
        // Clip to propagation chamber (between barrier and screen)
        ctx.beginPath();
        ctx.rect(barrierX + 8, 5, screenX - barrierX - 8, h - 10);
        ctx.clip();

        slitPositions.forEach((sy) => {
          for (let r = 10; r < 500; r += lambdaPixel) {
            const animR = r + (wavePhaseRef.current * 3) % lambdaPixel;
            const alpha = Math.max(0.04, 0.45 * (1 - animR / 450));
            ctx.strokeStyle = laserColor.rgba(alpha);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(barrierX + 8, sy, animR, -Math.PI * 0.48, Math.PI * 0.48);
            ctx.stroke();
          }
        });
        ctx.restore();
      }

      // 5. Projection Screen Plane Apparatus
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(screenX, 12, 28, h - 24, 6);
      ctx.fill();
      ctx.stroke();

      // Screen Face Glow
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.save();
      ctx.translate(screenX + 14, centerY);
      ctx.rotate(Math.PI * 0.5);
      ctx.fillText(`SCREEN (D = ${distMeters.toFixed(1)}m)`, 0, 3);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    isWaveRunning,
    laserColor,
    wavelengthNm,
    mode,
    aMicron,
    dMicron,
    Nslits,
    distMeters,
    showWavelets,
  ]);

  // ── Render High-Fidelity Optical Fringe Projection Screen ─────────────
  useEffect(() => {
    const canvas = fringeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Dark screen chamber
    ctx.fillStyle = "#02040a";
    ctx.fillRect(0, 0, w, h);

    const padLeft = 45;
    const padRight = 45;
    const screenW = w - padLeft - padRight;
    const screenH = h - 24;
    const topY = 12;

    // Draw Screen Backplate
    ctx.fillStyle = "#030712";
    ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
    ctx.lineWidth = 1;
    ctx.strokeRect(padLeft, topY, screenW, screenH);

    // Render Continuous Optical Interference Fringes
    const samples = intensityData.length;
    if (samples < 2) return;

    for (let i = 0; i < samples; i++) {
      const d = intensityData[i];
      const x = padLeft + (i / (samples - 1)) * screenW;
      const colWidth = screenW / samples + 0.6;

      // Realistic intensity mapped with perceptual gamma exponent
      const gammaI = Math.pow(d.intensity, 0.85);
      ctx.fillStyle = laserColor.rgba(gammaI);
      ctx.fillRect(x, topY, colWidth, screenH);
    }

    // Centered White Laser Glare Overlay
    const centralGrad = ctx.createLinearGradient(padLeft, 0, padLeft + screenW, 0);
    centralGrad.addColorStop(0, "rgba(255,255,255,0)");
    centralGrad.addColorStop(0.5, laserColor.rgba(0.2));
    centralGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = centralGrad;
    ctx.fillRect(padLeft, topY, screenW, screenH);

    // Metric Scale Ruler Ticks (in mm)
    ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
    ctx.lineWidth = 1;

    for (let mm = -halfWidthMm; mm <= halfWidthMm; mm += 10) {
      const normX = (mm + halfWidthMm) / (2 * halfWidthMm);
      const x = padLeft + normX * screenW;

      ctx.beginPath();
      ctx.moveTo(x, topY + screenH);
      ctx.lineTo(x, topY + screenH + 6);
      ctx.stroke();

      ctx.fillText(`${mm === 0 ? "0" : `${mm > 0 ? `+${mm}` : mm}`}mm`, x, topY + screenH + 16);
    }

    // Hover Inspection Reticle
    if (hoverPosMm !== null) {
      const normHover = (hoverPosMm + halfWidthMm) / (2 * halfWidthMm);
      const hx = padLeft + normHover * screenW;

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(hx, topY);
      ctx.lineTo(hx, topY + screenH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = laserColor.hex;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(hx, topY + screenH * 0.5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, [intensityData, laserColor, halfWidthMm, hoverPosMm]);

  // ── Render Fraunhofer Intensity Envelope Curve Canvas ────────────────
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padLeft = 55;
    const padRight = 45;
    const padTop = 18;
    const padBottom = 26;
    const graphW = w - padLeft - padRight;
    const graphH = h - padTop - padBottom;

    // 1. OLED Phosphor Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, "#040813");
    bgGrad.addColorStop(1, "#020409");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Frame Border
    ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(padLeft, padTop, graphW, graphH);

    // High-Tech Grid
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

    // Y-Axis Ticks (Intensity I/I0)
    ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const val = (1 - i / 4).toFixed(2);
      const y = padTop + (i / 4) * graphH;
      ctx.fillText(i === 0 ? "1.0 I₀" : val, padLeft - 6, y + 3);

      ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
      ctx.beginPath();
      ctx.moveTo(padLeft - 4, y);
      ctx.lineTo(padLeft, y);
      ctx.stroke();
    }

    // X-Axis Position Ticks
    ctx.textAlign = "center";
    for (let i = 0; i <= 4; i++) {
      const x = padLeft + (i / 4) * graphW;
      const mmVal = -halfWidthMm + (i / 4) * (2 * halfWidthMm);
      ctx.fillText(`${mmVal.toFixed(0)}mm`, x, h - 8);
    }

    const data = intensityData;
    const n = data.length;
    if (n < 2) return;

    // 2. Single-Slit Diffraction Envelope Curve (White dashed)
    if (showEnvelope && mode !== "single") {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      data.forEach((d, idx) => {
        const x = padLeft + (idx / (n - 1)) * graphW;
        const y = padTop + graphH - d.envelope * graphH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 3. Filled Fraunhofer Interference Intensity Waveform
    // Gradient Under Curve
    const waveGrad = ctx.createLinearGradient(0, padTop, 0, padTop + graphH);
    waveGrad.addColorStop(0, laserColor.rgba(0.45));
    waveGrad.addColorStop(0.7, laserColor.rgba(0.12));
    waveGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = waveGrad;

    ctx.beginPath();
    data.forEach((d, idx) => {
      const x = padLeft + (idx / (n - 1)) * graphW;
      const y = padTop + graphH - d.intensity * graphH;
      if (idx === 0) {
        ctx.moveTo(x, padTop + graphH);
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.lineTo(padLeft + graphW, padTop + graphH);
    ctx.closePath();
    ctx.fill();

    // Sharp Glowing Stroke Line
    ctx.save();
    ctx.shadowColor = laserColor.hex;
    ctx.shadowBlur = 8;
    ctx.strokeStyle = laserColor.hex;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    data.forEach((d, idx) => {
      const x = padLeft + (idx / (n - 1)) * graphW;
      const y = padTop + graphH - d.intensity * graphH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();

    // Reticle Peak on Graph
    if (hoverPosMm !== null) {
      const normHover = (hoverPosMm + halfWidthMm) / (2 * halfWidthMm);
      const hx = padLeft + normHover * graphW;
      const closestIdx = Math.min(n - 1, Math.max(0, Math.round(normHover * (n - 1))));
      const curI = data[closestIdx].intensity;
      const hy = padTop + graphH - curI * graphH;

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(hx, padTop);
      ctx.lineTo(hx, padTop + graphH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = laserColor.hex;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(hx, hy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, [intensityData, laserColor, halfWidthMm, hoverPosMm, showEnvelope, mode]);

  // Export CSV Telemetry
  const handleExportCSV = () => {
    const rows = [
      ["Position (mm)", "Relative Intensity (I/I0)", "Diffraction Envelope"],
      ...intensityData.map((d) => [d.yMm.toFixed(3), d.intensity.toFixed(5), d.envelope.toFixed(5)]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wave_optics_intensity_${wavelengthNm}nm_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset to default
  const handleReset = () => {
    setMode("double");
    setWavelengthNm(632.8);
    setAMicron(35);
    setDMicron(150);
    setNslits(5);
    setDistMeters(1.5);
    setHalfWidthMm(30);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-5 lg:p-6 space-y-5">
      {/* ── Executive Header Bar ───────────────────────────────────── */}
      <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-2xl bg-primary/10 text-primary">
              <Waves size={22} />
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
              Wave Optics, Diffraction & Young's Double-Slit Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-mono font-bold">
              Electromagnetic Wave Interference & Fraunhofer Diffraction
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Monochromatic laser tuning (380–750nm), 2D Huygens wavefront propagation, single/double/grating aperture geometry, and live Fraunhofer spectral intensity curves.
          </p>
        </div>

        {/* Primary Simulation Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsWaveRunning(!isWaveRunning)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition shadow-xs cursor-pointer ${
              isWaveRunning
                ? "bg-amber-500 text-black hover:bg-amber-400"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isWaveRunning ? (
              <>
                <Pause size={15} fill="currentColor" />
                <span>Pause Wave</span>
              </>
            ) : (
              <>
                <Play size={15} fill="currentColor" />
                <span>Propagate Wave</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-card border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition cursor-pointer"
            title="Reset Optics Parameters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-card border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition cursor-pointer"
            title="Export Spectral Intensity CSV"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace: Central Stage (Left 7 cols) + Control Deck (Right 5 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Optical Bench + Fringe Projection + Intensity Envelope (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Stage 1: 2D Optical Bench & Propagating Wavefronts */}
          <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
            {/* Top Floating Badges */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/10 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: laserColor.hex }} />
                <span>λ = {wavelengthNm} nm</span>
                <span className="text-muted-foreground font-mono text-[11px]">({laserColor.colorName})</span>
              </span>

              <span className="px-2.5 py-1 bg-primary/20 backdrop-blur-md rounded-full text-primary text-[10px] font-mono font-black border border-primary/30 uppercase">
                {mode === "double" ? "Young's Double-Slit" : mode === "single" ? "Single-Slit Diffraction" : `Grating (N = ${Nslits})`}
              </span>
            </div>

            {/* Overlays Toggle */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setShowWavelets(!showWavelets)}
                className={`px-2 py-0.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                  showWavelets ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white"
                }`}
              >
                Huygens Wavelets
              </button>
            </div>

            <canvas
              ref={benchCanvasRef}
              width={720}
              height={220}
              className="w-full h-[180px] sm:h-[210px] block"
            />
          </div>

          {/* Stage 2: Realistic Optical Fringe Projection Screen */}
          <div className="bg-card border border-border rounded-3xl p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun size={16} className="text-primary" />
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
                  Photographic Fringe Projection Screen
                </h3>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono font-bold">
                <span className="text-muted-foreground">Fringe Spacing (β):</span>
                <span className="text-primary">{telemetry.fringeSpacingMm.toFixed(2)} mm</span>
              </div>
            </div>

            <canvas
              ref={fringeCanvasRef}
              width={720}
              height={90}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const xRel = (e.clientX - rect.left) / rect.width;
                const posMm = -halfWidthMm + xRel * (2 * halfWidthMm);
                setHoverPosMm(posMm);
              }}
              onMouseLeave={() => setHoverPosMm(null)}
              className="w-full h-[90px] rounded-2xl block border border-border cursor-crosshair"
            />
          </div>

          {/* Stage 3: Digital Fraunhofer Spectral Intensity Curve */}
          <div className="bg-card border border-border rounded-3xl p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-primary" />
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
                  Fraunhofer Spectral Intensity Envelope
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowEnvelope(!showEnvelope)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition cursor-pointer ${
                    showEnvelope
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {showEnvelope ? "Hide Envelope" : "Show Envelope"}
                </button>
              </div>
            </div>

            {/* Live Readout Legend Chips */}
            <div className="flex items-center justify-between text-[11px] font-mono font-bold bg-muted/40 p-2 rounded-2xl border border-border/50">
              <span className="flex items-center gap-1.5" style={{ color: laserColor.hex }}>
                <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: laserColor.hex }} />
                Intensity: {hoverPosMm !== null ? `${(intensityData[Math.min(intensityData.length - 1, Math.max(0, Math.round(((hoverPosMm + halfWidthMm) / (2 * halfWidthMm)) * (intensityData.length - 1))))]?.intensity || 0).toFixed(3)} I₀` : "I(θ) Profile"}
              </span>
              <span className="text-muted-foreground flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/60" />
                Diffraction Envelope: sinc²(β)
              </span>
              <span className="text-foreground/80 flex items-center gap-1.5">
                <Ruler size={13} className="text-primary" />
                Pos: {hoverPosMm !== null ? `${hoverPosMm.toFixed(1)} mm` : "Hover to Inspect"}
              </span>
            </div>

            <canvas
              ref={graphCanvasRef}
              width={720}
              height={160}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const xRel = (e.clientX - rect.left) / rect.width;
                const posMm = -halfWidthMm + xRel * (2 * halfWidthMm);
                setHoverPosMm(posMm);
              }}
              onMouseLeave={() => setHoverPosMm(null)}
              className="w-full h-[160px] rounded-2xl block border border-border cursor-crosshair"
            />
          </div>
        </div>

        {/* Right Column: Multi-Tab Console + Live Telemetry Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-card border border-border rounded-3xl p-5 shadow-xs space-y-4">
            {/* Console Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-border">
              {[
                { id: "controls", label: "Aperture & Slits", icon: Sliders },
                { id: "lasers", label: "Laser Spectrum", icon: Sun },
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

            {/* ── TAB 1: APERTURE & SLITS ── */}
            {activeConsoleTab === "controls" && (
              <div className="space-y-4">
                {/* Aperture Mode Switcher */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-muted-foreground">Aperture Configuration:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "double", label: "Double-Slit" },
                      { id: "single", label: "Single-Slit" },
                      { id: "grating", label: "Diffraction Grating" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setMode(m.id as ApertureMode);
                          triggerCompletion();
                        }}
                        className={`p-2 rounded-2xl border text-center transition text-xs font-bold cursor-pointer ${
                          mode === m.id
                            ? "border-primary bg-primary/10 text-primary shadow-2xs"
                            : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slit Width a Slider + Numeric Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Slit Width (a):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="5"
                        max="200"
                        step="5"
                        value={aMicron}
                        onChange={(e) => setAMicron(Math.min(200, Math.max(5, Number(e.target.value) || 5)))}
                        className="w-18 px-2 py-0.5 rounded-lg bg-muted border border-border text-primary font-mono font-black text-right text-xs focus:border-primary focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">µm</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="2"
                    value={aMicron}
                    onChange={(e) => setAMicron(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                    <span>10 µm (Narrow)</span>
                    <span>50 µm (Standard)</span>
                    <span>150 µm (Broad)</span>
                  </div>
                </div>

                {/* Slit Separation d Slider (Double Slit / Grating) */}
                {mode !== "single" && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-muted-foreground">Slit Separation (d):</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="20"
                          max="800"
                          step="10"
                          value={dMicron}
                          onChange={(e) => setDMicron(Math.min(800, Math.max(20, Number(e.target.value) || 20)))}
                          className="w-18 px-2 py-0.5 rounded-lg bg-muted border border-border text-sky-400 font-mono font-black text-right text-xs focus:border-sky-400 focus:outline-none"
                        />
                        <span className="text-xs font-mono font-bold text-muted-foreground">µm</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="500"
                      step="5"
                      value={dMicron}
                      onChange={(e) => setDMicron(Number(e.target.value))}
                      className="w-full accent-sky-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                      <span>40 µm</span>
                      <span>150 µm</span>
                      <span>500 µm</span>
                    </div>
                  </div>
                )}

                {/* Number of Slits N (Grating Mode) */}
                {mode === "grating" && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-muted-foreground">Grating Slits (N):</span>
                      <span className="text-amber-400 font-mono font-black">{Nslits} slits</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="16"
                      step="1"
                      value={Nslits}
                      onChange={(e) => setNslits(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                      <span>N = 2</span>
                      <span>N = 8</span>
                      <span>N = 16</span>
                    </div>
                  </div>
                )}

                {/* Screen Distance D Slider + Numeric Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Screen Distance (D):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0.5"
                        max="4.0"
                        step="0.1"
                        value={distMeters}
                        onChange={(e) => setDistMeters(Math.min(4.0, Math.max(0.5, Number(e.target.value) || 0.5)))}
                        className="w-18 px-2 py-0.5 rounded-lg bg-muted border border-border text-emerald-400 font-mono font-black text-right text-xs focus:border-emerald-400 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">m</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3.5"
                    step="0.1"
                    value={distMeters}
                    onChange={(e) => setDistMeters(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                    <span>0.5 m (Near)</span>
                    <span>1.5 m (Standard)</span>
                    <span>3.5 m (Far)</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: LASER SPECTRUM ── */}
            {activeConsoleTab === "lasers" && (
              <div className="space-y-4">
                {/* Wavelength Slider with Dynamic Glowing Laser Color */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Laser Wavelength (λ):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="380"
                        max="750"
                        step="1"
                        value={wavelengthNm}
                        onChange={(e) => setWavelengthNm(Math.min(750, Math.max(380, Number(e.target.value) || 380)))}
                        className="w-20 px-2 py-0.5 rounded-lg bg-muted border border-border font-mono font-black text-right text-xs focus:outline-none"
                        style={{ color: laserColor.hex }}
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">nm</span>
                    </div>
                  </div>

                  {/* Multi-Color Spectral Gradient Slider Track */}
                  <input
                    type="range"
                    min="380"
                    max="750"
                    step="1"
                    value={wavelengthNm}
                    onChange={(e) => setWavelengthNm(Number(e.target.value))}
                    className="w-full cursor-pointer h-2.5 rounded-lg appearance-none"
                    style={{
                      background: "linear-gradient(to right, #8b5cf6, #3b82f6, #06b6d4, #10b981, #eab308, #f97316, #ef4444, #b91c1c)",
                    }}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
                    <span>380nm (UV/Violet)</span>
                    <span>550nm (Green)</span>
                    <span>750nm (IR/Red)</span>
                  </div>
                </div>

                {/* Laser Spectral Presets */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <span className="text-xs font-bold text-muted-foreground">Standard Laser Sources:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {LASER_PRESETS.map((lp) => (
                      <button
                        key={lp.id}
                        type="button"
                        onClick={() => {
                          setWavelengthNm(lp.wavelengthNm);
                          triggerCompletion();
                        }}
                        className={`p-2.5 rounded-2xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                          wavelengthNm === lp.wavelengthNm
                            ? "border-primary bg-primary/10 shadow-2xs font-bold"
                            : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full shadow-xs shrink-0" style={{ backgroundColor: lp.hex }} />
                        <div className="space-y-0.5">
                          <div className="text-xs font-black">{lp.name}</div>
                          <div className="text-[10px] font-mono text-muted-foreground">{lp.wavelengthNm} nm</div>
                        </div>
                      </button>
                    ))}
                  </div>
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

          {/* ── Live Optical Telemetry Grid (Docked in Right Column) ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fringe Spacing (β)</span>
              <div className="text-base sm:text-lg font-black font-mono text-primary mt-0.5">
                {telemetry.fringeSpacingMm.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">mm</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Central Peak (W₀)</span>
              <div className="text-base sm:text-lg font-black font-mono text-emerald-400 mt-0.5">
                {telemetry.centralPeakWidthMm.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">mm</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Angular Spread (θ₁)</span>
              <div className="text-base sm:text-lg font-black font-mono text-sky-400 mt-0.5">
                {telemetry.theta1Deg.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">°</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Resolving Power</span>
              <div className="text-base sm:text-lg font-black font-mono text-amber-400 mt-0.5">
                {telemetry.resolvingPower} <span className="text-xs font-normal text-muted-foreground">λ/Δλ</span>
              </div>
            </div>
          </div>

          {/* Daily Challenge Card */}
          <DailyChallengeCard
            labId="physics/waveoptics"
            currentParams={{
              fringeWidth: (wavelengthNm * 1e-9 * distMeters) / (dMicron * 1e-6),
              wavelength: wavelengthNm,
            }}
          />
        </div>
      </div>
    </div>
  );
}
