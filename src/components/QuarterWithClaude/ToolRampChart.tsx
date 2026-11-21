'use client'

/**
 * ToolRampChart — line + area chart of daily tool-call volume across the
 * quarter, with the peak day annotated. Dots that fall on days with
 * interactive sessions get a plum ring.
 */

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import styles from './QuarterWithClaude.module.css'
import type { Day } from './types'

type Props = { days: Day[] }

export default function ToolRampChart({ days }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const svgEl = svgRef.current
    if (!container || !svgEl) return

    const render = () => {
      const width = container.clientWidth
      const narrow = width < 560
      const height = narrow
        ? Math.min(width * 0.6, 280)
        : Math.min(width * 0.42, 360)
      const pad = {
        top: 24,
        right: narrow ? 16 : 28,
        bottom: narrow ? 30 : 36,
        left: narrow ? 36 : 44,
      }

      const svg = d3.select(svgEl)
      svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`)
      svg.selectAll('*').remove()

      if (days.length === 0) return

      const parse = (iso: string) => new Date(iso + 'T00:00')
      const x = d3
        .scaleTime()
        .domain([parse(days[0].date), parse(days[days.length - 1].date)])
        .range([pad.left, width - pad.right])
      const y = d3
        .scaleLinear()
        .domain([0, (d3.max(days, (d) => d.tool_count) ?? 0) * 1.1])
        .range([height - pad.bottom, pad.top])

      // Gridlines
      svg
        .append('g')
        .attr('class', 'grid')
        .selectAll('line')
        .data(y.ticks(5))
        .join('line')
        .attr('x1', pad.left)
        .attr('x2', width - pad.right)
        .attr('y1', (d) => y(d))
        .attr('y2', (d) => y(d))
        .attr('stroke', 'var(--viz-grid)')
        .attr('stroke-dasharray', '2,3')

      // Axes — fewer ticks on narrow screens so labels don't collide
      const xTickCount = narrow ? 3 : 6
      const yTickCount = narrow ? 4 : 5
      const xAxis = d3
        .axisBottom<Date>(x)
        .ticks(xTickCount)
        .tickFormat(d3.timeFormat('%b %-d') as (d: Date) => string)
      const yAxis = d3.axisLeft(y).ticks(yTickCount)

      const axisStyle = (sel: d3.Selection<SVGGElement, unknown, null, undefined>) => {
        sel.select('.domain').attr('stroke', 'var(--viz-grid)')
        sel.selectAll('.tick line').remove()
        sel
          .selectAll('text')
          .attr('fill', 'currentColor')
          .attr('opacity', 0.6)
          .style('font-family', 'var(--font-mono)')
          .style('font-size', '10px')
          .style('letter-spacing', '0.06em')
      }

      svg
        .append('g')
        .attr('transform', `translate(0,${height - pad.bottom})`)
        .call(xAxis)
        .call(axisStyle)
      svg
        .append('g')
        .attr('transform', `translate(${pad.left},0)`)
        .call(yAxis)
        .call(axisStyle)

      // Area + line
      const area = d3
        .area<Day>()
        .x((d) => x(parse(d.date)))
        .y0(height - pad.bottom)
        .y1((d) => y(d.tool_count))
        .curve(d3.curveMonotoneX)
      const line = d3
        .line<Day>()
        .x((d) => x(parse(d.date)))
        .y((d) => y(d.tool_count))
        .curve(d3.curveMonotoneX)

      svg
        .append('path')
        .datum(days)
        .attr('d', area)
        .attr('fill', 'var(--viz-briefing)')
        .attr('fill-opacity', 0.14)
      const linePath = svg
        .append('path')
        .datum(days)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', 'var(--viz-briefing)')
        .attr('stroke-width', 2.2)

      // Dots: interactive days get a plum ring
      svg
        .append('g')
        .selectAll('circle')
        .data(days.filter((d) => d.sessions > 0))
        .join('circle')
        .attr('cx', (d) => x(parse(d.date)))
        .attr('cy', (d) => y(d.tool_count))
        .attr('r', (d) => (d.interactive > 0 ? 5 : 3))
        .attr('fill', (d) => (d.interactive > 0 ? 'var(--viz-interactive)' : 'var(--viz-briefing)'))
        .attr('stroke', (d) =>
          d.interactive > 0 ? 'var(--viz-interactive)' : 'none'
        )
        .attr('stroke-opacity', 0.25)
        .attr('stroke-width', (d) => (d.interactive > 0 ? 4 : 0))

      // Annotate peak
      const peak = days.reduce((a, b) => (a.tool_count > b.tool_count ? a : b))
      const px = x(parse(peak.date))
      const py = y(peak.tool_count)
      const labelLeft = px > width * 0.65
      const labelX = labelLeft ? px - 10 : px + 10
      const labelAnchor = labelLeft ? 'end' : 'start'

      svg
        .append('line')
        .attr('x1', px)
        .attr('y1', py - 10)
        .attr('x2', labelX)
        .attr('y2', py - 44)
        .attr('stroke', 'currentColor')
        .attr('stroke-opacity', 0.45)
        .attr('stroke-dasharray', '2,3')

      svg
        .append('text')
        .attr('x', labelX)
        .attr('y', py - 48)
        .attr('text-anchor', labelAnchor)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.75)
        .style('font-family', 'var(--font-mono)')
        .style('font-size', '10px')
        .style('letter-spacing', '0.08em')
        .text('PEAK DAY')
      svg
        .append('text')
        .attr('x', labelX)
        .attr('y', py - 34)
        .attr('text-anchor', labelAnchor)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.85)
        .style('font-family', 'var(--font-sans)')
        .style('font-style', 'italic')
        .style('font-size', '12px')
        .text(`${d3.timeFormat('%b %-d')(parse(peak.date))}: ${peak.tool_count} tool calls`)

      // Entrance animation on path
      const total = linePath.node()?.getTotalLength() ?? 0
      linePath
        .attr('stroke-dasharray', `${total} ${total}`)
        .attr('stroke-dashoffset', total)
        .transition()
        .duration(1400)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0)
    }

    render()
    const obs = new ResizeObserver(render)
    obs.observe(container)
    return () => obs.disconnect()
  }, [days])

  return (
    <figure ref={containerRef} className={styles.vizFrame} role="img" aria-label="Tool calls across the quarter">
      <svg ref={svgRef} className={styles.svg} aria-hidden="true" />
    </figure>
  )
}
