import { useEffect, useRef, useState } from 'react'
import ExperienceCard from './ExperienceCard.jsx'

const TRIGGER_OFFSET = 180

export default function Timeline({ experiences }) {
  const [activeId, setActiveId] = useState(experiences[0]?.id)
  const rowRefs = useRef({})
  const trackRef = useRef(null)

  useEffect(() => {
    function updateActive() {
      let current = experiences[0]?.id
      for (const exp of experiences) {
        const el = rowRefs.current[exp.id]
        if (!el) continue
        if (el.getBoundingClientRect().top <= TRIGGER_OFFSET) {
          current = exp.id
        }
      }
      setActiveId(current)
    }

    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive)
    return () => {
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', updateActive)
    }
  }, [experiences])

  const activeIndex = Math.max(
    0,
    experiences.findIndex((exp) => exp.id === activeId),
  )
  const fillPercent = ((activeIndex + 1) / experiences.length) * 100

  return (
    <div className="timeline" ref={trackRef}>
      <div className="timeline-line">
        <div className="timeline-line-fill" style={{ height: `${fillPercent}%` }} />
      </div>

      {experiences.map((exp) => {
        const isActive = exp.id === activeId
        return (
          <div
            key={exp.id}
            ref={(el) => {
              rowRefs.current[exp.id] = el
            }}
            className={isActive ? 'timeline-row timeline-row-active' : 'timeline-row'}
          >
            <div className={isActive ? 'timeline-time timeline-time-active' : 'timeline-time'}>
              {exp.dateRange}
            </div>
            <div className="timeline-dot-wrap">
              <span className={isActive ? 'timeline-dot timeline-dot-active' : 'timeline-dot'} />
            </div>
            <div className="timeline-content">
              <ExperienceCard experience={exp} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
