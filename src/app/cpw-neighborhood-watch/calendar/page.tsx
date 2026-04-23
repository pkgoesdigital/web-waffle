import type { Metadata } from 'next'
import { getUpcomingEvents } from '@/lib/events'
import EventCalendarGrid from '@/components/EventCalendarGrid/EventCalendarGrid'
import EventList from '@/components/EventList/EventList'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'CPW Neighborhood Watch — Calendar' }

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function CalendarPage() {
  const events = getUpcomingEvents()

  // Show the following month by default
  const now = new Date()
  const displayMonth = (now.getMonth() + 1) % 12
  const displayYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear()

  const monthEvents = events.filter((e) => {
    const [eYear, eMonth] = e.date.split('-').map(Number)
    return eYear === displayYear && eMonth - 1 === displayMonth
  })

  return (
    <div className={styles.container}>
      <div className="page-header">
        <h1>{MONTH_NAMES[displayMonth]} {displayYear}</h1>
        <p>
          CPW Neighborhood Watch &mdash; upcoming events and meetings.{' '}
          <a href="/cpw-neighborhood-watch">About this group &rarr;</a>
        </p>
      </div>

      <EventCalendarGrid events={monthEvents} year={displayYear} month={displayMonth} />

      <section className={styles.listSection}>
        <h2 className={styles.listHeading}>Event Details</h2>
        <EventList events={monthEvents} />
      </section>
    </div>
  )
}
