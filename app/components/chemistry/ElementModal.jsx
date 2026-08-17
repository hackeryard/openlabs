"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Activity,
  Atom,
  Calendar,
  ExternalLink,
  FlaskConical,
  Hash,
  Layers,
  Scale,
  X,
  Zap,
} from "lucide-react";

/* Helper: build image path from element name */
function getElementImageSrc(name) {
  if (!name) return null;
  return `/images/elements/${name
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z]/g, "")}.jpg`;
}

const categoryStyles = {
  "alkali-metal": {
    label: "Alkali Metal",
    badge: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    panel: "from-rose-500/10 via-card to-card",
    accent: "text-rose-600 dark:text-rose-400",
  },
  "alkaline-earth": {
    label: "Alkaline Earth",
    badge: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
    panel: "from-orange-500/10 via-card to-card",
    accent: "text-orange-600 dark:text-orange-400",
  },
  lanthanide: {
    label: "Lanthanide",
    badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    panel: "from-amber-500/10 via-card to-card",
    accent: "text-amber-600 dark:text-amber-400",
  },
  actinide: {
    label: "Actinide",
    badge: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
    panel: "from-yellow-500/10 via-card to-card",
    accent: "text-yellow-600 dark:text-yellow-400",
  },
  "noble-gas": {
    label: "Noble Gas",
    badge: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
    panel: "from-sky-500/10 via-card to-card",
    accent: "text-sky-600 dark:text-sky-400",
  },
  "transition-metal": {
    label: "Transition Metal",
    badge: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    panel: "from-indigo-500/10 via-card to-card",
    accent: "text-indigo-600 dark:text-indigo-400",
  },
  "post-transition": {
    label: "Post-Transition Metal",
    badge: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30",
    panel: "from-slate-500/10 via-card to-card",
    accent: "text-slate-600 dark:text-slate-400",
  },
  metalloid: {
    label: "Metalloid",
    badge: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    panel: "from-teal-500/10 via-card to-card",
    accent: "text-teal-600 dark:text-teal-400",
  },
  nonmetal: {
    label: "Nonmetal",
    badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    panel: "from-emerald-500/10 via-card to-card",
    accent: "text-emerald-600 dark:text-emerald-400",
  },
  halogen: {
    label: "Halogen",
    badge: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
    panel: "from-violet-500/10 via-card to-card",
    accent: "text-violet-600 dark:text-violet-400",
  },
};

function getCategoryStyle(category) {
  return (
    categoryStyles[category] || {
      label: category?.replace(/-/g, " ") || "Element",
      badge: "bg-muted text-muted-foreground border-border",
      panel: "from-muted/20 via-card to-card",
      accent: "text-indigo-500",
    }
  );
}

function PropertyTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-card p-2.5 shadow-sm">
      <div className="mb-1 flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3 text-indigo-500 dark:text-indigo-400" />
        {label}
      </div>
      <div
        className="min-h-4 truncate font-mono text-xs font-black text-foreground"
        title={String(value ?? "—")}
      >
        {value ?? "—"}
      </div>
    </div>
  );
}

