import type { Metadata } from 'next'
import WatchmakerClock from '@/components/WatchmakerClock/WatchmakerClock'
import D3Visualization from '@/components/D3Visualization/D3Visualization'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Portfolio' }

export default function PortfolioPage() {
  return (
    <div className={styles.container}>
      <div className="page-header">
        <h1>Portfolio</h1>
        <p>Interactive demos and data visualizations.</p>
      </div>

      <section className={styles.vizSection}>
        <h2 className={styles.vizTitle}>The Watchmaker</h2>
        <p className={styles.vizDescription}>
          An analog clock built with JavaScript and requestAnimationFrame.
        </p>
        <WatchmakerClock />
      </section>

      <section className={styles.vizSection}>
        <h2 className={styles.vizTitle}>Sample Visualization</h2>
        <p className={styles.vizDescription}>
          A responsive bar chart rendered with D3.js, served from an API route.
        </p>
        <D3Visualization dataUrl="/api/viz?dataset=sample" />
      </section>
    </div>
  )
}
