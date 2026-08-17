"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

export interface AtomDomain {
  id: string;
  type: "bond" | "lone_pair";
  color: string;
  label?: string;
  x: number;
  y: number;
  z: number;
}

export interface Molecule3DViewportProps {
  width?: number;
  height?: number;
  centralAtom?: { label: string; color: string; radius: number };
  domains: AtomDomain[];
  showDipole?: boolean;
  dipoleVector?: { x: number; y: number; z: number };
  showAngles?: boolean;
  className?: string;
}

export default function Molecule3DViewport({
  width = 500,
  height = 380,
  centralAtom = { label: "A", color: "#6366f1", radius: 24 },
  domains,
  showDipole = false,
  dipoleVector = { x: 0, y: 0, z: 0 },
  showAngles = true,
  className = "",
}: Molecule3DViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Rotation angles
  const [rotX, setRotX] = useState<number>(0.3);
  const [rotY, setRotY] = useState<number>(0.5);
  const isDraggingRef = useRef<boolean>(false);
  const lastMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Mouse & Touch Drag Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };

    setRotY((prev) => prev + dx * 0.01);
    setRotX((prev) => Math.max(-Math.PI / 2, Math.min(Math.PI / 2, prev + dy * 0.01)));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const bondRadius = Math.min(width, height) * 0.28;

    // 3D rotation transform function
    const project = (x: number, y: number, z: number) => {
      // Rotate around Y
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      // Rotate around X
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      // Simple perspective
      const fov = 400;
      const scale = fov / (fov + z2);

      return {
        px: centerX + x1 * scale,
        py: centerY + y2 * scale,
        pz: z2,
        scale,
      };
    };

    // Render elements sorted by Z
    const renderList: { z: number; render: () => void }[] = [];

    // Central Atom
    const centerProj = project(0, 0, 0);
    renderList.push({
      z: centerProj.pz,
      render: () => {
        ctx.save();
        const grad = ctx.createRadialGradient(
          centerProj.px - 6,
          centerProj.py - 6,
          2,
          centerProj.px,
          centerProj.py,
          centralAtom.radius
        );
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.3, centralAtom.color);
        grad.addColorStop(1, "#1e1b4b");

        ctx.fillStyle = grad;
        ctx.shadowColor = centralAtom.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(centerProj.px, centerProj.py, centralAtom.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(centralAtom.label, centerProj.px, centerProj.py);
        ctx.restore();
      },
    });

    // Domain Bonds / Lone Pairs
    domains.forEach((dom) => {
      const pos = project(dom.x * bondRadius, dom.y * bondRadius, dom.z * bondRadius);

      // Bond Stick / Lobe
      renderList.push({
        z: (centerProj.pz + pos.pz) / 2 - 2,
        render: () => {
          ctx.save();
          if (dom.type === "bond") {
            // Solid bond cylinder
            ctx.strokeStyle = "rgba(148, 163, 184, 0.7)";
            ctx.lineWidth = 6 * pos.scale;
            ctx.beginPath();
            ctx.moveTo(centerProj.px, centerProj.py);
            ctx.lineTo(pos.px, pos.py);
            ctx.stroke();
          } else {
            // Teardrop / dashed lone pair electron orbital cloud
            ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
            ctx.lineWidth = 4 * pos.scale;
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            ctx.moveTo(centerProj.px, centerProj.py);
            ctx.lineTo(pos.px, pos.py);
            ctx.stroke();
            ctx.setLineDash([]);
          }
          ctx.restore();
        },
      });

      // Terminal Atom Sphere or Electron Lobe Dot
      renderList.push({
        z: pos.pz,
        render: () => {
          ctx.save();
          const r = (dom.type === "bond" ? 18 : 12) * pos.scale;

          const grad = ctx.createRadialGradient(pos.px - r * 0.3, pos.py - r * 0.3, 1, pos.px, pos.py, r);
          grad.addColorStop(0, "#ffffff");
          grad.addColorStop(0.4, dom.color);
          grad.addColorStop(1, "#0f172a");

          ctx.fillStyle = grad;
          ctx.shadowColor = dom.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(pos.px, pos.py, r, 0, Math.PI * 2);
          ctx.fill();

          if (dom.label) {
            ctx.fillStyle = "#ffffff";
            ctx.font = `bold ${Math.round(10 * pos.scale)}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(dom.label, pos.px, pos.py);
          } else if (dom.type === "lone_pair") {
            // Pair of dots
            ctx.fillStyle = "#fef08a";
            ctx.beginPath();
            ctx.arc(pos.px - 3, pos.py, 2, 0, Math.PI * 2);
            ctx.arc(pos.px + 3, pos.py, 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        },
      });
    });

    // Net Dipole 3D Vector if requested
    if (showDipole && (dipoleVector.x !== 0 || dipoleVector.y !== 0 || dipoleVector.z !== 0)) {
      const dEnd = project(
        dipoleVector.x * bondRadius * 1.3,
        dipoleVector.y * bondRadius * 1.3,
        dipoleVector.z * bondRadius * 1.3
      );

      renderList.push({
        z: 999, // In front
        render: () => {
          ctx.save();
          ctx.strokeStyle = "#f43f5e";
          ctx.fillStyle = "#f43f5e";
          ctx.lineWidth = 4;
          ctx.shadowColor = "#f43f5e";
          ctx.shadowBlur = 10;

          // Arrow line
          ctx.beginPath();
          ctx.moveTo(centerProj.px, centerProj.py);
          ctx.lineTo(dEnd.px, dEnd.py);
          ctx.stroke();

          // Arrow head
          const angle = Math.atan2(dEnd.py - centerProj.py, dEnd.px - centerProj.px);
          ctx.beginPath();
          ctx.moveTo(dEnd.px, dEnd.py);
          ctx.lineTo(dEnd.px - 10 * Math.cos(angle - Math.PI / 6), dEnd.py - 10 * Math.sin(angle - Math.PI / 6));
          ctx.lineTo(dEnd.px - 10 * Math.cos(angle + Math.PI / 6), dEnd.py - 10 * Math.sin(angle + Math.PI / 6));
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 10px sans-serif";
          ctx.fillText("Net μ (Dipole)", dEnd.px + 10, dEnd.py);
          ctx.restore();
        },
      });
    }

    // Sort by Z and draw
    renderList.sort((a, b) => a.z - b.z);
    renderList.forEach((item) => item.render());
  }, [width, height, centralAtom, domains, showDipole, dipoleVector, showAngles, rotX, rotY]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`block w-full h-auto bg-slate-950 rounded-2xl cursor-grab active:cursor-grabbing touch-none select-none ${className}`}
    />
  );
}
