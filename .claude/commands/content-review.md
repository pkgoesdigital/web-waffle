# Command: /content-review

Review a writing post for quality, voice, and credibility as a PM + engineer portfolio piece.

## Author Context

The author is a **product manager and full-stack engineer**. Posts should demonstrate:
- Product thinking: user impact, tradeoffs, prioritization, stakeholder reasoning
- Technical depth: specific tools, frameworks, architecture decisions, implementation detail
- Real-world credibility: concrete examples, actual numbers, named projects/companies where appropriate

## Voice Standards

| Standard | Good | Bad |
|---|---|---|
| Direct | "We shipped in 3 weeks by cutting scope to the API layer only." | "It's important to note that timeline management is a key consideration." |
| Specific | "Used Server Components in Next.js 15 to eliminate the client bundle." | "We chose a modern tech stack." |
| Earned length | Every sentence moves the argument forward | Filler transitions, padding, rephrasings |
| First-person | "I decided to..." / "We shipped..." | "One might consider..." / "It can be said..." |
| No clichés | Fresh phrasing | "In today's fast-paced world", "synergy", "learnings" |

## Review Steps

1. **Identify the post** — ask if not specified. Read the file at `src/content/posts/<slug>.md` or `src/content/pages/<slug>.md`.

2. **Assess structure**:
   - Is there a clear hook in the opening paragraph?
   - Does the post have a point it's building toward?
   - Does the ending resolve or extend the argument (not just trail off)?

3. **Scan for voice violations**: filler phrases, passive voice overuse, vague claims without evidence, corporate jargon.

4. **Check PM credibility signals**: Does the post show product judgment? (tradeoffs named, user needs grounded, decisions explained not just described)

5. **Check engineering credibility signals**: Are technical claims specific and accurate? Are implementation details concrete enough to be credible?

6. **Deliver feedback**:
   - Overall assessment (1-2 sentences)
   - Specific line-level edits with before/after — not general advice
   - Flag any sections that undermine credibility
   - Optionally rewrite a paragraph to demonstrate the target voice

7. **Offer to apply edits** directly to the file after review.

## Tone of the Review

Be direct. The goal is a portfolio that earns respect from engineers, PMs, and hiring managers alike — not a blog that feels safe.
