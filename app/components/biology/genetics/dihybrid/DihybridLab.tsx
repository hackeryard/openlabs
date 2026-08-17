"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DihybridParent } from "../types";
import { generateLinkedDihybridGrid } from "../lib/geneticsEngines";
import CellMeiosisEngine from "../shared/CellMeiosisEngine";
import PunnettGridEngine from "../shared/PunnettGridEngine";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import {
  Grid,
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
  Dna,
  PieChart,
  BookOpen,
} from "lucide-react";

// Procedural SVG Pea Seed Component
function PeaSeed({ round, yellow, size = 32 }: { round: boolean; yellow: boolean; size?: number }) {
  const seedColor = yellow ? "#fbbf24" : "#10b981"; // Yellow vs Green
  const highlightColor = yellow ? "#fef08a" : "#6ee7b7";
  const shadowColor = yellow ? "#b45309" : "#047857";

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="shrink-0">
      <defs>
        <radialGradient id={`seed-grad-${round ? "r" : "w"}-${yellow ? "y" : "g"}-${size}`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor={highlightColor} />
          <stop offset="60%" stopColor={seedColor} />
          <stop offset="100%" stopColor={shadowColor} />
        </radialGradient>
      </defs>

      {round ? (
        // Smooth Round Seed
        <circle
          cx="20"
          cy="20"
          r="16"
          fill={`url(#seed-grad-${round ? "r" : "w"}-${yellow ? "y" : "g"}-${size})`}
          stroke="#0f172a"
          strokeWidth="1.5"
        />
      ) : (
        // Wrinkled Seed Shape
        <path
          d="M 20 5 C 28 4, 35 12, 33 22 C 32 30, 24 35, 17 34 C 8 33, 4 25, 6 16 C 8 8, 14 6, 20 5 Z"
          fill={`url(#seed-grad-${round ? "r" : "w"}-${yellow ? "y" : "g"}-${size})`}
          stroke="#0f172a"
          strokeWidth="1.5"
        />
      )}

      {/* Surface Details */}
      {!round && (
        <path
          d="M 14 14 Q 18 20 15 26 M 22 12 Q 25 18 23 25"
          fill="none"
          stroke={shadowColor}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      )}
      <circle cx="15" cy="14" r="2.5" fill="#ffffff" opacity="0.4" />
    </svg>
  );
}

