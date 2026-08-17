"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DominanceModel } from "../types";
import FeedbackPulse from "@/app/components/FeedbackPulse";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import {
  Dna,
  Users,
  Sparkles,
  RefreshCw,
  BookOpen,
  CheckCircle2,
  Sliders,
  Award,
  Heart,
  Baby,
  Layers,
  HelpCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

// ==========================================
// Procedural SVG Creature Avatar Component
// ==========================================
export function CreatureAvatar({
  genotype,
  dominance = "complete",
  size = 64,
  label,
  className = "",
}: {
  genotype: string;
  dominance?: DominanceModel;
  size?: number;
  label?: string;
  className?: string;
}) {
  const isHomDominant = genotype === "BB";
  const isHetero = genotype === "Bb" || genotype === "bB";
  const isHomRecessive = genotype === "bb";

  // Determine Base Body Color based on Dominance Model
  let bodyColor = "#8b5cf6"; // Default Royal Purple
  let earColor = "#7c3aed";
  let hasSpots = false;
  let phenotypeName = "Purple Fur";

  if (dominance === "complete") {
    if (isHomRecessive) {
      bodyColor = "#f59e0b"; // Vibrant Amber/Orange
      earColor = "#d97706";
      phenotypeName = "Orange Fur";
    } else {
      bodyColor = "#8b5cf6"; // Royal Purple
      earColor = "#7c3aed";
      phenotypeName = "Purple Fur";
    }
  } else if (dominance === "incomplete") {
    if (isHomDominant) {
      bodyColor = "#8b5cf6"; // Purple
      earColor = "#7c3aed";
      phenotypeName = "Purple Fur";
    } else if (isHetero) {
      bodyColor = "#ec4899"; // Blended Pink / Magenta
      earColor = "#db2777";
      phenotypeName = "Pink Fur (Blended)";
    } else {
      bodyColor = "#f59e0b"; // Orange
      earColor = "#d97706";
      phenotypeName = "Orange Fur";
    }
  } else if (dominance === "codominant") {
    if (isHomDominant) {
      bodyColor = "#8b5cf6";
      earColor = "#7c3aed";
      phenotypeName = "Pure Purple";
    } else if (isHetero) {
      bodyColor = "#8b5cf6";
      earColor = "#f59e0b";
      hasSpots = true;
      phenotypeName = "Purple + Orange Spots";
    } else {
      bodyColor = "#f59e0b";
      earColor = "#d97706";
      phenotypeName = "Pure Orange";
    }
  }

  const gradId = `creature-grad-${genotype}-${dominance}-${size}`;

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <radialGradient id={gradId} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="60%" stopColor={bodyColor} />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.85" />
          </radialGradient>
          <filter id="creature-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Ears / Antennae */}
        <path d="M 28 35 C 15 15, 10 25, 22 42 Z" fill={earColor} stroke="#0f172a" strokeWidth="2" />
        <path d="M 72 35 C 85 15, 90 25, 78 42 Z" fill={earColor} stroke="#0f172a" strokeWidth="2" />

        {/* Main Body */}
        <circle
          cx="50"
          cy="56"
          r="34"
          fill={`url(#${gradId})`}
          stroke="#0f172a"
          strokeWidth="2.5"
          filter="url(#creature-glow)"
        />

        {/* Codominant Spots (if applicable) */}
        {hasSpots && (
          <g fill="#f59e0b" stroke="#0f172a" strokeWidth="1">
            <circle cx="34" cy="42" r="5" />
            <circle cx="66" cy="42" r="5" />
            <circle cx="50" cy="74" r="6" />
            <circle cx="30" cy="68" r="4.5" />
            <circle cx="70" cy="68" r="4.5" />
          </g>
        )}

        {/* Soft Belly Patch */}
        <ellipse cx="50" cy="64" rx="17" ry="15" fill="#ffffff" opacity="0.3" />

        {/* Eyes */}
        <g>
          <circle cx="38" cy="48" r="7.5" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="38" cy="48" r="4" fill="#0f172a" />
          <circle cx="36.5" cy="46" r="1.5" fill="#ffffff" />

          <circle cx="62" cy="48" r="7.5" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="62" cy="48" r="4" fill="#0f172a" />
          <circle cx="60.5" cy="46" r="1.5" fill="#ffffff" />
        </g>

        {/* Blush Cheeks */}
        <circle cx="28" cy="58" r="4" fill="#f43f5e" opacity="0.45" />
        <circle cx="72" cy="58" r="4" fill="#f43f5e" opacity="0.45" />

        {/* Smile */}
        <path d="M 44 63 Q 50 68 56 63" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {label && (
        <span className="text-[10px] font-bold text-muted-foreground mt-0.5">{label}</span>
      )}
    </div>
  );
}

