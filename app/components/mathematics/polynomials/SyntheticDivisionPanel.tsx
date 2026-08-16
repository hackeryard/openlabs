"use client";

import React, { useMemo, useState } from "react";
import {
  computeSyntheticDivision,
  formatPolynomial,
} from "./lib/polynomialMath";
import { SyntheticDivisionResult } from "./types";
import {
  Divide,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
} from "lucide-react";

interface SyntheticDivisionPanelProps {
  coeffs: number[];
  divisorC: number;
  onChangeDivisorC: (c: number) => void;
  onDivisionSolved?: () => void;
}

export default function SyntheticDivisionPanel({
  coeffs,
  divisorC,
  onChangeDivisorC,
  onDivisionSolved,
}: SyntheticDivisionPanelProps) {
  const result: SyntheticDivisionResult = useMemo(
    () => computeSyntheticDivision(coeffs, divisorC),
    [coeffs, divisorC]
  );

  const handleSliderChange = (val: number) => {
    onChangeDivisorC(val);
    onDivisionSolved?.();
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-lg space-y-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Divide size={18} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Synthetic Division & Factor Theorem Engine
          </span>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${
            result.isFactor
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              : "bg-muted text-muted-foreground border-border"
          }`}
        >
          {result.isFactor ? (
            <>
              <CheckCircle2 size={13} />
              (x - {divisorC}) is an EXACT Factor!
            </>
          ) : (
            `Remainder R = ${result.remainder.toFixed(2)}`
          )}
        </span>
      </div>

      {/* ── Equation & Divisor Selector ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dividend P(x) */}
        <div className="p-4 bg-muted/60 border border-border rounded-2xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Dividend Polynomial P(x)
          </span>
          <div className="text-base sm:text-lg font-black font-mono text-primary">
            {formatPolynomial(coeffs)}
          </div>
        </div>

        {/* Divisor (x - c) Slider */}
        <div className="p-4 bg-muted/60 border border-border rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Divisor (x - c)
            </span>
            <span className="text-xs font-mono font-bold text-foreground">
              c = <strong className="text-primary">{divisorC}</strong> (dividing by{" "}
              {divisorC >= 0 ? `x - ${divisorC}` : `x + ${Math.abs(divisorC)}`})
            </span>
          </div>
          <input
            type="range"
            min="-5"
            max="5"
            step="1"
            value={divisorC}
            onChange={(e) => handleSliderChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>

      {/* ── Synthetic Division Matrix Visualizer ───────────── */}
      <div className="p-5 bg-background/80 border border-border rounded-2xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Synthetic Tableau Calculation
        </span>

        <div className="overflow-x-auto thin-scrollbar pb-2">
          <div className="inline-block min-w-full font-mono text-sm">
            {/* Row 1: Divisor c | Original Coefficients */}
            <div className="flex items-center gap-4 py-1.5 border-b border-border/80">
              <div className="w-12 text-center font-bold text-primary bg-primary/10 py-1 rounded-lg border border-primary/20">
                {divisorC}
              </div>
              <div className="flex items-center gap-6 flex-1 pl-2">
                {coeffs.map((coeff, idx) => (
                  <div key={`c-${idx}`} className="w-14 text-center font-bold text-foreground">
                    {coeff}
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Multiplier additions */}
            <div className="flex items-center gap-4 py-1.5 text-muted-foreground border-b-2 border-foreground/30">
              <div className="w-12 text-center text-xs text-muted-foreground">↓ × {divisorC}</div>
              <div className="flex items-center gap-6 flex-1 pl-2">
                {result.multiplierRow.map((mult, idx) => (
                  <div key={`m-${idx}`} className="w-14 text-center font-medium text-purple-500">
                    {idx === 0 ? "—" : mult}
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3: Result Quotient Coefficients + Remainder */}
            <div className="flex items-center gap-4 py-2">
              <div className="w-12 text-center text-xs font-bold text-muted-foreground">Result</div>
              <div className="flex items-center gap-6 flex-1 pl-2">
                {result.sumRow.map((val, idx) => {
                  const isRem = idx === result.sumRow.length - 1;
                  return (
                    <div
                      key={`r-${idx}`}
                      className={`w-14 text-center font-black py-1 rounded-lg ${
                        isRem
                          ? result.isFactor
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                            : "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40"
                          : "text-foreground bg-muted"
                      }`}
                    >
                      {val}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Division Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-border">
          <div className="p-3 bg-muted/60 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Quotient Q(x)
            </span>
            <span className="font-mono font-bold text-foreground text-sm">
              Q(x) = {result.quotientString}
            </span>
          </div>

          <div className="p-3 bg-muted/60 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Remainder Theorem Result
            </span>
            <span className="font-mono font-bold text-foreground text-sm">
              P({divisorC}) = <strong>{result.remainder}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ── Theoretical Insight ────────────────────────────── */}
      <div className="p-4 bg-muted/40 border border-border rounded-2xl text-xs space-y-1.5">
        <h4 className="font-bold text-foreground flex items-center gap-1.5">
          <BookOpen size={14} className="text-primary" />
          <span>Factor Theorem & Remainder Theorem</span>
        </h4>
        <p className="text-muted-foreground">
          According to the <strong>Remainder Theorem</strong>, evaluating a polynomial <code>P(x)</code> at <code>x = c</code> yields exactly the remainder <code>R</code> when <code>P(x)</code> is divided by <code>(x - c)</code>.
          If <code>R = 0</code>, the <strong>Factor Theorem</strong> guarantees that <code>(x - c)</code> is a factor of <code>P(x)</code>, and <code>c</code> is an exact root!
        </p>
      </div>
    </div>
  );
}
