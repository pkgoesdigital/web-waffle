import type { Metadata } from 'next'
import Link from 'next/link'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'
import { portfolioSections } from '@/data/portfolio-sections'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'The Waterbury Group — Portfolio' }

export default function WaterburyPage() {
  const section = portfolioSections.find((s) => s.slug === 'waterbury')

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

      {section?.children && section.children.length > 0 && (
        <div className={styles.projects}>
          <h2>Projects</h2>
          <ul className={styles.projectList}>
            {section.children.map((child) => (
              <li key={child.slug}>
                <Link href={`/portfolio/waterbury/${child.slug}`} className={styles.projectLink}>
                  <span className={styles.projectTitle}>{child.title}</span>
                  <span className={styles.projectDescription}>{child.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PortfolioPage>
  )
}
