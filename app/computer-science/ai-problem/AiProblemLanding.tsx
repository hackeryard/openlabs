import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Binary,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  GitBranch,
  Goal,
  MonitorPlay,
  Network,
  Route,
  Search,
  Sparkles,
} from "lucide-react";
import type { AiProblemContent } from "./aiProblemContent";

type Props = {
  content: AiProblemContent;
};

function buildJsonLd(content: AiProblemContent) {
  const pageUrl = `https://www.openlabs.org.in/computer-science/ai-problem/${content.slug}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      name: `${content.name} Visualizer`,
      description: content.metaDescription,
      url: pageUrl,
      learningResourceType: "Interactive AI problem visualizer",
      educationalLevel: "Beginner to Intermediate",
      teaches: [
        content.name,
        "Artificial intelligence",
        "Search algorithms",
        "State representation",
        "Problem solving",
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
          name: "AI Problems",
          item: "https://www.openlabs.org.in/computer-science/ai-problem",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: content.name,
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];
}

function ProblemVisual({ content }: Props) {
  if (content.visualKind === "constraint") {
    return (
      <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-300">
            <Network className="h-3.5 w-3.5 text-cyan-300" />
            Constraint Graph
          </div>
          <div className="relative h-44">
            {[
              ["A", "left-4 top-8 bg-indigo-400"],
              ["B", "right-8 top-4 bg-cyan-300"],
              ["C", "left-20 bottom-8 bg-emerald-300"],
              ["D", "right-4 bottom-10 bg-amber-300"],
            ].map(([label, cls]) => (
              <span
                key={label}
                className={`absolute flex h-12 w-12 items-center justify-center rounded-full font-black text-slate-950 ${cls}`}
              >
                {label}
              </span>
            ))}
            <span className="absolute left-16 top-14 h-0.5 w-32 rotate-[-9deg] bg-white/20" />
            <span className="absolute left-20 bottom-16 h-0.5 w-40 rotate-[-3deg] bg-white/20" />
            <span className="absolute right-10 top-16 h-24 w-0.5 rotate-[-12deg] bg-white/20" />
          </div>
        </div>
        <VisualSteps content={content} />
      </div>
    );
  }

  if (content.visualKind === "forward-backward") {
    return (
      <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-300">
            <GitBranch className="h-3.5 w-3.5 text-cyan-300" />
            Inference Chain
          </div>
          <div className="space-y-3">
            {["Fact: A", "Rule: A -> B", "Rule: B -> Goal", "Goal proven"].map((item, index) => (
              <div key={item} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-300 text-xs font-black text-slate-950">
                  {index + 1}
                </span>
                <span className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
        <VisualSteps content={content} />
      </div>
    );
  }

  if (content.visualKind === "hangman") {
    return (
      <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-300">
            <Search className="h-3.5 w-3.5 text-cyan-300" />
            Word State
          </div>
          <div className="mb-5 flex gap-2">
            {["A", "_", "G", "E", "N", "T"].map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="flex h-12 w-10 items-center justify-center rounded-md bg-white text-lg font-black text-slate-950"
              >
                {letter}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {["R", "S", "L", "P", "T", "N"].map((letter) => (
              <span key={letter} className="rounded-full bg-indigo-300/20 px-3 py-1 text-xs font-bold text-indigo-100">
                {letter}
              </span>
            ))}
          </div>
        </div>
        <VisualSteps content={content} />
      </div>
    );
  }

  if (content.visualKind === "hill-climb") {
    return (
      <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-300">
            <Goal className="h-3.5 w-3.5 text-cyan-300" />
            Heuristic Landscape
          </div>
          <div className="flex h-44 items-end justify-center gap-2">
            {[32, 54, 72, 64, 92, 70, 58].map((height, index) => (
              <span
                key={index}
                className={`w-8 rounded-t ${index === 4 ? "bg-emerald-300" : "bg-indigo-300/70"}`}
                style={{ height }}
              />
            ))}
          </div>
        </div>
        <VisualSteps content={content} />
      </div>
    );
  }

  if (content.visualKind === "maze-qlearn") {
    return (
      <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-300">
            <Route className="h-3.5 w-3.5 text-cyan-300" />
            Q-Learning Maze
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, index) => {
              const isWall = [6, 7, 12, 17].includes(index);
              const isAgent = index === 20;
              const isGoal = index === 4;
              return (
                <span
                  key={index}
                  className={`flex h-8 items-center justify-center rounded ${isWall ? "bg-slate-700" : "bg-white/10"} ${isGoal ? "bg-emerald-300 text-slate-950" : ""} ${isAgent ? "bg-indigo-300 text-slate-950" : ""}`}
                >
                  {isAgent ? "A" : isGoal ? "G" : ""}
                </span>
              );
            })}
          </div>
        </div>
        <VisualSteps content={content} />
      </div>
    );
  }

  if (content.visualKind === "monkey-banana") {
    return (
      <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-300">
            <Goal className="h-3.5 w-3.5 text-cyan-300" />
            Planning State
          </div>
          <div className="relative h-44 rounded-lg bg-white/[0.04]">
            <span className="absolute right-10 top-4 rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-slate-950">
              Banana
            </span>
            <span className="absolute left-8 bottom-5 rounded-lg bg-indigo-300 px-3 py-2 text-sm font-black text-slate-950">
              Monkey
            </span>
            <span className="absolute left-32 bottom-5 rounded-md bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950">
              Box
            </span>
            <span className="absolute bottom-3 left-4 right-4 h-0.5 bg-white/20" />
          </div>
        </div>
        <VisualSteps content={content} />
      </div>
    );
  }

  if (content.visualKind === "neural-network") {
    return (
      <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-300">
            <BrainCircuit className="h-3.5 w-3.5 text-cyan-300" />
            Neural Architecture &amp; Synapses
          </div>
          <div className="flex h-40 items-center justify-between px-3">
            {/* Input layer */}
            <div className="flex flex-col gap-6">
              {[1, 2].map((n) => (
                <div key={`in-${n}`} className="h-8 w-8 rounded-full border-2 border-cyan-400 bg-cyan-500/20 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-200">
                  x{n}
                </div>
              ))}
            </div>
            {/* Hidden layer */}
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((n) => (
                <div key={`h-${n}`} className="h-8 w-8 rounded-full border-2 border-indigo-400 bg-indigo-500/20 flex items-center justify-center text-[10px] font-mono font-bold text-indigo-200">
                  h{n}
                </div>
              ))}
            </div>
            {/* Output layer */}
            <div className="flex flex-col">
              <div className="h-8 w-8 rounded-full border-2 border-emerald-400 bg-emerald-500/20 flex items-center justify-center text-[10px] font-mono font-bold text-emerald-200">
                ŷ
              </div>
            </div>
          </div>
          <div className="mt-1 text-center font-mono text-[10px] text-slate-400">
            Loss: 0.042 &bull; Acc: 98.4%
          </div>
        </div>
        <VisualSteps content={content} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-300">
          <Binary className="h-3.5 w-3.5 text-cyan-300" />
          Jug State
        </div>
        <div className="flex h-44 items-end justify-center gap-8">
          {[
            ["3L", "70%"],
            ["5L", "44%"],
          ].map(([label, height]) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="flex h-32 w-16 items-end overflow-hidden rounded-b-xl border-2 border-cyan-200/70">
                <span className="block w-full bg-gradient-to-t from-cyan-400 to-indigo-300" style={{ height }} />
              </div>
              <span className="text-xs font-bold text-slate-300">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <VisualSteps content={content} />
    </div>
  );
}

function VisualSteps({ content }: Props) {
  return (
    <div className="space-y-3">
      {content.visualSteps.map((step, index) => (
        <div key={step} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-300">
            <Route className="h-3.5 w-3.5 text-cyan-300" />
            Step {index + 1}
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            <span className="text-sm font-semibold text-white">{step}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AiProblemLanding({ content }: Props) {
  const launchUrl = `/labs/computer-science/ai-problem/${content.slug}`;
  const pageUrl = `/computer-science/ai-problem/${content.slug}`;
  const jsonLd = buildJsonLd(content);
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Computer Science", href: "/computer-science" },
    { label: "AI Problems", href: "/computer-science/ai-problem" },
    { label: content.shortName, href: pageUrl },
  ];

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
                    <Link href={breadcrumb.href} className="transition hover:text-indigo-700">
                      {breadcrumb.label}
                    </Link>
                  )}
                  {!isLast && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-20 lg:px-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
              <BrainCircuit className="h-4 w-4" />
              Computer Science AI Problem Lab
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl">
              {content.name} Interactive Visualizer
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              {content.heroDescription} Learn the model, state transitions, search
              behavior, and practical AI reasoning flow through an OpenLabs
              interactive simulator.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={launchUrl}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Launch {content.shortName} Lab
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/computer-science/ai-problem"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-6 py-3 text-base font-bold text-foreground transition hover:border-indigo-200 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                View All AI Problems
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
                AI Visualizer
              </span>
            </div>
            <div className="mb-4 rounded-lg bg-white p-3 text-center font-mono text-xs font-bold text-slate-900">
              {content.modelFocus}
            </div>
            <ProblemVisual content={content} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div className="grid gap-5 md:grid-cols-4">
          {[
            { icon: BrainCircuit, title: "AI concept", description: content.definition },
            { icon: Route, title: "Reasoning flow", description: content.behavior },
            { icon: Network, title: "Model focus", description: content.modelFocus },
            {
              icon: Search,
              title: "Visualization",
              description: "Trace each state, decision, or rule step through an interactive learning flow.",
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
              >
                <Icon className="mb-4 h-6 w-6 text-indigo-600" />
                <h2 className="text-lg font-bold text-foreground">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Learn by simulating
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground">
              Understand {content.shortName} with step-by-step AI reasoning
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {content.behavior} The lab turns abstract AI problem solving into a
              visible sequence of states, decisions, and results.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.learningObjectives.map((objective) => (
              <div key={objective} className="flex gap-3 rounded-lg bg-muted p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-500" />
                <p className="text-sm font-medium leading-6 text-foreground">{objective}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-2 lg:px-8">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <GitBranch className="h-6 w-6 text-cyan-600" />
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              Where this AI concept is used
            </h2>
          </div>
          <ul className="space-y-3">
            {content.useCases.map((useCase) => (
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
            Open the {content.shortName} lab, adjust the problem inputs, and follow
            how the visualizer updates each state or inference step. Use it to
            compare AI theory with observable behavior.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            {content.shortName} FAQs
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-1">
            {content.faqs.map((faq) => (
              <details
                key={faq.question}
                name="ai-faq"
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
              <h2 className="text-2xl font-black">Ready to explore {content.shortName}?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Launch the visualizer and turn AI search, reasoning, and planning
                into a clear hands-on learning path.
              </p>
            </div>
            <Link
              href={launchUrl}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-50 md:mt-0"
            >
              Open {content.shortName} Visualizer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
