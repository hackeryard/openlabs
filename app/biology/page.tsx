import type { Metadata } from "next";
import Link from "next/link";
import BiologyExperimentExplorer, { BiologyExperiment } from "./BiologyExperimentExplorer";
import {
  Dna,
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
  title: "Biology Virtual Labs & Interactive Life Science Experiments",
  description: "Explore interactive biology experiments covering 3D cell structure, Mendelian genetics, human anatomy, cellular respiration, enzyme kinetics, osmosis, photosynthesis, blood transfusion, and neuron action potentials.",
  keywords: [
    "biology virtual lab",
    "interactive biology simulations",
    "cell structure 3d online",
    "genetics virtual lab punnett square",
    "human anatomy 3d online",
    "cellular respiration simulation",
    "enzyme kinetics virtual lab",
    "osmosis tonicity simulator",
    "photosynthesis virtual experiment",
    "neuron action potential simulator",
    "cbse biology practicals class 11 12",
    "ap biology virtual labs"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology",
  },
};

const experiments: BiologyExperiment[] = [
  {
    href: "/biology/cell",
    title: "Cell Structure & Cytology Suite",
    desc: "Interactive 3D eukaryotic animal and plant cell explorer with organelle cross-sections, plasma membranes, and chloroplast dynamics.",
    formula: "Plant & Animal Eukaryotic Organelles",
    category: "Cellular Biology",
    difficulty: "Beginner",
    duration: "15 min",
  },
  {
    href: "/biology/genetics",
    title: "Genetics & Heredity Studio",
    desc: "Simulate Monohybrid crosses, 16-cell Dihybrid matrices, DNA Transcription & Translation, and 3-generation clinical Pedigree Trees.",
    formula: "3:1 & 9:3:3:1 Mendelian Ratios",
    category: "Genetics",
    difficulty: "Intermediate",
    duration: "18 min",
  },
  {
    href: "/biology/human",
    title: "Human Anatomy Explorer",
    desc: "Explore 3D organ structures, physiological systems, cardiovascular pathways, and skeletal frameworks interactively.",
    formula: "Organ System Hierarchy",
    category: "Anatomy",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/biology/photosynthesis",
    title: "Photosynthesis & Light Reactions",
    desc: "Vary photon irradiance, CO₂ concentration, and water levels to test Blackman's Law of Limiting Factors.",
    formula: "6CO₂ + 6H₂O + hν → C₆H₁₂O₆ + 6O₂",
    category: "Physiology",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/biology/cellular-respiration",
    title: "Cellular Respiration & Mitochondrial ETC",
    desc: "Simulate mitochondrial cristae electron transport chain (Complexes I-IV), proton gradient pumping, rotary ATP Synthase, and metabolic poisons.",
    formula: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 36-38 ATP",
    category: "Cellular Biology",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/biology/enzyme-kinetics",
    title: "Enzyme Kinetics & Catalysis",
    desc: "Explore Michaelis-Menten enzyme kinetics, Lineweaver-Burk double reciprocal plots, competitive/allosteric inhibitors, and thermal denaturation.",
    formula: "v = (V_max · [S]) / (K_m + [S])",
    category: "Physiology",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/biology/osmosis-tonicity",
    title: "Osmosis, Diffusion & Cell Tonicity",
    desc: "Simulate selective membrane diffusion, Van 't Hoff osmotic pressure, red blood cell hemolysis/crenation, and plant cell turgor pressure.",
    formula: "Ψ_w = Ψ_s + Ψ_p, Π = iCRT",
    category: "Cellular Biology",
    difficulty: "Beginner",
    duration: "12 min",
  },
  {
    href: "/biology/blood",
    title: "Blood Transfusion & ABO Matching",
    desc: "Analyze erythrocyte antigens, antibody agglutination reactions, and clinical donor-recipient rules.",
    formula: "ABO & Rh Antigen Compatibility",
    category: "Physiology",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/biology/brainNeuron",
    title: "Neuron Signaling & Action Potentials",
    desc: "Trace voltage-gated Na⁺/K⁺ ion channel conduction, threshold depolarization, and neurotransmitter synapses.",
    formula: "V_m = -70 mV → +30 mV",
    category: "Neuroscience",
    difficulty: "Intermediate",
    duration: "15 min",
  },
];

