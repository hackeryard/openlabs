// ─── Preset Example Programs ────────────────────────────────────
// Each preset defines only its source code + teaching copy. Its
// Instruction timeline, snapshots, and expectedOutput are all
// DERIVED by actually running sourceCode through the same
// runtime engine (transform → sandbox → scheduler) that free-form
// user code runs through — so presets can never drift from real
// engine behavior, and every engine change (new APIs, fixed bugs)
// automatically propagates to every preset for free.

import type { Example, ExampleCategory, RuntimeMode } from './types';
import { generateSnapshots } from './simulator';
import { executeUserCode } from './runtime/execute';

// ── Helper type ───────────────────────────────────────────────

interface ExampleDefinition {
  id: string;
  title: string;
  category: ExampleCategory;
  difficulty: Example['difficulty'];
  description: string;
  sourceCode: string;
  explanation: string;
  isPredictMode?: boolean;
  /** Browser (default) or Node.js queue-ordering semantics for this preset. */
  mode?: RuntimeMode;
}

// ══════════════════════════════════════════════════════════════
// Fundamentals
// ══════════════════════════════════════════════════════════════

const syncOnly: ExampleDefinition = {
  id: 'sync-only',
  title: 'Synchronous Code',
  category: 'fundamentals',
  difficulty: 'beginner',
  description: 'Pure synchronous execution — no queues involved.',
  sourceCode: `console.log('Hello');
console.log('World');
console.log('!');`,
  explanation: 'Synchronous code runs top-to-bottom on the Call Stack. No Web APIs or queues are involved. Each console.log is pushed, executed, and popped before the next one runs.',
};

const singleTimeout: ExampleDefinition = {
  id: 'single-timeout',
  title: 'Single setTimeout',
  category: 'fundamentals',
  difficulty: 'beginner',
  description: 'See how setTimeout defers a callback via Web APIs → Macrotask Queue.',
  sourceCode: `console.log('Start');

setTimeout(function timeout() {
    console.log('Timer done');
}, 0);

console.log('End');`,
  explanation: "Even with a 0ms delay, setTimeout's callback never runs immediately. It goes to Web APIs, then to the Macrotask Queue, and only executes after the Call Stack is empty.",
};

const singlePromise: ExampleDefinition = {
  id: 'single-promise',
  title: 'Promise .then',
  category: 'fundamentals',
  difficulty: 'beginner',
  description: 'See how .then callbacks go to the Microtask Queue.',
  sourceCode: `console.log('Start');

Promise.resolve().then(function promise1() {
    console.log('Promise');
});

console.log('End');`,
  explanation: ".then() callbacks are microtasks. They're queued immediately when the promise resolves, but they run only after the current synchronous code finishes — still before any macrotask.",
};

// ══════════════════════════════════════════════════════════════
// Promises
// ══════════════════════════════════════════════════════════════

const timeoutVsPromise: ExampleDefinition = {
  id: 'timeout-vs-promise',
  title: 'setTimeout vs Promise',
  category: 'promises',
  difficulty: 'intermediate',
  description: 'The classic "which runs first?" puzzle — and why.',
  sourceCode: `console.log('Start');

setTimeout(function timeout() {
    console.log('Timeout');
}, 0);

Promise.resolve().then(function promise1() {
    console.log('Promise');
});

console.log('End');`,
  explanation: "🔑 KEY RULE: Microtasks ALWAYS drain completely before ANY macrotask runs. Even though setTimeout was registered first, Promise's .then callback (a microtask) runs before the timeout callback (a macrotask). This is the single most important rule of the event loop.",
};

const chainedThen: ExampleDefinition = {
  id: 'chained-then',
  title: 'Chained .then()',
  category: 'promises',
  difficulty: 'intermediate',
  description: 'How promise chains queue microtasks one at a time.',
  sourceCode: `console.log('Start');

Promise.resolve()
    .then(function first() {
        console.log('First .then');
        return 'result';
    })
    .then(function second() {
        console.log('Second .then');
    });

console.log('End');`,
  explanation: "Chained .then() callbacks don't all get queued at once. Only the first .then is queued as a microtask initially. When first() runs and returns, it resolves the chain, which then queues second() as a new microtask. The microtask drain loop picks it up immediately.",
};

const timeoutInMicrotask: ExampleDefinition = {
  id: 'timeout-in-microtask',
  title: 'setTimeout inside Microtask',
  category: 'promises',
  difficulty: 'advanced',
  description: 'A macrotask created from within a microtask still waits its turn.',
  sourceCode: `console.log('Start');

Promise.resolve().then(function micro() {
    console.log('Microtask');
    setTimeout(function timer() {
        console.log('Timer from microtask');
    }, 0);
});

console.log('End');`,
  explanation: "Even when setTimeout is called from inside a microtask, the resulting callback goes to the Macrotask Queue. It doesn't get special priority — it still has to wait for the microtask drain to complete and then for the event loop to pick it up.",
};

// ══════════════════════════════════════════════════════════════
// Async/Await
// ══════════════════════════════════════════════════════════════

const asyncAwait: ExampleDefinition = {
  id: 'async-await',
  title: 'async/await',
  category: 'async-await',
  difficulty: 'intermediate',
  description: 'How await pauses a function and resumes it as a microtask.',
  sourceCode: `async function fetchData() {
    console.log('Fetching...');
    const result = await Promise.resolve('data');
    console.log('Got: ' + result);
}

console.log('Start');
fetchData();
console.log('End');`,
  explanation: "await is syntactic sugar for .then(). When fetchData hits 'await', everything after it becomes a microtask continuation. The function pauses, synchronous code continues, and the continuation runs when the microtask queue drains.",
};

// ══════════════════════════════════════════════════════════════
// fetch, rAF & DOM
// ══════════════════════════════════════════════════════════════

