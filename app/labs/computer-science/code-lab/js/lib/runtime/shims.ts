// ─── Sandbox Shims ─────────────────────────────────────────────
// Builds the set of globals injected into the user's transformed
// code. Everything async is OURS, so the Scheduler has full,
// deterministic control and the Recorder captures precise steps.

import type { StackFrame } from '../types';
import { Scheduler } from './scheduler';
import { createLoopGuard } from './loopGuard';

// Realistic-but-small cap so accidental unbounded recursion in
// free-form user code is caught fast, mirroring the loop guard's
// "controlled, catchable error" pattern rather than crashing the tab
// with a real stack overflow.
const MAX_CALL_DEPTH = 500;

// ── Value formatting for console output ────────────────────────
function formatValue(v: unknown, depth = 0): string {
  if (typeof v === 'string') return depth === 0 ? v : `'${v}'`;
  if (typeof v === 'number' || typeof v === 'boolean' || v === null) return String(v);
  if (v === undefined) return 'undefined';
  if (typeof v === 'function') return `[Function${(v as { name?: string }).name ? ': ' + (v as { name: string }).name : ' (anonymous)'}]`;
  if (typeof v === 'symbol') return v.toString();
  if (v instanceof Error) return `${v.name}: ${v.message}`;
  if (Array.isArray(v)) {
    if (depth > 2) return '[Array]';
    return `[ ${v.map(x => formatValue(x, depth + 1)).join(', ')} ]`;
  }
  if (typeof v === 'object') {
    if (depth > 2) return '[Object]';
    const entries = Object.entries(v as Record<string, unknown>).map(([k, val]) => `${k}: ${formatValue(val, depth + 1)}`);
    return `{ ${entries.join(', ')} }`;
  }
  return String(v);
}

function formatArgs(args: unknown[]): string {
  return args.map(a => formatValue(a, 0)).join(' ');
}

export interface Sandbox {
  globals: Record<string, unknown>;
  /** All console text captured, in order (for the console pane / tests). */
  readonly consoleLines: string[];
}

