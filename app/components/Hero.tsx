import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Beaker,
  Atom,
  Dna,
  Binary,
  Calculator,
  ArrowRight,
  Sparkles,
  Award,
  Globe,
  Zap,
  Flame,
  CheckCircle2,
} from "lucide-react";
import AnimatedCard from "@/components/ui/AnimatedCard";

const labsData = {
  Physics: {
    count: "14 Labs",
    color: "from-blue-600 to-cyan-500",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: <Atom className="w-5 h-5" aria-hidden="true" />,
    path: "/physics",
    items: [
      { name: "Free Fall Motion", path: "/physics/freefall" },
      { name: "Projectile Motion", path: "/physics/projectilemotion" },
      { name: "Ohm's Law & Circuit", path: "/physics/ohmslaw" },
      { name: "Wave Optics & Slits", path: "/physics/waveoptics" },
    ],
  },
  Chemistry: {
    count: "4 Labs",
    color: "from-emerald-600 to-teal-400",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: <Flame className="w-5 h-5" aria-hidden="true" />,
    path: "/chemistry",
    items: [
      { name: "Interactive Periodic Table", path: "/chemistry/periodictable" },
      { name: "Chemical Bonds Studio", path: "/chemistry/chemicalbonds" },
      { name: "Reaction Kinetics", path: "/chemistry/reaction-simulation" },
      { name: "Acid-Base Titration", path: "/chemistry/titration" },
    ],
  },
  Biology: {
    count: "3 Labs",
    color: "from-rose-600 to-pink-500",
    badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: <Dna className="w-5 h-5" aria-hidden="true" />,
    path: "/biology",
    items: [
      { name: "Genetics & Inheritance", path: "/biology/genetics" },
      { name: "3D Animal Cell", path: "/biology/cell/animal" },
      { name: "3D Plant Cell", path: "/biology/cell/plant" },
      { name: "Human Anatomy Lab", path: "/biology/human" },
    ],
  },
  Mathematics: {
    count: "12 Labs",
    color: "from-amber-600 to-orange-500",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: <Calculator className="w-5 h-5" aria-hidden="true" />,
    path: "/mathematics",
    items: [
      { name: "Function Grapher", path: "/mathematics/functiongrapher" },
      { name: "Calculus Sandbox", path: "/mathematics/calculus" },
      { name: "Linear Algebra & Matrices", path: "/mathematics/linear-algebra" },
      { name: "Trigonometry Explorer", path: "/mathematics/trigonometry" },
    ],
  },
  "Computer Science": {
    count: "19+ Labs",
    color: "from-purple-600 to-indigo-500",
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    icon: <Binary className="w-5 h-5" aria-hidden="true" />,
    path: "/computer-science",
    items: [
      { name: "HTML/CSS/JS Sandbox", path: "/computer-science/code-lab/html-css-js" },
      { name: "Logic Gates Studio", path: "/computer-science/logic-gates" },
      { name: "Sorting Visualizer", path: "/computer-science/dsa/sorting-algorithms" },
      { name: "Network Topologies", path: "/computer-science/networking" },
    ],
  },
};

const quickSubjects = [
  { label: "Physics (14)", path: "/physics", bg: "bg-blue-600 hover:bg-blue-500" },
  { label: "Chemistry (4)", path: "/chemistry", bg: "bg-emerald-600 hover:bg-emerald-500" },
  { label: "Biology (3)", path: "/biology", bg: "bg-rose-600 hover:bg-rose-500" },
  { label: "Mathematics (12)", path: "/mathematics", bg: "bg-amber-600 hover:bg-amber-500" },
  { label: "Computer Science (19+)", path: "/computer-science", bg: "bg-purple-600 hover:bg-purple-500" },
];

export default function Hero() {
  return (
    <div className="w-full">
      {/* -------- Hero Section -------- */}
      <section
        className="relative px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-14 md:pb-20 overflow-hidden border-b border-border bg-gradient-to-b from-card via-background to-background"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute left-1/2 top-1/4 h-[400px] w-[800px] -translate-x-1/2 rounded-[100%] bg-primary/10 blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
          {/* Left Content (7 Cols) */}
          <div className="text-center lg:text-left order-2 lg:order-1 lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest shadow-xs">
              <Sparkles size={13} className="text-primary" />
              <span>50+ Interactive Science Simulations</span>
            </div>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.12]"
            >
              Experience Science <br />
              <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Anywhere, Anytime.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Ditch the static textbooks. Explore high-fidelity, in-browser STEM virtual labs across Physics, Chemistry, Biology, Mathematics, and Computer Science — 100% free with zero installation.
            </p>

            {/* Quick Access Subject Buttons */}
            <div className="pt-2 space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Quick Jump by Discipline:
              </div>
              <nav
                className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-2.5"
                aria-label="Quick Access Labs"
              >
                {quickSubjects.map((btn) => (
                  <Link
                    key={btn.label}
                    href={btn.path}
                    className={`${btn.bg} text-white px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 active:scale-95`}
                  >
                    {btn.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Secondary Action CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/#labs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-md hover:bg-primary/90 transition-all hover:scale-[1.02]"
              >
                <Beaker size={16} />
                <span>Explore All 50+ Labs</span>
              </Link>
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card hover:bg-accent text-foreground font-bold text-xs sm:text-sm transition-all hover:scale-[1.02]"
              >
                <Award size={16} className="text-amber-500" />
                <span>Global XP Leaderboard</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Illustration (5 Cols) */}
          <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center items-center relative">
            <div className="absolute w-72 h-72 bg-primary/20 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-[280px] sm:max-w-[380px] lg:max-w-full">
              <Image
                src="/images/scientist.png"
                width={550}
                height={550}
                alt="3D Illustration of a scientist interacting with virtual laboratory instruments"
                className="w-full h-auto drop-shadow-2xl animate-in fade-in zoom-in duration-700"
                priority
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 380px, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* -------- Lab Grid Section (5 Disciplines) -------- */}
      <section id="labs" className="scroll-mt-16 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-background" aria-labelledby="labs-heading">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary">
              <Beaker size={13} />
              <span>Interactive Learning Suites</span>
            </div>
            <h2 id="labs-heading" className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              Explore Virtual Labs by Subject
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Select a discipline to begin hands-on simulations with real-time numeric calculations.
            </p>
          </div>

          {/* 5-Column Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
            {Object.entries(labsData).map(([category, data], catIndex) => (
              <AnimatedCard
                key={category}
                delay={catIndex * 0.06}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs group hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                {/* Header Banner */}
                <div className={`bg-gradient-to-r ${data.color} p-4 text-white space-y-3`}>
                  <div className="flex items-center justify-between">
                    <div className="bg-white/20 w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                      {data.icon}
                    </div>
                    <span className="text-[11px] font-mono font-bold bg-black/20 px-2 py-0.5 rounded-md">
                      {data.count}
                    </span>
                  </div>
                  <h3 className="text-base font-black uppercase tracking-wider">{category}</h3>
                </div>

                {/* Lab Links List */}
                <div className="p-3.5 flex-grow flex flex-col justify-between space-y-1.5">
                  <div className="space-y-1">
                    {data.items.map((lab) => (
                      <Link
                        key={lab.path}
                        href={lab.path}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors group/link text-xs font-medium text-foreground hover:text-primary"
                        aria-label={`Open ${lab.name} experiment`}
                      >
                        <span className="truncate pr-2">{lab.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover/link:text-primary group-hover/link:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-border/60">
                    <Link
                      href={data.path}
                      className="block text-center text-xs font-bold text-primary hover:underline py-1"
                    >
                      View All {category} Labs &rarr;
                    </Link>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
