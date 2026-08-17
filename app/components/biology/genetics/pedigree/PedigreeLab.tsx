"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { InheritanceMode } from "../types";
import PunnettGridEngine from "../shared/PunnettGridEngine";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import {
  Users,
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
  GitBranch,
  ShieldAlert,
  BookOpen,
  HelpCircle,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";

export type PhenotypeState = "unaffected" | "carrier" | "affected";

export interface TreeNode {
  id: string;
  label: string;
  gender: "male" | "female";
  generation: 1 | 2;
  state: PhenotypeState;
  genotype?: string;
  isCustomAdded?: boolean;
}

// Procedural SVG Pedigree Symbol Component
function PedigreeSymbol({
  gender,
  state,
  isSelected,
  hasConflict,
  size = 54,
}: {
  gender: "male" | "female";
  state: PhenotypeState;
  isSelected?: boolean;
  hasConflict?: boolean;
  size?: number;
}) {
  const isSquare = gender === "male";
  const strokeColor = hasConflict ? "#f59e0b" : isSelected ? "#6366f1" : "#475569";
  const strokeWidth = isSelected || hasConflict ? 3 : 2;
  const patternId = `mottled-carrier-${gender}-${size}`;

  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={`shrink-0 transition-transform duration-200 ${hasConflict ? "animate-shake" : "hover:scale-105"}`}>
      <defs>
        {/* Mottled Carrier Texture */}
        <pattern id={patternId} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="8" fill="#f59e0b" />
          <rect x="4" width="4" height="8" fill="#ffffff" />
        </pattern>
      </defs>

      {isSquare ? (
        // Male (Square)
        <rect
          x="8"
          y="8"
          width="44"
          height="44"
          rx="6"
          fill={state === "affected" ? "#ef4444" : state === "carrier" ? `url(#${patternId})` : "#ffffff"}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      ) : (
        // Female (Circle)
        <circle
          cx="30"
          cy="30"
          r="22"
          fill={state === "affected" ? "#ef4444" : state === "carrier" ? `url(#${patternId})` : "#ffffff"}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      )}

      {/* Selected Indicator Ring */}
      {isSelected && (
        <circle cx="30" cy="30" r="27" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="3 3" />
      )}

      {/* Conflict Warning Dot */}
      {hasConflict && (
        <circle cx="48" cy="12" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
      )}
    </svg>
  );
}

