import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="page-container">
      <div className="page-header" style={{ textAlign: 'center', paddingTop: 'var(--space-16)' }}>
        <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 'var(--space-4)' }}>404</h1>
        <p>This page doesn&apos;t exist yet.</p>
        <p style={{ marginTop: 'var(--space-6)' }}>
          <Link href="/">Go home</Link>
        </p>
      </div>
    </div>
  )
}