export function createSandbox(scheduler: Scheduler): Sandbox {
  const recorder = scheduler.recorder;
  const consoleLines: string[] = [];

  // ── console ──────────────────────────────────────────────
  const makeLogger = () => (...args: unknown[]) => {
    const text = formatArgs(args);
    consoleLines.push(text);
    recorder.log(text, scheduler.currentSource, `console.log outputs: ${text}`);
  };
  const consoleShim = { log: makeLogger(), info: makeLogger(), warn: makeLogger(), error: makeLogger(), debug: makeLogger() };

  // ── Frame-type helper: colour a frame by the queue it came from ─
  const frameTypeForSource = (): StackFrame['type'] => {
    switch (scheduler.currentSource) {
      case 'microtask': return 'microtask';
      case 'macrotask': return 'callback';
      default: return 'function';
    }
  };

  // ── Call-stack instrumentation hooks ─────────────────────
  // Depth counter is per-sandbox (reset every executeUserCode run),
  // not global — mirrors the loop guard's per-run lifecycle.
  let callDepth = 0;
  const __enter = (name: string, line?: number) => {
    callDepth++;
    if (callDepth > MAX_CALL_DEPTH) {
      throw new RangeError('Maximum call stack size exceeded (simulated)');
    }
    recorder.setLine(line);
    recorder.stackPush(name || '(anonymous)', frameTypeForSource(), `${name || '(anonymous function)'} is called — pushed onto the Call Stack.`, line);
  };
  const __exit = (line?: number) => {
    callDepth--;
    recorder.stackPop('Function returns — popped from the Call Stack.', line);
  };
  const __line = (line: number) => { recorder.setLine(line); };

  // ── Loop-iteration guard ──────────────────────────────────
  const loopGuard = createLoopGuard();
  const __loopTick = () => loopGuard.tick();

  // ── Timers ───────────────────────────────────────────────
  let labelCounter = 0;
  const uniqueLabel = (base: string) => `${base}#${++labelCounter}`;

  const setTimeoutShim = (fn: unknown, delay?: number, ...rest: unknown[]): number => {
    const name = (typeof fn === 'function' && (fn as { name?: string }).name) || 'anonymous';
    const label = uniqueLabel(name);
    recorder.addWebApi(label, 'timer', delay ?? 0, `setTimeout registers "${name}" in Web APIs (delay ${delay ?? 0}ms). It waits here — even 0ms never runs immediately.`);
    return scheduler.addTimer(delay ?? 0, label, () => {
      if (typeof fn === 'function') (fn as (...a: unknown[]) => unknown)(...rest);
    });
  };

  const setIntervalShim = (fn: unknown, delay?: number, ...rest: unknown[]): number => {
    const name = (typeof fn === 'function' && (fn as { name?: string }).name) || 'anonymous';
    const label = uniqueLabel(name);
    recorder.addWebApi(label, 'timer', delay ?? 0, `setInterval registers "${name}" in Web APIs, repeating every ${delay ?? 0}ms.`);
    return scheduler.addTimer(delay ?? 0, label, () => {
      if (typeof fn === 'function') (fn as (...a: unknown[]) => unknown)(...rest);
    }, delay ?? 0);
  };

  const clearShim = (id: unknown): void => {
    if (typeof id === 'number') scheduler.clearTimer(id);
  };

  // ── queueMicrotask ───────────────────────────────────────
  const queueMicrotaskShim = (fn: unknown): void => {
    const name = (typeof fn === 'function' && (fn as { name?: string }).name) || 'queueMicrotask';
    const label = uniqueLabel(name);
    recorder.addMicrotask(label, `queueMicrotask schedules "${name}" directly onto the Microtask Queue.`);
    scheduler.enqueueMicrotask(label, () => {
      if (typeof fn === 'function') (fn as () => unknown)();
    });
  };

  // ── Our Promise implementation ───────────────────────────
  const SbPromise = createSbPromise(scheduler, uniqueLabel);

  // ── async/await runtime ──────────────────────────────────
  const __await = (v: unknown) => ({ __sbAwait: true, value: v });

  const __runAsync = (genFn: () => Generator<unknown, unknown, unknown>): unknown => {
    const p = SbPromise.__internal();
    const gen = genFn();
    const step = (input: unknown, isErr: boolean): void => {
      let res: IteratorResult<unknown, unknown>;
      try {
        res = isErr ? gen.throw(input) : gen.next(input);
      } catch (e) {
        p.__reject(e);
        return;
      }
      if (res.done) { p.__resolve(res.value); return; }
      const yielded = res.value as { __sbAwait?: boolean; value?: unknown };
      const awaited = yielded && yielded.__sbAwait ? yielded.value : res.value;
      SbPromise.resolve(awaited).__thenLabeled(
        (v: unknown) => step(v, false),
        (e: unknown) => step(e, true),
        'async continuation',
      );
    };
    step(undefined, false);
    return p;
  };

  const globals: Record<string, unknown> = {
    console: consoleShim,
    setTimeout: setTimeoutShim,
    setInterval: setIntervalShim,
    clearTimeout: clearShim,
    clearInterval: clearShim,
    queueMicrotask: queueMicrotaskShim,
    Promise: SbPromise,
    __enter,
    __exit,
    __line,
    __loopTick,
    __await,
    __runAsync,
  };

  return { globals, consoleLines };
}

// ── Promises/A+-style implementation driven by the Scheduler ────

type SbState = 'pending' | 'fulfilled' | 'rejected';

interface SbHandler {
  onF?: unknown;
  onR?: unknown;
  resolveNext: (v: unknown) => void;
  rejectNext: (e: unknown) => void;
  labelHint?: string;
}

