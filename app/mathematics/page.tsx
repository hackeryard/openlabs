import type { Metadata } from "next";
import Link from "next/link";
import {
  Sigma,
  TrendingUp,
  Activity,
  Milestone,
  ArrowRight,
  BookOpen,
  Compass,
  PieChart,
  FunctionSquare,
  BarChart3,
  Sparkles,
  Layers,
  Move,
  Hash,
  Binary,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Mathematics Virtual Labs & Interactive Function Grapher",
  description:
    "Explore interactive mathematics simulations including real-time function graphing, curve transformations, calculus analysis, root finding, and trigonometry.",
  keywords: [
    "mathematics labs",
    "interactive math simulation",
    "function grapher",
    "calculus visualizer",
    "polynomial roots",
    "function transformations",
    "online graphing calculator",
    "STEM mathematics",
    "trigonometry visualizer",
    "definite integral calculator",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics",
  },
  openGraph: {
    title: "Mathematics Virtual Labs & Interactive Function Grapher | OpenLabs",
    description:
      "Explore interactive mathematics simulations including real-time function graphing, curve transformations, calculus analysis, and trigonometry.",
    url: "https://www.openlabs.org.in/mathematics",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Mathematics Virtual Labs | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
    title: "Mathematics Virtual Labs & Interactive Function Grapher | OpenLabs",
    description:
      "Explore interactive mathematics simulations including real-time function graphing, curve transformations, calculus analysis, and trigonometry.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const cards = [
  {
    href: "/mathematics/functiongrapher",
    title: "Function Grapher",
    desc: "Plot continuous mathematical functions in real time, explore a·f(b(x−h))+k transformations, and analyze roots, extrema, and integrals.",
    badge: "Interactive D3 Plotter",
    color: "indigo",
    icon: Sigma,
    status: "Active",
  },
  {
    href: "/mathematics/trigonometry",
    title: "Trigonometric Visualizer",
    desc: "Explore unit circle projections, sinusoidal harmonics, amplitude-frequency modulations, and phase shifts.",
    badge: "Unit Circle Dynamics",
    color: "teal",
    icon: Activity,
    status: "Active",
  },
  {
    href: "/mathematics/polynomials",
    title: "Quadratic & Polynomial Explorer",
    desc: "Analyze parabolic vertices, discriminant analysis (Δ = b² - 4ac), complex roots, and cubic inflection points.",
    badge: "Polynomial Analysis",
    color: "purple",
    icon: TrendingUp,
    status: "Active",
  },
  {
    href: "/mathematics/calculus",
    title: "Calculus & Derivatives Sandbox",
    desc: "Inspect instantaneous tangent lines f'(x), secant convergence, and numerical definite integration via Simpson's rule.",
    badge: "Calculus Engine",
    color: "sky",
    icon: Compass,
    status: "Active",
  },
  {
    href: "/mathematics/linear-algebra",
    title: "Linear Algebra & Matrix Transformations",
    desc: "Visualize 2D space transformations, basis vectors î & ĵ, determinant area scaling, and invariant eigenvectors.",
    badge: "Vector Space Matrix",
    color: "emerald",
    icon: PieChart,
    status: "Active",
  },
  {
    href: "/mathematics/statistics",
    title: "Probability & Statistics Sandbox",
    desc: "Simulate the Galton bean machine, Central Limit Theorem, probability distributions, and Ordinary Least Squares regression.",
    badge: "Stochastics & Data",
    color: "amber",
    icon: BarChart3,
    status: "Active",
  },
  {
    href: "/mathematics/complex-numbers",
    title: "Complex Numbers & Fractals Explorer",
    desc: "Explore the Argand plane, rotation-dilation arithmetic, roots of unity, Euler's formula, and real-time Mandelbrot zoomer.",
    badge: "Fractal Dynamics",
    color: "pink",
    icon: Sparkles,
    status: "Active",
  },
  {
    href: "/mathematics/set-theory",
    title: "Set Theory & Boolean Algebra",
    desc: "Explore 2/3-set Venn diagrams, evaluate compound set operations, test De Morgan's laws, and classify injective/surjective functions.",
    badge: "Foundational Logic",
    color: "indigo",
    icon: Layers,
    status: "Active",
  },
  {
    href: "/mathematics/geometry",
    title: "Interactive Geometry Studio",
    desc: "Construct geometric figures, explore triangle centers & Euler line, verify circle theorems, and perform 2D rigid transformations.",
    badge: "Euclidean Studio",
    color: "cyan",
    icon: Compass,
    status: "Active",
  },
  {
    href: "/mathematics/vector-algebra",
    title: "Vector Algebra & 3D Space",
    desc: "Explore 2D vector addition, Parallelogram Law, dot products & projections, 3D cross products, and scalar triple product volumes.",
    badge: "Vector Calculus",
    color: "amber",
    icon: Move,
    status: "Active",
  },
  {
    href: "/mathematics/combinatorics",
    title: "Combinatorics & Counting",
    desc: "Explore permutations, combinations, Pascal's triangle fractals, binomial theorem expansions, and Dirichlet's pigeonhole principle.",
    badge: "Discrete Math",
    color: "purple",
    icon: Hash,
    status: "Active",
  },
  {
    href: "/mathematics/number-theory",
    title: "Number Theory & Cryptography",
    desc: "Explore prime factorization, Sieve of Eratosthenes, Euclidean GCD tiling, modular arithmetic, RSA cryptography, and Collatz orbits.",
    badge: "Pure Math & Crypto",
    color: "emerald",
    icon: Binary,
    status: "Active",
  },
];

const webpageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.openlabs.org.in/mathematics#webpage",
  url: "https://www.openlabs.org.in/mathematics",
  name: "Mathematics Interactive Labs | OpenLabs",
  description:
    "Mathematics virtual lab portal featuring interactive function plotting, transformations, calculus foundations, and numerical root-finding.",
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
      name: "Mathematics",
      item: "https://www.openlabs.org.in/mathematics",
    },
  ],
};

