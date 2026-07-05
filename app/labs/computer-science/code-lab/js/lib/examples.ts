// ─── Preset Example Programs ──────────────────────────────────
// Each example defines source code (for display) and an instruction
// list (for the simulator). Snapshots are generated at import time.

import type { Example } from './types';
import type { Instruction } from './simulator';
import { generateSnapshots } from './simulator';

// ── Helper type ───────────────────────────────────────────────

interface ExampleDefinition {
  id: string;
  title: string;
  difficulty: Example['difficulty'];
  description: string;
  sourceCode: string;
  instructions: Instruction[];
  expectedOutput: string[];
  explanation: string;
  isPredictMode?: boolean;
}

// ══════════════════════════════════════════════════════════════
// Example 1: Sync Only
// ══════════════════════════════════════════════════════════════

const syncOnly: ExampleDefinition = {
  id: 'sync-only',
  title: '1. Synchronous Code',
  difficulty: 'beginner',
  description: 'Pure synchronous execution — no queues involved.',
  sourceCode: `console.log('Hello');
console.log('World');
console.log('!');`,
  expectedOutput: ['Hello', 'World', '!'],
  explanation: 'Synchronous code runs top-to-bottom on the Call Stack. No Web APIs or queues are involved. Each console.log is pushed, executed, and popped before the next one runs.',
  instructions: [
    { type: 'PUSH_STACK', name: 'global()', frameType: 'global', codeLine: 1, description: 'Script starts — global execution context pushed onto the Call Stack.' },
    { type: 'SET_PHASE', phase: 'executing', codeLine: 1, description: 'Engine begins executing the script line by line.' },
    { type: 'PUSH_STACK', name: "console.log('Hello')", frameType: 'function', codeLine: 1, description: "console.log('Hello') is called — pushed onto the Call Stack." },
    { type: 'LOG', message: 'Hello', source: 'sync', codeLine: 1, description: "Outputs 'Hello' to the console." },
    { type: 'POP_STACK', codeLine: 1, description: 'console.log returns — popped from the Call Stack.' },
    { type: 'PUSH_STACK', name: "console.log('World')", frameType: 'function', codeLine: 2, description: "console.log('World') is called." },
    { type: 'LOG', message: 'World', source: 'sync', codeLine: 2, description: "Outputs 'World' to the console." },
    { type: 'POP_STACK', codeLine: 2, description: 'console.log returns — popped from the Call Stack.' },
    { type: 'PUSH_STACK', name: "console.log('!')", frameType: 'function', codeLine: 3, description: "console.log('!') is called." },
    { type: 'LOG', message: '!', source: 'sync', codeLine: 3, description: "Outputs '!' to the console." },
    { type: 'POP_STACK', codeLine: 3, description: 'console.log returns — popped from the Call Stack.' },
    { type: 'POP_STACK', codeLine: 3, description: 'Script finished — global context popped.' },
    { type: 'SET_PHASE', phase: 'idle', codeLine: 3, description: '✅ All done! No async operations were used — everything ran synchronously on the Call Stack.' },
  ],
};

// ══════════════════════════════════════════════════════════════
// Example 2: Single setTimeout
// ══════════════════════════════════════════════════════════════

