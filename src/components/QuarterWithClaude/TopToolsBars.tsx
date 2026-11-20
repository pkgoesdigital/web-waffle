'use client'

import styles from './QuarterWithClaude.module.css'
import type { ToolGroup } from './types'

type Props = { tools: ToolGroup[]; limit?: number }

export default function TopToolsBars({ tools, limit = 8 }: Props) {
  const top = tools.slice(0, limit)
  const max = Math.max(...top.map((t) => t.count), 1)

  return (
    <div className={styles.bars}>
      <h3 className={styles.barsHeading}>Where the work went</h3>
      <ol className={styles.barsList}>
        {top.map((t) => (
          <li key={t.tool} className={styles.barRow}>
            <div className={styles.barLabel}>{t.tool}</div>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: `${(t.count / max) * 100}%` }}
              />
            </div>
            <div className={styles.barValue}>{t.count}</div>
          </li>
        ))}
      </ol>
    </div>
  )
}
