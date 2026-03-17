# Instincts

This directory stores learned behaviors captured from real web-waffle sessions.

Instincts are small, atomic patterns that Claude notices during work — things like "this project always needs CSS custom properties, never hardcoded colors" or "the build fails when generateStaticParams is missing from a dynamic route."

## Format

Each instinct is a YAML file:

```yaml
# .claude/homunculus/instincts/<slug>.yaml
id: "instinct-001"
trigger: "editing a dynamic route file"
behavior: "check that generateStaticParams() is defined and exported"
confidence: 0.85          # 0.0–1.0; promote to skill at 0.8+ across 3+ sessions
source: "session-2026-03-17"
promoted: false           # true once baked into a SKILL.md
```

## Lifecycle

1. **Observe** — during a session, note a pattern worth remembering
2. **Capture** — write a new `.yaml` file here manually or ask Claude to do it
3. **Promote** — when confidence is high, extract the instinct into the relevant `SKILL.md`
4. **Archive** — mark `promoted: true` and keep for audit trail

## What Makes a Good Instinct

- Specific to this project's conventions, not general programming knowledge
- Actionable — describes what to do, not just what to avoid
- Atomic — one behavior per instinct file
- Scoped — if it applies to all Next.js projects, it belongs in the `next-app-router` skill, not here

## Current Instincts

(None yet — this directory is seeded at project setup)