const fetchChain: ExampleDefinition = {
  id: 'fetch-chain',
  title: 'fetch().then().then()',
  category: 'modern-apis',
  difficulty: 'intermediate',
  description: 'A simulated fetch, plus the extra microtask hop response.json() adds.',
  sourceCode: `console.log('Fetching user...');

fetch('/api/user')
    .then(function handleResponse(response) {
        console.log('Got response, status:', response.status);
        return response.json();
    })
    .then(function handleData(data) {
        console.log('User data:', data);
    });

console.log('Request sent, continuing...');`,
  explanation: "fetch() sits in Web APIs like a timer (here, a fixed simulated latency, never a real network call). Once it resolves, handleResponse runs as a microtask — but response.json() ALSO returns a promise, adding its own microtask hop before handleData finally runs. A fetch().then(r => r.json()).then(...) chain is really two microtask hops, not one.",
};

const rafFrame: ExampleDefinition = {
  id: 'raf-frame',
  title: 'requestAnimationFrame',
  category: 'modern-apis',
  difficulty: 'intermediate',
  description: 'rAF runs after microtasks drain, once per simulated frame, before paint.',
  sourceCode: `console.log('Before frame');

requestAnimationFrame(function paintFrame() {
    console.log('Animation frame callback');
});

Promise.resolve().then(function afterMicrotask() {
    console.log('Microtask before frame');
});

console.log('After frame scheduled');`,
  explanation: "requestAnimationFrame callbacks aren't a macrotask and aren't time-based like setTimeout. They run once per simulated frame — after ALL pending microtasks drain, but before the (conceptual) paint. That's why the microtask logs before the animation frame callback, even though rAF was registered first.",
};

const domClick: ExampleDefinition = {
  id: 'dom-click',
  title: 'Simulated DOM click',
  category: 'modern-apis',
  difficulty: 'intermediate',
  description: 'A user-interaction callback is a macrotask, just like a timer.',
  sourceCode: `console.log('App start');

button.addEventListener('click', function onClick() {
    console.log('Button clicked!');
    Promise.resolve().then(function () {
        console.log('Microtask from click handler');
    });
});

button.click();

console.log('App ready');`,
  explanation: "button.click() dispatches synchronously from your code, but the registered listener doesn't run immediately — it's queued as a macrotask, exactly like a setTimeout callback. Sync code (App start, App ready) finishes first; only then does the event loop pick up the click and run the listener, whose own promise reaction adds one more microtask hop after it.",
};

// ══════════════════════════════════════════════════════════════
// Node.js Mode
// ══════════════════════════════════════════════════════════════

const nodeNextTick: ExampleDefinition = {
  id: 'node-nexttick',
  title: 'process.nextTick vs Promise',
  category: 'node-mode',
  difficulty: 'advanced',
  description: "Node's process.nextTick drains completely before ANY Promise microtask.",
  mode: 'node',
  sourceCode: `console.log('start');

Promise.resolve().then(function promiseReaction() {
    console.log('promise microtask');
});

process.nextTick(function tick1() {
    console.log('nextTick 1');
    process.nextTick(function tick2() {
        console.log('nextTick 2 (queued from inside tick1)');
    });
});

console.log('end');`,
  explanation: "This is Node-only behavior with no browser equivalent: process.nextTick has its own queue that drains FULLY before any Promise microtask runs — even nextTicks queued by other nextTicks, like tick2 here. Only once the nextTick queue is completely empty does the event loop move on to Promise microtasks.",
};

// ══════════════════════════════════════════════════════════════
// Challenge
// ══════════════════════════════════════════════════════════════

const predictMode: ExampleDefinition = {
  id: 'predict-output',
  title: '🧠 Predict the Output',
  category: 'challenge',
  difficulty: 'advanced',
  description: 'Can you predict the console output order? Type your answer before running!',
  sourceCode: `console.log('A');

setTimeout(function timer1() {
    console.log('B');
}, 0);

Promise.resolve().then(function micro1() {
    console.log('C');
}).then(function micro2() {
    console.log('D');
});

setTimeout(function timer2() {
    console.log('E');
}, 0);

console.log('F');`,
  explanation: "Output: A → F → C → D → B → E. Sync code runs first (A, F). Then ALL microtasks drain (C from micro1, then D from micro2 — the chain queues D when C's .then resolves). Only then do macrotasks run one at a time (B from timer1, E from timer2).",
  isPredictMode: true,
};

// ── Build and export examples ────────────────────────────────

const definitions: ExampleDefinition[] = [
  syncOnly,
  singleTimeout,
  singlePromise,
  timeoutVsPromise,
  chainedThen,
  timeoutInMicrotask,
  asyncAwait,
  fetchChain,
  rafFrame,
  domClick,
  nodeNextTick,
  predictMode,
];

export const EXAMPLES: Example[] = definitions.map(def => {
  const mode: RuntimeMode = def.mode ?? 'browser';
  const result = executeUserCode(def.sourceCode, { mode });
  if (result.error) {
    // A preset that fails to run through the engine is a bug in the
    // preset (or a regression in the engine) — fail loudly at import
    // time rather than silently rendering a broken/empty trace.
    throw new Error(`Preset "${def.id}" failed to execute through the runtime engine: ${result.error}`);
  }

  return {
    id: def.id,
    title: def.title,
    category: def.category,
    difficulty: def.difficulty,
    description: def.description,
    sourceCode: def.sourceCode,
    snapshots: generateSnapshots(result.instructions, mode),
    expectedOutput: result.consoleLines,
    explanation: def.explanation,
    isPredictMode: def.isPredictMode,
  };
});

export function getExampleById(id: string): Example | undefined {
  return EXAMPLES.find(e => e.id === id);
}
