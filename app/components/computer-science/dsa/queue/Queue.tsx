"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  LogOut,
  RotateCcw,
  Info,
  ArrowRight,
  AlertCircle,
  MoveRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/app/components/ChatContext";

const QueueVisualizer: React.FC = () => {

      // Chatbot 
      const { setExperimentData } = useChat();
    
      useEffect(() => {
        setExperimentData({
          title: "Queue",
          theory: "Queue Data Structure Visualizer",
          extraContext: ``,
        });
      }, []);

  const [queue, setQueue] = useState<string[]>([]);
  const [maxSize, setMaxSize] = useState<number>(5);
  const [inputValue, setInputValue] = useState<string>("");
  const [logs, setLogs] = useState<{ text: string; type: string }[]>([]);

  const isFull = queue.length >= maxSize;
  const isEmpty = queue.length === 0;

  const addLog = (text: string, type: "success" | "error" | "info") => {
    setLogs((prev) => [{ text, type }, ...prev].slice(0, 5));
  };

  // Status Logs
  useEffect(() => {
    if (isFull) addLog("Queue is full (Maximum Capacity)", "error");
    if (isEmpty && logs.length > 0) addLog("Queue is empty", "info");
  }, [queue.length, maxSize]);

  // Enqueue: Element peeche se add hota hai (Rear)
  const enqueue = () => {
    if (!inputValue.trim()) {
      addLog("Please enter a value", "error");
      return;
    }
    if (isFull) return;

    setQueue([...queue, inputValue.trim()]);
    addLog(`Enqueued: ${inputValue}`, "success");
    setInputValue("");
  };

  // Dequeue: Element aage se hat-ta hai (Front)
  const dequeue = () => {
    if (isEmpty) return;

    const removedValue = queue[0];
    setQueue(queue.slice(1));
    addLog(`Dequeued: ${removedValue}`, "info");
  };

  const reset = () => {
    setQueue([]);
    addLog("Queue reset successfully", "info");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <header>
            <h1 className="text-4xl font-black tracking-tight text-emerald-600">
              QUEUE<span className="text-slate-800">.</span>
            </h1>
            <p className="text-slate-500 mt-2 italic font-medium">
              First-In, First-Out (FIFO) Visualization
            </p>
          </header>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Queue Capacity</label>
              <div className="flex items-center gap-4 mt-2">
                <input
                  type="range" min="3" max="10" value={maxSize}
                  onChange={(e) => setMaxSize(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="font-mono font-bold bg-emerald-50 px-3 py-1 rounded text-emerald-600">{maxSize}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Manage Elements</label>
              
              <AnimatePresence>
                {isFull && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-rose-600 text-[11px] font-bold bg-rose-50 p-2 rounded-lg border border-rose-100"
                  >
                    <AlertCircle size={14} /> QUEUE FULL: Cannot enqueue more.
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-2">
                <input
                  type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && enqueue()}
                  placeholder={isFull ? "Full" : "Enter value..."}
                  disabled={isFull}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-50"
                />
                <button onClick={reset} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 active:scale-90 transition-all">
                  <RotateCcw size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={enqueue} disabled={isFull}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white p-3 rounded-xl font-bold transition-all shadow-md active:scale-95"
                >
                  <Plus size={20} /> Enqueue
                </button>
                <button
                  onClick={dequeue} disabled={isEmpty}
                  className="flex items-center justify-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 p-3 rounded-xl font-bold hover:bg-amber-100 disabled:opacity-30 transition-all"
                >
                  <LogOut size={18} /> Dequeue
                </button>
              </div>
            </div>
          </div>

          {/* Logs */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">Recent Activity</h3>
            {logs.map((log, i) => (
              <div key={i} className={`text-sm p-2.5 rounded-xl border flex items-center gap-2 ${
                log.type === "error" ? "bg-rose-50 border-rose-100 text-rose-700" :
                log.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                "bg-blue-50 border-blue-100 text-blue-700"
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${log.type === 'error' ? 'bg-rose-400' : log.type === 'success' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                {log.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Visualization */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
          
          <div className="w-full flex justify-between px-10 mb-8 text-[10px] font-black tracking-widest text-slate-400 uppercase">
             <div className="flex flex-col items-center gap-1">
               <ArrowRight className="text-amber-500" />
               FRONT (Exit)
             </div>
             <div className="flex flex-col items-center gap-1 text-right">
               <ArrowRight className="text-emerald-500" />
               REAR (Entry)
             </div>
          </div>

          {/* Horizontal Queue Container */}
          <div 
            className="flex items-center gap-3 p-4 bg-slate-50 border-y-4 border-slate-200 relative min-w-[300px]"
            style={{ width: '90%', height: '120px' }}
          >
            <AnimatePresence initial={false}>
              {queue.map((item, index) => {
                const isFront = index === 0;
                const isRear = index === queue.length - 1;
                return (
                  <motion.div
                    key={`${item}-${index}`}
                    initial={{ x: 50, opacity: 0, scale: 0.5 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: -100, opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={`min-w-[100px] h-[80px] rounded-2xl flex flex-col items-center justify-center shadow-sm border-2 transition-colors ${
                      isFront ? 'bg-amber-500 border-amber-400 text-white' : 
                      isRear ? 'bg-emerald-500 border-emerald-400 text-white' : 
                      'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="font-black text-lg">{item}</span>
                    <span className={`text-[9px] font-bold uppercase mt-1 px-1.5 rounded bg-black/10`}>
                      {isFront ? 'Front' : isRear ? 'Rear' : `Pos ${index}`}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {isEmpty && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                <Info size={32} />
                <p className="text-sm font-bold mt-2">Queue Empty</p>
              </div>
            )}
          </div>

          <div className="mt-12 flex items-center gap-4 text-slate-400 bg-slate-50 px-6 py-2 rounded-full border border-slate-100">
             <span className="text-xs font-bold">FLOW:</span>
             <MoveRight className="animate-pulse" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default QueueVisualizer;