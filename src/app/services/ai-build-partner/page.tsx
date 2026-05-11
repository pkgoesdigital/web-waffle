import type { Metadata } from 'next'
import ServicePage from '@/components/ServicePage/ServicePage'

export const metadata: Metadata = {
  title: 'AI Build Partner — Services',
  description:
    "Hands-on technical and product partnership to get your AI implementation from plan to production. Pairing with your engineers, knowledge transfer baked in, honest tradeoff calls along the way.",
}

export default function AIBuildPartnerPage() {
  return (
    <ServicePage slug="ai-build-partner">
      <h2>What this is</h2>
      <p>
        You have a plan — yours, mine, or some
        hybrid of the two. Now, you need someone who can actually build the thing.
        Not a vendor pitching you a platform. Not a contractor disappearing
        into a ticket queue. A product-minded engineer who can write the
        prompts, wire up the integrations, build the AI evals, and own the
        whole arc from architecture decisions to production rollout.
      </p>
      <p>
        I bring product judgment to a technical role most teams hire as
        pure engineering. That matters because the hard parts of an AI
        implementation aren&rsquo;t usually code — they&rsquo;re questions
        like <em>what does &ldquo;working&rdquo; mean here</em>, <em>what
        happens when the model is wrong</em>, and <em>how do we know
        we&rsquo;re still on track six weeks in</em>. Those questions get
        answered the same way good products get built: with discipline,
        not vibes.
      </p>

      <h2>How it works</h2>
      <p>
        We start with a kickoff and a written architecture doc — what
        we&rsquo;re building, what the tradeoffs are, what we&rsquo;re
        explicitly choosing not to do. The doc gets updated as decisions evolve;
        the goal is that anyone on your team can read it next year and
        understand why we did it this way.
      </p>
      <p>
        From there, scope and build during engineering sprints. I work alongside your engineers — not
        in a silo, not in a side branch nobody reviews. Pairing is the
        default. Code review is the default. Knowledge transfer
        isn&rsquo;t a phase tacked onto the end; it&rsquo;s how the work
        happens. By the time we ship, your team has the context to own
        it.
      </p>
      <p>
        Before launch, we build an evaluation harness. This is the part
        most teams skip and regret. <strong>If you can&rsquo;t measure
        whether your AI feature is working, you can&rsquo;t fix it when
        it stops</strong> — and AI features stop working in subtle ways.
        We&rsquo;ll have automated evals on the cases that matter, plus
        a written rubric for the qualitative calls.
      </p>

      <h2>What you walk away with</h2>
      <p>
        Working software in production, an architecture your team
        understands, evals that catch regressions, and the documentation
        to keep extending it without me. I include a 30-day post-launch
        support window - after that, your team owns it and maintains it. 
      </p>
      <p>
        If you decide you want ongoing oversight after launch, the{' '}
        <a href="/services/ai-overseer">AI Overseer</a> retainer picks
        up where this service leaves off.
      </p>
    </ServicePage>
  )
}