const singleTimeout: ExampleDefinition = {
  id: 'single-timeout',
  title: '2. Single setTimeout',
  difficulty: 'beginner',
  description: 'See how setTimeout defers a callback via Web APIs → Macrotask Queue.',
  sourceCode: `console.log('Start');

setTimeout(function timeout() {
    console.log('Timer done');
}, 0);

console.log('End');`,
  expectedOutput: ['Start', 'End', 'Timer done'],
  explanation: "Even with a 0ms delay, setTimeout's callback never runs immediately. It goes to Web APIs, then to the Macrotask Queue, and only executes after the Call Stack is empty.",
  instructions: [
    { type: 'PUSH_STACK', name: 'global()', frameType: 'global', codeLine: 1, description: 'Script starts — global context pushed.' },
    { type: 'SET_PHASE', phase: 'executing', codeLine: 1, description: 'Engine begins executing synchronous code.' },
    { type: 'PUSH_STACK', name: "console.log('Start')", frameType: 'function', codeLine: 1, description: "console.log('Start') is called." },
    { type: 'LOG', message: 'Start', source: 'sync', codeLine: 1, description: "Outputs 'Start' to the console." },
    { type: 'POP_STACK', codeLine: 1, description: 'console.log returns.' },
    { type: 'PUSH_STACK', name: 'setTimeout(timeout, 0)', frameType: 'function', codeLine: 3, description: 'setTimeout is called — this is a Web API, not part of JS itself.' },
    { type: 'ADD_WEB_API', label: 'setTimeout(timeout, 0)', apiType: 'timer', delay: 0, codeLine: 3, description: 'Timer registered in Web APIs. The callback waits here even though delay is 0ms.' },
    { type: 'POP_STACK', codeLine: 3, description: 'setTimeout returns immediately — it just registered the timer.' },
    { type: 'REMOVE_WEB_API', label: 'setTimeout(timeout, 0)', codeLine: 3, description: 'Timer completes (0ms delay) — callback moves out of Web APIs.' },
    { type: 'ADD_MACROTASK', label: 'timeout', codeLine: 3, description: "Callback 'timeout' added to the Macrotask Queue. It must wait for the stack to clear." },
    { type: 'PUSH_STACK', name: "console.log('End')", frameType: 'function', codeLine: 7, description: "console.log('End') is called — still in the synchronous phase." },
    { type: 'LOG', message: 'End', source: 'sync', codeLine: 7, description: "Outputs 'End' to the console." },
    { type: 'POP_STACK', codeLine: 7, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 7, description: 'Script finished — global context popped. Call Stack is now empty.' },
    { type: 'SET_PHASE', phase: 'checking-stack', codeLine: 7, description: '🔄 Event Loop: Is the Call Stack empty? YES.' },
    { type: 'SET_PHASE', phase: 'picking-macrotask', codeLine: 7, description: '📋 No microtasks. Taking one macrotask from the queue.' },
    { type: 'REMOVE_MACROTASK', label: 'timeout', codeLine: 3, description: "Callback 'timeout' removed from Macrotask Queue." },
    { type: 'PUSH_STACK', name: 'timeout()', frameType: 'callback', codeLine: 3, description: "Callback 'timeout' pushed onto the Call Stack for execution." },
    { type: 'PUSH_STACK', name: "console.log('Timer done')", frameType: 'function', codeLine: 4, description: "Inside timeout: console.log('Timer done') is called." },
    { type: 'LOG', message: 'Timer done', source: 'macrotask', codeLine: 4, description: "Outputs 'Timer done' to the console." },
    { type: 'POP_STACK', codeLine: 4, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 3, description: 'timeout callback finished — popped from stack.' },
    { type: 'SET_PHASE', phase: 'idle', codeLine: 7, description: "✅ All done! Notice 'Timer done' printed last, even with a 0ms delay." },
  ],
};

// ══════════════════════════════════════════════════════════════
// Example 3: Single Promise .then
// ══════════════════════════════════════════════════════════════

const singlePromise: ExampleDefinition = {
  id: 'single-promise',
  title: '3. Promise .then',
  difficulty: 'beginner',
  description: 'See how .then callbacks go to the Microtask Queue.',
  sourceCode: `console.log('Start');

Promise.resolve().then(function promise1() {
    console.log('Promise');
});

console.log('End');`,
  expectedOutput: ['Start', 'End', 'Promise'],
  explanation: ".then() callbacks are microtasks. They're queued immediately when the promise resolves, but they run only after the current synchronous code finishes — still before any macrotask.",
  instructions: [
    { type: 'PUSH_STACK', name: 'global()', frameType: 'global', codeLine: 1, description: 'Script starts — global context pushed.' },
    { type: 'SET_PHASE', phase: 'executing', codeLine: 1, description: 'Engine begins executing synchronous code.' },
    { type: 'PUSH_STACK', name: "console.log('Start')", frameType: 'function', codeLine: 1, description: "console.log('Start') is called." },
    { type: 'LOG', message: 'Start', source: 'sync', codeLine: 1, description: "Outputs 'Start' to the console." },
    { type: 'POP_STACK', codeLine: 1, description: 'console.log returns.' },
    { type: 'PUSH_STACK', name: 'Promise.resolve()', frameType: 'function', codeLine: 3, description: 'Promise.resolve() creates an already-resolved promise.' },
    { type: 'POP_STACK', codeLine: 3, description: 'Promise.resolve() returns the resolved promise.' },
    { type: 'PUSH_STACK', name: '.then(promise1)', frameType: 'function', codeLine: 3, description: '.then() is called on the resolved promise.' },
    { type: 'ADD_MICROTASK', label: 'promise1', codeLine: 3, description: "Since the promise is already resolved, 'promise1' callback is immediately queued as a microtask." },
    { type: 'POP_STACK', codeLine: 3, description: '.then() returns — callback is queued, not executed yet.' },
    { type: 'PUSH_STACK', name: "console.log('End')", frameType: 'function', codeLine: 7, description: "console.log('End') is called — synchronous code continues." },
    { type: 'LOG', message: 'End', source: 'sync', codeLine: 7, description: "Outputs 'End' to the console." },
    { type: 'POP_STACK', codeLine: 7, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 7, description: 'Script finished — global context popped.' },
    { type: 'SET_PHASE', phase: 'checking-stack', codeLine: 7, description: '🔄 Event Loop: Is the Call Stack empty? YES.' },
    { type: 'SET_PHASE', phase: 'draining-microtasks', codeLine: 7, description: '⚡ Microtask Queue is non-empty — draining all microtasks now!' },
    { type: 'REMOVE_MICROTASK', label: 'promise1', codeLine: 3, description: "'promise1' removed from Microtask Queue." },
    { type: 'PUSH_STACK', name: 'promise1()', frameType: 'microtask', codeLine: 3, description: "'promise1' callback pushed onto the Call Stack." },
    { type: 'PUSH_STACK', name: "console.log('Promise')", frameType: 'function', codeLine: 4, description: "Inside promise1: console.log('Promise') is called." },
    { type: 'LOG', message: 'Promise', source: 'microtask', codeLine: 4, description: "Outputs 'Promise' to the console." },
    { type: 'POP_STACK', codeLine: 4, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 3, description: 'promise1 callback finished — popped from stack.' },
    { type: 'SET_PHASE', phase: 'idle', codeLine: 7, description: "✅ All done! 'Promise' printed after 'End' because microtasks run after synchronous code." },
  ],
};

