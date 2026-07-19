// ─── Sandbox Shims ─────────────────────────────────────────────
// Builds the set of globals injected into the user's transformed
// code. Everything async is OURS, so the Scheduler has full,
// deterministic control and the Recorder captures precise steps.

import type { StackFrame, RuntimeMode } from '../types';
import { Scheduler } from './scheduler';
import { createLoopGuard } from './loopGuard';

// Fixed, non-random simulated network latency — the whole point of
// this simulator is deterministic, reproducible traces, so fetch
// never uses Math.random() for timing.
const FETCH_LATENCY_MS = 300;
const DEFAULT_FETCH_PAYLOAD = { id: 1, name: 'sample' };

// Realistic-but-small cap so accidental unbounded recursion in
// free-form user code is caught fast, mirroring the loop guard's
// "controlled, catchable error" pattern rather than crashing the tab
// with a real stack overflow.
const MAX_CALL_DEPTH = 500;

// ── Value formatting for console output ────────────────────────
export function formatValue(v: unknown, depth = 0): string {
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
  /** Call once, after the run finishes draining, for any rejected promise that never got a `.then`/`.catch` reaction attached. */
  getUnhandledRejections: () => unknown[];
}

export function createSandbox(scheduler: Scheduler, mode: RuntimeMode = 'browser'): Sandbox {
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
      case 'raf': return 'raf-callback';
      case 'dom-event': return 'dom-handler';
      case 'nexttick':
      case 'immediate': return 'node-callback';
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
  const { SbPromise, getUnhandledRejections } = createSbPromise(scheduler, uniqueLabel);

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

  // ── fetch (fully mocked — no real network call, ever) ─────
  // Modeled as "a timer that resolves a Response-shaped promise when
  // it fires": a fetch sits in Web APIs for a fixed simulated latency,
  // then resolves. `.json()`/`.text()` each add their OWN microtask
  // hop, which is what produces the "multiple microtask hops" a real
  // fetch().then(r => r.json()).then(data => ...) chain has.
  const createMockResponse = (payload: unknown) => ({
    ok: true,
    status: 200,
    json: () => {
      const label = uniqueLabel('response.json');
      recorder.addMicrotask(label, 'response.json() parses the body — queued as its own microtask.');
      const p = SbPromise.__internal();
      scheduler.enqueueMicrotask(label, () => { p.__resolve(payload); });
      return p;
    },
    text: () => {
      const label = uniqueLabel('response.text');
      recorder.addMicrotask(label, 'response.text() reads the body — queued as its own microtask.');
      const p = SbPromise.__internal();
      scheduler.enqueueMicrotask(label, () => { p.__resolve(JSON.stringify(payload)); });
      return p;
    },
  });

  const fetchShim = (url: unknown): unknown => {
    const urlStr = typeof url === 'string' ? url : String(url);
    const label = uniqueLabel('fetch');
    recorder.addWebApi(label, 'fetch', FETCH_LATENCY_MS, `fetch("${urlStr}") registers a simulated network request in Web APIs (no real request is made).`, urlStr);
    const p = SbPromise.__internal();
    scheduler.addTimer(FETCH_LATENCY_MS, label, () => {
      p.__resolve(createMockResponse(DEFAULT_FETCH_PAYLOAD));
    });
    return p;
  };

  // ── requestAnimationFrame / cancelAnimationFrame ──────────
  const requestAnimationFrameShim = (fn: unknown): number => {
    const name = (typeof fn === 'function' && (fn as { name?: string }).name) || 'anonymous';
    const label = uniqueLabel(name);
    recorder.addRafCallback(label, `requestAnimationFrame schedules "${name}" for the next frame — runs after this turn's microtasks drain, before paint.`);
    return scheduler.addRaf(label, () => {
      if (typeof fn === 'function') (fn as (...a: unknown[]) => unknown)(0);
    });
  };
  const cancelAnimationFrameShim = (id: unknown): void => {
    if (typeof id === 'number') scheduler.cancelRaf(id);
  };

  // ── requestIdleCallback / cancelIdleCallback ──────────────
  // No real idle-time modeling (this simulator isn't cycle-accurate) —
  // approximated as running shortly after the current work settles,
  // via the same timer/macrotask funnel every other deferred callback
  // uses.
  const requestIdleCallbackShim = (fn: unknown): number => {
    const name = (typeof fn === 'function' && (fn as { name?: string }).name) || 'anonymous';
    const label = uniqueLabel(name);
    recorder.addWebApi(label, 'idle-callback', undefined, `requestIdleCallback schedules "${name}" for whenever the browser has spare time.`);
    return scheduler.addTimer(0, label, () => {
      recorder.phase('idle-callback', `💤 Idle time — running "${name}".`);
      if (typeof fn === 'function') (fn as (...a: unknown[]) => unknown)({ didTimeout: false, timeRemaining: () => 50 });
    });
  };
  const cancelIdleCallbackShim = (id: unknown): void => {
    if (typeof id === 'number') scheduler.clearTimer(id);
  };

  // ── A single simulated DOM node ───────────────────────────
  // Real free-form user interaction can't be scripted ahead of time,
  // so this exposes one fake element with a real DOM-like API
  // (addEventListener/removeEventListener/click) — call button.click()
  // from your own code to simulate a user click deterministically.
  // Listener registrations are persistent (removed only via
  // removeEventListener, never consumed by a single click, matching
  // real DOM semantics); each click() call is its own transient
  // Web-API entry that funnels into a single macrotask running every
  // matching listener, in registration order.
  const domListeners: { type: string; handler: (...a: unknown[]) => unknown; label: string }[] = [];
  const buttonShim = {
    addEventListener: (type: unknown, handler: unknown) => {
      if (typeof type !== 'string' || typeof handler !== 'function') return;
      const label = uniqueLabel(`button.on${type}`);
      domListeners.push({ type, handler: handler as (...a: unknown[]) => unknown, label });
      recorder.addWebApi(label, 'dom-event', undefined, `button.addEventListener("${type}", ...) registers a listener — it sits in Web APIs, ready to fire on the next matching click().`, type);
    },
    removeEventListener: (type: unknown, handler: unknown) => {
      const idx = domListeners.findIndex(l => l.type === type && l.handler === handler);
      if (idx === -1) return;
      recorder.removeWebApi(domListeners[idx].label, `button.removeEventListener("${type}", ...) — listener removed from Web APIs.`);
      domListeners.splice(idx, 1);
    },
    click: () => {
      const matching = domListeners.filter(l => l.type === 'click');
      if (matching.length === 0) return;
      const label = uniqueLabel('click');
      recorder.addWebApi(label, 'dom-event', 0, 'button.click() dispatches a click event — queued as a macrotask, like any other user-interaction callback.', 'click');
      scheduler.addTimer(0, label, () => {
        for (const l of matching) l.handler();
      }, undefined, 'dom-event');
    },
  };

  // ── Node mode only: process.nextTick / setImmediate ────────
  const processShim = {
    nextTick: (fn: unknown, ...args: unknown[]) => {
      const name = (typeof fn === 'function' && (fn as { name?: string }).name) || 'anonymous';
      const label = uniqueLabel(name);
      recorder.addNextTick(label, `process.nextTick schedules "${name}" — drains before any Promise microtask, even ones already queued.`);
      scheduler.addNextTick(label, () => {
        if (typeof fn === 'function') (fn as (...a: unknown[]) => unknown)(...args);
      });
    },
  };

  const setImmediateShim = (fn: unknown, ...args: unknown[]): number => {
    const name = (typeof fn === 'function' && (fn as { name?: string }).name) || 'anonymous';
    const label = uniqueLabel(name);
    recorder.addImmediate(label, `setImmediate schedules "${name}" for the "check" phase — after the current macrotask's microtasks/nextTicks drain.`);
    return scheduler.addImmediate(label, () => {
      if (typeof fn === 'function') (fn as (...a: unknown[]) => unknown)(...args);
    });
  };
  const clearImmediateShim = (id: unknown): void => {
    if (typeof id === 'number') scheduler.clearImmediate(id);
  };

  const globals: Record<string, unknown> = {
    console: consoleShim,
    setTimeout: setTimeoutShim,
    setInterval: setIntervalShim,
    clearTimeout: clearShim,
    clearInterval: clearShim,
    queueMicrotask: queueMicrotaskShim,
    Promise: SbPromise,
    fetch: fetchShim,
    requestAnimationFrame: requestAnimationFrameShim,
    cancelAnimationFrame: cancelAnimationFrameShim,
    requestIdleCallback: requestIdleCallbackShim,
    cancelIdleCallback: cancelIdleCallbackShim,
    button: buttonShim,
    __enter,
    __exit,
    __line,
    __loopTick,
    __await,
    __runAsync,
  };

  // Node-mode-only globals. `new Function(...)` only shadows names we
  // explicitly pass as parameters — anything we DON'T pass falls
  // through to whatever the true host global happens to be (which,
  // depending on environment, might not always be `undefined`, e.g. a
  // bundler polyfill). Explicitly set these to `undefined` in browser
  // mode instead of just omitting them, so the Browser/Node toggle is
  // correct regardless of host environment quirks, not just usually
  // correct by accident.
  if (mode === 'node') {
    globals.process = processShim;
    globals.setImmediate = setImmediateShim;
    globals.clearImmediate = clearImmediateShim;
  } else {
    globals.process = undefined;
    globals.setImmediate = undefined;
    globals.clearImmediate = undefined;
  }

  return { globals, consoleLines, getUnhandledRejections };
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

  // Approximation of unhandled-rejection tracking (the real algorithm
  // is microtask-checkpoint-based; this is "still rejected with no
  // handler ever attached by the time the whole run finishes drain-
  // ing", which matches this lab's own "conceptual model" framing).
  // A promise is added here the moment it rejects, and removed the
  // moment ANY `.then`/`.catch` reaction is attached to it, whether
  // that happens immediately (already-settled case, in
  // _scheduleHandler's else branch) or later via _flush().
  const unhandledRejections = new Set<SbPromise>();

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
      unhandledRejections.add(this);
      this._flush();
    }

    private _flush(): void {
      if (this._state === 'pending') return;
      const handlers = this._handlers;
      this._handlers = [];
      for (const h of handlers) this._scheduleHandler(h);
    }

    private _scheduleHandler(h: SbHandler): void {
      // Any reaction being wired up — whether attached before this
      // promise settled (this path, via _flush) or after (the
      // immediate else-branch in __thenLabeled) — counts as "handled".
      unhandledRejections.delete(this);
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

    /** @internal — for unhandled-rejection reporting only. */
    __debugValue(): unknown {
      return this._value;
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

  return {
    SbPromise: SbPromise as typeof SbPromise & {
      __internal(): InstanceType<typeof SbPromise> & { __resolve(v: unknown): void; __reject(e: unknown): void };
    },
    getUnhandledRejections: (): unknown[] => Array.from(unhandledRejections).map(p => p.__debugValue()),
  };
}
