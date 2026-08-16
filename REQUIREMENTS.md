# OpenLabs — Requirements Document

This document describes the functional and non-functional requirements of OpenLabs as implemented today. It is derived from the current codebase (not a pre-implementation spec), and should be updated whenever behavior changes materially — see `CHANGELOG.md` for the history and `CLAUDE.md`/`AGENTS.md` for implementation conventions.

## 1. Purpose

OpenLabs is a web platform providing free, in-browser, interactive science labs and visualizations across Physics, Chemistry, Biology, Computer Science, and Mathematics, so students/educators/enthusiasts can explore concepts without physical lab equipment.

## 2. Functional requirements

### 2.1 Lab catalog & content
- FR-1: The system shall provide interactive lab pages across five subjects: Physics, Chemistry, Biology, Computer Science, Mathematics.
- FR-1a: The Physics Ohm's Law Lab shall support freeform circuit building with transient simulation (capacitors, AC sources) and provide real-time diagnostic tools (multimeter, oscilloscope).
- FR-1b: The Mathematics Function Grapher Lab shall provide real-time 2D plotting via D3, dynamic $a \cdot f(b(x-h))+k$ transformations, numerical root finding, local extrema detection, tangent line slope calculations, and Simpson's composite rule definite integration.
- FR-1c: The Mathematics Interactive Geometry Studio Lab shall provide compass-and-straightedge constructions, live Euler line $H-G-O$ collinearity, circle theorems, 2D matrix transformations, geometric Pythagorean proofs ($a^2 + b^2 = c^2$), and interactive 3D polyhedra ($V - E + F = 2$).
- FR-1d: The Mathematics Vector Algebra & 3D Space Lab shall support 2D/3D vectors with two-way editable coordinates, Parallelogram Law, Tip-to-Tail addition, Dot Product and orthogonal projections ($\text{proj}_{\vec{v}}(\vec{u})$), 3D Cross Product ($\vec{u} \times \vec{v}$) with Right-Hand Rule, Scalar Triple Product ($[\vec{u}, \vec{v}, \vec{w}]$) with parallelepiped volume box, and 3D lines and planes equations.
- FR-1e: The Mathematics Combinatorics & Discrete Counting Lab shall support permutations $P(n, r)$, combinations $C(n, r)$, multiset anagrams, Pascal's triangle with modulo $p$ fractals and live Binomial Theorem expansion, Dirichlet's Pigeonhole Principle, Ramsey Graph Theory ($R(3, 3) = 6$), Stars & Bars, Ferrers integer partition diagrams, Catalan numbers with Dyck paths, and Subfactorial Derangements ($!n$).
- FR-1f: The Mathematics Number Theory & Cryptography Lab shall support Sieve of Eratosthenes prime generation, Fundamental Theorem prime factor trees, Extended Euclidean Algorithm for Bézout's identity ($ax + by = \gcd(a, b)$) with geometric rectangle square tiling, Modular Clock arithmetic with Chinese Remainder Theorem systems, Euler's Totient $\phi(n)$ coprimality wheel, RSA public-key encryption and decryption, and Collatz conjecture $3n + 1$ orbit graphs.
- FR-2: Each lab shall have a public SEO landing page (theory, learning objectives, FAQs) separate from its interactive simulation page, which requires authentication.
- FR-3: Every lab shall be registered in a central catalog (`app/lib/labs.ts`) with a `type` (`simulation`, `exploration`, or `editor`) that determines its XP reward tier and daily-challenge eligibility.
- FR-4: The system shall auto-generate an LLM-crawlable site manifest (`/llms.txt`, `/llms-full.txt`) reflecting all current pages, without manual maintenance.

### 2.2 Accounts & authentication
- FR-5: Users shall be able to sign up with email/password; passwords are hashed before storage.
- FR-6: New accounts shall verify their email via a one-time 6-digit code (OTP), expiring after a fixed window.
- FR-7: Users shall be able to reset a forgotten password via an emailed OTP.
- FR-8: Users shall be able to sign in with OAuth (Google, GitHub, or Azure AD); a first-time OAuth sign-in shall provision an account automatically with the email pre-verified.
- FR-9: Regardless of sign-in method, an authenticated session shall be represented by a single JWT stored in an httpOnly cookie.
- FR-10: Unauthenticated users shall be redirected to login when accessing any lab simulation (`/labs/*`) or admin (`/admin/*`) route; subject landing pages, the blog, and marketing pages shall remain public.
- FR-11: Users shall complete a one-time profile setup (unique username, avatar, bio) after account creation.

### 2.3 Gamification (XP, levels, streaks, challenges)
- FR-12: Completing a lab shall award XP once per calendar day per lab, based on the lab's `type`.
- FR-13: Accumulated XP shall determine a user level via a fixed progression curve.
- FR-14: The system shall track a daily activity streak per user, incrementing on consecutive-day activity and resetting on a missed day.
- FR-15: The system shall generate one daily challenge per challenge-eligible lab, refreshed once every 24 hours.
- FR-16: Submitting a correct challenge answer shall award bonus XP (scaled by difficulty) and may grant badges (e.g. first challenge completed, streak milestones, subject mastery).
- FR-16a: The in-lab daily-challenge UI shall be presented as a floating, dismissible widget that draws attention without occupying lab page space or covering the lab's initial view.
- FR-17: Each user shall have a public profile page showing level, badges, and subject mastery (with sensitive data like activity logs hidden), and a private dashboard showing full account/activity detail.
- FR-17a: The system shall provide a global leaderboard, listing only users who have completed their profile setup (`profileSetupComplete: true`).

