import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Code2,
  FilePlus2,
  GitBranch,
  GitCommitHorizontal,
  GitMerge,
  Globe2,
  MonitorPlay,
  Sparkles,
  TerminalSquare,
} from "lucide-react";

const pageUrl = "https://www.openlabs.org.in/computer-science/git-simulator";
const launchUrl = "/labs/computer-science/git-simulator";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Computer Science", href: "/computer-science" },
  { label: "Git Simulator", href: "/computer-science/git-simulator" },
];

export const metadata: Metadata = {
  title: "Git Simulator - Learn Version Control Visually | OpenLabs",
  description:
    "Practice Git commands in a free interactive simulator. Learn git init, add, commit, branches, staging area, working directory and commit graph visually.",
  keywords: [
    "Git simulator",
    "learn Git online",
    "interactive Git tutorial",
    "Git commit visualizer",
    "Git branch simulator",
    "version control lab",
    "Git staging area",
    "OpenLabs computer science lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/git-simulator",
  },
  openGraph: {
    title: "Git Simulator - Learn Version Control Visually | OpenLabs",
    description:
      "Run Git commands and watch the working directory, staging area, refs, HEAD, and commit graph update in real time.",
    url: pageUrl,
    siteName: "OpenLabs",
    type: "website",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "OpenLabs Git Simulator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Git Simulator - Learn Version Control Visually | OpenLabs",
    description:
      "Practice Git commands and visualize repository state, staging, branches, and commits.",
    images: ["/images/twitter-image.svg"],
  },
};

const features = [
  {
    icon: TerminalSquare,
    title: "Command practice",
    description:
      "Type Git commands in a guided terminal and see how each command changes the repository.",
  },
  {
    icon: FilePlus2,
    title: "Working directory",
    description:
      "Understand file changes before staging, committing, and moving through a version control workflow.",
  },
  {
    icon: GitCommitHorizontal,
    title: "Commit graph",
    description:
      "Visualize commits as repository history so snapshots and branches become easier to reason about.",
  },
  {
    icon: GitBranch,
    title: "Branches and refs",
    description:
      "Learn HEAD, refs, and branches by watching them update as commands run.",
  },
];

const learningObjectives = [
  "Understand what happens during git init, add, commit, status, branch, and checkout.",
  "See the difference between the working directory, staging area, and committed history.",
  "Learn how HEAD, refs, and branches point to commits in a repository.",
  "Practice version control workflows before using Git on real projects.",
];

const useCases = [
  "Computer science Git practicals",
  "Beginner software development training",
  "Version control classroom demonstrations",
  "Interview and project workflow preparation",
];

const faqs = [
  {
    question: "What is the OpenLabs Git Simulator?",
    answer:
      "It is an interactive version control lab where learners run Git commands and see the repository state, staging area, refs, HEAD, and commit graph update visually.",
  },
  {
    question: "Can I learn Git without installing it?",
    answer:
      "Yes. The simulator runs in the browser, so beginners can practice core Git concepts before installing Git or working in a real repository.",
  },
  {
    question: "Which Git concepts does this lab teach?",
    answer:
      "The lab focuses on command flow, repository initialization, file changes, staging, commits, branches, refs, HEAD, and visual commit history.",
  },
  {
    question: "Who should use this Git visualizer?",
    answer:
      "It is useful for students, beginner developers, teachers, and anyone who wants to understand Git workflows through hands-on visual feedback.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Git Simulator",
    description: metadata.description,
    url: pageUrl,
    learningResourceType: "Interactive version control simulator",
    educationalLevel: "Beginner to Intermediate",
    teaches: [
      "Git",
      "Version control",
      "Commits",
      "Branches",
      "Staging area",
      "Repository history",
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
        name: "Git Simulator",
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
              Computer Science Version Control Lab
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl">
              Git Simulator for Visual Version Control Practice
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Learn Git by running commands and watching the repository change.
              Visualize the working directory, staging area, commits, refs, HEAD,
              branches, and commit graph in one interactive OpenLabs workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={launchUrl}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Launch Git Simulator
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
                Git Visualizer
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                  terminal
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="text-slate-400">$ git init</div>
                  <div className="text-indigo-200">$ git add index.html</div>
                  <div className="text-cyan-200">$ git commit -m "first commit"</div>
                  <div className="text-emerald-200">$ git branch feature-ui</div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Working Directory", width: "w-10/12", color: "bg-indigo-300/70" },
                  { label: "Staging Area", width: "w-8/12", color: "bg-cyan-300/70" },
                  { label: "HEAD -> main", width: "w-11/12", color: "bg-emerald-300/70" },
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
                Commit Graph
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-slate-100 p-4">
                <span className="h-3 w-3 rounded-full bg-indigo-600" />
                <span className="h-0.5 w-12 bg-slate-300" />
                <span className="h-3 w-3 rounded-full bg-cyan-500" />
                <span className="h-0.5 w-12 bg-slate-300" />
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="ml-auto rounded bg-slate-900 px-2 py-1 font-mono text-xs text-white">
                  main
                </span>
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
              Learn by commanding
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground">
              A practical Git visualizer for understanding repository state
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Git becomes easier when each command has visible consequences. This
              simulator turns command-line version control into a clear flow across
              files, staging, commits, refs, branches, and history.
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
            <GitMerge className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              How the interactive lab works
            </h2>
          </div>
          <p className="rounded-xl border border-border bg-card p-6 text-base leading-7 text-muted-foreground shadow-sm">
            Open the simulator, run a Git command, and review the output. The lab
            updates the repository panel and commit graph so you can understand what
            changed after each command.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            Git Simulator FAQs
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-1">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                name="git-faq"
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
              <h2 className="text-2xl font-black">Ready to practice Git visually?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Run commands, inspect repository state, and understand version
                control before using Git on real projects.
              </p>
            </div>
            <Link
              href={launchUrl}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-50 md:mt-0"
            >
              Open Git Simulator
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
