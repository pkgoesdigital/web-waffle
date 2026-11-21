/**
 * Shared types for the QuarterWithClaude component bundle.
 *
 * Mirrors the shape of a quarter-*.json dataset produced by the pipeline
 * in Content/Claude Usage Record/viz/. If you change this, update the
 * pipeline too.
 */

export type Day = {
  date: string
  sessions: number
  automated: number
  interactive: number
  tool_count: number
  walk_breaks: number
  emails_reviewed: number
  cal_created: number
  files_written: number
  drafts: number
  tasks: string[]
  weekday: string
  day_of_month: number
  month: number
  iso_week: number
}

export type Session = {
  date: string
  session_id: string
  name: string
  type: 'interactive' | 'automated'
  task: string
  tool_count: number
  notes: string
}

export type InteractiveSession = Session & {
  files_written: string[]
  scheduled_tasks_updated: Array<{ task: string; change: string }>
}

export type Totals = {
  sessions: number
  automated: number
  interactive: number
  tool_count: number
  walk_breaks: number
  emails_reviewed: number
  cal_created: number
  files_written: number
  drafts: number
  active_days: number
  quiet_days: number
  days_in_quarter: number
  logged_days: number
}

export type MonthStats = Record<string, number>

export type ToolGroup = {
  tool: string
  count: number
}

export type Stream = {
  task: string
  first_seen: string
  by_date: Record<string, number>
}

export type QuarterDataset = {
  quarter: string
  start: string
  end: string
  days: Day[]
  sessions: Session[]
  interactive_sessions: InteractiveSession[]
  totals: Totals
  by_month: Record<string, MonthStats>
  top_tools: ToolGroup[]
  streams: Stream[]
}

/** Maps a normalized task name to its CSS custom property. */
export const TASK_COLOR_VAR: Record<string, string> = {
  'daily-briefing': 'var(--viz-briefing)',
  'neighborhood-digest': 'var(--viz-digest)',
  'usage-record': 'var(--viz-usage)',
  'monthly-newsletter': 'var(--viz-newsletter)',
  'women-tech-events': 'var(--viz-events)',
  'ad-hoc': 'var(--viz-adhoc)',
}

export const TASK_LABEL: Record<string, string> = {
  'daily-briefing': 'Daily briefing',
  'neighborhood-digest': 'Neighborhood digest',
  'usage-record': 'Usage record',
  'monthly-newsletter': 'Monthly newsletter',
  'women-tech-events': 'Women & TECH events',
  'ad-hoc': 'Ad-hoc',
}
