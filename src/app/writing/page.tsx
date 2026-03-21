import type { Metadata } from 'next'
import { getPublishedPosts, getFeaturedPages } from '@/lib/content'
import PostList from '@/components/PostList/PostList'

export const metadata: Metadata = { title: 'Writing' }

export default function WritingPage() {
  const featured = getFeaturedPages()
  const posts = getPublishedPosts()

  return (
    <div>
      <div className="page-header">
        <h1>Writing</h1>
        <p>
          Essays on product management, technology leadership, and navigating
          the human side of work.
        </p>
      </div>

      <PostList posts={posts} featured={featured} />
    </div>
  )
}
