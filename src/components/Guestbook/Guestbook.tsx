'use client'

import { useEffect, useRef, useState } from 'react'
import type { GuestbookEntry, PowChallenge } from '@/lib/types'
import {
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  VISITING_FROM_MAX_LENGTH,
} from '@/lib/guestbook'
import { MIN_CHALLENGE_AGE_MS, solvePow } from '@/lib/proof-of-work'
import { formatDate } from '@/lib/format'
import styles from './Guestbook.module.css'

type FetchedChallenge = {
  challenge: PowChallenge
  fetchedAt: number
}

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'success' }
  | { kind: 'error'; message: string }

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[] | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [visitingFrom, setVisitingFrom] = useState('')
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: 'idle' })
  const challengeRef = useRef<FetchedChallenge | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/guestbook')
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((json: { entries: GuestbookEntry[] }) => {
        if (!cancelled) setEntries(json.entries)
      })
      .catch(() => {
        if (!cancelled) {
          setEntries([])
          setLoadFailed(true)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Fetched on first focus so the challenge is comfortably older than the
  // server's time trap by the time a human finishes typing.
  const prefetchChallenge = async (): Promise<FetchedChallenge | null> => {
    if (challengeRef.current) return challengeRef.current
    try {
      const response = await fetch('/api/guestbook/challenge')
      if (!response.ok) return null
      const challenge = (await response.json()) as PowChallenge
      challengeRef.current = { challenge, fetchedAt: Date.now() }
      return challengeRef.current
    } catch {
      return null
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitState.kind === 'sending') return

    const form = event.currentTarget
    const honeypot = (new FormData(form).get('website') as string) ?? ''

    setSubmitState({ kind: 'sending' })
    try {
      const fetched = await prefetchChallenge()
      if (!fetched) {
        setSubmitState({
          kind: 'error',
          message: 'The guestbook is not available right now — please try again later.',
        })
        return
      }

      const { challenge, fetchedAt } = fetched
      const nonce = await solvePow(challenge.salt, challenge.difficulty)

      // The server rejects submissions younger than its time trap; if the
      // challenge was fetched at the last moment, wait out the difference.
      const remaining = fetchedAt + MIN_CHALLENGE_AGE_MS + 200 - Date.now()
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining))
      }

      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          message,
          visitingFrom,
          website: honeypot,
          challengeId: challenge.id,
          nonce,
        }),
      })

      // Challenges are single-use: whatever happened, this one is spent.
      challengeRef.current = null

      if (response.status === 201) {
        setSubmitState({ kind: 'success' })
        setName('')
        setMessage('')
        setVisitingFrom('')
        return
      }

      const json = (await response.json().catch(() => null)) as { error?: string } | null
      setSubmitState({
        kind: 'error',
        message: json?.error ?? 'Something went wrong — please try again.',
      })
    } catch {
      challengeRef.current = null
      setSubmitState({ kind: 'error', message: 'Something went wrong — please try again.' })
    }
  }

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Name</span>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={prefetchChallenge}
              maxLength={NAME_MAX_LENGTH}
              required
              autoComplete="name"
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>
              Visiting from <span className={styles.optional}>(optional)</span>
            </span>
            <input
              type="text"
              name="visitingFrom"
              value={visitingFrom}
              onChange={(e) => setVisitingFrom(e.target.value)}
              onFocus={prefetchChallenge}
              maxLength={VISITING_FROM_MAX_LENGTH}
              autoComplete="off"
              className={styles.input}
            />
          </label>
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="guestbook-message">
            Your note
          </label>
          <textarea
            id="guestbook-message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={prefetchChallenge}
            maxLength={MESSAGE_MAX_LENGTH}
            required
            minLength={2}
            rows={3}
            className={styles.textarea}
          />
          <span className={styles.counter} aria-hidden="true">
            {message.length}/{MESSAGE_MAX_LENGTH}
          </span>
        </div>

        {/* Honeypot: invisible to humans, irresistible to naive bots. */}
        <div className={styles.honeypot} aria-hidden="true">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className={styles.submitRow}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitState.kind === 'sending'}
          >
            {submitState.kind === 'sending' ? 'Sending…' : 'Sign the guestbook'}
          </button>
        </div>

        <p className={styles.status} role="status" aria-live="polite">
          {submitState.kind === 'success' &&
            'Thanks! Your note is awaiting review and will appear once approved.'}
          {submitState.kind === 'error' && submitState.message}
        </p>
      </form>

      <div className={styles.entries}>
        {entries === null && <p className={styles.muted}>Loading notes…</p>}
        {entries !== null && loadFailed && (
          <p className={styles.muted}>Notes are unavailable right now.</p>
        )}
        {entries !== null && !loadFailed && entries.length === 0 && (
          <p className={styles.muted}>No notes yet — be the first to sign.</p>
        )}
        {entries !== null && entries.length > 0 && (
          <ul className={styles.entryList}>
            {entries.map((entry) => (
              <li key={entry.id} className={styles.entry}>
                <p className={styles.entryMessage}>{entry.message}</p>
                <p className={styles.entryMeta}>
                  <span className={styles.entryName}>{entry.name}</span>
                  {entry.visitingFrom && <span> · {entry.visitingFrom}</span>}
                  <span> · {formatDate(entry.createdAt)}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
