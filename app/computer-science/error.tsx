"use client";
import { motion } from "framer-motion";
import { Cpu, Power, Terminal } from "lucide-react";

export default function CSError({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#050300] flex flex-col items-center justify-center p-6 text-amber-500 font-mono relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 select-none overflow-hidden text-[10px] break-all leading-none pointer-events-none">
        {Array(20).fill("01001001 01010011 01011111 01000101 ").map((v, i) => <div key={i}>{v.repeat(10)}</div>)}
      </div>
      <motion.div animate={{ y: [2, -2, 2], x: [-1, 1, -1] }} transition={{ repeat: Infinity, duration: 0.1 }} className="mb-6">
        <div className="p-5 border-4 border-amber-600 bg-black shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <Cpu className="w-16 h-16 text-amber-500" />
        </div>
      </motion.div>
      <h1 className="text-3xl font-black mb-2 tracking-tighter uppercase text-white italic text-center bg-amber-900/20 px-4">CS_Lab // Kernel_Panic</h1>
      <p className="text-amber-500/60 mb-8 max-w-sm text-center mx-auto text-xs border-l-2 border-amber-800 pl-4 italic">Segmentation fault (core dumped). System memory address overflow in main process.</p>
      <button onClick={reset} className="group px-10 py-4 bg-amber-500 text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all flex items-center gap-3 mx-auto">
        <Power className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Hard Reboot
      </button>
    </div>
  );
}