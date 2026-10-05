# OpenLabs Technical SEO & Indexing Maintenance Guide

This document defines the technical SEO architecture, indexing policy, URL normalization standards, sitemap generation, structured data, and regression testing protocols for **OpenLabs** (`https://www.openlabs.org.in`).

All engineering and curriculum contributors must adhere to these policies when adding new public educational content, interactive simulations, or blog publications.

---

## 1. Centralized Route Classification Policy

Route classification is centralized in [`app/lib/seoRoutePolicy.ts`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/app/lib/seoRoutePolicy.ts). Routes in OpenLabs are categorized into distinct classes:

| Route Classification | Path Pattern | Indexable? | In Sitemap? | Robots & Directives |
| :--- | :--- | :---: | :---: | :--- |
| **Public Indexable** | `/${subject}/*`, `/tracks`, `/leaderboard`, `/blog/*`, `/about`, `/contact`, `/` | **YES** | **YES** | `index: true, follow: true`, self-referential canonical URL |
| **Interactive Labs** | `/labs/*` (all 101 simulations) | **NO** | **NO** | `noindex, nofollow, noarchive` via `app/labs/layout.tsx` + `X-Robots-Tag` |
| **Private / Auth** | `/admin/*`, `/api/*`, `/login`, `/signup`, `/forgotpassword`, `/reset-password`, `/verify-email`, `/setup-profile`, `/403` | **NO** | **NO** | Disallowed in `robots.ts`, redirected or 401/403 in `middleware.ts` |
| **Permanent Redirects** | `/education` &rarr; `/tracks`, `/virtual-science-labs` &rarr; `/tracks` | **NO** | **NO** | HTTP 308 permanent redirect, internal links must point directly to target |

---

## 2. Intentional Interactive Lab Exclusion (The Multi-Layer Shield)

OpenLabs deliberately separates **public educational landing pages** from **interactive lab simulation runtimes**:

- **Public Landing Page** (`https://www.openlabs.org.in/physics/mechanics/projectile-motion`):
  - Statically generated and fully crawlable.
  - Contains topic overview, learning objectives, mathematical derivations, formula explorer, knowledge graph, and single-open FAQ schema.
  - Serves as the canonical entry point for search engine discovery and organic traffic.
- **Interactive Lab Runtime** (`https://www.openlabs.org.in/labs/physics/mechanics/projectile-motion`):
  - Client-side computational canvas (WebGL / Three.js / Canvas2D / Monaco Editor / Audio APIs).
  - Intentionally excluded from search indexes using a 3-layer defensive shield:
    1. **Layout Metadata** ([`app/labs/layout.tsx`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/app/labs/layout.tsx)): Sets `robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }`.
    2. **Edge Middleware** ([`middleware.ts`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/middleware.ts)): Injects the HTTP header `X-Robots-Tag: noindex, nofollow, noarchive` on all `/labs/*` responses.
    3. **Sitemap Purity** ([`app/sitemap.ts`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/app/sitemap.ts)): Filters all emitted URLs through `isSitemapEligible()`, guaranteeing 0 `/labs/*` URLs enter `sitemap.xml`.

> [!IMPORTANT]
> **Crawler Disallow vs. Noindex Policy:**
> Crawlers must be allowed to fetch `/labs/*` HTTP headers so they can discover the `X-Robots-Tag: noindex` directive and permanently purge the URLs from Google search results. For this reason, `robots.ts` does NOT disallow `/labs/` via robots.txt, avoiding "Indexed, though blocked by robots.txt" indexing errors.

---

## 3. Robots.txt Configuration & Root Meta Endpoints

The dynamic robots file is implemented in [`app/robots.ts`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/app/robots.ts):

- **Mediapartners-Google Rule:** Explicitly grants Google AdSense crawler (`User-agent: Mediapartners-Google`) full access (`allow: ["/"]`) for ad verification and contextual analysis.
- **Allowed Prefixes:** `/`, `/ads.txt`, `/robots.txt`, `/sitemap.xml`, `/physics`, `/chemistry`, `/biology`, `/computer-science`, `/mathematics`, `/tracks`, `/leaderboard`, `/blog`, `/about`, `/contact`, `/llms.txt`, `/llms-full.txt`.
- **Disallowed Prefixes:** `/admin/`, `/api/`, `/private/`, `/login`, `/signup`, `/forgotpassword`, `/reset-password`, `/verify-email`, `/setup-profile`, `/403`.
- **Sitemap Declaration:** `https://www.openlabs.org.in/sitemap.xml`.
- **Root Meta Headers (`next.config.js`):** `/ads.txt`, `/robots.txt`, and `/sitemap.xml` are exempt from blanket `X-Frame-Options: SAMEORIGIN` and `X-Robots-Tag: index, follow` headers, and are served with dedicated CORS (`Access-Control-Allow-Origin: *`) and explicit content types to guarantee unhindered crawler and ad validator access.
- **Static Ads Entry (`public/ads.txt`):** Authorized publisher record `google.com, pub-4121707034074280, DIRECT, f08c47fec0942fa0` served as plain text with HTTP 200 at `https://www.openlabs.org.in/ads.txt`.

