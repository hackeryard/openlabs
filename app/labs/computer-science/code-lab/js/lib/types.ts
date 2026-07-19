// ─── Core Types for the JS Event Loop Visualizer ──────────────────

/** A frame on the call stack */
export interface StackFrame {
  id: string;
  name: string;
  type: 'global' | 'function' | 'callback' | 'microtask' | 'promise-executor' | 'raf-callback' | 'dom-handler' | 'node-callback';
}

/** An async operation sitting in the Web APIs holding area */
export interface WebAPIItem {
  id: string;
  label: string;
  type: 'timer' | 'promise' | 'fetch' | 'raf' | 'dom-event' | 'idle-callback';
  delay?: number;
  /** Secondary text under the label, e.g. a URL or event type. */
  detail?: string;
}

/** An entry in the microtask, macrotask, rAF, or Node-mode queues */
export interface QueueEntry {
  id: string;
  label: string;
  type: 'microtask' | 'macrotask' | 'raf' | 'nexttick' | 'immediate';
}

/** Current phase of the event loop */
export type EventLoopPhase =
  | 'executing'
  | 'checking-stack'
  | 'draining-microtasks'
  | 'draining-nexttick'
  | 'picking-macrotask'
  | 'running-raf'
  | 'rendering'
  | 'idle-callback'
  | 'idle';

/** A single console output entry with source attribution */
export interface ConsoleEntry {
  text: string;
  source: 'sync' | 'microtask' | 'macrotask' | 'raf' | 'nexttick' | 'immediate' | 'dom-event' | 'unhandled-rejection';
}

/** Browser vs Node.js queue-ordering semantics (process.nextTick/setImmediate only exist in Node mode). */
export type RuntimeMode = 'browser' | 'node';

/** A single point-in-time snapshot of the entire simulated runtime */
export interface SimulationSnapshot {
  step: number;
  callStack: StackFrame[];
  webAPIs: WebAPIItem[];
  microtaskQueue: QueueEntry[];
  macrotaskQueue: QueueEntry[];
  /** requestAnimationFrame callbacks queued for the next simulated frame. */
  rafQueue: QueueEntry[];
  /** Node mode only — always empty in browser mode. */
  nextTickQueue: QueueEntry[];
  /** Node mode only — always empty in browser mode. */
  immediateQueue: QueueEntry[];
  consoleOutput: ConsoleEntry[];
  eventLoopPhase: EventLoopPhase;
  description: string;
  activeCodeLine: number; // 1-indexed line in the source code
  mode: RuntimeMode;
}

/** Groups presets in the example picker so related concepts sit together. */
export type ExampleCategory = 'fundamentals' | 'promises' | 'async-await' | 'modern-apis' | 'node-mode' | 'challenge';

export const CATEGORY_ORDER: ExampleCategory[] = ['fundamentals', 'promises', 'async-await', 'modern-apis', 'node-mode', 'challenge'];

export const CATEGORY_LABELS: Record<ExampleCategory, string> = {
  fundamentals: 'Fundamentals',
  promises: 'Promises',
  'async-await': 'Async/Await',
  'modern-apis': 'fetch, rAF & DOM',
  'node-mode': 'Node.js Mode',
  challenge: 'Challenge',
};

/** A fully-resolved example ready for the UI */
export interface Example {
  id: string;
  title: string;
  category: ExampleCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  sourceCode: string;
  snapshots: SimulationSnapshot[];
  expectedOutput: string[];
  explanation: string;
  isPredictMode?: boolean;
}
