"use client";
import { useEffect, useState, useRef } from "react";

interface LogEvent {
  type: string;
  msg: string;
}

export default function ConsolePanel() {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMessage = (e: MessageEvent<LogEvent>) => {
      if (e.data?.type === "log") {
        setLogs((prev) => [...prev, e.data.msg]);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    // FIX: Scroll only the container, not the window
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full font-mono text-xs lg:text-sm bg-[#1e1e1e] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] shrink-0 border-b border-white/10">
        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Console</span>
        <button 
          onClick={() => setLogs([])} 
          className="text-slate-500 hover:text-white transition-colors text-[10px]"
        >
          CLEAR
        </button>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide"
      >
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2 border-b border-white/5 pb-1 leading-relaxed">
            <span className="text-blue-500 opacity-50 font-bold">{">"}</span>
            <span className={log.includes("ERROR") ? "text-red-400" : "text-green-400"}>
              {log}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}