"use client";
import { motion } from "framer-motion";
import { FlaskConical, RotateCcw, Pipette } from "lucide-react";

export default function ChemistryError({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#020504] flex flex-col items-center justify-center p-6 text-emerald-500 font-mono relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.07)_0%,transparent_70%)]" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center z-10">
        <div className="relative mb-6 inline-block">
           <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
             <FlaskConical className="w-20 h-20" />
           </motion.div>
           <motion.div animate={{ y: [-10, -30], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-2 -right-4 text-2xl">🧪</motion.div>
        </div>
        <h1 className="text-3xl font-black mb-2 tracking-tighter uppercase italic text-white">Chem_Lab // Breach</h1>
        <p className="text-emerald-500/60 mb-8 max-w-sm mx-auto uppercase text-xs tracking-widest">Reaction unstable. Sequence terminated to prevent contamination.</p>
        <button onClick={reset} className="px-8 py-3 bg-emerald-600 text-black font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2 mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          <RotateCcw className="w-4 h-4" /> Re-Stabilize Solution
        </button>
      </motion.div>
    </div>
  );
}