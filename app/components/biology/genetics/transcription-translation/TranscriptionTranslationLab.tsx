"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  transcribeDNAtoMRNA,
  translateMRNAtoProtein,
  applyFrameshiftInsert,
  applyFrameshiftDelete,
  CODON_TABLE,
} from "../lib/geneticsEngines";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import {
  Dna,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2,
  RotateCcw,
  Lightbulb,
  Play,
  Pause,
  ArrowRight,
  Zap,
  BookOpen,
  FastForward,
  Plus,
  Trash2,
  Target,
} from "lucide-react";

// Molecular Base Palette
const BASE_COLORS: Record<string, { bg: string; text: string; stroke: string; comp: string; purine: boolean; name: string }> = {
  A: { bg: "#3b82f6", text: "#ffffff", stroke: "#1d4ed8", comp: "T", purine: true, name: "Adenine" },
  T: { bg: "#f43f5e", text: "#ffffff", stroke: "#be123c", comp: "A", purine: false, name: "Thymine" },
  C: { bg: "#f59e0b", text: "#ffffff", stroke: "#b45309", comp: "G", purine: false, name: "Cytosine" },
  G: { bg: "#10b981", text: "#ffffff", stroke: "#047857", comp: "C", purine: true, name: "Guanine" },
  U: { bg: "#8b5cf6", text: "#ffffff", stroke: "#6d28d9", comp: "A", purine: false, name: "Uracil" },
};

