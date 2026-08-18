import React from "react";
import Link from "next/link";
import SubtopicCardExplorer, { SubtopicCard } from "./SubtopicCardExplorer";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Activity,
  CheckCircle2,
  FileSpreadsheet,
  LucideIcon,
  Layers,
} from "lucide-react";

export type { SubtopicCard };

export type HowToStep = {
  step: number;
  title: string;
  desc: string;
};

export type ScientificPrinciple = {
  domain: string;
  laws: string;
  formulas: string;
  solver: string;
};

export type SubtopicFeature = {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
};

export type SubtopicCurriculum = {
  heading?: string;
  description: string;
  secondaryText?: string;
  telemetryTitle?: string;
  telemetryDesc?: string;
};

export type SubtopicFAQ = {
  q: string;
  a: string;
};

export type SubtopicHubProps = {
  subjectName: string;
  subjectSlug: string;
  subtopicTitle: string;
  subtopicSubtitle: string;
  badgeText?: string;
  badgeIcon?: LucideIcon;
  themeColor: "indigo" | "purple" | "emerald" | "rose" | "amber" | "teal" | "blue";
  cards: SubtopicCard[];
  howToHeading?: string;
  howToSteps: HowToStep[];
  principlesHeading?: string;
  principlesDesc?: string;
  scientificPrinciples: ScientificPrinciple[];
  features?: SubtopicFeature[];
  curriculum?: SubtopicCurriculum;
  faqs: SubtopicFAQ[];
  canonicalUrl: string;
};

