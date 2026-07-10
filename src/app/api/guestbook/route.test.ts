/** @jest-environment node */
import { GET, POST } from './route'
import * as db from '@/lib/guestbook-db'
import { MIN_CHALLENGE_AGE_MS, POW_DIFFICULTY, solvePow } from '@/lib/proof-of-work'

jest.mock('@/lib/guestbook-db')

const mocked = db as jest.Mocked<typeof db>

const TEST_SALT = 'route-test-salt'
let validNonce: number

beforeAll(async () => {
  validNonce = await solvePow(TEST_SALT, POW_DIFFICULTY)
}, 30000)

function makePost(body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return new Request('http://localhost/api/guestbook', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
}

const validBody = () => ({
  name: 'Ada',
  message: 'What a lovely corner of the internet.',
  website: '',
  challengeId: '01234567-89ab-4cde-8f01-23456789abcd',
  nonce: validNonce,
})

function freshChallenge() {
  return {
    salt: TEST_SALT,
    createdAt: new Date(Date.now() - MIN_CHALLENGE_AGE_MS - 1000),
  }
}

beforeEach(() => {
  jest.resetAllMocks()
  mocked.isGuestbookConfigured.mockReturnValue(true)
  mocked.consumeChallenge.mockResolvedValue(freshChallenge())
  mocked.hashIp.mockResolvedValue('hashed-ip')
  mocked.countRecentByIp.mockResolvedValue(0)
  mocked.countRecentTotal.mockResolvedValue(0)
  mocked.insertPendingEntry.mockResolvedValue(undefined)
  mocked.getApprovedEntries.mockResolvedValue([])
})

describe('GET /api/guestbook', () => {
  it('returns approved entries with no-store caching', async () => {
    mocked.getApprovedEntries.mockResolvedValue([
      { id: 1, name: 'Ada', message: 'Hi!', createdAt: '2026-07-01T00:00:00.000Z' },
    ])
    const response = await GET()
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    const json = await response.json()
    expect(json.entries).toHaveLength(1)
    expect(json.entries[0]).not.toHaveProperty('ipHash')
    expect(json.entries[0]).not.toHaveProperty('status')
  })

  it('returns an empty list when the database is not configured', async () => {
    mocked.isGuestbookConfigured.mockReturnValue(false)
    const response = await GET()
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ entries: [] })
    expect(mocked.getApprovedEntries).not.toHaveBeenCalled()
  })
})

describe('POST /api/guestbook', () => {
  it('accepts a valid submission as pending', async () => {
    const response = await POST(makePost(validBody(), { 'x-forwarded-for': '203.0.113.9' }))
    expect(response.status).toBe(201)
    expect(await response.json()).toEqual({ status: 'pending' })
    expect(mocked.insertPendingEntry).toHaveBeenCalledWith({
      name: 'Ada',
      message: 'What a lovely corner of the internet.',
      ipHash: 'hashed-ip',
    })
    expect(mocked.hashIp).toHaveBeenCalledWith('203.0.113.9')
  })

  it('returns 503 when the database is not configured', async () => {
    mocked.isGuestbookConfigured.mockReturnValue(false)
    const response = await POST(makePost(validBody()))
    expect(response.status).toBe(503)
  })

  it('silently discards honeypot submissions with a fake success', async () => {
    const response = await POST(makePost({ ...validBody(), website: 'http://spam.example' }))
    expect(response.status).toBe(201)
    expect(mocked.insertPendingEntry).not.toHaveBeenCalled()
    expect(mocked.consumeChallenge).not.toHaveBeenCalled()
  })

  it('rejects invalid JSON', async () => {
    const request = new Request('http://localhost/api/guestbook', {
      method: 'POST',
      body: 'not json',
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('rejects oversized bodies', async () => {
    const response = await POST(makePost({ ...validBody(), padding: 'x'.repeat(10000) }))
    expect(response.status).toBe(413)
    expect(mocked.insertPendingEntry).not.toHaveBeenCalled()
  })

  it('rejects validation failures with the safe message', async () => {
    const response = await POST(
      makePost({ ...validBody(), message: 'visit https://spam.example now' })
    )
    expect(response.status).toBe(400)
    expect((await response.json()).error).toBe('Links are not allowed in guestbook notes.')
    expect(mocked.insertPendingEntry).not.toHaveBeenCalled()
  })

  it('rejects a missing or non-numeric proof of work', async () => {
    const response = await POST(makePost({ ...validBody(), nonce: 'abc' }))
    expect(response.status).toBe(400)
    expect(mocked.insertPendingEntry).not.toHaveBeenCalled()
  })

  it('rejects a spent or expired challenge', async () => {
    mocked.consumeChallenge.mockResolvedValue(null)
    const response = await POST(makePost(validBody()))
    expect(response.status).toBe(400)
    expect((await response.json()).error).toContain('expired')
  })

  it('rejects submissions faster than the time trap', async () => {
    mocked.consumeChallenge.mockResolvedValue({ salt: TEST_SALT, createdAt: new Date() })
    const response = await POST(makePost(validBody()))
    expect(response.status).toBe(400)
    expect((await response.json()).error).toContain('take a moment')
    expect(mocked.insertPendingEntry).not.toHaveBeenCalled()
  })

  it('rejects an incorrect proof-of-work solution', async () => {
    const response = await POST(makePost({ ...validBody(), nonce: validNonce + 1 }))
    expect(response.status).toBe(400)
    expect(mocked.insertPendingEntry).not.toHaveBeenCalled()
  })

  it('enforces the per-IP rate limit', async () => {
    mocked.countRecentByIp.mockResolvedValue(3)
    const response = await POST(makePost(validBody()))
    expect(response.status).toBe(429)
    expect(mocked.insertPendingEntry).not.toHaveBeenCalled()
  })

  it('enforces the global rate limit', async () => {
    mocked.countRecentTotal.mockResolvedValue(30)
    const response = await POST(makePost(validBody()))
    expect(response.status).toBe(429)
    expect(mocked.insertPendingEntry).not.toHaveBeenCalled()
  })

  it('never passes the raw IP to storage', async () => {
    await POST(makePost(validBody(), { 'x-forwarded-for': '203.0.113.9, 10.0.0.1' }))
    const inserted = mocked.insertPendingEntry.mock.calls[0][0]
    expect(JSON.stringify(inserted)).not.toContain('203.0.113.9')
    expect(inserted.ipHash).toBe('hashed-ip')
  })

  it('returns a generic 500 when the database fails, without leaking details', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mocked.insertPendingEntry.mockRejectedValue(new Error('connection refused to db.internal'))
    const response = await POST(makePost(validBody()))
    expect(response.status).toBe(500)
    expect((await response.json()).error).toBe('Something went wrong.')
    consoleSpy.mockRestore()
  })
})
