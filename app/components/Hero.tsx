"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // easeOut
    },
  },
};

export default function Hero() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        layout
        className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-md max-w-7xl mx-auto"
        transition={{
          layout: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1], // easeInOut
          },
        }}
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          layout
          transition={{ layout: { duration: 0.6 } }}
          className="flex flex-col-reverse lg:flex-row items-center gap-10 p-6 sm:p-10 lg:p-14"
        >
          {/* -------- Left Content -------- */}
          <motion.div
            variants={item}
            layout
            className="w-full lg:w-1/2 text-center lg:text-left"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-extrabold leading-tight">
              Experience Science — anywhere, anytime
            </h1>

            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-700 max-w-xl mx-auto lg:mx-0">
              A web-based visual science laboratory built for learning and exploration.
            </p>

            {/* -------- Buttons -------- */}
            <motion.div
              layout
              className="mt-6 sm:mt-8 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4"
            >
              {["Physics", "Chemistry", "Biology"].map((itemName) => (
                <motion.div
                  key={itemName}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={`/${itemName.toLowerCase()}`}
                    className="block px-4 py-2 sm:px-5 sm:py-3 rounded-lg bg-white text-sm sm:text-base font-medium shadow-sm hover:shadow-md transition"
                  >
                    {itemName}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* -------- Right Image -------- */}
          <motion.div
            variants={item}
            layout
            className="w-full lg:w-1/2 flex justify-center lg:justify-end"
          >
            <motion.div
              layout
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: [0.4, 0, 0.2, 1], // easeInOut
              }}
              className="relative w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[520px]"
            >
              <Image
                src="/images/scientist.png"
                width={1000}
                height={1000}
                alt="Scientist illustration"
                className="w-full h-auto object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
