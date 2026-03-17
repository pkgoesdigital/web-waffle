# Skill: CSS Modules Conventions

Use this skill when writing or editing any `.module.css` file in web-waffle.

## File Co-location

Every component gets its own folder:
```
src/components/ComponentName/
  ComponentName.tsx
  ComponentName.module.css
```

Never put component styles in `globals.css`. Never share a module file between components.

## CSS Custom Properties (use these, not hardcoded values)

All custom properties are defined in `src/app/globals.css`. Reference them via `var(--property-name)`.

### Colors
```css
var(--color-bg)          /* page background */
var(--color-surface)     /* card/panel background */
var(--color-border)      /* borders */
var(--color-text)        /* primary text */
var(--color-text-muted)  /* secondary/metadata text */
var(--color-accent)      /* interactive elements, links */
var(--color-accent-hover)
```

### Spacing
```css
var(--space-xs)   /* ~4px */
var(--space-sm)   /* ~8px */
var(--space-md)   /* ~16px */
var(--space-lg)   /* ~24px */
var(--space-xl)   /* ~40px */
var(--space-2xl)  /* ~64px */
```

### Typography
```css
var(--font-sans)
var(--font-mono)
var(--text-xs)
var(--text-sm)
var(--text-base)
var(--text-lg)
var(--text-xl)
var(--text-2xl)
var(--text-3xl)
```

## Rules

### DO
- Use `var(--property)` for all colors, spacing, and font sizes
- Use CSS custom properties for transitions: `transition: color 0.2s ease`
- Compose with global utility classes when appropriate (`.prose`, `.page-container`, etc.)
- Use descriptive class names: `.cardTitle`, `.metaRow`, `.emptyState`

### DO NOT
- No `!important` — fix specificity instead
- No hardcoded colors (`#333`, `rgb(0,0,0)`, `rgba(...)`) — use `var(--color-*)`
- No hardcoded spacing that duplicates a custom property
- No global selectors (`* {}`, `body {}`) inside a module file
- No CSS nesting syntax (not supported without additional config)

## Global Utility Classes (from globals.css)

Prefer these over re-implementing in a module:
```
.prose           → article body (max-width 680px, optimized line-height)
.page-container  → top-level page wrapper with horizontal padding
.page-header     → page title + description area
.section         → vertical section spacing
.section-title   → section heading style
```

Apply global classes in TSX via `className` alongside module classes:
```tsx
<div className={`${styles.wrapper} page-container`}>
```

## Borders

Border widths in this project are **3px** (updated from 1px). Use `var(--color-border)` for the color.

## Dark Mode

The project uses CSS custom properties that update via `[data-theme="dark"]` or `prefers-color-scheme`. Never hardcode colors for a specific theme — always use custom properties so both themes work automatically.
