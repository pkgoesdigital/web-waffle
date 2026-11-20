'use client'

/**
 * RitualRibbon — stacked session-rectangles per day, colored by task.
 *
 * Used twice: once for the April 9-13 window (one ritual) and once for
 * April 9-21 (two rituals, the moment the second task joined). The date
 * range is configurable via props so Q3/Q4 can retarget without touching
 * the component.
 */

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import styles from './QuarterWithClaude.module.css'
import { TASK_COLOR_VAR, type Session, type Day } from './types'

type Props = {
  days: Day[]
  sessions: Session[]
  /** Inclusive ISO date range to render. */
  range: [string, string]
  /** Priority order for stacking sessions within a single day. */
  taskOrder?: string[]
}

const DEFAULT_TASK_ORDER = [
  'daily-briefing',
  'neighborhood-digest',
  'usage-record',
  'monthly-newsletter',
  'women-tech-events',
  'ad-hoc',
]

export default function RitualRibbon({
  days,
  sessions,
  range,
  taskOrder = DEFAULT_TASK_ORDER,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const svgEl = svgRef.current
    if (!container || !svgEl) return

    const render = () => {
      const [from, to] = range
      const windowDays = days.filter((d) => d.date >= from && d.date <= to)
      if (windowDays.length === 0) return

      const width = container.clientWidth
      const cellH = 20
      const pad = { top: 16, right: 24, bottom: 28, left: 24 }
      const maxStack = Math.max(
        ...windowDays.map(
          (d) => sessions.filter((s) => s.date === d.date).length
        ),
        1
      )
      const height = pad.top + pad.bottom + maxStack * cellH + 8

      const svg = d3.select(svgEl)
      svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`)
      svg.selectAll('*').remove()

      const x = d3
        .scaleBand<string>()
        .domain(windowDays.map((d) => d.date))
        .range([pad.left, width - pad.right])
        .padding(0.18)

      // Stacked session rects per day
      const dayG = svg
        .selectAll<SVGGElement, Day>('g.day')
        .data(windowDays)
        .join('g')
        .attr('class', 'day')
        .attr(
          'transform',
          (d) => `translate(${x(d.date) ?? 0},${height - pad.bottom})`
        )

      dayG.each(function (d) {
        const sel = d3.select(this)
        const todays = sessions
          .filter((s) => s.date === d.date)
          .sort(
            (a, b) => taskOrder.indexOf(a.task) - taskOrder.indexOf(b.task)
          )
        sel
          .selectAll<SVGRectElement, Session>('rect')
          .data(todays)
          .join('rect')
          .attr('x', 0)
          .attr('width', x.bandwidth())
          .attr('y', (_, i) => -(i + 1) * cellH + 4)
          .attr('height', cellH - 4)
          .attr('rx', 2)
          .attr('fill', (s) => TASK_COLOR_VAR[s.task] ?? 'var(--viz-adhoc)')
          .attr('fill-opacity', (s) => (s.type === 'interactive' ? 1 : 0.88))
          .attr('stroke', (s) =>
            s.type === 'interactive' ? 'var(--viz-interactive)' : 'none'
          )
          .attr('stroke-width', (s) => (s.type === 'interactive' ? 2 : 0))
      })

      // Day-of-month labels
      svg
        .append('g')
        .attr('class', 'ribbon-axis')
        .attr('transform', `translate(0,${height - 10})`)
        .selectAll('text')
        .data(windowDays)
        .join('text')
        .attr('x', (d) => (x(d.date) ?? 0) + x.bandwidth() / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', 'currentColor')
        .attr('opacity', 0.55)
        .style('font-family', 'var(--font-mono)')
        .style('font-size', '10px')
        .style('letter-spacing', '0.06em')
        .text((d) => `${d.day_of_month}`)
    }

    render()
    const obs = new ResizeObserver(render)
    obs.observe(container)
    return () => obs.disconnect()
  }, [days, sessions, range, taskOrder])

  return (
    <figure ref={containerRef} className={styles.vizFrame} role="img" aria-label="Ritual ribbon">
      <svg ref={svgRef} className={styles.svg} aria-hidden="true" />
    </figure>
  )
}
