// src/components/ElementCard.jsx
"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ElementCard({ element, onOpen }) {
  if (!element) return null;
  const { atomicNumber, symbol, name, category } = element;

  const categoryColors = {
    "alkali metal": "bg-red-300",
    "alkaline earth metal": "bg-orange-300",
    lanthanide: "bg-amber-300",
    actinide: "bg-yellow-300",
    "noble gas": "bg-blue-300",
    "transition metal": "bg-indigo-300",
    "post-transition metal": "bg-slate-300",
    metalloid: "bg-emerald-300",
    nonmetal: "bg-lime-300",
    halogen: "bg-violet-300",
  };

  const colorClass = categoryColors[category] || "bg-gray-300";

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.7, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: -6 }}

      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}

      transition={{
        type: "spring",
        stiffness: 260,
        damping: 18
      }}

      onClick={() => onOpen(element)}
      data-period={element.period}
      data-group={element.group}

      className={`group relative w-full aspect-square p-1 sm:p-1.5 md:p-2 
        rounded-xl border-2 border-gray-200 
        bg-gradient-to-br from-white to-slate-50 
        shadow-sm hover:shadow-lg hover:border-blue-400 
        transform-gpu transition-all 
        text-left flex flex-col justify-between items-center overflow-hidden
        focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-300`
      }

      aria-label={`${name} (${symbol}), atomic number ${atomicNumber}`}
      role="gridcell"
      type="button"
    >
      {/* Atomic number */}
      <div className="absolute top-0 left-0 rounded px-2 py-0.5 text-[0.65rem] font-semibold text-gray-700">
        {atomicNumber}
      </div>

      {/* Category dot */}
      <span
        className={`absolute top-1 right-0 w-3 h-3 rounded-xl border border-white ${colorClass}`}
        aria-hidden="true"
      />

      {/* Symbol */}
      <div className="flex-grow flex items-center justify-center w-full">
        <div className="text-lg sm:text-xl md:text-2xl font-extrabold text-center text-gray-900 group-hover:text-blue-600 tracking-tight">
          {symbol}
        </div>
      </div>

      {/* Name */}
      <div className="w-full text-center mt-2">
        <div className="text-xs sm:text-sm text-gray-600 truncate px-1">
          {name}
        </div>
      </div>
    </motion.button>
  );
}
