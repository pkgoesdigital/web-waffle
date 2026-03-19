# Skill: Next.js App Router Patterns

Use this skill when adding routes, components, or API handlers to web-waffle.

## Architecture at a Glance

- **Next.js 15** with App Router and fully **static output** (`output: 'export'` or equivalent)
- No database, no auth, no server-side runtime — everything generates at build time
- Content source of truth: filesystem markdown files via `src/lib/content.ts`

## Server vs Client Components

**Default to server components.** Use `'use client'` only when the component:
- Uses browser-only APIs (`window`, `document`, `canvas`)
- Uses React hooks (`useState`, `useEffect`, `useMemo`)
- Handles user interaction that requires state

**Current client components:**
- `PostList` — search filtering + load-more pagination
- `D3Visualization` — D3 chart (canvas/SVG manipulation)
- `WatchmakerClock` — canvas animation

**Implications:** Never import a client component into another client component's _static_ path. Pass data down as props from server → client.

## Content Library (`src/lib/content.ts`)

Single entry point for all content. Do not read markdown files directly in page/component code.

```ts
// Available functions:
getAllPosts()           → Promise<PostMeta[]>      // all posts, sorted by date desc
getPublishedPosts()    → Promise<PostMeta[]>      // status === 'publish' only
getFeaturedPages()     → Promise<PageMeta[]>      // featured: true pages only
getPostBySlug(slug)    → Promise<Post | null>
getPage(slug)          → Promise<Page | null>
getPageOrPost(slug)    → Promise<Post | Page | null>
```

Do not add new content-reading functions without updating the module-level cache logic.

## Static Params Generation

Every dynamic route needs `generateStaticParams()`:
```ts
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(p => ({ slug: p.slug }))
}
```

Without this, the static export will miss pages. Always verify after adding a new route.

## Adding a New Route

1. Create `src/app/<route>/page.tsx` as a server component
2. If dynamic: add `generateStaticParams()` using content library
3. If it needs data: fetch via content library functions, not `fetch()`
4. Co-locate the module CSS: `src/app/<route>/page.module.css` (or use global utilities)

## API Routes

Located at `src/app/api/<name>/route.ts`. Two exist:
- `/api/posts` — paginated post list with filtering
- `/api/viz` — serves JSON datasets from `src/data/viz/` with 1-hour cache

For new API routes:
- Use `unstable_cache` for anything reading from the filesystem
- Return `Response.json()` (Next.js 15 pattern)
- Add appropriate `Cache-Control` headers

## TypeScript Types

All canonical types are in `src/lib/types.ts`. Do not define inline types for content objects — import from there.

```ts
import type { PostMeta, Post, PageMeta, Page, SocialLink, PaginatedResult } from '@/lib/types'
```

## CSS Modules for Pages

Page-level CSS goes in a module co-located with the page file. Use global utility classes for layout, module classes for page-specific overrides only.

## Build as the Correctness Gate

There is no test suite. `npm run build`:
- Runs TypeScript type checking
- Generates all static pages via `generateStaticParams()`
- Catches missing content, broken imports, and type errors

Always run before committing.

## Component Folder Structure

```
src/components/ComponentName/
  ComponentName.tsx          ← component file
  ComponentName.module.css   ← scoped styles
  index.ts                   ← optional barrel export
```

Import from the folder, not the file: `import { ComponentName } from '@/components/ComponentName'`
