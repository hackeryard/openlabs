"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useChat } from "../components/ChatContext";
import { 
  Atom, 
  FlaskConical, 
  Layers, 
  Activity, 
  Milestone, 
  ArrowRight, 
  BookOpen, 
  Compass,
  ArrowLeft 
} from "lucide-react";

/* ---------------- Animations ---------------- */

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1], // easeOut
    },
  },
};

const cards = [
  {
    href: "/chemistry/periodictable",
    title: "Interactive Periodic Table",
    desc: "Explore dynamic element monographs, Bohr shell rotations, and dynamic Aufbau exceptions.",
    badge: "WebGL Bohr Simulator",
    color: "indigo",
    icon: Atom,
  },
  {
    href: "/chemistry/chemicalbonds",
    title: "Chemical Bond Types",
    desc: "Simulate covalent, ionic, and metallic bonding parameters and examine lattice behaviors.",
    badge: "Molecular bonding",
    color: "teal",
    icon: Milestone,
  },
  {
    href: "/chemistry/reaction-simulation",
    title: "Chemical Reactions Hub",
    desc: "Simulate double-displacement reactions, combustion ratios, and exothermic reactions.",
    badge: "Reaction Telemetry",
    color: "purple",
    icon: FlaskConical,
  },
  {
    href: "/chemistry/water-quality",
    title: "Water Quality Analysis",
    desc: "Simulate acid-base titrations, analyze pH parameters, and detect dissolved elements.",
    badge: "Titration Laboratory",
    color: "sky",
    icon: Activity,
  },
];

export default function ChemistryPage() {
  // Chatbot 
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "Chemistry Hub",
      theory: "Welcome to the OpenLabs Chemistry Portal. Here you can explore atomic models, simulate chemical bond parameters, experiment with reactive compounds, and run complex water purity assays.",
      extraContext: "Exploring the interactive chemistry index route and virtual scientific experiment catalogs.",
    });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-800 pb-20 pt-8 font-sans relative overflow-hidden bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] bg-[size:24px_24px]">
      
      {/* Ambient glowing radial spheres */}
      <div className="absolute top-12 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="max-w-7xl mx-auto px-4 md:px-8 relative z-10"
      >
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-950 transition font-medium">Home</Link>
          <span>/</span>
          <span className="text-indigo-600 font-bold">Chemistry</span>
        </nav>

        {/* -------- Header Section -------- */}
        <div className="space-y-4 mb-12 text-left">
          <motion.div 
            variants={item} 
            className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-755 text-[10px] font-black uppercase tracking-wider shadow-sm"
          >
            <FlaskConical className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
            Virtual Laboratory Gateway
          </motion.div>
          
          <motion.h1 
            variants={item} 
            className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-none"
          >
            Chemistry <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">Interactive Labs</span>
          </motion.h1>
          
          <motion.p 
            variants={item} 
            className="text-slate-500 text-base md:text-lg font-medium max-w-3xl leading-relaxed"
          >
            Welcome to the OpenLabs Chemistry Portal. Interact with dynamic periodic trends, configure atomic Bohr orbitals in full 3D, simulate exothermic chemical reactions, and analyze water titration curves in our GPU-accelerated science sandbox.
          </motion.p>
        </div>

        {/* -------- Grid -------- */}
        <motion.div
          layout
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {cards.map((card) => {
            const Icon = card.icon;
            
            // Dynamic color map for premium highlight styling
            const colorClasses = 
              card.color === "indigo" ? "bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:border-indigo-400 group-hover:shadow-indigo-100/50" :
              card.color === "teal" ? "bg-teal-50 text-teal-600 border-teal-100 group-hover:border-teal-400 group-hover:shadow-teal-100/50" :
              card.color === "purple" ? "bg-purple-50 text-purple-600 border-purple-100 group-hover:border-purple-400 group-hover:shadow-purple-100/50" :
              "bg-sky-50 text-sky-655 border-sky-100 group-hover:border-sky-400 group-hover:shadow-sky-100/50";

            return (
              <motion.div
                key={card.href}
                variants={item}
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{
                  duration: 0.25,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="group"
              >
                <Link
                  href={card.href}
                  className="block h-full bg-white rounded-3xl border border-slate-200 p-6 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 group-hover:bg-indigo-500/20 transition-all" />
                  
                  <div>
                    {/* Header badge & Icon */}
                    <div className="flex justify-between items-start mb-6">
                      <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center transition shadow-sm ${colorClasses}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 shadow-inner">
                        {card.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2.5 tracking-tight leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-50 text-[10px] font-extrabold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Enter Laboratory <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* GEO/AEO/SEO Alignment Panel (Dynamic Curriculum Standard Integration) */}
        <motion.section 
          variants={item}
          className="bg-white border border-slate-200/80 rounded-3xl p-8 lg:p-10 shadow-md relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 h-32 w-32 bg-slate-50 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
                <BookOpen className="h-4 w-4 animate-pulse" /> Educational Curriculum Alignment
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Academic Framework Integration & Standards
              </h3>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                Our virtual chemistry laboratory modules are meticulously aligned with standard global high school and collegiate academic frameworks. This includes <strong>NCERT Chemistry Class 11 and 12</strong> (Unit 3: Elements Classification, Unit 4: Bonding), <strong>AP Chemistry</strong> (Units 1 & 2: Atomic and Molecular Structures), <strong>IB Chemistry Higher Level (HL/SL)</strong>, and <strong>Cambridge GCSE / A-Levels</strong> core units.
              </p>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                OpenLabs provides high-fidelity dynamic sandbox visualizations enabling interactive homework accelerators. Telmetry feeds map to standard titration curves, Aufbau ground states, molecular orbitals, and aqueous dissolved particle assays.
              </p>
            </div>
            
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col justify-center text-center shadow-inner">
              <Compass className="h-10 w-10 text-indigo-600 mx-auto mb-3 animate-spin [animation-duration:12s]" />
              <h4 className="font-extrabold text-slate-900 text-sm mb-1">Interactive Telemetry</h4>
              <p className="text-[11px] text-slate-400 leading-normal font-medium">
                OpenLabs bridges standard academic theory with interactive WebGL models to optimize student conceptual retention and research comprehension.
              </p>
            </div>
          </div>
        </motion.section>

      </motion.div>
    </main>
  );
}
