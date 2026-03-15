import Link from 'next/link'
import { portfolioSections } from '@/data/portfolio-sections'
import styles from './PortfolioPage.module.css'

type Parent = { slug: string; title: string }

type Props = {
  slug: string
  parent?: Parent
  children: React.ReactNode
}

export default function PortfolioPage({ slug, parent, children }: Props) {
  // Top-level section lookup
  const idx = portfolioSections.findIndex((s) => s.slug === slug)
  const topSection = portfolioSections[idx]

  // Child section lookup — search parent's children array
  const parentSection = parent
    ? portfolioSections.find((s) => s.slug === parent.slug)
    : null
  const childSection = parentSection?.children?.find((c) => c.slug === slug)

  const section = topSection ?? childSection
  if (!section) return null

  const prev = !parent && idx > 0 ? portfolioSections[idx - 1] : null
  const next =
    !parent && idx < portfolioSections.length - 1
      ? portfolioSections[idx + 1]
      : null

  const backHref = parent ? `/portfolio/${parent.slug}` : '/portfolio'
  const backLabel = parent ? `\u2190 ${parent.title}` : '\u2190 Portfolio'

  return (
    <div className={styles.container}>
      <Link href={backHref} className={styles.back}>
        {backLabel}
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{section.title}</h1>
        {'period' in section && section.period && (
          <p className={styles.period}>{section.period}</p>
        )}
      </header>

      <div className={styles.content}>{children}</div>

      {!parent && (
        <nav className={styles.pagination}>
          <div className={styles.paginationPrev}>
            {prev && (
              <Link
                href={`/portfolio/${prev.slug}`}
                className={styles.paginationLink}
              >
                <span className={styles.paginationLabel}>Previous</span>
                <span className={styles.paginationTitle}>
                  &larr; {prev.title}
                </span>
              </Link>
            )}
          </div>
          <div className={styles.paginationNext}>
            {next && (
              <Link
                href={`/portfolio/${next.slug}`}
                className={styles.paginationLink}
              >
                <span className={styles.paginationLabel}>Next</span>
                <span className={styles.paginationTitle}>
                  {next.title} &rarr;
                </span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  )
}
