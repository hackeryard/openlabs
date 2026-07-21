import React from "react";
import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageSquare } from "lucide-react";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact OpenLabs - Support & Feedback",
  description: "Contact the OpenLabs team for support, bug reports, feature requests, partnerships, and questions about free virtual STEM labs.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact OpenLabs - Support, Bug Reports, and Partnerships",
    description: "Reach the OpenLabs team for support, bug reports, feature requests, partnerships, and virtual lab questions.",
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
    description: "Reach the OpenLabs team for support, bug reports, feature requests, partnerships, and virtual lab questions.",
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
    title: "Email Us",
    detail: "support@openlabs.org.in",
    subtitle: "We respond within 24 hours",
    gradient: "from-blue-100 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/10",
    iconColor: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/40",
  },
  {
    icon: MessageSquare,
    title: "Community",
    detail: "GitHub Discussions",
    subtitle: "Join our open-source community",
    gradient: "from-purple-100 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/10",
    iconColor: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950/40",
  },
  {
    icon: Clock,
    title: "Response Time",
    detail: "Within 24 hours",
    subtitle: "Mon-Sat, 9am-6pm IST",
    gradient: "from-emerald-100 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/10",
    iconColor: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
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
    <main className="min-h-screen text-foreground selection:bg-indigo-100 selection:text-indigo-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="relative overflow-hidden border-b border-border/60 bg-card px-6 pb-24 pt-16 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent" />
        <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-blue-100/50 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-purple-100/50 blur-[120px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <h1 className="mb-6 bg-gradient-to-b from-foreground via-foreground/80 to-foreground/50 bg-clip-text text-5xl font-black tracking-tight text-transparent md:text-7xl">
            Connection <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">Established</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            System ready. Send questions, bug reports, or feature requests directly to the OpenLabs engineering team.
          </p>
        </div>
      </section>

      <section aria-label="Contact options" className="relative z-20 mx-auto -mt-12 max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {contactInfo.map((ci) => (
            <div key={ci.title} className="group relative overflow-hidden rounded-3xl border border-border bg-card/90 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5">
              <div className={`absolute inset-0 bg-gradient-to-br ${ci.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
              <div className="relative z-10">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-background ${ci.bg} shadow-sm`}>
                  <ci.icon className={`h-5 w-5 ${ci.iconColor}`} aria-hidden="true" />
                </div>
                <h2 className="mb-1 text-lg font-bold text-foreground">{ci.title}</h2>
                <p className="mb-1 text-sm font-semibold text-indigo-600">{ci.detail}</p>
                <p className="text-xs text-muted-foreground">{ci.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground">Transmission Console</h2>
              <p className="text-muted-foreground">All communications are routed directly to the team.</p>
            </div>
            <ContactForm />
          </div>

          <aside className="space-y-6 lg:col-span-2" aria-label="Contact details">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-[30px] pointer-events-none" />
              <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                Network Status
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
                    <Mail className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Main Comm Array</p>
                    <a href="mailto:support@openlabs.org.in" className="mt-1 block text-xs text-muted-foreground underline-offset-2 hover:underline">
                      support@openlabs.org.in
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/40">
                    <MapPin className="h-5 w-5 text-rose-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Server Location</p>
                    <p className="mt-1 text-xs text-muted-foreground">India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-indigo-100 dark:border-indigo-900 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/20 p-8">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-900 dark:text-indigo-200">System Note</h2>
              <p className="text-sm font-medium leading-relaxed text-indigo-800/80 dark:text-indigo-200/80">
                When filing bug reports, include your browser, operating system, and the exact time of the incident to help us debug faster.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
