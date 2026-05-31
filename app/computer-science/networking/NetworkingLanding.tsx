import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Binary,
  CheckCircle2,
  ChevronRight,
  GitBranch,
  Globe2,
  Layers3,
  MonitorPlay,
  Network,
  Router,
  Route,
  Server,
  Sparkles,
  Wifi,
} from "lucide-react";
import type { NetworkingContent } from "./networkingContent";

type Props = {
  content: NetworkingContent;
};

function buildJsonLd(content: NetworkingContent) {
  const pageUrl = `https://www.openlabs.org.in/computer-science/networking/${content.slug}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      name: `${content.name} Simulator`,
      description: content.metaDescription,
      url: pageUrl,
      learningResourceType: "Interactive networking simulator",
      educationalLevel: "Beginner to Intermediate",
      teaches: [
        content.name,
        "Computer networking",
        "Network architecture",
        "Data communication",
        "Network simulation",
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
          name: "Networking",
          item: "https://www.openlabs.org.in/computer-science/networking",
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

function TopicVisual({ content }: Props) {
  if (content.visual === "osi") {
    const layers = ["Application", "Presentation", "Session", "Transport", "Network", "Data Link", "Physical"];
    return (
      <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-300">
            <Layers3 className="h-3.5 w-3.5 text-cyan-300" />
            OSI Stack
          </div>
          <div className="space-y-2">
            {layers.map((layer, index) => (
              <div
                key={layer}
                className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-xs font-bold text-slate-900"
              >
                <span>L{7 - index}</span>
                <span>{layer}</span>
              </div>
            ))}
          </div>
        </div>
        <VisualSteps content={content} />
      </div>
    );
  }

  if (content.visual === "packet") {
    return (
      <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-300">
            <Router className="h-3.5 w-3.5 text-cyan-300" />
            Packet Routes
          </div>
          <div className="relative h-48 overflow-hidden rounded-lg bg-white/[0.04]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 260 190" preserveAspectRatio="none">
              <polyline points="28,96 92,38 160,72 232,42" fill="none" stroke="rgba(103,232,249,0.55)" strokeWidth="3" />
              <polyline points="28,96 98,144 168,122 232,42" fill="none" stroke="rgba(129,140,248,0.55)" strokeWidth="3" />
              <polyline points="28,96 112,92 176,92 232,42" fill="none" stroke="rgba(52,211,153,0.45)" strokeWidth="3" />
            </svg>
            {[
              ["left-5 top-[82px] bg-indigo-300", "S"],
              ["left-[84px] top-7 bg-cyan-300", "R1"],
              ["left-[92px] bottom-8 bg-cyan-300", "R2"],
              ["right-5 top-8 bg-emerald-300", "D"],
            ].map(([cls, label]) => (
              <span key={label} className={`absolute z-10 flex h-11 w-11 items-center justify-center rounded-full text-xs font-black text-slate-950 ${cls}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
        <VisualSteps content={content} />
      </div>
    );
  }

  if (content.visual === "topology") {
    return (
      <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-300">
            <Network className="h-3.5 w-3.5 text-cyan-300" />
            Star Topology
          </div>
          <div className="relative h-48 overflow-hidden rounded-lg bg-white/[0.04]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 260 190" preserveAspectRatio="none">
              {[[130, 94, 42, 32], [130, 94, 218, 32], [130, 94, 42, 154], [130, 94, 218, 154], [130, 94, 130, 28], [130, 94, 130, 162]].map(([x1, y1, x2, y2], index) => (
                <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              ))}
            </svg>
            <span className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-indigo-300 text-xs font-black text-slate-950">
              Switch
            </span>
            {[
              "left-7 top-5",
              "right-7 top-5",
              "left-7 bottom-5",
              "right-7 bottom-5",
              "left-1/2 top-2 -translate-x-1/2",
              "left-1/2 bottom-2 -translate-x-1/2",
            ].map((cls, index) => (
              <span key={index} className={`absolute z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cyan-300 text-xs font-black text-slate-950 ${cls}`}>
                PC
              </span>
            ))}
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
          <Wifi className="h-3.5 w-3.5 text-cyan-300" />
          Reserved Circuit
        </div>
        <div className="relative h-48 overflow-hidden rounded-lg bg-white/[0.04]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 260 190" preserveAspectRatio="none">
            <polyline points="28,96 86,52 140,92 198,52 232,96" fill="none" stroke="rgba(52,211,153,0.72)" strokeWidth="5" />
            <polyline points="28,96 86,138 140,102 198,138 232,96" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
          </svg>
          {[
            ["left-5 top-[78px] bg-indigo-300", "A"],
            ["left-[76px] top-9 bg-cyan-300", "N1"],
            ["left-[122px] top-[78px] bg-cyan-300", "N2"],
            ["right-[44px] top-9 bg-cyan-300", "N3"],
            ["right-5 top-[78px] bg-emerald-300", "B"],
          ].map(([cls, label]) => (
            <span key={label} className={`absolute z-10 flex h-11 w-11 items-center justify-center rounded-full text-xs font-black text-slate-950 ${cls}`}>
              {label}
            </span>
          ))}
        </div>
      </div>
      <VisualSteps content={content} />
    </div>
  );
}

