---
name: audit-labs-registry
description: Cross-check app/lib/labs.ts against the actual app/<subject>/<lab> and app/labs/<subject>/<lab> routes to find labs that are registered but missing a route, or routes that exist but aren't registered (which silently lose XP/daily-challenge support). Use when asked to audit labs, find missing labs, check lab consistency, or before/after bulk lab work.
---

# Auditing the labs registry

`app/lib/labs.ts` exports a `LABS` array of `{ id, name, subject, type, challengeParams, challengeEnabled, description }`. Every entry's `id` (e.g. `"physics/freefall"`) is supposed to correspond to **both**:
- a simulation route at `app/labs/<id>/page.tsx` (or a dynamic-segment variant, e.g. `app/labs/chemistry/electronic-configuration/[atomicNumber]/`)
- usually also a public landing page at `app/<id>/page.tsx`

Registry drift is real in this repo, not hypothetical — as of the last audit, `physics/opticslens` has a route (`app/labs/physics/opticslens/`) but **no `LABS` entry**, and the entire `mathematics` subject (`app/labs/maths/alzebra/`) has **zero entries** despite `"mathematics"` being a valid `subject` in the `Lab` type. Several `computer-science/ai-problem/*` and `dsa/*` subfolders under `app/labs/` also have no matching registry entry. Don't assume the registry is current — verify.

## How to audit

1. Read `app/lib/labs.ts` and extract every `id`.
2. List every route dir under `app/labs/<subject>/**` that contains a `page.tsx` (or a `[param]/page.tsx` one level deeper) — these are the candidate lab IDs (strip the `app/labs/` prefix, keep dynamic segments out of the id since a param is a URL detail, not a distinct lab).
3. Diff the two sets:
   - **In `app/labs/` but not in `LABS`**: the lab works but earns no XP correctly-typed reward and can't get a daily challenge (XP will still fire via `useXP`/`api/xp/complete`, but with no `type` lookup it may default incorrectly — check `app/hooks/useXP.ts` call sites for how `type` gets passed for these).
   - **In `LABS` but no matching `app/labs/` route**: broken/aspirational entry — the daily-challenge cron (`api/challenges/generate`) will iterate it and generate a challenge for a route that 404s.
4. Also spot-check that each registered `id` has a landing page at `app/<id>/page.tsx` (not required for the lab to function, but expected for SEO/navigation — see the `new-lab` skill).

## Report format

List findings in two buckets: "unregistered routes" and "dead registry entries," each as `id — path found (or expected)`. Don't auto-fix without confirming with the user which direction is correct for each mismatch (add to registry vs. remove the orphaned route/entry) — a route without a registry entry might be intentionally unlisted (e.g. still in development).
