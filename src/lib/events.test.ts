import type { CPWEvent } from './types'

function makeEventFile(overrides: Record<string, unknown> = {}): string {
  const fields = {
    id: '1',
    title: 'Test Meeting',
    slug: '2026-05-01-test-meeting',
    date: '2026-05-01',
    time: '6:00 PM',
    location: 'Community Center',
    type: 'meeting',
    status: 'confirmed',
    description: 'A test meeting.',
    source: 'DPD email',
    ...overrides,
  }
  const frontmatter = Object.entries(fields)
    .map(([k, v]) => `${k}: "${v}"`)
    .join('\n')
  return `---\n${frontmatter}\n---\n\nBody content.`
}

// Runs events.ts in isolation with controlled fs mocks — bypasses module-level cache.
function withEvents<T>(
  fsMocks: {
    existsSync?: boolean
    files?: string[]
    fileContents?: string | string[]
  },
  run: (mod: typeof import('./events')) => T
): T {
  let result!: T
  jest.isolateModules(() => {
    const { existsSync = true, files = [], fileContents = '' } = fsMocks
    const contents = Array.isArray(fileContents) ? fileContents : [fileContents]
    let callCount = 0

    jest.mock('fs', () => ({
      existsSync: jest.fn().mockReturnValue(existsSync),
      readdirSync: jest.fn().mockReturnValue(files),
      readFileSync: jest.fn().mockImplementation(() => contents[callCount++ % contents.length] ?? ''),
    }))

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('./events') as typeof import('./events')
    result = run(mod)
  })
  return result
}

describe('parseEventFrontmatter (via getEvents)', () => {
  it('parses a valid event file', () => {
    const events = withEvents(
      { files: ['2026-05-01-test-meeting.md'], fileContents: makeEventFile() },
      (m) => m.getEvents()
    )
    expect(events).toHaveLength(1)
    expect(events[0].title).toBe('Test Meeting')
    expect(events[0].type).toBe('meeting')
    expect(events[0].status).toBe('confirmed')
    expect(events[0].date).toBe('2026-05-01')
  })

  it('falls back to "other" type for unknown values', () => {
    const events = withEvents(
      { files: ['2026-05-01-test.md'], fileContents: makeEventFile({ type: 'unknown-type' }) },
      (m) => m.getEvents()
    )
    expect(events[0].type).toBe('other')
  })

  it('falls back to "tentative" status for unknown values', () => {
    const events = withEvents(
      { files: ['2026-05-01-test.md'], fileContents: makeEventFile({ status: 'unknown' }) },
      (m) => m.getEvents()
    )
    expect(events[0].status).toBe('tentative')
  })
})

describe('getEvents', () => {
  it('returns events sorted chronologically ascending', () => {
    const events = withEvents(
      {
        files: ['2026-06-01-later.md', '2026-05-01-earlier.md'],
        fileContents: [
          makeEventFile({ date: '2026-06-01', slug: '2026-06-01-later' }),
          makeEventFile({ date: '2026-05-01', slug: '2026-05-01-earlier' }),
        ],
      },
      (m) => m.getEvents()
    )
    expect(events[0].date).toBe('2026-05-01')
    expect(events[1].date).toBe('2026-06-01')
  })

  it('excludes cancelled events', () => {
    const events = withEvents(
      {
        files: ['2026-05-01-active.md', '2026-05-02-cancelled.md'],
        fileContents: [
          makeEventFile({ status: 'confirmed', slug: '2026-05-01-active' }),
          makeEventFile({ status: 'cancelled', slug: '2026-05-02-cancelled' }),
        ],
      },
      (m) => m.getEvents()
    )
    expect(events).toHaveLength(1)
    expect(events[0].slug).toBe('2026-05-01-active')
  })

  it('returns empty array when events directory does not exist', () => {
    const events = withEvents({ existsSync: false }, (m) => m.getEvents())
    expect(events).toEqual([])
  })
})

describe('getUpcomingEvents', () => {
  it('filters events within the next N months', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-04-22').getTime())

    const events = withEvents(
      {
        files: ['2026-05-01-soon.md', '2027-01-01-far.md'],
        fileContents: [
          makeEventFile({ date: '2026-05-01', slug: '2026-05-01-soon' }),
          makeEventFile({ date: '2027-01-01', slug: '2027-01-01-far' }),
        ],
      },
      (m) => m.getUpcomingEvents(2)
    )

    expect(events).toHaveLength(1)
    expect(events[0].slug).toBe('2026-05-01-soon')

    jest.useRealTimers()
  })
})

describe('getEventsForMonth', () => {
  it('returns events matching the given year and month (0-indexed)', () => {
    const events = withEvents(
      {
        files: ['2026-04-28-april.md', '2026-05-01-may.md'],
        fileContents: [
          makeEventFile({ date: '2026-04-28', slug: '2026-04-28-april' }),
          makeEventFile({ date: '2026-05-01', slug: '2026-05-01-may' }),
        ],
      },
      (m) => m.getEventsForMonth(2026, 3) // month 3 = April (0-indexed)
    )
    expect(events).toHaveLength(1)
    expect(events[0].slug).toBe('2026-04-28-april')
  })

  it('includes cancelled events (unlike getEvents)', () => {
    const events = withEvents(
      {
        files: ['2026-04-28-cancelled.md'],
        fileContents: [makeEventFile({ date: '2026-04-28', status: 'cancelled', slug: '2026-04-28-cancelled' })],
      },
      (m) => m.getEventsForMonth(2026, 3)
    )
    expect(events).toHaveLength(1)
    expect(events[0].status).toBe('cancelled')
  })

  it('returns empty array when no events match the month', () => {
    const events = withEvents(
      {
        files: ['2026-05-01-may.md'],
        fileContents: [makeEventFile({ date: '2026-05-01', slug: '2026-05-01-may' })],
      },
      (m) => m.getEventsForMonth(2026, 3) // April — no match
    )
    expect(events).toHaveLength(0)
  })
})

describe('getEventBySlug', () => {
  it('returns full event with content for a known slug', async () => {
    let event: CPWEvent | undefined
    await new Promise<void>((resolve) => {
      jest.isolateModules(async () => {
        jest.mock('fs', () => ({
          existsSync: jest.fn().mockReturnValue(true),
          readdirSync: jest.fn().mockReturnValue(['2026-05-01-test-meeting.md']),
          readFileSync: jest.fn().mockReturnValue(makeEventFile()),
        }))
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require('./events') as typeof import('./events')
        event = await mod.getEventBySlug('2026-05-01-test-meeting')
        resolve()
      })
    })

    expect(event).toBeDefined()
    expect(event?.title).toBe('Test Meeting')
    expect(event?.content).toContain('Body content.')
  })

  it('returns undefined for an unknown slug', async () => {
    let event: CPWEvent | undefined
    await new Promise<void>((resolve) => {
      jest.isolateModules(async () => {
        jest.mock('fs', () => ({
          existsSync: jest.fn().mockReturnValue(true),
          readdirSync: jest.fn().mockReturnValue([]),
          readFileSync: jest.fn().mockReturnValue(''),
        }))
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require('./events') as typeof import('./events')
        event = await mod.getEventBySlug('does-not-exist')
        resolve()
      })
    })

    expect(event).toBeUndefined()
  })
})
