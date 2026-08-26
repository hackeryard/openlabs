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
  Eye,
  SlidersHorizontal,
  Flame,
  Maximize2,
  Compass,
  CircleDot,
  MoveHorizontal,
  Sparkle,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────
export type LensType = "convex" | "concave";

export interface OpticalMaterial {
  id: string;
  name: string;
  n: number; // refractive index
  tag: string;
  color: string;
}

export const OPTICAL_MATERIALS: OpticalMaterial[] = [
  { id: "crown_glass", name: "Crown Glass", n: 1.523, tag: "Standard Optical", color: "#38bdf8" },
  { id: "flint_glass", name: "Flint Glass", n: 1.660, tag: "High Dispersion", color: "#818cf8" },
  { id: "acrylic", name: "Acrylic (PMMA)", n: 1.491, tag: "Optical Plastic", color: "#34d399" },
  { id: "diamond", name: "Diamond", n: 2.417, tag: "Extreme Refraction", color: "#f472b6" },
  { id: "water", name: "Water Chamber", n: 1.333, tag: "Liquid Lens", color: "#60a5fa" },
];

export interface GuidedPreset {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  lensType: LensType;
  focalLengthMm: number;
  objectDistMm: number;
  objectHeightMm: number;
  materialId: string;
  explanation: string;
}

export const GUIDED_PRESETS: GuidedPreset[] = [
  {
    id: "case_beyond_2f",
    title: "Case 1: Object Beyond 2F (Camera Lens)",
    subtitle: "Real, inverted, diminished image formed between F and 2F on the opposite side",
    tag: "Photography",
    lensType: "convex",
    focalLengthMm: 100,
    objectDistMm: 280,
    objectHeightMm: 50,
    materialId: "crown_glass",
    explanation: "When do > 2f (280mm > 200mm), the image forms at di = 155.6mm with magnification M = -0.56x. The image is Real, Inverted, and Reduced, precisely how camera sensors capture wide landscapes.",
  },
  {
    id: "case_at_2f",
    title: "Case 2: Object Exactly at 2F (1:1 Inverter)",
    subtitle: "Real, inverted image with identical height (|M| = 1.0) formed at 2F",
    tag: "Unit Conjugate",
    lensType: "convex",
    focalLengthMm: 100,
    objectDistMm: 200,
    objectHeightMm: 50,
    materialId: "crown_glass",
    explanation: "At do = 2f = 200mm, the Gaussian formula yields di = 200mm and M = -1.00x. The image is Real, Inverted, and exact 1:1 scale with the object.",
  },
  {
    id: "case_between_f_2f",
    title: "Case 3: Object Between F and 2F (Projector Lens)",
    subtitle: "Real, inverted, magnified image formed beyond 2F on the opposite side",
    tag: "Projection",
    lensType: "convex",
    focalLengthMm: 100,
    objectDistMm: 150,
    objectHeightMm: 40,
    materialId: "crown_glass",
    explanation: "When f < do < 2f (150mm), the image projects out to di = 300mm with magnification M = -2.00x. This is the operating principle of movie cinema projectors and slide viewers.",
  },
  {
    id: "case_magnifying_glass",
    title: "Case 4: Magnifying Glass (Object Inside F)",
    subtitle: "Virtual, upright, enlarged image formed on the same side as the object",
    tag: "Magnification",
    lensType: "convex",
    focalLengthMm: 120,
    objectDistMm: 60,
    objectHeightMm: 35,
    materialId: "crown_glass",
    explanation: "When do < f (60mm < 120mm), light rays diverge after the lens. Projecting their virtual paths backwards reveals an erect, enlarged virtual image at di = -120mm (M = +2.00x).",
  },
  {
    id: "case_concave_diverging",
    title: "Case 5: Concave Diverging Lens (Myopia Correction)",
    subtitle: "Virtual, upright, diminished image formed inside the focal length for all positions",
    tag: "Eyeglasses",
    lensType: "concave",
    focalLengthMm: -100,
    objectDistMm: 180,
    objectHeightMm: 50,
    materialId: "crown_glass",
    explanation: "For a diverging lens (f = -100mm), rays diverge directly upon refraction. For all object distances, a Virtual, Erect, Diminished image is formed on the incident side (di = -64.3mm, M = +0.36x).",
  },
];

