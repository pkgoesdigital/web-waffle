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
  const [showPublished, setShowPublished] = useState(true)

  const publishedPosts = useMemo(() => posts.filter((p) => p.status === 'publish'), [posts])
  const draftPosts = useMemo(() => posts.filter((p) => p.status === 'draft'), [posts])
  const activePosts = showPublished ? publishedPosts : draftPosts

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return activePosts
    const q = query.toLowerCase()
    return activePosts.filter((p) =>
      [p.title, p.subtitle ?? '', ...p.tags].join(' ').toLowerCase().includes(q)
    )
  }, [activePosts, query])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setVisibleCount(PAGE_SIZE)
  }

  const handleToggle = () => {
    setShowPublished((prev) => !prev)
    setQuery('')
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
        <label className={styles.toggleLabel}>
          <span className={styles.toggleText}>
            {showPublished ? 'Published' : 'Drafts'}
          </span>
          <button
            role="switch"
            aria-checked={showPublished}
            onClick={handleToggle}
            className={`${styles.toggle} ${showPublished ? styles.toggleOn : styles.toggleOff}`}
          >
            <span className={styles.toggleThumb} />
          </button>
        </label>
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
            : showPublished ? 'All Posts' : 'Drafts'}
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
