import { useEffect, useRef } from 'react'
import Arrow from './Arrow.jsx'
import Picture from './Picture.jsx'

const pad = (n) => String(n).padStart(2, '0')
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Full-screen photo viewer on the native <dialog>: Esc, focus trap, inert page and focus return come
// from the browser. Arrow keys, swipe (touch + pen + mouse drag), thumbnail rail and tap-outside to
// close sit on top. Images are only requested once it opens.
export default function PhotoViewer({ photos, index, onChange, onClose }) {
  const dialog = useRef(null)
  const stage = useRef(null)
  const rail = useRef(null)
  const drag = useRef(null)
  const dir = useRef(0)
  const open = index !== null
  const total = photos.length

  // Open / close the native dialog from state; Esc closes it natively and reports back.
  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      document.documentElement.style.overflow = 'hidden'
    }
    if (!open && d.open) d.close()
    if (!open) document.documentElement.style.overflow = ''
  }, [open])
  useEffect(() => () => { document.documentElement.style.overflow = '' }, [])

  const go = (to) => {
    const next = (to + total) % total
    dir.current = to > index || (index === total - 1 && next === 0) ? 1 : -1
    onChange(next)
  }

  // Warm the neighbouring photos so stepping through never waits on the network.
  useEffect(() => {
    if (!open) return
    const wide = (window.innerWidth * (window.devicePixelRatio || 1)) > 1700 ? 2400 : 1600
    for (const j of [index + 1, index - 1]) {
      const p = photos[(j + total) % total]
      new Image().src = `/img/${p.name}-${wide}.webp`
    }
  }, [open, index, photos, total])

  // Keep the active thumbnail in view.
  useEffect(() => {
    if (!open) return
    rail.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' })
  }, [open, index])

  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1) }
    else if (e.key === 'Home') { e.preventDefault(); go(0) }
    else if (e.key === 'End') { e.preventDefault(); go(total - 1) }
  }

  // Swipe: the photo follows the finger, then either commits to the next one or springs back.
  const down = (e) => {
    if (e.target.closest('button')) return
    drag.current = { x: e.clientX, y: e.clientY, dx: 0, locked: false, t: performance.now() }
  }
  const move = (e) => {
    const d = drag.current
    if (!d) return
    d.dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (!d.locked) {
      if (Math.abs(d.dx) < 8 && Math.abs(dy) < 8) return
      if (Math.abs(dy) > Math.abs(d.dx)) { drag.current = null; return } // vertical = let the page be
      d.locked = true
      stage.current.setPointerCapture?.(e.pointerId)
    }
    const slide = stage.current.querySelector('.pv__slide')
    if (slide) { slide.style.transition = 'none'; slide.style.translate = `${d.dx}px 0` }
  }
  const up = () => {
    const d = drag.current
    drag.current = null
    if (!d || !d.locked) return
    const slide = stage.current.querySelector('.pv__slide')
    const fast = Math.abs(d.dx) / Math.max(performance.now() - d.t, 1) > 0.5
    if (Math.abs(d.dx) > 70 || (fast && Math.abs(d.dx) > 24)) go(d.dx < 0 ? index + 1 : index - 1)
    else if (slide) { slide.style.transition = ''; slide.style.translate = '' }
  }
  // Tapping the dark area around the photo closes the viewer.
  const tapOutside = (e) => { if (e.target === e.currentTarget && !drag.current?.locked) onClose() }

  const p = open ? photos[index] : null
  return (
    <dialog ref={dialog} className="pv" aria-label="Winter Immersion photos" onClose={onClose} onKeyDown={onKey}>
      {p && (
        <div className="pv__in">
          <div className="pv__tape" aria-hidden="true" />
          <header className="pv__bar">
            <p className="pv__count mono" aria-live="polite"><b>{pad(index + 1)}</b> / {pad(total)}</p>
            <p className="pv__cap">{p.caption}</p>
            <button type="button" className="pv__close" onClick={onClose} aria-label="Close viewer">
              <span className="mono">Esc</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" aria-hidden="true"><path d="M3 3l12 12M15 3L3 15" /></svg>
            </button>
          </header>

          <div className="pv__stage" ref={stage} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onClick={tapOutside}>
            <button type="button" className="pv__nav pv__nav--prev" onClick={() => go(index - 1)} aria-label="Previous photo"><Arrow dir="left" size={18} /></button>
            <div className="pv__slide" key={index} data-dir={dir.current}>
              <Picture name={p.name} alt={p.alt} sizes="100vw" eager className="pv__img" />
            </div>
            <button type="button" className="pv__nav pv__nav--next" onClick={() => go(index + 1)} aria-label="Next photo"><Arrow size={18} /></button>
          </div>

          <ul className="pv__rail" ref={rail} aria-label="All photos">
            {photos.map((t, i) => (
              <li key={t.name}>
                <button type="button" className="pv__thumb" aria-current={i === index ? 'true' : undefined} aria-label={`Photo ${i + 1}: ${t.caption}`} onClick={() => go(i)}>
                  <Picture name={t.name} alt="" sizes="72px" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </dialog>
  )
}
