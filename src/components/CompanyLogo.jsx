import { useState } from 'react'

export default function CompanyLogo({ company, logo }) {
  const [failed, setFailed] = useState(!logo)

  if (failed) {
    const initials = company.slice(0, 2).toUpperCase()
    return <div className="exp-logo exp-logo-fallback">{initials}</div>
  }

  return (
    <img
      src={logo}
      alt={`${company} logo`}
      className="exp-logo"
      onError={() => setFailed(true)}
    />
  )
}
