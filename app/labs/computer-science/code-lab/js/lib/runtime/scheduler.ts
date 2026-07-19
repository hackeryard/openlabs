// ─── Deterministic Event-Loop Scheduler ────────────────────────
// Runs a fully self-contained model of the event loop. Because the
// sandbox exposes only OUR Promise + shimmed timers/queueMicrotask
// (and async/await is transformed into explicit microtasks), there
// are no native async primitives in user code — so every queue is
// ours and the entire simulation is synchronous and deterministic.
// Every state transition is written to the Recorder as an Instruction.

import type { ConsoleEntry } from '../types';
import { Recorder } from './recorder';
import { LOOP_BUDGET_MESSAGE } from './loopGuard';

const RECURSION_MESSAGE = 'Maximum call stack size exceeded (simulated)';
const LOOP_NOTE = 'Stopped: this loop ran too many iterations to visualize (possible infinite loop). Add a smaller bound or a break condition.';
const RECURSION_NOTE = 'Stopped: this recursion went too deep to visualize (possible missing base case).';

interface VirtualTimer {
  id: number;
  label: string;
  dueTime: number;
  seq: number;
  run: () => void;
  interval?: number; // ms; present for setInterval
}

interface Microtask {
  label: string;
  source: ConsoleEntry['source'];
  run: () => void;
}

// Safety budgets so a runaway program can't hang the tab.
const MAX_MACROTASKS = 2000;
const MAX_MICROTASKS = 100_000;
const MAX_INSTRUCTIONS = 20_000;

export class Scheduler {
  readonly recorder: Recorder;

  /** Console source tag applied to logs emitted while a task runs. */
  currentSource: ConsoleEntry['source'] = 'sync';

  /** Set when a budget is hit, so the orchestrator can surface a note. */
  budgetHit: string | null = null;

  private clock = 0;
  private seqCounter = 0;
  private timerIdCounter = 1;
  private timers: VirtualTimer[] = [];
  private microQueue: Microtask[] = [];

  constructor(recorder: Recorder) {
    this.recorder = recorder;
  }

  private recordUncaught(e: unknown, where: string): void {
    const err = e as Error;
    const budgetNote = err && err.message === LOOP_BUDGET_MESSAGE ? LOOP_NOTE
      : err && err.message === RECURSION_MESSAGE ? RECURSION_NOTE
      : undefined;
    if (budgetNote) {
      // A controlled safety stop (loop/recursion guard tripped inside
      // a callback), not a bug in the user's code — surface as the
      // same `note` banner a top-level trip would produce, skip the
      // generic "Uncaught (...)" console log, and stop the drive loop
      // the same way overBudget() already does for other budgets.
      this.budgetHit ??= budgetNote;
      this.microQueue = [];
      this.timers = [];
      return;
    }
    const text = err && err.name ? `Uncaught (${where}) ${err.name}: ${err.message}` : `Uncaught (${where}) ${String(e)}`;
    this.recorder.log(text, this.currentSource, text);
  }

  private overBudget(): boolean {
    if (this.recorder.instructions.length > MAX_INSTRUCTIONS) {
      this.budgetHit ??= 'Stopped: this program produced too many steps to visualize.';
      return true;
    }
    return false;
  }

  // ── Timers (virtual clock) ─────────────────────────────────
  addTimer(delay: number, label: string, run: () => void, interval?: number): number {
    const id = this.timerIdCounter++;
    const safeDelay = Number.isFinite(delay) && delay > 0 ? delay : 0;
    this.timers.push({ id, label, dueTime: this.clock + safeDelay, seq: this.seqCounter++, run, interval });
    return id;
  }

  clearTimer(id: number): void {
    this.timers = this.timers.filter(t => t.id !== id);
  }

  // ── Microtasks (our own queue) ─────────────────────────────
  enqueueMicrotask(label: string, run: () => void, source: ConsoleEntry['source'] = 'microtask'): void {
    this.microQueue.push({ label, source, run });
  }

  private drainMicrotasks(): void {
    let count = 0;
    while (this.microQueue.length > 0) {
      if (count++ > MAX_MICROTASKS || this.overBudget()) {
        this.budgetHit ??= 'Stopped: the microtask queue never emptied. An endless chain of microtasks starves the event loop — macrotasks and rendering never get a turn.';
        this.microQueue = [];
        this.timers = [];
        return;
      }
      const task = this.microQueue.shift()!;
      this.recorder.removeMicrotask(task.label, `Microtask "${task.label}" dequeued — running it now.`);
      const prev = this.currentSource;
      this.currentSource = task.source;
      try {
        task.run();
      } catch (e) {
        this.recordUncaught(e, 'in promise');
      } finally {
        this.currentSource = prev;
      }
    }
  }

  // ── Main drive loop ────────────────────────────────────────
  drive(): void {
    // Drain microtasks queued by the top-level synchronous run first.
    if (this.microQueue.length > 0) {
      this.recorder.phase('checking-stack', '🔄 Call Stack empty. Checking the Microtask Queue…');
      this.recorder.phase('draining-microtasks', '⚡ Draining ALL microtasks before any macrotask.');
    }
    this.drainMicrotasks();

    let macrotasks = 0;
    while (this.timers.length > 0) {
      if (macrotasks++ > MAX_MACROTASKS || this.overBudget()) {
        this.budgetHit ??= 'Stopped: too many macrotasks (possible runaway setInterval or timer loop).';
        break;
      }

      // Pick the soonest-due timer (ties broken by registration order).
      let next = this.timers[0];
      for (const t of this.timers) {
        if (t.dueTime < next.dueTime || (t.dueTime === next.dueTime && t.seq < next.seq)) next = t;
      }
      this.clock = Math.max(this.clock, next.dueTime);

      this.recorder.phase('checking-stack', '🔄 Call Stack empty, microtasks drained. Checking the Macrotask Queue…');
      this.recorder.removeWebApi(next.label, `Timer elapsed — "${next.label}" leaves Web APIs.`);
      this.recorder.addMacrotask(next.label, `"${next.label}" is placed on the Macrotask Queue.`);
      this.recorder.phase('picking-macrotask', '📋 Taking one macrotask from the queue.');
      this.recorder.removeMacrotask(next.label, `"${next.label}" dequeued — about to run.`);

      // Remove it; re-arm first if it's an interval.
      this.timers = this.timers.filter(t => t.id !== next.id);
      if (next.interval !== undefined) {
        this.timers.push({
          id: next.id,
          label: next.label,
          dueTime: this.clock + (next.interval > 0 ? next.interval : 0),
          seq: this.seqCounter++,
          run: next.run,
          interval: next.interval,
        });
        this.recorder.addWebApi(next.label, 'timer', next.interval, `Interval re-armed — "${next.label}" waits in Web APIs again.`);
      }

      const prev = this.currentSource;
      this.currentSource = 'macrotask';
      try {
        next.run();
      } catch (e) {
        this.recordUncaught(e, 'in timer callback');
      } finally {
        this.currentSource = prev;
      }

      // After every macrotask, drain ALL microtasks before the next one.
      if (this.microQueue.length > 0) {
        this.recorder.phase('draining-microtasks', '⚡ Macrotask done — draining any microtasks it queued before the next macrotask.');
        this.drainMicrotasks();
      }
    }

    this.recorder.phase('idle', '✅ Call Stack empty, all queues drained — the event loop goes idle.');
  }
}
