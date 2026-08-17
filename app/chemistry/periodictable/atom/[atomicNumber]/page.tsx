import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { elements } from "@/app/src/data/elements";
import {
  Award,
  ShieldAlert,
  GraduationCap,
  Compass,
  Layers,
  Milestone,
  Info,
  Calendar,
  Hash,
  Activity,
  Atom,
  FlaskConical,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Zap,
  Globe,
  Flame,
  Scale,
  Play,
  Orbit,
} from "lucide-react";

interface PageProps {
  params: {
    atomicNumber: string;
  };
}

// 1. Dynamic Category Coloring System for Light & Dark Theme Support
const categoryMap: Record<
  string,
  { label: string; bg: string; text: string; border: string; glow: string; accent: string }
> = {
  nonmetal: {
    label: "Reactive Nonmetal",
    bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/10 hover:border-emerald-500/60",
    accent: "bg-emerald-500",
  },
  "noble-gas": {
    label: "Noble Gas",
    bg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-500/30",
    glow: "shadow-sky-500/10 hover:border-sky-500/60",
    accent: "bg-sky-500",
  },
  "alkali-metal": {
    label: "Alkali Metal",
    bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500/30",
    glow: "shadow-rose-500/10 hover:border-rose-500/60",
    accent: "bg-rose-500",
  },
  "alkaline-earth": {
    label: "Alkaline Earth Metal",
    bg: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500/30",
    glow: "shadow-orange-500/10 hover:border-orange-500/60",
    accent: "bg-orange-500",
  },
  metalloid: {
    label: "Metalloid",
    bg: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-500/30",
    glow: "shadow-teal-500/10 hover:border-teal-500/60",
    accent: "bg-teal-500",
  },
  "post-transition": {
    label: "Post-Transition Metal",
    bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
    glow: "shadow-blue-500/10 hover:border-blue-500/60",
    accent: "bg-blue-500",
  },
  "transition-metal": {
    label: "Transition Metal",
    bg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-500/30",
    glow: "shadow-indigo-500/10 hover:border-indigo-500/60",
    accent: "bg-indigo-500",
  },
  lanthanide: {
    label: "Lanthanide",
    bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/30",
    glow: "shadow-amber-500/10 hover:border-amber-500/60",
    accent: "bg-amber-500",
  },
  actinide: {
    label: "Actinide",
    bg: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-500/30",
    glow: "shadow-yellow-500/10 hover:border-yellow-500/60",
    accent: "bg-yellow-500",
  },
  halogen: {
    label: "Halogen",
    bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/30",
    glow: "shadow-purple-500/10 hover:border-purple-500/60",
    accent: "bg-purple-500",
  },
};

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

const ELECTRON_EXCEPTIONS: Record<number, { reason: string; ideal: string; active: string }> = {
  24: {
    ideal: "[Ar] 3d⁴ 4s²",
    active: "[Ar] 3d⁵ 4s¹",
    reason: "Half-filled d-subshell (d⁵) provides maximum exchange energy and spherical symmetry, thermodynamically stabilizing the atom over the standard 3d⁴ 4s² state.",
  },
  29: {
    ideal: "[Ar] 3d⁹ 4s²",
    active: "[Ar] 3d¹⁰ 4s¹",
    reason: "A completely filled d-subshell (d¹⁰) provides complete electrostatic shielding and symmetry, lowering total electronic energy.",
  },
  41: {
    ideal: "[Kr] 4d³ 5s²",
    active: "[Kr] 4d⁴ 5s¹",
    reason: "Minimizes inter-electronic repulsion in the compact 5s subshell.",
  },
  42: {
    ideal: "[Kr] 4d⁴ 5s²",
    active: "[Kr] 4d⁵ 5s¹",
    reason: "Half-filled 4d⁵ subshell provides maximum quantum exchange stabilization.",
  },
  44: {
    ideal: "[Kr] 4d⁶ 5s²",
    active: "[Kr] 4d⁷ 5s¹",
    reason: "Favors increased d-orbital exchange energy over paired 5s electrons.",
  },
  45: {
    ideal: "[Kr] 4d⁷ 5s²",
    active: "[Kr] 4d⁸ 5s¹",
    reason: "Lowering of the 4d orbital energy relative to 5s in Period 5 transition metals.",
  },
  46: {
    ideal: "[Kr] 4d⁸ 5s²",
    active: "[Kr] 4d¹⁰",
    reason: "Completely filled 4d¹⁰ subshell with 0 electrons in the 5s shell (5s⁰). The extreme stability of a closed d-shell outweighs the cost of promoting two 5s electrons into the 4d orbital, making Palladium unique.",
  },
  47: {
    ideal: "[Kr] 4d⁹ 5s²",
    active: "[Kr] 4d¹⁰ 5s¹",
    reason: "Full d-subshell (4d¹⁰) stability.",
  },
  78: {
    ideal: "[Xe] 4f¹⁴ 5d⁸ 6s²",
    active: "[Xe] 4f¹⁴ 5d⁹ 6s¹",
    reason: "Relativistic orbital contraction and d-subshell stabilization.",
  },
  79: {
    ideal: "[Xe] 4f¹⁴ 5d⁹ 6s²",
    active: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹",
    reason: "Strong relativistic contraction of the 6s orbital combined with filled 5d¹⁰ subshell stability gives Gold its unique nobility and golden hue.",
  },
};

