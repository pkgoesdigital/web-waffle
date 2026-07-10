'use client'

import { useEffect, useState } from 'react'
import type { Song } from '@/lib/types'
import { groupByGenre, isValidVideoId, sortByArtist } from '@/lib/music-sync'
import styles from './MusicPlayer.module.css'

type MusicPlayerProps = {
  songs: Song[]
}

type SongRowProps = {
  song: Song
  showGenre: boolean
  isActive: boolean
  onToggle: () => void
}

function SongRow({ song, showGenre, isActive, onToggle }: SongRowProps) {
  return (
    <li className={styles.songItem}>
      <div className={styles.songRow}>
        <button
          className={styles.playButton}
          onClick={onToggle}
          aria-label={
            isActive
              ? `Stop ${song.title} by ${song.artist}`
              : `Play ${song.title} by ${song.artist}`
          }
        >
          <span aria-hidden="true">{isActive ? '■' : '▶'}</span>
        </button>
        <span className={styles.songMeta}>
          <span className={styles.songTitle}>{song.title}</span>
          <span className={styles.songArtist}>{song.artist}</span>
        </span>
        {showGenre && <span className={styles.genreChip}>{song.genre}</span>}
      </div>
      {isActive && (
        <div className={styles.embedWrapper}>
          <iframe
            className={styles.embed}
            src={`https://www.youtube-nocookie.com/embed/${song.videoId}?autoplay=1`}
            title={`YouTube player: ${song.title} by ${song.artist}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-presentation"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
          />
        </div>
      )}
    </li>
  )
}

export default function MusicPlayer({ songs }: MusicPlayerProps) {
  const [byArtist, setByArtist] = useState(false)
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)

  useEffect(() => {
    if (!activeVideoId) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveVideoId(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeVideoId])

  // Defence in depth: the lib already rejects bad IDs at build time, but this
  // component must never hand an unvalidated string to the iframe URL.
  const safeSongs = songs.filter((song) => isValidVideoId(song.videoId))

  if (safeSongs.length === 0) {
    return <p className={styles.empty}>Nothing in rotation right now — check back soon.</p>
  }

  const handleToggleView = () => setByArtist((prev) => !prev)

  const renderRow = (song: Song, showGenre: boolean) => (
    <SongRow
      key={song.videoId}
      song={song}
      showGenre={showGenre}
      isActive={activeVideoId === song.videoId}
      onToggle={() =>
        setActiveVideoId((current) => (current === song.videoId ? null : song.videoId))
      }
    />
  )

  return (
    <div>
      <div className={styles.controls}>
        <label className={styles.toggleLabel}>
          <span className={styles.toggleText}>
            {byArtist ? 'By artist' : 'By genre'}
          </span>
          <button
            role="switch"
            aria-checked={byArtist}
            onClick={handleToggleView}
            className={`${styles.toggle} ${byArtist ? styles.toggleOn : styles.toggleOff}`}
          >
            <span className={styles.toggleThumb} />
          </button>
        </label>
      </div>

      {byArtist ? (
        <ul className={styles.songList}>
          {sortByArtist(safeSongs).map((song) => renderRow(song, true))}
        </ul>
      ) : (
        groupByGenre(safeSongs).map((group) => (
          <section key={group.genre} className={styles.genreSection}>
            <h3 className={styles.genreTitle}>{group.genre}</h3>
            <ul className={styles.songList}>
              {group.songs.map((song) => renderRow(song, false))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
