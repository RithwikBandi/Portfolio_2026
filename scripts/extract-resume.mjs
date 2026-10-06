// Reads public/assets/resume/Rithwik_Resume.pdf and writes src/data/resume.json: the same words,
// in the same order, as structured data for the native /resume page. Nothing is written by hand:
// replace the PDF, rebuild, and the page follows. Layout is detected from the PDF itself
// (font size = headings, bold = titles, bullet glyphs = bullets, right-aligned = dates), so it
// works for any single-column résumé with the usual "heading / entry / bullets" shape.
// Run: npm run resume   (also runs automatically before dev and build)
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const PDF = 'public/assets/resume/Rithwik_Resume.pdf'
const OUT = 'src/data/resume.json'

const bytes = await readFile(PDF)
const doc = await getDocument({ data: new Uint8Array(bytes), useSystemFonts: true, fontExtraProperties: true, verbosity: 0 }).promise

const BOLD = /bold|black|heavy|semibold|demi|cmbx|cmssbx|\bbd\b|-bd/i
const ITALIC = /italic|oblique|cmti|cmsl|-it\b/i
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)] ?? 0 }

// ─── 1. Collect text items from every page with font + link info ─────────────────────────────
const pages = []
for (let n = 1; n <= doc.numPages; n++) {
  const page = await doc.getPage(n)
  const [, , x1, y1] = page.view
  const tc = await page.getTextContent()
  await page.getOperatorList() // loads font objects so their names (bold/italic) are readable
  const fonts = {}
  for (const k of Object.keys(tc.styles)) {
    let name = ''
    try { name = page.commonObjs.get(k)?.name || '' } catch { /* font object not available */ }
    fonts[k] = { bold: BOLD.test(name), italic: ITALIC.test(name), symbol: tc.styles[k].fontFamily === 'monospace' }
  }
  const items = tc.items
    .map((i) => ({ str: i.str, x: i.transform[4], y: i.transform[5], w: i.width, size: Math.abs(i.transform[3]) || i.height, ...fonts[i.fontName], fontKey: `${n}:${i.fontName}`, page: n }))
    .filter((i) => i.str.trim() !== '')
  const links = (await page.getAnnotations())
    .filter((a) => a.subtype === 'Link' && (a.url || a.unsafeUrl))
    .map((a) => ({ x0: a.rect[0], y0: a.rect[1], x1: a.rect[2], y1: a.rect[3], href: a.url || a.unsafeUrl }))
  pages.push({ n, items, links, right: x1, top: y1 })
}

// Icon fonts (phone, mail, GitHub glyphs, bullets) only ever draw single characters.
const charsByFont = new Map()
for (const i of pages.flatMap((p) => p.items)) {
  const f = charsByFont.get(i.fontKey) || { n: 0, single: 0 }
  f.n++; if (i.str.trim().length === 1) f.single++
  charsByFont.set(i.fontKey, f)
}
for (const i of pages.flatMap((p) => p.items)) {
  const f = charsByFont.get(i.fontKey)
  if (f.n === f.single && !/^[A-Za-z0-9]$/.test(i.str.trim())) i.symbol = true
}
const textItems = pages.flatMap((p) => p.items).filter((i) => !i.symbol)
const body = median(textItems.map((i) => i.size)) // the body font size
const isBullet = (i) => i.symbol && /^[•·▪●◦‣∙-]$/.test(i.str.trim())
const isPipe = (i) => i.symbol && /^[|¦│]$/.test(i.str.trim())

// ─── 2. Group into lines, then into runs (gaps wider than a word space start a new run) ──────
const lines = []
for (const p of pages) {
  const sorted = [...p.items].sort((a, b) => b.y - a.y || a.x - b.x)
  let cur = null
  for (const it of sorted) {
    if (cur && Math.abs(cur.y - it.y) <= Math.max(2, it.size * 0.25) && cur.page === p.n) cur.items.push(it)
    else { cur = { y: it.y, page: p.n, items: [it] }; lines.push(cur) }
  }
}
for (const l of lines) {
  l.items.sort((a, b) => a.x - b.x)
  l.size = Math.max(...l.items.map((i) => i.size))
  l.runs = []
  let run = null
  for (const it of l.items) {
    if (!run || isBullet(it) || it.x - run.x1 > Math.max(10, it.size * 1.4)) { run = { items: [], x0: it.x, x1: it.x + it.w }; l.runs.push(run) }
    run.items.push(it)
    run.x1 = Math.max(run.x1, it.x + it.w)
  }
}

