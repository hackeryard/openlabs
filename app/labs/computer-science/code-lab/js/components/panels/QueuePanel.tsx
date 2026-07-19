'use client';

import { AnimatePresence } from 'framer-motion';
import { Zap, ClipboardList, Film, ArrowUpNarrowWide } from 'lucide-react';
import type { QueueEntry } from '../../lib/types';
import PanelShell, { type PanelAccent } from './PanelShell';
import TaskChip, { EmptySlot } from './TaskChip';

interface QueuePanelProps {
  entries: QueueEntry[];
  isActive?: boolean;
  isDimmed?: boolean;
}

// FIFO queue rendered left→right; front of the queue (next to run)
// is emphasized. All four queue types are thin variants of this.
function QueuePanel({
  entries,
  isActive,
  isDimmed,
  icon,
  title,
  accent,
  hint,
  emptyText,
}: QueuePanelProps & {
  icon: typeof Zap;
  title: string;
  accent: PanelAccent;
  hint?: string;
  emptyText: string;
}) {
  return (
    <PanelShell
      icon={icon}
      title={title}
      accent={accent}
      count={`${entries.length}`}
      isActive={isActive}
      isDimmed={isDimmed}
      hint={hint}
    >
      <div className="flex flex-wrap content-start gap-1 sm:gap-1.5 h-full">
        <AnimatePresence mode="popLayout">
          {entries.length === 0 && (
            <div key="empty" className="w-full h-full">
              <EmptySlot text={emptyText} />
            </div>
          )}
          {entries.map((entry, i) => (
            <TaskChip key={entry.id} label={entry.label} accent={accent} isNext={i === 0} />
          ))}
        </AnimatePresence>
      </div>
    </PanelShell>
  );
}

export function MicroQueuePanel(props: QueuePanelProps) {
  return (
    <QueuePanel
      {...props}
      icon={Zap}
      title="Microtask Queue"
      accent="emerald"
      hint="Drains completely before any macrotask"
      emptyText="Empty"
    />
  );
}

export function MacroQueuePanel(props: QueuePanelProps) {
  return (
    <QueuePanel
      {...props}
      icon={ClipboardList}
      title="Macrotask Queue"
      accent="amber"
      hint="One task per event loop tick"
      emptyText="Empty"
    />
  );
}

export function RafPanel(props: QueuePanelProps) {
  return (
    <QueuePanel
      {...props}
      icon={Film}
      title="rAF Queue"
      accent="rose"
      hint="Runs once per frame, before paint"
      emptyText="No frame callbacks"
    />
  );
}

export function NextTickPanel(props: QueuePanelProps) {
  return (
    <QueuePanel
      {...props}
      icon={ArrowUpNarrowWide}
      title="nextTick"
      accent="teal"
      hint="Drains before ANY Promise microtask"
      emptyText="Empty"
    />
  );
}

export function ImmediatePanel(props: QueuePanelProps) {
  return (
    <QueuePanel
      {...props}
      icon={ClipboardList}
      title="setImmediate"
      accent="teal"
      hint="Node's check phase"
      emptyText="Empty"
    />
  );
}
