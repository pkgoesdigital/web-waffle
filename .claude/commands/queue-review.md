# Command: /queue-review

The daily driver for the enhancement queue. Reviews open items with the
user, clarifies them through interactive Q&A until well-specified, then
produces a written plan. This command is interactive and expects live user
input — never run it unattended.

Scope: this command takes items from `inbox` through to `planned`. It does
not build, test, deploy, or monitor anything — those phases don't exist yet.
Stop at `planned`.

## Steps

### 1. Summarize

- Read all `queue/*.md` files.
- List them grouped by `status`, showing `id`, `title`, `priority`, and
  `confidence` for each.
- Ask the user which item(s) to work on this session. Let them reprioritize
  by hand (edit the `priority` field) if they ask.

### 2. Clarify

For the chosen item, if its status is `inbox`, set status to `clarifying`
and proceed. If it's already `clarifying`, resume it (read the existing
`## Clarifying Q&A` so far — don't re-ask settled questions).

Loop, for up to **6 rounds**:

1. Formulate clarifying questions about scope, affected pages/components,
   acceptance criteria, and design constraints. Ground questions in the
   actual codebase where possible (e.g. "This touches `ContentCard` — should
   it apply to all cards or just the home page grid?") rather than asking
   generically. Skim relevant files first if the request is code-shaped.
   Use the AskUserQuestion tool — this is a live session, so real-time Q&A
   is expected, not a written questionnaire.
2. Append each Q&A pair to the item's `## Clarifying Q&A` section, in the
   `- Q: ... / A: ...` format already in the file.
3. Re-assess **confidence** (0-100) against this rubric — each holds equal
   weight (~25 points):
   - Acceptance criteria are concrete and checkable
   - Affected files/components are identified
   - No open design decisions remain
   - Scope boundaries are unambiguous (what's explicitly out of scope is as
     clear as what's in scope)
   Update the `confidence` and `updated` frontmatter fields after each round.
4. If confidence >= 80, break out of the loop and continue to Plan.
5. If this was round 6 and confidence is still < 80, stop. Leave `status` at
   `clarifying`, save progress, and tell the user this item needs another
   session — do not loop indefinitely.

### 3. Plan

Only reached if confidence >= 80.

1. Set `status` to `ready-to-plan`, save.
2. Survey the codebase with Explore agent(s) — same pattern this
   environment's own plan mode uses. Scope the exploration to what the
   clarifying Q&A identified as affected (files, components, patterns).
3. Hand the request + Q&A + exploration findings to a Plan agent to design
   the implementation approach. Reference existing patterns in this repo
   (e.g. `src/lib/content.ts` conventions, `CSS Modules` structure per
   `css-modules` skill, `next-app-router` patterns) rather than inventing new
   ones.
4. Write the resulting plan into the item's `## Plan` section as a numbered,
   concrete step list — the kind of detail a future session could execute
   directly, not a vague summary.
5. Set `status` to `planned`, update `updated` to today.
6. Confirm to the user: item is planned, show a short summary, and note that
   build/test/deploy for it is a future phase — nothing further happens
   automatically.

## Notes

- Never advance an item past `planned` — building, testing, and deploying
  queue items is explicitly out of scope until a later phase exists.
- Never touch `master` or push/open PRs as a side effect of this command;
  it only edits files under `queue/`.
- If the user wants to stop mid-session, save the item's current state
  (status, confidence, Q&A so far) exactly as-is — don't force a round to
  finish.
- See `queue/README.md` for the full field/status reference.
