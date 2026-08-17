# Feedback System — Implementation Plan

**Project:** OpenLabs (openlabs.org.in)
**Stack:** Next.js 14, MongoDB Atlas, TypeScript/JavaScript

---

## Overview

A "good" feedback system does three things: makes it painless to give feedback, gives you signal you can actually act on, and closes the loop so it doesn't just pile up unread. This plan covers a two-tier feedback model (quick pulse + deep feedback), an admin triage dashboard, and gamification tie-ins with the existing XP system.

---

## Phase 1: Data Layer

### `app/models/Feedback.js`

```js
import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  labId: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  sessionId: { type: String, required: true },
  helpful: { type: Boolean, default: null },        // quick pulse
  rating: { type: Number, min: 1, max: 5, default: null },
  category: {
    type: String,
    enum: ['bug', 'confusing', 'wrong-content', 'suggestion', 'praise', null],
    default: null
  },
  comment: { type: String, maxlength: 500, default: '' },
  labStep: { type: String, default: null },
  status: { type: String, enum: ['new', 'reviewed', 'fixed'], default: 'new' },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now }
});

FeedbackSchema.index({ labId: 1, createdAt: -1 });
FeedbackSchema.index({ sessionId: 1, labId: 1, createdAt: -1 }); // rate-limit lookups

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
```

### Aggregation helper — `app/lib/feedback.js`

Precompute per-lab stats rather than aggregating on every page load:

```js
export async function getLabFeedbackStats(labId) {
  const stats = await Feedback.aggregate([
    { $match: { labId } },
    { $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        helpfulPct: { $avg: { $cond: ['$helpful', 1, 0] } },
        total: { $sum: 1 }
    }}
  ]);
  return stats[0] || { avgRating: null, helpfulPct: null, total: 0 };
}
```

---

## Phase 2: API Routes

### `POST /api/feedback`
Single endpoint handles both pulse and deep feedback (partial payloads allowed).

- Validate `labId` exists in `labs.ts`
- Rate limit: check `sessionId + labId` for a submission in the last 24h → if one exists, `PATCH` the existing doc instead of creating a duplicate (lets someone upgrade a pulse into deep feedback)
- Award XP on first-ever feedback for that lab (call existing `awardXP` util)
- Sanitize `comment` (strip HTML, trim, length cap — optional: light profanity/spam filter via OpenRouter before storing)

### `GET /api/feedback/[labId]`
- Returns `{ avgRating, helpfulPct, total, recentComments: [...] }` (only public-safe fields — no sessionId/userId/userAgent)
- Cache with a short TTL (e.g. `revalidate: 300` if using Next's fetch cache, or a simple in-memory/Redis cache) since this hits every lab page load

### `GET /api/admin/feedback`
Protected by existing admin auth pattern.

- Query params: `sortBy=lowRating|highTraffic|recent`, `status=new|reviewed|fixed`, `labId`
- Returns per-lab summary rows + expandable comment threads

### `PATCH /api/admin/feedback/[id]`
- Update status (`new` → `reviewed` → `fixed`)

---

## Phase 3: Frontend Hook

### `app/hooks/useFeedback.js`

Mirrors the existing `useXP` / `useDailyChallenge` pattern.

```js
export function useFeedback(labId) {
  const [stats, setStats] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const submitPulse = async (helpful) => { /* POST, optimistic update */ };
  const submitDeep = async ({ rating, category, comment, labStep }) => { /* POST */ };

  useEffect(() => {
    fetch(`/api/feedback/${labId}`).then(r => r.json()).then(setStats);
  }, [labId]);

  return { stats, submitted, submitPulse, submitDeep };
}
```

- Store `sessionId` in localStorage (generate UUID once, reuse across labs) so anonymous users don't get re-prompted every visit
- `submitted` state persists in localStorage per `labId` too — hides the widget once feedback has been given that session

---

## Phase 4: UI Components

### `FeedbackPulse.jsx`
Shown on lab completion or after N minutes of engagement.

- 👍 / 👎 buttons
- On 👎 → immediately expand a 1-line "What went wrong?" text input + category chips (no full form, low friction)
- On 👍 → optional "Anything to add?" collapsed link

### `FeedbackForm.jsx`
The fuller optional form, triggered from a persistent "Give Feedback" link/icon on the lab page.

- Star rating, category select, comment box
- Capture `labStep` automatically if the lab component exposes current step/state via context

### Placement
Bottom of lab component, plus a small persistent icon in the lab toolbar so people can leave feedback mid-session, not just at the end.

---

## Phase 5: Admin Dashboard

### `/admin/feedback`

- Table: Lab | Avg Rating | Total Responses | Helpful % | Trend (7d) | Status breakdown
- Default sort: **lowest rating × highest traffic** (join with existing analytics pageview data — highest-impact fixes first)
- Row expand → recent comments with status toggle buttons
- Filter by `category=wrong-content` or `bug` to quickly find issues like those already flagged by the SEO crawl (e.g. copy-pasted wrong content on Chemistry lab pages)

---

## Phase 6: Gamification Tie-in

- `+10 XP` (or existing scale) on first feedback per lab, once per user
- Add a "Contributor" badge for 5+ feedback submissions — reuse existing badge schema

---

## Rollout Order

1. Model + API routes (no UI yet) — test with Postman/curl
2. `useFeedback` hook + `FeedbackPulse` only — ship on 2–3 labs, measure response rate
3. Add `FeedbackForm` deep version
4. Admin dashboard
5. XP/badge integration last (nice-to-have, not blocking)
