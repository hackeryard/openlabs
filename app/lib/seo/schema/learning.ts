// app/lib/seo/schema/learning.ts
import { SchemaLearningResource } from "../../types/schema";
import { SITE_METADATA } from "../../constants/subjects";
import { buildCanonical } from "../canonicalBuilder";

interface CreateLearningResourceParams {
  name: string;
  description: string;
  pathname: string;
  subject?: string;
  learningResourceType?: string; // "Interactive Simulation", "Exploration Lab", "Code Editor"
  educationalLevel?: string;    // "High School", "Undergraduate", "Middle School"
  competencyRequired?: string;
}

/**
 * Creates Schema.org LearningResource JSON-LD payload.
 */
export function createLearningResourceSchema(params: CreateLearningResourceParams): SchemaLearningResource {
  const url = buildCanonical(params.pathname);

  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: params.name,
    description: params.description,
    url,
    learningResourceType: params.learningResourceType || "Interactive Simulation",
    educationalLevel: params.educationalLevel || "High School",
    competencyRequired: params.competencyRequired,
    inLanguage: "en",
    author: {
      "@type": "Organization",
      name: SITE_METADATA.siteName,
      url: SITE_METADATA.baseUrl,
    },
    provider: {
      "@type": "EducationalOrganization",
      name: SITE_METADATA.siteName,
      url: SITE_METADATA.baseUrl,
    },
  };
}
