import { useEffect } from 'react'

// Depth parallax for any children marked data-depth="n". Pointer position eases into a
// translate3d on each layer (transform only, no layout). One rAF loop that sleeps when settled.
export default function useParallax(ref) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const layers = [...root.querySelectorAll('[data-depth]')].map((el) => ({ el, d: parseFloat(el.dataset.depth) }))
    const tilts = [...root.querySelectorAll('[data-tilt]')]
    const t = { x: 0, y: 0 }, c = { x: 0, y: 0 }
    let raf = 0

    const tick = () => {
      c.x += (t.x - c.x) * 0.07
      c.y += (t.y - c.y) * 0.07
      for (const { el, d } of layers) el.style.transform = `translate3d(${(c.x * d).toFixed(2)}px, ${(c.y * d * 0.6).toFixed(2)}px, 0)`
      for (const el of tilts) el.style.transform = `rotateY(${(c.x * 16).toFixed(2)}deg) rotateX(${(-c.y * 11).toFixed(2)}deg)`
      raf = Math.abs(t.x - c.x) + Math.abs(t.y - c.y) > 0.002 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (e) => {
      const r = root.getBoundingClientRect()
      t.x = (e.clientX - r.left) / r.width - 0.5
      t.y = (e.clientY - r.top) / r.height - 0.5
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const onLeave = () => { t.x = 0; t.y = 0; if (!raf) raf = requestAnimationFrame(tick) }

    root.addEventListener('pointermove', onMove, { passive: true })
    root.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [ref])
}
