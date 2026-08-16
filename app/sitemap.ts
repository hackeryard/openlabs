// app/sitemap.ts
import { MetadataRoute } from "next";
import { connectDB } from "@/app/lib/mongodb";
import Blog from "@/app/models/Blog";
import { LABS } from "@/app/lib/labs";
import { SITE_METADATA, SUBJECTS } from "@/app/lib/constants/subjects";

export const revalidate = 43200; // 12 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_METADATA.baseUrl.replace(/\/+$/, "");

  // 1. Static subject hubs & core pages
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...Object.values(SUBJECTS).map((s) => ({
      url: `${baseUrl}${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  // 2. Dynamic Lab / Simulation routes from LABS registry
  const labRoutes: MetadataRoute.Sitemap = LABS.map((lab) => {
    // Check whether the route is /labs/[id] or /[id]
    const routePath = lab.id.startsWith("physics/") || lab.id.startsWith("chemistry/") || lab.id.startsWith("biology/") || lab.id.startsWith("computer-science/") || lab.id.startsWith("mathematics/")
      ? `/${lab.id}`
      : `/labs/${lab.id}`;

    return {
      url: `${baseUrl}${routePath}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

  // 3. Dynamic Blog posts from MongoDB
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const blogs = await Blog.find({ published: true }).select("slug updatedAt").lean();
    blogRoutes = blogs.map((b: any) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("✗ Sitemap blog query error:", error);
  }

  return [...coreRoutes, ...labRoutes, ...blogRoutes];
}