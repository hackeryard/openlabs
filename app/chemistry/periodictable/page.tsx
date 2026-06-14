import Link from "next/link";
import { Metadata } from "next";
import { Atom, Compass, Layers, Milestone, FlaskConical, Award, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Interactive Periodic Table of Elements - Chemistry Lab | OpenLabs",
  description: "Explore chemical elements with our interactive learning guides. Discover atomic properties, orbital blocks, periodic trends, and launch our 3D quantum model simulation.",
  keywords: [
    "periodic table of elements",
    "chemistry elements",
    "atomic weight",
    "electron configuration",
    "periodic trends",
    "electronegativity",
    "atomic radius",
    "virtual chemistry lab",
    "STEM education"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/chemistry/periodictable",
  },
  openGraph: {
    title: "Periodic Table of Elements | OpenLabs",
    description: "Explore the properties of chemical elements. Features detailed guides on atomic trends, orbital blocks, and dynamic 3D quantum model simulations.",
    url: "https://www.openlabs.org.in/chemistry/periodictable",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/chemistry/periodic-table-hero.png",
        alt: "OpenLabs Periodic Table Interactive Chemistry",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Periodic Table of Elements | OpenLabs",
    description: "Explore chemical element properties, orbital blocks, periodic trends, and the interactive OpenLabs Periodic Table experience.",
    images: ["https://www.openlabs.org.in/images/chemistry/periodic-table-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const faqs = [
  {
    question: "How is the Periodic Table structured?",
    answer: "The periodic table organizes all 118 known chemical elements by ascending atomic number (the number of protons in the nucleus). It is structured into 7 horizontal rows called 'periods' (representing the number of electron shells) and 18 vertical columns called 'groups' or 'families' (representing elements with shared valence electron counts and similar chemical properties)."
  },
  {
    question: "What are the four main orbital blocks of the Periodic Table?",
    answer: "The table is split into four distinct blocks based on which subshell (s, p, d, or f) is filled last by electrons: (1) s-block (Groups 1 & 2 plus Helium), (2) p-block (Groups 13 through 18), (3) d-block (Groups 3 through 12, forming transition metals), and (4) f-block (the separate Lanthanides and Actinides rows at the bottom)."
  },
  {
    question: "What is electronegativity and how does it change across the table?",
    answer: "Electronegativity is a measure of an atom's ability to attract shared bonding electrons in a chemical compound. According to periodic trends, electronegativity increases from left to right across a period (due to increasing nuclear charge pulling electrons closer) and decreases from top to bottom down a group (due to increased electron shielding from additional shells)."
  },
  {
    question: "Why do atomic radii decrease across a period?",
    answer: "As you move from left to right across a period, protons are added to the nucleus and electrons are added to the same valence shell. This increases the effective nuclear charge, pulling the electron cloud closer to the nucleus and resulting in a smaller atomic radius."
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
    }
  ]
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "url": "https://www.openlabs.org.in/chemistry/periodictable",
  "name": "Interactive Periodic Table of Elements | OpenLabs",
  "description": "Interactive periodic table learning experience with element properties, orbital blocks, periodic trends, and chemistry simulation tools.",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbSchema.itemListElement
  },
  "inLanguage": "en"
};

const miniGrid = [
  { s: "H", c: "bg-emerald-50 border-emerald-100 text-emerald-600" },
  { s: "", c: "opacity-0" }, { s: "", c: "opacity-0" }, { s: "", c: "opacity-0" }, 
  { s: "", c: "opacity-0" }, { s: "", c: "opacity-0" }, { s: "", c: "opacity-0" },
  { s: "He", c: "bg-sky-50 border-sky-100 text-sky-600" },
  
  { s: "Li", c: "bg-rose-50 border-rose-100 text-rose-600" },
  { s: "Be", c: "bg-amber-50 border-amber-100 text-amber-600" },
  { s: "B", c: "bg-teal-50 border-teal-100 text-teal-600" },
  { s: "C", c: "bg-emerald-50 border-emerald-100 text-emerald-600" },
  { s: "N", c: "bg-emerald-50 border-emerald-100 text-emerald-600" },
  { s: "O", c: "bg-emerald-50 border-emerald-100 text-emerald-600" },
  { s: "F", c: "bg-violet-50 border-violet-100 text-violet-600" },
  { s: "Ne", c: "bg-sky-50 border-sky-100 text-sky-600" },
  
  { s: "Na", c: "bg-rose-50 border-rose-100 text-rose-600" },
  { s: "Mg", c: "bg-amber-50 border-amber-100 text-amber-600" },
  { s: "Al", c: "bg-slate-50 border-slate-200 text-slate-600" },
  { s: "Si", c: "bg-teal-50 border-teal-100 text-teal-600" },
  { s: "P", c: "bg-emerald-50 border-emerald-100 text-emerald-600" },
  { s: "S", c: "bg-emerald-50 border-emerald-100 text-emerald-600" },
  { s: "Cl", c: "bg-violet-50 border-violet-100 text-violet-600" },
  { s: "Ar", c: "bg-sky-50 border-sky-100 text-sky-600" },
];

