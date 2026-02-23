"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useChat } from "../components/ChatContext";

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
    href: "/biology/human",
    title: "Human Anatomy",
    desc: "Explore the structure of human body using interactive visuals.",
  },
  {
    href: "/biology/cell/animal",
    title: "Animal Cell Structure",
    desc: "Explore the structure of animal cells using interactive visuals.",
  },
  {
    href: "/biology/cell/plant",
    title: "Plant Cell Structure",
    desc: "Explore the structure of plant cells using interactive visuals.",
  },
];

export default function BiologyPage() {
  // Chatbot 
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "Biology Page",
      theory: "",
      extraContext: ``,
    });
  }, []);
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
          Biology
        </motion.h1>

        <motion.p variants={item} className="text-gray-600 mb-6">
          Biology experiments and content to be added.
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
                className="block h-full bg-white rounded-xl border-2 border-gray-200 shadow-sm p-5 cursor-default"

              >
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="text-sm text-gray-500 mt-2">
                  {card.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}
