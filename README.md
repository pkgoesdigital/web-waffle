# web-waffle

Personal website for [paulaklimas.com](https://paulaklimas.com). Built on Next.js 15 with the App Router, TypeScript, and a filesystem-based content system. Fully static output — no database, no CMS.

## Commands

```bash
npm run dev        # Start dev server (localhost:3000)
npm run build      # Production build — also type-checks the project
npm run lint       # ESLint (next/core-web-vitals + next/typescript)
npm run start      # Serve the production build locally
npm run test       # Run Jest test suite (once)
npm run test:watch # Run Jest in watch mode
npm run test:ci    # Run Jest with --ci flag + coverage
```

`npm run build` is the primary correctness check. It catches TypeScript errors and generates all static pages. Every source file must have a companion `*.test.ts` / `*.test.tsx` spec file.

## Architecture

### Content — `/writing`

Blog posts and standalone pages are markdown files with YAML frontmatter. No code changes required to publish new content.

```
src/content/posts/*.md    →  /writing/[slug]
src/content/pages/*.md    →  /writing/[slug]  (featured: true also appears on home)
```

**Frontmatter shape for posts:**

```yaml
---
id: "101"
title: "Post Title"
slug: "post-slug"
date: "2026-03-15"
subtitle: "Optional subtitle"
status: "publish"        # publish | draft | trash
categories: []
tags: ["tag1"]
---

Markdown content here.
```

`src/lib/content.ts` is the single entry point for all content reads. It maintains a module-level in-memory index of all frontmatter and reads full content on demand. `src/lib/markdown.ts` converts markdown to HTML via `remark` + `remark-html`.

### Content — `/portfolio`

The portfolio is a separate top-level route with its own layout, designed to support embedded apps, visualizations, images, and video — content types that outgrow a markdown renderer.

**Registry** (`src/data/portfolio-sections.ts`) is the single source of truth for all sections. The portfolio homepage TOC, card grid, and prev/next navigation are all driven from this file.

**Adding a top-level section:**
1. Add an entry to `portfolioSections` in `src/data/portfolio-sections.ts`
2. Create `src/app/portfolio/<slug>/page.tsx`

**Adding a child section** (nested under a parent):
1. Add a `children` entry to the parent in the registry
2. Create `src/app/portfolio/<parent-slug>/<child-slug>/page.tsx` with a `parent` prop

```tsx
// Child page example
const parent = { slug: 'tuff-shed', title: 'Tuff Shed' }

export default function MyChildPage() {
  return (
    <PortfolioPage slug="my-child" parent={parent}>
      <p>Content here — JSX, images, iframes, whatever you need.</p>
    </PortfolioPage>
  )
}
```

**Images:** Place in `public/portfolio/<section>/` and reference with Next.js `<Image>`.

**Videos:** Use `<iframe>` with `sandbox` attributes inside a `.videoWrapper` div (the CSS class is defined in `PortfolioPage.module.css`).

### Data / API

```
src/data/social-links.json    →  footer social icons
src/data/viz/*.json           →  /api/viz?dataset=<name>  (1-hour cache)
```

`/api/posts` returns paginated post metadata: `?page=`, `?limit=`, `?category=`, `?status=`

### Content — `/cpw-neighborhood-watch`

A community safety section for the City Park West Neighborhood Watch. All content is filesystem-based — no code changes required to add events or newsletters.

```
src/content/events/*.md       →  displayed on /cpw-neighborhood-watch/calendar
src/content/newsletters/*.md  →  displayed on /cpw-neighborhood-watch/newsletter
src/content/pages/cpw-neighborhood-watch.md  →  /cpw-neighborhood-watch landing page
```

**Adding an event** — create `src/content/events/<date>-<slug>.md`:

```yaml
---
id: "13"
title: "Event Title"
slug: "2026-06-01-event-slug"
date: "2026-06-01"
time: "6:00 PM"
location: "Location Name"   # plain text only — no URLs
type: "meeting"             # meeting | cleanup | social | dpd | other
status: "confirmed"         # confirmed | tentative | cancelled
description: "One-paragraph description."
source: "CPW daily summary, May 2026"
---
```

**Adding a newsletter** — create `src/content/newsletters/<date>-<slug>.md`:

```yaml
---
id: "cpw-newsletter-2026-05"
title: "City Park West Neighborhood Watch — May 2026 Recap"
slug: "2026-05-cpw-recap"
date: "2026-05-31"
period: "May 2026"
status: "published"         # published | draft
---

Newsletter body in markdown.
```

The calendar navigation window is 1 month back / 2 months forward from the current month. `src/lib/events.ts` and `src/lib/newsletters.ts` are the entry points for their respective content types.

### Key files

| File | Purpose |
|---|---|
| `src/lib/content.ts` | All post/page reads; in-memory index cache |
| `src/lib/events.ts` | Event reads; `getEventsForMonth()`, `getUpcomingEvents()` |
| `src/lib/newsletters.ts` | Newsletter reads; `getPublishedNewsletters()`, `getNewsletterBySlug()` |
| `src/lib/markdown.ts` | `markdownToHtml()` via remark |
| `src/lib/types.ts` | `PostMeta`, `Post`, `PageMeta`, `Page`, `EventMeta`, `CPWEvent`, `NewsletterMeta`, `Newsletter`, `PaginatedResult<T>`, `SocialLink` |
| `src/data/portfolio-sections.ts` | Portfolio section registry |
| `src/components/PortfolioPage/` | Shared wrapper for all portfolio section pages |
| `src/components/PostList/` | Client component — search + load-more pagination for `/writing` |
| `src/components/EventCalendarGrid/` | Calendar grid rendering for CPW events |
| `src/components/EventList/` | Event detail list for CPW calendar page |
| `src/app/globals.css` | CSS custom properties, `.prose`, layout utilities |

### Components

All components use CSS Modules co-located in `ComponentName/ComponentName.tsx` + `ComponentName/ComponentName.module.css`.

- **`PostList`** — only `'use client'` component; search filter + load-more pagination
- **`PortfolioPage`** — shared wrapper for portfolio section pages; handles back nav, prev/next, child section lookups
- **`EventCalendarGrid`** — renders the CPW event calendar grid for a given month
- **`EventList`** — renders event detail cards below the calendar grid
- **`D3Visualization`** — client component wrapping a D3 chart
- **`WatchmakerClock`** — client component (canvas-based animated clock)

## Git workflow

All Claude work happens on `claude/*` branches. Changes reach `master` only via user-reviewed PRs. See `CLAUDE.md` for the full branching rules.

---

## Prompts used with Claude

These are the prompts that shaped this codebase during development sessions with Claude Code.

---

**Architectural analysis and refactor planning:**

> Act as a Senior Architect. Before proposing any implementation changes: 1) Analyze existing codebase in /src/components/ and the content in src/data/ and point out any architectural issues if content size increases 100x 2) Identify all files affected 3) List integration points and dependencies 4) Propose the approach and wait for my approval. Proceed with phase 1, 2, and 3. I've decided not to implement a CMS and prefer to manage the content myself within the codebase. The content needs to be easily added to and edited. Follow Next.js and React best practices when refactoring.

