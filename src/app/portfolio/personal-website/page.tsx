import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'Personal Website — Portfolio' }

export default function PersonalWebsitePage() {
  return (
    <PortfolioPage slug="personal-website">
      <p>
        This site is built on Next.js 15 with the App Router and TypeScript.
        All pages are server components and prerendered at build time — there is
        no database and no client-side data fetching. Styling is handled
        exclusively through CSS Modules for scoped, collision-free styles, with
        design tokens defined as CSS custom properties in a single{' '}
        <code>globals.css</code>. The Inter typeface is loaded via{' '}
        <code>next/font</code> and Vercel Analytics is integrated at the root
        layout.
      </p>

      <h2>Content Architecture</h2>
      <p>
        Content lives in two places depending on its type. The writing section
        (<code>/writing</code>) is the only markdown-driven part of the site:
        posts are authored as <code>.md</code> files with YAML frontmatter,
        parsed by <code>gray-matter</code>, and rendered via <code>remark</code>.
        A module-level in-memory cache in <code>src/lib/content.ts</code> indexes
        all frontmatter on startup and reads full content bodies on demand.
      </p>
      <p>
        All other content — the portfolio, about page, and navigation — is
        authored directly as static JSX. No CMS, no markdown pipeline, no{' '}
        <code>dangerouslySetInnerHTML</code>. Portfolio section metadata (titles,
        slugs, descriptions, child relationships) is centralized in{' '}
        <code>src/data/portfolio-sections.ts</code> and consumed by a shared{' '}
        <code>PortfolioPage</code> wrapper component that handles breadcrumbs,
        pagination, and layout consistently across all sections.
      </p>

      <h2>Images</h2>
      <p>
        Project screenshots are compressed to WebP and served through the
        Next.js <code>Image</code> component, which handles lazy loading and
        responsive <code>srcset</code> generation. The <code>sizes</code> prop
        is tuned to the 860px prose content width so the browser requests
        appropriately-sized variants at each breakpoint.
      </p>

      <h2>Deployment</h2>
      <p>
        The site is deployed to Vercel on every merge to <code>master</code>,
        with a separate nightly build triggered via GitHub Actions to keep
        prerendered content fresh. All work happens on feature branches and
        lands through pull requests — <code>master</code> is never committed to
        directly.
      </p>

      <h2>Design Goals</h2>
      <p>
        Lightweight and content-first. I wanted a site I could extend without
        fighting a framework or a CMS — adding a new portfolio page means
        creating a <code>page.tsx</code> file and a record in{' '}
        <code>portfolio-sections.ts</code>. The site is live at{' '}
        <strong>paulaklimas.com</strong> and serves as both a writing outlet and
        a working demonstration of my frontend architecture choices.
      </p>
    </PortfolioPage>
  )
}
