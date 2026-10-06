import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import useReveal from './useReveal.js'

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

// Scroll to a #hash target, or to the top on a new page. Back/forward and the
// first load are left to the browser's own scroll restoration.
export default function ScrollManager() {
  const { pathname, hash } = useLocation()
  const type = useNavigationType()
  const first = useRef(true)
  useReveal()

  useIsoLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (type === 'POP') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = hash && document.getElementById(hash.slice(1))
    if (target) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    else window.scrollTo(0, 0)
  }, [pathname, hash, type])

  return null
}
