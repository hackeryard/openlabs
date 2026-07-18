'use client';

import { useEffect, useRef } from 'react';
import { animate, type JSAnimation } from 'animejs';

interface Blob {
  size: number;
  top: string;
  left: string;
  color: string;
  duration: number;
  x: number;
  y: number;
}

const BLOBS: Blob[] = [
  { size: 420, top: '-10%', left: '-5%', color: 'hsl(var(--primary) / 0.16)', duration: 14000, x: 60, y: -40 },
  { size: 360, top: '55%', left: '68%', color: 'hsl(var(--primary) / 0.10)', duration: 18000, x: -50, y: 45 },
  { size: 300, top: '15%', left: '82%', color: 'hsl(var(--accent-foreground) / 0.08)', duration: 16000, x: -40, y: 55 },
];

/**
 * Purely decorative, non-interactive ambient background rendered once in the
 * root layout — visible behind every route, including /labs/* pages, since
 * it never touches any page/lab-specific code. Uses anime.js (not Framer
 * Motion, already used extensively elsewhere) to keep the two animation
 * systems from competing over the same layout tree.
 */
export default function AmbientBackground() {
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const animations: JSAnimation[] = [];

    blobRefs.current.forEach((el, i) => {
      if (!el) return;
      const blob = BLOBS[i];
      animations.push(
        animate(el, {
          translateX: blob.x,
          translateY: blob.y,
          scale: 1.08,
          duration: blob.duration,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        })
      );
    });

    return () => {
      animations.forEach((a) => a.pause());
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          ref={(el) => { blobRefs.current[i] = el; }}
          className="absolute rounded-full blur-[90px]"
          style={{
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
            backgroundColor: blob.color,
          }}
        />
      ))}
    </div>
  );
}
