import { NextResponse } from 'next/server'
import { GuestbookValidationError, parseGuestbookSubmission } from '@/lib/guestbook'
import {
  consumeChallenge,
  countRecentByIp,
  countRecentTotal,
  getApprovedEntries,
  hashIp,
  insertPendingEntry,
  isGuestbookConfigured,
} from '@/lib/guestbook-db'
import { MIN_CHALLENGE_AGE_MS, POW_DIFFICULTY, verifyPow } from '@/lib/proof-of-work'

export const dynamic = 'force-dynamic'

const MAX_BODY_BYTES = 8192
const RATE_WINDOW_MINUTES = 60
const PER_IP_LIMIT = 3
const GLOBAL_LIMIT = 30

export async function GET() {
  if (!isGuestbookConfigured()) {
    const response = NextResponse.json({ entries: [] })
    response.headers.set('Cache-Control', 'no-store')
    return response
  }

  try {
    const entries = await getApprovedEntries()
    const response = NextResponse.json({ entries })
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch (error) {
    console.error('guestbook read failed:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}

function clientIp(request: Request): string {
  // Vercel sets x-forwarded-for; the first hop is the client address.
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

export async function POST(request: Request) {
  if (!isGuestbookConfigured()) {
    return NextResponse.json({ error: 'The guestbook is not available right now.' }, { status: 503 })
  }

  try {
    const rawBody = await request.text()
    if (rawBody.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Submission too large.' }, { status: 413 })
    }

    let body: Record<string, unknown>
    try {
      body = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 })
    }
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 })
    }

    // Honeypot: the hidden "website" field must stay empty. Bots that fill it
    // get a success response and a silent discard, so they learn nothing.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ status: 'pending' }, { status: 201 })
    }

    let submission
    try {
      submission = parseGuestbookSubmission(body)
    } catch (error) {
      if (error instanceof GuestbookValidationError) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      throw error
    }

    const { challengeId, nonce } = body
    if (typeof challengeId !== 'string' || typeof nonce !== 'number') {
      return NextResponse.json(
        { error: 'Verification failed — please try again.' },
        { status: 400 }
      )
    }

    const challenge = await consumeChallenge(challengeId)
    if (!challenge) {
      return NextResponse.json(
        { error: 'Verification expired — please try again.' },
        { status: 400 }
      )
    }

    // Time trap: the challenge's creation time is a server-side clock a bot
    // cannot forge. Humans take longer than this to write a note.
    if (Date.now() - challenge.createdAt.getTime() < MIN_CHALLENGE_AGE_MS) {
      return NextResponse.json(
        { error: 'Please take a moment before submitting.' },
        { status: 400 }
      )
    }

    if (!(await verifyPow(challenge.salt, nonce, POW_DIFFICULTY))) {
      return NextResponse.json(
        { error: 'Verification failed — please try again.' },
        { status: 400 }
      )
    }

    const ipHash = await hashIp(clientIp(request))
    if ((await countRecentByIp(ipHash, RATE_WINDOW_MINUTES)) >= PER_IP_LIMIT) {
      return NextResponse.json(
        { error: 'You have signed a few times recently — please try again later.' },
        { status: 429 }
      )
    }
    if ((await countRecentTotal(RATE_WINDOW_MINUTES)) >= GLOBAL_LIMIT) {
      return NextResponse.json(
        { error: 'The guestbook is busy right now — please try again later.' },
        { status: 429 }
      )
    }

    await insertPendingEntry({ ...submission, ipHash })
    return NextResponse.json({ status: 'pending' }, { status: 201 })
  } catch (error) {
    console.error('guestbook submission failed:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
