import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Beaker,
  Atom,
  Dna,
  Binary,
  Calculator,
  Sparkles,
  GraduationCap,
  Heart,
  Globe,
  Zap,
  Target,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Compass,
  BookOpen,
  ShieldCheck,
  Layers,
  Cpu,
  Flame,
  Activity,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About OpenLabs - Free Interactive STEM Virtual Labs",
  description:
    "Learn about OpenLabs, a free in-browser STEM virtual lab platform with 94 interactive simulations across Physics, Chemistry, Biology, Mathematics, and Computer Science.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About OpenLabs - Free Virtual Labs for STEM Education",
    description:
      "Discover the mission, technology, and team behind OpenLabs — an open-access platform empowering students worldwide with high-fidelity virtual science labs.",
    url: "/about",
    type: "website",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "OpenLabs Virtual Lab Platform Overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About OpenLabs - Free Virtual Labs for STEM Education",
    description: "Learn about the OpenLabs mission, 94 interactive simulations, roadmap, and team.",
    images: ["/images/twitter-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const stats = [
  {
    value: "50+",
    label: "Virtual Labs",
    description: "High-fidelity interactive simulations",
    icon: Beaker,
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    value: "5",
    label: "STEM Disciplines",
    description: "Physics, Chem, Bio, Math & CS",
    icon: GraduationCap,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    value: "100%",
    label: "Free & Open Access",
    description: "Zero paywalls or subscription gates",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-500/10 border-rose-500/20",
  },
  {
    value: "24/7",
    label: "Instant In-Browser",
    description: "Runs instantly without installation",
    icon: Globe,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
];

const subjects = [
  {
    name: "Physics",
    count: "14 Labs",
    description: "Kinematics, Hooke's law, Ohm's law, Faraday's induction, Optics, Thermodynamics & Wave mechanics.",
    icon: Atom,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    href: "/physics",
  },
  {
    name: "Chemistry",
    count: "4 Labs",
    description: "Acid-base titration, chemical kinetics, Le Chatelier equilibrium, and flame emission spectroscopy.",
    icon: Flame,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    href: "/chemistry",
  },
  {
    name: "Biology",
    count: "3 Labs",
    description: "Cell mitosis & meiosis division, DNA helicase replication, and Mendelian dihybrid inheritance.",
    icon: Dna,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    href: "/biology",
  },
  {
    name: "Mathematics",
    count: "12 Labs",
    description: "Calculus integration, differential equations, linear algebra, trigonometry, and function graphers.",
    icon: Calculator,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    href: "/mathematics",
  },
  {
    name: "Computer Science",
    count: "19+ Labs",
    description: "Interactive logic gates, sorting algorithms, data structures, network topologies, and git branching.",
    icon: Binary,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    href: "/computer-science",
  },
];

const values = [
  {
    icon: Target,
    title: "Accessible to Every Student",
    description:
      "Every curious mind deserves hands-on science experience, regardless of whether their school has a million-dollar laboratory or no physical lab equipment at all.",
    gradient: "from-blue-500/15 via-cyan-500/10 to-transparent",
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Zap,
    title: "Tactile, Experiential Learning",
    description:
      "Interactive simulations beat passive memorization. We believe in active experimentation — turning dials, adjusting variables, observing anomalies, and seeing equations come to life.",
    gradient: "from-amber-500/15 via-orange-500/10 to-transparent",
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Real-Time Mentorship",
    description:
      "Our built-in OpenLabs AI lab assistant acts as an on-demand tutor — explaining theoretical derivations, hinting at experimental setups, and troubleshooting errors in real time.",
    gradient: "from-purple-500/15 via-pink-500/10 to-transparent",
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Award,
    title: "Gamified Mastery & XP Tracking",
    description:
      "Learning science should be thrilling. Students earn experience points (XP), unlock achievements, level up, and compete on the global leaderboard as they solve lab challenges.",
    gradient: "from-emerald-500/15 via-teal-500/10 to-transparent",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

const whatsNextItems = [
  {
    icon: Beaker,
    title: "Advanced STEM Lab Suites",
    description: "Expanding into nuclear physics simulations, quantum wave packets, spectrometry, and CPU pipelining architectures.",
    badge: "Coming Soon",
    color: "border-blue-500/30 bg-blue-500/5",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    icon: GraduationCap,
    title: "Verifiable Lab Certificates",
    description: "Complete structured subject tracks and rigorous experimental challenges to earn verifiable digital credentials to showcase your STEM mastery.",
    badge: "Coming Soon",
    color: "border-purple-500/30 bg-purple-500/5",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  {
    icon: Users,
    title: "Real-Time Collaborative Labs",
    description: "Run live experiments with lab partners — synchronize dials, share parameters, and compare readings together in real time.",
    badge: "Coming Soon",
    color: "border-emerald-500/30 bg-emerald-500/5",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
];

const team = [
  {
    name: "Rahul Rajput",
    role: "Founder and Lead Developer",
    bio: "\"Technology should not just deliver information; it should deliver experiences. OpenLabs is my attempt to ensure that the thrill of scientific discovery is never gated by geography or funding.\"",
    initials: "RR",
    gradient: "from-indigo-600 to-cyan-500",
  },
  {
    name: "Aditya Kumar",
    role: "Core Team Member",
    bio: "\"Design is not just how it looks. It is how it works. Every interaction on OpenLabs is crafted to feel effortless, so students focus on the science, not the interface.\"",
    initials: "AK",
    gradient: "from-blue-600 to-teal-500",
  },
  {
    name: "Md Azharuddin Khan",
    role: "Core Team Member",
    bio: "\"Performance is a feature. Whether you are on a flagship phone or a budget laptop in a school lab, the simulations should run without compromise.\"",
    initials: "AK",
    gradient: "from-emerald-600 to-emerald-400",
  },
  {
    name: "Anshika Gaur",
    role: "Core Team Member",
    bio: "\"Science education fails when accuracy fails. Every virtual experiment on OpenLabs is grounded in real principles. If the numbers do not match the textbook, we fix it.\"",
    initials: "AG",
    gradient: "from-purple-600 to-pink-500",
  },
];

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://www.openlabs.org.in/about#webpage",
  url: "https://www.openlabs.org.in/about",
  name: "About OpenLabs",
  description: metadata.description,
  isPartOf: {
    "@type": "WebSite",
    "@id": "https://www.openlabs.org.in/#website",
    name: "OpenLabs",
    url: "https://www.openlabs.org.in/",
  },
  mainEntity: {
    "@type": "EducationalOrganization",
    name: "OpenLabs",
    url: "https://www.openlabs.org.in/",
    description:
      "Free browser-based virtual labs and interactive STEM simulations for students and educators worldwide.",
    founder: {
      "@type": "Person",
      name: "Rahul Rajput",
    },
    knowsAbout: [
      "Physics Virtual Labs",
      "Chemistry Virtual Labs",
      "Biology Virtual Labs",
      "Mathematics Virtual Labs",
      "Computer Science Virtual Labs",
      "STEM Education",
      "Interactive Science Simulations",
    ],
  },
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
      name: "About",
      item: "https://www.openlabs.org.in/about",
    },
  ],
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-card via-background to-background px-6 pt-12 pb-16 sm:pt-16 sm:pb-20 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute left-1/2 top-1/4 h-[350px] w-[700px] -translate-x-1/2 rounded-[100%] bg-primary/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl text-center space-y-4">
          {/* Mission Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest shadow-sm">
            <Sparkles size={13} className="text-primary" />
            <span>Democratizing Science Education</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
            Brilliant Minds <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Should Never Be Limited By Hardware
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-3xl text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed font-normal">
            OpenLabs delivers high-fidelity, in-browser STEM simulations across Physics, Chemistry, Biology, Mathematics, and Computer Science. No expensive equipment, no software installation, no budget barriers.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/#labs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02]"
            >
              <Beaker size={15} />
              <span>Explore 94 Virtual Labs</span>
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground font-bold text-xs sm:text-sm transition-all hover:scale-[1.02]"
            >
              <Award size={15} className="text-amber-500" />
              <span>Global Leaderboard</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PLATFORM STATS ─── */}
      <section aria-label="OpenLabs platform statistics" className="relative z-20 mx-auto -mt-8 sm:-mt-10 max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-4 sm:p-5 text-center shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/40 space-y-1.5"
            >
              <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl border ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} aria-hidden="true" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">{stat.value}</div>
              <div className="text-[11px] font-black uppercase tracking-wider text-foreground">{stat.label}</div>
              <p className="text-[10px] text-muted-foreground leading-tight">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── OUR ORIGIN STORY & SUBJECTS ─── */}
      <section className="relative overflow-hidden py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 space-y-8 sm:space-y-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-primary">
                  <Compass size={13} />
                  <span>The Origin & Vision</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
                  Transforming Abstract Formulas Into Real Intuition
                </h2>
                <div className="h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
              </div>

              <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed font-normal">
                <p>
                  OpenLabs was born from a fundamental observation: millions of brilliant students worldwide study advanced science from static, abstract textbook formulas without ever touching laboratory equipment.
                </p>
                <p>
                  Not because they lack passion, but because physical laboratories are expensive, hazardous, and unevenly distributed across schools.
                </p>
                <p>
                  We built OpenLabs to bridge that gap. When you explore Ohm's law, you don't just calculate <span className="font-mono text-foreground font-bold">V = IR</span> — you dial the voltage, observe real-time thermal drift, watch electron flows, and analyze transient response graphs directly on your screen.
                </p>
              </div>
            </div>

            {/* Disciplines Matrix */}
            <div className="lg:col-span-5 space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">
                Active STEM Disciplines
              </h3>
              <div className="space-y-2.5">
                {subjects.map((sub) => {
                  const Icon = sub.icon;
                  return (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className="group flex items-start gap-3.5 p-3 sm:p-3.5 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-accent/50 transition-all duration-150 shadow-xs"
                    >
                      <div className={`p-2.5 rounded-lg border ${sub.bg} ${sub.border} shrink-0`}>
                        <Icon size={18} className={sub.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-foreground text-xs sm:text-sm group-hover:text-primary transition-colors">
                            {sub.name}
                          </h4>
                          <span className="text-[11px] font-mono font-bold text-muted-foreground">
                            {sub.count}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 leading-snug">
                          {sub.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PLATFORM CORE PILLARS ─── */}
      <section className="relative border-y border-border bg-card/60 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 space-y-8 sm:space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-primary">
              <Layers size={13} />
              <span>Core Architectural Pillars</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
              Engineered for Genuine Scientific Mastery
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Every simulation on OpenLabs is backed by rigorous numerical models and interactive feedback loops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${v.gradient} opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none`} />
                  <div className="relative z-10 space-y-2.5">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${v.iconBg} shadow-xs transition-transform duration-200 group-hover:scale-105`}>
                      <Icon className={`h-5 w-5 ${v.iconColor}`} />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {v.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── WHAT'S NEXT SECTION ─── */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 space-y-8 sm:space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-primary">
              <Zap size={13} />
              <span>What's Next</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
              What's Coming to OpenLabs
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Our continuous commitment to expanding interactive learning capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {whatsNextItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`rounded-2xl border p-5 sm:p-6 shadow-xs transition-all duration-150 hover:-translate-y-0.5 ${item.color} space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-primary shadow-xs">
                      <Icon size={18} />
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border font-mono ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── MEET THE TEAM ─── */}
      <section className="relative border-t border-border bg-card/40 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 space-y-8 sm:space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-primary">
              <Users size={13} />
              <span>The Builders</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
              Meet the Team
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              The engineers, designers, and science advocates shaping OpenLabs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {team.map((member) => (
              <article
                key={member.name}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40"
              >
                <div className="relative mx-auto mb-3.5 inline-block transition-transform duration-200 group-hover:scale-105">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-md" />
                  <div className="relative mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-border bg-muted shadow-sm">
                    <span className={`bg-gradient-to-br ${member.gradient} bg-clip-text text-xl font-black text-transparent`}>
                      {member.initials}
                    </span>
                  </div>
                </div>

                <div className="text-center space-y-0.5">
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                    {member.role}
                  </p>
                </div>

                <p className="mt-3 flex-grow text-xs italic leading-relaxed text-muted-foreground text-center">
                  {member.bio}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── READY TO EXPERIMENT CTA ─── */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-indigo-900/40 via-blue-900/30 to-purple-900/40 p-6 sm:p-10 text-center shadow-lg space-y-4">
            <div className="relative z-10 max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Ready to Start Experimenting?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Dive into 94 free interactive STEM simulations today. No credit card, no sign-up barrier, no limits.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/#labs"
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-sm hover:bg-primary/90 transition-all hover:scale-105"
                >
                  Explore All Labs
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all"
                >
                  Get In Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
