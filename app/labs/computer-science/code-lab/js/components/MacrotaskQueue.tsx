'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { QueueEntry } from '../lib/types';
import { ClipboardList } from 'lucide-react';

interface MacrotaskQueueProps {
  entries: QueueEntry[];
  isActive: boolean;      // true when event loop is picking a macrotask
  isDimmed: boolean;       // true when microtask queue is non-empty (visual: "not my turn")
}

export default function MacrotaskQueue({ entries, isActive, isDimmed }: MacrotaskQueueProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`
      flex flex-col h-full transition-all duration-500
      ${isActive ? 'shadow-[0_0_20px_rgba(245,158,11,0.15)]' : ''}
      ${isDimmed ? 'opacity-50' : 'opacity-100'}
    `}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-amber-500/20">
        <div className={`w-6 h-6 rounded-md bg-amber-500/20 flex items-center justify-center ${isActive && !shouldReduceMotion ? 'animate-pulse' : ''}`}>
          <ClipboardList className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <h3 className="text-sm font-semibold text-amber-300 tracking-wide">Macrotask Queue</h3>
        <span className="ml-auto text-xs font-mono text-amber-400/60">{entries.length}</span>
      </div>

      {/* Info */}
      <div className="px-3 py-1.5 bg-amber-500/5 border-b border-amber-500/10">
        <p className="text-[10px] text-amber-400/70 font-medium">
          📋 One task per event loop tick
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
                  bg-amber-500/10 border-amber-500/30
                  ${isActive ? 'ring-1 ring-amber-400/30' : ''}
                `}
              >
                <span className={`font-mono text-xs font-medium whitespace-nowrap ${isDimmed ? 'text-amber-300/50' : 'text-amber-300'}`}>
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
