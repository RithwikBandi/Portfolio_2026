import { useState, useEffect, useCallback } from 'react'
import HeroIntro from './components/HeroIntro'
import Cursor from './components/Cursor'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Experience from './sections/Experience'
import GlobalExperience from './sections/GlobalExperience'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Education from './sections/Education'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

// ─── Intro trigger keys ──────────────────────────────────────────────────────
const LS_KEY  = 'introSeenTime'       // localStorage  — persists across sessions
const SS_KEY  = 'introSessionSeen'    // sessionStorage — cleared when tab closes
const SIX_H   = 6 * 60 * 60 * 1000   // 6-hour threshold

/**
 * Hybrid intro decision — evaluated ONCE synchronously before first render.
 *
 * Show intro if:
 *   A) No localStorage record   → genuine first-ever visit
 *   B) No sessionStorage flag   → new session (tab was closed & reopened)
 *      AND enough time has passed since last intro (≥ 6 hours)
 *
 * Skip intro if:
 *   - sessionStorage flag is set → same session, even after a refresh
 *   - Time threshold not met     → reopened tab but too soon
 *   - Storage unavailable        → degrade gracefully, never block the site
 */
function shouldShowIntro() {
  try {
    const lastSeen    = localStorage.getItem(LS_KEY)
    const sessionSeen = sessionStorage.getItem(SS_KEY)

    if (!lastSeen) return true          // (A) first visit ever — no record at all

    if (!sessionSeen && Date.now() - Number(lastSeen) > SIX_H) {
      return true                       // (B) new session + enough time elapsed
    }

    return false                        // same session OR visited too recently
  } catch {
    return false                        // storage blocked (private mode) — skip gracefully
  }
}

/** Write both keys atomically so session + timestamp are always in sync. */
function storeIntroSeen() {
  try {
    const now = String(Date.now())
    localStorage.setItem(LS_KEY, now)
    sessionStorage.setItem(SS_KEY, 'true')
  } catch { /* noop — storage unavailable */ }
}

export default function App() {
  // Evaluate once on mount so the decision is stable — no flicker
  const [showIntro]     = useState(() => shouldShowIntro())
  const [introComplete, setIntroComplete] = useState(() => !shouldShowIntro())

  // Disable default cursor on desktop
  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches
    if (!isMobile) document.body.style.cursor = 'none'
  }, [])

  // Lock scroll while intro is playing
  useEffect(() => {
    document.body.style.overflow = introComplete ? '' : 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [introComplete])

  const handleIntroComplete = useCallback(() => {
    storeIntroSeen()
    setIntroComplete(true)
  }, [])

  // Skip intro immediately — identical effect to natural completion
  const handleSkip = useCallback(() => {
    storeIntroSeen()
    setIntroComplete(true)
  }, [])

  return (
    <>
      {/* Intro overlay — only mounts when intro should play */}
      {showIntro && !introComplete && (
        <>
          <HeroIntro onComplete={handleIntroComplete} />

          {/* Skip button — top-right, subtle glass pill */}
          <button
            onClick={handleSkip}
            aria-label="Skip intro"
            style={{
              position:       'fixed',
              top:            '1.25rem',
              right:          '1.25rem',
              zIndex:         600,
              background:     'rgba(255,255,255,0.06)',
              border:         '1px solid rgba(255,255,255,0.12)',
              color:          'rgba(255,255,255,0.55)',
              fontFamily:     "'JetBrains Mono', monospace",
              fontSize:       '11px',
              letterSpacing:  '0.12em',
              textTransform:  'uppercase',
              padding:        '7px 16px',
              borderRadius:   '6px',
              cursor:         'pointer',
              backdropFilter: 'blur(8px)',
              transition:     'color 0.2s ease, border-color 0.2s ease, background 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color        = 'rgba(255,255,255,0.9)'
              e.currentTarget.style.borderColor  = 'rgba(255,255,255,0.28)'
              e.currentTarget.style.background   = 'rgba(255,255,255,0.10)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color        = 'rgba(255,255,255,0.55)'
              e.currentTarget.style.borderColor  = 'rgba(255,255,255,0.12)'
              e.currentTarget.style.background   = 'rgba(255,255,255,0.06)'
            }}
          >
            Skip
          </button>
        </>
      )}

      {/* Main site — always in DOM so fonts/assets preload, revealed after intro */}
      <div
        className="noise-bg min-h-screen bg-obsidian-950 text-white relative"
        style={{
          opacity:       introComplete ? 1 : 0,
          transition:    introComplete ? 'opacity 0.5s ease' : 'none',
          pointerEvents: introComplete ? 'auto' : 'none',
        }}
      >
        <Cursor />
        <ScrollProgress />
        <Navbar />

        <main>
          <Hero />

          <div className="relative">
            <SectionDivider />
            <About />
            <SectionDivider />
            <Experience />
            <SectionDivider />
            <GlobalExperience />
            <SectionDivider />
            <Projects />
            <SectionDivider />
            <Skills />
            <SectionDivider />
            <Education />
            <SectionDivider />
            <Contact />
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

function SectionDivider() {
  return (
    <div className="w-full h-px mx-auto max-w-7xl px-6">
      <div
        className="w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }}
      />
    </div>
  )
}
