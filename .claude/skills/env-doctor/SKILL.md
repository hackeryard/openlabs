---
name: env-doctor
description: Diagnose why `yarn install`/`yarn dev`/`yarn build`/`yarn start` is failing in OpenLabs — the guard.cjs license gate, a missing NPM_TOKEN, or a missing/misnamed environment variable. Use when the user reports install/dev/build failures, "guard" errors, or a feature silently not working (email, AI chat, Cloudinary, Google login) that traces back to config.
---

# Diagnosing OpenLabs env / guard failures

Two independent things can break startup here — figure out which one first.

## 1. The guard gate (`scripts/guard.cjs`)

`predev`/`prebuild`/`prestart` all run:
```js
require("dotenv").config();
require("dotenv").config({ path: ".env" });
require("@hackeryard/mandatory-guard").initGuard();
```
This is a **private, closed-source package** (`@hackeryard/mandatory-guard`) fetched from GitHub Packages. If `yarn install` itself fails, it's almost always because `.npmrc` needs `NPM_TOKEN` set in the shell environment (`.npmrc` reads `${NPM_TOKEN}` for the `@hackeryard` scope's registry auth) — check `echo $NPM_TOKEN` (or the CI secret, mirroring `.github/workflows/guard.yml`) before assuming a code problem. If install succeeds but `initGuard()` itself throws, that's inside a compiled black box (`node_modules/@hackeryard/mandatory-guard/dist`) — don't try to patch or bypass it; ask the user for the actual guard error text and treat it as an external dependency issue, not something to work around in app code.

Never suggest removing/skipping the guard call to "fix" a build — it's a deliberate gate (see `.github/workflows/guard.yml`, which runs it as the only real CI check).

## 2. Missing/misnamed application env vars

If the guard passes but a specific feature doesn't work, check the exact variable name — several are easy to mistype since the README historically had some wrong (already fixed, but double-check `.env.local` against these):

| Symptom | Var(s) to check | Where consumed |
|---|---|---|
| Can't connect to DB / `MONGO_URI` undefined | `MONGO_URI` | `app/lib/mongodb.ts` |
| JWT verify fails / sessions don't persist | `JWT_SECRET` (and optionally `NEXTAUTH_SECRET`, falls back to `JWT_SECRET`) | `app/lib/auth.js`, `app/api/auth/nextauth/options.ts` |
| Google sign-in fails | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | `app/api/auth/nextauth/options.ts` |
| OTP emails never arrive | `EMAIL_USER`, `EMAIL_PASSWORD` (Gmail app password, not the account password) | `app/lib/email.js` |
| `/admin/*` API calls return 401 despite being logged in | `ADMIN_SECRET` — must match what's typed into the admin login form (stored in `sessionStorage`, sent as `x-admin-secret` header) | `app/api/admin/**` |
| Daily challenge cron returns 401 | `CRON_SECRET` — must match the `Authorization: Bearer` / `x-cron-secret` header (Vercel Cron sends this automatically in production; test manually with curl + header) | `app/api/challenges/generate` |
| AI chat returns an error / "not configured" | `CHATBOT_API_KEY` — **not** `OPENAI_API_KEY`, even though the `openai` SDK is used; it's pointed at OpenRouter | `app/api/chat` |
| Blog cover image upload fails | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | `app/lib/cloudinary.ts` |

Vars that exist in `.env`/`.env.local` in some environments but are **not read by any current code** — if one of these is "missing" that is not the cause of a bug, don't chase it: `WEBSITE_URL` (used only as an email-template fallback string, not required), `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_CMS_URL`, `CHATBOT_API_BASE_URL`, `NVAPI`, `NVBASEURL`, `GLM_API_KEY`, `GLM_BASE_URL`, `NEXT_PUBLIC_CLARITY_ID` (verify against `components/ClarityProvider.tsx` if pursuing this one specifically — it may read it differently than a grep for `process.env` catches).

## 3. Dev-only shortcut

`app/lib/devMock.js` provides a fake user/DB (`test@test.com` / `Test123`) only when `NODE_ENV==='development'`. If auth-dependent features behave oddly only in dev and not in a deployed preview, check whether this mock path is being hit unintentionally.

## Quick checklist to hand back to the user

1. `NPM_TOKEN` set (install-time)?
2. Guard error text, verbatim — don't guess at its meaning.
3. `.env.local` present at repo root, dev server restarted after editing it.
4. Var name matches the table above exactly (case-sensitive).
