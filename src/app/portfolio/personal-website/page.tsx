import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'Personal Website — Portfolio' }

export default function PersonalWebsitePage() {
  return (
    <PortfolioPage slug="personal-website">
      <p>
        This site is built on Next.js 15 with the App Router and TypeScript.
        Pages render as server components by default; a small set of leaf
        components — the navigation, theme toggle, D3 visualizations, and the
        watchmaker clock — opt into client rendering where they need browser
        APIs or interactivity. There is no traditional database. Styling is
        handled exclusively through CSS Modules with design tokens defined as
        CSS custom properties in a single <code>globals.css</code>. The Inter
        typeface is loaded via <code>next/font</code>, and Vercel Analytics
        is integrated at the root layout.
      </p>

      <h2>Content Architecture</h2>
      <p>
        Content lives in two places depending on how often it changes and how
        it&rsquo;s edited.
      </p>
      <p>
        Long-form prose — writing posts and community event listings — is authored as <code>.md</code> files with
        YAML frontmatter, parsed by <code>gray-matter</code>, and rendered
        through <code>remark</code>. A module-level in-memory cache in{' '}
        <code>src/lib/content.ts</code> indexes all frontmatter at startup and
        reads full bodies on demand. Rendered HTML is injected via{' '}
        <code>dangerouslySetInnerHTML</code> — fine here because the input is
        mine and the pipeline is deterministic.
      </p>
      <p>
        Structured site sections — portfolio entries, services, social links —
        are authored as typed TypeScript data modules under{' '}
        <code>src/data/</code>. Each module defines a type, exports a sorted
        and filtered list, and is consumed by a small reusable wrapper
        component (<code>PortfolioPage</code>, <code>ServicePage</code>) that
        handles back-nav, prev/next pagination, and any structured panels
        (outcomes, includes, FAQ, and so on). Detail pages are still
        hand-written JSX — the data module owns the metadata; the page owns
        the narrative. Adding a new entry to either section is a one-record
        change in the data file plus a single new <code>page.tsx</code>; the
        nav dropdown, listing grid, and pagination update automatically.
      </p>
      <p>
        This split is intentional. Markdown is great for prose with light
        structure; TypeScript is great for structured data with rich
        consumers. Mixing them in either direction is where most personal
        sites quietly get unwieldy.
      </p>

      <h2>Theming</h2>
      <p>
        Light and dark themes are driven by a <code>data-theme</code>{' '}
        attribute on <code>&lt;html&gt;</code>, with all colors defined as CSS
        custom properties in <code>globals.css</code> and overridden under{' '}
        <code>[data-theme=&quot;dark&quot;]</code>. A small{' '}
        <code>ThemeProvider</code> reads and writes the user&rsquo;s
        preference; a <code>ThemeToggle</code> flips it. Component CSS
        Modules consume the same custom properties, so adding a new component
        never requires re-implementing dark mode — it just inherits.
      </p>

      <h2>Images</h2>
      <p>
        Project screenshots are compressed to WebP and served through the
        Next.js <code>Image</code> component, which handles lazy loading and
        responsive <code>srcset</code> generation. The <code>sizes</code> prop
        is tuned to the 860px prose content width so the browser requests
        appropriately-sized variants at each breakpoint.
      </p>

      <h2>Testing</h2>
      <p>
        Jest with React Testing Library covers the surfaces where a regression
        would actually be felt — the calendar grid and event list. <code>jsdom</code> is the test environment;{' '}
        <code>ts-jest</code> handles TypeScript transformation. Run with{' '}
        <code>npm test</code>, or <code>npm run test:watch</code> while
        iterating. Most pages are simple enough that TypeScript catches what a
        unit test would.
      </p>

      <h2>Deployment</h2>
      <p>
        The site is deployed to Vercel on every merge to <code>master</code>,
        with a separate nightly build triggered via GitHub Actions to keep
        prerendered content fresh. All work happens on feature branches and
        lands through pull requests — <code>master</code> is never committed
        to directly.
      </p>

      <h2>Design Goals</h2>
      <p>
        Lightweight and content-first. I wanted a site I could extend without
        fighting a framework or a CMS — adding a new portfolio entry or
        service offering means appending a record to the relevant data module
        and creating a single <code>page.tsx</code>. The architecture is
        deliberately boring: typed data, reusable wrappers, server-rendered
        prose, no bespoke build steps. The site is live at{' '}
        <strong>paulaklimas.com</strong> and serves as both a writing outlet
        and a working demonstration of my frontend architecture choices.
      </p>
    </PortfolioPage>
  )
}
