import { existsSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `vite preview` only: serve /work/<slug> from its prerendered work/<slug>/index.html,
// the same mapping Vercel's cleanUrls does in production, so the real output gets tested.
const prerenderedRoutes = {
  name: 'prerendered-routes',
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      const path = (req.url || '').split('?')[0].replace(/\/$/, '')
      if (path && !path.includes('.') && existsSync(`dist/client${path}/index.html`)) req.url = `${path}/index.html`
      next()
    })
  },
}

// Client build -> dist/client, server build (for prerender) -> dist/server.
// One CSS file keeps the critical path to a single stylesheet request.
export default defineConfig({
  plugins: [react(), prerenderedRoutes],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
  },
})
