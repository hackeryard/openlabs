import type { Metadata } from "next";
import Link from "next/link";
import ComputerScienceExperimentExplorer, { CSExperiment } from "./ComputerScienceExperimentExplorer";
import CurriculumTracksExplorer from "@/app/components/CurriculumTracksExplorer";
import {
  Binary,
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
  title: "Computer Science Virtual Labs & Interactive Programming Tools",
  description: "Explore interactive computer science experiments including real-time code visualization, logic gates simulator, network packet routing, AI algorithms, blockchain, and data structures.",
  keywords: [
    "computer science virtual lab",
    "interactive code visualizer",
    "logic gates simulator online",
    "dsa visualizer interactive",
    "networking packet simulation",
    "blockchain proof of work simulator",
    "neural network playground",
    "git visualizer graph",
    "cbse computer science class 11 12",
    "ap computer science virtual labs"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science",
  },
};

const experiments: CSExperiment[] = [
  {
    href: "/computer-science/code-lab",
    title: "Interactive Code Lab & Visualizer",
    desc: "Write and execute JavaScript & Python with real-time call stack, heap variables, and execution trace visualization.",
    formula: "AST Parsing & Stack Frames",
    category: "Programming & Logic",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/computer-science/logic-gates",
    title: "Digital Logic Gates & Circuits",
    desc: "Wire interactive AND, OR, NOT, XOR, NAND, and NOR gates into adders, multiplexers, and flip-flop latches.",
    formula: "A ⊕ B = (A·B') + (A'·B)",
    category: "Programming & Logic",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/computer-science/git-simulator",
    title: "Git Visualizer & Branching Graph",
    desc: "Practice branching, merging, rebasing, commit trees, and detached HEAD states on an interactive directed acyclic graph (DAG).",
    formula: "git commit -m & merge DAG",
    category: "Programming & Logic",
    difficulty: "Beginner",
    duration: "12 min",
  },
  {
    href: "/computer-science/dsa",
    title: "Data Structures & Algorithms Studio",
    desc: "Step-by-step visualizations of Sorting (Quick, Merge), Binary Search Trees, AVL balance, and Dijkstra shortest paths.",
    formula: "O(N log N) Comparison Sorts",
    category: "Algorithms & Data",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/computer-science/networking",
    title: "Computer Networking & Packet Routing",
    desc: "Simulate OSI 7-layer stack, TCP handshake, IP subnetting, DNS resolution, and router packet forwarding.",
    formula: "SYN → SYN-ACK → ACK",
    category: "Systems & Networks",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/computer-science/blockchain",
    title: "Blockchain & Proof of Work Sandbox",
    desc: "Mine cryptographic blocks with difficulty targets, witness SHA-256 hash avalanche effects, and tamper-proof ledgers.",
    formula: "SHA256(Block + Nonce) < Target",
    category: "Systems & Networks",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/computer-science/ai-problem",
    title: "AI & Neural Network Playground",
    desc: "Train multilayer perceptrons with backpropagation, explore A* pathfinding heuristics, and test decision tree splits.",
    formula: "w_{new} = w_{old} - η(∂L/∂w)",
    category: "AI & Data Science",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/computer-science/data-science",
    title: "Data Science & Regression Studio",
    desc: "Load synthetic datasets, wrangle variables, compute correlation matrices, and fit linear/polynomial regressions.",
    formula: "y = β₀ + β₁x + ε",
    category: "AI & Data Science",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/computer-science/data-analyzer",
    title: "Statistical Data Analyzer",
    desc: "Inspect probability distributions, IQR outlier detection, kernel density estimates, and automated summary stats.",
    formula: "IQR = Q₃ - Q₁, Outliers 1.5×IQR",
    category: "AI & Data Science",
    difficulty: "Intermediate",
    duration: "12 min",
  },
  {
    href: "/computer-science/cryptography",
    title: "Modern Cryptography & Ciphers",
    desc: "Explore Caesar shifts, Vigenère tables, RSA asymmetric key generation, and Diffie-Hellman secret exchange.",
    formula: "c ≡ m^e (mod n), m ≡ c^d (mod n)",
    category: "Security & Crypto",
    difficulty: "Advanced",
    duration: "18 min",
  },
];

