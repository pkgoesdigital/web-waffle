# Enhancement Queue

This directory holds ideas for changes to the site, one markdown file per
request, from initial capture through to a buildable plan. It's the intake
half of the site's agentic loop: `/queue-add` captures a request, `/queue-review`
clarifies it with the user and turns it into a plan.

Nothing in here is executed automatically — it's reviewed and worked
interactively, in a Claude Code session, at the user's initiative.

## File format

Each item is `queue/<slug>.md`:

```markdown
---
id: "1"
title: "Short descriptive title"
status: "inbox"
priority: "normal"
deploy_mode: "ask"
confidence: 0
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
---

## Request
Freeform description of the enhancement/change as originally captured.

## Clarifying Q&A
- Q: ...
  A: ...

## Plan
(populated once confidence >= 80; left empty until then)
```

## Status enum

| Status | Meaning |
|---|---|
| `inbox` | Captured, not yet clarified |
| `clarifying` | Q&A in progress |
| `ready-to-plan` | Confidence >= 80, plan not yet written |
| `planned` | Plan written; ready for a future build phase |
| `building` | *(reserved — not yet implemented)* |
| `testing` | *(reserved — not yet implemented)* |
| `ready-to-deploy` | *(reserved — not yet implemented)* |
| `deployed` | *(reserved — not yet implemented)* |
| `monitoring` | *(reserved — not yet implemented)* |
| `done` | *(reserved — not yet implemented)* |
| `rejected` | Decided against; kept for history |

Only `inbox → clarifying → ready-to-plan → planned` are used today. The rest
of the enum exists so later phases (build/test/deploy/monitor) don't require
a schema change — they'll pick items up at `planned` and carry them forward.

## Other fields

- **priority** (`low` / `normal` / `high`) — set by hand during `/queue-review`.
- **deploy_mode** (`ask` / `auto` / `manual-only`) — reserved for a future
  deploy phase; not acted on today.
- **confidence** (0-100) — Claude's self-assessed confidence that the request
  is well-specified enough to plan, updated after each clarifying round.

## Commands

- `/queue-add` — quick capture, any time an idea comes up.
- `/queue-review` — the daily driver: review the queue, clarify items via
  Q&A, and produce plans once confidence clears the bar.
