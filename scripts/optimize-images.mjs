// Generates responsive AVIF + WebP from source-assets/ into public/img/ and
// writes src/data/images.json (intrinsic ratios for layout-shift-free markup).
// Run: npm run images   (originals in source-assets/ are never shipped)
import sharp from 'sharp'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { join } from 'node:path'

const SRC = 'source-assets'
const OUT = 'public/img'

// name -> { file, widths, crop? ({left, top, width, height} in source pixels) }
const JOBS = {
  // Upper-body cut-out for the hero profile card (background removed once, offline), trimmed to the subject
  'portrait-bust': { file: 'profile/cutout3.png', widths: [420, 700, 1000], trim: true },
  'vietnam-boat': { file: 'vietnam/photo-04.jpg', widths: [640, 1024, 1600] },
  'vietnam-lanterns': { file: 'vietnam/photo-05.jpg', widths: [640, 1024, 1600] },
  'vietnam-garden': { file: 'vietnam/photo-03.jpg', widths: [640, 1024, 1600] },
  'vietnam-welcome': { file: 'vietnam/photo-02.jpg', widths: [640, 1024, 1600] },
  // Project previews: full frames, never cropped
  // Trimmed below the form only: the rest of that page is empty background
  'shot-sru': { file: 'shots/sru.png', widths: [640, 1024, 1600], crop: { left: 0, top: 0, width: 2048, height: 860 } },
  'shot-jobspace': { file: 'shots/jobspace.png', widths: [640, 1024, 1600] },
  'shot-cardioml': { file: 'projects-old/project-02.png', widths: [640, 1024, 1600] },
  'shot-folio': { file: 'shots/folio.png', widths: [640, 1024, 1600] },
  'shot-marvel': { file: 'projects-old/project-04.png', widths: [640, 1024, 1600] },
  // Certificate badges (displayed small)
  'badge-aws': { file: 'badges/aws.png', widths: [160] },
  'badge-azure': { file: 'badges/azure.png', widths: [160] },
  'badge-aicte': { file: 'badges/aicte.png', widths: [160] },
}

await rm(OUT, { recursive: true, force: true })
await mkdir(OUT, { recursive: true })
const manifest = {}
let bytes = 0

for (const [name, job] of Object.entries(JOBS)) {
  let base = sharp(join(SRC, job.file), { limitInputPixels: false }).rotate()
  if (job.crop) base = base.extract(job.crop)
  if (job.trim) base = sharp(await base.png().toBuffer()).trim({ threshold: 8 })
  if (job.gray) base = base.grayscale().normalise().linear(1.18, -14)
  const buf = await base.toBuffer()
  const meta = await sharp(buf).metadata()
  const ratio = meta.height / meta.width
  manifest[name] = { ratio: +ratio.toFixed(4), widths: [] }

  for (const w of job.widths) {
    if (w > meta.width) continue
    const h = Math.round(w * ratio)
    const pipe = sharp(buf).resize(w, h, { fit: 'cover' })
    const avif = await pipe.clone().avif({ quality: 52, effort: 6 }).toBuffer()
    const webp = await pipe.clone().webp({ quality: 78, effort: 5 }).toBuffer()
    await writeFile(join(OUT, `${name}-${w}.avif`), avif)
    await writeFile(join(OUT, `${name}-${w}.webp`), webp)
    manifest[name].widths.push(w)
    bytes += avif.length + webp.length
    console.log(`${name}-${w}  avif ${(avif.length / 1024).toFixed(0)}KB  webp ${(webp.length / 1024).toFixed(0)}KB`)
  }
}

// ─── Procedural textures (deterministic): film grain + a scratched-paint mask ──
function rng(seed) {
  let s = seed
  return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296
}

async function makeGrain(size = 256) {
  const rand = rng(11)
  const px = Buffer.alloc(size * size * 4)
  for (let i = 0; i < size * size; i++) {
    const v = rand() < 0.5 ? 255 : 0
    px[i * 4] = v; px[i * 4 + 1] = v; px[i * 4 + 2] = v
    px[i * 4 + 3] = Math.floor(rand() * 46)
  }
  await sharp(px, { raw: { width: size, height: size, channels: 4 } }).png({ palette: true, quality: 70, effort: 10 }).toFile(join(OUT, 'grain.png'))
}

// Alpha mask for text: opaque everywhere except speckles, scratches and worn patches.
async function makeScratch(size = 512) {
  const rand = rng(29)
  const a = new Uint8Array(size * size).fill(255)
  const dot = (x, y, v) => { if (x >= 0 && y >= 0 && x < size && y < size) a[y * size + x] = Math.min(a[y * size + x], v) }
  for (let i = 0; i < 1000; i++) { // speckle
    const x = Math.floor(rand() * size), y = Math.floor(rand() * size), r = rand() < 0.2 ? 2 : 1
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) dot(x + dx, y + dy, Math.floor(rand() * 90))
  }
  for (let i = 0; i < 30; i++) { // scratches
    let x = rand() * size, y = rand() * size
    const ang = (rand() - 0.5) * 1.1 + 1.1, len = 40 + rand() * 190
    for (let t = 0; t < len; t++) { dot(Math.round(x), Math.round(y), 0); x += Math.cos(ang); y += Math.sin(ang) }
  }
  for (let i = 0; i < 7; i++) { // worn patches, soft edges
    const cx = rand() * size, cy = rand() * size, r = 18 + rand() * 46
    for (let y = Math.floor(cy - r); y < cy + r; y++) for (let x = Math.floor(cx - r); x < cx + r; x++) {
      const d = Math.hypot(x - cx, y - cy) / r
      if (d < 1 && rand() < (1 - d) * 0.75) dot(x, y, Math.floor(rand() * 140))
    }
  }
  const px = Buffer.alloc(size * size * 4)
  for (let i = 0; i < size * size; i++) px[i * 4 + 3] = a[i]
  await sharp(px, { raw: { width: size, height: size, channels: 4 } }).png({ palette: true, quality: 60, effort: 10 }).toFile(join(OUT, 'scratch.png'))
}

await makeGrain()
await makeScratch()
console.log('textures: grain.png, scratch.png')

await mkdir('src/data', { recursive: true })
await writeFile('src/data/images.json', JSON.stringify(manifest, null, 2) + '\n')
console.log(`\nTotal generated: ${(bytes / 1048576).toFixed(2)} MB`)
