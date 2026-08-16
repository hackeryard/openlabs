"use client";

import React, { useState, useMemo } from "react";
import { SetElement } from "./types";
import {
  PieChart,
  Sliders,
  HelpCircle,
  TrendingUp,
  Plus,
  Minus,
  Equal,
} from "lucide-react";

interface InclusionExclusionCanvasProps {
  elements: SetElement[];
}

export default function InclusionExclusionCanvas({
  elements,
}: InclusionExclusionCanvasProps) {
  const [isSurveyMode, setIsSurveyMode] = useState(false);

  // Hypothetical survey numbers
  const [surveyA, setSurveyA] = useState(45);
  const [surveyB, setSurveyB] = useState(38);
  const [surveyC, setSurveyC] = useState(30);
  const [surveyAB, setSurveyAB] = useState(18);
  const [surveyBC, setSurveyBC] = useState(12);
  const [surveyAC, setSurveyAC] = useState(15);
  const [surveyABC, setSurveyABC] = useState(7);
  const [surveyTotal, setSurveyTotal] = useState(100);

  // Live element counts
  const countA = useMemo(() => elements.filter((e) => e.inA).length, [elements]);
  const countB = useMemo(() => elements.filter((e) => e.inB).length, [elements]);
  const countC = useMemo(() => elements.filter((e) => e.inC).length, [elements]);

  const countAB = useMemo(
    () => elements.filter((e) => e.inA && e.inB).length,
    [elements]
  );
  const countBC = useMemo(
    () => elements.filter((e) => e.inB && e.inC).length,
    [elements]
  );
  const countAC = useMemo(
    () => elements.filter((e) => e.inA && e.inC).length,
    [elements]
  );
  const countABC = useMemo(
    () => elements.filter((e) => e.inA && e.inB && e.inC).length,
    [elements]
  );

  // 2-Set PIE
  const actualUnion2 = countA + countB - countAB;
  // 3-Set PIE
  const actualUnion3 =
    countA + countB + countC - (countAB + countBC + countAC) + countABC;

  // Survey PIE
  const surveyUnion3 =
    surveyA + surveyB + surveyC - (surveyAB + surveyBC + surveyAC) + surveyABC;
  const surveyNeither = Math.max(0, surveyTotal - surveyUnion3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Formula Step-by-Step Breakdown (7 cols) ───── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <PieChart size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Principle of Inclusion-Exclusion (PIE)
            </span>
          </div>

          <button
            onClick={() => setIsSurveyMode((s) => !s)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              isSurveyMode
                ? "bg-primary text-primary-foreground shadow-sm font-black"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {isSurveyMode ? "Survey Solver Mode" : "Active Elements Mode"}
          </button>
        </div>

        {!isSurveyMode ? (
          /* ── ACTIVE ELEMENTS PIE BREAKDOWN ── */
          <div className="space-y-4">
            {/* 2-Set Formula Card */}
            <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2.5">
              <span className="text-[10px] font-bold uppercase text-primary block">
                Two-Set Inclusion-Exclusion Theorem
              </span>
              <div className="font-mono text-sm font-black text-foreground bg-background/80 p-3 rounded-xl border border-border text-center">
                |A ∪ B| = |A| + |B| - |A ∩ B|
              </div>
              <div className="flex items-center justify-center gap-2 font-mono text-xs font-bold text-muted-foreground">
                <span className="text-primary font-black">{actualUnion2}</span>
                <span>=</span>
                <span className="text-blue-500">{countA}</span>
                <Plus size={12} />
                <span className="text-pink-500">{countB}</span>
                <Minus size={12} />
                <span className="text-purple-500">{countAB}</span>
              </div>
            </div>

            {/* 3-Set Formula Card */}
            <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2.5">
              <span className="text-[10px] font-bold uppercase text-emerald-500 block">
                Three-Set Inclusion-Exclusion Theorem
              </span>
              <div className="font-mono text-xs font-black text-foreground bg-background/80 p-3 rounded-xl border border-border text-center leading-relaxed">
                |A ∪ B ∪ C| = |A| + |B| + |C| - (|A ∩ B| + |B ∩ C| + |A ∩ C|) + |A ∩ B ∩ C|
              </div>
              <div className="flex items-center justify-center gap-1.5 font-mono text-[11px] font-bold text-muted-foreground flex-wrap">
                <span className="text-emerald-500 font-black text-xs">{actualUnion3}</span>
                <span>=</span>
                <span>({countA} + {countB} + {countC})</span>
                <Minus size={12} />
                <span>({countAB} + {countBC} + {countAC})</span>
                <Plus size={12} />
                <span>{countABC}</span>
              </div>
            </div>

            {/* Visual Breakdown Strip */}
            <div className="grid grid-cols-4 gap-2 bg-muted/60 border border-border rounded-2xl p-3 text-center text-xs">
              <div>
                <span className="text-[9px] font-bold uppercase text-muted-foreground block">|A|</span>
                <span className="font-mono font-black text-blue-500 text-sm">{countA}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase text-muted-foreground block">|B|</span>
                <span className="font-mono font-black text-pink-500 text-sm">{countB}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase text-muted-foreground block">|C|</span>
                <span className="font-mono font-black text-emerald-500 text-sm">{countC}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase text-muted-foreground block">|A ∩ B ∩ C|</span>
                <span className="font-mono font-black text-purple-500 text-sm">{countABC}</span>
              </div>
            </div>
          </div>
        ) : (
          /* ── SURVEY PROBLEM SOLVER BREAKDOWN ── */
          <div className="space-y-4">
            <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2.5">
              <span className="text-[10px] font-bold uppercase text-primary block">
                Survey Calculation Result
              </span>
              <div className="font-mono text-sm font-black text-foreground bg-background/80 p-3 rounded-xl border border-border text-center">
                |A ∪ B ∪ C| = {surveyUnion3} Students
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Out of {surveyTotal} students surveyed, <strong>{surveyUnion3}</strong> participate in at least one activity, and <strong>{surveyNeither}</strong> participate in none.
              </p>
            </div>

            {/* Detailed step equation */}
            <div className="p-3 bg-background/60 border border-border rounded-xl font-mono text-xs space-y-1">
              <div>Step 1: Single Sets sum = {surveyA} + {surveyB} + {surveyC} = {surveyA + surveyB + surveyC}</div>
              <div>Step 2: Double overlaps subtracted = -({surveyAB} + {surveyBC} + {surveyAC}) = -{surveyAB + surveyBC + surveyAC}</div>
              <div>Step 3: Triple overlap added back = +{surveyABC}</div>
              <div className="font-black text-primary pt-1 border-t border-border">Total Union = {surveyUnion3}</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Right: Survey Parameters or Element Metrics (5 cols) */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              {isSurveyMode ? "Survey Problem Controls" : "Cardinality Properties"}
            </span>
          </div>
        </div>

        {isSurveyMode ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-blue-500">|A| Likes Activity A</span>
                <span className="font-mono">{surveyA}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={surveyA}
                onChange={(e) => setSurveyA(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-pink-500">|B| Likes Activity B</span>
                <span className="font-mono">{surveyB}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={surveyB}
                onChange={(e) => setSurveyB(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-500">|C| Likes Activity C</span>
                <span className="font-mono">{surveyC}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={surveyC}
                onChange={(e) => setSurveyC(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
              <div className="space-y-1 text-center">
                <span className="text-[9px] font-bold text-muted-foreground block">|A ∩ B|</span>
                <input
                  type="number"
                  value={surveyAB}
                  onChange={(e) => setSurveyAB(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full p-1 text-center bg-muted border border-border rounded-lg text-xs font-mono font-bold"
                />
              </div>

              <div className="space-y-1 text-center">
                <span className="text-[9px] font-bold text-muted-foreground block">|B ∩ C|</span>
                <input
                  type="number"
                  value={surveyBC}
                  onChange={(e) => setSurveyBC(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full p-1 text-center bg-muted border border-border rounded-lg text-xs font-mono font-bold"
                />
              </div>

              <div className="space-y-1 text-center">
                <span className="text-[9px] font-bold text-muted-foreground block">|A ∩ C|</span>
                <input
                  type="number"
                  value={surveyAC}
                  onChange={(e) => setSurveyAC(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full p-1 text-center bg-muted border border-border rounded-lg text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-muted/40 border border-border rounded-2xl text-xs space-y-1">
              <span className="font-bold text-foreground block">Why subtract pairwise intersections?</span>
              <p className="text-muted-foreground">
                When adding $|A| + |B|$, elements in $|A \cap B|$ are counted twice. Subtracting $|A \cap B|$ rectifies double-counting.
              </p>
            </div>

            <div className="p-3 bg-muted/40 border border-border rounded-2xl text-xs space-y-1">
              <span className="font-bold text-foreground block">Why add back triple intersection?</span>
              <p className="text-muted-foreground">
                Subtracting $|A \cap B| + |B \cap C| + |A \cap C|$ removes the central triple intersection three times after adding it three times, so it must be added back once.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
