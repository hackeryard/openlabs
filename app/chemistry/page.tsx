import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chemistry Virtual Labs & Interactive Experiments | OpenLabs",
  description: "Explore interactive chemistry experiments including periodic table, chemical bonds, reaction simulation, and water quality analysis.",
  keywords: [
    "chemistry experiments",
    "interactive chemistry",
    "periodic table",
    "chemical bonds",
    "reaction simulation",
    "water quality",
    "virtual chemistry lab",
    "chemistry education",
    "STEM chemistry",
    "molecular bonding"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/chemistry",
  },
  openGraph: {
    title: "Chemistry Virtual Labs & Interactive Experiments | OpenLabs",
    description: "Explore interactive chemistry experiments including periodic table, chemical bonds, reaction simulation, and water quality analysis.",
    url: "https://www.openlabs.org.in/chemistry",
    type: "website",
    images: [{
      url: "https://www.openlabs.org.in/images/og-image.svg",
      width: 1200,
      height: 630,
      alt: "Chemistry Virtual Labs | OpenLabs"
    }]
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
    title: "Chemistry Virtual Labs & Interactive Experiments | OpenLabs",
    description: "Explore interactive chemistry experiments including periodic table, chemical bonds, reaction simulation, and water quality analysis.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import Link from "next/link";
import ChemistryChatInitializer from "./ChemistryChatInitializer";
import {
  Atom,
  FlaskConical,
  Activity,
  Milestone,
  ArrowRight,
  BookOpen,
  Compass,
} from "lucide-react";

const cards = [
  {
    href: "/chemistry/periodictable",
    title: "Interactive Periodic Table",
    desc: "Explore dynamic element monographs, Bohr shell rotations, and dynamic Aufbau exceptions.",
    badge: "WebGL Bohr Simulator",
    color: "indigo",
    icon: Atom,
  },
  {
    href: "/chemistry/chemicalbonds",
    title: "Chemical Bond Types",
    desc: "Simulate covalent, ionic, and metallic bonding parameters and examine lattice behaviors.",
    badge: "Molecular bonding",
    color: "teal",
    icon: Milestone,
  },
  {
    href: "/chemistry/reaction-simulation",
    title: "Chemical Reactions Hub",
    desc: "Simulate double-displacement reactions, combustion ratios, and exothermic reactions.",
    badge: "Reaction Telemetry",
    color: "purple",
    icon: FlaskConical,
  },
  {
    href: "/chemistry/water-quality",
    title: "Water Quality Analysis",
    desc: "Simulate acid-base titrations, analyze pH parameters, and detect dissolved elements.",
    badge: "Titration Laboratory",
    color: "sky",
    icon: Activity,
  },
];

const webpageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.openlabs.org.in/chemistry#webpage",
  url: "https://www.openlabs.org.in/chemistry",
  name: "Chemistry Interactive Labs | OpenLabs",
  description:
    "Chemistry virtual lab portal featuring interactive periodic table, bonding simulations, reaction modeling, and water quality analysis.",
  inLanguage: "en",
  isPartOf: {
    "@type": "WebSite",
    "@id": "https://www.openlabs.org.in/#website",
    name: "OpenLabs",
    url: "https://www.openlabs.org.in/",
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: cards.map((card, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `https://www.openlabs.org.in${card.href}`,
    name: card.title,
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.openlabs.org.in/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Chemistry",
      item: "https://www.openlabs.org.in/chemistry",
    },
  ],
};

export default function ChemistryPage() {
  return (
    <>
      <ChemistryChatInitializer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <a
        href="#main-content"
        className="absolute left-4 -top-16 z-50 rounded bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow transition-all focus:top-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Skip to main content
      </a>

      <main
        id="main-content"
        className="min-h-screen bg-slate-50 text-slate-800 pb-20 pt-8 font-sans relative overflow-hidden bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] bg-[size:24px_24px]"
      >
        <div className="absolute top-12 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-950 transition font-medium">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-indigo-600 font-bold">Chemistry</span>
          </nav>

          <div className="space-y-4 mb-12 text-left">
            <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider shadow-sm">
              <FlaskConical className="h-3.5 w-3.5 text-indigo-600 animate-pulse" aria-hidden="true" />
              Virtual Laboratory Gateway
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
              Chemistry <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                Interactive Labs
              </span>
            </h1>

            <p className="text-slate-500 text-base md:text-lg font-medium max-w-3xl leading-relaxed">
              Welcome to the OpenLabs Chemistry Portal. Interact with dynamic periodic trends, configure atomic Bohr orbitals in full 3D, simulate exothermic chemical reactions, and analyze water titration curves in our GPU-accelerated science sandbox.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {cards.map((card) => {
              const Icon = card.icon;
              const colorClasses =
                card.color === "indigo"
                  ? "bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:border-indigo-400 group-hover:shadow-indigo-100/50"
                  : card.color === "teal"
                  ? "bg-teal-50 text-teal-600 border-teal-100 group-hover:border-teal-400 group-hover:shadow-teal-100/50"
                  : card.color === "purple"
                  ? "bg-purple-50 text-purple-600 border-purple-100 group-hover:border-purple-400 group-hover:shadow-purple-100/50"
                  : "bg-sky-50 text-sky-600 border-sky-100 group-hover:border-sky-400 group-hover:shadow-sky-100/50";

              return (
                <div key={card.href} className="group">
                  <Link
                    href={card.href}
                    className="h-full bg-white rounded-3xl border border-slate-200 p-6 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                    aria-label={`Go to ${card.title}`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 group-hover:bg-indigo-500/20 transition-all" />
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center transition shadow-sm ${colorClasses}`}>
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 shadow-inner">
                          {card.badge}
                        </span>
                      </div>

                      <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2.5 tracking-tight leading-snug">
                        {card.title}
                      </h2>
                      <p className="text-slate-500 text-xs leading-relaxed font-medium">
                        {card.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-50 text-[10px] font-extrabold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Enter Laboratory <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          <section
            aria-labelledby="chemistry-standards-heading"
            className="bg-white border border-slate-200/80 rounded-3xl p-8 lg:p-10 shadow-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-32 w-32 bg-slate-50 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
                  <BookOpen className="h-4 w-4 animate-pulse" aria-hidden="true" />
                  Educational Curriculum Alignment
                </div>
                <h2 id="chemistry-standards-heading" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Academic Framework Integration & Standards
                </h2>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                  Our virtual chemistry laboratory modules are meticulously aligned with standard global high school and collegiate academic frameworks. This includes <strong>NCERT Chemistry Class 11 and 12</strong> (Unit 3: Elements Classification, Unit 4: Bonding), <strong>AP Chemistry</strong> (Units 1 & 2: Atomic and Molecular Structures), <strong>IB Chemistry Higher Level (HL/SL)</strong>, and <strong>Cambridge GCSE / A-Levels</strong> core units.
                </p>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                  OpenLabs provides high-fidelity dynamic sandbox visualizations enabling interactive homework accelerators. Telemetry feeds map to standard titration curves, Aufbau ground states, molecular orbitals, and aqueous dissolved particle assays.
                </p>
              </div>

              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col justify-center text-center shadow-inner">
                <Compass className="h-10 w-10 text-indigo-600 mx-auto mb-3 animate-spin [animation-duration:12s]" aria-hidden="true" />
                <h3 className="font-extrabold text-slate-900 text-sm mb-1">Interactive Telemetry</h3>
                <p className="text-[11px] text-slate-400 leading-normal font-medium">
                  OpenLabs bridges standard academic theory with interactive WebGL models to optimize student conceptual retention and research comprehension.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
