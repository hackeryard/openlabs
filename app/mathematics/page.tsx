import type { Metadata } from "next";
import Link from "next/link";
import MathematicsExperimentExplorer, { MathExperiment } from "./MathematicsExperimentExplorer";
import CurriculumTracksExplorer from "@/app/components/CurriculumTracksExplorer";
import {
  Calculator,
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
  title: "Mathematics Virtual Labs & Interactive Function Grapher",
  description: "Explore interactive mathematics simulations including real-time 2D/3D function graphing, calculus derivatives & integrals, linear algebra matrices, Fourier series, and trigonometry.",
  keywords: [
    "mathematics virtual lab",
    "interactive math simulations",
    "online graphing calculator",
    "calculus visualizer",
    "polynomial roots simulator",
    "matrix transformation 3d",
    "fourier series visualizer",
    "trigonometry unit circle interactive",
    "cbse math class 11 12",
    "ap calculus ab bc simulations"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics",
  },
};

const experiments: MathExperiment[] = [
  {
    href: "/mathematics/functiongrapher",
    title: "Real-Time 2D Function Grapher",
    desc: "Plot explicit, parametric, and polar functions with instant roots, critical points, and area under the curve integration.",
    formula: "y = f(x), r = f(θ)",
    category: "Functions & Graphs",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/mathematics/trigonometry",
    title: "Interactive Unit Circle & Trig Ratios",
    desc: "Trace sine, cosine, tangent, and reciprocal functions along an animated radian circle with phase shifts.",
    formula: "sin²θ + cos²θ = 1",
    category: "Trigonometry",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/mathematics/calculus",
    title: "Calculus Derivative & Integral Sandbox",
    desc: "Visualize tangent slopes (dy/dx), secant approximations, Riemann sums, and the Fundamental Theorem of Calculus.",
    formula: "f'(x) = lim_{h→0} [f(x+h) - f(x)]/h",
    category: "Calculus",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/mathematics/linear-algebra",
    title: "Linear Algebra & 3D Vector Transformations",
    desc: "Apply 2D/3D matrix rotations, shear, scaling, determinants, and calculate eigenvalues with span grids.",
    formula: "A v = λ v, det(A - λI) = 0",
    category: "Algebra & Matrices",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/mathematics/polynomials",
    title: "Polynomial Roots & Multiplicity",
    desc: "Drag roots across the complex plane and observe real-time coefficient expansion and curve extrema.",
    formula: "P(x) = a_n x^n + ... + a_0",
    category: "Functions & Graphs",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/mathematics/differential-equations",
    title: "Differential Equations & Slope Fields",
    desc: "Construct directional vector fields and integrate first/second order ODE solution curves interactively.",
    formula: "dy/dx = f(x, y)",
    category: "Calculus",
    difficulty: "Advanced",
    duration: "18 min",
  },
  {
    href: "/mathematics/complex-numbers",
    title: "Complex Numbers & Argand Plane",
    desc: "Perform Euler's formula transformations, polar multiplication, nth roots of unity, and Julia sets.",
    formula: "e^(iθ) = cos θ + i sin θ",
    category: "Algebra & Matrices",
    difficulty: "Intermediate",
    duration: "12 min",
  },
  {
    href: "/mathematics/vector-algebra",
    title: "Vector Algebra & Dot/Cross Products",
    desc: "Calculate 3D vector projections, cross products, scalar triple products, and plane normals visually.",
    formula: "u · v = |u||v|cos θ, u × v",
    category: "Geometry & Vectors",
    difficulty: "Beginner",
    duration: "12 min",
  },
  {
    href: "/mathematics/geometry",
    title: "Dynamic Conic Sections & Locus",
    desc: "Cut 3D cones with planes to generate ellipses, parabolas, and hyperbolas with focus/directrix loci.",
    formula: "Ax² + Bxy + Cy² + Dx + Ey + F = 0",
    category: "Geometry & Vectors",
    difficulty: "Beginner",
    duration: "12 min",
  },
  {
    href: "/mathematics/statistics",
    title: "Probability Distributions & CLT",
    desc: "Simulate Galton boards, Central Limit Theorem, Poisson distributions, and hypothesis confidence intervals.",
    formula: "f(x) = (1/σ√(2π)) e^(-(x-μ)²/2σ²)",
    category: "Probability & Chaos",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/mathematics/combinatorics",
    title: "Combinatorics & Pascal's Triangle",
    desc: "Interactive permutation trees, binomial expansions, and combinatoric partition graphs.",
    formula: "C(n, k) = n! / (k!(n-k)!)",
    category: "Probability & Chaos",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/mathematics/number-theory",
    title: "Number Theory & Modular Arithmetic",
    desc: "Explore Euclidean GCD steps, prime sieves, modular congruence clocks, and RSA trapdoor functions.",
    formula: "a ≡ b (mod m), gcd(a, b)",
    category: "Algebra & Matrices",
    difficulty: "Intermediate",
    duration: "12 min",
  },
];

