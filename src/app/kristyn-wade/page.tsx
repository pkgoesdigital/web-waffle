import type { Metadata } from 'next'
import KristynCalendar from '@/components/KristynCalendar/KristynCalendar'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Visiting Kristyn',
  description: 'Coordinate visits and meal drop-offs for Kristyn.',
  robots: { index: false, follow: false },
}

export default function KristynWadePage() {
  return (
    <div className={styles.page}>
      <div className="page-header">
        <h1>Visiting Kristyn</h1>
        <p>The family will be notified of all sign-ups automatically!</p>
      </div>
      <KristynCalendar />
    </div>
  )
}
