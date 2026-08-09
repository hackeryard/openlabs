// app/lib/seo/schema/faq.ts
import { SchemaFAQPage } from "../../types/schema";

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Creates Schema.org FAQPage JSON-LD payload.
 */
export function createFAQSchema(faqs: FAQItem[]): SchemaFAQPage | null {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}
