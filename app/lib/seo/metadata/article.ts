// app/lib/seo/metadata/article.ts
import { Metadata } from "next";
import { SEOPageConfig } from "../../types/seo";
import { buildCanonical } from "../canonicalBuilder";
import { buildKeywords } from "../keywordBuilder";
import { SITE_METADATA } from "../../constants/subjects";

/**
 * Creates standardized Next.js Metadata for educational articles and blog posts.
 */
export function createArticleMetadata(config: SEOPageConfig): Metadata {
  const canonicalUrl = buildCanonical(config.pathname);
  const keywords = buildKeywords(config.title, config.subject, config.keywords);
  const ogImageUrl = config.ogImage || `${SITE_METADATA.baseUrl}/api/og?title=${encodeURIComponent(config.title)}`;

  return {
    title: config.title,
    description: config.description,
    keywords,
    metadataBase: new URL(SITE_METADATA.baseUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !config.noindex,
      follow: !config.noindex,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: `${config.title} | OpenLabs`,
      description: config.description,
      siteName: SITE_METADATA.siteName,
      publishedTime: config.publishedTime,
      modifiedTime: config.modifiedTime,
      authors: config.authors || [SITE_METADATA.defaultPublisher],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.title} | OpenLabs`,
      description: config.description,
      creator: SITE_METADATA.twitterHandle,
      images: [ogImageUrl],
    },
    authors: (config.authors || [SITE_METADATA.defaultPublisher]).map((name) => ({ name })),
    creator: SITE_METADATA.defaultPublisher,
    publisher: SITE_METADATA.defaultPublisher,
    category: "Educational Article",
  };
}
