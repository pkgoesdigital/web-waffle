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
          I help teams adopt AI <i>without</i> having the &ldquo;we&rsquo;ve lost the plot&rdquo; moment. I&rsquo;m a product
          manager and engineer in practice — so the work you&rsquo;ll receive will always be grounded in how products
          actually get built, what teams actually do, and what your users will
          actually use.
        </p>
        <p className={styles.brandNote}>
          Consulting work is run through my practice,&nbsp; 
            <Link
              href="https://www.rabbitbrush.io"
              className={styles.decisionLink}
              target="_blank"
            >
              Rabbitbrush Studio
            </Link>.
        </p>
      </div>

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

      <section className={styles.decisionHelper} aria-label="Which service is right for you">
        <h2 className={styles.decisionTitle}>Not sure where to start?</h2>
        <div className={styles.decisionGrid}>
          <div className={styles.decisionCard}>
            <p className={styles.decisionLabel}>Feeling Overwhelmed</p>
            <p className={styles.decisionText}>
              You know AI matters and you want to get ahead of it in your organization, but don&rsquo;t know where to start. Or
              you&rsquo;ve been talking about it for months, but haven&rsquo;t had the time to act on your ideas.
            </p>
            <Link
              href="/services/ai-starter-pack"
              className={styles.decisionLink}
            >
              AI Starter Pack &rarr;
            </Link>
          </div>
          <div className={styles.decisionCard}>
            <p className={styles.decisionLabel}>We have a plan, but need help building it</p>
            <p className={styles.decisionText}>
              You know what you want to build, but you don&rsquo;t have a strategy for building it. Or maybe you don&rsquo;t have the
              in-house technical engineering skills, product skills, or resources to implement it yourself.
            </p>
            <Link
              href="/services/ai-build-partner"
              className={styles.decisionLink}
            >
              AI Build Partner &rarr;
            </Link>
          </div>
          <div className={styles.decisionCard}>
            <p className={styles.decisionLabel}>We&rsquo;ve already deployed AI in our organization</p>
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

      <section className={styles.outroCta} aria-label="Other engagements">
        <h2 className={styles.outroTitle}>Have something else in mind?</h2>
        <p className={styles.outroText}>
          Have an idea for a workshop? Speaking engagement? Need fractional product help, or something else
          not listed here? Let&rsquo;s chat!
        </p>
        <Link href="mailto:paula@rabbitbrush.io?subject=Services%20Inquiry" className={styles.outroButton}>
          Get in touch
        </Link>
      </section>
    </div>
  )
}
