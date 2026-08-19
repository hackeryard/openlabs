import type { Metadata } from "next";
import Link from "next/link";
import ChemistryExperimentExplorer, { ChemistryExperiment } from "./ChemistryExperimentExplorer";
import CurriculumTracksExplorer from "@/app/components/CurriculumTracksExplorer";
import {
  FlaskConical,
  Flame,
  ArrowRight,
  Gauge,
  LineChart,
  GraduationCap,
  BookOpen,
  Compass,
  Activity,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Chemistry Virtual Labs & Interactive Chemical Simulations",
  description: "Explore interactive chemistry experiments including real-time periodic table, chemical bonding, reaction kinetics, gas laws, titration, and atomic flame spectroscopy.",
  keywords: [
    "chemistry virtual lab",
    "interactive chemistry simulations",
    "periodic table interactive",
    "chemical reaction simulator",
    "virtual titration lab",
    "gas laws simulation",
    "chemical bonding 3d",
    "atomic flame test online",
    "cbse chemistry practicals class 11 12",
    "ap chemistry virtual labs"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/chemistry",
  },
};

const experiments: ChemistryExperiment[] = [
  {
    href: "/chemistry/periodictable",
    title: "Interactive 3D Periodic Table",
    desc: "Explore electron configurations, electronegativity trends, atomic radii, and ionization energies.",
    formula: "Z, Configuration, Radii & Trends",
    category: "Atomic Structure",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/chemistry/flametest",
    title: "Atomic Emission Flame Spectra",
    desc: "Observe characteristic emission wavelengths and photon energy transitions for alkali and alkaline metals.",
    formula: "E = hc / λ",
    category: "Atomic Structure",
    difficulty: "Beginner",
    duration: "8 min",
  },
  {
    href: "/chemistry/chemicalbonds",
    title: "Covalent & Ionic Bonding Sandbox",
    desc: "Visualize electron sharing, orbital hybridization (sp, sp², sp³), dipole moments, and lattice energies.",
    formula: "ΔEN, Dipole μ = q × d",
    category: "Molecular",
    difficulty: "Intermediate",
    duration: "12 min",
  },
  {
    href: "/chemistry/reaction-simulation",
    title: "Dynamic Chemical Reaction Builder",
    desc: "Simulate synthesis, decomposition, and redox reactions with real-time stoichiometric coefficient balancing.",
    formula: "aA + bB ⇌ cC + dD",
    category: "Physical",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/chemistry/titration",
    title: "Acid-Base Titration & pH Curves",
    desc: "Perform precision burette titrations, monitor indicators (phenolphthalein/methyl orange), and plot pH titration curves.",
    formula: "M₁V₁ = M₂V₂, pH = -log[H⁺]",
    category: "Analytical",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/chemistry/gas-laws",
    title: "Ideal Gas Laws & Kinetic Theory",
    desc: "Vary pressure, volume, temperature, and moles to observe Boyle's, Charles's, and Gay-Lussac's gas behaviors.",
    formula: "PV = nRT, (P + an²/V²)(V - nb) = nRT",
    category: "Physical",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/chemistry/water-quality",
    title: "Water Quality & Environmental Chemistry",
    desc: "Measure turbidity, dissolved oxygen, pH, and heavy metal concentrations against WHO safety thresholds.",
    formula: "DO, TDS, PPM & Hardness Metrics",
    category: "Analytical",
    difficulty: "Beginner",
    duration: "12 min",
  },
  {
    href: "/chemistry/salt-analysis",
    title: "Qualitative Cation & Anion Analysis",
    desc: "Conduct systematic wet tests, precipitation reactions, and confirmatory salt identification schemes.",
    formula: "Group Separation & Solubilities",
    category: "Analytical",
    difficulty: "Advanced",
    duration: "18 min",
  },
  {
    href: "/chemistry/redox",
    title: "Electrochemistry & Galvanic Cells",
    desc: "Construct electrochemical half-cells, calculate standard reduction potentials (E°), and verify the Nernst equation.",
    formula: "E_cell = E° - (RT/nF) ln Q",
    category: "Physical",
    difficulty: "Advanced",
    duration: "15 min",
  },
  {
    href: "/chemistry/organic-reactions",
    title: "Organic Reaction Mechanisms",
    desc: "Trace nucleophilic substitution (SN1/SN2), electrophilic addition, and elimination pathways step by step.",
    formula: "Transition States & Carbocation Intermediates",
    category: "Molecular",
    difficulty: "Advanced",
    duration: "20 min",
  },
];

