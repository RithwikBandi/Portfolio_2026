import { useEffect, useRef, useState } from 'react'
import { TLink } from '../components/TLink.jsx'
import Arrow from '../components/Arrow.jsx'
import BatMark from '../components/BatMark.jsx'
import useParallax from '../components/useParallax.js'
import resume from '../data/resume.json'

// The résumé as a native page. Every word comes from src/data/resume.json, which
// scripts/extract-resume.mjs generates from the PDF in public/assets/resume at build time:
// replace the PDF, rebuild, and this page follows. Nothing here is hand-written résumé content.
const PDF_URL = '/assets/resume/Rithwik_Resume.pdf'

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const pad = (n) => String(n + 1).padStart(2, '0')

const ICONS = {
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  email: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
  github: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
  linkedin: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
}
const Icon = ({ kind }) => (
  <svg className="rs-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={ICONS[kind] || ICONS.link} />
  </svg>
)

// Rich text from the PDF: bold stays bold, nothing else is added.
const Rich = ({ parts }) => parts.map((p, i) => (p.b ? <strong key={i}>{p.t}</strong> : p.i ? <em key={i}>{p.t}</em> : <span key={i}>{p.t}</span>))

// "Role – Organisation" splits on the dash into a title and an eyebrow line (words unchanged).
const splitTitle = (t) => {
  const m = t.match(/^(.*?)\s+[–—]\s+(.*)$/)
  return m ? { main: m[1], sub: m[2] } : { main: t, sub: null }
}

// A skills-style bullet is "Label: a | b | c" with a bold label.
const asSkill = (b) => {
  const label = b[0]?.b && /:\s*$/.test(b[0].t) ? b[0].t.replace(/:\s*$/, '') : null
  if (!label) return null
  const text = b.slice(1).map((p) => p.t).join('')
  return { label, items: text.split('|').map((x) => x.trim()).filter(Boolean) }
}
const isSkills = (s) => s.entries.length > 0 && s.entries.every((e) => !e.title && e.bullets.every((b) => asSkill(b)))

function Entry({ e, i }) {
  const { main, sub } = e.title ? splitTitle(e.title) : {}
  return (
    <li className="rs-entry" data-reveal style={{ '--d': `${Math.min(i, 4) * 0.06}s` }}>
      <div className="rs-entry__when mono">
        {e.meta && (e.metaHref
          ? <a className="rs-pill" href={e.metaHref} target="_blank" rel="noopener noreferrer">{e.meta}<Arrow dir="ne" size={12} /><span className="sr-only"> (opens in a new tab)</span></a>
          : <span>{e.meta}</span>)}
        {e.meta2 && <span className="rs-entry__when2">{e.meta2}</span>}
      </div>
      <div className="rs-entry__body">
        {e.title && (
          <h3 className="rs-entry__title">
            {sub && <span className="rs-entry__org mono">{sub}</span>}
            {main}
          </h3>
        )}
        {e.subtitle && <p className="rs-entry__sub">{e.subtitle}</p>}
        {e.bullets.length > 0 && (
          <ul className="rs-bullets">
            {e.bullets.map((b, k) => <li key={k}><Rich parts={b} /></li>)}
          </ul>
        )}
      </div>
    </li>
  )
}

function Skills({ s }) {
  const groups = s.entries.flatMap((e) => e.bullets.map(asSkill))
  return (
    <dl className="rs-skills">
      {groups.map((g) => (
        <div className="rs-skills__row" key={g.label} data-reveal>
          <dt className="mono">{g.label}</dt>
          <dd>{g.items.map((it) => <span className="rs-chip" key={it}>{it}</span>)}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function Resume() {
  const ref = useRef(null)
  const [active, setActive] = useState('')
  useParallax(ref)

  // Scroll-spy for the section index.
  useEffect(() => {
    const els = [...document.querySelectorAll('.rs-sec')]
    if (!els.length) return
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
    }, { rootMargin: '-35% 0px -55% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const sections = resume.sections
  const actions = (
    <div className="resume__actions">
      <TLink to="/" className="btn btn--sm"><Arrow dir="left" /> Back to website</TLink>
      <a className="btn btn--sm" href={PDF_URL} target="_blank" rel="noopener noreferrer">Open original PDF<span className="sr-only"> (opens in a new tab)</span></a>
      <a className="btn btn--primary btn--sm" href={PDF_URL} download="Rithwik_Bandi_Resume.pdf">Download PDF <Arrow dir="down" /></a>
    </div>
  )

  if (!resume.ok) {
    return (
      <section className="resume container" aria-labelledby="resume-title">
        <h1 id="resume-title">Resume</h1>
        <p>This page could not be built from the PDF. You can still read it directly.</p>
        {actions}
      </section>
    )
  }

  return (
    <section className="resume" aria-labelledby="resume-title" ref={ref}>
      <div className="container resume__top">
        <p className="eyebrow">Resume</p>
        {actions}
      </div>

      <div className="container rs">
        <aside className="rs-index" aria-label="Sections">
          <ol>
            {sections.map((s, i) => (
              <li key={s.title}>
                <a href={`#${slug(s.title)}`} aria-current={active === slug(s.title) ? 'true' : undefined}>
                  <span className="mono">{pad(i)}</span>{s.title}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <div className="rs-main">
          <header className="rs-card">
            <div className="rs-card__tilt" data-tilt>
              <div className="rs-card__bat" data-depth="26" aria-hidden="true"><BatMark size={260} /></div>
              <div className="rs-card__in" data-depth="8">
                <h1 id="resume-title">{resume.name}</h1>
                <ul className="rs-contacts">
                  {resume.contacts.map((c) => (
                    <li key={c.label}>
                      {c.href
                        ? <a href={c.href} {...(/^https?:/.test(c.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}><Icon kind={c.kind} />{c.label}</a>
                        : <span><Icon kind={c.kind} />{c.label}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </header>

          {sections.map((s, i) => (
            <section className="rs-sec" id={slug(s.title)} key={s.title} aria-labelledby={`${slug(s.title)}-h`}>
              <header className="rs-sec__head" data-reveal>
                <span className="rs-sec__n mono">{pad(i)}</span>
                <h2 id={`${slug(s.title)}-h`}>{s.title}</h2>
              </header>
              {s.paragraphs.map((p, k) => <p className="rs-lead" key={k} data-reveal><Rich parts={p} /></p>)}
              {isSkills(s) ? <Skills s={s} /> : s.entries.length > 0 && (
                <ol className="rs-timeline">
                  {s.entries.map((e, k) => <Entry e={e} i={k} key={k} />)}
                </ol>
              )}
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
