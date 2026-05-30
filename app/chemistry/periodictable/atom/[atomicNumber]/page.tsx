import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { elements } from "@/app/src/data/elements";
import { Award, ShieldAlert, GraduationCap, Compass, Layers, Milestone, Info, Calendar, Hash, Activity, Atom, FlaskConical } from "lucide-react";

interface PageProps {
  params: {
    atomicNumber: string;
  };
}

// 1. Dynamic Category Coloring System for Light Theme Premium Styling
const categoryMap: Record<string, { label: string; bg: string; text: string; border: string; glow: string }> = {
  "nonmetal": {
    label: "Reactive Nonmetal",
    bg: "bg-emerald-50 text-emerald-800 border-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    glow: "shadow-emerald-100 hover:border-emerald-350"
  },
  "noble-gas": {
    label: "Noble Gas",
    bg: "bg-blue-50 text-blue-800 border-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    glow: "shadow-blue-100 hover:border-blue-350"
  },
  "alkali-metal": {
    label: "Alkali Metal",
    bg: "bg-red-50 text-red-800 border-red-100",
    text: "text-red-700",
    border: "border-red-200",
    glow: "shadow-red-100 hover:border-red-350"
  },
  "alkaline-earth": {
    label: "Alkaline Earth Metal",
    bg: "bg-orange-50 text-orange-800 border-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
    glow: "shadow-orange-100 hover:border-orange-350"
  },
  "metalloid": {
    label: "Metalloid",
    bg: "bg-teal-50 text-teal-800 border-teal-100",
    text: "text-teal-700",
    border: "border-teal-200",
    glow: "shadow-teal-100 hover:border-teal-350"
  },
  "post-transition": {
    label: "Post-Transition Metal",
    bg: "bg-slate-50 text-slate-800 border-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    glow: "shadow-slate-100 hover:border-slate-350"
  },
  "transition-metal": {
    label: "Transition Metal",
    bg: "bg-indigo-50 text-indigo-800 border-indigo-100",
    text: "text-indigo-755",
    border: "border-indigo-200",
    glow: "shadow-indigo-100 hover:border-indigo-350"
  },
  "lanthanide": {
    label: "Lanthanide",
    bg: "bg-pink-50 text-pink-800 border-pink-100",
    text: "text-pink-700",
    border: "border-pink-200",
    glow: "shadow-pink-100 hover:border-pink-350"
  },
  "actinide": {
    label: "Actinide",
    bg: "bg-yellow-50 text-yellow-800 border-yellow-100",
    text: "text-yellow-755",
    border: "border-yellow-200",
    glow: "shadow-yellow-100 hover:border-yellow-350"
  },
  "halogen": {
    label: "Halogen",
    bg: "bg-purple-50 text-purple-800 border-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
    glow: "shadow-purple-100 hover:border-purple-350"
  }
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
    reason: "Half-filled d-subshell (d⁵) is symmetrical and provides maximum exchange energy, which is thermodynamically more stable than a d⁴ 4s² arrangement."
  },
  29: {
    ideal: "[Ar] 3d⁹ 4s²",
    active: "[Ar] 3d¹⁰ 4s¹",
    reason: "A completely filled d-subshell (d¹⁰) provides extra electrostatic shielding and symmetry, making it more stable."
  },
  42: {
    ideal: "[Kr] 4d⁴ 5s²",
    active: "[Kr] 4d⁵ 5s¹",
    reason: "Half-filled d-subshell stability."
  },
  46: {
    ideal: "[Kr] 4d⁸ 5s²",
    active: "[Kr] 4d¹⁰",
    reason: "Completely filled d-subshell providing unique chemical inertness."
  },
  47: {
    ideal: "[Kr] 4d⁹ 5s²",
    active: "[Kr] 4d¹⁰ 5s¹",
    reason: "Filled d-subshell stability."
  },
  79: {
    ideal: "[Xe] 4f¹⁴ 5d⁹ 6s²",
    active: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹",
    reason: "Strong relativistic contraction of s-orbitals pulls electrons closer, combined with filled d-subshell stability."
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

  const exception = ELECTRON_EXCEPTIONS[Z];
  if (exception) {
    const targetFix = Z === 24 ? [{ label: "4s", electrons: 1 }, { label: "3d", electrons: 5 }] :
      Z === 29 ? [{ label: "4s", electrons: 1 }, { label: "3d", electrons: 10 }] : [];

    targetFix.forEach((fix) => {
      const target = orbitals.find((o) => o.label === fix.label);
      if (target) {
        const diff = fix.electrons - target.electrons;
        target.electrons = fix.electrons;
        shells[target.shell] += diff;
      }
    });
  }

  return shells;
}

