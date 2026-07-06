import { SUMMARY, EDUCATION, EXPERIENCES } from '../professionalData.js'
import HorizontalTimeline from '../components/HorizontalTimeline.jsx'
import CompanyLogo from '../components/CompanyLogo.jsx'

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

      <section className="education">
        <h2 className="section-heading">Education</h2>
        <ul className="education-list">
          {EDUCATION.map((edu) => (
            <li key={edu.school} className="education-item">
              <CompanyLogo company={edu.school} logo={edu.logo} />
              <span className="education-text">
                <span className="education-school">{edu.school}</span>
                {edu.degree && <span className="education-degree">{edu.degree}</span>}
              </span>
              <span className="education-dates">{edu.dates}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="experience-section">
        <h2 className="section-heading">Experience</h2>
        <HorizontalTimeline experiences={EXPERIENCES} />
      </section>
    </div>
  )
}
