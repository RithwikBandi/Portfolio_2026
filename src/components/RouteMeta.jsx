import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { metaFor, headTags } from '../meta.js'
import { SITE_URL } from '../data/site.js'

// Prerendered pages already carry the right <head>; this only swaps it on
// client-side navigation (and fills it in during dev, where nothing is prerendered).
export default function RouteMeta() {
  const { pathname } = useLocation()
  const first = useRef(true)

  useEffect(() => {
    const meta = metaFor(pathname)
    const canonical = document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')
    // First load: keep the prerendered tags only if they belong to this exact page
    // (self-heals if a host ever serves the wrong prerendered file).
    if (first.current && canonical === `${SITE_URL}${meta.path}`) {
      first.current = false
      return
    }
    first.current = false
    document.head.querySelectorAll('[data-seo]').forEach((n) => n.remove())
    document.head.insertAdjacentHTML('beforeend', headTags(meta))
  }, [pathname])

  return null
}
