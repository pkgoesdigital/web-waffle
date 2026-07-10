import {
  applyGenres,
  buildMusicData,
  parsePlaylistItems,
  syncPlaylist,
  type PlaylistEntry,
} from './music-sync'

const API_KEY = 'AIzaFakeKeyForTests1234567890abcdefghi'
const PLAYLIST_ID = 'PLtestPlaylist1234567890'

function apiItem(overrides: Record<string, unknown> = {}) {
  return {
    snippet: {
      title: 'Some Song',
      publishedAt: '2026-07-01T12:00:00Z',
      videoOwnerChannelTitle: 'Some Artist - Topic',
      resourceId: { kind: 'youtube#video', videoId: 'dQw4w9WgXcQ' },
      ...overrides,
    },
  }
}

function entry(overrides: Partial<PlaylistEntry> = {}): PlaylistEntry {
  return {
    videoId: 'dQw4w9WgXcQ',
    title: 'Some Song',
    artist: 'Some Artist',
    addedAt: '2026-07-01',
    ...overrides,
  }
}

describe('parsePlaylistItems', () => {
  it('extracts videoId, title, artist, and date-only addedAt', () => {
    const { entries, skipped } = parsePlaylistItems({ items: [apiItem()] })
    expect(skipped).toBe(0)
    expect(entries).toEqual([
      {
        videoId: 'dQw4w9WgXcQ',
        title: 'Some Song',
        artist: 'Some Artist',
        addedAt: '2026-07-01',
      },
    ])
  })

  it('strips the " - Topic" suffix from YouTube Music channels only', () => {
    const { entries } = parsePlaylistItems({
      items: [
        apiItem({ videoOwnerChannelTitle: 'Tame Impala - Topic' }),
        apiItem({
          videoOwnerChannelTitle: 'The Strokes',
          resourceId: { kind: 'youtube#video', videoId: 'AAAAAAAAAA2' },
        }),
      ],
    })
    expect(entries.map((e) => e.artist)).toEqual(['Tame Impala', 'The Strokes'])
  })

  it('skips deleted and private videos', () => {
    const { entries, skipped } = parsePlaylistItems({
      items: [apiItem({ title: 'Deleted video' }), apiItem({ title: 'Private video' }), apiItem()],
    })
    expect(entries).toHaveLength(1)
    expect(skipped).toBe(2)
  })

  it('skips entries whose videoId fails the allowlist', () => {
    const { entries, skipped } = parsePlaylistItems({
      items: [
        apiItem({ resourceId: { kind: 'youtube#video', videoId: '"><script>a' } }),
        apiItem({ resourceId: { kind: 'youtube#video', videoId: 'dQw4w9WgXcQ?rel=0' } }),
      ],
    })
    expect(entries).toHaveLength(0)
    expect(skipped).toBe(2)
  })

  it('skips non-video resources and malformed items', () => {
    const { entries, skipped } = parsePlaylistItems({
      items: [
        apiItem({ resourceId: { kind: 'youtube#playlist', videoId: 'dQw4w9WgXcQ' } }),
        { notASnippet: true },
        apiItem({ publishedAt: 'garbage' }),
      ],
    })
    expect(entries).toHaveLength(0)
    expect(skipped).toBe(3)
  })

  it('sanitizes control characters out of titles and artists', () => {
    const { entries } = parsePlaylistItems({
      items: [apiItem({ title: "Sneaky\u0000Title\u009f" })],
    })
    expect(entries[0].title).toBe('SneakyTitle')
  })

  it('throws on a response that is not a playlistItems payload', () => {
    expect(() => parsePlaylistItems(null)).toThrow('Unexpected YouTube API response')
    expect(() => parsePlaylistItems({ error: { code: 403 } })).toThrow(
      'Unexpected YouTube API response'
    )
  })
})

describe('applyGenres', () => {
  it('maps artists to genres case-insensitively', () => {
    const { songs, unmappedArtists } = applyGenres(
      [entry({ artist: 'tame impala' })],
      { 'Tame Impala': 'Psychedelic Rock' }
    )
    expect(songs[0].genre).toBe('Psychedelic Rock')
    expect(unmappedArtists).toEqual([])
  })

  it('assigns Uncategorized and reports unmapped artists once each', () => {
    const { songs, unmappedArtists } = applyGenres(
      [
        entry({ videoId: 'AAAAAAAAAA1', artist: 'New Artist' }),
        entry({ videoId: 'AAAAAAAAAA2', artist: 'New Artist' }),
      ],
      {}
    )
    expect(songs.every((s) => s.genre === 'Uncategorized')).toBe(true)
    expect(unmappedArtists).toEqual(['New Artist'])
  })
})

