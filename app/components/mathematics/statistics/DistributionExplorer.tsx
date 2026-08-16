"use client";

import React, { useState, useMemo } from "react";
import { DistributionType } from "./types";
import {
  normalPDF,
  normalCDF,
  binomialPMF,
  poissonPMF,
  uniformPDF,
} from "./lib/statsMath";
import {
  Sparkles,
  Sliders,
  TrendingUp,
  Activity,
  Layers,
  BookOpen,
} from "lucide-react";

interface DistributionExplorerProps {
  onDistributionExplored?: () => void;
}

export default function DistributionExplorer({
  onDistributionExplored,
}: DistributionExplorerProps) {
  const [distType, setDistType] = useState<DistributionType>("normal");
  const [viewMode, setViewMode] = useState<"pdf" | "cdf">("pdf");

  // Parameters
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [n, setN] = useState(20);
  const [p, setP] = useState(0.5);
  const [lambdaVal, setLambdaVal] = useState(4);
  const [uniformA, setUniformA] = useState(-2);
  const [uniformB, setUniformB] = useState(2);

  // Interval bounds
  const [lowerBound, setLowerBound] = useState(-1);
  const [upperBound, setUpperBound] = useState(1);

  // SVG dimensions
  const width = 600;
  const height = 360;

  // Domain based on active distribution
  const { minX, maxX, maxY } = useMemo(() => {
    switch (distType) {
      case "normal":
        return {
          minX: mu - 4 * sigma,
          maxX: mu + 4 * sigma,
          maxY: viewMode === "pdf" ? (1 / (sigma * Math.sqrt(2 * Math.PI))) * 1.15 : 1.1,
        };
      case "binomial":
        return { minX: 0, maxX: n, maxY: viewMode === "pdf" ? 0.35 : 1.1 };
      case "poisson":
        return { minX: 0, maxX: Math.max(12, lambdaVal * 2.5), maxY: viewMode === "pdf" ? 0.35 : 1.1 };
      case "uniform":
        return {
          minX: uniformA - 1,
          maxX: uniformB + 1,
          maxY: viewMode === "pdf" ? (1 / Math.max(0.1, uniformB - uniformA)) * 1.25 : 1.1,
        };
    }
  }, [distType, viewMode, mu, sigma, n, p, lambdaVal, uniformA, uniformB]);

  const xScale = (x: number) =>
    ((x - minX) / (maxX - minX || 1)) * (width - 60) + 30;

  const yScale = (y: number) =>
    height - 35 - (y / (maxY || 1)) * (height - 70);

  // Compute shaded area probability P(x1 <= X <= x2)
  const intervalProb = useMemo(() => {
    switch (distType) {
      case "normal": {
        const p2 = normalCDF(upperBound, mu, sigma);
        const p1 = normalCDF(lowerBound, mu, sigma);
        return Math.max(0, p2 - p1);
      }
      case "binomial": {
        let sum = 0;
        const kMin = Math.ceil(lowerBound);
        const kMax = Math.floor(upperBound);
        for (let k = kMin; k <= kMax; k++) {
          sum += binomialPMF(k, n, p);
        }
        return sum;
      }
      case "poisson": {
        let sum = 0;
        const kMin = Math.max(0, Math.ceil(lowerBound));
        const kMax = Math.floor(upperBound);
        for (let k = kMin; k <= kMax; k++) {
          sum += poissonPMF(k, lambdaVal);
        }
        return sum;
      }
      case "uniform": {
        const overlapA = Math.max(uniformA, lowerBound);
        const overlapB = Math.min(uniformB, upperBound);
        if (overlapB <= overlapA) return 0;
        return (overlapB - overlapA) / (uniformB - uniformA);
      }
    }
  }, [distType, mu, sigma, n, p, lambdaVal, uniformA, uniformB, lowerBound, upperBound]);

  // Curve and shaded area paths
  const { curvePath, shadedPath } = useMemo(() => {
    if (distType === "binomial" || distType === "poisson") {
      return { curvePath: "", shadedPath: "" };
    }

    const steps = 200;
    const dx = (maxX - minX) / steps;
    const curvePoints: string[] = [];
    const shadedPoints: string[] = [];

    let isShading = false;

    for (let i = 0; i <= steps; i++) {
      const x = minX + i * dx;
      const y =
        viewMode === "pdf"
          ? distType === "normal"
            ? normalPDF(x, mu, sigma)
            : uniformPDF(x, uniformA, uniformB)
          : distType === "normal"
          ? normalCDF(x, mu, sigma)
          : Math.max(0, Math.min(1, (x - uniformA) / (uniformB - uniformA)));

      const px = xScale(x);
      const py = yScale(y);

      if (curvePoints.length === 0) curvePoints.push(`M ${px.toFixed(1)} ${py.toFixed(1)}`);
      else curvePoints.push(`L ${px.toFixed(1)} ${py.toFixed(1)}`);

      if (viewMode === "pdf" && x >= lowerBound && x <= upperBound) {
        if (!isShading) {
          shadedPoints.push(`M ${px.toFixed(1)} ${yScale(0).toFixed(1)}`);
          isShading = true;
        }
        shadedPoints.push(`L ${px.toFixed(1)} ${py.toFixed(1)}`);
      } else if (isShading) {
        shadedPoints.push(`L ${px.toFixed(1)} ${yScale(0).toFixed(1)}`);
        isShading = false;
      }
    }

    if (isShading) {
      shadedPoints.push(`L ${xScale(upperBound).toFixed(1)} ${yScale(0).toFixed(1)}`);
    }

    return {
      curvePath: curvePoints.join(" "),
      shadedPath: shadedPoints.join(" ") + " Z",
    };
  }, [distType, viewMode, minX, maxX, mu, sigma, uniformA, uniformB, lowerBound, upperBound, xScale, yScale]);

  const z1 = distType === "normal" ? (lowerBound - mu) / sigma : 0;
  const z2 = distType === "normal" ? (upperBound - mu) / sigma : 0;

  const handleSetEmpiricalSigma = (k: number) => {
    setDistType("normal");
    setLowerBound(Number((mu - k * sigma).toFixed(2)));
    setUpperBound(Number((mu + k * sigma).toFixed(2)));
    onDistributionExplored?.();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: PDF / CDF Canvas (7 cols) ─────────────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              {viewMode === "pdf" ? "Probability Density (PDF)" : "Cumulative Distribution (CDF)"} Curve
            </span>
          </div>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
            <button
              onClick={() => setViewMode("pdf")}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                viewMode === "pdf"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              PDF
            </button>
            <button
              onClick={() => setViewMode("cdf")}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                viewMode === "cdf"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              CDF
            </button>
          </div>
        </div>

        {/* SVG Plot */}
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full max-h-[420px] select-none"
          >
            <defs>
              <clipPath id="dist-clip">
                <rect x="0" y="0" width={width} height={height} rx="20" ry="20" />
              </clipPath>
              <linearGradient id="dist-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            <g clipPath="url(#dist-clip)">
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

              {/* Shaded Area for continuous curves */}
              {shadedPath && (
                <path
                  d={shadedPath}
                  fill="url(#dist-area-gradient)"
                  stroke="none"
                />
              )}

              {/* Continuous PDF/CDF curve */}
              {curvePath && (
                <path
                  d={curvePath}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              )}

              {/* Discrete bars for Binomial & Poisson */}
              {(distType === "binomial" || distType === "poisson") && (
                <g>
                  {Array.from({ length: Math.floor(maxX - minX) + 1 }).map((_, i) => {
                    const k = Math.floor(minX) + i;
                    const prob =
                      distType === "binomial"
                        ? binomialPMF(k, n, p)
                        : poissonPMF(k, lambdaVal);
                    const isInside = k >= lowerBound && k <= upperBound;
                    const px = xScale(k);
                    const py = yScale(prob);
                    const barHeight = Math.max(0, height - 35 - py);

                    return (
                      <g key={`bar-${k}`}>
                        <rect
                          x={px - 6}
                          y={py}
                          width={12}
                          height={barHeight}
                          fill={isInside ? "#6366f1" : "currentColor"}
                          fillOpacity={isInside ? 0.75 : 0.2}
                          rx="3"
                        />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Bound Lines */}
              <line
                x1={xScale(lowerBound)}
                y1={20}
                x2={xScale(lowerBound)}
                y2={height - 35}
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
              <text
                x={xScale(lowerBound) + 4}
                y={30}
                className="fill-emerald-500 font-mono text-[10px] font-black"
              >
                x₁ = {lowerBound.toFixed(2)}
              </text>

              <line
                x1={xScale(upperBound)}
                y1={20}
                x2={xScale(upperBound)}
                y2={height - 35}
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
              <text
                x={xScale(upperBound) - 4}
                y={30}
                textAnchor="end"
                className="fill-rose-500 font-mono text-[10px] font-black"
              >
                x₂ = {upperBound.toFixed(2)}
              </text>
            </g>
          </svg>
        </div>

        {/* ── Metric Summary Strip ───────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Interval Probability P(x₁ ≤ X ≤ x₂)
            </span>
            <span className="font-mono font-black text-primary text-base">
              {(intervalProb * 100).toFixed(2)}%
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Z-Score Range
            </span>
            <span className="font-mono font-bold text-foreground text-sm">
              [{z1.toFixed(2)}, {z2.toFixed(2)}]
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Decimal Area
            </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {intervalProb.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: Distribution Parameters (5 cols) ─────────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Distribution Model & Bounds
            </span>
          </div>
        </div>

        {/* Distribution Type Switcher */}
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          {(
            [
              ["normal", "Normal / Gaussian"],
              ["binomial", "Binomial B(n, p)"],
              ["poisson", "Poisson (λ)"],
              ["uniform", "Uniform U(a, b)"],
            ] as [DistributionType, string][]
          ).map(([type, label]) => (
            <button
              key={type}
              onClick={() => {
                setDistType(type);
                onDistributionExplored?.();
              }}
              className={`p-3 rounded-2xl text-left transition-all ${
                distType === type
                  ? "bg-primary text-primary-foreground shadow-md font-black"
                  : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Parameters specific to selected distribution */}
        {distType === "normal" && (
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Mean (μ)</span>
                <span className="font-mono text-primary">{mu.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.2"
                value={mu}
                onChange={(e) => setMu(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Standard Deviation (σ)</span>
                <span className="font-mono text-primary">{sigma.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3"
                step="0.1"
                value={sigma}
                onChange={(e) => setSigma(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Empirical Rule Buttons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Empirical Rule Presets
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
                <button
                  onClick={() => handleSetEmpiricalSigma(1)}
                  className="py-2 px-2 bg-muted hover:bg-accent rounded-xl text-foreground text-center transition-all active:scale-95"
                >
                  ±1σ (68.3%)
                </button>
                <button
                  onClick={() => handleSetEmpiricalSigma(2)}
                  className="py-2 px-2 bg-muted hover:bg-accent rounded-xl text-foreground text-center transition-all active:scale-95"
                >
                  ±2σ (95.5%)
                </button>
                <button
                  onClick={() => handleSetEmpiricalSigma(3)}
                  className="py-2 px-2 bg-muted hover:bg-accent rounded-xl text-foreground text-center transition-all active:scale-95"
                >
                  ±3σ (99.7%)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Interval Bounds Sliders */}
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-emerald-500">Lower Bound (x₁)</span>
              <span className="font-mono text-emerald-500">{lowerBound.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={minX}
              max={upperBound - 0.1}
              step="0.1"
              value={lowerBound}
              onChange={(e) => setLowerBound(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-rose-500">Upper Bound (x₂)</span>
              <span className="font-mono text-rose-500">{upperBound.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={lowerBound + 0.1}
              max={maxX}
              step="0.1"
              value={upperBound}
              onChange={(e) => setUpperBound(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