function calculateConfiguration(Z: number) {
  let remaining = Z;
  const orbitals: { label: string; electrons: number; type: string; shell: number }[] = [];
  const shells: Record<number, number> = {};

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

  // Handle known quantum exceptions
  if (Z === 46) {
    return { 1: 2, 2: 8, 3: 18, 4: 18 };
  } else if (Z === 24) {
    return { 1: 2, 2: 8, 3: 13, 4: 1 };
  } else if (Z === 29) {
    return { 1: 2, 2: 8, 3: 18, 4: 1 };
  } else if (Z === 47) {
    return { 1: 2, 2: 8, 3: 18, 4: 18, 5: 1 };
  } else if (Z === 79) {
    return { 1: 2, 2: 8, 3: 18, 4: 32, 5: 18, 6: 1 };
  }

  return shells;
}

const etymologyMap: Record<number, { origin: string; meaning: string; geography: string }> = {
  1: { origin: "Greek 'hydro' + 'genes'", meaning: "Water-former", geography: "Discovered in London, UK (1766)" },
  2: { origin: "Greek 'helios' (Sun)", meaning: "Sun element", geography: "Discovered during solar eclipse in Guntur, India (1868)" },
  6: { origin: "Latin 'carbo'", meaning: "Coal / Charcoal", geography: "Known since ancient prehistoric times globally" },
  8: { origin: "Greek 'oxy' + 'genes'", meaning: "Acid-former", geography: "Co-discovered in Uppsala, Sweden / Wiltshire, UK (1774)" },
  24: { origin: "Greek 'chroma' (Color)", meaning: "Vibrant colored compounds", geography: "Discovered by Louis Nicolas Vauquelin in Paris, France (1797)" },
  26: { origin: "Latin 'ferrum'", meaning: "Strength / Firmness", geography: "Smelted since the early Iron Age (c. 1200 BCE)" },
  29: { origin: "Latin 'cuprum'", meaning: "From Cyprus Island", geography: "Mined in Cyprus since 4000 BCE" },
  46: { origin: "Asteroid 'Pallas' (Greek goddess Pallas Athena)", meaning: "Goddess of wisdom / Defender", geography: "Discovered by William Hyde Wollaston in London, UK (1803)" },
  47: { origin: "Anglo-Saxon 'seolfor' / Latin 'argentum'", meaning: "Shining white / Bright", geography: "Mined in Anatolia & Greece since 3000 BCE" },
  79: { origin: "Proto-Germanic 'gulth' / Latin 'aurum'", meaning: "Glowing dawn / Shining yellow", geography: "Prized in ancient Egypt and Mesopotamia" },
};

function getElementImageSrc(name: string) {
  return `/images/elements/${name
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z]/g, "")}.jpg`;
}