// ══════════════════════════════════════════════════════════════
// Example 4: setTimeout vs Promise (THE CLASSIC GOTCHA)
// ══════════════════════════════════════════════════════════════

const timeoutVsPromise: ExampleDefinition = {
  id: 'timeout-vs-promise',
  title: '4. setTimeout vs Promise',
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
  expectedOutput: ['Start', 'End', 'Promise', 'Timeout'],
  explanation: "🔑 KEY RULE: Microtasks ALWAYS drain completely before ANY macrotask runs. Even though setTimeout was registered first, Promise's .then callback (a microtask) runs before the timeout callback (a macrotask). This is the single most important rule of the event loop.",
  instructions: [
    { type: 'PUSH_STACK', name: 'global()', frameType: 'global', codeLine: 1, description: 'Script starts — global context pushed.' },
    { type: 'SET_PHASE', phase: 'executing', codeLine: 1, description: 'Engine begins executing synchronous code.' },
    { type: 'PUSH_STACK', name: "console.log('Start')", frameType: 'function', codeLine: 1, description: "console.log('Start') is called." },
    { type: 'LOG', message: 'Start', source: 'sync', codeLine: 1, description: "Outputs 'Start' to the console." },
    { type: 'POP_STACK', codeLine: 1, description: 'console.log returns.' },
    { type: 'PUSH_STACK', name: 'setTimeout(timeout, 0)', frameType: 'function', codeLine: 3, description: 'setTimeout is called.' },
    { type: 'ADD_WEB_API', label: 'setTimeout(timeout, 0)', apiType: 'timer', delay: 0, codeLine: 3, description: 'Timer registered in Web APIs.' },
    { type: 'POP_STACK', codeLine: 3, description: 'setTimeout returns.' },
    { type: 'REMOVE_WEB_API', label: 'setTimeout(timeout, 0)', codeLine: 3, description: 'Timer completes immediately (0ms).' },
    { type: 'ADD_MACROTASK', label: 'timeout', codeLine: 3, description: "Callback 'timeout' added to the Macrotask Queue. ⚠️ It was queued first!" },
    { type: 'PUSH_STACK', name: 'Promise.resolve()', frameType: 'function', codeLine: 7, description: 'Promise.resolve() creates a resolved promise.' },
    { type: 'POP_STACK', codeLine: 7, description: 'Promise.resolve() returns.' },
    { type: 'PUSH_STACK', name: '.then(promise1)', frameType: 'function', codeLine: 7, description: '.then() is called on the resolved promise.' },
    { type: 'ADD_MICROTASK', label: 'promise1', codeLine: 7, description: "'promise1' callback queued as a microtask. Queued second, but will run FIRST!" },
    { type: 'POP_STACK', codeLine: 7, description: '.then() returns.' },
    { type: 'PUSH_STACK', name: "console.log('End')", frameType: 'function', codeLine: 11, description: "console.log('End') is called." },
    { type: 'LOG', message: 'End', source: 'sync', codeLine: 11, description: "Outputs 'End' to the console." },
    { type: 'POP_STACK', codeLine: 11, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 11, description: 'Script finished — global context popped. Call Stack is now empty.' },
    { type: 'SET_PHASE', phase: 'checking-stack', codeLine: 11, description: '🔄 Event Loop: Call Stack is empty. Checking queues...' },
    { type: 'SET_PHASE', phase: 'draining-microtasks', codeLine: 11, description: '⚡ MICROTASK QUEUE IS NON-EMPTY → Must drain ALL microtasks before any macrotask!' },
    { type: 'REMOVE_MICROTASK', label: 'promise1', codeLine: 7, description: "'promise1' removed from Microtask Queue." },
    { type: 'PUSH_STACK', name: 'promise1()', frameType: 'microtask', codeLine: 7, description: "'promise1' callback pushed onto the Call Stack." },
    { type: 'PUSH_STACK', name: "console.log('Promise')", frameType: 'function', codeLine: 8, description: "console.log('Promise') is called." },
    { type: 'LOG', message: 'Promise', source: 'microtask', codeLine: 8, description: "Outputs 'Promise' to the console. This runs BEFORE 'Timeout'!" },
    { type: 'POP_STACK', codeLine: 8, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 7, description: 'promise1 callback finished.' },
    { type: 'SET_PHASE', phase: 'checking-stack', codeLine: 11, description: '🔄 Microtask queue now empty. Checking macrotask queue...' },
    { type: 'SET_PHASE', phase: 'picking-macrotask', codeLine: 11, description: '📋 Taking one macrotask from the queue.' },
    { type: 'REMOVE_MACROTASK', label: 'timeout', codeLine: 3, description: "'timeout' removed from Macrotask Queue." },
    { type: 'PUSH_STACK', name: 'timeout()', frameType: 'callback', codeLine: 3, description: "'timeout' callback pushed onto the Call Stack." },
    { type: 'PUSH_STACK', name: "console.log('Timeout')", frameType: 'function', codeLine: 4, description: "console.log('Timeout') is called." },
    { type: 'LOG', message: 'Timeout', source: 'macrotask', codeLine: 4, description: "Outputs 'Timeout' to the console — runs last despite being queued first!" },
    { type: 'POP_STACK', codeLine: 4, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 3, description: 'timeout callback finished.' },
    { type: 'SET_PHASE', phase: 'idle', codeLine: 11, description: "✅ Done! Output order: Start → End → Promise → Timeout. Microtasks always win!" },
  ],
};