---

## 4. Sitemap Generation Architecture

The sitemap is generated dynamically by [`app/sitemap.ts`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/app/sitemap.ts) with `revalidate = 43200` (12-hour cache):

1. **Core Static Hubs:** Root (`/`), Curriculum Tracks (`/tracks`), Leaderboard (`/leaderboard`), Discipline Hubs (`/physics`, `/chemistry`, etc.), and 9 Subtopic Hubs.
2. **Periodic Table Elements:** All 118 element detail pages (`/chemistry/periodictable/atom/[1..118]`).
3. **Public Lab Landing Pages:** Every lab registered in [`app/lib/labs.ts`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/app/lib/labs.ts) maps to its public landing route (`/${lab.id}`), NOT `/labs/${lab.id}`.
4. **Dynamic Blog Posts:** All published articles from MongoDB (`/blog/${post.slug}`) with genuine `updatedAt` / `date` modification timestamps.
5. **Policy Verification:** Every route is verified with `isSitemapEligible(path)` before emission.
6. **Comprehensive Edge CDN ISR Caching (`revalidate = 86400`):** 100% of all public educational routes — all 5 discipline hubs (`/physics`, `/chemistry`, `/biology`, `/mathematics`, `/computer-science`), all 98 individual STEM experiment landing pages (`/<subject>/<slug>`), all 118 periodic table element atom pages (`/chemistry/periodictable/atom/[1..118]`), all 10 subtopic discovery hubs, curriculum tracks (`/tracks`), the `/leaderboard` shell (`revalidate = 3600`), info pages (`/about`, `/contact`), and machine-readable LLM indexes (`/llms.txt`, `/llms-full.txt`) carry 24-hour Edge CDN caching to offload search crawlers and AI bots completely from serverless compute.

---

## 5. Canonical URLs & Metadata Standards

All indexable pages must specify:
1. **Absolute Canonical URL:** Must use `https://www.openlabs.org.in` with lowercase pathname, no trailing slashes, and no query parameters or hash fragments. Example:
   ```ts
   alternates: {
     canonical: "https://www.openlabs.org.in/computer-science/ai-problem/neural-network",
   }
   ```
2. **Metadata Title & Description:** Page-specific title format: `${TopicName} - Interactive ${Subject} Lab | OpenLabs`. Descriptions must summarize the topic, equations, and interactive objectives (140–160 characters).
3. **OpenGraph & Twitter Cards:** Must include fully-qualified image URLs and `type: "article"` for blog or `type: "website"` for labs.

---

## 6. Internal Linking & Subtopic Continuity

To prevent "Only one internal link" and "Low text-to-HTML ratio" crawl anomalies, all subtopic landing templates and standalone topic hubs implement reciprocal cross-linking:

- [`DsaLanding.tsx`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/app/computer-science/dsa/DsaLanding.tsx): Cross-links to sibling DSA topics with time complexity and category badges.
- [`LogicGateLanding.tsx`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/app/computer-science/logic-gates/LogicGateLanding.tsx): Cross-links to sibling logic gates and combinational circuits with Boolean expressions.
- [`NetworkingLanding.tsx`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/app/computer-science/networking/NetworkingLanding.tsx): Cross-links to sibling network architecture and protocol simulations.
- [`AiProblemLanding.tsx`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/app/computer-science/ai-problem/AiProblemLanding.tsx): Cross-links to sibling heuristic search, state space, and neural network simulations.
- **Genetics Experiment Sibling Grid:** All 4 Genetics experiment landing pages (`dihybrid`, `monohybrid`, `pedigree`, `transcription-translation`) cross-link to each other via `relatedExperiments` in `components/STEMExperimentLanding.tsx`.
- **Computer Science Standalone Labs:** `blockchain`, `data-analyzer`, `data-science`, and `git-simulator` link reciprocally to companion algorithm and data visualizers.
- **Subtopic Curriculum Discovery:** [`SubtopicHubLayout.tsx`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/app/components/SubtopicHubLayout.tsx) includes direct navigational pathways to discipline root hubs (`/${subjectSlug}`) and curriculum tracks (`/tracks`).

---

## 7. Structured Data (Schema.org) Guidelines

OpenLabs uses valid, clean JSON-LD structured data without conflicting inline HTML microdata:

- **Root EducationalOrganization (`app/layout.tsx`):** Declares institutional identity, logo, sameAs socials, and curriculum catalog. Must use Schema.org compliant `hasOfferCatalog` with `OfferCatalog` and `itemListElement` containing `Offer` items with `itemOffered: Course`. Never attach `Course`-specific properties (`teaches`, `educationalCredentialAwarded`, `hasEducationalUse`, `learningResourceType`) directly to `Organization` or place `Course` directly in `offers`.
- **Experiment Landing Pages:** `LearningResource`, `BreadcrumbList`, and `FAQPage`.
- **Blog Articles:** `BlogPosting`, `BreadcrumbList`, and `FAQPage` (when FAQs exist).
- **Subtopic & Discipline Hubs:** `CollectionPage`, `ItemList`, `BreadcrumbList`.
- **Contact Page:** `ContactPage`, `FAQPage`, and `BreadcrumbList`.

