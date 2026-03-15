import Link from 'next/link'
import { portfolioSections } from '@/data/portfolio-sections'
import styles from './PortfolioPage.module.css'

type Props = {
  slug: string
  children: React.ReactNode
}

export default function PortfolioPage({ slug, children }: Props) {
  const idx = portfolioSections.findIndex((s) => s.slug === slug)
  const section = portfolioSections[idx]
  const prev = idx > 0 ? portfolioSections[idx - 1] : null
  const next = idx < portfolioSections.length - 1 ? portfolioSections[idx + 1] : null

  if (!section) return null

  return (
    <div className={styles.container}>
      <Link href="/portfolio" className={styles.back}>
        &larr; Portfolio
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{section.title}</h1>
        {section.period && <p className={styles.period}>{section.period}</p>}
      </header>

      <div className={styles.content}>{children}</div>

      <nav className={styles.pagination}>
        <div className={styles.paginationPrev}>
          {prev && (
            <Link href={`/portfolio/${prev.slug}`} className={styles.paginationLink}>
              <span className={styles.paginationLabel}>Previous</span>
              <span className={styles.paginationTitle}>&larr; {prev.title}</span>
            </Link>
          )}
        </div>
        <div className={styles.paginationNext}>
          {next && (
            <Link href={`/portfolio/${next.slug}`} className={styles.paginationLink}>
              <span className={styles.paginationLabel}>Next</span>
              <span className={styles.paginationTitle}>{next.title} &rarr;</span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  )
}
