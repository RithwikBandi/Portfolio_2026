import Picture from '../components/Picture.jsx'
import Arrow from '../components/Arrow.jsx'
import { ExtLink, TLink } from '../components/TLink.jsx'
import { education, credentials } from '../data/site.js'

// Education and certifications, kept because hirers scan for them.
export default function Training() {
  return (
    <section id="training" className="section training" aria-labelledby="training-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">04 / Training</p>
          <h2 id="training-title">Education &amp; certifications</h2>
        </header>

        <div className="training__grid">
          <div data-reveal>
            <h3 className="eyebrow">Education</h3>
            <ol className="edu">
              {education.map((e) => (
                <li key={e.school}>
                  <span className="mono">{e.period} · {e.note}</span>
                  <h4>{e.school}</h4>
                  <p>{e.degree}</p>
                  <b>{e.grade}</b>
                </li>
              ))}
            </ol>
          </div>

          <div data-reveal>
            <h3 className="eyebrow">Certifications</h3>
            <ul className="certs">
              {credentials.map((c) => (
                <li key={c.title} className="cert">
                  <Picture name={c.badge} alt={`${c.title} badge`} sizes="72px" />
                  <div>
                    <span className="mono">{c.issuer}</span>
                    <h4>{c.title}</h4>
                    <p>{c.text}</p>
                    <ExtLink href={c.href} className="ext cert__link">View certificate <Arrow dir="ne" /></ExtLink>
                  </div>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: 20 }}>
              <TLink to="/resume" className="btn">View résumé <Arrow /></TLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
