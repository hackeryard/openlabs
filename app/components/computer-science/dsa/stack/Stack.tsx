"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  RotateCcw,
  Info,
  ArrowUp,
  ArrowDown,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/app/components/ChatContext";

const StackVisualizer: React.FC = () => {

  // Chatbot 
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "Stack",
      theory: "Stack Data Structure Visualizer",
      extraContext: ``,
    });
  }, []);

  const [stack, setStack] = useState<string[]>([]);
  const [maxSize, setMaxSize] = useState<number>(5);
  const [inputValue, setInputValue] = useState<string>("");
  const [logs, setLogs] = useState<{ text: string; type: string }[]>([]);

  const isFull = stack.length >= maxSize;
  const isEmpty = stack.length === 0;

  const addLog = (text: string, type: "success" | "error" | "info") => {
    setLogs((prev) => [{ text, type }, ...prev].slice(0, 5));
  };

  // Log when limits are reached
  useEffect(() => {
    if (isFull) addLog("Stack is now full (Overflow)", "error");
    if (isEmpty && logs.length > 0) addLog("Stack is now empty (Underflow)", "info");
  }, [stack.length, maxSize]);

  const push = () => {
    if (!inputValue.trim()) {
      addLog("Value cannot be empty", "error");
      return;
    }
    if (isFull) return; // Button is disabled, but safety first

    setStack([...stack, inputValue.trim()]);
    addLog(`Pushed: ${inputValue}`, "success");
    setInputValue("");
  };

  const pop = () => {
    if (isEmpty) return; // Button is disabled, but safety first
    
    const poppedValue = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    addLog(`Popped: ${poppedValue}`, "info");
  };

  const reset = () => {
    setStack([]);
    addLog("Stack cleared", "info");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls */}
        <div className="lg:col-span-5 space-y-6">
          <header>
            <h1 className="text-4xl font-black tracking-tight text-slate-800">
              STACK<span className="text-blue-600">.</span>
            </h1>
            <p className="text-slate-500 mt-2">
              Visualizing Last-In-First-Out (LIFO) behavior.
            </p>
          </header>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Configuration
              </label>
              <div className="flex items-center gap-4 mt-2">
                <input
                  type="range"
                  min="3"
                  max="8"
                  value={maxSize}
                  onChange={(e) => setMaxSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="font-mono font-bold bg-slate-100 px-3 py-1 rounded text-blue-600">
                  {maxSize}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Operations
              </label>
              
              {/* Status Messages for Empty/Full */}
              <AnimatePresence>
                {isFull && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-rose-600 text-xs font-bold mb-2 bg-rose-50 p-2 rounded-lg"
                  >
                    <AlertCircle size={14} /> Stack Overflow: Maximum size reached.
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && push()}
                  placeholder={isFull ? "Stack is Full" : "Element value..."}
                  disabled={isFull}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:cursor-not-allowed disabled:bg-slate-100"
                />
                <button
                  onClick={reset}
                  title="Clear Stack"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-90"
                >
                  <RotateCcw size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <button
                  onClick={push}
                  disabled={isFull}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none text-white p-3 rounded-xl transition-all shadow-md active:scale-95"
                >
                  <Plus size={20} /> Push
                </button>
                <button
                  onClick={pop}
                  disabled={isEmpty}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 disabled:opacity-30 disabled:grayscale transition-all border border-rose-100"
                >
                  <Trash2 size={20} /> Pop
                </button>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="hidden md:block">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Operation Log
            </h3>
            <div className="space-y-2">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`text-sm p-2 rounded-lg border flex items-center gap-2 ${
                    log.type === "error"
                      ? "bg-rose-50 border-rose-100 text-rose-700 font-medium"
                      : log.type === "success"
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                        : "bg-blue-50 border-blue-100 text-blue-700"
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${
                      log.type === "error" ? "bg-rose-400" : log.type === "success" ? "bg-emerald-400" : "bg-blue-400"
                    }`}
                  />
                  {log.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Visualization */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[500px] bg-slate-200/50 rounded-3xl border-2 border-dashed border-slate-300 p-8 relative overflow-hidden">
          {/* Stack Container */}
          <div
            className="relative flex flex-col-reverse justify-start border-x-4 border-b-4 border-slate-400 rounded-b-2xl bg-white shadow-inner transition-all duration-500"
            style={{
              width: "280px",
              height: `${maxSize * 70}px`,
              padding: "10px",
            }}
          >
            <AnimatePresence initial={false}>
              {stack.map((item, index) => {
                const isTop = index === stack.length - 1;
                return (
                  <motion.div
                    key={`${item}-${index}`}
                    initial={{ y: -100, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -100, opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", damping: 15, stiffness: 100 }}
                    className={`h-[60px] mb-2 rounded-xl flex items-center justify-between px-6 shadow-sm border-2 ${
                      isTop
                        ? "bg-blue-500 border-blue-400 text-white z-10"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    <span className="font-bold text-lg truncate pr-2">
                      {item}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                        isTop ? "bg-blue-400" : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isTop ? "Top" : `[${index}]`}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {isEmpty && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 select-none">
                <Info size={48} strokeWidth={1} />
                <p className="font-medium mt-2 italic">Stack is Empty</p>
              </div>
            )}
          </div>

          {/* Guidelines */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-20 text-slate-400">
            <div className="flex flex-col items-center gap-1 opacity-50">
              <ArrowDown size={20} />
              <span className="text-[10px] font-bold uppercase vertical-text">
                Push
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 opacity-50">
              <ArrowUp size={20} className="text-rose-400" />
              <span className="text-[10px] font-bold uppercase vertical-text text-rose-400">
                Pop
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackVisualizer;