"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ElementCard({ element, onOpen }) {
  if (!element) return null;
  const { atomicNumber, symbol, name, category, atomicMass } = element;

  const categoryStyles = {
    "alkali-metal": {
      card: "border-rose-500/30 bg-rose-500/10 dark:bg-rose-950/25 hover:border-rose-500 hover:bg-rose-500/20",
      text: "text-rose-600 dark:text-rose-400",
      dot: "bg-rose-500",
    },
    "alkaline-earth": {
      card: "border-orange-500/30 bg-orange-500/10 dark:bg-orange-950/25 hover:border-orange-500 hover:bg-orange-500/20",
      text: "text-orange-600 dark:text-orange-400",
      dot: "bg-orange-500",
    },
    lanthanide: {
      card: "border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/25 hover:border-amber-500 hover:bg-amber-500/20",
      text: "text-amber-600 dark:text-amber-400",
      dot: "bg-amber-500",
    },
    actinide: {
      card: "border-yellow-500/30 bg-yellow-500/10 dark:bg-yellow-950/25 hover:border-yellow-500 hover:bg-yellow-500/20",
      text: "text-yellow-600 dark:text-yellow-400",
      dot: "bg-yellow-500",
    },
    "noble-gas": {
      card: "border-sky-500/30 bg-sky-500/10 dark:bg-sky-950/25 hover:border-sky-500 hover:bg-sky-500/20",
      text: "text-sky-600 dark:text-sky-400",
      dot: "bg-sky-500",
    },
    "transition-metal": {
      card: "border-indigo-500/30 bg-indigo-500/10 dark:bg-indigo-950/25 hover:border-indigo-500 hover:bg-indigo-500/20",
      text: "text-indigo-600 dark:text-indigo-400",
      dot: "bg-indigo-500",
    },
    "post-transition": {
      card: "border-blue-500/30 bg-blue-500/10 dark:bg-blue-950/25 hover:border-blue-500 hover:bg-blue-500/20",
      text: "text-blue-600 dark:text-blue-400",
      dot: "bg-blue-500",
    },
    metalloid: {
      card: "border-teal-500/30 bg-teal-500/10 dark:bg-teal-950/25 hover:border-teal-500 hover:bg-teal-500/20",
      text: "text-teal-600 dark:text-teal-400",
      dot: "bg-teal-500",
    },
    nonmetal: {
      card: "border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/25 hover:border-emerald-500 hover:bg-emerald-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
    halogen: {
      card: "border-violet-500/30 bg-violet-500/10 dark:bg-violet-950/25 hover:border-violet-500 hover:bg-violet-500/20",
      text: "text-violet-600 dark:text-violet-400",
      dot: "bg-violet-500",
    },
  };

  const currentStyle = categoryStyles[category] || {
    card: "border-border bg-card hover:border-primary/50",
    text: "text-foreground",
    dot: "bg-slate-400",
  };

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.7, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: -6 }}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 18
      }}
      onClick={() => onOpen(element)}
      data-period={element.period}
      data-group={element.group}
      className={`group relative w-full aspect-square p-0.5 sm:p-1.5 lg:p-2
        rounded-lg border sm:rounded-2xl
        shadow-sm hover:shadow-md
        transform-gpu transition-all duration-200
        text-left flex flex-col justify-between items-center overflow-hidden
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${currentStyle.card}`
      }
      aria-label={`${name} (${symbol}), atomic number ${atomicNumber}`}
      role="gridcell"
      type="button"
    >
      {/* Atomic number */}
      <div className="hidden sm:block absolute top-1.5 left-2 text-[9px] sm:text-[10px] font-black font-mono text-muted-foreground/80">
        {atomicNumber}
      </div>

      {/* Category dot */}
      <span
        className={`hidden sm:block absolute top-2 right-2 h-2 w-2 rounded-full shadow-sm ring-1 ring-border/50 ${currentStyle.dot}`}
        aria-hidden="true"
      />

      {/* Symbol */}
      <div className="flex-grow flex items-center justify-center w-full">
        <div className={`text-[11px] min-[380px]:text-xs sm:text-xl md:text-2xl font-black text-center tracking-tight leading-none ${currentStyle.text}`}>
          {symbol}
        </div>
      </div>

      {/* Name */}
      <div className="hidden sm:block w-full text-center">
        <div className="text-[9px] sm:text-[10px] text-foreground/80 font-bold truncate px-1 leading-tight">
          {name}
        </div>
        <div className="hidden xl:block text-[8px] text-muted-foreground/70 font-mono truncate mt-0.5">
          {atomicMass}
        </div>
      </div>
    </motion.button>
  );
}
