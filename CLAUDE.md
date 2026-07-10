# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Next.js, port 3000)
npm run build      # Production build — also type-checks the project
npm run lint       # ESLint (next/core-web-vitals + next/typescript)
npm run start      # Serve the production build locally
npm run test       # Run Jest test suite (once)
npm run test:watch # Run Jest in watch mode during development
npm run test:ci    # Run Jest with --ci flag + coverage (used in CI/CD)
```

### Testing requirements

**Every new source file must have a companion spec file.** The spec file lives next to the source file and uses the `.test.ts` / `.test.tsx` suffix:

```
src/lib/content.ts           → src/lib/content.test.ts
src/components/PostList/     → src/components/PostList/PostList.test.tsx
src/app/api/posts/route.ts   → src/app/api/posts/route.test.ts
```

- Use **Jest** + **React Testing Library** for all tests.
- Use `@testing-library/user-event` for simulating user interactions in component tests.
- CSS Modules are mocked via `__mocks__/styleMock.js` — no special setup needed.
- `npm run build` remains the primary type-correctness check; tests are the behaviour correctness check.

## Architecture

Next.js 15 App Router site with fully static output. All pages are server components except `PostList` (client component for search/pagination). No database — content lives in the filesystem.

### Content pipeline

```
src/content/posts/*.md      → /writing/[slug]
src/content/pages/*.md      → /writing/[slug]  (featured pages also appear on home)
src/data/social-links.json  → Footer social icons
src/data/viz/*.json         → /api/viz?dataset=<name>
src/data/music.json         → About page "What I've been listening to" player
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
| `/api/guestbook` | `src/app/api/guestbook/route.ts` | GET approved entries / POST submissions (Neon Postgres); `force-dynamic`, no-store |
| `/api/guestbook/challenge` | `src/app/api/guestbook/challenge/route.ts` | Issues single-use proof-of-work challenges for guestbook submissions |

### Components

All components use CSS Modules co-located in the component folder (`ComponentName/ComponentName.tsx` + `ComponentName/ComponentName.module.css`).

- **`PostList`** — `'use client'` component; handles search filtering (`useMemo` over title/subtitle/tags) and load-more pagination (`PAGE_SIZE = 12`). Receives pre-fetched `PostMeta[]` and `PageMeta[]` as props from the server page.
- **`MusicPlayer`** — client component on the About page. Renders the static song snapshot grouped by genre (with an artist-sort toggle) and click-to-load `youtube-nocookie.com` embeds. Never contacts YouTube until a visitor presses play; video IDs are allowlist-validated (`^[A-Za-z0-9_-]{11}$`) before touching the iframe URL.
- **`Guestbook`** — client component on the Contact page. Fetches approved entries from `/api/guestbook` and submits new notes through the anti-abuse pipeline (honeypot, server-side time trap, proof-of-work, rate limits). Degrades gracefully when `DATABASE_URL` is unset.
- **`D3Visualization`** — client component wrapping a D3 chart fetched from `/api/viz`.
- **`WatchmakerClock`** — client component (canvas-based animated clock).
- **`ContentCard`** / **`CardGrid`** — pure presentational server-compatible components. `ContentCard` accepts a `color` prop (not an index) — the parent is responsible for generating shuffled colors.
- **`ThemeProvider`** — client context providing `theme` and `toggleTheme` to the component tree.
- **`ThemeToggle`** — pill-shaped light/dark switch rendered inside the header nav.

### Theme system (dark mode)

The site supports light and dark mode via a custom React context (`ThemeProvider`), not a third-party library.

**How it works:**
- `ThemeProvider` (`src/components/ThemeProvider/ThemeProvider.tsx`) is a `'use client'` context that wraps the root layout. It reads the initial theme from the `data-theme` attribute (set by the FOIT script) and exposes `theme` + `toggleTheme`.
- An inline `<script>` in `layout.tsx` runs before React hydrates to read `localStorage` → `prefers-color-scheme` → default to `light`, preventing flash of wrong theme.
- `data-theme="dark"` on `<html>` activates the dark CSS variable overrides in `globals.css`.
- `ThemeToggle` (`src/components/ThemeToggle/ThemeToggle.tsx`) renders a pill-shaped toggle in the header nav (matching the writing page Published/Drafts toggle style).

**Card color system:**
- `src/lib/colors.ts` exports `getShuffledCardColors(count)` which Fisher-Yates shuffles the 8 HSL hues per call, producing randomized card colors on each server request.
- Colors are passed to cards as a `--card-color` CSS custom property (not `backgroundColor` directly), enabling CSS to control how the color is used per theme.
- In **light mode**: `--card-color` is the card background and border.
- In **dark mode**: card background is `var(--color-bg)` (matching the page), and `--card-color` appears only as the 4px border.
- `--card-lightness` CSS variable controls the HSL lightness (82% light, 40% dark).

**When modifying themes:**
- Light mode accent colors (`#14857b` teal, `#732d67` purple) should not be changed without asking.
- Dark mode uses brightened accents (`#1eb8ab`, `#c46fb3`) for WCAG AA contrast compliance.
- All new interactive elements must use `var(--color-*)` variables, never hardcoded colors.

### Accessibility standards

The site follows WCAG 2.2 AA. When adding new features:

- **Focus styles:** Global `a:focus-visible` / `button:focus-visible` outlines are defined in `globals.css`. Never use `outline: none` without a visible `:focus-visible` replacement.
- **Touch targets:** All interactive elements must meet 44x44px minimum. Use `min-width`/`min-height` or an invisible `::before` pseudo-element to expand tap areas without changing visual size.
- **Motion:** `globals.css` includes a `@media (prefers-reduced-motion: reduce)` block that kills all transitions/animations. Any new `requestAnimationFrame` loops must check `window.matchMedia('(prefers-reduced-motion: reduce)')` and fall back to interval-based updates.
- **Color contrast:** All text/background pairings must meet 4.5:1 for normal text (3:1 for large text). When adding dark mode overrides, verify contrast against `--color-bg`.
- **ARIA:** Interactive controls need `aria-label`, `role`, and state attributes (`aria-expanded`, `aria-checked`). D3/SVG visualizations should be wrapped in `<figure role="img" aria-label="...">`.
- **Skip link:** A `.skip-link` is present in `layout.tsx` targeting `#main-content`.

### Global styles

`src/app/globals.css` defines all CSS custom properties (colors, spacing, typography scale) and utility classes used across the app:
- `.prose` — article body styling (max-width 680px)
- `.page-container` / `.page-header` — layout wrappers
- `.section` / `.section-title` — section spacing utilities
- `.skip-link` — hidden skip-to-content link, visible on keyboard focus

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

### Refreshing the music snapshot (About page player)

Song data is a static snapshot in `src/data/music.json` — the site never calls
YouTube for data at runtime. To refresh it from the YouTube Music playlist:

```bash
cp .env.example .env.local   # once; fill in YOUTUBE_API_KEY + YOUTUBE_PLAYLIST_ID
npm run sync:music           # rewrites src/data/music.json
```

- The API key lives only in gitignored `.env.local` and is used offline by the
  script; it must never be committed or referenced by site code.
- YouTube exposes no genre metadata, so genres come from the hand-maintained
  `src/data/music-genres.json` (artist → genre). The script warns about
  unmapped artists (tagged "Uncategorized"); add them to the map and re-run.
- All sync logic is in `src/lib/music-sync.ts` (tested); the script's output is
  validated by the same `parseMusicData` gate the build uses, so a bad sync
  fails loudly instead of deploying.
- Review the `music.json` diff like any other change, then test/build/commit.

### Guestbook (Contact page)

The guestbook is the site's only write path. Entries live in Neon Postgres
(provisioned via the Vercel Marketplace; `DATABASE_URL` is injected in
production and copied to `.env.local` for local work).

- **Pre-moderation:** every submission is stored as `pending` and is invisible
  until approved. There is deliberately **no admin UI on the site** — moderate
  locally:

  ```bash
  npm run guestbook:setup            # one-time idempotent schema creation
  npm run guestbook:moderate         # list pending entries
  npm run guestbook:moderate -- --approve 3,7
  npm run guestbook:moderate -- --reject 5
  ```

- **Anti-abuse layers** (all in `/api/guestbook` POST): hidden honeypot field
  (silent discard), server-side time trap keyed to challenge creation,
  self-hosted proof-of-work (`src/lib/proof-of-work.ts`, WebCrypto, no third
  parties), per-IP (3/hr, salted-hash `GUESTBOOK_IP_SALT`, raw IPs never
  stored) + global (30/hr) rate limits, URL rejection, and length caps.
- **Validation** is in `src/lib/guestbook.ts`; error messages are fixed
  strings that never echo visitor content. All SQL goes through the neon()
  tagged template (parameterized).
- The Contact page section has anchor `#guestbook` (linked from the footer).

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
- **Pre-commit checklist (required — do not skip):**
  1. `npm run test` — all tests must pass with zero failures.
  2. `npm run build` — build must succeed with no TypeScript errors.
  3. Both checks must be green before running `git commit`. If either fails, fix the issue before committing.
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
