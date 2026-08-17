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
  s: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30",
  p: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
  d: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30",
  f: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30",
};

const ORBITAL_BOX = {
  s: "border-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-300 shadow-sm",
  p: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 shadow-sm",
  d: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300 shadow-sm",
  f: "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-300 shadow-sm",
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
    <div className="space-y-3">
      <h3 className="font-extrabold text-foreground text-sm uppercase tracking-wider">
        Orbital Energy Diagram
      </h3>

      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2">
        {[...orbitals].reverse().map((o, idx) => {
          const count =
            o.type === "s" ? 1 : o.type === "p" ? 3 : o.type === "d" ? 5 : 7;

          let remaining = o.electrons;

          return (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-12 font-mono font-bold text-xs text-muted-foreground">{o.label}</div>
              <div className="flex gap-1.5">
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
                      className={`w-9 h-8 rounded-lg flex items-center justify-center border font-bold text-sm font-mono transition-all ${ORBITAL_BOX[o.type]}`}
                    >
                      {arrows || <span className="opacity-20">&bull;</span>}
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
  onComplete,
}) {
  React.useEffect(() => {
    if (onComplete) onComplete();
  }, [onComplete]);
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
    <div className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-foreground tracking-tight">Electronic Configuration</h2>
        <p className="text-muted-foreground text-sm font-medium mt-0.5">
          {name} ({symbol}) &bull; Atomic Number {atomicNumber}
        </p>
      </div>

      {/* Exception */}
      {isException && (
        <div className="border-l-4 border-amber-500 bg-amber-500/10 p-4 rounded-2xl">
          <div className="font-extrabold text-amber-700 dark:text-amber-300 text-sm">
            Electron Configuration Exception
          </div>
          <div className="text-xs text-amber-800 dark:text-amber-200/90 mt-1 leading-relaxed">
            {exceptionReason}
          </div>
        </div>
      )}

      {/* Orbital Filling */}
      <div className="space-y-2">
        <h3 className="font-extrabold text-foreground text-sm uppercase tracking-wider">Orbital Filling Sequence</h3>
        <div className="flex flex-wrap gap-1.5">
          {orbitals.map((o, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold ${ORBITAL_COLORS[o.type]}`}
            >
              {o.label}
              <sup>{o.electrons}</sup>
            </span>
          ))}
        </div>
      </div>

      {/* Visual Orbital Energy Diagram */}
      <OrbitalDiagram orbitals={orbitals} />

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-bold font-mono border-t border-border pt-4">
        {Object.entries(ORBITAL_COLORS).map(([key, color]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-lg ${color}`}>{key}</span>
            <span className="text-muted-foreground uppercase">{key}-orbital</span>
          </div>
        ))}
      </div>

      {/* Shell distribution */}
      <div className="space-y-2">
        <h3 className="font-extrabold text-foreground text-sm uppercase tracking-wider">Shell-wise Distribution</h3>
        <div className="flex flex-wrap gap-2.5">
          {Object.entries(shells).map(([shell, count]) => (
            <div key={shell} className="px-4 py-2 rounded-2xl bg-muted/60 border border-border">
              <div className="text-[10px] font-black uppercase text-muted-foreground">Shell {shell}</div>
              <div className="font-mono font-black text-lg text-foreground">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
        <div className="border border-border bg-muted/30 rounded-2xl p-4">
          <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Valence Electrons</div>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
            {valenceElectrons}
          </div>
        </div>

        <div className="border border-border bg-muted/30 rounded-2xl p-4">
          <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Periodic Table Block</div>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400 uppercase font-mono mt-1">{block}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {BLOCK_DESCRIPTION[block]}
          </div>
        </div>
      </div>
    </div>
  );
}
