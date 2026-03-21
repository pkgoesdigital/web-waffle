import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'DoubleCheck — Portfolio' }

const parent = { slug: 'tonic', title: 'Tonic Inc. Digital Consulting' }

export default function DoubleCheckPage() {
  return (
    <PortfolioPage slug="doublecheck" parent={parent}>
      <p>
        DoubleCheck is an intermediary service that notifies account holders when
        they have insufficient funds and lets them determine what gets paid —
        helping users avoid canceled services, secondary fees, and credit damage.
        This engagement was a front-end template build to unblock the
        client&rsquo;s existing Angular development team before an internal
        deadline.
      </p>

      <h2>The Problem</h2>
      <p>
        DoubleCheck&rsquo;s internal team didn&rsquo;t have a front-end developer
        with capacity to build new UI designs in time for their deadline. The
        templates needed to integrate cleanly into their existing Angular
        architecture without requiring the internal team to restructure their
        codebase — so the brief was intentionally minimal: a solid, well-styled
        foundation to build from.
      </p>

      <h2>What I Built</h2>
      <ul>
        <li>HTML structured for Angular component injection</li>
        <li>
          Consistent base element styling across all templates using a style
          library package
        </li>
        <li>
          CSS for complex tabular data display, including dropdowns and interactive
          elements embedded within table rows
        </li>
        <li>
          Minimal JavaScript only where strictly required — keeping the templates
          simple and integration-ready
        </li>
      </ul>

      <h2>Stack</h2>
      <p>
        Bootstrap, HTML, CSS, and Angular-compatible JavaScript. The goal was
        zero unnecessary complexity: clean markup, predictable styling, and a
        structure the DoubleCheck team could immediately layer their Angular logic
        onto without fighting the templates.
      </p>
    </PortfolioPage>
  )
}
