import type { Metadata } from 'next'
import Link from 'next/link'
import { getVisibleServices } from '@/data/services'
import { getShuffledCardColors } from '@/lib/colors'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Consulting services for teams adopting AI — strategy and planning before you start, oversight and audit once you have.',
}

export default function ServicesPage() {
  const services = getVisibleServices()
  const cardColors = getShuffledCardColors(services.length)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Services</h1>
        <p>
          I help teams adopt AI without losing the plot. I&rsquo;m a product
          manager and engineer — so the work is grounded in how products
          actually get built, what teams actually do, and what your users will
          actually use. No hype. No acronyms unless they&rsquo;re earning their
          keep.
        </p>
        <p className={styles.brandNote}>
          Consulting work is run through my practice, Rabbitbrush.
        </p>
      </div>

      <section className={styles.decisionHelper} aria-label="Which service is right for you">
        <h2 className={styles.decisionTitle}>Not sure which one?</h2>
        <div className={styles.decisionGrid}>
          <div className={styles.decisionCard}>
            <p className={styles.decisionLabel}>Haven&rsquo;t started yet</p>
            <p className={styles.decisionText}>
              You know AI matters but don&rsquo;t know where to start — or
              you&rsquo;ve been talking about it for months without anything
              shipping.
            </p>
            <Link
              href="/services/ai-starter-pack"
              className={styles.decisionLink}
            >
              AI Starter Pack &rarr;
            </Link>
          </div>
          <div className={styles.decisionCard}>
            <p className={styles.decisionLabel}>Have a plan, need to build it</p>
            <p className={styles.decisionText}>
              You know what you want to build but don&rsquo;t have the
              in-house technical and product chops to run the implementation
              — or your engineers don&rsquo;t have AI reps yet.
            </p>
            <Link
              href="/services/ai-build-partner"
              className={styles.decisionLink}
            >
              AI Build Partner &rarr;
            </Link>
          </div>
          <div className={styles.decisionCard}>
            <p className={styles.decisionLabel}>Already deployed</p>
            <p className={styles.decisionText}>
              You have AI in the hands of your team. Now you need someone
              watching for drift, auditing how it&rsquo;s used, and stepping in
              when something breaks that nobody on staff can fix.
            </p>
            <Link href="/services/ai-overseer" className={styles.decisionLink}>
              AI Overseer &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.servicesSection} aria-label="Service offerings">
        <h2 className="section-title">Offerings</h2>
        <div className={styles.grid}>
          {services.map((service, i) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className={styles.card}
              style={{ '--card-color': cardColors[i] } as React.CSSProperties}
            >
              <span className={styles.cardNumber}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardTagline}>{service.tagline}</p>
              <p className={styles.cardForWho}>{service.forWho}</p>
              <ul className={styles.cardOutcomes}>
                {service.outcomes.slice(0, 3).map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
              {service.format && (
                <p className={styles.cardFormat}>{service.format}</p>
              )}
              <span className={styles.cardCta}>Learn more &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.outroCta} aria-label="Other engagements">
        <h2 className={styles.outroTitle}>Have something else in mind?</h2>
        <p className={styles.outroText}>
          Workshops, audits, fractional product help, or something I
          haven&rsquo;t thought of — if it&rsquo;s in the neighborhood,
          let&rsquo;s talk.
        </p>
        <Link href="/contact" className={styles.outroButton}>
          Get in touch
        </Link>
      </section>
    </div>
  )
}
