import Image from 'next/image'
import type { SocialLink } from '@/lib/types'
import styles from './SocialLinks.module.css'

export default function SocialLinks({ links }: { links: SocialLink[] }) {
  if (!links?.length) return null

  return (
    <ul className={styles.list}>
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
            aria-label={link.label ?? link.href}
          >
            {link.img ? (
              <Image
                src={link.img}
                alt={link.label ?? ''}
                width={24}
                height={24}
                unoptimized
              />
            ) : (
              <span>{link.label ?? link.href}</span>
            )}
          </a>
        </li>
      ))}
    </ul>
  )
}
