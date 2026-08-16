"use client";

import React, { useState, useMemo } from "react";
import { generatePascalsTriangle, expandBinomial, nCr } from "./lib/combinatoricsMath";
import {
  Triangle,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2,
  Binary,
} from "lucide-react";

export default function PascalsTriangleCanvas() {
  const [rows, setRows] = useState<number>(8);
  const [patternMode, setPatternMode] = useState<"default" | "modulo" | "fibonacci" | "hockey_stick" | "row_sums">("default");
  const [modValue, setModValue] = useState<number>(2);

  // Selected cell (n, k)
  const [selectedCell, setSelectedCell] = useState<{ n: number; k: number }>({ n: 4, k: 2 });

  // Binomial expansion inputs
  const [coeffA, setCoeffA] = useState<number>(1);
  const [coeffB, setCoeffB] = useState<number>(1);
  const [binomPower, setBinomPower] = useState<number>(4);

  const triangle = useMemo(() => generatePascalsTriangle(rows), [rows]);
  const binomialTerms = useMemo(
    () => expandBinomial(coeffA, coeffB, binomPower),
    [coeffA, coeffB, binomPower]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive Pascal's Triangle Grid (7 cols) ── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Triangle size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Pascal&apos;s Triangle ({rows + 1} Rows)
            </span>
          </div>

          {/* Pattern Mode Toggles */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl border border-border flex-wrap">
            {[
              ["default", "Standard"],
              ["modulo", `Mod ${modValue} Fractal`],
              ["fibonacci", "Fibonacci"],
              ["hockey_stick", "Hockey Stick"],
              ["row_sums", "2ⁿ Row Sums"],
            ].map(([pKey, label]) => (
              <button
                key={pKey}
                onClick={() => setPatternMode(pKey as any)}
                className={`px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                  patternMode === pKey
                    ? "bg-primary text-primary-foreground font-black shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Triangle Render Box */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[360px] bg-muted/20 rounded-2xl border border-border/50 p-4 overflow-x-auto select-none">
          <div className="space-y-1.5 flex flex-col items-center">
            {triangle.map((row, rIdx) => {
              const rowSum = Math.pow(2, rIdx);

              return (
                <div key={`row-${rIdx}`} className="flex items-center justify-center gap-1 sm:gap-1.5">
                  {patternMode === "row_sums" && (
                    <span className="text-[9px] font-mono text-muted-foreground mr-2 font-bold">
                      Σ=2^{rIdx}={rowSum}
                    </span>
                  )}

                  {row.map((val, cIdx) => {
                    const isSelected = selectedCell.n === rIdx && selectedCell.k === cIdx;
                    const remainder = val % modValue;

                    // Modulo coloring
                    let cellBg = "bg-card hover:border-primary/50 text-foreground";
                    if (patternMode === "modulo") {
                      cellBg = remainder !== 0
                        ? "bg-indigo-600 text-white font-black"
                        : "bg-muted/40 text-muted-foreground opacity-30";
                    } else if (patternMode === "hockey_stick") {
                      if (cIdx === 1 && rIdx <= 4) cellBg = "bg-blue-500/20 border-blue-500 text-blue-500 font-black";
                      if (rIdx === 5 && cIdx === 2) cellBg = "bg-emerald-500/20 border-emerald-500 text-emerald-500 font-black";
                    }

                    if (isSelected) {
                      cellBg = "bg-primary text-primary-foreground ring-2 ring-primary font-black shadow-md";
                    }

                    return (
                      <button
                        key={`cell-${rIdx}-${cIdx}`}
                        onClick={() => setSelectedCell({ n: rIdx, k: cIdx })}
                        className={`min-w-[28px] sm:min-w-[34px] h-7 sm:h-8 px-1 rounded-lg border border-border text-[10px] sm:text-xs font-mono font-bold flex items-center justify-center transition-all ${cellBg}`}
                        title={`Row ${rIdx}, Col ${cIdx}: C(${rIdx}, ${cIdx}) = ${val}`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rows & Modulo Sliders */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-border mt-2 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span>Rows:</span>
            <input
              type="range"
              min="3"
              max="12"
              step="1"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value, 10) || 3)}
              className="w-32 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="font-mono text-primary">{rows}</span>
          </div>

          {patternMode === "modulo" && (
            <div className="flex items-center gap-2 text-xs font-bold">
              <span>Modulo (p):</span>
              {[2, 3, 5, 7].map((p) => (
                <button
                  key={p}
                  onClick={() => setModValue(p)}
                  className={`w-6 h-6 rounded-lg text-xs font-bold ${
                    modValue === p ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Binomial Theorem & Cell Combinatorics (5 cols) */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Binomial Theorem Generator
            </span>
          </div>
        </div>

        {/* Selected Cell Inspector */}
        <div className="p-3 bg-muted/40 border border-border rounded-2xl space-y-1">
          <span className="text-[10px] font-bold uppercase text-primary block">
            Selected Node (Row {selectedCell.n}, Position {selectedCell.k})
          </span>
          <div className="font-mono text-sm font-black text-foreground text-center">
            C({selectedCell.n}, {selectedCell.k}) = {selectedCell.n}! / ({selectedCell.k}! · {selectedCell.n - selectedCell.k}!) = {nCr(selectedCell.n, selectedCell.k)}
          </div>
        </div>

        {/* Binomial Theorem Formula Box */}
        <div className="p-4 bg-muted/30 border border-border rounded-2xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-amber-500 block">
            Binomial Expansion: ({coeffA}x + {coeffB}y)^{binomPower}
          </span>
          <div className="font-mono text-xs font-black text-foreground bg-background/80 p-3 rounded-xl border border-border text-center leading-relaxed">
            = {binomialTerms.map((t) => t.termStr).join(" + ")}
          </div>
        </div>

        {/* Binomial Controls */}
        <div className="space-y-3 p-3 bg-muted/20 border border-border rounded-2xl">
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div>
              <label className="text-[9px] text-muted-foreground block font-bold">Coeff a</label>
              <input
                type="number"
                value={coeffA}
                onChange={(e) => setCoeffA(parseInt(e.target.value, 10) || 1)}
                className="w-full p-1.5 bg-background border border-border rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-[9px] text-muted-foreground block font-bold">Coeff b</label>
              <input
                type="number"
                value={coeffB}
                onChange={(e) => setCoeffB(parseInt(e.target.value, 10) || 1)}
                className="w-full p-1.5 bg-background border border-border rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-[9px] text-muted-foreground block font-bold">Power n</label>
              <input
                type="number"
                min="0"
                max="8"
                value={binomPower}
                onChange={(e) => setBinomPower(Math.max(0, Math.min(8, parseInt(e.target.value, 10) || 0)))}
                className="w-full p-1.5 bg-background border border-border rounded-xl text-xs font-bold"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
