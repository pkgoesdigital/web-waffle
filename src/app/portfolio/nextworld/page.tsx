import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'Nextworld — Portfolio' }

export default function NextworldPage() {
  return (
    <PortfolioPage slug="nextworld">
      <p>
        My first professional engineering role was at Nextworld, a SaaS ERP
        platform designed to replace legacy enterprise systems. I started as an
        Associate Software Engineer and was promoted to Software Engineer within
        three months. I owned and maintained features across the Reporting and
        Analytics applications — the part of the product that enterprise
        customers relied on to make sense of their data.
      </p>

      <h2>The Stack</h2>
      <p>
        The reporting engine was built on JasperReports with a TypeScript and
        Java backend running against PostgreSQL. I worked on the full pipeline:
        the front-end report builder UI where users configured dynamic reports
        with drag-and-drop elements, the server-side rendering layer that
        generated JasperReports XML (JRXML), and the data transformation logic
        that handled multi-currency financial reports with proper subtotaling
        and formatting.
      </p>

      <h2>Notable Work</h2>
      <p>
        One of the more involved bug fixes I shipped involved currency code
        subtotaling — ensuring that reports spanning multiple currencies grouped
        and formatted correctly across both the JRXML generation layer and the
        Jtwig template processing that produced the final output. It required
        tracing a bug across three layers of the pipeline before the root cause
        became clear.
      </p>
      <p>
        I also built and maintained end-to-end and unit test suites that ran in
        a Jenkins CI/CD pipeline on every pull request. Over two and a half
        years I merged 70+ pull requests involving high-impact features across 3
        major software releases. The testing infrastructure I contributed to led
        to a 22% decrease in regressions.
      </p>

      <h2>Team and Process</h2>
      <p>
        I led sprint planning, retrospectives, and release planning, and
        maintained a consistent sprint velocity of 20 points per contributor
        across the team. Scalable feature sets I delivered were used by 1,000+
        production-level customers across both B2B and B2C organizations.
      </p>
    </PortfolioPage>
  )
}
