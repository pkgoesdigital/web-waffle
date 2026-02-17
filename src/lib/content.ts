import siteData from '@/data/content.json'
import type { SiteContent, Post, Page, SocialLink } from './types'

const site = siteData as SiteContent

export function getAllPosts(): Post[] {
  return site.posts.filter((p) => p.status !== 'trash')
}

export function getPublishedPosts(): Post[] {
  return site.posts.filter((p) => p.status === 'publish')
}

export function getPostBySlug(slug: string): Post | undefined {
  return site.posts.find((p) => p.slug === slug)
}

export function getPage(slug: string): Page | undefined {
  return site.pages[slug]
}

export function getPageOrPost(slug: string): (Page | Post) | undefined {
  return site.pages[slug] ?? site.posts.find((p) => p.slug === slug)
}

export function getFeaturedPages(): Page[] {
  const slugs = [
    'lessons-in-product-management',
    'lessons-in-mental-health',
  ]
  return slugs.map((s) => site.pages[s]).filter(Boolean) as Page[]
}

export function getSocialLinks(): SocialLink[] {
  return site.socialLinks
}
