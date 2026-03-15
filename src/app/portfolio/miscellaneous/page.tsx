import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'
import WatchmakerClock from '@/components/WatchmakerClock/WatchmakerClock'
import D3Visualization from '@/components/D3Visualization/D3Visualization'
import styles from './page.module.css'

export default function MiscellaneousPage() {
  return (
    <PortfolioPage slug="miscellaneous">
      <section className={styles.demo}>
        <h2>The Watchmaker</h2>
        <p>
          An analog clock built with JavaScript and{' '}
          <code>requestAnimationFrame</code>. Smooth sub-frame interpolation
          keeps the second hand gliding rather than ticking.
        </p>
        <WatchmakerClock />
      </section>

      <section className={styles.demo}>
        <h2>Sample Visualization</h2>
        <p>
          A responsive bar chart rendered with D3.js, fetched from the{' '}
          <code>/api/viz</code> route and scaled to fit its container.
        </p>
        <D3Visualization dataUrl="/api/viz?dataset=sample" />
      </section>
    </PortfolioPage>
  )
}
