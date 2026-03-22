'use client'

import { useState, useEffect } from 'react'
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
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <button
        className={styles.menuBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
      >
        {isOpen ? '✕' : '☰'}
      </button>
      <nav className={styles.nav} style={isOpen ? { display: 'flex' } : undefined}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${
              pathname.startsWith(link.href) ? styles.active : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
