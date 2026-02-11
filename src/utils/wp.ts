import DOMPurify from 'dompurify'

export function sanitizeHtml(html: string) {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  })
}

export function stripEmpty(html: string) {
  return (html || '').replace(/\s+/g, ' ').trim()
}

export function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr.replace(' ', 'T') + 'Z')
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
