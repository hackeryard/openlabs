'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { EventLoopPhase } from '../lib/types';
import { RefreshCw, Search, Zap, ClipboardList, CheckCircle2, Film, Paintbrush, Coffee, ArrowUpNarrowWide } from 'lucide-react';

interface LoopHubProps {
  phase: EventLoopPhase;
  description: string;
  /** Step index — keys the narration bubble so it springs in per step. */
  step: number;
}

const phaseConfig: Record<EventLoopPhase, { icon: typeof RefreshCw; label: string; text: string; bg: string; border: string; dot: string }> = {
  executing:             { icon: RefreshCw,         label: 'Executing',        text: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-500/10',    border: 'border-blue-300 dark:border-blue-500/30',    dot: 'bg-blue-500' },
  'checking-stack':      { icon: Search,            label: 'Checking Stack',   text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10', border: 'border-indigo-300 dark:border-indigo-500/30', dot: 'bg-indigo-500' },
  'draining-microtasks': { icon: Zap,               label: 'Draining Micro',   text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-300 dark:border-emerald-500/30', dot: 'bg-emerald-500' },
  'picking-macrotask':   { icon: ClipboardList,     label: 'Picking Macro',    text: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-500/10',  border: 'border-amber-300 dark:border-amber-500/30',  dot: 'bg-amber-500' },
  'draining-nexttick':   { icon: ArrowUpNarrowWide, label: 'nextTick',         text: 'text-teal-600 dark:text-teal-400',    bg: 'bg-teal-50 dark:bg-teal-500/10',    border: 'border-teal-300 dark:border-teal-500/30',    dot: 'bg-teal-500' },
  'running-raf':         { icon: Film,              label: 'rAF Callbacks',    text: 'text-rose-600 dark:text-rose-400',    bg: 'bg-rose-50 dark:bg-rose-500/10',    border: 'border-rose-300 dark:border-rose-500/30',    dot: 'bg-rose-500' },
  rendering:             { icon: Paintbrush,        label: 'Paint',            text: 'text-rose-600 dark:text-rose-400',    bg: 'bg-rose-50 dark:bg-rose-500/10',    border: 'border-rose-300 dark:border-rose-500/30',    dot: 'bg-rose-500' },
  'idle-callback':       { icon: Coffee,            label: 'Idle Callback',    text: 'text-slate-600 dark:text-slate-400',  bg: 'bg-slate-100 dark:bg-slate-500/10', border: 'border-slate-300 dark:border-slate-500/30',  dot: 'bg-slate-500' },
  idle:                  { icon: CheckCircle2,      label: 'Idle',             text: 'text-muted-foreground',               bg: 'bg-muted',                          border: 'border-border',                              dot: 'bg-muted-foreground' },
};

// The animated heart of the dashboard: a spinning loop badge showing
// the current phase, plus a speech-bubble narration that springs in on
// every step so the user's eye always has one place to read "what just
// happened".
export default function LoopHub({ phase, description, step }: LoopHubProps) {
  const shouldReduceMotion = useReducedMotion();
  const config = phaseConfig[phase];
  const Icon = config.icon;
  const isBusy = phase !== 'idle';

  return (
    <div className={`shrink-0 flex items-center gap-2 rounded-lg border px-2 py-1 ${config.bg} ${config.border} transition-colors duration-300`}>
      {/* Spinning hub badge */}
      <div className="relative shrink-0">
        <motion.div
          animate={isBusy && !shouldReduceMotion ? { rotate: 360 } : { rotate: 0 }}
          transition={isBusy ? { repeat: Infinity, duration: 4, ease: 'linear' } : undefined}
          className={`w-6 h-6 rounded-full border-2 border-dashed ${config.border} flex items-center justify-center`}
        >
          {/* Counter-rotate so the icon stays upright while the dashed ring spins */}
          <motion.span
            animate={isBusy && !shouldReduceMotion ? { rotate: -360 } : { rotate: 0 }}
            transition={isBusy ? { repeat: Infinity, duration: 4, ease: 'linear' } : undefined}
            className="flex"
          >
            <Icon className={`w-3 h-3 ${config.text}`} />
          </motion.span>
        </motion.div>
        {isBusy && !shouldReduceMotion && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
          </span>
        )}
      </div>

      {/* Phase label + narration bubble */}
      <div className="flex-1 min-w-0">
        <span className={`block text-[9px] font-black uppercase tracking-widest ${config.text}`}>
          Event Loop · {config.label}
        </span>
        {/* Keyed remount (no AnimatePresence): exit choreography would
            serialize per step and lag behind rapid scrubbing. */}
        <motion.p
          key={step}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className="text-[10px] sm:text-[11px] text-foreground/85 leading-snug line-clamp-2"
          aria-live="polite"
        >
          {description}
        </motion.p>
      </div>
    </div>
  );
}
