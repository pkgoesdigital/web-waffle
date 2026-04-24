import type { Metadata } from 'next'
import Link from 'next/link'
import { getEventsForMonth } from '@/lib/events'
import EventCalendarGrid from '@/components/EventCalendarGrid/EventCalendarGrid'
import EventList from '@/components/EventList/EventList'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'CPW Neighborhood Watch — Calendar' }

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function addMonths(year: number, month: number, delta: number) {
  const d = new Date(year, month + delta, 1)
  return { year: d.getFullYear(), month: d.getMonth() }
}

function monthKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}`
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>
}) {
  const { month: monthParam } = await searchParams

  const now = new Date()

  let displayYear = now.getFullYear()
  let displayMonth = now.getMonth()
  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    const [y, m] = monthParam.split('-').map(Number)
    displayYear = y
    displayMonth = m - 1
  }

  // Navigation bounded by the month containing (today ± 30 days)
  const minus30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const plus30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const minBound = { year: minus30.getFullYear(), month: minus30.getMonth() }
  const maxBound = { year: plus30.getFullYear(), month: plus30.getMonth() }

  const prev = addMonths(displayYear, displayMonth, -1)
  const next = addMonths(displayYear, displayMonth, 1)

  const canGoPrev =
    prev.year > minBound.year ||
    (prev.year === minBound.year && prev.month >= minBound.month)
  const canGoNext =
    next.year < maxBound.year ||
    (next.year === maxBound.year && next.month <= maxBound.month)

  const events = getEventsForMonth(displayYear, displayMonth)

  return (
    <div className={styles.container}>
      <div className="page-header">
        <div className={styles.monthNav}>
          {canGoPrev ? (
            <Link
              href={`/cpw-neighborhood-watch/calendar?month=${monthKey(prev.year, prev.month)}`}
              className={styles.navBtn}
            >
              &larr; Previous
            </Link>
          ) : (
            <span className={styles.navBtnDisabled}>&larr; Previous</span>
          )}
          <h1 className={styles.monthTitle}>
            {MONTH_NAMES[displayMonth]} {displayYear}
          </h1>
          {canGoNext ? (
            <Link
              href={`/cpw-neighborhood-watch/calendar?month=${monthKey(next.year, next.month)}`}
              className={styles.navBtn}
            >
              Next &rarr;
            </Link>
          ) : (
            <span className={styles.navBtnDisabled}>Next &rarr;</span>
          )}
        </div>
        <p>
          CPW Neighborhood Watch &mdash; upcoming events and meetings.{' '}
          <a href="/cpw-neighborhood-watch">About this group &rarr;</a>
        </p>
      </div>

      <EventCalendarGrid events={events} year={displayYear} month={displayMonth} />

      <section className={styles.listSection}>
        <h2 className={styles.listHeading}>Event Details</h2>
        <EventList events={events} />
      </section>
    </div>
  )
}
