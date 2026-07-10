/** @jest-environment node */
import { GET } from './route'
import * as db from '@/lib/guestbook-db'
import { POW_DIFFICULTY } from '@/lib/proof-of-work'

jest.mock('@/lib/guestbook-db')

const mocked = db as jest.Mocked<typeof db>

beforeEach(() => {
  jest.resetAllMocks()
  mocked.isGuestbookConfigured.mockReturnValue(true)
  mocked.createChallenge.mockResolvedValue({ id: 'abcd1234-0000-4000-8000-000000000000' })
})

describe('GET /api/guestbook/challenge', () => {
  it('issues a challenge with a random salt and the production difficulty', async () => {
    const response = await GET()
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')

    const json = await response.json()
    expect(json.id).toBe('abcd1234-0000-4000-8000-000000000000')
    expect(json.difficulty).toBe(POW_DIFFICULTY)
    expect(json.salt).toMatch(/^[0-9a-f]{32}$/)

    const storedSalt = mocked.createChallenge.mock.calls[0][0]
    expect(storedSalt).toBe(json.salt)
  })

  it('issues a different salt every time', async () => {
    const first = await (await GET()).json()
    const second = await (await GET()).json()
    expect(first.salt).not.toBe(second.salt)
  })

  it('returns 503 when the database is not configured', async () => {
    mocked.isGuestbookConfigured.mockReturnValue(false)
    const response = await GET()
    expect(response.status).toBe(503)
    expect(mocked.createChallenge).not.toHaveBeenCalled()
  })

  it('returns a generic 500 on database failure', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mocked.createChallenge.mockRejectedValue(new Error('db exploded'))
    const response = await GET()
    expect(response.status).toBe(500)
    expect((await response.json()).error).toBe('Something went wrong.')
    consoleSpy.mockRestore()
  })
})