const faqs = [
  {
    q: "How does OpenLabs compute function curves, integrals, and tangent slopes?",
    a: "OpenLabs utilizes client-side symbolic and numerical parsers. Riemann sums and definite integrals are computed with adaptive Simpson's quadrature, and slope tangents use high-order central difference approximations.",
  },
  {
    q: "Can I input custom multi-variable functions and parametric equations?",
    a: "Yes. The function graphers and calculus tools allow custom mathematical formula inputs supporting trigonometric, logarithmic, polynomial, and piecewise expressions in LaTeX format.",
  },
  {
    q: "Are the mathematics labs aligned with CBSE, AP Calculus, and IB Math curricula?",
    a: "Yes. Modules directly map to CBSE Class 11/12 Mathematics, AP Calculus AB & BC, and IB Mathematics Analysis & Approaches (AA) / Applications & Interpretation (AI) HL/SL.",
  },
  {
    q: "Can I export high-resolution vector graphs for reports and thesis work?",
    a: "Yes. All plots and vector transformations can be exported in lossless SVG and PNG formats, alongside data point coordinate tables in CSV format.",
  },
  {
    q: "Is OpenLabs mathematics free for students and educators?",
    a: "Yes. All OpenLabs mathematics simulations, graphing tools, and calculators are 100% free and open for educational use.",
  },
];

const howToSteps = [
  {
    step: 1,
    title: "Select Mathematical Sandbox or Tool",
    desc: "Choose from function graphers, calculus differentiation, linear algebra vector transformations, or probability simulations.",
  },
  {
    step: 2,
    title: "Input Functions, Coefficients, or Vectors",
    desc: "Type equations in natural math notation (e.g., sin(2x) + x^2) or drag interactive matrix transformation sliders.",
  },
  {
    step: 3,
    title: "Explore Dynamic Roots, Tangents & Transforms",
    desc: "Inspect real-time inflection points, Taylor series expansions, Riemann sum partitions, and eigenvalue spans.",
  },
  {
    step: 4,
    title: "Verify Proofs & Export Lossless Graphs",
    desc: "Cross-check numerical limits against analytical algebraic solutions, and download high-resolution vector plots.",
  },
];

const scientificPrinciples = [
  {
    domain: "Numerical Calculus",
    laws: "Fundamental Theorem of Calculus, Taylor's Theorem",
    formulas: "∫[a,b] f(x)dx = F(b) - F(a), f(x) = Σ [f^(n)(a)/n!](x-a)^n",
    solver: "Adaptive Simpson's 3/8 Quadrature & Central Differences",
  },
  {
    domain: "Linear Transformations",
    laws: "Matrix Determinants, Spectral Theorem & Eigen Decomposition",
    formulas: "Av = λv, det(A - λI) = 0, T(cu + dv) = cT(u) + dT(v)",
    solver: "QR Algorithm for Eigenvalues & 3D Affine Matrix Transforms",
  },
  {
    domain: "Harmonic Analysis",
    laws: "Fourier Series Decomposition, Orthogonality of Sine/Cosine",
    formulas: "f(x) = a₀/2 + Σ [a_n cos(nx) + b_n sin(nx)]",
    solver: "Discrete Fourier Transform (DFT) Engine",
  },
  {
    domain: "Polynomial Dynamics",
    laws: "Fundamental Theorem of Algebra, Vieta's Formulas",
    formulas: "P(z) = c(z - r₁)(z - r₂)...(z - r_n) = 0",
    solver: "Durand-Kerner Simultaneous Complex Root Finder",
  },
  {
    domain: "Probability & Statistics",
    laws: "Central Limit Theorem, Law of Large Numbers, Bayes' Theorem",
    formulas: "P(A|B) = [P(B|A)P(A)] / P(B), Z = (X̄ - μ)/(σ/√n)",
    solver: "Mersenne Twister Pseudo-Random Sampling Generator",
  },
];

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.openlabs.org.in/mathematics#webpage",
  url: "https://www.openlabs.org.in/mathematics",
  name: "Mathematics Virtual Labs and Interactive Graphing Tools",
  description: "Free interactive virtual mathematics simulations covering function graphing, calculus, linear algebra, trigonometry, and statistics.",
  inLanguage: "en",
  about: {
    "@type": "Thing",
    name: "Mathematics",
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
  name: "How to Visualize Mathematical Functions and Geometric Systems on OpenLabs",
  description: "Step-by-step procedure to plot equations, evaluate calculus integrals, and visualize linear algebra matrix transformations.",
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
      name: "Mathematics",
      item: "https://www.openlabs.org.in/mathematics",
    },
  ],
};

