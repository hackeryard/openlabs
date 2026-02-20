"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FlaskConical, 
  RefreshCcw, 
  Home, 
  ChevronRight, 
  Terminal, 
  Dna,
  Bug
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isExpended, setIsExpanded] = useState(false);

  useEffect(() => {
    // Log privately to console, away from the user's immediate view
    console.error("OpenLabs System Log:", error);
  }, [error]);

  return (
    // High Z-index and Fixed position ensures this covers the screen entirely
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] text-slate-300 font-sans overflow-hidden">
      
      {/* Background Lab Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      
      {/* Terminal Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-20 w-full max-w-2xl px-6 py-12"
      >
        {/* Lab Branding */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <motion.div 
              animate={{ 
                filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"],
                scale: [1, 1.05, 1] 
              }}
              transition={{ repeat: Infinity, duration: 6 }}
            >
              <FlaskConical className="w-16 h-16 text-emerald-500" />
            </motion.div>
            <div className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic">
            OPEN<span className="text-emerald-500">LABS</span> // <span className="text-red-500">FAULT</span>
          </h1>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em]">
            Protocol sequence: <span className="text-red-900 bg-red-500/10 px-2 py-0.5 rounded">Terminated</span>
          </p>
        </div>

        {/* Diagnostic Module */}
        <div className="bg-[#0c0e12] border border-white/5 rounded-xl overflow-hidden shadow-[0_0_50px_-12px_rgba(16,185,129,0.1)] mb-8">
          <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">System.Diagnostics.v2.0</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-slate-800" />
              <div className="w-2 h-2 rounded-full bg-slate-800" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="mt-1 p-2 bg-red-500/10 rounded-lg">
                <Bug className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Containment Breach</h2>
                <p className="text-slate-400 text-sm leading-relaxed mt-1">
                  A processing error occurred during the last operation. Our automated systems are attempting to isolate the cause.
                </p>
              </div>
            </div>

            <button 
              onClick={() => setIsExpanded(!isExpended)}
              className="group flex items-center gap-2 text-[10px] font-bold font-mono text-slate-500 hover:text-emerald-400 transition-all uppercase tracking-tighter"
            >
              <span className="bg-slate-800 px-1.5 py-0.5 rounded group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                {isExpended ? "HIDE" : "SHOW"}
              </span> 
              Raw Anomaly Data
            </button>

            <AnimatePresence>
              {isExpended && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4"
                >
                  <div className="bg-black/80 p-5 rounded-lg border border-red-500/20 font-mono text-[11px] text-red-400/90 leading-tight">
                    <span className="text-red-600 font-bold tracking-widest block mb-2 underline decoration-red-600/30 underline-offset-4">ERROR_LOG_DUMP:</span>
                    {error.message || "No message provided by core."}
                    {error.digest && (
                      <div className="mt-4 pt-4 border-t border-red-500/10 flex items-center justify-between text-slate-600">
                        <span>TRACE_ID:</span>
                        <span className="text-red-900 select-all font-bold tracking-tighter cursor-pointer hover:text-red-500 transition-colors">{error.digest}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(16,185,129,0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={reset}
            className="w-full sm:w-auto px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-xl transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
          >
            <RefreshCcw className="w-4 h-4" />
            Restart Sequence
          </motion.button>

          <Link
            href="/"
            className="w-full sm:w-auto px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 border border-white/5 uppercase text-xs tracking-widest"
          >
            <Home className="w-4 h-4 text-emerald-500" />
            Lab Entrance
          </Link>
        </div>

        {/* Status Bar */}
        <div className="mt-12 flex justify-center items-center gap-8 text-[10px] font-mono text-slate-600 font-bold uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <Dna className="w-3 h-3 text-emerald-900" />
            <span>Core: Offline</span>
          </div>
          <div className="w-1 h-1 bg-slate-800 rounded-full" />
          <Link 
            href="https://github.com/rahulra3621/openlabs/issues"
            target="_blank"
            className="hover:text-emerald-500 transition-colors decoration-emerald-500/30 underline underline-offset-4"
          >
            Report Breach
          </Link>
        </div>
      </motion.div>
    </div>
  );
}