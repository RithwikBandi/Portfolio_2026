import Picture from '../components/Picture.jsx'
import { vietnam } from '../data/site.js'

// A small piece of personality, not a travel section: four photos, two sentences.
const SIZES = '(min-width: 960px) 58vw, 92vw'

export default function Beyond() {
  return (
    <section id="beyond" className="section beyond" aria-labelledby="beyond-title">
      <div className="container">
        <header className="beyond__head" data-reveal>
          <p className="eyebrow">05 / Global exposure</p>
          <h2 id="beyond-title">{vietnam.title}</h2>
          <p>{vietnam.text}</p>
        </header>

        <div className="strip">
          {vietnam.photos.map((p, i) => (
            <figure key={p.name} className={`strip__item strip__item--${i + 1}`} data-reveal>
              <Picture name={p.name} alt={p.alt} sizes={SIZES} />
              <figcaption className="mono">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
