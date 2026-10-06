import { useEffect, useRef, useState } from 'react'
import { TLink } from '../components/TLink.jsx'
import Arrow from '../components/Arrow.jsx'
import { RESUME_URL, renderResume } from '../components/renderResume.js'

// The résumé page: the PDF in /public/assets/resume is the only source of truth. It is rendered
// as a lit, tilting sheet in a dark stage. Replace the PDF in the repo and this page follows.
export default function Resume() {
  const stage = useRef(null)
  const host = useRef(null)
  const [state, setState] = useState('loading') // loading | ready | error

  useEffect(() => {
    const el = host.current
    const ctl = new AbortController()
    // Wait a frame so the canvas is sized to the real column width.
    const id = requestAnimationFrame(() => {
      renderResume(el, { signal: ctl.signal })
        .then(() => !ctl.signal.aborted && setState('ready'))
        .catch((err) => { if (ctl.signal.aborted) return; console.error('Resume render failed:', err); setState('error') })
    })
    return () => { ctl.abort(); cancelAnimationFrame(id); el.replaceChildren() }
  }, [])

  // Pointer tilt + moving light. Transform and CSS variables only; one rAF while moving.
  useEffect(() => {
    const root = stage.current
    if (state !== 'ready' || !root) return
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0
    const tick = () => {
      cx += (tx - cx) * 0.1
      cy += (ty - cy) * 0.1
      root.style.setProperty('--rx', `${(-cy * 7).toFixed(2)}deg`)
      root.style.setProperty('--ry', `${(cx * 9).toFixed(2)}deg`)
      root.style.setProperty('--gx', `${((cx + 0.5) * 100).toFixed(1)}%`)
      root.style.setProperty('--gy', `${((cy + 0.5) * 100).toFixed(1)}%`)
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(tick) : 0
    }
    const go = () => { if (!raf) raf = requestAnimationFrame(tick) }
    const move = (e) => {
      const r = root.getBoundingClientRect()
      tx = Math.max(-0.5, Math.min(0.5, (e.clientX - r.left) / r.width - 0.5))
      ty = Math.max(-0.5, Math.min(0.5, (e.clientY - r.top) / r.height - 0.5))
      go()
    }
    const leave = () => { tx = 0; ty = 0; go() }
    root.addEventListener('pointermove', move, { passive: true })
    root.addEventListener('pointerleave', leave)
    return () => { cancelAnimationFrame(raf); root.removeEventListener('pointermove', move); root.removeEventListener('pointerleave', leave) }
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
        <div className="resume__rig">
          <div className="resume__plate resume__plate--2" aria-hidden="true" />
          <div className="resume__plate resume__plate--1" aria-hidden="true" />
          <div className="resume__sheets" ref={host} />
          <div className="resume__glare" aria-hidden="true" />
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
