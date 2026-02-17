import Link from 'next/link'
import { getCardColor } from '@/lib/colors'
import styles from './ContentCard.module.css'

type ContentCardProps = {
  href: string
  title: string
  subtitle?: string
  date?: string
  index: number
  status?: string
}

export default function ContentCard({
  href,
  title,
  subtitle,
  date,
  index,
  status,
}: ContentCardProps) {
  const bgColor = getCardColor(index)

  return (
    <Link
      href={href}
      className={styles.card}
      style={{ backgroundColor: bgColor }}
    >
      <div className={styles.content}>
        {date && <span className={styles.date}>{date}</span>}
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {status && status !== 'publish' && (
          <span className={styles.badge}>{status}</span>
        )}
      </div>
    </Link>
  )
}
