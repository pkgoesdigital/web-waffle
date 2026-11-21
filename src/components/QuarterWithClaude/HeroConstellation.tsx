'use client'

/**
 * HeroConstellation — one dot per session across the quarter, arranged by
 * date along the x-axis and stacked within each day. Interactive sessions
 * are larger and ringed. Dots drift in from random positions on first mount.
 *
 * Respects prefers-reduced-motion by skipping the drift animation.
 */

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
// Side-effect import: registers .transition() on the Selection prototype.
// Required because Next.js 16's Turbopack tree-shaking otherwise drops
// d3-transition in production bundles, causing `.transition is not a function`.
import 'd3-transition'
import styles from './QuarterWithClaude.module.css'
import { TASK_COLOR_VAR, type Session } from './types'

type Props = { sessions: Session[] }

export default function HeroConstellation({ sessions }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const svgEl = svgRef.current
    if (!container || !svgEl) return

    const render = () => {
      const width = container.clientWidth
      const narrow = width < 560
      const height = Math.max(200, Math.min(320, width * (narrow ? 0.5 : 0.3)))
      const padX = narrow ? 12 : 24
      // Scale dot sizes down a touch on narrow screens so stacks don't crowd
      const baseR = narrow ? 2.5 : 3.5
      const interactiveR = narrow ? 5 : 6
      const rowSpacing = narrow ? 10 : 12
      const svg = d3.select(svgEl)
      svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`)
      svg.selectAll('*').remove()

      if (sessions.length === 0) return

      // Dates with activity
      const dates = Array.from(new Set(sessions.map((s) => s.date))).sort()
      const x = d3.scalePoint<string>().domain(dates).range([padX, width - padX])

      // Stack sessions within each day
      const byDate = d3.group(sessions, (s) => s.date)
      const dots: Array<{ s: Session; x: number; y: number }> = []
      byDate.forEach((arr, date) => {
        const cx = x(date) ?? 0
        arr.forEach((s, i) => {
          dots.push({
            s,
            x: cx,
            y: height / 2 + (i - (arr.length - 1) / 2) * rowSpacing,
          })
        })
      })

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const nodes = svg
        .selectAll<SVGCircleElement, (typeof dots)[number]>('circle')
        .data(dots)
        .join('circle')
        .attr('cx', (d) => (reduced ? d.x : Math.random() * width))
        .attr('cy', (d) => (reduced ? d.y : Math.random() * height))
        .attr('r', (d) => (d.s.type === 'interactive' ? interactiveR : baseR))
        .attr('fill', (d) => TASK_COLOR_VAR[d.s.task] ?? 'var(--viz-adhoc)')
        .attr('fill-opacity', (d) => (d.s.type === 'interactive' ? 1 : 0.78))
        .attr('stroke', (d) =>
          d.s.type === 'interactive' ? 'var(--viz-interactive)' : 'none'
        )
        .attr('stroke-opacity', 0.25)
        .attr('stroke-width', (d) => (d.s.type === 'interactive' ? 4 : 0))

      if (!reduced) {
        nodes
          .transition()
          .duration(1200)
          .delay((_, i) => i * 8)
          .ease(d3.easeCubicOut)
          .attr('cx', (d) => d.x)
          .attr('cy', (d) => d.y)
      }
    }

    render()
    const obs = new ResizeObserver(render)
    obs.observe(container)
    return () => obs.disconnect()
  }, [sessions])

  return (
    <figure
      ref={containerRef}
      className={styles.constellation}
      role="img"
      aria-label={`Constellation of ${sessions.length} sessions`}
    >
      <svg ref={svgRef} aria-hidden="true" />
    </figure>
  )
}
