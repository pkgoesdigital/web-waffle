import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/content'

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const category = searchParams.get('category')
  const status = searchParams.get('status')

  let posts = getAllPosts()

  if (category) {
    posts = posts.filter((p) => p.categories.includes(category))
  }
  if (status) {
    posts = posts.filter((p) => p.status === status)
  }

  // Return lightweight response without full content
  const lite = posts.map(({ content, ...rest }) => rest)

  return NextResponse.json(lite)
}
