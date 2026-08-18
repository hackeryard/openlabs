import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Beaker,
  GraduationCap,
  Heart,
  Globe,
  Award,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  BookOpen,
  Calendar,
  Clock,
} from "lucide-react";
import Hero from "./components/Hero";
import ProfileSetupBannerClient from "../components/ProfileSetupBannerClient";
import AnimatedCard from "../components/ui/AnimatedCard";
import { connectDB } from "@/app/lib/mongodb";
import Blog from "@/app/models/Blog";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "OpenLabs - 50+ Free Virtual STEM Labs for Interactive Learning",
  description:
    "Explore 50+ interactive virtual labs across Physics, Chemistry, Biology, Mathematics, and Computer Science. 100% free browser-based STEM simulations with real-time numeric calculations.",
  keywords: [
    "science education",
    "interactive learning",
    "virtual labs",
    "STEM education",
    "physics labs",
    "chemistry experiments",
    "biology simulations",
    "mathematics visualizer",
    "computer science tools",
    "online learning",
  ],
  openGraph: {
    title: "OpenLabs - 50+ Free Virtual STEM Labs for Interactive Learning",
    description:
      "Explore 50+ interactive virtual labs in Physics, Chemistry, Biology, Mathematics, and Computer Science with guided simulations.",
    url: "/",
    type: "website",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "OpenLabs interactive virtual lab learning platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/twitter-image.svg"],
    title: "OpenLabs - 50+ Free Virtual STEM Labs for Interactive Learning",
    description:
      "Explore 50+ interactive virtual labs in Physics, Chemistry, Biology, Mathematics, and Computer Science.",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  applicationName: "OpenLabs",
};

interface LatestBlogPost {
  slug: string;
  title: string;
  excerpt?: string;
  category: string;
  author?: string;
  date: string;
  readTime?: string;
  coverImage?: string;
}

async function getLatestBlogs(): Promise<LatestBlogPost[]> {
  try {
    await connectDB();
    const blogs = await Blog.find({ published: true })
      .sort({ date: -1 })
      .limit(3)
      .select("slug title excerpt category author date readTime coverImage -_id")
      .lean();

    return JSON.parse(JSON.stringify(blogs)) || [];
  } catch (error) {
    console.error("Failed to fetch latest blogs for home page:", error);
    return [];
  }
}

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

