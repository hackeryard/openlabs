import Link from "next/link";
import PhysicsExperimentExplorer, { PhysicsExperiment } from "./PhysicsExperimentExplorer";
import {
  Orbit,
  Zap,
  Eye,
  ArrowRight,
  Gauge,
  LineChart,
  GraduationCap,
  BookOpen,
  Compass,
} from "lucide-react";

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
    desc: "Analyze trajectories, range, and time of flight under varying launch angles and initial velocities.",
    formula: "R = v₀²sin(2θ) / g",
    category: "Mechanics",
    difficulty: "Beginner",
    duration: "12 min",
  },
  {
    href: "/physics/hookelaw",
    title: "Hooke's Law",
    desc: "Investigate spring-mass systems, measure spring constants, and validate Hooke's law.",
    formula: "F = -kx",
    category: "Mechanics",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/physics/energyconservation",
    title: "Energy Conservation",
    desc: "Track kinetic and potential energy through motion and verify conservation principles.",
    formula: "KE + PE = const",
    category: "Mechanics",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/physics/uniformmotionlab",
    title: "Uniform Motion",
    desc: "Study constant-velocity motion and generate distance-time graphs for linear kinematics.",
    formula: "v = dx / dt",
    category: "Mechanics",
    difficulty: "Beginner",
    duration: "8 min",
  },
  {
    href: "/physics/freefall",
    title: "Free Fall Lab",
    desc: "Measure gravitational acceleration through video analysis and data fitting.",
    formula: "h = ½gt²",
    category: "Mechanics",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/physics/ohmslaw",
    title: "Ohm's Law",
    desc: "Construct virtual circuits, sweep voltage, and plot current-voltage characteristics.",
    formula: "V = IR",
    category: "Electricity",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/physics/rclab",
    title: "RC Circuit Lab",
    desc: "Observe capacitor charging and discharging curves; determine time constants.",
    formula: "τ = RC",
    category: "Electricity",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/physics/waveoptics",
    title: "Wave Optics",
    desc: "Simulate Fraunhofer diffraction and double-slit interference patterns.",
    formula: "d sin(θ) = mλ",
    category: "Optics",
    difficulty: "Advanced",
    duration: "20 min",
  },
  {
    href: "/physics/opticslens",
    title: "Optics Lens",
    desc: "Explore thin lens equations, focal points, and real or virtual image formation.",
    formula: "1/f = 1/v + 1/u",
    category: "Optics",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/physics/speedoflight",
    title: "Speed of Light",
    desc: "Measure light propagation speed in various media using wave-based simulations.",
    formula: "c = λf",
    category: "Optics",
    difficulty: "Advanced",
    duration: "18 min",
  },
];

const faqs = [
  {
    q: "What physics principles are used in the simulations?",
    a: "Each simulation implements standard equations from mechanics, circuits, or optics. Results are designed to match analytical models closely enough for classroom exploration.",
  },
  {
    q: "What are the system requirements?",
    a: "The physics labs run in any modern browser with JavaScript enabled. Desktop and tablet screens provide the best experience for data-heavy simulations.",
  },
  {
    q: "Can these experiments be used for coursework?",
    a: "Yes. Each lab includes learning objectives, procedural steps, and data-focused interaction that can support pre-lab work, homework, or remote learning.",
  },
  {
    q: "How accurate are the measurements?",
    a: "The virtual measurements are built to follow textbook relationships and are suitable for concept validation, graphing, and comparison with theoretical values.",
  },
  {
    q: "Is there a cost or registration required?",
    a: "No. The listed physics experiments are free to open and use for educational learning.",
  },
];

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.openlabs.org.in/physics#webpage",
  url: "https://www.openlabs.org.in/physics",
  name: "Physics Virtual Labs and Interactive Experiments",
  description: "Free interactive virtual physics experiments covering mechanics, electricity, and optics.",
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
    desc: "Change variables and see immediate effects on simulation outcomes.",
    color: "indigo",
  },
  {
    icon: LineChart,
    title: "Live data and graphs",
    desc: "View measurements, export data, and compare with theoretical models.",
    color: "blue",
  },
  {
    icon: GraduationCap,
    title: "Curriculum aligned",
    desc: "Each experiment includes learning objectives and discussion prompts.",
    color: "violet",
  },
];