export default function Page() {
  return (
    <>
      <a
        href="#main-content"
        className="absolute left-4 -top-16 z-50 rounded bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow transition-all focus:top-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Skip to main content
      </a>
      <main
        id="main-content"
        className="min-h-screen bg-slate-50 text-slate-800 pb-24 pt-8 font-sans relative overflow-hidden bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] bg-[size:24px_24px]"
      >
      
      {/* Gentle, soft decorative background glows */}
      <div className="absolute -top-48 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 -right-40 h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Search Engine Schema Markers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-950 transition font-medium">Home</Link>
          <span>/</span>
          <Link href="/chemistry" className="hover:text-slate-950 transition font-medium">Chemistry</Link>
          <span>/</span>
          <span className="text-indigo-600 font-bold">Periodic Table</span>
        </nav>

        {/* 1. Unified Above-the-Fold Hero Section Grid */}
        <section id="hero" aria-labelledby="hero-heading" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-12 pt-4">
          {/* Left Column: Captivating Copywriting & Launch Buttons */}
          <div className="lg:col-span-6 text-left space-y-6">
            <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-bold tracking-wide uppercase shadow-sm">
              <FlaskConical aria-hidden="true" className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
              Virtual Science Hub
            </div>
            
            <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
              Interactive <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                Periodic Table
              </span>
            </h1>
            
            <p className="text-slate-500 text-lg leading-relaxed font-medium">
              Explore, filter, and master the structural blueprints of nature. Our state-of-the-art interactive lab allows you to inspect atomic properties, simulate electronic configurations, and examine quantum shells in full 3D.
            </p>

            {/* Redesigned Premium Launch buttons in First View (Above the fold) */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/labs/chemistry/periodictable"
                className="text-center bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:scale-[1.02] active:scale-[0.98] text-white font-extrabold py-4 px-8 rounded-2xl transition shadow-lg shadow-indigo-500/25 text-base"
              >
                Launch Virtual Lab
              </Link>
              <a
                href="#trends"
                className="text-center bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold py-4 px-8 rounded-2xl transition border border-slate-200 active:scale-[0.98] text-base shadow-sm"
              >
                Explore Trends
              </a>
            </div>
          </div>

          {/* Right Column: Floating Teaser Graphic Representation */}
          <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl relative overflow-hidden transform hover:scale-[1.005] transition-transform duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <div className="absolute -top-12 -right-12 h-32 w-32 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex justify-between items-center text-slate-400 font-mono text-[10px] font-bold uppercase tracking-wider mb-6">
              <span>Laboratory Teaser Grid</span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> WebGL Simulator
              </span>
            </div>

            <div className="grid grid-cols-8 gap-2 w-full max-w-[400px] mx-auto">
              {miniGrid.map((el, idx) => (
                <div
                  key={idx}
                  className={`aspect-square rounded-xl border flex items-center justify-center font-mono text-[11px] font-bold shadow-sm transition duration-300 hover:scale-110 hover:shadow-md cursor-default ${el.c}`}
                >
                  {el.s}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-4 justify-center text-[10px] font-mono text-slate-400 font-bold border-t border-slate-100 pt-5">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> s-block</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> p-block</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-indigo-400" /> d-block</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-purple-400" /> f-block</span>
            </div>
          </div>
        </section>

        {/* 2. Refined Metrics Dashboard Cards */}
        <section aria-label="Key periodic table metrics" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <FlaskConical aria-hidden="true" className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="text-2xl md:text-3xl font-black text-slate-900 font-mono">118</div>
              <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Elements</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <Layers aria-hidden="true" className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="text-2xl md:text-3xl font-black text-slate-900 font-mono">18</div>
              <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Groups</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <Compass aria-hidden="true" className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="text-2xl md:text-3xl font-black text-slate-900 font-mono">7</div>
              <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Periods</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="p-3 bg-pink-50 rounded-xl text-pink-600">
              <Atom aria-hidden="true" className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="text-2xl md:text-3xl font-black text-slate-900 font-mono">4</div>
              <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Blocks</div>
            </div>
          </div>
        </section>

        {/* 3. Deep Educational Content Modules (AEO/SEO optimized) */}
        <section aria-labelledby="content-overview-heading" className="space-y-16 border-t border-slate-200 pt-16">
          
          {/* Section 1: How to read the table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
                <Milestone aria-hidden="true" className="h-4 w-4" /> Chemistry Foundations
              </div>
              <h2 id="content-overview-heading" className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">
                Understanding the Architecture of the Periodic Table
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                The modern periodic table is not merely a chart of names; it is a profound physical law of the universe. Formulated by Dmitri Mendeleev and refined by Henry Moseley, it organizes chemical entities by ascending <strong>Atomic Number (Z)</strong>, mapping out a repeating "periodic" rhythm of atomic behavior.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600 mt-1">1</div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Periods (Horizontal Rows)</h4>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                      There are 7 periods. The period number corresponds directly to the total number of electron energy shells filled with electrons in their lowest state (ground state).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600 mt-1">2</div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Groups / Families (Vertical Columns)</h4>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                      The 18 vertical columns collect elements sharing identical valence shell electron configurations, which ensures they engage in highly similar chemical bonding reactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cell Anatomy visual guide */}
            <div className="lg:col-span-5 bg-gradient-to-br from-indigo-50/50 via-slate-50 to-pink-50/10 border border-slate-200 p-8 rounded-3xl relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-200/10 rounded-full blur-2xl pointer-events-none" />
              <div className="text-center font-mono relative z-10">
                <div className="text-indigo-600 text-xs font-bold tracking-wider uppercase mb-3">Interactive Anatomical Key</div>
                <div className="border border-slate-200 rounded-3xl p-6 bg-white shadow-xl inline-block text-left w-full max-w-[260px] transform hover:scale-105 transition duration-300">
                  <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold">
                    <span>Z = 79</span>
                    <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase">Metal</span>
                  </div>
                  <div className="text-5xl font-black text-slate-900 my-2 tracking-tight">Au</div>
                  <div className="text-base font-black text-slate-800">Gold</div>
                  <div className="text-xs text-indigo-600 font-semibold mt-2.5">Mass: 196.97 u</div>
                  <div className="text-[9px] text-slate-400 mt-1.5 leading-tight font-mono">Config: [Xe] 4f¹⁴5d¹⁰6s¹</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: s, p, d, f Blocks Grid */}
          <div>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs font-extrabold uppercase px-2.5 py-1 rounded-md mb-2 animate-pulse">
                Quantum Chemistry
              </span>
              <h2 className="text-3xl font-black text-slate-950 tracking-tight">
                The Four Orbital Blocks (s, p, d, f)
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* s-block */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  s-Block Elements
                </span>
                <h4 className="font-extrabold text-slate-900 text-lg my-2">Spherical Orbitals</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Groups 1 & 2 plus Helium. Features outer shell electrons in simple spherical s-orbitals. Highly electropositive, active metals with low ionization energies.
                </p>
                <div className="text-[10px] font-mono text-indigo-600 bg-slate-50 px-2 py-1 rounded">
                  Key: Hydrogen, Lithium, Calcium
                </div>
              </div>

              {/* p-block */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                  p-Block Elements
                </span>
                <h4 className="font-extrabold text-slate-900 text-lg my-2">Lobed Orbitals</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Groups 13 through 18. Outer shell p-orbitals filled. Features highly diverse chemical families containing metals, metalloids, halogens, and noble gases.
                </p>
                <div className="text-[10px] font-mono text-indigo-600 bg-slate-50 px-2 py-1 rounded">
                  Key: Carbon, Oxygen, Helium, Argon
                </div>
              </div>

              {/* d-block */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                  d-Block Elements
                </span>
                <h4 className="font-extrabold text-slate-900 text-lg my-2">Transition Metals</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Groups 3 to 12. Characterized by filled inner d-orbitals. Exhibit multiple stable oxidation states, strong mechanical properties, and form highly colorful solutions.
                </p>
                <div className="text-[10px] font-mono text-indigo-600 bg-slate-50 px-2 py-1 rounded">
                  Key: Iron, Copper, Gold, Titanium
                </div>
              </div>

              {/* f-block */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-pink-50 text-pink-700">
                  f-Block Elements
                </span>
                <h4 className="font-extrabold text-slate-900 text-lg my-2">Inner Transition</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Lanthanides & Actinides. Features deep, filled f-subshells. Lanthanides are magnetic rare-earth metals; Actinides are heavy, unstable radioactive species.
                </p>
                <div className="text-[10px] font-mono text-indigo-600 bg-slate-50 px-2 py-1 rounded">
                  Key: Neodymium, Uranium, Plutonium
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Periodic Trends (Atomic Radius, Electronegativity, etc.) */}
          <div id="trends">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs font-extrabold uppercase px-2.5 py-1 rounded-md mb-2">
                Atomic Dynamics
              </span>
              <h2 className="text-3xl font-black text-slate-950 tracking-tight">
                Visualizing Periodic Trends
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Electronegativity */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:border-indigo-300 transition duration-300 relative group overflow-hidden">
                <div className="absolute top-0 left-0 h-1 w-full bg-indigo-500/20 group-hover:bg-indigo-500 transition" />
                <h4 className="font-extrabold text-slate-900 text-lg mb-2">Electronegativity</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  An atom's relative affinity to pull shared valence bonding electrons closer to itself in a chemical compound.
                </p>
                <div className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1 rounded inline-block">
                  Increases → & Up ↑
                </div>
              </div>

              {/* Atomic Radius */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:border-purple-300 transition duration-300 relative group overflow-hidden">
                <div className="absolute top-0 left-0 h-1 w-full bg-purple-500/20 group-hover:bg-purple-500 transition" />
                <h4 className="font-extrabold text-slate-900 text-lg mb-2">Atomic Radius</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  The physical distance between the atomic nucleus center and the boundary of its surrounding outer valence shell.
                </p>
                <div className="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded inline-block">
                  Decreases → & Down ↑
                </div>
              </div>

              {/* Ionization Energy */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:border-pink-300 transition duration-300 relative group overflow-hidden">
                <div className="absolute top-0 left-0 h-1 w-full bg-pink-500/20 group-hover:bg-pink-500 transition" />
                <h4 className="font-extrabold text-slate-900 text-lg mb-2">Ionization Energy</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  The quantitative thermodynamic energy required to successfully remove an electron from a gaseous atom in ground state.
                </p>
                <div className="text-[10px] font-mono font-bold bg-pink-50 text-pink-700 border border-pink-100 px-3 py-1 rounded inline-block">
                  Increases → & Up ↑
                </div>
              </div>

              {/* Electron Affinity */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:border-emerald-300 transition duration-300 relative group overflow-hidden">
                <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500/20 group-hover:bg-emerald-500 transition" />
                <h4 className="font-extrabold text-slate-900 text-lg mb-2">Electron Affinity</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  The energy change that occurs when an additional electron is successfully acquired by a neutral gaseous atom.
                </p>
                <div className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded inline-block">
                  Increases → & Up ↑
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: GEO Map Curriculum Standards */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 lg:p-12 shadow-md relative overflow-hidden">
            <div className="absolute -bottom-20 -right-20 h-48 w-48 bg-slate-50 rounded-full blur-2xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
                  <Award aria-hidden="true" className="h-4 w-4" /> Academic & Laboratory Alignment
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Global Curriculum Standards & Accelerators
                </h3>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                  Our interactive periodic table chemistry resources align seamlessly with standard curricula globally, including <strong>NCERT Chemistry Class 11</strong> (Unit 3: Classification of Elements), <strong>AP Chemistry</strong> (Unit 1: Atomic Structure and Properties), <strong>International Baccalaureate (IB) Chemistry Higher Level (Topic 3)</strong>, and <strong>GCSE / A-Level Chemistry</strong> boards in the United Kingdom.
                </p>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                  Additionally, OpenLabs matches dynamic transuranic discoveries. Heavy, synthesized elements (such as Nihonium, Moscovium, Tennessine, and Oganesson) are fabricated atom-by-atom inside particle accelerators at elite research facilities: the <strong>Joint Institute for Nuclear Research (JINR)</strong> in Dubna, Russia; the <strong>CERN</strong> complex in Geneva; the <strong>Lawrence Berkeley National Laboratory (LBNL)</strong> in California, USA; the <strong>RIKEN Nishina Center</strong> in Japan; and the <strong>GSI Helmholtz Centre</strong> in Darmstadt, Germany.
                </p>
              </div>
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col justify-center text-center shadow-inner">
                <Globe aria-hidden="true" className="h-10 w-10 text-indigo-600 mx-auto mb-3 animate-spin [animation-duration:12s]" />
                <h4 className="font-extrabold text-slate-900 text-sm mb-1">Global Standard Integration</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  OpenLabs maps classroom principles to cutting-edge research facilities across 5 continents, bringing real physics discoveries to the desktop.
                </p>
              </div>
            </div>
          </div>

        </section>

        {/* FAQ Q&A Accordion (AEO/SEO optimized) */}
        <section className="mt-16 border-t border-slate-200 pt-12">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs font-extrabold uppercase px-2.5 py-1 rounded-md mb-2">
              Help Center
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-sans">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group border border-slate-200 rounded-2xl bg-white p-6 [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:shadow-md"
              >
                <summary className="flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
                  <h4 className="font-extrabold text-slate-900 text-base md:text-lg group-open:text-indigo-600 transition-colors duration-300">
                    {faq.question}
                  </h4>
                  <span className="relative h-5 w-5 shrink-0 text-slate-400 group-open:text-indigo-600 group-open:rotate-180 transition-transform duration-300">
                    <svg
                      className="absolute inset-0 h-5 w-5 opacity-100 group-open:opacity-0 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <svg
                      className="absolute inset-0 h-5 w-5 opacity-0 group-open:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="mt-4 text-slate-600 text-sm md:text-base leading-relaxed pl-1 border-t border-slate-200 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
    </>
  );
}
