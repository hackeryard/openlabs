"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Home, 
  Search, 
  Map, 
  ChevronRight, 
  Microscope, 
  Atom, 
  Dna, 
  Code2 
} from "lucide-react";

export default function NotFound() {
  const labDirectories = [
    { name: "Periodic Table", path: "/chemistry/periodictable", icon: <Atom className="w-4 h-4" /> },
    { name: "Free Fall Experiment", path: "/physics/freefall", icon: <Map className="w-4 h-4" /> },
    { name: "3D Animal Cell", path: "/biology/cell/animal", icon: <Dna className="w-4 h-4" /> },
    { name: "Code Editor", path: "/computer-science/code-lab/html-css-js", icon: <Code2 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-slate-300 font-sans overflow-hidden relative">
      
      {/* Background Radar / Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:50px_50px] opacity-10" />
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-[1000px] h-[1000px] border border-emerald-500/5 rounded-full"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl px-6 py-12 text-center"
      >
        {/* Large 404 Status */}
        <div className="relative inline-block mb-4">
          <motion.h1 
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-emerald-950 opacity-20"
          >
            404
          </motion.h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-widest uppercase">
              Sector <span className="text-emerald-500">Missing</span>
            </h2>
          </div>
        </div>

        <p className="text-slate-500 font-mono text-sm mb-12 tracking-widest uppercase">
          [ Error_Code: URL_TARGET_UNDEFINED ]
        </p>

        {/* Directory Suggestion Box */}
        <div className="bg-[#0c0e12] border border-white/5 rounded-2xl p-6 md:p-8 mb-10 shadow-2xl text-left">
          <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
            <Microscope className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Lab Modules</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {labDirectories.map((lab) => (
              <Link key={lab.path} href={lab.path}>
                <motion.div 
                  whileHover={{ x: 5, backgroundColor: "rgba(16,185,129,0.05)" }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-transparent hover:border-emerald-500/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-500/50 group-hover:text-emerald-500">{lab.icon}</span>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white">{lab.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-500" />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-xl transition-all hover:scale-105 uppercase text-xs tracking-[0.2em]"
          >
            <Home className="w-4 h-4" />
            Return to Base
          </Link>

          {/* <Link
            href="/chemistry"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-transparent border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all hover:scale-105 uppercase text-xs tracking-[0.2em]"
          >
            <Search className="w-4 h-4 text-emerald-500" />
            Manual Search
          </Link> */}
        </div>

        {/* System Breadcrumbs */}
        <div className="mt-16 opacity-30 flex justify-center gap-4 grayscale">
          <div className="w-8 h-1 bg-emerald-500 rounded-full" />
          <div className="w-8 h-1 bg-slate-800 rounded-full" />
          <div className="w-8 h-1 bg-slate-800 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}