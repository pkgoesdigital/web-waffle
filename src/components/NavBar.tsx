import { NavLink } from 'react-router-dom'

const nav = [
  { to: '/writing', label: 'Writing' },
  { to: '/about', label: 'About' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/contact', label: 'Contact' },
]

export default function NavBar() {
  return (
    <nav className="navbar">
      <ul className="menu">
        {nav.map((i) => (
          <li key={i.to}>
            <NavLink to={i.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {i.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
