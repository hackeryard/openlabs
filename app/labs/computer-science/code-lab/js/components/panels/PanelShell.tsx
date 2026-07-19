'use client';

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export type PanelAccent = 'blue' | 'violet' | 'emerald' | 'amber' | 'rose' | 'teal';

const accentStyles: Record<PanelAccent, {
  border: string;
  activeRing: string;
  headerIconBg: string;
  headerIconText: string;
  title: string;
  count: string;
}> = {
  blue: {
    border: 'border-blue-200 dark:border-blue-500/25',
    activeRing: 'ring-2 ring-blue-400/60 dark:ring-blue-400/50 shadow-[0_0_24px_rgba(59,130,246,0.25)]',
    headerIconBg: 'bg-blue-100 dark:bg-blue-500/20',
    headerIconText: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-700 dark:text-blue-300',
    count: 'text-blue-600/70 dark:text-blue-400/70',
  },
  violet: {
    border: 'border-violet-200 dark:border-violet-500/25',
    activeRing: 'ring-2 ring-violet-400/60 dark:ring-violet-400/50 shadow-[0_0_24px_rgba(139,92,246,0.25)]',
    headerIconBg: 'bg-violet-100 dark:bg-violet-500/20',
    headerIconText: 'text-violet-600 dark:text-violet-400',
    title: 'text-violet-700 dark:text-violet-300',
    count: 'text-violet-600/70 dark:text-violet-400/70',
  },
  emerald: {
    border: 'border-emerald-200 dark:border-emerald-500/25',
    activeRing: 'ring-2 ring-emerald-400/60 dark:ring-emerald-400/50 shadow-[0_0_24px_rgba(16,185,129,0.3)]',
    headerIconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
    headerIconText: 'text-emerald-600 dark:text-emerald-400',
    title: 'text-emerald-700 dark:text-emerald-300',
    count: 'text-emerald-600/70 dark:text-emerald-400/70',
  },
  amber: {
    border: 'border-amber-200 dark:border-amber-500/25',
    activeRing: 'ring-2 ring-amber-400/60 dark:ring-amber-400/50 shadow-[0_0_24px_rgba(245,158,11,0.3)]',
    headerIconBg: 'bg-amber-100 dark:bg-amber-500/20',
    headerIconText: 'text-amber-600 dark:text-amber-400',
    title: 'text-amber-700 dark:text-amber-300',
    count: 'text-amber-600/70 dark:text-amber-400/70',
  },
  rose: {
    border: 'border-rose-200 dark:border-rose-500/25',
    activeRing: 'ring-2 ring-rose-400/60 dark:ring-rose-400/50 shadow-[0_0_24px_rgba(244,63,94,0.25)]',
    headerIconBg: 'bg-rose-100 dark:bg-rose-500/20',
    headerIconText: 'text-rose-600 dark:text-rose-400',
    title: 'text-rose-700 dark:text-rose-300',
    count: 'text-rose-600/70 dark:text-rose-400/70',
  },
  teal: {
    border: 'border-teal-200 dark:border-teal-500/25',
    activeRing: 'ring-2 ring-teal-400/60 dark:ring-teal-400/50 shadow-[0_0_24px_rgba(20,184,166,0.25)]',
    headerIconBg: 'bg-teal-100 dark:bg-teal-500/20',
    headerIconText: 'text-teal-600 dark:text-teal-400',
    title: 'text-teal-700 dark:text-teal-300',
    count: 'text-teal-600/70 dark:text-teal-400/70',
  },
};

interface PanelShellProps {
  icon: LucideIcon;
  title: string;
  accent: PanelAccent;
  /** Small right-aligned header annotation, e.g. "2" or "1 frame". */
  count?: string;
  /** True while this panel is the event loop's current focus — glows. */
  isActive?: boolean;
  /** Dim slightly when some OTHER panel is the focus. */
  isDimmed?: boolean;
  /** One-line hint under the header (hidden at the smallest sizes). */
  hint?: string;
  children: ReactNode;
  className?: string;
}

// The shared card every runtime panel lives in: accent-tinted header,
// count badge, and an animated focus ring when the event loop is
// working this panel. Density adapts via responsive utilities only —
// no JS breakpoint logic.
export default function PanelShell({
  icon: Icon,
  title,
  accent,
  count,
  isActive = false,
  isDimmed = false,
  hint,
  children,
  className = '',
}: PanelShellProps) {
  const shouldReduceMotion = useReducedMotion();
  const styles = accentStyles[accent];

  return (
    <motion.section
      layout={!shouldReduceMotion}
      animate={
        shouldReduceMotion
          ? undefined
          : { scale: isActive ? 1.015 : 1, opacity: isDimmed ? 0.6 : 1 }
      }
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`
        relative flex flex-col min-h-0 min-w-0 rounded-xl border bg-card overflow-hidden
        transition-shadow duration-300
        ${styles.border} ${isActive ? styles.activeRing : ''}
        ${shouldReduceMotion && isDimmed ? 'opacity-60' : ''}
        ${className}
      `}
      aria-label={title}
    >
      <header className="shrink-0 flex items-center gap-1.5 px-2 py-1 border-b border-border/60">
        <span className={`w-4 h-4 rounded flex items-center justify-center ${styles.headerIconBg}`}>
          <Icon className={`w-2.5 h-2.5 ${styles.headerIconText}`} />
        </span>
        {/* `hint` doubles as a hover tooltip — no dedicated row, it
            would eat panel space (this UI is optimized for short
            viewports); the full teaching copy lives in InfoModal. */}
        <h3 className={`text-[11px] font-bold tracking-wide truncate ${styles.title}`} title={hint}>{title}</h3>
        {count !== undefined && (
          <span className={`ml-auto text-[10px] font-mono ${styles.count}`}>{count}</span>
        )}
      </header>
      <div className="flex-1 min-h-0 overflow-y-auto thin-scrollbar p-1.5">
        {children}
      </div>
    </motion.section>
  );
}
