import React from "react";
import type { Metadata } from "next";
import {
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Beaker,
  CheckCircle2,
  Globe,
  Radio,
} from "lucide-react";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact OpenLabs - Support & Feedback",
  description:
    "Contact the OpenLabs team for support, bug reports, simulation feature requests, school partnerships, and virtual STEM lab assistance.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact OpenLabs - Support, Bug Reports, and Partnerships",
    description:
      "Reach the OpenLabs engineering and education team for questions, feedback, and collaborations on free interactive STEM simulations.",
    url: "/contact",
    type: "website",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Contact OpenLabs support and engineering team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact OpenLabs - Support, Bug Reports, and Partnerships",
    description:
      "Reach the OpenLabs engineering and education team for questions, feedback, and collaborations on free interactive STEM simulations.",
    images: ["/images/twitter-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const contactInfo = [
  {
    icon: Mail,
    title: "Direct Email Support",
    detail: "support@openlabs.org.in",
    subtitle: "We respond within 24 business hours",
    gradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
    iconColor: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    href: "mailto:support@openlabs.org.in",
  },
  {
    icon: Beaker,
    title: "Lab Feedback & Requests",
    detail: "50+ Virtual Labs",
    subtitle: "Suggest new Physics, Chem, Bio, Math & CS labs",
    gradient: "from-purple-500/10 via-pink-500/5 to-transparent",
    iconColor: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    href: "#contact-form",
  },
  {
    icon: GraduationCap,
    title: "Educators & Institutions",
    detail: "Classroom Integrations",
    subtitle: "Curriculum alignment & institutional access",
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    href: "#contact-form",
  },
];

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": "https://www.openlabs.org.in/contact#webpage",
  url: "https://www.openlabs.org.in/contact",
  name: "Contact OpenLabs",
  description: metadata.description,
  isPartOf: {
    "@type": "WebSite",
    "@id": "https://www.openlabs.org.in/#website",
    name: "OpenLabs",
    url: "https://www.openlabs.org.in/",
  },
  mainEntity: {
    "@type": "EducationalOrganization",
    name: "OpenLabs",
    url: "https://www.openlabs.org.in/",
    email: "support@openlabs.org.in",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@openlabs.org.in",
      availableLanguage: ["en"],
    },
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
    {
      "@type": "ListItem",
      position: 2,
      name: "Contact",
      item: "https://www.openlabs.org.in/contact",
    },
  ],
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-card via-background to-background px-6 pt-12 pb-16 sm:pt-16 sm:pb-20 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute left-1/2 top-1/4 h-[350px] w-[700px] -translate-x-1/2 rounded-[100%] bg-primary/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl text-center space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest shadow-sm">
            <Radio size={13} className="text-primary animate-pulse" />
            <span>Direct Communication Channel</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
            Get In Touch With The <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
              OpenLabs Team
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed font-normal">
            Have questions about our 50+ STEM simulations, bug reports, feature requests, or collaboration opportunities? Send us a transmission.
          </p>
        </div>
      </section>

      {/* ─── CONTACT INFO CARDS ─── */}
      <section aria-label="Contact channels" className="relative z-20 mx-auto -mt-8 sm:-mt-10 max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {contactInfo.map((ci) => (
            <a
              key={ci.title}
              href={ci.href}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${ci.gradient} opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none`} />
              <div className="relative z-10 space-y-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${ci.bg} shadow-xs transition-transform duration-200 group-hover:scale-105`}>
                  <ci.icon className={`h-5 w-5 ${ci.iconColor}`} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {ci.title}
                  </h2>
                  <p className="text-xs font-mono font-bold text-primary mt-0.5">{ci.detail}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">{ci.subtitle}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ─── FORM & SIDEBAR SECTION ─── */}
      <section id="contact-form" className="mx-auto max-w-6xl px-6 py-12 sm:py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Main Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-primary">
                <MessageSquare size={13} />
                <span>Transmission Console</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Send a Message
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                All communications are routed directly to our active development and support inbox.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              <ContactForm />
            </div>
          </div>

          {/* Sidebar Info */}
          <aside className="space-y-5 lg:col-span-5" aria-label="Contact details & status">
            {/* System Status Card */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
                    Simulation Network Status
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Operational
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Central Support Desk</p>
                    <a
                      href="mailto:support@openlabs.org.in"
                      className="text-xs text-primary font-mono hover:underline block mt-0.5"
                    >
                      support@openlabs.org.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Response Turnaround</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Standard reply within 24 hours (Mon–Sat)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Global Edge & Servers</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Distributed cloud nodes worldwide (India primary)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bug Reporting Tip Card */}
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 space-y-2.5">
              <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-wider">
                <ShieldCheck size={15} />
                <span>Bug Triage Guideline</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When reporting simulation glitches, please include the specific lab name, your browser (e.g. Chrome, Firefox, Safari), and the exact steps to reproduce the anomaly.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
