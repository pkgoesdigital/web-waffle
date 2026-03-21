import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'LexisNexis TPU Assessment — Portfolio' }

const parent = { slug: 'tonic', title: 'Tonic Inc. Digital Consulting' }

export default function LexisNexisPage() {
  return (
    <PortfolioPage slug="lexisnexis" parent={parent}>
      <p>
        LexisNexis is a global data and analytics company serving legal,
        regulatory, and business professionals. This three-week engagement produced
        an interactive risk assessment tool for the company&rsquo;s insurance
        underwriting division — designed to qualify prospects and route them to the
        appropriate sales tier.
      </p>

      <h2>Project Requirements</h2>
      <ul>
        <li>
          Interactive survey built with plain HTML, CSS, JavaScript, and PHP — no
          framework dependencies, embeddable in any LexisNexis landing page
        </li>
        <li>Fully responsive by baking in the responsive design into the style architecture.</li>
        <li>
          Metrics passed to the sales team via URL parameters on completion,
          including: overall assessment score, score-derived &ldquo;level&rdquo; or
          weight class, and the response to a key branching question
        </li>
        <li>
          Consistent with LexisNexis design system and branding guidelines
        </li>
        <li>User-friendly flow with minimal friction across question steps</li>
      </ul>

      <h2>Stack &amp; Approach</h2>
      <p>
        Keeping the stack deliberately minimal — HTML, CSS, JavaScript, and PHP —
        was a hard requirement so the assessment could be embedded anywhere without
        introducing build tooling or framework dependencies. The scoring logic and
        branching were handled in vanilla JavaScript, with PHP serializing the final
        result into URL parameters for downstream CRM pickup by the sales team.
      </p>

      <h2>What I Delivered</h2>
      <p>
        I was the sole engineer on this project. The assessment shipped within three
        weeks and was measured to drive a 15% increase in user engagement on the
        engagement. It ran embedded across multiple LexisNexis landing pages and
        fed qualified lead data directly into the sales pipeline.
      </p>
    </PortfolioPage>
  )
}
