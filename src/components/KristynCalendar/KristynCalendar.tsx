'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { SLOT_DEFINITIONS, SLOT_BY_KEY, CALENDAR_DAYS } from '@/lib/kristyn-config'
import styles from './KristynCalendar.module.css'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

type SignupData = {
  names: string[]
  count: number
}

type SignupMap = Record<string, Record<string, SignupData>>

type ActiveSlot = {
  date: string
  slotKey: string
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`
}

function formatDayOfWeek(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return DAY_NAMES[d.getDay()]
}

function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`
}

export default function KristynCalendar() {
  const [signups, setSignups] = useState<SignupMap>({})
  const [loadingSignups, setLoadingSignups] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [activeSlot, setActiveSlot] = useState<ActiveSlot | null>(null)
  const [expandedWeek, setExpandedWeek] = useState<number>(0)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' })
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const dates = useMemo<string[]>(() => {
    const result: string[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    for (let i = 0; i < CALENDAR_DAYS; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      result.push(d.toISOString().slice(0, 10))
    }
    return result
  }, [])

  const weeks = useMemo<string[][]>(() => {
    const result: string[][] = []
    for (let i = 0; i < dates.length; i += 7) {
      result.push(dates.slice(i, i + 7))
    }
    return result
  }, [dates])

  const fetchSignups = useCallback(async () => {
    try {
      const res = await fetch('/api/kristyn-wade')
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json() as { signups: SignupMap }
      setSignups(data.signups)
      setFetchError(null)
    } catch {
      setFetchError('Unable to load sign-ups right now. Please refresh the page.')
    } finally {
      setLoadingSignups(false)
    }
  }, [])

  useEffect(() => {
    void fetchSignups()
  }, [fetchSignups])

  function handleSlotClick(date: string, slotKey: string) {
    const slot = SLOT_BY_KEY[slotKey]
    if (!slot || slot.type === 'quiet') return

    if (activeSlot?.date === date && activeSlot?.slotKey === slotKey) {
      setActiveSlot(null)
      return
    }

    setActiveSlot({ date, slotKey })
    setForm({ fullName: '', email: '', phone: '' })
    setSubmitState('idle')
    setSubmitError(null)
  }

  function handleDismiss() {
    setActiveSlot(null)
    setSubmitState('idle')
    setSubmitError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const name = form.fullName.trim()
    if (!name) {
      setSubmitError('Please enter your full name.')
      return
    }
    if (!form.email.trim() && !form.phone.trim()) {
      setSubmitError('Please share an email or phone number so her family can reach you if plans change.')
      return
    }
    if (!activeSlot) return

    setSubmitState('submitting')
    setSubmitError(null)

    try {
      const res = await fetch('/api/kristyn-wade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slot_date: activeSlot.date,
          slot_key: activeSlot.slotKey,
          full_name: name,
          email: form.email.trim() || undefined,
          phone: form.phone.trim() || undefined,
        }),
      })

      const data = await res.json() as { error?: string }

      if (!res.ok) {
        setSubmitState('error')
        setSubmitError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      setSubmitState('success')
      await fetchSignups()
    } catch {
      setSubmitState('error')
      setSubmitError('Something went wrong. Please try again.')
    }
  }

  function getSlotData(date: string, slotKey: string): SignupData {
    return signups[date]?.[slotKey] ?? { names: [], count: 0 }
  }

  function isSlotFull(date: string, slotKey: string): boolean {
    const slot = SLOT_BY_KEY[slotKey]
    if (!slot || slot.maxSignups === 0) return false
    return getSlotData(date, slotKey).count >= slot.maxSignups
  }

  return (
    <div className={styles.container}>
      <p className={styles.intro}>
        The community is rallying around Kristyn, and every visit helps. Use this page to coordinate visits and meal drop-offs —
        so things stay spread out and she always has company. Kristyn is Vegan, so if signing up for a meal, please keep that in mind and add lots of love into your recipe.
      </p>

      {loadingSignups && (
        <div className={styles.loading} aria-live="polite">
          Loading sign-ups…
        </div>
      )}

      {fetchError && (
        <div className={styles.fetchError} role="alert">
          {fetchError}
        </div>
      )}

      {!loadingSignups && !fetchError && (
        <div className={styles.calendar}>
          {weeks.map((week, weekIdx) => {
            const weekStart = formatDateLabel(week[0])
            const weekEnd = formatDateLabel(week[week.length - 1])
            const isExpanded = expandedWeek === weekIdx

            return (
              <div key={weekIdx} className={styles.weekBlock}>
                <button
                  className={`${styles.weekHeader} ${isExpanded ? styles.weekHeaderExpanded : ''}`}
                  onClick={() => setExpandedWeek(isExpanded ? -1 : weekIdx)}
                  aria-expanded={isExpanded}
                >
                  <span className={styles.weekLabel}>
                    {weekStart} – {weekEnd}
                  </span>
                  <span className={styles.weekChevron} aria-hidden="true">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </button>

                {isExpanded && (
                  <div className={styles.weekDays}>
                    {week.map((date) => (
                      <div key={date} className={styles.dayColumn}>
                        <div className={styles.dayHeader}>
                          <span className={styles.dayName}>{formatDayOfWeek(date)}</span>
                          <span className={styles.dayDate}>{formatDateLabel(date)}</span>
                        </div>

                        <div className={styles.slotList}>
                          {SLOT_DEFINITIONS.map((slot) => {
                            const slotData = getSlotData(date, slot.key)
                            const full = isSlotFull(date, slot.key)
                            const isActive =
                              activeSlot?.date === date && activeSlot?.slotKey === slot.key

                            if (slot.type === 'quiet') {
                              return (
                                <div
                                  key={slot.key}
                                  className={styles.slotQuiet}
                                  aria-disabled="true"
                                >
                                  <span className={styles.slotLabel}>{slot.label}</span>
                                  <span className={styles.slotTime}>{slot.timeRange}</span>
                                  <span className={styles.slotQuietNote}>Rest time — no visits please</span>
                                </div>
                              )
                            }

                            return (
                              <div key={slot.key}>
                                <button
                                  className={`${styles.slotBtn} ${
                                    slot.type === 'meal' ? styles.slotMeal : styles.slotVisit
                                  } ${full ? styles.slotFull : ''} ${isActive ? styles.slotActive : ''}`}
                                  onClick={() => handleSlotClick(date, slot.key)}
                                  aria-expanded={isActive}
                                >
                                  <div className={styles.slotBtnTop}>
                                    <span className={styles.slotLabel}>{slot.label}</span>
                                    <span className={styles.slotBadge}>
                                      {slot.maxSignups === 1
                                        ? full ? 'Taken' : 'Available'
                                        : `${slotData.count} / ${slot.maxSignups}`}
                                    </span>
                                  </div>
                                  <span className={styles.slotTime}>{slot.timeRange}</span>
                                  {slotData.names.length > 0 && (
                                    <span className={styles.slotNames}>
                                      {slotData.names.join(', ')}
                                    </span>
                                  )}
                                  {slotData.names.length === 0 && !full && (
                                    <span className={styles.slotEmpty}>
                                      No one yet — be the first
                                    </span>
                                  )}
                                </button>

                                {isActive && (
                                  <SignupPanel
                                    date={date}
                                    slot={slot}
                                    slotData={slotData}
                                    full={full}
                                    form={form}
                                    setForm={setForm}
                                    submitState={submitState}
                                    submitError={submitError}
                                    onSubmit={handleSubmit}
                                    onDismiss={handleDismiss}
                                  />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

type SignupPanelProps = {
  date: string
  slot: (typeof SLOT_DEFINITIONS)[number]
  slotData: SignupData
  full: boolean
  form: { fullName: string; email: string; phone: string }
  setForm: React.Dispatch<React.SetStateAction<{ fullName: string; email: string; phone: string }>>
  submitState: SubmitState
  submitError: string | null
  onSubmit: (e: React.FormEvent) => void
  onDismiss: () => void
}

function SignupPanel({
  date,
  slot,
  slotData,
  full,
  form,
  setForm,
  submitState,
  submitError,
  onSubmit,
  onDismiss,
}: SignupPanelProps) {
  return (
    <div className={styles.signupPanel} role="region" aria-label={`Sign up for ${slot.label}`}>
      <div className={styles.panelHeader}>
        <div>
          <strong>{slot.label}</strong>
          <span className={styles.panelTime}> · {slot.timeRange}</span>
          <div className={styles.panelDate}>{formatFullDate(date)}</div>
        </div>
        <button className={styles.dismissBtn} onClick={onDismiss} aria-label="Close">
          ✕
        </button>
      </div>

      {slotData.names.length > 0 && (
        <div className={styles.panelSignedUp}>
          <span className={styles.panelSignedUpLabel}>Already signed up:</span>{' '}
          {slotData.names.join(', ')}
        </div>
      )}

      {submitState === 'success' ? (
        <div className={styles.successMsg} role="status">
          You&rsquo;re all set. See you then. 🤍
        </div>
      ) : full ? (
        <p className={styles.fullMsg}>This time is full — check other times or days!</p>
      ) : (
        <form onSubmit={onSubmit} className={styles.signupForm} noValidate>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor={`name-${date}-${slot.key}`}>
              Full name <span className={styles.required}>*</span>
            </label>
            <input
              id={`name-${date}-${slot.key}`}
              type="text"
              className={styles.fieldInput}
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              placeholder="Your full name"
              aria-required="true"
              disabled={submitState === 'submitting'}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor={`email-${date}-${slot.key}`}>
              Email
            </label>
            <input
              id={`email-${date}-${slot.key}`}
              type="email"
              className={styles.fieldInput}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com"
              disabled={submitState === 'submitting'}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor={`phone-${date}-${slot.key}`}>
              Phone
            </label>
            <input
              id={`phone-${date}-${slot.key}`}
              type="tel"
              className={styles.fieldInput}
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="(555) 555-5555"
              disabled={submitState === 'submitting'}
            />
          </div>

          <p className={styles.contactNote}>
            At least one contact method is required so her family can reach you if plans change.
          </p>

          {submitError && (
            <p className={styles.submitError} role="alert">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitState === 'submitting'}
          >
            {submitState === 'submitting' ? 'Signing up…' : 'Sign me up'}
          </button>
        </form>
      )}
    </div>
  )
}
