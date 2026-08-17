"use client";

import React, { useRef, useEffect, useCallback } from "react";

export interface Particle {
  id: number | string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  color: string;
  charge?: number;
  label?: string;
  type?: string;
}

export interface MembranePore {
  y: number;
  size: number;
}

export interface ParticlePhysicsEngineProps {
  width?: number;
  height?: number;
  particles: Particle[];
  onParticlesUpdate?: (particles: Particle[], speeds: number[]) => void;
  pistonX?: number; // Optional right wall position (Gas laws)
  pistonY?: number; // Optional top wall position (Gas laws)
  gravity?: number;
  temperatureFactor?: number; // Speed scale multiplier
  enableParticleCollisions?: boolean;
  membraneX?: number; // Optional vertical semi-permeable membrane
  membranePores?: MembranePore[];
  className?: string;
}

export default function ParticlePhysicsEngine({
  width = 600,
  height = 360,
  particles,
  onParticlesUpdate,
  pistonX,
  pistonY,
  gravity = 0,
  temperatureFactor = 1,
  enableParticleCollisions = true,
  membraneX,
  membranePores,
  className = "",
}: ParticlePhysicsEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<Particle[]>([]);

  // Initialize or synchronize particles
  useEffect(() => {
    stateRef.current = particles.map((p) => ({ ...p }));
  }, [particles]);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap at 50ms
      lastTime = now;

      const rightBound = pistonX !== undefined ? Math.min(width, Math.max(100, pistonX)) : width;
      const topBound = pistonY !== undefined ? Math.max(0, pistonY) : 0;
      const leftBound = 0;
      const bottomBound = height;

      const pList = stateRef.current;
      const speeds: number[] = [];

      // 1. Move and update bounds
      for (let i = 0; i < pList.length; i++) {
        const p = pList[i];

        // Apply gravity & temperature speed
        p.vy += gravity * dt * 60;
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        speeds.push(currentSpeed);

        p.x += p.vx * temperatureFactor * dt * 60;
        p.y += p.vy * temperatureFactor * dt * 60;

        // Left / Right wall collisions
        if (p.x - p.radius < leftBound) {
          p.x = leftBound + p.radius;
          p.vx = Math.abs(p.vx);
        } else if (p.x + p.radius > rightBound) {
          p.x = rightBound - p.radius;
          p.vx = -Math.abs(p.vx);
        }

        // Top / Bottom wall collisions
        if (p.y - p.radius < topBound) {
          p.y = topBound + p.radius;
          p.vy = Math.abs(p.vy);
        } else if (p.y + p.radius > bottomBound) {
          p.y = bottomBound - p.radius;
          p.vy = -Math.abs(p.vy);
        }

        // Semi-permeable membrane collisions at membraneX
        if (membraneX !== undefined) {
          const isCrossingMembrane = (p.x - p.radius < membraneX && p.x + p.radius > membraneX);
          if (isCrossingMembrane) {
            // Check if particle aligns with any pore large enough
            const inPore = (membranePores || []).some(
              (pore) => Math.abs(p.y - pore.y) < pore.size / 2 && p.radius * 2 <= pore.size
            );

            if (!inPore) {
              if (p.vx > 0) {
                p.x = membraneX - p.radius;
                p.vx = -Math.abs(p.vx);
              } else {
                p.x = membraneX + p.radius;
                p.vx = Math.abs(p.vx);
              }
            }
          }
        }
      }

      // 2. Particle-Particle Elastic Collisions
      if (enableParticleCollisions) {
        for (let i = 0; i < pList.length; i++) {
          for (let j = i + 1; j < pList.length; j++) {
            const p1 = pList[i];
            const p2 = pList[j];

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = p1.radius + p2.radius;

            if (dist < minDist && dist > 0) {
              // Overlap correction
              const overlap = (minDist - dist) / 2;
              const nx = dx / dist;
              const ny = dy / dist;

              p1.x -= nx * overlap;
              p1.y -= ny * overlap;
              p2.x += nx * overlap;
              p2.y += ny * overlap;

              // Elastic 2D collision formula
              const kx = p1.vx - p2.vx;
              const ky = p1.vy - p2.vy;
              const p = 2 * (nx * kx + ny * ky) / (p1.mass + p2.mass);

              p1.vx -= p * p2.mass * nx;
              p1.vy -= p * p2.mass * ny;
              p2.vx += p * p1.mass * nx;
              p2.vy += p * p1.mass * ny;
            }
          }
        }
      }

      // 3. Render Canvas
      ctx.clearRect(0, 0, width, height);

      // Render membrane if defined
      if (membraneX !== undefined) {
        ctx.strokeStyle = "rgba(148, 163, 184, 0.6)";
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(membraneX, topBound);
        ctx.lineTo(membraneX, bottomBound);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Render particles
      for (let i = 0; i < pList.length; i++) {
        const p = pList[i];
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // 3D specular highlight
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.beginPath();
        ctx.arc(p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.35, 0, Math.PI * 2);
        ctx.fill();

        // Label if present
        if (p.label) {
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${Math.max(7, Math.round(p.radius * 0.9))}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p.label, p.x, p.y);
        }
        ctx.restore();
      }

      if (onParticlesUpdate && Math.random() < 0.2) {
        onParticlesUpdate(pList, speeds);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [
    width,
    height,
    pistonX,
    pistonY,
    gravity,
    temperatureFactor,
    enableParticleCollisions,
    membraneX,
    membranePores,
    onParticlesUpdate,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`block w-full h-auto bg-slate-950 rounded-2xl select-none ${className}`}
    />
  );
}
