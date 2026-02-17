import type { Metadata } from 'next'
import { getPage } from '@/lib/content'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  const page = getPage('about')

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

      <div className="prose">
        {page?.content?.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        )) ?? (
          <>
            <p>
              I believe better software can inspire better humans. I believe in
              failure and conflict — they make things more interesting and
              provide opportunities for growth. I believe in listening to those
              who differ from ourselves.
            </p>
            <p>
              I believe in process, even when it&apos;s messy and untamed. I
              believe in the space between humans and technology, and I believe
              we can make it better.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
