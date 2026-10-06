// Static prerender: renders every route to real HTML, injects per-page SEO tags,
// preloads the critical fonts, and writes 404.html + sitemap.xml.
// Runs after `vite build` (client) and `vite build --ssr` (server).
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { join, dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const CLIENT = 'dist/client'
const SITE = 'https://rithwikbandi.tech'

const { render, routes } = await import(pathToFileURL(resolve('dist/server/entry-server.js')).href)
let template = await readFile(join(CLIENT, 'index.html'), 'utf8')

// Inline the (small, gzip ~7 KB) stylesheet so first paint never waits on a CSS request.
const cssLink = template.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
if (cssLink) {
  const css = await readFile(join(CLIENT, cssLink[1]), 'utf8')
  template = template.replace(cssLink[0], () => `<style>${css}</style>`)
}

// Preload only the fonts used above the fold (display + body).
const assets = await readdir(join(CLIENT, 'assets'))
const preloads = ['bricolage-grotesque-latin-wght-normal', 'geist-latin-wght-normal']
  .map((p) => assets.find((f) => f.startsWith(p) && f.endsWith('.woff2')))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('')

// The home page's LCP element is the hero portrait: let the browser fetch it immediately.
const heroPreload =
  '<link rel="preload" as="image" type="image/avif" fetchpriority="high" ' +
  'imagesrcset="/img/portrait-hero-480.avif 480w, /img/portrait-hero-800.avif 800w, /img/portrait-hero-1100.avif 1100w" ' +
  'imagesizes="(min-width: 760px) 34vw, 66vw" />'

// The three cursors seen first (arrow, link hand, text) load with the page, so the first hover is instant.
const cursorPreloads = ['default', 'pointer', 'text']
  .map((n) => `<link rel="preload" as="image" href="/cursors/${n}.png" imagesrcset="/cursors/${n}.png 1x, /cursors/${n}@2x.png 2x" />`)
  .join('')

const build = (url) => {
  const { html, head } = render(url)
  const extra = url === '/' ? heroPreload : ''
  // Function replacers: the HTML may contain "$" sequences.
  return template.replace('<!--head-->', () => preloads + cursorPreloads + extra + head).replace('<!--app-->', () => html)
}

for (const route of routes) {
  const out = route === '/' ? join(CLIENT, 'index.html') : join(CLIENT, route, 'index.html')
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, build(route))
  console.log('prerendered', route)
}

await writeFile(join(CLIENT, '404.html'), build('/404'))

const today = new Date().toISOString().slice(0, 10)
const urls = routes
  .map((r) => `  <url><loc>${SITE}${r}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n')
await writeFile(
  join(CLIENT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
)
console.log('wrote 404.html, sitemap.xml')
