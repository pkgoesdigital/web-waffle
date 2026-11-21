'use client'

/**
 * CalendarHeatmap — 3-month grid, one square per day.
 *
 * Intensity encoding: a single CSS-variable color (`--viz-briefing`) with
 * variable `fill-opacity` driven by tool_count. Using `fill-opacity` instead
 * of d3.interpolateRgb avoids the "CSS variables don't parse as colors"
 * failure mode — the browser resolves the CSS var at paint time, and the
 * opacity scales continuously. Dark mode works automatically because the
 * underlying color token flips.
 *
 * Layout: three months side-by-side on wide screens; stacked vertically on
 * narrow screens (< 560px). Days with interactive sessions get a small plum
 * dot in the bottom-right corner.
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

const NARROW_BREAKPOINT = 560

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

      // Decide layout: 3-across on wide screens, 1-across on narrow.
      const narrow = width < NARROW_BREAKPOINT
      const monthsPerRow = narrow ? 1 : 3
      const rowCount = Math.ceil(months.length / monthsPerRow)

      const monthGap = narrow ? 24 : 36
      const horizontalGaps = monthsPerRow - 1
      const availPerMonth = (width - monthGap * horizontalGaps) / monthsPerRow

      // Cell size fits available width; no hard minimum that could overflow.
      // Target: cellSize ~ availPerMonth / 7, bounded for legibility.
      const rawCellSize = Math.floor(availPerMonth / 7) - 4
      const cellSize = Math.max(14, Math.min(44, rawCellSize))
      const cellGap = Math.max(2, Math.round(cellSize * 0.1))

      const monthHeaderH = 44
      const weeksPerMonth = 6
      const monthHeight =
        monthHeaderH + weeksPerMonth * (cellSize + cellGap) + 12
      const monthWidth = cellSize * 7 + cellGap * 6

      // Overall SVG height = rows of months stacked
      const verticalGap = narrow ? 16 : 0
      const totalHeight =
        monthHeight * rowCount + verticalGap * Math.max(0, rowCount - 1)

      const totalRowWidth =
        monthWidth * monthsPerRow + monthGap * horizontalGaps
      const leftPad = Math.max(0, (width - totalRowWidth) / 2)

      const svg = d3.select(svgEl)
      svg
        .attr('width', width)
        .attr('height', totalHeight)
        .attr('viewBox', `0 0 ${width} ${totalHeight}`)
      svg.selectAll('*').remove()

      // Opacity scale: encodes intensity without needing JS-resolved colors.
      const maxTool = d3.max(days, (d) => d.tool_count) ?? 1
      const opacityScale = d3
        .scaleLinear()
        .domain([1, Math.max(1, maxTool)])
        .range([0.18, 1])
        .clamp(true)

      months.forEach((m, mi) => {
        const monthDays = days.filter((d) => d.month === m)
        if (monthDays.length === 0) return

        const rowIdx = Math.floor(mi / monthsPerRow)
        const colIdx = mi % monthsPerRow
        const monthX = leftPad + colIdx * (monthWidth + monthGap)
        const monthY = rowIdx * (monthHeight + verticalGap)

        // Month label
        svg
          .append('text')
          .attr('x', monthX)
          .attr('y', monthY + 14)
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
            .attr('y', monthY + monthHeaderH - 10)
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
          const firstDayOfMonth = new Date(
            dt.getFullYear(),
            dt.getMonth(),
            1
          ).getDay()
          const weekIdx = Math.floor(
            (d.day_of_month - 1 + firstDayOfMonth) / 7
          )

          const cx = monthX + weekday * (cellSize + cellGap)
          const cy = monthY + monthHeaderH + weekIdx * (cellSize + cellGap)

          const isEmpty = d.sessions === 0

          svg
            .append('rect')
            .attr('x', cx)
            .attr('y', cy)
            .attr('width', cellSize)
            .attr('height', cellSize)
            .attr('rx', 3)
            .attr('fill', isEmpty ? 'var(--viz-empty)' : 'var(--viz-briefing)')
            .attr('fill-opacity', isEmpty ? 1 : opacityScale(d.tool_count))
            .attr('stroke', 'var(--color-bg)')
            .attr('stroke-width', 1.5)

          // Only show day number when cell is big enough to read it
          if (cellSize >= 18) {
            svg
              .append('text')
              .attr('x', cx + 5)
              .attr('y', cy + 11)
              .attr('fill', 'currentColor')
              .attr('opacity', isEmpty ? 0.3 : 0.75)
              .style('font-family', 'var(--font-mono)')
              .style('font-size', '9px')
              .text(d.day_of_month)
          }

          if (d.interactive > 0) {
            svg
              .append('circle')
              .attr('cx', cx + cellSize - Math.max(5, cellSize * 0.25))
              .attr('cy', cy + cellSize - Math.max(5, cellSize * 0.25))
              .attr('r', Math.max(2.5, cellSize * 0.1))
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
    <figure
      ref={containerRef}
      className={styles.vizFrame}
      role="img"
      aria-label="3-month daily activity heatmap"
    >
      <svg ref={svgRef} className={styles.svg} aria-hidden="true" />
    </figure>
  )
}
