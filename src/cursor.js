import cursors from './data/cursors.json'

// Two animated cursors from the Batman pack (.ani cannot run on the web):
//   working -> "working in background": a STATIC frame (class on <html>, set once, no timers,
//              so nothing is restyled while it shows). Used for first load and page transitions.
//   busy    -> animated, drawn on ONE full-screen overlay element, so each frame touches a single
//              node, never the whole document. Used while the contact form sends.
// Both have hard time limits and are cleared on back/forward navigation.
const LIMIT = { working: 1500, busy: 20000 }
const img = (kind, i) => {
  const [x, y] = cursors[kind].frames[i]
  const base = `/cursors/${kind}-${i}`
  return `image-set(url('${base}.png') 1x, url('${base}@2x.png') 2x) ${x} ${y}, ${kind === 'busy' ? 'wait' : 'progress'}`
}

let workingJobs = 0
let overlay = null

export function animateCursor(kind) {
  if (typeof document === 'undefined') return () => {}
  const root = document.documentElement
  let done = false
  let timer = 0
  const limit = setTimeout(() => stop(), LIMIT[kind])

  const stop = () => {
    if (done) return
    done = true
    clearTimeout(limit)
    clearInterval(timer)
    if (kind === 'working') {
      if (--workingJobs <= 0) { workingJobs = 0; root.classList.remove('is-working'); root.style.removeProperty('--working-cursor') }
    } else if (overlay) { overlay.remove(); overlay = null }
  }

  if (kind === 'working') {
    if (workingJobs++ === 0) {
      root.style.setProperty('--working-cursor', img('working', 0))
      root.classList.add('is-working')
    }
  } else {
    overlay?.remove()
    overlay = document.createElement('div')
    overlay.className = 'cursor-busy'
    overlay.setAttribute('aria-hidden', 'true')
    document.body.append(overlay)
    const { frames, ms } = cursors.busy
    let i = 0
    const tick = () => { overlay.style.cursor = img('busy', i); i = (i + 1) % frames.length }
    tick()
    timer = setInterval(tick, Math.max(ms, 80))
  }
  return stop
}

// Back/forward (trackpad swipe, browser buttons, bfcache restore) must never leave one behind.
if (typeof window !== 'undefined') {
  const reset = () => {
    workingJobs = 0
    document.documentElement.classList.remove('is-working')
    document.documentElement.style.removeProperty('--working-cursor')
  }
  window.addEventListener('popstate', reset)
  window.addEventListener('pageshow', reset)
}

// Cursor images are fetched once the browser is idle, so the first hover never waits on the network.
export function preloadCursors() {
  const dpr = (window.devicePixelRatio || 1) > 1.25 ? '@2x' : ''
  const names = ['default', 'pointer', 'text', 'write', 'help', 'not-allowed', 'crosshair', 'move', 'ew-resize', 'ns-resize', 'nwse-resize', 'nesw-resize', 'working-0', 'busy-0']
  const run = () => names.forEach((n) => { new Image().src = `/cursors/${n}${dpr}.png` })
  ;(window.requestIdleCallback || ((f) => setTimeout(f, 800)))(run)
}
