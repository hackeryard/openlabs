# CLAUDE.md

This file is the **single source of truth** for AI coding agents (Claude Code and others) working in this repository. It is kept current by design — see [Keeping this file current](#keeping-this-file-current) at the bottom. Read this before exploring the codebase; it should remove the need to re-derive architecture from scratch each session.

Companion docs, each with a distinct job — don't duplicate content between them, cross-reference instead:
- **[AGENTS.md](AGENTS.md)** — cross-tool-standard entry point (Cursor/Codex/etc.), condensed operational summary that points back here for depth.
- **[REQUIREMENTS.md](REQUIREMENTS.md)** — product scope: what OpenLabs is for, functional/non-functional requirements per module, explicit out-of-scope items.
- **[CHANGELOG.md](CHANGELOG.md)** — dated, factual record of what shipped, derived from git history.
- **[README.md](README.md)** — human/contributor-facing overview (marketing tone, setup instructions, feature list).

## Project summary

**OpenLabs** (`openlabs.org.in`) is a Next.js 14 (App Router) education platform offering free interactive virtual labs across **Physics, Chemistry, Biology, Computer Science, and Mathematics**, plus a gamification layer (XP/levels/streaks/badges/daily AI-generated challenges), an editorial blog, and a context-aware AI chat assistant. Proprietary license, single maintainer (`@rahulra3621`).

## Commands

Package manager is **Yarn 1.22.22** (recommended over npm; `packageManager` is pinned in `package.json`).

```bash
yarn install       # install deps (needs NPM_TOKEN in env for the private @hackeryard scope, see below)
yarn dev            # next dev, http://localhost:3000
yarn build           # next build
yarn start           # next start (serve a production build)
yarn lint             # next lint (uses eslint-config-next + .eslintignore, NOT eslint.config.js — see Linting below)
```

There is **no test suite** in this repo (no jest/vitest/playwright, no `test` script) — do not assume one exists or try to run `yarn test`.

`predev`/`prebuild`/`prestart` all run `node scripts/guard.cjs`, which loads `.env`/`.env.local` and calls `initGuard()` from the private `@hackeryard/mandatory-guard` package. This requires a valid `NPM_TOKEN` (GitHub Packages, see `.npmrc`) to even `yarn install`, and runs before every dev/build/start invocation. If dev/build fails immediately with a guard error, it's this gate, not your code.

### Linting caveat

There are **two eslint configs** and only one is actually used by `yarn lint`:
- `.eslintignore` + `eslint-config-next` → what `next lint` (i.e. `yarn lint`) actually runs.
- `eslint.config.js` (flat config, React-Hooks/React-Refresh oriented) → **globally ignores `app/**/*.tsx` and `app/**/*.ts`**, so it barely lints anything in `app/`. Don't rely on it as a signal for TypeScript app code; it appears to be leftover/unused Vite-style scaffolding.

CI (`.github/workflows/guard.yml`) does **not** run lint, typecheck, or build — it only runs `yarn install --frozen-lockfile` and `node scripts/guard.cjs` (job name "Security Guard Check", triggered on PRs and pushes to `main`/`master`). Nothing else is gated in CI, so run `yarn lint` / `tsc --noEmit` yourself before considering a change done.

### next.config duplication

`next.config.js` (ESM — `package.json` has `"type": "module"`) is the config Next.js actually loads: `reactStrictMode`, custom DNS servers, `allowedDevOrigins`, Cloudinary/Google image remote patterns, a security-headers block (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Robots-Tag: index, follow`), and a `redirects()` that 308s the apex domain (`openlabs.org.in`) to `www.openlabs.org.in` (the canonical host every `alternates.canonical`/OG URL in the app already hardcodes) — added after Search Console data showed Google indexing both hosts separately. `next.config.cjs` is a near-empty CommonJS leftover (webpack alias for `three`, `experimental.appDir` — a Next 13 flag, no-op in Next 14) that Next.js does **not** load by default given a `next.config.js` exists. Don't edit `next.config.cjs` expecting it to take effect.

## Architecture

Next.js 14 App Router + TypeScript (mixed with plenty of untyped `.js`/`.jsx`), MongoDB via Mongoose, custom JWT auth (+ NextAuth for Google OAuth), deployed on Vercel. `tsconfig.json` maps `@/*` to the repo root, so imports mix `@/app/lib/...`, `@/lib/...`, and `@/components/...` — note there are **both** an `app/components/` and `app/lib/` **and** a separate root-level `components/`, `lib/`, and `types/`; they are different directories, not typos. `tsconfig.json`'s `strict` is `false`.

### The two-tier lab pattern (read this before touching any lab)

Every subject/lab has **two separate route trees that both must exist**, plus a registry entry. This supersedes any older "one page per lab" mental model:

1. **SEO/marketing landing page** — `app/<subject>/<lab-slug>/page.tsx` (e.g. `app/physics/freefall/page.tsx`, `app/biology/photosynthesis/page.tsx`). Exports full `Metadata` (title/description/keywords/OG/Twitter/canonical/robots) and renders **one of two shared layout components**:
   - `components/EducationalLandingLayout.tsx` (root `components/`) — the general-purpose one, driven by a typed `content: EducationalContent` object (`types/education.ts` at repo root: slug/subject/title/description/difficulty/estimatedTime/theory/learningObjectives/realWorldApplications/faqs/relatedExperiments). Used by chemistry, biology, computer-science landing pages. Renders `SchemaMarkup` (JSON-LD: FAQPage/BreadcrumbList/WebPage/LearningResource) internally.
   - `components/PhysicsExperimentLanding.tsx` — physics-only, older/parallel implementation with its own flat prop shape (`slug, title, description, heroDescription, theory, formula, formulaLabel, launchUrl, learningObjectives, applications, faqs, accent, visualLabel, visualDetail, heroImageUrl`) and its own inline JSON-LD (doesn't use `SchemaMarkup`). **New physics labs should probably be evaluated against migrating to `EducationalLandingLayout` for consistency**, but as of this writing physics still uses its own component — match existing sibling pages rather than mixing patterns within physics.
   
   Both variants take a `launchUrl` prop pointing at step 2.
2. **Actual interactive lab route** — `app/labs/<subject>/<lab-slug>/page.tsx` (e.g. `app/labs/physics/freefall/page.tsx`). Thin wrapper that `dynamic()`-imports the real component with `ssr: false` (three.js/canvas/WebGL-heavy components generally can't SSR), with a `loading:` fallback rendering `app/components/UniversalLoader.tsx` (themed per-subject skeleton with rotating status/fact text — pass `subject` and optionally `customMessage`).
3. **Component implementation** — `app/components/<subject>/<LabName>.jsx` (or `.tsx`) — the real interactive UI/logic. See [Per-subject implementation conventions](#per-subject-implementation-conventions) below.
4. **Registry entry** — `app/lib/labs.ts`, the `LABS` array (53 entries as of this writing): `{ id, name, subject: "physics"|"chemistry"|"biology"|"computerScience"|"mathematics", type: "simulation"|"exploration"|"editor", challengeParams: string[], challengeEnabled, description }`. `id` is the `<subject>/<lab-slug>` path segment used to key `DailyChallenge`/`Project`/XP records — **must match** the `labId` string passed to `useLab()`/`DailyChallengeCard` in the lab component. A lab isn't "wired up" for gamification until it's in here — see [Known drift](#known-drift--rough-edges) for labs that exist as routes but aren't registered.
5. **Navigation** — `app/components/Navbar.tsx` (`labCategories`, hardcoded, does **not** read `labs.ts`) and `app/components/Hero.tsx` (`labsData`, also hardcoded, homepage's curated subset) both need manual updates; neither derives from the registry.
6. Nothing else needs manual registration — `lib/llms.ts` (root) walks `app/` at request time to build `/llms.txt` and `/llms-full.txt`, so new pages show up there automatically; `app/sitemap.ts` needs a manual entry to appear in the XML sitemap, though.

**Concrete step-by-step for adding a new lab** — see the `new-lab` skill (`.claude/skills/new-lab/SKILL.md`) for the full checklist; short version:
1. Build the interactive component under `app/components/<subject>/`, following the sibling pattern for that subject (canvas for physics, React Three Fiber for 3D chemistry/biology, whatever fits for CS).
2. Wire it into `app/labs/<subject>/<slug>/page.tsx` via `dynamic(..., {ssr:false, loading: () => <UniversalLoader .../>})`.
3. Inside the component: register with `useChat().setExperimentData({title, theory, extraContext})` on mount (AI assistant context), call `useLab(labId, subject, type)` from `app/hooks/useXP.ts` and invoke the returned `completeExperiment()` when the user finishes, and render `<DailyChallengeCard labId=... currentParams={...} />` if the lab has a numeric/measurable outcome worth challenging.
4. Write the SEO landing page at `app/<subject>/<slug>/page.tsx` with full `Metadata` + `EducationalLandingLayout` (or `PhysicsExperimentLanding` for physics), `launchUrl="/labs/<subject>/<slug>"`.
5. Add an entry to `LABS` in `app/lib/labs.ts` (same `id` as used in step 3's `useLab()`/`DailyChallengeCard` calls).
6. Add nav entries in `Navbar.tsx` (and `Hero.tsx` if it should appear on the homepage).
7. Add a `sitemap.ts` entry for both the landing and lab URL if you want it indexed/crawled with a specific priority.
8. If the lab should offer AI-assistant page knowledge beyond the generic `experimentData` you set in step 3, add a matcher to `app/lib/pageKnowledge.ts`.

### Directory map (non-obvious bits only — the tree is large, this highlights what's easy to miss)

```
app/
├── <subject>/<slug>/page.tsx        # SEO landing pages (see two-tier pattern above)
├── labs/<subject>/<slug>/page.tsx   # actual interactive lab routes
├── components/<subject>/*.jsx|tsx   # lab component implementations (grouped by subject)
├── components/*.tsx                 # shared cross-app components (Navbar, Footer, Hero,
│                                     #   ChatContext, OpenLabsAI, OpenLabsAILoader,
│                                     #   DailyChallengeCard, UniversalLoader, LoginForm*)
├── api/**/route.ts|js                # backend routes, see Auth/Gamification/AI sections below
├── models/                          # Mongoose schemas: User.js, Blog.ts, DailyChallenge.js,
│                                     #   OTP.js, Project.ts
├── lib/                             # server + shared utilities (auth.js, mongodb.ts, xp.ts,
│                                     #   labs.ts, pageKnowledge.ts, email.js, cloudinary.ts,
│                                     #   getUserFromToken.ts, devMock.js)
├── hooks/                           # useXP.ts (exports `useLab`, NOT `useXP` — naming
│                                     #   mismatch, see Known drift), useDailyChallenge.ts,
│                                     #   useProjects.ts, useLocalStorage.ts
├── types/                           # gitSimualtor.ts (typo in filename, kept as-is),
│                                     #   jsDebugger.ts
├── src/data/elements.js             # AUTO-GENERATED periodic table data (118 elements) —
│                                     #   don't hand-edit
├── middleware/middleware.js          # DEAD CODE — see Auth section, Next.js never loads this
└── admin/                            # admin panels (gated by ADMIN_SECRET)
    ├── blogs/                       # admin blog CRUD UI
    ├── users/                       # admin user telemetry & database dashboard
    └── seo-dashboard/               # internal SEO performance audit dashboard

components/    (root, NOT app/components) — EducationalLandingLayout, PhysicsExperimentLanding,
               SchemaMarkup, ProfileSetupBanner(+Client), ClarityProvider, ClarityTrackerObserver
lib/           (root, NOT app/lib) — analytics.ts (Clarity wrapper), llms.ts (llms.txt generator)
types/         (root, NOT app/types) — education.ts (EducationalContent/FAQ), analytics.ts
middleware.ts  (root) — the ONLY middleware Next.js actually loads (see Auth section)
```

### Auth — two mechanisms that converge on one cookie

- **Primary: custom JWT/cookie auth.** `jsonwebtoken` (`app/lib/auth.js`: `generateToken(user)` signs `{id, email}` with `JWT_SECRET`, 1-day expiry; `verifyToken(token)`) + `bcryptjs` hashing (10 salt rounds) for signup/login/reset-password. Server-side reads go through `app/lib/getUserFromToken.ts` (reads the `auth-token` httpOnly cookie via `next/headers`). Routes: `/api/auth/{signup,login,logout,me,check,send-otp,verify-otp,forgot-password,reset-password}` (mostly `.js`, `me`/`check` are `.ts`). Every protected route handler calls `getUserFromToken()` itself — **middleware does not inject identity**, it only gates on cookie *presence*.
- **`/api/auth/login` has a dev-mode bypass**: when `NODE_ENV === 'development'`, it looks up the user via `app/lib/devMock.js`'s `mockFindUser()` (one hardcoded account, plaintext password `"Test123"`, lookup key `test@test.com` but the record's own `email` field is `test@gmail.com` — a pre-existing inconsistency, not a bug to silently "fix" without checking intent) instead of hitting MongoDB. `mockConnect()` in the same file is defined but never called anywhere.
- **Secondary: NextAuth.js**, added specifically for OAuth (Google, GitHub, Azure AD) (`app/api/auth/[...nextauth]/route.ts` + `app/api/auth/nextauth/options.ts`) — no email/password provider is configured on it. Own internal JWT session (`session.strategy: "jwt"`, secret `NEXTAUTH_SECRET || JWT_SECRET`), completely separate from the `auth-token` cookie. Its `signIn` callback upserts a `User` doc (random UUID placeholder password, `emailVerified: true`) so both systems share the same collection.
- **The bridge**: `options.ts`'s `redirect` callback hijacks NextAuth's post-login destination to `/api/auth/nextauth/sync?next=<original>`. `app/api/auth/nextauth/sync/route.ts` verifies the live NextAuth session, finds-or-creates the `User` doc (redundant safety net), calls the **same** `generateToken()` used by password login, manually builds the `Set-Cookie` header, and 302-redirects to `next`. Net effect: OAuth-login users end up with an identical `auth-token` cookie to password-login users, so everything downstream (middleware, API routes) treats both uniformly post-sync.
- **`/api/auth/run`** is unrelated to auth despite its path — unimplemented stub (`{output: "Hello"}"`), commented as a future "send code to a Docker container and execute" feature. Don't extend it without confirming intent.
- **Admin** (`/admin/*`, `/api/admin/*`): a static shared secret, not per-user RBAC — there's no role field on `User`. Requires a valid `auth-token` cookie (via middleware) *plus* an `ADMIN_SECRET` typed into `sessionStorage` client-side and sent as the `x-admin-secret` header on every admin API call.
- **Cron** (`/api/challenges/generate`): `Authorization: Bearer <CRON_SECRET>` or `x-cron-secret` header.
- **`middleware.ts`** (root — the only middleware Next.js loads; `app/middleware/middleware.js` is confirmed-dead code, unreferenced anywhere, targeting a nonexistent `/dashboard/:path*` matcher) checks only *presence* of `auth-token`, not signature validity. Always-passthrough regardless of auth state: `/api/auth/*`, `/api/challenges/generate`, `/api/contact`, `/api/blogs`, `/api/admin`. Public without auth: `/`, `/login`, `/signup`, `/forgotpassword`, `/reset-password`, `/verify-email`, `/about`, `/contact`, plus prefixes `/blog`, `/physics`, `/chemistry`, `/biology`, `/computer-science` (the landing-page tier only). **Not public**: `/labs/*` (the actual interactive-lab tier) and `/admin/*` — both require the cookie.

### Gamification (XP / levels / streaks / badges / daily challenges)

- `app/lib/xp.ts`: `calculateLevel(xp)` — level thresholds start at 1000 XP for level 1→2, then ×1.5 (floored) each subsequent level (2→3 = 1500, 3→4 = 2250, ...). `calculateXPReward(type, isChallenge, difficulty)` — base by lab `type` (simulation=30, editor=25, exploration=20) plus, if `isChallenge`, a difficulty bonus (easy=+50, medium=+75, hard=+100).
- **Daily challenge generation**: Vercel Cron (`vercel.json`, `0 0 * * *`) hits `GET /api/challenges/generate`, which calls **OpenRouter** (`gpt-4o-mini`, JSON mode, using `CHATBOT_API_KEY`) once per `challengeEnabled` lab in `LABS`, and upserts one `DailyChallenge` doc per `(labId, date)`.
- **Client flow**: `useDailyChallenge(labId)` (`app/hooks/useDailyChallenge.ts`) fetches `GET /api/challenges/[labId]` (strips `targetValue`/`tolerance` from the response so the answer isn't visible client-side) and `DailyChallengeCard.tsx` renders the UI, submitting via `POST /api/challenges/validate` with `{labId, targetParam, achievedValue, date}`.
- **Validation** (`/api/challenges/validate`): correct if `Math.abs(achievedValue - targetValue) <= tolerance`. On success: awards XP, recalculates level, updates per-subject `subjectProgress`, updates daily streak (increments only if `lastActiveDate` was exactly yesterday, else resets to 1, touched at most once/day), appends `activityLog`, and awards badges ("First Challenge", "3 Day Streak", "7 Day Streak" at streak≥3/7, "Subject Master" at 10 completions in a subject) — each keyed by a unique badge id/name, added once.
- **Non-challenge completion** (`POST /api/xp/complete`, via `useLab()` in `app/hooks/useXP.ts` — **note the file is named `useXP.ts` but exports a hook called `useLab`**, not `useXP`): simpler parallel path for just finishing/visiting a lab (not tied to a `DailyChallenge`), flat XP by `type` only, once per lab per day, same streak/activityLog update logic **duplicated** (not shared as a helper) from the validate route, no badges.
- Public exposure: `GET /api/profile/[username]` returns `xp, level, streak, badges, subjectProgress, completedExperiments, bio, avatar` (password, email, daily challenges, and activity logs excluded for privacy).
- **Leaderboard**: `GET /api/leaderboard` returns a paginated list of top users sorted by XP, filtering out any users who have not completed their profile setup (`profileSetupComplete: true`).

### Blog + Cloudinary

Admin-only CRUD (`x-admin-secret` header, no JWT) at `/api/admin/blogs*`. Two-step publish flow: `POST /api/admin/blogs/upload` (multipart image → validated jpeg/png/webp, 5MB cap → `app/lib/cloudinary.ts` `uploadImage()` → streams to Cloudinary folder `openlabs/blogs`, force-converted to webp, returns `secure_url`) then `POST /api/admin/blogs` (or `PUT /api/admin/blogs/[slug]`) with that URL as `coverImage`. Public reads (`GET /api/blogs`, `GET /api/blogs/[slug]`) only ever return `published: true` docs — drafts are never publicly reachable. List endpoint explicitly excludes `content`/`_id` from the payload for a lean list view.

### AI chat — two unrelated systems, don't conflate them

- **`/api/chat`** — the in-app "OpenLabsAI" widget (`app/components/OpenLabsAI.tsx`, actually mounted via `OpenLabsAILoader.tsx` which auth-gates + lazy-loads it, hidden entirely on `/login`, `/signup`, `/forgot` and for logged-out users). Requires the custom JWT cookie. Uses the `openai` npm SDK but pointed at **OpenRouter** (`baseURL: https://openrouter.ai/api/v1`, `apiKey: CHATBOT_API_KEY`, model `gpt-4o-mini`) — despite the SDK name, this is not calling OpenAI directly. Hard-capped at **10 queries/day/user**, tracked via raw `mongoose.connection.db.collection("users")` writes to `aiQueriesCount`/`lastAiQueryDate` (bypasses the Mongoose `User` model cache intentionally). Context comes from `app/components/ChatContext.tsx` (`useChat()` — labs call `setExperimentData({title, theory, extraContext})` on mount, reset on route change) plus `app/lib/pageKnowledge.ts` (`getPageKnowledgeText(pathname)`, a hand-maintained matcher table giving richer per-page facts, e.g. Big-O tables for sorting-algorithm pages).
- **`/api/agent`** — forwards `{question}` to a hardcoded external URL (`https://agent.aicodepro.com/api/v1/prediction/<id>`, Flowise-style). **Has no auth check and no rate limiting**, unlike `/api/chat`. Has **no callers anywhere in the app** — dead code. Don't extend it without confirming intent first; if you do touch it, note the missing auth is a real gap (open proxy to a paid third-party endpoint), not an oversight to preserve.
- Env vars `NVAPI`, `NVBASEURL`, `GLM_API_KEY`, `GLM_BASE_URL`, `CHATBOT_API_BASE_URL` are present in `.env`/`.env.local` but referenced nowhere in code — leftover/reserved, not wired to anything.

### Analytics (Microsoft Clarity)

`components/ClarityProvider.tsx` calls `Clarity.init(NEXT_PUBLIC_CLARITY_ID)` once on mount (bypasses the wrapper below). `components/ClarityTrackerObserver.tsx` runs on every route change, fetches `/api/auth/me`, and if logged in calls into `lib/analytics.ts`'s singleton `analyticsService` (`identify`, `setUserTags` — note most tags like `role`/`plan`/`organizationId`/`accountType`/`country` are **synthesized via heuristics**, not real `User` schema fields). `analyticsService` de-dupes identify/tag/event calls per session (`sessionStorage`) and exposes business-event helpers (`trackSignupCompleted`, `trackLoginCompleted`, `trackProjectCreated`, etc.) called ad hoc from feature code (e.g. `useProjects.ts`). Event vocabulary lives in root `types/analytics.ts`.

### Data models (`app/models/`)

- **`User.js`** — the big one: auth fields (`name, email, password, emailVerified, createdAt`), profile (`username, avatar, bio, profileSetupComplete`), gamification (`xp, level, streak, lastActiveDate, badges[], completedExperiments[], subjectProgress[], activityLog[], dailyChallenges[]`), AI rate-limiting (`aiQueriesCount, lastAiQueryDate`). No `timestamps: true` (only the explicit `createdAt`, no `updatedAt`).
- **`Blog.ts`** — `slug, title, excerpt, content, category, author, date, readTime, published, coverImage, faqs[], metaTitle, metaDescription`, `timestamps: true`.
- **`DailyChallenge.js`** — `labId, subject, date, challenge, hint, targetParam, targetValue, tolerance, xpReward, difficulty`, unique compound index `{labId, date}`.
- **`OTP.js`** — `email, code, expiresAt, createdAt` with a TTL index (`expires: 600`, auto-deletes 10 min after creation).
- **`Project.ts`** — code-editor projects (`projectId, projectType, userId, title, html, css, js`), unique compound index `{projectId, userId}`. **Deliberately runs `delete mongoose.models.Project` unconditionally** before defining the model (doesn't use the `mongoose.models.X || mongoose.model(...)` guard the other models use) — this dodges Next.js hot-reload model-caching bugs; follow this exact pattern (unconditional delete, not the guard) if you add new models that get edited frequently in dev, but note it differs from every other model in this codebase.

## Per-subject implementation conventions

Observed patterns — match the sibling files in the same subject folder rather than introducing a new library/pattern:

- **Physics** (`app/components/physics/*.jsx`): mostly raw `<canvas>` + manual `requestAnimationFrame` physics loops (no Three.js, no charting lib), but newer/advanced labs like `ohmslaw` use a dedicated dynamic node-voltage simulation engine (`engine.ts`) with transient state support (Capacitors, AC sources), a real-time oscilloscope, and a draggable Multimeter widget. Each persists run history to `localStorage`. All register `useChat()` context and call `useLab().completeExperiment()` on completion, all render `<DailyChallengeCard>`.
- **Chemistry** (`app/components/chemistry/*`): mixed — `PeriodicTable.jsx` is 2D (imports `app/src/data/elements.js` directly, keyed grid lookup, arrow-key navigation, tracks an `explored` Set to derive completion from 3 distinct element inspections rather than a numeric target); `AtomicModel3D.jsx` and `reactions/ReactionSimulation.jsx` use `@react-three/fiber`/`@react-three/drei`. Reaction data/coordinates live in `reactions/reactionData.js` as a hand-authored keyed object.
- **Biology** (`app/components/biology/*`): mostly `@react-three/fiber` 3D (`cell/animal`, `cell/plant`, `human/*` which uses `useGLTF` to load `.glb` models from `/public/models/`, clicking is wired through raw Three.js mesh `userData`, not R3F event props). `blood/blood.tsx` and part of `brainNeuron/BrainNeuron.tsx` use `react-chartjs-2` instead/in addition.
- **Computer Science** (`app/components/computer-science/*`): most varied — Monaco (`@monaco-editor/react`) for `code-lab/html-css-js`; DSA sorting visualizers (`dsa/sorting/*`) pre-compute a full `Step[]` timeline up front (`generateSteps()`) rather than animating live recursion, and support `mode`(beginner/expert/interview)/`language`/`variant` teaching toggles; `git-simulator/CommitGraph.tsx` lays out the commit DAG with hand-rolled SVG/div positioning (no D3, despite D3 being a dependency); `networking/osi-model/OSI3DScene.tsx` uses a thin R3F `<Canvas>`.
- All lab components that participate in gamification follow the same three-call contract: `useChat().setExperimentData(...)` in a mount `useEffect`, `useLab(labId, subject, type)` from `app/hooks/useXP.ts` with `completeExperiment()` invoked on the lab's natural completion event, and `<DailyChallengeCard labId=... currentParams={...}/>` rendered where a numeric target makes sense. **`DailyChallengeCard` is a `fixed`-position floating widget** (pulsing pill above the OpenLabsAI FAB, bottom-right, expanding to a popover; z-40, under the AI chat's z-50) — it takes zero page space, so where it appears in a lab's JSX tree doesn't matter for layout.
- **The JS Event Loop Visualizer** (`app/labs/computer-science/code-lab/js/` — self-contained: components live under the route, not `app/components/`) runs both its presets and free-form user code through the same deterministic sandbox engine (`lib/runtime/*`: Babel transform → shimmed globals → virtual scheduler → recorded `Instruction[]` → `generateSnapshots()`). Preset definitions in `lib/examples.ts` are source-code-only; their traces/expectedOutput are derived by executing them through the engine at import time — never hand-author instruction timelines. The UI is a viewport-height "Live Dashboard" (all runtime panels always visible in the initial view, no tabs; static help in `InfoModal`); the shell is exactly `100vh - navbar` tall so the complete dashboard + playback bar always fit the first screen, while the page can still scroll past it to reach the global site footer.

## Theming (dark/light)

The app supports a user-toggleable light/dark theme via `next-themes`, added on top of an existing all-light-mode codebase — most files still need auditing when touched.

- **Mechanism**: `components/ThemeProvider.tsx` (root `components/`, wraps `next-themes`' `ThemeProvider` with `attribute="class"`, `defaultTheme="system"`, `enableSystem`) is mounted in `app/layout.tsx` around the whole app; `<html>` carries `suppressHydrationWarning` (required by `next-themes` to avoid an SSR/client class mismatch warning). `components/ui/ThemeToggle.tsx` (a sun/moon icon button, mount-guarded to avoid hydration flicker) is rendered in `Navbar.tsx` (both desktop and mobile). `darkMode: 'class'` in `tailwind.config.js` makes Tailwind's dark variant respond to the class `next-themes` toggles on `<html>` — **but the established convention in this codebase does not use Tailwind's `dark:` prefix at all**; see below.
- **Token approach, not `dark:` variants**: `app/globals.css` defines CSS custom properties under `:root` (light values) and `.dark` (dark values) — `--background`, `--foreground`, `--card`/`--card-foreground`, `--muted`/`--muted-foreground`, `--border`, `--primary`/`--primary-foreground`, `--accent`/`--accent-foreground` (all HSL triplets, consumed as `hsl(var(--x))`). `tailwind.config.js` maps these to semantic color utilities: `bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary`, `bg-accent`, `text-accent-foreground`. Components use these semantic classes directly (e.g. `bg-card` swaps automatically between light/dark) instead of writing `bg-white dark:bg-slate-900` pairs. When converting a component or writing a new one, use this token approach for consistency — don't introduce `dark:`-prefixed utilities alongside it.
- **Supporting pieces**: `lib/utils.ts` (root) exports `cn()` (clsx + tailwind-merge) for conditional className composition — use it instead of manual template-string concatenation in new/edited components. `components/ui/AmbientBackground.tsx` (mounted once in `app/layout.tsx`) renders decorative, theme-aware blurred blobs behind every route using `animejs` (chosen deliberately over Framer Motion, already used everywhere else, to keep the two animation systems from fighting over the same layout tree — see the comment in that file). `components/ui/AnimatedCard.tsx` is a `cn()`-based scroll-reveal/hover-lift card wrapper (Framer Motion) styled with the same tokens, used on the homepage and available for reuse on subject hub pages.
- **Migration mapping used throughout the codebase** (apply this when converting any remaining hardcoded-light file): `bg-white`→`bg-card`, `text-slate-900`/`text-slate-800`/`text-gray-900`/`text-gray-800`→`text-foreground`, `text-slate-700`/`-600`/`-500`/`text-gray-700`/`-600`/`-500`→`text-muted-foreground`, `border-slate-200`/`-100`/`border-gray-200`→`border-border`, `bg-slate-50`/`bg-gray-50`→`bg-muted`, `bg-indigo-50` (selected/active tint)→`bg-primary/10`, `text-indigo-700`/`-600` (selected/active)→`text-primary`, `hover:bg-slate-50`/`-100`→`hover:bg-accent`. Leave alone: canvas-2D/Three.js/Chart.js/SVG colors that are the simulation's or a chart's actual visual *content* (not chrome), data-encoding legend/status/badge colors (periodic-table element categories, sort-algorithm compare/swap/sorted highlighting, signal HIGH/LOW state, badge tiers), and anything deliberately, permanently dark by design regardless of site theme (Monaco's `vs-dark`, terminal-emulation UIs, code/log panels, a few labs' full-cosmic/lab-glassware aesthetics).
- **Rollout status (as of this writing)**: the design-system foundation and most lab UI chrome across Physics, Chemistry, most of Biology, and most of Computer Science has been converted. Known gaps/exceptions, left as-is deliberately — check before assuming a file is done:
  - **`app/components/computer-science/dsa/sorting/*` (all 6: Bubble/Heap/Insertion/Merge/Quick/SelectionSort) run their own independent local dark/light theme system** (an `isDarkMode` boolean or a `theme`/`getThemeStyles()` switcher with its own in-UI toggle button), entirely separate from `next-themes` and unconverted to the token system. This is a real two-systems-at-once situation, not an oversight to quietly "fix" by deleting one — a user could end up with the sorting labs' own toggle out of sync with the site-wide toggle. Reconciling this (e.g. wiring their local toggle to `useTheme()` from `next-themes`, or ripping out the local system in favor of the global one) is a deliberate follow-up task, not a quick edit — confirm approach before touching these files.
  - `app/components/chemistry/Water-quality.tsx` has a ~300-line `<style jsx>` block of raw hex CSS plus inline `style={{color:...}}` health-status indicators, not yet converted (out of scope for a Tailwind-class token pass).
  - `app/components/chemistry/ChemicalBondTypes.jsx`'s data-table cells use bare `border` (not `border-border`) — likely low-contrast in dark mode, minor follow-up.
  - Several labs are intentionally dark-only by design and were left untouched on purpose: `data-science`, `data-analyzer`, `blockchain`, `code-lab/html-css-js` (Monaco + console), `brainNeuron`, `ai-problem/{maze-qlearn,forward-backward,hangman,blockchain}`, all `logic-gates/*`, `TopologyBuilder.tsx`, `OSIModel.tsx`/`OSIModel2D.tsx`, `blood/blood.tsx`. Don't "fix" these to be theme-aware without confirming the dark aesthetic isn't intentional (several are — circuit-board/terminal/cosmic themes are a deliberate design choice per lab, not a bug).
  - Subject-specific themed error pages (`app/{physics,chemistry,biology,computer-science}/error.tsx`) are deliberately, permanently dark branded pages (see their description under Directory map) — out of scope for the theme toggle by design, do not convert.

## Enterprise Technical SEO & Educational Knowledge Graph Architecture

- **Shared Types & Constants** (`app/lib/types/`, `app/lib/constants/`): Centralized interfaces (`knowledge.ts`, `seo.ts`, `schema.ts`) and subject metadata constants (`subjects.ts`, `difficulty.ts`, `levels.ts`).
- **Focused SEO Builders** (`app/lib/seo/`): Normalizing canonical URL builder (`canonicalBuilder.ts`), intent-driven keyword builder (`keywordBuilder.ts`), modular metadata creators (`metadata/lab.ts`, `metadata/subject.ts`, `metadata/article.ts`), and schema creators (`schema/breadcrumb.ts`, `schema/learning.ts`, `schema/faq.ts`, `schema/article.ts`).
- **Recommendations API** (`app/lib/seo/relatedContent.ts`): Clean internal linking API (`getRelatedContent()`, `getRelatedLabs()`).
- **Modular Educational Knowledge Graph** (`app/lib/knowledge/`): Domain concept registries (`concepts/`), learning paths (`paths/`), formula registries (`formulas/`), graph query engine (`graph.ts`), and build-time validator (`validator.ts`).
- **SEO & Knowledge UI Components** (`app/components/seo/`): `<Breadcrumbs />` (accessible DOM + `BreadcrumbList` JSON-LD), `<StructuredData />` script wrapper, `<EducationalGraphSection />` (Prerequisites, Next Steps, Related Labs), `<FormulaSection />`, and `<KnowledgeGraphVisualizer />`.
- **Robots, Sitemap, Edge OG & AI Discoverability**: Dynamic sitemap (`sitemap.ts`) iterating LABS registry and blogs, updated `robots.ts`, Edge OG Image Generator (`app/api/og/route.tsx`) with 1-year immutable CDN headers, AI search crawler markdown route (`/llms.txt`), internal SEO dashboard (`app/admin/seo-dashboard`), and build-time CI audit script (`scripts/seo-audit.ts`).


## Environment variables

Present in `.env`/`.env.local` (both gitignored, never commit them): `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASSWORD`, `WEBSITE_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_CMS_URL`, `NPM_TOKEN`, `CHATBOT_API_KEY`, `CHATBOT_API_BASE_URL`\*, `NVAPI`\*, `NVBASEURL`\*, `GLM_API_KEY`\*, `GLM_BASE_URL`\*, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`, `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID` (NextAuth OAuth), `CRON_SECRET`, `ADMIN_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLARITY_ID`. (`\*` = present but unreferenced in code — see AI chat section.) `NEXTAUTH_SECRET` is read with a fallback to `JWT_SECRET` if unset. The README's env var list is a simplified subset aimed at first-time setup — this list is the accurate/complete one.

## Known drift / rough edges (don't "clean up" without checking intent first)

- **`app/lib/labs.ts` registry drift from actual routes**: Several `computer-science/ai-problem/*` subfolders are unregistered — only `hangman`, `hill-climb`, `maze-qlearn` are in `LABS`; `constraint-satisfy`, `forward-backward`, `monkey-banana`, `water-jug`, and `neural-network` (which is a `.jsx` page, the only non-`.tsx` page in that folder) have working routes but aren't registered, so they get no gamification/XP/daily-challenge support. Run the `audit-labs-registry` skill before trusting `LABS` as a complete lab list.
- **The Mathematics subject category was officially introduced** (August 2026) with the Function Grapher lab (`app/components/mathematics/functiongrapher/`), full D3/mathjs plotting engine, category landing page (`/mathematics`), error boundary (`app/mathematics/error.tsx`), and gamification/daily challenge support.
- **`app/middleware/middleware.js`**, `app/api/auth/google/{start,callback}` (empty), `app/api/agent`, `app/api/auth/run` — all dead/unimplemented, confirmed via repo-wide reference search.
- **`next.config.cjs`** is a near-empty leftover; `next.config.js` is the one actually loaded.
- **`eslint.config.js`** doesn't meaningfully lint `app/**/*.{ts,tsx}` (see Linting caveat above).
- **`app/hooks/useXP.ts`** exports a hook literally named `useLab`, not `useXP` — don't assume the filename matches the export when searching.
- **`app/lib/devMock.js`** silently changes login behavior in any `NODE_ENV=development` run (bypasses real DB user lookup for login only, not signup) — be aware of this if auth behaves unexpectedly locally.
- **`app/models/Project.ts`** uses an unconditional `delete mongoose.models.Project` instead of the `mongoose.models.X || mongoose.model(...)` guard every other model uses — intentional hot-reload workaround, not an inconsistency to "fix" by aligning it with the other models.
- **Root-level `Microsoft/Windows/PowerShell/` directory** and `delete-challenge.ts` at repo root look like accidental artifacts, not app code.
- **`Navbar.tsx` and `Hero.tsx` both hardcode their own lab lists** rather than deriving from `app/lib/labs.ts` — updating the registry alone does not update navigation; both need manual edits (see two-tier lab pattern above).
- **`app/layout.tsx`'s `title.template: '%s | OpenLabs'` does NOT cascade past one intervening layout that defines its own concrete `title`** — empirically verified (not documented behavior we're relying on faith for). A page/layout exactly one segment below root (e.g. `/chemistry`, `/biology`, `/computer-science`) gets the template applied once, so its own `title` field must NOT bake in `"| OpenLabs"` itself (doing so doubles it: confirmed live as `"...| OpenLabs | OpenLabs"` on all three before the fix). But a page nested two+ segments below root, under a layout that already has its own `title` (e.g. `/physics/freefall` under `physics/layout.tsx`, or any `/computer-science/*` subpage under `computer-science/layout.tsx`), gets NO template applied at all — its own `title` field must bake in `"| OpenLabs"` manually or the rendered `<title>` has no site name. Check the actual rendered `<title>` via curl after adding/editing metadata at any nesting depth — don't assume the template's behavior, verify it, especially for anything under a subject `layout.tsx`.
- **`components/PhysicsExperimentLanding.tsx` is a Server Component** (converted from a `"use client"` component that mount-gated its entire render behind `useState`/`useEffect`, which meant it server-rendered nothing — no H1, no theory text — until client JS hydrated). If touching this file, don't reintroduce a mount gate without a concrete reason (e.g. an actual browser-only API): the whole point of the fix was that nothing in it needs one.
- **`/computer-science/ai-problem/neural-network` has an interactive lab (`app/labs/computer-science/ai-problem/neural-network/page.jsx`) but no SEO landing page** — unlike its 7 sibling AI-problem labs, there's no `app/computer-science/ai-problem/neural-network/page.tsx`, so the URL 404s. Not fixed as part of the SEO remediation pass (building a new landing page is lab-scaffolding work, not a metadata fix) — see the `new-lab` skill if adding one.

## Keeping this file current

After completing any non-trivial task (new lab, new API route, schema change, architecture change), update the relevant section here, add an entry to `CHANGELOG.md`, and adjust `REQUIREMENTS.md`/`README.md` if the change affects product scope or setup instructions. The `sync-docs` skill (`.claude/skills/sync-docs/SKILL.md`) automates this checklist — invoke it at the end of a work session rather than leaving docs to drift.
