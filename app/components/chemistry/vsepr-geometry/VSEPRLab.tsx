"use client";

import React, { useState, useMemo, useEffect } from "react";
import Molecule3DViewport, { AtomDomain } from "@/app/components/shared/3DMoleculeViewport";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import {
  Layers,
  Sliders,
  Sparkles,
  CheckCircle2,
  Maximize2,
  RotateCcw,
  Lightbulb,
  Play,
  Pause,
  ArrowRight,
  Zap,
  BookOpen,
  Plus,
  Trash2,
  Compass,
} from "lucide-react";

export interface VSEPRPreset {
  id: string;
  name: string;
  formula: string;
  bonds: number;
  lonePairs: number;
  electronGeometry: string;
  molecularGeometry: string;
  idealAngle: string;
  hybridization: string;
}

export const VSEPR_PRESETS: VSEPRPreset[] = [
  { id: "ax2", name: "Beryllium Chloride", formula: "BeCl₂", bonds: 2, lonePairs: 0, electronGeometry: "Linear", molecularGeometry: "Linear", idealAngle: "180°", hybridization: "sp" },
  { id: "ax3", name: "Boron Trifluoride", formula: "BF₃", bonds: 3, lonePairs: 0, electronGeometry: "Trigonal Planar", molecularGeometry: "Trigonal Planar", idealAngle: "120°", hybridization: "sp²" },
  { id: "ax2e", name: "Sulfur Dioxide", formula: "SO₂", bonds: 2, lonePairs: 1, electronGeometry: "Trigonal Planar", molecularGeometry: "Bent (V-Shaped)", idealAngle: "< 120° (~119°)", hybridization: "sp²" },
  { id: "ax4", name: "Methane", formula: "CH₄", bonds: 4, lonePairs: 0, electronGeometry: "Tetrahedral", molecularGeometry: "Tetrahedral", idealAngle: "109.5°", hybridization: "sp³" },
  { id: "ax3e", name: "Ammonia", formula: "NH₃", bonds: 3, lonePairs: 1, electronGeometry: "Tetrahedral", molecularGeometry: "Trigonal Pyramidal", idealAngle: "107°", hybridization: "sp³" },
  { id: "ax2e2", name: "Water", formula: "H₂O", bonds: 2, lonePairs: 2, electronGeometry: "Tetrahedral", molecularGeometry: "Bent (V-Shaped)", idealAngle: "104.5°", hybridization: "sp³" },
  { id: "ax5", name: "Phosphorus Pentachloride", formula: "PCl₅", bonds: 5, lonePairs: 0, electronGeometry: "Trigonal Bipyramidal", molecularGeometry: "Trigonal Bipyramidal", idealAngle: "90° & 120°", hybridization: "sp³d" },
  { id: "ax4e", name: "Sulfur Tetrafluoride", formula: "SF₄", bonds: 4, lonePairs: 1, electronGeometry: "Trigonal Bipyramidal", molecularGeometry: "Seesaw", idealAngle: "87° & 102°", hybridization: "sp³d" },
  { id: "ax3e2", name: "Chlorine Trifluoride", formula: "ClF₃", bonds: 3, lonePairs: 2, electronGeometry: "Trigonal Bipyramidal", molecularGeometry: "T-Shaped", idealAngle: "87.5°", hybridization: "sp³d" },
  { id: "ax2e3", name: "Xenon Difluoride", formula: "XeF₂", bonds: 2, lonePairs: 3, electronGeometry: "Trigonal Bipyramidal", molecularGeometry: "Linear", idealAngle: "180°", hybridization: "sp³d" },
  { id: "ax6", name: "Sulfur Hexafluoride", formula: "SF₆", bonds: 6, lonePairs: 0, electronGeometry: "Octahedral", molecularGeometry: "Octahedral", idealAngle: "90°", hybridization: "sp³d²" },
  { id: "ax5e", name: "Bromine Pentafluoride", formula: "BrF₅", bonds: 5, lonePairs: 1, electronGeometry: "Octahedral", molecularGeometry: "Square Pyramidal", idealAngle: "84.8°", hybridization: "sp³d²" },
  { id: "ax4e2", name: "Xenon Tetrafluoride", formula: "XeF₄", bonds: 4, lonePairs: 2, electronGeometry: "Octahedral", molecularGeometry: "Square Planar", idealAngle: "90°", hybridization: "sp³d²" },
];

