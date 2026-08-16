# Changelog

All notable changes to OpenLabs are documented in this file. Format loosely follows [Keep a Changelog](https://keepachangelog.com/); since the project has no version tags yet, entries are grouped by date instead of version number. Generated from git history; merge commits and duplicate/typo commits are omitted.

## Unreleased

- **Mathematics Subject & Function Grapher Lab**:
  - Introduced the new **Mathematics** subject category with dedicated portal page (`/mathematics`) and themed error boundary (`app/mathematics/error.tsx`).
  - Added the **Function Grapher** lab (`/mathematics/functiongrapher` and `/labs/mathematics/functiongrapher`):
    - Real-time 2D mathematical curve plotting built with D3 and safe symbolic math AST parsing via `mathjs`.
    - Live function transformations ($a \cdot f(b(x - h)) + k$) with interactive sliders, reflections, and automatic plain-English explanations.
    - Numerical calculus engine with bisection root-finding ($f(x) = 0$), $y$-intercepts, local extrema detection (turning points), instantaneous tangent lines ($f'(x)$), and Simpson's composite rule definite integration ($\int_a^b f(x) dx$).
    - Point inspector with click-to-pin coordinate lock, live tangent readout, and multi-function evaluation comparison table.
    - Mathematical function preset gallery (Polynomials, Trigonometric, Rational, Exponential, Gaussians, Dampened Oscillators) and quick keypad.
    - Daily Challenge and XP integration (`mathematics/functiongrapher` registry entry, `rootsFound`, `functionsPlotted`, `transformationsApplied` challenge metrics).
    - SEO landing page with schema markup, curriculum alignment (NCERT, AP Calculus, IB Math, A-Levels), and AI assistant context integration (`useChat().setExperimentData`).

- **Virtual Titration Lab**:
  - Added interactive Virtual Titration Lab (`/chemistry/titration` and `/labs/chemistry/titration`) featuring unified SVG apparatus (burette, stopcock drop animation, Erlenmeyer flask, and live indicator color transitions).
  - Integrated live pH curve graphing (Chart.js), stoichiometry calculations ($C_1 V_1 = C_2 V_2$), practice modes, and human-readable indicator color observation log exporter.
  - Fully mobile & tablet responsive layout (desktop 3-column application layout, mobile vertical scroll).

- **Single Source of Truth Auth Architecture & Cookie Invalidation**:
  - Implemented global `AuthProvider` (`components/AuthProvider.tsx`) providing explicit 4-state state machine: `LOADING`, `UNAUTHENTICATED`, `AUTHENTICATED_BUT_UNVERIFIED`, and `AUTHENTICATED`.
  - Added automatic cookie invalidation: whenever `/api/auth/me` rejects a session with HTTP status 401 (invalid/expired JWT), 403 (unverified email / `emailVerified` flipped to false in DB), or 404 (user deleted), `AuthProvider` automatically calls `POST /api/auth/logout` to destroy stale `auth-token` and `next-auth` cookies from the browser.
  - Hardened `middleware.ts` to decode JWT expiration in Edge Runtime (`isJwtExpired`) and delete expired cookies on response, completely eliminating stale cookie presence and preventing redirect loops to `/`.
  - Unified `Navbar.tsx`, `AuthPage.tsx`, `ProfileViewClient.tsx`, and `verify-email/page.tsx` around `useAuth()`.

- **Auth, Email Verification & Login Security Enforcement**:
  - Enforced strict `emailVerified` checking in `POST /api/auth/login` and `GET /api/auth/me`. Attempting to log in to an unverified email account is now denied with HTTP status 403 Forbidden (`requiresVerification: true`).
  - Integrated automatic OTP trigger (`POST /api/auth/send-otp`) and automatic redirection to `/verify-email?email=...` in `AuthPage.tsx` and `LoginFormWithParams.tsx` whenever an unverified user submits login or completes signup.
  - Fixed `AuthPage.tsx` hardcoding `callbackUrl: "/"` for Google and GitHub OAuth providers. It now extracts `next` or `callbackUrl` from search parameters (`useSearchParams()`), ensuring users who get redirected to login from protected labs (e.g. `/labs/chemistry/titration` or `/labs/physics/ohmslaw`) are returned directly back to their target lab post-login instead of the homepage.
  - Wired up password & signup form handling in `AuthPage.tsx` to submit to `/api/auth/login` and `/api/auth/signup`, set authentication cookies, handle errors gracefully, and perform dynamic redirection to `nextPath`.
  - Wrapped `AuthPage` in `<Suspense>` boundaries in `app/login/page.tsx` and `app/signup/page.tsx` for proper SSR/CSR hydration.

- **Admin User Management & Telemetry Dashboard** (`/admin/users`, `/api/admin/users`):
  - **Admin Route UI** (`app/admin/users/page.tsx`): Built a comprehensive user management portal gated by Admin Secret authentication. Includes real-time search, email verification filters, aggregated platform statistics (Total Users, Verified Count, Profile Setup %, Platform XP, Completed Labs, AI Queries), tabular user telemetry view, and a slide-over telemetry drawer for inspecting complete user metadata (XP, Level, Streak, Completed Experiments, Subject Mastery, Badges, AI Assistant activity, and Account deletion).
  - **Admin API Endpoints** (`app/api/admin/users/route.ts`, `app/api/admin/users/[id]/route.ts`): Built secure endpoints gated by `x-admin-secret` to query MongoDB user documents, calculate platform statistics, fetch individual user telemetry, and support account deletion.

- **Enterprise Technical SEO & Modular Educational Knowledge Graph Architecture**:
  - **Site-Wide Layout Rollout**: Integrated `<Breadcrumbs />`, `<FormulaSection />`, and `<EducationalGraphSection />` directly into both shared landing layouts (`EducationalLandingLayout.tsx` and `PhysicsExperimentLanding.tsx`). Every single lab page across Physics, Chemistry, Biology, and Computer Science now automatically renders breadcrumb navigation, formula tables, and the Educational Knowledge Graph (Prerequisites, Next Steps, and Related Labs).
  - **Schema Deduplication**: Consolidated schema injection into a single `<StructuredData />` script wrapper inside `SchemaMarkup.tsx` and `PhysicsExperimentLanding.tsx`, eliminating duplicate JSON-LD script tags across all lab pages.
  - **Shared Type System & Constants** (`app/lib/types/`, `app/lib/constants/`): Centralized interfaces (`knowledge.ts`, `seo.ts`, `schema.ts`) and subject metadata constants (`subjects.ts`, `difficulty.ts`, `levels.ts`).
  - **Focused SEO Builders & Recommendation Engine** (`app/lib/seo/`): Normalizing canonical builder (`canonicalBuilder.ts`), intent-based keyword builder (`keywordBuilder.ts`), focused metadata creators (`metadata/lab.ts`, `metadata/subject.ts`, `metadata/article.ts`), and schema creators (`schema/breadcrumb.ts`, `schema/learning.ts`, `schema/faq.ts`, `schema/article.ts`). Fixed brand title template duplication (`%s | OpenLabs`).
  - **Recommendations API** (`app/lib/seo/relatedContent.ts`): Clean internal linking API (`getRelatedContent()`, `getRelatedLabs()`).
  - **Modular Knowledge Graph** (`app/lib/knowledge/`): Domain concept registries (`concepts/`), learning paths (`paths/`), formula registries (`formulas/`), graph query engine (`graph.ts`), and build-time validator (`validator.ts`).
  - **Robots, Sitemap, Edge OG & AI Discoverability**: Dynamic sitemap (`sitemap.ts`) iterating LABS registry and blogs, updated `robots.ts`, Edge OG Image Generator (`app/api/og/route.tsx`) with 1-year immutable CDN headers, AI search crawler markdown route (`/llms.txt`), internal SEO dashboard (`app/admin/seo-dashboard`), and build-time CI audit script (`scripts/seo-audit.ts`).


- **Ohm's Law Simulator Overhaul**: 
  - Refactored the Ohm's Law physics lab (`/physics/ohmslaw`) into a freeform, full-screen interactive circuit builder.
  - Replaced the simple static DC calculation with a dynamic node-voltage simulation engine (`engine.ts`), supporting real-time transient simulation with Backward Euler integration for Capacitors.
  - Added support for AC (sine wave) batteries with adjustable frequency and amplitude.
  - Built an interactive Component Tray with drag-and-drop components (Resistor, Variable Resistor, Capacitor, Bulb, Switch, Fuse, Wire) and probes.
  - Added a draggable Multimeter widget with independent red and black probes to measure voltage drops across arbitrary nodes in real-time.
  - Added a live Oscilloscope view in the Circuit Canvas to graph voltages across components over time.
  - Added a global Properties Panel for live stats and a Voltage Sweep plot analyzer.

- **Profile & Leaderboard Polish**:
  - Restructured the public profile view (`/profile/[username]`) for better privacy by removing sensitive data (activity logs, throughput metrics, experiment timelines, daily targets, and join date) from both the UI and the API response. Guest viewers now only see core stats, subject mastery, and badges.
  - Fixed hardcoded theme colors (`bg-indigo-50`, `text-indigo-600`, `text-white`) across both the private and public profile dashboards. They now use adaptive semantic CSS variable tokens (`bg-primary/10`, `text-primary`, `text-foreground`) to render beautifully in both Light and Dark mode.
  - Fixed a UI crash in the profile editing menu where the `AVATARS` array wasn't imported.
  - Added a filter to the global leaderboard (`/api/leaderboard`) to only list users who have completed their initial profile setup (`profileSetupComplete: true`). Logged-in users who haven't completed setup now see a prominent "Setup your profile to join the race" banner.

- SEO audit remediation (from a third-party crawler report, 125 findings): fixed `components/PhysicsExperimentLanding.tsx`, a Client Component that server-rendered an empty `<main>` shell (mount-gated behind `useState`/`useEffect`) — root cause of "missing H1," "thin content" (24 words), and "duplicate content" findings across all 11 physics lab pages simultaneously; converted to a Server Component, now renders ~370+ words of real theory/FAQ content server-side. Fixed `app/computer-science/ClientGrid.tsx`'s heading skip (h1→h3, no h2) and added an optional `intro` paragraph, applied to all 6 hub pages using it (computer-science, code-lab, dsa, logic-gates, networking, ai-problem) to resolve "thin content." Found and fixed a metadata-inheritance bug the crawler under-reported: `/computer-science/dsa` and `/computer-science/dsa/sorting` were unnecessarily Client Components with no metadata of their own, silently inheriting the parent hub's title/description/canonical wholesale — gave both their own metadata following the working `logic-gates`/`networking` pattern, and replaced dsa/sorting's duplicated hand-rolled grid markup with the shared `ClientGrid`. Found (not in the crawler report) and fixed a `"| OpenLabs"` title-doubling bug live on `/chemistry`, `/biology`, and `/computer-science` (root layout's `title.template` was appending the site name a second time on top of an already-baked-in suffix) — empirically verified via live curl that Next's `title.template` does NOT cascade past one intervening layout with its own title, so nested subpages need the suffix baked in directly while top-level hub pages must not. Fixed `chemistry/periodictable`'s independent H2→H4 heading skip (4 separate instances). Trimmed title/meta-description length on ~20 static pages and 5 blog posts (via the admin API) to fit within typical SERP snippet limits.
- SEO fixes driven by real Google Search Console data (3-month export): added a `next.config.js` redirect sending the apex domain (`openlabs.org.in`) to the canonical `www.openlabs.org.in` host — GSC showed both being indexed as separate URLs, splitting ranking signal for identical content. Retitled `/computer-science/code-lab/js` (title/OG/twitter) to front-load "JavaScript Visualizer", the exact short phrase GSC showed real search volume for (171 impressions, 0.58% CTR at position ~7.5) that the old title wasn't converting. Added "Visualization" as explicit synonym coverage to the merge-sort DSA page's title/description (164 impressions, 0 clicks at position 9.49 for "merge sort visualization"). Rewrote the `edtech-labs-virtual-science-labs` blog post's `metaTitle`/`metaDescription` (via the admin API, content untouched) — that single post was ~25% of the entire site's search impressions (2,407) at a 0.08% CTR, badly dragging down aggregate site CTR.
- SEO cleanup: added 13 landing pages missing from `app/sitemap.ts` (all 6 AI-problem labs, all 7 logic-gate labs) that were previously undiscoverable via sitemap. Removed the Mathematics subject (`/maths/alzebra` — landing and interactive pages were both unfinished placeholder stubs) and the Java code lab (`/computer-science/code-lab/java` — interactive page was an empty stub) entirely: deleted the routes, dropped `/maths` from `robots.ts`/`middleware.ts`'s public-path lists, dropped `mathematics` from `app/lib/labs.ts`'s `Lab["subject"]` union, and removed every marketing/metadata/JSON-LD/`llms.txt` claim that either was a working feature (`app/layout.tsx`, `app/page.tsx`, `app/about/page.tsx`, `lib/llms.ts`, `README.md`, `REQUIREMENTS.md`) — both were reachable pages with SEO metadata promising functionality that didn't exist.
- Redesigned the site-wide `DailyChallengeCard` from a full-width in-flow banner (which covered a large share of each lab's initial view) into a floating, fixed-position widget: a pulsing "Daily Challenge" pill docked above the OpenLabsAI chat button (bottom-right) that expands into a compact popover panel on click. Zero page-space cost on every lab; same public props (`labId`, `currentParams`), so no lab needed changes.
- Completed the 4-phase JS Event Loop Visualizer rebuild (`app/labs/computer-science/code-lab/js`): (A) wired the `lib/runtime/*` sandbox engine into the UI with a free-form "write your own code" mode plus loop/recursion safety guards; (B) theme migration + responsive shell; (C) new event-loop concepts — simulated `fetch`, `requestAnimationFrame`, DOM click events, Node runtime mode (`process.nextTick`/`setImmediate`), unhandled-rejection tracking; (D) presets now execute through the same runtime engine as user code (single source of truth — hand-authored instruction timelines removed) with 4 new presets and a category-grouped example picker.
- Fully redesigned the JS Event Loop Visualizer UI as a "Live Dashboard": every runtime panel (code with active-line follow, Call Stack, Web APIs, Micro/Macro/rAF/Node queues, animated event-loop hub with per-step narration, console) is simultaneously visible on all viewports with zero page scroll; task chips animate between panels via Framer Motion `layoutId`; static help moved to a modal; playback bar (pinned, with console-output timeline markers) gained a compact mobile variant. Replaced 12 components with 9 new ones; engine/state logic untouched.
- JS Event Loop Visualizer shell sizing: the dashboard fills exactly one viewport (complete initial view, playback bar always visible on load) while the page remains scrollable below it to reach the global site footer.
- Added a new Biology lab: photosynthesis simulation.
- Added a simulator engine and core types for a JavaScript event-loop visualization lab.
- Added `CLAUDE.md`, `AGENTS.md`, `CHANGELOG.md`, `REQUIREMENTS.md`, and six Claude Code skills (`new-lab`, `sync-docs`, `audit-labs-registry`, `seo-page`, `env-doctor`, `new-blog-post`); fixed several README inaccuracies (broken TOC anchor, wrong model filename, wrong AI chat env var).
- Deep-crawled the full codebase (all API routes, models, hooks, lib helpers, every subject's lab components) to verify and substantially expand `CLAUDE.md`: full auth-bridge writeup (custom JWT ↔ NextAuth Google OAuth sync), exact XP/level formulas, both AI-chat integrations documented separately (`/api/chat` vs. the unauthenticated dead `/api/agent`), per-subject component conventions, complete env var list, and additional known-drift items (`useXP.ts` exporting a hook called `useLab`, `Navbar`/`Hero` hardcoding their own lab lists instead of reading `labs.ts`, `Project.ts`'s unguarded model-cache-clearing pattern, the `app/lib/devMock.js` dev-login bypass, and the Mathematics subject being an unfinished stub). Updated `AGENTS.md` and `REQUIREMENTS.md` with the same findings, kept short per each file's own scope.
- Added a seventh skill, `gamification-change`, documenting the duplicated streak/activity-log/XP-application logic between `/api/challenges/validate` and `/api/xp/complete` so future edits update both paths instead of drifting.
- Updated `README.md`: added the previously-undocumented Biology labs (photosynthesis, brain/neuron, blood), Chemistry's water-quality lab, and Physics' unregistered opticslens lab to the feature/route lists; corrected the Computer Science JS lab description (it's now an Event Loop Visualizer, not the older step-through debugger); added a Mathematics routes section flagging `alzebra` as an unfinished placeholder; refreshed the "Latest Updates" teaser and date stamp.
- Rolled out a site-wide light/dark theme toggle: added `next-themes`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`, and `animejs`; added `components/ThemeProvider.tsx`, `components/ui/{ThemeToggle,AmbientBackground,AnimatedCard}.tsx`, and `lib/utils.ts` (`cn()` helper); defined light/dark CSS custom properties in `app/globals.css` and matching semantic Tailwind tokens (`bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `bg-accent`, etc.) in `tailwind.config.js`; wired the provider and toggle into `app/layout.tsx`/`Navbar.tsx`. Converted the bulk of the site to the new tokens: all Physics and Chemistry lab components, most Biology components (most of that subject was already a self-contained dark UI and needed no change), most Computer Science lab components (DSA linked-list/queue/stack, all `git-simulator` panels, both `networking` switching labs), 23 of 58 `app/labs/**` wrapper pages, the admin blog CRUD pages, the profile pages, `setup-profile`, and the `OpenLabsAI`/`DailyChallengeCard` shared components. Verified with a full-project `tsc --noEmit` (zero errors) after each batch. Left several surfaces deliberately unconverted because they're permanently dark by design (code editors, terminals, a handful of labs with a fixed dark aesthetic) or because the color is data-encoding rather than chrome (sort/signal-state highlighting, periodic-table category colors, badge tiers) — see `CLAUDE.md` § Theming for the full list. Notable open item: the six DSA sorting-algorithm labs have their own pre-existing, independent light/dark toggle that is not yet reconciled with the new site-wide one.
- Registered the `physics/opticslens` lab in the central catalog (`app/lib/labs.ts`), enabling it to earn XP and receive daily challenges.
- Redesigned the login and signup pages to use a shared `components/AuthPage.tsx`, and expanded NextAuth to support GitHub and Azure AD OAuth providers alongside Google.

## 2026-06-25 — Analytics & CI stabilization

- Integrated Microsoft Clarity analytics with custom event tracking and user profile dashboard components; updated `llms.txt` generation to follow current recommendations.
- Fixed the GitHub Actions guard workflow (npm auth/env issues) after several iterations.

## 2026-06-10 — 2026-06-14 — Branding & UX polish

- Updated favicon/nav logo and general SEO tuning.
- Added `OpenLabsAILoader` for conditional AI chat loading based on auth state.
- Updated educational landing-page layout styles and added schema.org markup for learning resources.
- Redesigned the profile page UI.

## 2026-05-30 — 2026-06-01 — Site-wide restructure for SEO

- Restructured the project layout for better Google/AI search ranking.
- Fixed sitemap regeneration cadence (every 12h) and revised daily-challenge/XP logic.
- Refactored logic-gate pages to use centralized gate content and metadata generation.
- Added/redesigned Physics and Chemistry lab pages; fixed CS pages and periodic-table element modal responsiveness.
- Reorganized the blockchain lab's ID in `labs.ts` for better categorization; added `sharp` for image processing.

## 2026-05-24 — 2026-05-31 — Blog, gamification polish, chatbot hardening

- Integrated a Cloudinary-powered blog engine, a responsive profile dashboard, and further SEO optimizations.
- Added auth gating, rate-limiting, off-topic filters, and scrolling UX improvements to the AI chatbot.
- Redesigned the daily-challenge card; updated README.
- Fixed blog visibility, robots.txt, and middleware rules to make blog pages public.

## 2026-05-09 — 2026-05-18 — Accounts, profiles, gamification

- Implemented user authentication and profile management (username setup, avatar, bio).
- Introduced the daily-challenges, XP, levels, and badges system.
- Improved searchability: sitemap/canonical URL fixes, meta title/description fixes, removed a dead maths URL from the sitemap.

## 2026-03-29 — Infra fixes

- Fixed a database connection problem and upgraded the guard package version.
- Updated the GitHub Actions workflow for npm authentication and added required permissions.

## 2026-02-21 — 2026-02-28 — Computer Science & Biology expansion

- Added logic gates (AND/OR/NAND/NOR/XOR/XNOR) pages.
- Added a JavaScript execution visualizer, a Git command simulator, and Vercel Speed Insights/Analytics.
- Added an AI chatbot for explaining experiments, including speech-to-text input.
- Added sorting algorithm visualizations and a Stack/Queue/Linked-List data structure visualizer; later redesigned the sorting simulations.
- Added computer networking pages (circuit builder, packet switching, topology builder, OSI model).
- Added AI problems, blockchain understanding, data science, and data analysis sections.
- Added water-quality assessor, blood group simulator, and brain-neuron signal simulator (Biology).

## 2026-02-06 — 2026-02-08 — Auth hardening & polish

- Added a Computer Science code lab with an HTML/CSS/JS editor and project management.
- Added the private `@hackeryard` auth/guard package and GitHub Packages npm configuration.
- Added LICENSE (later changed to Proprietary with a trademark notice).
- Added professional custom error pages, enhanced navigation, and a lab discovery hub; added a JS debugger and subject-specific error pages.

## 2026-01-20 — 2026-02-03 — Auth & Biology foundations

- Added the authentication system with email OTP verification.
- Added interactive Biology pages: human anatomy and cell structures, including a 3D human anatomy model.

## 2025-12-21 — 2026-01-04 — Project bootstrap

- Initial commit and project scaffold.
- Added Chemistry reaction-simulation page with Framer Motion animation.
- Added 3D lab/atomic views for chemical reaction simulations.