function getElementExplanations(el: any) {
  const name = el.name;
  const symbol = el.symbol;
  const Z = el.atomicNumber;
  const cat = el.category;

  const overviews: Record<number, string> = {
    46: "Palladium is a rare, lustrous silvery-white transition metal and a premier member of the platinum group metals (PGM). Discovered in 1803 by William Hyde Wollaston, it possesses an extraordinary affinity for hydrogen, capable of absorbing up to 900 times its own volume of H₂ gas at standard conditions. It is an indispensable heterogeneous catalyst in automotive emission systems, pharmaceutical synthesis (Suzuki coupling), and clean hydrogen energy tech.",
    1: "Hydrogen is the simplest, lightest, and most abundant chemical element in the universe, constituting roughly 75% of all baryonic mass. It acts as the primary stellar fuel and the elemental backbone of water and organic molecules.",
    6: "Carbon is the foundational cornerstone of all organic chemistry. Its unique capacity for catenation (forming stable covalent bonds with other carbon atoms) gives rise to millions of biological and synthetic molecules.",
    24: "Chromium is a lustrous, corrosion-resistant transition metal famous for creating stainless steel alloys and producing the brilliant green of emeralds and red of rubies.",
    26: "Iron is the most abundant element on Earth by mass and the principal metal of modern engineering. In biology, it forms the active oxygen-binding center in hemoglobin.",
    79: "Gold is a dense, corrosion-proof noble metal revered since antiquity for its beauty, high electrical conductivity, and chemical nobility.",
  };

  const biologicalRoles: Record<number, string> = {
    46: "Palladium has no known biological function in the human body. Because of its exceptional resistance to corrosion and biological inertness, palladium-gold alloys are widely used in high-durability dental crowns and specialized biomedical implants.",
    1: "Hydrogen is present in every living cell, forming water (60% of human weight) and generating the proton motive force that drives ATP synthase.",
    6: "Carbon constitutes 18.5% of human body mass, forming the backbone of carbohydrates, lipids, proteins, and nucleic acids.",
    24: "Chromium (trivalent Cr³⁺) is a trace essential nutrient that potentiates insulin action in glucose metabolism. Hexavalent Cr⁶⁺ is toxic.",
    26: "Iron is critical for life, acting as the oxygen carrier in hemoglobin and the catalytic core in cytochrome enzymes.",
    79: "Gold is biologically inert and non-toxic in its metallic form, with historical therapeutic use in gold salt arthritis treatments.",
  };

  const reactivities: Record<number, string> = {
    46: "Palladium is resistant to corrosion and atmospheric tarnishing at ambient temperatures. It does not react with oxygen under standard conditions but dissolves readily in concentrated nitric acid and hot sulfuric acid, as well as aqua regia. Remarkably, palladium acts as a super-sponge for hydrogen, expanding slightly as it forms palladium hydride (PdHₓ) without losing its metallic ductility.",
    1: "Hydrogen is a versatile reducing agent that burns vigorously in air/oxygen to produce pure water with high energy density.",
    6: "Carbon is chemically versatile, forming single, double, and triple covalent bonds with diverse elements.",
    24: "Chromium passivates spontaneously in air by forming an ultra-thin, impermeable layer of Cr₂O₃.",
    26: "Iron oxidizes in moist air to form porous hydrated iron oxide (rust) and exhibits common +2 and +3 oxidation states.",
    79: "Gold is the most chemically unreactive metal in the periodic table, unaffected by air, moisture, and single acids.",
  };

  const applications: Record<number, string> = {
    46: "Over 80% of all mined palladium is used in automotive catalytic converters to convert toxic hydrocarbons, carbon monoxide, and nitrogen oxides into harmless gases. It is also vital in Suzuki-Miyaura cross-coupling reactions (Nobel Prize in Chemistry 2010), multilayer ceramic capacitors (MLCCs) in smartphones, hydrogen purification membranes, dental alloys, and fine jewelry.",
    1: "Used in ammonia synthesis (Haber process), clean fuel cells, petroleum hydrocracking, and liquid rocket propellant.",
    6: "Employed in carbon fibers, structural steels, lithium-ion battery anodes (graphite), and diamond tools.",
    24: "Used in stainless steel manufacturing, chrome electroplating, and nichrome resistance heating elements.",
    26: "Forms 90% of all refined metals worldwide, used in structural steel, automotive chassis, and tools.",
    79: "Used in aerospace reflective heat shields, semiconductor wire bonding, fine jewelry, and financial reserves.",
  };

  return {
    overview:
      overviews[Z] ||
      `${name} (${symbol}) is an element with atomic number ${Z}, classified as a ${cat.replace(
        "-",
        " "
      )}. Positioned in Period ${el.period}, Group ${el.group}, and ${el.block.toUpperCase()}-block, its chemical and physical profile is defined by its electron configuration (${el.electronConfig}) and periodic trends.`,
    bioRole:
      biologicalRoles[Z] ||
      `${name} does not play a prominent biological role in human biochemistry, existing primarily as a trace element or mineral component in natural ecosystems.`,
    reactivity:
      reactivities[Z] ||
      `${name} exhibits chemical reactivity characteristic of the ${cat.replace(
        "-",
        " "
      )} family, governed by an electronegativity of ${el.electronegativity ?? "n/a"} and standard valence interactions.`,
    industrialUse:
      applications[Z] ||
      `${name} is utilized in industrial fabrication, materials engineering, electronic manufacturing, and advanced laboratory research based on its specific thermodynamic properties.`,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const Z = Number(params.atomicNumber);
  const el = elements.find((e) => e.atomicNumber === Z);

  if (!el) {
    return {
      title: "Element Not Found | OpenLabs",
      description: "Chemical element not found in our interactive periodic table.",
    };
  }

  return {
    title: `${el.name} (${el.symbol}) - Atomic No. ${el.atomicNumber} | Periodic Table | OpenLabs`,
    description: `Scientific profile and interactive 3D laboratory for ${el.name} (${el.symbol}), atomic number ${el.atomicNumber}. Explore orbital configuration, quantum shells, periodic trends, and chemical reactivity.`,
    keywords: [
      el.name,
      el.symbol,
      `atomic number ${el.atomicNumber}`,
      `properties of ${el.name}`,
      `electron configuration of ${el.symbol}`,
      `why is ${el.name} configuration an exception`,
      `${el.name} chemical reactivity`,
      "periodic table of elements",
      "chemistry interactive lab",
      "openlabs chemistry",
    ],
    alternates: {
      canonical: `https://www.openlabs.org.in/chemistry/periodictable/atom/${el.atomicNumber}`,
    },
    openGraph: {
      title: `${el.name} (${el.symbol}) - Interactive Periodic Table | OpenLabs`,
      description: `Scientific monograph and interactive quantum model for ${el.name}. Explore electron configuration, orbitals, and chemical properties.`,
      url: `https://www.openlabs.org.in/chemistry/periodictable/atom/${el.atomicNumber}`,
      type: "website",
    },
  };
}

export default function Page({ params }: PageProps) {
  const Z = Number(params.atomicNumber);
  const el = elements.find((e) => e.atomicNumber === Z);

  if (!el) {
    return notFound();
  }

  const prevEl = elements.find((e) => e.atomicNumber === Z - 1);
  const nextEl = elements.find((e) => e.atomicNumber === Z + 1);

  const categoryStyle = categoryMap[el.category] || {
    label: el.category.replace("-", " "),
    bg: "bg-muted text-muted-foreground border-border",
    text: "text-foreground",
    border: "border-border",
    glow: "shadow-sm hover:border-primary/50",
    accent: "bg-primary",
  };

  const shells = calculateConfiguration(Z);
  const shellArray = Object.values(shells);
  const { overview, bioRole, reactivity, industrialUse } = getElementExplanations(el);
  const etymology = etymologyMap[Z];
  const exception = ELECTRON_EXCEPTIONS[Z];

  const faqs = [
    {
      question: `What are the key physical and atomic properties of ${el.name}?`,
      answer: `${el.name} (${el.symbol}) has an atomic number of ${el.atomicNumber} and a standard atomic mass of ${el.atomicMass} u. It is positioned in Period ${el.period}, Group ${el.group}, in the ${el.block.toUpperCase()}-block, and is classified within the ${categoryStyle.label} category.`,
    },
    {
      question: `What is the electron configuration of ${el.name}?`,
      answer: `The ground-state electron configuration of ${el.name} is ${el.electronConfiguration || el.electronConfig || "not defined"}. Its ${Z} electrons are distributed across ${shellArray.length} principal energy levels (${shellArray.join(", ")}).`,
    },
    {
      question: `Why does ${el.name} exhibit an electron configuration exception?`,
      answer: exception
        ? exception.reason
        : `${el.name} follows standard Aufbau principle orbital filling. Transition metals and heavy elements optimize their shell filling based on subshell exchange energy and electrostatic stability.`,
    },
    {
      question: `What are the primary commercial and laboratory uses of ${el.name}?`,
      answer: industrialUse,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.openlabs.org.in/" },
      { "@type": "ListItem", position: 2, name: "Chemistry", item: "https://www.openlabs.org.in/chemistry" },
      { "@type": "ListItem", position: 3, name: "Periodic Table", item: "https://www.openlabs.org.in/chemistry/periodictable" },
      { "@type": "ListItem", position: 4, name: el.name, item: `https://www.openlabs.org.in/chemistry/periodictable/atom/${el.atomicNumber}` },
    ],
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 pt-6 font-sans relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute top-10 right-1/4 h-[420px] w-[420px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-[360px] w-[360px] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[100px]" />

      {/* JSON-LD Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-6">
        {/* ─── Top Header Navigation & Element Switcher ─── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition font-medium">Home</Link>
            <span>/</span>
            <Link href="/chemistry" className="hover:text-foreground transition font-medium">Chemistry</Link>
            <span>/</span>
            <Link href="/chemistry/periodictable" className="hover:text-foreground transition font-medium">Periodic Table</Link>
            <span>/</span>
            <span className={`font-bold ${categoryStyle.text}`}>{el.name}</span>
          </nav>

          {/* Previous / Next Quick Element Navigation */}
          <div className="flex items-center gap-2">
            {prevEl ? (
              <Link
                href={`/chemistry/periodictable/atom/${prevEl.atomicNumber}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-card hover:bg-accent border border-border rounded-xl text-xs font-black text-foreground shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <ArrowLeft size={13} className="text-primary" />
                <span>#{prevEl.atomicNumber} {prevEl.symbol}</span>
              </Link>
            ) : null}

            <Link
              href="/labs/chemistry/periodictable"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <FlaskConical size={13} />
              <span>Full Periodic Matrix</span>
            </Link>

            {nextEl ? (
              <Link
                href={`/chemistry/periodictable/atom/${nextEl.atomicNumber}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-card hover:bg-accent border border-border rounded-xl text-xs font-black text-foreground shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <span>#{nextEl.atomicNumber} {nextEl.symbol}</span>
                <ArrowRight size={13} className="text-primary" />
              </Link>
            ) : null}
          </div>
        </div>

        {/* ─── Main 2-Column Responsive Dashboard ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ══════════════════════════════════════════════════════════════
              LEFT COLUMN: Atom Card (PRESERVED WITH DIRECT 3D LAB LAUNCHER)
             ══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex flex-col space-y-5 w-full">
            <div className={`w-full rounded-3xl border bg-card p-5 sm:p-6 text-center shadow-xl transition-all duration-300 hover:shadow-2xl ${categoryStyle.glow} ${categoryStyle.border}`}>
              {/* Card Header Badges */}
              <div className="flex justify-between items-center mb-4 text-muted-foreground font-mono text-xs px-1">
                <span className="font-black text-foreground bg-muted px-2.5 py-1 rounded-xl border border-border shadow-sm">
                  Z = {el.atomicNumber}
                </span>
                {exception ? (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider animate-pulse shadow-sm">
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-500" /> Quantum Anomaly
                  </span>
                ) : (
                  <span className={`px-3 py-1 rounded-full border text-[10px] font-bold ${categoryStyle.bg}`}>
                    {categoryStyle.label}
                  </span>
                )}
              </div>

              {/* Concentric Animated Bohr Model SVG */}
              <div className="h-64 flex items-center justify-center mb-4 relative rounded-2xl overflow-hidden bg-slate-950/90 border border-border shadow-inner">
                <BohrModelSVG symbol={el.symbol} shells={shells} accentColor={categoryStyle.accent} />
              </div>

              {/* Direct 3D Atom Model Lab CTA Button */}
              <Link
                href={`/labs/chemistry/periodictable/atom/${el.atomicNumber}`}
                className="w-full mb-5 py-3 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Orbit size={15} />
                <span>Launch 3D Atom &amp; Orbitals Lab</span>
              </Link>

              {/* Element Symbol, Name & Mass */}
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-none">
                {el.name}
              </h1>
              <p className={`text-2xl font-mono font-black mt-1 mb-3 ${categoryStyle.text}`}>
                {el.symbol}
              </p>
              <div className="inline-block px-4 py-1.5 rounded-xl bg-muted/80 border border-border text-xs font-black font-mono text-foreground shadow-sm">
                Standard Atomic Mass: {el.atomicMass} u
              </div>

              {/* Period / Group / Block Badges */}
              <div className="mt-4 flex flex-wrap gap-1.5 justify-center text-xs font-bold font-mono">
                <span className="px-3 py-1 rounded-xl bg-muted/80 border border-border text-foreground font-extrabold">
                  Period {el.period}
                </span>
                <span className="px-3 py-1 rounded-xl bg-muted/80 border border-border text-foreground font-extrabold">
                  Group {el.group}
                </span>
                <span className="px-3 py-1 rounded-xl bg-muted/80 border border-border text-foreground font-extrabold">
                  {el.block.toUpperCase()}-Block
                </span>
              </div>

              {/* Element Sample Image */}
              <div className="mt-5 rounded-2xl border border-border bg-muted/30 p-3 shadow-inner">
                <div className="mb-2 flex items-center justify-between px-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  <span>Chemical Specimen</span>
                  <span className="font-mono">/{el.symbol}</span>
                </div>
                <div className="flex h-40 items-center justify-center overflow-hidden rounded-xl border border-border bg-card">
                  <img
                    src={getElementImageSrc(el.name)}
                    alt={`${el.name} specimen`}
                    className="h-full w-full object-contain p-2"
                  />
                </div>
              </div>
            </div>

            {/* Quick Shell Energy Breakdown */}
            <div className="bg-card border border-border p-4 rounded-3xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                <span>Concentric Electron Shells</span>
                <span className="font-mono text-primary font-bold">{shellArray.length} Energy Levels</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {shellArray.map((count, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="text-[11px] font-mono font-bold bg-muted border border-border text-foreground px-2.5 py-1 rounded-lg shadow-sm">
                      <span className="text-muted-foreground font-normal">n={idx + 1}:</span> {count}e⁻
                    </span>
                    {idx < shellArray.length - 1 && <span className="text-muted-foreground font-mono text-[10px]">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              RIGHT COLUMN: Scientific Profile & Targeted Simulation Launchers
             ══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 flex flex-col space-y-5 w-full">
            {/* 1. Main Monograph Hero Card with 3D Atom Simulation Quick Trigger */}
            <div className="bg-card border border-border rounded-3xl p-6 md:p-7 shadow-xl relative overflow-hidden space-y-4">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-wider text-[11px]">
                    Scientific Monograph &bull; {categoryStyle.label}
                  </span>
                </div>

                <Link
                  href={`/labs/chemistry/periodictable/atom/${el.atomicNumber}`}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  <Orbit size={13} />
                  <span>3D Atom Simulator</span>
                </Link>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
                {el.name} ({el.symbol}) Scientific Profile
              </h2>

              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-medium">
                {overview}
              </p>

              {/* 2. Targeted Simulation Launcher Cards for 3D Atom Model and Electronic Config */}
              <div className="pt-4 border-t border-border/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    Interactive Virtual Labs Available for {el.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Lab Card 1: 3D Orbitals & Valence Lab */}
                  <div className="border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-card to-card hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/15 rounded-3xl p-4 transition-all duration-300 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/40">
                        <Orbit size={20} />
                      </div>
                      <h4 className="font-extrabold text-foreground text-sm">
                        3D Orbitals &amp; Valence Lab
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Simulate concentric quantum energy levels, observe valence electron spins, and examine live atomic clouds in full 3D.
                      </p>
                    </div>

                    <Link
                      href={`/labs/chemistry/periodictable/atom/${el.atomicNumber}`}
                      className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Play size={13} className="fill-current" />
                      <span>Launch 3D Atom Lab</span>
                    </Link>
                  </div>

                  {/* Lab Card 2: Electronic Configuration Lab */}
                  <div className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-card to-card hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/15 rounded-3xl p-4 transition-all duration-300 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="h-10 w-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/40">
                        <Atom size={20} />
                      </div>
                      <h4 className="font-extrabold text-foreground text-sm">
                        Electronic Configuration Lab
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Experiment with Aufbau subshell ordering, explore orbital occupancy, and analyze quantum configuration exceptions.
                      </p>
                    </div>

                    <Link
                      href={`/labs/chemistry/electronic-configuration/${el.atomicNumber}`}
                      className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Zap size={13} className="fill-current" />
                      <span>Launch Config Lab</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Core Thermodynamic & Quantum Metrics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-black uppercase tracking-wider">
                  <Atom className="h-3.5 w-3.5 text-primary" /> Electron Config
                </div>
                <div className="font-mono font-black text-xs text-foreground mt-1.5 truncate" title={el.electronConfiguration || el.electronConfig || "—"}>
                  {el.electronConfiguration || el.electronConfig || "—"}
                </div>
              </div>

              <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-black uppercase tracking-wider">
                  <Activity className="h-3.5 w-3.5 text-amber-500" /> Electronegativity
                </div>
                <div className="font-mono font-black text-xs text-foreground mt-1.5">
                  {el.electronegativity ?? "n/a"} <span className="text-[9px] text-muted-foreground font-normal">Pauling</span>
                </div>
              </div>

              <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-black uppercase tracking-wider">
                  <Calendar className="h-3.5 w-3.5 text-emerald-500" /> Year Discovered
                </div>
                <div className="font-bold text-xs text-foreground mt-1.5 truncate">
                  {el.yearDiscovered ?? "Ancient Era"}
                </div>
              </div>

              <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-black uppercase tracking-wider">
                  <Layers className="h-3.5 w-3.5 text-indigo-500" /> Orbital Shells
                </div>
                <div className="font-bold text-xs text-foreground mt-1.5">
                  {shellArray.length} Principal Levels
                </div>
              </div>

              <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-black uppercase tracking-wider">
                  <Milestone className="h-3.5 w-3.5 text-rose-500" /> Orbital Block
                </div>
                <div className="font-bold text-xs text-foreground uppercase mt-1.5">
                  {el.block}-block orbital
                </div>
              </div>

              <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-black uppercase tracking-wider">
                  <Hash className="h-3.5 w-3.5 text-sky-500" /> Group / Period
                </div>
                <div className="font-bold text-xs text-foreground mt-1.5">
                  G: {el.group} &bull; P: {el.period}
                </div>
              </div>
            </div>

            {/* 4. Quantum Exception Detailed Card */}
            {exception && (
              <div className="border border-amber-500/40 bg-amber-500/10 p-4 sm:p-5 rounded-3xl shadow-md relative overflow-hidden flex gap-3.5">
                <div className="shrink-0 p-2.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl h-fit">
                  <ShieldAlert className="h-5 w-5 animate-pulse" />
                </div>
                <div className="space-y-1.5 text-xs">
                  <h3 className="font-extrabold text-amber-700 dark:text-amber-300 text-sm tracking-tight">
                    Quantum Stability Configuration Exception
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Instead of the textbook Aufbau filling order{" "}
                    <code className="bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1 py-0.5 rounded font-mono font-bold">
                      {exception.ideal}
                    </code>
                    , {el.name} achieves lowest ground state energy as{" "}
                    <strong className="bg-amber-500/30 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded font-mono text-xs border border-amber-500/40">
                      {exception.active}
                    </strong>
                    . {exception.reason}
                  </p>
                </div>
              </div>
            )}

            {/* 5. Etymology & Discovery History */}
            {etymology && (
              <div className="bg-card border border-border p-4 sm:p-5 rounded-3xl shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  <Info size={14} className="text-primary" />
                  <span>Etymology &amp; Discovery History</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 bg-muted/40 rounded-xl border border-border">
                    <span className="text-[9px] text-muted-foreground uppercase font-black block">Name Origin</span>
                    <span className="font-bold text-foreground mt-0.5 block">{etymology.origin}</span>
                  </div>
                  <div className="p-2.5 bg-muted/40 rounded-xl border border-border">
                    <span className="text-[9px] text-muted-foreground uppercase font-black block">Literal Meaning</span>
                    <span className="font-bold text-foreground mt-0.5 block">{etymology.meaning}</span>
                  </div>
                  <div className="p-2.5 bg-muted/40 rounded-xl border border-border">
                    <span className="text-[9px] text-muted-foreground uppercase font-black block">Discovery Hub</span>
                    <span className="font-bold text-foreground mt-0.5 block">{etymology.geography}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Deep Chemistry & Technology Breakdown Grid ─── */}
        <section className="mt-12 border-t border-border pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Reactivity */}
            <article className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-[11px]">
                <Flame className="h-4 w-4 text-orange-500" />
                <span>Reactivity &amp; Chemical Bonding</span>
              </div>
              <h3 className="text-xl font-black text-foreground">
                Chemical Behavior &amp; Oxidation States
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                {reactivity}
              </p>
            </article>

            {/* Industrial & Tech */}
            <article className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-[11px]">
                <FlaskConical className="h-4 w-4 text-indigo-500" />
                <span>Technological Utility</span>
              </div>
              <h3 className="text-xl font-black text-foreground">
                Industrial &amp; Energy Applications
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                {industrialUse}
              </p>
            </article>

            {/* Biological Role */}
            <article className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-[11px]">
                <Compass className="h-4 w-4 text-emerald-500" />
                <span>Biological Role</span>
              </div>
              <h3 className="text-xl font-black text-foreground">
                Biomedical Profile &amp; Toxicity
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                {bioRole}
              </p>
            </article>

            {/* Geochemistry */}
            <article className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-[11px]">
                <Globe className="h-4 w-4 text-sky-500" />
                <span>Geochemistry &amp; Abundance</span>
              </div>
              <h3 className="text-xl font-black text-foreground">
                Cosmic &amp; Terrestrial Occurrence
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Elements like {el.name} are synthesized through stellar nucleosynthesis and supernovae r-processes. On Earth, {el.name} is concentrated in specific ore deposits or synthesized in nuclear accelerators.
              </p>
            </article>
          </div>
        </section>

        {/* ─── Frequently Asked Questions Accordion ─── */}
        <section className="mt-10 border-t border-border pt-10 pb-6">
          <h2 className="text-2xl font-black text-foreground tracking-tight mb-6 text-center">
            Frequently Asked Questions about <span className={categoryStyle.text}>{el.name}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-card border border-border rounded-2xl p-4 shadow-sm flex gap-3">
                <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                  Q
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-foreground text-sm">{faq.question}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

// ─── Concentric Bohr Shell Builder SVG (High-Contrast & Animated) ───
function BohrModelSVG({
  symbol,
  shells,
  accentColor = "bg-primary",
}: {
  symbol: string;
  shells: Record<number, number>;
  accentColor?: string;
}) {
  const maxShell = Math.max(...Object.keys(shells).map(Number), 1);
  const size = 120 + maxShell * 48;
  const center = size / 2;

  const shellCircles: React.ReactNode[] = [];
  const electronDots: React.ReactNode[] = [];

  Object.entries(shells).forEach(([shellStr, count]) => {
    const s = Number(shellStr);
    const r = 44 + s * 22;

    shellCircles.push(
      <circle
        key={`ring-${s}`}
        cx={center}
        cy={center}
        r={r}
        className="stroke-slate-700 dark:stroke-slate-700 stroke-[1.2px]"
        strokeDasharray="3 3"
        fill="none"
      />
    );

    const dots: React.ReactNode[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (2 * Math.PI * i) / count;
      const ex = center + r * Math.cos(angle);
      const ey = center + r * Math.sin(angle);

      dots.push(
        <circle
          key={`dot-${s}-${i}`}
          cx={ex}
          cy={ey}
          r={4.5}
          className="fill-sky-400 stroke-slate-900 stroke-[1.5px] hover:scale-125 transition"
        />
      );
    }

    const rotationSpeed = 12 + s * 4;
    const rotationDirection = s % 2 === 0 ? "normal" : "reverse";
    const animationStyle = {
      transformOrigin: `${center}px ${center}px`,
      animation: `spin ${rotationSpeed}s linear infinite ${rotationDirection}`,
    };

    electronDots.push(
      <g key={`shell-group-${s}`} style={animationStyle}>
        {dots}
      </g>
    );
  });

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="max-w-[260px] mx-auto select-none">
      <defs>
        <radialGradient id="nucleus-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
      </defs>
      {shellCircles}
      <circle cx={center} cy={center} r={32} fill="url(#nucleus-glow)" />
      <circle cx={center} cy={center} r={20} className="fill-indigo-600 stroke-white stroke-[2px] shadow-md" />
      <text x={center} y={center + 5} textAnchor="middle" className="fill-white font-black text-sm tracking-tight">
        {symbol}
      </text>
      {electronDots}
    </svg>
  );
}
