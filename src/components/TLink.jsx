import { flushSync } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { animateCursor } from '../cursor.js'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Internal link. Route changes use the View Transitions API when available
// (shared project visuals morph between home and case study); everything else
// falls back to a plain client-side navigation.
export function TLink({ to, onClick, ...rest }) {
  const navigate = useNavigate()

  const handle = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target) return

    const url = new URL(to, window.location.origin)
    const samePage = url.pathname === window.location.pathname

    if (samePage && url.hash) {
      // Same-page anchor: scroll ourselves if the hash is already current.
      if (window.location.hash === url.hash) {
        e.preventDefault()
        document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
      }
      return
    }
    if (samePage || !document.startViewTransition || reducedMotion()) return

    e.preventDefault()
    const stop = animateCursor('working')
    const t = document.startViewTransition(() => {
      flushSync(() => navigate(to))
    })
    t.finished.then(stop, stop)
  }

  return <Link to={to} onClick={handle} {...rest} />
}

// External link: always new tab, with a screen-reader hint.
export function ExtLink({ href, children, className }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
