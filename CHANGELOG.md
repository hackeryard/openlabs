# Changelog

All notable changes to OpenLabs are documented in this file. Format loosely follows [Keep a Changelog](https://keepachangelog.com/); since the project has no version tags yet, entries are grouped by date instead of version number. Generated from git history; merge commits and duplicate/typo commits are omitted.

## Unreleased

- Added a new Biology lab: photosynthesis simulation.
- Added a simulator engine and core types for a JavaScript event-loop visualization lab.

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
