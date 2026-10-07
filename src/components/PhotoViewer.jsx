import { useEffect, useLayoutEffect, useRef } from 'react'
import Arrow from './Arrow.jsx'
import Picture from './Picture.jsx'

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
const pad = (n) => String(n).padStart(2, '0')
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Full-screen photo viewer on the native <dialog>: focus trap, inert page and Esc come from the
// browser. Clicking or tapping anywhere outside the photo and the controls closes it, like apple.com.
// Arrow keys, swipe, a thumbnail rail and neighbour preloading sit on top. Opening and closing are
// orchestrated by the parent (so the photo can morph from / back to its tile): this component only
// asks to close via onRequestClose. Images are only requested once it opens.
export default function PhotoViewer({ photos, index, onChange, onRequestClose }) {
  const dialog = useRef(null)
  const stage = useRef(null)
  const rail = useRef(null)
  const drag = useRef(null)
  const swiped = useRef(false)
  const press = useRef(null) // where a press outside the photo started, or null
  const dir = useRef(0)
  const open = index !== null
  const total = photos.length

  // Layout effect, so the dialog opens/closes in the same commit as the state change. That is what
  // lets a view transition capture the right "after" frame.
  useIsoLayoutEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) {
      dir.current = 0
      d.removeAttribute('data-closing')
      d.showModal()
      document.documentElement.style.overflow = 'hidden'
    }
    if (!open && d.open) {
      d.close()
      document.documentElement.style.overflow = ''
    }
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
      try { stage.current.setPointerCapture(e.pointerId) } catch { /* pointer already gone */ }
    }
    const slide = stage.current.querySelector('.pv__slide')
    if (slide) { slide.style.transition = 'none'; slide.style.translate = `${d.dx}px 0` }
  }
  const up = () => {
    const d = drag.current
    drag.current = null
    if (!d || !d.locked) return
    swiped.current = true // the click that follows a swipe must not count as "outside"
    setTimeout(() => { swiped.current = false }, 80)
    const slide = stage.current.querySelector('.pv__slide')
    const fast = Math.abs(d.dx) / Math.max(performance.now() - d.t, 1) > 0.5
    if (Math.abs(d.dx) > 70 || (fast && Math.abs(d.dx) > 24)) go(d.dx < 0 ? index + 1 : index - 1)
    else if (slide) { slide.style.transition = ''; slide.style.translate = '' }
  }

  // Click / tap anywhere that is not the photo, a control or the title text closes the viewer. The
  // photo's own rectangle is checked geometrically: its container spans the whole stage.
  const outside = (e) => {
    if (e.target.closest('button, .pv__rail, .pv__count, .pv__cap')) return false
    const r = stage.current?.querySelector('.pv__img')?.getBoundingClientRect()
    return !(r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom)
  }
  // Works like any desktop app: a plain click outside closes, even with the title selected (the
  // selection is simply dropped). A drag never closes, so selecting text, wherever the press
  // started or the release lands, keeps the viewer open.
  const clickAway = (e) => {
    const start = press.current
    press.current = null
    if (swiped.current || !start || !outside(e)) return
    if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 6) return
    window.getSelection()?.removeAllRanges()
    onRequestClose()
  }

  const p = open ? photos[index] : null
  return (
    <dialog
      ref={dialog}
      className="pv"
      data-cursor="pointer"
      aria-label="Winter Immersion photos"
      onCancel={(e) => { e.preventDefault(); onRequestClose() }}
      onKeyDown={onKey}
      onPointerDown={(e) => { press.current = e.button === 0 && outside(e) ? { x: e.clientX, y: e.clientY } : null }}
      onClick={clickAway}
    >
      {p && (
        <div className="pv__in">
          <div className="pv__tape" aria-hidden="true" />
          <header className="pv__bar">
            <p className="pv__count mono" data-cursor="text" aria-live="polite"><b>{pad(index + 1)}</b> / {pad(total)}</p>
            <p className="pv__cap" data-cursor="text">{p.caption}</p>
            <button type="button" className="pv__close" onClick={onRequestClose} aria-label="Close viewer">
              <span className="mono">Esc</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" aria-hidden="true"><path d="M3 3l12 12M15 3L3 15" /></svg>
            </button>
          </header>

          <div className="pv__stage" ref={stage} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onDragStart={(e) => e.preventDefault()}>
            <button type="button" className="pv__nav pv__nav--prev" onClick={() => go(index - 1)} aria-label="Previous photo"><Arrow dir="left" size={18} /></button>
            <div className="pv__slide" key={index} data-dir={dir.current}>
              {/* The small version of the same photo is already cached from the tile: it shows instantly while the big one loads. */}
              <Picture name={p.name} alt={p.alt} sizes="100vw" eager className="pv__img" data-cursor="default" draggable={false} style={{ backgroundImage: `url(/img/${p.name}-640.avif)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            </div>
            <button type="button" className="pv__nav pv__nav--next" onClick={() => go(index + 1)} aria-label="Next photo"><Arrow size={18} /></button>
          </div>

          <ul className="pv__rail" data-cursor="default" ref={rail} aria-label="All photos">
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
