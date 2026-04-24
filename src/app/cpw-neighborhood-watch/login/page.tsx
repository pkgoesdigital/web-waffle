import type { Metadata } from 'next'
import LoginForm from './LoginForm'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Neighborhood Watch — Login' }

type Props = {
  searchParams: Promise<{ error?: string; from?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { error, from } = await searchParams

  return (
    <div className={styles.container}>
      <div className="page-header">
        <h1>Neighborhood Watch</h1>
        <p>City Park West — members only</p>
      </div>
      <LoginForm error={!!error} from={from} />
    </div>
  )
}
