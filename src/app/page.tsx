import { getAllPosts, getFeaturedPages } from '@/lib/content'
import { formatDate } from '@/lib/format'
import ContentCard from '@/components/ContentCard/ContentCard'
import CardGrid from '@/components/CardGrid/CardGrid'
import styles from './page.module.css'

export default function Home() {
  const featured = getFeaturedPages()
  const posts = getAllPosts()

  return (
    <div>
      <section className={styles.hero}>
        <h1 className={styles.title}>Web Waffle</h1>
        <p className={styles.tagline}>
          Thoughts on product, technology, and the human side of building
          software.
        </p>
      </section>

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
        <h2 className="section-title">Recent Writing</h2>
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
