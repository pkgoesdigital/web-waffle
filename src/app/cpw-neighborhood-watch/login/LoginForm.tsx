'use client'

import styles from './page.module.css'

type Props = {
  error: boolean
  from?: string
}

export default function LoginForm({ error, from }: Props) {
  return (
    <form method="POST" action="/api/cpw-auth" className={styles.form}>
      {from && <input type="hidden" name="from" value={from} />}
      <label htmlFor="password" className={styles.label}>
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        className={styles.input}
        aria-describedby={error ? 'login-error' : undefined}
        required
      />
      {error && (
        <p id="login-error" className={styles.error} role="alert">
          Incorrect password. Please try again.
        </p>
      )}
      <button type="submit" className={styles.button}>
        Enter
      </button>
    </form>
  )
}
