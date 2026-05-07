import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getNewsletterBySlug, getPublishedNewsletters } from '@/lib/newsletters'
import { markdownToHtml } from '@/lib/markdown'
import styles from './page.module.css'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getPublishedNewsletters().map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const newsletter = await getNewsletterBySlug(slug)
  if (!newsletter) return {}
  return { title: newsletter.title }
}

export default async function NewsletterPostPage({ params }: Props) {
  const { slug } = await params
  const newsletter = await getNewsletterBySlug(slug)
  if (!newsletter) notFound()

  const html = await markdownToHtml(newsletter.content)

  return (
    <div className={styles.container}>
      <div className="page-header">
        <p className={styles.period}>{newsletter.period}</p>
        <h1>{newsletter.title}</h1>
      </div>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
