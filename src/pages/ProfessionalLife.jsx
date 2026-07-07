import { SUMMARY, EDUCATION, EXPERIENCES, SIDE_PROJECTS, PUBLICATIONS } from '../professionalData.js'
import HorizontalTimeline from '../components/HorizontalTimeline.jsx'
import ProjectCard from '../components/ProjectCard.jsx'

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

      <section className="side-projects-section">
        <h2 className="section-heading">Side Projects</h2>
        <div className="project-grid">
          {SIDE_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="publications-section">
        <h2 className="section-heading">Publications</h2>
        <ul className="publication-list">
          {PUBLICATIONS.map((pub) => (
            <li key={pub.id} className="publication-item">
              <a href={pub.href} target="_blank" rel="noreferrer" className="publication-title">
                {pub.title}
              </a>
              <span className="publication-venue">{pub.venue}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
