'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { StackFrame } from '../lib/types';
import { Layers } from 'lucide-react';

interface CallStackProps {
  frames: StackFrame[];
}

const frameColors: Record<StackFrame['type'], { bg: string; border: string; text: string; badge: string }> = {
  global:           { bg: 'bg-slate-500/10',  border: 'border-slate-500/30',  text: 'text-slate-300',  badge: 'bg-slate-500/20 text-slate-400' },
  function:         { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-300',   badge: 'bg-blue-500/20 text-blue-400' },
  callback:         { bg: 'bg-amber-500/10',  border: 'border-amber-500/30',  text: 'text-amber-300',  badge: 'bg-amber-500/20 text-amber-400' },
  microtask:        { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-300', badge: 'bg-emerald-500/20 text-emerald-400' },
  'promise-executor': { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-300', badge: 'bg-violet-500/20 text-violet-400' },
};

export default function CallStack({ frames }: CallStackProps) {
  const shouldReduceMotion = useReducedMotion();

  // Display top-of-stack first (most recent frame at top)
  const reversed = [...frames].reverse();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-blue-500/20">
        <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-blue-300 tracking-wide">Call Stack</h3>
        <span className="ml-auto text-xs font-mono text-blue-400/60">{frames.length} frame{frames.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Stack frames */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 min-h-[80px]">
        <AnimatePresence>
          {reversed.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
              className="flex items-center justify-center h-full min-h-[60px] text-slate-500 text-xs italic border border-dashed border-slate-700/50 rounded-lg"
            >
              Stack is empty
            </motion.div>
          )}
          {reversed.map((frame, i) => {
            const colors = frameColors[frame.type] || frameColors.function;
            const isTop = i === 0;

            return (
              <motion.div
                key={frame.id}
                layout
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`
                  relative px-3 py-2 rounded-lg border transition-shadow
                  ${colors.bg} ${colors.border}
                  ${isTop ? 'shadow-[0_0_15px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/50 z-10' : 'opacity-80 scale-[0.98]'}
                `}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`font-mono text-sm font-semibold truncate ${colors.text}`}>
                    {frame.name}
                  </span>
                  <span className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${colors.badge}`}>
                    {frame.type}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
