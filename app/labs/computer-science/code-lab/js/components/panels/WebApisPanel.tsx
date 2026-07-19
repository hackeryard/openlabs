'use client';

import { AnimatePresence } from 'framer-motion';
import { Globe, Timer, Wifi, MousePointerClick, Film, Coffee } from 'lucide-react';
import type { WebAPIItem } from '../../lib/types';
import PanelShell from './PanelShell';
import TaskChip, { EmptySlot } from './TaskChip';

const apiIcon: Record<WebAPIItem['type'], typeof Timer> = {
  timer: Timer,
  promise: Globe,
  fetch: Wifi,
  raf: Film,
  'dom-event': MousePointerClick,
  'idle-callback': Coffee,
};

interface WebApisPanelProps {
  items: WebAPIItem[];
  isDimmed?: boolean;
}

// The browser-side waiting room: registered timers/fetches/listeners.
export default function WebApisPanel({ items, isDimmed }: WebApisPanelProps) {
  return (
    <PanelShell
      icon={Globe}
      title="Web APIs"
      accent="violet"
      count={`${items.length}`}
      isDimmed={isDimmed}
    >
      <div className="flex flex-wrap content-start gap-1 sm:gap-1.5 h-full">
        <AnimatePresence mode="popLayout">
          {items.length === 0 && (
            <div key="empty" className="w-full h-full">
              <EmptySlot text="No active Web APIs" />
            </div>
          )}
          {items.map(item => {
            const Icon = apiIcon[item.type] ?? Globe;
            return (
              <span key={item.id} className="inline-flex items-center gap-1 max-w-full">
                <Icon className="w-3 h-3 shrink-0 text-violet-500/70 dark:text-violet-400/70" />
                <TaskChip
                  label={item.label}
                  accent="violet"
                  detail={item.delay !== undefined ? `${item.delay}ms` : item.detail}
                />
              </span>
            );
          })}
        </AnimatePresence>
      </div>
    </PanelShell>
  );
}