// Rich text: consecutive pieces with the same weight, joined with single spaces.
const rich = (items) => {
  const out = []
  let prevEnd = null
  for (const it of items) {
    if (it.symbol && !isBullet(it) && !isPipe(it)) continue // icon glyphs
    const text = isPipe(it) ? '|' : it.str
    const spaced = prevEnd !== null && it.x - prevEnd > it.size * 0.12
    const last = out[out.length - 1]
    if (last && last.b === it.bold && last.i === it.italic) last.t += (spaced ? ' ' : '') + text
    else out.push({ t: (spaced && last ? ' ' : '') + text, b: it.bold, i: it.italic })
    prevEnd = it.x + it.w
  }
  return out.map((r) => ({ ...r, t: r.t.replace(/\s+/g, ' ') })).filter((r) => r.t.trim() !== '')
}
const plain = (r) => r.map((x) => x.t).join('')

const linkFor = (line, run) => {
  for (const k of pages[line.page - 1].links) {
    const overlapX = Math.min(run.x1, k.x1) - Math.max(run.x0, k.x0)
    if (overlapX > 2 && line.y >= k.y0 - 3 && line.y <= k.y1 + 3) return k.href
  }
  return null
}

// ─── 3. Header: everything above the first section heading ───────────────────────────────────
const isHeadingLine = (l) =>
  l.runs.length === 1 && l.size > body * 1.12 && l.items.every((i) => !i.symbol) && l.items.some((i) => i.bold) && plain(rich(l.items)).length < 40
const firstHeading = lines.findIndex((l, i) => i > 0 && isHeadingLine(l))
const headerLines = lines.slice(0, firstHeading < 0 ? 1 : firstHeading)
const nameLine = headerLines.reduce((a, b) => (b.size > a.size ? b : a), headerLines[0])
const name = plain(rich(nameLine.items)).trim()

const contacts = []
for (const l of headerLines) {
  if (l === nameLine) continue
  // Contact pieces are separated by icon glyphs or wide gaps.
  let group = []
  const flush = () => {
    if (!group.length) return
    const label = plain(rich(group)).trim()
    if (label) {
      const run = { x0: group[0].x, x1: group.at(-1).x + group.at(-1).w }
      let href = linkFor(l, run)
      if (!href && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(label)) href = `mailto:${label}`
      else if (!href && /^\+?[\d\s()-]{7,}$/.test(label)) href = `tel:${label.replace(/[^\d+]/g, '')}`
      const kind = /^mailto:/.test(href || '') ? 'email' : /^tel:/.test(href || '') ? 'phone' : /github/i.test(href || label) ? 'github' : /linkedin/i.test(href || label) ? 'linkedin' : 'link'
      contacts.push({ label, href, kind })
    }
    group = []
  }
  for (const it of l.items) {
    if (it.symbol) flush()
    else if (group.length && it.x - (group.at(-1).x + group.at(-1).w) > it.size * 1.4) { flush(); group.push(it) }
    else group.push(it)
  }
  flush()
}

// ─── 4. Sections ──────────────────────────────────────────────────────────────────────────────
const sections = []
let section = null, entry = null, bullet = null, lastLine = null
const lineGap = (l) => (lastLine && lastLine.page === l.page ? lastLine.y - l.y : 999)
const maxRight = Math.max(...lines.flatMap((l) => l.runs.map((r) => r.x1)))
// A wrapped line belongs to the bullet in the same column that sits directly above it.
const cont = (run, l) => (entry ? [...entry.bullets].reverse().find((b) => Math.abs(run.x0 - b.textX) < 3 && b.lastY - l.y < body * 2.2 && b.page === l.page) : null)
const startEntry = (title) => { entry = { title, meta: null, metaHref: null, subtitle: null, meta2: null, bullets: [], titleLine: null }; section.entries.push(entry); bullet = null }

