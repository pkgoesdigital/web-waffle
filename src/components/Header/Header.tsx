import Link from 'next/link'
import NavLinks from './NavLinks'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Paula Klimas
        </Link>
        <NavLinks />
      </div>
    </header>
  )
}