> [!NOTE]
> OpenLabs strictly avoids misleading schema types. Never add `Product`, `AggregateRating`, or `FactCheck` schema to educational landing pages unless actual e-commerce transactions or third-party claim verifications are being conducted.

---

## 8. Step-by-Step Protocols

### Adding a New Public Educational Experiment Safely
Follow the 9 steps in [`LAB_CREATION_GUIDE.md`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/LAB_CREATION_GUIDE.md):
1. **Interactive Lab Component:** Create `app/components/<subject>/<LabName>Lab.tsx`.
2. **Simulation Runtime Route:** Create `app/labs/<subject>/<slug>/page.tsx` (inherits `noindex` from `app/labs/layout.tsx`).
3. **Public Landing Route:** Create `app/<subject>/<slug>/page.tsx` with absolute canonical URL, learning schema, and sibling cross-links.
4. **Register in LABS Registry:** Add the entry to `app/lib/labs.ts` (`id: "<subject>/<slug>"`).
5. **AI Tutor Knowledge:** Add page context to `app/lib/pageKnowledge.ts`.
6. **Curriculum Track:** Add lab progression in `app/lib/tracks.ts`.
7. **Hub Links:** Add card link in `app/<subject>/page.tsx` and relevant subtopic explorer.
8. **Run SEO Regression Test:** Run `yarn test:seo`.

---

## 9. Automated Regression Testing & CI

OpenLabs enforces automated SEO regression testing locally and in CI:

```bash
# Run the automated SEO regression suite
yarn test:seo
```

The test script ([`scripts/seo-regression-test.cjs`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/scripts/seo-regression-test.cjs)) validates:
- Centralized route policy exports and classifications.
- Multi-layer lab exclusion shield (`layout.tsx`, `middleware.ts`, `robots.ts`).
- Route existence for key destinations (including `/computer-science/ai-problem/neural-network`).
- Sitemap purity (verifying 0 lab routes and 0 private routes).
- Blog SSG pre-rendering (`generateStaticParams` and `cache`).
- Subtopic cross-linking across DSA, Logic Gates, Networking, and AI problems.
- Microdata purity (0 residual HTML microdata tags).
- Negative security invariants.
- Schema.org organization compliance (verifying valid `hasOfferCatalog` rather than naked courses in `offers`).
- Sitemap route unauthenticated reachability (verifying `/leaderboard` in `publicPaths`).
- Absolute canonical URL enforcement on `/contact` and blog title length constraints ($\le 65$ characters).

In CI (`.github/workflows/guard.yml`), `yarn test:seo` runs automatically on every pull request and push to `main`.

---

## 10. Advertising & Monetization Crawler Hygiene

OpenLabs maintains strict separation between monetization scripts and educational simulation runtimes:
- **Display & Popunder Script Hygiene**: Google AdSense and Adsterra Anti-Adblock tags ([`app/layout.tsx`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/app/layout.tsx), [`app/lib/ads.ts`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/app/lib/ads.ts)) are declared on public pages for verification and monetization.
- **Interactive Simulation & Admin Hard-Exclusion**: Popunders, overlays, and display ad units are strictly suppressed on all `/labs/*` and `/admin/*` routes via [`AdsterraPopunder.tsx`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/app/components/AdsterraPopunder.tsx), [`GoogleAdSense.tsx`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/app/components/GoogleAdSense.tsx), `window.open` guards, and [`app/globals.css`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/app/globals.css).
- **Search Quality Compliance**: Guarantees compliance with Google Search Essentials and Page Experience criteria by preventing intrusive popups or layout shifts within interactive educational tools.

---

## 11. Edge 308 URL Canonicalization & Broken Path Recovery

To maintain search engine crawl efficiency, conserve crawl budget, and prevent 404 broken routes from entering telemetry or search logs:
- **Case Sensitivity & Lowercase Normalization**: Edge middleware ([`middleware.ts`](file:///c:/Users/rahul/OneDrive/Desktop/OpenLabs/openlabs/middleware.ts)) intercepts any non-lowercase URLs (e.g. `/LABS/CHEMISTRY/FLAME-TEST`) and permanently redirects (HTTP 308) to the canonical lowercase equivalent (`/labs/chemistry/flame-test`).
- **Whitespace & Encoding Cleanup**: Any pathnames containing `%20`, spaces, or double slashes (e.g. `/labs/computer%20-science/ai-%20problem/%20forward%20-backward`) are stripped of whitespace and redirected via HTTP 308 to their canonical destination.
- **Typo Recovery & Subject Hub Mapping**: Common path typos (`conputer-science` &rarr; `computer-science`, `al-problem` &rarr; `ai-problem`, `forward-backwardrnn` &rarr; `forward-backward`) and bare `/labs/<subject>` requests automatically redirect via HTTP 308 to their canonical public landing hubs (`/<subject>`).

