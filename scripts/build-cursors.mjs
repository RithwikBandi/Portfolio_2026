// Converts the Batman Windows cursor pack (source-assets/cursors/*.cur|*.ani, public domain)
// into web cursors: PNG at 1x and 2x with correct hotspots, plus a light outline so the black
// bats stay visible on dark and red backgrounds. Writes:
//   public/cursors/<name>.png, <name>@2x.png   (and busy-<n> frames from the .ani)
//   src/styles/cursors.css                     (generated: native CSS cursors, zero JavaScript)
//   src/data/cursors.json                      (busy-animation frames for the form submit state)
// Native CSS cursors are drawn by the OS, so they have no input lag at all.
// Run: npm run cursors
import sharp from 'sharp'
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'

const SRC = 'source-assets/cursors'
const OUT = 'public/cursors'
const OUTLINE = [244, 236, 232] // warm off-white, readable on black and on red

// ─── .cur / .ani decoding ────────────────────────────────────────────────────
function decodeDIB(d) {
  const hdr = d.readUInt32LE(0)
  const w = d.readInt32LE(4)
  const h = d.readInt32LE(8) / 2 // XOR bitmap + AND mask stacked
  const bpp = d.readUInt16LE(14)
  const used = d.readUInt32LE(32)
  const pal = bpp <= 8 ? used || 1 << bpp : 0
  const xorOff = hdr + pal * 4
  const xorStride = ((w * bpp + 31) >> 5) << 2
  const andOff = xorOff + xorStride * h
  const andStride = ((w + 31) >> 5) << 2
  const out = Buffer.alloc(w * h * 4)
  let anyAlpha = false
  for (let y = 0; y < h; y++) {
    const row = h - 1 - y // bottom-up storage
    for (let x = 0; x < w; x++) {
      let r, g, b, a = 255
      if (bpp <= 8) {
        const bitPos = x * bpp
        const byte = d[xorOff + row * xorStride + (bitPos >> 3)]
        const idx = bpp === 8 ? byte : (byte >> (8 - bpp - (bitPos & 7))) & ((1 << bpp) - 1)
        const p = hdr + idx * 4
        b = d[p]; g = d[p + 1]; r = d[p + 2]
      } else {
        const p = xorOff + row * xorStride + x * (bpp / 8)
        b = d[p]; g = d[p + 1]; r = d[p + 2]
        if (bpp === 32) { a = d[p + 3]; if (a) anyAlpha = true }
      }
      const masked = (d[andOff + row * andStride + (x >> 3)] >> (7 - (x & 7))) & 1
      if (bpp !== 32) a = masked ? 0 : 255
      const o = (y * w + x) * 4
      out[o] = r; out[o + 1] = g; out[o + 2] = b; out[o + 3] = a
    }
  }
  // 32-bit bitmaps without real alpha fall back to the AND mask
  if (bpp === 32 && !anyAlpha) {
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const masked = (d[andOff + (h - 1 - y) * andStride + (x >> 3)] >> (7 - (x & 7))) & 1
      out[(y * w + x) * 4 + 3] = masked ? 0 : 255
    }
  }
  return { w, h, rgba: out }
}

async function decodeCur(buf, base = 0) {
  const count = buf.readUInt16LE(base + 4)
  let best = null
  for (let i = 0; i < count; i++) {
    const e = base + 6 + i * 16
    const w = buf[e] || 256
    if (!best || w > best.w) best = { w, hx: buf.readUInt16LE(e + 4), hy: buf.readUInt16LE(e + 6), size: buf.readUInt32LE(e + 8), off: buf.readUInt32LE(e + 12) }
  }
  const data = buf.subarray(base + best.off, base + best.off + best.size)
  if (data.subarray(1, 4).toString() === 'PNG') {
    const { data: rgba, info } = await sharp(data).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    return { w: info.width, h: info.height, rgba, hx: best.hx, hy: best.hy }
  }
  return { ...decodeDIB(data), hx: best.hx, hy: best.hy }
}

function parseAni(buf) {
  const frames = []
  let jif = 6
  const walk = (start, end) => {
    for (let p = start; p + 8 <= end;) {
      const id = buf.toString('ascii', p, p + 4)
      const size = buf.readUInt32LE(p + 4)
      if (id === 'anih') jif = buf.readUInt32LE(p + 8 + 28) || 6
      else if (id === 'icon') frames.push(buf.subarray(p + 8, p + 8 + size))
      else if (id === 'LIST') walk(p + 12, p + 8 + size)
      p += 8 + size + (size & 1)
    }
  }
  walk(12, buf.length)
  return { frames, ms: Math.round((jif * 1000) / 60) }
}

