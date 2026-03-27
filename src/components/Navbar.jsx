import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { personal } from '../data'

// ─── Theme helpers ────────────────────────────────────────────────────────────
function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('rb-theme')
  if (stored === 'light' || stored === 'dark') return stored
  return 'dark'
}

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
    root.classList.remove('light-mode')
  } else {
    root.classList.remove('dark')
    root.classList.add('light-mode')
  }
  localStorage.setItem('rb-theme', theme)
}

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
)

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Global', href: '#global' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    // ── Scroll state (navbar glass effect) ───────────────────────────
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // initialise on mount

    // ── Active section via IntersectionObserver ───────────────────────
    // Fires only when a section is ≥ 45% visible in the viewport.
    // Using a Map so the latest entry event wins cleanly when two
    // sections briefly overlap the threshold at the same time.
    const SECTIONS = ['about', 'experience', 'global', 'projects', 'skills', 'contact']
    const visible  = new Map()   // id → intersectionRatio

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          visible.set(entry.target.id, entry.intersectionRatio)
        })

        // Pick whichever tracked section has the highest ratio right now
        let bestId    = ''
        let bestRatio = 0
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) { bestRatio = ratio; bestId = id }
        })

        // Only update when something is genuinely crossing the threshold
        // (ratio > 0 avoids clearing active on a section scrolling fully out)
        if (bestRatio > 0) setActiveSection(bestId)
      },
      {
        // 0.45 = section must be 45 % in view before it becomes "active"
        // Multiple thresholds give the map continuous ratio updates so the
        // "most visible" comparison stays accurate while scrolling fast
        threshold: [0, 0.1, 0.2, 0.3, 0.45, 0.6, 0.75, 1.0],
      }
    )

    SECTIONS.forEach(id => {
      const el = document.getElementById(id)
      if (el) { visible.set(id, 0); observer.observe(el) }
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleNavClick = (href) => {
    setMobileOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      // Small delay to let menu close animation finish
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass border-b border-white/5 py-3'
            : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="font-display font-bold text-lg tracking-tight cursor-none flex-shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-white">RB</span>
            <span className="text-accent-DEFAULT accent-text">.</span>
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '')
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`relative px-4 py-2 text-sm font-body font-medium transition-colors duration-200 cursor-none rounded-md ${
                    isActive ? 'text-white' : 'text-silver-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-md bg-white/5"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </button>
              )
            })}
          </div>

          {/* Desktop Right side */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-silver-400 hover:text-white transition-colors cursor-none"
            >
              <GitHubIcon />
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-silver-400 hover:text-white transition-colors cursor-none"
            >
              <LinkedInIcon />
            </a>

            <motion.button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-silver-400 hover:text-white hover:border-white/20 transition-all cursor-none"
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  style={{ display: 'flex' }}
                >
                  {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <button
              onClick={() => handleNavClick('#contact')}
              className="btn-primary text-sm py-2 px-5"
            >
              Let's Talk
            </button>
          </div>

          {/* Mobile right: theme + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--menu-border)] text-[var(--menu-text)] transition-colors duration-300"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Hamburger — 44×44 tap target */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-11 h-11 flex flex-col items-center justify-center gap-[5px]"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <motion.span
                animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }}
                transition={{ duration: 0.25 }}
                className="w-5 h-0.5 bg-white block rounded-full origin-center"
              />
              <motion.span
                animate={{ opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="w-5 h-0.5 bg-white block rounded-full"
              />
              <motion.span
                animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }}
                transition={{ duration: 0.25 }}
                className="w-5 h-0.5 bg-white block rounded-full origin-center"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen menu — rendered outside nav so it overlays everything */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 md:hidden transition-colors duration-300"
            style={{ background: 'var(--menu-overlay-bg)', backdropFilter: 'blur(20px)' }}
          >
            {/* Spacer for navbar height */}
            <div className="h-16" />

            <div className="px-6 py-8 flex flex-col h-[calc(100%-4rem)]">
              {/* Nav links */}
              <nav className="flex flex-col gap-1 flex-1">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    onClick={() => handleNavClick(link.href)}
                    className="text-left py-4 text-2xl font-display font-semibold text-[var(--menu-text)] hover:text-[var(--menu-text-active)] active:text-accent-DEFAULT transition-colors duration-300 border-b border-[var(--menu-border)] last:border-0"
                  >
                    <span className="text-xs font-mono text-[var(--menu-text-muted)] mr-3">0{i + 1}</span>
                    {link.label}
                  </motion.button>
                ))}
              </nav>

              {/* Bottom: social + CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.3 }}
                className="pt-6 flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--menu-border)] text-[var(--menu-text)] hover:text-[var(--menu-text-active)] hover:border-[var(--menu-border-hover)] transition-colors duration-300"
                  >
                    <GitHubIcon />
                  </a>
                  <a
                    href={personal.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--menu-border)] text-[var(--menu-text)] hover:text-[var(--menu-text-active)] hover:border-[var(--menu-border-hover)] transition-colors duration-300"
                  >
                    <LinkedInIcon />
                  </a>
                </div>

                <button
                  onClick={() => handleNavClick('#contact')}
                  className="btn-primary w-full justify-center py-3.5 text-base"
                >
                  Let's Talk
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
