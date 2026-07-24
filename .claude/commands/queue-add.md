# Command: /queue-add

Quickly capture a website enhancement/change idea into the queue. Usable any
time an idea comes up — not just during the daily `/queue-review` session.
This command only captures; it does not clarify or plan (that's
`/queue-review`'s job).

## Steps

1. **Get the description**:
   - If the command was invoked with args (`/queue-add <description>`), use
     that text as the request.
   - Otherwise, ask the user for a one-line description of the idea.

2. **Generate the slug**:
   - Lowercase the description
   - Replace spaces and special characters with hyphens
   - Remove consecutive or trailing hyphens
   - Truncate to a reasonable length (~6 words) for a short, readable
     filename
   - Example: "Add a dark mode toggle to the guestbook" →
     `add-dark-mode-toggle-to-guestbook`

3. **Assign the next ID**:
   - Read all `queue/*.md` files
   - Extract each `id` field from frontmatter
   - Use `max(all_ids) + 1` (start at `1` if the queue is empty)

4. **Create the file** at `queue/<slug>.md`:

```markdown
---
id: "<id>"
title: "<description, or a short derived title if the description is long>"
status: "inbox"
priority: "normal"
deploy_mode: "ask"
confidence: 0
created: "<today YYYY-MM-DD>"
updated: "<today YYYY-MM-DD>"
---

## Request
<description, verbatim>

## Clarifying Q&A

## Plan
```

5. **Confirm**: Show the user the file path created and remind them it'll be
   picked up next time they run `/queue-review`.

## Notes

- Do not run a clarifying Q&A loop here, even if the description is vague —
  that's deliberately deferred to `/queue-review` so capture stays fast.
- If a file with the same slug already exists, append `-2`, `-3`, etc. rather
  than overwriting it.
- See `queue/README.md` for the full field/status reference.
