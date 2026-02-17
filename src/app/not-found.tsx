import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="page-header" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h1>404</h1>
      <p>This page doesn&apos;t exist yet.</p>
      <p style={{ marginTop: '1.5rem' }}>
        <Link href="/">Go home</Link>
      </p>
    </div>
  )
}
