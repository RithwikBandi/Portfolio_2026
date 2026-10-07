import { flushSync } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { animateCursor } from '../cursor.js'
import { canAnimate, routeTransition } from '../transition.js'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Internal link. Route changes run inside a page transition (see transition.js) when the
// browser supports it; everything else falls back to a plain client-side navigation.
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
    if (samePage || !canAnimate()) return

    e.preventDefault()
    const stop = animateCursor('working')
    routeTransition(window.location.pathname, url.pathname, () => flushSync(() => navigate(to)))
    setTimeout(stop, 600)
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
