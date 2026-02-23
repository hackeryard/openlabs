"use client";

import { useState, useCallback, useEffect } from "react";
import DebuggerModal from "@/app/components/computer-science/code-lab/js/DebuggerModal";
import { Memory, RuntimeSnapshot, StackFrame, Task } from "@/app/types/jsDebugger";
import { useChat } from "@/app/components/ChatContext";

export default function DebuggerPage() {
    // Chatbot 
    const { setExperimentData } = useChat();

    useEffect(() => {
        setExperimentData({
            title: "Javascript code compiler visualizer.",
            theory: "",
            extraContext: ``,
        });
    }, []);
    const [editorCode, setEditorCode] = useState<string>(
        `// Event Loop Demo
console.log('1: Start');

setTimeout(function timeout() {
    console.log('2: Timeout');
}, 0);

Promise.resolve()
    .then(function promise1() {
        console.log('3: Promise 1');
    })
    .then(function promise2() {
        console.log('4: Promise 2');
    });

console.log('5: End');`
    );

    const [openDebugger, setOpenDebugger] = useState(false);
    const [snapshots, setSnapshots] = useState<RuntimeSnapshot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRun = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await simulateEventLoop(editorCode);
            setSnapshots(result);
            setOpenDebugger(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to run code');
            console.error('Debugger error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [editorCode]);

    return (
        <>
            {error && (
                <div className="fixed top-20 right-4 bg-red-600 text-white p-4 rounded-lg z-50 shadow-lg">
                    <p className="font-semibold">Error:</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <DebuggerModal
                open={openDebugger}
                onClose={() => setOpenDebugger(false)}
                snapshots={snapshots}
                sourceCode={editorCode}
            />

            <div className="h-screen w-full bg-[#1a1b26] text-white flex flex-col">
                {/* Top Bar */}
                <div className="h-14 border-b border-[#2a2b36] flex items-center justify-between px-6 bg-[#0f0f17]">
                    <div className="text-lg font-semibold text-blue-400">⚡ Event Loop Visualizer</div>

                    <button
                        onClick={handleRun}
                        disabled={isLoading}
                        className={`bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isLoading ? 'Visualizing...' : 'Visualize Event Loop'}
                    </button>
                </div>

                {/* Editor */}
                <div className="flex-1 p-6">
                    <div className="w-full h-full bg-[#0f0f17] border border-[#2a2b36] rounded-lg overflow-hidden font-mono text-sm flex">
                        {/* Line numbers */}
                        <div className="bg-[#1a1b26] p-4 text-right text-[#4a4b56] select-none border-r border-[#2a2b36]">
                            {editorCode.split('\n').map((_, i) => (
                                <div key={i} className="leading-6">{i + 1}</div>
                            ))}
                        </div>
                        <textarea
                            value={editorCode}
                            onChange={(e) => setEditorCode(e.target.value)}
                            className="flex-1 bg-[#0f0f17] p-4 font-mono text-sm resize-none outline-none text-[#d4d4d8]"
                            spellCheck={false}
                            placeholder="Enter JavaScript code here..."
                            style={{ lineHeight: '1.5rem' }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

/* ================= EVENT LOOP SIMULATION ================= */

async function simulateEventLoop(code: string): Promise<RuntimeSnapshot[]> {
    const lines = code.split('\n');
    const snapshots: RuntimeSnapshot[] = [];

    // State
    const memory: Memory = {};
    const stack: StackFrame[] = [{
        id: 'global',
        name: 'global',
        locals: memory,
        type: 'global'
    }];

    const taskQueue: Task[] = [];
    const microtaskQueue: Task[] = [];
    const webAPIs: Task[] = [];

    let timeoutId = 0;
    let promiseId = 0;
    let domOutput: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        if (trimmedLine === '' || trimmedLine.startsWith('//')) {
            snapshots.push(createSnapshot(i, memory, stack, taskQueue, microtaskQueue, webAPIs, domOutput, line));
            continue;
        }

        // Simulate console.log
        if (trimmedLine.includes('console.log')) {
            const match = trimmedLine.match(/console\.log\((.*)\)/);
            if (match) {
                const value = match[1].replace(/['"]/g, '');
                domOutput.push(`[Console] ${value}`);
            }
        }

        // Simulate setTimeout
        else if (trimmedLine.includes('setTimeout')) {
            const match = trimmedLine.match(/setTimeout\(function\s+(\w+)/);
            if (match) {
                const callbackName = match[1];
                timeoutId++;

                // Add to Web APIs
                webAPIs.push({
                    id: `timeout-${timeoutId}`,
                    type: 'setTimeout',
                    name: callbackName,
                    callback: callbackName,
                    line: i + 1,
                    status: 'pending'
                });

                // Add to task queue (simulating after delay)
                taskQueue.push({
                    id: `task-${timeoutId}`,
                    type: 'task',
                    name: callbackName,
                    callback: callbackName,
                    line: i + 1,
                    status: 'pending'
                });
            }
        }

        // Simulate Promises
        else if (trimmedLine.includes('Promise.resolve()')) {
            promiseId++;

            // Promise executor runs synchronously
            stack.push({
                id: `executor-${promiseId}`,
                name: 'Promise executor',
                locals: {},
                type: 'executor'
            });

            // Add snapshot for promise creation
            snapshots.push(createSnapshot(i, memory, stack, taskQueue, microtaskQueue, webAPIs, domOutput, line));

            // Then callbacks go to microtask queue
            let j = i + 1;
            while (j < lines.length && lines[j].trim().includes('.then')) {
                const thenLine = lines[j].trim();
                const thenMatch = thenLine.match(/\.then\(function\s+(\w+)/);
                if (thenMatch) {
                    const thenName = thenMatch[1];
                    microtaskQueue.push({
                        id: `micro-${promiseId}-${j}`,
                        type: 'then',
                        name: thenName,
                        callback: thenName,
                        line: j + 1,
                        status: 'pending'
                    });
                }
                j++;
            }

            // Pop promise executor
            stack.pop();
        }

        // Add snapshot after processing
        snapshots.push(createSnapshot(i, memory, stack, taskQueue, microtaskQueue, webAPIs, domOutput, line));

        // Process microtasks after each line
        while (microtaskQueue.length > 0) {
            const microtask = microtaskQueue.shift();
            if (microtask) {
                stack.push({
                    id: microtask.id,
                    name: microtask.name,
                    locals: {},
                    type: microtask.type === 'then' ? 'then' : 'promise'
                });

                snapshots.push(createSnapshot(i, memory, stack, taskQueue, microtaskQueue, webAPIs, domOutput, `// Running microtask: ${microtask.name}`));

                stack.pop();
            }
        }
    }

    // Process remaining tasks
    while (taskQueue.length > 0) {
        const task = taskQueue.shift();
        if (task) {
            stack.push({
                id: task.id,
                name: task.name,
                locals: {},
                type: 'function'
            });

            snapshots.push(createSnapshot(lines.length - 1, memory, stack, taskQueue, microtaskQueue, webAPIs, domOutput, `// Running task: ${task.name}`));

            stack.pop();
        }
    }

    return snapshots;
}

function createSnapshot(
    lineIndex: number,
    memory: Memory,
    stack: StackFrame[],
    taskQueue: Task[],
    microtaskQueue: Task[],
    webAPIs: Task[],
    domOutput: string[],
    line: string
): RuntimeSnapshot {
    return {
        id: lineIndex,
        line: lineIndex + 1,
        memory: { ...memory },
        stack: stack.map(frame => ({ ...frame })),
        taskQueue: taskQueue.map(task => ({ ...task })),
        microtaskQueue: microtaskQueue.map(task => ({ ...task })),
        webAPIs: webAPIs.map(api => ({ ...api })),
        dom: domOutput.join('\n'),
        timestamp: Date.now(),
        sourceLine: line
    };
}