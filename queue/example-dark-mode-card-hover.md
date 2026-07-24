---
id: "1"
title: "Example: card hover affordance in dark mode"
status: "planned"
priority: "low"
deploy_mode: "ask"
confidence: 85
created: "2026-07-23"
updated: "2026-07-23"
---

## Request
Sample item showing the intake -> clarify -> plan flow. Not a real change —
kept as a reference for the file format. Original ask: "cards on the home
page don't feel interactive enough in dark mode."

## Clarifying Q&A
- Q: Which cards — `ContentCard` everywhere, or just the home page grid?
  A: Just the home page `CardGrid` for now.
- Q: What's the acceptance criteria — a specific visual target, or "looks
  more clickable"?
  A: On hover, the `--card-color` border should brighten slightly and the
  card should lift with a subtle shadow, matching the existing light-mode
  hover treatment already in `ContentCard.module.css`.
- Q: Any motion constraints?
  A: Must respect `prefers-reduced-motion` per the repo's accessibility
  standards — no transform/shadow transition when reduced motion is set.

## Plan
1. Read `src/components/ContentCard/ContentCard.module.css` to find the
   existing light-mode `:hover` rule (border/shadow treatment).
2. Add a dark-mode override inside the existing `[data-theme="dark"]` block
   (or equivalent selector already used in this file) that brightens the
   `--card-color` border and adds a matching shadow on `:hover`/`:focus-visible`.
3. Verify the new hover transition is covered by the file's existing
   `@media (prefers-reduced-motion: reduce)` handling — do not add a new
   motion rule outside it.
4. Manually check contrast of the brightened border against `--color-bg` in
   dark mode (WCAG AA, 3:1 for non-text UI components).
5. No new component logic, so no new spec file is required — visually verify
   via `npm run dev` in both themes before committing.
