export function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  // Bare YYYY-MM-DD parses as UTC midnight, which shifts the calendar date
  // back a day in timezones west of UTC — anchor it to local midnight instead.
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
    ? `${dateStr}T00:00:00`
    : dateStr.replace(' ', 'T')
  const d = new Date(normalized)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
