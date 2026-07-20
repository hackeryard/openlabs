import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ChevronDown } from 'lucide-react'
import Hero from './components/Hero'
import ProfileSetupBannerClient from '../components/ProfileSetupBannerClient'
import AnimatedCard from '../components/ui/AnimatedCard'

export const metadata: Metadata = {
  title: 'OpenLabs Virtual Labs for Interactive STEM Learning',
  description: 'Use OpenLabs to explore interactive virtual labs for physics, chemistry, biology, and computer science with guided simulations for students and teachers.',
  keywords: [
    'science education', 'interactive learning', 'virtual labs', 'STEM education',
    'physics labs', 'chemistry experiments', 'biology simulations', 'computer science tools',
    'educational platform', 'online learning'
  ],
  openGraph: {
    title: 'OpenLabs Virtual Labs for Interactive STEM Learning',
    description: 'Explore guided virtual labs in physics, chemistry, biology, and computer science.',
    url: '/',
    type: 'website',
    images: [
      {
        url: '/images/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'OpenLabs interactive virtual lab learning platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/twitter-image.svg'],
    title: 'OpenLabs Virtual Labs for Interactive STEM Learning',
    description: 'Explore guided virtual labs in physics, chemistry, biology, and computer science.',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  applicationName: "OpenLabs",
}

// 1. Centralized FAQ Data for UI and Schema
const faqsData = [
  {
    q: "What is OpenLabs and who is it for?",
    a: "OpenLabs is a virtual lab and learning platform for students, teachers, and self-learners who want interactive, experiment-led learning in science and technology."
  },
  {
    q: "Do I need any special software to use the labs?",
    a: "No special software is required. Labs run directly in modern web browsers on desktop or tablet devices. Some advanced 3D modules may perform best on recently updated browsers."
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

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.openlabs.org.in/#webpage",
  url: "https://www.openlabs.org.in/",
  name: "OpenLabs Virtual Labs for Interactive STEM Learning",
  description: metadata.description,
  isPartOf: {
    "@type": "WebSite",
    "@id": "https://www.openlabs.org.in/#website",
    name: "OpenLabs",
    url: "https://www.openlabs.org.in/",
  },
  about: [
    "Virtual labs",
    "Physics simulations",
    "Chemistry experiments",
    "Biology learning",
    "Computer science tools",
  ],
  audience: {
    "@type": "EducationalAudience",
    educationalRole: ["student", "teacher", "self-learner"],
  },
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
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-indigo-100 selection:text-indigo-900 antialiased overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Client-only banner component */}
      <ProfileSetupBannerClient />
      <Hero />
      <div className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-6xl mx-auto space-y-32 z-10">
          <section className="flex flex-col md:flex-row gap-12 lg:gap-24 items-center max-w-5xl mx-auto">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.15]">
                Hands-on learning, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500">
                  without the physical limits.
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
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
                <AnimatedCard
                  key={i}
                  delay={i * 0.08}
                  className="group flex items-start gap-4 p-5 backdrop-blur-sm"
                >
                  <div className="mt-0.5 bg-primary/10 rounded-full p-1 group-hover:bg-primary/20 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  </div>
                  <p className="text-[0.95rem] font-semibold text-foreground leading-snug">{feature}</p>
                </AnimatedCard>
              ))}
            </div>
          </section>
          <section id="faqs" className="max-w-5xl mx-auto pb-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 items-start">
            <div className="md:col-span-1 md:sticky md:top-24">
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-lg">
                Everything you need to know about the OpenLabs platform.
              </p>
            </div>
            <div className="md:col-span-2 space-y-4">
              {faqsData.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-2xl bg-card border border-border/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden open:border-indigo-200 open:shadow-md transition-all duration-300"
                >
                  <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset rounded-2xl">
                    <span className="font-semibold text-foreground text-[1.05rem] group-hover:text-indigo-600 transition-colors pr-6">
                      {faq.q}
                    </span>
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center group-open:bg-primary/10 group-open:border-primary/20 group-hover:bg-accent transition-colors">
                      <ChevronDown className="w-4 h-4 text-muted-foreground group-open:text-indigo-600 group-open:rotate-180 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-1 text-muted-foreground leading-relaxed border-t border-border mt-1">
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
