---
name: sync-docs
description: Keep README.md, CLAUDE.md, AGENTS.md, REQUIREMENTS.md, and CHANGELOG.md consistent after a code change in this repo. Use after finishing any non-trivial task (new feature, removed feature, changed env vars, changed routes/API/auth/data model) and before considering the task done.
---

# Keeping OpenLabs docs in sync

This repo deliberately maintains five docs together. After a change, check each — most changes only touch one or two, but check all five rather than assuming:

1. **`CHANGELOG.md`** — add one line under an `## Unreleased` heading at the top (create it if missing) describing the user-visible change. Keep the existing date-grouped-sections format below it untouched; don't rewrite history.

2. **`README.md`** — update if the change affects: the Features list, Technology Stack (new/removed dependency), Project Structure tree, Routes & Navigation tables, environment variables (Authentication System → Environment Configuration, or Deployment → env var list), or anything under "Creating New Labs" if the lab-scaffolding pattern itself changed.

3. **`CLAUDE.md`** — update if the change affects architecture a future Claude Code session needs to know to be productive: new auth mechanism, new dead/legacy code path worth flagging, new cross-cutting convention, changed build/lint/test commands. Don't add routine feature additions here — this file is for structural/architectural facts, not a feature log (that's `CHANGELOG.md`).

4. **`AGENTS.md`** — update only if a setup command, code convention, or doc-sync rule itself changed. This file should stay short; don't duplicate `CLAUDE.md` content into it.

5. **`REQUIREMENTS.md`** — add/update an FR-n or NFR-n line if the change adds, removes, or materially alters a requirement (new capability, new constraint, a §4 "out of scope" item becoming implemented). Don't add implementation detail here — that belongs in `CLAUDE.md`.

## Rules

- Never invent a changelog entry for work that didn't happen — only log what was actually done in this change.
- If a change makes an existing doc claim false (e.g. removes an env var, deletes a route, fixes a dead-code path listed in `CLAUDE.md`'s "Known rough edges" or `REQUIREMENTS.md` §4), update or remove that claim in the same pass — don't leave stale docs for someone else to notice.
- Keep entries terse. These docs are read by future agents/contributors under time pressure, not written for narrative flow.
- If none of the five docs are affected by a change (e.g. a pure refactor with no behavior/interface change), say so explicitly rather than padding an entry in for the sake of it.