export default function TranscriptionTranslationLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "biology/genetics/transcription-translation",
    "biology",
    "simulation"
  );

  const initialDna = "TACCGCTTCGACTGA";
  const [dnaSequence, setDnaSequence] = useState<string>(initialDna);
  const [originalDna] = useState<string>(initialDna);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Promoter Targeting State
  const [isPromoterDocked, setIsPromoterDocked] = useState<boolean>(false);
  const [dockingFailedIndex, setDockingFailedIndex] = useState<number | null>(null);

  // Free-position edit state
  const [selectedBaseIndex, setSelectedBaseIndex] = useState<number | null>(null);

  // Synthesis Playback State
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeedMs, setPlaybackSpeedMs] = useState<number>(600);

  // Smooth interpolated animation trackers
  const smoothPolXRef = useRef<number>(90);
  const smoothRiboXRef = useRef<number>(90);

  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Quick Quiz
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  // Transcribe & Translate active sequence
  const mrnaSequence = useMemo(() => transcribeDNAtoMRNA(dnaSequence), [dnaSequence]);
  const proteinData = useMemo(() => translateMRNAtoProtein(mrnaSequence), [mrnaSequence]);

  // Transcribe & Translate wild-type reference sequence for ghost track
  const originalMrna = useMemo(() => transcribeDNAtoMRNA(originalDna), [originalDna]);
  const originalProtein = useMemo(() => translateMRNAtoProtein(originalMrna), [originalMrna]);

  // AI Chat registration
  useEffect(() => {
    setExperimentData({
      title: "DNA Transcription & Translation Molecular Studio",
      theory: "Kinetic molecular simulation: 3D double-helix ribbons, unzipping bubble, RNA Polymerase II elongation, tRNA A-site docking, peptide bond synthesis, and ribosomal translocation.",
      extraContext: { dnaSequence, isPromoterDocked, aminoAcids: (proteinData?.aminoAcids || []).map((a) => a.abbr).join("-") },
    });
  }, [dnaSequence, isPromoterDocked, proteinData, setExperimentData]);

  // Synthesis Step Progression Loop
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setTimeout(() => {
        if (currentStepIndex < dnaSequence.length) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          completeExperiment();
        }
      }, playbackSpeedMs);
    }
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, currentStepIndex, dnaSequence.length, playbackSpeedMs, completeExperiment]);

  // High-Fidelity 60FPS 3D Molecular Simulation Loop
  useEffect(() => {
    let animId: number;
    let startTime = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = (now: number) => {
      const time = (now - startTime) / 1000;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Deep dark molecular viewport background with subtle grid
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // DNA Geometry Constants
      const numBases = dnaSequence.length;
      const startX = 80;
      const endX = width - 80;
      const baseSpacing = (endX - startX) / Math.max(1, numBases - 1);
      const dnaCenterY = 95;
      const riboCenterY = 280;

      const targetPolX = startX + currentStepIndex * baseSpacing;
      smoothPolXRef.current += (targetPolX - smoothPolXRef.current) * 0.12;
      const curPolX = smoothPolXRef.current;

      const activeCodon = Math.floor(currentStepIndex / 3);
      const targetRiboX = startX + activeCodon * 3 * baseSpacing + baseSpacing;
      smoothRiboXRef.current += (targetRiboX - smoothRiboXRef.current) * 0.1;
      const curRiboX = smoothRiboXRef.current;

      const helixRadius = 32;
      const pitch = 0.48; // Twist frequency
      const minorGrooveOffset = 2.4; // Major vs minor groove angle

      // ─── 1. COMPUTE CONTINUOUS 3D RIBBON BACKBONES ──────────
      const numSamples = 320;
      const ribbon1: { x: number; y: number; z: number }[] = [];
      const ribbon2: { x: number; y: number; z: number }[] = [];

      for (let s = 0; s <= numSamples; s++) {
        const x = startX - 40 + (s / numSamples) * (endX - startX + 80);
        const theta = (s / numSamples) * (numBases * pitch) + time * 0.8;

        // Bubble expansion factor
        const distToPol = Math.abs(x - curPolX);
        const inBubble = isPromoterDocked && distToPol < 75;
        const bubbleExpand = inBubble ? Math.max(0, (1 - distToPol / 75) * 50) : 0;

        // Strand 1 (Coding 5'-3')
        const y1 = dnaCenterY - Math.sin(theta) * (helixRadius + bubbleExpand);
        const z1 = Math.cos(theta) * (helixRadius + bubbleExpand);

        // Strand 2 (Template 3'-5')
        const y2 = dnaCenterY - Math.sin(theta + minorGrooveOffset) * (helixRadius + bubbleExpand);
        const z2 = Math.cos(theta + minorGrooveOffset) * (helixRadius + bubbleExpand);

        ribbon1.push({ x, y: y1, z: z1 });
        ribbon2.push({ x, y: y2, z: z2 });
      }

      // ─── 2. DRAW BACK RIBBON STRANDS (Z < 0) ─────────────────
      ctx.save();
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Strand 1 Back
      ctx.strokeStyle = "rgba(30, 58, 138, 0.7)";
      ctx.beginPath();
      for (let s = 0; s < ribbon1.length; s++) {
        if (ribbon1[s].z <= 0) {
          if (s === 0 || ribbon1[s - 1].z > 0) ctx.moveTo(ribbon1[s].x, ribbon1[s].y);
          else ctx.lineTo(ribbon1[s].x, ribbon1[s].y);
        }
      }
      ctx.stroke();

      // Strand 2 Back
      ctx.strokeStyle = "rgba(67, 56, 202, 0.7)";
      ctx.beginPath();
      for (let s = 0; s < ribbon2.length; s++) {
        if (ribbon2[s].z <= 0) {
          if (s === 0 || ribbon2[s - 1].z > 0) ctx.moveTo(ribbon2[s].x, ribbon2[s].y);
          else ctx.lineTo(ribbon2[s].x, ribbon2[s].y);
        }
      }
      ctx.stroke();
      ctx.restore();

      // ─── 3. DRAW BASE PAIR PLATES & HYDROGEN BONDS ───────────
      for (let i = 0; i < numBases; i++) {
        const x = startX + i * baseSpacing;
        const theta = i * pitch + time * 0.8;

        const distToPol = Math.abs(x - curPolX);
        const inBubble = isPromoterDocked && distToPol < 75;
        const bubbleExpand = inBubble ? Math.max(0, (1 - distToPol / 75) * 50) : 0;

        const y1 = dnaCenterY - Math.sin(theta) * (helixRadius + bubbleExpand);
        const z1 = Math.cos(theta) * (helixRadius + bubbleExpand);

        const y2 = dnaCenterY - Math.sin(theta + minorGrooveOffset) * (helixRadius + bubbleExpand);
        const z2 = Math.cos(theta + minorGrooveOffset) * (helixRadius + bubbleExpand);

        const templateBase = dnaSequence[i] || "A";
        const codingBase = BASE_COLORS[templateBase]?.comp || "T";

        const col1 = BASE_COLORS[codingBase]?.bg || "#3b82f6";
        const col2 = BASE_COLORS[templateBase]?.bg || "#f59e0b";
        const isSelected = selectedBaseIndex === i;

        if (!inBubble) {
          // Connected Base Pair Plates meeting at center
          const midY = (y1 + y2) / 2;

          // Plate 1 (Coding)
          ctx.fillStyle = col1;
          ctx.beginPath();
          ctx.moveTo(x - 5, y1);
          ctx.lineTo(x + 5, y1);
          ctx.lineTo(x + 3, midY - 2);
          ctx.lineTo(x - 3, midY - 2);
          ctx.closePath();
          ctx.fill();

          // Plate 2 (Template)
          ctx.fillStyle = col2;
          ctx.beginPath();
          ctx.moveTo(x - 3, midY + 2);
          ctx.lineTo(x + 3, midY + 2);
          ctx.lineTo(x + 5, y2);
          ctx.lineTo(x - 5, y2);
          ctx.closePath();
          ctx.fill();

          // Hydrogen Bonds (2 for A=T, 3 for G≡C)
          const isGC = (templateBase === "G" && codingBase === "C") || (templateBase === "C" && codingBase === "G");
          const numBonds = isGC ? 3 : 2;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
          ctx.lineWidth = 1.5;
          for (let b = 0; b < numBonds; b++) {
            const bx = x - (numBonds - 1) * 2 + b * 4;
            ctx.beginPath();
            ctx.moveTo(bx, midY - 2);
            ctx.lineTo(bx, midY + 2);
            ctx.stroke();
          }
        } else {
          // Unzipped / Separated Bases in Bubble
          ctx.fillStyle = col1;
          ctx.beginPath();
          ctx.arc(x, y1, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = col2;
          ctx.beginPath();
          ctx.arc(x, y2, isSelected ? 11 : 9, 0, Math.PI * 2);
          ctx.fill();

          if (isSelected) {
            ctx.strokeStyle = "#f43f5e";
            ctx.lineWidth = 2.5;
            ctx.stroke();
          }
        }

        // Base Labels on Strand Nodes
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(codingBase, x, y1);
        ctx.fillText(templateBase, x, y2);
      }

      // ─── 4. DRAW FRONT RIBBON STRANDS (Z > 0) WITH GLOW ─────
      ctx.save();
      ctx.lineWidth = 7.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Strand 1 Front (Cyan/Blue Ribbon)
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 10;
      ctx.strokeStyle = "#38bdf8";
      ctx.beginPath();
      for (let s = 0; s < ribbon1.length; s++) {
        if (ribbon1[s].z > 0) {
          if (s === 0 || ribbon1[s - 1].z <= 0) ctx.moveTo(ribbon1[s].x, ribbon1[s].y);
          else ctx.lineTo(ribbon1[s].x, ribbon1[s].y);
        }
      }
      ctx.stroke();

      // Strand 2 Front (Indigo/Purple Ribbon)
      ctx.shadowColor = "#818cf8";
      ctx.shadowBlur = 10;
      ctx.strokeStyle = "#818cf8";
      ctx.beginPath();
      for (let s = 0; s < ribbon2.length; s++) {
        if (ribbon2[s].z > 0) {
          if (s === 0 || ribbon2[s - 1].z <= 0) ctx.moveTo(ribbon2[s].x, ribbon2[s].y);
          else ctx.lineTo(ribbon2[s].x, ribbon2[s].y);
        }
      }
      ctx.stroke();
      ctx.restore();

      // ─── 5. RNA POLYMERASE II MOLECULAR MACHINE ──────────────
      if (isPromoterDocked) {
        ctx.save();
        ctx.translate(curPolX, dnaCenterY);

        // Multi-Lobed Protein Surface
        const polGrad = ctx.createRadialGradient(-10, -10, 8, 0, 0, 56);
        polGrad.addColorStop(0, "#34d399");
        polGrad.addColorStop(0.5, "#059669");
        polGrad.addColorStop(1, "#064e3b");

        ctx.fillStyle = polGrad;
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = 18;

        // Core Subunit Body
        ctx.beginPath();
        ctx.ellipse(0, 0, 56, 42, 0, 0, Math.PI * 2);
        ctx.fill();

        // Secondary Jaw Subunit
        ctx.beginPath();
        ctx.ellipse(-24, -16, 26, 20, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Catalytic Center (Mg2+ Ions)
        ctx.fillStyle = "#a7f3d0";
        ctx.beginPath();
        ctx.arc(0, 6, 6, 0, Math.PI * 2);
        ctx.fill();

        // Labels
        ctx.fillStyle = "#ffffff";
        ctx.font = "black 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("RNA POLYMERASE II", 0, -8);

        ctx.fillStyle = "#a7f3d0";
        ctx.font = "bold 7px monospace";
        ctx.fillText("Mg²⁺ Active Site", 0, 16);
        ctx.restore();

        // Flying Incoming Nucleotide on elongation step
        if (currentStepIndex < mrnaSequence.length && isPlaying) {
          const incomingBase = mrnaSequence[currentStepIndex];
          const flyProg = (time * 2.5) % 1;
          const flyX = curPolX + (1 - flyProg) * 45;
          const flyY = dnaCenterY + 60 - flyProg * 50;
          const col = BASE_COLORS[incomingBase]?.bg || "#8b5cf6";

          ctx.save();
          ctx.fillStyle = col;
          ctx.shadowColor = col;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(flyX, flyY, 9, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 10px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(incomingBase, flyX, flyY);
          ctx.restore();
        }
      }

      // ─── 6. THREADING mRNA RIBBON INTO RIBOSOME ──────────────
      if (currentStepIndex > 0) {
        ctx.save();
        ctx.strokeStyle = "#ec4899";
        ctx.lineWidth = 4;
        ctx.shadowColor = "#ec4899";
        ctx.shadowBlur = 8;
        ctx.lineCap = "round";

        ctx.beginPath();
        for (let m = 0; m < Math.min(currentStepIndex, mrnaSequence.length); m++) {
          const mx = startX + m * baseSpacing;
          const my =
            dnaCenterY +
            30 +
            Math.sin((m / numBases) * Math.PI) * 14 +
            (m / numBases) * (riboCenterY - dnaCenterY - 30);

          if (m === 0) ctx.moveTo(mx, my);
          else ctx.lineTo(mx, my);
        }
        ctx.stroke();

        // mRNA Base Spheres
        for (let m = 0; m < Math.min(currentStepIndex, mrnaSequence.length); m++) {
          const mx = startX + m * baseSpacing;
          const my =
            dnaCenterY +
            30 +
            Math.sin((m / numBases) * Math.PI) * 14 +
            (m / numBases) * (riboCenterY - dnaCenterY - 30);
          const mBase = mrnaSequence[m];
          const col = BASE_COLORS[mBase]?.bg || "#8b5cf6";

          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(mx, my, 7.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 8px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(mBase, mx, my);
        }
        ctx.restore();
      }

      // ─── 7. 3D RIBOSOME TRANSLATION MACHINERY (70S) ─────────
      if (currentStepIndex >= 3) {
        ctx.save();
        ctx.translate(curRiboX, riboCenterY);

        // 50S Large Subunit (Upper Crown)
        const largeGrad = ctx.createRadialGradient(0, -32, 10, 0, -32, 70);
        largeGrad.addColorStop(0, "#818cf8");
        largeGrad.addColorStop(0.6, "#4f46e5");
        largeGrad.addColorStop(1, "#312e81");

        ctx.fillStyle = largeGrad;
        ctx.shadowColor = "#4f46e5";
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.ellipse(0, -32, 64, 38, 0, Math.PI, 0); // Upper Dome
        ctx.fill();

        // 30S Small Subunit (Lower Clamping Base)
        const smallGrad = ctx.createRadialGradient(0, 20, 8, 0, 20, 55);
        smallGrad.addColorStop(0, "#a5b4fc");
        smallGrad.addColorStop(0.6, "#6366f1");
        smallGrad.addColorStop(1, "#3730a3");

        ctx.fillStyle = smallGrad;
        ctx.beginPath();
        ctx.ellipse(0, 18, 54, 22, 0, 0, Math.PI); // Lower Base
        ctx.fill();

        // Active Chamber Site Labels (E, P, A)
        ctx.fillStyle = "#e0e7ff";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("E", -28, -24);
        ctx.fillText("P", 0, -24);
        ctx.fillText("A", 28, -24);

        // Active tRNA Molecule in A-Site
        const activeAa = proteinData?.aminoAcids?.[activeCodon];
        if (activeAa) {
          ctx.save();
          ctx.translate(26, -14);

          // Cloverleaf / L-Shaped tRNA Stem
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, 14);
          ctx.lineTo(0, -12);
          ctx.lineTo(10, -22);
          ctx.stroke();

          // Amino Acid Sphere
          ctx.fillStyle = activeAa.color || "#10b981";
          ctx.shadowColor = activeAa.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(10, -24, 10, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 8px monospace";
          ctx.fillText(activeAa.abbr, 10, -22);
          ctx.restore();
        }

        ctx.restore();

        // ─── 8. TRAILING POLYPEPTIDE CHAIN ─────────────────────
        ctx.save();
        const translatedCount = Math.min(activeCodon, proteinData?.aminoAcids?.length ?? 0);
        for (let a = 0; a < translatedCount; a++) {
          const aa = proteinData.aminoAcids[a];
          const ax = curRiboX - 45 - a * 24;
          const ay = riboCenterY - 50 - Math.sin(time * 2 + a) * 10;

          if (a > 0) {
            const prevAx = curRiboX - 45 - (a - 1) * 24;
            const prevAy = riboCenterY - 50 - Math.sin(time * 2 + (a - 1)) * 10;
            ctx.strokeStyle = "#10b981";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(prevAx, prevAy);
            ctx.lineTo(ax, ay);
            ctx.stroke();
          }

          ctx.fillStyle = aa.color || "#10b981";
          ctx.shadowColor = aa.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(ax, ay, 9, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 8px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(aa.abbr, ax, ay);
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [dnaSequence, isPromoterDocked, currentStepIndex, isPlaying, mrnaSequence, proteinData, selectedBaseIndex]);

  // Click on Canvas to select DNA nucleotide base
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    const numBases = dnaSequence.length;
    const startX = 80;
    const endX = canvas.width - 80;
    const baseSpacing = (endX - startX) / Math.max(1, numBases - 1);

    let closestIdx = 0;
    let minDistance = 9999;

    for (let i = 0; i < numBases; i++) {
      const x = startX + i * baseSpacing;
      const d = Math.abs(clickX - x);
      if (d < minDistance) {
        minDistance = d;
        closestIdx = i;
      }
    }

    if (minDistance < 28) {
      setSelectedBaseIndex(closestIdx);
    }
  };

  const handlePromoterClick = (isTruePromoter: boolean, index: number) => {
    if (isTruePromoter) {
      setIsPromoterDocked(true);
      setDockingFailedIndex(null);
      setCurrentStepIndex(0);
    } else {
      setDockingFailedIndex(index);
      setTimeout(() => setDockingFailedIndex(null), 900);
    }
  };

  const handleInsertBase = (base: string) => {
    if (selectedBaseIndex === null) return;
    const updated = applyFrameshiftInsert(dnaSequence, selectedBaseIndex, base);
    setDnaSequence(updated);
    setSelectedBaseIndex(null);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleDeleteBase = () => {
    if (selectedBaseIndex === null) return;
    const updated = applyFrameshiftDelete(dnaSequence, selectedBaseIndex);
    setDnaSequence(updated);
    setSelectedBaseIndex(null);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* Top Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0">
            <Dna size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                3D DNA Double-Helix &amp; Central Dogma Molecular Studio
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Molecular Biology Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Continuous 3D twisting ribbon backbones, purine/pyrimidine base plates, RNA Polymerase elongation, and 70S ribosome translation
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Promoter Targeting Box with Approach-and-Recoil Physics */}
      <div className="p-4 bg-card border border-border rounded-3xl space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-foreground">
              Step 1: RNA Polymerase Promoter Targeting (Click True TATA Box to Dock)
            </span>
          </div>

          <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
            isPromoterDocked
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
          }`}>
            {isPromoterDocked ? "RNA Polymerase Bound to DNA" : "Awaiting Promoter Docking"}
          </span>
        </div>

        {/* 3 Promoter Candidate Regions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          {[
            { seq: "TATAAA", isTrue: true, label: "TATA Box (Consensus Promoter)" },
            { seq: "TATGAA", isTrue: false, label: "Decoy Region 1" },
            { seq: "TAGAAA", isTrue: false, label: "Decoy Region 2" },
          ].map((cand, idx) => {
            const isFailed = dockingFailedIndex === idx;
            const isDockedHere = isPromoterDocked && cand.isTrue;

            return (
              <button
                key={idx}
                onClick={() => handlePromoterClick(cand.isTrue, idx)}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 relative overflow-hidden ${
                  isDockedHere
                    ? "bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/50 shadow-md scale-102"
                    : isFailed
                    ? "bg-rose-500/20 border-rose-500 animate-shake"
                    : "bg-muted/40 hover:bg-accent border-border"
                }`}
              >
                <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold">{cand.label}</span>
                <span className="text-base font-black tracking-widest text-foreground">{cand.seq}</span>
                <span className="text-[9px] text-primary font-bold font-sans">
                  {isDockedHere ? "Enzyme Bound & Active" : isFailed ? "Failed to Dock (Recoil)" : "Click to Dock Enzyme"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Synthesis Playback Controller */}
      <div className="p-4 bg-card border border-border rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!isPromoterDocked) return;
              if (currentStepIndex >= dnaSequence.length) setCurrentStepIndex(0);
              setIsPlaying(!isPlaying);
            }}
            disabled={!isPromoterDocked}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50 shrink-0"
          >
            {isPlaying ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current" />}
            <span>{isPlaying ? "Pause Synthesis" : currentStepIndex >= dnaSequence.length ? "Replay Synthesis" : "Run Molecular Synthesis"}</span>
          </button>

          <button
            onClick={() => {
              if (!isPromoterDocked || isPlaying || currentStepIndex >= dnaSequence.length) return;
              setCurrentStepIndex((prev) => prev + 1);
            }}
            disabled={!isPromoterDocked || isPlaying || currentStepIndex >= dnaSequence.length}
            className="px-3 py-2 bg-card hover:bg-accent border border-border rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all text-muted-foreground hover:text-foreground disabled:opacity-40 shrink-0"
          >
            <FastForward size={14} />
            <span>Step +1</span>
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(0);
            }}
            className="px-3 py-2 bg-card hover:bg-accent border border-border rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all text-muted-foreground hover:text-foreground shrink-0"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>

        {/* Speed Slider & Progress */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-sans font-bold">Speed:</span>
            <input
              type="range"
              min="200"
              max="1000"
              step="100"
              value={1200 - playbackSpeedMs}
              onChange={(e) => setPlaybackSpeedMs(1200 - parseInt(e.target.value, 10))}
              className="w-24 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="px-3 py-1 bg-muted/40 border border-border rounded-xl font-bold">
            Synthesized: {Math.min(currentStepIndex, mrnaSequence.length)} / {dnaSequence.length} Bases
          </div>
        </div>
      </div>

      {/* High-Fidelity 3D Canvas Molecular Simulation Stage */}
      <div className="bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4 select-none">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Dna size={18} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              3D Molecular Simulation: Double-Helix Ribbons &amp; 70S Ribosome
            </span>
          </div>

          <span className="text-xs font-mono font-bold text-muted-foreground">
            Click any template nucleotide base along DNA to mutate
          </span>
        </div>

        {/* Interactive 3D Canvas */}
        <div className="flex justify-center p-2 bg-slate-950 rounded-2xl border border-border/80 overflow-x-auto shadow-2xl">
          <canvas
            ref={canvasRef}
            width={880}
            height={360}
            onClick={handleCanvasClick}
            className="w-full max-w-[880px] h-[360px] cursor-pointer"
          />
        </div>
      </div>

      {/* Free-Position Frameshift Mutation Inline Popover */}
      {selectedBaseIndex !== null && (
        <div className="p-4 bg-card border-2 border-rose-500 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-black text-rose-500 font-mono">
              Mutating DNA Template Base #{selectedBaseIndex + 1} ({dnaSequence[selectedBaseIndex]}):
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-muted-foreground text-[10px] uppercase font-sans font-bold">Insert Base:</span>
            {(["A", "T", "C", "G"] as const).map((b) => (
              <button
                key={b}
                onClick={() => handleInsertBase(b)}
                className="px-2.5 py-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold shadow-sm"
              >
                +{b}
              </button>
            ))}

            <button
              onClick={handleDeleteBase}
              className="px-3 py-1 bg-rose-500 text-white rounded-xl font-bold flex items-center gap-1 hover:bg-rose-600 shadow-sm ml-2"
            >
              <Trash2 size={12} />
              <span>Delete Base</span>
            </button>

            <button
              onClick={() => setSelectedBaseIndex(null)}
              className="px-2.5 py-1 text-muted-foreground hover:text-foreground text-[11px] underline ml-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Ribosomal Translation & Dual-Track Ghost Divergence Comparison */}
      <div className="p-5 bg-card border border-border rounded-3xl shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-emerald-500" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Ribosome Translation &amp; Dual-Track Ghost Comparison
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-500 font-bold">
            Large (50S) + Small (30S) Subunits &bull; tRNA Translocation
          </span>
        </div>

        {/* Dimmed Wild-Type Ghost Reference Track */}
        <div className="space-y-1 opacity-50 pb-2 border-b border-border/60">
          <span className="text-[9px] font-bold text-muted-foreground uppercase block font-mono">
            Original Wild-Type Sequence (Ghost Reference):
          </span>
          <div className="flex items-center gap-2 overflow-x-auto p-1 font-mono">
            {(originalProtein?.aminoAcids || []).map((aa, idx) => (
              <div key={idx} className="flex items-center gap-1.5 shrink-0">
                <div className="px-2.5 py-1 bg-background border border-border rounded-xl text-[10px] font-bold text-foreground">
                  {aa.abbr}
                </div>
                {idx < (originalProtein?.aminoAcids?.length ?? 0) - 1 && <span className="text-muted-foreground">-</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Active Mutated Polypeptide Chain with Ribosome Translocation */}
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block font-mono">
            Active Translated Polypeptide Chain:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto p-2 font-mono select-none min-h-[90px]">
            {(proteinData?.aminoAcids || []).map((aa, idx) => {
              const isFullyTranslated = idx < Math.floor(currentStepIndex / 3);
              const isCurrentlyTranslating = idx === Math.floor(currentStepIndex / 3);

              if (!isFullyTranslated && !isCurrentlyTranslating) {
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-2xl border border-dashed border-border/50 flex flex-col items-center justify-center min-w-[85px] min-h-[68px] opacity-30 text-[10px] text-muted-foreground shrink-0"
                  >
                    <span>Codon {idx + 1}</span>
                    <span>({aa.codon})</span>
                  </div>
                );
              }

              return (
                <div key={idx} className="flex items-center gap-2 shrink-0 animate-in fade-in">
                  <div
                    style={{ borderColor: aa.color }}
                    className={`p-3 rounded-2xl border-2 bg-background flex flex-col items-center justify-center min-w-[90px] shadow-md transition-all duration-300 ${
                      isCurrentlyTranslating ? "scale-110 ring-4 ring-emerald-500/50 shadow-xl" : ""
                    }`}
                  >
                    <span className="text-[9px] font-bold text-muted-foreground">Codon: {aa.codon}</span>
                    <span className="text-sm font-black tracking-wider my-0.5" style={{ color: aa.color }}>
                      {aa.abbr}
                    </span>
                    <span className="text-[9px] font-bold text-muted-foreground truncate max-w-[75px]">
                      {aa.name.split(" ")[0]}
                    </span>
                  </div>

                  {idx < (proteinData?.aminoAcids?.length ?? 0) - 1 && isFullyTranslated && (
                    <span className="text-emerald-500 font-bold text-lg">&mdash;</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Quiz */}
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-primary block">Conceptual Quick Check</span>
              <h3 className="text-sm font-bold text-foreground">Why does inserting 1 nucleotide into a DNA template cause a frameshift mutation?</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Because codons are read in continuous triplets, so inserting 1 base shifts the 3-letter reading frame for all downstream amino acids",
            "Because the ribosome stops working entirely",
            "Because Uracil cannot bond with inserted bases",
            "Because RNA polymerase gets destroyed",
          ].map((opt, idx) => {
            const isSelected = selectedQuizAnswer === idx;
            const isCorrect = idx === 0;
            let btnStyle = "bg-muted/40 hover:bg-accent border-border text-foreground";
            if (quizAnswered) {
              if (isCorrect) btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-500 font-bold";
              else if (isSelected) btnStyle = "bg-rose-500/20 border-rose-500 text-rose-500 font-bold";
              else btnStyle = "bg-muted/20 opacity-50 border-border text-muted-foreground";
            } else if (isSelected) {
              btnStyle = "bg-primary text-primary-foreground border-primary font-bold";
            }

            return (
              <button
                key={idx}
                onClick={() => {
                  if (!quizAnswered) {
                    setSelectedQuizAnswer(idx);
                    setQuizAnswered(true);
                  }
                }}
                className={`p-3 rounded-2xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {quizAnswered && isCorrect && <CheckCircle2 size={16} className="text-emerald-500 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
