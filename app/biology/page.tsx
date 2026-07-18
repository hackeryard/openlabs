"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useChat } from "../components/ChatContext";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Compass,
  Dna,
  HeartPulse,
  Leaf,
  Microscope,
  UserRound,
  Sun,
} from "lucide-react";

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
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const cards = [
  {
    href: "/biology/human",
    title: "Human Anatomy",
    desc: "Explore body systems, organ placement, and structural anatomy through interactive visuals.",
    badge: "Body Systems",
    color: "rose",
    icon: UserRound,
  },
  {
    href: "/biology/cell/animal",
    title: "Animal Cell Structure",
    desc: "Inspect organelles, membranes, nucleus behavior, and core cell biology structures.",
    badge: "Organelle Lab",
    color: "emerald",
    icon: Microscope,
  },
  {
    href: "/biology/cell/plant",
    title: "Plant Cell Structure",
    desc: "Study chloroplasts, cell walls, vacuoles, and plant-specific cellular organization.",
    badge: "Plant Cytology",
    color: "green",
    icon: Leaf,
  },
  {
    href: "/biology/photosynthesis",
    title: "Photosynthesis Simulator",
    desc: "Interact with Light, CO₂, and Water to understand Blackman's Law of Limiting Factors.",
    badge: "Plant Processes",
    color: "amber",
    icon: Sun,
  },
  {
    href: "/biology/blood",
    title: "Blood Transfusion Simulator",
    desc: "Analyze blood groups, compatibility rules, and transfusion decision workflows.",
    badge: "Compatibility",
    color: "red",
    icon: HeartPulse,
  },
  {
    href: "/biology/brainNeuron",
    title: "Brain Neuron",
    desc: "Trace stimulus, response, neuron signaling, and electrochemical communication pathways.",
    badge: "Neural Signals",
    color: "violet",
    icon: Brain,
  },
];

export default function BiologyPage() {
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "Biology Hub",
      theory:
        "Welcome to the OpenLabs Biology Portal. Explore cellular structures, human anatomy, blood compatibility, and neural signaling through interactive simulations and visual learning modules.",
      extraContext:
        "Exploring the biology index route and virtual life science experiment catalog.",
    });
  }, [setExperimentData]);

  return (
    <main className="min-h-screen text-foreground pb-20 pt-8 font-sans relative overflow-hidden bg-[radial-gradient(hsl(var(--border))_1.5px,transparent_1.5px)] bg-[size:24px_24px]">
      <div className="absolute top-12 left-1/4 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 h-[500px] w-[500px] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="max-w-7xl mx-auto px-4 md:px-8 relative z-10"
      >
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition font-medium">Home</Link>
          <span>/</span>
          <span className="text-emerald-600 font-bold">Biology</span>
        </nav>

        <div className="space-y-4 mb-12 text-left">
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider shadow-sm"
          >
            <Dna className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
            Life Science Gateway
          </motion.div>

          <motion.h1
            variants={item}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight leading-none"
          >
            Biology <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-rose-600 bg-clip-text text-transparent drop-shadow-sm">Interactive Labs</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-muted-foreground text-base md:text-lg font-medium max-w-3xl leading-relaxed"
          >
            Explore living systems from molecular cells to full-body anatomy. OpenLabs Biology brings organelles, blood compatibility, neural signaling, and human systems into focused interactive workspaces.
          </motion.p>
        </div>

        <motion.div
          layout
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16"
        >
          {cards.map((card) => {
            const Icon = card.icon;
            const colorClasses =
              card.color === "rose" ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-100 dark:border-rose-900 group-hover:border-rose-400 group-hover:shadow-rose-100/50" :
              card.color === "emerald" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-100 dark:border-emerald-900 group-hover:border-emerald-400 group-hover:shadow-emerald-100/50" :
              card.color === "green" ? "bg-green-50 dark:bg-green-950/40 text-green-600 border-green-100 dark:border-green-900 group-hover:border-green-400 group-hover:shadow-green-100/50" :
              card.color === "red" ? "bg-red-50 dark:bg-red-950/40 text-red-600 border-red-100 dark:border-red-900 group-hover:border-red-400 group-hover:shadow-red-100/50" :
              card.color === "amber" ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-100 dark:border-amber-900 group-hover:border-amber-400 group-hover:shadow-amber-100/50" :
              "bg-violet-50 dark:bg-violet-950/40 text-violet-600 border-violet-100 dark:border-violet-900 group-hover:border-violet-400 group-hover:shadow-violet-100/50";

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
                  className="block h-full bg-card rounded-3xl border border-border p-6 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-muted group-hover:bg-emerald-500/20 transition-all" />

                  <div>
                    <div className="flex justify-between items-start gap-3 mb-6">
                      <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center transition shadow-sm ${colorClasses}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-lg border border-border shadow-inner">
                        {card.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-foreground group-hover:text-emerald-600 transition-colors mb-2.5 tracking-tight leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border text-[10px] font-extrabold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Enter Laboratory <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.section
          variants={item}
          className="bg-card border border-border/80 rounded-3xl p-8 lg:p-10 shadow-md relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-wider text-xs">
                <BookOpen className="h-4 w-4 animate-pulse" /> Curriculum Alignment
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                From Cell Biology to Human Physiology
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                Biology modules support core classroom topics including cell structure, organ systems, blood groups, homeostasis, and nervous system signaling. Each lab is designed for quick conceptual inspection and repeated exploration.
              </p>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                Use the hub as a launchpad for visual revision, interactive assignments, and guided life-science experiments across middle school, high school, and foundational undergraduate biology.
              </p>
            </div>

            <div className="lg:col-span-4 bg-muted border border-border p-6 rounded-2xl flex flex-col justify-center text-center shadow-inner">
              <Compass className="h-10 w-10 text-emerald-600 mx-auto mb-3 animate-spin [animation-duration:12s]" />
              <h4 className="font-extrabold text-foreground text-sm mb-1">Living Systems Map</h4>
              <p className="text-[11px] text-muted-foreground leading-normal font-medium">
                Navigate biological organization from cells and tissues to organs, systems, and whole-body responses.
              </p>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}
