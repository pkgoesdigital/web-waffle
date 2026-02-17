import type { Metadata } from 'next'
import { getAllPosts, getFeaturedPages } from '@/lib/content'
import { formatDate } from '@/lib/format'
import ContentCard from '@/components/ContentCard/ContentCard'
import CardGrid from '@/components/CardGrid/CardGrid'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Writing' }

export default function WritingPage() {
  const featured = getFeaturedPages()
  const posts = getAllPosts()

  return (
    <div>
      <div className="page-header">
        <h1>Writing</h1>
        <p>
          Essays on product management, technology leadership, and navigating
          the human side of work.
        </p>
      </div>

      {featured.length > 0 && (
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
        <h2 className="section-title">All Posts</h2>
        <CardGrid>
          {posts.map((post, i) => (
            <ContentCard
              key={post.id}
              href={`/writing/${post.slug}`}
              title={post.title}
              subtitle={post.subtitle}
              date={formatDate(post.date)}
              index={i + featured.length}
              status={post.status}
            />
          ))}
        </CardGrid>
      </section>
    </div>
  )
}
