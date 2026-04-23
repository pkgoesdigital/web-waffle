import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'cpw-auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const password = formData.get('password')
  const from = formData.get('from') as string | null

  const expected = process.env.CPW_PASSWORD
  if (!expected || password !== expected) {
    const loginUrl = new URL('/cpw-neighborhood-watch/login', request.url)
    loginUrl.searchParams.set('error', '1')
    if (from) loginUrl.searchParams.set('from', from)
    return NextResponse.redirect(loginUrl, { status: 303 })
  }

  const destination = from && from.startsWith('/cpw-neighborhood-watch')
    ? from
    : '/cpw-neighborhood-watch'

  const response = NextResponse.redirect(new URL(destination, request.url), { status: 303 })
  response.cookies.set(COOKIE_NAME, 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
  return response
}
