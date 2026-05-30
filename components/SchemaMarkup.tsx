import React from "react";
import { FAQ } from "@/types/education";

interface SchemaMarkupProps {
  title: string;
  description: string;
  url: string;
  subject: string;
  faqs: FAQ[];
}

export default function SchemaMarkup({ title, description, url, subject, faqs }: SchemaMarkupProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
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
        name: subject,
        item: `https://www.openlabs.org.in/${subject.toLowerCase()}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: url,
      },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: url,
    publisher: {
      "@type": "Organization",
      name: "OpenLabs",
      logo: {
        "@type": "ImageObject",
        url: "https://www.openlabs.org.in/logo.png",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
    </>
  );
}
