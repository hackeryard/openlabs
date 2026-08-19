import type { Metadata } from "next";
import Link from "next/link";
import PhysicsExperimentExplorer, { PhysicsExperiment } from "./PhysicsExperimentExplorer";
import CurriculumTracksExplorer from "@/app/components/CurriculumTracksExplorer";
import {
  Orbit,
  ArrowRight,
  Gauge,
  LineChart,
  GraduationCap,
  BookOpen,
  Compass,
  SlidersHorizontal,
  Activity,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Physics Virtual Labs & Interactive Online Experiments",
  description: "Explore free interactive physics virtual labs covering mechanics, circuits, wave optics, electromagnetism, and quantum physics. Grounded in exact differential equation numerical solvers.",
  keywords: [
    "physics virtual lab",
    "interactive physics simulations",
    "online physics experiments",
    "simple pendulum simulation",
    "ohms law simulator",
    "projectile motion calculator",
    "photoelectric effect virtual lab",
    "wave optics double slit",
    "thermodynamics pv diagram",
    "cbse physics practicals class 11 12",
    "ap physics 1 2 simulations"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics",
  },
};

const experiments: PhysicsExperiment[] = [
  {
    href: "/physics/simplependulum",
    title: "Simple Pendulum",
    desc: "Simulate pendulum motion and compare theoretical period with measured values using virtual sensors.",
    formula: "T = 2π√(L/g)",
    category: "Mechanics",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/physics/projectilemotion",
    title: "Projectile Motion",
    desc: "Launch projectiles at various angles and velocities to study trajectories, range, and flight time.",
    formula: "R = (v₀² sin 2θ) / g",
    category: "Mechanics",
    difficulty: "Beginner",
    duration: "12 min",
  },
  {
    href: "/physics/freefall",
    title: "Free Fall & Acceleration",
    desc: "Measure gravitational acceleration by dropping virtual masses in vacuum and with air resistance.",
    formula: "y = ½gt²",
    category: "Mechanics",
    difficulty: "Beginner",
    duration: "8 min",
  },
  {
    href: "/physics/hookelaw",
    title: "Hooke's Law & Springs",
    desc: "Determine spring constants by applying varying loads and measuring extension in real time.",
    formula: "F = -kx",
    category: "Mechanics",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/physics/energyconservation",
    title: "Conservation of Energy",
    desc: "Track kinetic, potential, and thermal energy in real time across dynamic track setups.",
    formula: "E_total = KE + PE = const",
    category: "Mechanics",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/physics/uniformmotionlab",
    title: "Uniform & Accelerated Motion",
    desc: "Analyze position-time and velocity-time graphs for constant and accelerated motion.",
    formula: "v = v₀ + at",
    category: "Mechanics",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/physics/ohmslaw",
    title: "Ohm's Law & DC Circuits",
    desc: "Build circuits with resistors in series and parallel, measuring voltage and current at each node.",
    formula: "V = IR",
    category: "Electricity",
    difficulty: "Beginner",
    duration: "12 min",
  },
  {
    href: "/physics/rclab",
    title: "RC Circuit Transient Analysis",
    desc: "Observe capacitor charging and discharging curves with interactive oscilloscope views.",
    formula: "V(t) = V₀(1 - e^(-t/RC))",
    category: "Electricity",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/physics/faradays-law",
    title: "Faraday's Law of Induction",
    desc: "Move magnets through coils to observe induced EMF, magnetic flux changes, and Lenz's law.",
    formula: "ε = -N (dΦ_B / dt)",
    category: "Electromagnetism",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/physics/opticslens",
    title: "Geometric Optics & Lenses",
    desc: "Trace light rays through convex and concave lenses to find focal points and image formations.",
    formula: "1/f = 1/d_o + 1/d_i",
    category: "Optics",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/physics/waveoptics",
    title: "Wave Optics & Interference",
    desc: "Simulate Young's double-slit experiment and observe interference fringes with wavelength controls.",
    formula: "y = (mλL) / d",
    category: "Optics",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/physics/speedoflight",
    title: "Speed of Light Measurement",
    desc: "Recreate historical experiments (Fizeau/Foucault) to measure the speed of light in mediums.",
    formula: "v = c / n",
    category: "Optics",
    difficulty: "Advanced",
    duration: "20 min",
  },
  {
    href: "/physics/photoelectric-effect",
    title: "Photoelectric Effect",
    desc: "Irradiate metal cathodes with monochromatic light to measure stopping potential and Planck's constant.",
    formula: "K_max = hν - Φ",
    category: "Quantum Physics",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/physics/thermodynamics",
    title: "Thermodynamic Heat Engines",
    desc: "Simulate Carnot, Otto, and Stirling cycles on interactive P-V and T-S state diagrams.",
    formula: "η = 1 - (T_C / T_H)",
    category: "Thermodynamics",
    difficulty: "Advanced",
    duration: "18 min",
  },
];

