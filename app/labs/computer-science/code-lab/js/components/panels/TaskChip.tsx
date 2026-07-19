'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { PanelAccent } from './PanelShell';

const chipStyles: Record<PanelAccent, string> = {
  blue: 'bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/30 text-blue-700 dark:text-blue-300',
  violet: 'bg-violet-50 dark:bg-violet-500/10 border-violet-300 dark:border-violet-500/30 text-violet-700 dark:text-violet-300',
  emerald: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
  amber: 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-300',
  rose: 'bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-300',
  teal: 'bg-teal-50 dark:bg-teal-500/10 border-teal-300 dark:border-teal-500/30 text-teal-700 dark:text-teal-300',
};

interface TaskChipProps {
  /** Unique, stable run-label (e.g. "promise1#3") — doubles as layoutId
   *  so the SAME chip visually flies between panels as the task moves
   *  Web APIs → queue → gone. Labels are engine-unique per run. */
  label: string;
  accent: PanelAccent;
  /** Small trailing annotation, e.g. "0ms" or a URL. */
  detail?: string;
  /** First-in-queue emphasis (next to run). */
  isNext?: boolean;
}

// Strip the "#N" uniquifier the engine appends — it's for identity,
// not for humans.
function displayLabel(label: string): string {
  const hash = label.lastIndexOf('#');
  return hash > 0 ? label.slice(0, hash) : label;
}

export default function TaskChip({ label, accent, detail, isNext = false }: TaskChipProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      layoutId={shouldReduceMotion ? undefined : `chip-${label}`}
      layout={!shouldReduceMotion}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.6, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`
        inline-flex max-w-full items-center gap-1 rounded-md border px-1.5 py-0.5
        font-mono text-[10px] font-semibold
        ${chipStyles[accent]}
        ${isNext ? 'ring-1 ring-current/40 shadow-sm' : ''}
      `}
      title={label}
    >
      <span className="truncate">{displayLabel(label)}</span>
      {detail && (
        <span className="hidden sm:inline shrink-0 opacity-60 font-normal text-[9px]">{detail}</span>
      )}
    </motion.div>
  );
}

/** Dashed empty-state placeholder shared by all queue panels. */
export function EmptySlot({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-full min-h-[24px] rounded-lg border border-dashed border-border text-[10px] sm:text-xs italic text-muted-foreground">
      {text}
    </div>
  );
}
