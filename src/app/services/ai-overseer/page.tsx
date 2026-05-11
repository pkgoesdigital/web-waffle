import type { Metadata } from 'next'
import ServicePage from '@/components/ServicePage/ServicePage'

export const metadata: Metadata = {
  title: 'AI Overseer — Services',
  description:
    "A monthly retainer for teams already using AI. Audit, drift detection, escalation for problems your team can't fix alone, and steady guidance as the landscape shifts.",
}

export default function AIOverseerPage() {
  return (
    <ServicePage slug="ai-overseer">
      <h2>What this is</h2>
      <p>
        Ongoing oversight for teams that have already deployed AI tooling
        and need a steady, experienced eye on it. Most of the failures I see
        in production AI aren&rsquo;t dramatic — they&rsquo;re drifts.
        Outputs that slowly get worse. Usage patterns nobody&rsquo;s tracking.
        Tools quietly bypassing review. Shadow AI. The kinds of problems
        that don&rsquo;t set off alerts because nobody set up the alerts.
      </p>
      <p>
        This is the engagement for when your team is shipping with AI but
        nobody on staff has the time, the pattern-matching, or honestly the
        appetite to be the person who has to chase down what&rsquo;s drifting
        and why.
      </p>

      <h2>The audit</h2>
      <p>
        We start with an honest look at where you are. What tools are in
        use, who&rsquo;s actually using them, what data they&rsquo;re
        touching, and which corners of your org have quietly stood up
        something nobody on the leadership team knows about. I produce a
        written audit with risk areas ranked by likelihood and impact, plus
        a short list of changes you could make this quarter that would improve your outputs.
      </p>

      <h2>Ongoing engagement</h2>
      <p>
        After the audit, we move into a monthly cadence: check-ins on usage,
        incidents, and emerging issues; on-call escalation for AI-specific
        problems your team can&rsquo;t resolve alone; and quarterly
        recommendations on tooling and process changes to continue to improve your outputs.
      </p>

      <h2>When to engage</h2>
      <p>
        The honest answer: before something breaks publicly. The AI tooling
        landscape is moving fast enough that &ldquo;we&rsquo;ll figure it out
        if it becomes a problem&rdquo; leads to outages and incidents that can be hard to recover from.&rdquo; This service exists
        so that doesn&rsquo;t happen to your org.
      </p>
    </ServicePage>
  )
}