export default function VSEPRLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "chemistry/vsepr-geometry",
    "chemistry",
    "simulation"
  );

  const [selectedPresetId, setSelectedPresetId] = useState<string>("ax2e2"); // default Water
  const [numBonds, setNumBonds] = useState<number>(2);
  const [numLonePairs, setNumLonePairs] = useState<number>(2);
  const [showDipole, setShowDipole] = useState<boolean>(true);

  // Quick Quiz
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  // Select a preset
  const handleSelectPreset = (preset: VSEPRPreset) => {
    setSelectedPresetId(preset.id);
    setNumBonds(preset.bonds);
    setNumLonePairs(preset.lonePairs);
    completeExperiment();
  };

  const totalDomains = numBonds + numLonePairs;

  // Compute Hybridization dynamically from domain count
  const computedHybridization = useMemo(() => {
    switch (totalDomains) {
      case 2: return "sp";
      case 3: return "sp²";
      case 4: return "sp³";
      case 5: return "sp³d";
      case 6: return "sp³d²";
      default: return "sp³";
    }
  }, [totalDomains]);

  // Compute Electron Geometry
  const computedElectronGeometry = useMemo(() => {
    switch (totalDomains) {
      case 2: return "Linear";
      case 3: return "Trigonal Planar";
      case 4: return "Tetrahedral";
      case 5: return "Trigonal Bipyramidal";
      case 6: return "Octahedral";
      default: return "Tetrahedral";
    }
  }, [totalDomains]);

  // Compute Molecular Geometry
  const computedMolecularGeometry = useMemo(() => {
    const match = VSEPR_PRESETS.find((p) => p.bonds === numBonds && p.lonePairs === numLonePairs);
    return match ? match.molecularGeometry : `${computedElectronGeometry} (${numLonePairs} lone pairs)`;
  }, [numBonds, numLonePairs, computedElectronGeometry]);

  // Electrostatic Repulsion Solver to compute 3D domain coordinates
  const domains: AtomDomain[] = useMemo(() => {
    const list: AtomDomain[] = [];

    // Pre-calculated minimum electrostatic energy orientations for standard domain counts
    let basePositions: { x: number; y: number; z: number }[] = [];

    if (totalDomains === 2) {
      basePositions = [{ x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 }];
    } else if (totalDomains === 3) {
      basePositions = [
        { x: 0, y: 1, z: 0 },
        { x: Math.cos(Math.PI / 6), y: -Math.sin(Math.PI / 6), z: 0 },
        { x: -Math.cos(Math.PI / 6), y: -Math.sin(Math.PI / 6), z: 0 },
      ];
    } else if (totalDomains === 4) {
      // Tetrahedral vertices
      basePositions = [
        { x: 0, y: 1, z: 0 },
        { x: Math.sqrt(8 / 9), y: -1 / 3, z: 0 },
        { x: -Math.sqrt(2 / 9), y: -1 / 3, z: Math.sqrt(2 / 3) },
        { x: -Math.sqrt(2 / 9), y: -1 / 3, z: -Math.sqrt(2 / 3) },
      ];
    } else if (totalDomains === 5) {
      // Trigonal Bipyramidal (2 axial, 3 equatorial)
      basePositions = [
        { x: 0, y: 1, z: 0 }, // axial top
        { x: 0, y: -1, z: 0 }, // axial bottom
        { x: 1, y: 0, z: 0 }, // eq 1
        { x: -0.5, y: 0, z: Math.sqrt(3) / 2 }, // eq 2
        { x: -0.5, y: 0, z: -Math.sqrt(3) / 2 }, // eq 3
      ];
    } else if (totalDomains === 6) {
      // Octahedral
      basePositions = [
        { x: 0, y: 1, z: 0 },
        { x: 0, y: -1, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: -1, y: 0, z: 0 },
        { x: 0, y: 0, z: 1 },
        { x: 0, y: 0, z: -1 },
      ];
    }

    // Allocate bonds first, then lone pairs
    for (let i = 0; i < totalDomains; i++) {
      const isBond = i < numBonds;
      const pos = basePositions[i] || { x: Math.cos(i), y: Math.sin(i), z: 0 };

      list.push({
        id: `domain-${i}`,
        type: isBond ? "bond" : "lone_pair",
        color: isBond ? "#38bdf8" : "#f59e0b",
        label: isBond ? `X${i + 1}` : undefined,
        x: pos.x,
        y: pos.y,
        z: pos.z,
      });
    }

    return list;
  }, [totalDomains, numBonds]);

  // Compute Net Dipole Moment Vector
  const dipoleVector = useMemo(() => {
    let dx = 0;
    let dy = 0;
    let dz = 0;

    domains.forEach((dom) => {
      if (dom.type === "bond") {
        dx += dom.x * 0.5;
        dy += dom.y * 0.5;
        dz += dom.z * 0.5;
      }
    });

    return { x: dx, y: dy, z: dz };
  }, [domains]);

  // AI Chat registration
  useEffect(() => {
    setExperimentData({
      title: "3D Molecular Geometry & VSEPR Studio",
      theory: "Valence Shell Electron Pair Repulsion theory: electrostatic repulsion between bonding pairs and lone pairs minimizes pairwise energy, determining electron domain geometry, molecular geometry, and bond angle distortions.",
      extraContext: { numBonds, numLonePairs, electronGeometry: computedElectronGeometry, molecularGeometry: computedMolecularGeometry, hybridization: computedHybridization },
    });
  }, [numBonds, numLonePairs, computedElectronGeometry, computedMolecularGeometry, computedHybridization, setExperimentData]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* Top Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <Compass size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                3D Molecular Geometry &amp; VSEPR Studio
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                Inorganic Chemistry
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Rotatable 3D electrostatic domain repulsions, orbital hybridization, bond angle distortion, and net dipole moment vectors
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive 3D Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: 3D Molecule Viewport (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Rotatable 3D VSEPR Scene (Drag to Orbit)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDipole(!showDipole)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                  showDipole
                    ? "bg-rose-500/20 border-rose-500 text-rose-500"
                    : "bg-muted/40 border-border text-muted-foreground"
                }`}
              >
                {showDipole ? "Dipole Vector: ON" : "Dipole Vector: OFF"}
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="flex justify-center p-2 bg-slate-950 rounded-2xl border border-border/80 shadow-2xl">
            <Molecule3DViewport
              width={560}
              height={320}
              centralAtom={{ label: "A", color: "#6366f1", radius: 24 }}
              domains={domains}
              showDipole={showDipole}
              dipoleVector={dipoleVector}
            />
          </div>

          {/* Custom Domain Builder Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-muted/20 border border-border/60 rounded-2xl">
            {/* Bonding Pairs */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-foreground">Bonding Pairs (X):</span>
                <span className="font-black text-sky-500">{numBonds}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNumBonds(Math.max(1, numBonds - 1))}
                  disabled={numBonds <= 1}
                  className="px-3 py-1 bg-muted hover:bg-accent border border-border rounded-xl text-xs font-bold disabled:opacity-40"
                >
                  -
                </button>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={numBonds}
                  onChange={(e) => setNumBonds(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <button
                  onClick={() => setNumBonds(Math.min(6, numBonds + 1))}
                  disabled={totalDomains >= 6}
                  className="px-3 py-1 bg-muted hover:bg-accent border border-border rounded-xl text-xs font-bold disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            {/* Lone Pairs */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-foreground">Lone Pairs (E):</span>
                <span className="font-black text-amber-500">{numLonePairs}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNumLonePairs(Math.max(0, numLonePairs - 1))}
                  disabled={numLonePairs <= 0}
                  className="px-3 py-1 bg-muted hover:bg-accent border border-border rounded-xl text-xs font-bold disabled:opacity-40"
                >
                  -
                </button>
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={numLonePairs}
                  onChange={(e) => setNumLonePairs(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <button
                  onClick={() => setNumLonePairs(Math.min(3, numLonePairs + 1))}
                  disabled={totalDomains >= 6}
                  className="px-3 py-1 bg-muted hover:bg-accent border border-border rounded-xl text-xs font-bold disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Structural Analysis & Preset Selector (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Structural &amp; Electronic Metrics
              </span>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-muted/40 rounded-2xl border border-border space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold">Electron Geometry</span>
              <span className="text-sm font-black text-foreground block">{computedElectronGeometry}</span>
            </div>
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 space-y-1">
              <span className="text-[10px] text-primary uppercase font-sans font-bold">Molecular Shape</span>
              <span className="text-sm font-black text-primary block">{computedMolecularGeometry}</span>
            </div>
            <div className="p-3 bg-muted/40 rounded-2xl border border-border space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold">Steric Number</span>
              <span className="text-sm font-black text-foreground block">{totalDomains} Domains</span>
            </div>
            <div className="p-3 bg-muted/40 rounded-2xl border border-border space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold">Hybridization</span>
              <span className="text-sm font-black text-indigo-500 block">{computedHybridization}</span>
            </div>
          </div>

          {/* Molecule Presets Grid */}
          <div className="space-y-2 pt-2 border-t border-border">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block font-mono">
              Representative Molecular Presets:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1">
              {VSEPR_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;

                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-primary/20 border-primary ring-2 ring-primary/40 shadow-sm"
                        : "bg-muted/30 hover:bg-accent border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-foreground">{preset.formula}</span>
                      <span className="text-[9px] font-mono text-muted-foreground">{preset.hybridization}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground truncate block mt-0.5">
                      {preset.molecularGeometry}
                    </span>
                  </button>
                );
              })}
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
              <h3 className="text-sm font-bold text-foreground">Why is the H-O-H bond angle in water (104.5°) smaller than the ideal tetrahedral angle (109.5°)?</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Lone pairs exert stronger electrostatic repulsion than bonding pairs, compressing the bond angle",
            "Because hydrogen atoms are positively charged and repel oxygen",
            "Because water molecules are planar",
            "Because sp² hybridization only allows 90° angles",
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
