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

// ── Newsletter types ─────────────────────────────────────────────────────────

/** Newsletter metadata — no content body. Used in listings. */
export type NewsletterMeta = {
  id: string
  title: string
  slug: string
  date: string
  period: string
  status: 'published' | 'draft'
}

/** Full newsletter — includes rendered markdown content. */
export type Newsletter = NewsletterMeta & {
  content: string
}

// ── Music types ──────────────────────────────────────────────────────────────

/** A single song in the listening rotation. `videoId` must be a valid
 *  11-character YouTube video ID — it is interpolated into the embed URL. */
export type Song = {
  videoId: string
  title: string
  artist: string
  genre: string
  addedAt: string
}

/** The committed music snapshot in src/data/music.json — the site's only
 *  source of song data. Refreshed offline via `npm run sync:music`. */
export type MusicData = {
  updatedAt: string
  songs: Song[]
}

/** Songs grouped under a genre heading, for the genre view. */
export type GenreGroup = {
  genre: string
  songs: Song[]
}

// ── Pagination ───────────────────────────────────────────────────────────────

export type PaginatedResult<T> = {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
