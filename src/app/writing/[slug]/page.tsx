import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPageOrPost, getAllPosts, getFeaturedPages } from '@/lib/content'
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
  const item = getPageOrPost(slug)
  return { title: item?.title ?? 'Not Found' }
}

export default async function WritingPostPage({ params }: Props) {
  const { slug } = await params
  const item = getPageOrPost(slug)

  if (!item) notFound()

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
        {'status' in item && item.status !== 'publish' && (
          <span className={styles.badge}>{item.status}</span>
        )}
      </header>

      <div className="prose">
        {item.subtitle && <p className={styles.subtitle}>{item.subtitle}</p>}
        {item.content && <p>{item.content}</p>}
        {!item.subtitle && !item.content && (
          <p className={styles.placeholder}>
            Content coming soon. Check back later.
          </p>
        )}
      </div>
    </article>
  )
}
