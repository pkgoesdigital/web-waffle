'use client'

/**
 * CalendarHeatmap — 3-month grid, one square per day. Fill intensity encodes
 * tool-call volume; empty days get the neutral viz-empty background. Days
 * with interactive sessions get a small plum ring.
 *
 * Rendered as three horizontal month strips (April → May → June) so the
 * monthly arc is readable at a glance.
 */

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import styles from './QuarterWithClaude.module.css'
import type { Day } from './types'

type Props = { days: Day[] }

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_NAMES: Record<number, string> = {
  4: 'April',
  5: 'May',
  6: 'June',
}

export default function CalendarHeatmap({ days }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const svgEl = svgRef.current
    if (!container || !svgEl) return

    const render = () => {
      const width = container.clientWidth
      const months = [4, 5, 6]
      const monthGap = 36
      const availPerMonth = (width - monthGap * 2) / 3
      const cellSize = Math.max(16, Math.min(44, Math.floor(availPerMonth / 7) - 4))
      const cellGap = Math.max(3, Math.round(cellSize * 0.1))
      const monthHeaderH = 44
      const monthWidth = cellSize * 7 + cellGap * 6

      // 6 possible weeks per month, pad for the header
      const monthHeight = monthHeaderH + 6 * (cellSize + cellGap) + 12

      const totalWidth = monthWidth * 3 + monthGap * 2
      const leftPad = Math.max(0, (width - totalWidth) / 2)

      const svg = d3.select(svgEl)
      svg
        .attr('width', width)
        .attr('height', monthHeight)
        .attr('viewBox', `0 0 ${width} ${monthHeight}`)
      svg.selectAll('*').remove()

      // Color scale
      const maxTool = d3.max(days, (d) => d.tool_count) ?? 1
      const color = d3
        .scaleLinear<string>()
        .domain([0, Math.max(1, maxTool * 0.35), maxTool])
        .range(['var(--viz-digest)', 'var(--viz-digest)', 'var(--viz-briefing)'])
        .interpolate(d3.interpolateRgb)

      months.forEach((m, mi) => {
        const monthDays = days.filter((d) => d.month === m)
        if (monthDays.length === 0) return

        const monthX = leftPad + mi * (monthWidth + monthGap)

        // Month label
        svg
          .append('text')
          .attr('x', monthX)
          .attr('y', 14)
          .attr('fill', 'currentColor')
          .style('font-family', 'var(--font-sans)')
          .style('font-size', '14px')
          .style('font-weight', '600')
          .text(MONTH_NAMES[m] ?? `Month ${m}`)

        // Weekday row
        DAY_LABELS.forEach((lab, i) => {
          svg
            .append('text')
            .attr('x', monthX + i * (cellSize + cellGap) + cellSize / 2)
            .attr('y', monthHeaderH - 10)
            .attr('text-anchor', 'middle')
            .attr('fill', 'currentColor')
            .attr('opacity', 0.5)
            .style('font-family', 'var(--font-mono)')
            .style('font-size', '10px')
            .style('letter-spacing', '0.1em')
            .text(lab)
        })

        // Cells
        monthDays.forEach((d) => {
          const dt = new Date(d.date + 'T00:00')
          const weekday = dt.getDay()
          const firstDayOfMonth = new Date(dt.getFullYear(), dt.getMonth(), 1).getDay()
          const weekIdx = Math.floor((d.day_of_month - 1 + firstDayOfMonth) / 7)

          const cx = monthX + weekday * (cellSize + cellGap)
          const cy = monthHeaderH + weekIdx * (cellSize + cellGap)

          const fill = d.sessions === 0 ? 'var(--viz-empty)' : color(d.tool_count)

          svg
            .append('rect')
            .attr('x', cx)
            .attr('y', cy)
            .attr('width', cellSize)
            .attr('height', cellSize)
            .attr('rx', 3)
            .attr('fill', fill)
            .attr('stroke', 'var(--color-bg)')
            .attr('stroke-width', 1.5)

          svg
            .append('text')
            .attr('x', cx + 5)
            .attr('y', cy + 11)
            .attr('fill', 'currentColor')
            .attr('opacity', d.sessions === 0 ? 0.3 : 0.55)
            .style('font-family', 'var(--font-mono)')
            .style('font-size', '9px')
            .text(d.day_of_month)

          if (d.interactive > 0) {
            svg
              .append('circle')
              .attr('cx', cx + cellSize - 6)
              .attr('cy', cy + cellSize - 6)
              .attr('r', 3)
              .attr('fill', 'var(--viz-interactive)')
          }
        })
      })
    }

    render()
    const obs = new ResizeObserver(render)
    obs.observe(container)
    return () => obs.disconnect()
  }, [days])

  return (
    <figure ref={containerRef} className={styles.vizFrame} role="img" aria-label="3-month daily activity heatmap">
      <svg ref={svgRef} className={styles.svg} aria-hidden="true" />
    </figure>
  )
}
