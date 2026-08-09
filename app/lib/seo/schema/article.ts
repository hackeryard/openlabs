// app/lib/seo/schema/article.ts
import { SchemaBlogPosting } from "../../types/schema";
import { SITE_METADATA } from "../../constants/subjects";
import { buildCanonical } from "../canonicalBuilder";

interface CreateArticleSchemaParams {
  title: string;
  description: string;
  pathname: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}

/**
 * Creates Schema.org BlogPosting / Article JSON-LD payload.
 */
export function createArticleSchema(params: CreateArticleSchemaParams): SchemaBlogPosting {
  const url = buildCanonical(params.pathname);
  const imageUrl = params.image || `${SITE_METADATA.baseUrl}/images/og-image.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: params.title,
    description: params.description,
    url,
    image: [imageUrl],
    datePublished: params.datePublished,
    dateModified: params.dateModified || params.datePublished,
    author: {
      "@type": "Person",
      name: params.authorName || SITE_METADATA.defaultPublisher,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_METADATA.siteName,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_METADATA.baseUrl}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}
