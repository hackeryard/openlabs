"use client";

import { useState } from "react";
import DebuggerModal from "@/app/components/computer-science/code-lab/js/DebuggerModal";
import { Memory, RuntimeSnapshot } from "@/app/types/jsDebugger";

export default function DebuggerPage() {
    const [editorCode, setEditorCode] = useState<string>(
        `let a = 5;
let b = 10;
a = a + b;`
    );

    const [openDebugger, setOpenDebugger] = useState(false);
    const [snapshots, setSnapshots] = useState<RuntimeSnapshot[]>([]);

    const handleRun = async () => {
        const result = await runInstrumentedCode(editorCode);
        setSnapshots(result);
        setOpenDebugger(true);
    };


    return (
        <>
            <DebuggerModal
                open={openDebugger}
                onClose={() => setOpenDebugger(false)}
                snapshots={snapshots}
                sourceCode={editorCode}
            />

            <div className="h-screen w-full bg-[#0f172a] text-white flex flex-col">

                {/* Top Bar */}
                <div className="h-14 border-b border-slate-700 flex items-center justify-between px-6">
                    <div className="text-lg font-semibold">JS Debugger</div>

                    <button
                        onClick={handleRun}
                        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-sm"
                    >
                        Run with Visualization
                    </button>
                </div>


                {/* Editor */}
                <div className="flex-1 p-6">
                    <textarea
                        value={editorCode}
                        onChange={(e) => setEditorCode(e.target.value)}
                        className="w-full h-full bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm resize-none outline-none"
                    />
                </div>
            </div>
        </>
    );
}

/* ================= TEMP ENGINE STUB ================= */

async function runInstrumentedCode(code: string): Promise<RuntimeSnapshot[]> {
    // ⚠️ Temporary stub until real engine is built

    const lines = code.split("\n");

    let memory: Memory = {};
    const snapshots: RuntimeSnapshot[] = [];

    lines.forEach((line, index) => {
        if (line.includes("let")) {
            const parts = line.replace("let", "").split("=");
            const name = parts[0].trim();
            const value = eval(parts[1]); // TEMP only
            memory[name] = value;
        }

        if (line.includes("=") && !line.includes("let")) {
            const parts = line.split("=");
            const name = parts[0].trim();
            const expression = parts[1];
            memory[name] = eval(expression);
        }

        snapshots.push({
            id: index,
            line: index + 1,
            memory: { ...memory },
            stack: [
                {
                    id: "global",
                    name: "global",
                    locals: { ...memory },
                },
            ],

            timestamp: Date.now(),
        });
    });

    return snapshots;
}
