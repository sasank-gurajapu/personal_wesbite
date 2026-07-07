import { useEffect, useMemo, useRef, useState } from 'react'
import CompanyLogo from './CompanyLogo.jsx'

const YEAR_WIDTH = 160

function yearFraction(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const startOfNextYear = new Date(date.getFullYear() + 1, 0, 1)
  return date.getFullYear() + (date - startOfYear) / (startOfNextYear - startOfYear)
}

export default function HorizontalTimeline({ education, experiences }) {
  const todayFraction = useMemo(() => yearFraction(new Date()), [])
  const todayLabel = useMemo(
    () => new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }),
    [],
  )

  // Oldest first, left to right — dragging right moves forward through time.
  // Education entries carry a start/end range (rendered as a duration bar);
  // work entries are a single point-in-time marker, as before. Both share the
  // same x-axis, positioned by their start year, so they interleave naturally.
  const items = useMemo(() => {
    const edu = education.map((e) => ({ ...e, kind: 'education', posYear: e.startYear }))
    const work = experiences.map((e) => ({ ...e, kind: 'work', posYear: e.year }))
    return [...edu, ...work].sort((a, b) => a.posYear - b.posYear)
  }, [education, experiences])

  const startYear = Math.floor(
    Math.min(...items.map((i) => i.posYear), todayFraction),
  )
  const endYear = Math.ceil(
    Math.max(...items.map((i) => (i.kind === 'education' ? i.endYear : i.posYear)), todayFraction) + 1,
  )

  // The playhead sits at the horizontal center of the viewport, and the track
  // is padded by that same amount on each side — so the oldest role can be
  // centered when scrolled all the way left, and the far edge when scrolled
  // all the way right. Native overflow clamping then keeps you from scrolling past either end.
  const [playheadOffset, setPlayheadOffset] = useState(0)
  const edgePadding = playheadOffset
  const trackWidth = (endYear - startYear) * YEAR_WIDTH + edgePadding * 2
  const xForYear = (year) => edgePadding + (year - startYear) * YEAR_WIDTH
  const markerX = (item) => xForYear(item.posYear)

  // null activeId means nothing has been selected yet — the view opens
  // centered on today with no marker highlighted, until the user drags to one.
  const [activeId, setActiveId] = useState(null)
  const viewportRef = useRef(null)
  const dragState = useRef({ dragging: false, startX: 0, startScroll: 0, moved: false })
  const snapTimer = useRef(null)
  // True while a scrollToYear()-triggered smooth scroll is in flight, so the scroll
  // handler doesn't fight it and snap back to the previous position mid-animation.
  const suppressScroll = useRef(false)

  const nearestItem = (scrollLeft) => {
    const playheadX = scrollLeft + playheadOffset
    let closest = items[0]
    let minDist = Infinity
    items.forEach((item) => {
      const dist = Math.abs(markerX(item) - playheadX)
      if (dist < minDist) {
        minDist = dist
        closest = item
      }
    })
    return closest
  }

  const scrollToYear = (year, activeItemId, { instant = false } = {}) => {
    const vp = viewportRef.current
    if (!vp) return
    suppressScroll.current = true
    clearTimeout(snapTimer.current)
    vp.scrollTo({ left: xForYear(year) - playheadOffset, behavior: instant ? 'auto' : 'smooth' })
    setActiveId(activeItemId)
    // Safety net for browsers without the `scrollend` event. A large smooth-scroll
    // (e.g. the initial jump to today) can outlast a short timeout, so an instant
    // scroll — which finishes synchronously — gets a much shorter one.
    setTimeout(
      () => {
        suppressScroll.current = false
      },
      instant ? 50 : 600,
    )
  }

  const goTo = (item) => scrollToYear(item.posYear, item.id)
  const goToToday = (instant) => scrollToYear(todayFraction, null, { instant })

  const handleScroll = () => {
    if (suppressScroll.current) return
    const vp = viewportRef.current
    if (!vp) return
    setActiveId(nearestItem(vp.scrollLeft).id)

    clearTimeout(snapTimer.current)
    if (!dragState.current.dragging) {
      snapTimer.current = setTimeout(() => {
        const closest = nearestItem(vp.scrollLeft)
        goTo(closest)
      }, 120)
    }
  }

  // Keep the playhead centered as the viewport is resized.
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    const ro = new ResizeObserver((entries) => {
      setPlayheadOffset(entries[0].contentRect.width / 2)
    })
    ro.observe(vp)
    return () => ro.disconnect()
  }, [])

  const initialized = useRef(false)
  useEffect(() => {
    if (playheadOffset === 0) return
    if (!initialized.current) {
      initialized.current = true
      goToToday(true)
    } else if (active) {
      // Viewport was resized — re-center whatever is currently active.
      goTo(active)
    } else {
      goToToday()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playheadOffset])

  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    const onScrollEnd = () => {
      suppressScroll.current = false
    }
    vp.addEventListener('scrollend', onScrollEnd)
    return () => vp.removeEventListener('scrollend', onScrollEnd)
  }, [])

  // Drag is only confirmed once the pointer moves past a small threshold, so a
  // plain click (e.g. on a marker) never gets hijacked as a drag-start — pointer
  // capture only engages once we know it's a real drag, not a press-and-release.
  const onPointerDown = (e) => {
    dragState.current = {
      dragging: false,
      pointerId: e.pointerId,
      startX: e.clientX,
      startScroll: viewportRef.current.scrollLeft,
      captured: false,
    }
  }

  const onPointerMove = (e) => {
    const state = dragState.current
    if (state.startX === undefined) return
    const dx = e.clientX - state.startX

    if (!state.dragging && Math.abs(dx) > 4) {
      state.dragging = true
      if (!state.captured) {
        try {
          viewportRef.current.setPointerCapture(state.pointerId)
        } catch {
          // Pointer may no longer be active (e.g. synthetic events); dragging
          // still works via scrollLeft updates below without capture.
        }
        state.captured = true
      }
    }

    if (state.dragging) {
      viewportRef.current.scrollLeft = state.startScroll - dx
    }
  }

  const onPointerUp = () => {
    const wasDragging = dragState.current.dragging
    dragState.current = {}
    if (wasDragging) {
      goTo(nearestItem(viewportRef.current.scrollLeft))
    }
  }

  // Plain vertical wheel/trackpad scroll also scrubs the timeline, so it isn't
  // drag-only — but let the page scroll normally once you hit either end.
  // React's synthetic onWheel is attached passively, so preventDefault() there
  // is silently ignored; a native listener is required to actually block it.
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    const onWheel = (e) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      const atStart = vp.scrollLeft <= 0 && delta < 0
      const atEnd = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 1 && delta > 0
      if (atStart || atEnd) return
      e.preventDefault()
      vp.scrollLeft += delta
    }
    vp.addEventListener('wheel', onWheel, { passive: false })
    return () => vp.removeEventListener('wheel', onWheel)
  }, [])

  const active = activeId == null ? null : items.find((item) => item.id === activeId)
  const activeIndex = active ? items.findIndex((item) => item.id === active.id) : -1

  const step = (delta) => {
    if (!active) {
      const upcoming = items.filter((item) => item.posYear >= todayFraction)
      const past = items.filter((item) => item.posYear < todayFraction)
      const next = delta > 0 ? upcoming[0] : past[past.length - 1]
      if (next) goTo(next)
      return
    }
    const next = items[Math.min(items.length - 1, Math.max(0, activeIndex + delta))]
    goTo(next)
  }

  const canStepBack = active ? activeIndex > 0 : items.some((item) => item.posYear < todayFraction)
  const canStepForward = active
    ? activeIndex < items.length - 1
    : items.some((item) => item.posYear >= todayFraction)

  const years = []
  for (let y = startYear; y <= endYear; y++) years.push(y)

  return (
    <div className="htimeline">
      <div className="htimeline-controls">
        <div className="htimeline-legend">
          <span className="htimeline-legend-item">
            <span className="htimeline-legend-dot htimeline-legend-dot-edu" />
            Education
          </span>
          <span className="htimeline-legend-item">
            <span className="htimeline-legend-dot htimeline-legend-dot-work" />
            Work experience
          </span>
        </div>
        <span className="htimeline-hint">Drag to explore</span>
        <div className="htimeline-nav">
          <button type="button" onClick={() => step(-1)} disabled={!canStepBack} aria-label="Previous">
            ←
          </button>
          <button type="button" onClick={() => step(1)} disabled={!canStepForward} aria-label="Next">
            →
          </button>
        </div>
      </div>

      <div className="htimeline-frame">
        <div className="htimeline-playhead" style={{ left: playheadOffset }} />
        <div
          className="htimeline-viewport"
          ref={viewportRef}
          onScroll={handleScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div className="htimeline-track" style={{ width: trackWidth }}>
            <div className="htimeline-ruler-line" />

            {years.map((y) => (
              <div key={y} className="htimeline-year" style={{ left: xForYear(y) }}>
                {y}
              </div>
            ))}

            {years.slice(0, -1).flatMap((y) =>
              [0, 1, 2, 3].map((q) => (
                <div
                  key={`${y}-${q}`}
                  className="htimeline-tick"
                  style={{ left: xForYear(y) + q * (YEAR_WIDTH / 4) }}
                />
              )),
            )}

            <div className="htimeline-today-line" style={{ left: xForYear(todayFraction) }} />
            <div className="htimeline-today-label" style={{ left: xForYear(todayFraction) }}>
              Today
            </div>

            {items
              .filter((item) => item.kind === 'education')
              .map((edu) => (
                <div key={edu.id}>
                  <div
                    className="htimeline-edu-bar"
                    style={{ left: markerX(edu), width: Math.max(0, xForYear(edu.endYear) - markerX(edu)) }}
                  />
                  <div className="htimeline-edu-endcap" style={{ left: xForYear(edu.endYear) }} />
                  <button
                    type="button"
                    className={
                      edu.id === activeId
                        ? 'htimeline-marker htimeline-marker-edu htimeline-marker-active'
                        : 'htimeline-marker htimeline-marker-edu'
                    }
                    style={{ left: markerX(edu) }}
                    onClick={() => goTo(edu)}
                  >
                    <CompanyLogo company={edu.school} logo={edu.logo} />
                  </button>
                </div>
              ))}

            {items
              .filter((item) => item.kind === 'work')
              .map((exp) => (
                <button
                  key={exp.id}
                  type="button"
                  className={
                    exp.id === activeId
                      ? 'htimeline-marker htimeline-marker-work htimeline-marker-active'
                      : 'htimeline-marker htimeline-marker-work'
                  }
                  style={{ left: markerX(exp) }}
                  onClick={() => goTo(exp)}
                >
                  <CompanyLogo company={exp.company} logo={exp.logo} />
                </button>
              ))}
          </div>
        </div>
      </div>

      <div className="htimeline-detail">
        {active ? (
          <>
            <h3 className="htimeline-detail-title">{active.kind === 'education' ? active.degree : active.title}</h3>
            <p className="htimeline-detail-meta">
              {active.kind === 'education' ? active.school : active.company} ·{' '}
              {active.kind === 'education' ? active.dates : active.dateRange}
            </p>
            {active.description && (
              <ul className="exp-card-bullets">
                {active.description.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
            <h3 className="htimeline-detail-title">Today</h3>
            <p className="htimeline-detail-meta">{todayLabel}</p>
          </>
        )}
      </div>
    </div>
  )
}
