'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { WebAPIItem } from '../lib/types';
import { Globe } from 'lucide-react';

interface WebAPIsPanelProps {
  items: WebAPIItem[];
}

// Scales the pending-timer progress bar duration to roughly reflect the
// timer's actual delay (a 5000ms timeout should visibly take longer than a
// 0ms one), clamped so the animation never makes the user wait more than
// ~1.5s or feels instant below ~0.4s.
function progressDuration(delayMs: number): number {
  return Math.min(1.5, Math.max(0.4, delayMs / 2000));
}

export default function WebAPIsPanel({ items }: WebAPIsPanelProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-violet-500/20">
        <div className="w-6 h-6 rounded-md bg-violet-500/20 flex items-center justify-center">
          <Globe className="w-3.5 h-3.5 text-violet-400" />
        </div>
        <h3 className="text-sm font-semibold text-violet-300 tracking-wide">Web APIs</h3>
        <span className="ml-auto text-xs font-mono text-violet-400/60">{items.length} pending</span>
      </div>

      {/* API items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 min-h-[80px]">
        <AnimatePresence>
          {items.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full min-h-[60px] text-slate-500 text-xs italic border border-dashed border-slate-700/50 rounded-lg"
            >
              No active Web APIs
            </motion.div>
          )}
          {items.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="px-3 py-2.5 rounded-lg border bg-violet-500/10 border-violet-500/30"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-medium text-violet-300 truncate">
                  {item.label}
                </span>
                <span className="ml-auto shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-violet-500/20 text-violet-400 uppercase tracking-wider">
                  {item.type}
                </span>
              </div>
              {item.delay !== undefined && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="flex-1 h-1 rounded-full bg-violet-900/50 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={shouldReduceMotion ? { duration: 0 } : { duration: progressDuration(item.delay), ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-[10px] text-violet-400/60 font-mono">{item.delay}ms</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
