import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { TLink } from './TLink.jsx'
import BatMark from './BatMark.jsx'
import { site } from '../data/site.js'

const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'capabilities', label: 'Skills' },
  { id: 'training', label: 'Training' },
  { id: 'contact', label: 'Contact' },
]

// Fixed top bar with scroll-spy and a full-screen mobile menu
export default function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  // Scroll-spy on the home page: one observer, state changes only on section change.
  useEffect(() => {
    if (pathname !== '/') {
      setActive('')
      return
    }
    const ids = ['top', ...LINKS.map((l) => l.id)]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id === 'top' ? '' : e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    ids.map((id) => document.getElementById(id)).filter(Boolean).forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  // While the mobile menu is open: lock scroll, make the page inert, close on Escape.
  useEffect(() => {
    const page = document.getElementById('page')
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (page) page.inert = open
    if (open) window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      if (page) page.inert = false
    }
  }, [open])

  return (
    <header className="nav" data-open={open || undefined}>
      <div className="container nav__bar">
        <TLink to="/" className="nav__brand">
          <BatMark size={40} />
          <span className="nav__name">{site.name}</span>
        </TLink>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <TLink key={l.id} to={`/#${l.id}`} aria-current={active === l.id ? 'true' : undefined}>
              {l.label}
            </TLink>
          ))}
        </nav>

        <div className="nav__actions">
          <TLink to="/#contact" className="btn btn--primary btn--sm nav__cta">Get in touch</TLink>
          <button
            type="button"
            className="nav__burger"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span />
          </button>
        </div>
      </div>

      <span className="nav__progress" aria-hidden="true" />

      <div id="menu" className="menu">
        <nav aria-label="Mobile">
          {LINKS.map((l, i) => (
            <TLink key={l.id} to={`/#${l.id}`} style={{ '--i': i }}>{l.label}</TLink>
          ))}
        </nav>
        <p className="mono menu__foot">{site.email}</p>
      </div>
    </header>
  )
}