---

**Deciding between `/writing` and `/portfolio` as the portfolio route:**

> I plan to add images and embedded videos to the Portfolio page to add visual aids to the portfolio-writeup content. I also plan to add many more pages to the Portfolio page over time, and need to be able to link to the other pages. Add custom React pages for each section of the portfolio. Use the Portfolio page as the homepage for portfolio content, but architect the changes so that there is enough flexibility to sustainably build out the content of these pages, while keeping the code straightforward. Avoid complex patterns and prioritize scaleability, security, and legibility.

(After Claude presented trade-offs between keeping portfolio in `/writing` vs. a dedicated `/portfolio` route:)

> the /portfolio route will have embedded apps and is where the d3 content will eventually live. the /writing section is used primarily for text and sharing ideas. Thank you for clarifying, you can proceed with the proposed architecture updates.

---

**Building the portfolio content from a source file:**

> create a new branch off of master. title it "portfolio-content-additions". use this branch to add content to the portfolio page. make sure paragraph formatting and line breaks are honored. Separate the portfolio content into separate sections, and provide a table of contents at the top of the Portfolio page. Anchor links should be used for headings for each section, that allow the user to click through the Table of Contents and automatically scrolls the browser to the appropriate section on the portfolio page. Add the Watchmaker javascript project and the Sample Visualization to a section at the bottom, called "Miscellaneous". Prompt me through each step of the process, and ask me to review your changes. The content is in a text file called "portfolio-writeup.txt" here: /Users/paulaklimas/Developer/PersonalWebsite/Content

