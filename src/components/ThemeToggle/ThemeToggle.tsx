'use client'

import { useTheme } from '@/components/ThemeProvider/ThemeProvider'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <label className={styles.label}>
      <span className={styles.text}>{isDark ? 'Dark' : 'Light'}</span>
      <button
        role="switch"
        aria-checked={isDark}
        onClick={toggleTheme}
        className={`${styles.toggle} ${isDark ? styles.toggleOn : styles.toggleOff}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <span className={styles.thumb} />
      </button>
    </label>
  )
}
