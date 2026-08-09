import React from "react";
import { FAQ } from "@/types/education";
import { createFAQSchema, createLearningResourceSchema } from "@/app/lib/seo/schema";
import StructuredData from "@/app/components/seo/StructuredData";

interface SchemaMarkupProps {
  title: string;
  description: string;
  url: string;
  subject: string;
  faqs: FAQ[];
}

export default function SchemaMarkup({ title, description, url, subject, faqs }: SchemaMarkupProps) {
  const faqSchema = faqs && faqs.length > 0 ? createFAQSchema(faqs) : null;
  const learningSchema = createLearningResourceSchema({
    name: title,
    description: description,
    pathname: url,
    subject: subject,
    learningResourceType: "Simulation",
  });

  return <StructuredData data={[learningSchema, faqSchema].filter(Boolean)} />;
}