// ══════════════════════════════════════════════════════════════
// Example 5: Chained .then()
// ══════════════════════════════════════════════════════════════

const chainedThen: ExampleDefinition = {
  id: 'chained-then',
  title: '5. Chained .then()',
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
  expectedOutput: ['Start', 'End', 'First .then', 'Second .then'],
  explanation: "Chained .then() callbacks don't all get queued at once. Only the first .then is queued as a microtask initially. When first() runs and returns, it resolves the chain, which then queues second() as a new microtask. The microtask drain loop picks it up immediately.",
  instructions: [
    { type: 'PUSH_STACK', name: 'global()', frameType: 'global', codeLine: 1, description: 'Script starts.' },
    { type: 'SET_PHASE', phase: 'executing', codeLine: 1, description: 'Executing synchronous code.' },
    { type: 'PUSH_STACK', name: "console.log('Start')", frameType: 'function', codeLine: 1, description: "console.log('Start') is called." },
    { type: 'LOG', message: 'Start', source: 'sync', codeLine: 1, description: "Outputs 'Start'." },
    { type: 'POP_STACK', codeLine: 1, description: 'console.log returns.' },
    { type: 'PUSH_STACK', name: 'Promise.resolve()', frameType: 'function', codeLine: 3, description: 'Creates a resolved promise.' },
    { type: 'POP_STACK', codeLine: 3, description: 'Promise.resolve() returns.' },
    { type: 'PUSH_STACK', name: '.then(first)', frameType: 'function', codeLine: 4, description: '.then(first) called on resolved promise.' },
    { type: 'ADD_MICROTASK', label: 'first', codeLine: 4, description: "'first' callback queued as microtask." },
    { type: 'POP_STACK', codeLine: 4, description: '.then() returns a new (pending) promise for the chain.' },
    { type: 'PUSH_STACK', name: '.then(second)', frameType: 'function', codeLine: 8, description: ".then(second) called on the chained promise — but this promise is NOT yet resolved." },
    { type: 'POP_STACK', codeLine: 8, description: ".then(second) registered — second won't be queued until first() resolves the chain." },
    { type: 'PUSH_STACK', name: "console.log('End')", frameType: 'function', codeLine: 12, description: "console.log('End') is called." },
    { type: 'LOG', message: 'End', source: 'sync', codeLine: 12, description: "Outputs 'End'." },
    { type: 'POP_STACK', codeLine: 12, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 12, description: 'Script finished — global context popped.' },
    { type: 'SET_PHASE', phase: 'checking-stack', codeLine: 12, description: '🔄 Event Loop: Call Stack empty. Checking queues...' },
    { type: 'SET_PHASE', phase: 'draining-microtasks', codeLine: 12, description: '⚡ Draining microtask queue.' },
    { type: 'REMOVE_MICROTASK', label: 'first', codeLine: 4, description: "'first' removed from Microtask Queue." },
    { type: 'PUSH_STACK', name: 'first()', frameType: 'microtask', codeLine: 4, description: "'first' callback executing." },
    { type: 'PUSH_STACK', name: "console.log('First .then')", frameType: 'function', codeLine: 5, description: "console.log('First .then') is called." },
    { type: 'LOG', message: 'First .then', source: 'microtask', codeLine: 5, description: "Outputs 'First .then'." },
    { type: 'POP_STACK', codeLine: 5, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 4, description: "first() returns 'result' — this resolves the chained promise." },
    { type: 'ADD_MICROTASK', label: 'second', codeLine: 8, description: "Chain resolved! 'second' callback is now queued as a microtask." },
    { type: 'SET_PHASE', phase: 'draining-microtasks', codeLine: 12, description: '⚡ More microtasks! Keep draining — must finish ALL before any macrotask.' },
    { type: 'REMOVE_MICROTASK', label: 'second', codeLine: 8, description: "'second' removed from Microtask Queue." },
    { type: 'PUSH_STACK', name: 'second()', frameType: 'microtask', codeLine: 8, description: "'second' callback executing." },
    { type: 'PUSH_STACK', name: "console.log('Second .then')", frameType: 'function', codeLine: 9, description: "console.log('Second .then') is called." },
    { type: 'LOG', message: 'Second .then', source: 'microtask', codeLine: 9, description: "Outputs 'Second .then'." },
    { type: 'POP_STACK', codeLine: 9, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 8, description: 'second() finished.' },
    { type: 'SET_PHASE', phase: 'idle', codeLine: 12, description: '✅ Done! Each .then() runs and can queue the next one. The microtask drain loop catches them all.' },
  ],
};

