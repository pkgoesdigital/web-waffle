// Offline sync entry point: fetches the YouTube Music playlist via the
// official Data API and rewrites src/data/music.json for review + commit.
// Run with `npm run sync:music`; needs YOUTUBE_API_KEY and
// YOUTUBE_PLAYLIST_ID in .env.local (see .env.example). The deployed site
// never runs this — it only reads the committed JSON. All fetch/parse logic
// lives in src/lib/music-sync.ts, covered by music-sync.test.ts.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { syncPlaylist } from '../src/lib/music-sync.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const genresPath = join(root, 'src', 'data', 'music-genres.json')
const outputPath = join(root, 'src', 'data', 'music.json')

try {
  const genres = JSON.parse(readFileSync(genresPath, 'utf8')) as Record<string, string>

  const { data, unmappedArtists, skipped } = await syncPlaylist({
    apiKey: process.env.YOUTUBE_API_KEY ?? '',
    playlistId: process.env.YOUTUBE_PLAYLIST_ID ?? '',
    genres,
  })

  writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`)

  console.log(
    `Wrote ${data.songs.length} song(s) to ${relative(root, outputPath)} (updatedAt ${data.updatedAt})`
  )
  if (skipped > 0) {
    console.log(`Skipped ${skipped} unusable playlist item(s) (deleted, private, or malformed).`)
  }
  if (unmappedArtists.length > 0) {
    console.warn(`\n${unmappedArtists.length} artist(s) missing from ${relative(root, genresPath)}`)
    console.warn('(their songs were tagged "Uncategorized" — add them to the map and re-run):')
    for (const artist of unmappedArtists) {
      console.warn(`  - ${artist}`)
    }
  }
  console.log('\nReview the diff, run `npm run test` and `npm run build`, then commit.')
} catch (error) {
  console.error(`sync:music failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
