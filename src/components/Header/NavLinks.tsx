'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'

const links = [
  { href: '/writing', label: 'Writing' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
]

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className={styles.nav}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`${styles.navLink} ${
            pathname.startsWith(link.href) ? styles.active : ''
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
