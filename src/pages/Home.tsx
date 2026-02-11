import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <h1>Web Waffle</h1>
      <p>A lightweight site built from the original static Web Waffle and a WordPress export.</p>

      <p style={{ marginTop: '1rem' }}>
        Start here: <Link to="/writing">Writing</Link>
      </p>
    </div>
  )
}