const faqs = [
  {
    q: "Do I need to install any compilers or interpreters to use the CS labs?",
    a: "No. All code execution, algorithm visualizers, logic simulators, and neural networks execute client-side in your browser via Web Workers and WebAssembly with zero installation.",
  },
  {
    q: "Can these labs be used for AP Computer Science or university courses?",
    a: "Yes. The modules cover fundamental curricula including AP Computer Science A & Principles, CBSE Computer Science Class 11/12, and undergraduate Data Structures & Algorithms (CS101/CS102).",
  },
  {
    q: "How does the Git simulator help me learn version control?",
    a: "The Git simulator draws a real-time directed acyclic graph (DAG) of your commits, branch pointers, and HEAD position as you execute commands, making branching and merging concrete.",
  },
  {
    q: "Can I visualize my own custom algorithms and data inputs?",
    a: "Yes. The DSA and Code Lab interfaces allow you to input custom arrays, graphs, and code snippets to visualize step-by-step pointer manipulation and recursion trees.",
  },
  {
    q: "Is OpenLabs Computer Science free for students and teachers?",
    a: "Yes. All OpenLabs computer science experiments and simulations are 100% free and open for educational use.",
  },
];

const howToSteps = [
  {
    step: 1,
    title: "Select Coding, Network, or Logic Sandbox",
    desc: "Choose an algorithm visualizer, digital logic circuit board, packet network topology, or neural network playground.",
  },
  {
    step: 2,
    title: "Configure Code, Gates, or Topologies",
    desc: "Write source code, connect logic gate wire pins, adjust network subnet masks, or set neural learning rates.",
  },
  {
    step: 3,
    title: "Step Through Execution & Memory States",
    desc: "Step forwards and backwards through call stack frames, variable scopes, Dijkstra path weights, and packet hops.",
  },
  {
    step: 4,
    title: "Inspect Big-O Complexity & Trace Logs",
    desc: "Analyze time/space asymptotic complexity curves, examine execution traces, and export circuit/code state data.",
  },
];

const scientificPrinciples = [
  {
    domain: "Computational Complexity & DSA",
    laws: "Master Theorem, Big-O Asymptotic Notation, Tree Balance (AVL)",
    formulas: "T(n) = aT(n/b) + f(n), O(1) < O(log N) < O(N) < O(N log N) < O(N²)",
    solver: "Step-by-Step State Machine & Call Stack Frame Tracer",
  },
  {
    domain: "Digital Boolean Logic",
    laws: "De Morgan's Laws, Boolean Algebra Canonical SOP/POS",
    formulas: "¬(A ∧ B) = ¬A ∨ ¬B, ¬(A ∨ B) = ¬A ∧ ¬B",
    solver: "Topological Wire Graph Propagation Solver",
  },
  {
    domain: "Networking Protocols",
    laws: "OSI 7-Layer Model, Dijkstra Shortest Path, TCP Handshake",
    formulas: "dist[u] = min(dist[u], dist[v] + weight(v, u))",
    solver: "Discrete-Event Packet Queue Simulator",
  },
  {
    domain: "Applied Cryptography",
    laws: "Euler's Totient Theorem, Diffie-Hellman Key Exchange, SHA-256",
    formulas: "a^φ(n) ≡ 1 (mod n), K = (g^a)^b mod p = g^(ab) mod p",
    solver: "BigInt Modular Exponentiation & Bitwise Hash Engine",
  },
  {
    domain: "Machine Learning & AI",
    laws: "Gradient Descent, Backpropagation, Cross-Entropy Loss",
    formulas: "w ← w - η(∂L/∂w), L = -Σ y_i log(ŷ_i)",
    solver: "Matrix Tensor Dot Products & Auto-Differentiation Engine",
  },
];

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.openlabs.org.in/computer-science#webpage",
  url: "https://www.openlabs.org.in/computer-science",
  name: "Computer Science Virtual Labs and Interactive Tools",
  description: "Free interactive virtual computer science experiments covering code visualization, logic gates, algorithms, networking, AI, and cryptography.",
  inLanguage: "en",
  about: {
    "@type": "Thing",
    name: "Computer Science",
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
  name: "How to Trace Code Execution, Digital Circuits, and Algorithms on OpenLabs",
  description: "Step-by-step procedure to trace source code, wire digital logic circuits, and analyze algorithmic Big-O complexity online.",
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
      name: "Computer Science",
      item: "https://www.openlabs.org.in/computer-science",
    },
  ],
};