// ─── Rendering: nearest-neighbour upscale + 1/2px outline, kept inside the 32px canvas ─────
async function render(c, scale) {
  const W = c.w * scale, H = c.h * scale
  const big = await sharp(c.rgba, { raw: { width: c.w, height: c.h, channels: 4 } }).resize(W, H, { kernel: 'nearest' }).raw().toBuffer()
  const r = scale // outline thickness in device px
  const out = Buffer.from(big)
  const alpha = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : big[(y * W + x) * 4 + 3])
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const o = (y * W + x) * 4
    if (big[o + 3] > 0) continue
    let near = false
    for (let dy = -r; dy <= r && !near; dy++) for (let dx = -r; dx <= r; dx++) if (alpha(x + dx, y + dy) > 0) { near = true; break }
    if (near) { out[o] = OUTLINE[0]; out[o + 1] = OUTLINE[1]; out[o + 2] = OUTLINE[2]; out[o + 3] = 235 }
  }
  return sharp(out, { raw: { width: W, height: H, channels: 4 } }).png({ compressionLevel: 9 }).toBuffer()
}

async function emit(name, c) {
  await writeFile(join(OUT, `${name}.png`), await render(c, 1))
  await writeFile(join(OUT, `${name}@2x.png`), await render(c, 2))
}

// ─── Run ─────────────────────────────────────────────────────────────────────
await rm(OUT, { recursive: true, force: true })
await mkdir(OUT, { recursive: true })

const SET = {
  default: 'NORMAL.cur', pointer: 'LINK SELECT.cur', text: 'TEXT SELECT.cur', write: 'HANDWRITING.cur',
  help: 'HELP.cur', 'not-allowed': 'UNAVABIBLE.cur', crosshair: 'PRECISION.cur', move: 'MOVE.cur',
}
const spots = {}
for (const [name, file] of Object.entries(SET)) {
  const c = await decodeCur(await readFile(join(SRC, file)))
  await emit(name, c)
  spots[name] = [c.hx, c.hy]
  console.log(name.padEnd(12), `${c.w}x${c.h}`, 'hotspot', c.hx, c.hy)
}

// Animated "busy" cursor: browsers cannot play .ani, so frames are emitted and cycled on demand.
const ani = parseAni(await readFile(join(SRC, 'BUSY.ani')))
const busy = []
for (let i = 0; i < ani.frames.length; i++) {
  const c = await decodeCur(ani.frames[i])
  await emit(`busy-${i}`, c)
  busy.push([c.hx, c.hy])
}
console.log('busy frames', busy.length, 'every', ani.ms, 'ms')

// Generated stylesheet: native cursors with 2x images and sensible fallbacks.
const rule = (name, [x, y], fallback) => {
  const one = `url('/cursors/${name}.png')`
  const set = `url('/cursors/${name}.png') 1x, url('/cursors/${name}@2x.png') 2x`
  return `cursor: ${one} ${x} ${y}, ${fallback};\n  cursor: -webkit-image-set(${set}) ${x} ${y}, ${fallback};\n  cursor: image-set(${set}) ${x} ${y}, ${fallback};`
}
const css = `/* GENERATED by scripts/build-cursors.mjs — do not edit by hand.
   Batman cursor set (public domain, by THTH). Native CSS cursors: drawn by the OS, no JavaScript. */
html, body { ${rule('default', spots.default, 'default')} }
a, button, summary, label, select, [role='button'], .btn { ${rule('pointer', spots.pointer, 'pointer')} }
input:not([type='checkbox']):not([type='radio']):not([type='submit']), [contenteditable] { ${rule('text', spots.text, 'text')} }
textarea { ${rule('write', spots.write, 'text')} }
:disabled, [aria-disabled='true'] { ${rule('not-allowed', spots['not-allowed'], 'not-allowed')} }
[data-cursor='help'], abbr[title] { ${rule('help', spots.help, 'help')} }
[data-cursor='crosshair'], .code pre { ${rule('crosshair', spots.crosshair, 'crosshair')} }
[data-cursor='move'] { ${rule('move', spots.move, 'move')} }
`
await writeFile('src/styles/cursors.css', css)
await writeFile('src/data/cursors.json', JSON.stringify({ busy: { frames: busy, ms: ani.ms } }, null, 2) + '\n')
console.log('wrote src/styles/cursors.css and src/data/cursors.json')
