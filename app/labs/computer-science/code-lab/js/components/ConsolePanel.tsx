'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { ConsoleEntry } from '../lib/types';
import { Terminal, Lock, AlertTriangle } from 'lucide-react';

interface ConsolePanelProps {
  entries: ConsoleEntry[];
  /** Predict mode: hide output until the prediction is submitted. */
  isLocked?: boolean;
  /** Free-form run error (red) — rendered as a banner over the output. */
  error?: string;
  /** Free-form budget/loop-guard note (amber). */
  note?: string;
  /** Extra content docked under the output (predict-mode panel). */
  footer?: ReactNode;
}

const sourceBadge: Record<ConsoleEntry['source'], { label: string; cls: string }> = {
  sync:      { label: 'sync',  cls: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30' },
  microtask: { label: 'micro', cls: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30' },
  macrotask: { label: 'macro', cls: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30' },
  raf:       { label: 'raf',   cls: 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/30' },
  nexttick:  { label: 'tick',  cls: 'bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-500/30' },
  immediate: { label: 'immediate', cls: 'bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-500/30' },
  'dom-event': { label: 'dom', cls: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-300 dark:border-cyan-500/30' },
  'unhandled-rejection': { label: 'unhandled', cls: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/30' },
};

export default function ConsolePanel({ entries, isLocked = false, error, note, footer }: ConsolePanelProps) {
  const shouldReduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest line — keeps the current output in view
  // without the user ever scrolling (the "nothing hidden" contract).
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
    }
  }, [entries, shouldReduceMotion]);

  return (
    <section className="flex flex-col h-full min-h-0 min-w-0 rounded-xl border border-border bg-card overflow-hidden" aria-label="Console output">
      <header className="shrink-0 flex items-center gap-1.5 px-2 py-1 border-b border-border/60">
        <span className="w-4 h-4 rounded bg-muted flex items-center justify-center">
          <Terminal className="w-2.5 h-2.5 text-muted-foreground" />
        </span>
        <h3 className="text-[11px] font-bold tracking-wide text-foreground">Console</h3>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground">
          {entries.length} line{entries.length !== 1 ? 's' : ''}
        </span>
      </header>

      {(error || note) && (
        <div className={`shrink-0 flex items-start gap-1.5 px-2.5 py-1.5 text-[10px] sm:text-[11px] leading-snug border-b ${
          error
            ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300'
            : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300'
        }`}>
          <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{error ?? note}</span>
        </div>
      )}

      {isLocked ? (
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-1.5 p-3 text-center bg-muted/50">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <p className="text-[10px] sm:text-xs text-muted-foreground">Submit your prediction to reveal the output.</p>
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto thin-scrollbar px-1.5 sm:px-2 py-1 bg-muted/60 dark:bg-slate-950/50" aria-live="polite">
          <AnimatePresence>
            {entries.length === 0 && (
              <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center justify-center h-full min-h-[32px] text-[10px] sm:text-xs italic font-mono text-muted-foreground">
                &gt; waiting for output...
              </motion.p>
            )}
            {entries.map((entry, i) => {
              const badge = sourceBadge[entry.source];
              const isLatest = i === entries.length - 1;
              return (
                <motion.div
                  key={`${i}-${entry.text}`}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -12, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-md ${
                    isLatest && !shouldReduceMotion ? 'bg-primary/5' : ''
                  }`}
                >
                  <span className="shrink-0 w-4 text-right font-mono text-[9px] text-muted-foreground select-none">{i + 1}</span>
                  <span className={`flex-1 min-w-0 truncate font-mono text-[11px] ${
                    entry.source === 'unhandled-rejection' ? 'text-red-700 dark:text-red-400' : 'text-foreground dark:text-green-400'
                  }`}>
                    {entry.text}
                  </span>
                  <span className={`shrink-0 text-[8px] px-1 sm:px-1.5 py-0.5 rounded border font-semibold uppercase tracking-wider ${badge.cls}`}>
                    {badge.label}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Footer (predict quiz / end-of-run explanation) must not crush
          the output on short viewports — cap it and let it scroll. */}
      {footer && <div className="shrink-0 border-t border-border/60 max-h-[60%] overflow-y-auto thin-scrollbar">{footer}</div>}
    </section>
  );
}
