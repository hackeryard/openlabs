import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Braces,
  CheckCircle2,
  ChevronRight,
  Code2,
  FileCode2,
  Globe2,
  LayoutTemplate,
  MonitorPlay,
  Sparkles,
  TerminalSquare,
} from "lucide-react";

const pageUrl = "https://www.openlabs.org.in/computer-science/code-lab/html-css-js";
const launchUrl = "/labs/computer-science/code-lab/html-css-js";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Computer Science", href: "/computer-science" },
  { label: "Code Lab", href: "/computer-science/code-lab" },
  { label: "HTML CSS JS", href: "/computer-science/code-lab/html-css-js" },
];

export const metadata: Metadata = {
  title: "HTML CSS JavaScript Code Lab - Live Web Editor | OpenLabs",
  description:
    "Practice HTML, CSS, and JavaScript in a free online code lab with live preview, console output, and beginner-friendly front-end web development exercises.",
  keywords: [
    "HTML CSS JavaScript code lab",
    "HTML CSS JS editor",
    "online HTML CSS JavaScript compiler",
    "live preview web editor",
    "front-end development practice",
    "learn HTML CSS JavaScript",
    "interactive coding lab",
    "OpenLabs computer science lab",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "HTML CSS JavaScript Code Lab - Live Web Editor | OpenLabs",
    description:
      "Write HTML, style it with CSS, add JavaScript, and see the result instantly in the OpenLabs interactive web development lab.",
    url: pageUrl,
    siteName: "OpenLabs",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "OpenLabs HTML CSS JavaScript Code Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HTML CSS JavaScript Code Lab - Live Web Editor | OpenLabs",
    description:
      "Build and test web pages in a browser-based HTML, CSS, and JavaScript coding lab.",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
  },
};

const features = [
  {
    icon: FileCode2,
    title: "HTML structure",
    description:
      "Create semantic page sections, headings, links, buttons, forms, and reusable content blocks.",
  },
  {
    icon: LayoutTemplate,
    title: "CSS styling",
    description:
      "Experiment with colors, spacing, layout, responsive design, and visual polish in real time.",
  },
  {
    icon: Braces,
    title: "JavaScript behavior",
    description:
      "Add interaction, update the DOM, handle events, and test logic without leaving the lab.",
  },
  {
    icon: TerminalSquare,
    title: "Console feedback",
    description:
      "Inspect logs and errors quickly so debugging becomes part of the learning flow.",
  },
];

const learningObjectives = [
  "Understand how HTML, CSS, and JavaScript work together inside a browser.",
  "Build small web pages with semantic markup, styling, and interactive behavior.",
  "Preview code changes instantly and debug common syntax or runtime issues.",
  "Practice front-end development concepts before moving to larger projects.",
];

const useCases = [
  "School and college computer science practicals",
  "Beginner front-end web development practice",
  "HTML, CSS, and JavaScript classroom demonstrations",
  "Quick UI experiments, snippets, and interview warmups",
];

const faqs = [
  {
    question: "What is the HTML CSS JavaScript Code Lab?",
    answer:
      "It is a browser-based OpenLabs coding environment where learners can write HTML, CSS, and JavaScript, preview the web page instantly, and inspect console output.",
  },
  {
    question: "Do I need to install anything to use this web editor?",
    answer:
      "No installation is required. The lab runs in the browser, so students can practice front-end development from a modern desktop or tablet browser.",
  },
  {
    question: "Who should use this interactive coding lab?",
    answer:
      "It is useful for beginners learning web development, students completing computer science practicals, and teachers demonstrating how browser code works.",
  },
  {
    question: "Can I use it to learn JavaScript debugging?",
    answer:
      "Yes. The code lab includes console feedback so learners can test JavaScript output, notice errors, and improve their debugging habits.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "HTML CSS JavaScript Code Lab",
    description: metadata.description,
    url: pageUrl,
    learningResourceType: "Interactive coding lab",
    educationalLevel: "Beginner to Intermediate",
    teaches: ["HTML", "CSS", "JavaScript", "Front-end web development"],
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
        name: "Code Lab",
        item: "https://www.openlabs.org.in/computer-science/code-lab",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "HTML CSS JavaScript Code Lab",
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
              Computer Science Code Lab
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl">
              HTML CSS JavaScript Code Lab With Live Preview
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Learn front-end web development by writing HTML, styling it with CSS,
              and adding JavaScript behavior in one interactive OpenLabs workspace.
              Build, preview, test, and debug browser code instantly.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={launchUrl}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Launch Code Lab
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/computer-science/code-lab"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-6 py-3 text-base font-bold text-foreground transition hover:border-indigo-200 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                View All Code Labs
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
                Live Web Editor
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                {["index.html", "style.css", "script.js"].map((file, index) => (
                  <div
                    key={file}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-300">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                      {file}
                    </div>
                    <div className="space-y-2">
                      <span className="block h-2 w-11/12 rounded bg-indigo-300/60" />
                      <span className="block h-2 w-8/12 rounded bg-cyan-300/50" />
                      <span className="block h-2 w-10/12 rounded bg-emerald-300/50" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-white p-4 text-slate-900">
                <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <MonitorPlay className="h-4 w-4 text-indigo-600" />
                  Preview
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="mb-3 h-7 w-32 rounded bg-gradient-to-r from-indigo-600 to-cyan-500" />
                  <div className="space-y-2">
                    <span className="block h-2 w-full rounded bg-slate-200" />
                    <span className="block h-2 w-9/12 rounded bg-slate-200" />
                    <span className="block h-2 w-10/12 rounded bg-slate-200" />
                  </div>
                  <div className="mt-5 inline-flex rounded-md bg-slate-900 px-3 py-2 text-xs font-bold text-white">
                    Run JavaScript
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-slate-100 p-3 font-mono text-xs text-slate-600">
                  console.log("Ready to build")
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
              Learn by building
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground">
              A practical online HTML, CSS, and JavaScript editor for students
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              This code lab is designed for browser fundamentals: page structure,
              visual styling, DOM interaction, and debugging. It gives learners a
              focused workspace before they move into frameworks or full-stack apps.
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

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-2 lg:px-8">
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
            <MonitorPlay className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              How the interactive lab works
            </h2>
          </div>
          <p className="rounded-xl border border-border bg-card p-6 text-base leading-7 text-muted-foreground shadow-sm">
            Open the lab, write code in the HTML, CSS, and JavaScript panels, then
            run or preview the output. The browser renders your page and the console
            panel shows JavaScript logs or errors, making every edit visible and
            easier to understand.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            HTML CSS JavaScript Code Lab FAQs
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-1">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                name="htmlcssjs-faq"
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
              <h2 className="text-2xl font-black">Ready to practice web development?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Start with a blank page, test ideas quickly, and learn how browser
                code behaves through live feedback.
              </p>
            </div>
            <Link
              href={launchUrl}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-50 md:mt-0"
            >
              Open Interactive Editor
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
