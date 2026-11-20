'use client'

import styles from './QuarterWithClaude.module.css'
import type { Totals } from './types'

type Props = { totals: Totals }

export default function TallyGrid({ totals }: Props) {
  const items: Array<{ label: string; value: number; highlight?: boolean }> = [
    { label: 'Sessions', value: totals.sessions },
    { label: 'Tool calls', value: totals.tool_count },
    { label: 'Calendar events created', value: totals.cal_created },
    { label: 'Emails reviewed', value: totals.emails_reviewed },
    { label: 'Walk breaks scheduled', value: totals.walk_breaks },
    { label: 'Files written', value: totals.files_written },
    { label: 'Email drafts', value: totals.drafts },
    { label: 'Moments with me', value: totals.interactive, highlight: true },
  ]

  return (
    <div className={styles.tallyGrid}>
      {items.map((it) => (
        <div key={it.label} className={styles.tallyItem}>
          <div
            className={styles.tallyNum}
            style={it.highlight ? { color: 'var(--viz-interactive)' } : undefined}
          >
            {it.value.toLocaleString()}
          </div>
          <div className={styles.tallyLabel}>{it.label}</div>
        </div>
      ))}
    </div>
  )
}
