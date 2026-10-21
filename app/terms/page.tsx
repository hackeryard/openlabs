import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  Scale,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Mail,
  GraduationCap,
  Atom,
} from "lucide-react";

export const revalidate = 86400; // 24 hours ISR Edge CDN cache

export const metadata: Metadata = {
  title: "Terms of Service | OpenLabs",
  description:
    "OpenLabs Terms of Service governing platform usage, educational simulation disclaimers, intellectual property, student accounts, and code of conduct.",
  alternates: {
    canonical: "https://www.openlabs.org.in/terms",
  },
  openGraph: {
    title: "Terms of Service | OpenLabs",
    description:
      "Review the Terms of Service for using OpenLabs virtual laboratories, learning tracks, and interactive scientific visualizers.",
    url: "https://www.openlabs.org.in/terms",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServicePage() {
  const lastUpdated = "October 20, 2026";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms of Service | OpenLabs",
    url: "https://www.openlabs.org.in/terms",
    description: "OpenLabs Terms of Service and Platform Usage Conditions.",
    publisher: {
      "@type": "EducationalOrganization",
      name: "OpenLabs",
      url: "https://www.openlabs.org.in",
    },
  };

  return (
    <main className="min-h-screen bg-background text-foreground py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-4 border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <Scale size={14} />
            <span>Platform Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Effective & Last Updated: <span className="font-semibold text-foreground">{lastUpdated}</span>
          </p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Welcome to OpenLabs. These Terms of Service (&quot;Terms&quot;) govern your access to and use of the OpenLabs website, interactive simulations, curriculum tracks, gamification services, and AI educational assistants (collectively, the &quot;Platform&quot;). By accessing or using OpenLabs, you agree to be bound by these Terms.
          </p>
        </div>

        {/* Section 1: Educational Purpose & Simulation Disclaimers */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 text-foreground font-black text-lg">
            <Atom className="text-primary h-5 w-5" />
            <h2>1. Educational Purpose & Scientific Modeling Disclaimer</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            OpenLabs is engineered exclusively for academic, instructional, and exploratory STEM education. Our in-browser simulations utilize continuous mathematical algorithms, Runge-Kutta numerical solvers (RK4), kinematics equations, and differential equations to model physical, chemical, and biological phenomena.
          </p>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs sm:text-sm text-amber-900 dark:text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
              <span>Important Scientific & Safety Notice:</span>
            </div>
            <p className="text-xs leading-relaxed">
              Virtual laboratory simulations are theoretical pedagogical representations. They are not intended to replace certified industrial engineering tolerances, physical hazardous materials protocols, medical diagnostic procedures, or laboratory safety standards. Always follow official laboratory protocols and teacher supervision in physical laboratory environments.
            </p>
          </div>
        </section>

        {/* Section 2: User Accounts & Acceptable Use */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 text-foreground font-black text-lg">
            <ShieldCheck className="text-primary h-5 w-5" />
            <h2>2. User Accounts & Acceptable Use Policy</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            When creating an account on OpenLabs, you agree to:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <span>Provide accurate and complete registration information and maintain password security.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <span>Use the platform solely for lawful academic, classroom, and individual learning purposes.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <span>Refrain from launching automated denial-of-service attacks, reverse engineering proprietary license gates, or scraping student telemetry.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <span>Maintain respectful and constructive dialogue when submitting feedback, inquiries, or community forum posts.</span>
            </li>
          </ul>
        </section>

        {/* Section 3: Intellectual Property */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 text-foreground font-black text-lg">
            <BookOpen className="text-primary h-5 w-5" />
            <h2>3. Intellectual Property Rights</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            All proprietary simulation engines, user interfaces, branding assets, 3D models, graphics, and curriculum text on OpenLabs are the intellectual property of OpenLabs and its licensors, protected by copyright and international intellectual property laws.
          </p>
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs sm:text-sm text-muted-foreground space-y-2">
            <h3 className="font-bold text-foreground">Permitted Educational Fair Use:</h3>
            <p className="text-xs leading-relaxed">
              Educators, schools, and students are granted a non-exclusive, non-transferable, royalty-free license to project, screen-share, and utilize OpenLabs simulations in physical classrooms, virtual lessons, academic homework assignments, and science fairs without fees or subscription requirements.
            </p>
          </div>
        </section>

        {/* Section 4: Advertising, Third-Party Links & Monetization */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-foreground font-black text-lg">
            <FileText className="text-primary h-5 w-5" />
            <h2>4. Advertising & Third-Party Service Integrations</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            To keep OpenLabs 100% free for students worldwide without charging subscriptions, we display authorized advertisements on public discovery pages via Google AdSense and partner networks in compliance with our{" "}
            <Link href="/privacy" className="text-primary hover:underline font-semibold">
              Privacy Policy
            </Link>
            . We are not responsible for the content, privacy practices, or accuracy of third-party external websites linked to or advertised on our pages.
          </p>
        </section>

        {/* Section 5: Limitation of Liability */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-foreground font-black text-lg">
            <Scale className="text-primary h-5 w-5" />
            <h2>5. Disclaimer of Warranties & Limitation of Liability</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            OpenLabs is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. In no event shall OpenLabs or its contributors be liable for any direct, indirect, incidental, or consequential damages resulting from your use of or inability to access the platform.
          </p>
        </section>

        {/* Section 6: Contact Information */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 text-foreground font-black text-lg">
            <Mail className="text-primary h-5 w-5" />
            <h2>6. Legal Inquiries & Contact</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            For questions regarding these Terms of Service, institutional partnerships, or licensing inquiries, please contact our team:
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <a
              href="mailto:support@openlabs.org.in"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-md hover:bg-primary/90 transition-all"
            >
              <Mail size={14} />
              <span>Email: support@openlabs.org.in</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted font-bold text-xs sm:text-sm transition-all"
            >
              <span>Visit Contact Page</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
