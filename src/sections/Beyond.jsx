import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import Picture from '../components/Picture.jsx'
import PhotoViewer from '../components/PhotoViewer.jsx'
import Arrow from '../components/Arrow.jsx'
import { vietnam } from '../data/site.js'

// A small piece of personality, not a travel section: four photos on the page, all of them in the
// full-screen viewer.
const SIZES = '(min-width: 960px) 25vw, (min-width: 760px) 25vw, 46vw'
const NAME = 'pv-photo' // shared-element name: the tile's photo morphs into the viewer and back
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Beyond() {
  const [open, setOpen] = useState(null) // index of the photo showing in the viewer, or null
  const openRef = useRef(null)
  const closing = useRef(false)
  const pushed = useRef(false)
  const tiles = useRef([]) // the tile <img> elements, for the morph
  const { photos, band } = vietnam
  const more = photos.length - band

  // Runs a state change inside a view transition (the photo morphs between tile and viewer), or
  // plainly when the browser has none / the visitor prefers reduced motion.
  const morph = (update, tileImg) => {
    if (!document.startViewTransition || reduced()) { update(); return }
    const root = document.documentElement
    root.dataset.vt = 'pv'
    const t = document.startViewTransition(update)
    t.finished.then(() => {}, () => {}).then(() => { delete root.dataset.vt; if (tileImg) tileImg.style.viewTransitionName = '' })
  }

  const openViewer = useCallback((i) => {
    if (openRef.current !== null || closing.current) return
    const tile = i < band ? tiles.current[i] : null
    if (tile) tile.style.viewTransitionName = NAME
    const update = () => {
      if (tile) tile.style.viewTransitionName = '' // only one element may carry the name in the "after" frame
      flushSync(() => { openRef.current = i; setOpen(i) })
    }
    morph(update, tile)
    // One history entry, so the back gesture / browser back / phone back button closes the viewer
    // instead of leaving the page.
    history.pushState({ ...history.state, pv: 1 }, '') // keeps the router's key, so scroll memory stays on this entry
    pushed.current = true
  }, [band])

  const closeViewer = useCallback((fromPop = false) => {
    const i = openRef.current
    if (i === null || closing.current) return
    closing.current = true
    const tile = i < band ? tiles.current[i] : null
    const update = () => {
      flushSync(() => { openRef.current = null; setOpen(null) })
      if (tile) tile.style.viewTransitionName = NAME
      closing.current = false
    }
    if (!document.startViewTransition || reduced()) {
      // No view transitions: a quick fade-out, then close.
      const d = document.querySelector('dialog.pv')
      if (d && !reduced()) { d.setAttribute('data-closing', ''); setTimeout(update, 150) } else update()
    } else morph(update, tile)
    if (pushed.current) { pushed.current = false; if (!fromPop) history.back() }
  }, [band])

  // Back gesture / browser back while the viewer is open closes it.
  useEffect(() => {
    const onPop = () => { if (openRef.current !== null) { pushed.current = false; closeViewer(true) } }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [closeViewer])

  // Fetch the big version of a photo as soon as someone shows interest in its tile.
  const warm = (name) => {
    const wide = (window.innerWidth * (window.devicePixelRatio || 1)) > 1700 ? 2400 : 1600
    new Image().src = `/img/${name}-${wide}.avif`
  }

  return (
    <section id="beyond" className="section beyond" aria-labelledby="beyond-title">
      <div className="container">
        <header className="beyond__head" data-reveal>
          <p className="eyebrow">05 / Global exposure</p>
          <h2 id="beyond-title">{vietnam.title}</h2>
          <p>{vietnam.text}</p>
        </header>

        <div className="strip">
          {photos.slice(0, band).map((p, i) => (
            <figure key={p.name} className={`strip__item strip__item--${i + 1}`} data-reveal>
              <button
                type="button"
                className="strip__btn"
                ref={(el) => { tiles.current[i] = el?.querySelector('img') ?? null }}
                onClick={() => openViewer(i)}
                onPointerEnter={() => warm(p.name)}
                onFocus={() => warm(p.name)}
                aria-label={`Open photo ${i + 1} of ${photos.length}: ${p.caption}`}
                aria-haspopup="dialog"
              >
                <Picture name={p.name} alt={p.alt} sizes={SIZES} />
                <span className="strip__view mono" aria-hidden="true">View</span>
                {i === band - 1 && more > 0 && <span className="strip__more" aria-hidden="true">+{more}</span>}
              </button>
              <figcaption className="mono">{p.caption}</figcaption>
            </figure>
          ))}
        </div>

        <p className="beyond__all" data-reveal>
          <button type="button" className="btn" onClick={() => openViewer(0)} aria-haspopup="dialog">
            View all {photos.length} photos <Arrow />
          </button>
        </p>
      </div>

      <PhotoViewer photos={photos} index={open} onChange={(i) => { openRef.current = i; setOpen(i) }} onRequestClose={() => closeViewer()} />
    </section>
  )
}
