import { useEffect, useRef } from 'react'

// Selectors for each cursor state — unchanged from original
const HAND_SEL = 'a, button, [role="button"], [role="link"], summary, label[for]'
const IBEAM_SEL = 'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]):not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, [contenteditable="true"], [contenteditable=""]'

function closestMatch(el, selector) {
  try { return el && el.closest(selector) } catch { return null }
}

function getState(x, y) {
  const el = document.elementFromPoint(x, y)
  if (!el) return 'arrow'
  if (closestMatch(el, IBEAM_SEL)) return 'ibeam'
  if (closestMatch(el, HAND_SEL)) return 'hand'
  return 'arrow'
}

export default function Cursor() {
  const wrapRef = useRef(null)
  const svgArrowRef = useRef(null)
  const svgHandRef = useRef(null)
  const svgIbeamRef = useRef(null)
  const arrowFillRef = useRef(null)
  const arrowStrokeRef = useRef(null)
  const handFillRef = useRef(null)
  const handStrokeRef = useRef(null)
  const ibeamGroupRef = useRef(null)

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const wrap = wrapRef.current
    if (!wrap) return

    // Ensure system cursor is hidden via inline root styles (avoid duplicate style tags)
    document.documentElement.style.cursor = 'none'
    document.body.style.cursor = 'none'

    let tx = -500, ty = -500
    let cx = -500, cy = -500
    let visible = false
    let lastState = ''
    let lastIsDark = !document.documentElement.classList.contains('light-mode')
    let isHovering = false    // tracks hover state for scale effect
    let currentScale = 1      // lerped scale
    let targetScale = 1
    let rafId = 0

    // ── IMPROVED: Native tracking speed
    // 1.0 for the dot exactly matches hardware mouse speed, slower for scale easing
    const LERP_FAST = 1.5    // Completely native tracking (0 delay)
    const LERP_SCALE = 0.3   // Accelerated smooth scale

    const applyColors = (isDark) => {
      const fill = isDark ? 'rgba(255,255,255,0.97)' : 'rgba(10,10,16,0.92)'
      const stroke = isDark ? 'rgba(0,0,0,0.30)' : 'rgba(255,255,255,0.55)'
      const ibeam = isDark ? 'rgba(255,255,255,0.90)' : 'rgba(10,10,16,0.82)'

      arrowFillRef.current?.setAttribute('fill', fill)
      arrowStrokeRef.current?.setAttribute('stroke', stroke)
      handFillRef.current?.setAttribute('fill', fill)
      handStrokeRef.current?.setAttribute('stroke', stroke)
      ibeamGroupRef.current?.setAttribute('fill', ibeam)
    }

    const applyState = (state) => {
      if (state === lastState) return
      lastState = state

      if (svgArrowRef.current) svgArrowRef.current.style.display = state === 'arrow' ? 'block' : 'none'
      if (svgHandRef.current) svgHandRef.current.style.display = state === 'hand' ? 'block' : 'none'
      if (svgIbeamRef.current) svgIbeamRef.current.style.display = state === 'ibeam' ? 'block' : 'none'

      const origins = { arrow: '3px 2px', hand: '7px 1px', ibeam: '5px 11px' }
      wrap.style.transformOrigin = origins[state]

      // Scale target: subtle enlarge on hand (interactive elements), shrink on ibeam
      if (state === 'hand') targetScale = 1.18
      else if (state === 'ibeam') targetScale = 0.88
      else targetScale = 1
    }

    // ── Pointer tracking
    const onPointerMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      if (!visible) {
        cx = tx; cy = ty
        visible = true
        wrap.style.opacity = '1'
      }
    }

    const onLeave = () => { wrap.style.opacity = '0'; visible = false }
    const onEnter = () => { if (visible) wrap.style.opacity = '1' }

    // Track hover on interactive elements for scale pulse
    const onPointerOver = (e) => {
      if (closestMatch(e.target, HAND_SEL)) {
        isHovering = true
        targetScale = 1.22  // extra bump on actual hover
      }
    }
    const onPointerOut = (e) => {
      if (closestMatch(e.target, HAND_SEL)) {
        isHovering = false
        // State will re-sync on next tick via getState()
      }
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    document.addEventListener('pointerover', onPointerOver, { passive: true })
    document.addEventListener('pointerout', onPointerOut, { passive: true })

    // ── RAF loop
    const tick = () => {
      // Position lerp — fast
      cx += (tx - cx) * LERP_FAST
      cy += (ty - cy) * LERP_FAST

      // Scale lerp — smooth
      currentScale += (targetScale - currentScale) * LERP_SCALE

      const state = getState(tx, ty)
      applyState(state)

      // If no longer hovering a hand target, reset scale target to state default
      if (!isHovering && state !== 'hand') {
        if (state === 'ibeam') targetScale = 0.88
        else targetScale = 1
      }

      wrap.style.transform = `translate3d(${cx}px, ${cy}px, 0) scale(${currentScale.toFixed(4)})`

      const isDark = !document.documentElement.classList.contains('light-mode')
      if (isDark !== lastIsDark) {
        lastIsDark = isDark
        applyColors(isDark)
      }

      rafId = requestAnimationFrame(tick)
    }

    applyColors(lastIsDark)
    applyState('arrow')
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerout', onPointerOut)
      document.documentElement.style.cursor = ''
      document.body.style.cursor = ''
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 999999,
        opacity: 0,
        transformOrigin: '3px 2px',
        willChange: 'transform',
      }}
    >
      {/* Shared filter — always rendered so url(#rb-sh) resolves even when cursors swap */}
      <svg
        width="0" height="0"
        style={{ position: 'absolute', overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          <filter id="rb-sh" x="-60%" y="-50%" width="220%" height="220%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.1" floodColor="rgba(0,0,0,0.22)" />
          </filter>
        </defs>
      </svg>

      {/* ── 1. Arrow */}
      <svg
        ref={svgArrowRef}
        width="20" height="24" viewBox="0 0 20 24"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', overflow: 'visible', position: 'absolute', top: 0, left: 0 }}
      >
        <path
          ref={arrowFillRef}
          d="M3 2 L3 20 L7 15.8 L11.2 22.2 L13.5 21 L9.3 14.6 L16 14.6 Z"
          fill="rgba(255,255,255,0.97)"
          filter="url(#rb-sh)"
        />
        <path
          ref={arrowStrokeRef}
          d="M3 2 L3 20 L7 15.8 L11.2 22.2 L13.5 21 L9.3 14.6 L16 14.6 Z"
          fill="none"
          stroke="rgba(0,0,0,0.30)"
          strokeWidth="0.75"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      {/* ── 2. Hand */}
      <svg
        ref={svgHandRef}
        width="18" height="22" viewBox="0 0 18 22"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'none', overflow: 'visible', position: 'absolute', top: 0, left: 0 }}
      >
        <path
          ref={handFillRef}
          d="M7 1.5 C7 1 7.4 0.5 8 0.5 C8.6 0.5 9 1 9 1.5 L9 9.5
             C9.5 9 10 8.7 10.7 8.7 C11.4 8.7 11.8 9.2 12 9.7
             C12.4 9.2 13 8.9 13.6 8.9 C14.3 8.9 14.8 9.4 15 10
             C15.4 9.6 15.9 9.4 16.4 9.5 C17.1 9.6 17.5 10.2 17.5 10.9
             L17.5 15 C17.5 18.8 15 21.2 11.2 21.2
             L8 21.2 C5.2 21.2 3 19 3 16.2
             L3 7.2 C3 6.5 3.5 6 4.2 6 C4.9 6 5.4 6.5 5.4 7.2
             L5.4 11.5 C5.8 11 6.3 10.7 7 10.7 L7 1.5 Z"
          fill="rgba(255,255,255,0.97)"
          filter="url(#rb-sh)"
        />
        <path
          ref={handStrokeRef}
          d="M7 1.5 C7 1 7.4 0.5 8 0.5 C8.6 0.5 9 1 9 1.5 L9 9.5
             C9.5 9 10 8.7 10.7 8.7 C11.4 8.7 11.8 9.2 12 9.7
             C12.4 9.2 13 8.9 13.6 8.9 C14.3 8.9 14.8 9.4 15 10
             C15.4 9.6 15.9 9.4 16.4 9.5 C17.1 9.6 17.5 10.2 17.5 10.9
             L17.5 15 C17.5 18.8 15 21.2 11.2 21.2
             L8 21.2 C5.2 21.2 3 19 3 16.2
             L3 7.2 C3 6.5 3.5 6 4.2 6 C4.9 6 5.4 6.5 5.4 7.2
             L5.4 11.5 C5.8 11 6.3 10.7 7 10.7 L7 1.5 Z"
          fill="none"
          stroke="rgba(0,0,0,0.30)"
          strokeWidth="0.75"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      {/* ── 3. I-beam */}
      <svg
        ref={svgIbeamRef}
        width="11" height="22" viewBox="0 0 11 22"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'none', overflow: 'visible', position: 'absolute', top: 0, left: 0 }}
      >
        <g ref={ibeamGroupRef} fill="rgba(255,255,255,0.90)" filter="url(#rb-sh)">
          <rect x="1" y="1" width="9" height="1.8" rx="0.9" />
          <rect x="4.6" y="2.2" width="1.8" height="17.6" rx="0.9" />
          <rect x="1" y="19.2" width="9" height="1.8" rx="0.9" />
        </g>
      </svg>
    </div>
  )
}
