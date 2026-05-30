"use client";

import React, { useState } from "react";
import Link from "next/link";
import { EducationalContent } from "@/types/education";
import SchemaMarkup from "./SchemaMarkup";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  content: EducationalContent;
  launchUrl: string;
}

export default function EducationalLandingLayout({ content, launchUrl }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* JSON-LD Schemas */}
      <SchemaMarkup
        title={content.title}
        description={content.description}
        url={`https://www.openlabs.org.in/${content.subject.toLowerCase()}/${content.slug}`}
        subject={content.subject}
        faqs={content.faqs}
      />

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-4">
            {content.subject} • {content.difficulty} • {content.estimatedTime}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {content.heroDescription}
          </p>
          <Link
            href={launchUrl}
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-lg shadow-sm hover:shadow-md transition-all text-lg"
          >
            Launch Interactive Lab
          </Link>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          {/* Quick Summary / Theory */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">What is it? (Theory & Background)</h2>
            <div className="prose prose-indigo max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: content.theory.content }} />
          </div>

          {/* Mathematical Foundations */}
          {content.mathematicalFoundations && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Mathematical Foundations</h2>
              <p className="text-gray-700 mb-4">{content.mathematicalFoundations.explanation}</p>
              <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                {content.mathematicalFoundations.equations.map((eq, idx) => (
                  <div key={idx} className="text-lg font-mono text-center text-gray-800 my-2">
                    {eq}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How The Simulation Works */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">How The Simulation Works</h2>
            <div className="prose prose-indigo max-w-none text-gray-700">
              {content.howItWorks}
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {content.faqs.map((faq, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === idx ? "rotate-180" : ""}`}
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
                        <div className="px-6 pb-4 pt-2 text-gray-600">
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

        {/* Sidebar */}
        <div className="md:col-span-1 space-y-8">
          {/* Learning Objectives */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Objectives</h3>
            <ul className="space-y-3">
              {content.learningObjectives.map((obj, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span className="text-gray-700 text-sm">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Real World Applications */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Real World Applications</h3>
            <ul className="space-y-3">
              {content.realWorldApplications.map((app, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  <span className="text-gray-700 text-sm">{app}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Experiments */}
          {content.relatedExperiments.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Related Labs</h3>
              <div className="space-y-4">
                {content.relatedExperiments.map((exp, idx) => (
                  <Link href={exp.href} key={idx} className="block group">
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {exp.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {exp.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
