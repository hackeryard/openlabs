import React from "react";
import type { Metadata } from "next";
import { Beaker, Users, Target, Globe, Sparkles, GraduationCap, Heart, Zap, Calculator } from "lucide-react";

export const metadata: Metadata = {
  title: "About OpenLabs - Free Virtual Labs for STEM Education",
  description: "Learn about OpenLabs, a free virtual lab platform helping students and teachers explore physics, chemistry, biology, computer science, and mathematics through browser-based simulations.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About OpenLabs - Free Virtual Labs for STEM Education",
    description: "Meet the mission and team behind OpenLabs, an interactive STEM learning platform for free virtual labs.",
    url: "/about",
    type: "website",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "OpenLabs virtual lab platform overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About OpenLabs - Free Virtual Labs for STEM Education",
    description: "Learn about the OpenLabs mission, values, roadmap, and team.",
    images: ["/images/twitter-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const stats = [
  { value: "25+", label: "Virtual Labs", icon: Beaker, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40" },
  { value: "4", label: "Subjects Covered", icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
  { value: "100%", label: "Free and Open", icon: Heart, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/40" },
  { value: "24/7", label: "Global Access", icon: Globe, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/40" },
];

const values = [
  {
    icon: Target,
    title: "Accessible Education",
    description: "Every student deserves hands-on science experience, regardless of their school's lab equipment or budget constraints.",
    gradient: "from-blue-100 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/10",
    border: "group-hover:border-blue-200",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100 dark:bg-blue-950/40",
  },
  {
    icon: Zap,
    title: "Experiential Learning",
    description: "Interactive simulations beat static textbooks. We believe in learning that involves doing, failing, and exploring.",
    gradient: "from-amber-100 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/10",
    border: "group-hover:border-amber-200",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100 dark:bg-amber-950/40",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Guidance",
    description: "Our built-in AI assistant helps explain concepts, answers questions, and guides experiments in real time.",
    gradient: "from-purple-100 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/10",
    border: "group-hover:border-purple-200",
    iconColor: "text-purple-600",
    iconBg: "bg-purple-100 dark:bg-purple-950/40",
  },
  {
    icon: Users,
    title: "Always Expanding",
    description: "New labs, subjects, and features ship continuously. From Physics to Computer Science, OpenLabs grows with what students actually need.",
    gradient: "from-emerald-100 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/10",
    border: "group-hover:border-emerald-200",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100 dark:bg-emerald-950/40",
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
    description: "Free browser-based virtual labs and interactive STEM simulations for students and educators.",
    founder: {
      "@type": "Person",
      name: "Rahul Rajput",
    },
    knowsAbout: ["Physics", "Chemistry", "Biology", "Computer Science", "Mathematics", "Virtual labs"],
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
    <main className="min-h-screen text-foreground selection:bg-indigo-100 selection:text-indigo-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="relative overflow-hidden border-b border-border/60 bg-card px-6 pb-24 pt-16 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 to-transparent" />
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[800px] -translate-x-1/2 rounded-[100%] bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <h1 className="mb-6 text-5xl font-black tracking-tight text-foreground md:text-7xl">
            Brilliant Minds<br />
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Should Not Be Limited By Hardware
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            OpenLabs gives every student access to high-fidelity virtual labs: no equipment, no budget barrier, no limits. Just pure scientific discovery.
          </p>
        </div>
      </section>

      <section aria-label="OpenLabs platform statistics" className="relative z-20 mx-auto -mt-12 max-w-5xl px-6 sm:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-card/90 p-6 text-center shadow-lg shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl">
              <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
              </div>
              <div className="mb-1 text-3xl font-black text-foreground">{stat.value}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-background py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Our Origin Story</h2>
                <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500" />
              </div>
              <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                  OpenLabs was born from a simple, frustrating observation: millions of brilliant students worldwide study advanced science from static textbooks without ever touching real lab equipment.
                </p>
                <p>
                  Not because they lack curiosity, but simply because their schools lack resources. The gap between theory and practice was too wide.
                </p>
                <p>
                  We set out to change that. OpenLabs provides free, browser-based, high-fidelity virtual labs covering Physics, Chemistry, Biology, and Computer Science. You do not just read about Hooke's Law. You build the mass-spring system, measure the oscillations, and see the math come alive.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-200/50 to-purple-200/50 blur-3xl" />
              <div className="relative space-y-4 rounded-3xl border border-border bg-card/70 p-8 shadow-xl shadow-indigo-100/50 dark:shadow-black/30 backdrop-blur-md">
                {[
                  { subject: "Physics Labs", count: "10", color: "bg-blue-500" },
                  { subject: "Chemistry Labs", count: "4", color: "bg-emerald-500" },
                  { subject: "Biology Labs", count: "3", color: "bg-rose-500" },
                  { subject: "Computer Science Labs", count: "10+", color: "bg-indigo-500" },
                ].map((subject) => (
                  <div key={subject.subject} className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full ${subject.color}`} />
                      <span className="font-medium text-foreground">{subject.subject}</span>
                    </div>
                    <span className="text-2xl font-black text-foreground">{subject.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-border/60 bg-card py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Core Principles</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">The foundational ideas that drive every feature we build.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/30">
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <div className={`absolute inset-0 rounded-3xl border-2 border-transparent ${value.border} pointer-events-none transition-colors duration-300`} />
                <div className="relative z-10">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-background ${value.iconBg} shadow-sm transition-transform duration-300 group-hover:scale-105`}>
                    <value.icon className={`h-6 w-6 ${value.iconColor}`} aria-hidden="true" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-foreground">{value.title}</h3>
                  <p className="leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="px-8 py-10">
            <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-foreground md:text-3xl">What's Coming to OpenLabs</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  Icon: Calculator,
                  title: "Mathematics Labs",
                  description: "Interactive algebra, calculus, and geometry labs are the next full subject coming to OpenLabs.",
                  color: "bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900",
                  iconColor: "text-emerald-600",
                  iconBg: "bg-emerald-100 dark:bg-emerald-950/40",
                },
                {
                  Icon: Users,
                  title: "Collaborative Labs",
                  description: "Run experiments together in real time. Share parameters, compare results, and learn as a team.",
                  color: "bg-blue-50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900",
                  iconColor: "text-blue-600",
                  iconBg: "bg-blue-100 dark:bg-blue-950/40",
                },
                {
                  Icon: GraduationCap,
                  title: "Lab Certificates",
                  description: "Complete subject tracks and earn verifiable certificates to showcase your science skills.",
                  color: "bg-purple-50 border-purple-100 dark:bg-purple-950/20 dark:border-purple-900",
                  iconColor: "text-purple-600",
                  iconBg: "bg-purple-100 dark:bg-purple-950/40",
                },
              ].map((item) => (
                <div key={item.title} className={`rounded-2xl border p-6 ${item.color}`}>
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg}`}>
                    <item.Icon className={`h-5 w-5 ${item.iconColor}`} aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-background py-32">
        <div className="mx-auto max-w-7xl px-6 text-center sm:px-8">
          <div className="mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Meet the Team</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">The minds building the future of interactive science education.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <article key={member.name} className="group flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100 dark:hover:shadow-black/30">
                <div className="relative mx-auto mb-6 inline-block transition-transform duration-300 group-hover:scale-105">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
                  <div className="relative mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-[3px] border-background bg-muted shadow-md">
                    <span className={`bg-gradient-to-br ${member.gradient} bg-clip-text text-2xl font-black text-transparent`}>{member.initials}</span>
                  </div>
                </div>
                <h3 className="mb-1 text-xl font-bold text-foreground">{member.name}</h3>
                <p className="mb-4 text-xs font-bold uppercase tracking-wider text-indigo-600">{member.role}</p>
                <p className="mb-6 flex-grow text-sm italic leading-relaxed text-muted-foreground">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
