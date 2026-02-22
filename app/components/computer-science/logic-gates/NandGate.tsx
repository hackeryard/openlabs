"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function NandGate() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const output = !(a && b) ? 1 : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 flex flex-col items-center">
      
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">
        NAND Gate Visualizer
      </h1>

      {/* GATE SECTION */}
      <div className="flex flex-col md:flex-row items-center gap-12">

        {/* LEFT INPUTS */}
        <div className="flex flex-col gap-8 items-center">

          <div className="text-center flex flew-row">
            <p className="mr-2 my-auto font-semibold">Input A</p>
            <button
              onClick={() => setA(a ? 0 : 1)}
              className={`w-16 h-12 rounded-xl text-xl font-bold transition-all duration-300 ${
                a
                  ? "bg-green-500 shadow-lg shadow-green-400/50"
                  : "bg-red-500 shadow-lg shadow-red-400/40"
              }`}
            >
              {a}
            </button>
          </div>

          <div className="text-center flex flew-row">
            <p className="mr-2 my-auto font-semibold">Input B</p>
            <button
              onClick={() => setB(b ? 0 : 1)}
              className={`w-16 h-12 rounded-xl text-xl font-bold transition-all duration-300 ${
                b
                  ? "bg-green-500 shadow-lg shadow-green-400/50"
                  : "bg-red-500 shadow-lg shadow-red-400/40"
              }`}
            >
              {b}
            </button>
          </div>
        </div>

        {/* WIRES + GATE */}
        <div className="flex items-center gap-6">

          {/* Left Wires */}
          <div className="flex flex-col gap-16">
            <div className={`w-20 h-2 ${a ? "bg-green-400" : "bg-gray-600"}`}></div>
            <div className={`w-20 h-2 ${b ? "bg-green-400" : "bg-gray-600"}`}></div>
          </div>

          {/* NAND Gate */}
          <div className="w-32 h-20 bg-gray-800 border border-gray-600 rounded-2xl flex items-center justify-center text-xl font-bold shadow-xl">
            NAND
          </div>

          {/* Output Wire */}
          <motion.div
            animate={{ opacity: output ? 1 : 0.4 }}
            className={`w-20 h-2 ${output ? "bg-green-400" : "bg-gray-600"}`}
          ></motion.div>

          {/* Output Circle */}
          <p className="mb-2 font-semibold">Output</p>
          <motion.div
            animate={{ scale: output ? 1.2 : 1 }}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition ${
              output
                ? "bg-green-500 shadow-lg shadow-green-400/50"
                : "bg-red-500 shadow-lg shadow-red-400/40"
            }`}
          >
            {output}
          </motion.div>
        </div>
      </div>

      {/* BOOLEAN EXPRESSION */}
      <div className="mt-10 text-lg md:text-xl">
        Y = (A · B)' = ({a} · {b})' ={" "}
        <span className="text-yellow-400 font-bold">{output}</span>
      </div>

      {/* TRUTH TABLE */}
      <div className="mt-8">
        <table className="border border-gray-600 text-center">
          <thead className="bg-gray-800">
            <tr>
              <th className="border px-6 py-2">A</th>
              <th className="border px-6 py-2">B</th>
              <th className="border px-6 py-2">Y</th>
            </tr>
          </thead>
          <tbody>
            {[
              [0, 0],
              [0, 1],
              [1, 0],
              [1, 1],
            ].map(([x, y], i) => (
              <tr
                key={i}
                className={
                  a === x && b === y
                    ? "bg-yellow-500 text-black"
                    : ""
                }
              >
                <td className="border px-6 py-2">{x}</td>
                <td className="border px-6 py-2">{y}</td>
                <td className="border px-6 py-2">
                  {!(x && y) ? 1 : 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </main>
  );
}