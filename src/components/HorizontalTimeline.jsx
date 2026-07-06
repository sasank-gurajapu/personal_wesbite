import { useEffect, useMemo, useRef, useState } from 'react'
import CompanyLogo from './CompanyLogo.jsx'

const YEAR_WIDTH = 160

export default function HorizontalTimeline({ experiences }) {
  // Oldest first, left to right — dragging right moves forward through time.
  const items = useMemo(() => [...experiences].sort((a, b) => a.year - b.year), [experiences])

  const startYear = items[0].year
  const endYear = items[items.length - 1].year + 1

  // The playhead sits at the horizontal center of the viewport, and the track
  // is padded by that same amount on each side — so the oldest role can be
  // centered when scrolled all the way left, and "Present" when scrolled all
  // the way right. Native overflow clamping then keeps you from scrolling past either end.
  const [playheadOffset, setPlayheadOffset] = useState(0)
  const edgePadding = playheadOffset
  const trackWidth = (endYear - startYear) * YEAR_WIDTH + edgePadding * 2
  const markerX = (exp) => edgePadding + (exp.year - startYear) * YEAR_WIDTH

  const [activeId, setActiveId] = useState(items[0].id)
  const viewportRef = useRef(null)
  const dragState = useRef({ dragging: false, startX: 0, startScroll: 0, moved: false })
  const snapTimer = useRef(null)
  // True while a goTo()-triggered smooth scroll is in flight, so the scroll
  // handler doesn't fight it and snap back to the previous position mid-animation.
  const suppressScroll = useRef(false)

  const nearestItem = (scrollLeft) => {
    const playheadX = scrollLeft + playheadOffset
    let closest = items[0]
    let minDist = Infinity
    items.forEach((exp) => {
      const dist = Math.abs(markerX(exp) - playheadX)
      if (dist < minDist) {
        minDist = dist
        closest = exp
      }
    })
    return closest
  }

  const goTo = (exp) => {
    const vp = viewportRef.current
    if (!vp) return
    suppressScroll.current = true
    clearTimeout(snapTimer.current)
    vp.scrollTo({ left: markerX(exp) - playheadOffset, behavior: 'smooth' })
    setActiveId(exp.id)
    // Safety net for browsers without the `scrollend` event.
    setTimeout(() => {
      suppressScroll.current = false
    }, 500)
  }

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
      goTo(items[0])
    } else {
      // Viewport was resized — re-center whatever is currently active.
      goTo(active)
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

  const active = items.find((exp) => exp.id === activeId) ?? items[0]
  const activeIndex = items.findIndex((exp) => exp.id === active.id)

  const step = (delta) => {
    const next = items[Math.min(items.length - 1, Math.max(0, activeIndex + delta))]
    goTo(next)
  }

  const years = []
  for (let y = startYear; y <= endYear; y++) years.push(y)

  return (
    <div className="htimeline">
      <div className="htimeline-controls">
        <span className="htimeline-hint">Drag to explore</span>
        <div className="htimeline-nav">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={activeIndex === 0}
            aria-label="Previous role"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={activeIndex === items.length - 1}
            aria-label="Next role"
          >
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
              <div
                key={y}
                className={y === endYear ? 'htimeline-year htimeline-year-present' : 'htimeline-year'}
                style={{ left: edgePadding + (y - startYear) * YEAR_WIDTH }}
              >
                {y === endYear ? 'Present' : y}
              </div>
            ))}

            {years.slice(0, -1).flatMap((y) =>
              [0, 1, 2, 3].map((q) => (
                <div
                  key={`${y}-${q}`}
                  className="htimeline-tick"
                  style={{ left: edgePadding + (y - startYear) * YEAR_WIDTH + q * (YEAR_WIDTH / 4) }}
                />
              )),
            )}

            {items.map((exp) => (
              <button
                key={exp.id}
                type="button"
                className={exp.id === activeId ? 'htimeline-marker htimeline-marker-active' : 'htimeline-marker'}
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
        <h3 className="htimeline-detail-title">{active.title}</h3>
        <p className="htimeline-detail-meta">
          {active.company} · {active.dateRange}
        </p>
        <ul className="exp-card-bullets">
          {active.description.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