const faqs = [
  {
    q: "How accurate are OpenLabs physics simulations compared to physical experiments?",
    a: "OpenLabs simulations utilize high-precision 4th-order Runge-Kutta (RK4) numerical ODE solvers and exact analytical models. Friction, air drag, and circuit parasitic resistances can be toggled to match physical laboratory conditions with sub-0.5% numerical tolerance.",
  },
  {
    q: "Can I use OpenLabs physics labs for CBSE, AP Physics, or IB practical requirements?",
    a: "Yes. All experiments are explicitly mapped to CBSE Class 11 & 12 Physics practicals, AP Physics 1 & 2 / C learning objectives, and IB Physics HL/SL internal assessment topics. Each lab includes standard observation tables and error analysis tools.",
  },
  {
    q: "Do the physics simulations run client-side or on a remote server?",
    a: "All physics calculations, particle trajectory renders, and circuit nodal matrix solvers execute 100% client-side in your browser using Web Workers and GPU WebGL acceleration with zero server latency.",
  },
  {
    q: "Can I export telemetry data for lab reports and spreadsheet analysis?",
    a: "Yes. Every lab module provides one-click export of time-series sensor data to CSV or JSON formats, allowing students to perform regression analysis in Excel, Google Sheets, or Python NumPy.",
  },
  {
    q: "Are the virtual physics labs completely free to access?",
    a: "Yes. OpenLabs is an open educational platform. All simulations, virtual sensors, and curriculum guides are permanently free with no paywalls.",
  },
];

const howToSteps = [
  {
    step: 1,
    title: "Select Experiment & Set Parameters",
    desc: "Choose from mechanics, electricity, optics, or quantum modules and configure initial variables such as mass, voltage, focal length, or light frequency.",
  },
  {
    step: 2,
    title: "Run Real-Time Numerical Simulation",
    desc: "Initiate live continuous simulation powered by RK4 ODE solvers with real-time vector visualization and interactive pause/step controls.",
  },
  {
    step: 3,
    title: "Record Virtual Telemetry & Graph Plots",
    desc: "Use virtual calipers, photogates, voltmeters, and oscilloscopes to log empirical data points directly into synchronized live charts.",
  },
  {
    step: 4,
    title: "Validate Equations & Export Observations",
    desc: "Compare measured parameters against theoretical formulas (e.g., T = 2π√(L/g)) and export clean CSV datasets for practical records.",
  },
];

