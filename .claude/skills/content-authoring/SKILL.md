# Skill: Content Authoring

Use this skill when creating or editing posts and pages in the web-waffle content pipeline.

## Post vs Page

| Type | Location | Appears on |
|---|---|---|
| Post | `src/content/posts/<slug>.md` | `/writing` listing + `/writing/<slug>` |
| Page | `src/content/pages/<slug>.md` | `/writing/<slug>` only, unless `featured: true` |
| Featured Page | `src/content/pages/<slug>.md` with `featured: true` | Home page Highlights + `/writing` |

## Frontmatter Schema

### Post (`src/content/posts/<slug>.md`)
```yaml
---
id: "<integer — max existing id + 1>"
title: "Title in Title Case"
slug: "<matches filename, lowercase-hyphenated>"
date: "YYYY-MM-DD"
subtitle: "One-line hook — optional but recommended"
status: "publish"   # publish | draft | trash
categories: []
tags: ["tag1", "tag2"]
---
```

### Page (`src/content/pages/<slug>.md`)
```yaml
---
id: "<integer>"
title: "Title"
slug: "<matches filename>"
date: "YYYY-MM-DD"
subtitle: "Optional"
status: "publish"
featured: false     # true → appears in Highlights section on home + /writing
categories: []
tags: []
---
```

## ID Assignment

IDs must be unique integers. To find the next ID:
1. Read all `.md` files in `src/content/posts/` and `src/content/pages/`
2. Extract the `id` field from each frontmatter block
3. Use `max(all_ids) + 1`

## Slug Rules

- Matches the filename exactly (without `.md`)
- Lowercase only
- Hyphens for spaces and special characters
- No trailing hyphens
- Example: "My PM Framework for 2025" → `my-pm-framework-for-2025`

## Writing Voice

Posts represent a product manager and full-stack engineer. The voice should be:
- Direct and specific — name tools, frameworks, companies, numbers
- Shows both product thinking (user impact, tradeoffs, strategy) AND technical depth (implementation details)
- First-person where natural
- No filler openers ("In today's world...", "It's important to...")
- Every sentence earns its place — no padding for length

## Markdown in Posts

Raw HTML is allowed (`sanitize: false` in remark-html). Use it for:
- Complex tables
- Custom layouts that CSS Modules can't reach from inside markdown

Standard markdown for everything else. No need for MDX.

## Workflow

1. Confirm title, slug, status, and tags before creating the file
2. Draft frontmatter first, confirm ID is not already in use
3. Write content stub or full content depending on user intent
4. Remind user: file is immediately live at `/writing/<slug>` after `npm run build`
