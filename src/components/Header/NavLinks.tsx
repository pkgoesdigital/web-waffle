'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'
import { portfolioSections } from '@/data/portfolio-sections'
import { getVisibleServices } from '@/data/services'
import styles from './Header.module.css'

type NavChild = { href: string; label: string }
type NavLink = { href: string; label: string; children?: NavChild[] }

const links: NavLink[] = [
  { href: '/writing', label: 'Writing' },
  { href: '/about', label: 'About' },
  {
    href: '/services',
    label: 'Services',
    children: getVisibleServices().map((s) => ({
      href: `/services/${s.slug}`,
      label: s.title,
    })),
  },
  {
    href: '/portfolio',
    label: 'Portfolio',
    children: portfolioSections.map((s) => ({
      href: `/portfolio/${s.slug}`,
      label: s.title,
    })),
  },
  {
    href: '/cpw-neighborhood-watch',
    label: 'CPW',
    children: [
      { href: '/cpw-neighborhood-watch/calendar', label: 'Calendar' },
      { href: '/cpw-neighborhood-watch/newsletter', label: 'Newsletter' },
    ],
  },
  { href: '/contact', label: 'Contact' },
]

export default function NavLinks() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    setIsOpen(true)
  }, [pathname])

  const close = () => setIsOpen(true)

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
          <div key={link.href} className={styles.navItem}>
            <Link
              href={link.href}
              className={`${styles.navLink} ${
                pathname.startsWith(link.href) ? styles.active : ''
              }`}
              onClick={close}
            >
              {link.label}
            </Link>

            {link.children && (
              <ul className={styles.dropdown}>
                {link.children.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      className={`${styles.dropdownLink} ${
                        pathname === child.href || pathname.startsWith(child.href + '/')
                          ? styles.dropdownActive
                          : ''
                      }`}
                      onClick={close}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <ThemeToggle />
      </nav>
    </>
  )
}