const scientificPrinciples = [
  {
    domain: "Classical Mechanics",
    laws: "Newton's Laws, Energy Conservation, Projectile Dynamics",
    formulas: "F = ma, T = 2π√(L/g), R = (v₀² sin 2θ)/g",
    solver: "Runge-Kutta 4th Order (RK4) ODE Integration",
  },
  {
    domain: "Electricity & Circuits",
    laws: "Ohm's Law, Kirchhoff's Current/Voltage Laws (KCL/KVL), RC Transients",
    formulas: "V = IR, V(t) = V₀(1 - e^(-t/RC)), τ = RC",
    solver: "Nodal Voltage Matrix & Exponential Integration",
  },
  {
    domain: "Wave Optics",
    laws: "Snell's Law, Huygens-Fresnel Principle, Young's Interference",
    formulas: "n₁ sin θ₁ = n₂ sin θ₂, y = (mλL)/d, 1/f = 1/d_o + 1/d_i",
    solver: "Ray-Tracing Matrix & Wavefront Superposition",
  },
  {
    domain: "Quantum Physics",
    laws: "Einstein's Photoelectric Equation, Planck-Einstein Relation",
    formulas: "K_max = hν - Φ, E = hν, λ_c = hc/Φ",
    solver: "Work Function Thresholding & Quantum State Vectors",
  },
  {
    domain: "Thermodynamics",
    laws: "First & Second Laws of Thermodynamics, Carnot Efficiency",
    formulas: "PV = nRT, η = 1 - (T_C / T_H), ΔS ≥ 0",
    solver: "Equation of State (EOS) & Closed-Loop Cycle Integrals",
  },
];

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.openlabs.org.in/physics#webpage",
  url: "https://www.openlabs.org.in/physics",
  name: "Physics Virtual Labs and Interactive Experiments",
  description: "Free interactive virtual physics experiments covering mechanics, electricity, optics, electromagnetism, and quantum mechanics.",
  inLanguage: "en",
  about: {
    "@type": "Thing",
    name: "Physics",
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
  name: "How to Conduct Online Physics Experiments on OpenLabs",
  description: "Step-by-step procedure to configure, run, and collect data from virtual physics lab simulations.",
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
      name: "Physics",
      item: "https://www.openlabs.org.in/physics",
    },
  ],
};

const features = [
  {
    icon: Gauge,
    title: "Real-time parameter adjustment",
    desc: "Adjust gravity, resistance, and charge dynamically to observe instant shifts in system kinematics.",
    color: "indigo",
  },
  {
    icon: LineChart,
    title: "High-frequency telemetry & plotting",
    desc: "Stream real-time phase portraits, potential energy wells, and oscilloscope voltage traces.",
    color: "blue",
  },
  {
    icon: GraduationCap,
    title: "Curriculum & practical standards",
    desc: "Systematically structured alongside CBSE Class 11/12, AP Physics, and IB Physics HL/SL practicals.",
    color: "violet",
  },
];

