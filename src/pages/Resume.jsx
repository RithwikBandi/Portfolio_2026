import { useEffect, useRef, useState } from 'react'
import { TLink } from '../components/TLink.jsx'
import Arrow from '../components/Arrow.jsx'
import { RESUME_URL, renderResume } from '../components/renderResume.js'

// The résumé page: the PDF in /public/assets/resume is the only source of truth. It is rendered
// as a lit, tilting sheet in a dark stage. Replace the PDF in the repo and this page follows.
export default function Resume() {
  const stage = useRef(null)
  const host = useRef(null)
  const rigRef = useRef(null)
  const glareRef = useRef(null)
  const [state, setState] = useState('loading') // loading | ready | error

  // Render the PDF; re-render when the column width really changes so the sheet never blurs.
  useEffect(() => {
    const el = host.current
    let ctl, timer, width = 0
    const draw = () => {
      ctl?.abort()
      ctl = new AbortController()
      const mine = ctl
      width = el.clientWidth
      const first = !el.firstElementChild
      if (first) setState('loading')
      renderResume(el, { signal: mine.signal, replace: !first })
        .then(() => !mine.signal.aborted && setState('ready'))
        .catch((err) => { if (mine.signal.aborted) return; console.error('Resume render failed:', err); setState('error') })
    }
    const id = requestAnimationFrame(draw)
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => { if (Math.abs(el.clientWidth - width) > 24) draw() }, 250)
    }
    window.addEventListener('resize', onResize)
    return () => { ctl?.abort(); cancelAnimationFrame(id); clearTimeout(timer); window.removeEventListener('resize', onResize); el.replaceChildren() }
  }, [])

  // Pointer tilt. Writes transform directly on the rig (no CSS variables, no style recalculation
  // of the subtree) and eases once, in JS. Sleeps when settled.
  useEffect(() => {
    const root = stage.current, rig = rigRef.current, glare = glareRef.current
    if (state !== 'ready' || !root || !rig) return
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0
    const tick = () => {
      cx += (tx - cx) * 0.12
      cy += (ty - cy) * 0.12
      rig.style.transform = `rotateX(${(-cy * 5).toFixed(2)}deg) rotateY(${(cx * 6).toFixed(2)}deg)`
      glare.style.transform = `translate3d(${(cx * 80).toFixed(1)}%, ${(cy * 80).toFixed(1)}%, 0)`
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.003 ? requestAnimationFrame(tick) : 0
    }
    const go = () => { if (!raf) raf = requestAnimationFrame(tick) }
    const move = (e) => {
      const r = rig.parentElement.getBoundingClientRect()
      tx = Math.max(-0.5, Math.min(0.5, (e.clientX - r.left) / r.width - 0.5))
      ty = Math.max(-0.5, Math.min(0.5, (e.clientY - r.top) / r.height - 0.5))
      go()
    }
    const leave = () => { tx = 0; ty = 0; go() }
    root.addEventListener('pointermove', move, { passive: true })
    root.addEventListener('pointerleave', leave)
    return () => { cancelAnimationFrame(raf); rig.style.transform = ''; root.removeEventListener('pointermove', move); root.removeEventListener('pointerleave', leave) }
  }, [state])

  return (
    <section className="resume" aria-labelledby="resume-title">
      <div className="container resume__top">
        <div>
          <p className="eyebrow">Resume</p>
          <h1 id="resume-title">Rithwik Bandi</h1>
        </div>
        <div className="resume__actions">
          <TLink to="/" className="btn btn--sm"><Arrow dir="left" /> Back to website</TLink>
          <a className="btn btn--sm" href={RESUME_URL} target="_blank" rel="noopener noreferrer">Open original PDF<span className="sr-only"> (opens in a new tab)</span></a>
          <a className="btn btn--primary btn--sm" href={RESUME_URL} download="Rithwik_Bandi_Resume.pdf">Download PDF <Arrow dir="down" /></a>
        </div>
      </div>

      <div className="resume__stage" ref={stage} data-state={state}>
        <div className="resume__light" aria-hidden="true" />
        <div className="resume__rig" ref={rigRef}>
          <div className="resume__plate resume__plate--2" aria-hidden="true" />
          <div className="resume__plate resume__plate--1" aria-hidden="true" />
          <div className="resume__sheets" ref={host} />
          <div className="resume__clip" aria-hidden="true"><div className="resume__glare" ref={glareRef} /></div>
        </div>
        {state === 'loading' && <p className="mono resume__status" role="status">Loading resume…</p>}
        {state === 'error' && (
          <p className="resume__status" role="alert">
            The resume could not be displayed here. <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">Open the PDF</a> instead.
          </p>
        )}
      </div>

      <noscript>
        <p className="container">JavaScript is needed for this view. <a href={RESUME_URL}>Open the PDF</a> instead.</p>
      </noscript>
    </section>
  )
}
