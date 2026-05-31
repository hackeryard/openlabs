import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Code2,
  Database,
  Filter,
  Globe2,
  Network,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

const pageUrl = "https://www.openlabs.org.in/computer-science/data-analyzer";
const launchUrl = "/labs/computer-science/data-analyzer";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Computer Science", href: "/computer-science" },
  { label: "Data Analyzer", href: "/computer-science/data-analyzer" },
];

export const metadata: Metadata = {
  title: "Data Analyzer Lab - Social Network Analysis Visualizer | OpenLabs",
  description:
    "Analyze datasets visually with an interactive data analyzer lab. Explore social network graphs, data cleaning, communities, influencers, hubs, and connection patterns.",
  keywords: [
    "data analyzer lab",
    "social network analysis visualizer",
    "interactive data analysis",
    "network graph analyzer",
    "data cleaning simulator",
    "community detection",
    "influencer analysis",
    "OpenLabs computer science lab",
  ],
  alternates: {
    canonical: "/computer-science/data-analyzer",
  },
  openGraph: {
    title: "Data Analyzer Lab - Social Network Analysis Visualizer | OpenLabs",
    description:
      "Clean network data, reveal communities, identify influencers, and analyze graph patterns in an interactive OpenLabs lab.",
    url: pageUrl,
    siteName: "OpenLabs",
    type: "website",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "OpenLabs Data Analyzer Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Analyzer Lab - Social Network Analysis Visualizer | OpenLabs",
    description:
      "Explore network graphs, data cleaning, communities, influencers, and connection patterns visually.",
    images: ["/images/twitter-image.svg"],
  },
};

const features = [
  {
    icon: Network,
    title: "Network graph",
    description:
      "Visualize users, communities, hubs, influencers, and connections as an interactive graph.",
  },
  {
    icon: Filter,
    title: "Data cleaning",
    description:
      "Adjust cleaning intensity to remove weak users, noisy links, and low-value network data.",
  },
  {
    icon: Users,
    title: "Community analysis",
    description:
      "Discover groups such as tech, marketing, and content communities through graph structure.",
  },
  {
    icon: Target,
    title: "Influencer insights",
    description:
      "Identify high-influence users, hubs, bridges, isolated nodes, and key relationship patterns.",
  },
];

const learningObjectives = [
  "Understand how graph data represents users, relationships, and communities.",
  "Explore how data cleaning changes network structure and analysis quality.",
  "Identify influencers, hubs, isolated nodes, bridges, and connection strength.",
  "Practice interpreting analytics metrics such as density, influence, and community size.",
];

const useCases = [
  "Social network analysis",
  "Marketing influencer discovery",
  "Community detection in graphs",
  "Dataset cleaning and exploration",
];

