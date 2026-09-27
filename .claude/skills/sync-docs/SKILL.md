---
name: sync-docs
description: Keep README.md, CLAUDE.md, AGENTS.md, REQUIREMENTS.md, and CHANGELOG.md consistent after a code change in this repo. Use after finishing any non-trivial task (new feature, removed feature, changed env vars, changed routes/API/auth/data model) and before considering the task done.
---

# Keeping OpenLabs docs in sync

This repo deliberately maintains seven companion docs together. After any change, review all seven to ensure strict synchronization (enforced by the persistent rule in `.agents/rules/documentation-sync.md`):

1. **`CHANGELOG.md`** — add entries describing the change under the latest release/date. Include all user-visible features, architectural fixes, and resilience upgrades. Keep the existing date-grouped format intact; never rewrite history.

2. **`README.md`** — update if the change affects: Features list, Technology Stack, Lab Counts, Route policy, Architecture, Environment Variables, or Testing commands (`yarn test:seo`).

3. **`CLAUDE.md`** — update if the change affects architecture a future agent needs to know: SEO route policies, lab exclusion shields, auth mechanics, dead/legacy paths, resilience boundaries, commands, or data models.

4. **`AGENTS.md`** — update setup commands, testing suites (`yarn test:seo`), CI gate workflows, coding standards, and documentation synchronization rules.

5. **`REQUIREMENTS.md`** — add/update an FR-n or NFR-n specification if the change adds, modifies, or formalizes requirements (e.g. FR-28 Technical SEO, FR-31 Translation Guard, FR-32 WebGL context recovery).

6. **`ROADMAP.md`** — mark completed deliverables as `[SHIPPED ✅]` with links, or add new upcoming initiatives.

7. **`SEO_MAINTENANCE.md`** — update if route classifications, indexing protocols, sitemap generation, structured data, or canonical URL formats are modified.

## Rules

- Never invent a changelog entry for work that didn't happen — only log what was actually done in this change.
- If a change makes an existing doc claim false (e.g. removes an env var, deletes a route, fixes a dead-code path listed in `CLAUDE.md`'s "Known rough edges" or `REQUIREMENTS.md` §4), update or remove that claim in the same pass — don't leave stale docs for someone else to notice.
- Keep entries terse, structured, and accurate.
- If none of the docs are affected by a change (e.g. a pure refactor with no behavior/interface change), note that explicitly rather than skipping verification.
- Always run `yarn test:seo` and `yarn tsc --noEmit` before concluding.
