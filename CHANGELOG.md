# Changelog

All notable changes to OpenLabs are documented in this file. Format loosely follows [Keep a Changelog](https://keepachangelog.com/); since the project has no version tags yet, entries are grouped by date instead of version number. Generated from git history; merge commits and duplicate/typo commits are omitted.

## Unreleased

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
