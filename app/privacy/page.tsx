import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  Cookie,
  FileText,
  Mail,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Globe,
  Database,
  UserCheck,
} from "lucide-react";

export const revalidate = 86400; // 24 hours ISR Edge CDN cache

export const metadata: Metadata = {
  title: "Privacy Policy | OpenLabs",
  description:
    "OpenLabs Privacy Policy detailing data collection, cookie usage, Google AdSense disclosures, third-party analytics, user rights, and GDPR/CCPA compliance.",
  alternates: {
    canonical: "https://www.openlabs.org.in/privacy",
  },
  openGraph: {
    title: "Privacy Policy | OpenLabs",
    description:
      "Understand how OpenLabs protects learner privacy, manages cookies, and complies with international privacy standards.",
    url: "https://www.openlabs.org.in/privacy",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 20, 2026";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy | OpenLabs",
    url: "https://www.openlabs.org.in/privacy",
    description: "OpenLabs Privacy Policy and Cookie Disclosures.",
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
            <ShieldCheck size={14} />
            <span>Transparency & Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Effective & Last Updated: <span className="font-semibold text-foreground">{lastUpdated}</span>
          </p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            At OpenLabs (accessible from{" "}
            <Link href="/" className="text-primary hover:underline font-semibold">
              https://www.openlabs.org.in
            </Link>
            ), the privacy of our students, educators, and visitors is of paramount importance. This Privacy Policy outlines the types of information collected and recorded by OpenLabs, how it is used, and the choices you have regarding your personal data.
          </p>
        </div>

        {/* Section 1: Google AdSense & Advertising Cookies */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 text-foreground font-black text-lg">
            <Cookie className="text-primary h-5 w-5" />
            <h2>1. Google AdSense & Third-Party Advertising Disclosures</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Google is a third-party vendor on our site. Google uses cookies, specifically the DoubleClick DART cookie, to serve advertisements to visitors of OpenLabs based upon their visit to{" "}
            <span className="font-semibold text-foreground">openlabs.org.in</span> and other sites on the Internet.
          </p>
          <div className="space-y-2.5 bg-muted/40 rounded-xl p-4 border border-border/60 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Personalized & Non-Personalized Ads:</strong> Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their prior visits to OpenLabs and/or other websites.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Opting Out of DART Cookies:</strong> Visitors may opt out of the use of the DART cookie and personalized advertising by visiting the Google Ad and Content Network Privacy Policy at{" "}
                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  Google Ads Settings <ExternalLink size={12} />
                </a>
                .
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Third-Party Vendor Disclosures:</strong> Other third-party ad networks (such as Adsterra) may also place cookies, web beacons, or scripts on public pages. You may opt out of personalized third-party cookies at{" "}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  www.aboutads.info <ExternalLink size={12} />
                </a>{" "}
                or the Network Advertising Initiative at{" "}
                <a
                  href="https://optout.networkadvertising.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  optout.networkadvertising.org <ExternalLink size={12} />
                </a>
                .
              </span>
            </div>
          </div>
        </section>

        {/* Section 2: Interactive Simulation Workspaces Protection */}
        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-foreground font-black text-lg">
            <Lock className="text-primary h-5 w-5" />
            <h2>2. Interactive Laboratory Workspaces Protection Guarantee</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            OpenLabs maintains a strict multi-layer architectural shield separating interactive educational simulation runtimes from advertising technology. All interactive virtual lab routes under{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-xs">/labs/*</code>, administrative panels under{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-xs">/admin/*</code>, and account authentication forms (login, signup) are 100% hard-suppressed from advertising scripts, popunders, and tracking overlays. Your simulation data, parameter calculations, and scientific workflows remain completely unencumbered by ad technology.
          </p>
        </section>

        {/* Section 3: Information We Collect */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 text-foreground font-black text-lg">
            <Database className="text-primary h-5 w-5" />
            <h2>3. Information We Collect</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We collect information only to deliver, enhance, and personalize your science learning experience:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl border border-border/70 bg-muted/30 space-y-2">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <UserCheck size={16} className="text-primary" />
                Account & Profile Information
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                When you create an account, we collect your name, email address, password hash, and optional profile data (username, avatar, bio). For OAuth sign-ins (Google, GitHub), we receive verified authentication tokens and email addresses from the identity provider.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border/70 bg-muted/30 space-y-2">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Globe size={16} className="text-primary" />
                Learning Progress & XP Gamification
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                We track completed laboratory simulations, experiment milestones, earned experience points (XP), daily challenge completions, learning streaks, and badges to display on your student dashboard and global leaderboard.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border/70 bg-muted/30 space-y-2">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                Technical & Device Telemetry
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                To guarantee 60 FPS WebGL simulation performance, our first-party Real User Monitoring (RUM) engine collects browser type, viewport dimensions, hardware concurrency, Core Web Vitals (LCP, FCP, CLS, INP), and general geographic country derived from proxy IP headers.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border/70 bg-muted/30 space-y-2">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                Communications & Feedback
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                When you contact support, submit lab feedback, or request new simulation topics, we record your message, star rating, and provided contact information to troubleshoot and improve our curriculums.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Analytics & Performance Services */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 text-foreground font-black text-lg">
            <Eye className="text-primary h-5 w-5" />
            <h2>4. Analytics Services & Telemetry Governance</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            OpenLabs utilizes privacy-governed analytics solutions to understand user engagement and detect simulation errors:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>
                <strong className="text-foreground">Google Analytics 4:</strong> Collects aggregated, pseudonymized traffic patterns and session milestones.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>
                <strong className="text-foreground">Microsoft Clarity:</strong> Analyzes behavioral interaction patterns (heatmaps, scroll depth, rage-clicks) with automatic masking of all sensitive input fields.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>
                <strong className="text-foreground">OpenLabs RUM Engine:</strong> Internal telemetry throttled to 120s intervals with an initial 30s milestone to prevent excessive compute overhead and serverless resource consumption.
              </span>
            </li>
          </ul>
        </section>

        {/* Section 5: User Rights & Data Protection (GDPR / CCPA) */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 text-foreground font-black text-lg">
            <ShieldCheck className="text-primary h-5 w-5" />
            <h2>5. Your Rights Under GDPR & CCPA</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Regardless of your geographic location, OpenLabs grants you comprehensive control over your personal data:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-muted-foreground">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
              <strong className="text-foreground block mb-1">Right to Access:</strong>
              You may request copies of your personal information and learning history.
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
              <strong className="text-foreground block mb-1">Right to Rectification:</strong>
              You may request that we correct inaccurate or incomplete profile data.
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
              <strong className="text-foreground block mb-1">Right to Erasure (&quot;Right to be Forgotten&quot;):</strong>
              You may request that we delete your account and associated learning records.
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
              <strong className="text-foreground block mb-1">Right to Restrict Processing:</strong>
              You may object to or limit specific automated data processing activities.
            </div>
          </div>
        </section>

        {/* Section 6: Children's Privacy */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-foreground font-black text-lg">
            <AlertCircle className="text-primary h-5 w-5" />
            <h2>6. Children&apos;s Online Privacy Protection (COPPA Compliance)</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            OpenLabs is an educational platform intended for students, educators, and science enthusiasts. We do not knowingly collect personal identifiable information from children under the age of 13 without parental or educational institution consent. If you believe your child has provided personal data on our website, please contact us immediately, and we will promptly remove such information from our databases.
          </p>
        </section>

        {/* Section 7: Contact Information */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 text-foreground font-black text-lg">
            <Mail className="text-primary h-5 w-5" />
            <h2>7. Contacting Us Regarding Privacy</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            If you have questions, concerns, or requests regarding this Privacy Policy or wish to exercise your data rights, please contact our Data Governance team:
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
              <span>Visit Contact & Support Page</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
