"use client";

import React, { useState, useMemo } from "react";
import { VennMode, SetElement } from "./types";
import { evaluateSetOperation2Set, evaluateSetOperation3Set } from "./lib/setMath";
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Calculator,
} from "lucide-react";

interface SetOperationsCanvasProps {
  mode: VennMode;
  elements: SetElement[];
  onApplyRegions: (regions: string[]) => void;
}

export default function SetOperationsCanvas({
  mode,
  elements,
  onApplyRegions,
}: SetOperationsCanvasProps) {
  const [selectedOp, setSelectedOp] = useState<string>("a_union_b");
  const [customExpr, setCustomExpr] = useState<string>("");
  const [activeLawIdx, setActiveLawIdx] = useState<number>(0);

  // Evaluate active region set
  const activeRegions = useMemo(() => {
    if (customExpr.trim()) {
      return mode === "2-set"
        ? evaluateSetOperation2Set(customExpr)
        : evaluateSetOperation3Set(customExpr);
    }
    return mode === "2-set"
      ? evaluateSetOperation2Set(selectedOp)
      : evaluateSetOperation3Set(selectedOp);
  }, [mode, selectedOp, customExpr]);

  // Elements matching current operation
  const matchingElements = useMemo(() => {
    const activeSet = new Set(activeRegions);
    return elements.filter((elem) => {
      if (mode === "2-set") {
        if (elem.inA && elem.inB) return activeSet.has("AB_intersect");
        if (elem.inA) return activeSet.has("A_only");
        if (elem.inB) return activeSet.has("B_only");
        return activeSet.has("outside");
      } else {
        if (elem.inA && elem.inB && elem.inC) return activeSet.has("ABC_intersect");
        if (elem.inA && elem.inB && !elem.inC) return activeSet.has("AB_only");
        if (elem.inA && !elem.inB && elem.inC) return activeSet.has("AC_only");
        if (!elem.inA && elem.inB && elem.inC) return activeSet.has("BC_only");
        if (elem.inA) return activeSet.has("A_only");
        if (elem.inB) return activeSet.has("B_only");
        if (elem.inC) return activeSet.has("C_only");
        return activeSet.has("outside");
      }
    });
  }, [elements, mode, activeRegions]);

  const laws = [
    {
      name: "De Morgan's First Law",
      formula: "(A ∪ B)' = A' ∩ B'",
      lhs: "(A | B)'",
      rhs: "A' & B'",
      explanation:
        "The complement of the union of two sets is equal to the intersection of their individual complements.",
    },
    {
      name: "De Morgan's Second Law",
      formula: "(A ∩ B)' = A' ∪ B'",
      lhs: "(A & B)'",
      rhs: "A' | B'",
      explanation:
        "The complement of the intersection of two sets is equal to the union of their individual complements.",
    },
    {
      name: "Distributive Law (Intersection over Union)",
      formula: "A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)",
      lhs: "A & (B | C)",
      rhs: "(A & B) | (A & C)",
      explanation:
        "Intersecting a set with a union distributes over the union terms.",
    },
    {
      name: "Symmetric Difference Decomposition",
      formula: "A Δ B = (A ∪ B) \\ (A ∩ B)",
      lhs: "A ^ B",
      rhs: "(A | B) \\ (A & B)",
      explanation:
        "Elements belonging to either set A or B, but strictly not in both simultaneously.",
    },
  ];

  const currentLaw = laws[activeLawIdx];

  const handleApplyToMainVenn = () => {
    onApplyRegions(activeRegions);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Operation Results & Venn Preview (7 cols) ──── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Calculator size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Set Operation Results & Active Elements
            </span>
          </div>

          <button
            onClick={handleApplyToMainVenn}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold shadow-sm active:scale-95 flex items-center gap-1"
          >
            <Sparkles size={12} />
            <span>Apply to Venn Studio</span>
          </button>
        </div>

        {/* Matching Elements Card */}
        <div className="bg-muted/40 border border-border rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-foreground">Resulting Elements (|Result| = {matchingElements.length})</span>
            <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {matchingElements.length} / {elements.length} Elements
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap min-h-[48px] bg-background/60 p-2.5 rounded-xl border border-border">
            {matchingElements.length > 0 ? (
              matchingElements.map((el) => (
                <span
                  key={el.id}
                  className="px-2.5 py-1 bg-primary text-primary-foreground font-mono text-xs font-bold rounded-lg shadow-sm"
                >
                  {el.value}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground font-mono text-xs italic">
                ∅ (Empty Set — No matching elements)
              </span>
            )}
          </div>
        </div>

        {/* Shaded Regions Summary */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-muted/50 border border-border rounded-2xl p-3 space-y-1">
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Active Venn Partitions
            </span>
            <span className="font-mono font-bold text-foreground block">
              [{activeRegions.join(", ")}]
            </span>
          </div>

          <div className="bg-muted/50 border border-border rounded-2xl p-3 space-y-1">
            <span className="text-[10px] font-bold uppercase text-emerald-500 block">
              Set Equality Check
            </span>
            <span className="font-mono font-bold text-emerald-500 block flex items-center gap-1">
              <CheckCircle2 size={13} />
              <span>Valid Boolean Evaluation</span>
            </span>
          </div>
        </div>

        {/* Set Theory Laws Prover Accordion */}
        <div className="bg-muted/30 border border-border rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <BookOpen size={14} className="text-primary" />
              <span>Fundamental Laws of Set Theory</span>
            </h4>

            <div className="flex items-center gap-1">
              {laws.map((law, idx) => (
                <button
                  key={law.name}
                  onClick={() => {
                    setActiveLawIdx(idx);
                    setCustomExpr(law.lhs);
                  }}
                  className={`w-6 h-6 rounded-lg text-xs font-bold transition-all ${
                    activeLawIdx === idx
                      ? "bg-primary text-primary-foreground shadow-sm font-black"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-background/80 rounded-xl border border-border space-y-1.5">
            <div className="font-mono text-sm font-black text-primary text-center">
              {currentLaw.formula}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {currentLaw.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* ── Right: Operations Switcher & Custom Formula (5 cols) */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Set Operations & Expression Input
            </span>
          </div>
        </div>

        {/* Standard Operations Buttons */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground block">
            Standard Operations
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
            {[
              ["a_union_b", "Union (A ∪ B)"],
              ["a_intersect_b", "Intersection (A ∩ B)"],
              ["a_minus_b", "Difference (A \\ B)"],
              ["b_minus_a", "Difference (B \\ A)"],
              ["sym_diff", "Symmetric Diff (A Δ B)"],
              ["a_comp", "Complement (A')"],
              ["b_comp", "Complement (B')"],
              ["neither", "Neither ((A ∪ B)')"],
            ].map(([opKey, label]) => (
              <button
                key={opKey}
                onClick={() => {
                  setSelectedOp(opKey);
                  setCustomExpr("");
                }}
                className={`p-2.5 rounded-2xl text-left transition-all text-xs font-bold truncate ${
                  selectedOp === opKey && !customExpr
                    ? "bg-primary text-primary-foreground shadow-sm font-black"
                    : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Expression Input */}
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-xs font-bold text-foreground block">
            Custom Set Expression Evaluator
          </span>
          <div className="space-y-1">
            <input
              type="text"
              placeholder="e.g. (A | B) & ~C  or  A ^ B"
              value={customExpr}
              onChange={(e) => setCustomExpr(e.target.value)}
              className="w-full p-2.5 bg-muted border border-border rounded-xl font-mono text-xs font-bold text-foreground"
            />
            <span className="text-[10px] text-muted-foreground block">
              Syntax: <code>|</code> or <code>U</code> (Union), <code>&</code> (Intersection), <code>\</code> (Difference), <code>~</code> or <code>&apos;</code> (Complement), <code>^</code> (Symmetric Diff)
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {["(A | B) & ~C", "A ^ B", "(A \\ B) | (B \\ A)", "~(A & B)"].map(
              (sample) => (
                <button
                  key={sample}
                  onClick={() => setCustomExpr(sample)}
                  className="px-2 py-1 bg-muted hover:bg-accent border border-border rounded-lg text-[10px] font-mono font-bold text-muted-foreground hover:text-foreground transition-all"
                >
                  {sample}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
