import { principles } from '../data/site.js'

// Origin story
export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">02 / The approach</p>
          <h2 id="about-title">I build it. Then I take it to market.</h2>
        </header>

        <div className="about__grid">
          <div className="about__text">
            <p className="about__lead" data-reveal>
              Most developers stop at deploy and most marketers cannot ship. I do both: I build web products end to end,
              then handle the positioning, marketing and selling that decide whether anyone uses them.
            </p>
            <p data-reveal>
              The best work starts with a real annoyance. SRU Timetable began as an Excel parser and grew into a full
              product with tests, caching and a deploy pipeline, because reading a schedule should take seconds, not minutes.
            </p>
            <p data-reveal>
              Sales and marketing are where I am investing next: understanding a buyer, shaping an offer, writing the page
              that earns the reply. Based in Warangal, India, working with teams anywhere. This site is the working example.
            </p>
          </div>
        </div>

        <div className="principles">
          <h3 className="eyebrow" data-reveal>How I work</h3>
          <ol>
            {principles.map((p, i) => (
              <li key={p.title} data-reveal>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <h4>{p.title}</h4>
                <p>{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
