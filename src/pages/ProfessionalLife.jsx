import { SUMMARY, EDUCATION, EXPERIENCES } from '../professionalData.js'
import HorizontalTimeline from '../components/HorizontalTimeline.jsx'

export default function ProfessionalLife() {
  return (
    <div className="content">
      <div className="page-title-row">
        <h1 className="page-title">Professional Life</h1>
        <a className="resume-cta" href="/resume.pdf" download>
          Download Resume
        </a>
      </div>
      <p className="page-description">{SUMMARY}</p>

      <section className="experience-section">
        <h2 className="section-heading">Experience & Education</h2>
        <HorizontalTimeline education={EDUCATION} experiences={EXPERIENCES} />
      </section>
    </div>
  )
}