const features = [
  {
    icon: Gauge,
    title: "Interactive dynamic parameters",
    desc: "Manipulate slider coefficients to observe instant changes in curves, tangents, and vector matrices.",
    color: "amber",
  },
  {
    icon: LineChart,
    title: "Real-time Riemann & Fourier plots",
    desc: "Visualize integral approximations, Taylor series convergence, and frequency spectrum harmonics live.",
    color: "indigo",
  },
  {
    icon: GraduationCap,
    title: "Curriculum & standards aligned",
    desc: "Maps to CBSE/NCERT Class 11/12 Mathematics, AP Calculus AB/BC, and IB Math AA/AI HL/SL.",
    color: "teal",
  },
];

export default function MathematicsPage() {
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
        <div className="absolute top-12 left-1/4 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 h-[350px] w-[350px] rounded-full bg-teal-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition font-medium">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">Mathematics</span>
          </nav>

          {/* Hero */}
          <header className="mb-14">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider shadow-sm">
                  <Calculator className="h-3.5 w-3.5 text-amber-600 animate-pulse" aria-hidden="true" />
                  Virtual Laboratory
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight leading-none">
                  Mathematics{" "}
                  <span className="bg-gradient-to-r from-amber-600 via-indigo-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">
                    Simulations
                  </span>
                </h1>

                <p className="text-muted-foreground text-base md:text-lg font-medium max-w-2xl leading-relaxed">
                  Interactive function graphers, calculus sandboxes, linear algebra matrices, and Fourier series — explore mathematical beauty in your browser.
                </p>
              </div>

              {/* Stats pills */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl px-5 py-3 shadow-sm">
                  <span className="text-2xl font-black text-foreground">{experiments.length}</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">simulations</span>
                </div>
                <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl px-5 py-3 shadow-sm">
                  <span className="text-2xl font-black text-foreground">{domainCount}</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">domains</span>
                </div>
              </div>
            </div>
          </header>

          {/* Mathematics Guided Curriculum Tracks */}
          <div className="mb-14">
            <CurriculumTracksExplorer
              subjectFilter="mathematics"
              title="Mathematics Curriculum Tracks"
              subtitle="Follow structured sequence pathways across functions & geometry, calculus & dynamical systems, and discrete probability."
              showFilters={false}
            />
          </div>

          {/* Experiment Explorer (search + filters + grid) */}
          <MathematicsExperimentExplorer experiments={experiments} />

          {/* Value Features Grid */}
          <section className="mt-20 mb-16" aria-labelledby="math-features-heading">
            <h2 id="math-features-heading" className="sr-only">Mathematics lab features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f) => {
                const Icon = f.icon;
                const colorMap: Record<string, string> = {
                  amber: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-100 dark:border-amber-900",
                  indigo: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 border-indigo-100 dark:border-indigo-900",
                  teal: "bg-teal-50 dark:bg-teal-950/40 text-teal-600 border-teal-100 dark:border-teal-900",
                };
                return (
                  <div
                    key={f.title}
                    className="group bg-card/80 backdrop-blur-sm border border-border/60 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:shadow-amber-500/5 hover:border-amber-200 hover:-translate-y-1 transition-all duration-300"
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

          {/* SEO / AEO Section: Step-by-Step Mathematical Exploration Guide */}
          <section
            aria-labelledby="math-howto-heading"
            className="bg-card/90 backdrop-blur-sm border border-border/80 rounded-3xl p-8 lg:p-10 shadow-sm mb-16 relative overflow-hidden"
          >
            <div className="space-y-4 max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider text-xs">
                <Activity className="h-4 w-4 animate-pulse" aria-hidden="true" />
                Exploratory Methodology
              </div>
              <h2 id="math-howto-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                How to Visualize Mathematical Functions &amp; Geometric Systems
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                Our mathematical visualization laboratory enables students to move seamlessly from abstract symbolic formulas to concrete geometric transformations and numerical approximations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howToSteps.map((item) => (
                <div
                  key={item.step}
                  className="bg-muted/50 border border-border/70 rounded-2xl p-5 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-amber-600 text-white font-black text-xs shadow-sm">
                      {item.step}
                    </span>
                    <h3 className="font-extrabold text-foreground text-sm tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 pt-2 border-t border-border/40">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Rigorous Geometry</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* GEO Section: Mathematical Foundations & Numerical Solvers */}
          <section
            aria-labelledby="math-principles-heading"
            className="bg-card border border-border/80 rounded-3xl p-8 lg:p-10 shadow-sm mb-16 overflow-hidden"
          >
            <div className="space-y-3 mb-8">
              <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider text-xs">
                <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
                Numerical &amp; Symbolic Foundations
              </div>
              <h2 id="math-principles-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Mathematical Foundations &amp; Numerical Solvers
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-3xl">
                OpenLabs evaluates function calculus, matrix transformations, and Fourier harmonics using high-precision numerical algorithms.
              </p>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/60 text-foreground font-black uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 rounded-l-xl">Mathematical Domain</th>
                    <th className="py-3 px-4">Theorems &amp; Principles</th>
                    <th className="py-3 px-4">Core Mathematical Equations</th>
                    <th className="py-3 px-4 rounded-r-xl">Numerical Solver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium text-muted-foreground">
                  {scientificPrinciples.map((sp) => (
                    <tr key={sp.domain} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground">{sp.domain}</td>
                      <td className="py-3.5 px-4">{sp.laws}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">{sp.formulas}</td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-foreground/80">{sp.solver}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Curriculum Section */}
          <section
            aria-labelledby="math-standards-heading"
            className="bg-card border border-border/80 rounded-3xl p-8 lg:p-10 shadow-md relative overflow-hidden mb-16"
          >
            <div className="absolute top-0 right-0 h-32 w-32 bg-muted rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider text-xs">
                  <BookOpen className="h-4 w-4 animate-pulse" aria-hidden="true" />
                  Educational Curriculum Alignment
                </div>
                <h2 id="math-standards-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  Academic Framework Integration &amp; Standards
                </h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                  Our virtual mathematics simulations strictly conform to global educational standards including <strong>CBSE Mathematics Class 11 and 12</strong>, <strong>AP Calculus AB &amp; BC</strong>, <strong>IB Mathematics AA &amp; AI HL/SL</strong>, and <strong>Cambridge A-Level Mathematics</strong>.
                </p>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                  OpenLabs provides real-time graphing, parametric loci, and matrix eigenvectors to bridge standard theorems with visual intuition.
                </p>
              </div>

              <div className="lg:col-span-4 bg-muted border border-border p-6 rounded-2xl flex flex-col justify-center text-center shadow-inner">
                <Compass className="h-10 w-10 text-amber-600 dark:text-amber-400 mx-auto mb-3 animate-spin [animation-duration:12s]" aria-hidden="true" />
                <h3 className="font-extrabold text-foreground text-sm mb-1">Precision Graphing</h3>
                <p className="text-[11px] text-muted-foreground leading-normal font-medium">
                  Plot curves, evaluate derivatives, and transform vectors in real-time with sub-pixel rendering accuracy.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16" aria-labelledby="math-faq-heading">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 items-start">
                <div className="md:col-span-1 md:sticky md:top-24">
                  <h2 id="math-faq-heading" className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-muted-foreground text-base">
                    Technical and pedagogical details about our mathematics virtual tools.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors group"
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
                      name="math-faq"
                      className="group rounded-2xl bg-card border border-border/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden open:border-amber-200 open:shadow-md transition-all duration-300"
                    >
                      <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset rounded-2xl">
                        <span className="font-semibold text-foreground text-[1.05rem] group-hover:text-amber-600 transition-colors pr-6">
                          {faq.q}
                        </span>
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center group-open:bg-primary/10 group-open:border-primary/20 group-hover:bg-accent transition-colors">
                          <svg
                            className="w-4 h-4 text-muted-foreground group-open:text-amber-600 group-open:rotate-180 transition-transform duration-500 ease-spring-smooth"
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
              All simulations are free for educational use. Grounded in standard mathematical and geometric theorems.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
