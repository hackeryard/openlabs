---
name: new-lab
description: Scaffold a new interactive lab in OpenLabs (component + simulation route + gamification/XP + AI knowledge + landing page + central registry + curriculum tracks + navbar + sitemap). Use whenever the user asks to add a new lab, experiment, or simulation for Physics, Chemistry, Biology, Computer Science, or Maths.
---

# Adding a new OpenLabs lab

A lab in this repository is **nine connected pieces working together**, not one file. See the complete standard operating procedure in [`LAB_CREATION_GUIDE.md`](../../../LAB_CREATION_GUIDE.md).

Complete all 9 steps for every new lab:

1. **Component** — `app/components/<subject>/<LabName>Lab.jsx` (or `.tsx`). The interactive UI/logic. Must be `'use client'`, using Tailwind semantic variables (`bg-card`, `text-foreground`, `border-border`, etc.). Register context with `useChat().setExperimentData({ title, theory, extraContext })` on mount.

2. **Simulation route** — `app/labs/<subject>/<lab-slug>/page.tsx`. Thin dynamic-import wrapper:
   ```tsx
   'use client';
   import dynamic from 'next/dynamic';
   import UniversalLoader from '@/app/components/UniversalLoader';

   const Lab = dynamic(() => import('@/app/components/<subject>/<LabName>Lab'), {
     ssr: false,
     loading: () => <UniversalLoader subject="<subject>" />,
   });

   export default function Page() {
     return <Lab />;
   }
   ```
   * Protected automatically by auth in `middleware.ts`.

3. **Gamification & XP** — In the lab component:
   * Call `useLab(labId, subject, type)` from `app/hooks/useXP.ts` and invoke `completeExperiment()` when the user satisfies the goal.
   * Render `<NextLabModal />` upon completion to celebrate XP and provide 1-click continuation.
   * Render `<DailyChallengeCard labId=... currentParams=... />` if the lab has a measurable parameter.

4. **AI Assistant Knowledge** — Add entry into `PAGE_KNOWLEDGE` in `app/lib/pageKnowledge.ts` with step-by-step usage guide, controls guide, formulas, suggested inquiry experiments, and common pitfalls.

5. **Landing/SEO page** — `app/<subject>/<lab-slug>/page.tsx`. Public page exporting Next.js `Metadata` and rendering `EducationalLandingLayout.tsx` (or `PhysicsExperimentLanding.tsx` for physics) with `launchUrl="/labs/<subject>/<lab-slug>"`.

6. **Central Registry Entry** — Add to `LABS` array in `app/lib/labs.ts`:
   - `id`: `"<subject>/<lab-slug>"`
   - `name`, `subject`
   - `type`: `"simulation" | "exploration" | "editor"` (tier XP reward)
   - `challengeEnabled` + `challengeParams`
   - `description`

7. **Curriculum Tracks** — Add step to the appropriate track in `app/lib/tracks.ts` with step title, description, difficulty, duration, and XP reward.

8. **Navigation & Catalogs** — Add to `app/components/Navbar.tsx` (mega-menu highlights), `app/components/Hero.tsx` (homepage carousel if featured), and `app/<subject>/page.tsx` (`experiments` array).

9. **Sitemap & Verification** — Add URLs to `app/sitemap.ts`, verify with `npx tsc --noEmit` and `yarn lint`, and log in `CHANGELOG.md`.
