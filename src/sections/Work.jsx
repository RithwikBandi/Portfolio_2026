import { useEffect, useRef } from 'react'
import Plate from '../components/Plate.jsx'
import Picture from '../components/Picture.jsx'
import Arrow from '../components/Arrow.jsx'
import BatMark from '../components/BatMark.jsx'
import { TLink, ExtLink } from '../components/TLink.jsx'
import { projects, more } from '../data/projects.js'

// Selected work. On a mouse, each preview tilts in 3D toward the pointer (transform only).
export default function Work() {
  const list = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const plates = [...list.current.querySelectorAll('.show__plate')]
    const cleanups = plates.map((el) => {
      let raf = 0
      const move = (e) => {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => {
          el.style.setProperty('--ry', `${(x * 9).toFixed(2)}deg`)
          el.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`)
          el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`)
          el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`)
        })
      }
      const leave = () => { cancelAnimationFrame(raf); el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg') }
      el.addEventListener('pointermove', move, { passive: true })
      el.addEventListener('pointerleave', leave)
      return () => { cancelAnimationFrame(raf); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
    })
    return () => cleanups.forEach((c) => c())
  }, [])

  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">01 / Selected work</p>
          <h2 id="work-title">Selected work</h2>
          <p>Four projects. Open any of them for the story behind it.</p>
        </header>

        <ol className="showcase" ref={list}>
          {projects.map((p, i) => (
            <li key={p.slug} id={`work-${p.slug}`} className="show" data-reveal>
              <TLink to={`/work/${p.slug}`} className="show__plate" aria-hidden="true" tabIndex={-1}>
                <Plate project={p} eager={i === 0} sizes="(min-width: 960px) 58vw, 92vw" />
              </TLink>

              <div className="show__body">
                <p className="mono show__idx">{p.index} / {p.year}</p>
                <h3><TLink to={`/work/${p.slug}`}>{p.title}</TLink></h3>
                <p className="show__tag">{p.tagline}</p>
                <p className="show__sum">{p.summary}</p>

                <p className="mono show__stack">{p.stack.join(" · ")}</p>

                <div className="show__links">
                  <TLink to={`/work/${p.slug}`} className="btn btn--primary">Case study <Arrow /></TLink>
                  {p.links.live && <ExtLink href={p.links.live} className="ext">Live <Arrow dir="ne" /></ExtLink>}
                  {p.links.github && <ExtLink href={p.links.github} className="ext">Code <Arrow dir="ne" /></ExtLink>}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="more">
          <h3 className="eyebrow" data-reveal>Also built</h3>
          <ul className="more__grid">
            {more.map((m) => {
              const primary = m.live ? 'live' : m.github ? 'github' : null
              return (
              <li key={m.title} className={`mcard${primary ? ' mcard--link' : ''}`} data-reveal>
                <div className="mcard__shot">
                  {m.shot ? <Picture name={m.shot} alt="" sizes="(min-width: 760px) 44vw, 92vw" /> : <BatMark size={64} />}
                </div>
                <div className="mcard__body">
                  <div className="mcard__head">
                    <h4>{m.title}</h4>
                    <span className="mono">{m.year}</span>
                  </div>
                  <p className="mcard__text">{m.text}</p>
                  <p className="mono mcard__stack">{m.stack.join(' · ')}</p>
                  <div className="mcard__links">
                    {m.live && <ExtLink href={m.live} className={`ext${primary === 'live' ? ' mcard__primary' : ''}`}>{m.liveLabel || 'Live'} <Arrow dir="ne" /></ExtLink>}
                    {m.github && <ExtLink href={m.github} className={`ext${primary === 'github' ? ' mcard__primary' : ''}`}>Code <Arrow dir="ne" /></ExtLink>}
                    {m.private && <span className="mono mcard__private">Private work</span>}
                  </div>
                </div>
              </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