export default function NetworkingLanding({ content }: Props) {
  const launchUrl = `/labs/computer-science/networking/${content.slug}`;
  const pageUrl = `/computer-science/networking/${content.slug}`;
  const jsonLd = buildJsonLd(content);
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Computer Science", href: "/computer-science" },
    { label: "Networking", href: "/computer-science/networking" },
    { label: content.shortName, href: pageUrl },
  ];

  return (
    <main className="min-h-screen bg-[#fafafa] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {jsonLd.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <section className="relative border-b border-slate-200 bg-white">
        <nav aria-label="Breadcrumb" className="absolute left-0 right-0 top-5 mx-auto max-w-6xl px-6 lg:px-8">
          <ol className="flex flex-wrap items-center gap-1 text-xs font-semibold text-slate-500">
            {breadcrumbs.map((breadcrumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={breadcrumb.href} className="flex items-center gap-1">
                  {isLast ? (
                    <span className="text-slate-800" aria-current="page">{breadcrumb.label}</span>
                  ) : (
                    <Link href={breadcrumb.href} className="transition hover:text-indigo-700">{breadcrumb.label}</Link>
                  )}
                  {!isLast && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-20 lg:px-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
              <Server className="h-4 w-4" />
              Computer Science Networking Lab
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
              {content.name} Interactive Simulator
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {content.heroDescription} Learn the concept, data flow, network
              behavior, and practical tradeoffs through a focused OpenLabs
              interactive networking lab.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={launchUrl} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
                Launch {content.shortName} Lab
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/computer-science/networking" className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-base font-bold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
                View All Networking Labs
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
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Network Visualizer</span>
            </div>
            <div className="mb-4 rounded-lg bg-white p-3 text-center font-mono text-xs font-bold text-slate-900">
              {content.focus}
            </div>
            <TopicVisual content={content} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div className="grid gap-5 md:grid-cols-4">
          {[
            { icon: Network, title: "Concept", description: content.definition },
            { icon: Route, title: "Flow", description: content.behavior },
            { icon: Binary, title: "Focus", description: content.focus },
            { icon: MonitorPlay, title: "Simulation", description: "Interact with the visual lab and connect theory with observable network behavior." },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
                <Icon className="mb-4 h-6 w-6 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">Learn by simulating</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Understand {content.shortName} through interactive network behavior
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {content.behavior} The lab makes the invisible movement of data,
              paths, layers, and links easier to inspect step by step.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.learningObjectives.map((objective) => (
              <div key={objective} className="flex gap-3 rounded-lg bg-slate-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-500" />
                <p className="text-sm font-medium leading-6 text-slate-700">{objective}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-2 lg:px-8">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <Globe2 className="h-6 w-6 text-cyan-600" />
            <h2 className="text-2xl font-black tracking-tight text-slate-950">Where this lab helps</h2>
          </div>
          <ul className="space-y-3">
            {content.useCases.map((useCase) => (
              <li key={useCase} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                {useCase}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-5 flex items-center gap-3">
            <GitBranch className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-black tracking-tight text-slate-950">How the interactive lab works</h2>
          </div>
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-base leading-7 text-slate-600 shadow-sm">
            Open the {content.shortName} lab, interact with the simulation controls,
            and watch the visual network state update. Use the animation to trace
            paths, layers, packets, links, or topology changes.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-950">{content.shortName} FAQs</h2>
          <div className="mt-8 grid grid-cols-1 gap-4">
            {content.faqs.map((faq) => (
              <details key={faq.question} className="group overflow-hidden rounded-xl border border-slate-200 bg-[#fafafa] shadow-sm transition-all duration-300 open:border-indigo-200 open:bg-white open:shadow-md open:shadow-indigo-950/5">
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
              <h2 className="text-2xl font-black">Ready to explore {content.shortName}?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Launch the visualizer and turn computer networking theory into a
                hands-on learning path.
              </p>
            </div>
            <Link href={launchUrl} className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-50 md:mt-0">
              Open {content.shortName} Simulator
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
