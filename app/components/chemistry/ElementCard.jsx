// src/components/ElementCard.jsx
"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ElementCard({ element, onOpen }) {
  if (!element) return null;
  const { atomicNumber, symbol, name, category, atomicMass } = element;

  const categoryColors = {
    "alkali-metal": "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-400 hover:shadow-rose-100",
    "alkaline-earth": "border-orange-200 bg-orange-50 text-orange-700 hover:border-orange-400 hover:shadow-orange-100",
    lanthanide: "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-400 hover:shadow-amber-100",
    actinide: "border-yellow-200 bg-yellow-50 text-yellow-700 hover:border-yellow-400 hover:shadow-yellow-100",
    "noble-gas": "border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-400 hover:shadow-sky-100",
    "transition-metal": "border-indigo-200 bg-indigo-50 text-indigo-700 hover:border-indigo-400 hover:shadow-indigo-100",
    "post-transition": "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 hover:shadow-slate-100",
    metalloid: "border-teal-200 bg-teal-50 text-teal-700 hover:border-teal-400 hover:shadow-teal-100",
    nonmetal: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400 hover:shadow-emerald-100",
    halogen: "border-violet-200 bg-violet-50 text-violet-700 hover:border-violet-400 hover:shadow-violet-100",
  };

  const colorClass = categoryColors[category] || "border-slate-200 bg-white text-slate-700 hover:border-indigo-300";
  const dotClass = colorClass.split(" ").find((token) => token.startsWith("text-"))?.replace("text-", "bg-") || "bg-slate-400";

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
        rounded-lg border bg-card sm:rounded-2xl
        shadow-none hover:shadow-md sm:shadow-sm sm:hover:shadow-lg
        transform-gpu transition-all duration-200
        text-left flex flex-col justify-between items-center overflow-hidden
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2
        ${colorClass}`
      }

      aria-label={`${name} (${symbol}), atomic number ${atomicNumber}`}
      role="gridcell"
      type="button"
    >
      {/* Atomic number */}
      <div className="hidden sm:block absolute top-1.5 left-2 text-[9px] sm:text-[10px] font-black font-mono text-muted-foreground">
        {atomicNumber}
      </div>

      {/* Category dot */}
      <span
        className={`hidden sm:block absolute top-2 right-2 h-2 w-2 rounded-full ring-2 ring-card ${dotClass}`}
        aria-hidden="true"
      />

      {/* Symbol */}
      <div className="flex-grow flex items-center justify-center w-full">
        <div className="text-[10px] min-[380px]:text-xs sm:text-xl md:text-2xl font-black text-center tracking-tight leading-none">
          {symbol}
        </div>
      </div>

      {/* Name */}
      <div className="hidden sm:block w-full text-center">
        <div className="text-[9px] sm:text-[10px] text-muted-foreground font-bold truncate px-1 leading-tight">
          {name}
        </div>
        <div className="hidden xl:block text-[8px] text-muted-foreground font-mono truncate mt-0.5">
          {atomicMass}
        </div>
      </div>
    </motion.button>
  );
}
