process.env.TZ = 'America/Denver'

import { formatDate } from './format'

describe('formatDate', () => {
  it('renders a date-only string as the written calendar date west of UTC', () => {
    expect(formatDate('2026-07-09')).toBe('Jul 9, 2026')
  })

  it('renders date-only strings correctly across month boundaries', () => {
    expect(formatDate('2026-01-01')).toBe('Jan 1, 2026')
    expect(formatDate('2025-12-31')).toBe('Dec 31, 2025')
  })

  it('formats space-separated datetime strings', () => {
    expect(formatDate('2026-07-09 14:30:00')).toBe('Jul 9, 2026')
  })

  it('formats ISO datetime strings', () => {
    expect(formatDate('2026-07-09T14:30:00')).toBe('Jul 9, 2026')
  })

  it('returns an empty string for missing input', () => {
    expect(formatDate(undefined)).toBe('')
    expect(formatDate('')).toBe('')
  })

  it('returns the input unchanged when it cannot be parsed', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date')
  })
})
