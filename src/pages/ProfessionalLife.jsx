import { SUMMARY, EDUCATION, EXPERIENCES } from '../professionalData.js'
import Timeline from '../components/Timeline.jsx'

export default function ProfessionalLife() {
  return (
    <div className="content">
      <h1 className="page-title">Professional Life</h1>
      <p className="page-description">{SUMMARY}</p>

      <section className="education">
        <h2 className="section-heading">Education</h2>
        <ul className="education-list">
          {EDUCATION.map((edu) => (
            <li key={edu.school} className="education-item">
              <span className="education-school">{edu.school}</span>
              {edu.degree && <span className="education-degree">{edu.degree}</span>}
              <span className="education-dates">{edu.dates}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="experience-section">
        <h2 className="section-heading">Experience</h2>
        <Timeline experiences={EXPERIENCES} />
      </section>
    </div>
  )
}
