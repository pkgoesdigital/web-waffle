import type { Metadata } from 'next'
import { getPage } from '@/lib/content'
import { markdownToHtml } from '@/lib/markdown'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'About' }

export default async function AboutPage() {
  const page = await getPage('about')
  const html = page?.content ? await markdownToHtml(page.content) : ''

  return (
    <div className={styles.container}>
      <div className="page-header">
        <h1>About</h1>
        <p>
          Full Stack Builder | Business Intelligence Product Manager | Enterprise
          Product Manager | Software Engineer | Analytics Nerd | Writer |
          Activist
        </p>
      </div>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
