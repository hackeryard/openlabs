'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { EventLoopPhase } from '../lib/types';
import { RefreshCw, Search, Zap, ClipboardList, CheckCircle2 } from 'lucide-react';

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
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    glowColor: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]',
  },
  'checking-stack': {
    icon: Search,
    label: 'Checking Stack',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    glowColor: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]',
  },
  'draining-microtasks': {
    icon: Zap,
    label: 'Draining Microtasks',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
  },
  'picking-macrotask': {
    icon: ClipboardList,
    label: 'Picking Macrotask',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    glowColor: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
  },
  idle: {
    icon: CheckCircle2,
    label: 'Idle',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/30',
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
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.color.replace('text-', 'bg-')}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${config.color.replace('text-', 'bg-')}`} />
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed" aria-live="polite">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
