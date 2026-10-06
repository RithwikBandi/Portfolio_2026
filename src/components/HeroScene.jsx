import { useEffect, useRef } from 'react'
import {
  WebGLRenderer, Scene, PerspectiveCamera, Shape, ExtrudeGeometry, Mesh, MeshStandardMaterial,
  AmbientLight, DirectionalLight, PointLight, BufferGeometry, Float32BufferAttribute, Points,
  PointsMaterial, AdditiveBlending, MathUtils,
} from 'three'

// The 3D layer behind the hero: a slowly turning extruded bat and drifting embers, lit in red.
// Loaded lazily after first paint. It pauses when off-screen or the tab is hidden, caps the pixel
// ratio, and degrades itself (fewer pixels, then fewer embers) if frames start to run long.

// Half of the emblem (right wing), mirrored to build the full silhouette. Same path as BatMark.
const HALF = [[100, 36], [103, 20], [109, 10], [111, 30], [148, 24], [198, 46], [176, 48], [166, 62], [152, 56], [142, 72], [128, 64], [118, 82], [108, 76], [100, 98]]

function batShape() {
  const p = ([x, y]) => [(x - 100) / 11, -(y - 58) / 11]
  const right = HALF.map(p)
  const left = HALF.map(([x, y]) => p([200 - x, y])).reverse()
  const s = new Shape()
  const pts = [...right, ...left.slice(0, -1)]
  s.moveTo(pts[0][0], pts[0][1])
  pts.slice(1).forEach(([x, y]) => s.lineTo(x, y))
  s.closePath()
  return s
}

export default function HeroScene({ coarse = false }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer
    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: !coarse, powerPreference: 'low-power' })
    } catch {
      return // no WebGL: the CSS hero stands on its own
    }
    let dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 1.75)
    renderer.setPixelRatio(dpr)
    renderer.setClearColor(0x000000, 0)

    const scene = new Scene()
    const camera = new PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0, 12)

    // Emblem
    const geo = new ExtrudeGeometry(batShape(), { depth: 0.9, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 2 })
    geo.center()
    const bat = new Mesh(geo, new MeshStandardMaterial({ color: 0x8a1812, metalness: 0.3, roughness: 0.55 }))
    const base = { x: coarse ? 0 : 2.5, y: 0.4 }
    bat.scale.setScalar(coarse ? 0.3 : 0.34)
    bat.position.set(base.x, base.y, 0)
    scene.add(bat)

    scene.add(new AmbientLight(0xff8a76, 0.9))
    const key = new DirectionalLight(0xff6a58, 2.4); key.position.set(4, 5, 6); scene.add(key)
    const rim = new PointLight(0xffa07a, 22, 30); rim.position.set(-6, -3, 3); scene.add(rim)

    // Embers
    let count = coarse ? 70 : 170
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count)
    const seed = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x) }
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seed(i, 1) - 0.5) * 22
      pos[i * 3 + 1] = (seed(i, 2) - 0.5) * 14
      pos[i * 3 + 2] = (seed(i, 3) - 0.5) * 10
      vel[i] = 0.25 + seed(i, 4) * 0.7
    }
    const pg = new BufferGeometry()
    pg.setAttribute('position', new Float32BufferAttribute(pos, 3))
    const embers = new Points(pg, new PointsMaterial({ color: 0xffa27a, size: 0.07, transparent: true, opacity: 0.85, blending: AdditiveBlending, depthWrite: false }))
    scene.add(embers)

    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Pointer drives the emblem's tilt (eased in the loop)
    const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 }
    const onMove = (e) => { target.x = (e.clientX / window.innerWidth - 0.5) * 2; target.y = (e.clientY / window.innerHeight - 0.5) * 2 }
    if (!coarse) window.addEventListener('pointermove', onMove, { passive: true })

    let visible = true, raf = 0, last = performance.now(), slow = 0, stage = 0
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf && !reduce) loop(performance.now()) })
    io.observe(canvas)

    const frame = (t, dt) => {
      cur.x += (target.x - cur.x) * 0.06
      cur.y += (target.y - cur.y) * 0.06
      bat.rotation.y = Math.sin(t * 0.00035) * 0.5 + cur.x * 0.45
      bat.rotation.x = -cur.y * 0.22 + Math.sin(t * 0.0005) * 0.05
      bat.position.y = base.y + Math.sin(t * 0.0006) * 0.12
      const arr = pg.attributes.position.array
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] += vel[i] * dt * 0.0006
        arr[i * 3] += Math.sin(t * 0.0004 + i) * 0.0006 * dt
        if (arr[i * 3 + 1] > 7.5) arr[i * 3 + 1] = -7.5
      }
      pg.attributes.position.needsUpdate = true
      pg.setDrawRange(0, count)
      renderer.render(scene, camera)
    }

    function loop(t) {
      if (!visible || document.hidden) { raf = 0; return }
      // ~30 fps is plenty for slow drifting embers and halves the GPU/CPU cost
      if (t - last < 30) { raf = requestAnimationFrame(loop); return }
      const dt = Math.min(t - last, 64); last = t
      // Self-protection: sustained long frames lower the pixel ratio, then the ember count.
      slow = dt > 50 ? slow + 1 : Math.max(0, slow - 1)
      if (slow > 40) {
        slow = 0
        if (stage === 0) { stage = 1; dpr = 1; renderer.setPixelRatio(1); resize() }
        else if (stage === 1) { stage = 2; count = Math.floor(count / 2) }
      }
      frame(t, dt)
      raf = requestAnimationFrame(loop)
    }
    const onVis = () => { if (!document.hidden && visible && !raf && !reduce) { last = performance.now(); loop(last) } }
    document.addEventListener('visibilitychange', onVis)

    if (reduce) frame(performance.now(), 16) // one still frame
    else raf = requestAnimationFrame(loop)

    canvas.dataset.ready = 'true'

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect(); ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVis)
      geo.dispose(); pg.dispose(); bat.material.dispose(); embers.material.dispose(); renderer.dispose()
    }
  }, [coarse])

  return <canvas ref={canvasRef} className="hero__gl" aria-hidden="true" />
}
