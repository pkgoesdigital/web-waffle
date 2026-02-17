'use client'

import { useEffect, useRef } from 'react'
import styles from './WatchmakerClock.module.css'

export default function WatchmakerClock() {
  const clockRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let raf = 0

    const tick = () => {
      const current = new Date()
      const hr = current.getHours() % 12
      const min = current.getMinutes()
      const sec = current.getSeconds()
      const milli = current.getMilliseconds()

      const hourHand = clockRef.current?.querySelector(
        `.${styles.hour}`
      ) as HTMLElement | null
      const minHand = clockRef.current?.querySelector(
        `.${styles.minute}`
      ) as HTMLElement | null
      const secHand = clockRef.current?.querySelector(
        `.${styles.second}`
      ) as HTMLElement | null

      if (hourHand)
        hourHand.style.transform = `rotate(${30 * hr + 0.5 * min}deg)`
      if (minHand)
        minHand.style.transform = `rotate(${6 * min + 0.1 * sec}deg)`
      if (secHand)
        secHand.style.transform = `rotate(${6 * sec + 0.006 * milli}deg)`

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.clock} ref={clockRef}>
        <div className={`${styles.hand} ${styles.hour}`} />
        <div className={`${styles.hand} ${styles.minute}`} />
        <div className={`${styles.hand} ${styles.second}`} />
        <div className={styles.center} />
      </div>
    </div>
  )
}
