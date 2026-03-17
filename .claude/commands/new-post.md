# Command: /new-post

Scaffold a new blog post for the web-waffle writing section.

## Steps

1. **Gather inputs** (ask if not provided):
   - Title (required)
   - Subtitle (optional — a one-line hook or description)
   - Tags (comma-separated list)
   - Status: `draft` (default) or `publish`

2. **Generate the slug**:
   - Lowercase the title
   - Replace spaces and special characters with hyphens
   - Remove consecutive or trailing hyphens
   - Example: "My PM Framework for 2025" → `my-pm-framework-for-2025`

3. **Assign the next ID**:
   - Read all `.md` files in `src/content/posts/` and `src/content/pages/`
   - Extract each `id` field from frontmatter
   - Use `max(all_ids) + 1`

4. **Create the file** at `src/content/posts/<slug>.md`:

```markdown
---
id: "<id>"
title: "<title>"
slug: "<slug>"
date: "<today YYYY-MM-DD>"
subtitle: "<subtitle or empty string>"
status: "<status>"
categories: []
tags: [<tags as quoted strings>]
---

<!-- Write your post content here -->
```

5. **Confirm**: Show the user:
   - File path created
   - URL it will appear at: `/writing/<slug>`
   - A reminder to run `npm run build` to verify and preview

## Notes

- Do not publish (`status: publish`) without the user explicitly requesting it
- If the slug already exists as a filename, flag it and ask for a different title/slug before creating
- Load the `content-authoring` skill for full frontmatter schema reference
