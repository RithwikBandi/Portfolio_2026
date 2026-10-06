import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Fallback for browsers without scroll-driven animations (Firefox).
// One shared IntersectionObserver for the whole page; each element is observed
// once and released. Where native support exists this is a no-op.
export default function useReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (!document.documentElement.classList.contains('reveal-js')) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])
}
