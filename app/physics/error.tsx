"use client";
import { motion } from "framer-motion";
import { Atom, RefreshCw } from "lucide-react";

export default function PhysicsError({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#020205] flex flex-col items-center justify-center p-6 text-blue-500 font-mono relative overflow-hidden">
      
      {/* 1. Added pointer-events-none so this background doesn't block clicks */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(59,130,246,0.03)_25%,transparent_25%)] bg-[size:30px_30px] pointer-events-none" />
      
      {/* 2. Wrap content in a z-index container */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
          className="mb-6 opacity-80"
        >
          <Atom className="w-24 h-24 text-blue-400" />
        </motion.div>

        <h1 className="text-3xl font-black mb-2 tracking-tighter uppercase text-white italic underline decoration-blue-500/30">
          Physics_Wing // Entropy
        </h1>
        
        <p className="text-blue-500/60 mb-8 max-w-sm text-xs uppercase tracking-[0.2em] px-4">
          Quantum state mismatch detected. Reality parameters failing.
        </p>

        {/* 3. Ensure button is clickable with cursor-pointer */}
        <button 
          onClick={() => {
            console.log("Resetting physics segment...");
            reset();
          }}
          className="group relative px-10 py-4 border-2 border-blue-500 text-blue-400 font-black uppercase text-xs tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all flex items-center gap-3 mx-auto shadow-[0_0_40px_rgba(59,130,246,0.2)] active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> 
          Sync Coordinates
        </button>
      </motion.div>

      {/* Decorative scanning line - must have pointer-events-none */}
      <motion.div 
        animate={{ translateY: ["0vh", "100vh"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 w-full h-[2px] bg-blue-500/10 pointer-events-none"
      />
    </div>
  );
}