const features = [
  {
    icon: Gauge,
    title: "Interactive step-by-step execution",
    desc: "Step forwards and backwards through algorithm states, packet routes, and register states at your own pace.",
    color: "purple",
  },
  {
    icon: LineChart,
    title: "Live performance & complexity feeds",
    desc: "Observe asymptotic Big-O growth curves, memory allocations, and network latency in real time.",
    color: "indigo",
  },
  {
    icon: GraduationCap,
    title: "Curriculum aligned standards",
    desc: "Strictly aligned with AP CS A & Principles, CBSE Computer Science, and university CS101/CS102 syllabi.",
    color: "emerald",
  },
];

export default function ComputerSciencePage() {
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
        <div className="absolute top-12 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 h-[350px] w-[350px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition font-medium">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-purple-600 dark:text-purple-400 font-bold">Computer Science</span>
          </nav>

          {/* Hero */}
          <header className="mb-14">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider shadow-sm">
                  <Binary className="h-3.5 w-3.5 text-purple-600 animate-pulse" aria-hidden="true" />
                  Virtual Laboratory
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight leading-none">
                  Computer Science{" "}
                  <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
                    Simulations
                  </span>
                </h1>

                <p className="text-muted-foreground text-base md:text-lg font-medium max-w-2xl leading-relaxed">
                  Interactive algorithm visualizers, digital logic circuits, Git commit trees, AI neural networks, and networking packets — in your browser.
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

          {/* Computer Science Guided Curriculum Tracks */}
          <div className="mb-14">
            <CurriculumTracksExplorer
              subjectFilter="computerScience"
              title="Computer Science Curriculum Tracks"
              subtitle="Follow structured sequence pathways across algorithms & DSA, digital logic & CPU architecture, and networking & cryptography."
              showFilters={false}
            />
          </div>

          {/* Experiment Explorer (search + filters + grid) */}
          <ComputerScienceExperimentExplorer experiments={experiments} />

          {/* Value Features Grid */}
          <section className="mt-20 mb-16" aria-labelledby="cs-features-heading">
            <h2 id="cs-features-heading" className="sr-only">Computer science lab features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f) => {
                const Icon = f.icon;
                const colorMap: Record<string, string> = {
                  purple: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 border-purple-100 dark:border-purple-900",
                  indigo: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 border-indigo-100 dark:border-indigo-900",
                  emerald: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-100 dark:border-emerald-900",
                };
                return (
                  <div
                    key={f.title}
                    className="group bg-card/80 backdrop-blur-sm border border-border/60 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:shadow-purple-500/5 hover:border-purple-200 hover:-translate-y-1 transition-all duration-300"
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

          {/* SEO / AEO Section: Step-by-Step Computational Tracing Protocol */}
          <section
            aria-labelledby="cs-howto-heading"
            className="bg-card/90 backdrop-blur-sm border border-border/80 rounded-3xl p-8 lg:p-10 shadow-sm mb-16 relative overflow-hidden"
          >
            <div className="space-y-4 max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider text-xs">
                <Activity className="h-4 w-4 animate-pulse" aria-hidden="true" />
                Computational Methodology
              </div>
              <h2 id="cs-howto-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                How to Trace Code Execution, Digital Circuits &amp; Algorithms
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                Our virtual computing laboratory allows students to inspect memory frames, track pointer mutations, simulate packet topologies, and wire digital circuits in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howToSteps.map((item) => (
                <div
                  key={item.step}
                  className="bg-muted/50 border border-border/70 rounded-2xl p-5 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-purple-600 text-white font-black text-xs shadow-sm">
                      {item.step}
                    </span>
                    <h3 className="font-extrabold text-foreground text-sm tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-600 dark:text-purple-400 pt-2 border-t border-border/40">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Algorithmic Rigor</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* GEO Section: Computational Models & Big-O Solvers */}
          <section
            aria-labelledby="cs-principles-heading"
            className="bg-card border border-border/80 rounded-3xl p-8 lg:p-10 shadow-sm mb-16 overflow-hidden"
          >
            <div className="space-y-3 mb-8">
              <div className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider text-xs">
                <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
                Computational Theory &amp; Complexity
              </div>
              <h2 id="cs-principles-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Computational Models &amp; Complexity Solvers
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-3xl">
                OpenLabs evaluates algorithms, digital circuit matrices, and cryptography using standard computational models and asymptotic Big-O telemetry.
              </p>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/60 text-foreground font-black uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 rounded-l-xl">Computer Science Field</th>
                    <th className="py-3 px-4">Theorems &amp; Models</th>
                    <th className="py-3 px-4">Core Principles &amp; Bounds</th>
                    <th className="py-3 px-4 rounded-r-xl">Numerical Solver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium text-muted-foreground">
                  {scientificPrinciples.map((sp) => (
                    <tr key={sp.domain} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground">{sp.domain}</td>
                      <td className="py-3.5 px-4">{sp.laws}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">{sp.formulas}</td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-foreground/80">{sp.solver}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Curriculum Section */}
          <section
            aria-labelledby="cs-standards-heading"
            className="bg-card border border-border/80 rounded-3xl p-8 lg:p-10 shadow-md relative overflow-hidden mb-16"
          >
            <div className="absolute top-0 right-0 h-32 w-32 bg-muted rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider text-xs">
                  <BookOpen className="h-4 w-4 animate-pulse" aria-hidden="true" />
                  Educational Curriculum Alignment
                </div>
                <h2 id="cs-standards-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  Computing Standards &amp; Interactive Algorithmic Tracing
                </h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                  Our virtual computer science laboratory modules align with standard curricula including <strong>AP Computer Science A &amp; Principles</strong>, <strong>CBSE Computer Science Class 11 &amp; 12</strong>, <strong>Cambridge IGCSE Computer Science</strong>, and <strong>ABET accredited undergraduate computing curricula</strong>.
                </p>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                  Students interact directly with runtime memory graphs, packet routing topologies, and boolean logic gates to gain concrete intuitions for abstract computing systems.
                </p>
              </div>

              <div className="lg:col-span-4 bg-muted border border-border p-6 rounded-2xl flex flex-col justify-center text-center shadow-inner">
                <Compass className="h-10 w-10 text-purple-600 dark:text-purple-400 mx-auto mb-3 animate-spin [animation-duration:12s]" aria-hidden="true" />
                <h3 className="font-extrabold text-foreground text-sm mb-1">Algorithmic Telemetry</h3>
                <p className="text-[11px] text-muted-foreground leading-normal font-medium">
                  Trace time complexities, call stacks, and memory allocations in real-time step execution.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16" aria-labelledby="cs-faq-heading">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 items-start">
                <div className="md:col-span-1 md:sticky md:top-24">
                  <h2 id="cs-faq-heading" className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-muted-foreground text-base">
                    Technical and curriculum details about our computer science visualizers.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors group"
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
                      name="cs-faq"
                      className="group rounded-2xl bg-card border border-border/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden open:border-purple-200 open:shadow-md transition-all duration-300"
                    >
                      <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-inset rounded-2xl">
                        <span className="font-semibold text-foreground text-[1.05rem] group-hover:text-purple-600 transition-colors pr-6">
                          {faq.q}
                        </span>
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center group-open:bg-primary/10 group-open:border-primary/20 group-hover:bg-accent transition-colors">
                          <svg
                            className="w-4 h-4 text-muted-foreground group-open:text-purple-600 group-open:rotate-180 transition-transform duration-500 ease-spring-smooth"
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
              All simulations are free for educational use. Grounded in standard algorithmic &amp; computational models.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}