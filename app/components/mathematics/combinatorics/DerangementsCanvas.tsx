"use client";

import React, { useState, useMemo } from "react";
import { factorial, derangements, generatePermutations } from "./lib/combinatoricsMath";
import {
  Shuffle,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
} from "lucide-react";

export default function DerangementsCanvas() {
  const [n, setN] = useState<number>(4);

  // Hat-Check live simulation state
  const [simTrials, setSimTrials] = useState<number>(0);
  const [simDerangements, setSimDerangements] = useState<number>(0);

  const totalPerms = factorial(n);
  const totalDerange = derangements(n);
  const theoreticalProb = totalDerange / totalPerms;
  const eInverse = 1 / Math.E;

  // Generate items [1..n]
  const baseItems = useMemo(() => Array.from({ length: n }, (_, i) => i + 1), [n]);

  // Generate all derangements
  const allDerangements = useMemo(() => {
    const all = generatePermutations(baseItems, n, 200);
    return all.filter((perm) => perm.every((val, idx) => val !== idx + 1));
  }, [baseItems, n]);

  const runSimulationTrial = () => {
    // Random shuffle
    const shuffled = [...baseItems].sort(() => Math.random() - 0.5);
    const isDerange = shuffled.every((val, idx) => val !== idx + 1);

    setSimTrials((t) => t + 1);
    if (isDerange) setSimDerangements((d) => d + 1);
  };

  const runBatchSim = (count: number) => {
    let dCount = 0;
    for (let t = 0; t < count; t++) {
      const shuffled = [...baseItems].sort(() => Math.random() - 0.5);
      if (shuffled.every((val, idx) => val !== idx + 1)) dCount++;
    }
    setSimTrials((prev) => prev + count);
    setSimDerangements((prev) => prev + dCount);
  };

  const empiricalProb = simTrials > 0 ? simDerangements / simTrials : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Derangements List & Simulation (7 cols) ───── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Shuffle size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Derangements Gallery (!{n} = {totalDerange} of {totalPerms})
            </span>
          </div>

          <span className="text-xs font-mono font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
            P(Derangement) = {(theoreticalProb * 100).toFixed(2)}%
          </span>
        </div>

        {/* List of All Valid Derangements */}
        <div className="flex-1 bg-muted/20 rounded-2xl border border-border/50 p-4 flex flex-col overflow-hidden">
          <div className="text-xs font-bold text-foreground mb-2 flex items-center justify-between">
            <span>Permutations with Zero Fixed Points (π(i) ≠ i):</span>
            <span className="font-mono text-[10px] text-muted-foreground">
              Original: [{baseItems.join(", ")}]
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[220px] grid grid-cols-2 sm:grid-cols-3 gap-2 pr-1">
            {allDerangements.map((perm, idx) => (
              <div
                key={idx}
                className="p-2 bg-card border border-border rounded-xl flex items-center justify-center gap-1.5 font-mono text-xs font-bold shadow-sm"
              >
                <span className="text-[9px] text-muted-foreground">#{idx + 1}</span>
                <span className="text-primary">[{perm.join(", ")}]</span>
              </div>
            ))}
          </div>

          {/* Monte Carlo Hat-Check Simulator Bar */}
          <div className="mt-4 pt-3 border-t border-border bg-background/60 p-3 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-foreground">
                Hat-Check Monte Carlo Simulator
              </div>
              <div className="font-mono text-[11px] text-muted-foreground">
                Trials: {simTrials} | Derangements: {simDerangements} | Rate: {(empiricalProb * 100).toFixed(1)}%
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={runSimulationTrial}
                className="px-2.5 py-1 bg-muted hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all"
              >
                +1 Trial
              </button>
              <button
                onClick={() => runBatchSim(100)}
                className="px-3 py-1 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-sm hover:opacity-90 transition-all"
              >
                +100 Trials
              </button>
              <button
                onClick={() => {
                  setSimTrials(0);
                  setSimDerangements(0);
                }}
                className="p-1 text-muted-foreground hover:text-foreground"
                title="Reset simulation"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Formulas & 1/e Convergence (5 cols) ──────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Subfactorial & Convergence
            </span>
          </div>
        </div>

        {/* Subfactorial Formula Box */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-primary block">
            Subfactorial Recurrence: !n
          </span>
          <div className="font-mono text-base font-black text-foreground bg-background/80 p-2.5 rounded-xl border border-border text-center">
            !{n} = ({n}-1)(!{n-1} + !{n-2}) = {totalDerange}
          </div>
          <div className="text-xs text-muted-foreground text-center font-mono">
            !n = ⌊n! / e + 1/2⌋
          </div>
        </div>

        {/* 1/e Asymptotic Box */}
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl space-y-1 font-mono text-xs text-center">
          <span className="text-[10px] uppercase font-bold text-indigo-500 block">
            Asymptotic Limit (1/e)
          </span>
          <div className="text-foreground font-black text-sm">
            lim (n &rarr; &infin;) !n / n! = 1 / e &approx; 0.367879 (36.79%)
          </div>
          <div className="text-muted-foreground text-[11px]">
            For n = {n}: P = {(theoreticalProb * 100).toFixed(3)}%
          </div>
        </div>

        {/* Elements Slider */}
        <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">Number of Elements (n)</span>
            <span className="font-mono text-primary font-black">{n}</span>
          </div>
          <input
            type="range"
            min="2"
            max="6"
            step="1"
            value={n}
            onChange={(e) => {
              setN(parseInt(e.target.value, 10) || 2);
              setSimTrials(0);
              setSimDerangements(0);
            }}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
