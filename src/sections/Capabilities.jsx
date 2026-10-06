import { capabilities } from '../data/site.js'

// Skills as a short statement of range, not a wall of keywords: three disciplines, each with a
// deliberate toolset and one line on what it is for.
export default function Capabilities() {
  return (
    <section id="capabilities" className="section caps" aria-labelledby="caps-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">03 / Capabilities</p>
          <h2 id="caps-title">Three disciplines. One operator.</h2>
        </header>

        <ol className="disc">
          {capabilities.map((c) => (
            <li key={c.title} className="disc__row" data-reveal>
              <span className="disc__n mono">{c.n}</span>
              <div className="disc__main">
                <h3>{c.title}</h3>
                <p>{c.line}</p>
                {c.proof && <p className="disc__proof mono">{c.proof}</p>}
              </div>
              <ul className="disc__tools">
                {c.tools.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
