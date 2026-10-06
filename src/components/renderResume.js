// Renders the résumé PDF itself (never a re-typed copy) into the given container: one canvas per
// page, plus a selectable text layer and clickable link overlays. pdf.js is imported here, on
// demand, so it only ships to people who open /resume.
export const RESUME_URL = '/assets/resume/Rithwik_Resume.pdf'

export async function renderResume(host, { signal } = {}) {
  const [pdfjs, { default: workerSrc }] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ])
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

  // no-cache = always revalidate, so a replaced PDF shows up on the next visit.
  const res = await fetch(RESUME_URL, { cache: 'no-cache', signal })
  if (!res.ok) throw new Error(`resume ${res.status}`)
  const doc = await pdfjs.getDocument({ data: await res.arrayBuffer() }).promise

  const width = host.clientWidth
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5)
  const pages = []

  for (let n = 1; n <= doc.numPages; n++) {
    if (signal?.aborted) return pages
    const page = await doc.getPage(n)
    const base = page.getViewport({ scale: 1 })
    const scale = width / base.width
    const viewport = page.getViewport({ scale })

    const sheet = document.createElement('div')
    sheet.className = 'sheet'
    sheet.style.aspectRatio = `${base.width} / ${base.height}`
    sheet.style.setProperty('--scale-factor', String(scale))
    sheet.style.setProperty('--total-scale-factor', String(scale))

    const canvas = document.createElement('canvas')
    canvas.width = Math.floor(viewport.width * dpr)
    canvas.height = Math.floor(viewport.height * dpr)
    canvas.setAttribute('aria-hidden', 'true')
    sheet.append(canvas)
    host.append(sheet)

    await page.render({
      canvasContext: canvas.getContext('2d'),
      viewport,
      transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
    }).promise

    // Selectable / searchable text, positioned over the canvas.
    const textLayer = document.createElement('div')
    textLayer.className = 'textLayer'
    sheet.append(textLayer)
    try {
      await new pdfjs.TextLayer({ textContentSource: page.streamTextContent(), container: textLayer, viewport }).render()
    } catch { /* the canvas alone is still a complete résumé */ }

    // Real links from the PDF (GitHub, LinkedIn, email, live demos).
    for (const a of await page.getAnnotations()) {
      if (a.subtype !== 'Link' || !(a.url || a.unsafeUrl)) continue
      const [m0, m1, m2, m3, m4, m5] = viewport.transform
      const pt = (x, y) => [m0 * x + m2 * y + m4, m1 * x + m3 * y + m5]
      const [x1, y1] = pt(a.rect[0], a.rect[1])
      const [x2, y2] = pt(a.rect[2], a.rect[3])
      const link = document.createElement('a')
      link.className = 'sheet__link'
      link.href = a.url || a.unsafeUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.setAttribute('aria-label', link.href)
      Object.assign(link.style, {
        left: `${(Math.min(x1, x2) / viewport.width) * 100}%`,
        top: `${(Math.min(y1, y2) / viewport.height) * 100}%`,
        width: `${(Math.abs(x2 - x1) / viewport.width) * 100}%`,
        height: `${(Math.abs(y2 - y1) / viewport.height) * 100}%`,
      })
      sheet.append(link)
    }
    pages.push(sheet)
  }
  return pages
}
