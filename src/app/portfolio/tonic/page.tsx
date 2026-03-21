import type { Metadata } from 'next'
import Link from 'next/link'
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
        During this period I independently built and delivered <b>three</b> websites with
        embedded React applications, REST API integrations, information
        architecture, and content management. I developed <b>two</b> mobile apps for
        non-profit organizations in React Native, picking up the framework
        through on-the-job learning and the help of a senior mobile engineer. Both apps shipped to their respective user
        bases and remain in use.
      </p>
      <p>
        I prototyped, developed, and integrated front-end marketing code
        solutions for gathering business data used by over 10,000 insurance
        professionals. For a private equity firm (Warburg Pincus), my team and I produced&nbsp;
         <b>ten</b> dashboard visualizations for financial data management across the entire private equity portfolio, <b>resulting in a
        more intuitive, faster data analysis tool for a firm of 300+ deal
        professionals.</b> The Warburg Pincus work involved complex tabbed interfaces
        for investment valuations, multi-page reporting, and sophisticated
        financial data presentation.
      </p>

      <h2>Selected Clients</h2>


      <h3>Warburg Pincus</h3>
      <p>
        <Link href="/portfolio/tonic/warburg-pincus">View project page →</Link></p>
      <p>
        Produced ten dashboard visualizations for a 300+ person private equity
        firm, working within their existing Microsoft Azure environment. Built
        React modals with state management, real-time update notifications, and
        integrations with iLevel and other third-party portfolio management
        systems.{' '}
      </p>

      <h3>
        <a
          href="https://www.ntierfs.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          N-Tier Financial Services
        </a>
      </h3>
      <p>
        <Link href="/portfolio/tonic/n-tier">View project page →</Link></p>
      <p>
        Built a new website with megamenu navigation architecture for
        complex content hierarchies in regulatory reporting and risk management.<br />
      </p>

      <h3>
        <a
          href="https://usclimatealliance.org/policy-priorities/"
          target="_blank"
          rel="noopener noreferrer"
        >
          US Climate Alliance
        </a>
      </h3>
      <p>
        <Link href="/portfolio/tonic/us-climate-alliance">View project page →</Link>
      </p>
      <p>
        Built and delivered a WordPress site with Elementor, creating a scalable
        content management system with templates for member pages, press releases,
        reports, guides, and media advisories. Embedded React Applications were added to each State page,
        which pulled data out of a REST Api specific to that state&rsquo;s policy initiatives. Recorded a full library of Loom
        tutorial videos empowering the client&rsquo;s team to maintain the site
        independently.{' '}
      </p>

      <h3>
        <a
          href="https://solutions.risk.lexisnexis.com/tpu-assessment"
          target="_blank"
          rel="noopener noreferrer"
        >
          LexisNexis
        </a>
      </h3>
      <p>
        <Link href="/portfolio/tonic/lexisnexis">View project page →</Link></p>
      <p>
        Built an interactive risk assessment training tool for underwriting
        professionals, designed responsively for iPad and web. Improved
        accessibility and streamlined user flow across projects by leveraging
        UI/UX best practices, resulting in a 15% increase in user engagement and higher customer activation.{' '}
        <br />
        <a
          href="https://github.com/pkgoesdigital/LexisNexisTPUAssessment"
          target="_blank"
          rel="noopener noreferrer"
        >
          View the repo.
        </a>{' '}
      </p>

      <h3>
        <a
          href="https://www.kulaempowered.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Kula Empowered
        </a>
      </h3>
      <p>
        <Link href="/portfolio/tonic/kula">View project page →</Link></p>
      <p>
        Built the beta React Native mobile app for a child safety non-profit,
        covering all screens, routing, push notifications via OneSignal, and
        submission to both the Google Play Store and Apple App Store.{' '}
      </p>

      <h3>
        <a
          href="https://www.torustransforms.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Torus Transforms
        </a>
      </h3>
      <p>
        <Link href="/portfolio/tonic/torus">View project page →</Link></p>
      <p>
        Built a multilingual React Native mobile app providing COVID-19
        information in Dari, Russian, and Thai. Handled localization, push
        notifications, and app store submissions. Pivoted to a mobile web launch
        after platform publishing restrictions. The app was launched after I was off the project,
        and it&rsquo;s now in its second development iteration - adding more educational content.{' '}
      </p>

      <h3>DoubleCheck</h3>
      <p>
        <Link href="/portfolio/tonic/doublecheck">View project page →</Link>
      </p>
      <p>
        Built Angular-compatible front-end templates for tabular credit card
        transaction data using Bootstrap, HTML, and CSS — unblocking the
        client&rsquo;s internal team before a hard deadline.{' '}
      </p>
    </PortfolioPage>
  )
}
