---
name: new-lab
description: Scaffold a new interactive lab in OpenLabs (landing page + simulation route + component + labs.ts registry entry + navbar link). Use whenever the user asks to add a new lab, experiment, or simulation for Physics, Chemistry, Biology, Computer Science, or Maths.
---

# Adding a new OpenLabs lab

A lab in this repo is **five pieces working together**, not one file. Missing any one of them leaves the lab unreachable, unregistered for XP/daily challenges, or invisible in navigation. Do all five for every new lab:

1. **Component** — `app/components/<subject>/<LabName>Lab.jsx` (or `.tsx`). The actual interactive UI/logic. If it uses three.js/d3/canvas/WebGL, it must be a client component (`'use client'`) — it will be dynamically imported with `ssr: false`.

2. **Simulation route** — `app/labs/<subject>/<lab-slug>/page.tsx`. Thin wrapper:
   ```tsx
   'use client'
   import dynamic from 'next/dynamic'

   const XLab = dynamic(() => import('@/app/components/<subject>/<LabName>Lab'), {
     ssr: false,
     loading: () => <UniversalLoader ... />,
   })

   export default function Page() {
     return <XLab />
   }
   ```
   This route requires auth — `middleware.ts` protects everything under `/labs/*`.

3. **Landing/SEO page** — `app/<subject>/<lab-slug>/page.tsx`. Public page exporting Next.js `Metadata` (title, description, OG/Twitter, canonical `https://www.openlabs.org.in/<subject>/<lab-slug>`), rendering a shared landing layout from the **root** `components/` dir (e.g. `PhysicsExperimentLanding.tsx` for physics — check for a subject-appropriate equivalent, or reuse `EducationalLandingLayout.tsx`). It links to the simulation route from step 2 via a `launchUrl` prop. Look at an existing pair (e.g. `app/physics/freefall/` + `app/labs/physics/freefall/`) before writing a new one — copy the shape, don't invent a new one.

4. **Registry entry** — add to the `LABS` array in `app/lib/labs.ts`:
   - `id`: `"<subject>/<lab-slug>"` (matches the route)
   - `name`, `subject`
   - `type`: `"simulation" | "exploration" | "editor"` — determines XP reward tier (`app/lib/xp.ts`)
   - `challengeEnabled` + `challengeParams` — only set `challengeEnabled: true` if the lab has a numeric parameter a daily challenge can target (see `api/challenges/generate` / `api/challenges/validate` for the shape it expects)
   - `description`

5. **Navigation** — add the lab to `app/components/Navbar.tsx`, and to the relevant subject hub page if one exists (`app/<subject>/page.tsx`).

## Don't do

- Don't add the lab only under `app/<subject>/` or only under `app/labs/<subject>/` — both are required, they serve different purposes (public SEO vs. authenticated simulation).
- Don't skip the `labs.ts` registry entry even for a quick prototype — the daily-challenge cron iterates that array, and a missing entry silently means no XP/challenges for the lab.
- Don't add `getServerSideProps`/SSR data fetching to canvas/WebGL-heavy components — they must render client-only.

## After scaffolding

Run `yarn lint` and manually visit both the landing page and `/labs/...` route in dev (`yarn dev`) to confirm the dynamic import resolves and the page isn't blocked by auth middleware unexpectedly. Then follow the `sync-docs` skill to log the addition in `CHANGELOG.md` and update `README.md`'s feature list if this is a new lab category.
