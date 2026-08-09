import React from "react";
import Link from "next/link";
import { createLearningResourceSchema, createFAQSchema } from "@/app/lib/seo/schema";
import StructuredData from "@/app/components/seo/StructuredData";
import Breadcrumbs from "@/app/components/seo/Breadcrumbs";
import EducationalGraphSection from "@/app/components/seo/EducationalGraphSection";
import FormulaSection from "@/app/components/seo/FormulaSection";

type Faq = {
  question: string;
  answer: string;
};

type PhysicsExperimentLandingProps = {
  slug: string;
  title: string;
  description: string;
  heroDescription: string;
  theory: string;
  formula: string;
  formulaLabel?: string;
  launchUrl: string;
  learningObjectives: string[];
  applications: string[];
  faqs: Faq[];
  accent: {
    primary: string;
    secondary: string;
    warm: string;
  };
  visualLabel: string;
  visualDetail: string;
  heroImageUrl?: string;
};

export default function PhysicsExperimentLanding({
  slug,
  title,
  description,
  heroDescription,
  theory,
  formula,
  formulaLabel = "Reference relationship",
  launchUrl,
  learningObjectives,
  applications,
  faqs,
  accent,
  visualLabel,
  visualDetail,
  heroImageUrl,
}: PhysicsExperimentLandingProps) {
  const words = title.split(" ");

  const learningSchema = createLearningResourceSchema({
    name: `${title} Interactive Simulator`,
    description,
    pathname: `/physics/${slug}`,
    subject: "physics",
    learningResourceType: "Simulation",
  });

  const faqSchema = faqs && faqs.length > 0 ? createFAQSchema(faqs) : null;

  return (
    <>
      <StructuredData data={[learningSchema, faqSchema].filter(Boolean)} />

      <main
        className="px-page"
        style={
          {
            "--px-primary": accent.primary,
            "--px-secondary": accent.secondary,
            "--px-warm": accent.warm,
          } as React.CSSProperties
        }
        suppressHydrationWarning
      >
        <div className="px-shell py-3">
          <Breadcrumbs
            items={[
              { name: "Physics", url: "/physics" },
              { name: title, url: `/physics/${slug}` },
            ]}
          />
        </div>

        <section className="px-hero">
          <div className="px-shell px-hero-grid">
            <div className="px-hero-copy">
              <div className="px-kicker">
                <span>Physics</span>
                <span>Interactive simulator</span>
                <span>No install</span>
              </div>

              <h1>
                {words.map((word, index) => (
                  <span key={`${word}-${index}`}>{word}</span>
                ))}
              </h1>
              <p>{heroDescription}</p>

              <div className="px-actions">
                <Link href={launchUrl} className="px-primary-link">
                  Launch Interactive Lab
                </Link>
                <a href="#theory" className="px-secondary-link">
                  Read the theory
                </a>
              </div>
            </div>

            <div className="px-visual">
              {heroImageUrl ? (
                <img src={heroImageUrl} alt={`${title} interactive physics lab illustration.`} />
              ) : (
                <div className="px-visual-art" aria-hidden="true">
                  <div className="px-orbit px-orbit-one" />
                  <div className="px-orbit px-orbit-two" />
                  <div className="px-visual-core">{title.slice(0, 2).toUpperCase()}</div>
                </div>
              )}
              <div className="px-visual-caption">
                <span>{visualLabel}</span>
                <strong>{visualDetail}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="px-lower">
          <div className="px-shell">
            <div className="px-lower-head">
              <p className="px-eyebrow">Experiment guide</p>
              <h2>Use this simulator like a compact physics lab</h2>
              <p>
                Start with the concept, open the lab, then compare the observed
                motion with the key relationship. The sections below keep the
                theory, workflow, and common questions easy to scan.
              </p>
            </div>

            <div className="px-summary" aria-label="Lab summary">
              {[
                ["Subject", "Physics"],
                ["Mode", "Interactive"],
                ["Model", visualLabel],
                ["Access", "Browser"],
              ].map(([label, value]) => (
                <div className="px-fact" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className="px-layout">
              <div className="px-main">
                <article id="theory" className="px-card px-card-feature">
                  <div className="px-card-index">01</div>
                  <div>
                    <p className="px-eyebrow">Theory and background</p>
                    <h2>What is {title.toLowerCase()}?</h2>
                    <p>{theory}</p>
                  </div>
                </article>

                <article className="px-card px-card-feature">
                  <div className="px-card-index">02</div>
                  <div>
                    <p className="px-eyebrow">How the simulation works</p>
                    <h2>Interactive experiment flow</h2>
                    <p>
                      Launch the lab, adjust the available controls, and observe
                      the result immediately. Use the simulation to connect the
                      equation with what changes on screen.
                    </p>
                    <div className="px-formula-panel">
                      <span>{formulaLabel}</span>
                      <strong>{formula}</strong>
                    </div>
                  </div>
                </article>

                <article className="px-card px-faq-card">
                  <div className="px-section-title">
                    <div>
                      <p className="px-eyebrow">Frequently asked questions</p>
                      <h2>{title} FAQ</h2>
                    </div>
                    <span>{faqs.length} answers</span>
                  </div>
                  <div className="px-faqs" itemScope itemType="https://schema.org/FAQPage">
                    {faqs.map((faq, index) => (
                      <div
                        className="px-faq"
                        key={faq.question}
                        itemScope
                        itemProp="mainEntity"
                        itemType="https://schema.org/Question"
                      >
                        <span className="px-faq-number">{String(index + 1).padStart(2, "0")}</span>
                        <h3 itemProp="name">{faq.question}</h3>
                        <div
                          itemScope
                          itemProp="acceptedAnswer"
                          itemType="https://schema.org/Answer"
                        >
                          <p itemProp="text">{faq.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                {/* Formula Section & Educational Graph for all Physics pages */}
                <FormulaSection conceptId={slug} />
                <EducationalGraphSection conceptId={slug} subject="physics" />
              </div>

              <aside className="px-side" aria-label="Learning details">
                <div className="px-side-card px-launch-card">
                  <p className="px-eyebrow">Open lab</p>
                  <h2>Ready to experiment?</h2>
                  <p>Open the interactive lab and compare theory with observed behavior.</p>
                  <Link href={launchUrl} className="px-side-link">
                    Launch Interactive Lab
                  </Link>
                </div>

                <div className="px-side-card">
                  <p className="px-eyebrow">Learning path</p>
                  <h2>Objectives</h2>
                  <ul>
                    {learningObjectives.map((objective) => (
                      <li key={objective}>{objective}</li>
                    ))}
                  </ul>
                </div>

                <div className="px-side-card">
                  <p className="px-eyebrow">Where it appears</p>
                  <h2>Applications</h2>
                  <ul>
                    {applications.map((application) => (
                      <li key={application}>{application}</li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .px-page {
          --px-ink: #17242c;
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 8%, color-mix(in srgb, var(--px-warm) 22%, transparent), transparent 28rem),
            radial-gradient(circle at 86% 18%, color-mix(in srgb, var(--px-secondary) 24%, transparent), transparent 30rem),
            radial-gradient(circle at 70% 78%, rgba(242, 190, 78, 0.18), transparent 34rem),
            linear-gradient(180deg, #fffdf8 0%, #f7f1e8 52%, #eef7f1 100%);
          color: var(--px-ink);
          font-family: Inter, "Avenir Next", "Segoe UI", system-ui, sans-serif;
        }
        .px-page * { box-sizing: border-box; }
        .px-shell { width: min(1160px, calc(100% - 32px)); margin: 0 auto; }
        .px-crumbs { border-bottom: 1px solid #eadfce; background: rgba(255, 255, 255, 0.76); backdrop-filter: blur(14px); }
        .px-crumbs-inner { display: flex; align-items: center; gap: 10px; min-height: 48px; color: #6b776f; font-size: 14px; }
        .px-crumbs a { color: var(--px-primary); font-weight: 700; text-decoration: none; transition: color 160ms ease; }
        .px-crumbs a:hover { color: var(--px-secondary); }
        .px-hero {
          overflow: hidden;
          border-bottom: 1px solid #eadfce;
          background:
            radial-gradient(#dfc9ad 1px, transparent 1px),
            linear-gradient(135deg, rgba(255,253,248,.96), rgba(255,244,228,.94) 42%, rgba(230,247,240,.96));
          background-size: 24px 24px, auto;
          padding: 72px 0;
        }
        .px-hero-grid { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 56px; align-items: center; }
        .px-kicker { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; }
        .px-kicker span {
          border: 1px solid color-mix(in srgb, var(--px-warm) 28%, transparent);
          border-radius: 999px;
          background: linear-gradient(135deg, rgba(255,255,255,.92), rgba(255,239,222,.9));
          color: #7b422a;
          font-size: 13px;
          font-weight: 800;
          padding: 8px 13px;
          box-shadow: 0 8px 24px rgba(65, 50, 27, 0.06);
        }
        .px-hero h1 {
          max-width: 780px;
          margin: 0;
          font-family: "Space Grotesk", "Avenir Next", "Segoe UI", system-ui, sans-serif;
          font-size: clamp(42px, 7vw, 76px);
          font-weight: 850;
          letter-spacing: 0;
          line-height: 0.98;
        }
        .px-hero h1 span { display: inline-block; margin-right: .22em; color: var(--px-ink); }
        .px-hero h1 span:nth-child(2n) {
          background: linear-gradient(135deg, var(--px-primary), var(--px-secondary));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .px-hero h1 span:nth-child(3n) {
          background: linear-gradient(135deg, var(--px-warm), #f2be4e);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .px-hero-copy p { max-width: 620px; margin: 24px 0 0; color: #56636b; font-size: 19px; line-height: 1.75; }
        .px-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 34px; }
        .px-primary-link, .px-secondary-link, .px-side-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          border-radius: 8px;
          font-weight: 800;
          text-decoration: none;
          transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease, border-color 180ms ease;
        }
        .px-primary-link, .px-side-link {
          background: linear-gradient(135deg, #243642, var(--px-primary));
          color: white;
          padding: 0 24px;
          box-shadow: 0 16px 36px rgba(36, 54, 66, 0.2);
        }
        .px-primary-link:hover, .px-side-link:hover { transform: translateY(-2px); background: linear-gradient(135deg, #314957, var(--px-secondary)); box-shadow: 0 20px 44px rgba(36, 54, 66, 0.24); }
        .px-secondary-link { border: 1px solid #d8c9b2; background: rgba(255,255,255,.9); color: #31424e; padding: 0 22px; }
        .px-secondary-link:hover { transform: translateY(-2px); border-color: var(--px-warm); color: #9a4a2c; box-shadow: 0 12px 30px color-mix(in srgb, var(--px-warm) 18%, transparent); }
        .px-visual {
          position: relative;
          min-height: 330px;
          border: 1px solid color-mix(in srgb, var(--px-warm) 22%, transparent);
          border-radius: 8px;
          background: rgba(255,255,255,.9);
          box-shadow: 0 28px 80px rgba(67,50,28,.14), 0 0 0 8px rgba(255,255,255,.38);
          overflow: hidden;
        }
        .px-visual img { display: block; width: 100%; aspect-ratio: 4 / 3; height: 100%; object-fit: cover; transition: transform 500ms ease; }
        .px-visual:hover img { transform: scale(1.035); }
        .px-visual-art {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle at 22% 20%, color-mix(in srgb, var(--px-warm) 30%, transparent), transparent 10rem),
            radial-gradient(circle at 76% 32%, color-mix(in srgb, var(--px-secondary) 32%, transparent), transparent 12rem),
            linear-gradient(135deg, #fffdf8, #ecf7f2);
        }
        .px-visual-core {
          display: grid;
          place-items: center;
          width: 132px;
          height: 132px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--px-primary), var(--px-warm));
          color: white;
          font-family: "IBM Plex Mono", "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 34px;
          font-weight: 900;
          box-shadow: 0 24px 60px color-mix(in srgb, var(--px-primary) 32%, transparent);
        }
        .px-orbit { position: absolute; border: 2px dashed color-mix(in srgb, var(--px-primary) 38%, transparent); border-radius: 50%; }
        .px-orbit-one { width: 250px; height: 126px; transform: rotate(-18deg); }
        .px-orbit-two { width: 310px; height: 170px; transform: rotate(22deg); border-color: color-mix(in srgb, var(--px-warm) 42%, transparent); }
        .px-visual-caption {
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border: 1px solid rgba(255,255,255,.65);
          border-radius: 8px;
          background: rgba(255,253,248,.86);
          padding: 12px 14px;
          backdrop-filter: blur(14px);
          box-shadow: 0 12px 34px rgba(30,49,59,.12);
        }
        .px-visual-caption span { color: #9a4a2c; font-size: 12px; font-weight: 850; text-transform: uppercase; letter-spacing: .08em; }
        .px-visual-caption strong { color: var(--px-primary); font-size: 13px; text-align: right; }
        .px-lower {
          position: relative;
          isolation: isolate;
          padding: 44px 0 78px;
          background:
            linear-gradient(180deg, rgba(255,253,248,.36), rgba(238,247,241,.72)),
            radial-gradient(circle at 18% 28%, color-mix(in srgb, var(--px-warm) 12%, transparent), transparent 24rem),
            radial-gradient(circle at 88% 62%, color-mix(in srgb, var(--px-primary) 15%, transparent), transparent 26rem);
        }
        .px-lower::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background-image: linear-gradient(rgba(39,56,68,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(39,56,68,.045) 1px, transparent 1px);
          background-size: 34px 34px;
          mask-image: linear-gradient(180deg, transparent, black 16%, black 82%, transparent);
        }
        .px-lower-head { max-width: 760px; margin-bottom: 24px; }
        .px-lower-head h2 {
          margin: 0;
          background: linear-gradient(90deg, var(--px-ink), var(--px-primary) 48%, var(--px-warm));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-family: "Space Grotesk", "Avenir Next", "Segoe UI", system-ui, sans-serif;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.08;
          letter-spacing: 0;
        }
        .px-lower-head p:not(.px-eyebrow) { margin: 14px 0 0; color: #5f6b73; font-size: 17px; line-height: 1.72; }
        .px-summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; padding: 0; }
        .px-fact {
          position: relative;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--px-primary) 18%, transparent);
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(255,255,255,.98), rgba(238,247,241,.88));
          padding: 18px 18px 20px;
          box-shadow: 0 12px 32px rgba(67,50,28,.06);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }
        .px-fact::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 4px; background: linear-gradient(90deg, var(--px-primary), #f2be4e, var(--px-warm)); opacity: .85; }
        .px-fact:hover { transform: translateY(-2px); box-shadow: 0 16px 34px rgba(67,50,28,.1); }
        .px-fact span { display: block; color: #6b776f; font-size: 13px; font-weight: 750; }
        .px-fact strong { display: block; margin-top: 6px; color: var(--px-ink); font-family: "IBM Plex Mono", "SFMono-Regular", Menlo, Consolas, monospace; font-size: 16px; }
        .px-layout { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 24px; align-items: start; padding: 24px 0 0; }
        .px-main, .px-side { display: flex; flex-direction: column; gap: 22px; }
        .px-card, .px-side-card {
          border: 1px solid rgba(228,216,200,.78);
          border-radius: 8px;
          background: linear-gradient(180deg, rgba(255,255,255,.98), rgba(255,252,247,.96));
          box-shadow: 0 16px 42px rgba(67,50,28,.065);
        }
        .px-card { padding: clamp(24px, 4vw, 36px); }
        .px-card-feature { display: grid; grid-template-columns: 72px minmax(0, 1fr); gap: 22px; }
        .px-card-index {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 8px;
          background: linear-gradient(135deg, color-mix(in srgb, var(--px-primary) 13%, transparent), color-mix(in srgb, var(--px-warm) 13%, transparent));
          color: var(--px-primary);
          font-family: "IBM Plex Mono", "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 16px;
          font-weight: 850;
        }
        .px-card h2, .px-side-card h2 {
          margin: 0;
          color: var(--px-ink);
          font-family: "Space Grotesk", "Avenir Next", "Segoe UI", system-ui, sans-serif;
          font-size: 28px;
          letter-spacing: 0;
        }
        .px-card h2 {
          background: linear-gradient(90deg, var(--px-ink), var(--px-primary) 58%, var(--px-warm));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .px-card p { margin: 16px 0 0; color: #56636b; font-size: 17px; line-height: 1.78; }
        .px-eyebrow { margin: 0 0 10px !important; color: var(--px-primary) !important; font-size: 12px !important; font-weight: 850; letter-spacing: .12em; text-transform: uppercase; }
        .px-formula-panel {
          display: grid;
          gap: 8px;
          margin-top: 22px;
          border: 1px solid #d7e8df;
          border-radius: 8px;
          background: linear-gradient(135deg, #eef7f1, #fff4e7);
          padding: 20px;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.55);
        }
        .px-formula-panel span { color: #4f6259; font-size: 13px; font-weight: 800; text-transform: uppercase; }
        .px-formula-panel strong { color: var(--px-primary); font-family: "IBM Plex Mono", "SFMono-Regular", Menlo, Consolas, monospace; font-size: clamp(19px, 3vw, 26px); }
        .px-section-title { display: flex; align-items: end; justify-content: space-between; gap: 18px; margin-bottom: 20px; }
        .px-section-title span { flex: 0 0 auto; border: 1px solid color-mix(in srgb, var(--px-primary) 18%, transparent); border-radius: 999px; background: #eef7f1; color: var(--px-primary); font-size: 13px; font-weight: 850; padding: 8px 12px; }
        .px-faqs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 0; }
        .px-faq {
          border: 1px solid color-mix(in srgb, var(--px-warm) 22%, transparent);
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(255,250,243,.98), rgba(239,247,255,.88));
          overflow: hidden;
          padding: 20px;
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
        }
        .px-faq-number { display: inline-flex; margin-bottom: 12px; color: var(--px-warm); font-family: "IBM Plex Mono", "SFMono-Regular", Menlo, Consolas, monospace; font-size: 12px; font-weight: 850; }
        .px-faq:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--px-primary) 35%, transparent); box-shadow: 0 16px 34px rgba(67,50,28,.1); }
        .px-faq h3 { margin: 0; color: #26323a; font-family: "Space Grotesk", "Avenir Next", "Segoe UI", system-ui, sans-serif; font-size: 18px; font-weight: 850; line-height: 1.35; }
        .px-faq p { margin: 10px 0 0; padding: 0; color: #5f6b73; font-size: 15px; line-height: 1.65; }
        .px-side { position: sticky; top: 88px; }
        .px-side-card { padding: 22px; }
        .px-launch-card { background: radial-gradient(circle at top right, color-mix(in srgb, var(--px-primary) 20%, transparent), transparent 13rem), radial-gradient(circle at bottom left, color-mix(in srgb, var(--px-warm) 16%, transparent), transparent 12rem), #fffdf8; border-color: color-mix(in srgb, var(--px-primary) 24%, transparent); }
        .px-side-card p { color: #5f6b73; line-height: 1.65; margin: 12px 0 0; }
        .px-side-card ul { display: grid; gap: 12px; margin: 16px 0 0; padding: 0; list-style: none; }
        .px-side-card li { position: relative; color: #4f5d65; font-size: 14px; line-height: 1.55; padding-left: 22px; }
        .px-side-card li::before { content: ""; position: absolute; left: 0; top: .55em; width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(135deg, var(--px-primary), var(--px-warm)); box-shadow: 0 0 0 4px #f3eadf; }
        .px-side-link { width: 100%; margin-top: 18px; padding: 0 16px; }
        @media (max-width: 980px) {
          .px-hero-grid, .px-layout { grid-template-columns: 1fr; }
          .px-visual { max-width: 420px; }
          .px-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .px-faqs { grid-template-columns: 1fr; }
          .px-side { position: static; }
        }
        @media (max-width: 620px) {
          .px-shell { width: min(100% - 24px, 1160px); }
          .px-hero { padding: 50px 0; }
          .px-actions { flex-direction: column; align-items: stretch; }
          .px-summary { grid-template-columns: 1fr; }
          .px-card-feature { grid-template-columns: 1fr; gap: 16px; }
          .px-section-title { align-items: start; flex-direction: column; }
          .px-card, .px-side-card { padding: 20px; }
        }

        /* ---------- Dark mode overrides ---------- */
        .dark .px-page {
          --px-ink: #e6edf3;
          background:
            radial-gradient(circle at 12% 8%, color-mix(in srgb, var(--px-warm) 16%, transparent), transparent 28rem),
            radial-gradient(circle at 86% 18%, color-mix(in srgb, var(--px-secondary) 18%, transparent), transparent 30rem),
            radial-gradient(circle at 70% 78%, rgba(242, 190, 78, 0.10), transparent 34rem),
            linear-gradient(180deg, #0a0f1c 0%, #0b1120 52%, #0a1017 100%);
          color: var(--px-ink);
        }
        .dark .px-crumbs { border-bottom-color: rgba(255,255,255,.08); background: rgba(12,18,30,.72); }
        .dark .px-crumbs-inner { color: #8a97a3; }
        .dark .px-hero {
          border-bottom-color: rgba(255,255,255,.08);
          background:
            radial-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
            linear-gradient(135deg, rgba(12,18,30,.96), rgba(16,22,38,.94) 42%, rgba(10,20,26,.96));
          background-size: 24px 24px, auto;
        }
        .dark .px-kicker span {
          border-color: color-mix(in srgb, var(--px-warm) 30%, transparent);
          background: linear-gradient(135deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
          color: #f0b892;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
        .dark .px-hero-copy p { color: #9aa7b2; }
        .dark .px-secondary-link { border-color: rgba(255,255,255,.14); background: rgba(255,255,255,.05); color: #dbe4ea; }
        .dark .px-secondary-link:hover { border-color: var(--px-warm); color: #f0b892; }
        .dark .px-visual {
          border-color: rgba(255,255,255,.1);
          background: rgba(16,22,38,.9);
          box-shadow: 0 28px 80px rgba(0,0,0,.5), 0 0 0 8px rgba(255,255,255,.04);
        }
        .dark .px-visual-art {
          background:
            radial-gradient(circle at 22% 20%, color-mix(in srgb, var(--px-warm) 22%, transparent), transparent 10rem),
            radial-gradient(circle at 76% 32%, color-mix(in srgb, var(--px-secondary) 24%, transparent), transparent 12rem),
            linear-gradient(135deg, #0d1424, #0b1a1a);
        }
        .dark .px-visual-caption {
          border-color: rgba(255,255,255,.1);
          background: rgba(12,18,30,.82);
          box-shadow: 0 12px 34px rgba(0,0,0,.4);
        }
        .dark .px-visual-caption span { color: #f0b892; }
        .dark .px-lower {
          background:
            linear-gradient(180deg, rgba(10,15,28,.4), rgba(11,17,32,.75)),
            radial-gradient(circle at 18% 28%, color-mix(in srgb, var(--px-warm) 8%, transparent), transparent 24rem),
            radial-gradient(circle at 88% 62%, color-mix(in srgb, var(--px-primary) 12%, transparent), transparent 26rem);
        }
        .dark .px-lower::before {
          background-image: linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
        }
        .dark .px-lower-head p:not(.px-eyebrow) { color: #9aa7b2; }
        .dark .px-fact {
          border-color: rgba(255,255,255,.1);
          background: linear-gradient(135deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
          box-shadow: 0 12px 32px rgba(0,0,0,.3);
        }
        .dark .px-fact span { color: #8a97a3; }
        .dark .px-card, .dark .px-side-card {
          border-color: rgba(255,255,255,.08);
          background: linear-gradient(180deg, #0f1626, #0d1322);
          box-shadow: 0 16px 42px rgba(0,0,0,.35);
        }
        .dark .px-card p { color: #9aa7b2; }
        .dark .px-formula-panel {
          border-color: rgba(255,255,255,.1);
          background: linear-gradient(135deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.04);
        }
        .dark .px-formula-panel span { color: #9aa7b2; }
        .dark .px-section-title span { border-color: color-mix(in srgb, var(--px-primary) 30%, transparent); background: rgba(255,255,255,.04); }
        .dark .px-faq {
          border-color: rgba(255,255,255,.1);
          background: linear-gradient(135deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
        }
        .dark .px-faq h3 { color: #e6edf3; }
        .dark .px-faq p { color: #9aa7b2; }
        .dark .px-launch-card {
          background: radial-gradient(circle at top right, color-mix(in srgb, var(--px-primary) 26%, transparent), transparent 13rem), radial-gradient(circle at bottom left, color-mix(in srgb, var(--px-warm) 18%, transparent), transparent 12rem), #0f1626;
          border-color: color-mix(in srgb, var(--px-primary) 34%, transparent);
        }
        .dark .px-side-card p { color: #9aa7b2; }
        .dark .px-side-card li { color: #9aa7b2; }
        .dark .px-side-card li::before { box-shadow: 0 0 0 4px rgba(255,255,255,.06); }
      `}</style>
    </>
  );
}
