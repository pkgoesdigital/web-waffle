/**
 * Services — single source of truth for the /services route.
 *
 * Adding a new service:
 *   1. Append a new Service object to the `services` array below.
 *   2. Create a route file at src/app/services/<slug>/page.tsx that renders
 *      <ServicePage slug="<slug>"> with the long-form pitch as children.
 *   3. That's it. The listing page, nav dropdown, and prev/next pagination
 *      pick it up automatically (sorted by `order`, filtered by `visible`).
 */

export type ServiceStage = 'pre-adoption' | 'in-flight' | 'post-adoption'

export type ServiceCTA = {
  /** Visible button text */
  label: string
  /** Link target — mailto:, /contact, external URL, etc. */
  href: string
}

export type ServiceFAQ = {
  question: string
  answer: string
}

export type Service = {
  /** URL slug — must match the folder name under src/app/services/ */
  slug: string
  /** Display title — also used in nav and prev/next */
  title: string
  /** One-line positioning, used on cards and detail page header */
  tagline: string
  /** Audience description — "Teams who..." */
  forWho: string
  /** Lifecycle stage this service targets — used for filtering/grouping later */
  stage: ServiceStage
  /** 3–5 bullets describing what the engagement produces */
  outcomes: string[]
  /** Concrete deliverables / what's in the box */
  includes: string[]
  /** "4-week engagement" / "Monthly retainer" / etc. */
  format?: string
  /** Free-text pricing line — kept stringly-typed so it can say "Contact for pricing" */
  pricing?: string
  /** Primary call-to-action shown on listing card and detail page */
  primaryCTA: ServiceCTA
  /** Optional Q&A — only rendered on detail page if present */
  faq?: ServiceFAQ[]
  /** Hide a service without deleting the record. Listing/nav skip when false. */
  visible: boolean
  /** Explicit ordering — decoupled from array index */
  order: number
}