const faqs = [
  {
    question: "What is the OpenLabs Data Analyzer Lab?",
    answer:
      "It is an interactive data analysis lab where learners explore a social network graph, clean noisy data, identify communities, and inspect influencers or hubs.",
  },
  {
    question: "What does data cleaning mean in this lab?",
    answer:
      "Data cleaning means filtering low-influence users and weak connections so the important structure of the network becomes easier to analyze.",
  },
  {
    question: "What can I learn from the network graph?",
    answer:
      "You can learn how nodes, links, communities, influencers, hubs, isolated users, and connection strength reveal patterns in a dataset.",
  },
  {
    question: "Who should use this Data Analyzer?",
    answer:
      "It is useful for students, teachers, beginner data analysts, and anyone learning graph analytics, social network analysis, or dataset exploration.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Data Analyzer Lab",
    description: metadata.description,
    url: pageUrl,
    learningResourceType: "Interactive data analysis lab",
    educationalLevel: "Beginner to Intermediate",
    teaches: [
      "Data analysis",
      "Social network analysis",
      "Graph visualization",
      "Data cleaning",
      "Community detection",
    ],
    provider: {
      "@type": "Organization",
      name: "OpenLabs",
      url: "https://www.openlabs.org.in",
    },
  },
  {
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
      {
        "@type": "ListItem",
        position: 3,
        name: "Data Analyzer",
        item: pageUrl,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <section className="relative border-b border-slate-200 bg-white">
        <nav
          aria-label="Breadcrumb"
          className="absolute left-0 right-0 top-5 mx-auto max-w-6xl px-6 lg:px-8"
        >
          <ol className="flex flex-wrap items-center gap-1 text-xs font-semibold text-slate-500">
            {breadcrumbs.map((breadcrumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <li key={breadcrumb.href} className="flex items-center gap-1">
                  {isLast ? (
                    <span className="text-slate-800" aria-current="page">
                      {breadcrumb.label}
                    </span>
                  ) : (
                    <Link
                      href={breadcrumb.href}
                      className="transition hover:text-indigo-700"
                    >
                      {breadcrumb.label}
                    </Link>
                  )}
                  {!isLast && (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-20 lg:px-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
              <Code2 className="h-4 w-4" />
              Computer Science Data Analyzer Lab
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
              Data Analyzer Lab for Social Network and Graph Insights
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Analyze datasets visually by exploring a social network graph. Clean
              noisy data, reveal communities, inspect connection strength, and
              identify influencers, hubs, bridges, and isolated users in an
              interactive OpenLabs workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={launchUrl}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Launch Data Analyzer
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/computer-science"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-base font-bold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                View Computer Science Labs
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 shadow-2xl shadow-indigo-950/10">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-300" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Network Analyzer
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                  Social Graph
                </div>
                <div className="relative h-52 overflow-hidden rounded-lg bg-white/[0.04]">
                  <svg
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 260 208"
                    preserveAspectRatio="none"
                  >
                    <line x1="66" y1="78" x2="202" y2="60" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
                    <line x1="78" y1="150" x2="176" y2="156" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
                    <line x1="202" y1="60" x2="176" y2="156" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
                    <line x1="66" y1="78" x2="78" y2="150" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
                    <line x1="78" y1="150" x2="28" y2="176" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
                    <line x1="176" y1="156" x2="232" y2="132" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
                  </svg>
                  {[
                    ["left-16 top-16 h-12 w-12 bg-indigo-300", "Tech"],
                    ["right-14 top-12 h-10 w-10 bg-pink-300", "M"],
                    ["left-28 bottom-14 h-10 w-10 bg-cyan-300", "C"],
                    ["right-28 bottom-12 h-12 w-12 bg-emerald-300", "Hub"],
                    ["left-8 bottom-8 h-7 w-7 bg-slate-400", ""],
                    ["right-8 bottom-20 h-7 w-7 bg-amber-300", ""],
                  ].map(([className, label], index) => (
                    <span
                      key={index}
                      className={`absolute z-10 flex items-center justify-center rounded-full text-[10px] font-black text-slate-950 shadow-lg ${className}`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Total Users", value: "65", color: "bg-indigo-300/70" },
                  { label: "Connections", value: "142", color: "bg-cyan-300/70" },
                  { label: "Avg Influence", value: "68%", color: "bg-emerald-300/70" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3 text-xs font-bold text-slate-300">
                      <span className="flex items-center gap-2">
                        <Activity className="h-3.5 w-3.5 text-cyan-300" />
                        {item.label}
                      </span>
                      <span className="font-mono text-white">{item.value}</span>
                    </div>
                    <span className={`block h-2 rounded ${item.color}`} />
                  </div>
                ))}
                <div className="rounded-lg bg-white p-3 text-slate-900">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Filter className="h-4 w-4 text-indigo-600" />
                    Cleaning Intensity
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <span className="block h-full w-7/12 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500" />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    filtering reveals the core influencer network
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div className="grid gap-5 md:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
              >
                <Icon className="mb-4 h-6 w-6 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Learn by analyzing
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Understand network datasets through cleaning and graph exploration
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The lab turns raw relationship data into an explainable graph. As you
              increase cleaning intensity, weak signals fade and key communities,
              bridges, hubs, and influencers become easier to interpret.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {learningObjectives.map((objective) => (
              <div key={objective} className="flex gap-3 rounded-lg bg-slate-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-500" />
                <p className="text-sm font-medium leading-6 text-slate-700">
                  {objective}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-2 lg:px-8">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <Globe2 className="h-6 w-6 text-cyan-600" />
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              Where this lab helps
            </h2>
          </div>
          <ul className="space-y-3">
            {useCases.map((useCase) => (
              <li
                key={useCase}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
              >
                {useCase}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-5 flex items-center gap-3">
            <Database className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              How the interactive lab works
            </h2>
          </div>
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-base leading-7 text-slate-600 shadow-sm">
            Open the analyzer, adjust the cleaning slider, inspect the network graph,
            and click nodes to review influence, role, community, and connection
            details. The dashboard updates as the dataset becomes cleaner.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-950">
            Data Analyzer FAQs
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-[#fafafa] shadow-sm transition-all duration-300 open:border-indigo-200 open:bg-white open:shadow-md open:shadow-indigo-950/5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-bold text-slate-900 transition hover:text-indigo-700">
                  <span>{faq.question}</span>
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition group-open:border-indigo-100 group-open:bg-indigo-50 group-open:text-indigo-600">
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-open:rotate-90" />
                  </span>
                </summary>
                <div className="border-t border-slate-100 px-5 pb-5 pt-1">
                  <p className="text-sm leading-6 text-slate-600">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
          <div className="mt-10 rounded-xl bg-slate-950 px-6 py-7 text-white md:flex md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black">
                Ready to analyze network data visually?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Launch the analyzer, clean the graph, and discover communities,
                influencers, hubs, and hidden relationship patterns.
              </p>
            </div>
            <Link
              href={launchUrl}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-50 md:mt-0"
            >
              Open Data Analyzer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
