'use client'

/**
 * QuarterWithClaude — orchestrator.
 *
 * Fetches a quarter dataset via `/api/viz?dataset=<slug>`, then renders the
 * six prose beats and their corresponding visualizations. Each viz component
 * owns its own D3 rendering and is a `'use client'` module.
 *
 * To ship a new quarter: write a new prose module (see data/quarter-prose/)
 * and a new page that passes it in. Components stay as-is.
 */

import { useEffect, useState } from 'react'
import styles from './QuarterWithClaude.module.css'
import type { QuarterProse } from '@/data/quarter-prose/q2-2026'
import type { QuarterDataset } from './types'
import { TASK_COLOR_VAR, TASK_LABEL } from './types'
import HeroConstellation from './HeroConstellation'
import RitualRibbon from './RitualRibbon'
import ToolRampChart from './ToolRampChart'
import MomentCards from './MomentCards'
import CalendarHeatmap from './CalendarHeatmap'
import TallyGrid from './TallyGrid'
import TopToolsBars from './TopToolsBars'

type Props = {
  dataset: string
  prose: QuarterProse
  /** Optional per-quarter date ranges for the two ribbon beats. */
  ribbonRanges?: {
    first: [string, string]
    second: [string, string]
  }
}

const DEFAULT_RIBBON_RANGES = {
  first: ['2026-04-09', '2026-04-13'] as [string, string],
  second: ['2026-04-09', '2026-04-21'] as [string, string],
}

function Legend({ streams }: { streams: QuarterDataset['streams'] }) {
  return (
    <div className={styles.legend}>
      {streams.map((s) => (
        <span key={s.task} className={styles.legendItem}>
          <span
            className={styles.legendSwatch}
            style={{ background: TASK_COLOR_VAR[s.task] ?? 'var(--viz-adhoc)' }}
          />
          {TASK_LABEL[s.task] ?? s.task}
        </span>
      ))}
      <span className={styles.legendItem}>
        <span
          className={`${styles.legendSwatch} ${styles.legendInteractive}`}
          style={{ background: 'var(--viz-adhoc)' }}
        />
        You were in the room
      </span>
    </div>
  )
}

export default function QuarterWithClaude({
  dataset,
  prose,
  ribbonRanges = DEFAULT_RIBBON_RANGES,
}: Props) {
  const [data, setData] = useState<QuarterDataset | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/viz?dataset=${encodeURIComponent(dataset)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load data: ${res.status}`)
        return res.json()
      })
      .then((json: QuarterDataset) => setData(json))
      .catch((err: unknown) => {
        console.error('QuarterWithClaude fetch failed:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      })
  }, [dataset])

  if (error) {
    return <p className={styles.error}>Could not load quarter data: {error}</p>
  }

  // Beat-slot mapping — assumes prose.beats has 6 entries in the canonical order:
  //   0: Start small            → RitualRibbon (first range)
  //   1: Layer, don't stack     → RitualRibbon (second range)
  //   2: Self-documenting       → ToolRampChart
  //   3: Human in the loop      → MomentCards
  //   4: Plan for drift         → CalendarHeatmap
  //   5: The bottom line        → TallyGrid + TopToolsBars
  const renderBeatViz = (i: number) => {
    if (!data) return null
    switch (i) {
      case 0:
        return (
          <RitualRibbon
            days={data.days}
            sessions={data.sessions}
            range={ribbonRanges.first}
          />
        )
      case 1:
        return (
          <RitualRibbon
            days={data.days}
            sessions={data.sessions}
            range={ribbonRanges.second}
          />
        )
      case 2:
        return <ToolRampChart days={data.days} />
      case 3:
        return <MomentCards sessions={data.interactive_sessions} />
      case 4:
        return <CalendarHeatmap days={data.days} />
      case 5:
        return (
          <>
            <TallyGrid totals={data.totals} />
            <TopToolsBars tools={data.top_tools} />
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div className={styles.kicker}>{prose.hero.kicker}</div>
        <h1 className={styles.heroTitle}>{prose.hero.title}</h1>
        <p className={styles.heroDeck}>{prose.hero.deck}</p>
        <div className={styles.heroByline}>{prose.hero.byline}</div>
        {data ? (
          <>
            <HeroConstellation sessions={data.sessions} />
            <Legend streams={data.streams} />
          </>
        ) : (
          <p className={styles.loading}>Loading quarter data…</p>
        )}
      </header>

      {prose.beats.map((beat, i) => (
        <section key={i} className={styles.beat} data-beat={i}>
          <div className={styles.beatEyebrow}>{beat.eyebrow}</div>
          <h2 className={styles.beatTitle}>{beat.title}</h2>
          <p className={styles.beatLede}>{beat.lede}</p>
          {renderBeatViz(i)}
          {beat.caption && <div className={styles.caption}>{beat.caption}</div>}
        </section>
      ))}

      <section className={styles.cta}>
        <h2 className={styles.ctaHeading}>{prose.cta.heading}</h2>
        <div className={styles.services}>
          <a className={styles.service} href="/services/ai-starter-pack">
            <div className={styles.serviceMeta}>01 · 3–4 weeks</div>
            <div className={styles.serviceName}>AI Starter Pack</div>
            <p className={styles.serviceHook}>From “we should use AI” to a real plan.</p>
            <span className={styles.serviceCta}>Learn more →</span>
          </a>
          <a className={styles.service} href="/services/ai-build-partner">
            <div className={styles.serviceMeta}>02 · 6–12 weeks</div>
            <div className={styles.serviceName}>AI Build Partner</div>
            <p className={styles.serviceHook}>Plan in hand. I’ll build it with you.</p>
            <span className={styles.serviceCta}>Learn more →</span>
          </a>
          <a className={styles.service} href="/services/ai-overseer">
            <div className={styles.serviceMeta}>03 · Retainer</div>
            <div className={styles.serviceName}>AI Overseer</div>
            <p className={styles.serviceHook}>Deployed already. Keep it from drifting.</p>
            <span className={styles.serviceCta}>Learn more →</span>
          </a>
        </div>
      </section>

      <section className={styles.closing}>
        <p className={styles.closingLine}>{prose.closing}</p>
      </section>
    </div>
  )
}
