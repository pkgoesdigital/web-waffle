import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'
import QuarterWithClaude from '@/components/QuarterWithClaude/QuarterWithClaude'
import { q2Prose } from '@/data/quarter-prose/q2-2026'

export const metadata: Metadata = {
  title: 'Q2 2026 — With Claude — AI Enablement',
  description:
    'A quarter of coworking with Claude, instrumented and audited. Five principles for sustainable AI adoption, with three months of real evidence.',
}

const parent = { slug: 'ai-enablement', title: 'AI Enablement' }

export default function Q2WithClaudePage() {
  return (
    <PortfolioPage slug="Q2-with-claude" parent={parent}>
      <QuarterWithClaude dataset="q2-with-claude" prose={q2Prose} />
    </PortfolioPage>
  )
}