export default function PedigreeLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "biology/genetics/pedigree",
    "biology",
    "exploration"
  );

  const [mode, setMode] = useState<InheritanceMode>("autosomal_recessive");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("I-1");

  // Initial Tree State
  const initialNodes: TreeNode[] = [
    { id: "I-1", label: "Father", gender: "male", generation: 1, state: "carrier", genotype: "Aa" },
    { id: "I-2", label: "Mother", gender: "female", generation: 1, state: "carrier", genotype: "Aa" },
    { id: "II-1", label: "Son 1", gender: "male", generation: 2, state: "unaffected", genotype: "AA" },
    { id: "II-2", label: "Daughter 1", gender: "female", generation: 2, state: "affected", genotype: "aa" },
    { id: "II-3", label: "Son 2", gender: "male", generation: 2, state: "carrier", genotype: "Aa" },
  ];

  const [nodes, setNodes] = useState<TreeNode[]>(initialNodes);
  const [tracingAlleles, setTracingAlleles] = useState<boolean>(false);
  const [isBirthAnimating, setIsBirthAnimating] = useState<boolean>(false);

  // Time ticker for dynamic sine-wave mismatch pulses
  const [time, setTime] = useState<number>(0);
  useEffect(() => {
    let animId: number;
    let start = performance.now();
    const loop = (now: number) => {
      setTime((now - start) / 1000);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Quick Quiz
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  // Biological Parents
  const father = nodes.find((n) => n.id === "I-1") || nodes[0];
  const mother = nodes.find((n) => n.id === "I-2") || nodes[1];
  const children = nodes.filter((n) => n.generation === 2);

  // Compute Mendelian Conflicts for each child based on selected mode
  const conflicts = useMemo(() => {
    const conflictMap: Record<string, boolean> = {};

    children.forEach((child) => {
      let isMismatch = false;

      if (mode === "autosomal_recessive") {
        // If both parents are unaffected/clear (AA x AA), child cannot be affected (aa)
        if (father.state === "unaffected" && mother.state === "unaffected" && child.state === "affected") {
          isMismatch = true;
        }
        // If both parents are affected (aa x aa), all children MUST be affected (aa)
        if (father.state === "affected" && mother.state === "affected" && child.state !== "affected") {
          isMismatch = true;
        }
      } else if (mode === "autosomal_dominant") {
        // If both parents are unaffected (aa x aa), no child can be affected (A_)
        if (father.state === "unaffected" && mother.state === "unaffected" && child.state === "affected") {
          isMismatch = true;
        }
      } else if (mode === "x_linked_recessive") {
        // Affected mother (X^b X^b) MUST produce 100% affected sons (X^b Y)
        if (mother.state === "affected" && child.gender === "male" && child.state !== "affected") {
          isMismatch = true;
        }
        // Unaffected father (X^B Y) cannot have affected daughter (X^b X^b)
        if (father.state === "unaffected" && child.gender === "female" && child.state === "affected") {
          isMismatch = true;
        }
      } else if (mode === "x_linked_dominant") {
        // Affected father (X^D Y) passes trait to 100% of daughters (X^D X)
        if (father.state === "affected" && child.gender === "female" && child.state === "unaffected") {
          isMismatch = true;
        }
        // Affected father cannot pass X to sons
        if (father.state === "affected" && mother.state === "unaffected" && child.gender === "male" && child.state === "affected") {
          isMismatch = true;
        }
      }

      conflictMap[child.id] = isMismatch;
    });

    return conflictMap;
  }, [father, mother, children, mode]);

  const hasAnyConflict = Object.values(conflicts).some(Boolean);

  // AI Chat registration
  useEffect(() => {
    setExperimentData({
      title: "Pedigree & Inheritance Tree Studio",
      theory: "Interactive clinical family pedigree: node phenotype toggling, live allele particle line-tracing, Mendelian violation detection, live mini-Punnett offspring generation, and hypothesis testing.",
      extraContext: { mode, numChildren: children.length, hasAnyConflict },
    });
  }, [mode, children.length, hasAnyConflict, setExperimentData]);

  // Toggle Node State (Unaffected -> Carrier -> Affected -> Unaffected)
  const handleToggleState = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== nodeId) return n;
        const nextState: PhenotypeState =
          n.state === "unaffected" ? "carrier" : n.state === "carrier" ? "affected" : "unaffected";

        // Inferred Genotypes based on state and mode
        let nextGenotype = "AA";
        if (mode === "autosomal_recessive") {
          nextGenotype = nextState === "affected" ? "aa" : nextState === "carrier" ? "Aa" : "AA";
        } else if (mode === "autosomal_dominant") {
          nextGenotype = nextState === "affected" ? "Aa" : "aa";
        } else if (mode === "x_linked_recessive") {
          if (n.gender === "male") nextGenotype = nextState === "affected" ? "XᵇY" : "XᴮY";
          else nextGenotype = nextState === "affected" ? "XᵇXᵇ" : nextState === "carrier" ? "XᴮXᵇ" : "XᴮXᴮ";
        } else if (mode === "x_linked_dominant") {
          if (n.gender === "male") nextGenotype = nextState === "affected" ? "XᴰY" : "XᵈY";
          else nextGenotype = nextState === "affected" ? "XᴰXᵈ" : "XᵈXᵈ";
        }

        return { ...n, state: nextState, genotype: nextGenotype };
      })
    );

    // Trigger allele particle animation
    setTracingAlleles(true);
    setTimeout(() => setTracingAlleles(false), 800);
    completeExperiment();
  };

  // Add Child (Offspring Generator)
  const handleAddChild = (forcedOutcome?: PhenotypeState) => {
    setIsBirthAnimating(true);
    setTimeout(() => {
      const childCount = children.length + 1;
      const gender: "male" | "female" = Math.random() > 0.5 ? "male" : "female";
      const state: PhenotypeState = forcedOutcome || (Math.random() > 0.6 ? "carrier" : Math.random() > 0.5 ? "affected" : "unaffected");

      const newChild: TreeNode = {
        id: `II-${childCount}`,
        label: `${gender === "male" ? "Son" : "Daughter"} ${childCount}`,
        gender,
        generation: 2,
        state,
        genotype: state === "affected" ? "aa" : state === "carrier" ? "Aa" : "AA",
        isCustomAdded: true,
      };

      setNodes((prev) => [...prev, newChild]);
      setSelectedNodeId(newChild.id);
      setIsBirthAnimating(false);
      completeExperiment();
    }, 1200);
  };

  // Remove Child
  const handleRemoveChild = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* Top Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <GitBranch size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Pedigree &amp; Inheritance Tree Studio
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                Medical Genetics Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Direct node manipulation, live branch allele particle tracing, Mendelian conflict detection, and live mini-Punnett offspring generation
            </p>
          </div>
        </div>

        {/* Mode Selector (Hypothesis Testing) */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border flex-wrap">
          {(
            [
              { id: "autosomal_recessive", label: "Autosomal Recessive" },
              { id: "autosomal_dominant", label: "Autosomal Dominant" },
              { id: "x_linked_recessive", label: "X-Linked Recessive" },
              { id: "x_linked_dominant", label: "X-Linked Dominant" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setMode(opt.id);
                completeExperiment();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === opt.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hypothesis Status / Conflict Banner */}
      <div
        className={`p-4 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          hasAnyConflict
            ? "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400"
            : "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
              hasAnyConflict ? "bg-amber-500/20 text-amber-500" : "bg-emerald-500/20 text-emerald-500"
            }`}
          >
            {hasAnyConflict ? <ShieldAlert size={20} /> : <CheckCircle2 size={20} />}
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider">
              {hasAnyConflict ? "Mendelian Conflict Detected" : "Hypothesis Supported (All Branches Calm)"}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {hasAnyConflict
                ? "One or more offspring phenotypes violate Mendelian transmission rules for the current mode. Click any node to adjust states."
                : "Pedigree transmission is 100% consistent with the selected mode of inheritance."}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono bg-card px-3 py-1.5 rounded-2xl border border-border">
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-white border border-slate-600" /> Male
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-white border border-slate-600" /> Female
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-rose-500" /> Affected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-400" /> Carrier
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive Family Tree Diagram (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Interactive Family Pedigree Tree
              </span>
            </div>

            <span className="text-xs font-mono font-bold text-muted-foreground">
              Click any individual to toggle phenotype state
            </span>
          </div>

          {/* SVG Pedigree Tree Canvas */}
          <div className="flex-1 flex flex-col justify-around min-h-[380px] p-6 bg-muted/20 rounded-2xl border border-border/60 select-none relative overflow-hidden">
            {/* SVG Connecting Branches & Allele Particles */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Horizontal Parent Mating Line */}
              <line x1="38%" y1="90" x2="62%" y2="90" stroke="#64748b" strokeWidth="2.5" />
              {/* Descent Stem from Mating Bar */}
              <line x1="50%" y1="90" x2="50%" y2="150" stroke="#64748b" strokeWidth="2.5" />
              {/* Horizontal Sibling Crossbar */}
              <line x1="18%" y1="150" x2="82%" y2="150" stroke="#64748b" strokeWidth="2.5" />

              {/* Individual Offspring Descent Lines with Conflict Ripple */}
              {children.map((child, idx) => {
                const childX = `${18 + (idx / Math.max(1, children.length - 1)) * 64}%`;
                const isConflicted = conflicts[child.id];
                const strokeColor = isConflicted ? "#f59e0b" : "#64748b";
                const strokeWidth = isConflicted ? 3.5 : 2;

                return (
                  <g key={`branch-${child.id}`}>
                    <line
                      x1={childX}
                      y1="150"
                      x2={childX}
                      y2="230"
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={isConflicted ? "4 2" : "none"}
                    />
                    {/* Animated Allele Particle along branch */}
                    {tracingAlleles && (
                      <circle cx={childX} cy="190" r="4.5" fill="#818cf8" className="animate-ping" />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Generation I (Parents) */}
            <div className="space-y-2 z-10">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-muted border border-border text-muted-foreground">
                Generation I
              </span>

              <div className="flex items-center justify-center gap-16 pt-2">
                {[father, mother].map((parent) => {
                  const isSelected = selectedNodeId === parent.id;

                  return (
                    <div key={parent.id} className="flex flex-col items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedNodeId(parent.id);
                          handleToggleState(parent.id);
                        }}
                        className="focus:outline-none"
                      >
                        <PedigreeSymbol
                          gender={parent.gender}
                          state={parent.state}
                          isSelected={isSelected}
                          size={58}
                        />
                      </button>
                      <span className="text-xs font-mono font-bold text-foreground">{parent.label}</span>
                      <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                        {parent.genotype}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Generation II (Offspring + Add Trigger) */}
            <div className="space-y-2 z-10 pt-16">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-muted border border-border text-muted-foreground">
                Generation II
              </span>

              <div className="flex items-center justify-around gap-4 pt-2 flex-wrap">
                {children.map((child) => {
                  const isSelected = selectedNodeId === child.id;
                  const isConflicted = conflicts[child.id];

                  return (
                    <div key={child.id} className="flex flex-col items-center gap-1.5 relative group">
                      <button
                        onClick={() => {
                          setSelectedNodeId(child.id);
                          handleToggleState(child.id);
                        }}
                        className="focus:outline-none"
                      >
                        <PedigreeSymbol
                          gender={child.gender}
                          state={child.state}
                          isSelected={isSelected}
                          hasConflict={isConflicted}
                          size={52}
                        />
                      </button>
                      <span className="text-xs font-mono font-bold text-foreground">{child.label}</span>
                      <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                        {child.genotype}
                      </span>

                      {/* Remove custom child button */}
                      {child.isCustomAdded && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveChild(child.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-rose-500 text-white rounded-full absolute -top-2 -right-2 shadow-md"
                        >
                          <Trash2 size={10} />
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* Empty dashed '+' Offspring Generator Node (Animation Sequence 2) */}
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    onClick={() => handleAddChild()}
                    disabled={isBirthAnimating || children.length >= 6}
                    className="w-13 h-13 rounded-2xl border-2 border-dashed border-primary/60 hover:border-primary bg-primary/5 hover:bg-primary/15 flex flex-col items-center justify-center text-primary transition-all shadow-sm active:scale-95 disabled:opacity-40"
                  >
                    <Plus size={20} />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-muted-foreground">Add Offspring</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Mini-Punnett Grid & Offspring Birth Studio (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Live Couple Punnett Cross &amp; Birth Generator
              </span>
            </div>

            <button
              onClick={() => handleAddChild()}
              disabled={isBirthAnimating || children.length >= 6}
              className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-1.5 shrink-0"
            >
              <Plus size={14} />
              <span>{isBirthAnimating ? "Fertilizing Zygote..." : "Sample Birth"}</span>
            </button>
          </div>

          {/* Mini-Fertilization Fusion Animation Banner */}
          {isBirthAnimating && (
            <div className="p-3.5 bg-purple-500/20 border border-purple-500/40 rounded-2xl flex items-center justify-center gap-3 animate-in fade-in">
              <div className="w-4 h-4 rounded-full bg-blue-500 animate-ping" />
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                Gametes Fusing &rarr; New Offspring Born into Generation II!
              </span>
            </div>
          )}

          {/* Live Mini-Punnett Grid for Active Parents */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-muted-foreground font-sans block">
              Parental Mating Cross ({father.genotype} &times; {mother.genotype}):
            </span>

            <PunnettGridEngine
              gridSize={2}
              gametes1={[{ label: father.genotype?.[0] || "A" }, { label: father.genotype?.[1] || "a" }]}
              gametes2={[{ label: mother.genotype?.[0] || "A" }, { label: mother.genotype?.[1] || "a" }]}
              grid={[
                [
                  {
                    g1: father.genotype?.[0] || "A",
                    g2: mother.genotype?.[0] || "A",
                    genotype: `${father.genotype?.[0] || "A"}${mother.genotype?.[0] || "A"}`,
                    phenotype: "Normal",
                  },
                  {
                    g1: father.genotype?.[0] || "A",
                    g2: mother.genotype?.[1] || "a",
                    genotype: `${father.genotype?.[0] || "A"}${mother.genotype?.[1] || "a"}`,
                    phenotype: "Carrier",
                  },
                ],
                [
                  {
                    g1: father.genotype?.[1] || "a",
                    g2: mother.genotype?.[0] || "A",
                    genotype: `${father.genotype?.[1] || "a"}${mother.genotype?.[0] || "A"}`,
                    phenotype: "Carrier",
                  },
                  {
                    g1: father.genotype?.[1] || "a",
                    g2: mother.genotype?.[1] || "a",
                    genotype: `${father.genotype?.[1] || "a"}${mother.genotype?.[1] || "a"}`,
                    phenotype: "Affected",
                  },
                ],
              ]}
              onCellClick={(cell) => {
                // Click specific cell to force that birth outcome
                const targetState: PhenotypeState =
                  cell.phenotype === "Affected" ? "affected" : cell.phenotype === "Carrier" ? "carrier" : "unaffected";
                handleAddChild(targetState);
              }}
            />
          </div>

          {/* Selected Individual Inspector Deck */}
          <div className="space-y-3 font-mono text-xs pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground uppercase font-bold font-sans">
                Inspected Member Profile
              </span>
              <button
                onClick={() => handleToggleState(selectedNode.id)}
                className="px-2.5 py-1 bg-muted hover:bg-accent border border-border rounded-xl text-[11px] font-bold text-primary flex items-center gap-1"
              >
                <RefreshCw size={12} />
                <span>Toggle State</span>
              </button>
            </div>

            <div className="p-3.5 bg-muted/40 rounded-2xl space-y-2 border border-border/60">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-sans">Individual ID:</span>
                <span className="font-black text-foreground">{selectedNode.label} ({selectedNode.id})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-sans">Biological Sex:</span>
                <span className="font-bold text-foreground capitalize">{selectedNode.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-sans">Health Status:</span>
                <span
                  className={`font-bold capitalize ${
                    selectedNode.state === "affected"
                      ? "text-rose-500"
                      : selectedNode.state === "carrier"
                      ? "text-amber-500"
                      : "text-emerald-500"
                  }`}
                >
                  {selectedNode.state === "affected"
                    ? "Affected with Disorder"
                    : selectedNode.state === "carrier"
                    ? "Asymptomatic Carrier"
                    : "Unaffected / Clear"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-sans">Current Inferred Genotype:</span>
                <span className="font-black text-primary">{selectedNode.genotype}</span>
              </div>
            </div>
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
              <h3 className="text-sm font-bold text-foreground">
                In an Autosomal Recessive pedigree, what can you deduce if two unaffected parents produce an affected child?
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Both parents must be heterozygous carriers (Aa x Aa)",
            "The trait is impossible and violates Mendelian genetics",
            "The trait must be X-linked dominant",
            "The child cannot transmit the allele to future generations",
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