// ══════════════════════════════════════════════════════════════
// Example 6: async/await
// ══════════════════════════════════════════════════════════════

const asyncAwait: ExampleDefinition = {
  id: 'async-await',
  title: '6. async/await',
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
  expectedOutput: ['Start', 'Fetching...', 'End', 'Got: data'],
  explanation: "await is syntactic sugar for .then(). When fetchData hits 'await', everything after it becomes a microtask continuation. The function pauses, synchronous code continues, and the continuation runs when the microtask queue drains.",
  instructions: [
    { type: 'PUSH_STACK', name: 'global()', frameType: 'global', codeLine: 7, description: 'Script starts. Function fetchData is declared (hoisted).' },
    { type: 'SET_PHASE', phase: 'executing', codeLine: 7, description: 'Executing synchronous code.' },
    { type: 'PUSH_STACK', name: "console.log('Start')", frameType: 'function', codeLine: 7, description: "console.log('Start') is called." },
    { type: 'LOG', message: 'Start', source: 'sync', codeLine: 7, description: "Outputs 'Start'." },
    { type: 'POP_STACK', codeLine: 7, description: 'console.log returns.' },
    { type: 'PUSH_STACK', name: 'fetchData()', frameType: 'function', codeLine: 8, description: 'fetchData() is called — it\'s async but starts executing synchronously.' },
    { type: 'PUSH_STACK', name: "console.log('Fetching...')", frameType: 'function', codeLine: 2, description: "Inside fetchData: console.log('Fetching...') runs synchronously." },
    { type: 'LOG', message: 'Fetching...', source: 'sync', codeLine: 2, description: "Outputs 'Fetching...' — this runs immediately, not deferred!" },
    { type: 'POP_STACK', codeLine: 2, description: 'console.log returns.' },
    { type: 'PUSH_STACK', name: "await Promise.resolve('data')", frameType: 'function', codeLine: 3, description: "await encountered! Everything after this line becomes a microtask." },
    { type: 'ADD_MICROTASK', label: 'fetchData continuation', codeLine: 3, description: "The rest of fetchData (after await) is queued as a microtask continuation." },
    { type: 'POP_STACK', codeLine: 3, description: 'await pauses fetchData.' },
    { type: 'POP_STACK', codeLine: 8, description: 'fetchData suspends — control returns to the caller.' },
    { type: 'PUSH_STACK', name: "console.log('End')", frameType: 'function', codeLine: 9, description: "Back in global scope: console.log('End') is called." },
    { type: 'LOG', message: 'End', source: 'sync', codeLine: 9, description: "Outputs 'End'." },
    { type: 'POP_STACK', codeLine: 9, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 9, description: 'Global script finished.' },
    { type: 'SET_PHASE', phase: 'checking-stack', codeLine: 9, description: '🔄 Event Loop: Call Stack empty. Checking queues...' },
    { type: 'SET_PHASE', phase: 'draining-microtasks', codeLine: 9, description: '⚡ Draining microtask queue — fetchData continuation is waiting.' },
    { type: 'REMOVE_MICROTASK', label: 'fetchData continuation', codeLine: 3, description: 'fetchData continuation removed from Microtask Queue.' },
    { type: 'PUSH_STACK', name: 'fetchData() (resumed)', frameType: 'microtask', codeLine: 3, description: "fetchData resumes — result = 'data'." },
    { type: 'PUSH_STACK', name: "console.log('Got: data')", frameType: 'function', codeLine: 4, description: "console.log('Got: data') is called." },
    { type: 'LOG', message: 'Got: data', source: 'microtask', codeLine: 4, description: "Outputs 'Got: data'." },
    { type: 'POP_STACK', codeLine: 4, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 1, description: 'fetchData completes.' },
    { type: 'SET_PHASE', phase: 'idle', codeLine: 9, description: "✅ Done! Code before 'await' runs synchronously; code after 'await' runs as a microtask." },
  ],
};