const etymologyMap: Record<number, { origin: string; meaning: string; geography: string }> = {
  1: { origin: "Greek 'hydro' + 'genes'", meaning: "Water-former", geography: "Co-discovered in London, UK / Paris, France" },
  2: { origin: "Greek 'helios' (Sun)", meaning: "Sun element", geography: "Discovered during solar eclipse in Guntur, India" },
  6: { origin: "Latin 'carbo'", meaning: "Coal / charcoal", geography: "Known since ancient prehistoric times globally" },
  8: { origin: "Greek 'oxy' + 'genes'", meaning: "Acid-former", geography: "Co-discovered in Uppsala, Sweden / Wiltshire, UK" },
  24: { origin: "Greek 'chroma' (color)", meaning: "Vibrant / colored compounds", geography: "Discovered by Louis Nicolas Vauquelin in Paris, France (1797)" },
  26: { origin: "Latin 'ferrum'", meaning: "Strength / firm", geography: "Used since early Iron Age civilizations globally" },
  29: { origin: "Latin 'cuprum'", meaning: "From Cyprus island", geography: "Mined extensively in ancient Cyprus" },
  79: { origin: "Proto-Germanic 'gulth'", meaning: "Shining yellow / gold", geography: "Prized since earliest Egyptian dynasties" }
};

function getElementImageSrc(name: string) {
  return `/images/elements/${name
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z]/g, "")
  }.jpg`;
}