export default function PhysicsPage() {
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
        <div className="absolute top-12 left-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 h-[350px] w-[350px] rounded-full bg-violet-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition font-medium">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">Physics</span>
          </nav>

          {/* Hero */}
          <header className="mb-14">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider shadow-sm">
                  <Orbit className="h-3.5 w-3.5 text-indigo-600 animate-pulse" aria-hidden="true" />
                  Virtual Laboratory
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight leading-none">
                  Physics{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent drop-shadow-sm">
                    Experiments
                  </span>
                </h1>

                <p className="text-muted-foreground text-base md:text-lg font-medium max-w-2xl leading-relaxed">
                  Interactive simulations grounded in standard physics equations and differential equation solvers.
                  Measure, analyze, and validate — all in your browser.
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

          {/* Physics Guided Curriculum Tracks */}
          <div className="mb-14">
            <CurriculumTracksExplorer
              subjectFilter="physics"
              title="Physics Curriculum Tracks"
              subtitle="Follow structured sequence pathways from basic Newtonian kinematics to advanced quantum mechanics and electromagnetism."
              showFilters={false}
            />
          </div>

          {/* Experiment Explorer (search + filters + grid) */}
          <PhysicsExperimentExplorer experiments={experiments} />

          {/* Value Features Grid */}
          <section className="mt-20 mb-16" aria-labelledby="physics-features-heading">
            <h2 id="physics-features-heading" className="sr-only">Physics lab features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f) => {
                const Icon = f.icon;
                const colorMap: Record<string, string> = {
                  indigo: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 border-indigo-100 dark:border-indigo-900",
                  blue: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 border-blue-100 dark:border-blue-900",
                  violet: "bg-violet-50 dark:bg-violet-950/40 text-violet-600 border-violet-100 dark:border-violet-900",
                };
                return (
                  <div
                    key={f.title}
                    className="group bg-card/80 backdrop-blur-sm border border-border/60 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300"
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

          {/* SEO / AEO Section: Step-by-Step Practical Lab Protocol */}
          <section
            aria-labelledby="physics-howto-heading"
            className="bg-card/90 backdrop-blur-sm border border-border/80 rounded-3xl p-8 lg:p-10 shadow-sm mb-16 relative overflow-hidden"
          >
            <div className="space-y-4 max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider text-xs">
                <Activity className="h-4 w-4 animate-pulse" aria-hidden="true" />
                Experimental Methodology
              </div>
              <h2 id="physics-howto-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                How to Conduct Physics Virtual Experiments Online
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                Our virtual laboratory follows standard scientific empirical protocols, enabling students and researchers to perform structured investigation workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howToSteps.map((item) => (
                <div
                  key={item.step}
                  className="bg-muted/50 border border-border/70 rounded-2xl p-5 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-indigo-600 text-white font-black text-xs shadow-sm">
                      {item.step}
                    </span>
                    <h3 className="font-extrabold text-foreground text-sm tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 pt-2 border-t border-border/40">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Scientific Standard</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* GEO Section: Scientific Models & Numerical Foundations Table */}
          <section
            aria-labelledby="physics-principles-heading"
            className="bg-card border border-border/80 rounded-3xl p-8 lg:p-10 shadow-sm mb-16 overflow-hidden"
          >
            <div className="space-y-3 mb-8">
              <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider text-xs">
                <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
                Computational Foundations
              </div>
              <h2 id="physics-principles-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Governing Physical Laws & Numerical Models
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-3xl">
                OpenLabs simulations do not rely on pre-recorded animations; every experiment computes state transitions in real time using continuous mathematical engines.
              </p>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/60 text-foreground font-black uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 rounded-l-xl">Physics Domain</th>
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
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{sp.formulas}</td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-foreground/80">{sp.solver}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Curriculum Section */}
          <section
            aria-labelledby="physics-standards-heading"
            className="bg-card border border-border/80 rounded-3xl p-8 lg:p-10 shadow-md relative overflow-hidden mb-16"
          >
            <div className="absolute top-0 right-0 h-32 w-32 bg-muted rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider text-xs">
                  <BookOpen className="h-4 w-4 animate-pulse" aria-hidden="true" />
                  Educational Curriculum Alignment
                </div>
                <h2 id="physics-standards-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  Academic Framework Integration & Standards
                </h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                  Our virtual physics laboratory modules are meticulously aligned with global academic frameworks including <strong>NCERT Physics Class 11 and 12</strong>, <strong>AP Physics 1 &amp; 2 / C</strong>, <strong>IB Physics HL/SL</strong>, and <strong>Cambridge IGCSE / A-Levels</strong>. Each experiment maps directly to standard learning outcomes for mechanics, electricity, optics, and thermodynamics.
                </p>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                  OpenLabs provides high-fidelity dynamic simulations enabling interactive concept validation. Telemetry feeds map to standard kinematic graphs, circuit characteristics, and optical interference patterns.
                </p>
              </div>

              <div className="lg:col-span-4 bg-muted border border-border p-6 rounded-2xl flex flex-col justify-center text-center shadow-inner">
                <Compass className="h-10 w-10 text-indigo-600 dark:text-indigo-400 mx-auto mb-3 animate-spin [animation-duration:12s]" aria-hidden="true" />
                <h3 className="font-extrabold text-foreground text-sm mb-1">Interactive Telemetry</h3>
                <p className="text-[11px] text-muted-foreground leading-normal font-medium">
                  OpenLabs bridges standard academic theory with interactive models to optimize student conceptual retention and research comprehension.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16" aria-labelledby="physics-faq-heading">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 items-start">
                <div className="md:col-span-1 md:sticky md:top-24">
                  <h2 id="physics-faq-heading" className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-muted-foreground text-base">
                    Technical, pedagogical, and numerical details about our physics virtual labs.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors group"
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
                      name="physics-faq"
                      className="group rounded-2xl bg-card border border-border/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden open:border-indigo-200 open:shadow-md transition-all duration-300"
                    >
                      <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset rounded-2xl">
                        <span className="font-semibold text-foreground text-[1.05rem] group-hover:text-indigo-600 transition-colors pr-6">
                          {faq.q}
                        </span>
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center group-open:bg-primary/10 group-open:border-primary/20 group-hover:bg-accent transition-colors">
                          <svg
                            className="w-4 h-4 text-muted-foreground group-open:text-indigo-600 group-open:rotate-180 transition-transform duration-500 ease-spring-smooth"
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
              All simulations are free for educational use. Validated against experimental data and standard physics equations.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
