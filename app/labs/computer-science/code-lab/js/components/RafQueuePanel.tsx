'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { QueueEntry } from '../lib/types';
import { Film } from 'lucide-react';

interface RafQueuePanelProps {
  entries: QueueEntry[];
  isActive: boolean; // true when the event loop is running rAF callbacks
}

export default function RafQueuePanel({ entries, isActive }: RafQueuePanelProps) {
  return (
    <div className={`flex flex-col h-full transition-shadow duration-500 ${isActive ? 'shadow-[0_0_20px_rgba(244,63,94,0.15)]' : ''}`}>
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-rose-200 dark:border-rose-500/20">
        <div className={`w-6 h-6 rounded-md bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center ${isActive ? 'animate-pulse' : ''}`}>
          <Film className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
        </div>
        <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-300 tracking-wide">rAF Queue</h3>
        <span className="ml-auto text-xs font-mono text-rose-600/70 dark:text-rose-400/60">{entries.length}</span>
      </div>

      <div className="px-3 py-1.5 bg-rose-50 dark:bg-rose-500/5 border-b border-rose-100 dark:border-rose-500/10">
        <p className="text-[10px] text-rose-700/80 dark:text-rose-400/70 font-medium">
          🎞️ Runs after microtasks drain, before paint
        </p>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-2 min-h-[56px]">
        <div className="flex gap-1.5 h-full items-start">
          <AnimatePresence>
            {entries.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center w-full min-h-[40px] text-muted-foreground text-xs italic border border-dashed border-border rounded-lg"
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
                  bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30
                  ${isActive ? 'ring-1 ring-rose-400/30' : ''}
                `}
              >
                <span className="font-mono text-xs font-medium text-rose-700 dark:text-rose-300 whitespace-nowrap">
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
