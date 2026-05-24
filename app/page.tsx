import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ChevronDown, Atom, FlaskConical, Dna, Code2, Calculator } from 'lucide-react'
import Hero from './components/Hero'
import ProfileSetupBannerClient from '../components/ProfileSetupBannerClient'

export const metadata: Metadata = {
  title: 'OpenLabs - Virtual Lab Experience Platform for Science & Technology',
  description: 'Welcome to OpenLabs - A gateway to interactive science and technology education. Explore virtual labs in physics, chemistry, biology and computer science.',
  keywords: [
    'science education', 'interactive learning', 'virtual labs', 'STEM education',
    'physics labs', 'chemistry experiments', 'biology simulations', 'computer science tools',
    'mathematics interactive', 'educational platform', 'online learning'
  ],
  openGraph: {
    title: 'OpenLabs - Interactive Science & Technology Learning',
    description: 'Explore virtual labs in physics, chemistry, biology, computer science, and mathematics.',
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/twitter-image.svg'],
    title: 'OpenLabs - Interactive Science & Technology Learning',
    description: 'Explore virtual labs in physics, chemistry, biology, computer science, and mathematics.',
  },
  alternates: {
    canonical: '/',
  },
}

// 1. Centralized FAQ Data for UI and Schema
const faqsData = [
  {
    q: "What is OpenLabs and who is it for?",
    a: "OpenLabs is a virtual lab and learning platform for students, teachers, and self-learners who want interactive, experiment-led learning in science, technology, and mathematics."
  },
  {
    q: "Do I need any special software to use the labs?",
    a: "No special software is required — labs run directly in modern web browsers on desktop or tablet devices. Some advanced 3D modules may perform best on recently updated browsers."
  },
  {
    q: "Are the experiments safe to run at home?",
    a: "Yes. All experiments are virtual simulations designed to safely replicate real lab concepts without the need for physical materials, chemicals, or associated hazards."
  },
  {
    q: "Can teachers use OpenLabs in the classroom?",
    a: "Absolutely. OpenLabs includes guided lab sheets, assessment tools, and classroom-ready modules specifically designed to support lesson plans and remote learning environments."
  }
];

// 2. Generate JSON-LD Schema
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqsData.map(faq => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.a
    }
  }))
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] selection:bg-indigo-100 selection:text-indigo-900 antialiased overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Client-only banner component */}
      <script dangerouslySetInnerHTML={{ __html: "" }} />
      <ProfileSetupBannerClient />
      <Hero />
      <div className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-6xl mx-auto space-y-32 z-10">
          <section className="flex flex-col md:flex-row gap-12 lg:gap-24 items-center max-w-5xl mx-auto">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Hands-on learning, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500">
                  without the physical limits.
                </span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                OpenLabs is a hands-on virtual lab platform built for students and educators who want interactive, practical experience in science and technology. Our platform provides guided simulations, real-time visualizations, and project-based learning.
              </p>
            </div>
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Run interactive experiments safely online.",
                "Follow step-by-step lab guides and detailed explanations.",
                "Complete assessments, coding exercises, and mini-projects.",
                "Track progress and build a learning portfolio."
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-4 p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="mt-0.5 bg-indigo-50/80 rounded-full p-1 group-hover:bg-indigo-100 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  </div>
                  <p className="text-[0.95rem] font-semibold text-slate-700 leading-snug">{feature}</p>
                </div>
              ))}
            </div>
          </section>
          <section id="faqs" className="max-w-5xl mx-auto pb-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 items-start">
            <div className="md:col-span-1 md:sticky md:top-24">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-500 text-lg">
                Everything you need to know about the OpenLabs platform.
              </p>
            </div>
            <div className="md:col-span-2 space-y-4">
              {faqsData.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-2xl bg-white border border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden open:border-indigo-200 open:shadow-md transition-all duration-300"
                >
                  <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset rounded-2xl">
                    <span className="font-semibold text-slate-800 text-[1.05rem] group-hover:text-indigo-600 transition-colors pr-6">
                      {faq.q}
                    </span>
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-open:bg-indigo-50 group-open:border-indigo-100 group-hover:bg-slate-100 transition-colors">
                      <ChevronDown className="w-4 h-4 text-slate-400 group-open:text-indigo-600 group-open:rotate-180 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-1 text-slate-600 leading-relaxed border-t border-slate-50 mt-1">
                    <p>{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}