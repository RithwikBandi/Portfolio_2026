import { flushSync } from 'react-dom'

// Page transitions and scroll memory for every route change: links, the "All work" button,
// browser back/forward and the trackpad / phone back gesture all go through here.
//
// - The page itself only fades and shifts (opacity + transform: compositor-only, never janky).
// - The project preview you clicked morphs into the case-study header, and back into its card.
//   Only that one preview is named, and only if it is on screen, so the browser snapshots two
//   elements instead of every plate on the page.
// - Every history entry remembers its scroll position, so going back lands exactly where you were.

const isBrowser = typeof window !== 'undefined'
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const canAnimate = () => isBrowser && !!document.startViewTransition && !reduced()

// ─── Scroll memory ─────────────────────────────────────────────────────────────
const STORE = 'scroll-memory'
const positions = new Map()
const paths = new Map() // history index -> pathname, so "All work" knows whether the page before was home
let rendered = isBrowser ? location.pathname : '/'
let entry = null

if (isBrowser) {
  history.scrollRestoration = 'manual' // we restore after the new page has rendered, not before
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE) || '{}')
    for (const [k, v] of Object.entries(saved.positions || {})) positions.set(k, v)
    for (const [k, v] of Object.entries(saved.paths || {})) paths.set(Number(k), v)
  } catch { /* storage unavailable: memory still works for this tab's lifetime */ }
  window.addEventListener('scroll', () => { if (entry) positions.set(entry, window.scrollY) }, { passive: true })
  window.addEventListener('pagehide', () => {
    try { sessionStorage.setItem(STORE, JSON.stringify({ positions: Object.fromEntries(positions), paths: Object.fromEntries(paths) })) } catch { /* ignore */ }
  })
}

const entryKey = (location) => `${location.key}|${location.pathname}`

// Called by ScrollManager after every route commit.
export function enter(location) {
  rendered = location.pathname
  entry = entryKey(location)
  const idx = history.state?.idx
  if (typeof idx === 'number') paths.set(idx, location.pathname)
}
export const savedScroll = (location) => positions.get(entryKey(location))

// True when the history entry right before this one is the home page.
export function cameFromHome() {
  const idx = history.state?.idx
  return typeof idx === 'number' && idx > 0 && paths.get(idx - 1) === '/'
}

// Instant scroll (the page has smooth scrolling on for in-page anchors, which must not apply here).
export const jump = (y) => window.scrollTo({ top: y, left: 0, behavior: 'instant' })

// ─── Transitions ───────────────────────────────────────────────────────────────
const slugOf = (path) => path.match(/^\/work\/([^/]+)/)?.[1] ?? null

function visiblePlate(slug) {
  const el = document.querySelector(`[data-plate="${slug}"]`)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return r.bottom > 0 && r.top < window.innerHeight && r.width > 0 ? el : null
}

// Runs `update` (which must render the new route synchronously) inside a view transition.
export function routeTransition(from, to, update) {
  if (!canAnimate()) { update(); return }
  const fromSlug = slugOf(from)
  const toSlug = slugOf(to)
  // The preview only morphs between home and its own case study, never case -> case.
  const slug = fromSlug && toSlug ? null : fromSlug || toSlug
  const root = document.documentElement
  root.dataset.route = toSlug ? 'in' : 'out'

  const named = []
  const name = (el) => { if (el) { el.style.viewTransitionName = 'plate'; named.push(el) } }
  const old = slug && visiblePlate(slug)
  if (old) old.style.transform = 'none' // drop the hover tilt so the morph starts from a flat card
  name(old)

  const t = document.startViewTransition(() => {
    for (const el of named.splice(0)) { el.style.viewTransitionName = ''; el.style.transform = '' }
    update()
    if (old) name(visiblePlate(slug))
  })
  t.finished.finally(() => {
    for (const el of named.splice(0)) el.style.viewTransitionName = ''
    delete root.dataset.route
  })
}

// Browser back/forward and back gestures. React Router renders on popstate, which would happen
// after the browser has already moved on, so the event is held back here, the old page is
// snapshotted, and the event is replayed with a synchronous render inside the transition.
// Same-page pops (the photo viewer's history entry, hash changes) pass straight through.
if (isBrowser) {
  window.addEventListener('popstate', (e) => {
    if (e.replayed || location.pathname === rendered) return
    e.stopImmediatePropagation()
    const replay = () => {
      const again = new PopStateEvent('popstate', { state: history.state })
      again.replayed = true
      flushSync(() => window.dispatchEvent(again))
    }
    // A swipe-back gesture has already animated the page in (Safari, Chrome): just swap instantly.
    if (e.hasUAVisualTransition) replay()
    else routeTransition(rendered, location.pathname, replay)
  })
}
