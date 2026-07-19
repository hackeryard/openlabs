'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Layers } from 'lucide-react';
import type { StackFrame } from '../../lib/types';
import PanelShell from './PanelShell';
import { EmptySlot } from './TaskChip';

const frameColors: Record<StackFrame['type'], { chip: string; badge: string }> = {
  global:             { chip: 'bg-slate-100 dark:bg-slate-500/10 border-slate-300 dark:border-slate-500/30 text-slate-700 dark:text-slate-300', badge: 'bg-slate-200 dark:bg-slate-500/20 text-slate-700 dark:text-slate-400' },
  function:           { chip: 'bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/30 text-blue-700 dark:text-blue-300', badge: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' },
  callback:           { chip: 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-300', badge: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' },
  microtask:          { chip: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300', badge: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' },
  'promise-executor': { chip: 'bg-violet-50 dark:bg-violet-500/10 border-violet-300 dark:border-violet-500/30 text-violet-700 dark:text-violet-300', badge: 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400' },
  'raf-callback':     { chip: 'bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-300', badge: 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400' },
  'dom-handler':      { chip: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-300 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300', badge: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400' },
  'node-callback':    { chip: 'bg-teal-50 dark:bg-teal-500/10 border-teal-300 dark:border-teal-500/30 text-teal-700 dark:text-teal-300', badge: 'bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400' },
};

interface StackPanelProps {
  frames: StackFrame[];
  isActive?: boolean;
  isDimmed?: boolean;
}

// LIFO stack rendered top-of-stack first. Frames are full-width rows
// (not chips) because nesting order is the whole point here.
export default function StackPanel({ frames, isActive, isDimmed }: StackPanelProps) {
  const shouldReduceMotion = useReducedMotion();
  const reversed = [...frames].reverse();

  return (
    <PanelShell
      icon={Layers}
      title="Call Stack"
      accent="blue"
      count={`${frames.length}`}
      isActive={isActive}
      isDimmed={isDimmed}
    >
      <div className="flex flex-col gap-1 h-full">
        <AnimatePresence mode="popLayout">
          {reversed.length === 0 && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <EmptySlot text="Stack is empty" />
            </motion.div>
          )}
          {reversed.map((frame, i) => {
            const colors = frameColors[frame.type] || frameColors.function;
            const isTop = i === 0;
            return (
              <motion.div
                key={frame.id}
                layout={!shouldReduceMotion}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -12, scale: 0.92 }}
                animate={{ opacity: isTop ? 1 : 0.75, y: 0, scale: isTop ? 1 : 0.98 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.9, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', stiffness: 550, damping: 30 }}
                className={`
                  flex items-center justify-between gap-1.5 rounded-md border px-2 py-0.5
                  ${colors.chip}
                  ${isTop ? 'ring-1 ring-indigo-400/50 shadow-[0_0_12px_rgba(99,102,241,0.15)]' : ''}
                `}
              >
                <span className="font-mono text-[11px] font-semibold truncate">{frame.name}</span>
                <span className={`hidden sm:inline shrink-0 text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${colors.badge}`}>
                  {frame.type}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </PanelShell>
  );
}
