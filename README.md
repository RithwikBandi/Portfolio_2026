# Rithwik Bandi — Portfolio

Personal portfolio of a web developer and growth expert. Live at [rithwikbandi.tech](https://rithwikbandi.tech).

React + Vite, hand-written CSS, statically prerendered. No UI framework, no animation library, no analytics.

## Commands

```bash
npm install
npm run dev        # dev server with hot reload
npm run build      # client build -> server build -> prerender (output: dist/client)
npm run preview    # serve the real prerendered output on :4173
npm run images     # regenerate responsive AVIF/WebP from source-assets/
npm run cursors    # regenerate the Batman cursor set and src/styles/cursors.css
```

## How it is built

| Concern | Approach |
|---|---|
| Rendering | `vite build` (client) + `vite build --ssr` (server entry), then `scripts/prerender.mjs` renders every route to real HTML, injects per-page SEO tags, inlines the CSS, preloads the two above-the-fold fonts, and writes `404.html` and `sitemap.xml`. The client hydrates. |
| Routing | `react-router-dom`. Route changes use the View Transitions API where available (the project visual morphs from the home page into its case study), with a plain fallback. |
| Identity | Poster-style hero inspired by the mood of *The Batman* (2022): blood red, soot black, grain, scratched lettering. The portrait is a transparent cut-out (background removed once, offline) standing in front of the name. Display type is heavy Archivo; buttons are chamfered; section breaks are tape stripes. The bat emblem is an original path, not an official logo. |
| 3D | A lazily loaded WebGL scene (three.js): an extruded bat and drifting embers behind the hero. It loads after first paint in its own chunk, skips low-memory and data-saver devices, pauses off-screen and when the tab is hidden, caps pixel ratio, and lowers its own quality if frames run long. |
| Motion | Pointer parallax moves the hero layers at different depths (transform only, GPU layers). Project previews tilt in 3D toward the pointer. Route changes use a red diagonal wipe via the View Transitions API. |
| Cursor | The Batman cursor set (public domain, by THTH), converted by `npm run cursors` into 1x/2x PNG cursors with correct hotspots and a thin light outline so the black bats read on dark and red. They are *native CSS cursors*: drawn by the operating system, so there is no JavaScript and zero input lag. The pack's states map to the site (bat arrow, hand on links, I-beam in fields, pen in the message box, forbidden bat on disabled controls, crosshair on code), and the contact form cycles the animated busy bat while sending. |
| Profile card | A pinned case-file card: striped red frame, paper sheet and tape behind, an upper-body cut-out that breaks out of the top of the frame, all on separate depth planes that tilt in 3D toward the pointer (transform only). |
| Styling | One small hand-written stylesheet split into `tokens`, `base`, `components`, `sections`. Fluid type and spacing from CSS variables. |
| Motion | CSS only. Hero entrance uses keyframes; scroll reveals and the progress line use scroll-driven animations (`animation-timeline`) on the compositor. One shared `IntersectionObserver` is the fallback for Firefox. Everything resolves instantly under `prefers-reduced-motion`. Only `transform` and `opacity` animate. No `backdrop-filter`, no blur, no infinite loops. |
| Images | `source-assets/` holds originals (never shipped). `npm run images` writes AVIF + WebP at several widths to `public/img/` plus `src/data/images.json`; `Picture.jsx` emits `srcset` and intrinsic `width`/`height`, so there is no layout shift. |
| Fonts | Self-hosted variable woff2 (Archivo, Geist, Geist Mono), latin subset only, `font-display: swap`. |
| Previews | Project screenshots are full frames (SRU Timetable is listed third and flagged, because its live data source can be offline), never cropped, shown inside a browser-chrome frame with the real URL. SRU Timetable uses an interactive recreation with sample data because its live data source can be offline. |
| SEO | Prerendered HTML, canonical URLs, Open Graph + Twitter cards, JSON-LD (`Person`, `WebSite`, `BreadcrumbList`), `sitemap.xml`, `robots.txt`, `llms.txt`. |

## Structure

```
src/
  data/          site.js, projects.js (all content lives here), images.json (generated)
  components/    Nav, Footer, Plate, SampleTimetable, Flow, Picture, TLink, ...
  sections/      Hero, Work, About, Capabilities, Beyond, Contact
  pages/         Home, CaseStudy, NotFound
  styles/        tokens.css, base.css, components.css, sections.css
  meta.js        per-route title, description, JSON-LD (used by prerender and the client)
scripts/         optimize-images.mjs, prerender.mjs
```

To add a project, add an entry to `src/data/projects.js`; its case-study page, sitemap entry and metadata are generated from it.

## Content rules

- Nothing is stated that the project's own README or live product does not support. No usage numbers, traffic or impact figures.
- Private and company work is not named. It appears only as one generic line in "More work".
- SRU Timetable's repository is private, so only the live demo is linked.

## Deploy (Vercel)

`vercel.json` sets `outputDirectory` to `dist/client`, `cleanUrls`, long-lived immutable caching for hashed assets, and basic security headers. Build command: `npm run build`.

## Measured results (old site vs this one)

Same harness, 4x CPU slowdown, full-page scroll.

| | Old | New |
|---|---|---|
| Frames over 50 ms while scrolling | 7 | 1 |
| p99 frame time | 66 ms | 17.6 ms |
| `backdrop-filter` elements | 41 | 0 |
| DOM nodes | 1,142 | 784 |
| Decoded image memory | ~302 MB | ~18 MB |
| JS (gzip) | 110 KB | 69 KB |
| LCP, phone (4x CPU, Fast 4G) | n/a (1.5 s on desktop) | 408 ms, CLS 0 |
| Shipped `public/` assets | 76 MB | ~6 MB (mostly certificate PDFs) |
| Lighthouse accessibility / best practices / SEO | n/a | 100 / 100 / 100 |
