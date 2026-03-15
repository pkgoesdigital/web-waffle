# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js, port 3000)
npm run build    # Production build — also type-checks the project
npm run lint     # ESLint (next/core-web-vitals + next/typescript)
npm run start    # Serve the production build locally
```

There is no test suite. `npm run build` is the primary correctness check — it catches TypeScript errors and generates all static pages.

## Architecture

Next.js 15 App Router site with fully static output. All pages are server components except `PostList` (client component for search/pagination). No database — content lives in the filesystem.

### Content pipeline

```
src/content/posts/*.md      → /writing/[slug]
src/content/pages/*.md      → /writing/[slug]  (featured pages also appear on home)
src/data/social-links.json  → Footer social icons
src/data/viz/*.json         → /api/viz?dataset=<name>
```

**`src/lib/content.ts`** is the single entry point for all content reads:
- Module-level in-memory caches (`postIndex`, `pageIndex`) are populated once per server process from frontmatter only — content bodies are read on demand.
- `getAllPosts()` / `getPublishedPosts()` return sorted `PostMeta[]` (no content).
- `getFeaturedPages()` returns pages where `featured: true` in frontmatter.
- `getPostBySlug()`, `getPage()`, `getPageOrPost()` are async and return full content.

**`src/lib/markdown.ts`** converts markdown strings to HTML via `remark` + `remark-html` (`sanitize: false` — content is codebase-authored so raw HTML is allowed).

**`src/lib/types.ts`** defines the canonical types: `PostMeta`, `Post`, `PageMeta`, `Page`, `PaginatedResult<T>`, `SocialLink`.

### Routing

| Route | File | Notes |
|---|---|---|
| `/` | `src/app/page.tsx` | Server component; 6 most recent posts + featured pages |
| `/writing` | `src/app/writing/page.tsx` | Server component; delegates rendering to `PostList` |
| `/writing/[slug]` | `src/app/writing/[slug]/page.tsx` | Server component; `generateStaticParams` from all posts + featured pages |
| `/about` | `src/app/about/page.tsx` | Server component; reads `about.md` |
| `/api/posts` | `src/app/api/posts/route.ts` | Returns `PaginatedResult<PostMeta>`; supports `?page`, `?limit`, `?category`, `?status` |
| `/api/viz` | `src/app/api/viz/route.ts` | Returns JSON from `src/data/viz/<dataset>.json`; 1-hour `unstable_cache` |

### Components

All components use CSS Modules co-located in the component folder (`ComponentName/ComponentName.tsx` + `ComponentName/ComponentName.module.css`).

- **`PostList`** — only `'use client'` component; handles search filtering (`useMemo` over title/subtitle/tags) and load-more pagination (`PAGE_SIZE = 12`). Receives pre-fetched `PostMeta[]` and `PageMeta[]` as props from the server page.
- **`D3Visualization`** — client component wrapping a D3 chart fetched from `/api/viz`.
- **`WatchmakerClock`** — client component (canvas-based animated clock).
- **`ContentCard`** / **`CardGrid`** — pure presentational server-compatible components.

### Global styles

`src/app/globals.css` defines all CSS custom properties (colors, spacing, typography scale) and utility classes used across the app:
- `.prose` — article body styling (max-width 680px)
- `.page-container` / `.page-header` — layout wrappers
- `.section` / `.section-title` — section spacing utilities

### Adding a new post

Create `src/content/posts/<slug>.md` with this frontmatter:

```markdown
---
id: "<unique-number>"
title: "Post Title"
slug: "<slug-matching-filename>"
date: "YYYY-MM-DD"
subtitle: "Optional subtitle"
status: "publish"   # publish | draft | trash
categories: []
tags: ["tag1", "tag2"]
---

Markdown content here.
```

The post is immediately available at `/writing/<slug>` after rebuild. No code changes required.

### Adding a featured page (Highlights section)

Create `src/content/pages/<slug>.md` and set `featured: true` in frontmatter. Featured pages appear in the Highlights section on both the home page and `/writing`.

### Adding a viz dataset

Drop a JSON file at `src/data/viz/<name>.json`. It will be served at `/api/viz?dataset=<name>` with a 1-hour cache.

## Branching & Git Rules

These rules are non-negotiable and apply to every session.

### Claude never touches `master` directly
- All work happens on a `claude/<short-description>` feature branch.
- Never commit to, push to, or rebase onto `master` as a destination.
- The only way changes land on `master` is via a PR that the user reviews and merges themselves.
- **Explicit written consent** in the chat is required before taking any action that would modify `master`. If in doubt, stop and ask.

### Keep the working branch current
Before starting any new task, rebase the feature branch onto the latest `master` to minimise drift and keep conflicts small:

```bash
git fetch origin
git rebase origin/master
```

If a rebase produces conflicts that aren't trivially resolvable, stop and surface them to the user rather than force-resolving.

### Commit discipline
- One logical concern per commit — do not bundle unrelated changes.
- Commit after completing each task — don't batch multiple completed tasks into one commit.
- Run `npm run build` before committing to confirm the project is in a valid state.
- Commit messages: short imperative subject line (`Add`, `Fix`, `Refactor`, not `Added`), with a body when the "why" isn't obvious.

## Code Style Rules

- Don't add comments unless the code is genuinely non-obvious.
- Don't refactor code that wasn't part of the requested task.
- Don't uncomment test blocks unless explicitly asked to.

### PR as the merge gate
- Open a PR from the `claude/*` branch targeting `master` when a unit of work is complete.
- Include a concise summary and a test plan checklist in the PR body.
- Never merge the PR — leave that action to the user.

### Worktree cleanup
After the user confirms a PR has been merged:
1. Delete the remote branch: `git push origin --delete claude/<name>`
2. Remove the local worktree: `git worktree remove .claude/worktrees/<name>`
3. Delete the local branch: `git branch -d claude/<name>`

This keeps the branch list and worktree directory clean between sessions.
