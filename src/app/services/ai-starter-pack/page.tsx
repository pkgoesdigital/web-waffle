import type { Metadata } from 'next'
import ServicePage from '@/components/ServicePage/ServicePage'

export const metadata: Metadata = {
  title: 'AI Starter Pack — Services',
  description:
    "A 3–4 week engagement that takes your team from 'we should do AI' to a real plan you can ship. Education, strategy, and a custom implementation roadmap.",
}

export default function AIStarterPackPage() {
  return (
    <ServicePage slug="ai-starter-pack">
      <h2>What this is</h2>
      <p>
        A short, focused engagement for teams who know AI matters but
        haven&rsquo;t found their footing yet. The goal is simple: when we&rsquo;re
        done, you&rsquo;ll have a plan you actually believe in — sequenced,
        scoped, and tied to outcomes you care about — plus enough shared
        vocabulary across your team that the next AI conversation isn&rsquo;t
        starting from scratch.
      </p>
      <p>
        I treat AI adoption like any other product decision: <strong>what problem
        are we solving, who is it for, what does &ldquo;good&rdquo; look
        like</strong>, and what&rsquo;s the smallest thing we can ship to find
        out if we&rsquo;re right? The fact that the underlying technology is a
        large language model doesn&rsquo;t change those fundamentals — it
        just makes a lot of people forget them.
      </p>

      <h2>How it works</h2>
      <p>
        We start with discovery — usually a week of conversations with
        leadership, team leads, and a few people doing the actual work. I want
        to understand what your team is actually trying to do, where the
        friction is today, and where you suspect AI might help (and where
        it&rsquo;s being pitched as a solution to a problem you don&rsquo;t
        have).
      </p>
      <p>
        Then we run workshops. Real ones, not slide-deck monologues — your
        team should walk out able to read an AI vendor&rsquo;s pitch and tell
        what&rsquo;s real and what&rsquo;s marketing. We cover capabilities,
        limitations, costs, common failure modes, and the terminology
        you&rsquo;ll keep running into. If your team is split on what an
        &ldquo;agent&rdquo; even is, we fix that here.
      </p>
      <p>
        From there I draft the implementation plan. You get a written
        document, not just a slide deck — with phasing, success metrics, risk
        callouts, and tooling recommendations matched to your stack and
        budget. We review it together, you push back on the parts that
        don&rsquo;t fit, and we revise until it&rsquo;s yours.
      </p>

      <h2>What you walk away with</h2>
      <p>
        A roadmap your team can run with, the shared language to keep
        running with it, and a 30-day check-in once rollout begins so you
        don&rsquo;t have to wonder whether you&rsquo;re still on the right
        track. The point is to leave you self-sufficient — not to install a
        long-term dependency on me.
      </p>
    </ServicePage>
  )
}
