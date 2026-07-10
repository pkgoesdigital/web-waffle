// Pure logic for the offline `npm run sync:music` pipeline, plus the shared
// validation primitives for music data. This module must stay importable by
// plain Node (scripts/sync-music.ts runs it via --experimental-strip-types),
// so it may only use type-only imports — no JSON imports, no path aliases.
import type { GenreGroup, MusicData, Song } from './types'

// YouTube video IDs are exactly 11 URL-safe base64 characters. The ID is
// interpolated into the embed iframe URL, so this allowlist is the security
// boundary — anything else is rejected outright.
const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/
const PLAYLIST_ID_PATTERN = /^[A-Za-z0-9_-]{10,60}$/
const API_KEY_PATTERN = /^[A-Za-z0-9_-]{20,80}$/

const MAX_TEXT_LENGTH = 200
const MAX_SONGS = 30
const UNMAPPED_GENRE = 'Uncategorized'

export function isValidVideoId(id: string): boolean {
  return VIDEO_ID_PATTERN.test(id)
}

/** Strip C0/C1 control characters and cap length. Applied to every text field
 *  that originates outside the repo (the YouTube API, hand-edited JSON, or
 *  guestbook visitors). */
export function sanitizeText(value: string, maxLength = MAX_TEXT_LENGTH): string {
  return Array.from(value)
    .filter((ch) => {
      const code = ch.codePointAt(0) ?? 0
      return code >= 0x20 && !(code >= 0x7f && code <= 0x9f)
    })
    .join('')
    .trim()
    .slice(0, maxLength)
}

function parseRequiredText(value: unknown, field: string, index: number): string {
  if (typeof value !== 'string') {
    throw new Error(`music.json: song ${index} field "${field}" must be a string`)
  }
  const clean = sanitizeText(value)
  if (!clean) {
    throw new Error(`music.json: song ${index} field "${field}" is empty`)
  }
  return clean
}

function parseSong(raw: unknown, index: number): Song {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new Error(`music.json: song ${index} is not an object`)
  }
  const record = raw as Record<string, unknown>

  const videoId = record.videoId
  if (typeof videoId !== 'string' || !isValidVideoId(videoId)) {
    throw new Error(`music.json: song ${index} has an invalid videoId`)
  }

  const addedAt = record.addedAt
  if (typeof addedAt !== 'string' || Number.isNaN(Date.parse(addedAt))) {
    throw new Error(`music.json: song ${index} has an invalid addedAt date`)
  }

  return {
    videoId,
    title: parseRequiredText(record.title, 'title', index),
    artist: parseRequiredText(record.artist, 'artist', index),
    genre: parseRequiredText(record.genre, 'genre', index),
    addedAt,
  }
}

/** Validate the raw shape of a music snapshot. Throws on any malformed entry
 *  so a bad sync fails the build instead of reaching production. */
export function parseMusicData(raw: unknown): MusicData {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new Error('music.json: root must be an object')
  }
  const record = raw as Record<string, unknown>

  if (typeof record.updatedAt !== 'string' || Number.isNaN(Date.parse(record.updatedAt))) {
    throw new Error('music.json: updatedAt must be a valid date string')
  }
  if (!Array.isArray(record.songs)) {
    throw new Error('music.json: songs must be an array')
  }

  const songs = record.songs.map(parseSong)

  const seen = new Set<string>()
  for (const song of songs) {
    if (seen.has(song.videoId)) {
      throw new Error(`music.json: duplicate videoId "${song.videoId}"`)
    }
    seen.add(song.videoId)
  }

  return { updatedAt: record.updatedAt, songs }
}

// ── View helpers ─────────────────────────────────────────────────────────────
// Pure and JSON-free so client components can import them without pulling the
// full music.json snapshot into the browser bundle.

