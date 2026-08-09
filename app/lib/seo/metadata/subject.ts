// app/lib/seo/metadata/subject.ts
import { Metadata } from "next";
import { SubjectId } from "../../types/knowledge";
import { buildCanonical } from "../canonicalBuilder";
import { buildKeywords } from "../keywordBuilder";
import { SITE_METADATA, SUBJECTS } from "../../constants/subjects";

/**
 * Creates standardized Next.js Metadata for subject hub pages (/physics, /chemistry, etc.).
 */
export function createSubjectMetadata(subjectId: SubjectId): Metadata {
  const subject = SUBJECTS[subjectId];
  if (!subject) {
    throw new Error(`Invalid subjectId: ${subjectId}`);
  }

  const canonicalUrl = buildCanonical(subject.slug);
  const keywords = buildKeywords(subject.name, subjectId, subject.primaryBranches);
  const title = `${subject.name} Virtual Labs & Interactive Simulations`;
  const ogImageUrl = `${SITE_METADATA.baseUrl}/api/og?title=${encodeURIComponent(subject.name)}&subject=${subjectId}`;

  return {
    title,
    description: subject.description,
    keywords,
    metadataBase: new URL(SITE_METADATA.baseUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: `${title} | OpenLabs`,
      description: subject.description,
      siteName: SITE_METADATA.siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${subject.name} Labs`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | OpenLabs`,
      description: subject.description,
      creator: SITE_METADATA.twitterHandle,
      images: [ogImageUrl],
    },
    authors: [{ name: SITE_METADATA.defaultPublisher }],
    creator: SITE_METADATA.defaultPublisher,
    publisher: SITE_METADATA.defaultPublisher,
    category: subject.name,
  };
}
