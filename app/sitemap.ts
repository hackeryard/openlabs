import { MetadataRoute } from "next";
import { connectDB } from "@/app/lib/mongodb";
import Blog from "@/app/models/Blog";
import { LABS } from "@/app/lib/labs";
import { SITE_METADATA, SUBJECTS } from "@/app/lib/constants/subjects";
import {
  SUBTOPIC_HUBS,
  CORE_PUBLIC_ROUTES,
  isSitemapEligible,
  toCanonicalUrl,
} from "@/app/lib/seoRoutePolicy";

export const revalidate = 43200; // 12 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_METADATA.baseUrl.replace(/\/+$/, "");

  // 1. Core static routes & discipline hubs
  const staticPaths: string[] = [
    ...CORE_PUBLIC_ROUTES,
    ...Object.values(SUBJECTS).map((s) => s.slug),
    ...SUBTOPIC_HUBS,
  ];

  // 2. All 118 Periodic Table Element Atom Detail Pages
  const elementAtomPaths: string[] = Array.from({ length: 118 }, (_, i) => 
    `/chemistry/periodictable/atom/${i + 1}`
  );

  // 3. Public Educational Experiment Landing Pages (from LABS registry)
  // Public landing pages are at /${lab.id}, NOT /labs/${lab.id}
  const labLandingPaths: string[] = LABS.map((lab) => `/${lab.id}`);

  // Combine and deduplicate base paths
  const allDiscoveredPaths = Array.from(
    new Set([...staticPaths, ...elementAtomPaths, ...labLandingPaths])
  );

  // Filter strictly through the centralized SEO Route Policy
  const verifiedStaticRoutes: MetadataRoute.Sitemap = allDiscoveredPaths
    .filter((path) => isSitemapEligible(path))
    .map((path) => {
      // Dynamic priority assignment based on route type
      let priority = 0.7;
      let changeFrequency: "daily" | "weekly" | "monthly" = "monthly";

      if (path === "/") {
        priority = 1.0;
        changeFrequency = "daily";
      } else if (
        Object.values(SUBJECTS).some((s) => s.slug === path) ||
        path === "/tracks"
      ) {
        priority = 0.9;
        changeFrequency = "weekly";
      } else if (SUBTOPIC_HUBS.includes(path as any) || path === "/blog") {
        priority = 0.8;
        changeFrequency = "weekly";
      } else if (path.startsWith("/chemistry/periodictable/atom/")) {
        priority = 0.6;
        changeFrequency = "monthly";
      } else {
        priority = 0.8;
        changeFrequency = "weekly";
      }

      return {
        url: toCanonicalUrl(path),
        lastModified: new Date(),
        changeFrequency,
        priority,
      };
    });

  // 4. Dynamic Blog posts from MongoDB
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const blogs = await Blog.find({ published: true })
      .select("slug updatedAt date")
      .lean();

    blogRoutes = (blogs || [])
      .filter((b: any) => b && b.slug && isSitemapEligible(`/blog/${b.slug}`))
      .map((b: any) => ({
        url: toCanonicalUrl(`/blog/${b.slug}`),
        lastModified: b.updatedAt ? new Date(b.updatedAt) : b.date ? new Date(b.date) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
  } catch (error) {
    console.error("✗ Sitemap blog query error:", error);
  }

  return [...verifiedStaticRoutes, ...blogRoutes];
}