---

**Restructuring portfolio sections as nested child routes:**

> tuff-shed-scripts needs to be moved as a child route under portfolio/tuffShed. both kula and angular-todo need to be moved as a child route under portfolio/tonic.

> using the same pattern, move the advance-nc and birthday-stats as child routes under portfolio/waterbury.

---

**Reordering and surfacing child pages in the TOC:**

> First, reorder the TOC to reflect this order: 1) tuff-shed 2) waterbury 3) tonic 4) nextworld 5) personal-website 6) technical-summary 7) miscellaneous. Second, surface the child pages in the table of contents. Allow the child pages to be clickable from the main portfolio page, within the table of contents.

---

**CLAUDE.md and git workflow rules:**

> Add a few things to the CLAUDE.md file: "Don't add comments unless the code is genuinely non-obvious.", "Don't refactor code I didn't ask you to touch.", "Don't uncomment test blocks unless I tell you to.", "Commit after completing each task."

> how should I work with you while I am also in the codebase?

---

**Removing the CPW auth wall and renaming Portal to CPW:**

> I want to adjust the Portal section of the website. Instead of having a password that exposes the information, change "Portal" to instead be titled "CPW" First, remove the code responsible for allowing the user to login and provide a password to the portal. The "cpw-neighborhood-watch/calendar" and "cpw-neighborhood-watch" pages should still be active.

---

**Populating the CPW calendar for May 2026:**

> the calendar needs to be at least two months out. Let's add the month of June in the calendar, and create the event.

> I want to adjust the Portal section of the website [...] populate the calendar for month=2026-05. Use the content found in /Users/paulaklimas/Documents/Claude/city-park-west-neighborhood-watch/daily-summaries to create events for May.

---

**Dependency maintenance (Jest upgrade, overrides, Dependabot):**

> I'm getting an error when running npm run build, locally "./src/app/portfolio/technical-summary/page.tsx Module not found: Can't resolve 'simple-icons'" - what is the issue?

> I upgraded Jest, but received these warnings [glob deprecation]. Never add zoom links to events. remove any which currently exist.

> I'd like to implement the dependabot config as well.

---

**Adding the CPW Newsletter section:**

> I'd like to add a newsletter page, which publishes a post, including the content from each file written and saved monthly [...] Users should be able to see both "Calendar" and a new "Newsletter" landing page, in the navigation under "CPW". Then, draft the first newsletter post based on the content found here /Users/paulaklimas/Documents/Claude/city-park-west-neighborhood-watch/newsletters.

---

**Fixing the formatDate timezone off-by-one:**

> In the web-waffle repo, src/lib/format.ts formatDate() parses date-only strings like "2026-07-09" via new Date(), which interprets them as UTC midnight; toLocaleDateString then renders them in the local timezone, so all dates west of UTC display one day early (e.g. "Jul 8, 2026" for a 2026-07-09 frontmatter date). [...] Fix by parsing date-only strings as local dates (e.g. append 'T00:00:00' instead of relying on bare date parsing [...]), update/extend src/lib/format tests if present (create formatDate coverage if missing per the repo's spec-file rule), and follow CLAUDE.md branching rules (claude/* branch, tests+build green, PR to master).
