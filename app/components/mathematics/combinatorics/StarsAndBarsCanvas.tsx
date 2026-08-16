"use client";

import React, { useState, useMemo } from "react";
import { nCr, generateIntegerPartitions } from "./lib/combinatoricsMath";
import {
  Sparkles,
  Sliders,
  Layers,
  CheckCircle2,
  Grid,
  Box,
} from "lucide-react";

export default function StarsAndBarsCanvas() {
  const [activeMode, setActiveMode] = useState<"stars_bars" | "partitions">("stars_bars");

  // Stars & Bars State
  const [starsN, setStarsN] = useState<number>(7); // items
  const [binsK, setBinsK] = useState<number>(3); // bins
  const [isPositiveOnly, setIsPositiveOnly] = useState<boolean>(false);

  // Integer Partition State
  const [partitionN, setPartitionN] = useState<number>(5);
  const [selectedPartitionIdx, setSelectedPartitionIdx] = useState<number>(0);

  // Stars and bars formulas
  // Non-negative: C(n + k - 1, k - 1)
  // Positive: C(n - 1, k - 1)
  const totalWays = isPositiveOnly
    ? nCr(starsN - 1, binsK - 1)
    : nCr(starsN + binsK - 1, binsK - 1);

  // Partitions
  const partitions = useMemo(
    () => generateIntegerPartitions(partitionN),
    [partitionN]
  );

  const currentPartition = partitions[selectedPartitionIdx] || partitions[0] || [partitionN];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive Canvas (7 cols) ───────────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              {activeMode === "stars_bars" ? "Stars & Bars Divider Studio" : `Ferrers Diagram (p(${partitionN}) = ${partitions.length})`}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl border border-border">
            <button
              onClick={() => setActiveMode("stars_bars")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeMode === "stars_bars"
                  ? "bg-primary text-primary-foreground font-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Stars & Bars
            </button>
            <button
              onClick={() => setActiveMode("partitions")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeMode === "partitions"
                  ? "bg-primary text-primary-foreground font-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Integer Partitions p(n)
            </button>
          </div>
        </div>

        {/* Dynamic Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 p-4 select-none">
          {activeMode === "stars_bars" ? (
            /* ── Stars & Bars Visualization ── */
            <div className="space-y-6 flex flex-col items-center justify-center w-full">
              <div className="flex items-center justify-center gap-2 flex-wrap p-4 bg-background/80 rounded-2xl border border-border">
                {Array.from({ length: starsN }).map((_, sIdx) => (
                  <React.Fragment key={`star-${sIdx}`}>
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-500 font-black text-sm shadow-sm">
                      ★
                    </div>
                    {/* Render bar separator after certain stars */}
                    {sIdx < binsK - 1 && (
                      <div className="w-2 h-10 bg-indigo-500 rounded-full shadow-sm" title="Divider Bar" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Equation Representation */}
              <div className="p-3 bg-muted/40 border border-border rounded-xl text-xs font-mono font-bold text-center">
                Equation: x₁ + x₂ + ... + x_{binsK} = {starsN} &nbsp; ({isPositiveOnly ? "x_i ≥ 1" : "x_i ≥ 0"})
              </div>
            </div>
          ) : (
            /* ── Integer Partitions & Ferrers Diagram ── */
            <div className="space-y-4 flex flex-col items-center justify-center w-full">
              <div className="text-xs font-bold text-foreground">
                Ferrers Diagram for: {currentPartition.join(" + ")} = {partitionN}
              </div>

              {/* Ferrers Dot Array */}
              <div className="space-y-2 p-4 bg-background/80 rounded-2xl border border-border flex flex-col items-start min-w-[200px]">
                {currentPartition.map((part, rowIdx) => (
                  <div key={rowIdx} className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground w-4">
                      {part}:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: part }).map((_, colIdx) => (
                        <div
                          key={colIdx}
                          className="w-5 h-5 rounded-full bg-primary border border-white shadow-sm"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Formulas & Partition Selector (5 cols) ────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              {activeMode === "stars_bars" ? "Stars & Bars Settings" : "Partition Generator"}
            </span>
          </div>
        </div>

        {activeMode === "stars_bars" ? (
          <div className="space-y-4">
            {/* Formula Box */}
            <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-primary block">
                {isPositiveOnly ? "Positive Solutions (x_i ≥ 1)" : "Non-Negative Solutions (x_i ≥ 0)"}
              </span>
              <div className="font-mono text-sm font-black text-foreground bg-background/80 p-3 rounded-xl border border-border text-center">
                {isPositiveOnly
                  ? `C(n-1, k-1) = C(${starsN - 1}, ${binsK - 1}) = ${totalWays}`
                  : `C(n+k-1, k-1) = C(${starsN + binsK - 1}, ${binsK - 1}) = ${totalWays}`}
              </div>
            </div>

            {/* Constraint Toggle */}
            <button
              onClick={() => setIsPositiveOnly(!isPositiveOnly)}
              className={`w-full p-2.5 rounded-2xl text-xs font-bold border transition-all ${
                isPositiveOnly
                  ? "bg-primary text-primary-foreground border-primary font-black shadow-sm"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Constraint: {isPositiveOnly ? "Positive Integers (x_i ≥ 1)" : "Non-Negative Integers (x_i ≥ 0)"}
            </button>

            {/* Sliders */}
            <div className="space-y-4">
              <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-foreground">Identical Stars (n)</span>
                  <span className="font-mono text-primary font-black">{starsN}</span>
                </div>
                <input
                  type="range"
                  min={isPositiveOnly ? binsK : 1}
                  max="12"
                  step="1"
                  value={starsN}
                  onChange={(e) => setStarsN(parseInt(e.target.value, 10) || 1)}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-foreground">Distinct Bins (k)</span>
                  <span className="font-mono text-primary font-black">{binsK}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  step="1"
                  value={binsK}
                  onChange={(e) => setBinsK(parseInt(e.target.value, 10) || 2)}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Partition Slider */}
            <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Integer to Partition (n)</span>
                <span className="font-mono text-primary font-black">{partitionN}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={partitionN}
                onChange={(e) => {
                  setPartitionN(parseInt(e.target.value, 10) || 1);
                  setSelectedPartitionIdx(0);
                }}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* List of Partitions */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-foreground block">
                All {partitions.length} Integer Partitions of {partitionN}
              </span>
              <div className="max-h-[220px] overflow-y-auto space-y-1 pr-1 font-mono text-xs">
                {partitions.map((parts, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => setSelectedPartitionIdx(pIdx)}
                    className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedPartitionIdx === pIdx
                        ? "bg-primary text-primary-foreground border-primary font-black shadow-sm"
                        : "bg-muted hover:bg-accent border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>#{pIdx + 1}: {parts.join(" + ")}</span>
                    <span className="text-[10px] opacity-75">{parts.length} parts</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