// ══════════════════════════════════════════════════════════════
// Example 7: setTimeout inside a Microtask
// ══════════════════════════════════════════════════════════════

const timeoutInMicrotask: ExampleDefinition = {
  id: 'timeout-in-microtask',
  title: '7. setTimeout inside Microtask',
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
  expectedOutput: ['Start', 'End', 'Microtask', 'Timer from microtask'],
  explanation: "Even when setTimeout is called from inside a microtask, the resulting callback goes to the Macrotask Queue. It doesn't get special priority — it still has to wait for the microtask drain to complete and then for the event loop to pick it up.",
  instructions: [
    { type: 'PUSH_STACK', name: 'global()', frameType: 'global', codeLine: 1, description: 'Script starts.' },
    { type: 'SET_PHASE', phase: 'executing', codeLine: 1, description: 'Executing synchronous code.' },
    { type: 'PUSH_STACK', name: "console.log('Start')", frameType: 'function', codeLine: 1, description: "console.log('Start') is called." },
    { type: 'LOG', message: 'Start', source: 'sync', codeLine: 1, description: "Outputs 'Start'." },
    { type: 'POP_STACK', codeLine: 1, description: 'console.log returns.' },
    { type: 'PUSH_STACK', name: 'Promise.resolve()', frameType: 'function', codeLine: 3, description: 'Creates a resolved promise.' },
    { type: 'POP_STACK', codeLine: 3, description: 'Promise.resolve() returns.' },
    { type: 'PUSH_STACK', name: '.then(micro)', frameType: 'function', codeLine: 3, description: '.then(micro) called on resolved promise.' },
    { type: 'ADD_MICROTASK', label: 'micro', codeLine: 3, description: "'micro' callback queued as microtask." },
    { type: 'POP_STACK', codeLine: 3, description: '.then() returns.' },
    { type: 'PUSH_STACK', name: "console.log('End')", frameType: 'function', codeLine: 10, description: "console.log('End') is called." },
    { type: 'LOG', message: 'End', source: 'sync', codeLine: 10, description: "Outputs 'End'." },
    { type: 'POP_STACK', codeLine: 10, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 10, description: 'Global script finished.' },
    { type: 'SET_PHASE', phase: 'checking-stack', codeLine: 10, description: '🔄 Event Loop: Call Stack empty.' },
    { type: 'SET_PHASE', phase: 'draining-microtasks', codeLine: 10, description: '⚡ Draining microtask queue.' },
    { type: 'REMOVE_MICROTASK', label: 'micro', codeLine: 3, description: "'micro' removed from Microtask Queue." },
    { type: 'PUSH_STACK', name: 'micro()', frameType: 'microtask', codeLine: 3, description: "'micro' callback executing." },
    { type: 'PUSH_STACK', name: "console.log('Microtask')", frameType: 'function', codeLine: 4, description: "console.log('Microtask') is called." },
    { type: 'LOG', message: 'Microtask', source: 'microtask', codeLine: 4, description: "Outputs 'Microtask'." },
    { type: 'POP_STACK', codeLine: 4, description: 'console.log returns.' },
    { type: 'PUSH_STACK', name: 'setTimeout(timer, 0)', frameType: 'function', codeLine: 5, description: 'setTimeout called from inside a microtask — the callback goes to Macrotask Queue, not Microtask!' },
    { type: 'ADD_WEB_API', label: 'setTimeout(timer, 0)', apiType: 'timer', delay: 0, codeLine: 5, description: 'Timer registered in Web APIs.' },
    { type: 'POP_STACK', codeLine: 5, description: 'setTimeout returns.' },
    { type: 'REMOVE_WEB_API', label: 'setTimeout(timer, 0)', codeLine: 5, description: 'Timer completes (0ms).' },
    { type: 'ADD_MACROTASK', label: 'timer', codeLine: 5, description: "'timer' callback added to Macrotask Queue — must wait for microtask drain to finish AND next event loop tick." },
    { type: 'POP_STACK', codeLine: 3, description: 'micro() callback finished.' },
    { type: 'SET_PHASE', phase: 'checking-stack', codeLine: 10, description: '🔄 Microtask queue empty now. Checking macrotask queue...' },
    { type: 'SET_PHASE', phase: 'picking-macrotask', codeLine: 10, description: '📋 Taking one macrotask from the queue.' },
    { type: 'REMOVE_MACROTASK', label: 'timer', codeLine: 5, description: "'timer' removed from Macrotask Queue." },
    { type: 'PUSH_STACK', name: 'timer()', frameType: 'callback', codeLine: 5, description: "'timer' callback pushed onto the Call Stack." },
    { type: 'PUSH_STACK', name: "console.log('Timer from microtask')", frameType: 'function', codeLine: 6, description: "console.log('Timer from microtask') is called." },
    { type: 'LOG', message: 'Timer from microtask', source: 'macrotask', codeLine: 6, description: "Outputs 'Timer from microtask'." },
    { type: 'POP_STACK', codeLine: 6, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 5, description: 'timer callback finished.' },
    { type: 'SET_PHASE', phase: 'idle', codeLine: 10, description: '✅ Done! setTimeout from a microtask still goes to the Macrotask Queue — no shortcuts.' },
  ],
};

