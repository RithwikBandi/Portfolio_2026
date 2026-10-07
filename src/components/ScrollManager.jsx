import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import useReveal from './useReveal.js'
import { enter, savedScroll, jump } from '../transition.js'

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

// Scroll after every route change, before paint (so a page transition snapshots the right spot):
// - back / forward: the exact position that history entry was left at
// - new page: its #hash target, or the top
// - same page, new #hash: smooth scroll to it
export default function ScrollManager() {
  const location = useLocation()
  const { pathname, hash, key } = location
  const type = useNavigationType()
  const prev = useRef(null)
  useReveal()

  useIsoLayoutEffect(() => {
    const was = prev.current
    prev.current = { pathname, hash }
    enter(location)

    if (!was) {
      // First load: a reload or a return from another site restores where the visitor was.
      const nav = performance.getEntriesByType?.('navigation')[0]?.type
      const y = savedScroll(location)
      if (y != null && (nav === 'reload' || nav === 'back_forward')) jump(y)
      return
    }
    if (type === 'POP') {
      if (was.pathname === pathname && was.hash === hash) return // e.g. the photo viewer closing
      const y = savedScroll(location)
      if (y != null) { jump(y); return }
    }
    const target = hash && document.getElementById(hash.slice(1))
    if (was.pathname === pathname && target) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    } else if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' })
    else jump(0)
  }, [pathname, hash, key, type])

  return null
}