const faqsData = [
  {
    q: "What is OpenLabs and who is it for?",
    a: "OpenLabs is a free virtual STEM simulation platform for students, educators, and science enthusiasts who want hands-on, experiment-led learning in Physics, Chemistry, Biology, Mathematics, and Computer Science.",
  },
  {
    q: "Do I need any special software or plugins to run the labs?",
    a: "No special software or downloads are required. All 50+ simulations run directly in any modern web browser (Chrome, Firefox, Safari, Edge) on desktop, tablet, or smartphone.",
  },
  {
    q: "How accurate are the scientific simulations?",
    a: "Every simulation on OpenLabs is rigorously derived from verified physical principles, differential equations, empirical chemical reaction formulas, and discrete mathematical algorithms.",
  },
  {
    q: "Can educators use OpenLabs in school classrooms?",
    a: "Yes, OpenLabs is completely open for classroom instruction, homework assignments, remote demonstrations, and lab assessments without licensing fees.",
  },
  {
    q: "Is OpenLabs free to use?",
    a: "Yes, 100% free. There are zero subscription gates, paywalls, or credit card barriers.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqsData.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.openlabs.org.in/#webpage",
  url: "https://www.openlabs.org.in/",
  name: "OpenLabs Virtual Labs for Interactive STEM Learning",
  description: metadata.description,
  isPartOf: {
    "@type": "WebSite",
    "@id": "https://www.openlabs.org.in/#website",
    name: "OpenLabs",
    url: "https://www.openlabs.org.in/",
  },
  about: [
    "Virtual labs",
    "Physics simulations",
    "Chemistry experiments",
    "Biology learning",
    "Mathematics simulations",
    "Computer science tools",
  ],
  audience: {
    "@type": "EducationalAudience",
    educationalRole: ["student", "teacher", "self-learner"],
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
  ],
};

export default async function Home() {
  const latestBlogs = await getLatestBlogs();

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary antialiased">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Client-only banner component */}
      <ProfileSetupBannerClient />

      {/* Hero & Subject Suites */}
      <Hero />

      {/* Platform Stats Grid */}
      <section aria-label="OpenLabs platform statistics" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-4 sm:p-5 text-center shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 space-y-1.5"
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

      {/* Hands-On Science Section */}
      <section className="border-t border-border bg-card/50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary">
              <Zap size={13} />
              <span>Experiential STEM Pedagogy</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.15]">
              Hands-On Learning, <br />
              <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Without Physical Limits.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-normal">
              OpenLabs provides guided virtual experiments, live numeric plots, step-by-step hypothesis testing, and gamified XP challenges to transform static formulas into intuitive comprehension.
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:underline"
              >
                <span>Learn more about the OpenLabs mission</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              {
                title: "Safe & Risk-Free",
                desc: "Run complex electrical, chemical, and physical simulations without hazard.",
              },
              {
                title: "Live Parameter Tuning",
                desc: "Turn voltage dials, adjust spring constants, and observe real-time curves.",
              },
              {
                title: "AI Lab Mentor Built-in",
                desc: "Get instant hints, theoretical derivations, and error troubleshooting.",
              },
              {
                title: "Gamified XP & Leaderboard",
                desc: "Earn experience points, level up your rank, and solve daily challenges.",
              },
            ].map((feature, i) => (
              <AnimatedCard
                key={i}
                delay={i * 0.05}
                className="flex flex-col p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs space-y-1.5 hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold text-foreground">{feature.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-6">{feature.desc}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LATEST ARTICLES & RESEARCH SECTION ─── */}
      {latestBlogs && latestBlogs.length > 0 && (
        <section
          aria-labelledby="latest-articles-heading"
          className="border-t border-border bg-background py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary">
                  <BookOpen size={13} />
                  <span>Research & Publications</span>
                </div>
                <h2
                  id="latest-articles-heading"
                  className="text-2xl sm:text-4xl font-black text-foreground tracking-tight"
                >
                  Latest From The OpenLabs Blog
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                  Deep dives into scientific derivations, interactive simulation pedagogy, and engineering updates.
                </p>
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:underline group shrink-0"
              >
                <span>Explore All Articles</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
              {latestBlogs.map((post) => {
                const displayDate = new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col rounded-3xl border border-border bg-card p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/40 overflow-hidden"
                  >
                    {post.coverImage && (
                      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-muted border border-border/50">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                        {post.category}
                      </span>
                      {post.readTime && (
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-semibold">
                          <Clock size={11} className="text-primary" />
                          <span>{post.readTime}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed font-normal">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/60">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-primary" />
                        <span>{displayDate}</span>
                      </div>
                      <span className="text-xs font-bold text-primary flex items-center gap-0.5 group-hover:underline">
                        <span>Read</span>
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Frequently Asked Questions */}
      <section id="faqs" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary">
              <HelpCircle size={13} />
              <span>Everything Answered</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Find answers to common questions about simulations, classroom usage, and browser compatibility.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-3">
            {faqsData.map((faq, index) => (
              <details
                key={index}
                name="home-faq"
                className="group rounded-2xl bg-card border border-border/80 shadow-xs overflow-hidden open:border-primary/40 open:shadow-sm transition-all duration-200"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none outline-none">
                  <span className="font-bold text-foreground text-xs sm:text-sm group-hover:text-primary transition-colors pr-4">
                    {faq.q}
                  </span>
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center group-open:bg-primary/10 group-open:border-primary/20 transition-colors">
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-open:text-primary group-open:rotate-180 transition-transform duration-200" />
                  </span>
                </summary>
                <div className="px-5 pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/60 pt-3">
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
