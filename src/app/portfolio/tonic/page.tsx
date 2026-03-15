import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'Tonic Inc. Digital Consulting — Portfolio' }

export default function TonicPage() {
  return (
    <PortfolioPage slug="tonic">
      <p>
        At Tonic, I was a full stack engineer at a digital consulting firm,
        building web and mobile applications for a variety of clients who needed
        a strong technology partner. The consulting model meant rapidly adapting
        to new tech stacks, client domains, and team structures — often leading
        the development effort on green-field projects from day one.
      </p>

      <h2>Scope of Work</h2>
      <p>
        During this period I independently built and delivered 3 websites with
        embedded React applications, REST API integrations, information
        architecture, and content management. I developed two mobile apps for
        non-profit organizations in React Native, picking up the framework
        through on-the-job learning. Both apps shipped to their respective user
        bases and remain in use.
      </p>
      <p>
        I prototyped, developed, and integrated front-end marketing code
        solutions for gathering business data used by over 10,000 insurance
        professionals. For a private equity firm (Warburg Pincus), I produced
        ten dashboard visualizations for financial data management, creating a
        more intuitive, faster data analysis tool for a firm of 300+ deal
        professionals. The Warburg Pincus work involved complex tabbed interfaces
        for investment valuations, multi-page reporting, and sophisticated
        financial data presentation.
      </p>

      <h2>Selected Clients</h2>

      <h3>N-Tier Financial Services</h3>
      <p>
        Built a corporate platform with megamenu navigation architecture for
        complex feature hierarchies in regulatory reporting and risk management.
      </p>

      <h3>US Climate Alliance</h3>
      <p>
        Built and delivered a WordPress site with Elementor, creating a scalable
        content management system with templates for member pages, press releases,
        reports, guides, and media advisories. Recorded a full library of Loom
        tutorial videos empowering the client&rsquo;s team to maintain the site
        independently.
      </p>

      <h3>LexisNexis</h3>
      <p>
        Built an interactive risk assessment training tool for underwriting
        professionals, designed responsively for iPad and web. Improved
        accessibility and streamlined user flow across projects by leveraging
        UI/UX best practices, resulting in a 15% increase in user engagement on
        the engagement.
      </p>
    </PortfolioPage>
  )
}
