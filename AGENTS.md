# AGENTS.md

Instructions for AI coding agents (Codex, Cursor, Copilot Workspace, Claude Code, etc.) working in this repository. This file follows the [agents.md](https://agents.md) convention. Claude Code should treat `CLAUDE.md` as the primary, more detailed reference — this file is a tool-agnostic summary for any agent.

## Project

OpenLabs — a Next.js 14 (App Router, TypeScript) platform of interactive, in-browser science labs (Physics, Chemistry, Biology, Computer Science, Mathematics), with auth, a blog, an admin panel, XP/gamification, and an AI chat assistant. MongoDB (Mongoose) + Vercel deployment.

## Setup & commands

```bash
yarn install     # requires NPM_TOKEN for the private @hackeryard scope (.npmrc)
yarn dev          # start dev server, http://localhost:3000
yarn build         # production build
yarn lint           # next lint
yarn test:seo       # run automated technical SEO & indexing regression suite
```

- Package manager: **Yarn 1.22.22** (pinned via `packageManager` in package.json). Don't switch to npm/pnpm.
- `predev`/`prebuild`/`prestart` run `scripts/guard.cjs` (a private license/env gate: `@hackeryard/mandatory-guard`). If a command fails immediately with a guard error, that's this gate — not a code problem.
- **Automated Tests**: Technical SEO and indexing invariants are validated via `yarn test:seo` (`scripts/seo-regression-test.cjs`). General unit test runner is not present, so do not assume `yarn test` works.
- CI (`.github/workflows/guard.yml`) runs `yarn install --frozen-lockfile`, the security guard script (`scripts/guard.cjs`), and the automated SEO regression suite (`scripts/seo-regression-test.cjs`). Run `yarn lint`, `yarn test:seo`, and check `yarn tsc --noEmit` yourself before calling a change done.

## Code conventions

- `tsconfig.json` has `strict: false` and a `@/*` → repo-root path alias. Imports like `@/app/lib/...`, `@/lib/...`, `@/components/...` are all valid and point at *different* top-level dirs (`app/lib` vs root `lib`, `app/components` vs root `components`) — don't assume they're the same directory.
- New interactive labs require **all 9 steps** documented in **[`LAB_CREATION_GUIDE.md`](LAB_CREATION_GUIDE.md)**: component (`app/components/<subject>/<LabName>Lab.tsx`), simulation route (`app/labs/<subject>/<slug>/page.tsx` with `ssr: false`), XP gamification & next-lab modal hook (`useLab()`), AI tutor knowledge base (`app/lib/pageKnowledge.ts`), SEO landing page (`app/<subject>/<slug>/page.tsx`), central registry entry (`app/lib/labs.ts`), curriculum track sequence (`app/lib/tracks.ts`), navigation/hub links (`Navbar.tsx`, `Hero.tsx`, `app/<subject>/page.tsx`), and XML sitemap (`app/sitemap.ts`).
- **Technical SEO & Indexing Policy**: Route classification is centralized in [`app/lib/seoRoutePolicy.ts`](app/lib/seoRoutePolicy.ts). Public educational landing pages (`/<subject>/<slug>`) are indexable with self-referencing absolute canonical URLs. Interactive lab simulations (`/labs/*`) are intentionally non-indexable and protected by a 3-layer defensive shield: `app/labs/layout.tsx` (`robots: { index: false, follow: false, nocache: true }`), `middleware.ts` (`X-Robots-Tag: noindex, nofollow, noarchive`), and `app/sitemap.ts` (`isSitemapEligible()` filter guaranteeing 0 lab routes enter the sitemap). Public routes like `/leaderboard` are included in `publicPaths` in `middleware.ts` to guarantee HTTP 200 for search crawlers. Root layout enforces 100% compliant Schema.org `EducationalOrganization` using `hasOfferCatalog` with `OfferCatalog` and `Offer` items. See [`SEO_MAINTENANCE.md`](SEO_MAINTENANCE.md).
- **Subtopic & Sibling Landing Pages**: Subtopic landing pages across DSA, Logic Gates, Networking, AI problems, Genetics experiments (`dihybrid`, `monohybrid`, `pedigree`, `transcription-translation`), and standalone CS modules (`blockchain`, `data-analyzer`, `data-science`, `git-simulator`) implement reciprocal cross-linking between sibling experiments, preventing single-internal-link crawl warnings.
- **Blog Engine Performance**: Blog articles under `app/blog/[slug]/page.tsx` use `generateStaticParams()` for build-time SSG pre-rendering and wrap queries in React `cache()`, maintaining Edge response times under 100ms.
- **Browser Translation & WebGL Resilience**: `TranslationGuard.tsx` in `app/layout.tsx` intercepts `removeChild` and `insertBefore` mutations from Chrome/Safari translation engines to prevent VDOM crashes. All 3D canvases implement `webglcontextlost` and `webglcontextrestored` event handlers and wrap renders in `WebGLErrorBoundary.tsx`.
- **Advertising & Lab Exclusions (Google AdSense & Adsterra)**: Ad scripts and popunder triggers are strictly suppressed on all `/labs/*` and `/admin/*` routes via route listeners, `data-no-ads` body attributes, `window.open` ad guards, and CSS suppression in `app/globals.css`. Centralized constants reside in `app/lib/ads.ts`. The direct publisher entry `google.com, pub-4121707034074280, DIRECT, f08c47fec0942fa0` is hosted at `public/ads.txt`, with `app/robots.ts` and `next.config.js` granting unhindered public access to `Mediapartners-Google` and external crawlers without restrictive framing headers.
- Subject discipline landing pages (`app/<subject>/page.tsx`) and sub-topic hubs (`app/<subject>/<subtopic>/page.tsx`) follow the `/physics` design system: radial dot grid, live search/tag explorers (`<SubtopicCardExplorer />`), curriculum tracks banner (`<CurriculumTracksExplorer />`), computational principles matrices (GEO), HowTo procedural protocols (AEO), curriculum alignment, single-open FAQs, and complete Schema.org JSON-LD (`CollectionPage`, `ItemList`, `HowTo`, `FAQPage`, `BreadcrumbList`).
- `/labs/*` and `/admin/*` require auth (enforced in root `middleware.ts`); subject landing pages, `/tracks`, and `/blog` are public.
- Admin routes (`/admin/*`) and the isolated admin subdomain (`admin.openlabs.org.in`) enforce Role-Based Access Control (RBAC) with `admin` and `moderator` roles; regular users receive an in-place 403 Access Restricted screen without administrative chrome.
- Client telemetry, Core Web Vitals (RUM), and behavioral frustration signals are observed passively via `app/components/OpenLabsTracker.tsx` and `app/lib/tracker.ts` (strictly suppressed on `localhost`, dev mode, and `/admin`), persisting into `PageView` and `AnalyticsEvent` collections for the `/admin/analytics` dashboard.
- Lab feedback submissions (`FloatingLabFeedback.tsx`, `FeedbackPulse.tsx`, `/api/feedback`) enforce strict validation: star rating (1–5) is mandatory, and a descriptive comment is mandatory for ratings < 3 stars or not-helpful feedback.
- Don't extend `app/api/agent`, `app/api/auth/run`, or `app/middleware/middleware.js` — they're dead/unimplemented code paths, not the active implementation (see `CLAUDE.md` "Known drift / rough edges").
- `app/hooks/useXP.ts` exports `useLab` (providing `completeExperiment()`, `nextLabProgression`, and next-lab modal triggers).
- Light/dark theming uses semantic Tailwind tokens (`bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `bg-accent`) backed by CSS variables in `app/globals.css`, not Tailwind's `dark:` prefix — match that convention, and see `CLAUDE.md` § Theming for the token-mapping table and the list of surfaces deliberately left dark-only or unconverted.

## Docs to keep in sync (MANDATORY INVARIANT)

**CRITICAL RULE**: When you change ANY code or behavior, you MUST update all relevant companion docs in the EXACT SAME commit/task. Never skip documentation or leave it as a follow-up task:

- **`README.md`** — user-facing setup, features, new labs, and stack.
- **`CLAUDE.md`** — architecture/conventions for Claude Code and AI agents.
- **`AGENTS.md`** (this file) — tool-agnostic agent instructions.
- **`REQUIREMENTS.md`** — functional/non-functional requirements reflecting shipped features.
- **`ROADMAP.md`** — product roadmap, marking completed milestones as `[SHIPPED]`.
- **`CHANGELOG.md`** — dated, factual record of what shipped, newest on top.
- **`SEO_MAINTENANCE.md`** — technical SEO, indexing, and sitemap policies.
- **`.agents/rules/documentation-sync.md`** — workspace rule enforcing this mandate across all agents.

## PR / commit conventions

Follow the existing git history style: short, lowercase, imperative commit subjects (e.g. `fix github workflow failing`, `feat: add node-voltage engine and transient simulation for ohms law`). No enforced conventional-commit format, but `feat:`/`fix:` prefixes appear in recent history for notable changes.
