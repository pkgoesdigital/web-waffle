/** @jest-environment node */

const mockSql = jest.fn()

jest.mock('@neondatabase/serverless', () => ({
  neon: jest.fn(() => mockSql),
}))

import {
  consumeChallenge,
  getApprovedEntries,
  hashIp,
  isGuestbookConfigured,
  resetGuestbookDbForTests,
  updateEntryStatus,
} from './guestbook-db'

const ORIGINAL_ENV = process.env

beforeEach(() => {
  jest.clearAllMocks()
  resetGuestbookDbForTests()
  process.env = { ...ORIGINAL_ENV, DATABASE_URL: 'postgres://example' }
})

afterAll(() => {
  process.env = ORIGINAL_ENV
})

describe('isGuestbookConfigured', () => {
  it('reflects the presence of DATABASE_URL', () => {
    expect(isGuestbookConfigured()).toBe(true)
    delete process.env.DATABASE_URL
    expect(isGuestbookConfigured()).toBe(false)
  })
})

describe('getApprovedEntries', () => {
  it('maps rows to the public shape and never exposes ip_hash', async () => {
    mockSql.mockResolvedValue([
      {
        id: '7',
        name: 'Ada',
        message: 'Hello!',
        visiting_from: 'London',
        created_at: '2026-07-01T12:00:00Z',
        ip_hash: 'should-never-escape',
      },
      {
        id: 8,
        name: 'Grace',
        message: 'Hi!',
        visiting_from: null,
        created_at: '2026-07-02T12:00:00Z',
      },
    ])

    const entries = await getApprovedEntries()

    expect(entries[0]).toEqual({
      id: 7,
      name: 'Ada',
      message: 'Hello!',
      visitingFrom: 'London',
      createdAt: '2026-07-01T12:00:00.000Z',
    })
    expect(entries[1].visitingFrom).toBeUndefined()
    expect(JSON.stringify(entries)).not.toContain('should-never-escape')
  })

  it('throws when the database is not configured', async () => {
    delete process.env.DATABASE_URL
    await expect(getApprovedEntries()).rejects.toThrow('DATABASE_URL')
  })
})

describe('consumeChallenge', () => {
  it('short-circuits on malformed ids without touching the database', async () => {
    expect(await consumeChallenge('not-a-uuid')).toBeNull()
    expect(await consumeChallenge("'; DROP TABLE guestbook_entries; --")).toBeNull()
    expect(mockSql).not.toHaveBeenCalled()
  })

  it('returns salt and creation time for a claimable challenge', async () => {
    mockSql.mockResolvedValue([{ salt: 'abc', created_at: '2026-07-01T12:00:00Z' }])
    const result = await consumeChallenge('01234567-89ab-4cde-8f01-23456789abcd')
    expect(result?.salt).toBe('abc')
    expect(result?.createdAt).toBeInstanceOf(Date)
  })

  it('returns null when the challenge was already spent', async () => {
    mockSql.mockResolvedValue([])
    expect(await consumeChallenge('01234567-89ab-4cde-8f01-23456789abcd')).toBeNull()
  })
})

describe('updateEntryStatus', () => {
  it('rejects non-positive and non-integer ids without querying', async () => {
    expect(await updateEntryStatus(0, 'approved')).toBe(false)
    expect(await updateEntryStatus(-5, 'approved')).toBe(false)
    expect(await updateEntryStatus(1.5, 'approved')).toBe(false)
    expect(mockSql).not.toHaveBeenCalled()
  })

  it('reports whether a pending row was updated', async () => {
    mockSql.mockResolvedValue([{ id: 3 }])
    expect(await updateEntryStatus(3, 'approved')).toBe(true)
    mockSql.mockResolvedValue([])
    expect(await updateEntryStatus(3, 'rejected')).toBe(false)
  })
})

describe('hashIp', () => {
  it('produces a stable salted hash that never contains the raw IP', async () => {
    process.env.GUESTBOOK_IP_SALT = 'test-salt'
    const hash = await hashIp('203.0.113.9')
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
    expect(hash).not.toContain('203')
    expect(await hashIp('203.0.113.9')).toBe(hash)
  })

  it('changes with the salt', async () => {
    process.env.GUESTBOOK_IP_SALT = 'salt-one'
    const first = await hashIp('203.0.113.9')
    process.env.GUESTBOOK_IP_SALT = 'salt-two'
    expect(await hashIp('203.0.113.9')).not.toBe(first)
  })
})
