export type SocialLink = {
  href: string
  img?: string | null
  label?: string
}

// ── Page types ──────────────────────────────────────────────────────────────

/** Page metadata — no content body. Used in listings and the index cache. */
export type PageMeta = {
  id: string
  title: string
  slug: string
  date: string
  subtitle?: string
  status: string
  featured: boolean
}

/** Full page — includes rendered markdown content. */
export type Page = PageMeta & {
  content: string
}

// ── Post types ──────────────────────────────────────────────────────────────

/** Post metadata — no content body. Used in listings and the index cache. */
export type PostMeta = {
  id: string
  title: string
  slug: string
  date: string
  subtitle?: string
  status: 'publish' | 'draft' | 'trash'
  categories: string[]
  tags: string[]
}

/** Full post — includes rendered markdown content. */
export type Post = PostMeta & {
  content: string
}

// ── Event types ─────────────────────────────────────────────────────────────

export type EventType = 'meeting' | 'cleanup' | 'social' | 'dpd' | 'other'
export type EventStatus = 'confirmed' | 'tentative' | 'cancelled'

/** Event metadata — no content body. Used in listings and the index cache. */
export type EventMeta = {
  id: string
  title: string
  slug: string
  date: string
  time?: string
  location?: string
  type: EventType
  status: EventStatus
  description?: string
  source?: string
}

/** Full event — includes rendered markdown content. */
export type CPWEvent = EventMeta & {
  content: string
}

// ── Pagination ───────────────────────────────────────────────────────────────

export type PaginatedResult<T> = {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
