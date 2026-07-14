# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

`predev`/`prebuild`/`prestart` all run `node scripts/guard.cjs`, which loads `.env`/`.env.local` and calls `initGuard()` from the private `@hackeryard/mandatory-guard` package. This requires a valid `NPM_TOKEN` (GitHub Packages, see `.npmrc`) to even `yarn install`, and will run before every dev/build/start invocation. If dev/build fails immediately with a guard error, it's this gate, not your code.

### Linting caveat

There are **two eslint configs** and only one is actually used by `yarn lint`:
- `.eslintignore` + `eslint-config-next` → what `next lint` (i.e. `yarn lint`) actually runs.
- `eslint.config.js` (flat config, React-Hooks/React-Refresh oriented) → **globally ignores `app/**/*.tsx` and `app/**/*.ts`**, so it barely lints anything in `app/`. Don't rely on it as a signal for TypeScript app code; it appears to be leftover/unused Vite-style scaffolding.

CI (`.github/workflows/guard.yml`) does **not** run lint, typecheck, or build — it only runs `yarn install --frozen-lockfile` and `node scripts/guard.cjs`. Nothing else is gated in CI, so run `yarn lint` / `tsc` yourself before considering a change done.

## Architecture

Next.js 14 App Router + TypeScript, MongoDB via Mongoose, custom JWT auth (+ NextAuth for Google OAuth), deployed on Vercel. `tsconfig.json` maps `@/*` to the repo root, so imports mix `@/app/lib/...`, `@/lib/...`, and `@/components/...` — note there are **both** an `app/components/` and `app/lib/` **and** a separate root-level `components/` and `lib/`; they are different directories, not typos.

### Two parallel trees per lab

Every interactive lab has **two separate routes** plus a registry entry — don't assume folder name = feature:

1. **SEO/marketing landing page**: `app/<subject>/<lab-slug>/page.tsx` — exports `Metadata` (OG/Twitter/canonical), renders a shared landing layout component from the root `components/` dir (e.g. `PhysicsExperimentLanding.tsx`), with a `launchUrl` pointing at step 2.
2. **Actual simulation route**: `app/labs/<subject>/<lab-slug>/page.tsx` — thin wrapper that `dynamic()`-imports the real component with `ssr: false` (three.js/d3/canvas-heavy components generally can't SSR).
3. **Component implementation**: `app/components/<subject>/<LabName>Lab.jsx` (or `.tsx`) — the actual interactive UI/logic.
4. **Registry**: `app/lib/labs.ts` — a `LABS` array entry (`id`, `name`, `subject`, `type: simulation|exploration|editor`, `challengeParams`, `challengeEnabled`, `description`) drives the daily-challenge generator and XP typing. A lab isn't "wired up" until it's in here.
5. Add the lab to `app/components/Navbar.tsx` navigation. Nothing else needs manual registration — `lib/llms.ts` (root) walks `app/` at request time to build `/llms.txt` and `/llms-full.txt`, so new pages show up there automatically.

### Auth — two mechanisms that converge

- **Primary**: custom JWT/cookie auth (`app/api/auth/{login,signup,logout,me,send-otp,verify-otp,forgot-password,reset-password}` as `.js` routes). Password hashed with `bcryptjs`; JWT (`jsonwebtoken`, 1-day expiry) set as `httpOnly` cookie `auth-token` via `app/lib/auth.js`. Email verification and password reset both go through 6-digit OTPs in the `OTP` model (TTL-indexed, auto-expires).
- **Google OAuth**: `app/api/auth/nextauth/options.ts` (NextAuth, JWT session strategy) upserts the `User` doc on sign-in, then its `redirect` callback always routes through `app/api/auth/nextauth/sync`, which mints the **same custom JWT** and sets the same `auth-token` cookie — so post-Google-login state converges back onto the custom-JWT mechanism. `app/api/auth/google/{start,callback}` are empty leftover directories; ignore them.
- **`middleware.ts`** (root — the only middleware Next.js loads; `app/middleware/middleware.js` is dead code with a broken import) only checks *presence* of the `auth-token` cookie, not signature validity — real verification happens per-route via `getUserFromToken()`. Public without auth: `/`, `/login`, `/signup`, `/forgotpassword`, `/reset-password`, `/verify-email`, `/about`, `/contact`, and the `/blog`, `/physics`, `/chemistry`, `/biology`, `/computer-science`, `/maths` prefixes (landing pages). **Not public**: `/labs/*` (actual simulations) and `/admin/*` — both require the cookie.

### Admin is a shared-secret gate, not RBAC

There's no role field on `User`. `/admin/*` pages require a valid `auth-token` cookie (via middleware) *plus* a separately-typed `ADMIN_SECRET` stored in `sessionStorage` and sent as `x-admin-secret` on every `app/api/admin/*` call. Don't assume per-user admin roles exist when touching this code.

### XP / gamification

`app/lib/xp.ts` has the level curve (1000 XP for level 2, ×1.5 per level after) and reward calc (base 20–30 XP by lab `type`, +50/75/100 challenge bonus by difficulty). `app/api/xp/complete` is called once/day/lab via the `useLab()` hook in `app/hooks/useXP.ts`. Daily challenges are generated by a Vercel Cron (`vercel.json`, `0 0 * * *` → `api/challenges/generate`, `CRON_SECRET`-protected) that calls OpenRouter (`gpt-4o-mini`) once per `challengeEnabled` lab in `LABS` and upserts into `DailyChallenge`; `api/challenges/validate` grades submissions and awards badges.

### AI chat

`app/api/chat` is the live chat backend used by `app/components/OpenLabsAI.tsx` — OpenAI SDK pointed at OpenRouter (`baseURL: https://openrouter.ai/api/v1`, `CHATBOT_API_KEY`, model `gpt-4o-mini`), JWT-gated, hard-capped at 10 queries/day/user (tracked via raw Mongo collection writes, bypassing the Mongoose model cache). `app/lib/pageKnowledge.ts` supplies per-route context so the assistant can talk about "the page you're on."

`app/api/agent` (forwards to an external Flowise endpoint) has **no callers anywhere in the app** — dead code, don't extend it without confirming intent first. Same for env vars `NVAPI`, `NVBASEURL`, `GLM_API_KEY`, `GLM_BASE_URL`, `CHATBOT_API_BASE_URL` (present in `.env`/`.env.local`, referenced nowhere) and `app/api/auth/run` (unimplemented code-execution stub that just returns `{output: "Hello"}"`).

### Data models (`app/models/`)

`User.js` (auth + XP + badges + streak + activity log all on one doc), `Blog.ts`, `DailyChallenge.js` (unique `{labId, date}`), `OTP.js` (TTL), `Project.ts` (code-editor projects; deliberately deletes `mongoose.models.Project` on load to dodge Next.js hot-reload model-caching bugs — follow that pattern if you add new models that get edited frequently in dev).

## Known rough edges (don't "clean up" without checking intent first)

- `app/middleware/middleware.js`, `app/api/auth/google/{start,callback}` (empty), `app/api/agent`, `app/api/auth/run` — all dead/unimplemented.
- `next.config.cjs` is a near-empty leftover; `next.config.js` is the one actually loaded.
- `eslint.config.js` doesn't meaningfully lint `app/**/*.{ts,tsx}` (see Linting caveat above).
- Root-level `Microsoft/Windows/PowerShell/` directory and `delete-challenge.ts` at repo root look like accidental artifacts, not app code.
