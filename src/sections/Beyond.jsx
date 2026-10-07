import { useState } from 'react'
import Picture from '../components/Picture.jsx'
import PhotoViewer from '../components/PhotoViewer.jsx'
import Arrow from '../components/Arrow.jsx'
import { vietnam } from '../data/site.js'

// A small piece of personality, not a travel section: four photos on the page, all of them in the
// full-screen viewer.
const SIZES = '(min-width: 960px) 25vw, (min-width: 760px) 25vw, 46vw'

export default function Beyond() {
  const [open, setOpen] = useState(null) // index of the photo showing in the viewer, or null
  const { photos, band } = vietnam
  const more = photos.length - band

  return (
    <section id="beyond" className="section beyond" aria-labelledby="beyond-title">
      <div className="container">
        <header className="beyond__head" data-reveal>
          <p className="eyebrow">05 / Global exposure</p>
          <h2 id="beyond-title">{vietnam.title}</h2>
          <p>{vietnam.text}</p>
        </header>

        <div className="strip">
          {photos.slice(0, band).map((p, i) => (
            <figure key={p.name} className={`strip__item strip__item--${i + 1}`} data-reveal>
              <button type="button" className="strip__btn" onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1} of ${photos.length}: ${p.caption}`} aria-haspopup="dialog">
                <Picture name={p.name} alt={p.alt} sizes={SIZES} />
                <span className="strip__view mono" aria-hidden="true">View</span>
                {i === band - 1 && more > 0 && <span className="strip__more" aria-hidden="true">+{more}</span>}
              </button>
              <figcaption className="mono">{p.caption}</figcaption>
            </figure>
          ))}
        </div>

        <p className="beyond__all" data-reveal>
          <button type="button" className="btn" onClick={() => setOpen(0)} aria-haspopup="dialog">
            View all {photos.length} photos <Arrow />
          </button>
        </p>
      </div>

      <PhotoViewer photos={photos} index={open} onChange={setOpen} onClose={() => setOpen(null)} />
    </section>
  )
}