for (let li = headerLines.length; li < lines.length; li++) {
  const l = lines[li]
  if (isHeadingLine(l)) {
    section = { title: plain(rich(l.items)).trim(), paragraphs: [], entries: [] }
    sections.push(section); entry = null; bullet = null; lastLine = l
    continue
  }
  if (!section) { lastLine = l; continue }
  if (l.runs.length === 1 && /^\d{1,2}$/.test(plain(rich(l.items)).trim())) { lastLine = l; continue } // page number

  for (let ri = 0; ri < l.runs.length; ri++) {
    const run = l.runs[ri]
    const r = rich(run.items)
    if (!r.length) continue
    const startsBullet = isBullet(run.items[0])
    const isMeta = ri > 0 && ri === l.runs.length - 1 && l.runs.length === 2 && run.x1 > maxRight - 8 && !l.runs[0].items.some(isBullet)

    if (startsBullet) {
      if (!entry) startEntry(null)
      bullet = { rich: rich(run.items.filter((i) => !isBullet(i))), textX: run.items.find((i) => !isBullet(i))?.x ?? run.x0 + 10, lastY: l.y, page: l.page }
      entry.bullets.push(bullet)
    } else if (isMeta && entry) {
      const text = plain(r).trim()
      const href = linkFor(l, run)
      if (entry.titleLine === l) { entry.meta = text; entry.metaHref = href }
      else if (!entry.meta2) { entry.meta2 = text; if (href && !entry.metaHref) entry.metaHref = href }
    } else if (r.every((x) => x.b)) {
      // A fully bold line is a new entry title (institution, role, project, certificate).
      startEntry(plain(r).trim())
      entry.titleLine = l
    } else if (cont(run, l)) {
      const b = cont(run, l)
      b.rich = [...b.rich, ...r.map((x, k) => (k === 0 ? { ...x, t: ' ' + x.t } : x))]
      b.lastY = l.y
    } else if (entry && entry.title && !entry.bullets.length && !entry.subtitle && lineGap(l) < body * 2) {
      entry.subtitle = plain(r).trim()
    } else {
      // Plain paragraph text under a heading (summary).
      const last = section.paragraphs.at(-1)
      if (last && lineGap(l) < body * 1.9) last.push(...r.map((x, k) => (k === 0 ? { ...x, t: ' ' + x.t } : x)))
      else section.paragraphs.push([...r])
      entry = null; bullet = null
    }
  }
  lastLine = l
}

// ─── 5. Clean up: join hyphenated line breaks, merge same-weight runs, drop helper fields ────
const everything = sections
  .flatMap((s) => [...s.paragraphs.map(plain), ...s.entries.flatMap((e) => e.bullets.map((b) => plain(b.rich)))])
  .join(' ').toLowerCase().replace(/\s+/g, ' ')
// "Tensor- Flow" is a line-break hyphen when the joined word is used elsewhere, or when the first
// part is a 1-2 letter fragment ("Op- erating"). Otherwise it is a real hyphen and stays.
const joinBreak = (a, b) => {
  const known = everything.includes((a + b).toLowerCase())
  const fragment = a.length <= 2 && /^[a-z]/.test(b) && !/^[eExX]$/.test(a)
  return known || fragment ? a + b : `${a}-${b}`
}
const clean = (pieces) => {
  const merged = []
  const spaced = []
  for (const p of pieces) {
    const prev = spaced.at(-1)
    // The space between two pieces belongs to the lighter one, never inside a bold run.
    if (prev && /^\s/.test(p.t) && !(prev.b && !p.b)) { prev.t += ' '; spaced.push({ ...p, t: p.t.replace(/^\s+/, '') }) }
    else spaced.push({ ...p })
  }
  for (const piece of spaced) {
    const last = merged.at(-1)
    if (last && last.b === piece.b && last.i === piece.i) last.t += piece.t
    else merged.push({ ...piece })
  }
  return merged
    .map((x) => ({ ...x, t: x.t.replace(/([A-Za-z]+)- ([A-Za-z]+)/g, (m, a, b) => joinBreak(a, b)) }))
    .map(({ t, b, i }) => ({ t, ...(b ? { b: true } : {}), ...(i ? { i: true } : {}) }))
    .filter((x) => x.t !== '')
}

const result = {
  source: PDF.split('/').pop(),
  hash: createHash('sha1').update(bytes).digest('hex').slice(0, 10),
  pageCount: doc.numPages,
  name,
  contacts,
  sections: sections.map((s) => ({
    title: s.title,
    paragraphs: s.paragraphs.map(clean).filter((p) => p.length),
    entries: s.entries.map((e) => ({
      title: e.title, meta: e.meta, metaHref: e.metaHref, subtitle: e.subtitle, meta2: e.meta2,
      bullets: e.bullets.map((b) => clean(b.rich)).filter((b) => b.length),
    })),
  })),
}
result.ok = Boolean(name && result.sections.length >= 2)

await writeFile(OUT, JSON.stringify(result, null, 2) + '\n')
console.log(`resume: ${result.ok ? 'ok' : 'WEAK'}: ${name}, ${result.sections.length} sections, ${contacts.length} contacts (${PDF}, ${result.hash})`)
