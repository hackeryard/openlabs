"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

/* ---------------- Animations ---------------- */

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const cards = [
  {
    href: "/computer-science/code-lab",
    title: "Code Lab",
    desc: "Interactive lab that help in visualizing the code you write.",
    accent: "from-blue-500 to-indigo-500",
  },
  {
    href: "/computer-science/logic-gates",
    title: "Logic Gates",
    desc: "Interactive lab for visualising working of Logic Gates.",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    href: "/computer-science/git-simulator",
    title: "Git Simulator",
    desc: "Interactive lab for visualising the git commands.",
    accent: "from-orange-500 to-amber-500",
  },
  {
    href: "/computer-science/dsa",
    title: "Data Structures & Algorithms",
    desc: "Interactive lab that help in visualizing the code you write.",
  },
  {
    href: "/computer-science/networking",
    title: "Computer Networking Lab",
    desc: "Interactive lab that help in visualizing the working of computer networking.",
  },
];

export default function ComputerScience() {
  return (
    <main className="min-h-screen bg-[#fafafa] p-6 md:p-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="max-w-6xl mx-auto"
      >
        {/* -------- Header -------- */}
        <div className="mb-10">
          <motion.h1 
            variants={item} 
            className="text-3xl font-bold tracking-tight text-slate-900"
          >
            Computer Science Experiments
          </motion.h1>

          <motion.p variants={item} className="text-slate-500 mt-2">
            Coding and Tech related experiments.
          </motion.p>
        </div>

        {/* -------- Grid -------- */}
        <motion.div
          layout
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {cards.map((card) => (
            <motion.div
              key={card.href}
              variants={item}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative"
            >
              <Link href={card.href} className="relative block h-full">
                {/* Subtle Glow Effect on Hover */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${card.accent} rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500`} />
                
                <div className="relative h-full bg-white rounded-xl border border-slate-200 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)] group-hover:shadow-xl group-hover:border-slate-300 transition-all duration-300">
                  
                  {/* Accent Line */}
                  <div className={`w-10 h-1 rounded-full bg-gradient-to-r ${card.accent} mb-4`} />
                  
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h3>
                  
                  <p className="text-slate-500 mt-3 leading-relaxed text-sm">
                    {card.desc}
                  </p>

                  {/* Visual "Arrow" indicator */}
                  <div className="mt-6 flex items-center text-xs font-bold text-slate-400 group-hover:text-slate-900 uppercase tracking-widest transition-colors">
                    Explore 
                    <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}