import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Guestbook from './Guestbook'

// jsdom has no WebCrypto; the solver is unit-tested separately. Zeroing the
// minimum challenge age keeps tests from waiting out the human time trap.
jest.mock('@/lib/proof-of-work', () => ({
  MIN_CHALLENGE_AGE_MS: 0,
  solvePow: jest.fn(async () => 42),
}))

const CHALLENGE = { id: '01234567-89ab-4cde-8f01-23456789abcd', salt: 'abc', difficulty: 16 }

const ENTRIES = [
  {
    id: 1,
    name: 'Ada',
    message: 'Wonderful site!',
    visitingFrom: 'London',
    createdAt: '2026-07-01T12:00:00.000Z',
  },
  { id: 2, name: 'Grace', message: 'Hello from the navy.', createdAt: '2026-06-20T12:00:00.000Z' },
]

type FetchCall = { url: string; init?: RequestInit }

let fetchCalls: FetchCall[]

function mockFetch({
  entries = ENTRIES,
  postStatus = 201,
  postBody = { status: 'pending' } as Record<string, unknown>,
} = {}) {
  fetchCalls = []
  global.fetch = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    fetchCalls.push({ url, init })
    if (url.endsWith('/api/guestbook/challenge')) {
      return { ok: true, status: 200, json: async () => CHALLENGE } as Response
    }
    if (url.endsWith('/api/guestbook') && init?.method === 'POST') {
      return { ok: postStatus < 400, status: postStatus, json: async () => postBody } as Response
    }
    return { ok: true, status: 200, json: async () => ({ entries }) } as Response
  }) as typeof fetch
}

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Paula Fan')
  await user.type(screen.getByLabelText('Your note'), 'Really enjoyed the writing here.')
  await user.click(screen.getByRole('button', { name: 'Sign the guestbook' }))
}

describe('Guestbook', () => {
  it('renders approved entries with name, origin, and message', async () => {
    mockFetch()
    render(<Guestbook />)

    expect(await screen.findByText('Wonderful site!')).toBeInTheDocument()
    expect(screen.getByText('Ada')).toBeInTheDocument()
    expect(screen.getByText(/London/)).toBeInTheDocument()
    expect(screen.getByText('Hello from the navy.')).toBeInTheDocument()
  })

  it('shows an empty state when there are no entries', async () => {
    mockFetch({ entries: [] })
    render(<Guestbook />)
    expect(await screen.findByText(/no notes yet/i)).toBeInTheDocument()
  })

  it('shows a graceful message when loading fails', async () => {
    global.fetch = jest.fn(async () => ({ ok: false, status: 500 }) as Response) as typeof fetch
    render(<Guestbook />)
    expect(await screen.findByText(/notes are unavailable/i)).toBeInTheDocument()
  })

  it('prefetches a challenge when a field is first focused', async () => {
    mockFetch()
    const user = userEvent.setup()
    render(<Guestbook />)
    await screen.findByText('Wonderful site!')

    await user.click(screen.getByLabelText('Name'))

    await waitFor(() => {
      expect(fetchCalls.filter((c) => c.url.endsWith('/challenge'))).toHaveLength(1)
    })

    // Focusing again must not burn another challenge.
    await user.click(screen.getByLabelText('Your note'))
    expect(fetchCalls.filter((c) => c.url.endsWith('/challenge'))).toHaveLength(1)
  })

  it('submits with the solved proof of work and an empty honeypot', async () => {
    mockFetch()
    const user = userEvent.setup()
    render(<Guestbook />)
    await screen.findByText('Wonderful site!')

    await fillAndSubmit(user)

    expect(
      await screen.findByText(/your note is awaiting review/i)
    ).toBeInTheDocument()

    const post = fetchCalls.find((c) => c.init?.method === 'POST')
    expect(post).toBeDefined()
    const payload = JSON.parse(String(post?.init?.body))
    expect(payload).toMatchObject({
      name: 'Paula Fan',
      message: 'Really enjoyed the writing here.',
      website: '',
      challengeId: CHALLENGE.id,
      nonce: 42,
    })
  })

  it('clears the form after a successful submission', async () => {
    mockFetch()
    const user = userEvent.setup()
    render(<Guestbook />)
    await screen.findByText('Wonderful site!')

    await fillAndSubmit(user)
    await screen.findByText(/awaiting review/i)

    expect(screen.getByLabelText('Name')).toHaveValue('')
    expect(screen.getByLabelText('Your note')).toHaveValue('')
  })

  it('surfaces server rejection messages', async () => {
    mockFetch({ postStatus: 429, postBody: { error: 'Please try again later.' } })
    const user = userEvent.setup()
    render(<Guestbook />)
    await screen.findByText('Wonderful site!')

    await fillAndSubmit(user)

    expect(await screen.findByText('Please try again later.')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveValue('Paula Fan')
  })

  it('hides the honeypot from assistive tech and the tab order', async () => {
    mockFetch()
    const { container } = render(<Guestbook />)
    await screen.findByText('Wonderful site!')

    const honeypot = container.querySelector('input[name="website"]') as HTMLInputElement
    expect(honeypot).not.toBeNull()
    expect(honeypot.tabIndex).toBe(-1)
    expect(honeypot.closest('[aria-hidden="true"]')).not.toBeNull()
  })
})
