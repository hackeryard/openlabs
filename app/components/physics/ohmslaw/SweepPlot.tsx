"use client";

import React, { useEffect, useRef } from "react";
import { CircuitComponent, SolverResult } from "./engine";

interface SweepPlotProps {
  sweepResults: { V: number; I: number }[];
  currentOperatingPoint: { V: number; I: number };
}

export default function SweepPlot({ sweepResults, currentOperatingPoint }: SweepPlotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set actual canvas resolution to match CSS layout size
    canvas.width = canvas.clientWidth || 300;
    canvas.height = canvas.clientHeight || 200;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    
    const pad = 36;
    
    // Find bounds
    const maxV = Math.max(currentOperatingPoint.V, sweepResults.reduce((a, b) => Math.max(a, b.V), currentOperatingPoint.V), 10) * 1.2;
    const maxI = Math.max(currentOperatingPoint.I, sweepResults.reduce((a, b) => Math.max(a, b.I), currentOperatingPoint.I), 1) * 1.2;

    // Draw axes
    ctx.strokeStyle = "#475569"; // slate-600
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, pad);
    ctx.lineTo(pad, H - pad);
    ctx.lineTo(W - pad, H - pad);
    ctx.stroke();

    ctx.fillStyle = "#94a3b8"; // slate-400
    ctx.font = "12px sans-serif";
    ctx.fillText("Voltage (V)", W - pad - 60, H - pad + 24);
    ctx.fillText("Current (A)", 6, pad - 10);

    // Draw sweep results
    if (sweepResults.length > 0) {
      ctx.strokeStyle = "#3b82f6"; // blue-500
      ctx.lineWidth = 2;
      ctx.beginPath();
      sweepResults.forEach((p, idx) => {
        const x = pad + (p.V / maxV) * (W - pad * 2);
        const y = H - pad - (p.I / maxI) * (H - pad * 2);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw points
      ctx.fillStyle = "#10b981"; // emerald-500
      sweepResults.forEach(p => {
        const x = pad + (p.V / maxV) * (W - pad * 2);
        const y = H - pad - (p.I / maxI) * (H - pad * 2);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw current operating point
    const dotX = pad + (currentOperatingPoint.V / maxV) * (W - pad * 2);
    const dotY = H - pad - (currentOperatingPoint.I / maxI) * (H - pad * 2);
    ctx.fillStyle = "#ef4444"; // red-500
    ctx.beginPath();
    ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "#e2e8f0"; // slate-200
    ctx.fillText(`(${currentOperatingPoint.V.toFixed(2)}V, ${currentOperatingPoint.I.toFixed(3)}A)`, dotX + 8, dotY - 8);

  }, [sweepResults, currentOperatingPoint]);

  return (
    <div className="flex flex-col h-full bg-card rounded-md border-none p-4">
      <h3 className="font-semibold text-sm mb-4">V-I Plot</h3>
      <div className="flex-1 w-full relative min-h-48">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}