export default function SubtopicHubLayout({
  subjectName,
  subjectSlug,
  subtopicTitle,
  subtopicSubtitle,
  badgeText = "Interactive Module Suite",
  badgeIcon: BadgeIcon = Layers,
  themeColor = "purple",
  cards,
  howToHeading,
  howToSteps,
  principlesHeading = "Computational & Theoretical Foundations",
  principlesDesc = "Continuous analytical models and real-time execution engines powering this subtopic.",
  scientificPrinciples,
  features,
  curriculum,
  faqs,
  canonicalUrl,
}: SubtopicHubProps) {
  const themeGradientMap: Record<string, string> = {
    indigo: "from-indigo-600 via-blue-600 to-cyan-600",
    purple: "from-purple-600 via-indigo-600 to-blue-600",
    emerald: "from-emerald-600 via-teal-600 to-cyan-600",
    rose: "from-rose-600 via-emerald-600 to-teal-600",
    amber: "from-amber-600 via-indigo-600 to-teal-600",
    teal: "from-teal-600 via-cyan-600 to-blue-600",
    blue: "from-blue-600 via-indigo-600 to-violet-600",
  };

  const themeTextMap: Record<string, string> = {
    indigo: "text-indigo-600 dark:text-indigo-400",
    purple: "text-purple-600 dark:text-purple-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    rose: "text-rose-600 dark:text-rose-400",
    amber: "text-amber-600 dark:text-amber-400",
    teal: "text-teal-600 dark:text-teal-400",
    blue: "text-blue-600 dark:text-blue-400",
  };

  const themeGlowMap: Record<string, string> = {
    indigo: "bg-indigo-500/5",
    purple: "bg-purple-500/5",
    emerald: "bg-emerald-500/5",
    rose: "bg-rose-500/5",
    amber: "bg-amber-500/5",
    teal: "bg-teal-500/5",
    blue: "bg-blue-500/5",
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: `${subtopicTitle} - ${subjectName} Virtual Labs`,
    description: subtopicSubtitle,
    inLanguage: "en",
    about: {
      "@type": "Thing",
      name: subtopicTitle,
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://www.openlabs.org.in/#website",
      name: "OpenLabs",
      url: "https://www.openlabs.org.in/",
    },
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: cards.map((card, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.openlabs.org.in${card.href}`,
      name: card.title,
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howToHeading || `How to Explore ${subtopicTitle} on OpenLabs`,
    description: `Step-by-step procedure to interact with ${subtopicTitle} simulations and collect experimental data.`,
    step: howToSteps.map((s) => ({
      "@type": "HowToStep",
      position: s.step,
      name: s.title,
      text: s.desc,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
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
        name: subjectName,
        item: `https://www.openlabs.org.in/${subjectSlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: subtopicTitle,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main
        id="main-content"
        className="min-h-screen text-foreground pb-20 pt-8 font-sans relative overflow-hidden bg-[radial-gradient(hsl(var(--border))_1.5px,transparent_1.5px)] bg-[size:24px_24px]"
      >
        {/* Ambient glow blobs */}
        <div className={`absolute top-12 left-1/4 h-[400px] w-[400px] rounded-full ${themeGlowMap[themeColor]} blur-[90px] pointer-events-none`} />
        <div className={`absolute bottom-20 right-1/4 h-[500px] w-[500px] rounded-full ${themeGlowMap[themeColor]} blur-[120px] pointer-events-none`} />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition font-medium">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={`/${subjectSlug}`} className="hover:text-foreground transition font-medium">
              {subjectName}
            </Link>
            <span aria-hidden="true">/</span>
            <span className={`${themeTextMap[themeColor]} font-bold`}>{subtopicTitle}</span>
          </nav>

          {/* Hero */}
          <header className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider shadow-sm">
                  <BadgeIcon className={`h-3.5 w-3.5 ${themeTextMap[themeColor]} animate-pulse`} aria-hidden="true" />
                  {badgeText}
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight leading-none">
                  {subtopicTitle}{" "}
                  <span className={`bg-gradient-to-r ${themeGradientMap[themeColor]} bg-clip-text text-transparent drop-shadow-sm`}>
                    Visualizer
                  </span>
                </h1>

                <p className="text-muted-foreground text-base md:text-lg font-medium max-w-2xl leading-relaxed">
                  {subtopicSubtitle}
                </p>
              </div>

              {/* Stats pills */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl px-5 py-3 shadow-sm">
                  <span className="text-2xl font-black text-foreground">{cards.length}</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">interactive labs</span>
                </div>
              </div>
            </div>
          </header>

          {/* Search & Cards Explorer (Client Component) */}
          <SubtopicCardExplorer
            cards={cards}
            themeColor={themeColor}
            subtopicTitle={subtopicTitle}
          />

          {/* Value Features Grid */}
          {features && features.length > 0 && (
            <section className="mb-16" aria-labelledby="subtopic-features-heading">
              <h2 id="subtopic-features-heading" className="sr-only">Subtopic features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.title}
                      className="group bg-card/80 backdrop-blur-sm border border-border/60 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="h-11 w-11 rounded-2xl border bg-primary/10 text-primary border-primary/20 flex items-center justify-center mb-5 shadow-sm transition">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="text-base font-extrabold text-foreground tracking-tight mb-2">
                        {f.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        {f.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* SEO / AEO Section: Step-by-Step Practical Methodology */}
          {howToSteps && howToSteps.length > 0 && (
            <section
              aria-labelledby="subtopic-howto-heading"
              className="bg-card/90 backdrop-blur-sm border border-border/80 rounded-3xl p-8 lg:p-10 shadow-sm mb-16 relative overflow-hidden"
            >
              <div className="space-y-4 max-w-3xl mb-8">
                <div className={`inline-flex items-center gap-2 ${themeTextMap[themeColor]} font-bold uppercase tracking-wider text-xs`}>
                  <Activity className="h-4 w-4 animate-pulse" aria-hidden="true" />
                  Investigation Protocol
                </div>
                <h2 id="subtopic-howto-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  {howToHeading || `How to Explore ${subtopicTitle} Interactively`}
                </h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                  Follow this standardized experimental methodology to configure parameters, simulate processes, and record scientific telemetry.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {howToSteps.map((item) => (
                  <div
                    key={item.step}
                    className="bg-muted/50 border border-border/70 rounded-2xl p-5 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-primary text-primary-foreground font-black text-xs shadow-sm">
                        {item.step}
                      </span>
                      <h3 className="font-extrabold text-foreground text-sm tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold ${themeTextMap[themeColor]} pt-2 border-t border-border/40`}>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Scientific Protocol</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* GEO Section: Governing Principles & Numerical Solvers */}
          {scientificPrinciples && scientificPrinciples.length > 0 && (
            <section
              aria-labelledby="subtopic-principles-heading"
              className="bg-card border border-border/80 rounded-3xl p-8 lg:p-10 shadow-sm mb-16 overflow-hidden"
            >
              <div className="space-y-3 mb-8">
                <div className={`inline-flex items-center gap-2 ${themeTextMap[themeColor]} font-bold uppercase tracking-wider text-xs`}>
                  <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
                  Computational Foundations
                </div>
                <h2 id="subtopic-principles-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  {principlesHeading}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-3xl">
                  {principlesDesc}
                </p>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/60 text-foreground font-black uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4 rounded-l-xl">Module / Domain</th>
                      <th className="py-3 px-4">Governing Principles</th>
                      <th className="py-3 px-4">Core Mathematical Formulas</th>
                      <th className="py-3 px-4 rounded-r-xl">Active Engine / Solver</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-medium text-muted-foreground">
                    {scientificPrinciples.map((sp) => (
                      <tr key={sp.domain} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-foreground">{sp.domain}</td>
                        <td className="py-3.5 px-4">{sp.laws}</td>
                        <td className={`py-3.5 px-4 font-mono font-bold ${themeTextMap[themeColor]}`}>{sp.formulas}</td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-foreground/80">{sp.solver}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Curriculum Section */}
          {curriculum && (
            <section
              aria-labelledby="subtopic-curriculum-heading"
              className="bg-card border border-border/80 rounded-3xl p-8 lg:p-10 shadow-md relative overflow-hidden mb-16"
            >
              <div className="absolute top-0 right-0 h-32 w-32 bg-muted rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className={`flex items-center gap-2 ${themeTextMap[themeColor]} font-bold uppercase tracking-wider text-xs`}>
                    <BookOpen className="h-4 w-4 animate-pulse" aria-hidden="true" />
                    Curriculum Standards
                  </div>
                  <h2 id="subtopic-curriculum-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                    {curriculum.heading || `Academic Standards Alignment for ${subtopicTitle}`}
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                    {curriculum.description}
                  </p>
                  {curriculum.secondaryText && (
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                      {curriculum.secondaryText}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-4 bg-muted border border-border p-6 rounded-2xl flex flex-col justify-center text-center shadow-inner">
                  <Compass className={`h-10 w-10 ${themeTextMap[themeColor]} mx-auto mb-3 animate-spin [animation-duration:12s]`} aria-hidden="true" />
                  <h3 className="font-extrabold text-foreground text-sm mb-1">{curriculum.telemetryTitle || "Empirical Telemetry"}</h3>
                  <p className="text-[11px] text-muted-foreground leading-normal font-medium">
                    {curriculum.telemetryDesc || "Evaluate mathematical models and runtime states dynamically."}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* FAQ Section */}
          <section className="mb-16" aria-labelledby="subtopic-faq-heading">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 items-start">
                <div className="md:col-span-1 md:sticky md:top-24">
                  <h2 id="subtopic-faq-heading" className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-muted-foreground text-base">
                    Technical and curriculum details about {subtopicTitle.toLowerCase()}.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/contact"
                      className={`inline-flex items-center gap-1.5 text-sm font-bold ${themeTextMap[themeColor]} hover:opacity-80 transition-opacity group`}
                    >
                      Contact research team
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  {faqs.map((faq) => (
                    <details
                      key={faq.q}
                      name="subtopic-faq"
                      className="group rounded-2xl bg-card border border-border/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden open:shadow-md transition-all duration-300"
                    >
                      <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset rounded-2xl">
                        <span className="font-semibold text-foreground text-[1.05rem] group-hover:text-primary transition-colors pr-6">
                          {faq.q}
                        </span>
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center group-open:bg-primary/10 group-open:border-primary/20 group-hover:bg-accent transition-colors">
                          <svg
                            className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform duration-500 ease-spring-smooth"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <div className="px-6 pb-6 pt-1 text-muted-foreground leading-relaxed border-t border-border mt-1">
                        <p>{faq.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Footer note */}
          <footer className="text-center py-8 border-t border-border/60">
            <p className="text-xs text-muted-foreground font-medium">
              All {subtopicTitle.toLowerCase()} simulations are free for educational use. Grounded in standard scientific &amp; computational models.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
