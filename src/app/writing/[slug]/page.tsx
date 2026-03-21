import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPageOrPost, getAllPosts, getFeaturedPages } from '@/lib/content'
import { markdownToHtml } from '@/lib/markdown'
import { formatDate } from '@/lib/format'
import styles from './page.module.css'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = getAllPosts()
  const featured = getFeaturedPages()
  return [
    ...posts.map((p) => ({ slug: p.slug })),
    ...featured.map((p) => ({ slug: p.slug })),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = await getPageOrPost(slug)
  return { title: item?.title ?? 'Not Found' }
}

export default async function WritingPostPage({ params }: Props) {
  const { slug } = await params
  const item = await getPageOrPost(slug)

  if (!item) notFound()

  const html = item.content ? await markdownToHtml(item.content) : ''

  return (
    <article className={styles.article}>
      <Link href="/writing" className={styles.back}>
        &larr; Back to Writing
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{item.title}</h1>
        {item.date && (
          <time className={styles.date}>{formatDate(item.date)}</time>
        )}
        {'tags' in item && item.tags.length > 0 && (
          <ul className={styles.tags}>
            {item.tags.map((tag) => (
              <li key={tag} className={styles.tag}>{tag}</li>
            ))}
          </ul>
        )}
        {'status' in item && item.status !== 'publish' && (
          <span className={styles.badge}>{item.status}</span>
        )}
      </header>

      <div className="prose">
        {item.subtitle && <p className={styles.subtitle}>{item.subtitle}</p>}
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <p className={styles.placeholder}>
            Content coming soon. Check back later.
          </p>
        )}
      </div>
    </article>
  )
}
