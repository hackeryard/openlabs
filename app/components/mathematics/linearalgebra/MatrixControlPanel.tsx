"use client";

import React, { useMemo } from "react";
import { Matrix2x2, MatrixPresetId } from "./types";
import {
  calculateDeterminant,
  invertMatrix,
  MATRIX_PRESETS,
  createRotationMatrix,
} from "./lib/linearMath";
import {
  Sliders,
  RotateCcw,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Compass,
  Target,
  Activity,
} from "lucide-react";

interface MatrixControlPanelProps {
  matrix: Matrix2x2;
  onUpdateMatrix: (m: Matrix2x2) => void;
  tAnim: number;
  onChangeTAnim: (t: number) => void;
  rotationAngleDeg: number;
  onChangeRotationAngle: (deg: number) => void;
  showOriginalGrid: boolean;
  onToggleOriginalGrid: () => void;
  showTransformedGrid: boolean;
  onToggleTransformedGrid: () => void;
  showUnitSquare: boolean;
  onToggleUnitSquare: () => void;
  showBasisVectors: boolean;
  onToggleBasisVectors: () => void;
  showEigenLines: boolean;
  onToggleEigenLines: () => void;
  showSVD: boolean;
  onToggleSVD: () => void;
  showCustomVector: boolean;
  onToggleCustomVector: () => void;
  isSolvingSystem: boolean;
  onToggleSolvingSystem: () => void;
  onDeterminantAnalyzed?: () => void;
}

