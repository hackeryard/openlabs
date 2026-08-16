"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import { DataPoint2D, RegressionResult } from "./types";
import { computeLinearRegression, REGRESSION_PRESETS } from "./lib/statsMath";
import {
  TrendingUp,
  RotateCcw,
  Sparkles,
  Sliders,
  Plus,
  Trash2,
  BookOpen,
  Square,
} from "lucide-react";

interface RegressionStudioCanvasProps {
  onRegressionFitted?: () => void;
}

export default function RegressionStudioCanvas({
  onRegressionFitted,
}: RegressionStudioCanvasProps) {
  const [points, setPoints] = useState<DataPoint2D[]>(
    REGRESSION_PRESETS[0].points
  );
  const [draggingPointId, setDraggingPointId] = useState<string | null>(null);
  const [showResiduals, setShowResiduals] = useState(true);
  const [showResidualSquares, setShowResidualSquares] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Compute regression
  const regression: RegressionResult = useMemo(
    () => computeLinearRegression(points),
    [points]
  );

  // SVG coordinate scales (Domain x: [0, 10], y: [0, 10])
  const width = 600;
  const height = 400;
  const minCoord = 0;
  const maxCoord = 10;

  const xScale = useCallback(
    (x: number) => ((x - minCoord) / (maxCoord - minCoord)) * (width - 60) + 30,
    [minCoord, maxCoord, width]
  );

  const yScale = useCallback(
    (y: number) => height - 30 - ((y - minCoord) / (maxCoord - minCoord)) * (height - 60),
    [minCoord, maxCoord, height]
  );

  const screenToWorld = useCallback(
    (clientX: number, clientY: number) => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      const svgX = ((clientX - rect.left) / rect.width) * width;
      const svgY = ((clientY - rect.top) / rect.height) * height;
      const worldX = ((svgX - 30) / (width - 60)) * (maxCoord - minCoord) + minCoord;
      const worldY =
        ((height - 30 - svgY) / (height - 60)) * (maxCoord - minCoord) + minCoord;
      return {
        x: Math.max(0, Math.min(10, Number(worldX.toFixed(2)))),
        y: Math.max(0, Math.min(10, Number(worldY.toFixed(2)))),
      };
    },
    [width, height, minCoord, maxCoord]
  );

  // Click canvas to add point
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (draggingPointId) return;
    const { x, y } = screenToWorld(e.clientX, e.clientY);
    const newPt: DataPoint2D = {
      id: Date.now().toString(),
      x,
      y,
    };
    setPoints((prev) => [...prev, newPt]);
    onRegressionFitted?.();
  };

  // Dragging existing points
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingPointId) return;
    const { x, y } = screenToWorld(e.clientX, e.clientY);
    setPoints((prev) =>
      prev.map((pt) => (pt.id === draggingPointId ? { ...pt, x, y } : pt))
    );
  };

  const handlePointerUp = () => {
    setDraggingPointId(null);
  };

  const handleApplyPreset = (presetPoints: DataPoint2D[]) => {
    setPoints(presetPoints);
    onRegressionFitted?.();
  };

  // Regression line endpoints at x = 0 and x = 10
  const lineY0 = regression.slope * 0 + regression.intercept;
  const lineY10 = regression.slope * 10 + regression.intercept;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive Scatter Canvas (7 cols) ───────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Scatter Plot & Least Squares Fit
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowResiduals((r) => !r)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                showResiduals
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Residuals
            </button>

            <button
              onClick={() => setShowResidualSquares((s) => !s)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                showResidualSquares
                  ? "bg-rose-500 text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Error Squares (SSE)
            </button>

            <button
              onClick={() => setPoints([])}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Clear Points"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* SVG Scatter Canvas */}
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full max-h-[420px] cursor-crosshair select-none touch-none"
            onClick={handleCanvasClick}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <defs>
              <clipPath id="scatter-clip">
                <rect x="0" y="0" width={width} height={height} rx="20" ry="20" />
              </clipPath>
            </defs>

            <g clipPath="url(#scatter-clip)">
              {/* Grid lines */}
              {[2, 4, 6, 8].map((val) => (
                <g key={`grid-${val}`} className="opacity-20">
                  <line
                    x1={xScale(val)}
                    y1={20}
                    x2={xScale(val)}
                    y2={height - 30}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <line
                    x1={30}
                    y1={yScale(val)}
                    x2={width - 30}
                    y2={yScale(val)}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                </g>
              ))}

              {/* Axes */}
              <line
                x1={30}
                y1={height - 30}
                x2={width - 30}
                y2={height - 30}
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="2"
              />
              <line
                x1={30}
                y1={20}
                x2={30}
                y2={height - 30}
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="2"
              />

              {/* Geometric Residual Error Squares */}
              {showResidualSquares &&
                points.map((pt) => {
                  const predictedY = regression.slope * pt.x + regression.intercept;
                  const py = yScale(pt.y);
                  const pyPred = yScale(predictedY);
                  const side = Math.abs(py - pyPred);
                  const top = Math.min(py, pyPred);

                  return (
                    <rect
                      key={`sq-${pt.id}`}
                      x={xScale(pt.x)}
                      y={top}
                      width={side}
                      height={side}
                      fill="#ef4444"
                      fillOpacity="0.15"
                      stroke="#ef4444"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  );
                })}

              {/* Residual Lines (Dashed red) */}
              {showResiduals &&
                points.map((pt) => {
                  const predictedY = regression.slope * pt.x + regression.intercept;
                  return (
                    <line
                      key={`res-${pt.id}`}
                      x1={xScale(pt.x)}
                      y1={yScale(pt.y)}
                      x2={xScale(pt.x)}
                      y2={yScale(predictedY)}
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                    />
                  );
                })}

              {/* OLS Regression Line (Solid Primary) */}
              {points.length >= 2 && (
                <line
                  x1={xScale(0)}
                  y1={yScale(lineY0)}
                  x2={xScale(10)}
                  y2={yScale(lineY10)}
                  stroke="#6366f1"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              )}

              {/* Interactive Data Points */}
              {points.map((pt) => (
                <g key={`pt-${pt.id}`}>
                  <circle
                    cx={xScale(pt.x)}
                    cy={yScale(pt.y)}
                    r="7"
                    fill="#ec4899"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-grab active:cursor-grabbing"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setDraggingPointId(pt.id);
                    }}
                  />
                </g>
              ))}
            </g>
          </svg>
        </div>

        {/* ── Metric Summary Strip ───────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Regression Line
            </span>
            <span className="font-mono font-black text-primary text-xs truncate block">
              {regression.equation}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Pearson Correlation (r)
            </span>
            <span
              className={`font-mono font-bold text-sm ${
                regression.r > 0 ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {regression.r.toFixed(3)}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Determination (R²)
            </span>
            <span className="font-mono font-bold text-foreground text-sm">
              {(regression.rSquared * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: Presets & Statistics Guide (5 cols) ───────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Datasets & Model Metrics
            </span>
          </div>
        </div>

        {/* Dataset Presets */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground block">
            Load Correlation Presets
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            {REGRESSION_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleApplyPreset(preset.points)}
                className="p-3 bg-muted hover:bg-accent border border-border rounded-2xl text-left text-muted-foreground hover:text-foreground transition-all shadow-sm active:scale-95"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl text-xs space-y-1.5">
          <h4 className="font-bold text-foreground flex items-center gap-1.5">
            <BookOpen size={14} className="text-primary" />
            <span>Why is it called &ldquo;Least Squares&rdquo;?</span>
          </h4>
          <p className="text-muted-foreground">
            Toggle the <strong>Error Squares</strong> button above to render the literal geometric squares attached to each data point. The OLS algorithm mathematically guarantees that the sum of areas of these red squares is minimized!
          </p>
          <div className="font-mono text-xs font-bold text-primary bg-background/60 p-2 rounded-xl text-center border border-border/80">
            SSE = ∑ (yᵢ - ŷᵢ)² = min!
          </div>
        </div>
      </div>
    </div>
  );
}
