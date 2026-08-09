// app/lib/seo/metadata/lab.ts
import { Metadata } from "next";
import { SEOPageConfig } from "../../types/seo";
import { buildCanonical } from "../canonicalBuilder";
import { buildKeywords } from "../keywordBuilder";
import { SITE_METADATA, SUBJECTS } from "../../constants/subjects";

/**
 * Creates standardized Next.js Metadata for virtual lab / simulation pages.
 */
export function createLabMetadata(config: SEOPageConfig): Metadata {
  const canonicalUrl = buildCanonical(config.pathname);
  const keywords = buildKeywords(config.title, config.subject, config.keywords);
  const ogImageUrl = config.ogImage || `${SITE_METADATA.baseUrl}/api/og?title=${encodeURIComponent(config.title)}&subject=${config.subject || "physics"}`;

  const cleanTitle = config.title;

  return {
    title: cleanTitle,
    description: config.description,
    keywords,
    metadataBase: new URL(SITE_METADATA.baseUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: config.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: `${cleanTitle} | OpenLabs`,
      description: config.description,
      siteName: SITE_METADATA.siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${cleanTitle} Interactive Simulation`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanTitle} | OpenLabs`,
      description: config.description,
      creator: SITE_METADATA.twitterHandle,
      images: [ogImageUrl],
    },
    authors: [{ name: SITE_METADATA.defaultPublisher }],
    creator: SITE_METADATA.defaultPublisher,
    publisher: SITE_METADATA.defaultPublisher,
    category: config.subject ? SUBJECTS[config.subject]?.name : "Education",
  };
}
