"use client";

import React, { useMemo } from "react";
import { Matrix2x2, EigenResult, SVDResult } from "./types";
import { calculateEigen, calculateSVD, transformVector } from "./lib/linearMath";
import {
  Sparkles,
  Activity,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Layers,
} from "lucide-react";

interface EigenPanelProps {
  matrix: Matrix2x2;
  onEigenAnalyzed?: () => void;
}

export default function EigenPanel({
  matrix,
  onEigenAnalyzed,
}: EigenPanelProps) {
  const eigen: EigenResult = useMemo(() => calculateEigen(matrix), [matrix]);
  const svd: SVDResult = useMemo(() => calculateSVD(matrix), [matrix]);

  // Test Av = lambda * v for v1
  const v1Check = useMemo(() => {
    if (!eigen.hasRealEigenvalues || !eigen.v1) return null;
    const transformed = transformVector(matrix, eigen.v1);
    const scaled = {
      x: eigen.lambda1 * eigen.v1.x,
      y: eigen.lambda1 * eigen.v1.y,
    };
    const isMatch =
      Math.abs(transformed.x - scaled.x) < 1e-3 &&
      Math.abs(transformed.y - scaled.y) < 1e-3;

    return { transformed, scaled, isMatch };
  }, [matrix, eigen]);

  return (
    <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-lg space-y-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Eigenvalues, Eigenvectors & SVD Analysis
          </span>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${
            eigen.hasRealEigenvalues
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
          }`}
        >
          {eigen.hasRealEigenvalues ? (
            <>
              <CheckCircle2 size={13} />
              2 Real Eigenvalues
            </>
          ) : (
            <>
              <AlertCircle size={13} />
              Complex Eigenvalues (Rotational Mapping)
            </>
          )}
        </span>
      </div>

      {/* ── Characteristic Polynomial Equation Card ───────── */}
      <div className="p-4 bg-muted/60 border border-border rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Characteristic Equation det(A - λI) = 0
          </span>
          <span className="text-xs font-mono text-primary font-bold">
            λ² - tr(A)λ + det(A) = 0
          </span>
        </div>

        <div className="font-mono text-base font-black text-foreground bg-background/70 p-3 rounded-xl border border-border/80 text-center">
          λ² {eigen.trace >= 0 ? `- ${eigen.trace.toFixed(2)}λ` : `+ ${Math.abs(eigen.trace).toFixed(2)}λ`}{" "}
          {eigen.determinant >= 0 ? `+ ${eigen.determinant.toFixed(2)}` : `- ${Math.abs(eigen.determinant).toFixed(2)}`} = 0
        </div>
      </div>

      {/* ── Eigenvalues & Eigenvectors Display ──────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lambda 1 & v1 */}
        <div className="p-4 bg-background/80 border border-border rounded-2xl space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-pink-500">
              Eigenpair 1 (λ₁, v₁)
            </span>
            <span className="font-black text-pink-500 text-sm">
              λ₁ = {eigen.hasRealEigenvalues ? eigen.lambda1.toFixed(3) : eigen.lambda1Complex}
            </span>
          </div>

          {eigen.hasRealEigenvalues && eigen.v1 && (
            <div className="p-2.5 bg-muted/60 rounded-xl space-y-1 text-[11px]">
              <span className="text-muted-foreground block">
                Normalized Eigenvector v₁:
              </span>
              <span className="font-bold text-foreground block">
                v₁ = [{eigen.v1.x.toFixed(3)}, {eigen.v1.y.toFixed(3)}]ᵀ
              </span>
              <span className="text-[10px] text-muted-foreground">
                Invariant line slope m = {(eigen.v1.y / (eigen.v1.x || 0.001)).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Lambda 2 & v2 */}
        <div className="p-4 bg-background/80 border border-border rounded-2xl space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-purple-500">
              Eigenpair 2 (λ₂, v₂)
            </span>
            <span className="font-black text-purple-500 text-sm">
              λ₂ = {eigen.hasRealEigenvalues ? eigen.lambda2.toFixed(3) : eigen.lambda2Complex}
            </span>
          </div>

          {eigen.hasRealEigenvalues && eigen.v2 && (
            <div className="p-2.5 bg-muted/60 rounded-xl space-y-1 text-[11px]">
              <span className="text-muted-foreground block">
                Normalized Eigenvector v₂:
              </span>
              <span className="font-bold text-foreground block">
                v₂ = [{eigen.v2.x.toFixed(3)}, {eigen.v2.y.toFixed(3)}]ᵀ
              </span>
              <span className="text-[10px] text-muted-foreground">
                Invariant line slope m = {(eigen.v2.y / (eigen.v2.x || 0.001)).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── SVD Singular Value Decomposition Card ───────────── */}
      <div className="p-4 bg-muted/50 border border-border rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Layers size={14} className="text-primary" />
            <span>Singular Value Decomposition (SVD: A = U Σ Vᵀ)</span>
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            Semi-Major & Semi-Minor Ellipse Axes
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3 bg-background/80 rounded-xl border border-border space-y-1">
            <span className="text-[10px] uppercase font-bold text-rose-500 block">
              1st Singular Value (σ₁)
            </span>
            <div className="text-base font-black text-rose-500">
              σ₁ = {svd.sigma1.toFixed(3)}
            </div>
            <div className="text-[10px] text-muted-foreground">
              Principal Axis u₁ = [{svd.u1.x.toFixed(2)}, {svd.u1.y.toFixed(2)}]ᵀ
            </div>
          </div>

          <div className="p-3 bg-background/80 rounded-xl border border-border space-y-1">
            <span className="text-[10px] uppercase font-bold text-blue-500 block">
              2nd Singular Value (σ₂)
            </span>
            <div className="text-base font-black text-blue-500">
              σ₂ = {svd.sigma2.toFixed(3)}
            </div>
            <div className="text-[10px] text-muted-foreground">
              Secondary Axis u₂ = [{svd.u2.x.toFixed(2)}, {svd.u2.y.toFixed(2)}]ᵀ
            </div>
          </div>
        </div>
      </div>

      {/* ── Geometric Meaning Reference ────────────────────── */}
      <div className="p-4 bg-muted/40 border border-border rounded-2xl text-xs space-y-1.5">
        <h4 className="font-bold text-foreground flex items-center gap-1.5">
          <BookOpen size={14} className="text-primary" />
          <span>Eigenvectors vs Singular Vectors</span>
        </h4>
        <p className="text-muted-foreground">
          While <strong>eigenvectors</strong> preserve their orientation (<code>A·v = λ·v</code>) and exist only when the matrix does not involve pure rotations, <strong>singular values (σ₁, σ₂)</strong> always exist for every matrix and represent the exact stretching of the unit sphere into an ellipsoid.
        </p>
      </div>
    </div>
  );
}
