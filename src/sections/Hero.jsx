import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Arrow from '../components/Arrow.jsx'
import Picture from '../components/Picture.jsx'
import useParallax from '../components/useParallax.js'
import { site, pillars } from '../data/site.js'

// The 3D layer is its own chunk, fetched after first paint, so it never touches LCP.
const HeroScene = lazy(() => import('../components/HeroScene.jsx'))

// Opening screen, composed like a film poster. Layer order follows DOM order, back to front:
// red smoke -> 3D scene -> the name -> the cut-out portrait -> the copy. Pointer parallax moves them at different depths.
export default function Hero() {
  const ref = useRef(null)
  const [scene, setScene] = useState(null) // null until the client decides; { coarse } afterwards
  useParallax(ref)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = navigator.connection?.saveData
    const lowMem = navigator.deviceMemory && navigator.deviceMemory < 4
    // ?nogl switches the 3D layer off (used to measure its cost against the same page)
    if (saveData || lowMem || new URLSearchParams(window.location.search).has('nogl')) return
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const go = () => setScene({ coarse, reduce })
    const id = 'requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 1800 }) : setTimeout(go, 900)
    return () => ('cancelIdleCallback' in window ? cancelIdleCallback(id) : clearTimeout(id))
  }, [])

  return (
    <>
      <section id="top" className="hero" aria-labelledby="hero-title" ref={ref}>
        <div className="hero__bg" aria-hidden="true" data-depth="-6" />

        {scene && (
          <Suspense fallback={null}>
            <div className="hero__gl-wrap" data-depth="10"><HeroScene coarse={scene.coarse} /></div>
          </Suspense>
        )}

        <div className="container hero__top">
          <p className="hero__kicker mono fade" style={{ '--d': '0.05s' }}>
            <i aria-hidden="true" />{site.status}
          </p>
          <div data-depth="-14">
            <h1 id="hero-title" className="hero__title">
              <span className="line"><span className="line__in" style={{ '--i': 0 }}>Rithwik</span></span>
              <span className="line"><span className="line__in" style={{ '--i': 1 }}>Bandi</span></span>
              <span className="sr-only"> — </span>
              <span className="hero__role fade" style={{ '--d': '0.5s' }}>
                Web developer <em>/</em> Growth expert
              </span>
            </h1>
          </div>
        </div>

        {/* Profile card: a pinned case-file sheet. The tilt wrapper rotates in 3D; the portrait sits on its own depth plane and breaks out of the frame. */}
        <figure className="hero__fig idcard" data-depth="14">
          <div className="idcard__tilt" data-tilt>
            <div className="idcard__paper" aria-hidden="true" />
            <div className="idcard__frame">
              <div className="idcard__field" aria-hidden="true" />
              <Picture
                name="portrait-bust"
                alt="Portrait of Rithwik Bandi smiling, wearing a denim shirt over a white tee"
                sizes="(min-width: 760px) 30vw, 80vw"
                eager
              />
            </div>
            <span className="idcard__tape" aria-hidden="true" />
            <figcaption className="idcard__tag">Web + Growth</figcaption>
          </div>
        </figure>

        <div className="container hero__bottom">
          <p className="hero__lead fade" style={{ '--d': '0.65s' }}>
            I build products people use, then take them to market: <strong>positioning, marketing and sales</strong> that turn
            attention into customers.
          </p>
          <div className="hero__cta fade" style={{ '--d': '0.8s' }}>
            <a className="btn btn--primary" href="#work">See my work <Arrow dir="down" /></a>
            <a className="btn" href="#contact">Get in touch</a>
          </div>
        </div>
      </section>

      <div className="tape" aria-hidden="true" />

      <section className="pillars" aria-label="What I do">
        <div className="container">
          <ol>
            {pillars.map((p) => (
              <li key={p.n} data-reveal>
                <span className="mono">{p.n}</span>
                <h2>{p.title}</h2>
                <p>{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