const faqs = [
  {
    q: "How does OpenLabs model biological systems and physiological reactions?",
    a: "Our biology experiments model light-harvesting photosystem kinetics, Mendelian stochastic genetic probability engines, and Hodgkin-Huxley differential equations for neuron membrane potential transitions with verified accuracy.",
  },
  {
    q: "Can these experiments be used for school or university lab practicals?",
    a: "Yes. All OpenLabs biology modules include step-by-step observational protocols, data recording tables, and interactive quizzes aligned with CBSE Class 11/12, AP Biology, and IB Biology HL/SL practicals.",
  },
  {
    q: "How are the 3D cell and anatomical models rendered?",
    a: "All 3D organelle and anatomical models run in real time using GPU-accelerated WebGL directly in your browser without any plugins or downloads.",
  },
  {
    q: "Are the genetic Punnett calculations randomized or static?",
    a: "The genetic simulators run stochastic Monte Carlo sampling alongside analytical binomial distributions to demonstrate real-world statistical variation in offspring ratios.",
  },
  {
    q: "Is OpenLabs biology free for students and teachers?",
    a: "Yes. OpenLabs is completely free and open for educational learning.",
  },
];

const howToSteps = [
  {
    step: 1,
    title: "Select Biological System or Cross",
    desc: "Choose from 3D cytology, genetics studios, plant physiology, human anatomy, cellular respiration, or neuron conduction.",
  },
  {
    step: 2,
    title: "Adjust Environmental & Genetic Factors",
    desc: "Vary light wavelength, CO₂ saturation, parental genotypes, substrate concentrations, or membrane ion permeabilities in real time.",
  },
  {
    step: 3,
    title: "Observe Microscopic Kinetics & Offspring",
    desc: "Track real-time oxygen evolution rate, ATP synthesis rates, action potential depolarization spikes, or generational population ratios.",
  },
  {
    step: 4,
    title: "Quantify Biological Telemetry & Export",
    desc: "Analyze Chi-Square statistical goodness of fit (χ²), Lineweaver-Burk double reciprocal plots, and export CSV data tables.",
  },
];

const scientificPrinciples = [
  {
    domain: "Cellular Biology & Respiration",
    laws: "Chemiosmotic Coupling & Electron Transport",
    formulas: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O, ΔG°' = -2870 kJ/mol",
    solver: "Proton Motive Force & Rotary ATP Synthase Engine",
  },
  {
    domain: "Enzyme Kinetics",
    laws: "Michaelis-Menten Kinetics & Lineweaver-Burk",
    formulas: "v = (V_max [S]) / (K_m + [S]), 1/v = (K_m/V_max)(1/[S]) + 1/V_max",
    solver: "Nonlinear Substrate-Enzyme Interaction Model",
  },
  {
    domain: "Mendelian Genetics",
    laws: "Law of Segregation & Independent Assortment",
    formulas: "P(A ∩ B) = P(A) × P(B), χ² = Σ((O - E)² / E)",
    solver: "Binomial Probability & Monte Carlo Sampling Engine",
  },
  {
    domain: "Plant Physiology & Photosynthesis",
    laws: "Blackman's Law of Limiting Factors, Hill Reaction",
    formulas: "6CO₂ + 6H₂O + hν → C₆H₁₂O₆ + 6O₂",
    solver: "Multivariate Saturation Curve & Light-Harvesting Solver",
  },
  {
    domain: "Cellular Neurophysiology",
    laws: "Hodgkin-Huxley Action Potential, Nernst-Goldman",
    formulas: "V_m = (RT/F) ln[(P_K[K⁺]_o + P_Na[Na⁺]_o)/(P_K[K⁺]_i + P_Na[Na⁺]_i)]",
    solver: "Nonlinear 4-ODE Ion Channel Permeability Solver",
  },
];

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.openlabs.org.in/biology#webpage",
  url: "https://www.openlabs.org.in/biology",
  name: "Biology Virtual Labs and Interactive Experiments",
  description: "Free interactive virtual biology experiments covering cellular biology, genetics, human anatomy, neuron transmission, and photosynthesis.",
  inLanguage: "en",
  about: {
    "@type": "Thing",
    name: "Biology",
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
  name: "How to Run Virtual Biology Simulations and Genetic Crosses on OpenLabs",
  description: "Step-by-step procedure to perform cell cytology, photosynthesis assays, and genetic inheritance experiments online.",
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
      name: "Biology",
      item: "https://www.openlabs.org.in/biology",
    },
  ],
};

