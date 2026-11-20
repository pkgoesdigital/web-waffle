/**
 * Prose for the Q2 2026 — With Claude portfolio entry.
 *
 * This file is the editable layer for the QuarterWithClaude component.
 * To ship a new quarter (Q3, Q4, etc.), create a sibling file with the same
 * shape and point a new portfolio page at it — no component changes needed.
 */

export type QuarterBeat = {
  /** Section eyebrow, rendered in mono. Typically "Principle 0X · <short tag>" */
  eyebrow: string
  /** Section heading. Short. May contain an <em> via `{ em: '...' }`. */
  title: string
  /** Lede sentence. Prose, one or two sentences. */
  lede: string
  /** Optional caption below the viz for this beat. */
  caption?: string
}

export type QuarterProse = {
  hero: {
    kicker: string
    title: string
    deck: string
    byline: string
  }
  beats: QuarterBeat[]
  cta: {
    heading: string
  }
  closing: string
}

export const q2Prose: QuarterProse = {
  hero: {
    kicker: 'A Worked Example · Rabbitbrush Studio',
    title: 'Q2 with Claude',
    deck: 'One quarter, instrumented and audited. Five principles for building with AI that lasts.',
    byline: 'April 1 – June 30, 2026 · 125 sessions · 14 with me in the room',
  },
  beats: [
    {
      eyebrow: 'Principle 01 · Start small',
      title: 'One ritual that works.',
      lede: 'A morning check-in. Three walk breaks. Notable emails summarized. For the first week of April, that was the whole job — and it was supposed to be.',
      caption: 'One ritual, five repetitions · April 9 – April 13',
    },
    {
      eyebrow: 'Principle 02 · Layer, don’t stack',
      title: 'Add when the first one is boring.',
      lede: 'The second ritual joined on April 17 — eight days after the first one stopped needing me. Boring is the signal that earns the next thing.',
      caption: 'Two streams, layered · April 9 – April 21',
    },
    {
      eyebrow: 'Principle 03 · Self-documenting systems',
      title: 'Let it keep its own books.',
      lede: 'Through late April and most of May, the system wrote its own diary daily — usage records, in JSON and in plain English. The audit trail exists because the system makes it, not because anyone remembers to.',
      caption: 'Tool calls per day · the system writing its own ledger',
    },
    {
      eyebrow: 'Principle 04 · Human in the loop, not in the lane',
      title: 'Show up when it matters.',
      lede: 'Fourteen sessions out of one hundred twenty-five. Each one a moment when judgment was the right tool, not automation — onboarding a new workflow, declining a scheduled walk, adjusting a saved convention for next month.',
    },
    {
      eyebrow: 'Principle 05 · Plan for drift',
      title: 'Even good systems go quiet.',
      lede: 'June told the honest version of this story. After a peak May, the volume dropped — fewer sessions, fewer logged days, fewer tool calls. Some of that is seasonal. Some of it is the kind of drift an audit would catch.',
      caption: 'Daily intensity · April 1 – June 30. Pale squares are silent days.',
    },
    {
      eyebrow: 'The bottom line',
      title: 'None of this is impressive.',
      lede: 'That’s the point. The argument is the cadence, and the durability, and the fact that most of this kept running whether or not I was watching.',
    },
  ],
  cta: {
    heading: 'Build yours.',
  },
  closing:
    'It only works if it holds when nobody’s watching.',
}
