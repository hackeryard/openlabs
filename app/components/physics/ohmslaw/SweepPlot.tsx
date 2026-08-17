"use client";

import React, { useEffect, useRef } from "react";
import { Play, Download, Activity } from "lucide-react";

interface SweepPlotProps {
  sweepResults: { V: number; I: number }[];
  currentOperatingPoint: { V: number; I: number };
  onRunSweep?: () => void;
  onExportCSV?: () => void;
  isSweeping?: boolean;
}

export default function SweepPlot({
  sweepResults,
  currentOperatingPoint,
  onRunSweep,
  onExportCSV,
  isSweeping = false,
}: SweepPlotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High-DPI sharp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    ctx.clearRect(0, 0, W, H);

    const padLeft = 36;
    const padBottom = 26;
    const padTop = 16;
    const padRight = 16;

    const plotW = W - padLeft - padRight;
    const plotH = H - padTop - padBottom;

    const maxV = Math.max(
      currentOperatingPoint.V,
      sweepResults.reduce((a, b) => Math.max(a, b.V), currentOperatingPoint.V),
      12
    ) * 1.15;

    const maxI = Math.max(
      currentOperatingPoint.I,
      sweepResults.reduce((a, b) => Math.max(a, b.I), currentOperatingPoint.I),
      1
    ) * 1.15;

    // Draw subtle grid lines
    ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      // Horizontal grid
      const y = padTop + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(W - padRight, y);
      ctx.stroke();

      // Vertical grid
      const x = padLeft + (plotW / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, H - padBottom);
      ctx.stroke();
    }

    // Draw Axes
    ctx.strokeStyle = "rgba(148, 163, 184, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop);
    ctx.lineTo(padLeft, H - padBottom);
    ctx.lineTo(W - padRight, H - padBottom);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = "rgba(148, 163, 184, 0.9)";
    ctx.font = "bold 9px sans-serif";
    ctx.fillText("V (V)", W - padRight - 22, H - padBottom + 18);
    ctx.fillText("I (A)", 4, padTop + 2);

    // Draw Sweep Result Curve
    if (sweepResults.length > 0) {
      // Glow trail under curve
      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      sweepResults.forEach((p, idx) => {
        const x = padLeft + (p.V / maxV) * plotW;
        const y = H - padBottom - (p.I / maxI) * plotH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Solid line
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      sweepResults.forEach((p, idx) => {
        const x = padLeft + (p.V / maxV) * plotW;
        const y = H - padBottom - (p.I / maxI) * plotH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Sweep data points with crisp white border
      sweepResults.forEach(p => {
        const x = padLeft + (p.V / maxV) * plotW;
        const y = H - padBottom - (p.I / maxI) * plotH;

        // Outer white border ring
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Inner emerald core
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // ─── HIGH-VISIBILITY OPERATING POINT DOT ───
    const dotX = padLeft + (currentOperatingPoint.V / maxV) * plotW;
    const dotY = H - padBottom - (currentOperatingPoint.I / maxI) * plotH;

    // 1. Large Translucent Pulsing Glow Halo
    ctx.fillStyle = "rgba(244, 63, 94, 0.3)";
    ctx.beginPath();
    ctx.arc(dotX, dotY, 11, 0, Math.PI * 2);
    ctx.fill();

    // 2. High-Contrast Outer White Ring
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(dotX, dotY, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // 3. Vibrant Crimson/Rose Core
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(dotX, dotY, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // 4. Center Specular Highlight
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(dotX - 1.2, dotY - 1.2, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // ─── HIGH-CONTRAST FLOATING BADGE LABEL ───
    const labelText = `${currentOperatingPoint.V.toFixed(1)}V, ${currentOperatingPoint.I.toFixed(2)}A`;
    ctx.font = "bold 10px monospace";
    const textMetrics = ctx.measureText(labelText);
    const badgeW = textMetrics.width + 10;
    const badgeH = 18;

    let badgeX = dotX + 8;
    let badgeY = dotY - 22;

    // Clamp badge inside canvas
    if (badgeX + badgeW > W - 4) {
      badgeX = dotX - badgeW - 8;
    }
    if (badgeY < 4) {
      badgeY = dotY + 8;
    }

    // Badge Background Box with Drop Shadow
    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    ctx.strokeStyle = "rgba(244, 63, 94, 0.8)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 5);
    ctx.fill();
    ctx.stroke();

    // Badge Text
    ctx.fillStyle = "#38bdf8";
    ctx.fillText(labelText, badgeX + 5, badgeY + 13);

  }, [sweepResults, currentOperatingPoint]);

  return (
    <div className="flex flex-col h-full bg-card p-3 space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <Activity size={14} className="text-primary" />
          <h3 className="font-bold text-xs">V-I Characteristic Plot</h3>
        </div>
        <div className="flex items-center gap-1">
          {onRunSweep && (
            <button
              onClick={onRunSweep}
              disabled={isSweeping}
              className="px-2 py-0.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-[10px] font-bold rounded-lg transition flex items-center gap-1 shadow-sm"
            >
              <Play size={10} className="fill-current" />
              <span>{isSweeping ? "Sweeping..." : "Sweep"}</span>
            </button>
          )}
          {onExportCSV && (
            <button
              onClick={onExportCSV}
              className="p-1 bg-muted hover:bg-accent border border-border text-foreground rounded-lg transition"
              title="Export CSV Data"
            >
              <Download size={11} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 w-full relative min-h-36 bg-slate-950/80 rounded-xl border border-border/70 overflow-hidden shadow-inner">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}
