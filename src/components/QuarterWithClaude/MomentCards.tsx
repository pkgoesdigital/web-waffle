'use client'

import styles from './QuarterWithClaude.module.css'
import { TASK_LABEL, type InteractiveSession } from './types'

type Props = { sessions: InteractiveSession[] }

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export default function MomentCards({ sessions }: Props) {
  const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className={styles.moments}>
      {sorted.map((s, i) => (
        <article key={`${s.session_id}-${i}`} className={styles.moment}>
          <div className={styles.momentWhen}>{formatDate(s.date)}</div>
          <h3 className={styles.momentTitle}>{s.name || 'Interactive session'}</h3>
          {s.notes && <p className={styles.momentNotes}>{s.notes}</p>}
          <div className={styles.momentMeta}>
            <span>{s.tool_count} tool calls</span>
            <span>Task: {TASK_LABEL[s.task] ?? s.task}</span>
            {s.files_written?.length > 0 && (
              <span>
                {s.files_written.length} file{s.files_written.length === 1 ? '' : 's'} written
              </span>
            )}
            {s.scheduled_tasks_updated?.length > 0 && (
              <span>1 scheduled task updated</span>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
