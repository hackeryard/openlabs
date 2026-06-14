import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Code2,
  FileCode2,
  GitBranch,
  Globe2,
  MonitorPlay,
  Sparkles,
  TerminalSquare,
  TimerReset,
} from "lucide-react";

const pageUrl = "https://www.openlabs.org.in/computer-science/code-lab/js";
const launchUrl = "/labs/computer-science/code-lab/js";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Computer Science", href: "/computer-science" },
  { label: "Code Lab", href: "/computer-science/code-lab" },
  { label: "JavaScript", href: "/computer-science/code-lab/js" },
];

export const metadata: Metadata = {
  title: "JavaScript Code Lab - Event Loop Visualizer | OpenLabs",
  description:
    "Learn JavaScript with a free interactive code lab. Write JS, run examples, visualize the event loop, call stack, task queue, microtasks and console output.",
  keywords: [
    "JavaScript code lab",
    "JavaScript event loop visualizer",
    "online JavaScript editor",
    "learn JavaScript online",
    "JavaScript call stack visualizer",
    "microtask queue JavaScript",
    "interactive JavaScript debugger",
    "OpenLabs computer science lab",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "JavaScript Code Lab - Event Loop Visualizer | OpenLabs",
    description:
      "Practice JavaScript and visualize runtime behavior including the call stack, Web APIs, task queue, microtasks, and console output.",
    url: pageUrl,
    siteName: "OpenLabs",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "OpenLabs JavaScript Code Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JavaScript Code Lab - Event Loop Visualizer | OpenLabs",
    description:
      "Write JavaScript and watch the event loop, stack, queues, and output step by step.",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
  },
};

const features = [
  {
    icon: FileCode2,
    title: "JavaScript editor",
    description:
      "Write and modify JavaScript snippets directly in the browser with a focused coding workspace.",
  },
  {
    icon: BrainCircuit,
    title: "Runtime visualization",
    description:
      "See how JavaScript code moves through the call stack, Web APIs, queues, and output.",
  },
  {
    icon: TimerReset,
    title: "Event loop practice",
    description:
      "Understand promises, microtasks, callbacks, and setTimeout behavior through step-by-step flow.",
  },
  {
    icon: TerminalSquare,
    title: "Debugging feedback",
    description:
      "Inspect console behavior and execution order so asynchronous JavaScript becomes easier to reason about.",
  },
];

const learningObjectives = [
  "Understand how JavaScript executes synchronous and asynchronous code.",
  "Visualize the relationship between the call stack, task queue, microtask queue, and Web APIs.",
  "Practice promise chains, callbacks, setTimeout, and console output order.",
  "Build stronger debugging habits before moving into frameworks and full-stack projects.",
];

const useCases = [
  "JavaScript event loop classroom demonstrations",
  "Beginner programming and web development practice",
  "Interview preparation for async JavaScript concepts",
  "Computer science practicals on runtime behavior",
];

const faqs = [
  {
    question: "What is the JavaScript Code Lab?",
    answer:
      "It is an interactive OpenLabs coding environment where learners can write JavaScript and visualize runtime behavior such as the call stack, task queue, microtask queue, Web APIs, and console output.",
  },
  {
    question: "Can this lab help me understand the JavaScript event loop?",
    answer:
      "Yes. The lab is designed around event loop visualization, so learners can see how synchronous code, promises, callbacks, and timers execute in order.",
  },
  {
    question: "Do I need to install Node.js or any editor?",
    answer:
      "No installation is required. The JavaScript lab runs in the browser, making it useful for students, teachers, and self-learners.",
  },
  {
    question: "Who should use this JavaScript visualizer?",
    answer:
      "It is helpful for beginners learning JavaScript, students preparing for exams, and developers reviewing asynchronous JavaScript before interviews.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "JavaScript Code Lab",
    description: metadata.description,
    url: pageUrl,
    learningResourceType: "Interactive coding lab",
    educationalLevel: "Beginner to Intermediate",
    teaches: [
      "JavaScript",
      "Event loop",
      "Call stack",
      "Microtask queue",
      "Asynchronous programming",
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
        name: "Code Lab",
        item: "https://www.openlabs.org.in/computer-science/code-lab",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "JavaScript Code Lab",
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
              Computer Science Code Lab
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
              JavaScript Code Lab With Event Loop Visualizer
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Learn JavaScript by writing code and watching how it executes. Visualize
              the call stack, Web APIs, task queue, microtask queue, promises,
              timers, and console output in an interactive OpenLabs workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={launchUrl}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Launch JavaScript Lab
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/computer-science/code-lab"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-base font-bold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
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
                Event Loop Visualizer
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                  script.js
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="text-slate-400">console.log("1: Start");</div>
                  <div className="text-indigo-200">setTimeout(callback, 0);</div>
                  <div className="text-cyan-200">Promise.resolve().then(task);</div>
                  <div className="text-emerald-200">console.log("5: End");</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Call Stack", width: "w-9/12", color: "bg-indigo-300/70" },
                  { label: "Microtask Queue", width: "w-11/12", color: "bg-cyan-300/70" },
                  { label: "Task Queue", width: "w-7/12", color: "bg-emerald-300/70" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-300">
                      <GitBranch className="h-3.5 w-3.5 text-cyan-300" />
                      {item.label}
                    </div>
                    <span className={`block h-2 rounded ${item.width} ${item.color}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-white p-4 text-slate-900">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                <MonitorPlay className="h-4 w-4 text-indigo-600" />
                Console Output
              </div>
              <div className="rounded-lg bg-slate-100 p-3 font-mono text-xs leading-6 text-slate-700">
                1: Start<br />
                5: End<br />
                3: Promise 1<br />
                2: Timeout
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
              Learn by visualizing
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              A practical JavaScript editor for understanding async code
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              JavaScript can feel invisible when callbacks, promises, and timers run
              out of order. This lab turns execution into a visual flow so learners
              can connect code with runtime behavior.
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
            <MonitorPlay className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              How the interactive lab works
            </h2>
          </div>
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-base leading-7 text-slate-600 shadow-sm">
            Open the lab, edit the JavaScript example, and run the visualizer. The
            lab creates snapshots of the stack, queues, Web APIs, and console output
            so each step of execution becomes easier to inspect.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-950">
            JavaScript Code Lab FAQs
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-1">
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
              <h2 className="text-2xl font-black">Ready to visualize JavaScript?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Run code, inspect execution order, and make async JavaScript feel
                concrete through live runtime snapshots.
              </p>
            </div>
            <Link
              href={launchUrl}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-50 md:mt-0"
            >
              Open JavaScript Visualizer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
