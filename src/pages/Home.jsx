import { useState } from 'react'
import SectionNav from '../components/SectionNav.jsx'

export default function Home() {
  const [photoFound, setPhotoFound] = useState(true)

  return (
    <div className="content home-content">
      <div className="hero">
        {photoFound ? (
          <img
            src="/profile.jpg"
            alt="Sasank Gurajapu"
            className="avatar"
            onError={() => setPhotoFound(false)}
          />
        ) : (
          <div className="avatar avatar-fallback">SG</div>
        )}

        <div className="hero-text">
          <h1 className="name">Hi, I'm Sasank Gurajapu.</h1>

          <p className="intro">
            This is my little corner of the internet — a personal homepage
            rather than a resume. It's where I share what I'm working on,
            what I've been thinking about, and moments I've captured along
            the way.
          </p>
        </div>
      </div>

      <SectionNav />
    </div>
  )
}
