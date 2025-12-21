"use client";

import React from "react";

/* Orbital filling order (Aufbau principle) */
const ORBITALS = [
  { n: 1, type: "s", cap: 2 },
  { n: 2, type: "s", cap: 2 },
  { n: 2, type: "p", cap: 6 },
  { n: 3, type: "s", cap: 2 },
  { n: 3, type: "p", cap: 6 },
  { n: 4, type: "s", cap: 2 },
  { n: 3, type: "d", cap: 10 },
  { n: 4, type: "p", cap: 6 },
  { n: 5, type: "s", cap: 2 },
  { n: 4, type: "d", cap: 10 },
  { n: 5, type: "p", cap: 6 },
  { n: 6, type: "s", cap: 2 },
  { n: 4, type: "f", cap: 14 },
  { n: 5, type: "d", cap: 10 },
  { n: 6, type: "p", cap: 6 },
  { n: 7, type: "s", cap: 2 },
  { n: 5, type: "f", cap: 14 },
  { n: 6, type: "d", cap: 10 },
  { n: 7, type: "p", cap: 6 },
];

const ORBITAL_COLORS = {
  s: "bg-blue-100 text-blue-800",
  p: "bg-green-100 text-green-800",
  d: "bg-orange-100 text-orange-800",
  f: "bg-purple-100 text-purple-800",
};

const ORBITAL_BORDER = {
  s: "border-blue-400",
  p: "border-green-400",
  d: "border-orange-400",
  f: "border-purple-400",
};

const BLOCK_DESCRIPTION = {
  s: "Elements where the outermost electrons occupy s-orbitals.",
  p: "Elements with outer electrons in p-orbitals.",
  d: "Transition metals with d-orbital filling.",
  f: "Inner transition elements (lanthanides & actinides).",
};

/* ================= EXCEPTIONS ================= */
const ELECTRON_EXCEPTIONS = {
  24: {
    fix: [
      { label: "4s", electrons: 1 },
      { label: "3d", electrons: 5 },
    ],
    reason: "Half-filled d-subshell (d⁵) provides extra stability",
  },
  29: {
    fix: [
      { label: "4s", electrons: 1 },
      { label: "3d", electrons: 10 },
    ],
    reason: "Fully filled d-subshell (d¹⁰) is more stable",
  },
  42: {
    fix: [
      { label: "5s", electrons: 1 },
      { label: "4d", electrons: 5 },
    ],
    reason: "Half-filled d-subshell stability",
  },
  46: {
    fix: [
      { label: "5s", electrons: 0 },
      { label: "4d", electrons: 10 },
    ],
    reason: "Completely filled d-subshell",
  },
  47: {
    fix: [
      { label: "5s", electrons: 1 },
      { label: "4d", electrons: 10 },
    ],
    reason: "Filled d-subshell stability",
  },
  79: {
    fix: [
      { label: "6s", electrons: 1 },
      { label: "5d", electrons: 10 },
    ],
    reason: "Relativistic effects + filled d-subshell",
  },
};

/* ================= LOGIC ================= */
function calculateConfiguration(Z) {
  let remaining = Z;
  const orbitals = [];
  const shells = {};

  for (const o of ORBITALS) {
    if (remaining <= 0) break;

    const e = Math.min(o.cap, remaining);
    remaining -= e;

    orbitals.push({
      label: `${o.n}${o.type}`,
      electrons: e,
      type: o.type,
      shell: o.n,
    });

    shells[o.n] = (shells[o.n] || 0) + e;
  }

  let isException = false;
  let exceptionReason = null;

  const exception = ELECTRON_EXCEPTIONS[Z];
  if (exception) {
    isException = true;
    exceptionReason = exception.reason;

    exception.fix.forEach((fix) => {
      const target = orbitals.find((o) => o.label === fix.label);
      if (target) {
        const diff = fix.electrons - target.electrons;
        target.electrons = fix.electrons;
        shells[target.shell] += diff;
      }
    });
  }

  const last = orbitals.filter(o => o.electrons > 0).slice(-1)[0];

  return {
    orbitals,
    shells,
    valenceElectrons: last?.electrons ?? 0,
    block: last?.type ?? "—",
    isException,
    exceptionReason,
  };
}

/* ================= VISUAL ORBITAL DIAGRAM ================= */
function OrbitalDiagram({ orbitals }) {
  return (
    <div>
      <h3 className="font-semibold mb-3">Orbital Energy Diagram</h3>

      <div className="space-y-2">
        {[...orbitals].reverse().map((o, idx) => {
          const count =
            o.type === "s" ? 1 : o.type === "p" ? 3 : o.type === "d" ? 5 : 7;

          let remaining = o.electrons;

          return (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-10 font-semibold text-sm">{o.label}</div>
              <div className="flex gap-1">
                {Array.from({ length: count }).map((_, i) => {
                  let arrows = "";
                  if (remaining > 0) {
                    arrows += "↑";
                    remaining--;
                  }
                  if (remaining > 0) {
                    arrows += "↓";
                    remaining--;
                  }

                  return (
                    <div
                      key={i}
                      className={`w-10 h-8 flex items-center justify-center border ${ORBITAL_BORDER[o.type]}`}
                    >
                      {arrows}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= COMPONENT ================= */
export default function ElectronicConfiguration({
  atomicNumber,
  symbol,
  name,
}) {
  if (!atomicNumber) return null;

  const {
    orbitals,
    shells,
    valenceElectrons,
    block,
    isException,
    exceptionReason,
  } = calculateConfiguration(atomicNumber);

  return (
    <div className="bg-white border rounded-xl p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Electronic Configuration</h2>
        <p className="text-gray-600">
          {name} ({symbol}) — Atomic Number {atomicNumber}
        </p>
      </div>

      {/* Exception */}
      {isException && (
        <div className="border-l-4 border-amber-400 bg-amber-50 p-4 rounded-lg">
          <div className="font-semibold text-amber-800">
            Electron Configuration Exception
          </div>
          <div className="text-sm text-amber-700 mt-1">
            {exceptionReason}
          </div>
        </div>
      )}

      {/* Orbital Filling (existing) */}
      <div>
        <h3 className="font-semibold mb-2">Orbital Filling</h3>
        <div className="flex flex-wrap gap-2">
          {orbitals.map((o, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 rounded-full text-sm font-semibold ${ORBITAL_COLORS[o.type]}`}
            >
              {o.label}
              <sup>{o.electrons}</sup>
            </span>
          ))}
        </div>
      </div>

      {/* NEW VISUAL */}
      <OrbitalDiagram orbitals={orbitals} />

      {/* Legend (existing) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
        {Object.entries(ORBITAL_COLORS).map(([key, color]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded ${color}`}>{key}</span>
            <span className="text-gray-600">orbital</span>
          </div>
        ))}
      </div>

      {/* Shell distribution (existing) */}
      <div>
        <h3 className="font-semibold mb-2">Shell-wise Distribution</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(shells).map(([shell, count]) => (
            <div key={shell} className="px-4 py-2 rounded-lg bg-gray-100">
              <div className="text-xs text-gray-500">Shell {shell}</div>
              <div className="font-bold text-lg">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary (existing) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-gray-500 text-sm">Valence Electrons</div>
          <div className="text-3xl font-bold text-blue-600">
            {valenceElectrons}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="text-gray-500 text-sm">Periodic Table Block</div>
          <div className="text-3xl font-bold uppercase">{block}</div>
          <div className="text-sm text-gray-600 mt-1">
            {BLOCK_DESCRIPTION[block]}
          </div>
        </div>
      </div>
    </div>
  );
}
