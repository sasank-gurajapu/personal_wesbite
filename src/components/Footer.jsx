import { SOCIAL_LINKS } from '../data.js'

export default function Footer() {
  return (
    <footer className="footer">
      {SOCIAL_LINKS.map((link, i) => (
        <span key={link.label}>
          <a href={link.href} target="_blank" rel="noreferrer">
            {link.label}
          </a>
          {i < SOCIAL_LINKS.length - 1 && <span className="dot"> · </span>}
        </span>
      ))}
    </footer>
  )
}