function getElementExplanations(el: any) {
  const name = el.name;
  const symbol = el.symbol;
  const Z = el.atomicNumber;
  const cat = el.category;

  const overviews: Record<number, string> = {
    1: "Hydrogen is the simplest, lightest, and most abundant chemical element in the universe, constituting roughly 75% of all baryonic mass. It exists as a highly flammable diatomic gas at standard conditions and acts as a central building block of stars, water, and life.",
    2: "Helium is a colorless, odorless, and chemically inert noble gas. It is the second-lightest and second-most abundant element in the universe, synthesized in massive quantities during stellar nucleosynthesis and the Big Bang.",
    6: "Carbon is the foundational cornerstone of all organic chemistry and life on Earth. Due to its unique ability to form four stable covalent bonds (catenation), it forms the structural backbone of proteins, lipids, carbohydrates, and nucleic acids.",
    7: "Nitrogen is a diatomic nonmetallic gas forming 78% of Earth's atmosphere. Crucial to life, it forms the molecular basis for amino acids, proteins, and DNA, and plays a vital role in biochemical cycling.",
    8: "Oxygen is a highly reactive nonmetal and potent oxidizer essential for cellular respiration in most aerobic organisms. Making up 21% of Earth's atmosphere, it is the most abundant element in the Earth's crust by mass, primarily bound in oxide minerals.",
    24: "Chromium is a lustrous, hard, and steel-gray transition metal. Prized for its exceptionally high corrosion resistance and high melting point, it is the primary alloy ingredient in stainless steel and is responsible for the deep green color of emeralds and red color of rubies.",
    26: "Iron is a vital transition metal that represents the most common element on Earth by mass, comprising much of our planet's inner and outer core. Biologically, it form the active oxygen-binding center in blood hemoglobin.",
    79: "Gold is a dense, exceptionally malleable, and chemically unreactive noble metal. Prize since antiquity for its beauty, non-tarnishing properties, and extreme stability, it is widely utilized in aerospace shielding, modern electronics, and currency."
  };

  const biologicalRoles: Record<number, string> = {
    1: "Hydrogen is present in every biological cell. Combined with oxygen, it forms water, which makes up about 60% of human body weight, and acts as the hydrogen ion gradient driving ATP synthase.",
    2: "Helium is completely inert and has no known biological role. It is non-toxic but poses oxygen deprivation risks if inhaled.",
    6: "Carbon constitutes 18.5% of human body mass. Every biomolecule—from DNA base pairs to fatty acid chains—is built upon a stable framework of carbon-carbon covalent bonds.",
    7: "Nitrogen is a key building block of nucleic acids (DNA/RNA) and amino acids (proteins). Plants absorb nitrogen in soil compounds, which enters the food chain to supply human nutrition.",
    8: "Oxygen is vital for aerobic life. It serves as the terminal electron acceptor in the cellular electron transport chain, enabling mitochondria to synthesize ATP during cellular respiration.",
    24: "Chromium (specifically trivalent Cr³⁺) is a trace essential element in human glucose metabolism, facilitating the action of insulin. Conversely, hexavalent chromium (Cr⁶⁺) is highly toxic and carcinogenic.",
    26: "Iron is indispensable for oxygen transport. It resides at the core of the heme group in hemoglobin and myoglobin, binding O2 molecules for distribution across muscles and organs.",
    79: "Gold is biologically inert. Because it is non-reactive and does not oxidize inside tissues, it is extensively used in high-quality dental crowns and selected gold salt treatments for arthritis."
  };

  const reactivities: Record<number, string> = {
    1: "Hydrogen is moderately reactive. Under light, heat, or catalytic activation, it reacts vigorously with oxygen and halogens. It acts as a primary reducing agent in hydrocracking and hydrogenation processes.",
    2: "Helium has zero chemical reactivity. Its electrons form a closed 1s² shell which is incredibly stable, rendering it unable to form ordinary chemical compounds even at high temperatures.",
    6: "Carbon is moderately reactive but exceptionally versatile. While kinetically stable at room temperature, it readily undergoes combustion at high temperatures and forms covalent compounds with hydrogen, oxygen, nitrogen, and halogens.",
    7: "Diatomic nitrogen (N2) is highly unreactive at standard conditions due to its powerful triple covalent bond (bond dissociation energy of 945 kJ/mol), requiring severe industrial pressures or nitrogenase enzymes to react.",
    8: "Oxygen is exceptionally reactive and electronegative. It participates in oxidizing processes, combustion, rust formation, and corrosion, bonding with nearly every element except for lighter noble gases.",
    24: "Chromium is passive against corrosion. It reacts with oxygen in the air to immediately form an ultra-thin, dense protective layer of chromium(III) oxide (Cr₂O₃) that prevents further oxygen penetration, a property known as passivation.",
    26: "Iron reacts slowly with moist air to form hydrated iron oxide (rust). It dissolves readily in dilute acids and exhibits multiple common oxidation states, primarily +2 (ferrous) and +3 (ferric).",
    79: "Gold is the most chemically inert metal in the periodic table. It does not react with air, water, or acids, and is only dissolved by aqua regia (a specialized 3:1 mixture of hydrochloric and nitric acids)."
  };

  const applications: Record<number, string> = {
    1: "Hydrogen is used for synthesizing ammonia (Haber process), upgrading petroleum fuels, producing methanol, launching rockets (liquid hydrogen fuel), and powering fuel cells for clean transportation.",
    2: "Helium is critical in cryogenics, cooling the superconducting magnets of MRI scanners to 4 Kelvin. It is also used to pressurize space booster tanks, shield gas welding, and fill balloons.",
    6: "Carbon is used globally in carbon steels, activated carbon filters, carbon-fiber composites, synthetic polymers, graphite electrodes, diamond tools, and carbon dating (Carbon-14).",
    7: "Nitrogen is used as a protective liquid coolant (liquid nitrogen) for biology and manufacturing, to provide an inert atmosphere in pharmaceutical synthesis, and to manufacture ammonium fertilizers.",
    8: "Oxygen is used in massive quantities in blast furnace steelmaking, wastewater purification, industrial welding, medical life support in hospitals, and liquid oxygen rocket propellants.",
    24: "Chromium is primarily used in chrome plating, producing stainless steels (typically containing 18% chromium), manufacturing nichrome resistance wires, superalloys for jet engines, and pigment paints.",
    26: "Iron is the backbone of human structural civil engineering. Alloyed with carbon to produce structural steels, it builds skyscrapers, cargo vessels, railway lines, automobiles, and mechanical tools.",
    79: "Highly prized in high-end microelectronics due to its high electrical conductivity and total corrosion resistance. It is used in semiconductor wire bonding, premium jewelry, gold bullion, and infrared satellites."
  };

  return {
    overview: overviews[Z] || `${name} (${symbol}) is a chemical element with atomic number ${Z}, classified as a ${cat.replace("-", " ")}. Located in Period ${el.period} and Group ${el.group} of the periodic table, it features an electron configuration of ${el.electronConfig}. Like other elements in its class, its chemical behavior is dictated by its valence electrons and position relative to periodic trends.`,
    bioRole: biologicalRoles[Z] || `${name} does not have a primary biological role in human physiology, but exists as a trace element in some ecosystems. In heavier metals, biological toxicity often replaces utility, where heavy metal interactions can disrupt cellular enzymes.`,
    reactivity: reactivities[Z] || `${name} belongs to the ${cat.replace("-", " ")} class. Its reactivity is governed by its valence shell of electrons. Elements of this category typically participate in chemical bonding via ${el.block}-block orbitals, exhibiting characteristic properties such as an electronegativity of ${el.electronegativity ?? "n/a"} and forming compounds in standard oxidation states.`,
    industrialUse: applications[Z] || `${name} finds various specialized applications in modern industry, technological fabrication, materials science, or laboratory settings, depending on its specific thermal and chemical properties.`
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
    title: `${el.name} (${el.symbol}) - Atomic Number ${el.atomicNumber} | OpenLabs`,
    description: `Learn about ${el.name} (${el.symbol}), atomic number ${el.atomicNumber}. Explore its properties, electron configuration exception, atomic mass, period/group trends, and launch the interactive 3D Bohr model laboratory.`,
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
      "openlabs chemistry"
    ],
    alternates: {
      canonical: `https://www.openlabs.org.in/chemistry/periodictable/atom/${el.atomicNumber}`,
    },
    openGraph: {
      title: `${el.name} (${el.symbol}) - Interactive Periodic Table | OpenLabs`,
      description: `Comprehensive scientific monograph and interactive 3D laboratory for ${el.name}. Discover properties, atomic trends, and valence shells.`,
      url: `https://www.openlabs.org.in/chemistry/periodictable/atom/${el.atomicNumber}`,
      type: "website",
    }
  };
}