export const services: Service[] = [
  {
    slug: 'ai-starter-pack',
    title: 'AI Starter Pack',
    tagline: "Get from 'we should leverage AI' to a plan you can actually use.",
    forWho:
      "Teams that know AI matters but don't know where to start, or have been struggling with it for months without gaining traction.",
    stage: 'pre-adoption',
    outcomes: [
      'A clear-eyed read on which AI investments make sense for your business right now — and which ones to skip.',
      'A custom implementation plan: sequenced, scoped, and achievable based on your organizations culture and capabilities.',
      'Education on how AI actually works, the terminology that matters, and how best to think about it.',
      'Guardrails and best practices baked in from day one, so your implementation remains manageable and sustainable.',
    ],
    includes: [
      'Discovery sessions with leadership and team leads',
      'Workshops on AI fundamentals — capabilities, limitations, costs, common pitfalls',
      'A custom written implementation plan with phasing, success metrics, and risk callouts specific to your org',
      'Tooling recommendations matched to your stack and budget',
      'A 30-day check-in after rollout begins',
    ],
    format: '3–4 week engagement',
    pricing: 'Contact for pricing',
    primaryCTA: {
      label: 'Book a discovery call',
      href:
        'https://calendar.app.google/hbqmQfTKJzgq9h4f9',
    },
    faq: [
      {
        question: 'We have an internal team — why bring you in?',
        answer:
          "Outside perspective, broader pattern-matching across stacks and industries due to my experience, and someone whose focus is dedicated to an AI strategy for your organization. Measure of Success: a plan your team can run with — not a dependency on me.",
      },
      {
        question: 'Do you build the actual AI tools?',
        answer:
          "The default deliverable is a plan, not code. If you want hands-on implementation, let's talk after the strategy is in shape.",
      },
      {
        question: 'A vendor is pitching us — can you weigh in?',
        answer:
          "Bring me in *before* you sign. I can help you ask the right questions, identify red flags, and avoid getting locked into a bad deal.",
      },
    ],
    visible: true,
    order: 1,
  },
  {
    slug: 'ai-build-partner',
    title: 'AI Build Partner',
    tagline: "Plan in hand? I'll help you actually implement it.",
    forWho:
      "Teams with a plan (yours or mine) who need hands-on technical and product leadership to get from roadmap to production.",
    stage: 'in-flight',
    outcomes: [
      'A working AI integration on a timeline you can plan around.',
      "Architecture decisions that won't bite you in six months — cost, latency, fallback behavior, security, evals.",
      'Knowledge transfer baked into the engagement, so your team can own and extend it after I leave.',
      'Honest tradeoff calls in real time — when to use a model vs. a rule, when to buy vs. build, when to wait.',
    ],
    includes: [
      'Hands-on implementation: prompts, integrations, evals, guardrails, tooling',
      'Architecture and tradeoff decisions documented as we make them',
      'Pairing with your engineers — knowledge transfer is part of the deliverable',
      'Pre-launch evaluation harness so you know what "working" actually means',
      'Handoff documentation and a 30-day post-launch support window',
    ],
    format: 'Project-based engagement (typically 6–12 weeks)',
    pricing: 'Contact for pricing',
    primaryCTA: {
      label: 'Scope a build',
      href:
        'https://calendar.app.google/hbqmQfTKJzgq9h4f9',
    },
    faq: [
      {
        question: 'Do I need to do the Starter Pack first?',
        answer:
          "No. If you have a plan you're confident in, we can start here. If you're not sure your plan is right, we can do a 1-week scope review before committing to a build — cheaper than discovering halfway in that we're solving the wrong problem.",
      },
      {
        question: 'Can you work with our existing engineers?',
        answer:
          "That's the default. I'd rather pair with your team than work in a silo — knowledge transfer is part of the deal.",
      },
      {
        question: 'What if the scope changes mid-build?',
        answer:
          'It will. We replan together at agreed checkpoints, and evaluate trade-offs together - I strive for no surprises, but engineering projects are inherently unpredictable.',
      },
    ],
    visible: true,
    order: 2,
  },
  {
    slug: 'ai-overseer',
    title: 'AI Overseer',
    tagline: "You've deployed AI. Now keep it from going sideways in your org.",
    forWho:
      "Teams already using AI tools who need a steady hand watching for drift, surfacing problems early, and stepping in when something breaks that nobody on staff can fix.",
    stage: 'post-adoption',
    outcomes: [
      'An honest audit of your current AI tooling and how teams are actually using it.',
      'Diagnosis of pitfalls — the ones already biting and the ones about to.',
      "A human escalation path for issues your team can't fix alone.",
      'Maintenance and best-practice guidance as the AI landscape shifts under you.',
    ],
    includes: [
      'Initial audit: tools in use, usage patterns, risk areas, shadow AI',
      'Monthly check-ins on usage, incidents, and emerging issues',
      'On-call escalation for AI-specific problems (within scope)',
      'Quarterly recommendations on tooling changes and process updates',
    ],
    format: 'Monthly retainer',
    pricing: 'Contact for pricing',
    primaryCTA: {
      label: 'Book an audit call',
      href:
        'https://calendar.app.google/hbqmQfTKJzgq9h4f9',
    },
    faq: [
      {
        question: 'Is this just monitoring?',
        answer:
          "It's audit, diagnosis, and escalation. Tools tell you something broke, and I tell you why, what to do, and whether you should care. Monitoring is a feature; the value is the human judgment on top.",
      },
      {
        question: 'What if my team can fix things themselves?',
        answer:
          "Then they should — that's the goal. I'm here for the cases where they can't, and for spotting the slow drifts they're too close to see.",
      },
      {
        question: 'Do you replace our security or compliance team?',
        answer:
          'No. I work alongside them on AI-specific risks they may not be staffed for — model behavior, prompt injection patterns, output drift, shadow tooling.',
      },
    ],
    visible: true,
    order: 3,
  },
]

/** Convenience: visible services in display order. */
export function getVisibleServices(): Service[] {
  return services
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order)
}

/** Convenience: find a service by slug (visibility-agnostic — for detail routes). */
export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}
