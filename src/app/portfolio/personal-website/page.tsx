import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'Personal Website — Portfolio' }

export default function PersonalWebsitePage() {
  return (
    <PortfolioPage slug="personal-website">
      <p>
        This site is built on Next.js 15 using the App Router, TypeScript, and a
        markdown-driven content system. Posts and pages are authored in markdown
        with YAML frontmatter for metadata (title, date, status, categories,
        tags), parsed with <code>gray-matter</code>, and rendered with{' '}
        <code>remark</code>.
      </p>

      <h2>Architecture</h2>
      <p>
        Content lives in <code>src/content/posts/</code> and{' '}
        <code>src/content/pages/</code> — each file is a self-contained markdown
        document. A module-level in-memory cache in <code>src/lib/content.ts</code>{' '}
        indexes all frontmatter on startup and reads full content on demand,
        keeping the server fast without a database.
      </p>
      <p>
        Styling is handled through CSS Modules for scoped, collision-free styles.
        The Inter font is loaded via <code>next/font</code> for performance. The
        site generates fully static output — every page is prerendered at build
        time.
      </p>

      <h2>Design Goals</h2>
      <p>
        It&rsquo;s a simple site by design. I wanted something lightweight and
        content-first that I could extend without fighting a CMS. The portfolio
        section (what you&rsquo;re reading now) is built as a separate route with
        its own layout, designed to support embedded apps, visualizations, and
        rich media as the content grows.
      </p>
      <p>
        The site is live at <strong>paulaklimas.com</strong> and serves as both a
        writing outlet and a working demonstration of my frontend architecture
        choices.
      </p>
    </PortfolioPage>
  )
}
