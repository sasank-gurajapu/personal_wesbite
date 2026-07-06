import { useState } from 'react'
import CompanyLogo from './CompanyLogo.jsx'

export default function ExperienceCard({ experience }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="exp-card">
      <button
        type="button"
        className="exp-card-header"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
      >
        <CompanyLogo company={experience.company} logo={experience.logo} />
        <span className="exp-card-heading">
          <span className="exp-card-title">{experience.title}</span>
          <span className="exp-card-company">{experience.company}</span>
        </span>
        <span className="exp-card-toggle">{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <div className="exp-card-body">
          <ul className="exp-card-bullets">
            {experience.description.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
