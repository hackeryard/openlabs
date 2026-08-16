"use client";

import { motion } from "framer-motion";
import { Sigma, RefreshCw, AlertTriangle } from "lucide-react";

export default function MathematicsError({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#030209] flex flex-col items-center justify-center p-6 text-indigo-400 font-mono relative overflow-hidden">
      {/* Subtle mathematical grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(99,102,241,0.03)_25%,transparent_25%)] bg-[size:30px_30px] pointer-events-none" />

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6 opacity-80"
        >
          <div className="w-24 h-24 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.25)]">
            <Sigma className="w-14 h-14 text-indigo-400" />
          </div>
        </motion.div>

        <h1 className="text-3xl font-black mb-2 tracking-tighter uppercase text-white italic underline decoration-indigo-500/30">
          Math_Core // Undefined
        </h1>

        <p className="text-indigo-400/70 mb-8 text-xs uppercase tracking-[0.2em] px-4 leading-relaxed">
          Division by zero or singularity detected. Expression failed to converge to a real value.
        </p>

        <button
          onClick={() => {
            console.log("Recomputing mathematical coordinate system...");
            reset();
          }}
          className="group relative px-10 py-4 border-2 border-indigo-500 text-indigo-300 font-black uppercase text-xs tracking-[0.3em] hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-3 mx-auto shadow-[0_0_40px_rgba(99,102,241,0.25)] active:scale-95 cursor-pointer rounded-xl"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          Recompute
        </button>
      </motion.div>

      {/* Decorative scanning line */}
      <motion.div
        animate={{ translateY: ["0vh", "100vh"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 w-full h-[2px] bg-indigo-500/15 pointer-events-none"
      />
    </div>
  );
}
