---
name: new-blog-post
description: Create or publish a blog post on OpenLabs via the admin API, matching the Blog schema (slug, excerpt, content, FAQs, meta title/description) and the x-admin-secret-gated CRUD flow. Use when asked to add/draft/publish a blog article, or to script/automate blog content creation.
---

# Creating an OpenLabs blog post

Blog posts are MongoDB documents (`app/models/Blog.ts`), managed either through the `/admin/blogs` UI or directly via the admin API. There is no per-user RBAC here — every admin call is gated by a single shared secret header, not a user role.

## Required auth

Every `app/api/admin/blogs*` request must include:
```
x-admin-secret: <ADMIN_SECRET env value>
```
Requests without it, or with a mismatched value, get a `401`. This is separate from normal user login — see `env-doctor` skill if `ADMIN_SECRET` itself needs troubleshooting.

## Schema (`app/models/Blog.ts`)

| Field | Required | Notes |
|---|---|---|
| `title` | yes | |
| `slug` | no | auto-generated from `title` (lowercased, non-word chars stripped, spaces→hyphens) if omitted — don't hand-roll slug logic, just omit it unless you need a specific URL |
| `excerpt` | yes | short summary shown in the `/blog` grid |
| `content` | yes | full article body |
| `category` | yes | free-text string, used for filtering on `/blog` |
| `author` | no | defaults to `"OpenLabs Team"` |
| `date` | no | defaults to now |
| `readTime` | no | free-text (e.g. `"5 min read"`), not auto-computed |
| `published` | no | **defaults to `false`** — a post is a draft until this is explicitly set `true`; public endpoints (`/api/blogs`, `/api/blogs/[slug]`) only ever return `published: true` posts |
| `coverImage` | no | a Cloudinary URL — get one via the upload step below, don't pass a local path |
| `faqs` | no | array of `{ question, answer }` — feeds a JSON-LD FAQ schema on the post page, so keep answers self-contained and factual |
| `metaTitle` / `metaDescription` | no | if omitted the post page likely falls back to `title`/`excerpt` for SEO tags — set these explicitly for anything meant to rank (see the `seo-page` skill for length conventions: title ~50-65 chars, description ~120-140 chars) |

## Flow

1. **(Optional) Upload a cover image first:**
   ```
   POST /api/admin/blogs/upload
   Headers: x-admin-secret: <secret>
   Body: multipart/form-data, field name "image" (jpeg/png/webp, max 5MB)
   → { "url": "https://res.cloudinary.com/..." }
   ```
   Use the returned `url` as `coverImage` in the next step.

2. **Create the post:**
   ```
   POST /api/admin/blogs
   Headers: x-admin-secret: <secret>, Content-Type: application/json
   Body: { title, excerpt, content, category, coverImage?, faqs?, metaTitle?, metaDescription?, published? }
   → 201 { message, post }
   ```
   Leave `published` unset (or `false`) to create a draft first and review before going live; `PUT /api/admin/blogs/[slug]` (same auth) flips it to `true` or edits any field later.

3. **List/verify:** `GET /api/admin/blogs` (same header) returns all posts including drafts, newest first — use this to confirm the slug and draft state before announcing the post is live.

## Don't

- Don't write directly to the `Blog` collection via a script bypassing the API — the API is where slug generation and validation live.
- Don't set `published: true` on first creation unless the user explicitly asked for immediate publication.
- Don't fabricate `faqs` content not grounded in the actual article — it's surfaced as structured data search engines treat as factual.
