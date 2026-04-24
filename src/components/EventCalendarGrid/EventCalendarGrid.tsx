import type { EventMeta } from '@/lib/types'
import styles from './EventCalendarGrid.module.css'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

type Props = {
  events: EventMeta[]
  year: number
  month: number // 0-indexed (0 = January)
}

export default function EventCalendarGrid({ events, year, month }: Props) {
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Map day-of-month to events on that day
  const eventsByDay = new Map<number, EventMeta[]>()
  for (const event of events) {
    const [eYear, eMonth, eDay] = event.date.split('-').map(Number)
    if (eYear === year && eMonth - 1 === month) {
      const existing = eventsByDay.get(eDay) ?? []
      eventsByDay.set(eDay, [...existing, event])
    }
  }

  // Build flat cell array: leading empty cells + day cells
  const cells: Array<{ day: number | null }> = [
    ...Array.from({ length: firstDayOfWeek }, () => ({ day: null })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1 })),
  ]

  return (
    <section className={styles.section} aria-label={`${MONTH_NAMES[month]} ${year} calendar`}>
      <div className={styles.grid}>
        {WEEKDAYS.map((wd) => (
          <div key={wd} className={styles.weekday} aria-hidden="true">
            {wd}
          </div>
        ))}
        {cells.map((cell, idx) => {
          if (cell.day === null) {
            return <div key={`empty-${idx}`} className={styles.emptyCell} aria-hidden="true" />
          }
          const dayEvents = eventsByDay.get(cell.day) ?? []
          return (
            <div
              key={cell.day}
              className={`${styles.dayCell} ${dayEvents.length > 0 ? styles.hasEvents : ''}`}
            >
              <span className={styles.dayNumber}>{cell.day}</span>
              {dayEvents.map((event) => (
                <a
                  key={event.slug}
                  href={`#event-${event.slug}`}
                  className={`${styles.eventDot} ${event.status === 'cancelled' ? styles.cancelled : ''}`}
                  title={event.title}
                  aria-label={`${event.title} — jump to details`}
                  data-status={event.status}
                >
                  <span className={styles.dotIndicator} aria-hidden="true" />
                  <span className={styles.eventLabel}>{event.title}</span>
                </a>
              ))}
            </div>
          )
        })}
      </div>
    </section>
  )
}
