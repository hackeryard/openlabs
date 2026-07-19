// ─── Deterministic Event-Loop Scheduler ────────────────────────
// Runs a fully self-contained model of the event loop. Because the
// sandbox exposes only OUR Promise + shimmed timers/queueMicrotask
// (and async/await is transformed into explicit microtasks), there
// are no native async primitives in user code — so every queue is
// ours and the entire simulation is synchronous and deterministic.
// Every state transition is written to the Recorder as an Instruction.

import type { ConsoleEntry, RuntimeMode } from '../types';
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
  /** Console/stack source when this fires — defaults to 'macrotask' (a plain timer); a DOM click dispatch passes 'dom-event' so the callback is attributed correctly. */
  source?: ConsoleEntry['source'];
}

interface Microtask {
  label: string;
  source: ConsoleEntry['source'];
  run: () => void;
}

interface RafCallback {
  id: number;
  label: string;
  run: () => void;
}

interface NodeTask {
  id: number;
  label: string;
  run: () => void;
}

// Safety budgets so a runaway program can't hang the tab.
const MAX_MACROTASKS = 2000;
const MAX_MICROTASKS = 100_000;
const MAX_INSTRUCTIONS = 20_000;

export class Scheduler {
  readonly recorder: Recorder;
  readonly mode: RuntimeMode;

  /** Console source tag applied to logs emitted while a task runs. */
  currentSource: ConsoleEntry['source'] = 'sync';

  /** Set when a budget is hit, so the orchestrator can surface a note. */
  budgetHit: string | null = null;

  private clock = 0;
  private seqCounter = 0;
  private timerIdCounter = 1;
  private timers: VirtualTimer[] = [];
  private microQueue: Microtask[] = [];

  // requestAnimationFrame — a separate "next frame" queue, not
  // time-based like timers. Populated/drained regardless of mode
  // (rAF exists conceptually in both Browser and Node simulations
  // here, matching how it's presented as a Web-API-style feature).
  private rafIdCounter = 1;
  private rafCallbacks: RafCallback[] = [];

  // Node-mode-only queues. Always declared so browser-mode code paths
  // can check `.length` unconditionally without branching, but never
  // populated unless `mode === 'node'` (the shims that would enqueue
  // into them aren't even exposed to user code in browser mode).
  private nextTickIdCounter = 1;
  private nextTickQueue: NodeTask[] = [];
  private immediateIdCounter = 1;
  private immediateQueue: NodeTask[] = [];

