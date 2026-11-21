import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { EventMeta, EventType, EventStatus, CPWEvent } from './types'

const EVENTS_DIR = path.join(process.cwd(), 'src', 'content', 'events')

let eventIndex: EventMeta[] | null = null

function parseEventFrontmatter(
  data: Record<string, unknown>,
  slug: string
): EventMeta {
  const validTypes: EventType[] = ['meeting', 'cleanup', 'social', 'dpd', 'other']
  const validStatuses: EventStatus[] = ['confirmed', 'tentative', 'cancelled']

  return {
    id: String(data.id ?? ''),
    title: String(data.title ?? slug),
    slug: String(data.slug ?? slug),
    date: String(data.date ?? ''),
    time: data.time ? String(data.time) : undefined,
    location: data.location ? String(data.location) : undefined,
    type: validTypes.includes(data.type as EventType)
      ? (data.type as EventType)
      : 'other',
    status: validStatuses.includes(data.status as EventStatus)
      ? (data.status as EventStatus)
      : 'tentative',
    description: data.description ? String(data.description) : undefined,
    source: data.source ? String(data.source) : undefined,
  }
}

function buildEventIndex(): EventMeta[] {
  if (!fs.existsSync(EVENTS_DIR)) return []

  const files = fs.readdirSync(EVENTS_DIR).filter((f) => f.endsWith('.md'))

  const events = files.map((file) => {
    const slug = path.basename(file, '.md')
    const raw = fs.readFileSync(path.join(EVENTS_DIR, file), 'utf-8')
    const { data } = matter(raw)
    return parseEventFrontmatter(data as Record<string, unknown>, slug)
  })

  // Sort chronologically ascending (soonest first), then by start time
  return events.sort(compareEventsAsc)
}

/**
 * Minutes after midnight for the first clock time in an event's `time`
 * string (e.g. "6:00 PM (doors open 5:00 PM)" → 1080). Returns -1 when no
 * time can be parsed, so untimed events sort first, like all-day events.
 */
export function parseStartMinutes(time?: string): number {
  if (!time) return -1
  const match = time.match(/(\d{1,2})(?::(\d{2}))?\s*([AP])\.?M\.?/i)
  if (!match) return -1
  let hours = Number(match[1]) % 12
  if (match[3].toUpperCase() === 'P') hours += 12
  return hours * 60 + Number(match[2] ?? 0)
}

/** Compares YYYY-MM-DD date strings without timezone drift. */
function compareDates(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

/** Date ascending, then start time ascending. */
export function compareEventsAsc(
  a: Pick<EventMeta, 'date' | 'time'>,
  b: Pick<EventMeta, 'date' | 'time'>
): number {
  return compareDates(a.date, b.date) || parseStartMinutes(a.time) - parseStartMinutes(b.time)
}

/** Date descending (most recent day first), then start time ascending within a day. */
export function compareEventsDesc(
  a: Pick<EventMeta, 'date' | 'time'>,
  b: Pick<EventMeta, 'date' | 'time'>
): number {
  return compareDates(b.date, a.date) || parseStartMinutes(a.time) - parseStartMinutes(b.time)
}

function getEventIndex(): EventMeta[] {
  if (!eventIndex) eventIndex = buildEventIndex()
  return eventIndex
}

export function getEvents(): EventMeta[] {
  return getEventIndex().filter((e) => e.status !== 'cancelled')
}

/** Date (YYYY-MM-DD) of the earliest event on file, including cancelled ones. */
export function getEarliestEventDate(): string | undefined {
  return getEventIndex()[0]?.date || undefined
}

export function getEventsForMonth(year: number, month: number): EventMeta[] {
  return getEventIndex().filter((e) => {
    const [eYear, eMonth] = e.date.split('-').map(Number)
    return eYear === year && eMonth - 1 === month
  })
}

export function getUpcomingEvents(months = 2): EventMeta[] {
  const now = new Date()
  const cutoff = new Date(now.getFullYear(), now.getMonth() + months + 1, 1)
  return getEvents().filter((e) => new Date(e.date) < cutoff)
}

export async function getEventBySlug(slug: string): Promise<CPWEvent | undefined> {
  const meta = getEventIndex().find((e) => e.slug === slug)
  if (!meta) return undefined

  const filePath = path.join(EVENTS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return undefined

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { content } = matter(raw)
  return { ...meta, content }
}
