"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { ParentDistributionType } from "./types";
import {
  generateCLTSamples,
  getParentTheoreticalStats,
  sampleFromParent,
  normalPDF,
} from "./lib/statsMath";
import {
  Activity,
  Sliders,
  Sparkles,
  RefreshCw,
  TrendingUp,
  BookOpen,
  Play,
} from "lucide-react";

interface CLTSandboxCanvasProps {
  onSamplesGenerated?: () => void;
}

export default function CLTSandboxCanvas({ onSamplesGenerated }: CLTSandboxCanvasProps) {
  const [parentType, setParentType] = useState<ParentDistributionType>("exponential");
  const [sampleSizeN, setSampleSizeN] = useState(25);
  const [numTrialsM, setNumTrialsM] = useState(1500);

  const [cltResult, setCltResult] = useState<{
    samples: number[];
    sampleMean: number;
    sampleStdDev: number;
  } | null>(null);

  // Live sampled items for micro-animation
  const [liveSample, setLiveSample] = useState<{ rawItems: number[]; mean: number } | null>(null);
  const [isSamplingLive, setIsSamplingLive] = useState(false);

  // Generate full batch
  const handleGenerate = useCallback(() => {
    const res = generateCLTSamples(parentType, sampleSizeN, numTrialsM);
    setCltResult(res);
    onSamplesGenerated?.();
  }, [parentType, sampleSizeN, numTrialsM, onSamplesGenerated]);

  // Initial batch
  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  // Animated Single Sample Roll
  const handleTakeSingleSample = () => {
    setIsSamplingLive(true);
    const items: number[] = [];
    let sum = 0;
    for (let i = 0; i < sampleSizeN; i++) {
      const val = sampleFromParent(parentType);
      items.push(val);
      sum += val;
    }
    const mean = sum / sampleSizeN;
    setLiveSample({ rawItems: items, mean });

    setTimeout(() => {
      setIsSamplingLive(false);
      // Append to active samples
      if (cltResult) {
        const nextSamples = [...cltResult.samples, mean];
        const nextMean = nextSamples.reduce((a, b) => a + b, 0) / nextSamples.length;
        setCltResult({
          samples: nextSamples,
          sampleMean: nextMean,
          sampleStdDev: cltResult.sampleStdDev,
        });
      }
    }, 900);
  };

  const parentStats = useMemo(
    () => getParentTheoreticalStats(parentType),
    [parentType]
  );
  const theoreticalSE = parentStats.stdDev / Math.sqrt(sampleSizeN);

  // Histogram binning of sample means
  const histogramData = useMemo(() => {
    if (!cltResult || cltResult.samples.length === 0)
      return { bins: [], maxCount: 1, minX: 0, maxX: 10, binWidth: 0.3 };

    const samples = cltResult.samples;
    const minX = Math.max(0, Math.min(...samples) - 0.5);
    const maxX = Math.max(...samples) + 0.5;
    const numBins = 32;
    const binWidth = (maxX - minX) / numBins;

    const counts = new Array(numBins).fill(0);
    samples.forEach((s) => {
      const idx = Math.min(numBins - 1, Math.max(0, Math.floor((s - minX) / binWidth)));
      counts[idx]++;
    });

    const maxCount = Math.max(1, ...counts);
    const bins = counts.map((count, i) => ({
      x0: minX + i * binWidth,
      x1: minX + (i + 1) * binWidth,
      mid: minX + (i + 0.5) * binWidth,
      count,
    }));

    return { bins, maxCount, minX, maxX, binWidth };
  }, [cltResult]);

  // SVG dimensions
  const width = 600;
  const height = 360;

  const xScale = (x: number) => {
    const { minX, maxX } = histogramData;
    return ((x - minX) / (maxX - minX || 1)) * (width - 60) + 30;
  };

  const yScale = (count: number) => {
    return height - 35 - (count / histogramData.maxCount) * (height - 80);
  };

  // Normal curve path
  const normalCurvePath = useMemo(() => {
    if (!cltResult) return "";
    const { minX, maxX, binWidth } = histogramData;
    const points: string[] = [];
    const steps = 120;
    const dx = (maxX - minX) / steps;
    const currentTrials = cltResult.samples.length;

    for (let i = 0; i <= steps; i++) {
      const x = minX + i * dx;
      const pdf = normalPDF(x, parentStats.mean, theoreticalSE);
      const expectedCount = pdf * currentTrials * binWidth;
      const px = xScale(x);
      const py = yScale(expectedCount);

      if (points.length === 0) points.push(`M ${px.toFixed(1)} ${py.toFixed(1)}`);
      else points.push(`L ${px.toFixed(1)} ${py.toFixed(1)}`);
    }

    return points.join(" ");
  }, [cltResult, histogramData, parentStats.mean, theoreticalSE]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: CLT Sampling Histogram (7 cols) ───────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Sampling Distribution of Sample Means (n = {sampleSizeN})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleTakeSingleSample}
              disabled={isSamplingLive}
              className="px-3 py-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-bold text-foreground transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
              title="Sample 1 trial with animation"
            >
              <Play size={12} className="text-primary" />
              <span>Sample 1 Trial</span>
            </button>

            <button
              onClick={handleGenerate}
              className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-black flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <RefreshCw size={13} />
              <span>Resample ({numTrialsM})</span>
            </button>
          </div>
        </div>

        {/* Live Sample Animation Strip */}
        {liveSample && (
          <div className="bg-muted/50 border border-border/80 rounded-2xl p-2.5 mb-2 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-primary">
                Live Sample ({sampleSizeN} items):
              </span>
              <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[220px]">
                [{liveSample.rawItems.slice(0, 5).map((v) => v.toFixed(1)).join(", ")}...]
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs font-black text-emerald-500">
              <span>Sample Mean x̄ = {liveSample.mean.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* SVG Histogram */}
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full max-h-[420px] select-none"
          >
            <defs>
              <clipPath id="clt-clip">
                <rect x="0" y="0" width={width} height={height} rx="20" ry="20" />
              </clipPath>
              <linearGradient id="clt-bar-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            <g clipPath="url(#clt-clip)">
              {/* Baseline axis */}
              <line
                x1={20}
                y1={height - 35}
                x2={width - 20}
                y2={height - 35}
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="2"
              />

              {/* Histogram Bins with Gradient Fill */}
              {histogramData.bins.map((b, idx) => {
                const px0 = xScale(b.x0);
                const px1 = xScale(b.x1);
                const py = yScale(b.count);
                const barHeight = Math.max(0, height - 35 - py);

                return (
                  <rect
                    key={`hist-bin-${idx}`}
                    x={px0}
                    y={py}
                    width={Math.max(1, px1 - px0 - 1.5)}
                    height={barHeight}
                    fill="url(#clt-bar-gradient)"
                    stroke="#6366f1"
                    strokeWidth="1"
                    rx="3"
                  />
                );
              })}

              {/* Theoretical Limiting Normal Curve (Gold) */}
              <path
                d={normalCurvePath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Theoretical Population Mean Line μ */}
              <line
                x1={xScale(parentStats.mean)}
                y1={20}
                x2={xScale(parentStats.mean)}
                y2={height - 35}
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="5 3"
              />
              <text
                x={xScale(parentStats.mean) + 6}
                y={30}
                className="fill-emerald-500 font-mono text-[10px] font-black"
              >
                μ = {parentStats.mean.toFixed(2)}
              </text>
            </g>
          </svg>
        </div>

        {/* ── Metric Summary Strip ───────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Sample Mean x̄
            </span>
            <span className="font-mono font-black text-primary text-sm">
              {cltResult ? cltResult.sampleMean.toFixed(3) : "—"}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Empirical Std Error (s_x̄)
            </span>
            <span className="font-mono font-bold text-foreground text-sm">
              {cltResult ? cltResult.sampleStdDev.toFixed(3) : "—"}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Theoretical SE = σ/√n
            </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {theoreticalSE.toFixed(3)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: CLT Controls (5 cols) ────────────────────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Parent Distribution & Sampling
            </span>
          </div>
        </div>

        {/* Parent Distribution Selector */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground block">
            Parent Population Shape
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            {(
              [
                ["exponential", "Exponential (Skewed)"],
                ["bimodal", "Bimodal (Double Peak)"],
                ["uniform", "Uniform U(0, 10)"],
                ["dice", "Discrete Dice (1-6)"],
              ] as [ParentDistributionType, string][]
            ).map(([type, label]) => (
              <button
                key={type}
                onClick={() => setParentType(type)}
                className={`p-3 rounded-2xl text-left transition-all ${
                  parentType === type
                    ? "bg-primary text-primary-foreground shadow-md font-black"
                    : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Sample Size n Slider */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">
              Sample Size <span className="font-mono text-primary">(n)</span>
            </span>
            <span className="font-mono text-primary font-black">{sampleSizeN} items / sample</span>
          </div>
          <input
            type="range"
            min="1"
            max="60"
            step="1"
            value={sampleSizeN}
            onChange={(e) => setSampleSizeN(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Number of Trials M Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">
              Number of Trials <span className="font-mono text-primary">(M)</span>
            </span>
            <span className="font-mono text-primary font-black">{numTrialsM.toLocaleString()} samples</span>
          </div>
          <input
            type="range"
            min="200"
            max="3000"
            step="100"
            value={numTrialsM}
            onChange={(e) => setNumTrialsM(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Central Limit Theorem Card */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl text-xs space-y-1.5">
          <h4 className="font-bold text-foreground flex items-center gap-1.5">
            <BookOpen size={14} className="text-primary" />
            <span>The Central Limit Theorem</span>
          </h4>
          <p className="text-muted-foreground">
            Regardless of the parent population&apos;s shape (even if highly skewed or bimodal), the distribution of the sample mean <code>x̄</code> approaches a normal distribution as <code>n</code> grows:
          </p>
          <div className="font-mono text-xs font-bold text-primary bg-background/60 p-2 rounded-xl text-center border border-border/80">
            x̄ ~ N(μ, σ² / n)
          </div>
        </div>
      </div>
    </div>
  );
}
