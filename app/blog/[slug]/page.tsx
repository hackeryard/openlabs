import React, { cache } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { connectDB } from "@/app/lib/mongodb";
import Blog from "@/app/models/Blog";
import BlogPostInteractive from "@/app/components/blog/BlogPostInteractive";

export const revalidate = 3600;

interface FAQ {
  question: string;
  answer: string;
}

interface BlogPost {
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt?: string;
  category: string;
  author?: string;
  date: string;
  readTime?: string;
  coverImage?: string;
  content: string;
  faqs?: FAQ[];
}

interface RelatedPost {
  slug: string;
  title: string;
  excerpt?: string;
  category: string;
  date: string;
  readTime?: string;
  coverImage?: string;
}

const getBlogPost = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    await connectDB();
    const blog = await Blog.findOne({ slug, published: true }).lean();

    if (!blog) return null;

    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    console.error("Failed to fetch blog post directly:", error);
    return null;
  }
});

const getRelatedPosts = cache(async (currentSlug: string, category: string): Promise<RelatedPost[]> => {
  try {
    await connectDB();
    let related = await Blog.find({
      slug: { $ne: currentSlug },
      category: category,
      published: true,
    })
      .sort({ date: -1 })
      .limit(3)
      .select("slug title excerpt category date readTime coverImage -_id")
      .lean();

    if (!related || related.length < 3) {
      const additional = await Blog.find({
        slug: { $nin: [currentSlug, ...related.map((r) => r.slug)] },
        published: true,
      })
        .sort({ date: -1 })
        .limit(3 - (related?.length || 0))
        .select("slug title excerpt category date readTime coverImage -_id")
        .lean();

      related = [...(related || []), ...(additional || [])];
    }

    return JSON.parse(JSON.stringify(related)) || [];
  } catch (error) {
    console.error("Failed to fetch related posts:", error);
    return [];
  }
});

export async function generateStaticParams() {
  try {
    await connectDB();
    const posts = await Blog.find({ published: true }).select("slug").lean();
    return (posts || []).map((post: any) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params for blog posts:", error);
    return [];
  }
}

function formatBlogMetaTitle(post: { title: string; metaTitle?: string; slug?: string }): string {
  if (post.metaTitle && post.metaTitle.trim().length > 0) {
    return post.metaTitle;
  }
  if (post.slug === "simple-harmonic-motion-explained-pendulums-springs") {
    return "Simple Harmonic Motion: Pendulums & Springs | OpenLabs";
  }
  if (post.slug === "how-to-learn-data-structures-visually") {
    return "Learn Data Structures Visually: Interactive Guide | OpenLabs";
  }
  if (post.slug === "projectile-motion-explained-simulation") {
    return "Projectile Motion Formulas & Simulation | OpenLabs";
  }
  const baseTitle = post.title.trim();
  const brandSuffix = " | OpenLabs";
  if (baseTitle.length + brandSuffix.length <= 65) {
    return `${baseTitle}${brandSuffix}`;
  }
  const maxBaseLen = 65 - brandSuffix.length - 3;
  const truncated = baseTitle.slice(0, maxBaseLen).replace(/\s+\S*$/, "");
  return `${truncated}...${brandSuffix}`;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found | OpenLabs",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = formatBlogMetaTitle(post);
  const description =
    post.metaDescription || post.excerpt || `Read ${post.title} on the OpenLabs Blog.`;
  const canonical = `https://www.openlabs.org.in/blog/${post.slug}`;
  const image = post.coverImage?.startsWith("http")
    ? post.coverImage
    : `https://www.openlabs.org.in${post.coverImage || "/images/og-image.svg"}`;

  return {
    title,
    description,
    keywords: [
      post.category,
      `${post.category} Virtual Labs`,
      "STEM Simulation",
      "Interactive Science Lab",
      post.title,
      "OpenLabs Education",
    ],
    authors: [{ name: post.author || "OpenLabs Team", url: "https://www.openlabs.org.in/about" }],
    creator: post.author || "OpenLabs Team",
    publisher: "OpenLabs",
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "OpenLabs",
      type: "article",
      publishedTime: post.date ? new Date(post.date).toISOString() : undefined,
      modifiedTime: post.date ? new Date(post.date).toISOString() : undefined,
      authors: [post.author || "OpenLabs Team"],
      section: post.category,
      tags: [post.category, "STEM", "Virtual Labs", "Science", "Education"],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@openlabs_org",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "geo.region": "IN",
      "geo.placename": "India",
      "educational-level": "High School, Undergraduate, K-12",
      "learning-resource-type": "Interactive Simulation & Article",
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.category);

  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://www.openlabs.org.in/blog/${post.slug}#article`,
    url: `https://www.openlabs.org.in/blog/${post.slug}`,
    headline: post.title,
    description: post.metaDescription || post.excerpt || post.title,
    image: post.coverImage ? [post.coverImage] : ["https://www.openlabs.org.in/images/og-image.svg"],
    datePublished: post.date ? new Date(post.date).toISOString() : undefined,
    dateModified: post.date ? new Date(post.date).toISOString() : undefined,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    educationalUse: ["Interactive Learning", "STEM Simulation Guide", "Self-Study"],
    keywords: [post.category, "STEM Education", "Virtual Labs", "Science Simulations"],
    author: {
      "@type": "Person",
      name: post.author || "OpenLabs Team",
      worksFor: {
        "@type": "EducationalOrganization",
        name: "OpenLabs",
        url: "https://www.openlabs.org.in",
      },
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: "OpenLabs",
      url: "https://www.openlabs.org.in/",
      logo: {
        "@type": "ImageObject",
        url: "https://www.openlabs.org.in/images/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.openlabs.org.in/blog/${post.slug}`,
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
      {
        "@type": "ListItem",
        position: 3,
        name: post.category,
        item: `https://www.openlabs.org.in/blog?category=${encodeURIComponent(post.category)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: post.title,
        item: `https://www.openlabs.org.in/blog/${post.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary antialiased pt-6 sm:pt-10 pb-16 sm:pb-24">
      {/* Schema.org Structured Data for SEO, AEO & Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <BlogPostInteractive post={post} relatedPosts={relatedPosts} />
    </main>
  );
}
