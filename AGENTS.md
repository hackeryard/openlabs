# AGENTS.md

Instructions for AI coding agents (Codex, Cursor, Copilot Workspace, Claude Code, etc.) working in this repository. This file follows the [agents.md](https://agents.md) convention. Claude Code should treat `CLAUDE.md` as the primary, more detailed reference — this file is a tool-agnostic summary for any agent.

## Project

OpenLabs — a Next.js 14 (App Router, TypeScript) platform of interactive, in-browser science labs (Physics, Chemistry, Biology, Computer Science, Mathematics), with auth, a blog, an admin panel, XP/gamification, and an AI chat assistant. MongoDB (Mongoose) + Vercel deployment.

## Setup & commands

```bash
yarn install     # requires NPM_TOKEN for the private @hackeryard scope (.npmrc)
yarn dev          # start dev server, http://localhost:3000
yarn build         # production build
yarn lint           # next lint
```

- Package manager: **Yarn 1.22.22** (pinned via `packageManager` in package.json). Don't switch to npm/pnpm.
- `predev`/`prebuild`/`prestart` run `scripts/guard.cjs` (a private license/env gate: `@hackeryard/mandatory-guard`). If a command fails immediately with a guard error, that's this gate — not a code problem.
- **No test suite exists in this repo.** Do not invent or assume `yarn test` works.
- CI (`.github/workflows/guard.yml`) only runs `yarn install --frozen-lockfile` + the guard script — it does not lint, typecheck, or build. Run `yarn lint` and check `tsc` yourself before calling a change done.

## Code conventions

- `tsconfig.json` has `strict: false` and a `@/*` → repo-root path alias. Imports like `@/app/lib/...`, `@/lib/...`, `@/components/...` are all valid and point at *different* top-level dirs (`app/lib` vs root `lib`, `app/components` vs root `components`) — don't assume they're the same directory.
- New interactive labs require **all** of: a landing page (`app/<subject>/<lab>/page.tsx`), a simulation route (`app/labs/<subject>/<lab>/page.tsx`, dynamic-imported with `ssr: false`), the component itself (`app/components/<subject>/<LabName>Lab.jsx`), a registry entry in `app/lib/labs.ts`, and Navbar/Hero links (`app/components/Navbar.tsx`, `app/components/Hero.tsx` — both hardcode their own lab lists, neither reads `labs.ts`). See `CLAUDE.md` for the full pattern and the `new-lab` skill for the checklist.
- Subject discipline landing pages (`app/<subject>/page.tsx`) and sub-topic hubs (`app/<subject>/<subtopic>/page.tsx`) follow the `/physics` design system: radial dot grid, live search/tag explorers (`<SubtopicCardExplorer />`), computational principles matrices (GEO), HowTo procedural protocols (AEO), curriculum alignment, single-open FAQs, and complete Schema.org JSON-LD (`CollectionPage`, `ItemList`, `HowTo`, `FAQPage`, `BreadcrumbList`).
- `/labs/*` and `/admin/*` require auth (enforced in root `middleware.ts`); subject landing pages and `/blog` are public.
- Don't extend `app/api/agent`, `app/api/auth/run`, or `app/middleware/middleware.js` — they're dead/unimplemented code paths, not the active implementation (see `CLAUDE.md` "Known drift / rough edges").
- `app/hooks/useXP.ts` exports a hook called `useLab`, not `useXP` — don't assume filename matches export.
- Light/dark theming uses semantic Tailwind tokens (`bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `bg-accent`) backed by CSS variables in `app/globals.css`, not Tailwind's `dark:` prefix — match that convention, and see `CLAUDE.md` § Theming for the token-mapping table and the list of surfaces deliberately left dark-only or unconverted.

## Docs to keep in sync

When you change behavior, update the relevant doc(s) in the same change:

- **`README.md`** — user-facing setup, features, stack.
- **`CLAUDE.md`** — architecture/conventions for Claude Code specifically.
- **`AGENTS.md`** (this file) — tool-agnostic agent instructions.
- **`REQUIREMENTS.md`** — functional/non-functional requirements.
- **`CHANGELOG.md`** — one entry per user-visible change, newest on top.

## PR / commit conventions

Follow the existing git history style: short, lowercase, imperative commit subjects (e.g. `fix github workflow failing`, `feat: add node-voltage engine and transient simulation for ohms law`). No enforced conventional-commit format, but `feat:`/`fix:` prefixes appear in recent history for notable changes.
