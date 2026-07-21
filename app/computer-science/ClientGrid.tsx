"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

type Card = {
  href: string;
  title: string;
  desc: string;
  accent?: string;
};

export default function ClientGrid({
  cards,
  title,
  description,
  intro,
}: {
  cards: Card[];
  title?: string;
  description?: string;
  /** Optional longer-form paragraph rendered under the title/description —
   *  gives the page real body content beyond the card grid (thin-content
   *  fix), not just a one-line summary. */
  intro?: string;
}) {
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <main className="min-h-screen p-6 md:p-12">
      <motion.div initial="hidden" animate="visible" variants={container} className="max-w-6xl mx-auto">
        {title && (
          <div className="mb-10">
            <motion.h1 variants={item} className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </motion.h1>
            {description && (
              <motion.p variants={item} className="text-muted-foreground mt-2">
                {description}
              </motion.p>
            )}
            {intro && (
              <motion.p variants={item} className="text-muted-foreground/90 mt-4 max-w-3xl leading-relaxed">
                {intro}
              </motion.p>
            )}
          </div>
        )}

        <motion.div layout variants={container} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <motion.div key={card.href} variants={item} whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }} className="group relative">
              <Link href={card.href} className="relative block h-full">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${card.accent ?? "from-indigo-400 to-indigo-600"} rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500`} />
                <div className="relative h-full bg-card rounded-xl border border-border p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)] group-hover:shadow-xl group-hover:border-primary/30 transition-all duration-300">
                  <div className={`w-10 h-1 rounded-full bg-gradient-to-r ${card.accent ?? "from-indigo-400 to-indigo-600"} mb-4`} />
                  <h2 className="text-xl font-bold text-foreground group-hover:text-indigo-600 transition-colors">{card.title}</h2>
                  <p className="text-muted-foreground mt-3 leading-relaxed text-sm">{card.desc}</p>
                  <div className="mt-6 flex items-center text-xs font-bold text-muted-foreground group-hover:text-foreground uppercase tracking-widest transition-colors">
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
