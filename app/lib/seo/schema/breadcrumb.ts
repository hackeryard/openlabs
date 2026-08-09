// app/lib/seo/schema/breadcrumb.ts
import { BreadcrumbItem } from "../../types/seo";
import { SchemaBreadcrumbList } from "../../types/schema";
import { SITE_METADATA } from "../../constants/subjects";

/**
 * Creates Schema.org BreadcrumbList JSON-LD payload.
 */
export function createBreadcrumbSchema(items: BreadcrumbItem[]): SchemaBreadcrumbList {
  const base = SITE_METADATA.baseUrl.replace(/\/+$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${base}${item.url.startsWith("/") ? "" : "/"}${item.url}`,
    })),
  };
}
