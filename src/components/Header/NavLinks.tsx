'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'
import styles from './Header.module.css'

const links = [
  { href: '/writing', label: 'Writing' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/cpw-neighborhood-watch', label: 'Neighborhood Watch' },
  { href: '/contact', label: 'Contact' },
]

export default function NavLinks() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    setIsOpen(true)
  }, [pathname])

  return (
    <>
      <button
        className={styles.menuBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
        aria-expanded={!isOpen}
        aria-controls="main-nav"
      >
        {isOpen ? '☰' : '✕'}
      </button>
      <nav id="main-nav" className={`${styles.nav} ${isOpen ? styles.navClosed : ''}`}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${
              pathname.startsWith(link.href) ? styles.active : ''
            }`}
            onClick={() => setIsOpen(true)}
          >
            {link.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </>
  )
}
