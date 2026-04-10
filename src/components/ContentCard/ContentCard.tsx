import Link from 'next/link'
import styles from './ContentCard.module.css'

type ContentCardProps = {
  href: string
  title: string
  subtitle?: string
  date?: string
  color: string
  status?: string
}

export default function ContentCard({
  href,
  title,
  subtitle,
  date,
  color,
  status,
}: ContentCardProps) {
  return (
    <Link
      href={href}
      className={styles.card}
      style={{ '--card-color': color } as React.CSSProperties}
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