  constructor(recorder: Recorder, mode: RuntimeMode = 'browser') {
    this.recorder = recorder;
    this.mode = mode;
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
      this.rafCallbacks = [];
      this.nextTickQueue = [];
      this.immediateQueue = [];
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
  addTimer(delay: number, label: string, run: () => void, interval?: number, source?: ConsoleEntry['source']): number {
    const id = this.timerIdCounter++;
    const safeDelay = Number.isFinite(delay) && delay > 0 ? delay : 0;
    this.timers.push({ id, label, dueTime: this.clock + safeDelay, seq: this.seqCounter++, run, interval, source });
    return id;
  }

  clearTimer(id: number): void {
    this.timers = this.timers.filter(t => t.id !== id);
  }

  // ── Microtasks (our own queue) ─────────────────────────────
  enqueueMicrotask(label: string, run: () => void, source: ConsoleEntry['source'] = 'microtask'): void {
    this.microQueue.push({ label, source, run });
  }

  // ── requestAnimationFrame ────────────────────────────────────
  addRaf(label: string, run: () => void): number {
    const id = this.rafIdCounter++;
    this.rafCallbacks.push({ id, label, run });
    return id;
  }

  cancelRaf(id: number): void {
    this.rafCallbacks = this.rafCallbacks.filter(r => r.id !== id);
  }

  // ── Node mode: process.nextTick / setImmediate ──────────────
  addNextTick(label: string, run: () => void): number {
    const id = this.nextTickIdCounter++;
    this.nextTickQueue.push({ id, label, run });
    return id;
  }

  addImmediate(label: string, run: () => void): number {
    const id = this.immediateIdCounter++;
    this.immediateQueue.push({ id, label, run });
    return id;
  }

  clearImmediate(id: number): void {
    this.immediateQueue = this.immediateQueue.filter(t => t.id !== id);
  }

  // process.nextTick drains BEFORE any Promise microtask, every
  // single time — including nextTicks queued by other nextTicks —
  // which is Node's real, well-known distinguishing behavior. No-op
  // in browser mode (the shim that populates this queue is never
  // exposed to user code there, so it's always empty).
  private drainNextTick(): void {
    if (this.mode !== 'node') return;
    let count = 0;
    while (this.nextTickQueue.length > 0) {
      if (count++ > MAX_MICROTASKS || this.overBudget()) {
        this.budgetHit ??= 'Stopped: the process.nextTick queue never emptied. An endless chain of nextTicks starves everything else — even Promise microtasks never get a turn.';
        this.nextTickQueue = [];
        this.timers = [];
        this.microQueue = [];
        return;
      }
      const task = this.nextTickQueue.shift()!;
      this.recorder.removeNextTick(task.label, `process.nextTick callback "${task.label}" dequeued — running it now, before any Promise microtask.`);
      const prev = this.currentSource;
      this.currentSource = 'nexttick';
      try {
        task.run();
      } catch (e) {
        this.recordUncaught(e, 'in process.nextTick');
      } finally {
        this.currentSource = prev;
      }
    }
  }

  private drainMicrotasks(): void {
    let count = 0;
    this.drainNextTick();
    while (this.microQueue.length > 0 || (this.mode === 'node' && this.nextTickQueue.length > 0)) {
      if (this.mode === 'node' && this.nextTickQueue.length > 0) {
        this.drainNextTick();
        continue;
      }
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
      // A microtask may have queued a nextTick (Node mode) — the loop
      // condition re-checks nextTickQueue first on the next iteration.
    }
  }

  // requestAnimationFrame callbacks run once per simulated "frame":
  // after a microtask-drain point, before the next macrotask. This is
  // a simplification (real "is a repaint actually due" logic is far
  // more involved than this simulator's conceptual-model scope) but
  // correctly demonstrates the ordering that matters for teaching:
  // rAF runs after microtasks drain, and "paint" happens after rAF,
  // before the next macrotask.
  private runRafAndRenderPhase(): void {
    if (this.rafCallbacks.length === 0) return;

    this.recorder.phase('running-raf', '🎞️ requestAnimationFrame queue is non-empty — running rAF callbacks before paint.');
    const callbacks = this.rafCallbacks;
    this.rafCallbacks = [];
    for (const cb of callbacks) {
      this.recorder.removeRafCallback(cb.label, `rAF callback "${cb.label}" runs now.`);
      const prev = this.currentSource;
      this.currentSource = 'raf';
      try {
        cb.run();
      } catch (e) {
        this.recordUncaught(e, 'in requestAnimationFrame callback');
      } finally {
        this.currentSource = prev;
      }
    }

    if (this.microQueue.length > 0 || (this.mode === 'node' && this.nextTickQueue.length > 0)) {
      this.recorder.phase('draining-microtasks', '⚡ Draining microtasks queued during the rAF callbacks.');
      this.drainMicrotasks();
    }

    this.recorder.phase('rendering', "🖌️ Browser paints the frame now (conceptually) — this simulator doesn't render pixels, but this is where a real repaint happens, after rAF and before the next macrotask.");
  }

  // setImmediate fires in Node's "check" phase, after I/O callbacks —
  // modeled here as draining once per macrotask cycle. No-op in
  // browser mode.
  private drainImmediate(): void {
    if (this.mode !== 'node') return;
    let count = 0;
    while (this.immediateQueue.length > 0) {
      if (count++ > MAX_MACROTASKS || this.overBudget()) {
        this.budgetHit ??= 'Stopped: too many setImmediate callbacks (possible runaway setImmediate loop).';
        this.immediateQueue = [];
        return;
      }
      const task = this.immediateQueue.shift()!;
      this.recorder.removeImmediate(task.label, `setImmediate callback "${task.label}" dequeued — running it now.`);
      const prev = this.currentSource;
      this.currentSource = 'immediate';
      try {
        task.run();
      } catch (e) {
        this.recordUncaught(e, 'in setImmediate callback');
      } finally {
        this.currentSource = prev;
      }
      if (this.microQueue.length > 0 || this.nextTickQueue.length > 0) {
        this.drainMicrotasks();
      }
    }
  }

  // ── Main drive loop ────────────────────────────────────────
  drive(): void {
    // Drain microtasks queued by the top-level synchronous run first.
    if (this.microQueue.length > 0 || (this.mode === 'node' && this.nextTickQueue.length > 0)) {
      this.recorder.phase('checking-stack', '🔄 Call Stack empty. Checking the Microtask Queue…');
      this.recorder.phase('draining-microtasks', '⚡ Draining ALL microtasks before any macrotask.');
    }
    this.drainMicrotasks();
    this.runRafAndRenderPhase();

    let macrotasks = 0;
    // setImmediate has no timer of its own (it's Node's "check" phase,
    // not time-based), so the loop must keep running even when
    // `timers` is empty but `immediateQueue` still has work — the
    // inner "pick a timer" block below is skipped in that case, only
    // drainImmediate() runs for that iteration.
    while (this.timers.length > 0 || (this.mode === 'node' && this.immediateQueue.length > 0)) {
      if (macrotasks++ > MAX_MACROTASKS || this.overBudget()) {
        this.budgetHit ??= 'Stopped: too many macrotasks (possible runaway setInterval or timer loop).';
        break;
      }

      if (this.timers.length > 0) {
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
        this.currentSource = next.source ?? 'macrotask';
        try {
          next.run();
        } catch (e) {
          this.recordUncaught(e, 'in timer callback');
        } finally {
          this.currentSource = prev;
        }

        // After every macrotask, drain ALL microtasks before the next one.
        if (this.microQueue.length > 0 || (this.mode === 'node' && this.nextTickQueue.length > 0)) {
          this.recorder.phase('draining-microtasks', '⚡ Macrotask done — draining any microtasks it queued before the next macrotask.');
          this.drainMicrotasks();
        }
        this.runRafAndRenderPhase();
      }

      this.drainImmediate();
    }

    this.recorder.phase('idle', '✅ Call Stack empty, all queues drained — the event loop goes idle.');
  }
}
