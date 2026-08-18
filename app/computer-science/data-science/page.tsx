import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Code2,
  Database,
  Globe2,
  MonitorPlay,
  Radar,
  ScatterChart,
  Sparkles,
  Target,
} from "lucide-react";

const pageUrl = "https://www.openlabs.org.in/computer-science/data-science";
const launchUrl = "/labs/computer-science/data-science";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Computer Science", href: "/computer-science" },
  { label: "Data Science", href: "/computer-science/data-science" },
];

export const metadata: Metadata = {
  title: "Data Science Anomaly Detection Lab | OpenLabs",
  description:
    "Learn data science with an interactive anomaly detection lab. Explore outliers, thresholds, scatter plots, fraud detection, statistical data visualization.",
  keywords: [
    "data science lab",
    "anomaly detection visualizer",
    "outlier detection",
    "interactive data visualization",
    "fraud detection data science",
    "statistical analysis lab",
    "scatter plot visualizer",
    "OpenLabs computer science lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/data-science",
  },
  openGraph: {
    title: "Data Science Anomaly Detection Lab | OpenLabs",
    description:
      "Visualize data points, adjust detection thresholds, inject anomalies, and learn how outlier detection works.",
    url: pageUrl,
    siteName: "OpenLabs",
    type: "website",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "OpenLabs Data Science Anomaly Detection Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Science Anomaly Detection Lab | OpenLabs",
    description:
      "Explore anomaly detection, thresholds, outliers, and statistical visualization in an interactive lab.",
    images: ["/images/twitter-image.svg"],
  },
};

const features = [
  {
    icon: ScatterChart,
    title: "Data visualization",
    description:
      "Inspect clusters, outliers, and suspicious points through a visual scatter plot interface.",
  },
  {
    icon: Target,
    title: "Threshold tuning",
    description:
      "Adjust detection sensitivity and see how false positives and missed anomalies change.",
  },
  {
    icon: Radar,
    title: "Anomaly scanning",
    description:
      "Run a monitoring scan to flag unusual data points and understand detection flow.",
  },
  {
    icon: BarChart3,
    title: "Detection insights",
    description:
      "Compare normal traffic, threats, detected anomalies, and remaining suspicious data.",
  },
];

const learningObjectives = [
  "Understand how anomaly detection identifies data points outside normal patterns.",
  "Explore the role of thresholds, distance, and anomaly scores in outlier detection.",
  "Visualize how fraud or suspicious network activity can appear in a dataset.",
  "Practice interpreting data science model output through charts and metrics.",
];

const useCases = [
  "Fraud detection in transactions",
  "Network security monitoring",
  "Outlier analysis in datasets",
  "Data science classroom demonstrations",
];

