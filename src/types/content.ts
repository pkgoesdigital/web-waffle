export type SocialLink = {
  href: string
  img?: string | null
  label?: string
}

export type WpPage = {
  id: string
  title: string
  slug: string
  date: string
  contentHtml: string
  status: string
}

export type WpPost = {
  id: string
  title: string
  slug: string
  date: string
  contentHtml: string
  excerptHtml: string
  status: 'publish' | 'draft' | 'trash'
  categories: string[]
  tags: string[]
}

export type SiteContent = {
  pages: Record<string, WpPage>
  posts: WpPost[]
  socialLinks: SocialLink[]
}
