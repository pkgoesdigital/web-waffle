import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'Birthday Stats — Portfolio' }

const parent = { slug: 'waterbury', title: 'The Waterbury Group' }

export default function BirthdayStatsPage() {
  return (
    <PortfolioPage slug="birthday-stats" parent={parent}>
      <p>
        This is a project where I built the same application concept — a birthday
        statistics and sports league tracker — using three different frontend
        approaches.
      </p>

      <h2>Three Implementations</h2>

      <h3>Minimal Vite + React</h3>
      <p>
        A lean setup focused on the core logic without framework overhead. Useful
        for understanding what React actually needs versus what build tools add
        on top.
      </p>

      <h3>Full-Stack Next.js</h3>
      <p>
        A complete Next.js app with API routes and Tailwind CSS — closer to a
        production setup, with server-side data handling and a more polished UI.
      </p>

      <h3>Feature-Rich Configurator</h3>
      <p>
        The most complete implementation: internationalization via{' '}
        <code>react-i18next</code>, data fetching with <code>react-query</code>,
        and an Express backend. The configurator was published as an npm package
        and includes Docker containerization, Azure Pipelines CI/CD, and
        Kubernetes/Helm deployment configuration. It also integrates with the
        Threekit 3D visualization platform for product configuration.
      </p>

      <h2>Why Build the Same Thing Three Ways</h2>
      <p>
        Building the same thing three ways reveals what each framework is
        actually good at and where the trade-offs live. The configurator
        implementation was polished enough to publish as an npm package and
        deploy via Kubernetes — making it a reusable asset rather than just a
        learning exercise.
      </p>
    </PortfolioPage>
  )
}