### 2.4 AI assistant
- FR-18: Authenticated users shall be able to ask an AI chat assistant questions about the lab/page they are currently viewing.
- FR-19: Each user shall be limited to a fixed number of AI queries per day (currently 10).
- FR-20: The assistant shall stay scoped to STEM/OpenLabs-relevant topics.
- FR-21: The assistant shall support speech-to-text input.

### 2.5 Blog & content management
- FR-22: The system shall support published/draft blog posts with slug-based URLs, categories, and cover images.
- FR-23: Only published posts shall be visible through public endpoints/pages.
- FR-24: Content administrators shall be able to create, edit, and delete blog posts, including uploading cover images, through an admin interface gated by a shared admin secret (in addition to standard authentication).
- FR-24a: Content administrators shall be able to inspect, search, filter, sort, export to CSV, and delete user accounts through an admin user telemetry dashboard (`/admin/users`) gated by a shared admin secret.

### 2.6 Code editor labs
- FR-25: The Computer Science "code lab" shall provide an in-browser HTML/CSS/JS editor with saved projects per user.
- FR-26: Users shall be able to create, list, and delete their own projects.
- FR-27: The JS Event Loop Visualizer shall let users run their own JavaScript through a deterministic, fully-sandboxed simulation engine (no real network/timers; runaway loops and recursion stopped by safety budgets), in either Browser or Node.js queue-ordering semantics, with every piece of runtime state visible simultaneously during playback on all device sizes.

### 2.7 SEO & discoverability
- FR-27: The system shall expose `sitemap.xml` and `robots.txt`, regenerated on a bounded cache interval.
- FR-28: Each lab/blog page shall carry accurate metadata (title, description, canonical URL, Open Graph/Twitter tags) and structured data (schema.org) where applicable.

### 2.8 Theming
- FR-29: Users shall be able to switch between light, dark, and system-matched appearance via a toggle in the navigation bar; the choice shall persist across sessions and avoid a flash-of-wrong-theme on load.
- FR-30: Core navigation, shared UI chrome, and lab UI chrome (panels, buttons, text) shall render correctly in both themes; simulation/visualization *content* (canvas draw colors, 3D material colors, chart data-series colors, data-encoding legend/status colors) is exempt and may remain fixed regardless of theme. Deliberately dark-by-design surfaces (code editors, terminals, a small number of labs with a fixed dark aesthetic) are exempt by design, not by omission — see `CLAUDE.md` § Theming for the current exemption list.

## 3. Non-functional requirements

- NFR-1 (Deployment): The application shall be deployable on Vercel, including a daily cron job for challenge generation.
- NFR-2 (Data store): User, content, and progress data shall be persisted in MongoDB via Mongoose, with a cached connection reused across serverless invocations.
- NFR-3 (Security headers): Responses shall include standard hardening headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).
- NFR-4 (Secrets): Sensitive configuration (DB URI, JWT secret, OAuth credentials, admin secret, cron secret, AI API keys, email credentials, Cloudinary credentials) shall be supplied via environment variables, never committed.
- NFR-5 (Media): User-uploaded images (blog covers, avatars) shall be stored via Cloudinary, validated for type and size before upload.
- NFR-6 (Client rendering): Simulation components using canvas/WebGL/DOM-heavy libraries (three.js, d3, p5) shall be client-rendered only (no SSR) to avoid server-side rendering errors.
- NFR-7 (Rate limiting): AI chat usage shall be rate-limited per user per day to bound third-party API cost.
- NFR-8 (Caching): Static assets and generated crawler manifests shall carry cache-control headers appropriate to their volatility (long-lived for static assets, short `s-maxage` for generated text manifests).
- NFR-9 (Licensing gate): Local dev/build/start and CI shall pass a proprietary guard check (`@hackeryard/mandatory-guard`) before proceeding.

## 4. Out of scope / not implemented

These exist as placeholders or partial scaffolding in the codebase but are **not functioning features** — do not assume they work, and confirm intent before building on them:

- Server-side code execution for the "run code" flow (`app/api/auth/run` returns a hardcoded stub, no sandbox/Docker execution exists yet).
- The standalone external "AI agent" service integration (`app/api/agent`) — superseded by `app/api/chat`, currently has no caller, and unlike `app/api/chat` has no authentication or rate limiting (a gap to close before ever wiring it up, not a pattern to copy).
- Google OAuth's dedicated `start`/`callback` routes — actual Google login goes entirely through NextAuth instead.
- Per-user admin roles (RBAC) — admin access today is a single shared secret, not scoped per user.
- **A single, unified theming system** — the six DSA sorting-algorithm labs (`app/components/computer-science/dsa/sorting/*`) run their own independent local dark/light toggle predating the site-wide `next-themes` rollout; the two are not reconciled, so a user can have the sorting labs in a different visual mode than the rest of the site. See `CLAUDE.md` § Theming for the full list of components not yet migrated to the shared token system.

## 5. Open questions / suggested follow-ups

- Decide whether to remove the dead code paths in §4 or finish implementing them (notably server-side code execution, which is a natural fit for the Computer Science code lab).
- Reconcile `eslint.config.js` (currently inert for `app/**/*.{ts,tsx}`) with `eslint-config-next` so TypeScript app code is actually linted by one canonical config.
- Consider adding automated tests — none currently exist, and CI does not run lint/typecheck/build, only the license guard.
