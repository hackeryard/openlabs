import React from "react";
import type { Metadata } from "next";
import BlogGrid from "../components/blog/BlogGrid";
import { connectDB } from "@/app/lib/mongodb";
import Blog from "@/app/models/Blog";
import { Sparkles, BookOpen } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "OpenLabs Blog - Virtual Labs, STEM Learning, and EdTech Updates",
  description:
    "Read OpenLabs articles about virtual experiments, AI learning tools, STEM pedagogy, engineering updates, and the future of interactive science education.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "OpenLabs Blog - Virtual Labs, STEM Learning, and EdTech Updates",
    description:
      "Deep dives into virtual experiments, AI learning tools, STEM pedagogy, and OpenLabs engineering updates.",
    url: "/blog",
    type: "website",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "OpenLabs blog and interactive learning updates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenLabs Blog - Virtual Labs, STEM Learning, and EdTech Updates",
    description:
      "Read OpenLabs articles about virtual labs, AI learning tools, STEM pedagogy, and platform updates.",
    images: ["/images/twitter-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

async function getBlogs() {
  try {
    await connectDB();
    const blogs = await Blog.find({ published: true })
      .sort({ date: -1 })
      .select("slug title excerpt category author date readTime gradient border icon coverImage -_id")
      .lean();

    return JSON.parse(JSON.stringify(blogs)) || [];
  } catch (error) {
    console.error("Failed to fetch blogs directly:", error);
    return [];
  }
}

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://www.openlabs.org.in/blog#blog",
  url: "https://www.openlabs.org.in/blog",
  name: "OpenLabs Blog",
  description: metadata.description,
  publisher: {
    "@type": "EducationalOrganization",
    name: "OpenLabs",
    url: "https://www.openlabs.org.in/",
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
      name: "Blog",
      item: "https://www.openlabs.org.in/blog",
    },
  ],
};

export default async function BlogPage() {
  const posts = await getBlogs();

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary antialiased">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-card via-background to-background px-6 pt-12 pb-14 sm:pt-16 sm:pb-18 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute left-1/2 top-1/4 h-[350px] w-[700px] -translate-x-1/2 rounded-[100%] bg-primary/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl text-center space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest shadow-sm">
            <Sparkles size={13} className="text-primary" />
            <span>Research, Pedagogy & Engineering</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
            Thoughts on the <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Future of Science & Learning
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed font-normal">
            Deep dives into virtual experiments, AI integrations, pedagogical insights, and engineering updates from the OpenLabs team.
          </p>
        </div>
      </section>

      {/* ─── BLOG GRID SECTION ─── */}
      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:py-14 sm:px-6 md:px-8">
        <BlogGrid posts={posts} />
      </section>
    </main>
  );
}
