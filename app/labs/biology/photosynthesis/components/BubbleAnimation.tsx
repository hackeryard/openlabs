import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Bubble {
  id: number;
  x: number;
  size: number;
  speed: number;
}

export default function BubbleAnimation({ rate }: { rate: number }) {
  const shouldReduceMotion = useReducedMotion();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    // Based on rate (0-100), determine bubble spawn interval
    // If rate is 0, no bubbles. If rate is 100, spawn fast.
    if (rate < 1) {
      setBubbles([]);
      return;
    }

    const maxInterval = 2000;
    const minInterval = 100;
    const intervalTime = maxInterval - (rate / 100) * (maxInterval - minInterval);

    const interval = setInterval(() => {
      setBubbles((prev) => {
        // Keep max 20 bubbles on screen to prevent lag
        if (prev.length > 20) return prev.slice(1);
        
        return [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: Math.random() * 80 + 10, // 10% to 90% x position
            size: Math.random() * 8 + 4, // 4px to 12px
            speed: Math.random() * 1.5 + 1 + (rate / 100) * 2, // 1s to 4.5s duration
          }
        ];
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [rate, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 rounded-xl overflow-hidden border border-blue-200">
        <div className="text-center">
          <div className="text-4xl mb-2">🫧</div>
          <div className="text-xs font-bold text-blue-700 uppercase tracking-widest">
            Oxygen Output: {rate.toFixed(1)}%
          </div>
          <div className="text-[10px] text-blue-500 mt-1">(Animation Disabled)</div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 to-blue-600/30 rounded-xl overflow-hidden border border-blue-200">
      {/* Container for bubbles */}
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          initial={{ bottom: "-10%", left: `${b.x}%`, opacity: 0.8 }}
          animate={{ bottom: "110%", left: `${b.x + (Math.random() * 10 - 5)}%`, opacity: 0 }}
          transition={{ duration: b.speed, ease: "easeIn" }}
          className="absolute rounded-full bg-white/60 border border-white/80 shadow-[0_0_5px_rgba(255,255,255,0.5)]"
          style={{ width: b.size, height: b.size }}
          onAnimationComplete={() => {
            setBubbles((prev) => prev.filter((bubble) => bubble.id !== b.id));
          }}
        />
      ))}
      <div className="absolute bottom-2 right-3 text-[10px] font-bold text-blue-800/50 uppercase tracking-wider">
        O₂ Bubbles
      </div>
    </div>
  );
}
