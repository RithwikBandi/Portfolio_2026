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
              I’m a developer who wants to sell. I build web products end to end, and I’m putting the same effort into the
              other half: positioning them, marketing them and getting them in front of buyers.
            </p>
            <p data-reveal>
              SRU Timetable is the clearest example. My university publishes every timetable as one giant spreadsheet, so in
              late 2025 I wrote a parser for it. In August I rebuilt it as a real app with live data, a free-time view, batch
              comparison and an attendance calculator, and I wrote about the first version on Medium.
            </p>
            <p data-reveal>
              I’m based in Warangal, India, and open to roles and freelance work, remote included. If you need someone who can
              ship the product and also explain why it matters, that’s the job I want.
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
