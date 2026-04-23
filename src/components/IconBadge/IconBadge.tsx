import type { SimpleIcon } from 'simple-icons'
import styles from './IconBadge.module.css'

type Props = {
  label: string
  icon?: SimpleIcon
}

export default function IconBadge({ label, icon }: Props) {
  return (
    <span className={styles.badge} title={label}>
      {icon ? (
        <svg
          viewBox="0 0 24 24"
          className={styles.icon}
          aria-hidden="true"
          fill="currentColor"
        >
          <path d={icon.path} />
        </svg>
      ) : (
        <span className={styles.placeholder} aria-hidden="true" />
      )}
      <span className={styles.label}>{label}</span>
    </span>
  )
}
