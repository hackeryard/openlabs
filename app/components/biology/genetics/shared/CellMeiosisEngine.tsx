"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MonohybridGamete } from "../types";

export interface ChromosomeObject {
  id: string;
  allele1: string; // Locus 1 e.g. "B" or "R"
  allele2?: string; // Locus 2 e.g. "Y" for dihybrid
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  pole: 1 | 2; // Pole 1 (left) or Pole 2 (right)
  color: string;
  secondaryColor?: string;
  isCrossover?: boolean;
}

export interface CellMeiosisEngineProps {
  mode?: "monohybrid" | "dihybrid";
  parentType?: "maternal" | "paternal"; // maternal = eggs, paternal = flagellated motile sperm
  alleles: [string, string]; // e.g. ["B", "b"] or ["R", "r"]
  secondLoci?: [string, string]; // e.g. ["Y", "y"] for dihybrid
  mapDistance?: number; // 0 to 50 cM for crossing-over
  onMeiosisComplete?: (gametes: MonohybridGamete[]) => void;
  onNondisjunctionChange?: (hasNondisjunction: boolean) => void;
}

export default function CellMeiosisEngine({
  mode = "monohybrid",
  parentType = "maternal",
  alleles,
  secondLoci,
  mapDistance = 50,
  onMeiosisComplete,
  onNondisjunctionChange,
}: CellMeiosisEngineProps) {
  // Meiosis Stages:
  // 0: Interphase (Idle Brownian drift)
  // 1: Metaphase I (Migrate to Equatorial Plate with eased motion, chiasma if dihybrid)
  // 2: Anaphase I (Spindle fiber contraction & interactive draggable nondisjunction)
  // 3: Cytokinesis I (Puckering/pinching membrane)
  // 4: Meiosis II & Gametes Complete (Motile sinusoidal sperm or large eggs)
  const [stage, setStage] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);

  // Dragging state for manual nondisjunction
  const [draggedChromId, setDraggedChromId] = useState<string | null>(null);
  const [hasNondisjunction, setHasNondisjunction] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const animRef = useRef<number | null>(null);

  // Chromosomes state
  const [chromosomes, setChromosomes] = useState<ChromosomeObject[]>([
    {
      id: "chrom-1",
      allele1: alleles[0],
      allele2: secondLoci ? secondLoci[0] : undefined,
      x: 110,
      y: 90,
      targetX: 110,
      targetY: 90,
      pole: 1,
      color: alleles[0] === "B" || alleles[0] === "R" ? "#8b5cf6" : "#f59e0b",
      secondaryColor: secondLoci ? (secondLoci[0] === "Y" ? "#fbbf24" : "#10b981") : undefined,
    },
    {
      id: "chrom-2",
      allele1: alleles[1],
      allele2: secondLoci ? secondLoci[1] : undefined,
      x: 190,
      y: 110,
      targetX: 190,
      targetY: 110,
      pole: 2,
      color: alleles[1] === "B" || alleles[1] === "R" ? "#8b5cf6" : "#f59e0b",
      secondaryColor: secondLoci ? (secondLoci[1] === "Y" ? "#fbbf24" : "#10b981") : undefined,
    },
  ]);

  // Continuous animation ticker for idle drift and flagellum whipping
  useEffect(() => {
    let startTime = performance.now();
    const loop = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      setTime(elapsed);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Update chromosomes when parent alleles change
  useEffect(() => {
    setChromosomes([
      {
        id: "chrom-1",
        allele1: alleles[0],
        allele2: secondLoci ? secondLoci[0] : undefined,
        x: 110,
        y: 90,
        targetX: 110,
        targetY: 90,
        pole: 1,
        color: alleles[0] === "B" || alleles[0] === "R" ? "#8b5cf6" : "#f59e0b",
        secondaryColor: secondLoci ? (secondLoci[0] === "Y" ? "#fbbf24" : "#10b981") : undefined,
      },
      {
        id: "chrom-2",
        allele1: alleles[1],
        allele2: secondLoci ? secondLoci[1] : undefined,
        x: 190,
        y: 110,
        targetX: 190,
        targetY: 110,
        pole: 2,
        color: alleles[1] === "B" || alleles[1] === "R" ? "#8b5cf6" : "#f59e0b",
        secondaryColor: secondLoci ? (secondLoci[1] === "Y" ? "#fbbf24" : "#10b981") : undefined,
      },
    ]);
    setStage(0);
    setHasNondisjunction(false);
  }, [alleles, secondLoci]);

  // Stage timeline controller
  useEffect(() => {
    if (!isRunning) return;

    if (stage === 0) {
      // Interphase -> Metaphase I (Migrate to Equatorial Plate x=150 with eased motion)
      const timer = setTimeout(() => {
        setChromosomes((prev) => [
          { ...prev[0], x: 135, y: 100, targetX: 135, targetY: 100, isCrossover: mode === "dihybrid" && mapDistance > 0 },
          { ...prev[1], x: 165, y: 100, targetX: 165, targetY: 100, isCrossover: mode === "dihybrid" && mapDistance > 0 },
        ]);
        setStage(1);
      }, 800);
      return () => clearTimeout(timer);
    }

    if (stage === 1) {
      // Metaphase I -> Anaphase I (Spindle fiber contraction pulling toward poles x=60 and x=240)
      const timer = setTimeout(() => {
        setChromosomes((prev) => [
          { ...prev[0], x: prev[0].pole === 1 ? 65 : 235, y: 100, targetX: prev[0].pole === 1 ? 65 : 235 },
          { ...prev[1], x: prev[1].pole === 2 ? 235 : 65, y: 100, targetX: prev[1].pole === 2 ? 235 : 65 },
        ]);
        setStage(2);
      }, 1200);
      return () => clearTimeout(timer);
    }

    if (stage === 2) {
      // Anaphase I -> Cytokinesis I
      const timer = setTimeout(() => {
        setStage(3);
      }, 1400);
      return () => clearTimeout(timer);
    }

    if (stage === 3) {
      // Cytokinesis I -> Gametes Complete (Meiosis II)
      const timer = setTimeout(() => {
        setStage(4);
        setIsRunning(false);

        const pole1Chroms = chromosomes.filter((c) => c.pole === 1);
        const pole2Chroms = chromosomes.filter((c) => c.pole === 2);

        const gamete1: MonohybridGamete = {
          chromosomeCount: pole1Chroms.length === 2 ? "n+1" : pole1Chroms.length === 0 ? "n-1" : "n",
          alleles: pole1Chroms.map((c) => c.allele1 as "B" | "b"),
        };
        const gamete2: MonohybridGamete = {
          chromosomeCount: pole2Chroms.length === 2 ? "n+1" : pole2Chroms.length === 0 ? "n-1" : "n",
          alleles: pole2Chroms.map((c) => c.allele1 as "B" | "b"),
        };

        if (onMeiosisComplete) onMeiosisComplete([gamete1, gamete2]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, isRunning, chromosomes, mode, mapDistance, onMeiosisComplete]);

  // Interactive Nondisjunction Drag Handlers
  const handleMouseDown = (chromId: string, e: React.MouseEvent) => {
    if (stage !== 1 && stage !== 2) return;
    setDraggedChromId(chromId);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggedChromId || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const curX = e.clientX - rect.left;
      const curY = e.clientY - rect.top;

      setChromosomes((prev) =>
        prev.map((c) => (c.id === draggedChromId ? { ...c, x: curX, y: curY } : c))
      );
    },
    [draggedChromId]
  );

  const handleMouseUp = useCallback(() => {
    if (!draggedChromId) return;

    // Check if dragged past midline (x=150)
    setChromosomes((prev) => {
      const dragged = prev.find((c) => c.id === draggedChromId);
      if (!dragged) return prev;

      // Threshold check: dragged past x=150 switches pole
      const newPole: 1 | 2 = dragged.x > 150 ? 2 : 1;

      const updated = prev.map((c) => {
        if (c.id === draggedChromId) {
          const finalX = newPole === 1 ? 65 : 235;
          return { ...c, pole: newPole, x: finalX, targetX: finalX, y: 100 };
        }
        return c;
      });

      const allPoles = updated.map((c) => c.pole);
      const isNondisjunction = allPoles[0] === allPoles[1];
      setHasNondisjunction(isNondisjunction);
      if (onNondisjunctionChange) onNondisjunctionChange(isNondisjunction);

      return updated;
    });

    setDraggedChromId(null);
  }, [draggedChromId, onNondisjunctionChange]);

  const handleStartMeiosis = () => {
    setStage(0);
    setIsRunning(true);
  };

  const handleReset = () => {
    setStage(0);
    setIsRunning(false);
    setHasNondisjunction(false);
    setChromosomes([
      { ...chromosomes[0], x: 110, y: 90, pole: 1, isCrossover: false },
      { ...chromosomes[1], x: 190, y: 110, pole: 2, isCrossover: false },
    ]);
  };

  return (
    <div className="flex flex-col items-center bg-card border border-border rounded-3xl p-4 shadow-md space-y-3 select-none">
      <div className="flex items-center justify-between w-full border-b border-border pb-2">
        <span className="text-xs font-black uppercase tracking-wider text-primary">
          {parentType === "maternal" ? "Maternal Oocyte Meiosis (Egg)" : "Paternal Spermatocyte Meiosis (Sperm)"}
        </span>

        <div className="flex items-center gap-2">
          {hasNondisjunction && (
            <span className="text-[10px] font-mono font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 animate-pulse">
              Nondisjunction (n+1 / n-1)
            </span>
          )}

          <button
            onClick={handleStartMeiosis}
            disabled={isRunning}
            className="px-3.5 py-1 bg-primary text-primary-foreground rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {stage === 4 ? "Re-Run Meiosis" : "Play Meiosis"}
          </button>
          <button
            onClick={handleReset}
            className="px-2.5 py-1 bg-muted hover:bg-accent text-muted-foreground rounded-xl text-xs"
          >
            Reset
          </button>
        </div>
      </div>

      {/* High-Fidelity SVG Cell Viewport */}
      <svg
        ref={svgRef}
        width="300"
        height="200"
        viewBox="0 0 300 200"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="bg-muted/20 rounded-2xl border border-border/60 overflow-hidden cursor-crosshair relative"
      >
        <defs>
          <radialGradient id="cytoplasm-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
          </radialGradient>
          <filter id="glow-pole" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Lipid Bilayer Cell Membrane (Cytokinesis puckering/pinching at stage >= 3) */}
        {stage < 3 ? (
          // Spherical cell with smooth deformation
          <circle
            cx="150"
            cy="100"
            r="88"
            fill="url(#cytoplasm-grad)"
            stroke="#94a3b8"
            strokeWidth="3"
            className="transition-all duration-700 ease-in-out"
          />
        ) : (
          // Cleavage furrow puckering into two daughter membranes
          <g className="animate-in fade-in duration-500">
            <ellipse cx="85" cy="100" rx="56" ry="76" fill="url(#cytoplasm-grad)" stroke="#94a3b8" strokeWidth="2.5" />
            <ellipse cx="215" cy="100" rx="56" ry="76" fill="url(#cytoplasm-grad)" stroke="#94a3b8" strokeWidth="2.5" />
          </g>
        )}

        {/* Metaphase Plate Equatorial Line at Stage 1 */}
        {stage === 1 && (
          <line
            x1="150"
            y1="22"
            x2="150"
            y2="178"
            stroke="#6366f1"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
            className="animate-in fade-in"
          />
        )}

        {/* Centrosome Spindle Poles (x=35 and x=265) */}
        {stage > 0 && stage < 3 && (
          <g filter="url(#glow-pole)">
            <circle cx="35" cy="100" r="7" fill="#6366f1" />
            <circle cx="265" cy="100" r="7" fill="#6366f1" />
          </g>
        )}

        {/* Spindle Fibers with Dynamic Elastic Tension Curve */}
        {stage > 0 && stage < 3 && (
          <g opacity="0.75">
            {chromosomes.map((c) => {
              const poleX = c.pole === 1 ? 35 : 265;
              const poleY = 100;
              const isDragging = c.id === draggedChromId;

              // Quadratic Bezier tension curve curvature
              const midX = (poleX + c.x) / 2;
              const midY = (poleY + c.y) / 2 + (isDragging ? (c.y - 100) * 0.7 : 0);

              return (
                <path
                  key={`spindle-${c.id}`}
                  d={`M ${poleX} ${poleY} Q ${midX} ${midY} ${c.x} ${c.y}`}
                  fill="none"
                  stroke={c.pole === 1 ? "#8b5cf6" : "#f59e0b"}
                  strokeWidth={isDragging ? 3 : 1.8}
                  strokeDasharray={isDragging ? "2 2" : "none"}
                />
              );
            })}
          </g>
        )}

        {/* X-Shaped Chromosomes with Sister Chromatids & Centromeres */}
        {stage < 4 &&
          chromosomes.map((c, idx) => {
            const isDragging = c.id === draggedChromId;

            // Idle Brownian drift offset during Interphase (Stage 0)
            const idleDriftX = stage === 0 ? Math.sin(time * 1.5 + idx * 2) * 4 : 0;
            const idleDriftY = stage === 0 ? Math.cos(time * 1.2 + idx * 2) * 4 : 0;

            const curX = c.x + idleDriftX;
            const curY = c.y + idleDriftY;

            return (
              <g
                key={c.id}
                transform={`translate(${curX}, ${curY})`}
                onMouseDown={(e) => handleMouseDown(c.id, e)}
                className="cursor-grab active:cursor-grabbing transition-transform duration-200"
              >
                {/* Drag halo */}
                {isDragging && <circle cx="0" cy="0" r="24" fill="#ec4899" opacity="0.35" className="animate-ping" />}

                {/* Homologous Chiasma Crossing-Over Overlap (Stage 1 in Dihybrid Mode) */}
                {c.isCrossover && stage === 1 && (
                  <path
                    d={idx === 0 ? "M 10 -10 Q 18 0 10 10" : "M -10 -10 Q -18 0 -10 10"}
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="3"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Chromatid Strand 1 (Diagonal 1) */}
                <line x1="-12" y1="-14" x2="12" y2="14" stroke={c.color} strokeWidth="5.5" strokeLinecap="round" />
                {/* Chromatid Strand 2 (Diagonal 2) */}
                <line x1="-12" y1="14" x2="12" y2="-14" stroke={c.color} strokeWidth="5.5" strokeLinecap="round" />

                {/* If recombinant from crossing-over, swap lower strand tip color */}
                {c.isCrossover && (
                  <line
                    x1="6"
                    y1="7"
                    x2="12"
                    y2="14"
                    stroke={idx === 0 ? "#f59e0b" : "#8b5cf6"}
                    strokeWidth="5.5"
                    strokeLinecap="round"
                  />
                )}

                {/* Centromere (Bead) */}
                <circle cx="0" cy="0" r="4.5" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />

                {/* Allele Marker Locus 1 */}
                <circle cx="-9" cy="-10" r="5.5" fill="#ffffff" stroke={c.color} strokeWidth="1.5" />
                <text x="-9" y="-8" textAnchor="middle" fill="#0f172a" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                  {c.allele1}
                </text>

                {/* Allele Marker Locus 2 (Dihybrid) */}
                {c.allele2 && (
                  <g>
                    <circle cx="9" cy="10" r="5.5" fill="#ffffff" stroke={c.secondaryColor || c.color} strokeWidth="1.5" />
                    <text x="9" y="12" textAnchor="middle" fill="#0f172a" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                      {c.allele2}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

        {/* Stage 4: Finished Haploid Gametes (Egg vs Motile Sinusoidal Sperm) */}
        {stage === 4 && (
          <g className="animate-in fade-in duration-700">
            {parentType === "maternal" ? (
              // Large Round Non-Motile Eggs
              <g>
                <g transform="translate(85, 100)">
                  <circle cx="0" cy="0" r="28" fill="#fdf4ff" stroke="#8b5cf6" strokeWidth="3" />
                  <circle cx="0" cy="0" r="10" fill="#8b5cf6" opacity="0.6" />
                  <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    {chromosomes.filter((c) => c.pole === 1).map((c) => c.allele1).join("") || "0"}
                  </text>
                </g>
                <g transform="translate(215, 100)">
                  <circle cx="0" cy="0" r="28" fill="#fdf4ff" stroke="#f59e0b" strokeWidth="3" />
                  <circle cx="0" cy="0" r="10" fill="#f59e0b" opacity="0.6" />
                  <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    {chromosomes.filter((c) => c.pole === 2).map((c) => c.allele1).join("") || "0"}
                  </text>
                </g>
              </g>
            ) : (
              // Motile Sperm with Active Sinusoidal Tail Whipping & Path Wobble
              <g>
                {/* Sperm 1 */}
                <g transform={`translate(${85 + Math.sin(time * 3) * 3}, ${100 + Math.cos(time * 3) * 2})`}>
                  <ellipse cx="0" cy="0" rx="14" ry="9" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2.2" />
                  <circle cx="-3" cy="0" r="5.5" fill="#3b82f6" opacity="0.75" />
                  <text x="-3" y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace">
                    {chromosomes.filter((c) => c.pole === 1).map((c) => c.allele1).join("") || "0"}
                  </text>
                  {/* Dynamic Sinusoidal Flagellum Tail Path */}
                  <path
                    d={`M 14 0 Q ${26 + Math.sin(time * 12) * 5} ${-8 * Math.cos(time * 12)} 38 0 T ${60 + Math.sin(time * 12) * 4} ${
                      6 * Math.sin(time * 12)
                    }`}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </g>

                {/* Sperm 2 */}
                <g transform={`translate(${215 + Math.sin(time * 3 + 1) * 3}, ${100 + Math.cos(time * 3 + 1) * 2})`}>
                  <ellipse cx="0" cy="0" rx="14" ry="9" fill="#eff6ff" stroke="#f59e0b" strokeWidth="2.2" />
                  <circle cx="-3" cy="0" r="5.5" fill="#f59e0b" opacity="0.75" />
                  <text x="-3" y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace">
                    {chromosomes.filter((c) => c.pole === 2).map((c) => c.allele1).join("") || "0"}
                  </text>
                  <path
                    d={`M 14 0 Q ${26 + Math.sin(time * 12 + 1) * 5} ${-8 * Math.cos(time * 12 + 1)} 38 0 T ${
                      60 + Math.sin(time * 12 + 1) * 4
                    } ${6 * Math.sin(time * 12 + 1)}`}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </g>
              </g>
            )}
          </g>
        )}
      </svg>

      {/* Eased Phase Bar */}
      <div className="flex items-center justify-between w-full text-[10px] font-mono text-muted-foreground px-2">
        <span className={stage === 0 ? "text-primary font-bold" : ""}>Interphase</span>
        <span>&rarr;</span>
        <span className={stage === 1 ? "text-primary font-bold" : ""}>Metaphase I</span>
        <span>&rarr;</span>
        <span className={stage === 2 ? "text-primary font-bold" : ""}>Anaphase I</span>
        <span>&rarr;</span>
        <span className={stage >= 3 ? "text-primary font-bold" : ""}>Gametes</span>
      </div>
    </div>
  );
}
