import { Link, NavLink } from 'react-router-dom'
import { SECTIONS } from '../data.js'

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-title">
        Sasank Gurajapu
      </Link>
      <nav className="site-nav">
        {SECTIONS.map((section) => (
          <NavLink
            key={section.path}
            to={section.path}
            className={({ isActive }) =>
              isActive ? 'site-nav-link site-nav-link-active' : 'site-nav-link'
            }
          >
            {section.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