export default function OpticsLensStudio() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "physics/opticslens",
    "physics",
    "simulation"
  );

  // ── Optical Bench Parameters ──────────────────────────────────────────
  const [lensType, setLensType] = useState<LensType>("convex");
  const [absFocalLengthMm, setAbsFocalLengthMm] = useState<number>(100); // 40 .. 250 mm
  const [objectDistMm, setObjectDistMm] = useState<number>(220); // 20 .. 500 mm
  const [objectHeightMm, setObjectHeightMm] = useState<number>(45); // 10 .. 80 mm
  const [selectedMaterial, setSelectedMaterial] = useState<string>("crown_glass");

  // Visual Overlays & Ray Toggles
  const [showParallelRay, setShowParallelRay] = useState<boolean>(true);
  const [showFocalRay, setShowFocalRay] = useState<boolean>(true);
  const [showChiefRay, setShowChiefRay] = useState<boolean>(true);
  const [showVirtualExtensions, setShowVirtualExtensions] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"controls" | "lensmaker" | "presets">("controls");

  // Canvas Refs & Dragging State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingObjectRef = useRef<boolean>(false);
  const isDraggingHeightRef = useRef<boolean>(false);

  // Signed Focal Length
  const signedFocalLengthMm = useMemo(() => {
    return lensType === "convex" ? absFocalLengthMm : -absFocalLengthMm;
  }, [lensType, absFocalLengthMm]);

  // Material Object
  const currentMaterial = useMemo(() => {
    return OPTICAL_MATERIALS.find((m) => m.id === selectedMaterial) || OPTICAL_MATERIALS[0];
  }, [selectedMaterial]);

  // ── High-Precision Gaussian Optics & Lensmaker Calculations ───────────
  const opticsCalculations = useMemo(() => {
    const f = signedFocalLengthMm;
    const doVal = objectDistMm;
    const ho = objectHeightMm;

    // Thin lens formula: 1/f = 1/do + 1/di => di = (f * do) / (do - f)
    let di: number | null = null;
    let mag: number | null = null;
    let hi: number | null = null;
    let isReal = true;
    let isUpright = false;
    let isInfinity = false;

    if (Math.abs(doVal - f) < 1e-4) {
      // Object at focal point -> parallel rays to infinity
      isInfinity = true;
    } else {
      di = (f * doVal) / (doVal - f);
      mag = -di / doVal;
      hi = mag * ho;
      isReal = di > 0;
      isUpright = mag > 0;
    }

    // Optical Power P in Diopters (D = 1/f_meters)
    const powerDiopters = f !== 0 ? 1000 / f : 0;

    // Lensmaker curvature estimate: 1/f = (n - 1) * (2 / R) for symmetric biconvex/biconcave
    const n = currentMaterial.n;
    const radiusCurvatureMm = f !== 0 ? Math.abs(2 * (n - 1) * f) : 100;

    return {
      di,
      mag,
      hi,
      isReal,
      isUpright,
      isInfinity,
      powerDiopters,
      radiusCurvatureMm,
    };
  }, [signedFocalLengthMm, objectDistMm, objectHeightMm, currentMaterial]);

  // Sync AI Chatbot Knowledge
  useEffect(() => {
    setExperimentData({
      title: "Geometric Optics, Thin Lens & Ray Tracing Studio",
      theory: `Gaussian Thin Lens Equation: 1/f = 1/d_o + 1/d_i. Transverse Magnification: M = -d_i / d_o = h_i / h_o. Lensmaker's Formula: 1/f = (n - 1)(1/R₁ - 1/R₂). Optical Power: P = 1/f (Diopters). Three Principal Rays: Parallel Ray (through F₂), Focal Ray (through F₁), Chief Ray (through optical center).`,
      extraContext: `Lens Type = ${lensType}, f = ${signedFocalLengthMm}mm, d_o = ${objectDistMm}mm, h_o = ${objectHeightMm}mm. d_i = ${opticsCalculations.di ? opticsCalculations.di.toFixed(1) : "Infinity"}mm, M = ${opticsCalculations.mag ? opticsCalculations.mag.toFixed(2) : "Infinity"}x (${opticsCalculations.isReal ? "Real, Inverted" : "Virtual, Upright"}), Power = ${opticsCalculations.powerDiopters.toFixed(1)} D.`,
    });
  }, [lensType, signedFocalLengthMm, objectDistMm, objectHeightMm, opticsCalculations, setExperimentData]);

  // Trigger XP Reward on meaningful interaction
  const triggerCompletion = useCallback(() => {
    completeExperiment();
  }, [completeExperiment]);

  // Apply Preset
  const handleApplyPreset = (preset: GuidedPreset) => {
    setLensType(preset.lensType);
    setAbsFocalLengthMm(Math.abs(preset.focalLengthMm));
    setObjectDistMm(preset.objectDistMm);
    setObjectHeightMm(preset.objectHeightMm);
    setSelectedMaterial(preset.materialId);
    triggerCompletion();
  };

  // Reset to default
  const handleReset = () => {
    setLensType("convex");
    setAbsFocalLengthMm(100);
    setObjectDistMm(220);
    setObjectHeightMm(45);
    setSelectedMaterial("crown_glass");
  };

  // ── Render Optical Bench & Ray Tracing Canvas ─────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Deep OLED Darkroom Studio Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, "#030712");
    bgGrad.addColorStop(0.6, "#0b0f19");
    bgGrad.addColorStop(1, "#020617");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Coordinate System: Lens Center is at (lensCenterX, centerY)
    const lensCenterX = w * 0.44;
    const centerY = h * 0.52;
    const scalePxPerMm = 0.82; // 1 mm = 0.82 canvas pixels

    const toScreenX = (mmFromLens: number) => lensCenterX + mmFromLens * scalePxPerMm;
    const toScreenY = (mmFromAxis: number) => centerY - mmFromAxis * scalePxPerMm;

    // 1. Grid Lines & Optical Ruler
    if (showGrid) {
      ctx.strokeStyle = "rgba(56, 189, 248, 0.06)";
      ctx.lineWidth = 1;
      for (let xMm = -400; xMm <= 500; xMm += 20) {
        const sx = toScreenX(xMm);
        if (sx >= 0 && sx <= w) {
          ctx.beginPath();
          ctx.moveTo(sx, 0);
          ctx.lineTo(sx, h);
          ctx.stroke();
        }
      }
      for (let yMm = -100; yMm <= 100; yMm += 20) {
        const sy = toScreenY(yMm);
        if (sy >= 0 && sy <= h) {
          ctx.beginPath();
          ctx.moveTo(0, sy);
          ctx.lineTo(w, sy);
          ctx.stroke();
        }
      }
    }

    // 2. Main Principal Optical Axis
    ctx.strokeStyle = "rgba(148, 163, 184, 0.6)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(w, centerY);
    ctx.stroke();

    // Axis Arrows
    ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
    ctx.beginPath();
    ctx.moveTo(w - 8, centerY - 4);
    ctx.lineTo(w, centerY);
    ctx.lineTo(w - 8, centerY + 4);
    ctx.fill();

    // 3. Focal Points & 2F Cardinal Markers
    const fVal = signedFocalLengthMm;
    const absF = Math.abs(fVal);

    const drawMarker = (mm: number, label: string, color: string = "#38bdf8") => {
      const sx = toScreenX(mm);
      if (sx < 10 || sx > w - 10) return;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sx, centerY - 6);
      ctx.lineTo(sx, centerY + 6);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(sx, centerY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(label, sx, centerY + 16);
      ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
      ctx.fillText(`${Math.abs(mm)}mm`, sx, centerY + 26);
    };

    if (lensType === "convex") {
      drawMarker(-absF, "F₁ (Focus)", "#10b981");
      drawMarker(-2 * absF, "2F₁", "#38bdf8");
      drawMarker(absF, "F₂ (Focus)", "#10b981");
      drawMarker(2 * absF, "2F₂", "#38bdf8");
    } else {
      drawMarker(-absF, "F₂ (Virtual)", "#ef4444");
      drawMarker(-2 * absF, "2F₂", "#f97316");
      drawMarker(absF, "F₁ (Virtual)", "#ef4444");
      drawMarker(2 * absF, "2F₁", "#f97316");
    }

    // 4. Physical Optical Glass Lens Element
    const lensHalfH = 85 * scalePxPerMm;
    const lensThickness = Math.max(12, Math.min(26, (120 / absF) * 16));

    ctx.save();
    ctx.fillStyle = currentMaterial.color;
    ctx.shadowColor = currentMaterial.color;
    ctx.shadowBlur = 10;

    const lensGrad = ctx.createLinearGradient(lensCenterX - lensThickness, 0, lensCenterX + lensThickness, 0);
    lensGrad.addColorStop(0, "rgba(255, 255, 255, 0.15)");
    lensGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.35)");
    lensGrad.addColorStop(1, "rgba(255, 255, 255, 0.15)");
    ctx.fillStyle = lensGrad;
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;

    if (lensType === "convex") {
      // Biconvex Lens Geometry
      ctx.beginPath();
      ctx.moveTo(lensCenterX, centerY - lensHalfH);
      ctx.quadraticCurveTo(lensCenterX + lensThickness, centerY, lensCenterX, centerY + lensHalfH);
      ctx.quadraticCurveTo(lensCenterX - lensThickness, centerY, lensCenterX, centerY - lensHalfH);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // Biconcave Lens Geometry
      ctx.beginPath();
      ctx.moveTo(lensCenterX - lensThickness * 0.8, centerY - lensHalfH);
      ctx.lineTo(lensCenterX + lensThickness * 0.8, centerY - lensHalfH);
      ctx.quadraticCurveTo(lensCenterX + 2, centerY, lensCenterX + lensThickness * 0.8, centerY + lensHalfH);
      ctx.lineTo(lensCenterX - lensThickness * 0.8, centerY + lensHalfH);
      ctx.quadraticCurveTo(lensCenterX - 2, centerY, lensCenterX - lensThickness * 0.8, centerY - lensHalfH);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // Lens Vertical Aperture Plane (Dashed Centerline)
    ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(lensCenterX, centerY - lensHalfH - 15);
    ctx.lineTo(lensCenterX, centerY + lensHalfH + 15);
    ctx.stroke();
    ctx.setLineDash([]);

    // 5. Draggable Illuminated Object (Candle / Luminous Arrow)
    const objX = toScreenX(-objectDistMm);
    const objTipY = toScreenY(objectHeightMm);

    // Object Arrow Stem
    ctx.save();
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(objX, centerY);
    ctx.lineTo(objX, objTipY);
    ctx.stroke();

    // Arrow Head Tip
    ctx.fillStyle = "#f59e0b";
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(objX, objTipY - 8);
    ctx.lineTo(objX - 6, objTipY + 4);
    ctx.lineTo(objX + 6, objTipY + 4);
    ctx.closePath();
    ctx.fill();

    // Candle Glow Flame Icon
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(objX, objTipY - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Object Labels
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("OBJECT", objX, objTipY - 14);
    ctx.fillStyle = "rgba(245, 158, 11, 0.8)";
    ctx.fillText(`hₒ = ${objectHeightMm}mm`, objX, centerY + 16);
    ctx.fillText(`dₒ = ${objectDistMm}mm`, objX, centerY + 28);

    // 6. Principal Ray Tracing Simulation (3 Color-Coded Rays)
    const calc = opticsCalculations;
    const f1X = toScreenX(lensType === "convex" ? -absF : absF);
    const f2X = toScreenX(lensType === "convex" ? absF : -absF);

    // Ray 1: Parallel Ray (P-Ray, #10b981 Emerald)
    if (showParallelRay) {
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#10b981";
      ctx.shadowBlur = 6;

      // Incident ray: Object tip -> Lens at y = ho
      ctx.beginPath();
      ctx.moveTo(objX, objTipY);
      ctx.lineTo(lensCenterX, objTipY);
      ctx.stroke();

      if (lensType === "convex") {
        // Refracted ray: Through F2 (+f) to image
        const slope = (centerY - objTipY) / (toScreenX(absF) - lensCenterX);
        const farX = w;
        const farY = objTipY + slope * (farX - lensCenterX);

        ctx.beginPath();
        ctx.moveTo(lensCenterX, objTipY);
        ctx.lineTo(farX, farY);
        ctx.stroke();

        // Virtual back-projection for virtual image (do < f)
        if (showVirtualExtensions && calc.di !== null && calc.di < 0) {
          const imgX = toScreenX(calc.di);
          const imgY = toScreenY(calc.hi || 0);

          ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(lensCenterX, objTipY);
          ctx.lineTo(imgX, imgY);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      } else {
        // Concave diverging: Appears to diverge from F2 (-f)
        const slope = (objTipY - centerY) / (lensCenterX - toScreenX(-absF));
        const farX = w;
        const farY = objTipY + slope * (farX - lensCenterX);

        ctx.beginPath();
        ctx.moveTo(lensCenterX, objTipY);
        ctx.lineTo(farX, farY);
        ctx.stroke();

        // Virtual back-trace to F2
        if (showVirtualExtensions) {
          ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(lensCenterX, objTipY);
          ctx.lineTo(toScreenX(-absF), centerY);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
      ctx.shadowBlur = 0;
    }

    // Ray 2: Chief Ray (C-Ray, #06b6d4 Cyan - Passes through optical center (0,0))
    if (showChiefRay) {
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#06b6d4";
      ctx.shadowBlur = 6;

      const slope = (centerY - objTipY) / (lensCenterX - objX);
      const farX = w;
      const farY = centerY + slope * (farX - lensCenterX);

      ctx.beginPath();
      ctx.moveTo(objX, objTipY);
      ctx.lineTo(lensCenterX, centerY);
      ctx.lineTo(farX, farY);
      ctx.stroke();

      // Virtual back-projection
      if (showVirtualExtensions && calc.di !== null && calc.di < 0) {
        const imgX = toScreenX(calc.di);
        const imgY = toScreenY(calc.hi || 0);

        ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(lensCenterX, centerY);
        ctx.lineTo(imgX, imgY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.shadowBlur = 0;
    }

    // Ray 3: Focal Ray (F-Ray, #ec4899 Pink/Amber)
    if (showFocalRay && !calc.isInfinity) {
      ctx.strokeStyle = "#ec4899";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#ec4899";
      ctx.shadowBlur = 6;

      if (lensType === "convex" && objectDistMm > absF) {
        // Through F1 (-f) to lens, emerges parallel
        const slope = (centerY - objTipY) / (toScreenX(-absF) - objX);
        const lensY = objTipY + slope * (lensCenterX - objX);
        const imgY = toScreenY(calc.hi || 0);

        ctx.beginPath();
        ctx.moveTo(objX, objTipY);
        ctx.lineTo(lensCenterX, lensY);
        ctx.lineTo(w, lensY);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }

    // 7. Formed Optical Image (Real / Virtual)
    if (!calc.isInfinity && calc.di !== null && calc.hi !== null) {
      const imgX = toScreenX(calc.di);
      const imgTipY = toScreenY(calc.hi);

      ctx.save();
      if (calc.isReal) {
        // Real Inverted Image (Solid Luminous Glow)
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3.5;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(imgX, centerY);
        ctx.lineTo(imgX, imgTipY);
        ctx.stroke();

        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        const arrowDir = calc.hi < 0 ? 1 : -1;
        ctx.moveTo(imgX, imgTipY + arrowDir * 8);
        ctx.lineTo(imgX - 6, imgTipY - arrowDir * 4);
        ctx.lineTo(imgX + 6, imgTipY - arrowDir * 4);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText("REAL IMAGE", imgX, imgTipY + (calc.hi < 0 ? 16 : -12));
      } else {
        // Virtual Upright Image (Luminous Dashed Glow)
        ctx.strokeStyle = "rgba(244, 114, 182, 0.9)";
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 4]);
        ctx.shadowColor = "#f472b6";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(imgX, centerY);
        ctx.lineTo(imgX, imgTipY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#f472b6";
        ctx.beginPath();
        ctx.moveTo(imgX, imgTipY - 8);
        ctx.lineTo(imgX - 6, imgTipY + 4);
        ctx.lineTo(imgX + 6, imgTipY + 4);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#f472b6";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText("VIRTUAL IMAGE", imgX, imgTipY - 14);
      }

      ctx.fillStyle = "rgba(148, 163, 184, 0.85)";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`dᵢ = ${calc.di.toFixed(1)}mm`, imgX, centerY + 16);
      ctx.fillText(`M = ${calc.mag ? calc.mag.toFixed(2) : "0"}x`, imgX, centerY + 26);
      ctx.restore();
    } else if (calc.isInfinity) {
      // Image at Infinity Banner
      ctx.fillStyle = "rgba(234, 179, 8, 0.9)";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText("PARALLEL RAYS — IMAGE AT INFINITY (dₒ = f)", w * 0.75, centerY - 40);
    }
  }, [
    lensType,
    signedFocalLengthMm,
    objectDistMm,
    objectHeightMm,
    currentMaterial,
    showParallelRay,
    showFocalRay,
    showChiefRay,
    showVirtualExtensions,
    showGrid,
    opticsCalculations,
  ]);

  // ── Render Conjugate Curve Graph (di vs do) ───────────────────────────
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padLeft = 55;
    const padRight = 25;
    const padTop = 18;
    const padBottom = 26;
    const graphW = w - padLeft - padRight;
    const graphH = h - padTop - padBottom;

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, "#040813");
    bgGrad.addColorStop(1, "#020409");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(padLeft, padTop, graphW, graphH);

    // Grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let x = padLeft; x <= padLeft + graphW; x += graphW / 6) {
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

    const f = signedFocalLengthMm;
    const maxDo = 450;
    const maxDi = 450;
    const minDi = -300;

    // Y-Axis Ticks (Image Distance di)
    ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const val = minDi + (1 - i / 4) * (maxDi - minDi);
      const y = padTop + (i / 4) * graphH;
      ctx.fillText(`${val.toFixed(0)}mm`, padLeft - 6, y + 3);
    }

    // X-Axis Ticks (Object Distance do)
    ctx.textAlign = "center";
    for (let i = 0; i <= 4; i++) {
      const val = (i / 4) * maxDo;
      const x = padLeft + (i / 4) * graphW;
      ctx.fillText(`${val.toFixed(0)}mm`, x, h - 8);
    }

    // Zero-Line for di = 0
    const zeroY = padTop + ((maxDi - 0) / (maxDi - minDi)) * graphH;
    ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padLeft, zeroY);
    ctx.lineTo(padLeft + graphW, zeroY);
    ctx.stroke();

    // Asymptote at do = f (for convex lens)
    if (lensType === "convex") {
      const asymX = padLeft + (absFocalLengthMm / maxDo) * graphW;
      ctx.strokeStyle = "rgba(239, 68, 68, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(asymX, padTop);
      ctx.lineTo(asymX, padTop + graphH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 8px monospace";
      ctx.fillText("dₒ = f (Asymptote)", asymX + 4, padTop + 12);
    }

    // Plot di = (f * do) / (do - f) curve
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.2;
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 6;
    ctx.beginPath();

    let started = false;
    for (let doVal = 5; doVal <= maxDo; doVal += 2) {
      if (Math.abs(doVal - f) < 4) {
        started = false;
        continue;
      }
      const diVal = (f * doVal) / (doVal - f);
      if (diVal < minDi || diVal > maxDi) {
        started = false;
        continue;
      }

      const x = padLeft + (doVal / maxDo) * graphW;
      const y = padTop + ((maxDi - diVal) / (maxDi - minDi)) * graphH;

      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Current Operating Point Dot
    if (opticsCalculations.di !== null) {
      const curX = padLeft + (objectDistMm / maxDo) * graphW;
      const curY = padTop + ((maxDi - opticsCalculations.di) / (maxDi - minDi)) * graphH;

      if (curY >= padTop && curY <= padTop + graphH && curX >= padLeft && curX <= padLeft + graphW) {
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(curX, curY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }, [signedFocalLengthMm, absFocalLengthMm, lensType, objectDistMm, opticsCalculations]);

  // Export CSV
  const handleExportCSV = () => {
    const calc = opticsCalculations;
    const rows = [
      ["Parameter", "Value", "Unit"],
      ["Lens Type", lensType, ""],
      ["Focal Length (f)", signedFocalLengthMm.toString(), "mm"],
      ["Object Distance (do)", objectDistMm.toString(), "mm"],
      ["Object Height (ho)", objectHeightMm.toString(), "mm"],
      ["Image Distance (di)", calc.di ? calc.di.toFixed(2) : "Infinity", "mm"],
      ["Magnification (M)", calc.mag ? calc.mag.toFixed(3) : "Infinity", ""],
      ["Image Height (hi)", calc.hi ? calc.hi.toFixed(2) : "Infinity", "mm"],
      ["Image Nature", calc.isReal ? "Real, Inverted" : "Virtual, Upright", ""],
      ["Optical Power (P)", calc.powerDiopters.toFixed(2), "Diopters (D)"],
      ["Glass Refractive Index (n)", currentMaterial.n.toString(), ""],
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lens_optics_telemetry_${Date.now()}.csv`);
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
              <Eye size={22} />
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
              Geometric Optics, Thin Lens & Ray Tracing Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-mono font-bold">
              Gaussian Optics & Lensmaker Formulations
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Convex & concave thin lenses, 3 principal ray paths (P-Ray, F-Ray, Chief Ray), virtual back-tracing, and conjugate image formations.
          </p>
        </div>

        {/* Primary Simulation Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
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
            title="Export Optics CSV"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace: Central Stage (Left 7 cols) + Control Deck (Right 5 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Optical Bench Canvas + Conjugate Curve (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Main Ray Tracing Stage */}
          <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
            {/* Top Floating Badges */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/10 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-xs" />
                <span>f = {signedFocalLengthMm} mm</span>
                <span className="text-muted-foreground font-mono text-[11px]">({lensType})</span>
              </span>

              <span className={`px-2.5 py-1 backdrop-blur-md rounded-full text-[10px] font-mono font-black border uppercase ${
                opticsCalculations.isReal
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/30"
                  : "bg-pink-950/80 text-pink-300 border-pink-500/30"
              }`}>
                {opticsCalculations.isInfinity ? "Image at Infinity" : opticsCalculations.isReal ? "Real Image" : "Virtual Image"}
              </span>
            </div>

            {/* Overlays Ray Toggles */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setShowParallelRay(!showParallelRay)}
                className={`px-2 py-0.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                  showParallelRay ? "bg-emerald-500 text-black font-black" : "text-white/60 hover:text-white"
                }`}
                title="Parallel Ray (P-Ray)"
              >
                P-Ray
              </button>
              <button
                type="button"
                onClick={() => setShowChiefRay(!showChiefRay)}
                className={`px-2 py-0.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                  showChiefRay ? "bg-cyan-500 text-black font-black" : "text-white/60 hover:text-white"
                }`}
                title="Chief Ray (C-Ray)"
              >
                C-Ray
              </button>
              <button
                type="button"
                onClick={() => setShowFocalRay(!showFocalRay)}
                className={`px-2 py-0.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                  showFocalRay ? "bg-pink-500 text-black font-black" : "text-white/60 hover:text-white"
                }`}
                title="Focal Ray (F-Ray)"
              >
                F-Ray
              </button>
            </div>

            {/* Main Interactive Canvas */}
            <canvas
              ref={canvasRef}
              width={720}
              height={300}
              className="w-full h-[240px] sm:h-[290px] block cursor-grab active:cursor-grabbing"
            />
          </div>

          {/* Real-Time Conjugate Graph (di vs do) */}
          <div className="bg-card border border-border rounded-3xl p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-primary" />
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
                  Conjugate Image Curve: Image Distance (dᵢ) vs Object Distance (dₒ)
                </h3>
              </div>

              <span className="text-[11px] font-mono text-muted-foreground font-bold">
                1/f = 1/dₒ + 1/dᵢ
              </span>
            </div>

            <canvas
              ref={graphCanvasRef}
              width={720}
              height={140}
              className="w-full h-[140px] rounded-2xl block border border-border"
            />
          </div>
        </div>

        {/* Right Column: Multi-Tab Console + Live Telemetry Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-card border border-border rounded-3xl p-5 shadow-xs space-y-4">
            {/* Console Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-border">
              {[
                { id: "controls", label: "Optics & Lens", icon: Sliders },
                { id: "lensmaker", label: "Lensmaker & Glass", icon: Sparkles },
                { id: "presets", label: "Guided Presets", icon: Layers },
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

            {/* ── TAB 1: OPTICS & LENS ── */}
            {activeConsoleTab === "controls" && (
              <div className="space-y-4">
                {/* Lens Type Switcher */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-muted-foreground">Lens Curvature Type:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "convex", label: "Convex (Converging)", sub: "f > 0, Real/Virtual" },
                      { id: "concave", label: "Concave (Diverging)", sub: "f < 0, Virtual Only" },
                    ].map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => {
                          setLensType(l.id as LensType);
                          triggerCompletion();
                        }}
                        className={`p-2.5 rounded-2xl border text-left transition space-y-0.5 cursor-pointer ${
                          lensType === l.id
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                            : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="text-xs font-black">{l.label}</div>
                        <div className="text-[10px] text-muted-foreground">{l.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Focal Length f Slider + Numeric Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Focal Length (|f|):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="40"
                        max="250"
                        step="5"
                        value={absFocalLengthMm}
                        onChange={(e) => setAbsFocalLengthMm(Math.min(250, Math.max(40, Number(e.target.value) || 40)))}
                        className="w-18 px-2 py-0.5 rounded-lg bg-muted border border-border text-sky-400 font-mono font-black text-right text-xs focus:border-sky-400 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">mm</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="220"
                    step="5"
                    value={absFocalLengthMm}
                    onChange={(e) => setAbsFocalLengthMm(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                    <span>50mm (Short)</span>
                    <span>100mm (Standard)</span>
                    <span>220mm (Long)</span>
                  </div>
                </div>

                {/* Object Distance do Slider + Numeric Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Object Distance (dₒ):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="20"
                        max="500"
                        step="5"
                        value={objectDistMm}
                        onChange={(e) => setObjectDistMm(Math.min(500, Math.max(20, Number(e.target.value) || 20)))}
                        className="w-18 px-2 py-0.5 rounded-lg bg-muted border border-border text-amber-500 font-mono font-black text-right text-xs focus:border-amber-500 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">mm</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="450"
                    step="5"
                    value={objectDistMm}
                    onChange={(e) => setObjectDistMm(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                    <span>Inside F (&lt;100mm)</span>
                    <span>At 2F (200mm)</span>
                    <span>Far (&gt;350mm)</span>
                  </div>
                </div>

                {/* Object Height ho Slider + Numeric Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Object Height (hₒ):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="10"
                        max="80"
                        step="2"
                        value={objectHeightMm}
                        onChange={(e) => setObjectHeightMm(Math.min(80, Math.max(10, Number(e.target.value) || 10)))}
                        className="w-18 px-2 py-0.5 rounded-lg bg-muted border border-border text-emerald-400 font-mono font-black text-right text-xs focus:border-emerald-400 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">mm</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="75"
                    step="2"
                    value={objectHeightMm}
                    onChange={(e) => setObjectHeightMm(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* ── TAB 2: LENSMAKER & GLASS ── */}
            {activeConsoleTab === "lensmaker" && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-muted-foreground">Optical Medium & Refractive Index (n):</span>
                <div className="grid grid-cols-2 gap-2">
                  {OPTICAL_MATERIALS.map((mat) => (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => {
                        setSelectedMaterial(mat.id);
                        triggerCompletion();
                      }}
                      className={`p-2.5 rounded-2xl border text-left transition space-y-0.5 cursor-pointer ${
                        selectedMaterial === mat.id
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                          : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black">{mat.name}</span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-primary/15 text-primary">
                          n = {mat.n}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">{mat.tag}</div>
                    </button>
                  ))}
                </div>

                {/* Lensmaker Formula Box */}
                <div className="p-3 bg-muted/50 rounded-2xl border border-border space-y-2 text-xs">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Sparkle size={13} className="text-primary" />
                    <span>Lensmaker's Equation:</span>
                  </span>
                  <div className="font-mono text-[11px] text-primary bg-background/80 p-2 rounded-xl border border-border">
                    1/f = (n - 1) · [1/R₁ - 1/R₂]
                  </div>
                  <div className="text-[11px] text-muted-foreground space-y-1">
                    <div>
                      Radius of Curvature: <span className="text-foreground font-mono font-bold">R ≈ {opticsCalculations.radiusCurvatureMm.toFixed(1)} mm</span>
                    </div>
                    <div>
                      Refractive Power: <span className="text-foreground font-mono font-bold">P = {opticsCalculations.powerDiopters.toFixed(2)} Diopters</span>
                    </div>
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
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Image Dist (dᵢ)</span>
              <div className="text-base sm:text-lg font-black font-mono text-sky-400 mt-0.5">
                {opticsCalculations.di !== null ? (
                  <>
                    {opticsCalculations.di.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">mm</span>
                  </>
                ) : (
                  "∞"
                )}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Magnification (M)</span>
              <div className="text-base sm:text-lg font-black font-mono text-emerald-400 mt-0.5">
                {opticsCalculations.mag !== null ? (
                  <>
                    {opticsCalculations.mag.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">x</span>
                  </>
                ) : (
                  "∞"
                )}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Image Height (hᵢ)</span>
              <div className="text-base sm:text-lg font-black font-mono text-amber-400 mt-0.5">
                {opticsCalculations.hi !== null ? (
                  <>
                    {opticsCalculations.hi.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">mm</span>
                  </>
                ) : (
                  "∞"
                )}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Power (P)</span>
              <div className="text-base sm:text-lg font-black font-mono text-pink-400 mt-0.5">
                {opticsCalculations.powerDiopters.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">D</span>
              </div>
            </div>
          </div>

          {/* Daily Challenge Card */}
          <DailyChallengeCard
            labId="physics/opticslens"
            currentParams={{
              focalLength: signedFocalLengthMm,
              objectDistance: objectDistMm,
              imageDistance: opticsCalculations.di || 0,
              magnification: opticsCalculations.mag || 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}
