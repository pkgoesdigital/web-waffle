import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { NewsletterMeta, Newsletter } from './types'

const NEWSLETTERS_DIR = path.join(process.cwd(), 'src', 'content', 'newsletters')

let newsletterIndex: NewsletterMeta[] | null = null

function parseNewsletterFrontmatter(
  data: Record<string, unknown>,
  slug: string
): NewsletterMeta {
  return {
    id: String(data.id ?? ''),
    title: String(data.title ?? slug),
    slug: String(data.slug ?? slug),
    date: String(data.date ?? ''),
    period: String(data.period ?? ''),
    status: data.status === 'draft' ? 'draft' : 'published',
  }
}

function buildNewsletterIndex(): NewsletterMeta[] {
  if (!fs.existsSync(NEWSLETTERS_DIR)) return []

  const files = fs.readdirSync(NEWSLETTERS_DIR).filter((f) => f.endsWith('.md'))

  const newsletters = files.map((file) => {
    const slug = path.basename(file, '.md')
    const raw = fs.readFileSync(path.join(NEWSLETTERS_DIR, file), 'utf-8')
    const { data } = matter(raw)
    return parseNewsletterFrontmatter(data as Record<string, unknown>, slug)
  })

  return newsletters.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

function getNewsletterIndex(): NewsletterMeta[] {
  if (!newsletterIndex) newsletterIndex = buildNewsletterIndex()
  return newsletterIndex
}

export function getPublishedNewsletters(): NewsletterMeta[] {
  return getNewsletterIndex().filter((n) => n.status === 'published')
}

export async function getNewsletterBySlug(slug: string): Promise<Newsletter | undefined> {
  const meta = getNewsletterIndex().find((n) => n.slug === slug)
  if (!meta) return undefined

  const filePath = path.join(NEWSLETTERS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return undefined

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { content } = matter(raw)
  return { ...meta, content }
}
