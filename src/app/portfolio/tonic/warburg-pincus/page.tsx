import type { Metadata } from 'next'
import Image from 'next/image'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'Warburg Pincus — Quill — Portfolio' }

const parent = { slug: 'tonic', title: 'Tonic Inc. Digital Consulting' }

export default function WarburgPincusPage() {
  return (
    <PortfolioPage slug="warburg-pincus" parent={parent}>
      <p>
        Warburg Pincus is a private equity firm with over 55 years of experience
        in growth investing across sectors including Consumer, Energy Transition,
        Financial Services, Healthcare, Industrial &amp; Business Services, Real
        Estate, and Technology. Quill was an internal deal management application
        built to give 300+ deal professionals a faster, more intuitive tool for
        tracking and analyzing financial data across their portfolio.
      </p>

      <h2>Project Scope</h2>
      <p>
        This was a six-engineer project working inside Warburg Pincus&rsquo;s
        existing Microsoft Azure development environment. The application was built
        in React with AG Grid for tabular data display and charting libraries for
        visualizations. Dashboards needed to be flexible across all deal types in
        different industries, and each deal could be updated by over 100
        authenticated users — making state management and asynchronous update
        handling a core architectural concern.
      </p>

      <Image
        src="/img/warburg-pincus/quill-dashboard.webp"
        alt="Quill dashboard showing financial metrics, bar charts, and operating performance analysis panels"
        width={2880}
        height={5592}
        sizes="(max-width: 860px) 100vw, 860px"
        style={{ width: '100%', height: 'auto' }}
      />

      <h2>My Role</h2>
      <p>
        I was responsible for building out modals involving state management,
        implementing real-time state change notifications within the UI,
        creating data visualizations from API-sourced financial data using graphing
        libraries, fixing bugs across the application, and integrating with iLevel
        and other third-party portfolio management systems.
      </p>
      <p>
        My contributions produced ten dashboard visualizations that were put into
        active use by deal professionals. The complex tabbed interfaces supported
        investment valuations, multi-page financial reporting, and flexible metric
        display across industries.
      </p>

      <Image
        src="/img/warburg-pincus/quill-valuation.webp"
        alt="Quill valuation tab showing investment summary table with quarterly data and equity value charts"
        width={2880}
        height={3092}
        sizes="(max-width: 860px) 100vw, 860px"
        style={{ width: '100%', height: 'auto' }}
      />

      <Image
        src="/img/warburg-pincus/quill-snapshot-discussion.webp"
        alt="Quill snapshot discussion book view showing multi-section financial narrative and supplemental data tables"
        width={2880}
        height={6748}
        sizes="(max-width: 860px) 100vw, 860px"
        style={{ width: '100%', height: 'auto' }}
      />

      <h2>Technical Highlights</h2>
      <ul>
        <li>
          React + AG Grid for high-performance tabular financial data display
        </li>
        <li>
          Charting library integrations for dynamic visualizations fed from REST
          APIs
        </li>
        <li>
          Real-time state change notifications across a 100+ user concurrent
          update environment
        </li>
        <li>
          Third-party integrations with iLevel and other portfolio management
          tooling
        </li>
        <li>Microsoft Azure deployment environment</li>
      </ul>
    </PortfolioPage>
  )
}