/** Genres alphabetically, songs within each genre newest first. */
export function groupByGenre(songs: Song[]): GenreGroup[] {
  const groups = new Map<string, Song[]>()
  for (const song of songs) {
    const group = groups.get(song.genre) ?? []
    group.push(song)
    groups.set(song.genre, group)
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
    .map(([genre, grouped]) => ({
      genre,
      songs: [...grouped].sort((a, b) => b.addedAt.localeCompare(a.addedAt)),
    }))
}

/** Flat list sorted by artist A→Z (case-insensitive), then title. */
export function sortByArtist(songs: Song[]): Song[] {
  return [...songs].sort(
    (a, b) =>
      a.artist.localeCompare(b.artist, 'en', { sensitivity: 'base' }) ||
      a.title.localeCompare(b.title, 'en', { sensitivity: 'base' })
  )
}

// ── Sync pipeline ────────────────────────────────────────────────────────────

/** A playlist entry extracted from the API response, before genre mapping. */
export type PlaylistEntry = {
  videoId: string
  title: string
  artist: string
  addedAt: string
}

export type SyncResult = {
  data: MusicData
  unmappedArtists: string[]
  skipped: number
}

const SKIPPED_TITLES = new Set(['Deleted video', 'Private video'])

/** Extract usable entries from a YouTube Data API playlistItems response.
 *  The response is untrusted input: malformed, deleted, private, or invalid
 *  entries are skipped rather than trusted. Throws only if the overall shape
 *  is not a playlistItems response at all. */
export function parsePlaylistItems(raw: unknown): { entries: PlaylistEntry[]; skipped: number } {
  if (typeof raw !== 'object' || raw === null || !Array.isArray((raw as { items?: unknown }).items)) {
    throw new Error('Unexpected YouTube API response shape (missing items array)')
  }

  const entries: PlaylistEntry[] = []
  let skipped = 0

  for (const item of (raw as { items: unknown[] }).items) {
    const snippet = (item as { snippet?: unknown })?.snippet as Record<string, unknown> | undefined
    if (!snippet || typeof snippet !== 'object') {
      skipped++
      continue
    }

    const resource = snippet.resourceId as Record<string, unknown> | undefined
    const videoId = resource?.videoId
    const rawTitle = snippet.title
    const rawOwner = snippet.videoOwnerChannelTitle
    const publishedAt = snippet.publishedAt

    if (
      resource?.kind !== 'youtube#video' ||
      typeof videoId !== 'string' ||
      !isValidVideoId(videoId) ||
      typeof rawTitle !== 'string' ||
      SKIPPED_TITLES.has(rawTitle) ||
      typeof rawOwner !== 'string' ||
      typeof publishedAt !== 'string' ||
      Number.isNaN(Date.parse(publishedAt))
    ) {
      skipped++
      continue
    }

    // YouTube Music uploads live on auto-generated "<Artist> - Topic" channels.
    const artist = sanitizeText(rawOwner.replace(/ - Topic$/, ''))
    const title = sanitizeText(rawTitle)
    if (!artist || !title) {
      skipped++
      continue
    }

    entries.push({ videoId, title, artist, addedAt: publishedAt.slice(0, 10) })
  }

  return { entries, skipped }
}

/** Assign genres from the hand-maintained artist→genre map (case-insensitive).
 *  Unknown artists get "Uncategorized" and are reported so the map can grow. */
export function applyGenres(
  entries: PlaylistEntry[],
  genres: Record<string, string>
): { songs: Song[]; unmappedArtists: string[] } {
  const byLowerArtist = new Map(
    Object.entries(genres).map(([artist, genre]) => [artist.toLowerCase(), sanitizeText(genre)])
  )
  const unmapped = new Set<string>()

  const songs = entries.map((entry) => {
    const genre = byLowerArtist.get(entry.artist.toLowerCase())
    if (!genre) unmapped.add(entry.artist)
    return { ...entry, genre: genre || UNMAPPED_GENRE }
  })

  return { songs, unmappedArtists: [...unmapped].sort() }
}

/** Newest first, duplicates dropped, capped at MAX_SONGS, then validated
 *  through the same parseMusicData gate the website build uses. */
export function buildMusicData(songs: Song[], updatedAt: string): MusicData {
  const seen = new Set<string>()
  const deduped = [...songs]
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .filter((song) => {
      if (seen.has(song.videoId)) return false
      seen.add(song.videoId)
      return true
    })
    .slice(0, MAX_SONGS)

  return parseMusicData({ updatedAt, songs: deduped })
}

function redactKey(message: string, apiKey: string): string {
  return apiKey ? message.split(apiKey).join('[redacted]') : message
}

export type SyncOptions = {
  apiKey: string
  playlistId: string
  genres: Record<string, string>
  fetchImpl?: typeof fetch
  today?: string
}

/** Fetch the playlist via the YouTube Data API and produce a validated
 *  music snapshot. The API key never appears in errors or output. */
export async function syncPlaylist(options: SyncOptions): Promise<SyncResult> {
  const { apiKey, playlistId, genres, fetchImpl = fetch, today } = options

  if (!API_KEY_PATTERN.test(apiKey)) {
    throw new Error('YOUTUBE_API_KEY is missing or not a plausible API key')
  }
  if (!PLAYLIST_ID_PATTERN.test(playlistId)) {
    throw new Error('YOUTUBE_PLAYLIST_ID is missing or not a plausible playlist ID')
  }

  const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('maxResults', '50')
  url.searchParams.set('playlistId', playlistId)
  url.searchParams.set('key', apiKey)

  let response: Response
  try {
    response = await fetchImpl(url.toString())
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`YouTube API request failed: ${redactKey(message, apiKey)}`)
  }

  if (!response.ok) {
    throw new Error(`YouTube API request failed with HTTP ${response.status}`)
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new Error('YouTube API response was not valid JSON')
  }

  const { entries, skipped } = parsePlaylistItems(payload)
  const { songs, unmappedArtists } = applyGenres(entries, genres)
  const data = buildMusicData(songs, today ?? new Date().toISOString().slice(0, 10))

  return { data, unmappedArtists, skipped }
}
