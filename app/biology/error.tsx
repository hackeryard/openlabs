"use client";
import { motion } from "framer-motion";
import { Dna, HeartPulse } from "lucide-react";

export default function BiologyError({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#050102] flex flex-col items-center justify-center p-6 text-rose-500 font-mono relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10"><HeartPulse className="w-32 h-32" /></div>
      </div>
      <motion.div 
        animate={{ scale: [1, 1.1, 1], filter: ["hue-rotate(0deg)", "hue-rotate(45deg)", "hue-rotate(0deg)"] }} 
        transition={{ repeat: Infinity, duration: 3 }}
        className="mb-8 p-6 bg-rose-500/5 rounded-full border border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.1)]"
      >
        <Dna className="w-20 h-20" />
      </motion.div>
      <h1 className="text-3xl font-black mb-2 tracking-tighter uppercase text-white italic text-center">Bio_Sector // Mutation</h1>
      <p className="text-rose-500/60 mb-8 max-w-sm text-center mx-auto uppercase text-[10px] tracking-widest leading-loose">Organic sequence error. DNA reconstruction protocols required to restore neural link.</p>
      <button onClick={reset} className="px-8 py-3 bg-gradient-to-r from-rose-900/50 to-rose-700/50 border border-rose-500 text-rose-200 font-black uppercase text-xs tracking-widest hover:from-rose-500 hover:to-rose-400 hover:text-black transition-all mx-auto">
        Regenerate Helix
      </button>
    </div>
  );
}