'use client'

import { useState, useMemo } from 'react'
import type { PostMeta, PageMeta } from '@/lib/types'
import { formatDate } from '@/lib/format'
import ContentCard from '@/components/ContentCard/ContentCard'
import CardGrid from '@/components/CardGrid/CardGrid'
import styles from './PostList.module.css'

const PAGE_SIZE = 12

type PostListProps = {
  posts: PostMeta[]
  featured: PageMeta[]
}

export default function PostList({ posts, featured }: PostListProps) {
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return posts
    const q = query.toLowerCase()
    return posts.filter((p) =>
      [p.title, p.subtitle ?? '', ...p.tags].join(' ').toLowerCase().includes(q)
    )
  }, [posts, query])

  // Reset pagination when the search query changes
  const handleQueryChange = (value: string) => {
    setQuery(value)
    setVisibleCount(PAGE_SIZE)
  }

  const visiblePosts = filteredPosts.slice(0, visibleCount)
  const hasMore = filteredPosts.length > visibleCount

  return (
    <>
      <div className={styles.searchWrapper}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search posts…"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          aria-label="Search posts"
        />
      </div>

      {!query && featured.length > 0 && (
        <section className="section">
          <h2 className="section-title">Highlights</h2>
          <CardGrid>
            {featured.map((page, i) => (
              <ContentCard
                key={page.slug}
                href={`/writing/${page.slug}`}
                title={page.title}
                subtitle={page.subtitle}
                date={formatDate(page.date)}
                index={i}
              />
            ))}
          </CardGrid>
        </section>
      )}

      <section className="section">
        <h2 className="section-title">
          {query
            ? `${filteredPosts.length} result${filteredPosts.length !== 1 ? 's' : ''}`
            : 'All Posts'}
        </h2>

        {visiblePosts.length > 0 ? (
          <CardGrid>
            {visiblePosts.map((post, i) => (
              <ContentCard
                key={post.id}
                href={`/writing/${post.slug}`}
                title={post.title}
                subtitle={post.subtitle}
                date={formatDate(post.date)}
                index={i + (query ? 0 : featured.length)}
                status={post.status}
              />
            ))}
          </CardGrid>
        ) : (
          <p className={styles.empty}>No posts match &ldquo;{query}&rdquo;.</p>
        )}

        {hasMore && (
          <div className={styles.loadMoreWrapper}>
            <button
              className={styles.loadMore}
              onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            >
              Load more ({filteredPosts.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </section>
    </>
  )
}
