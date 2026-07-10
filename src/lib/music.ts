import type { MusicData, Song } from './types'
import { parseMusicData } from './music-sync'
import musicJson from '@/data/music.json'

// All pure music logic (validation, grouping, sorting) lives in music-sync.ts
// so the offline sync script and client components can use it without this
// module's JSON import. Re-exported here as the site-facing entry point.
export {
  groupByGenre,
  isValidVideoId,
  parseMusicData,
  sanitizeText,
  sortByArtist,
} from './music-sync'

let cachedMusic: MusicData | null = null

/** Validated snapshot of the committed music data, newest additions first. */
export function getMusicData(): MusicData {
  if (!cachedMusic) {
    const data = parseMusicData(musicJson)
    data.songs.sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    cachedMusic = data
  }
  return cachedMusic
}

export function getSongs(): Song[] {
  return getMusicData().songs
}
