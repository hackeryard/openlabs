'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { QueueEntry } from '../lib/types';
import { Zap } from 'lucide-react';

interface MicrotaskQueueProps {
  entries: QueueEntry[];
  isActive: boolean; // true when event loop is draining microtasks
}

export default function MicrotaskQueue({ entries, isActive }: MicrotaskQueueProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`flex flex-col h-full transition-shadow duration-500 ${isActive ? 'shadow-[0_0_20px_rgba(16,185,129,0.15)]' : ''}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-emerald-500/20">
        <div className={`w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center ${isActive && !shouldReduceMotion ? 'animate-pulse' : ''}`}>
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-emerald-300 tracking-wide">Microtask Queue</h3>
        <span className="ml-auto text-xs font-mono text-emerald-400/60">{entries.length}</span>
      </div>

      {/* Priority notice */}
      <div className="px-3 py-1.5 bg-emerald-500/5 border-b border-emerald-500/10">
        <p className="text-[10px] text-emerald-400/70 font-medium">
          ⚡ Drains completely before any macrotask
        </p>
      </div>

      {/* Queue entries (FIFO: left = front, right = back) */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-2 min-h-[56px]">
        <div className="flex gap-1.5 h-full items-start">
          <AnimatePresence>
            {entries.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center w-full min-h-[40px] text-slate-500 text-xs italic border border-dashed border-slate-700/50 rounded-lg"
              >
                Empty
              </motion.div>
            )}
            {entries.map(entry => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`
                  shrink-0 px-3 py-2 rounded-lg border
                  bg-emerald-500/10 border-emerald-500/30
                  ${isActive ? 'ring-1 ring-emerald-400/30' : ''}
                `}
              >
                <span className="font-mono text-xs font-medium text-emerald-300 whitespace-nowrap">
                  {entry.label}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
