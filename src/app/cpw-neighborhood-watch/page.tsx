import type { Metadata } from 'next'
import { getPage } from '@/lib/content'
import { markdownToHtml } from '@/lib/markdown'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'City Park West Neighborhood Watch' }

export default async function NeighborhoodWatchPage() {
  const page = await getPage('cpw-neighborhood-watch')
  if (!page) notFound()

  const html = await markdownToHtml(page.content)

  return (
    <div className={styles.container}>
      <div className="page-header">
        <h1>{page.title}</h1>
        <p>City Park West &mdash; community safety &amp; coordination</p>
      </div>

      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

      <div className={styles.calendarCta}>
        <Link href="/cpw-neighborhood-watch/calendar" className={styles.calendarLink}>
          View the event calendar &rarr;
        </Link>
      </div>
    </div>
  )
}
