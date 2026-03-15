import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'The Waterbury Group — Portfolio' }

export default function WaterburyPage() {
  return (
    <PortfolioPage slug="waterbury">
      <p>
        At The Waterbury Group, I shifted into a technical project manager role,
        managing the technical build-out of multiple web applications using
        custom data pipelines, data-driven business requirements, and development
        best practices.
      </p>

      <h2>Approach</h2>
      <p>
        I established trust as the technical lead by delivering process documents,
        accurate scope, and formal requirements — ensuring clear development
        pathways and on-time deliverables. I paved the development path by
        building proof-of-concepts, researching technical limitations and
        workarounds, and supporting development roadmapping.
      </p>
      <p>
        Every project I scoped was delivered on time, with clear documentation
        that outlasted my tenure on the engagement. The role required bridging
        the gap between client stakeholders and development teams, translating
        business needs into structured technical requirements without losing
        fidelity on either side.
      </p>
    </PortfolioPage>
  )
}