export default function ElementModal({ element, onClose }) {
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();

      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (closeRef.current) closeRef.current.focus();
  }, [element]);

  if (!element) return null;

  const {
    atomicNumber,
    symbol,
    name,
    atomicMass,
    category,
    electronConfiguration,
    electronConfig,
    yearDiscovered,
    electronegativity,
    period,
    group,
    block,
    summary,
  } = element;

  const style = getCategoryStyle(category);
  const imageSrc = getElementImageSrc(name);

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`element-${atomicNumber}-title`}
      className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Container */}
      <div
        ref={dialogRef}
        className="relative flex w-full max-w-3xl max-h-[90vh] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
      >
        {/* Top Gradient Accent */}
        <div className="h-1 shrink-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Close Button */}
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute right-3 top-4 z-30 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground shadow-sm transition hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Close element details"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content Area */}
        <div className="flex flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
          {/* Identity panel */}
          <aside
            className={`relative flex shrink-0 flex-col overflow-hidden bg-gradient-to-b ${style.panel} p-5 md:w-[260px] md:overflow-y-auto`}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col gap-4 md:gap-3">
              <div className="flex items-center justify-between gap-2 pr-9">
                <span
                  className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${style.badge}`}
                >
                  {style.label}
                </span>
                <span className="font-mono text-[10px] font-black text-muted-foreground">
                  Z = {atomicNumber}
                </span>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card/80 p-4 text-center shadow-lg backdrop-blur">
                <div
                  className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card shadow-inner ${style.accent}`}
                >
                  <span className="text-3xl font-black tracking-tight">
                    {symbol}
                  </span>
                </div>
                <h2
                  id={`element-${atomicNumber}-title`}
                  className="text-2xl font-black tracking-tight text-foreground"
                >
                  {name}
                </h2>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Atomic mass {atomicMass ?? "—"} u
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-border bg-card/80 p-2 text-center shadow-sm">
                  <div className="font-mono text-base font-black text-foreground">
                    {period ?? "—"}
                  </div>
                  <div className="text-[8px] font-black uppercase tracking-wider text-muted-foreground">
                    Period
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card/80 p-2 text-center shadow-sm">
                  <div className="font-mono text-base font-black text-foreground">
                    {group ?? "—"}
                  </div>
                  <div className="text-[8px] font-black uppercase tracking-wider text-muted-foreground">
                    Group
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card/80 p-2 text-center shadow-sm">
                  <div className="font-mono text-base font-black text-foreground">
                    {block?.toUpperCase() ?? "—"}
                  </div>
                  <div className="text-[8px] font-black uppercase tracking-wider text-muted-foreground">
                    Block
                  </div>
                </div>
              </div>

              <div className="flex h-28 md:h-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card/70 p-2 shadow-inner">
                <img
                  src={imageSrc}
                  alt={name}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          </aside>

          {/* Detail panel */}
          <section className="relative flex flex-1 flex-col md:overflow-y-auto">
            <div className="space-y-4 p-5 md:space-y-5 md:p-6">
              <div className="pr-10">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                  <FlaskConical className="h-3.5 w-3.5" />
                  Element Monograph
                </div>
                <h3 className="mt-1 text-xl font-black tracking-tight text-foreground">
                  Atomic profile and laboratory notes
                </h3>
                <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground">
                  Review core periodic data, electron configuration, and chemical context before opening the full atom page.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <PropertyTile
                  icon={Hash}
                  label="Atomic No."
                  value={atomicNumber}
                />
                <PropertyTile
                  icon={Scale}
                  label="Atomic Mass"
                  value={atomicMass ? `${atomicMass} u` : "—"}
                />
                <PropertyTile
                  icon={Layers}
                  label="Block"
                  value={block ? `${block.toUpperCase()} block` : "—"}
                />
                <PropertyTile
                  icon={Zap}
                  label="Electronegativity"
                  value={electronegativity ?? "—"}
                />
                <PropertyTile
                  icon={Calendar}
                  label="Discovered"
                  value={yearDiscovered ?? "—"}
                />
                <PropertyTile
                  icon={Activity}
                  label="Category"
                  value={style.label}
                />
              </div>

              <div className="rounded-2xl border border-border bg-muted/40 p-3 shadow-inner">
                <div className="mb-1.5 flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                  <Atom className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                  Electron Configuration
                </div>
                <div className="break-words rounded-xl border border-border bg-card px-3 py-2 font-mono text-xs font-black text-foreground">
                  {electronConfiguration || electronConfig || "—"}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
                <div className="mb-1.5 text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                  Summary / Notes
                </div>
                <p className="whitespace-pre-wrap text-xs font-medium leading-relaxed text-muted-foreground">
                  {summary ||
                    `${name} is classified as ${style.label.toLowerCase()} in period ${period ?? "—"} and group ${
                      group ?? "—"
                    }. Open the full atom page for an expanded model and detailed chemistry walkthrough.`}
                </p>
              </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="sticky bottom-0 z-20 mt-auto border-t border-border bg-card/95 p-4 backdrop-blur sm:px-6">
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-black text-muted-foreground shadow-sm transition hover:bg-accent hover:text-foreground"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-indigo-950/20 transition hover:bg-indigo-700"
                  onClick={() => {
                    onClose();
                    router.push(
                      `/chemistry/periodictable/atom/${atomicNumber}`,
                    );
                  }}
                >
                  View Atom Page
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
