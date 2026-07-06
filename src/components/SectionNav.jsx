import { Link } from 'react-router-dom'
import { SECTIONS } from '../data.js'

export default function SectionNav() {
  return (
    <nav className="section-list">
      {SECTIONS.map((section) => (
        <Link key={section.path} to={section.path} className="section-row">
          <span className="section-text">
            <span className="section-title">{section.label}</span>
            <span className="section-subtitle">{section.subtitle}</span>
          </span>
          <span className="section-arrow">→</span>
        </Link>
      ))}
    </nav>
  )
}
