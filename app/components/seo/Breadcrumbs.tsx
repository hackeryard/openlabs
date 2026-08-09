// app/components/seo/Breadcrumbs.tsx
import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbItem } from "@/app/lib/types/seo";
import { createBreadcrumbSchema } from "@/app/lib/seo/schema";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = [
    { name: "Home", url: "/" },
    ...items,
  ];

  const jsonLd = createBreadcrumbSchema(allItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-xs text-muted-foreground py-2 px-1 overflow-x-auto whitespace-nowrap ${className}`}
      >
        <ol className="flex items-center gap-1.5">
          {allItems.map((item, idx) => {
            const isLast = idx === allItems.length - 1;
            return (
              <li key={item.url} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronRight size={12} className="opacity-50 flex-shrink-0" />}
                {isLast ? (
                  <span className="font-semibold text-foreground truncate max-w-[200px]" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {idx === 0 && <Home size={12} />}
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