const faqs = [
  {
    q: "How does OpenLabs simulate chemical equilibrium and reaction rates?",
    a: "OpenLabs utilizes law-of-mass-action kinetic differential equations coupled with the Arrhenius equation to calculate real-time forward and reverse reaction rates, equilibrium concentrations, and Le Chatelier temperature/pressure shifts.",
  },
  {
    q: "Are the titration pH curves calculated dynamically or pre-rendered?",
    a: "Every titration step calculates the exact ionic equilibrium and Henderson-Hasselbalch buffer equations dynamically based on titrant volume, conjugate acid/base dissociation constants (Ka/Kb), and autoionization of water (Kw).",
  },
  {
    q: "Is OpenLabs chemistry aligned with CBSE Class 11 & 12, AP Chemistry, and IB Chemistry?",
    a: "Yes. All experiments follow standard syllabus practicals including qualitative salt analysis, volumetric acid-base titrations, chemical kinetics, and standard reduction potentials.",
  },
  {
    q: "Can I export reaction data, molarity graphs, and titration data?",
    a: "Yes. All data streams, pH curves, and spectrophotometric absorbances can be exported as structured CSV files for lab reports and statistical verification.",
  },
  {
    q: "Is the OpenLabs chemistry laboratory free for schools and universities?",
    a: "Yes. All chemistry experiments, reaction builders, and 3D molecular models are 100% free and open for educational use.",
  },
];

const howToSteps = [
  {
    step: 1,
    title: "Select Reaction or Titration Setup",
    desc: "Choose an atomic, molecular, physical, or analytical experiment and select the reagents, concentrations, and initial temperatures.",
  },
  {
    step: 2,
    title: "Configure Concentrations & Variables",
    desc: "Adjust burette volume drip rates, molar concentrations, activation energies, and catalysts in real time.",
  },
  {
    step: 3,
    title: "Monitor Real-Time Stoichiometry & pH",
    desc: "Observe dynamic color indicators, pH curve inflections, gas pressure readouts, and temperature exothermic/endothermic curves.",
  },
  {
    step: 4,
    title: "Analyze Equilibrium & Export Data",
    desc: "Calculate molarities from equivalence points, verify Le Chatelier shifts, and export observation data tables.",
  },
];

