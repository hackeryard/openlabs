---
name: gamification-change
description: Safely modify XP, level, streak, or badge logic in OpenLabs. Use when asked to change XP amounts, the level curve, streak rules, add a new badge, or fix a gamification bug — the streak/activity-log logic is duplicated across two API routes and must be changed in both places or they'll drift.
---

# Changing OpenLabs gamification logic

XP/level math is centralized in `app/lib/xp.ts`, but per-request application of it is **duplicated** across two route handlers that were written independently. Any change to streak, activity-log, or XP-application behavior must be made in both, or the two paths will silently diverge.

## The two paths

1. **`POST /api/challenges/validate`** — awards XP for a correct daily-challenge answer. Also awards badges.
2. **`POST /api/xp/complete`** (called via `useLab()` in `app/hooks/useXP.ts`, despite the filename `useXP.ts`) — awards XP for simply completing/visiting a lab, independent of any challenge. Does **not** award badges.

Both independently:
- Re-read `user.xp` fresh from the DB before applying a reward (reduces race/staleness).
- Recalculate `level` via `calculateLevel()` (`app/lib/xp.ts`).
- Update the matching entry in `user.subjectProgress[]` (xp/level/experimentsCompleted).
- Update `user.streak`/`user.lastActiveDate`: increment only if `lastActiveDate` was exactly yesterday, reset to 1 otherwise, and only touch it once per calendar day (guards against multiple completions in one day inflating the streak).
- Increment today's count in `user.activityLog[]`.

**If you change streak logic, activity-log logic, or how XP gets applied to `subjectProgress`, make the identical change in both `app/api/challenges/validate/route.ts` and `app/api/xp/complete/route.ts`.** Don't "fix" only the one the user's bug report points at — check the other for the same bug, since they were clearly copy-pasted from each other rather than sharing a helper. If you're touching this anyway and the user is open to a larger change, consider extracting the shared streak/activityLog/subjectProgress-update logic into a helper in `app/lib/xp.ts` — flag this as an option rather than doing it unprompted, since it changes two routes' behavior at once and should be reviewed carefully.

## XP/level formulas (`app/lib/xp.ts`)

- **Level curve**: level 1→2 requires 1000 XP; each subsequent level requires `Math.floor(previousRequirement * 1.5)` (2→3 = 1500, 3→4 = 2250, 4→5 = 3375, ...). `calculateLevel(xp)` walks this curve to find the current level; `xpForNextLevel(level)` recomputes the threshold for a given level from scratch (not memoized) — if you change the growth formula, both functions must move together or `leveledUp` detection will be wrong.
- **XP reward** (`calculateXPReward(type, isChallenge, difficulty)`): base by lab `type` — `simulation`=30, `editor`=25, `exploration`=20 — plus, only if `isChallenge` is true, a difficulty bonus (`easy`=+50, `medium`=+75, `hard`=+100). `/api/xp/complete` always calls this with `isChallenge=false`, so its rewards are always just the base 20/25/30 regardless of the lab's actual challenge difficulty.

## Badges (`/api/challenges/validate` only)

Awarded once each, keyed by a unique `id`/`name` in `user.badges[]` (check for existing entry before pushing, to avoid duplicates):
- **"First Challenge"** — first challenge ever completed.
- **"3 Day Streak"** / **"7 Day Streak"** — `streak >= 3` / `>= 7` at time of award.
- **"Subject Master"** — a `subjectProgress` entry reaches `experimentsCompleted >= 10`.

A new badge type needs: a uniqueness check against `user.badges`, the award condition evaluated after the streak/subjectProgress updates above (so it sees post-update values), and a push with `{id, name, earnedAt: new Date(), pinned: false}`.

## After changing

- If XP amounts or the level curve changed, note it's a live-data-affecting change — existing users' `xp`/`level` fields were computed under the old formula and won't retroactively recalculate; confirm with the user whether that's acceptable before shipping.
- Run the `sync-docs` skill — `CLAUDE.md`'s "Gamification" section and `REQUIREMENTS.md` FR-12–FR-16 both state the current formulas/rules and will go stale otherwise.
