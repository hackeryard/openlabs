'use client';

import { useMemo } from 'react';
import type { SimulationSnapshot } from '../lib/types';
import CallStack from './CallStack';
import WebAPIsPanel from './WebAPIsPanel';
import MicrotaskQueue from './MicrotaskQueue';
import MacrotaskQueue from './MacrotaskQueue';
import RafQueuePanel from './RafQueuePanel';
import NodeQueuesPanel from './NodeQueuesPanel';

interface RuntimePanelGroupProps {
  snapshot: SimulationSnapshot;
  /** The full timeline for the current run — used only to decide
   * whether the rAF panel is worth showing at all (a beginner doing a
   * sync-only example shouldn't see an always-empty queue strip). */
  snapshots: SimulationSnapshot[];
}

// Groups Call Stack / Web APIs / Micro+Macrotask queues (plus rAF and
// Node queues when relevant) into one scrollable region with
// sub-headers, so the responsive shell can use this as a single
// "Runtime" tab target instead of exposing a wall of flat panels.
export default function RuntimePanelGroup({ snapshot, snapshots }: RuntimePanelGroupProps) {
  const isDrainingMicrotasks = snapshot.eventLoopPhase === 'draining-microtasks';
  const isPickingMacrotask = snapshot.eventLoopPhase === 'picking-macrotask';
  const isRunningRaf = snapshot.eventLoopPhase === 'running-raf';
  const isDrainingNextTick = snapshot.eventLoopPhase === 'draining-nexttick';

  // Empty-state suppression: only show the rAF strip if this run ever
  // actually populates it. Node queues are simpler — `mode` is fixed
  // for the whole run, so just check the current snapshot.
  const usesRaf = useMemo(() => snapshots.some(s => s.rafQueue.length > 0), [snapshots]);
  const isNodeMode = snapshot.mode === 'node';

  return (
    <div className="flex flex-col gap-3">
      <section className="flex flex-col gap-2">
        <h4 className="px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Execution</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-h-[140px]">
          <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-card overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.05)] flex flex-col">
            <CallStack frames={snapshot.callStack} />
          </div>
          <div className="rounded-xl border border-violet-200 dark:border-violet-500/20 bg-card overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.05)]">
            <WebAPIsPanel items={snapshot.webAPIs} />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h4 className="px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Queues</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-h-[100px]">
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-card overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.05)] flex flex-col">
            <MicrotaskQueue entries={snapshot.microtaskQueue} isActive={isDrainingMicrotasks} />
          </div>
          <div className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-card overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.05)] flex flex-col">
            <MacrotaskQueue
              entries={snapshot.macrotaskQueue}
              isActive={isPickingMacrotask}
              isDimmed={snapshot.microtaskQueue.length > 0 && isDrainingMicrotasks}
            />
          </div>
        </div>
      </section>

      {usesRaf && (
        <section className="flex flex-col gap-2">
          <h4 className="px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Animation Frame</h4>
          <div className="rounded-xl border border-rose-200 dark:border-rose-500/20 bg-card overflow-hidden shadow-[0_0_20px_rgba(244,63,94,0.05)] flex flex-col">
            <RafQueuePanel entries={snapshot.rafQueue} isActive={isRunningRaf} />
          </div>
        </section>
      )}

      {isNodeMode && (
        <section className="flex flex-col gap-2">
          <h4 className="px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Node.js</h4>
          <div className="rounded-xl border border-teal-200 dark:border-teal-500/20 bg-card overflow-hidden shadow-[0_0_20px_rgba(20,184,166,0.05)] flex flex-col">
            <NodeQueuesPanel
              nextTickQueue={snapshot.nextTickQueue}
              immediateQueue={snapshot.immediateQueue}
              isDrainingNextTick={isDrainingNextTick}
            />
          </div>
        </section>
      )}
    </div>
  );
}
