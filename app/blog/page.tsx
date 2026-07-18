import React from "react";
import type { Metadata } from "next";
import BlogGrid from "../components/blog/BlogGrid";
import { connectDB } from '@/app/lib/mongodb';
import Blog from '@/app/models/Blog';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "OpenLabs Blog - Virtual Labs, STEM Learning, and EdTech Updates",
  description: "Read OpenLabs articles about virtual experiments, AI learning tools, STEM pedagogy, engineering updates, and the future of interactive science education.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "OpenLabs Blog - Virtual Labs, STEM Learning, and EdTech Updates",
    description: "Deep dives into virtual experiments, AI learning tools, STEM pedagogy, and OpenLabs engineering updates.",
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
    description: "Read OpenLabs articles about virtual labs, AI learning tools, STEM pedagogy, and platform updates.",
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
      .select('slug title excerpt category author date readTime gradient border icon coverImage -_id')
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
    <main className="min-h-screen text-foreground selection:bg-indigo-100 selection:text-indigo-900 antialiased overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Light Cinematic Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-32 overflow-hidden border-b border-border/80 bg-card">

        {/* Deepened Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 to-transparent" />

        {/* Enhanced Cinematic Glowing Orbs - Scaled for mobile and desktop */}
        <div className="absolute -top-12 -left-12 w-[300px] h-[300px] md:-top-24 md:-left-24 md:w-[600px] md:h-[600px] bg-indigo-300/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 -right-12 w-[350px] h-[350px] md:-right-24 md:w-[700px] md:h-[700px] bg-cyan-300/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

        {/* Pure CSS Grid - Replaces the SVG for guaranteed crispness and better masking */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] md:bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,white,transparent_90%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 z-10 flex flex-col items-center text-center">

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 md:mb-8 text-foreground drop-shadow-sm leading-[1.15] md:leading-[1.1]">
            Thoughts on the <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500">
              Future of Learning
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-xl md:max-w-3xl mx-auto leading-relaxed font-medium px-2">
            Deep dives into virtual experiments, AI integrations, pedagogical insights, and updates from the OpenLabs engineering team.
          </p>

        </div>
      </section>

      {/* Light Cinematic Blog Grid Container */}
      <section className="relative py-12 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Subtle background glow behind the grid - scaled down for mobile */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] max-w-[800px] max-h-[800px] bg-primary/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none -z-10" />

        <BlogGrid posts={posts} />
      </section>
    </main>
  );
}