const scientificPrinciples = [
  {
    domain: "Chemical Thermodynamics",
    laws: "Le Chatelier's Principle, Gibbs Free Energy, Van 't Hoff Equation",
    formulas: "ΔG° = -RT ln K, ln(K₂/K₁) = -ΔH°/R (1/T₂ - 1/T₁)",
    solver: "Gibbs Free Energy Minimization & Mass-Action Kinetics",
  },
  {
    domain: "Acid-Base Equilibrium",
    laws: "Henderson-Hasselbalch Equation, Ostwald Dilution Law",
    formulas: "pH = pKa + log([A⁻]/[HA]), Kw = [H⁺][OH⁻] = 10⁻¹⁴",
    solver: "Nonlinear Charge Balance Polynomial Root Finder",
  },
  {
    domain: "Chemical Kinetics",
    laws: "Arrhenius Rate Equation, Integrated Rate Laws",
    formulas: "k = A e^(-Ea/RT), ln[A] = ln[A]₀ - kt",
    solver: "Coupled Reaction Ordinary Differential Equations (ODEs)",
  },
  {
    domain: "Electrochemistry",
    laws: "Nernst Equation, Faraday's Laws of Electrolysis",
    formulas: "E_cell = E° - (0.0592/n) log Q, m = (Q × M)/(z × F)",
    solver: "Standard Reduction Potentials & Electrochemical Matrix",
  },
  {
    domain: "Kinetic Gas Theory",
    laws: "Ideal Gas Law, Van der Waals Real Gas Equation",
    formulas: "PV = nRT, (P + an²/V²)(V - nb) = nRT",
    solver: "Cubic Equation of State Analytical Solver",
  },
];

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.openlabs.org.in/chemistry#webpage",
  url: "https://www.openlabs.org.in/chemistry",
  name: "Chemistry Virtual Labs and Interactive Experiments",
  description: "Free interactive virtual chemistry experiments covering atomic structure, chemical bonding, reactions, titrations, and gas laws.",
  inLanguage: "en",
  about: {
    "@type": "Thing",
    name: "Chemistry",
  },
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
  itemListElement: experiments.map((experiment, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `https://www.openlabs.org.in${experiment.href}`,
    name: experiment.title,
  })),
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Perform Chemistry Virtual Experiments and Titrations on OpenLabs",
  description: "Step-by-step procedure to configure reactants, monitor reaction kinetics, and collect analytical chemistry data.",
  step: howToSteps.map((s) => ({
    "@type": "HowToStep",
    position: s.step,
    name: s.title,
    text: s.desc,
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
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

const features = [
  {
    icon: Gauge,
    title: "Real-time stoichiometric controls",
    desc: "Adjust reagent molarities, temperatures, and pressures to observe instantaneous reaction equilibrium shifts.",
    color: "emerald",
  },
  {
    icon: LineChart,
    title: "Live spectroscopic & titration data",
    desc: "Monitor dynamic pH curves, emission spectrum wavelengths, and enthalpy changes with live graphing.",
    color: "teal",
  },
  {
    icon: GraduationCap,
    title: "Curriculum & standard aligned",
    desc: "Structured alongside CBSE/NCERT Class 11/12, AP Chemistry, and IB Chemistry HL/SL syllabi.",
    color: "purple",
  },
];

export default function ChemistryPage() {
  const domainCount = new Set(experiments.map((e) => e.category)).size;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main
        id="main-content"
        className="min-h-screen text-foreground pb-20 pt-8 font-sans relative overflow-hidden bg-[radial-gradient(hsl(var(--border))_1.5px,transparent_1.5px)] bg-[size:24px_24px]"
      >
        {/* Ambient glow blobs */}
        <div className="absolute top-12 left-1/4 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 h-[500px] w-[500px] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 h-[350px] w-[350px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition font-medium">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Chemistry</span>
          </nav>

          {/* Hero */}
          <header className="mb-14">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider shadow-sm">
                  <Flame className="h-3.5 w-3.5 text-emerald-600 animate-pulse" aria-hidden="true" />
                  Virtual Laboratory
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight leading-none">
                  Chemistry{" "}
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">
                    Experiments
                  </span>
                </h1>

                <p className="text-muted-foreground text-base md:text-lg font-medium max-w-2xl leading-relaxed">
                  Interactive chemical reaction builders, 3D molecular structures, and analytical spectroscopy — explore molecules and thermodynamics in your browser.
                </p>
              </div>

              {/* Stats pills */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl px-5 py-3 shadow-sm">
                  <span className="text-2xl font-black text-foreground">{experiments.length}</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">experiments</span>
                </div>
                <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl px-5 py-3 shadow-sm">
                  <span className="text-2xl font-black text-foreground">{domainCount}</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">domains</span>
                </div>
              </div>
            </div>
          </header>

          {/* Chemistry Guided Curriculum Tracks */}
          <div className="mb-14">
            <CurriculumTracksExplorer
              subjectFilter="chemistry"
              title="Chemistry Curriculum Tracks"
              subtitle="Follow structured sequence pathways from atomic structure and trends to physical kinetics and analytical titrations."
              showFilters={false}
            />
          </div>

          {/* Experiment Explorer (search + filters + grid) */}
          <ChemistryExperimentExplorer experiments={experiments} />

          {/* Value Features Grid */}
          <section className="mt-20 mb-16" aria-labelledby="chemistry-features-heading">
            <h2 id="chemistry-features-heading" className="sr-only">Chemistry lab features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f) => {
                const Icon = f.icon;
                const colorMap: Record<string, string> = {
                  emerald: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-100 dark:border-emerald-900",
                  teal: "bg-teal-50 dark:bg-teal-950/40 text-teal-600 border-teal-100 dark:border-teal-900",
                  purple: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 border-purple-100 dark:border-purple-900",
                };
                return (
                  <div
                    key={f.title}
                    className="group bg-card/80 backdrop-blur-sm border border-border/60 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center mb-5 shadow-sm transition ${colorMap[f.color]}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-extrabold text-foreground tracking-tight mb-2">
                      {f.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      {f.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SEO / AEO Section: Step-by-Step Practical Chemistry Protocol */}
          <section
            aria-labelledby="chemistry-howto-heading"
            className="bg-card/90 backdrop-blur-sm border border-border/80 rounded-3xl p-8 lg:p-10 shadow-sm mb-16 relative overflow-hidden"
          >
            <div className="space-y-4 max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs">
                <Activity className="h-4 w-4 animate-pulse" aria-hidden="true" />
                Experimental Methodology
              </div>
              <h2 id="chemistry-howto-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                How to Perform Virtual Chemistry Experiments &amp; Titrations
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                Our virtual chemistry laboratory provides precision volumetric titration tools, reaction equilibrium builders, and molecular models adhering to laboratory safety standards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howToSteps.map((item) => (
                <div
                  key={item.step}
                  className="bg-muted/50 border border-border/70 rounded-2xl p-5 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-emerald-600 text-white font-black text-xs shadow-sm">
                      {item.step}
                    </span>
                    <h3 className="font-extrabold text-foreground text-sm tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 pt-2 border-t border-border/40">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Stoichiometric Precision</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* GEO Section: Governing Chemical Thermodynamics & Reaction Models */}
          <section
            aria-labelledby="chemistry-principles-heading"
            className="bg-card border border-border/80 rounded-3xl p-8 lg:p-10 shadow-sm mb-16 overflow-hidden"
          >
            <div className="space-y-3 mb-8">
              <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs">
                <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
                Thermodynamic &amp; Kinetic Solvers
              </div>
              <h2 id="chemistry-principles-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Governing Chemical Laws &amp; Mathematical Solvers
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-3xl">
                OpenLabs chemistry simulations continuously solve equilibrium state equations, acid-base proton dissociation, and reaction activation energy rates in real time.
              </p>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/60 text-foreground font-black uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 rounded-l-xl">Chemistry Domain</th>
                    <th className="py-3 px-4">Governing Principles</th>
                    <th className="py-3 px-4">Core Mathematical Formulas</th>
                    <th className="py-3 px-4 rounded-r-xl">Numerical Solver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium text-muted-foreground">
                  {scientificPrinciples.map((sp) => (
                    <tr key={sp.domain} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground">{sp.domain}</td>
                      <td className="py-3.5 px-4">{sp.laws}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{sp.formulas}</td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-foreground/80">{sp.solver}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Curriculum Section */}
          <section
            aria-labelledby="chemistry-standards-heading"
            className="bg-card border border-border/80 rounded-3xl p-8 lg:p-10 shadow-md relative overflow-hidden mb-16"
          >
            <div className="absolute top-0 right-0 h-32 w-32 bg-muted rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs">
                  <BookOpen className="h-4 w-4 animate-pulse" aria-hidden="true" />
                  Educational Curriculum Alignment
                </div>
                <h2 id="chemistry-standards-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  Academic Framework Integration &amp; Standards
                </h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                  Our virtual chemistry laboratory modules are systematically aligned with international standards including <strong>CBSE Chemistry Class 11 and 12</strong>, <strong>AP Chemistry</strong>, <strong>IB Chemistry HL/SL</strong>, and <strong>Cambridge IGCSE / A-Levels</strong>.
                </p>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                  OpenLabs provides deep molecular models and real-time stoichiometry to illustrate atomic flame spectra, redox potentials, and volumetric analytical curves.
                </p>
              </div>

              <div className="lg:col-span-4 bg-muted border border-border p-6 rounded-2xl flex flex-col justify-center text-center shadow-inner">
                <Compass className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-3 animate-spin [animation-duration:12s]" aria-hidden="true" />
                <h3 className="font-extrabold text-foreground text-sm mb-1">Stoichiometric Engine</h3>
                <p className="text-[11px] text-muted-foreground leading-normal font-medium">
                  Continuously balance moles, molar mass, and reaction yields with immediate visual feedback.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16" aria-labelledby="chemistry-faq-heading">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 items-start">
                <div className="md:col-span-1 md:sticky md:top-24">
                  <h2 id="chemistry-faq-heading" className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-muted-foreground text-base">
                    Technical and pedagogical details about our chemistry virtual labs.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors group"
                    >
                      Contact research team
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  {faqs.map((faq) => (
                    <details
                      key={faq.q}
                      name="chemistry-faq"
                      className="group rounded-2xl bg-card border border-border/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden open:border-emerald-200 open:shadow-md transition-all duration-300"
                    >
                      <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset rounded-2xl">
                        <span className="font-semibold text-foreground text-[1.05rem] group-hover:text-emerald-600 transition-colors pr-6">
                          {faq.q}
                        </span>
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center group-open:bg-primary/10 group-open:border-primary/20 group-hover:bg-accent transition-colors">
                          <svg
                            className="w-4 h-4 text-muted-foreground group-open:text-emerald-600 group-open:rotate-180 transition-transform duration-500 ease-spring-smooth"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <div className="px-6 pb-6 pt-1 text-muted-foreground leading-relaxed border-t border-border mt-1">
                        <p>{faq.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Footer note */}
          <footer className="text-center py-8 border-t border-border/60">
            <p className="text-xs text-muted-foreground font-medium">
              All simulations are free for educational use. Validated against standard chemical thermodynamics databases.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
