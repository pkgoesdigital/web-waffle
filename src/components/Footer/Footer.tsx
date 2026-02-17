import SocialLinks from '@/components/SocialLinks/SocialLinks'
import { getSocialLinks } from '@/lib/content'
import styles from './Footer.module.css'

export default function Footer() {
  const socialLinks = getSocialLinks()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.section}>
          <h3 className={styles.heading}>Connect</h3>
          <SocialLinks links={socialLinks} />
        </div>
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            Paula Klimas &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}
