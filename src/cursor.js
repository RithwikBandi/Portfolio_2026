import cursors from './data/cursors.json'

// The Batman pack ships two animated cursors (.ani can't run on the web), so their frames are cycled:
//   busy    -> the pointer while something must finish (the contact form sending)
//   working -> "working in background" (first load, page transitions)
// Returns a stop() function. Calls can overlap; the latest one wins until it stops.
const stack = []

function paint() {
  const root = document.documentElement
  const top = stack[stack.length - 1]
  root.classList.toggle('is-busy', top?.kind === 'busy')
  root.classList.toggle('is-working', top?.kind === 'working')
  if (!top) root.style.removeProperty('--anim-cursor')
  else {
    const [x, y] = cursors[top.kind].frames[top.i]
    const base = `/cursors/${top.kind}-${top.i}`
    root.style.setProperty('--anim-cursor', `image-set(url('${base}.png') 1x, url('${base}@2x.png') 2x) ${x} ${y}, ${top.kind === 'busy' ? 'wait' : 'progress'}`)
  }
}

export function animateCursor(kind) {
  if (typeof document === 'undefined') return () => {}
  const { frames, ms } = cursors[kind]
  const job = { kind, i: 0 }
  job.timer = setInterval(() => { job.i = (job.i + 1) % frames.length; if (stack[stack.length - 1] === job) paint() }, Math.max(ms, 80))
  stack.push(job)
  paint()
  return () => {
    clearInterval(job.timer)
    const at = stack.indexOf(job)
    if (at >= 0) stack.splice(at, 1)
    paint()
  }
}
