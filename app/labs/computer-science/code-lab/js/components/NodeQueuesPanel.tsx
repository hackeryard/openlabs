'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { QueueEntry } from '../lib/types';
import { Layers3 } from 'lucide-react';

interface NodeQueuesPanelProps {
  nextTickQueue: QueueEntry[];
  immediateQueue: QueueEntry[];
  isDrainingNextTick: boolean;
}

function Strip({ title, entries, isActive }: { title: string; entries: QueueEntry[]; isActive: boolean }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">{title}</span>
        <span className="text-[10px] font-mono text-teal-600/70 dark:text-teal-400/60">{entries.length}</span>
      </div>
      <div className="flex gap-1.5 overflow-x-auto min-h-[40px]">
        <AnimatePresence>
          {entries.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center w-full min-h-[36px] text-muted-foreground text-xs italic border border-dashed border-border rounded-lg"
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
              className={`shrink-0 px-2.5 py-1.5 rounded-lg border bg-teal-50 dark:bg-teal-500/10 border-teal-300 dark:border-teal-500/30 ${isActive ? 'ring-1 ring-teal-400/30' : ''}`}
            >
              <span className="font-mono text-xs font-medium text-teal-700 dark:text-teal-300 whitespace-nowrap">
                {entry.label}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Only relevant in Node mode — process.nextTick drains before ANY
// Promise microtask, and setImmediate fires in the "check" phase.
export default function NodeQueuesPanel({ nextTickQueue, immediateQueue, isDrainingNextTick }: NodeQueuesPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-teal-200 dark:border-teal-500/20">
        <div className="w-6 h-6 rounded-md bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center">
          <Layers3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
        </div>
        <h3 className="text-sm font-semibold text-teal-700 dark:text-teal-300 tracking-wide">Node Queues</h3>
      </div>

      <div className="px-3 py-1.5 bg-teal-50 dark:bg-teal-500/5 border-b border-teal-100 dark:border-teal-500/10">
        <p className="text-[10px] text-teal-700/80 dark:text-teal-400/70 font-medium">
          process.nextTick always drains first — even before Promise microtasks
        </p>
      </div>

      <div className="flex-1 flex gap-3 p-2 min-h-[80px]">
        <Strip title="nextTick" entries={nextTickQueue} isActive={isDrainingNextTick} />
        <Strip title="setImmediate" entries={immediateQueue} isActive={false} />
      </div>
    </div>
  );
}
