"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Beaker, Atom, Dna, Code, ArrowRight } from "lucide-react";

/* ---------------- Animations (Optimized for performance) ---------------- */
const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const labsData = {
  "Physics": {
    color: "from-blue-600 to-cyan-500",
    shadow: "shadow-blue-200/50",
    icon: <Atom className="w-6 h-6" aria-hidden="true" />,
    items: [
      { name: "Free Fall", path: "/physics/freefall" },
      { name: "Projectile Motion", path: "/physics/projectilemotion" },
      { name: "Ohm's Law", path: "/physics/ohmslaw" },
      { name: "Wave Optics", path: "/physics/waveoptics" },
    ],
  },
  "Chemistry": {
    color: "from-emerald-600 to-teal-400",
    shadow: "shadow-emerald-200/50",
    icon: <Beaker className="w-6 h-6" aria-hidden="true" />,
    items: [
      { name: "Periodic Table", path: "/chemistry/periodictable" },
      { name: "Chemical Bonds", path: "/chemistry/chemicalbonds" },
      { name: "Reaction Simulator", path: "/chemistry/reaction-simulation" },
    ],
  },
  "Biology": {
    color: "from-rose-600 to-pink-500",
    shadow: "shadow-rose-200/50",
    icon: <Dna className="w-6 h-6" aria-hidden="true" />,
    items: [
      { name: "Animal Cell", path: "/biology/cell/animal" },
      { name: "Plant Cell", path: "/biology/cell/plant" },
      { name: "Human Anatomy", path: "/biology/human" },
    ],
  },
  "Computer Science": {
    color: "from-violet-600 to-purple-500",
    shadow: "shadow-purple-200/50",
    icon: <Code className="w-6 h-6" aria-hidden="true" />,
    items: [
      { name: "HTML/CSS/JS Editor", path: "/computer-science/code-lab/html-css-js" },
      { name: "Logic Gates", path: "/computer-science/logic-gates" },
    ],
  },
};

const mainButtons = [
  { label: "Physics", path: "/physics", bg: "bg-blue-700" },      // Changed from 600
  { label: "Chemistry", path: "/chemistry", bg: "bg-emerald-700" }, // Changed from 600
  { label: "Biology", path: "/biology", bg: "bg-rose-700" },      // Changed from 600
  { label: "CS", path: "/computer-science", bg: "bg-violet-700" }, // Changed from 600
];

export default function Hero() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      {/* -------- Hero Section -------- */}
      <section
        className="relative px-4 sm:px-6 lg:px-8 py-12 md:py-24 lg:py-32 flex items-center justify-center overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Optimized Background Gradient (Static for Performance) */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-indigo-100/30 blur-[120px] rounded-full" />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Left Content */}
          <motion.div variants={item} className="text-center lg:text-left order-2 lg:order-1">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-indigo-700 uppercase bg-indigo-50 rounded-full">
              The Future of Learning
            </span>

            <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
              Experience Science <br />
              <span className="text-indigo-600">Anywhere, Anytime.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Ditch the static textbooks. Dive into a high-fidelity virtual laboratory designed for the next generation of scientists.
            </p>

            <nav className="mt-10 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4" aria-label="Quick Access Labs">
              {mainButtons.map((btn) => (
                <Link
                  key={btn.label}
                  href={btn.path}
                  className={`${btn.bg} text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 text-sm sm:text-base`}
                >
                  {btn.label}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Right Image/Illustration */}
          <motion.div
            variants={item}
            className="order-1 lg:order-2 flex justify-center items-center relative"
          >
            {/* Ambient Light Effect */}
            <div className="absolute w-64 h-64 bg-indigo-400/20 blur-3xl rounded-full" />

            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-full max-w-[300px] sm:max-w-[450px] lg:max-w-full"
            >
              <Image
                src="/images/scientist.png"
                width={600}
                height={600}
                alt="3D Illustration of a scientist with floating chemicals"
                className="w-full h-auto drop-shadow-2xl"
                priority
                sizes="(max-w-768px) 100vw, 50vw"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* -------- Lab Grid Section -------- */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white" aria-labelledby="labs-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="labs-heading" className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-4">
              Explore Virtual Labs
            </h2>
            <div className="h-1.5 w-20 bg-indigo-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {Object.entries(labsData).map(([category, data]) => (
              <motion.article
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className={`flex flex-col bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300 group`}
              >
                <div className={`bg-gradient-to-r ${data.color} p-6 text-white`}>
                  <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md mb-4 group-hover:scale-110 transition-transform">
                    {data.icon}
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wider">{category}</h3>
                </div>

                <div className="p-4 sm:p-6 flex-grow space-y-2">
                  {data.items.map((lab) => (
                    <Link
                      key={lab.path}
                      href={lab.path}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group/link"
                      aria-label={`Open ${lab.name} experiment`}
                    >
                      <span className="text-slate-700 font-semibold group-hover/link:text-indigo-600">
                        {lab.name}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover/link:text-indigo-600 group-hover/link:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}