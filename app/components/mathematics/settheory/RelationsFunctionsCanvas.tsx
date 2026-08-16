"use client";

import React, { useState, useMemo } from "react";
import { RelationMapping } from "./types";
import { classifyFunctionMapping, checkEquivalenceRelation } from "./lib/setMath";
import {
  Share2,
  Sliders,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function RelationsFunctionsCanvas() {
  const [domain, setDomain] = useState<string[]>(["1", "2", "3", "4"]);
  const [codomain, setCodomain] = useState<string[]>(["A", "B", "C", "D"]);
  const [mappings, setMappings] = useState<RelationMapping[]>([
    { from: "1", to: "A" },
    { from: "2", to: "B" },
    { from: "3", to: "C" },
    { from: "4", to: "D" },
  ]);

  const [selectedFrom, setSelectedFrom] = useState<string | null>(null);
  const [isEquivMode, setIsEquivMode] = useState(false);

  // New element inputs
  const [newDomainVal, setNewDomainVal] = useState("");
  const [newCodomainVal, setNewCodomainVal] = useState("");

  // Function classification calculation
  const classification = useMemo(
    () => classifyFunctionMapping(domain, codomain, mappings),
    [domain, codomain, mappings]
  );

  // Equivalence relation calculation
  const equivProps = useMemo(() => {
    if (!isEquivMode) return null;
    return checkEquivalenceRelation(domain, mappings);
  }, [domain, mappings, isEquivMode]);

  const handleDomainNodeClick = (x: string) => {
    setSelectedFrom(x);
  };

  const handleCodomainNodeClick = (y: string) => {
    if (!selectedFrom) return;

    const exists = mappings.some(
      (m) => m.from === selectedFrom && m.to === y
    );

    if (exists) {
      setMappings(
        mappings.filter((m) => !(m.from === selectedFrom && m.to === y))
      );
    } else {
      setMappings([...mappings, { from: selectedFrom, to: y }]);
    }

    setSelectedFrom(null);
  };

  const handleAddDomainElem = () => {
    if (!newDomainVal.trim() || domain.includes(newDomainVal.trim())) return;
    setDomain([...domain, newDomainVal.trim()]);
    if (isEquivMode) setCodomain([...domain, newDomainVal.trim()]);
    setNewDomainVal("");
  };

  const handleAddCodomainElem = () => {
    if (!newCodomainVal.trim() || codomain.includes(newCodomainVal.trim())) return;
    setCodomain([...codomain, newCodomainVal.trim()]);
    setNewCodomainVal("");
  };

  const handleApplyPreset = (type: "bijective" | "injective_only" | "surjective_only" | "not_function" | "equivalence") => {
    switch (type) {
      case "bijective":
        setIsEquivMode(false);
        setDomain(["1", "2", "3", "4"]);
        setCodomain(["A", "B", "C", "D"]);
        setMappings([
          { from: "1", to: "A" },
          { from: "2", to: "B" },
          { from: "3", to: "C" },
          { from: "4", to: "D" },
        ]);
        break;
      case "injective_only":
        setIsEquivMode(false);
        setDomain(["1", "2", "3"]);
        setCodomain(["A", "B", "C", "D"]);
        setMappings([
          { from: "1", to: "A" },
          { from: "2", to: "B" },
          { from: "3", to: "C" },
        ]);
        break;
      case "surjective_only":
        setIsEquivMode(false);
        setDomain(["1", "2", "3", "4"]);
        setCodomain(["A", "B", "C"]);
        setMappings([
          { from: "1", to: "A" },
          { from: "2", to: "B" },
          { from: "3", to: "C" },
          { from: "4", to: "C" },
        ]);
        break;
      case "not_function":
        setIsEquivMode(false);
        setDomain(["1", "2", "3", "4"]);
        setCodomain(["A", "B", "C", "D"]);
        setMappings([
          { from: "1", to: "A" },
          { from: "1", to: "B" },
          { from: "2", to: "C" },
        ]);
        break;
      case "equivalence":
        setIsEquivMode(true);
        setDomain(["1", "2", "3"]);
        setCodomain(["1", "2", "3"]);
        setMappings([
          { from: "1", to: "1" },
          { from: "2", to: "2" },
          { from: "3", to: "3" },
          { from: "1", to: "2" },
          { from: "2", to: "1" },
        ]);
        break;
    }
  };

  const width = 540;
  const height = 360;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Mapping Bipartite Arrow Canvas (7 cols) ───── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Share2 size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              {isEquivMode ? "Binary Relation R ⊆ X × X" : "Function Mapping (f: X → Y)"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setIsEquivMode((e) => !e);
                if (!isEquivMode) {
                  setCodomain([...domain]);
                }
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                isEquivMode
                  ? "bg-primary text-primary-foreground shadow-sm font-black"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {isEquivMode ? "Equivalence Mode: ON" : "Function Mode"}
            </button>

            <button
              onClick={() => setMappings([])}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all"
              title="Clear all arrows"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {selectedFrom && (
          <div className="bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-3 py-1.5 rounded-xl mb-2 flex items-center gap-1.5">
            <span>Origin selected: &quot;{selectedFrom}&quot; &rarr; Click target in Set Y</span>
          </div>
        )}

        {/* SVG Bipartite Mapping Diagram */}
        <div className="flex-1 flex items-center justify-center min-h-[300px] bg-muted/20 rounded-2xl border border-border/50 overflow-hidden relative select-none">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-h-[360px]">
            <defs>
              <marker
                id="arrow-rel-up"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
              </marker>
            </defs>

            {/* Domain Ellipse X */}
            <ellipse cx="140" cy="180" rx="65" ry="140" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="2" />
            <text x="140" y="30" textAnchor="middle" className="fill-blue-500 font-mono text-xs font-black">
              Domain Set X ({domain.length})
            </text>

            {/* Codomain Ellipse Y */}
            <ellipse cx="400" cy="180" rx="65" ry="140" fill="#ec4899" fillOpacity="0.1" stroke="#ec4899" strokeWidth="2" />
            <text x="400" y="30" textAnchor="middle" className="fill-pink-500 font-mono text-xs font-black">
              Codomain Set Y ({codomain.length})
            </text>

            {/* Mapping Arrows */}
            {mappings.map((m, idx) => {
              const fromIdx = domain.indexOf(m.from);
              const toIdx = codomain.indexOf(m.to);
              if (fromIdx === -1 || toIdx === -1) return null;

              const y1 = 80 + (fromIdx * (height - 160)) / Math.max(1, domain.length - 1);
              const y2 = 80 + (toIdx * (height - 160)) / Math.max(1, codomain.length - 1);

              return (
                <line
                  key={`map-${idx}`}
                  x1="140"
                  y1={y1}
                  x2="400"
                  y2={y2}
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  markerEnd="url(#arrow-rel-up)"
                  className="transition-all hover:stroke-amber-500 hover:stroke-width-3 cursor-pointer"
                  onClick={() => setMappings(mappings.filter((_, i) => i !== idx))}
                />
              );
            })}

            {/* Domain Nodes */}
            {domain.map((x, i) => {
              const cy = 80 + (i * (height - 160)) / Math.max(1, domain.length - 1);
              const isSelected = selectedFrom === x;

              return (
                <g key={`dom-${x}`} transform={`translate(140, ${cy})`} className="cursor-pointer" onClick={() => handleDomainNodeClick(x)}>
                  <circle
                    r="16"
                    fill={isSelected ? "#f59e0b" : "#3b82f6"}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-transform hover:scale-110 shadow-sm"
                  />
                  <text y="4" textAnchor="middle" className="fill-white font-mono text-xs font-black pointer-events-none">
                    {x}
                  </text>
                </g>
              );
            })}

            {/* Codomain Nodes */}
            {codomain.map((y, i) => {
              const cy = 80 + (i * (height - 160)) / Math.max(1, codomain.length - 1);

              return (
                <g key={`cod-${y}`} transform={`translate(400, ${cy})`} className="cursor-pointer" onClick={() => handleCodomainNodeClick(y)}>
                  <circle
                    r="16"
                    fill="#ec4899"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-transform hover:scale-110 shadow-sm"
                  />
                  <text y="4" textAnchor="middle" className="fill-white font-mono text-xs font-black pointer-events-none">
                    {y}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Status Strip */}
        {!isEquivMode ? (
          <div className="grid grid-cols-4 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs mt-2">
            <div>
              <span className="text-[9px] font-bold uppercase text-muted-foreground block">Is Function?</span>
              <span className={`font-mono font-bold text-xs ${classification.isFunction ? "text-emerald-500" : "text-rose-500"}`}>
                {classification.isFunction ? "Yes" : "No"}
              </span>
            </div>

            <div>
              <span className="text-[9px] font-bold uppercase text-muted-foreground block">Injective (1-to-1)</span>
              <span className={`font-mono font-bold text-xs ${classification.isInjective ? "text-emerald-500" : "text-rose-500"}`}>
                {classification.isInjective ? "Yes" : "No"}
              </span>
            </div>

            <div>
              <span className="text-[9px] font-bold uppercase text-muted-foreground block">Surjective (Onto)</span>
              <span className={`font-mono font-bold text-xs ${classification.isSurjective ? "text-emerald-500" : "text-rose-500"}`}>
                {classification.isSurjective ? "Yes" : "No"}
              </span>
            </div>

            <div>
              <span className="text-[9px] font-bold uppercase text-muted-foreground block">Bijective (Invertible)</span>
              <span className={`font-mono font-black text-xs ${classification.isBijective ? "text-primary" : "text-muted-foreground"}`}>
                {classification.isBijective ? "Bijective ✨" : "No"}
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs mt-2">
            <div>
              <span className="text-[9px] font-bold uppercase text-muted-foreground block">Reflexive?</span>
              <span className={`font-mono font-bold text-xs ${equivProps?.isReflexive ? "text-emerald-500" : "text-rose-500"}`}>
                {equivProps?.isReflexive ? "Yes" : "No"}
              </span>
            </div>

            <div>
              <span className="text-[9px] font-bold uppercase text-muted-foreground block">Symmetric?</span>
              <span className={`font-mono font-bold text-xs ${equivProps?.isSymmetric ? "text-emerald-500" : "text-rose-500"}`}>
                {equivProps?.isSymmetric ? "Yes" : "No"}
              </span>
            </div>

            <div>
              <span className="text-[9px] font-bold uppercase text-muted-foreground block">Transitive?</span>
              <span className={`font-mono font-bold text-xs ${equivProps?.isTransitive ? "text-emerald-500" : "text-rose-500"}`}>
                {equivProps?.isTransitive ? "Yes" : "No"}
              </span>
            </div>

            <div>
              <span className="text-[9px] font-bold uppercase text-muted-foreground block">Equivalence?</span>
              <span className={`font-mono font-black text-xs ${equivProps?.isEquivalenceRelation ? "text-primary" : "text-muted-foreground"}`}>
                {equivProps?.isEquivalenceRelation ? "Equivalence ✨" : "No"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Right: Custom Elements & Presets (5 cols) ───────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Mapping Controls & Presets
            </span>
          </div>
        </div>

        {/* Presets */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground block">
            Load Standard Presets
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
            <button
              onClick={() => handleApplyPreset("bijective")}
              className="p-2.5 bg-muted hover:bg-accent border border-border rounded-2xl text-left text-muted-foreground hover:text-foreground transition-all shadow-sm text-xs truncate"
            >
              Bijective (1-to-1 & Onto)
            </button>

            <button
              onClick={() => handleApplyPreset("injective_only")}
              className="p-2.5 bg-muted hover:bg-accent border border-border rounded-2xl text-left text-muted-foreground hover:text-foreground transition-all shadow-sm text-xs truncate"
            >
              Injective (Not Onto)
            </button>

            <button
              onClick={() => handleApplyPreset("surjective_only")}
              className="p-2.5 bg-muted hover:bg-accent border border-border rounded-2xl text-left text-muted-foreground hover:text-foreground transition-all shadow-sm text-xs truncate"
            >
              Surjective (Many-to-1)
            </button>

            <button
              onClick={() => handleApplyPreset("equivalence")}
              className="p-2.5 bg-muted hover:bg-accent border border-border rounded-2xl text-left text-muted-foreground hover:text-foreground transition-all shadow-sm text-xs truncate"
            >
              Equivalence Relation
            </button>
          </div>
        </div>

        {/* Dynamic Element Inputs */}
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-xs font-bold text-foreground block">
            Add Elements to Domain & Codomain
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex gap-1">
              <input
                type="text"
                placeholder="Domain X item"
                value={newDomainVal}
                onChange={(e) => setNewDomainVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddDomainElem()}
                className="w-full p-1.5 bg-muted border border-border rounded-xl font-mono text-xs font-bold"
              />
              <button onClick={handleAddDomainElem} className="px-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold">
                <Plus size={12} />
              </button>
            </div>

            <div className="flex gap-1">
              <input
                type="text"
                placeholder="Codomain Y item"
                value={newCodomainVal}
                onChange={(e) => setNewCodomainVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCodomainElem()}
                className="w-full p-1.5 bg-muted border border-border rounded-xl font-mono text-xs font-bold"
              />
              <button onClick={handleAddCodomainElem} className="px-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold">
                <Plus size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Diagnostic Notes */}
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Mathematical Diagnostic
          </span>

          <div className="space-y-1.5 text-xs max-h-[140px] overflow-y-auto pr-1">
            {!isEquivMode ? (
              classification.isBijective ? (
                <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-2xl font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Perfect Bijective Function! Inverse function f⁻¹ exists.</span>
                </div>
              ) : (
                <>
                  {classification.functionViolations.map((v, i) => (
                    <div key={`fv-${i}`} className="p-2 bg-rose-500/10 text-rose-500 rounded-xl text-xs font-medium">
                      ⚠️ {v}
                    </div>
                  ))}
                  {classification.injectiveViolations.map((v, i) => (
                    <div key={`iv-${i}`} className="p-2 bg-amber-500/10 text-amber-500 rounded-xl text-xs font-medium">
                      ⚠️ Non-Injective: {v}
                    </div>
                  ))}
                  {classification.surjectiveMissing.length > 0 && (
                    <div className="p-2 bg-pink-500/10 text-pink-500 rounded-xl text-xs font-medium">
                      ⚠️ Non-Surjective: Codomain [{classification.surjectiveMissing.join(", ")}] not reached.
                    </div>
                  )}
                </>
              )
            ) : (
              equivProps?.isEquivalenceRelation ? (
                <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-2xl font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Valid Equivalence Relation! Partitions set X into equivalence classes.</span>
                </div>
              ) : (
                <>
                  {equivProps?.reflexiveMissing.map((m, i) => (
                    <div key={`ref-${i}`} className="p-2 bg-rose-500/10 text-rose-500 rounded-xl text-xs font-medium">
                      ⚠️ Not Reflexive: Missing loop {m}
                    </div>
                  ))}
                  {equivProps?.symmetricViolations.map((v, i) => (
                    <div key={`sym-${i}`} className="p-2 bg-amber-500/10 text-amber-500 rounded-xl text-xs font-medium">
                      ⚠️ Not Symmetric: {v}
                    </div>
                  ))}
                  {equivProps?.transitiveViolations.map((v, i) => (
                    <div key={`trans-${i}`} className="p-2 bg-pink-500/10 text-pink-500 rounded-xl text-xs font-medium">
                      ⚠️ Not Transitive: {v}
                    </div>
                  ))}
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