export default function Page({ params }: PageProps) {
  const Z = Number(params.atomicNumber);
  const el = elements.find((e) => e.atomicNumber === Z);

  if (!el) {
    return notFound();
  }

  const categoryStyle = categoryMap[el.category] || {
    label: el.category,
    bg: "bg-slate-100 text-slate-800 border-slate-200",
    text: "text-slate-700",
    border: "border-slate-200",
    glow: "shadow-slate-100 hover:border-slate-350"
  };

  const shells = calculateConfiguration(Z);
  const shellArray = Object.values(shells);
  const { overview, bioRole, reactivity, industrialUse } = getElementExplanations(el);
  const etymology = etymologyMap[Z];
  const exception = ELECTRON_EXCEPTIONS[Z];

  const propertiesGrid = (
    <div className="grid grid-cols-2 gap-4 w-full">
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200">
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
          <Atom className="h-3 w-3 text-indigo-500" /> Electron Config
        </div>
        <div className="font-extrabold font-mono text-[13px] text-indigo-755 mt-2 truncate" title={el.electronConfiguration || el.electronConfig || "—"}>
          {el.electronConfiguration || el.electronConfig || "—"}
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200">
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
          <Activity className="h-3 w-3 text-indigo-500" /> Electronegativity
        </div>
        <div className="font-extrabold font-mono text-[13px] text-indigo-755 mt-2">
          {el.electronegativity ?? "n/a"} <span className="text-[9px] text-slate-400 font-normal">Pauling</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200">
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
          <Calendar className="h-3 w-3 text-indigo-500" /> Year Discovered
        </div>
        <div className="font-extrabold text-[13px] text-indigo-755 mt-2 truncate">
          {el.yearDiscovered ?? "Ancient"}
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200">
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
          <Milestone className="h-3 w-3 text-indigo-500" /> Shells & Levels
        </div>
        <div className="font-extrabold text-[13px] text-indigo-755 mt-2">
          {shellArray.length} energy levels
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200">
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
          <Layers className="h-3 w-3 text-indigo-500" /> Orbital Block
        </div>
        <div className="font-extrabold text-[13px] text-indigo-755 uppercase mt-2">
          {el.block}-block orbitals
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200">
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
          <Hash className="h-3 w-3 text-indigo-500" /> Group & Period
        </div>
        <div className="font-extrabold text-[13px] text-indigo-755 mt-2">
          G: {el.group} / P: {el.period}
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm col-span-2 hover:shadow-md transition duration-200">
        <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-2.5">Electrons per Shell Level</div>
        <div className="flex flex-wrap gap-2">
          {shellArray.map((count, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                Shell {idx + 1}: {count}
              </span>
              {idx < shellArray.length - 1 && <span className="text-slate-400 font-mono text-xs">→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const faqs = [
    {
      question: `What are the main physical properties of ${el.name}?`,
      answer: `${el.name} (${el.symbol}) has an atomic number of ${el.atomicNumber} and an atomic mass of ${el.atomicMass} u. It resides in Period ${el.period}, Group ${el.group}, and is classified within the ${categoryStyle.label} category, operating primarily in the ${el.block}-block orbital system.`
    },
    {
      question: `What is the electron configuration of ${el.name}?`,
      answer: `The electron configuration of ${el.name} is ${el.electronConfiguration || el.electronConfig || "not defined"}. The electrons are distributed across ${shellArray.length} energy shell levels in a sequence of ${shellArray.join("-")}.`
    },
    {
      question: `Why does ${el.name} exhibit an electron configuration exception?`,
      answer: exception ? exception.reason : `${el.name} follows standard Aufbau principle orbital filling. In transition metals, energy shells fill based on maximum stability parameters.`
    },
    {
      question: `What is ${el.name} used for in real-world applications?`,
      answer: industrialUse
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.openlabs.org.in/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Chemistry",
        "item": "https://www.openlabs.org.in/chemistry"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Periodic Table",
        "item": "https://www.openlabs.org.in/chemistry/periodictable"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": el.name,
        "item": `https://www.openlabs.org.in/chemistry/periodictable/atom/${el.atomicNumber}`
      }
    ]
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-800 pb-20 pt-8 font-sans relative overflow-hidden">

      {/* Decorative category-colored glow sphere in background */}
      <div className="absolute top-24 left-1/4 h-[380px] w-[380px] rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />

      {/* Schemas JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-900 transition font-medium">Home</Link>
          <span>/</span>
          <Link href="/chemistry" className="hover:text-slate-900 transition font-medium">Chemistry</Link>
          <span>/</span>
          <Link href="/chemistry/periodictable" className="hover:text-slate-900 transition font-medium">Periodic Table</Link>
          <span>/</span>
          <span className="text-indigo-600 font-bold">{el.name}</span>
        </nav>

        {/* Dashboard Grid Header - Balanced Column Layout (Zero wasted space) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 items-start">
          {/* Col 1: Dynamic Visual Element Identity Badge & Properties Grid (Left Column) */}
          <div className="lg:col-span-5 flex flex-col space-y-6 w-full">
            <div className={`w-full rounded-3xl border bg-white p-6 text-center shadow-xl transition-all duration-300 hover:shadow-2xl ${categoryStyle.glow} ${categoryStyle.border}`}>

              {/* Dynamic visual indicator for configuration exceptions */}
              <div className="flex justify-between items-start mb-6 text-slate-400 font-mono text-xs px-1">
                <span>Z = {el.atomicNumber}</span>
                {exception ? (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase tracking-wider animate-pulse shadow-sm">
                    <ShieldAlert className="h-3 w-3 text-amber-600" /> Quantum Exception
                  </span>
                ) : (
                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${categoryStyle.bg}`}>
                    {categoryStyle.label}
                  </span>
                )}
              </div>

              {/* Bohr Model Dynamic SVG Vector Representation */}
              <div className="h-64 flex items-center justify-center mb-6 relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100/50 shadow-inner">
                <BohrModelSVG symbol={el.symbol} shells={shells} />
              </div>

              <h1 className="text-4xl font-black tracking-tight mb-1 text-slate-900 leading-none">
                {el.name}
              </h1>
              <p className="text-xl font-mono text-slate-450 font-bold mb-3">
                {el.symbol}
              </p>
              <div className="inline-block px-5 py-2 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-sm font-black font-mono text-indigo-755 shadow-sm">
                Mass: {el.atomicMass} u
              </div>

              <div className="mt-6 flex flex-wrap gap-2 justify-center text-xs font-bold font-mono">
                <span className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-655">Period {el.period}</span>
                <span className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-655">Group {el.group}</span>
                <span className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-655">Block {el.block.toUpperCase()}</span>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 shadow-inner">
                <div className="mb-2 flex items-center justify-between px-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <span>Element Sample Image</span>
                  <span className="font-mono">/{el.symbol}</span>
                </div>
                <div className="flex h-44 items-center justify-center overflow-hidden rounded-xl border border-white bg-white">
                  <img
                    src={getElementImageSrc(el.name)}
                    alt={`${el.name} element sample`}
                    className="h-full w-full object-contain p-3"
                  />
                </div>
              </div>
            </div>

            {/* Render propertiesGrid in left column ONLY if there is an exception to cover that space */}
            {exception && propertiesGrid}
          </div>

          {/* Col 2: Integrated Chemistry Monograph & Lab Consoles (Right Column) */}
          <div className="lg:col-span-7 flex flex-col justify-start space-y-6 w-full">
            {/* Unified Feature Card: Overview, Category & Action buttons in one premium container */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 animate-ping" />
                  <h2 className="text-indigo-600 font-extrabold uppercase tracking-wider text-xs">
                    Quantum Profile
                  </h2>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                  Scientific Monograph: {el.name} ({el.symbol})
                </h2>

                <p className="text-slate-655 text-base md:text-lg leading-relaxed font-medium">
                  {overview}
                </p>
              </div>

              {/* Redesigned interactive Virtual Experiments Panel */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider">
                    Interactive Virtual Labs Available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    href={`/labs/chemistry/periodictable/atom/${el.atomicNumber}`}
                    className="group border border-slate-150 bg-slate-50 hover:bg-white hover:border-indigo-400 hover:shadow-lg rounded-2xl p-4 transition-all duration-300 text-left flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 mb-3 shadow-sm">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                        3D Orbitals & Valence Lab
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Simulate concentric quantum energy levels, observe valence spins, and examine live electron clouds.
                      </p>
                    </div>
                    <div className="text-[15px] font-bold text-indigo-600 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Launch 3D Experiment →
                    </div>
                  </Link>

                  <Link
                    href={`/labs/chemistry/electronic-configuration/${el.atomicNumber}`}
                    className="group border border-slate-150 bg-slate-50 hover:bg-white hover:border-purple-400 hover:shadow-lg rounded-2xl p-4 transition-all duration-300 text-left flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 mb-3 shadow-sm">
                        <Atom className="h-5 w-5" />
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-purple-600 transition-colors">
                        Electronic Configuration Lab
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Experiment with Aufbau ordering, explore shells, and analyze dynamic quantum configuration exceptions.
                      </p>
                    </div>
                    <div className="text-[15px] font-bold text-purple-600 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Launch Config Simulator →
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Render propertiesGrid in right column if there is NO exception, so the left side under Bohr stays empty */}
            {!exception && propertiesGrid}

            {/* Dynamic Quantum Configuration Exception Alert Card */}
            {exception && (
              <div className="border border-amber-200 bg-amber-50/40 p-5 rounded-3xl shadow-inner relative overflow-hidden flex gap-4">
                <div className="absolute top-0 right-0 h-16 w-16 bg-amber-100/30 rounded-full blur-xl pointer-events-none" />
                <div className="flex-shrink-0 p-2.5 bg-amber-100 rounded-xl text-amber-700 h-fit">
                  <ShieldAlert className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-amber-850 text-sm tracking-tight mb-1">
                    Quantum Stability Configuration Exception
                  </h3>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Instead of the anticipated standard filling shell order <code className="bg-amber-100/50 px-1 rounded font-bold font-mono">{exception.ideal}</code>, {el.name} settles into an active ground state configuration of <strong className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-[13px] text-amber-900 border border-amber-200/50">{exception.active}</strong>. {exception.reason}
                  </p>
                </div>
              </div>
            )}

            {/* Etymology origin badge card */}
            {etymology && (
              <div className="bg-white border border-slate-200/80 p-5 rounded-3xl flex gap-4 shadow-sm">
                <div className="flex-shrink-0 p-2.5 bg-indigo-50 rounded-xl text-indigo-600 h-fit">
                  <Info className="h-5 w-5" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-xs font-medium">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Name Origin</div>
                    <div className="text-slate-900 font-extrabold text-sm mt-0.5">{etymology.origin}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Literal Meaning</div>
                    <div className="text-slate-700 mt-0.5 font-medium">{etymology.meaning}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Discovery Hub</div>
                    <div className="text-slate-755 mt-0.5 font-bold">{etymology.geography}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <section className="mt-20 border-t border-slate-200 pt-16 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">

              <article className="relative pl-6 md:pl-8 border-l-2 border-indigo-100 hover:border-indigo-500 transition-colors">
                <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-widest text-xs mb-3">
                  <Layers className="h-4 w-4" /> Orbitals & Reactivity
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Reactivity and Chemical Bonding</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  {reactivity}
                </p>
              </article>

              <article className="relative pl-6 md:pl-8 border-l-2 border-indigo-100 hover:border-indigo-500 transition-colors">
                <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-widest text-xs mb-3">
                  <Compass className="h-4 w-4" /> Biological Impact
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Biological Role & Toxicity</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  {bioRole}
                </p>
              </article>

              <article className="relative pl-6 md:pl-8 border-l-2 border-indigo-100 hover:border-indigo-500 transition-colors">
                <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-widest text-xs mb-3">
                  <FlaskConical className="h-4 w-4" /> Technological Utility
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Industrial and Tech Applications</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  {industrialUse}
                </p>
              </article>

              <article className="relative pl-6 md:pl-8 border-l-2 border-indigo-100 hover:border-indigo-500 transition-colors">
                <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-widest text-xs mb-3">
                  <Milestone className="h-4 w-4" /> Geochemistry
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Abundance & Geological Occurrence</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  In nature, elements like {el.name} are distributed across the planet depending on stellar fusion pathways and geochemical classification. Superheavy elements (Z &gt; 92) do not occur naturally on Earth and must be synthesized particle-by-particle in advanced nuclear labs such as CERN (Switzerland), Lawrence Berkeley Lab (USA), RIKEN (Japan), or Dubna (Russia) to study their atomic decay and validate the predicted "Island of Stability".
                </p>
              </article>

            </div>
          </div>
        </section>

        <section className="mt-20 border-t border-slate-200 pt-20 pb-16 bg-slate-50/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-12 text-center">
              Common questions about <span className="text-indigo-600">{el.name}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {faqs.map((faq, idx) => (
                <div key={idx} className="relative flex gap-4">
                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 font-bold text-lg">
                    Q.
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-3">
                      {faq.question}
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// Concentric Bohr shell builder SVG Component (Optimized for Light Theme contrast)
function BohrModelSVG({ symbol, shells }: { symbol: string; shells: Record<number, number> }) {
  const maxShell = Math.max(...Object.keys(shells).map(Number), 1);
  const size = 120 + maxShell * 50;
  const center = size / 2;

  const shellCircles: React.ReactNode[] = [];
  const electronDots: React.ReactNode[] = [];

  Object.entries(shells).forEach(([shellStr, count]) => {
    const s = Number(shellStr);
    const r = 50 + s * 22;

    shellCircles.push(
      <circle
        key={`ring-${s}`}
        cx={center}
        cy={center}
        r={r}
        className="stroke-slate-200 fill-none stroke-[1.5px]"
        strokeDasharray="4 4"
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
          r={5.5}
          className="fill-indigo-600 stroke-white stroke-[1.5px] shadow-sm hover:scale-125 transition duration-200 cursor-help"
        />
      );
    }

    // Dynamic rotation speeds & directions (concentric energy shells spin at alternating rates)
    const rotationSpeed = 10 + s * 5; // shell 1 = 15s, shell 2 = 20s, etc.
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
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="max-w-[280px] mx-auto select-none">
      <defs>
        <radialGradient id="nucleus-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>
      </defs>
      {shellCircles}
      <circle cx={center} cy={center} r={36} fill="url(#nucleus-glow)" />
      <circle cx={center} cy={center} r={22} className="fill-indigo-600 stroke-white stroke-[2px] shadow-md" />
      <text
        x={center}
        y={center + 5}
        textAnchor="middle"
        className="fill-white font-black text-sm tracking-tight"
      >
        {symbol}
      </text>
      {electronDots}
    </svg>
  );
}
