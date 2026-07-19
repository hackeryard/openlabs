'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { EventLoopPhase } from '../lib/types';
import { RefreshCw, Search, Zap, ClipboardList, CheckCircle2, Film, Paintbrush, Coffee, ArrowUpNarrowWide } from 'lucide-react';

interface EventLoopIndicatorProps {
  phase: EventLoopPhase;
  description: string;
}

const phaseConfig: Record<EventLoopPhase, {
  icon: typeof RefreshCw;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
}> = {
  executing: {
    icon: RefreshCw,
    label: 'Executing',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-500/10',
    borderColor: 'border-blue-300 dark:border-blue-500/30',
    glowColor: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]',
  },
  'checking-stack': {
    icon: Search,
    label: 'Checking Stack',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-500/10',
    borderColor: 'border-indigo-300 dark:border-indigo-500/30',
    glowColor: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]',
  },
  'draining-microtasks': {
    icon: Zap,
    label: 'Draining Microtasks',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
    borderColor: 'border-emerald-300 dark:border-emerald-500/30',
    glowColor: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
  },
  'picking-macrotask': {
    icon: ClipboardList,
    label: 'Picking Macrotask',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-500/10',
    borderColor: 'border-amber-300 dark:border-amber-500/30',
    glowColor: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
  },
  'draining-nexttick': {
    icon: ArrowUpNarrowWide,
    label: 'Draining nextTick',
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-500/10',
    borderColor: 'border-teal-300 dark:border-teal-500/30',
    glowColor: 'shadow-[0_0_15px_rgba(20,184,166,0.2)]',
  },
  'running-raf': {
    icon: Film,
    label: 'Running rAF Callbacks',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-500/10',
    borderColor: 'border-rose-300 dark:border-rose-500/30',
    glowColor: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]',
  },
  rendering: {
    icon: Paintbrush,
    label: 'Rendering (Paint)',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-500/10',
    borderColor: 'border-rose-300 dark:border-rose-500/30',
    glowColor: 'shadow-[0_0_15px_rgba(244,63,94,0.1)]',
  },
  'idle-callback': {
    icon: Coffee,
    label: 'Idle Callback',
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-500/10',
    borderColor: 'border-slate-300 dark:border-slate-500/30',
    glowColor: '',
  },
  idle: {
    icon: CheckCircle2,
    label: 'Idle',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    borderColor: 'border-border',
    glowColor: '',
  },
};

export default function EventLoopIndicator({ phase, description }: EventLoopIndicatorProps) {
  const shouldReduceMotion = useReducedMotion();
  const config = phaseConfig[phase];
  const Icon = config.icon;
  const isActive = phase !== 'idle' && phase !== 'executing';

  return (
    <motion.div
      layout={!shouldReduceMotion}
      className={`
        shrink-0 relative overflow-hidden rounded-xl border px-4 py-3
        ${config.bgColor} ${config.borderColor} ${config.glowColor}
        transition-shadow duration-500
      `}
    >
      {/* Animated background sweep for active phases */}
      {isActive && !shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(90deg, transparent, ${phase === 'draining-microtasks' ? 'rgb(16,185,129)' : phase === 'picking-macrotask' ? 'rgb(245,158,11)' : 'rgb(99,102,241)'}, transparent)`,
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        />
      )}

      <div className="relative z-10 flex items-center gap-3">
        {/* Icon */}
        <div className={`shrink-0 w-8 h-8 rounded-lg ${config.bgColor} border ${config.borderColor} flex items-center justify-center`}>
          <Icon
            className={`w-4 h-4 ${config.color} ${isActive && !shouldReduceMotion ? 'animate-spin' : ''}`}
            style={isActive && !shouldReduceMotion ? { animationDuration: '3s' } : undefined}
          />
        </div>

        {/* Phase label + description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>
              {config.label}
            </span>
            {isActive && !shouldReduceMotion && (
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.color.replace(/text-/g, 'bg-')}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${config.color.replace(/text-/g, 'bg-')}`} />
              </span>
            )}
          </div>
          <p className="text-xs text-foreground/80 mt-0.5 leading-relaxed" aria-live="polite">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
