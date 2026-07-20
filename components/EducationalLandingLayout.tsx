"use client";

import React, { useState } from "react";
import Link from "next/link";
import { EducationalContent } from "@/types/education";
import SchemaMarkup from "./SchemaMarkup";
import { 
  ChevronDown, 
  ArrowLeft, 
  ArrowRight, 
  FlaskConical, 
  Activity, 
  Gauge, 
  Milestone, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  Info,
  Compass
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  content: EducationalContent;
  launchUrl: string;
}

export default function EducationalLandingLayout({ content, launchUrl }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const subjectSlug = content.subject.toLowerCase().replace(/\s+/g, "-");

  const defaultObjectivesBySubject: Record<string, string[]> = {
    chemistry: [
      "Model 3D electron shell fields.",
      "Measure electronegativity deltas.",
      "Solve valency lattice challenges."
    ],
    physics: [
      "Observe core physical variables in real time.",
      "Apply laws and formulas to measurable outcomes.",
      "Compare simulated predictions with expected results."
    ],
    biology: [
      "Explore structures and functions of biological systems.",
      "Track interactions between cells, tissues, and processes.",
      "Connect observations to real-world life science scenarios."
    ],
    "computer-science": [
      "Trace logic flow and algorithm behavior step by step.",
      "Measure performance and complexity trade-offs.",
      "Experiment with structures and systems in a safe sandbox."
    ]
  };

  const telemetryObjectives = defaultObjectivesBySubject[subjectSlug] ?? [
    "Explore key concepts using an interactive simulation.",
    "Observe system behavior under different conditions.",
    "Build intuition through guided experimentation."
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <main className="min-h-screen text-foreground pb-20 pt-8 font-sans relative overflow-hidden bg-[radial-gradient(hsl(var(--border))_1.5px,transparent_1.5px)] bg-[size:24px_24px]">
      {/* Dynamic ambient glowing background spheres */}
      <div className="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* JSON-LD Schemas */}
      <SchemaMarkup
        title={content.title}
        description={content.description}
        url={`https://www.openlabs.org.in/${content.subject.toLowerCase()}/${content.slug}`}
        subject={content.subject}
        faqs={content.faqs}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition font-medium">Home</Link>
          <span>/</span>
          <Link href={`/${subjectSlug}`} className="hover:text-foreground transition font-medium">{content.subject}</Link>
          <span>/</span>
          <span className="text-indigo-600 font-bold">{content.title}</span>
        </nav>

        {/* 1. Dynamic 2-Column Hero Section Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-card border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          
          {/* Left Column: Title copywriting & launch button */}
          <div className="lg:col-span-7 text-left space-y-6">
            <span className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider shadow-sm">
              <FlaskConical className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
              {content.subject} • {content.difficulty} • {content.estimatedTime}
            </span>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-none">
              {content.title} <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">Sandbox</span>
            </h1>
            
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-medium">
              {content.heroDescription}
            </p>

            <div className="pt-2">
              <Link
                href={launchUrl}
                className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:scale-[1.02] active:scale-[0.98] text-white font-extrabold py-4 px-8 rounded-2xl transition shadow-lg shadow-indigo-500/25 text-base"
              >
                Launch Interactive Lab
              </Link>
            </div>
          </div>

          {/* Right Column: Laboratory Telemetry Cockpit indicator */}
          <div className="lg:col-span-5 bg-muted border border-border/80 rounded-2xl p-6 shadow-inner flex flex-col justify-between text-left space-y-5">
            <div className="flex justify-between items-center text-muted-foreground font-mono text-[9px] font-bold uppercase tracking-wider">
              <span>Telemetry Cockpit</span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Simulator
              </span>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-extrabold text-foreground text-sm">Target Objectives</h4>
              <ul className="space-y-2 text-xs text-muted-foreground font-medium">
                {telemetryObjectives.map((objective, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {objective}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-[9px] font-mono text-muted-foreground border-t border-border pt-3 flex justify-between items-center">
              <span>Framework: HTML5 / WebGL</span>
              <span className="text-indigo-600 font-bold">OpenLabs Sandbox</span>
            </div>
          </div>
        </section>

        {/* 2. Main Content Grid Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Monograph & FAQ Details (Left side - lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Theory Card */}
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-md">
              <h2 className="text-xl md:text-2xl font-black text-foreground mb-4 border-b border-border pb-2.5 flex items-center gap-2.5">
                <BookOpen className="h-5 w-5 text-indigo-500" /> Theory & Core Foundations
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground text-sm md:text-base leading-relaxed font-medium space-y-4" dangerouslySetInnerHTML={{ __html: content.theory.content }} />
            </div>

            {/* Mathematical Foundations Card */}
            {content.mathematicalFoundations && (
              <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-md space-y-4">
                <h2 className="text-xl md:text-2xl font-black text-foreground border-b border-border pb-2.5 flex items-center gap-2.5">
                  <Activity className="h-5 w-5 text-indigo-500" /> Mathematical Foundations
                </h2>
                <p className="text-muted-foreground text-sm md:text-base font-medium leading-relaxed">
                  {content.mathematicalFoundations.explanation}
                </p>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl overflow-x-auto shadow-inner text-left font-mono">
                  {content.mathematicalFoundations.equations.map((eq, idx) => (
                    <div key={idx} className="text-xs sm:text-sm text-emerald-400 font-bold my-2 pl-2 border-l-2 border-emerald-500/50">
                      {eq}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How The Simulation Works */}
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-md">
              <h2 className="text-xl md:text-2xl font-black text-foreground mb-4 border-b border-border pb-2.5 flex items-center gap-2.5">
                <Gauge className="h-5 w-5 text-indigo-500" /> How The Simulation Works
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                {content.howItWorks}
              </p>
            </div>

            {/* FAQs Accordion section */}
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-md space-y-6">
              <h2 className="text-xl md:text-2xl font-black text-foreground border-b border-border pb-2.5 flex items-center gap-2.5">
                <Info className="h-5 w-5 text-indigo-500" /> Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {content.faqs.map((faq, idx) => (
                  <div key={idx} className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm hover:shadow transition duration-200">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-muted/50 focus:outline-none"
                    >
                      <span className="font-extrabold text-foreground text-sm md:text-base">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openFaq === idx ? "rotate-180 text-indigo-600" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {openFaq === idx && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 pt-1 text-muted-foreground text-xs md:text-sm font-medium border-t border-border leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar details (Right side - lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col space-y-6 w-full">
            
            {/* Learning Objectives */}
            <div className="bg-card p-6 rounded-3xl border border-border shadow-md">
              <h3 className="text-base font-black text-foreground mb-4 border-b border-border pb-2.5 uppercase tracking-wide">
                Learning Objectives
              </h3>
              <ul className="space-y-3.5">
                {content.learningObjectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-muted-foreground text-xs font-medium">
                    <span className="text-indigo-500 text-sm font-bold">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Real World Applications */}
            <div className="bg-card p-6 rounded-3xl border border-border shadow-md">
              <h3 className="text-base font-black text-foreground mb-4 border-b border-border pb-2.5 uppercase tracking-wide">
                Real World Applications
              </h3>
              <ul className="space-y-3.5">
                {content.realWorldApplications.map((app, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-muted-foreground text-xs font-medium">
                    <span className="text-emerald-500 text-sm font-bold">✓</span>
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Experiments */}
            {content.relatedExperiments.length > 0 && (
              <div className="bg-card p-6 rounded-3xl border border-border shadow-md">
                <h3 className="text-base font-black text-foreground mb-4 border-b border-border pb-2.5 uppercase tracking-wide">
                  Related Laboratories
                </h3>
                <div className="space-y-4">
                  {content.relatedExperiments.map((exp, idx) => (
                    <Link href={exp.href} key={idx} className="block group border border-border rounded-2xl p-4 bg-muted hover:bg-card hover:border-indigo-200 transition-all duration-300">
                      <h4 className="text-xs font-extrabold text-foreground group-hover:text-indigo-600 transition-colors">
                        {exp.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed font-medium">
                        {exp.description}
                      </p>
                      <div className="text-[9px] font-black text-indigo-600 mt-3.5 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore Lab <ArrowRight className="h-3 w-3" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

        </section>

      </div>
    </main>
  );
}
