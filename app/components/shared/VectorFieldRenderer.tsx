"use client";

import React, { useRef, useEffect } from "react";

export interface FieldSource {
  x: number;
  y: number;
  strength: number; // positive = north / positive charge, negative = south / negative charge
  type?: "pole" | "charge" | "magnet";
}

export interface VectorFieldRendererProps {
  width?: number;
  height?: number;
  sources: FieldSource[];
  gridSpacing?: number;
  arrowColor?: string;
  fieldLineDensity?: number;
  showFieldLines?: boolean;
  showGridArrows?: boolean;
  className?: string;
}

export default function VectorFieldRenderer({
  width = 600,
  height = 360,
  sources,
  gridSpacing = 28,
  arrowColor = "#6366f1",
  showFieldLines = true,
  showGridArrows = true,
  className = "",
}: VectorFieldRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Function to calculate net vector (Vx, Vy) at any point (x, y)
    const getFieldAt = (x: number, y: number) => {
      let vx = 0;
      let vy = 0;

      for (const s of sources) {
        const dx = x - s.x;
        const dy = y - s.y;
        const distSq = dx * dx + dy * dy + 100; // soften singularity
        const dist = Math.sqrt(distSq);
        const mag = (s.strength * 1000) / distSq;

        vx += (dx / dist) * mag;
        vy += (dy / dist) * mag;
      }

      return { vx, vy, mag: Math.sqrt(vx * vx + vy * vy) };
    };

    // 1. Draw Streamline Field Curves if enabled
    if (showFieldLines && sources.length > 0) {
      ctx.lineWidth = 1.2;

      // Seed points around positive sources / poles
      for (const s of sources) {
        if (s.strength > 0) {
          const numLines = 16;
          for (let k = 0; k < numLines; k++) {
            const angle = (k / numLines) * Math.PI * 2;
            let cx = s.x + Math.cos(angle) * 15;
            let cy = s.y + Math.sin(angle) * 15;

            ctx.strokeStyle = "rgba(99, 102, 241, 0.35)";
            ctx.beginPath();
            ctx.moveTo(cx, cy);

            for (let step = 0; step < 80; step++) {
              const { vx, vy, mag } = getFieldAt(cx, cy);
              if (mag < 0.05 || cx < 0 || cx > width || cy < 0 || cy > height) break;

              const stepSize = 4;
              cx += (vx / mag) * stepSize;
              cy += (vy / mag) * stepSize;
              ctx.lineTo(cx, cy);
            }
            ctx.stroke();
          }
        }
      }
    }

    // 2. Draw Vector Grid Arrows
    if (showGridArrows) {
      for (let x = gridSpacing / 2; x < width; x += gridSpacing) {
        for (let y = gridSpacing / 2; y < height; y += gridSpacing) {
          const { vx, vy, mag } = getFieldAt(x, y);
          if (mag < 0.01) continue;

          const normX = vx / mag;
          const normY = vy / mag;
          const arrowLen = Math.min(gridSpacing * 0.7, Math.max(6, mag * 2));

          const x2 = x + normX * arrowLen;
          const y2 = y + normY * arrowLen;

          const alpha = Math.min(0.8, Math.max(0.15, mag / 15));
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.fillStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 1.5;

          // Arrow shaft
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // Arrow head
          const headLen = 4;
          const headAngle = Math.atan2(normY, normX);
          ctx.beginPath();
          ctx.moveTo(x2, y2);
          ctx.lineTo(
            x2 - headLen * Math.cos(headAngle - Math.PI / 6),
            y2 - headLen * Math.sin(headAngle - Math.PI / 6)
          );
          ctx.lineTo(
            x2 - headLen * Math.cos(headAngle + Math.PI / 6),
            y2 - headLen * Math.sin(headAngle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }, [width, height, sources, gridSpacing, arrowColor, showFieldLines, showGridArrows]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`block w-full h-auto pointer-events-none ${className}`}
    />
  );
}
