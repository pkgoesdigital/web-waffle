'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import styles from './D3Visualization.module.css'

type DataPoint = {
  label: string
  value: number
  color?: string
}

type D3VisualizationProps = {
  dataUrl: string
}

function renderBarChart(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  data: DataPoint[],
  width: number,
  height: number
) {
  const margin = { top: 20, right: 20, bottom: 40, left: 50 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.label))
    .range([0, innerWidth])
    .padding(0.2)

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value) ?? 0])
    .nice()
    .range([innerHeight, 0])

  // Bars
  g.selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d) => x(d.label) ?? 0)
    .attr('y', (d) => y(d.value))
    .attr('width', x.bandwidth())
    .attr('height', (d) => innerHeight - y(d.value))
    .attr('rx', 4)
    .attr('fill', (d, i) => {
      const hues = [350, 25, 45, 160, 200, 270, 330, 90]
      return d.color ?? `hsl(${hues[i % hues.length]}, 65%, 72%)`
    })

  // X axis
  g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll('text')
    .attr('font-size', '12px')
    .attr('fill', '#6b7280')

  // Y axis
  g.append('g')
    .call(d3.axisLeft(y).ticks(5))
    .selectAll('text')
    .attr('font-size', '12px')
    .attr('fill', '#6b7280')

  // Remove axis lines for cleaner look
  g.selectAll('.domain').attr('stroke', '#e5e7eb')
  g.selectAll('.tick line').attr('stroke', '#e5e7eb')
}

export default function D3Visualization({ dataUrl }: D3VisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [data, setData] = useState<DataPoint[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(dataUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load data: ${res.status}`)
        return res.json()
      })
      .then(setData)
      .catch((err) => setError(err.message))
  }, [dataUrl])

  const render = useCallback(() => {
    if (!data || !svgRef.current || !containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = Math.min(width * 0.6, 400)

    const svg = d3.select(svgRef.current)
    svg.attr('width', width).attr('height', height)
    svg.selectAll('*').remove()

    renderBarChart(svg, data, width, height)
  }, [data])

  useEffect(() => {
    if (!data || !containerRef.current) return

    render()

    const observer = new ResizeObserver(() => render())
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [data, render])

  if (error) {
    return <p className={styles.error}>Could not load visualization: {error}</p>
  }

  return (
    <div ref={containerRef} className={styles.container}>
      {!data && <p className={styles.loading}>Loading visualization...</p>}
      <svg ref={svgRef} className={styles.svg} />
    </div>
  )
}
