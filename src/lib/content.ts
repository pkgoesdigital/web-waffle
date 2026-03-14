import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Post, PostMeta, Page, PageMeta, SocialLink } from './types'
import socialLinksData from '@/data/social-links.json'

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'posts')
const PAGES_DIR = path.join(process.cwd(), 'src', 'content', 'pages')

// ── In-memory index caches ───────────────────────────────────────────────────
// Populated once on first access per server process / build.
// Only metadata is stored — content bodies are read on demand.

let postIndex: PostMeta[] | null = null
let pageIndex: PageMeta[] | null = null

// ── Frontmatter parsers ──────────────────────────────────────────────────────

function parsePostFrontmatter(
  data: Record<string, unknown>,
  slug: string
): PostMeta {
  return {
    id: String(data.id ?? ''),
    title: String(data.title ?? slug),
    slug: String(data.slug ?? slug),
    date: String(data.date ?? ''),
    subtitle: data.subtitle ? String(data.subtitle) : undefined,
    status: (['publish', 'draft', 'trash'].includes(String(data.status))
      ? data.status
      : 'draft') as PostMeta['status'],
    categories: Array.isArray(data.categories)
      ? (data.categories as unknown[]).map(String)
      : [],
    tags: Array.isArray(data.tags) ? (data.tags as unknown[]).map(String) : [],
  }
}

function parsePageFrontmatter(
  data: Record<string, unknown>,
  slug: string
): PageMeta {
  return {
    id: String(data.id ?? ''),
    title: String(data.title ?? slug),
    slug: String(data.slug ?? slug),
    date: String(data.date ?? ''),
    subtitle: data.subtitle ? String(data.subtitle) : undefined,
    status: String(data.status ?? 'publish'),
    featured: Boolean(data.featured),
  }
}

// ── Index builders ────────────────────────────────────────────────────────────

function buildPostIndex(): PostMeta[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))

  const posts = files.map((file) => {
    const slug = path.basename(file, '.md')
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
    const { data } = matter(raw)
    return parsePostFrontmatter(data as Record<string, unknown>, slug)
  })

  // Sort newest first
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

function buildPageIndex(): PageMeta[] {
  const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.md'))

  return files.map((file) => {
    const slug = path.basename(file, '.md')
    const raw = fs.readFileSync(path.join(PAGES_DIR, file), 'utf-8')
    const { data } = matter(raw)
    return parsePageFrontmatter(data as Record<string, unknown>, slug)
  })
}

function getPostIndex(): PostMeta[] {
  if (!postIndex) postIndex = buildPostIndex()
  return postIndex
}

function getPageIndex(): PageMeta[] {
  if (!pageIndex) pageIndex = buildPageIndex()
  return pageIndex
}

// ── Public API — synchronous (metadata only) ─────────────────────────────────

export function getAllPosts(): PostMeta[] {
  return getPostIndex().filter((p) => p.status !== 'trash')
}

export function getPublishedPosts(): PostMeta[] {
  return getPostIndex().filter((p) => p.status === 'publish')
}

export function getFeaturedPages(): PageMeta[] {
  return getPageIndex().filter((p) => p.featured)
}

export function getSocialLinks(): SocialLink[] {
  return socialLinksData as SocialLink[]
}

// ── Public API — async (reads full content on demand) ───────────────────────

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const meta = getPostIndex().find((p) => p.slug === slug)
  if (!meta) return undefined

  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return undefined

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { content } = matter(raw)
  return { ...meta, content }
}

export async function getPage(slug: string): Promise<Page | undefined> {
  const meta = getPageIndex().find((p) => p.slug === slug)
  if (!meta) return undefined

  const filePath = path.join(PAGES_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return undefined

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { content } = matter(raw)
  return { ...meta, content }
}

export async function getPageOrPost(
  slug: string
): Promise<Page | Post | undefined> {
  // Check pages first (preserves original lookup priority)
  const pageMeta = getPageIndex().find((p) => p.slug === slug)
  if (pageMeta) {
    const filePath = path.join(PAGES_DIR, `${slug}.md`)
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { content } = matter(raw)
      return { ...pageMeta, content }
    }
  }

  // Fall back to posts
  const postMeta = getPostIndex().find((p) => p.slug === slug)
  if (postMeta) {
    const filePath = path.join(POSTS_DIR, `${slug}.md`)
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { content } = matter(raw)
      return { ...postMeta, content }
    }
  }

  return undefined
}
