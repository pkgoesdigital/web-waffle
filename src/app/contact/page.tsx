import type { Metadata } from 'next'
import SocialLinks from '@/components/SocialLinks/SocialLinks'
import Guestbook from '@/components/Guestbook/Guestbook'
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

      <section
        id="guestbook"
        className={styles.guestbookSection}
        aria-labelledby="guestbook-heading"
      >
        <h2 id="guestbook-heading" className={styles.guestbookTitle}>
          Guestbook
        </h2>
        <p className={styles.guestbookNote}>
          Leave a note to say you stopped by — it appears after I approve it.
          No account, no email, nothing tracked.
        </p>
        <Guestbook />
      </section>
    </div>
  )
}