export default function DihybridLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "biology/genetics/dihybrid",
    "biology",
    "simulation"
  );

  const [p1, setP1] = useState<DihybridParent>({
    trait1: ["R", "r"], // Round / Wrinkled
    trait2: ["Y", "y"], // Yellow / Green
  });
  const [p2, setP2] = useState<DihybridParent>({
    trait1: ["R", "r"],
    trait2: ["Y", "y"],
  });

  // Genetic Map Distance (0 = completely linked, 50 = unlinked 50% crossover)
  const [mapDistance, setMapDistance] = useState<number>(50);
  const [highlightCategory, setHighlightCategory] = useState<string | null>(null);

  // Quick Quiz
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  const linkedData = useMemo(
    () => generateLinkedDihybridGrid(p1, p2, mapDistance),
    [p1, p2, mapDistance]
  );

  // AI Chat registration
  useEffect(() => {
    setExperimentData({
      title: "Dihybrid Cross & Chromosome Linkage Map Studio",
      theory: "Dihybrid inheritance with syntenic loci linkage: adjusting genetic distance (cM) alters crossing-over recombination frequencies, transitioning from Mendelian 9:3:3:1 independent assortment to complete linkage.",
      extraContext: { mapDistance, recombinationFreq: linkedData?.recombinationFreq, probabilities: linkedData?.probabilities },
    });
  }, [p1, p2, mapDistance, linkedData, setExperimentData]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* Top Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <Grid size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Dihybrid Cross &amp; Chromosome Linkage Studio
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                Interactive Biology Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Draggable chromosome map units: Recombination crossover frequencies modifying gamete distributions and 16-cell zygote probabilities
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Chromosome Linkage Map Slider */}
      <div className="p-5 bg-card border border-border rounded-3xl space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Dna size={18} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-foreground">
              Chromosome 1 Syntenic Loci Linkage Map
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="px-3 py-1 bg-muted rounded-xl font-bold">
              Genetic Distance: {mapDistance} cM (Map Units)
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/30 rounded-xl font-black">
              Recombination: {linkedData?.recombinationFreq ?? 50}%
            </span>
          </div>
        </div>

        {/* Draggable Chromosome Bar Graphic with Coiling metaphor */}
        <div className="space-y-2 pt-1">
          <div className="relative h-8 bg-muted/60 rounded-2xl border-2 border-slate-700 dark:border-slate-400 flex items-center px-4 overflow-hidden">
            <div
              style={{ opacity: (50 - mapDistance) / 50 }}
              className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#6366f1_0,#6366f1_2px,transparent_0,transparent_8px)] opacity-20 pointer-events-none"
            />

            {/* Gene R Marker */}
            <div className="absolute left-6 flex items-center gap-1.5 z-10">
              <div className="w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow-md" />
              <span className="font-mono text-xs font-black text-foreground">Locus R (Shape)</span>
            </div>

            {/* Gene Y Marker */}
            <div
              style={{ left: `calc(120px + ${(mapDistance / 50) * 60}%)` }}
              className="absolute flex items-center gap-1.5 z-10 transition-all duration-150"
            >
              <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-md" />
              <span className="font-mono text-xs font-black text-foreground">Locus Y (Color)</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1">
            <span>0 cM (Fully Linked / 0% Crossover)</span>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={mapDistance}
              onChange={(e) => {
                setMapDistance(parseInt(e.target.value, 10));
                completeExperiment();
              }}
              className="w-1/2 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span>50 cM (Independent Assortment / 50%)</span>
          </div>
        </div>
      </div>

      {/* Parent Organism Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Maternal Parent P1 */}
        <div className="p-4 bg-card border border-border rounded-3xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Maternal Parent
            </span>
            <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
              {p1.trait1.join("")}{p1.trait2.join("")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 bg-muted/40 rounded-2xl border border-border shrink-0 flex items-center justify-center">
              <PeaSeed round={p1.trait1.includes("R")} yellow={p1.trait2.includes("Y")} size={46} />
            </div>
            <div className="text-xs font-mono space-y-1">
              <span className="text-[10px] text-muted-foreground font-sans block">Heterozygous Dihybrid Cross</span>
              <span className="font-bold text-foreground">Shape: Round ({p1.trait1.join("")}) | Color: Yellow ({p1.trait2.join("")})</span>
            </div>
          </div>
        </div>

        {/* Paternal Parent P2 */}
        <div className="p-4 bg-card border border-border rounded-3xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Paternal Parent
            </span>
            <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
              {p2.trait1.join("")}{p2.trait2.join("")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 bg-muted/40 rounded-2xl border border-border shrink-0 flex items-center justify-center">
              <PeaSeed round={p2.trait1.includes("R")} yellow={p2.trait2.includes("Y")} size={46} />
            </div>
            <div className="text-xs font-mono space-y-1">
              <span className="text-[10px] text-muted-foreground font-sans block">Heterozygous Dihybrid Cross</span>
              <span className="font-bold text-foreground">Shape: Round ({p2.trait1.join("")}) | Color: Yellow ({p2.trait2.join("")})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meiosis Engines Stage (Shared Component consumed for Dihybrid 2 loci) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CellMeiosisEngine
          mode="dihybrid"
          parentType="maternal"
          alleles={[p1.trait1[0], p1.trait1[1]]}
          secondLoci={[p1.trait2[0], p1.trait2[1]]}
          mapDistance={mapDistance}
        />
        <CellMeiosisEngine
          mode="dihybrid"
          parentType="paternal"
          alleles={[p2.trait1[0], p2.trait1[1]]}
          secondLoci={[p2.trait2[0], p2.trait2[1]]}
          mapDistance={mapDistance}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: 4x4 (16-Cell) Shared Punnett Grid Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Grid size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                16-Cell Dihybrid Punnett Matrix (Live Linkage Weighted)
              </span>
            </div>

            {highlightCategory && (
              <button
                onClick={() => setHighlightCategory(null)}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          <PunnettGridEngine
            gridSize={4}
            gametes1={(linkedData?.gametes1 || []).map((g) => ({
              label: g?.gamete || "?",
              count: `${((g?.prob ?? 0) * 100).toFixed(1)}%`,
            }))}
            gametes2={(linkedData?.gametes2 || []).map((g) => ({
              label: g?.gamete || "?",
              count: `${((g?.prob ?? 0) * 100).toFixed(1)}%`,
            }))}
            grid={(linkedData?.grid || []).map((row) =>
              (row || []).map((cell) => ({
                g1: cell?.g1 || "",
                g2: cell?.g2 || "",
                genotype: cell?.genotype || "",
                phenotype: cell?.category || "",
                prob: cell?.prob,
                category: cell?.category,
              }))
            )}
            highlightCategory={highlightCategory}
            renderOrganismPreview={(cell, size) => {
              const isRound = (cell?.genotype || "").includes("R");
              const isYellow = (cell?.genotype || "").includes("Y");
              return <PeaSeed round={isRound} yellow={isYellow} size={size} />;
            }}
          />
        </div>

        {/* Right: Live Skewed Phenotype Ratios (4 cols) */}
        <div className="lg:col-span-4 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <PieChart size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Live Phenotypic Probabilities
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {/* DomDom: Round Yellow */}
            <button
              onClick={() => setHighlightCategory(highlightCategory === "DomDom" ? null : "DomDom")}
              className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center justify-between ${
                highlightCategory === "DomDom"
                  ? "bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/50 shadow-md"
                  : "bg-muted/30 hover:bg-accent border-border"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PeaSeed round={true} yellow={true} size={28} />
                <div>
                  <span className="font-bold block text-foreground">Round Yellow (R_Y_)</span>
                  <span className="text-[10px] text-muted-foreground">Parental Dominant Mix</span>
                </div>
              </div>
              <span className="font-mono font-black text-sm text-amber-500">
                {linkedData?.probabilities?.DomDom ?? 56.25}%
              </span>
            </button>

            {/* DomRec: Round Green (Recombinant) */}
            <button
              onClick={() => setHighlightCategory(highlightCategory === "DomRec" ? null : "DomRec")}
              className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center justify-between ${
                highlightCategory === "DomRec"
                  ? "bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/50 shadow-md"
                  : "bg-muted/30 hover:bg-accent border-border"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PeaSeed round={true} yellow={false} size={28} />
                <div>
                  <span className="font-bold block text-foreground">Round Green (R_yy)</span>
                  <span className="text-[10px] text-muted-foreground">Recombinant Phenotype</span>
                </div>
              </div>
              <span className="font-mono font-black text-sm text-emerald-500">
                {linkedData?.probabilities?.DomRec ?? 18.75}%
              </span>
            </button>

            {/* RecDom: Wrinkled Yellow (Recombinant) */}
            <button
              onClick={() => setHighlightCategory(highlightCategory === "RecDom" ? null : "RecDom")}
              className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center justify-between ${
                highlightCategory === "RecDom"
                  ? "bg-yellow-500/20 border-yellow-500 ring-2 ring-yellow-500/50 shadow-md"
                  : "bg-muted/30 hover:bg-accent border-border"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PeaSeed round={false} yellow={true} size={28} />
                <div>
                  <span className="font-bold block text-foreground">Wrinkled Yellow (rrY_)</span>
                  <span className="text-[10px] text-muted-foreground">Recombinant Phenotype</span>
                </div>
              </div>
              <span className="font-mono font-black text-sm text-yellow-600 dark:text-yellow-400">
                {linkedData?.probabilities?.RecDom ?? 18.75}%
              </span>
            </button>

            {/* RecRec: Wrinkled Green */}
            <button
              onClick={() => setHighlightCategory(highlightCategory === "RecRec" ? null : "RecRec")}
              className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center justify-between ${
                highlightCategory === "RecRec"
                  ? "bg-teal-500/20 border-teal-500 ring-2 ring-teal-500/50 shadow-md"
                  : "bg-muted/30 hover:bg-accent border-border"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PeaSeed round={false} yellow={false} size={28} />
                <div>
                  <span className="font-bold block text-foreground">Wrinkled Green (rryy)</span>
                  <span className="text-[10px] text-muted-foreground">Parental Recessive Mix</span>
                </div>
              </div>
              <span className="font-mono font-black text-sm text-teal-500">
                {linkedData?.probabilities?.RecRec ?? 6.25}%
              </span>
            </button>
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
              <h3 className="text-sm font-bold text-foreground">What happens to phenotypic ratios when two genes are completely linked (0 cM)?</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Only parental-type offspring appear because no crossing over occurs between the loci",
            "The ratio remains exactly 9:3:3:1",
            "All offspring become homozygous recessive",
            "Recombinant gametes become 100% of the total",
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