export default function PhysicsPage() {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* <a
        href="#main-content"
        className="absolute left-4 -top-16 z-50 rounded bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow transition-all focus:top-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Skip to main content
      </a> */}

      <main
        id="main-content"
        className="min-h-screen bg-slate-50 text-slate-800 pb-20 pt-8 font-sans relative overflow-hidden bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] bg-[size:24px_24px]"
      >
        {/* Ambient glow blobs */}
        <div className="absolute top-12 left-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 h-[350px] w-[350px] rounded-full bg-violet-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-950 transition font-medium">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-indigo-600 font-bold">Physics</span>
          </nav>

          {/* Hero */}
          <header className="mb-14">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider shadow-sm">
                  <Orbit className="h-3.5 w-3.5 text-indigo-600 animate-pulse" aria-hidden="true" />
                  Virtual Laboratory
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
                  Physics{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent drop-shadow-sm">
                    Experiments
                  </span>
                </h1>

                <p className="text-slate-500 text-base md:text-lg font-medium max-w-2xl leading-relaxed">
                  Interactive simulations grounded in standard physics equations.
                  Measure, analyze, and validate — all in your browser.
                </p>
              </div>

              {/* Stats pills */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-5 py-3 shadow-sm">
                  <span className="text-2xl font-black text-slate-900">{experiments.length}</span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">experiments</span>
                </div>
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-5 py-3 shadow-sm">
                  <span className="text-2xl font-black text-slate-900">3</span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">domains</span>
                </div>
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-5 py-3 shadow-sm">
                  <span className="text-2xl font-black text-indigo-600">Free</span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">always</span>
                </div>
              </div>
            </div>
          </header>

          {/* Experiment Explorer (search + filters + grid) */}
          <PhysicsExperimentExplorer experiments={experiments} />

          {/* Features Section */}
          <section className="mt-20 mb-16" aria-labelledby="physics-features-heading">
            <h2 id="physics-features-heading" className="sr-only">Physics lab features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f) => {
                const Icon = f.icon;
                const colorMap: Record<string, string> = {
                  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
                  blue: "bg-blue-50 text-blue-600 border-blue-100",
                  violet: "bg-violet-50 text-violet-600 border-violet-100",
                };
                return (
                  <div
                    key={f.title}
                    className="group bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center mb-5 shadow-sm transition ${colorMap[f.color]}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-2">
                      {f.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      {f.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Curriculum Section */}
          <section
            aria-labelledby="physics-standards-heading"
            className="bg-white border border-slate-200/80 rounded-3xl p-8 lg:p-10 shadow-md relative overflow-hidden mb-16"
          >
            <div className="absolute top-0 right-0 h-32 w-32 bg-slate-50 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
                  <BookOpen className="h-4 w-4 animate-pulse" aria-hidden="true" />
                  Educational Curriculum Alignment
                </div>
                <h2 id="physics-standards-heading" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Academic Framework Integration & Standards
                </h2>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                  Our virtual physics laboratory modules are meticulously aligned with global academic frameworks including <strong>NCERT Physics Class 11 and 12</strong>, <strong>AP Physics 1 & 2</strong>, <strong>IB Physics HL/SL</strong>, and <strong>Cambridge GCSE / A-Levels</strong>. Each experiment maps directly to standard learning outcomes for mechanics, electricity, and optics.
                </p>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                  OpenLabs provides high-fidelity dynamic simulations enabling interactive concept validation. Telemetry feeds map to standard kinematic graphs, circuit characteristics, and optical interference patterns.
                </p>
              </div>

              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col justify-center text-center shadow-inner">
                <Compass className="h-10 w-10 text-indigo-600 mx-auto mb-3 animate-spin [animation-duration:12s]" aria-hidden="true" />
                <h3 className="font-extrabold text-slate-900 text-sm mb-1">Interactive Telemetry</h3>
                <p className="text-[11px] text-slate-400 leading-normal font-medium">
                  OpenLabs bridges standard academic theory with interactive models to optimize student conceptual retention and research comprehension.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16" aria-labelledby="physics-faq-heading">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 items-start">
                <div className="md:col-span-1 md:sticky md:top-24">
                  <h2 id="physics-faq-heading" className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-slate-500 text-base">
                    Technical and pedagogical details about our physics labs.
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
                      className="group rounded-2xl bg-white border border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden open:border-indigo-200 open:shadow-md transition-all duration-300"
                    >
                      <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset rounded-2xl">
                        <span className="font-semibold text-slate-800 text-[1.05rem] group-hover:text-indigo-600 transition-colors pr-6">
                          {faq.q}
                        </span>
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-open:bg-indigo-50 group-open:border-indigo-100 group-hover:bg-slate-100 transition-colors">
                          <svg
                            className="w-4 h-4 text-slate-400 group-open:text-indigo-600 group-open:rotate-180 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <div className="px-6 pb-6 pt-1 text-slate-600 leading-relaxed border-t border-slate-50 mt-1">
                        <p>{faq.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Footer note */}
          <footer className="text-center py-8 border-t border-slate-200/60">
            <p className="text-xs text-slate-400 font-medium">
              All simulations are free for educational use. Validated against experimental data.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
