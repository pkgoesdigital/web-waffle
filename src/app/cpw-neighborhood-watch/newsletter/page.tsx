import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedNewsletters } from '@/lib/newsletters'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'CPW Neighborhood Watch — Newsletter' }

export default function NewsletterPage() {
  const newsletters = getPublishedNewsletters()

  return (
    <div className={styles.container}>
      <div className="page-header">
        <h1>Newsletter</h1>
        <p>City Park West Neighborhood Watch &mdash; monthly community updates.</p>
      </div>

      {newsletters.length === 0 ? (
        <p className={styles.empty}>No newsletters published yet.</p>
      ) : (
        <ul className={styles.list}>
          {newsletters.map((n) => (
            <li key={n.slug} className={styles.item}>
              <Link href={`/cpw-neighborhood-watch/newsletter/${n.slug}`} className={styles.link}>
                <span className={styles.period}>{n.period}</span>
                <span className={styles.title}>{n.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
