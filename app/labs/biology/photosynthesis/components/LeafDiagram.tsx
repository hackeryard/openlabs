import React from "react";
import { motion } from "framer-motion";

interface LeafDiagramProps {
  rate: number;
}

export default function LeafDiagram({ rate }: LeafDiagramProps) {
  // Pulse intensity based on rate
  const isActive = rate > 5;
  const pulseDuration = Math.max(0.5, 3 - (rate / 100) * 2.5); // Faster pulse at higher rates

  return (
    <div className="relative w-full aspect-video bg-emerald-950 rounded-2xl overflow-hidden border-2 border-emerald-900 shadow-inner flex items-center justify-center p-4">
      {/* Background ambient glow */}
      <motion.div
        animate={{ opacity: isActive ? [0.1, 0.1 + (rate / 100) * 0.6, 0.1] : 0 }}
        transition={{ duration: pulseDuration, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-emerald-500 blur-3xl"
      />

      {/* Abstract Leaf Cross Section */}
      <div className="relative w-full max-w-md h-full flex flex-col justify-between p-4 bg-emerald-900/50 rounded-xl border border-emerald-700/50 backdrop-blur-sm z-10">
        
        {/* Upper Epidermis */}
        <div className="h-6 w-full flex gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`ue-${i}`} className="flex-1 bg-emerald-800/80 rounded-sm border border-emerald-700/50" />
          ))}
        </div>

        {/* Palisade Mesophyll (Chloroplasts) */}
        <div className="flex-grow flex gap-2 py-4 px-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`pm-${i}`} className="flex-1 bg-emerald-800/40 rounded-full border border-emerald-600/30 flex flex-col gap-1 p-1 items-center justify-around">
              {/* Chloroplasts */}
              {Array.from({ length: 4 }).map((_, j) => (
                <motion.div 
                  key={`cp-${i}-${j}`}
                  animate={isActive ? { 
                    scale: [1, 1 + (rate / 100) * 0.2, 1], 
                    backgroundColor: ["#10b981", rate > 50 ? "#34d399" : "#10b981", "#10b981"] 
                  } : { scale: 1, backgroundColor: "#065f46" }}
                  transition={{ duration: pulseDuration, repeat: Infinity, ease: "easeInOut", delay: (i + j) * 0.1 }}
                  className="w-full aspect-square rounded-full bg-emerald-800 shadow-inner"
                />
              ))}
            </div>
          ))}
        </div>

        {/* Spongy Mesophyll & Vein */}
        <div className="h-16 w-full flex items-center justify-between px-4 relative">
          {/* Abstract air spaces */}
          <div className="absolute inset-0 flex flex-wrap gap-3 p-2 opacity-30">
             {Array.from({ length: 10 }).map((_, i) => (
               <div key={`sm-${i}`} className="w-6 h-6 rounded-full bg-emerald-900 border border-emerald-700/50" />
             ))}
          </div>

          {/* Vascular Bundle (Vein) */}
          <div className="relative z-10 w-24 h-24 rounded-full bg-emerald-950 border-4 border-emerald-800 flex items-center justify-center overflow-hidden">
            <div className="w-full h-1/2 bg-blue-900/40 absolute top-0 flex items-center justify-center text-[8px] font-bold text-blue-300">Xylem</div>
            <div className="w-full h-1/2 bg-rose-900/40 absolute bottom-0 flex items-center justify-center text-[8px] font-bold text-rose-300">Phloem</div>
          </div>
        </div>

        {/* Lower Epidermis & Stomata */}
        <div className="h-6 w-full flex gap-1 items-end relative">
          {Array.from({ length: 12 }).map((_, i) => (
            i === 3 || i === 8 ? (
              // Stoma
              <div key={`le-${i}`} className="flex-1 h-full flex justify-center items-end pb-1">
                <div className="w-full h-2/3 flex justify-between gap-0.5">
                  <div className="w-1/2 bg-emerald-600 rounded-l-full" />
                  <motion.div 
                    animate={{ width: `${Math.max(1, (rate / 100) * 6)}px` }}
                    className="bg-blue-300/20 rounded-full h-full"
                  />
                  <div className="w-1/2 bg-emerald-600 rounded-r-full" />
                </div>
              </div>
            ) : (
              <div key={`le-${i}`} className="flex-1 h-full bg-emerald-800/80 rounded-sm border border-emerald-700/50" />
            )
          ))}
        </div>

      </div>

      <div className="absolute top-4 right-4 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/50 text-[10px] font-bold text-emerald-400 uppercase tracking-widest backdrop-blur-md z-20">
        Leaf Cross-Section
      </div>
    </div>
  );
}
