'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { ConsoleEntry } from '../lib/types';
import { Terminal } from 'lucide-react';

interface ConsoleOutputProps {
  entries: ConsoleEntry[];
}

const sourceBadge: Record<ConsoleEntry['source'], { label: string; cls: string }> = {
  sync:      { label: 'sync',  cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  microtask: { label: 'micro', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  macrotask: { label: 'macro', cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
};

export default function ConsoleOutput({ entries }: ConsoleOutputProps) {
  const shouldReduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries.length]);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-600/30">
        <div className="w-6 h-6 rounded-md bg-slate-700/50 flex items-center justify-center">
          <Terminal className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <h3 className="text-sm font-semibold text-slate-300 tracking-wide">Console Output</h3>
        <span className="ml-auto text-xs font-mono text-slate-500">{entries.length} line{entries.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Output lines */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 space-y-1 min-h-[60px] bg-slate-950/50"
        aria-live="polite"
        aria-label="Console output"
      >
        <AnimatePresence>
          {entries.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full min-h-[40px] text-slate-600 text-xs italic font-mono"
            >
              &gt; waiting for output...
            </motion.div>
          )}
          {entries.map((entry, i) => {
            const badge = sourceBadge[entry.source];
            return (
              <motion.div
                key={`${i}-${entry.text}`}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="group flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-800/50 transition-colors"
              >
                <span className="text-slate-600 font-mono text-[10px] w-4 text-right select-none shrink-0">
                  {i + 1}
                </span>
                <span className="text-green-400 font-mono text-xs flex-1">
                  {entry.text}
                </span>
                <span className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded border font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity ${badge.cls}`}>
                  {badge.label}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
