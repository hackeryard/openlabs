// app/components/seo/StructuredData.tsx
import React from "react";

interface StructuredDataProps {
  data: Record<string, any> | Array<Record<string, any>> | null;
}

export default function StructuredData({ data }: StructuredDataProps) {
  if (!data) return null;

  const sanitizedJson = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: sanitizedJson }}
    />
  );
}
