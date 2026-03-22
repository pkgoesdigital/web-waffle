import type { Metadata } from 'next'
import { getAllPosts, getFeaturedPages } from '@/lib/content'
import PostList from '@/components/PostList/PostList'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Writing' }

export default function WritingPage() {
  const featured = getFeaturedPages()
  const posts = getAllPosts()

  return (
    <div className={styles.page}>
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
