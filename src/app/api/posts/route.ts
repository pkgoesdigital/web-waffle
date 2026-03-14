import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/content'
import type { PaginatedResult, PostMeta } from '@/lib/types'

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const category = searchParams.get('category')
  const status = searchParams.get('status')
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10))
  )

  let posts = getAllPosts()

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

  return NextResponse.json(result)
}
