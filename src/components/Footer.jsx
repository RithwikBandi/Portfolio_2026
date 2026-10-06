import { ExtLink } from './TLink.jsx'
import BatMark from './BatMark.jsx'
import { site } from '../data/site.js'

// Site footer
export default function Footer() {
  return (
    <footer>
      <div className="tape" aria-hidden="true" />
      <div className="footer">
        <div className="container footer__in">
          <div>
            <p className="footer__brand"><BatMark size={44} /><span>{site.name}</span></p>
            <p className="footer__line">Built by hand with React and Vite. No trackers, no cookies.</p>
          </div>
          <ul className="footer__links">
            {site.links.map((l) => (
              <li key={l.label}><ExtLink href={l.href}>{l.label}</ExtLink></li>
            ))}
            <li><a href={site.resume} target="_blank" rel="noopener noreferrer">Résumé<span className="sr-only"> (PDF, opens in a new tab)</span></a></li>
          </ul>
          <p className="mono footer__copy">© 2026 {site.name}</p>
        </div>
      </div>
    </footer>
  )
}
