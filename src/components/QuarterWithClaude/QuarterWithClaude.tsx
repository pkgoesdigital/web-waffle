'use client'

/**
 * QuarterWithClaude — Phase 1 skeleton.
 *
 * Fetches a quarter dataset via `/api/viz?dataset=<slug>`, renders the prose
 * scaffolding, and leaves a `<VizPlaceholder />` where each real D3 viz will
 * land in Phase 3. The intent is: this file compiles, the page is readable,
 * and dark/light themes already work — before any D3 is written.
 */

import { useEffect, useState } from 'react'
import styles from './QuarterWithClaude.module.css'
import type { QuarterProse } from '@/data/quarter-prose/q2-2026'

type QuarterDataset = {
  quarter: string
  start: string
  end: string
  totals: {
    sessions: number
    automated: number
    interactive: number
    tool_count: number
    active_days: number
    quiet_days: number
    days_in_quarter: number
    [key: string]: number
  }
  by_month: Record<string, Record<string, number>>
  // other fields present but not consumed by this skeleton
}

type Props = {
  dataset: string
  prose: QuarterProse
}

function VizPlaceholder({ label }: { label: string }) {
  return <div className={styles.vizPlaceholder}>Viz placeholder — {label} — lands in Phase 3</div>
}

export default function QuarterWithClaude({ dataset, prose }: Props) {
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

  const beatLabels = [
    'Ritual ribbon · one stream',
    'Ritual ribbon · two streams',
    'Tool-call ramp line chart',
    'Interactive moment cards',
    'Calendar heatmap · 3 months',
    'Tally grid + top-tool bars',
  ]

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div className={styles.kicker}>{prose.hero.kicker}</div>
        <h1 className={styles.heroTitle}>{prose.hero.title}</h1>
        <p className={styles.heroDeck}>{prose.hero.deck}</p>
        <div className={styles.heroByline}>{prose.hero.byline}</div>
        <VizPlaceholder label="Hero constellation" />
        {!data && <p className={styles.loading}>Loading quarter data…</p>}
      </header>

      {prose.beats.map((beat, i) => (
        <section key={i} className={styles.beat} data-beat={i}>
          <div className={styles.beatEyebrow}>{beat.eyebrow}</div>
          <h2 className={styles.beatTitle}>{beat.title}</h2>
          <p className={styles.beatLede}>{beat.lede}</p>
          <VizPlaceholder label={beatLabels[i] ?? `Beat ${i + 1}`} />
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