function createSbPromise(scheduler: Scheduler, uniqueLabel: (b: string) => string) {
  const recorder = scheduler.recorder;

  class SbPromise {
    private _state: SbState = 'pending';
    private _value: unknown = undefined;
    private _handlers: SbHandler[] = [];

    constructor(executor?: (resolve: (v: unknown) => void, reject: (e: unknown) => void) => void) {
      if (typeof executor === 'function') {
        // The executor runs SYNCHRONOUSLY, right now — the classic gotcha.
        recorder.stackPush('(promise executor)', 'promise-executor', 'new Promise(executor): the executor runs synchronously, immediately — not later.');
        try {
          executor(v => this.__resolve(v), e => this.__reject(e));
        } catch (e) {
          this.__reject(e);
        } finally {
          recorder.stackPop('Executor returned. The promise settles when resolve()/reject() is called.');
        }
      }
    }

    /** Internal factory: a pending promise with no executor frame recorded. */
    static __internal(): SbPromise {
      return new SbPromise();
    }

    __resolve(v: unknown): void {
      if (this._state !== 'pending') return;
      if (v && (typeof v === 'object' || typeof v === 'function')) {
        let then: unknown;
        try { then = (v as { then?: unknown }).then; } catch (e) { this.__reject(e); return; }
        if (typeof then === 'function') {
          let called = false;
          try {
            (then as (...a: unknown[]) => unknown).call(
              v,
              (val: unknown) => { if (!called) { called = true; this.__resolve(val); } },
              (err: unknown) => { if (!called) { called = true; this.__reject(err); } },
            );
          } catch (e) {
            if (!called) { called = true; this.__reject(e); }
          }
          return;
        }
      }
      this._state = 'fulfilled';
      this._value = v;
      this._flush();
    }

    __reject(e: unknown): void {
      if (this._state !== 'pending') return;
      this._state = 'rejected';
      this._value = e;
      this._flush();
    }

    private _flush(): void {
      if (this._state === 'pending') return;
      const handlers = this._handlers;
      this._handlers = [];
      for (const h of handlers) this._scheduleHandler(h);
    }

    private _scheduleHandler(h: SbHandler): void {
      const cb = this._state === 'fulfilled' ? h.onF : h.onR;
      const cbName = (typeof cb === 'function' && (cb as { name?: string }).name) || h.labelHint || (this._state === 'fulfilled' ? 'onFulfilled' : 'onRejected');
      const label = uniqueLabel(cbName);
      recorder.addMicrotask(label, `Promise settled — reaction "${cbName}" queued as a microtask.`);
      scheduler.enqueueMicrotask(label, () => {
        if (typeof cb !== 'function') {
          // No handler for this state → pass the value/error straight through.
          if (this._state === 'fulfilled') h.resolveNext(this._value);
          else h.rejectNext(this._value);
          return;
        }
        try {
          const result = (cb as (v: unknown) => unknown)(this._value);
          h.resolveNext(result);
        } catch (e) {
          h.rejectNext(e);
        }
      });
    }

    __thenLabeled(onF: unknown, onR: unknown, labelHint: string): SbPromise {
      const next = new SbPromise();
      const h: SbHandler = {
        onF,
        onR,
        resolveNext: v => next.__resolve(v),
        rejectNext: e => next.__reject(e),
        labelHint,
      };
      if (this._state === 'pending') this._handlers.push(h);
      else this._scheduleHandler(h);
      return next;
    }

    then(onF?: unknown, onR?: unknown): SbPromise {
      return this.__thenLabeled(onF, onR, '');
    }

    catch(onR?: unknown): SbPromise {
      return this.then(undefined, onR);
    }

    finally(cb?: unknown): SbPromise {
      const run = typeof cb === 'function' ? (cb as () => unknown) : () => {};
      return this.then(
        (v: unknown) => { run(); return v; },
        (e: unknown) => { run(); throw e; },
      );
    }

    static resolve(v?: unknown): SbPromise {
      if (v instanceof SbPromise) return v;
      const p = new SbPromise();
      p.__resolve(v);
      return p;
    }

    static reject(e?: unknown): SbPromise {
      const p = new SbPromise();
      p.__reject(e);
      return p;
    }

    static all(iterable: Iterable<unknown>): SbPromise {
      const items = Array.from(iterable);
      return new SbPromise((resolve, reject) => {
        const results = new Array(items.length);
        let remaining = items.length;
        if (remaining === 0) { resolve(results); return; }
        items.forEach((item, i) => {
          SbPromise.resolve(item).then(
            (v: unknown) => { results[i] = v; if (--remaining === 0) resolve(results); },
            (e: unknown) => reject(e),
          );
        });
      });
    }

    static race(iterable: Iterable<unknown>): SbPromise {
      const items = Array.from(iterable);
      return new SbPromise((resolve, reject) => {
        for (const item of items) SbPromise.resolve(item).then(resolve, reject);
      });
    }

    static allSettled(iterable: Iterable<unknown>): SbPromise {
      const items = Array.from(iterable);
      return new SbPromise((resolve) => {
        const results = new Array(items.length);
        let remaining = items.length;
        if (remaining === 0) { resolve(results); return; }
        items.forEach((item, i) => {
          SbPromise.resolve(item).then(
            (v: unknown) => { results[i] = { status: 'fulfilled', value: v }; if (--remaining === 0) resolve(results); },
            (e: unknown) => { results[i] = { status: 'rejected', reason: e }; if (--remaining === 0) resolve(results); },
          );
        });
      });
    }

    static any(iterable: Iterable<unknown>): SbPromise {
      const items = Array.from(iterable);
      return new SbPromise((resolve, reject) => {
        const errors = new Array(items.length);
        let remaining = items.length;
        if (remaining === 0) { reject(new Error('All promises were rejected')); return; }
        items.forEach((item, i) => {
          SbPromise.resolve(item).then(
            (v: unknown) => resolve(v),
            (e: unknown) => { errors[i] = e; if (--remaining === 0) reject(new Error('All promises were rejected')); },
          );
        });
      });
    }
  }

  return SbPromise as typeof SbPromise & {
    __internal(): InstanceType<typeof SbPromise> & { __resolve(v: unknown): void; __reject(e: unknown): void };
  };
}
