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
      staggerChildren: 0.12,
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
      ease: [0.16, 1, 0.3, 1], // easeOut
    },
  },
};

const cards = [
  {
    href: "/computer-science/logic-gates/and-gate",
    title: "AND Gate",
    desc: "Interactive lab for visualising working of AND Gate.",
  },

  {
    href: "/computer-science/logic-gates/or-gate",
    title: "OR Gate",
    desc: "Interactive lab for visualising working of OR Gate.",
  },

    {
    href: "/computer-science/logic-gates/not-gate",
    title: "NOT Gate",
    desc: "Interactive lab for visualising working of NOT Gate.",
  },
];

export default function LogicGates() {
  return (
    <main className="min-h-screen p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="max-w-6xl mx-auto"
      >
        {/* -------- Header -------- */}
        <motion.h1 variants={item} className="text-2xl font-bold">
          Code Visualisation
        </motion.h1>

        <motion.p variants={item} className="text-gray-600 mb-6">
          Coding related experiments.
        </motion.p>

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
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <Link
                href={card.href}
                className="block h-full bg-white rounded-xl border-2 border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-lg p-5 transition"
              >
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{card.desc}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}
