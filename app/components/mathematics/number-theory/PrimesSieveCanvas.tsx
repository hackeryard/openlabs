"use client";

import React, { useState, useMemo } from "react";
import { sieveOfEratosthenes, primeFactorization } from "./lib/numberTheoryMath";
import {
  Sparkles,
  Sliders,
  Layers,
  CheckCircle2,
  Maximize2,
  Grid,
  Hash,
} from "lucide-react";

export default function PrimesSieveCanvas() {
  const [targetNumber, setTargetNumber] = useState<number>(60);
  const [sieveLimit, setSieveLimit] = useState<number>(100);
  const [selectedPrimeFilter, setSelectedPrimeFilter] = useState<number | null>(null);

  const sieveBooleans = useMemo(() => sieveOfEratosthenes(sieveLimit), [sieveLimit]);
  const factorData = useMemo(() => primeFactorization(targetNumber), [targetNumber]);

  const primesUpToLimit = useMemo(() => {
    const primes = [];
    for (let i = 2; i <= sieveLimit; i++) {
      if (sieveBooleans[i]) primes.push(i);
    }
    return primes;
  }, [sieveBooleans, sieveLimit]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Sieve of Eratosthenes Grid Canvas (7 cols) ── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Grid size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Sieve of Eratosthenes (1 to {sieveLimit})
            </span>
          </div>

          <span className="text-xs font-mono font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            {primesUpToLimit.length} Primes Found
          </span>
        </div>

        {/* Sieve Grid */}
        <div className="flex-1 overflow-y-auto max-h-[320px] bg-muted/20 rounded-2xl border border-border/50 p-3 select-none">
          <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
            {Array.from({ length: sieveLimit }, (_, idx) => {
              const num = idx + 1;
              const isPrime = sieveBooleans[num];
              const isMultipleOfSelected =
                selectedPrimeFilter !== null && num % selectedPrimeFilter === 0;

              let cellStyle = "bg-card border-border text-foreground";
              if (num === 1) {
                cellStyle = "bg-muted/40 text-muted-foreground opacity-40";
              } else if (isPrime) {
                cellStyle = "bg-indigo-600 text-white font-black shadow-sm ring-1 ring-indigo-400";
              } else if (isMultipleOfSelected) {
                cellStyle = "bg-rose-500/20 text-rose-500 border-rose-500/40 line-through";
              }

              return (
                <button
                  key={num}
                  onClick={() => {
                    if (isPrime) setSelectedPrimeFilter(selectedPrimeFilter === num ? null : num);
                    setTargetNumber(num);
                  }}
                  className={`h-7 sm:h-8 rounded-lg border text-[10px] sm:text-xs font-mono font-bold flex items-center justify-center transition-all ${cellStyle}`}
                  title={`${num}: ${isPrime ? "Prime" : "Composite"}`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Sieve Filter Bar */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-border mt-2 text-xs flex-wrap">
          <span className="text-muted-foreground font-bold">Highlight multiples of prime:</span>
          <div className="flex items-center gap-1 flex-wrap">
            {[2, 3, 5, 7, 11].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPrimeFilter(selectedPrimeFilter === p ? null : p)}
                className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                  selectedPrimeFilter === p
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground hover:text-foreground border-border"
                }`}
              >
                p = {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Prime Factorization & Divisors (5 cols) ───── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Prime Factorization (n = {targetNumber})
            </span>
          </div>
        </div>

        {/* Number Input & Slider */}
        <div className="space-y-3 p-3 bg-muted/30 border border-border rounded-2xl">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-foreground">Target Integer (n)</span>
            <input
              type="number"
              min="2"
              max="1000"
              value={targetNumber}
              onChange={(e) => setTargetNumber(Math.max(2, parseInt(e.target.value, 10) || 2))}
              className="w-20 p-1 bg-background border border-border rounded-lg text-xs font-mono font-black text-right"
            />
          </div>
          <input
            type="range"
            min="2"
            max="200"
            value={targetNumber}
            onChange={(e) => setTargetNumber(parseInt(e.target.value, 10) || 2)}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Fundamental Theorem Factorization Box */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-primary block">
            Unique Prime Factor Decomposition
          </span>
          <div className="font-mono text-base font-black text-foreground bg-background/80 p-3 rounded-xl border border-border text-center">
            {targetNumber} = {factorData.factors.length > 0
              ? factorData.factors.map((f) => (f.power > 1 ? `${f.prime}^${f.power}` : `${f.prime}`)).join(" · ")
              : targetNumber}
          </div>
          <div className="text-center">
            <span
              className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                factorData.classification === "prime"
                  ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                  : factorData.classification === "perfect"
                  ? "bg-purple-500/15 text-purple-500 border-purple-500/30"
                  : factorData.classification === "abundant"
                  ? "bg-blue-500/15 text-blue-500 border-blue-500/30"
                  : "bg-amber-500/15 text-amber-500 border-amber-500/30"
              }`}
            >
              Classification: {factorData.classification}
            </span>
          </div>
        </div>

        {/* Divisors & Arithmetic Functions */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-3 bg-muted/50 rounded-2xl border border-border space-y-1">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">
              Number of Divisors d(n)
            </span>
            <span className="font-black text-primary text-sm">{factorData.divisorCount}</span>
            <span className="text-[10px] text-muted-foreground block">
              &prod; (a_i + 1)
            </span>
          </div>

          <div className="p-3 bg-muted/50 rounded-2xl border border-border space-y-1">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">
              Sum of Divisors &sigma;(n)
            </span>
            <span className="font-black text-emerald-500 text-sm">{factorData.divisorSum}</span>
            <span className="text-[10px] text-muted-foreground block">
              Sum of all {factorData.divisors.length} factors
            </span>
          </div>
        </div>

        {/* All Divisors Chips */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground block">All Divisors of {targetNumber}:</span>
          <div className="flex items-center gap-1.5 flex-wrap font-mono text-xs">
            {factorData.divisors.map((d) => (
              <span key={d} className="px-2 py-0.5 rounded-lg bg-muted border border-border font-bold">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