describe('buildMusicData', () => {
  it('sorts newest first, dedupes videoIds, and caps at 30 songs', () => {
    const songs = Array.from({ length: 35 }, (_, i) => ({
      ...entry({
        videoId: `AAAAAAAAA${String(i).padStart(2, '0')}`,
        addedAt: `2026-06-${String((i % 28) + 1).padStart(2, '0')}`,
      }),
      genre: 'Test',
    }))
    const withDupe = [...songs, songs[0]]

    const data = buildMusicData(withDupe, '2026-07-09')

    expect(data.songs).toHaveLength(30)
    for (let i = 1; i < data.songs.length; i++) {
      expect(data.songs[i - 1].addedAt >= data.songs[i].addedAt).toBe(true)
    }
  })

  it('rejects output that would fail the site build', () => {
    const bad = [{ ...entry({ videoId: 'dQw4w9WgXcQ' }), genre: ' ' }]
    expect(() => buildMusicData(bad, '2026-07-09')).toThrow('"genre" is empty')
  })
})

describe('syncPlaylist', () => {
  const okResponse = (body: unknown): Response =>
    ({ ok: true, status: 200, json: async () => body }) as Response

  it('fetches the playlist and returns a validated snapshot', async () => {
    const fetchImpl = jest.fn(async () => okResponse({ items: [apiItem()] }))

    const result = await syncPlaylist({
      apiKey: API_KEY,
      playlistId: PLAYLIST_ID,
      genres: { 'Some Artist': 'Test Genre' },
      fetchImpl,
      today: '2026-07-09',
    })

    expect(result.data.updatedAt).toBe('2026-07-09')
    expect(result.data.songs).toEqual([
      {
        videoId: 'dQw4w9WgXcQ',
        title: 'Some Song',
        artist: 'Some Artist',
        genre: 'Test Genre',
        addedAt: '2026-07-01',
      },
    ])

    const requested = new URL(fetchImpl.mock.calls[0][0] as string)
    expect(requested.origin).toBe('https://www.googleapis.com')
    expect(requested.searchParams.get('playlistId')).toBe(PLAYLIST_ID)
  })

  it('rejects an implausible API key before any network call', async () => {
    const fetchImpl = jest.fn()
    await expect(
      syncPlaylist({ apiKey: 'nope', playlistId: PLAYLIST_ID, genres: {}, fetchImpl })
    ).rejects.toThrow('YOUTUBE_API_KEY')
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('rejects an implausible playlist ID before any network call', async () => {
    const fetchImpl = jest.fn()
    await expect(
      syncPlaylist({ apiKey: API_KEY, playlistId: 'bad id!', genres: {}, fetchImpl })
    ).rejects.toThrow('YOUTUBE_PLAYLIST_ID')
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('reports HTTP failures by status only, never echoing the key', async () => {
    const fetchImpl = jest.fn(async () => ({ ok: false, status: 403 }) as Response)
    await expect(
      syncPlaylist({ apiKey: API_KEY, playlistId: PLAYLIST_ID, genres: {}, fetchImpl })
    ).rejects.toThrow('HTTP 403')
  })

  it('redacts the API key from network error messages', async () => {
    const fetchImpl = jest.fn(async () => {
      throw new Error(`connect failed for https://example.com/?key=${API_KEY}`)
    })

    const error: Error = await syncPlaylist({
      apiKey: API_KEY,
      playlistId: PLAYLIST_ID,
      genres: {},
      fetchImpl,
    }).then(
      () => {
        throw new Error('expected syncPlaylist to reject')
      },
      (e: Error) => e
    )
    expect(error.message).toContain('[redacted]')
    expect(error.message).not.toContain(API_KEY)
  })

  it('reports unmapped artists and skipped items', async () => {
    const fetchImpl = jest.fn(async () =>
      okResponse({ items: [apiItem(), apiItem({ title: 'Deleted video' })] })
    )

    const result = await syncPlaylist({
      apiKey: API_KEY,
      playlistId: PLAYLIST_ID,
      genres: {},
      fetchImpl,
      today: '2026-07-09',
    })

    expect(result.unmappedArtists).toEqual(['Some Artist'])
    expect(result.skipped).toBe(1)
    expect(result.data.songs[0].genre).toBe('Uncategorized')
  })
})
