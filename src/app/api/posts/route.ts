import { NextRequest, NextResponse } from 'next/server'
import { getPublishedPosts } from '@/lib/content'
import type { PaginatedResult, PostMeta } from '@/lib/types'

const VALID_STATUSES = new Set(['publish', 'draft', 'trash'])

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const category = searchParams.get('category')
  const status = searchParams.get('status')

  if (status && !VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const pageParam = parseInt(searchParams.get('page') ?? '1', 10)
  const limitParam = parseInt(searchParams.get('limit') ?? '20', 10)

  if (!Number.isFinite(pageParam) || !Number.isFinite(limitParam)) {
    return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 })
  }

  const page = Math.max(1, pageParam)
  const limit = Math.min(100, Math.max(1, limitParam))

  let posts = getPublishedPosts()

  if (category) {
    posts = posts.filter((p) => p.categories.includes(category))
  }
  if (status) {
    posts = posts.filter((p) => p.status === status)
  }

  const total = posts.length
  const start = (page - 1) * limit
  const items = posts.slice(start, start + limit)

  const result: PaginatedResult<PostMeta> = {
    items,
    total,
    page,
    limit,
    hasMore: start + limit < total,
  }

  const response = NextResponse.json(result)
  // Cache at the CDN edge for 60s to reduce origin hits
  response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  return response
}