export default function MatrixControlPanel({
  matrix,
  onUpdateMatrix,
  tAnim,
  onChangeTAnim,
  rotationAngleDeg,
  onChangeRotationAngle,
  showOriginalGrid,
  onToggleOriginalGrid,
  showTransformedGrid,
  onToggleTransformedGrid,
  showUnitSquare,
  onToggleUnitSquare,
  showBasisVectors,
  onToggleBasisVectors,
  showEigenLines,
  onToggleEigenLines,
  showSVD,
  onToggleSVD,
  showCustomVector,
  onToggleCustomVector,
  isSolvingSystem,
  onToggleSolvingSystem,
  onDeterminantAnalyzed,
}: MatrixControlPanelProps) {
  const determinant = useMemo(() => calculateDeterminant(matrix), [matrix]);
  const inverse = useMemo(() => invertMatrix(matrix), [matrix]);

  const handleCellChange = (r: number, c: number, val: number) => {
    const next: Matrix2x2 = [
      [matrix[0][0], matrix[0][1]],
      [matrix[1][0], matrix[1][1]],
    ];
    next[r][c] = val;
    onUpdateMatrix(next);
    onDeterminantAnalyzed?.();
  };

  const handleApplyPreset = (presetId: MatrixPresetId) => {
    const preset = MATRIX_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      onUpdateMatrix(preset.matrix);
      onDeterminantAnalyzed?.();
    }
  };

  const handleRotationSlider = (deg: number) => {
    onChangeRotationAngle(deg);
    const rad = (deg * Math.PI) / 180;
    onUpdateMatrix(createRotationMatrix(rad));
    onDeterminantAnalyzed?.();
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Transformation Studio & Controls
          </span>
        </div>

        <button
          onClick={() => handleApplyPreset("identity")}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-muted hover:bg-accent text-muted-foreground hover:text-foreground text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm active:scale-95"
        >
          <RotateCcw size={12} />
          <span>Reset I</span>
        </button>
      </div>

      {/* ── Matrix 2x2 Interactive Console ──────────────────── */}
      <div className="p-4 bg-muted/50 border border-border rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Matrix A = [î | ĵ]
          </span>
          <span className="text-[11px] font-mono text-muted-foreground">
            det(A) = <strong className="text-primary">{determinant.toFixed(2)}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-[300px] mx-auto">
          {/* a (i.x) */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-emerald-500">a (î_x)</span>
              <span className="font-mono text-foreground">{matrix[0][0].toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={matrix[0][0]}
              onChange={(e) => handleCellChange(0, 0, parseFloat(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* b (j.x) */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-blue-500">b (ĵ_x)</span>
              <span className="font-mono text-foreground">{matrix[0][1].toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={matrix[0][1]}
              onChange={(e) => handleCellChange(0, 1, parseFloat(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* c (i.y) */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-emerald-500">c (î_y)</span>
              <span className="font-mono text-foreground">{matrix[1][0].toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={matrix[1][0]}
              onChange={(e) => handleCellChange(1, 0, parseFloat(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* d (j.y) */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-blue-500">d (ĵ_y)</span>
              <span className="font-mono text-foreground">{matrix[1][1].toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={matrix[1][1]}
              onChange={(e) => handleCellChange(1, 1, parseFloat(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      </div>

      {/* ── Animation Scrub Slider (Manual Interpolation) ────── */}
      <div className="p-3.5 bg-background/80 border border-border rounded-2xl space-y-1.5">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-foreground">
            Transformation Progress <span className="font-mono text-primary">(t)</span>
          </span>
          <span className="font-mono text-primary font-black">
            {(tAnim * 100).toFixed(0)}% (t = {tAnim.toFixed(2)})
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={tAnim}
          onChange={(e) => onChangeTAnim(parseFloat(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>Identity I (t=0)</span>
          <span>Matrix A (t=1)</span>
        </div>
      </div>

      {/* ── Determinant & Space Compression Card ───────────── */}
      <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-foreground">
            Determinant det(A) = ad - bc
          </span>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 ${
              determinant > 0
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : determinant === 0
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
            }`}
          >
            {determinant > 0 && <CheckCircle2 size={11} />}
            {determinant < 0 && <RefreshCw size={11} />}
            {determinant === 0 && <AlertTriangle size={11} />}
            {determinant > 0
              ? "Orientation Preserved"
              : determinant < 0
              ? "Orientation Inverted (Flipped)"
              : "Space Collapsed (Singular)"}
          </span>
        </div>

        <div className="font-mono text-xs bg-background/80 p-2.5 rounded-xl border border-border/80 space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Area Scale Factor:</span>
            <span className="font-bold text-foreground">
              |det(A)| = <strong className="text-primary">{Math.abs(determinant).toFixed(3)}×</strong>
            </span>
          </div>

          <div className="flex justify-between pt-1 border-t border-border/60">
            <span className="text-muted-foreground">Inverse Matrix A⁻¹:</span>
            <span className="font-bold text-foreground">
              {inverse ? (
                <span className="text-emerald-600 dark:text-emerald-400">
                  [[{inverse[0][0].toFixed(2)}, {inverse[0][1].toFixed(2)}], [{inverse[1][0].toFixed(2)}, {inverse[1][1].toFixed(2)}]]
                </span>
              ) : (
                <span className="text-rose-500">Undefined (Singular)</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* ── Continuous Rotation Slider ──────────────────────── */}
      <div className="space-y-1.5 p-3 rounded-2xl bg-muted/40 border border-border">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-foreground flex items-center gap-1.5">
            <Compass size={14} className="text-primary" />
            <span>Continuous Rotation (θ)</span>
          </span>
          <span className="font-mono text-primary font-black">{rotationAngleDeg}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          value={rotationAngleDeg}
          onChange={(e) => handleRotationSlider(parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* ── Preset Transformation Actions ──────────────────── */}
      <div className="space-y-2 pt-2 border-t border-border">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
          Preset Transformations
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handleApplyPreset("shearX")}
            className="px-2.5 py-1 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground transition-all shadow-sm active:scale-95"
          >
            Horizontal Shear
          </button>
          <button
            onClick={() => handleApplyPreset("shearY")}
            className="px-2.5 py-1 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground transition-all shadow-sm active:scale-95"
          >
            Vertical Shear
          </button>
          <button
            onClick={() => handleApplyPreset("scale")}
            className="px-2.5 py-1 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground transition-all shadow-sm active:scale-95"
          >
            Scale (2×, 1.5×)
          </button>
          <button
            onClick={() => handleApplyPreset("squeeze")}
            className="px-2.5 py-1 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground transition-all shadow-sm active:scale-95"
          >
            Squeeze Mapping
          </button>
          <button
            onClick={() => handleApplyPreset("reflectionX")}
            className="px-2.5 py-1 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground transition-all shadow-sm active:scale-95"
          >
            Reflect X
          </button>
          <button
            onClick={() => handleApplyPreset("reflectionDiag")}
            className="px-2.5 py-1 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground transition-all shadow-sm active:scale-95"
          >
            Reflect y = x
          </button>
          <button
            onClick={() => handleApplyPreset("projectionX")}
            className="px-2.5 py-1 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground transition-all shadow-sm active:scale-95"
          >
            Project to 1D
          </button>
        </div>
      </div>

      {/* ── Feature & Layer Toggles ────────────────────────── */}
      <div className="space-y-2 pt-2 border-t border-border">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
          Interactive Overlays
        </span>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={onToggleOriginalGrid}
            className={`p-2 rounded-xl border font-bold flex items-center justify-between transition-all ${
              showOriginalGrid
                ? "bg-primary/10 border-primary text-primary"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Original Grid</span>
            <span className={`w-2 h-2 rounded-full ${showOriginalGrid ? "bg-primary" : "bg-muted-foreground/40"}`} />
          </button>

          <button
            onClick={onToggleTransformedGrid}
            className={`p-2 rounded-xl border font-bold flex items-center justify-between transition-all ${
              showTransformedGrid
                ? "bg-primary/10 border-primary text-primary"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Warped Grid</span>
            <span className={`w-2 h-2 rounded-full ${showTransformedGrid ? "bg-primary" : "bg-muted-foreground/40"}`} />
          </button>

          <button
            onClick={onToggleEigenLines}
            className={`p-2 rounded-xl border font-bold flex items-center justify-between transition-all ${
              showEigenLines
                ? "bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-400"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Invariant Eigen-Lines</span>
            <span className={`w-2 h-2 rounded-full ${showEigenLines ? "bg-purple-500" : "bg-muted-foreground/40"}`} />
          </button>

          <button
            onClick={onToggleSVD}
            className={`p-2 rounded-xl border font-bold flex items-center justify-between transition-all ${
              showSVD
                ? "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>SVD Singular Axes (σ)</span>
            <span className={`w-2 h-2 rounded-full ${showSVD ? "bg-rose-500" : "bg-muted-foreground/40"}`} />
          </button>

          <button
            onClick={onToggleCustomVector}
            className={`p-2 rounded-xl border font-bold flex items-center justify-between transition-all ${
              showCustomVector
                ? "bg-pink-500/10 border-pink-500 text-pink-600 dark:text-pink-400"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Test Vector (u → Au)</span>
            <span className={`w-2 h-2 rounded-full ${showCustomVector ? "bg-pink-500" : "bg-muted-foreground/40"}`} />
          </button>

          <button
            onClick={onToggleSolvingSystem}
            className={`p-2 rounded-xl border font-bold flex items-center justify-between transition-all ${
              isSolvingSystem
                ? "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Solve Ax = b System</span>
            <span className={`w-2 h-2 rounded-full ${isSolvingSystem ? "bg-amber-500" : "bg-muted-foreground/40"}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
