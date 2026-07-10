import { NextResponse } from 'next/server'
import { createChallenge, isGuestbookConfigured } from '@/lib/guestbook-db'
import { POW_DIFFICULTY } from '@/lib/proof-of-work'

// Every challenge is a fresh DB row; this route must never be prerendered.
export const dynamic = 'force-dynamic'

export async function GET() {
  if (!isGuestbookConfigured()) {
    return NextResponse.json({ error: 'The guestbook is not available right now.' }, { status: 503 })
  }

  try {
    const saltBytes = new Uint8Array(16)
    globalThis.crypto.getRandomValues(saltBytes)
    const salt = Array.from(saltBytes)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')

    const { id } = await createChallenge(salt)

    const response = NextResponse.json({ id, salt, difficulty: POW_DIFFICULTY })
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch (error) {
    console.error('guestbook challenge creation failed:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
