# Mandatory Documentation Synchronization Rule

> **CRITICAL WORKSPACE INVARIANT FOR ALL AI CODING AGENTS**  
> Every AI agent (Antigravity, Claude Code, Cursor, Codex, Copilot, etc.) working in the `OpenLabs` repository MUST strictly follow this rule without exception.

---

## 1. The Rule: Every Code Change Requires Documentation Updates

Whenever you introduce a new feature, fix a bug, refactor code, add a new route, update an API, or modify platform architecture:
**You MUST audit and update all relevant repository documentation markdown files in the SAME change before finishing or committing.**

Never treat documentation as an optional follow-up or afterthought.

---

## 2. The 7 Companion Documentation Files to Maintain

| Documentation File | Primary Purpose | When & What to Update |
| :--- | :--- | :--- |
| **`README.md`** | Human/contributor overview, setup, and features. | Update whenever new labs, features, scripts, test commands, or user-facing behaviors are added. Keep feature lists and commands current. |
| **`CLAUDE.md`** | Primary architectural source of truth for AI agents. | Update architecture sections, directory map, registry lists, test commands, per-subject conventions, and resolve any items listed under "Known drift / rough edges". |
| **`AGENTS.md`** | Tool-agnostic operational summary. | Keep setup commands, test commands (`yarn test:seo`, `yarn lint`, `tsc`), code conventions, and documentation rules current. |
| **`REQUIREMENTS.md`** | Functional and non-functional requirements. | Add new functional requirements (`FR-X`) and non-functional requirements (`NFR-X`) reflecting all shipped functionality and architectural constraints. |
| **`ROADMAP.md`** | Product roadmap and milestones. | Mark completed features as `[SHIPPED]` with links to the shipped implementation. Keep upcoming milestones realistic and prioritized. |
| **`CHANGELOG.md`** | Dated, factual changelog. | Add a detailed bulleted entry at the very top under `# Changelog` detailing the change, root causes, and all files modified. |
| **`SEO_MAINTENANCE.md`** | Technical SEO, indexing, and crawling policy. | Update whenever routes, sitemaps, robots.txt, metadata standards, or structured data schemas change. |

---

## 3. Standard Verification Checklist Before Finishing Any Task

Before marking any task as complete or proposing a commit:
1. [ ] Run `yarn test:seo` to ensure all automated SEO and sitemap invariants pass.
2. [ ] Run `yarn tsc --noEmit` to verify type safety across all TypeScript files.
3. [ ] Run `yarn lint` to ensure code style compliance.
4. [ ] Check `git status` to see all files modified.
5. [ ] Audit and update `CHANGELOG.md` (top entry).
6. [ ] Audit and update `README.md`.
7. [ ] Audit and update `CLAUDE.md`.
8. [ ] Audit and update `AGENTS.md`.
9. [ ] Audit and update `REQUIREMENTS.md`.
10. [ ] Audit and update `ROADMAP.md`.
11. [ ] Audit and update `SEO_MAINTENANCE.md` (if routes, SEO, or indexing changed).
12. [ ] Audit and update `LAB_CREATION_GUIDE.md` (if lab scaffolding or registration flow changed).
