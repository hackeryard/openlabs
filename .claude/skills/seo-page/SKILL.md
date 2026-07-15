---
name: seo-page
description: Add or check a page's Next.js Metadata block against this repo's established SEO conventions (title/description length, OpenGraph/Twitter, canonical URL, sitemap.ts entry). Use when adding a new landing page, blog post, or any public page, or when asked to review/fix SEO metadata.
---

# Writing SEO metadata for an OpenLabs page

Every public page (`app/<subject>/<lab>/page.tsx`, `app/blog/[slug]/page.tsx`, subject hub pages, etc.) exports a Next.js `Metadata` object. Follow the shape already used across the ~74 existing pages — see `app/physics/freefall/page.tsx` as the reference example. Don't invent a different structure.

## Required fields

```tsx
export const metadata: Metadata = {
  title: "<Specific Title> | <Category Context> | OpenLabs",   // 50-65 chars total
  description: "<what the page/lab lets the user do>",           // 120-140 chars
  keywords: ["3-6 relevant terms", "..."],
  alternates: {
    canonical: "https://www.openlabs.org.in/<path>",             // always the full absolute URL, no trailing slash
  },
  openGraph: {
    title: "<same or near-identical to top-level title>",
    description: "<same or near-identical to top-level description>",
    url: "https://www.openlabs.org.in/<path>",
    type: "website",
    images: [{ url: "https://www.openlabs.org.in/images/<subject>/<slug>-hero.png", alt: "<descriptive alt text>" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "<title>",
    description: "<description>",
    images: ["https://www.openlabs.org.in/images/<subject>/<slug>-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

## Rules

- `title`: keep to 50–65 characters including the ` | OpenLabs` suffix — longer gets truncated in search results.
- `description`: 120–140 characters, action-oriented ("Interactive X simulator for exploring Y, Z, and W in browser" — matches existing phrasing patterns), not a generic restatement of the title.
- `canonical`/`openGraph.url` must be the **full absolute URL** on `https://www.openlabs.org.in` — relative paths break OG previews.
- Reuse an existing hero image path convention (`/images/<subject>/<slug>-hero.png`) — check `public/images/<subject>/` for what actually exists before referencing a new filename; a missing OG image silently breaks social previews.
- If the page is a lab landing page, also pass the SEO-relevant content (`theory`, `formula`, `faqs`, `learningObjectives`, `applications`) into the shared landing component (`PhysicsExperimentLanding` or the subject-appropriate equivalent from root `components/`) — the FAQ list feeds a JSON-LD FAQ schema, so keep answers factual and self-contained (they're read out of context by search engines).

## Sitemap

Static top-level and category pages are listed by hand in `app/sitemap.ts` (`revalidate = 43200`, i.e. every 12h) with `changeFrequency`/`priority`. Blog posts are pulled dynamically from MongoDB in the same file. **Individual lab pages are not currently enumerated in `sitemap.ts`** — if asked to make a new lab page more discoverable, check whether it should be added there, but don't assume every page must be (confirm with the user; the existing pattern favors category-level entries plus dynamic blog entries, not per-lab).

## After writing

Cross-check `app/robots.ts` isn't excluding the new path. Current `disallow` list: `/api/`, `/admin/`, `/private/`, `/labs/` (simulation routes are intentionally not crawled — they're auth-gated anyway), `/login`, `/signup`, `/forgotpassword`, `/reset-password`, `/verify-email`. A new public landing page should live outside all of those; a new subject prefix should be added to `allow` alongside `/physics/`, `/chemistry/`, `/biology/`, `/computer-science/`, `/maths/`.
