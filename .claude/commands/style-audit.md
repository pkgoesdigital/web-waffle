# Command: /style-audit

Audit CSS Modules files in web-waffle for convention violations.

## Steps

1. **Read `src/app/globals.css`** to build the inventory of available CSS custom properties (colors, spacing, typography scale, utility classes).

2. **Glob all `.module.css` files** under `src/` and read each one.

3. **Check each file for violations**:

   | Violation | What to look for | Correct approach |
   |---|---|---|
   | Hardcoded color | `#hex`, `rgb(`, `rgba(`, `hsl(` in a value | `var(--color-*)` from globals.css |
   | Hardcoded spacing | literal `px`/`rem` values that duplicate a `--space-*` variable | `var(--space-*)` |
   | Hardcoded font size | literal `px`/`rem` font-size that duplicates `--text-*` | `var(--text-*)` |
   | `!important` | any use | Fix specificity or use a global utility class |
   | Global selectors | `* {}`, `body {}`, `html {}` inside a module | Move to globals.css |
   | Wrong border width | border widths other than `3px` | Borders in this project are 3px |

4. **Read the `css-modules` skill** for the full convention reference if needed.

5. **Report** violations grouped by file:
   - File path
   - Line number (if determinable from context)
   - Violation type
   - Current value
   - Suggested replacement

6. **Offer to fix** each violation. Fix one file at a time and confirm before moving to the next.

## Scope Options

- Default: all `.module.css` files in `src/`
- Targeted: user can specify a component name or file path to audit only that file