export default function MathematicsPage() {
  return (
    <>
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
        className="absolute left-4 -top-16 z-50 rounded bg-card px-3 py-2 text-sm font-semibold text-foreground shadow transition-all focus:top-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Skip to main content
      </a>

      <main
        id="main-content"
        className="min-h-screen text-foreground pb-20 pt-8 font-sans relative overflow-hidden bg-[radial-gradient(hsl(var(--border))_1.5px,transparent_1.5px)] bg-[size:24px_24px]"
      >
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-12 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav
            className="flex items-center space-x-2 text-sm text-muted-foreground mb-6"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-foreground transition font-medium">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-indigo-600 font-bold">Mathematics</span>
          </nav>

          {/* Hero Section */}
          <div className="space-y-4 mb-12 text-left">
            <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider shadow-sm">
              <Sigma className="h-3.5 w-3.5 text-indigo-600 animate-pulse" aria-hidden="true" />
              Mathematical Sciences Sandbox
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight leading-none">
              Mathematics{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                Interactive Labs
              </span>
            </h1>

            <p className="text-muted-foreground text-base md:text-lg font-medium max-w-3xl leading-relaxed">
              Explore dynamic mathematical curves, parametric transformations, calculus foundations, and coordinate geometry. Visualize complex functions with responsive D3 graphing, instant root finding, tangent lines, and numerical integration.
            </p>
          </div>

          {/* Lab Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {cards.map((card) => {
              const Icon = card.icon;
              const colorClasses =
                card.color === "indigo"
                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 border-indigo-100 dark:border-indigo-900 group-hover:border-indigo-400 group-hover:shadow-indigo-100/50"
                  : card.color === "teal"
                  ? "bg-teal-50 dark:bg-teal-950/40 text-teal-600 border-teal-100 dark:border-teal-900 group-hover:border-teal-400 group-hover:shadow-teal-100/50"
                  : card.color === "purple"
                  ? "bg-purple-50 dark:bg-purple-950/40 text-purple-600 border-purple-100 dark:border-purple-900 group-hover:border-purple-400 group-hover:shadow-purple-100/50"
                  : "bg-sky-50 dark:bg-sky-950/40 text-sky-600 border-sky-100 dark:border-sky-900 group-hover:border-sky-400 group-hover:shadow-sky-100/50";

              return (
                <div key={card.title} className="group">
                  <Link
                    href={card.href}
                    className="h-full bg-card rounded-3xl border border-border p-6 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                    aria-label={`Go to ${card.title}`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-muted group-hover:bg-indigo-500/20 transition-all" />
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div
                          className={`h-11 w-11 rounded-2xl border flex items-center justify-center transition shadow-sm ${colorClasses}`}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-lg border border-border shadow-inner">
                          {card.badge}
                        </span>
                      </div>

                      <h2 className="text-xl font-extrabold text-foreground group-hover:text-indigo-600 transition-colors mb-2.5 tracking-tight leading-snug">
                        {card.title}
                      </h2>
                      <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                        {card.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border text-[10px] font-extrabold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Enter Laboratory <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Educational Curriculum Alignment Section */}
          <section
            aria-labelledby="math-standards-heading"
            className="bg-card border border-border/80 rounded-3xl p-8 lg:p-10 shadow-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-32 w-32 bg-muted rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
                  <BookOpen className="h-4 w-4 animate-pulse" aria-hidden="true" />
                  Educational Curriculum Alignment
                </div>
                <h2
                  id="math-standards-heading"
                  className="text-2xl sm:text-3xl font-black text-foreground tracking-tight"
                >
                  Global Academic Mathematics Standards
                </h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                  OpenLabs Mathematics modules are mapped directly to global secondary and undergraduate academic curricula, including <strong>NCERT Mathematics Class 11 & 12</strong> (Relations & Functions, Trigonometric Functions, Continuity & Differentiability, Integrals), <strong>AP Calculus AB & BC</strong> (Parametric functions, limits, derivatives, Riemann sums), <strong>IB Mathematics: Analysis and Approaches (HL/SL)</strong>, and <strong>Cambridge A-Levels / Pure Mathematics</strong>.
                </p>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                  By transforming abstract mathematical symbols into responsive graphical geometry, students build lasting intuitive connections between symbolic equations and their real-world geometric properties.
                </p>
              </div>

              <div className="lg:col-span-4 bg-muted border border-border p-6 rounded-2xl flex flex-col justify-center text-center shadow-inner">
                <Compass
                  className="h-10 w-10 text-indigo-600 mx-auto mb-3 animate-spin [animation-duration:12s]"
                  aria-hidden="true"
                />
                <h3 className="font-extrabold text-foreground text-sm mb-1">
                  Geometric Precision
                </h3>
                <p className="text-[11px] text-muted-foreground leading-normal font-medium">
                  Vector-accurate SVG rendering and numerical calculus algorithms bring textbook equations to life in real time.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
