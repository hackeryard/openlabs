"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

/* ---------------- Animations ---------------- */

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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
const footerLinks = [
  {
    label: "Physics",
    url: "/physics",
  },
  {
    label: "Chemistry",
    url: "/chemistry",
  },
  {
    label: "Biology",
    url: "/biology",
  },
  {
    label: "Computer Science",
    url: "/computer-science",
  },
];

export default function Footer() {
  return (
    <motion.footer
      initial="hidden"
      animate="visible"
      variants={container}
      className="bg-gradient-to-r from-slate-800 to-indigo-900 text-white py-8"
    >
      <motion.div
        layout
        className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* -------- Brand -------- */}
        <motion.div variants={item}>
          <div className="text-lg font-bold">OpenLabs</div>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Interactive science labs for students and educators. Visualize and
            measure experiments across physics, chemistry and biology.
          </p>
        </motion.div>

        {/* -------- Explore -------- */}
        <motion.div variants={item}>
          <div className="font-semibold">Explore</div>

          <div className="mt-2 text-sm text-slate-200 space-y-1 flex flex-col">
            {footerLinks.map((item) => (
              <Link
                key={item.label}
                href={item.url}
                aria-label={item.label}
                className="hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* -------- Connect -------- */}
        <motion.div variants={item}>
          <div className="font-semibold">Connect</div>
          <p className="text-sm text-slate-200 mt-2">
            Email:{" "}
            <motion.a
              href="mailto:support@openlabs.org.in  "
              whileHover={{ opacity: 0.85 }}
              className="underline underline-offset-2"
            >
              support@openlabs.org.in
            </motion.a>
          </p>
        </motion.div>
      </motion.div>

      {/* -------- Bottom Bar -------- */}
      <motion.div
        variants={item}
        className="mt-6 text-center text-xs text-slate-400"
        suppressHydrationWarning
      >
        OpenLabs - Built for interactive learning
      </motion.div>
    </motion.footer>
  );
}