const faqs = [
  {
    question: "What is the Data Science Anomaly Detection Lab?",
    answer:
      "It is an interactive OpenLabs data science lab where learners explore clusters, outliers, detection thresholds, anomaly scores, and monitoring behavior.",
  },
  {
    question: "What is anomaly detection?",
    answer:
      "Anomaly detection is the process of finding data points that differ significantly from normal patterns, often used for fraud, security, and quality monitoring.",
  },
  {
    question: "Why does the threshold matter?",
    answer:
      "A stricter threshold can catch more suspicious points but may create false positives, while a relaxed threshold may miss real anomalies.",
  },
  {
    question: "Who should use this data science lab?",
    answer:
      "It is useful for students, teachers, beginner data analysts, and anyone learning how statistical visualization supports real-world detection systems.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Data Science Anomaly Detection Lab",
    description: metadata.description,
    url: pageUrl,
    learningResourceType: "Interactive data science lab",
    educationalLevel: "Beginner to Intermediate",
    teaches: [
      "Data science",
      "Anomaly detection",
      "Outlier detection",
      "Data visualization",
      "Threshold tuning",
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
        name: "Data Science",
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
    <main className="min-h-screen text-foreground selection:bg-indigo-100 selection:text-indigo-900">
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <section className="relative border-b border-border bg-card">
        <nav
          aria-label="Breadcrumb"
          className="absolute left-0 right-0 top-5 mx-auto max-w-6xl px-6 lg:px-8"
        >
          <ol className="flex flex-wrap items-center gap-1 text-xs font-semibold text-muted-foreground">
            {breadcrumbs.map((breadcrumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <li key={breadcrumb.href} className="flex items-center gap-1">
                  {isLast ? (
                    <span className="text-foreground" aria-current="page">
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
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
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
              Computer Science Data Science Lab
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl">
              Data Science Lab for Anomaly Detection and Visualization
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Learn data science by exploring how statistical monitoring detects
              unusual points. Tune thresholds, inspect scatter plots, inject
              suspicious data, and visualize anomaly scores in an interactive
              OpenLabs workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={launchUrl}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Launch Data Science Lab
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/computer-science"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-6 py-3 text-base font-bold text-foreground transition hover:border-indigo-200 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
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
                Anomaly Detection
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                  Scatter Plot
                </div>
                <div className="relative h-52 rounded-lg bg-white/[0.04]">
                  {[
                    "left-16 top-20 bg-cyan-300",
                    "left-24 top-24 bg-cyan-300",
                    "left-20 top-32 bg-cyan-300",
                    "left-32 top-20 bg-cyan-300",
                    "left-36 top-28 bg-cyan-300",
                    "right-20 bottom-16 bg-indigo-300",
                    "right-24 bottom-24 bg-indigo-300",
                    "right-12 bottom-20 bg-indigo-300",
                    "right-14 top-10 bg-red-400",
                    "left-10 bottom-8 bg-amber-300",
                  ].map((className, index) => (
                    <span
                      key={index}
                      className={`absolute h-3 w-3 rounded-full shadow-lg ${className}`}
                    />
                  ))}
                  <span className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/30" />
                  <span className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-300/20" />
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Normal Traffic", value: "120", color: "bg-cyan-300/70" },
                  { label: "Anomaly Score", value: "0.82", color: "bg-amber-300/80" },
                  { label: "Threats Flagged", value: "09", color: "bg-red-400/80" },
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
                    <Radar className="h-4 w-4 text-indigo-600" />
                    Scan Threshold
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <span className="block h-full w-8/12 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500" />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    stricter threshold catches more outliers
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
                className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
              >
                <Icon className="mb-4 h-6 w-6 text-indigo-600" />
                <h2 className="text-lg font-bold text-foreground">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Learn by analyzing
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground">
              Understand outlier detection through live data science feedback
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              The lab turns anomaly detection into a visible workflow: generate a
              dataset, adjust sensitivity, scan for unusual points, and interpret
              the resulting metrics like a data analyst.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {learningObjectives.map((objective) => (
              <div key={objective} className="flex gap-3 rounded-lg bg-muted p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-500" />
                <p className="text-sm font-medium leading-6 text-foreground">
                  {objective}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-1 lg:px-8">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <Globe2 className="h-6 w-6 text-cyan-600" />
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              Where this lab helps
            </h2>
          </div>
          <ul className="space-y-3">
            {useCases.map((useCase) => (
              <li
                key={useCase}
                className="rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
              >
                {useCase}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-5 flex items-center gap-3">
            <Database className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              How the interactive lab works
            </h2>
          </div>
          <p className="rounded-xl border border-border bg-card p-6 text-base leading-7 text-muted-foreground shadow-sm">
            Open the lab, review the generated dataset, adjust the sensitivity
            threshold, and run the monitor. The visualization highlights normal
            clusters, suspicious outliers, and detected anomalies so the model
            behavior becomes easier to explain.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            Data Science Lab FAQs
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                name="datascience-faq"
                className="group overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-all duration-300 open:border-indigo-200 open:bg-card open:shadow-md open:shadow-indigo-950/5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-bold text-foreground transition hover:text-indigo-700">
                  <span>{faq.question}</span>
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition group-open:border-indigo-100 group-open:bg-indigo-50 group-open:text-indigo-600">
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-open:rotate-90" />
                  </span>
                </summary>
                <div className="border-t border-border px-5 pb-5 pt-1">
                  <p className="text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
          <div className="mt-10 rounded-xl bg-slate-950 px-6 py-7 text-white md:flex md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black">
                Ready to detect anomalies visually?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Launch the lab, scan the dataset, and learn how data science models
                separate normal patterns from unusual behavior.
              </p>
            </div>
            <Link
              href={launchUrl}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-50 md:mt-0"
            >
              Open Data Science Lab
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