const features = [
  {
    icon: Gauge,
    title: "Real-time physiological parameters",
    desc: "Adjust photon flux, substrate concentration, CO₂ levels, and ion permeability to observe live biological response.",
    color: "rose",
  },
  {
    icon: LineChart,
    title: "Live growth & transmission curves",
    desc: "Record action potential graphs, Lineweaver-Burk plots, and biochemical reaction rates dynamically.",
    color: "emerald",
  },
  {
    icon: GraduationCap,
    title: "Curriculum aligned standards",
    desc: "Strictly follows CBSE/NCERT Biology Class 11/12, AP Biology, and IB Biology HL/SL frameworks.",
    color: "purple",
  },
];

export default function BiologyPage() {
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
        <div className="absolute top-12 left-1/4 h-[400px] w-[400px] rounded-full bg-rose-500/5 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 h-[350px] w-[350px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition font-medium">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold">Biology</span>
          </nav>

          {/* Hero */}
          <header className="mb-14">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider shadow-sm">
                  <Dna className="h-3.5 w-3.5 text-rose-600 animate-pulse" aria-hidden="true" />
                  Virtual Laboratory
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight leading-none">
                  Biology{" "}
                  <span className="bg-gradient-to-r from-rose-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">
                    Experiments
                  </span>
                </h1>

                <p className="text-muted-foreground text-base md:text-lg font-medium max-w-2xl leading-relaxed">
                  Explore 3D cellular structures, Mendelian genetics suites, neural signaling, enzyme kinetics, and cellular respiration — interactively in your browser.
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

          {/* Experiment Explorer (search + filters + grid) */}
          <BiologyExperimentExplorer experiments={experiments} />

          {/* Value Features Grid */}
          <section className="mt-20 mb-16" aria-labelledby="biology-features-heading">
            <h2 id="biology-features-heading" className="sr-only">Biology lab features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f) => {
                const Icon = f.icon;
                const colorMap: Record<string, string> = {
                  rose: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-100 dark:border-rose-900",
                  emerald: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-100 dark:border-emerald-900",
                  purple: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 border-purple-100 dark:border-purple-900",
                };
                return (
                  <div
                    key={f.title}
                    className="group bg-card/80 backdrop-blur-sm border border-border/60 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:shadow-rose-500/5 hover:border-rose-200 hover:-translate-y-1 transition-all duration-300"
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

          {/* SEO / AEO Section: Step-by-Step Practical Life Science Protocol */}
          <section
            aria-labelledby="biology-howto-heading"
            className="bg-card/90 backdrop-blur-sm border border-border/80 rounded-3xl p-8 lg:p-10 shadow-sm mb-16 relative overflow-hidden"
          >
            <div className="space-y-4 max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider text-xs">
                <Activity className="h-4 w-4 animate-pulse" aria-hidden="true" />
                Experimental Methodology
              </div>
              <h2 id="biology-howto-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                How to Run Virtual Biology Simulations &amp; Genetic Crosses
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                Our virtual biology laboratory provides high-fidelity cellular cytology, neural membrane dynamics, enzyme kinetics, and Mendelian stochastic genetics cross engines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howToSteps.map((item) => (
                <div
                  key={item.step}
                  className="bg-muted/50 border border-border/70 rounded-2xl p-5 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-rose-600 text-white font-black text-xs shadow-sm">
                      {item.step}
                    </span>
                    <h3 className="font-extrabold text-foreground text-sm tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 pt-2 border-t border-border/40">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Biological Validity</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* GEO Section: Biological Models & Mathematical Solvers */}
          <section
            aria-labelledby="biology-principles-heading"
            className="bg-card border border-border/80 rounded-3xl p-8 lg:p-10 shadow-sm mb-16 overflow-hidden"
          >
            <div className="space-y-3 mb-8">
              <div className="inline-flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider text-xs">
                <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
                Computational Biology Framework
              </div>
              <h2 id="biology-principles-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Biological Models &amp; Quantitative Solvers
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-3xl">
                OpenLabs models cellular physiology and genetic inheritance through coupled differential equations and statistical probability distributions.
              </p>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/60 text-foreground font-black uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 rounded-l-xl">Biological Field</th>
                    <th className="py-3 px-4">Governing Principles</th>
                    <th className="py-3 px-4">Core Mathematical Equations</th>
                    <th className="py-3 px-4 rounded-r-xl">Numerical Solver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium text-muted-foreground">
                  {scientificPrinciples.map((sp) => (
                    <tr key={sp.domain} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground">{sp.domain}</td>
                      <td className="py-3.5 px-4">{sp.laws}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">{sp.formulas}</td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-foreground/80">{sp.solver}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Curriculum Section */}
          <section
            aria-labelledby="biology-standards-heading"
            className="bg-card border border-border/80 rounded-3xl p-8 lg:p-10 shadow-md relative overflow-hidden mb-16"
          >
            <div className="absolute top-0 right-0 h-32 w-32 bg-muted rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider text-xs">
                  <BookOpen className="h-4 w-4 animate-pulse" aria-hidden="true" />
                  Educational Curriculum Alignment
                </div>
                <h2 id="biology-standards-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  Academic Framework Integration &amp; Standards
                </h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                  Our virtual biology laboratory modules are systematically aligned with international standards including <strong>NCERT Biology Class 11 &amp; 12</strong>, <strong>AP Biology</strong>, <strong>IB Biology HL/SL</strong>, and <strong>Cambridge IGCSE / A-Levels</strong>.
                </p>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                  OpenLabs provides deep microscopic models and real-time biological telemetry to illustrate microscopic cellular dynamics, enzyme kinetics, and complex genetic inheritances.
                </p>
              </div>

              <div className="lg:col-span-4 bg-muted border border-border p-6 rounded-2xl flex flex-col justify-center text-center shadow-inner">
                <Compass className="h-10 w-10 text-rose-600 dark:text-rose-400 mx-auto mb-3 animate-spin [animation-duration:12s]" aria-hidden="true" />
                <h3 className="font-extrabold text-foreground text-sm mb-1">Microscopic Simulation</h3>
                <p className="text-[11px] text-muted-foreground leading-normal font-medium">
                  Observe cellular biology and biochemical pathways at microscopic resolution in your browser.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16" aria-labelledby="biology-faq-heading">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 items-start">
                <div className="md:col-span-1 md:sticky md:top-24">
                  <h2 id="biology-faq-heading" className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-muted-foreground text-base">
                    Technical and pedagogical details about our virtual biology labs.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors group"
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
                      name="biology-faq"
                      className="group rounded-2xl bg-card border border-border/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden open:border-rose-200 open:shadow-md transition-all duration-300"
                    >
                      <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-inset rounded-2xl">
                        <span className="font-semibold text-foreground text-[1.05rem] group-hover:text-rose-600 transition-colors pr-6">
                          {faq.q}
                        </span>
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center group-open:bg-primary/10 group-open:border-primary/20 group-hover:bg-accent transition-colors">
                          <svg
                            className="w-4 h-4 text-muted-foreground group-open:text-rose-600 group-open:rotate-180 transition-transform duration-500 ease-spring-smooth"
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
              All simulations are free for educational use. Validated against standard biological research datasets.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
