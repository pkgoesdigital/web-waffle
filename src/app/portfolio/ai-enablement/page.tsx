import type { Metadata } from 'next'
import Link from 'next/link'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'
import { portfolioSections } from '@/data/portfolio-sections'

export const metadata: Metadata = {
  title: 'AI Enablement — Portfolio',
  description:
    'Quarterly field notes on building alongside Claude sustainably — case studies drawn from my own practice.',
}

export default function AIEnablementPage() {
  const section = portfolioSections.find((s) => s.slug === 'ai-enablement')
  const children = section?.children ?? []

  return (
    <PortfolioPage slug="ai-enablement">
      <p>
        I help teams adopt AI without the &ldquo;we&rsquo;ve lost the plot&rdquo;
        moment. Most consultants writing about AI aren&rsquo;t, themselves,
        using it the way they&rsquo;d recommend you use it. This section is my
        answer to that &mdash; a quarterly case study drawn from my own
        practice, with the data to back it up.
      </p>

      <p>
        Each entry is instrumented end-to-end: the sessions you&rsquo;ll see
        charted are the actual ones Claude ran on my behalf, with tool calls,
        timestamps, and outcomes logged automatically. No curation to make the
        numbers look better than they are. The point of these is to show what
        a sustainable AI practice looks like in evidence &mdash; including the
        weeks where it quietly stops working, which are the ones most case
        studies leave out.
      </p>

      <h2>Quarters</h2>

      <ul>
        {children.map((c) => (
          <li key={c.slug}>
            <Link href={`/portfolio/ai-enablement/${c.slug}`}>
              <strong>{c.title}</strong>
            </Link>
            {' — '}
            {c.description}
          </li>
        ))}
      </ul>

      <p>
        <em>Future quarters land here as they&rsquo;re written.</em>
      </p>
    </PortfolioPage>
  )
}
