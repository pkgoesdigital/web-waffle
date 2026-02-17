import type { Metadata } from 'next'
import SocialLinks from '@/components/SocialLinks/SocialLinks'
import { getSocialLinks } from '@/lib/content'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  const links = getSocialLinks()

  return (
    <div className={styles.container}>
      <div className="page-header">
        <h1>Contact</h1>
        <p>
          Ask questions, connect, or exchange dad jokes. The simplest way to
          reach me is through LinkedIn.
        </p>
      </div>

      <div className={styles.links}>
        <SocialLinks links={links} />
      </div>
    </div>
  )
}
