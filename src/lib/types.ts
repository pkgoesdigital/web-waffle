export type SocialLink = {
  href: string
  img?: string | null
  label?: string
}

export type Page = {
  id: string
  title: string
  slug: string
  date: string
  subtitle?: string
  content?: string
  status: string
}

export type Post = {
  id: string
  title: string
  slug: string
  date: string
  subtitle?: string
  content?: string
  status: 'publish' | 'draft' | 'trash'
  categories: string[]
  tags: string[]
}

export type SiteContent = {
  pages: Record<string, Page>
  posts: Post[]
  socialLinks: SocialLink[]
}
