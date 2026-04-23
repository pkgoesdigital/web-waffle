import type { EventMeta } from '@/lib/types'
import styles from './EventList.module.css'

const TYPE_LABELS: Record<string, string> = {
  meeting: 'Meeting',
  cleanup: 'Cleanup',
  social: 'Social',
  dpd: 'DPD',
  other: 'Other',
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

type Props = {
  events: EventMeta[]
}

export default function EventList({ events }: Props) {
  if (events.length === 0) {
    return <p className={styles.empty}>No upcoming events at this time.</p>
  }

  return (
    <ul className={styles.list} aria-label="Event details">
      {events.map((event) => (
        <li key={event.slug}>
          <article id={`event-${event.slug}`} className={styles.card}>
            <div className={styles.header}>
              <h3 className={`${styles.title} ${event.status === 'cancelled' ? styles.cancelled : ''}`}>
                {event.title}
              </h3>
              <div className={styles.badges}>
                <span className={styles.typeBadge}>{TYPE_LABELS[event.type] ?? event.type}</span>
                {event.status === 'cancelled' && (
                  <span className={styles.cancelledBadge}>Cancelled</span>
                )}
                {event.status === 'tentative' && (
                  <span className={styles.tentativeBadge}>Tentative</span>
                )}
              </div>
            </div>
            <dl className={styles.meta}>
              <div className={styles.metaRow}>
                <dt>Date</dt>
                <dd>{formatDate(event.date)}</dd>
              </div>
              {event.time && (
                <div className={styles.metaRow}>
                  <dt>Time</dt>
                  <dd>{event.time}</dd>
                </div>
              )}
              {event.location && (
                <div className={styles.metaRow}>
                  <dt>Location</dt>
                  <dd>{event.location}</dd>
                </div>
              )}
            </dl>
            {event.description && (
              <p className={styles.description}>{event.description}</p>
            )}
            {event.source && (
              <p className={styles.source}>Source: {event.source}</p>
            )}
          </article>
        </li>
      ))}
    </ul>
  )
}
