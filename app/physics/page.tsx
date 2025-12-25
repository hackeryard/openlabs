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
    href: "/physics/simplependulum",
    title: "Simple Pendulum",
    desc: "Simulate pendulum motion and compare theory vs measured period.",
  },
  {
    href: "/physics/projectilemotion",
    title: "Projectile Motion",
    desc: "Simulate trajectories and measure range & time-of-flight.",
  },
  {
    href: "/physics/hookelaw",
    title: "Hooke's Law",
    desc: "Mass–spring system: observe oscillations and measure period.",
  },
  {
    href: "/physics/ohmslaw",
    title: "Ohm's Law",
    desc: "Explore V–I behavior with virtual instruments.",
  },
  {
    href: "/physics/waveoptics",
    title: "Wave Optics",
    desc: "Diffraction & interference lab (Fraunhofer).",
  },
  {
    href: "/physics/rclab",
    title: "RC Lab",
    desc: "RC circuit charging / discharging experiments.",
  },
  {
    href: "/physics/energyconservation",
    title: "Energy Conservation",
    desc: "Investigate energy transformation and conservation.",
  },
  {
    href: "/physics/uniformmotionlab",
    title: "Uniform Motion Lab",
    desc: "Uniform linear motion using a moving object.",
  },
  {
    href: "/physics/freefall",
    title: "Free Fall Lab",
    desc: "Free Fall demonstration of an object.",
  },
  {
    href: "/physics/speedoflight",
    title: "Speed of Light Lab",
    desc: "Demonstration of speed of light in different media.",
  },
];

export default function PhysicsPage() {
  return (
    <main className="min-h-screen p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="max-w-6xl mx-auto"
      >
        {/* -------- Header -------- */}
        <motion.h1
          variants={item}
          className="text-2xl font-bold"
        >
          Physics Experiments
        </motion.h1>

        <motion.p
          variants={item}
          className="text-gray-600 mb-6"
        >
          This page will host physics experiment links and landing UI.
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
        