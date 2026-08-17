"use client";

import React, { useRef, useEffect } from "react";

export interface CircuitPoint {
  x: number;
  y: number;
}

export interface CircuitPath {
  id: string;
  points: CircuitPoint[];
  color?: string;
  particleColor?: string;
  particleCount?: number;
  speed?: number; // positive = forward, negative = reverse, 0 = stopped
  particleSize?: number;
  wireWidth?: number;
}

export interface CircuitFlowRendererProps {
  width?: number;
  height?: number;
  paths: CircuitPath[];
  className?: string;
}

export default function CircuitFlowRenderer({
  width = 600,
  height = 360,
  paths,
  className = "",
}: CircuitFlowRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let startTime = performance.now();

    const render = (now: number) => {
      const time = (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      paths.forEach((path) => {
        if (!path.points || path.points.length < 2) return;

        // 1. Draw Wire Path
        ctx.save();
        ctx.strokeStyle = path.color || "rgba(148, 163, 184, 0.4)";
        ctx.lineWidth = path.wireWidth || 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(path.points[0].x, path.points[0].y);
        for (let i = 1; i < path.points.length; i++) {
          ctx.lineTo(path.points[i].x, path.points[i].y);
        }
        ctx.stroke();

        // 2. Draw Moving Flow Particles
        const speed = path.speed !== undefined ? path.speed : 1;
        if (speed !== 0) {
          const numParticles = path.particleCount || 12;
          const pSize = path.particleSize || 4;
          const pColor = path.particleColor || "#38bdf8";

          // Calculate total path length
          const segLengths: number[] = [];
          let totalLen = 0;
          for (let i = 0; i < path.points.length - 1; i++) {
            const dx = path.points[i + 1].x - path.points[i].x;
            const dy = path.points[i + 1].y - path.points[i].y;
            const len = Math.sqrt(dx * dx + dy * dy);
            segLengths.push(len);
            totalLen += len;
          }

          if (totalLen > 0) {
            ctx.fillStyle = pColor;
            ctx.shadowColor = pColor;
            ctx.shadowBlur = 6;

            for (let p = 0; p < numParticles; p++) {
              let t = ((p / numParticles + (time * speed * 40) / totalLen) % 1 + 1) % 1;
              let targetDist = t * totalLen;

              // Find point at targetDist
              let accumulated = 0;
              let curX = path.points[0].x;
              let curY = path.points[0].y;

              for (let s = 0; s < segLengths.length; s++) {
                if (accumulated + segLengths[s] >= targetDist) {
                  const localT = (targetDist - accumulated) / segLengths[s];
                  curX = path.points[s].x + localT * (path.points[s + 1].x - path.points[s].x);
                  curY = path.points[s].y + localT * (path.points[s + 1].y - path.points[s].y);
                  break;
                }
                accumulated += segLengths[s];
              }

              ctx.beginPath();
              ctx.arc(curX, curY, pSize, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [width, height, paths]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`block w-full h-auto pointer-events-none ${className}`}
    />
  );
}
