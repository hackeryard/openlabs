"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

/* ---------------- Animations ---------------- */

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Faster stagger for more items
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const cards = [
  { href: "/computer-science/networking/packet-switching", title: "Packet Switching", desc: "Interactive lab for visualising of data flow of  packet switching." },
  { href: "/computer-science/networking/circuit-switching", title: "Circuit Switching", desc: "Interactive lab for visualising of data flow of  circuit switching." },
  { href: "/computer-science/networking/topology-builder", title: "Topology Builder", desc: "Interactive lab for visualising of topologies." },
];

export default function Page() {
  return (
    // Added a subtle radial gradient background to feel more like a 'lab'
    <main className="min-h-screen bg-[#FDFDFF] p-6 md:p-12 relative overflow-hidden">
      
      {/* Background Decor: Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%234F46E5' stroke-width='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="max-w-6xl mx-auto relative z-10"
      >
        {/* -------- Header -------- */}
        <header className="mb-10">
          <motion.h1 variants={item} className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Computer Networking <span className="text-indigo-600">Visualisation</span>
          </motion.h1>

          <motion.p variants={item} className="text-slate-500 mt-2 font-medium">
            Explore the visualisation of computer networking.
          </motion.p>
        </header>

        {/* -------- Grid -------- */}
        <motion.div
          layout
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {cards.map((card) => (
            <motion.div
              key={card.href}
              variants={item}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={card.href}
                className="group block h-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-indigo-300 relative overflow-hidden"
              >
                {/* Accent Gradient Blur (Visible on Hover) */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h3>
                  {/* Gate Symbol Placeholder/Icon Decoration */}
                  <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                    </svg>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-slate-500 group-hover:text-slate-600 transition-colors">
                  {card.desc}
                </p>
                
                {/* Subtle "Go" Indicator */}
                <div className="mt-5 flex items-center text-[11px] font-bold uppercase tracking-widest text-indigo-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  Launch Lab →
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}