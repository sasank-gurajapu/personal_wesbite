import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <h3 className="project-card-title">{project.title}</h3>
      <p className="project-card-blurb">{project.blurb}</p>
      {project.deepDive ? (
        <Link to={`/professional-life/deepdive/${project.deepDive}`} className="project-card-cta">
          Read more →
        </Link>
      ) : (
        <a href={project.href} target="_blank" rel="noreferrer" className="project-card-cta">
          Read more →
        </a>
      )}
    </div>
  )
}
