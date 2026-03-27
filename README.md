<div align="center">

# Rithwik Bandi — Portfolio

### Full Stack & AI Engineer · Personal Portfolio

*Building scalable systems, intelligent applications, and real-world software.*

[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0055?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![License: MIT](https://img.shields.io/badge/License-MIT-6ee7b7?style=flat-square)](LICENSE)

</div>

---

## 🚀 Live Demo

> **[rithwikbandi.tech](https://rithwikbandi.tech)** ← *Deploy your own using the setup guide below*

---

## ✨ Features

### Interactions & UX
- **WebGL Shader Intro** — Three.js GLSL fragment shader splash screen on first visit, with smart hybrid session/localStorage gating (shows once per 6-hour session, skippable)
- **0-Latency Custom Cursor** — macOS-accurate SVG cursor system with `arrow`, `hand`, and `i-beam` states; utilizes 1:1 hardware-speed LERP tracking for native responsiveness; detects element type per animation frame via `elementFromPoint`; theme-aware; fully disabled on touch devices
- **Scroll Progress Bar** — Thin emerald accent bar tracking read progress at the top of the viewport
- **IntersectionObserver Navigation** — Active section highlighting uses visibility-ratio comparison (not `scrollY` offsets), so the navbar always reflects what's actually on screen

### Design System
- **Dark / Light Mode** — Persisted in `localStorage`, toggled from the navbar; no-flicker initialisation script in `index.html` runs before React mounts
- **Glassmorphism UI** — `backdrop-filter: blur(20px)` cards with per-theme overrides — dark glass in dark mode, white cards in light mode; never inverted
- **CSS Variable Design Tokens** — All colors, borders, and backgrounds defined once in `:root` and overridden in `html.light-mode`
- **Fluid Typography** — `clamp()`-based font sizes across all headings for smooth scaling from mobile to 4K

### Sections
- **Hero** — Staggered mount animation, `rithwik.config.ts` syntax-highlighted code card with 6-color token system, floating CGPA + Projects stat cards, "View Work" and "Resume" CTAs
- **About** — Profile photo with 3D spring tilt on hover (`rotateY + rotateX`), bio, skill highlights, resume download; graceful `RB` initials fallback if image is missing
- **Experience** — Animated vertical timeline with active-status pulse indicator
- **Global Experience** — Interactive dual-card layout replicating native LinkedIn post architecture for professional credibility. Features a hardware-accelerated "Cinematic Slideshow" with dynamic Light/Dark mode vignette overlays, auto-scaling typography, and expandable text constraints.
- **Projects** — Featured cards (image-dominant 50/50 layout, hover overlay with action buttons) + responsive grid cards; desktop hover overlay, mobile static buttons — no scroll-triggered flicker
- **Skills** — 7-category interactive glass cards (Programming, Frontend, Backend, Databases, AI/ML, Core CS, Tools)
- **Education** — Vertical timeline with period badges, subject chips, grade pills, and location pins
- **Certifications** — Cards with badge images, skill tags, and PDF certificate links
- **Contact** — Apple-style focus-ring form fields, Web3Forms zero-backend submission, animated send state, social link grid

### Performance
- All cursor/scroll animation via `requestAnimationFrame` + `translate3d` — GPU compositor lane only
- Zero-latency hardware-synced LERP tracking ensures the custom mouse pointer never lags behind physical hardware
- Expensive `backdrop-filter` matrix convolutions strictly removed from `framer-motion` animation layers to guarantee 60fps transitions
- `IntersectionObserver` for all scroll-triggered animations — zero passive scroll listeners on elements
- Images lazy-loaded with `loading="lazy"`
- Three.js loaded dynamically from CDN only when the intro plays — zero bundle weight at runtime
- Framer Motion tree-shaken in production

---

## 🧠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | React 18 + Vite 5 | Component model, fast HMR, optimised production builds |
| Styling | Tailwind CSS 3 | Utility-first, zero dead CSS in production |
| Animation | Framer Motion 11 | Declarative spring physics + scroll-triggered animations |
| 3D / WebGL | Three.js (CDN, r89) | GLSL fragment shader for the intro splash |
| Typography | Syne · DM Sans · JetBrains Mono | Display / body / code — each chosen intentionally |
| Contact Form | Web3Forms | Zero-backend form submission, no server required |
| Build Tool | Vite 5 | Sub-second cold starts, ES module native |
| Deployment | Vercel | Edge CDN, instant deploys via Git push |

---

## 🏗️ Architecture Overview

This is a **pure frontend** single-page application — no backend, no database, no API server.

```
Browser
  └── React SPA (Vite)
        ├── App.jsx          — Root: intro gate logic, scroll lock, section composition
        ├── components/      — Stateless infrastructure (cursor, navbar, scroll bar)
        └── sections/        — Full-width page sections rendered in scroll order
              └── data/index.js  ← SINGLE SOURCE OF TRUTH for all content
```

**Content flow:** All personal info, projects, skills, experience, education, and certifications live in `src/data/index.js`. Sections import from it — change one file, everything updates.

**Theme flow:** `index.html` runs an inline script before React mounts, reading `localStorage('rb-theme')` and setting `html.light-mode` or `html.dark` immediately — preventing any flash of wrong theme.

**Form flow:** Contact form POSTs JSON to `api.web3forms.com/submit` with a public access key — no server needed, emails arrive directly to the configured inbox.

---

## 📁 Project Structure

```
rithwik-portfolio/
├── public/
│   └── assets/
│       ├── certificates/        # AI-900.pdf, AICTE cert, badge images
│       ├── favicon/             # favicon.svg
│       ├── profile/             # profile_pic.png
│       ├── projects/            # project-01.png … project-05.png (screenshots)
│       └── resume/              # Rithwik_Resume.pdf
│
├── src/
│   ├── components/
│   │   ├── Cursor.jsx           # 3-state macOS SVG cursor (RAF loop + elementFromPoint)
│   │   ├── HeroIntro.tsx        # WebGL shader intro (Three.js, lazy CDN load)
│   │   ├── Navbar.jsx           # Sticky glass nav, theme toggle, mobile menu, IO active section
│   │   ├── ScrollProgress.jsx   # Thin top progress bar via RAF + scaleX
│   │   └── useInView.js         # IntersectionObserver hook for scroll animations
│   │
│   ├── sections/
│   │   ├── Hero.jsx             # Code card, animated title, stats, CTAs
│   │   ├── About.jsx            # Profile photo, bio, 3D tilt hover
│   │   ├── Experience.jsx       # Animated vertical timeline
│   │   ├── GlobalExperience.jsx # Cinematic slideshow, native LinkedIn card replication
│   │   ├── Projects.jsx         # Featured cards + grid cards + GitHub CTA
│   │   ├── Skills.jsx           # Categorised interactive glass cards
│   │   ├── Education.jsx        # Timeline + certifications panel
│   │   ├── Contact.jsx          # Web3Forms form + social links
│   │   └── Footer.jsx           # Nav links, social icons, copyright
│   │
│   ├── data/
│   │   └── index.js             # ★ All content — personal, projects, skills, experience, education
│   │
│   ├── App.jsx                  # Root component — intro logic, section composition
│   ├── main.jsx                 # React DOM entry point
│   └── index.css                # Design system: CSS vars, glass, typography, light mode
│
├── index.html                   # Meta tags, OG tags, no-flicker theme script, Google Fonts
├── tailwind.config.js           # Custom colors (obsidian, accent, silver), fonts, animations
├── vite.config.js               # Vite config with React plugin
└──postcss.config.js            # Tailwind + Autoprefixer
```

---

## ⚙️ Setup Instructions

### Prerequisites

- **Node.js** `v18+`
- **npm** `v9+`

### 1. Clone the repository

```bash
git clone https://github.com/RithwikBandi/portfolio.git
cd portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your content

Open `src/data/index.js` and update the `personal` object with your details:

```js
export const personal = {
  name:     'Your Name',
  title:    'Your Title',
  email:    'you@example.com',
  github:   'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourprofile',
  resume:   '/assets/resume/Your_Resume.pdf',
  // ... see CONFIG_GUIDE.md for all fields
}
```

### 4. Add your assets

```bash
public/assets/profile/profile_pic.png     # Your photo (640×640px recommended)
public/assets/resume/Rithwik_Resume.pdf   # Your resume PDF
public/assets/projects/project-01.png     # Project screenshots (16:9)
public/assets/projects/project-02.png
# ... up to project-05.png
```

### 5. Set up the contact form

1. Create a free account at [web3forms.com](https://web3forms.com)
2. Get your **Access Key**
3. Replace the key in `src/sections/Contact.jsx`:

```js
body: JSON.stringify({
  access_key: 'YOUR_WEB3FORMS_ACCESS_KEY',
  ...formData
})
```

> ⚠️ See [Environment Variables](#-environment-variables) below to keep this key out of source control.

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 7. Build for production

```bash
npm run build       # Outputs to dist/
npm run preview     # Preview the production build locally
```

---

## 🔐 Environment Variables

The contact form access key is currently inline in the source. To keep it out of version control, use a `.env` file:

**Create `.env` in the project root:**

```env
VITE_WEB3FORMS_KEY=your_access_key_here
```

**Then update `src/sections/Contact.jsx`:**

```js
body: JSON.stringify({
  access_key: import.meta.env.VITE_WEB3FORMS_KEY,
  ...formData
})
```

> All Vite environment variables must be prefixed with `VITE_` to be exposed to the browser.

| Variable | Required | Description |
|---|---|---|
| `VITE_WEB3FORMS_KEY` | Yes | Web3Forms public access key for contact form |

---

## 📸 Screenshots

| Section | Preview |
|---|---|
| Hero | `public/assets/projects/project-01.png` |
| Projects | `public/assets/projects/project-02.png` |

> Add your own screenshots to `public/assets/projects/` named `project-01.png` through `project-05.png`.

---

## 📦 Deployment

### Vercel (Recommended)

**Option A — CLI:**

```bash
npm i -g vercel
vercel
```

**Option B — Git Integration (auto-deploy on push):**

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your repository
4. Framework preset: **Vite**
5. Add environment variable: `VITE_WEB3FORMS_KEY`
6. Click **Deploy**

Every `git push` to `main` triggers an automatic redeploy.

**Build settings** (auto-detected by Vercel):

```
Build Command:   npm run build
Output Directory: dist
Install Command: npm install
```

### Other Platforms

| Platform | Notes |
|---|---|
| Netlify | Same build settings; add env vars in site settings |
| GitHub Pages | Add `base: '/repo-name/'` to `vite.config.js` |
| Cloudflare Pages | Framework: Vite; output: `dist` |

---

## 🎨 Customisation

The entire portfolio is designed around a **single source of truth** principle.

| What to change | Where |
|---|---|
| Personal info, links, bio | `src/data/index.js` → `personal` |
| Projects (add/remove/edit) | `src/data/index.js` → `projects` |
| Skills | `src/data/index.js` → `skills` |
| Experience | `src/data/index.js` → `experience` |
| Education & certifications | `src/data/index.js` → `education`, `certifications` |
| Accent color / design tokens | `src/index.css` → `:root` and `html.light-mode` |
| Fonts | `index.html` Google Fonts URL + `tailwind.config.js` |
| Project screenshots | `public/assets/projects/project-NN.png` |
| Resume PDF | `public/assets/resume/` |

See [`CONFIG_GUIDE.md`](CONFIG_GUIDE.md) for detailed instructions on every configurable element.

---

## 🤝 Contributing

This is a personal portfolio — contributions aren't expected, but if you spot a bug or have a suggestion:

1. Fork the repository
2. Create a feature branch: `git checkout -b fix/your-fix`
3. Commit your changes: `git commit -m 'fix: describe the fix'`
4. Push and open a Pull Request

---

## 📄 License

MIT © [Rithwik Bandi](https://github.com/RithwikBandi)

You're welcome to use this as inspiration or a starting point for your own portfolio. A credit or star is appreciated but not required.

---

<div align="center">

Built with precision by **Rithwik Bandi**

[rithwikbandi.tech](https://rithwikbandi.tech) · [GitHub](https://github.com/RithwikBandi) · [LinkedIn](https://www.linkedin.com/in/rithwik-bandi/)

</div>
