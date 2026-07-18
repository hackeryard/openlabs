import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Binary,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  CircuitBoard,
  Cpu,
  GitBranch,
  MonitorPlay,
  ToggleLeft,
  Zap,
} from "lucide-react";
import type { LogicGateContent } from "./gateContent";

type Props = {
  gate: LogicGateContent;
};

function buildJsonLd(gate: LogicGateContent) {
  const pageUrl = `https://www.openlabs.org.in/computer-science/logic-gates/${gate.slug}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      name: `${gate.name} Simulator`,
      description: gate.metaDescription,
      url: pageUrl,
      learningResourceType: "Interactive logic gate simulator",
      educationalLevel: "Beginner to Intermediate",
      teaches: [
        gate.name,
        "Truth tables",
        "Boolean algebra",
        "Digital logic",
        "Computer science fundamentals",
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
          name: "Logic Gates",
          item: "https://www.openlabs.org.in/computer-science/logic-gates",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: gate.name,
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: gate.faqs.map((faq) => ({
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

export default function LogicGateLanding({ gate }: Props) {
  const launchUrl = `/labs/computer-science/logic-gates/${gate.slug}`;
  const pageUrl = `/computer-science/logic-gates/${gate.slug}`;
  const jsonLd = buildJsonLd(gate);
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Computer Science", href: "/computer-science" },
    { label: "Logic Gates", href: "/computer-science/logic-gates" },
    { label: gate.name, href: pageUrl },
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
              <CircuitBoard className="h-4 w-4" />
              Computer Science Logic Gates
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl">
              {gate.name} Simulator With Truth Table
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              {gate.heroDescription} Learn the Boolean expression, input-output
              behavior, and digital circuit logic through a focused OpenLabs
              interactive simulator.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={launchUrl}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Launch {gate.shortName} Gate Lab
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/computer-science/logic-gates"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-6 py-3 text-base font-bold text-foreground transition hover:border-indigo-200 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                View All Logic Gates
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
                Logic Gate Lab
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Zap className="h-3.5 w-3.5 text-cyan-300" />
                  {gate.shortName} Gate
                </div>
                <div className="flex min-h-40 items-center justify-center">
                  <div className="relative flex h-28 w-full max-w-56 items-center">
                    <div className="absolute left-0 top-8 h-0.5 w-16 bg-indigo-300" />
                    <div className="absolute left-0 bottom-8 h-0.5 w-16 bg-cyan-300" />
                    <div className="mx-auto flex h-24 w-28 items-center justify-center rounded-r-full rounded-l-lg border-2 border-indigo-300 bg-indigo-300/10 text-xl font-black text-white">
                      {gate.shortName}
                    </div>
                    <div className="absolute right-0 top-1/2 h-0.5 w-16 -translate-y-1/2 bg-emerald-300" />
                  </div>
                </div>
                <div className="rounded-lg bg-white p-3 text-center font-mono text-sm font-bold text-slate-900">
                  {gate.formula}
                </div>
              </div>

              <div className="rounded-lg bg-white p-4 text-slate-900">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Binary className="h-4 w-4 text-indigo-600" />
                  Truth Table
                </div>
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="w-full text-center text-sm">
                    <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                      <tr>
                        {gate.truthRows[0].input === undefined ? (
                          <>
                            <th className="px-3 py-2">A</th>
                            <th className="px-3 py-2">B</th>
                          </>
                        ) : (
                          <th className="px-3 py-2">Input</th>
                        )}
                        <th className="px-3 py-2">Output</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono font-bold">
                      {gate.truthRows.map((row) => (
                        <tr key={`${row.a ?? row.input}-${row.b ?? "single"}`}>
                          {row.input === undefined ? (
                            <>
                              <td className="px-3 py-2">{row.a}</td>
                              <td className="px-3 py-2">{row.b}</td>
                            </>
                          ) : (
                            <td className="px-3 py-2">{row.input}</td>
                          )}
                          <td className="px-3 py-2 text-indigo-700">
                            {row.output}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 rounded-lg bg-slate-100 p-3 text-xs leading-5 text-slate-600">
                  Toggle the inputs in the lab to watch this table become live
                  circuit behavior.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div className="grid gap-5 md:grid-cols-4">
          {[
            {
              icon: BookOpenCheck,
              title: "Gate theory",
              description: gate.definition,
            },
            {
              icon: ToggleLeft,
              title: "Input switching",
              description:
                "Change binary inputs and observe how the output responds in real time.",
            },
            {
              icon: Binary,
              title: "Truth table",
              description:
                "Map every possible input combination to the correct digital output.",
            },
            {
              icon: Cpu,
              title: "Circuit logic",
              description:
                "Connect Boolean algebra with the digital building blocks used inside computers.",
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
              Learn by simulating
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground">
              Understand {gate.shortName} gate logic through live input-output
              behavior
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {gate.behavior} The simulator helps students connect symbols,
              Boolean expressions, truth tables, and circuit output without needing
              physical hardware.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {gate.learningObjectives.map((objective) => (
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
            <GitBranch className="h-6 w-6 text-cyan-600" />
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              Where this gate is used
            </h2>
          </div>
          <ul className="space-y-3">
            {gate.useCases.map((useCase) => (
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
            Open the {gate.shortName} gate lab, toggle the binary input controls,
            and watch the output update immediately. The visual circuit and truth
            table make each Boolean result easier to verify.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            {gate.name} FAQs
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-1">
            {gate.faqs.map((faq) => (
              <details
                key={faq.question}
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
                Ready to test the {gate.shortName} gate?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Toggle inputs, verify the truth table, and build confidence with
                digital logic through a live OpenLabs simulator.
              </p>
            </div>
            <Link
              href={launchUrl}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-50 md:mt-0"
            >
              Open {gate.shortName} Gate Simulator
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
