"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createLearningResourceSchema, createFAQSchema } from "@/app/lib/seo/schema";
import StructuredData from "@/app/components/seo/StructuredData";
import Breadcrumbs from "@/app/components/seo/Breadcrumbs";
import EducationalGraphSection from "@/app/components/seo/EducationalGraphSection";
import FormulaSection from "@/app/components/seo/FormulaSection";
import { ChevronDown, Play, BookOpen, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

export type STEMSubject = "physics" | "chemistry" | "biology" | "mathematics" | "computer-science";

export type Faq = {
  question: string;
  answer: string;
};

export type STEMExperimentLandingProps = {
  subject: STEMSubject;
  subjectLabel?: string;
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
  kickerBadges?: string[];
};

export default function STEMExperimentLanding({
  subject,
  subjectLabel,
  slug,
  title,
  description,
  heroDescription,
  theory,
  formula,
  formulaLabel = "Governing Equation / Principle",
  launchUrl,
  learningObjectives,
  applications,
  faqs,
  accent,
  visualLabel,
  visualDetail,
  heroImageUrl,
  kickerBadges,
}: STEMExperimentLandingProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const words = title.split(" ");

  const defaultSubjectLabels: Record<STEMSubject, string> = {
    physics: "Physics",
    chemistry: "Chemistry",
    biology: "Biology",
    mathematics: "Mathematics",
    "computer-science": "Computer Science",
  };

  const displaySubject = subjectLabel || defaultSubjectLabels[subject] || "STEM";
  const subjectPath = `/${subject}`;

  const learningSchema = createLearningResourceSchema({
    name: `${title} Interactive Simulator`,
    description,
    pathname: `${subjectPath}/${slug}`,
    subject,
    learningResourceType: "Simulation",
  });

  const faqSchema = faqs && faqs.length > 0 ? createFAQSchema(faqs) : null;

  const defaultKickers = kickerBadges || [
    displaySubject,
    "Interactive Simulator",
    "Zero Install",
    "100% Free",
  ];

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
        {/* Top Breadcrumbs */}
        <div className="px-shell py-3">
          <Breadcrumbs
            items={[
              { name: displaySubject, url: subjectPath },
              { name: title, url: `${subjectPath}/${slug}` },
            ]}
          />
        </div>

        {/* Hero Section */}
        <section className="px-hero">
          <div className="px-shell px-hero-grid">
            <div className="px-hero-copy">
              <div className="px-kicker">
                {defaultKickers.map((badge, idx) => (
                  <span key={idx}>{badge}</span>
                ))}
              </div>

              <h1>
                {words.map((word, index) => (
                  <span key={`${word}-${index}`}>{word}</span>
                ))}
              </h1>
              <p>{heroDescription}</p>

              <div className="px-actions">
                <Link href={launchUrl} className="px-primary-link">
                  <Play size={16} className="inline mr-2 fill-current" />
                  Launch Interactive Lab
                </Link>
                <a href="#theory" className="px-secondary-link">
                  <BookOpen size={16} className="inline mr-2" />
                  Read the theory
                </a>
              </div>
            </div>

            <div className="px-visual">
              {heroImageUrl ? (
                <img
                  src={heroImageUrl}
                  alt={`${title} interactive ${displaySubject} simulation illustration`}
                  loading="eager"
                  className="px-hero-img"
                />
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

        {/* Lower Content & Theory Section */}
        <section className="px-lower">
          <div className="px-shell">
            <div className="px-lower-head">
              <p className="px-eyebrow">Interactive Experiment Guide</p>
              <h2>Use this studio like a real-time {displaySubject.toLowerCase()} workbench</h2>
              <p>
                Start with fundamental scientific principles, launch the simulation, and verify mathematical predictions against real-time outcomes.
              </p>
            </div>

            {/* Fast-Fact Summary Strip */}
            <div className="px-summary" aria-label="Lab summary">
              {[
                ["Discipline", displaySubject],
                ["Simulation Mode", "Interactive Numeric Engine"],
                ["Governing Model", visualLabel],
                ["Deployment", "In-Browser WebAssembly / GPU"],
              ].map(([label, value]) => (
                <div className="px-fact" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            {/* Main 2-Column Split */}
            <div className="px-layout">
              <div className="px-main">
                {/* 01 Theory Card */}
                <article id="theory" className="px-card px-card-feature">
                  <div className="px-card-index">01</div>
                  <div>
                    <p className="px-eyebrow">Scientific Foundation</p>
                    <h2>What is {title.toLowerCase()}?</h2>
                    <p className="px-theory-body">{theory}</p>
                  </div>
                </article>

                {/* 02 Workflow & Formula Card */}
                <article className="px-card px-card-feature">
                  <div className="px-card-index">02</div>
                  <div>
                    <p className="px-eyebrow">Interactive Simulation Flow</p>
                    <h2>Experiment Execution &amp; Governing Equations</h2>
                    <p>
                      Launch the simulation workspace, adjust parameters in real time, and observe the immediate response in the telemetry and graphical indicator loops.
                    </p>
                    <div className="px-formula-panel">
                      <span>{formulaLabel}</span>
                      <strong>{formula}</strong>
                    </div>
                  </div>
                </article>

                {/* 03 Single-Open Structured FAQs */}
                <article className="px-card px-faq-card">
                  <div className="px-section-title">
                    <div>
                      <p className="px-eyebrow">Frequently Asked Questions</p>
                      <h2>{title} FAQ</h2>
                    </div>
                    <span className="px-faq-count">{faqs.length} Answers</span>
                  </div>
                  <div className="px-faqs" itemScope itemType="https://schema.org/FAQPage">
                    {faqs.map((faq, index) => {
                      const isOpen = openFaqIndex === index;
                      return (
                        <div
                          className={`px-faq-item ${isOpen ? "px-faq-open" : ""}`}
                          key={faq.question}
                          itemScope
                          itemProp="mainEntity"
                          itemType="https://schema.org/Question"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                            className="px-faq-trigger"
                            aria-expanded={isOpen}
                          >
                            <div className="px-faq-question-wrap">
                              <span className="px-faq-number">{String(index + 1).padStart(2, "0")}</span>
                              <h3 itemProp="name">{faq.question}</h3>
                            </div>
                            <ChevronDown
                              size={18}
                              className={`px-faq-icon ${isOpen ? "px-icon-rotated" : ""}`}
                            />
                          </button>
                          {isOpen && (
                            <div
                              className="px-faq-answer"
                              itemScope
                              itemProp="acceptedAnswer"
                              itemType="https://schema.org/Answer"
                            >
                              <p itemProp="text">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </article>

                {/* Dynamic Formula Explorer and Knowledge Graph */}
                <FormulaSection conceptId={slug} />
                <EducationalGraphSection
                  conceptId={slug}
                  subject={subject === "computer-science" ? "computerScience" : subject}
                />
              </div>

              {/* Right Sticky Learning Aside */}
              <aside className="px-side" aria-label="Learning details">
                <div className="px-side-card px-launch-card">
                  <p className="px-eyebrow">Virtual Laboratory</p>
                  <h2>Ready to experiment?</h2>
                  <p>Open the interactive laboratory to test hypotheses and observe real-time dynamics.</p>
                  <Link href={launchUrl} className="px-side-link">
                    <Sparkles size={16} className="inline mr-2" />
                    Launch Interactive Lab
                  </Link>
                </div>

                <div className="px-side-card">
                  <p className="px-eyebrow">Curriculum Mastery</p>
                  <h2>Learning Objectives</h2>
                  <ul className="px-objectives-list">
                    {learningObjectives.map((objective, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={16} className="px-bullet-icon" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-side-card">
                  <p className="px-eyebrow">Practical Context</p>
                  <h2>Real-World Applications</h2>
                  <ul className="px-applications-list">
                    {applications.map((application, idx) => (
                      <li key={idx}>
                        <ArrowRight size={14} className="px-bullet-icon-arrow" />
                        <span>{application}</span>
                      </li>
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
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 8%, color-mix(in srgb, var(--px-warm) 12%, transparent), transparent 28rem),
            radial-gradient(circle at 86% 18%, color-mix(in srgb, var(--px-secondary) 14%, transparent), transparent 30rem),
            radial-gradient(circle at 70% 78%, color-mix(in srgb, var(--px-primary) 8%, transparent), transparent 34rem),
            hsl(var(--background));
          color: hsl(var(--foreground));
          font-family: Inter, "Avenir Next", "Segoe UI", system-ui, sans-serif;
          transition: background-color 200ms ease, color 200ms ease;
        }
        .px-page * { box-sizing: border-box; }
        .px-shell { width: min(1160px, calc(100% - 32px)); margin: 0 auto; }
        .px-hero {
          overflow: hidden;
          border-bottom: 1px solid hsl(var(--border));
          background:
            radial-gradient(color-mix(in srgb, var(--px-primary) 14%, transparent) 1.2px, transparent 1.2px),
            linear-gradient(135deg, hsl(var(--background)), color-mix(in srgb, var(--px-warm) 5%, hsl(var(--card))) 45%, hsl(var(--background)));
          background-size: 24px 24px, auto;
          padding: 64px 0;
        }
        .px-hero-grid { display: grid; grid-template-columns: minmax(0, 1fr) 420px; gap: 48px; align-items: center; }
        @media (max-width: 900px) {
          .px-hero-grid { grid-template-columns: 1fr; gap: 36px; }
        }
        .px-kicker { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .px-kicker span {
          border: 1px solid color-mix(in srgb, var(--px-warm) 32%, hsl(var(--border)));
          border-radius: 999px;
          background: color-mix(in srgb, var(--px-warm) 10%, hsl(var(--card)));
          color: var(--px-warm);
          font-size: 12px;
          font-weight: 800;
          padding: 6px 12px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
        }
        .px-hero h1 {
          max-width: 780px;
          margin: 0;
          font-family: "Space Grotesk", "Avenir Next", "Segoe UI", system-ui, sans-serif;
          font-size: clamp(36px, 6vw, 68px);
          font-weight: 850;
          letter-spacing: -0.02em;
          line-height: 1.05;
        }
        .px-hero h1 span { display: inline-block; margin-right: .22em; color: hsl(var(--foreground)); }
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
        .px-hero-copy p { max-width: 620px; margin: 20px 0 0; color: hsl(var(--muted-foreground)); font-size: 18px; line-height: 1.7; }
        .px-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
        .px-primary-link, .px-secondary-link, .px-side-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 14px;
          text-decoration: none;
          transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease, border-color 180ms ease;
        }
        .px-primary-link, .px-side-link {
          background: linear-gradient(135deg, var(--px-primary), color-mix(in srgb, var(--px-secondary) 80%, black));
          color: white;
          padding: 0 22px;
          box-shadow: 0 12px 28px color-mix(in srgb, var(--px-primary) 35%, transparent);
        }
        .px-primary-link:hover, .px-side-link:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, var(--px-secondary), var(--px-primary));
          box-shadow: 0 16px 36px color-mix(in srgb, var(--px-primary) 45%, transparent);
        }
        .px-secondary-link {
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          padding: 0 20px;
        }
        .px-secondary-link:hover {
          transform: translateY(-2px);
          border-color: var(--px-warm);
          color: var(--px-warm);
          box-shadow: 0 10px 24px color-mix(in srgb, var(--px-warm) 18%, transparent);
        }
        .px-visual {
          position: relative;
          min-height: 280px;
          border: 1px solid color-mix(in srgb, var(--px-warm) 28%, hsl(var(--border)));
          border-radius: 20px;
          background: hsl(var(--card));
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
          overflow: hidden;
        }
        .px-hero-img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; transition: transform 500ms ease; }
        .px-visual:hover .px-hero-img { transform: scale(1.04); }
        .px-visual-caption {
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          background: color-mix(in srgb, hsl(var(--card)) 90%, transparent);
          padding: 10px 14px;
          backdrop-filter: blur(12px);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
        }
        .px-visual-caption span { color: var(--px-warm); font-size: 11px; font-weight: 850; text-transform: uppercase; letter-spacing: .08em; }
        .px-visual-caption strong { color: var(--px-primary); font-size: 12px; text-align: right; }
        .px-lower {
          position: relative;
          isolation: isolate;
          padding: 40px 0 72px;
        }
        .px-lower-head { max-width: 760px; margin-bottom: 24px; }
        .px-eyebrow {
          color: var(--px-warm);
          font-size: 12px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: .08em;
          margin: 0 0 6px;
        }
        .px-lower-head h2 {
          margin: 0;
          background: linear-gradient(90deg, hsl(var(--foreground)), var(--px-primary) 48%, var(--px-warm));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-family: "Space Grotesk", "Avenir Next", "Segoe UI", system-ui, sans-serif;
          font-size: clamp(28px, 4vw, 42px);
          line-height: 1.1;
          letter-spacing: -0.01em;
        }
        .px-lower-head p:not(.px-eyebrow) { margin: 12px 0 0; color: hsl(var(--muted-foreground)); font-size: 16px; line-height: 1.7; }
        .px-summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; padding: 0; }
        @media (max-width: 768px) {
          .px-summary { grid-template-columns: repeat(2, 1fr); }
        }
        .px-fact {
          position: relative;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--px-primary) 22%, hsl(var(--border)));
          border-radius: 14px;
          background: hsl(var(--card));
          padding: 16px;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.04);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }
        .px-fact::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 3.5px; background: linear-gradient(90deg, var(--px-primary), #f2be4e, var(--px-warm)); opacity: .85; }
        .px-fact:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08); }
        .px-fact span { display: block; color: hsl(var(--muted-foreground)); font-size: 12px; font-weight: 750; }
        .px-fact strong { display: block; margin-top: 4px; color: hsl(var(--foreground)); font-family: "IBM Plex Mono", monospace; font-size: 14px; }
        .px-layout { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 24px; align-items: start; padding: 24px 0 0; }
        @media (max-width: 960px) {
          .px-layout { grid-template-columns: 1fr; }
        }
        .px-main, .px-side { display: flex; flex-direction: column; gap: 20px; }
        .px-card, .px-side-card {
          border: 1px solid hsl(var(--border));
          border-radius: 18px;
          background: hsl(var(--card));
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.05);
        }
        .px-card { padding: clamp(20px, 3.5vw, 32px); }
        .px-side-card { padding: 22px; }
        .px-card-feature { display: grid; grid-template-columns: 60px minmax(0, 1fr); gap: 18px; }
        @media (max-width: 600px) {
          .px-card-feature { grid-template-columns: 1fr; gap: 12px; }
        }
        .px-card-index {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, var(--px-primary), var(--px-secondary));
          color: white;
          font-family: "IBM Plex Mono", monospace;
          font-size: 20px;
          font-weight: 900;
          box-shadow: 0 10px 24px color-mix(in srgb, var(--px-primary) 32%, transparent);
        }
        .px-card-feature h2 { margin: 0 0 10px; font-size: 22px; font-weight: 850; color: hsl(var(--foreground)); }
        .px-theory-body { color: hsl(var(--muted-foreground)); font-size: 15px; line-height: 1.75; }
        .px-formula-panel {
          margin-top: 16px;
          border: 1px solid color-mix(in srgb, var(--px-primary) 28%, hsl(var(--border)));
          border-radius: 14px;
          background: color-mix(in srgb, var(--px-primary) 6%, hsl(var(--card)));
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .px-formula-panel span { color: hsl(var(--muted-foreground)); font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }
        .px-formula-panel strong { color: var(--px-primary); font-family: "IBM Plex Mono", monospace; font-size: 15px; word-break: break-all; }
        
        /* FAQs */
        .px-faq-card { padding: 28px; }
        .px-section-title { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 18px; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 12px; }
        .px-section-title h2 { margin: 0; font-size: 22px; font-weight: 850; color: hsl(var(--foreground)); }
        .px-faq-count { font-size: 12px; font-weight: 800; color: var(--px-warm); background: color-mix(in srgb, var(--px-warm) 16%, transparent); padding: 4px 10px; border-radius: 999px; }
        .px-faqs { display: flex; flex-direction: column; gap: 10px; }
        .px-faq-item { border: 1px solid hsl(var(--border)); border-radius: 12px; overflow: hidden; background: hsl(var(--card)); transition: all 180ms ease; }
        .px-faq-open { border-color: var(--px-primary); box-shadow: 0 8px 20px color-mix(in srgb, var(--px-primary) 12%, transparent); }
        .px-faq-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
        }
        .px-faq-question-wrap { display: flex; align-items: center; gap: 12px; }
        .px-faq-number { font-family: monospace; font-size: 13px; font-weight: 800; color: var(--px-warm); }
        .px-faq-question-wrap h3 { margin: 0; font-size: 15px; font-weight: 750; color: hsl(var(--foreground)); }
        .px-faq-icon { color: hsl(var(--muted-foreground)); transition: transform 200ms ease; shrink: 0; }
        .px-icon-rotated { transform: rotate(180deg); color: var(--px-primary); }
        .px-faq-answer { padding: 0 16px 16px 42px; color: hsl(var(--muted-foreground)); font-size: 14px; line-height: 1.65; }
        
        /* Aside */
        .px-launch-card {
          background: linear-gradient(135deg, hsl(var(--card)), color-mix(in srgb, var(--px-primary) 14%, hsl(var(--card))));
          border: 1px solid color-mix(in srgb, var(--px-primary) 30%, hsl(var(--border)));
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
        }
        .px-launch-card .px-eyebrow { color: var(--px-warm); }
        .px-launch-card h2 { margin: 0 0 8px; font-size: 20px; font-weight: 850; color: hsl(var(--foreground)); }
        .px-launch-card p:not(.px-eyebrow) { margin: 0 0 16px; color: hsl(var(--muted-foreground)); font-size: 13px; line-height: 1.6; }
        .px-launch-card .px-side-link {
          width: 100%;
          background: linear-gradient(135deg, var(--px-primary), var(--px-secondary));
          color: white;
        }
        .px-side-card h2 { margin: 0 0 12px; font-size: 17px; font-weight: 850; color: hsl(var(--foreground)); }
        .px-objectives-list, .px-applications-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: hsl(var(--muted-foreground)); }
        .px-objectives-list li, .px-applications-list li { display: flex; gap: 10px; align-items: flex-start; line-height: 1.5; }
        .px-bullet-icon { color: var(--px-primary); flex-shrink: 0; margin-top: 2px; }
        .px-bullet-icon-arrow { color: var(--px-warm); flex-shrink: 0; margin-top: 3px; }
      `}</style>
    </>
  );
}
