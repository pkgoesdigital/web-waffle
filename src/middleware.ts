import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PREFIX = '/cpw-neighborhood-watch'
const LOGIN_PATH = '/cpw-neighborhood-watch/login'
const AUTH_COOKIE = 'cpw-auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next()
  }

  if (pathname === LOGIN_PATH || pathname.startsWith(LOGIN_PATH + '/')) {
    return NextResponse.next()
  }

  const authCookie = request.cookies.get(AUTH_COOKIE)
  if (authCookie?.value === 'true') {
    return NextResponse.next()
  }

  const loginUrl = new URL(LOGIN_PATH, request.url)
  loginUrl.searchParams.set('from', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/cpw-neighborhood-watch/:path*'],
}