// ══════════════════════════════════════════════════════════════
// Example 8: Predict the Output (uses Example 4's code)
// ══════════════════════════════════════════════════════════════

const predictMode: ExampleDefinition = {
  id: 'predict-output',
  title: '8. 🧠 Predict the Output',
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
  expectedOutput: ['A', 'F', 'C', 'D', 'B', 'E'],
  explanation: "Output: A → F → C → D → B → E. Sync code runs first (A, F). Then ALL microtasks drain (C from micro1, then D from micro2 — the chain queues D when C's .then resolves). Only then do macrotasks run one at a time (B from timer1, E from timer2).",
  isPredictMode: true,
  instructions: [
    { type: 'PUSH_STACK', name: 'global()', frameType: 'global', codeLine: 1, description: 'Script starts.' },
    { type: 'SET_PHASE', phase: 'executing', codeLine: 1, description: 'Executing synchronous code.' },
    { type: 'PUSH_STACK', name: "console.log('A')", frameType: 'function', codeLine: 1, description: "console.log('A') is called." },
    { type: 'LOG', message: 'A', source: 'sync', codeLine: 1, description: "Outputs 'A'." },
    { type: 'POP_STACK', codeLine: 1, description: 'console.log returns.' },
    { type: 'PUSH_STACK', name: 'setTimeout(timer1, 0)', frameType: 'function', codeLine: 3, description: 'setTimeout(timer1, 0) called.' },
    { type: 'ADD_WEB_API', label: 'setTimeout(timer1, 0)', apiType: 'timer', delay: 0, codeLine: 3, description: 'Timer1 registered in Web APIs.' },
    { type: 'POP_STACK', codeLine: 3, description: 'setTimeout returns.' },
    { type: 'REMOVE_WEB_API', label: 'setTimeout(timer1, 0)', codeLine: 3, description: 'Timer1 completes (0ms).' },
    { type: 'ADD_MACROTASK', label: 'timer1', codeLine: 3, description: "'timer1' added to Macrotask Queue." },
    { type: 'PUSH_STACK', name: 'Promise.resolve()', frameType: 'function', codeLine: 7, description: 'Promise.resolve() creates resolved promise.' },
    { type: 'POP_STACK', codeLine: 7, description: 'Promise.resolve() returns.' },
    { type: 'PUSH_STACK', name: '.then(micro1)', frameType: 'function', codeLine: 7, description: '.then(micro1) called.' },
    { type: 'ADD_MICROTASK', label: 'micro1', codeLine: 7, description: "'micro1' queued as microtask." },
    { type: 'POP_STACK', codeLine: 7, description: '.then() returns pending promise.' },
    { type: 'PUSH_STACK', name: '.then(micro2)', frameType: 'function', codeLine: 9, description: '.then(micro2) registered on chained promise.' },
    { type: 'POP_STACK', codeLine: 9, description: '.then() returns — micro2 waits for micro1 to resolve.' },
    { type: 'PUSH_STACK', name: 'setTimeout(timer2, 0)', frameType: 'function', codeLine: 12, description: 'setTimeout(timer2, 0) called.' },
    { type: 'ADD_WEB_API', label: 'setTimeout(timer2, 0)', apiType: 'timer', delay: 0, codeLine: 12, description: 'Timer2 registered in Web APIs.' },
    { type: 'POP_STACK', codeLine: 12, description: 'setTimeout returns.' },
    { type: 'REMOVE_WEB_API', label: 'setTimeout(timer2, 0)', codeLine: 12, description: 'Timer2 completes (0ms).' },
    { type: 'ADD_MACROTASK', label: 'timer2', codeLine: 12, description: "'timer2' added to Macrotask Queue (after timer1)." },
    { type: 'PUSH_STACK', name: "console.log('F')", frameType: 'function', codeLine: 16, description: "console.log('F') is called." },
    { type: 'LOG', message: 'F', source: 'sync', codeLine: 16, description: "Outputs 'F'." },
    { type: 'POP_STACK', codeLine: 16, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 16, description: 'Global script finished.' },
    { type: 'SET_PHASE', phase: 'checking-stack', codeLine: 16, description: '🔄 Event Loop: Call Stack empty. Queues: 1 microtask, 2 macrotasks.' },
    { type: 'SET_PHASE', phase: 'draining-microtasks', codeLine: 16, description: '⚡ Microtasks first! Draining micro1.' },
    { type: 'REMOVE_MICROTASK', label: 'micro1', codeLine: 7, description: "'micro1' removed from Microtask Queue." },
    { type: 'PUSH_STACK', name: 'micro1()', frameType: 'microtask', codeLine: 7, description: "'micro1' executing." },
    { type: 'PUSH_STACK', name: "console.log('C')", frameType: 'function', codeLine: 8, description: "console.log('C') is called." },
    { type: 'LOG', message: 'C', source: 'microtask', codeLine: 8, description: "Outputs 'C'." },
    { type: 'POP_STACK', codeLine: 8, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 7, description: 'micro1 returns — chained promise resolves.' },
    { type: 'ADD_MICROTASK', label: 'micro2', codeLine: 9, description: "Chain resolved → 'micro2' now queued as microtask." },
    { type: 'SET_PHASE', phase: 'draining-microtasks', codeLine: 16, description: '⚡ More microtasks! Draining micro2 before touching macrotasks.' },
    { type: 'REMOVE_MICROTASK', label: 'micro2', codeLine: 9, description: "'micro2' removed from Microtask Queue." },
    { type: 'PUSH_STACK', name: 'micro2()', frameType: 'microtask', codeLine: 9, description: "'micro2' executing." },
    { type: 'PUSH_STACK', name: "console.log('D')", frameType: 'function', codeLine: 10, description: "console.log('D') is called." },
    { type: 'LOG', message: 'D', source: 'microtask', codeLine: 10, description: "Outputs 'D'." },
    { type: 'POP_STACK', codeLine: 10, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 9, description: 'micro2 finished.' },
    { type: 'SET_PHASE', phase: 'checking-stack', codeLine: 16, description: '🔄 All microtasks drained. Now checking macrotask queue...' },
    { type: 'SET_PHASE', phase: 'picking-macrotask', codeLine: 16, description: '📋 Taking timer1 from macrotask queue.' },
    { type: 'REMOVE_MACROTASK', label: 'timer1', codeLine: 3, description: "'timer1' removed from Macrotask Queue." },
    { type: 'PUSH_STACK', name: 'timer1()', frameType: 'callback', codeLine: 3, description: "'timer1' callback executing." },
    { type: 'PUSH_STACK', name: "console.log('B')", frameType: 'function', codeLine: 4, description: "console.log('B') is called." },
    { type: 'LOG', message: 'B', source: 'macrotask', codeLine: 4, description: "Outputs 'B'." },
    { type: 'POP_STACK', codeLine: 4, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 3, description: 'timer1 finished.' },
    { type: 'SET_PHASE', phase: 'checking-stack', codeLine: 16, description: '🔄 One macrotask done. Check for microtasks (none), then next macrotask.' },
    { type: 'SET_PHASE', phase: 'picking-macrotask', codeLine: 16, description: '📋 Taking timer2 from macrotask queue.' },
    { type: 'REMOVE_MACROTASK', label: 'timer2', codeLine: 12, description: "'timer2' removed from Macrotask Queue." },
    { type: 'PUSH_STACK', name: 'timer2()', frameType: 'callback', codeLine: 12, description: "'timer2' callback executing." },
    { type: 'PUSH_STACK', name: "console.log('E')", frameType: 'function', codeLine: 13, description: "console.log('E') is called." },
    { type: 'LOG', message: 'E', source: 'macrotask', codeLine: 13, description: "Outputs 'E'." },
    { type: 'POP_STACK', codeLine: 13, description: 'console.log returns.' },
    { type: 'POP_STACK', codeLine: 12, description: 'timer2 finished.' },
    { type: 'SET_PHASE', phase: 'idle', codeLine: 16, description: '✅ Final order: A → F → C → D → B → E. Sync first, then all microtasks (including chained ones), then macrotasks one by one.' },
  ],
};

// ── Build and export examples ────────────────────────────────

const definitions: ExampleDefinition[] = [
  syncOnly,
  singleTimeout,
  singlePromise,
  timeoutVsPromise,
  chainedThen,
  asyncAwait,
  timeoutInMicrotask,
  predictMode,
];

export const EXAMPLES: Example[] = definitions.map(def => ({
  id: def.id,
  title: def.title,
  difficulty: def.difficulty,
  description: def.description,
  sourceCode: def.sourceCode,
  snapshots: generateSnapshots(def.instructions),
  expectedOutput: def.expectedOutput,
  explanation: def.explanation,
  isPredictMode: def.isPredictMode,
}));

export function getExampleById(id: string): Example | undefined {
  return EXAMPLES.find(e => e.id === id);
}
