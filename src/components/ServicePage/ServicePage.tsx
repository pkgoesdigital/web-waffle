import Link from 'next/link'
import { getServiceBySlug, getVisibleServices } from '@/data/services'
import styles from './ServicePage.module.css'

type Props = {
  /** Slug of the service this page represents — must match a record in services.ts */
  slug: string
  /** Long-form pitch / methodology / case-study content rendered between the header and the structured panels */
  children: React.ReactNode
}

/**
 * Reusable wrapper for service detail pages. Mirrors the role PortfolioPage
 * plays for portfolio entries: handles back nav, prev/next pagination,
 * and renders structured panels (includes, CTA, FAQ) from services.ts so
 * each detail page only needs to author its narrative prose.
 */
export default function ServicePage({ slug, children }: Props) {
  const service = getServiceBySlug(slug)
  if (!service) return null

  const visible = getVisibleServices()
  const idx = visible.findIndex((s) => s.slug === slug)
  const prev = idx > 0 ? visible[idx - 1] : null
  const next = idx >= 0 && idx < visible.length - 1 ? visible[idx + 1] : null

  return (
    <div className={styles.container}>
      <Link href="/services" className={styles.back}>
        &larr; Services
      </Link>

      <header className={styles.header}>
        <p className={styles.eyebrow}>
          {service.stage === 'pre-adoption' && 'Pre-adoption'}
          {service.stage === 'in-flight' && 'In-flight'}
          {service.stage === 'post-adoption' && 'Post-adoption'}
        </p>
        <h1 className={styles.title}>{service.title}</h1>
        <p className={styles.tagline}>{service.tagline}</p>
        <p className={styles.forWho}>
          <span className={styles.forWhoLabel}>For:</span> {service.forWho}
        </p>
      </header>

      <div className={styles.content}>{children}</div>

      <section className={styles.outcomes} aria-label="What you walk away with">
        <h2 className={styles.sectionTitle}>What you walk away with</h2>
        <ul className={styles.bulletList}>
          {service.outcomes.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </section>

      <section className={styles.includes} aria-label="What's included">
        <h2 className={styles.sectionTitle}>What&rsquo;s included</h2>
        <ul className={styles.bulletList}>
          {service.includes.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        {(service.format || service.pricing) && (
          <dl className={styles.meta}>
            {service.format && (
              <div className={styles.metaRow}>
                <dt>Format</dt>
                <dd>{service.format}</dd>
              </div>
            )}
            {service.pricing && (
              <div className={styles.metaRow}>
                <dt>Pricing</dt>
                <dd>{service.pricing}</dd>
              </div>
            )}
          </dl>
        )}
      </section>

      {service.faq && service.faq.length > 0 && (
        <section className={styles.faq} aria-label="Frequently asked questions">
          <h2 className={styles.sectionTitle}>Common questions</h2>
          <dl className={styles.faqList}>
            {service.faq.map((qa) => (
              <div key={qa.question} className={styles.faqItem}>
                <dt className={styles.faqQ}>{qa.question}</dt>
                <dd className={styles.faqA}>{qa.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className={styles.cta} aria-label="Get in touch">
        <h2 className={styles.ctaTitle}>Ready to talk?</h2>
        <p className={styles.ctaText}>
          The fastest way to start is a 30-minute call to see if there&rsquo;s a fit.
          No pitch deck, no pressure, just a conversation.
        </p>
        <a href={service.primaryCTA.href} className={styles.ctaButton}>
          {service.primaryCTA.label}
        </a>
      </section>

      {(prev || next) && (
        <nav className={styles.pagination} aria-label="Service navigation">
          <div className={styles.paginationPrev}>
            {prev && (
              <Link
                href={`/services/${prev.slug}`}
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
                href={`/services/${next.slug}`}
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
