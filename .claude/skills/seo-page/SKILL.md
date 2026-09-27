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

## Sitemap & Route Policy

All route classifications are centralized in `app/lib/seoRoutePolicy.ts`:
- **Public Educational Landings** (`/<subject>/<slug>`): Automatically enumerated in `app/sitemap.ts` dynamically from `LABS` in `app/lib/labs.ts` (priority `0.8`, `monthly`) alongside 118 periodic table elements (priority `0.75`), 9 subtopic hubs, `/tracks`, `/leaderboard`, and published blog articles.
- **Simulation Routes** (`/labs/<subject>/<slug>`): Strictly **excluded** from `sitemap.ts`, disallowed in `app/robots.ts`, served with `X-Robots-Tag: noindex, nofollow, noarchive` in `middleware.ts`, and wrapped with `robots: { index: false, follow: false, nocache: true }` in `app/labs/layout.tsx`.

## Verification & Automated Testing

After adding or modifying metadata:
1. Run `yarn test:seo` to verify:
   - Valid metadata and absolute canonical URL format (`https://www.openlabs.org.in/...`)
   - Proper route classification (`public` vs `lab` vs `private`)
   - Zero `/labs/*` entries in sitemap output
   - Reciprocal internal links
2. Run `yarn tsc --noEmit` to verify TypeScript typings.
