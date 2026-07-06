import { Link } from 'react-router-dom'

export default function PagePlaceholder({ title, description }) {
  return (
    <div className="content">
      <Link to="/" className="back-link">
        ← Home
      </Link>
      <h1 className="page-title">{title}</h1>
      <p className="page-description">{description}</p>
      <p className="coming-soon">Coming soon.</p>
    </div>
  )
}
