import { useNavigate, useParams } from 'react-router-dom'
import Plate from '../components/Plate.jsx'
import Flow from '../components/Flow.jsx'
import Frame from '../components/Frame.jsx'
import SampleTimetable from '../components/SampleTimetable.jsx'
import Arrow from '../components/Arrow.jsx'
import { TLink, ExtLink } from '../components/TLink.jsx'
import NotFound from './NotFound.jsx'
import { projects, getProject } from '../data/projects.js'
import { cameFromHome } from '../transition.js'

function Block({ label, children }) {
  return (
    <section className="block" data-reveal>
      <h2 className="block__label eyebrow">{label}</h2>
      <div className="block__body">{children}</div>
    </section>
  )
}

export default function CaseStudy() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const p = getProject(slug)
  if (!p) return <NotFound />

  const next = projects[(projects.indexOf(p) + 1) % projects.length]
  const { architecture: a } = p

  return (
    <article className="case">
      <header className="container case__head">
        {/* Back to the exact spot on the home page this case study was opened from; on a direct
            visit there is no such spot, so it lands on this project's card instead. */}
        <TLink
          to={`/#work-${p.slug}`}
          className="back mono"
          onClick={(e) => { if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && cameFromHome()) { e.preventDefault(); navigate(-1) } }}
        >
          <Arrow dir="left" /> All work
        </TLink>
        <p className="eyebrow">{p.index} — Case study</p>
        <h1>{p.title}</h1>
        <p className="case__tag">{p.tagline}</p>

        <dl className="case__meta">
          <div><dt className="mono">My part</dt><dd>{p.part}</dd></div>
          <div><dt className="mono">Year</dt><dd>{p.year}</dd></div>
          <div><dt className="mono">Status</dt><dd>{p.status}</dd></div>
        </dl>

        <div className="case__links">
          {p.links.live && <ExtLink href={p.links.live} className="btn btn--primary">Open live site <Arrow dir="ne" /></ExtLink>}
          {p.links.github && <ExtLink href={p.links.github} className="btn">View code <Arrow dir="ne" /></ExtLink>}
        </div>
      </header>

      <div className="container case__plate">
        <Plate project={p} interactive eager sizes="(min-width: 1400px) 1288px, 92vw" />
      </div>

      <div className="container case__body">
        <Block label="The problem">
          {p.problem.map((t) => <p key={t}>{t}</p>)}
        </Block>

        <Block label="What it does">
          <ul className="feat">
            {p.features.map((f) => (
              <li key={f.title}><h3>{f.title}</h3><p>{f.text}</p></li>
            ))}
          </ul>
        </Block>

        {p.demo === 'timetable' && (
          <Block label="Try it">
            <p>The live app loads your real batch. This recreation uses made-up data to show how the Free Time view finds your gaps.</p>
            <Frame tt host="interactive sample" caption="Sample data, not a real batch."><SampleTimetable interactive /></Frame>
          </Block>
        )}

        <Block label="How it works">
          <p>{a.intro}</p>
          <Flow nodes={a.nodes} />
          {a.note && <p>{a.note}</p>}
          {a.code && (
            <figure className="code">
              <pre tabIndex={0}><code>{a.code.text}</code></pre>
              <figcaption className="mono">{a.code.caption}</figcaption>
            </figure>
          )}
        </Block>

        <Block label="Engineering decisions">
          <ol className="dec">
            {p.decisions.map((d, i) => (
              <li key={d.title}>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <div><h3>{d.title}</h3><p>{d.text}</p></div>
              </li>
            ))}
          </ol>
        </Block>

        <Block label="Stack">
          <ul className="chips">
            {(p.fullStack || p.stack).map((s) => <li key={s}>{s}</li>)}
          </ul>
        </Block>

        {p.notes.length > 0 && (
          <Block label="Worth knowing">
            {p.notes.map((n) => <p key={n}>{n}</p>)}
          </Block>
        )}
      </div>

      <nav className="container next" aria-label="Next project" data-reveal>
        <p className="eyebrow">Next case study</p>
        <TLink to={`/work/${next.slug}`} className="next__link">
          <span>{next.title}</span>
          <Arrow />
        </TLink>
      </nav>
    </article>
  )
}
