"use client";

import React, { useRef, useEffect } from "react";

export interface DataPoint {
  x: number;
  y: number;
}

export interface PlotSeries {
  id: string;
  name: string;
  color: string;
  data: DataPoint[];
  showPoints?: boolean;
  pointRadius?: number;
  strokeWidth?: number;
  isAreaFilled?: boolean;
}

export interface GraphPlotterProps {
  width?: number;
  height?: number;
  series: PlotSeries[];
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  xLabel?: string;
  yLabel?: string;
  title?: string;
  showGrid?: boolean;
  className?: string;
}

export default function GraphPlotter({
  width = 500,
  height = 300,
  series,
  xMin = 0,
  xMax = 100,
  yMin = 0,
  yMax = 100,
  xLabel = "X Axis",
  yLabel = "Y Axis",
  title,
  showGrid = true,
  className = "",
}: GraphPlotterProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const padLeft = 55;
    const padRight = 25;
    const padTop = title ? 35 : 20;
    const padBottom = 45;

    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const mapX = (x: number) => padLeft + ((x - xMin) / (xMax - xMin)) * plotW;
    const mapY = (y: number) => padTop + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

    // 1. Grid Lines & Axis Ticks
    if (showGrid) {
      ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
      ctx.lineWidth = 1;

      // X Grid (5 divisions)
      for (let i = 0; i <= 5; i++) {
        const valX = xMin + (i / 5) * (xMax - xMin);
        const px = mapX(valX);

        ctx.beginPath();
        ctx.moveTo(px, padTop);
        ctx.lineTo(px, padTop + plotH);
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(valX.toFixed(valX >= 10 || Number.isInteger(valX) ? 0 : 1), px, padTop + plotH + 15);
      }

      // Y Grid (5 divisions)
      for (let j = 0; j <= 5; j++) {
        const valY = yMin + (j / 5) * (yMax - yMin);
        const py = mapY(valY);

        ctx.beginPath();
        ctx.moveTo(padLeft, py);
        ctx.lineTo(padLeft + plotW, py);
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "right";
        ctx.fillText(valY.toFixed(valY >= 10 || Number.isInteger(valY) ? 0 : 1), padLeft - 8, py + 3);
      }
    }

    // 2. Axes Lines
    ctx.strokeStyle = "rgba(148, 163, 184, 0.6)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop);
    ctx.lineTo(padLeft, padTop + plotH);
    ctx.lineTo(padLeft + plotW, padTop + plotH);
    ctx.stroke();

    // 3. Axis Labels & Title
    if (title) {
      ctx.fillStyle = "#f8fafc";
      ctx.font = "black 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(title, width / 2, 16);
    }

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(xLabel, padLeft + plotW / 2, height - 8);

    ctx.save();
    ctx.translate(14, padTop + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();

    // 4. Plot Series
    for (const s of series) {
      if (!s.data || s.data.length === 0) continue;

      ctx.save();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.strokeWidth || 2.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // Area fill if requested
      if (s.isAreaFilled) {
        ctx.beginPath();
        ctx.moveTo(mapX(s.data[0].x), mapY(yMin));
        for (let i = 0; i < s.data.length; i++) {
          ctx.lineTo(mapX(s.data[i].x), mapY(s.data[i].y));
        }
        ctx.lineTo(mapX(s.data[s.data.length - 1].x), mapY(yMin));
        ctx.closePath();
        ctx.fillStyle = `${s.color}22`;
        ctx.fill();
      }

      // Line path
      ctx.beginPath();
      for (let i = 0; i < s.data.length; i++) {
        const px = mapX(s.data[i].x);
        const py = mapY(s.data[i].y);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Points if requested
      if (s.showPoints !== false) {
        ctx.fillStyle = s.color;
        for (let i = 0; i < s.data.length; i++) {
          const px = mapX(s.data[i].x);
          const py = mapY(s.data[i].y);
          ctx.beginPath();
          ctx.arc(px, py, s.pointRadius || 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }
  }, [width, height, series, xMin, xMax, yMin, yMax, xLabel, yLabel, title, showGrid]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`block w-full h-auto bg-slate-950 rounded-2xl select-none ${className}`}
    />
  );
}