// Offspring Creature Type
interface NurseryCreature {
  id: number;
  genotype: string;
  phenotype: string;
  color: string;
}

export default function MonohybridLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "biology/genetics/monohybrid",
    "biology",
    "simulation"
  );

  // Parent Genotypes (Mom & Dad)
  const [momGenotype, setMomGenotype] = useState<"BB" | "Bb" | "bb">("Bb");
  const [dadGenotype, setDadGenotype] = useState<"BB" | "Bb" | "bb">("Bb");

  // Inheritance Mode
  const [dominance, setDominance] = useState<DominanceModel>("complete");

  // Selected Punnett Cell for Deep Dive
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  // Nursery Offspring Batch
  const [nurseryBabies, setNurseryBabies] = useState<NurseryCreature[]>([]);
  const [isBreeding, setIsBreeding] = useState<boolean>(false);

  // Quick Quiz
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  // Mom's Gametes (Eggs) & Dad's Gametes (Sperm)
  const momGametes = useMemo(() => [momGenotype[0], momGenotype[1]], [momGenotype]);
  const dadGametes = useMemo(() => [dadGenotype[0], dadGenotype[1]], [dadGenotype]);

  // 2x2 Punnett Square Grid Combinations
  const punnettGrid = useMemo(() => {
    return [
      [
        {
          g1: momGametes[0],
          g2: dadGametes[0],
          genotype: [momGametes[0], dadGametes[0]].sort().join(""),
        },
        {
          g1: momGametes[1],
          g2: dadGametes[0],
          genotype: [momGametes[1], dadGametes[0]].sort().join(""),
        },
      ],
      [
        {
          g1: momGametes[0],
          g2: dadGametes[1],
          genotype: [momGametes[0], dadGametes[1]].sort().join(""),
        },
        {
          g1: momGametes[1],
          g2: dadGametes[1],
          genotype: [momGametes[1], dadGametes[1]].sort().join(""),
        },
      ],
    ];
  }, [momGametes, dadGametes]);

  // Theoretical Ratio Calculations
  const ratios = useMemo(() => {
    const allGenotypes = punnettGrid.flat().map((c) => c.genotype);
    const countBB = allGenotypes.filter((g) => g === "BB").length;
    const countBb = allGenotypes.filter((g) => g === "Bb" || g === "bB").length;
    const countbb = allGenotypes.filter((g) => g === "bb").length;

    const pctBB = (countBB / 4) * 100;
    const pctBb = (countBb / 4) * 100;
    const pctbb = (countbb / 4) * 100;

    let dominantCount = 0;
    let intermediateCount = 0;
    let recessiveCount = 0;

    if (dominance === "complete") {
      dominantCount = countBB + countBb;
      recessiveCount = countbb;
    } else {
      dominantCount = countBB;
      intermediateCount = countBb;
      recessiveCount = countbb;
    }

    return {
      countBB,
      countBb,
      countbb,
      pctBB,
      pctBb,
      pctbb,
      dominantCount,
      intermediateCount,
      recessiveCount,
      dominantPct: (dominantCount / 4) * 100,
      intermediatePct: (intermediateCount / 4) * 100,
      recessivePct: (recessiveCount / 4) * 100,
    };
  }, [punnettGrid, dominance]);

  // Initial Nursery Population Seed
  useEffect(() => {
    handleBreedBatch(12);
  }, [momGenotype, dadGenotype, dominance]);

  // AI Chat registration
  useEffect(() => {
    setExperimentData({
      title: "Monohybrid Inheritance & Creature Breeder Studio",
      theory: "Mendel's Law of Segregation states that allele pairs separate during gamete formation. A monohybrid cross of two heterozygotes (Bb x Bb) yields a 1:2:1 genotypic ratio and a 3:1 phenotypic ratio under complete dominance.",
      extraContext: {
        momGenotype,
        dadGenotype,
        dominance,
        theoreticalRatios: ratios,
        totalBorn: nurseryBabies.length,
      },
    });
  }, [momGenotype, dadGenotype, dominance, ratios, nurseryBabies.length, setExperimentData]);

  // Helper to breed N offspring
  const handleBreedBatch = (count: number) => {
    setIsBreeding(true);
    const newBabies: NurseryCreature[] = [];
    const timestamp = Date.now();

    for (let i = 0; i < count; i++) {
      // Pick random egg from Mom & random sperm from Dad
      const egg = momGametes[Math.floor(Math.random() * 2)];
      const sperm = dadGametes[Math.floor(Math.random() * 2)];
      const gt = [egg, sperm].sort().join("");

      let pheno = "Purple Fur";
      let col = "#8b5cf6";

      if (dominance === "complete") {
        if (gt === "bb") {
          pheno = "Orange Fur";
          col = "#f59e0b";
        }
      } else if (dominance === "incomplete") {
        if (gt === "Bb" || gt === "bB") {
          pheno = "Pink Fur";
          col = "#ec4899";
        } else if (gt === "bb") {
          pheno = "Orange Fur";
          col = "#f59e0b";
        }
      } else if (dominance === "codominant") {
        if (gt === "Bb" || gt === "bB") {
          pheno = "Spotted";
          col = "#8b5cf6";
        } else if (gt === "bb") {
          pheno = "Orange Fur";
          col = "#f59e0b";
        }
      }

      newBabies.push({
        id: timestamp + i,
        genotype: gt,
        phenotype: pheno,
        color: col,
      });
    }

    setNurseryBabies((prev) => [...newBabies, ...prev].slice(0, 100)); // Keep up to 100 in nursery
    completeExperiment();
    setTimeout(() => setIsBreeding(false), 300);
  };

  // Nursery Observed Stats
  const nurseryStats = useMemo(() => {
    const total = nurseryBabies.length;
    if (total === 0) return { dom: 0, inter: 0, rec: 0, domPct: 0, interPct: 0, recPct: 0 };

    let dom = 0;
    let inter = 0;
    let rec = 0;

    nurseryBabies.forEach((b) => {
      if (b.genotype === "BB") dom++;
      else if (b.genotype === "Bb" || b.genotype === "bB") {
        if (dominance === "complete") dom++;
        else inter++;
      } else rec++;
    });

    return {
      dom,
      inter,
      rec,
      domPct: parseFloat(((dom / total) * 100).toFixed(1)),
      interPct: parseFloat(((inter / total) * 100).toFixed(1)),
      recPct: parseFloat(((rec / total) * 100).toFixed(1)),
    };
  }, [nurseryBabies, dominance]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* ─── Top Header Toolbar & Mode Switcher ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm shrink-0">
            <Dna size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Monohybrid Punnett Square &amp; Creature Breeder
              </h1>
              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                Mendelian Genetics Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Choose parent genotypes, explore the 2&times;2 Punnett matrix, and breed live baby alien creatures to witness Mendelian ratios in action
            </p>
          </div>
        </div>

        {/* Inheritance Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border">
          <button
            onClick={() => setDominance("complete")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dominance === "complete"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Complete Dominance
          </button>
          <button
            onClick={() => setDominance("incomplete")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dominance === "incomplete"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Incomplete Dominance (Pink Blend)
          </button>
          <button
            onClick={() => setDominance("codominant")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dominance === "codominant"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Co-Dominance (Spots)
          </button>
        </div>
      </div>

      {/* ─── STEP 1: Parent Organism Customizer ─── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-600 text-white font-black text-xs">
            1
          </span>
          <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
            Select Parent Organisms (Maternal Mom &amp; Paternal Dad)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Maternal Parent (Mom) */}
          <div className="bg-card border-2 border-purple-500/30 rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-pink-500" />
                <span className="text-xs font-black uppercase text-purple-600 dark:text-purple-400">
                  Maternal Parent (Mom &bull; Egg Donor)
                </span>
              </div>
              <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                Genotype: {momGenotype}
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div className="p-2.5 bg-muted/40 rounded-2xl border border-border shrink-0 flex items-center justify-center shadow-inner">
                <CreatureAvatar genotype={momGenotype} dominance={dominance} size={74} />
              </div>

              <div className="space-y-2 flex-1">
                <span className="text-xs font-bold text-foreground block">Select Mom&apos;s Allele Pair:</span>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  {(["BB", "Bb", "bb"] as const).map((gt) => {
                    const isSel = momGenotype === gt;
                    return (
                      <button
                        key={gt}
                        onClick={() => setMomGenotype(gt)}
                        className={`py-2 px-3 rounded-xl border font-black transition-all text-center flex flex-col items-center ${
                          isSel
                            ? "bg-purple-600 text-white border-purple-600 shadow-md scale-105"
                            : "bg-muted/50 hover:bg-accent border-border text-foreground"
                        }`}
                      >
                        <span className="text-sm font-bold">{gt}</span>
                        <span className="text-[9px] font-sans font-medium opacity-80">
                          {gt === "BB" ? "Homo Dom" : gt === "Bb" ? "Hetero" : "Homo Rec"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
                  <span>Eggs Produced:</span>
                  <span className="px-2 py-0.5 bg-purple-500/15 text-purple-600 dark:text-purple-400 rounded-md font-mono font-bold">
                    {momGenotype[0]}
                  </span>
                  <span>and</span>
                  <span className="px-2 py-0.5 bg-purple-500/15 text-purple-600 dark:text-purple-400 rounded-md font-mono font-bold">
                    {momGenotype[1]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Paternal Parent (Dad) */}
          <div className="bg-card border-2 border-blue-500/30 rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-blue-500" />
                <span className="text-xs font-black uppercase text-blue-600 dark:text-blue-400">
                  Paternal Parent (Dad &bull; Sperm Donor)
                </span>
              </div>
              <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                Genotype: {dadGenotype}
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div className="p-2.5 bg-muted/40 rounded-2xl border border-border shrink-0 flex items-center justify-center shadow-inner">
                <CreatureAvatar genotype={dadGenotype} dominance={dominance} size={74} />
              </div>

              <div className="space-y-2 flex-1">
                <span className="text-xs font-bold text-foreground block">Select Dad&apos;s Allele Pair:</span>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  {(["BB", "Bb", "bb"] as const).map((gt) => {
                    const isSel = dadGenotype === gt;
                    return (
                      <button
                        key={gt}
                        onClick={() => setDadGenotype(gt)}
                        className={`py-2 px-3 rounded-xl border font-black transition-all text-center flex flex-col items-center ${
                          isSel
                            ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                            : "bg-muted/50 hover:bg-accent border-border text-foreground"
                        }`}
                      >
                        <span className="text-sm font-bold">{gt}</span>
                        <span className="text-[9px] font-sans font-medium opacity-80">
                          {gt === "BB" ? "Homo Dom" : gt === "Bb" ? "Hetero" : "Homo Rec"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
                  <span>Sperm Produced:</span>
                  <span className="px-2 py-0.5 bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded-md font-mono font-bold">
                    {dadGenotype[0]}
                  </span>
                  <span>and</span>
                  <span className="px-2 py-0.5 bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded-md font-mono font-bold">
                    {dadGenotype[1]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── STEP 2 & 3: 2x2 Punnett Square Matrix & Ratio Breakdown ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: 2x2 Punnett Square Grid (7 cols) */}
        <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-lg space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-600 text-white font-black text-xs">
                  2
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-primary">
                  2&times;2 Zygote Fertilization Matrix (Punnett Square)
                </span>
              </div>

              <span className="text-[11px] font-mono font-bold text-muted-foreground">
                Cross: {momGenotype} &times; {dadGenotype}
              </span>
            </div>

            {/* Punnett Table Layout */}
            <div className="max-w-md mx-auto py-2">
              {/* Top Header (Mom's Eggs) */}
              <div className="grid grid-cols-[80px_1fr_1fr] gap-2 mb-2 text-center">
                <div className="flex items-center justify-center text-[10px] font-black uppercase text-muted-foreground">
                  Dad \ Mom
                </div>
                {momGametes.map((allele, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 font-mono font-black text-sm flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>Egg:</span>
                    <span className="text-base font-extrabold">{allele}</span>
                  </div>
                ))}
              </div>

              {/* Grid Rows */}
              {punnettGrid.map((row, rIdx) => (
                <div key={rIdx} className="grid grid-cols-[80px_1fr_1fr] gap-2 mb-2">
                  {/* Left Header (Dad's Sperm) */}
                  <div className="p-2 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-300 font-mono font-black text-sm flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[10px] font-sans">Sperm</span>
                    <span className="text-base font-extrabold">{dadGametes[rIdx]}</span>
                  </div>

                  {/* 2 Cells */}
                  {row.map((cell, cIdx) => {
                    const isSelected = selectedCell?.row === rIdx && selectedCell?.col === cIdx;
                    return (
                      <div
                        key={cIdx}
                        onClick={() => setSelectedCell({ row: rIdx, col: cIdx })}
                        className={`p-3 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between text-center relative group ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-lg scale-[1.02]"
                            : "border-border bg-muted/30 hover:border-purple-400 hover:bg-muted/60"
                        }`}
                      >
                        <span className="absolute top-2 right-2 text-[9px] font-mono text-muted-foreground font-bold">
                          25%
                        </span>

                        <CreatureAvatar genotype={cell.genotype} dominance={dominance} size={56} />

                        <div className="mt-2 space-y-0.5">
                          <span className="text-base font-black font-mono text-foreground block">
                            {cell.genotype}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground block">
                            {dominance === "complete"
                              ? cell.genotype === "bb"
                                ? "Orange Fur"
                                : "Purple Fur"
                              : dominance === "incomplete"
                              ? cell.genotype === "BB"
                                ? "Purple Fur"
                                : cell.genotype === "bb"
                                ? "Orange Fur"
                                : "Pink Fur"
                              : cell.genotype === "BB"
                              ? "Pure Purple"
                              : cell.genotype === "bb"
                              ? "Pure Orange"
                              : "Spotted"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-muted/40 border border-border rounded-2xl text-xs text-muted-foreground font-medium flex items-center gap-2">
            <HelpCircle size={15} className="text-primary shrink-0" />
            <span>
              Each of the 4 boxes represents an equally likely ($25\%$) fertilization outcome resulting from Mendel&apos;s Law of Independent Segregation.
            </span>
          </div>
        </div>

        {/* Right: Ratios & Probability Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-lg space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-600 text-white font-black text-xs">
                  3
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-primary">
                  Mendelian Ratios &amp; Probabilities
                </span>
              </div>
            </div>

            {/* Genotypic Ratio Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black">
                <span className="text-foreground uppercase tracking-wider">Genotypic Ratio:</span>
                <span className="font-mono text-primary">
                  {ratios.countBB} BB : {ratios.countBb} Bb : {ratios.countbb} bb
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                {/* BB */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold">BB (Homozygous Dominant):</span>
                    <span className="font-black text-purple-600 dark:text-purple-400">{ratios.pctBB}% ({ratios.countBB}/4)</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full transition-all duration-300" style={{ width: `${ratios.pctBB}%` }} />
                  </div>
                </div>

                {/* Bb */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold">Bb (Heterozygous):</span>
                    <span className="font-black text-pink-500">{ratios.pctBb}% ({ratios.countBb}/4)</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 rounded-full transition-all duration-300" style={{ width: `${ratios.pctBb}%` }} />
                  </div>
                </div>

                {/* bb */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold">bb (Homozygous Recessive):</span>
                    <span className="font-black text-amber-500">{ratios.pctbb}% ({ratios.countbb}/4)</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${ratios.pctbb}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Phenotypic Ratio Breakdown */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex justify-between text-xs font-black">
                <span className="text-foreground uppercase tracking-wider">Phenotypic Ratio:</span>
                <span className="font-mono text-primary">
                  {dominance === "complete"
                    ? `${ratios.dominantCount} Purple : ${ratios.recessiveCount} Orange`
                    : `${ratios.dominantCount} Purple : ${ratios.intermediateCount} Pink : ${ratios.recessiveCount} Orange`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl">
                  <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold block">Purple Fur</span>
                  <span className="text-lg font-black text-purple-600 dark:text-purple-400">{ratios.dominantPct}%</span>
                </div>

                {dominance !== "complete" ? (
                  <div className="p-3 bg-pink-500/10 border border-pink-500/30 rounded-2xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold block">
                      {dominance === "incomplete" ? "Pink Blend" : "Spots"}
                    </span>
                    <span className="text-lg font-black text-pink-500">{ratios.intermediatePct}%</span>
                  </div>
                ) : null}

                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                  <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold block">Orange Fur</span>
                  <span className="text-lg font-black text-amber-500">{ratios.recessivePct}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-muted/30 border border-border rounded-2xl text-[11px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Mendel&apos;s Law of Dominance:</strong> When an individual receives one dominant allele ($B$) and one recessive allele ($b$), the dominant trait masks the recessive trait in complete dominance.
          </div>
        </div>
      </div>

      {/* ─── STEP 4: Live Creature Nursery (Population Breeder) ─── */}
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-600 text-white font-black text-xs">
              4
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-foreground tracking-tight">
                  Alien Creature Nursery &bull; Live Population Breeder
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                  {nurseryBabies.length} Born
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Breed live batches to see how experimental offspring counts converge to theoretical Punnett ratios
              </p>
            </div>
          </div>

          {/* Breed Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleBreedBatch(1)}
              disabled={isBreeding}
              className="px-3 py-1.5 bg-muted hover:bg-accent border border-border rounded-xl text-xs font-bold transition shadow-sm"
            >
              +1 Baby
            </button>
            <button
              onClick={() => handleBreedBatch(10)}
              disabled={isBreeding}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-purple-600/25"
            >
              +10 Babies
            </button>
            <button
              onClick={() => handleBreedBatch(50)}
              disabled={isBreeding}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/25"
            >
              +50 Babies
            </button>
            <button
              onClick={() => setNurseryBabies([])}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-xl border border-border bg-muted/40 transition"
              title="Clear Nursery"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Nursery Comparison Bar (Observed vs Expected) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-muted/30 border border-border rounded-2xl">
          <div className="space-y-1 text-xs">
            <span className="font-bold text-foreground uppercase tracking-wider text-[10px] block">
              Observed Population Statistics ({nurseryBabies.length} offspring):
            </span>
            <div className="flex items-center gap-3 font-mono font-bold text-[11px]">
              <span className="text-purple-600 dark:text-purple-400">
                Purple: {nurseryStats.dom} ({nurseryStats.domPct}%)
              </span>
              {dominance !== "complete" && (
                <span className="text-pink-500">
                  Pink: {nurseryStats.inter} ({nurseryStats.interPct}%)
                </span>
              )}
              <span className="text-amber-500">
                Orange: {nurseryStats.rec} ({nurseryStats.recPct}%)
              </span>
            </div>
          </div>

          <div className="space-y-1 text-xs sm:text-right">
            <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px] block">
              Theoretical Mendelian Expectation:
            </span>
            <div className="flex sm:justify-end items-center gap-3 font-mono font-bold text-[11px]">
              <span className="text-purple-600 dark:text-purple-400">
                Expected Purple: {ratios.dominantPct}%
              </span>
              {dominance !== "complete" && (
                <span className="text-pink-500">
                  Expected Pink: {ratios.intermediatePct}%
                </span>
              )}
              <span className="text-amber-500">
                Expected Orange: {ratios.recessivePct}%
              </span>
            </div>
          </div>
        </div>

        {/* Nursery Creature Avatar Pen */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-border/80 min-h-[160px] max-h-[260px] overflow-y-auto shadow-inner">
          {nurseryBabies.length === 0 ? (
            <div className="h-28 flex flex-col items-center justify-center text-muted-foreground text-xs font-medium">
              <Baby size={24} className="mb-2 opacity-50" />
              <span>Nursery is empty. Click any &quot;+ Babies&quot; button above to breed a population!</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center items-center">
              {nurseryBabies.map((baby) => (
                <div
                  key={baby.id}
                  className="p-1.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center hover:scale-110 hover:border-purple-500 transition duration-200 shadow-sm"
                  title={`${baby.genotype} — ${baby.phenotype}`}
                >
                  <CreatureAvatar genotype={baby.genotype} dominance={dominance} size={42} />
                  <span className="text-[9px] font-mono font-bold text-slate-400 mt-0.5">
                    {baby.genotype}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Conceptual Quick Check Quiz ─── */}
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <BookOpen size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 block">
                Conceptual Quick Check
              </span>
              <h3 className="text-sm font-bold text-foreground">
                In a standard Mendelian monohybrid cross of two heterozygous parents ($Bb \times Bb$), what is the probability of producing a homozygous recessive ($bb$) offspring?
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "25% (1 out of 4 possible square combinations)",
            "50% (because both parents carry the b allele)",
            "75% (because 3 out of 4 will have the trait)",
            "0% (because dominant B always suppresses b in the parents)",
          ].map((opt, idx) => {
            const isSelected = selectedQuizAnswer === idx;
            const isCorrect = idx === 0;
            let btnStyle = "bg-muted/40 hover:bg-accent border-border text-foreground";
            if (quizAnswered) {
              if (isCorrect) btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold";
              else if (isSelected) btnStyle = "bg-rose-500/20 border-rose-500 text-rose-500 font-bold";
              else btnStyle = "bg-muted/20 opacity-50 border-border text-muted-foreground";
            } else if (isSelected) {
              btnStyle = "bg-purple-600 text-white border-purple-600 font-bold";
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

      {/* Lab Feedback Widget */}
      <FeedbackPulse labId="biology/genetics/monohybrid" />
    </div>
  );
}
