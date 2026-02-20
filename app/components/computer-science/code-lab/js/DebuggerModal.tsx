"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RuntimeSnapshot } from "@/app/types/jsDebugger";

type Props = {
  open: boolean;
  onClose: () => void;
  snapshots: RuntimeSnapshot[];
  sourceCode: string;
};

export default function DebuggerModal({
  open,
  onClose,
  snapshots,
  sourceCode,
}: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [activeTab, setActiveTab] =
    useState<"memory" | "stack" | "dom" | "async">("memory");

  if (!open) return null;

  const snapshot = snapshots[stepIndex];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex flex-col">
      <div className="bg-[#0f172a] flex-1 flex flex-col text-white">

        {/* 🔝 Control Bar */}
        <div className="h-14 border-b border-slate-700 flex items-center px-4 justify-between">
          <div className="flex gap-3">
            <button onClick={() => setStepIndex(0)} className="btn">
              Restart
            </button>
            <button
              onClick={() =>
                setStepIndex((p) =>
                  p < snapshots.length - 1 ? p + 1 : p
                )
              }
              className="btn"
            >
              Step →
            </button>
          </div>

          <div className="text-sm text-slate-400">
            Line: {snapshot?.line}
          </div>

          <button onClick={onClose} className="btn">
            Close
          </button>
        </div>

        {/* 🖥 Main */}
        <div className="flex flex-1 overflow-hidden">

          {/* Code Panel */}
          <div className="w-1/2 border-r border-slate-700 p-6 font-mono text-sm overflow-auto">
            {sourceCode.split("\n").map((line, index) => (
              <div
                key={index}
                className={`px-2 py-1 rounded ${
                  snapshot?.line === index + 1
                    ? "bg-blue-500/20 border-l-4 border-blue-500"
                    : "opacity-60"
                }`}
              >
                <span className="text-slate-500 mr-3">
                  {index + 1}
                </span>
                {line}
              </div>
            ))}
          </div>

          {/* Right Panel */}
          <div className="w-1/2 flex flex-col">

            <div className="flex border-b border-slate-700">
              {["memory", "stack", "dom", "async"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 text-sm capitalize ${
                    activeTab === tab
                      ? "border-b-2 border-blue-500 text-blue-400"
                      : "text-slate-400"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-auto p-6">
              {activeTab === "memory" && (
                <MemoryTab memory={snapshot?.memory || {}} />
              )}
              {activeTab === "stack" && (
                <StackTab stack={snapshot?.stack || []} />
              )}
              {activeTab === "dom" && (
                <pre className="text-xs text-slate-300">
                  {snapshot?.dom || "No DOM changes yet"}
                </pre>
              )}
              {activeTab === "async" && (
                <AsyncTab tasks={snapshot?.asyncQueue || []} />
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="h-16 border-t border-slate-700 flex items-center px-4 gap-3">
          {snapshots.map((_, i) => (
            <button
              key={i}
              onClick={() => setStepIndex(i)}
              className={`h-3 w-3 rounded-full ${
                stepIndex === i
                  ? "bg-blue-500"
                  : "bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Tabs ---------- */

function MemoryTab({ memory }: { memory: any }) {
  return (
    <div className="space-y-3">
      {Object.entries(memory).map(([k, v]) => (
        <motion.div
          key={k}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-800 px-4 py-3 rounded-lg flex justify-between"
        >
          <span>{k}</span>
          <span className="text-blue-400">
            {JSON.stringify(v)}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function StackTab({ stack }: { stack: any[] }) {
  return (
    <div className="space-y-3">
      {stack
        .slice()
        .reverse()
        .map((frame, i) => (
          <motion.div
            key={i}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-purple-900/30 border border-purple-500/40 px-4 py-3 rounded-lg"
          >
            <div className="font-semibold text-purple-300">
              {frame.name}()
            </div>
          </motion.div>
        ))}
    </div>
  );
}

function AsyncTab({ tasks }: { tasks: any[] }) {
  return (
    <div className="space-y-2">
      {tasks.map((task, i) => (
        <div
          key={i}
          className="bg-yellow-900/30 border border-yellow-500/40 px-3 py-2 rounded"
        >
          {task.type}: {task.label}
        </div>
      ))}
    </div>
  );
}
