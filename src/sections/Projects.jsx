import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../components/useInView'
import { projects } from '../data'

const ExternalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

function FeaturedCard({ project, index }) {
  const [ref, inView] = useInView()
  const isEven = index % 2 === 0

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group relative glass glass-hover rounded-2xl overflow-hidden border border-white/6"
    >
      {/* Accent line top */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-60 z-10"
        style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
      />

      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{ background: `radial-gradient(ellipse at ${isEven ? '75%' : '25%'} 50%, ${project.color}0a 0%, transparent 65%)` }}
      />

      {/* Grid — no outer padding; text side has its own padding; image side bleeds flush */}
      <div className="relative z-10 grid lg:grid-cols-2 items-stretch min-h-[360px]">
        {/* Text side — padded independently */}
        <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'} flex flex-col justify-center p-8 lg:p-10`}>
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-3xl font-bold opacity-10 text-white select-none">{project.number}</span>
            <span className="section-label" style={{ color: project.color }}>{project.category}</span>
          </div>

          <h3 className="font-display font-bold text-2xl lg:text-3xl text-white mb-4 group-hover:text-white/95 transition-colors">
            {project.title}
          </h3>

          <p className="text-silver-400 font-body text-sm leading-relaxed mb-4">
            {project.description}
          </p>

          <div
            className="flex items-start gap-2 px-4 py-3 rounded-lg mb-6 border text-xs font-body"
            style={{
              background: `${project.color}08`,
              borderColor: `${project.color}20`,
              color: project.color,
            }}
          >
            <span className="shrink-0 mt-0.5">✦</span>
            <span>{project.impact}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-7">
            {project.tech.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>

          <div className="flex gap-3">
            {project.live && (
              <motion.a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs py-2.5 px-5 cursor-none"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <ExternalIcon />
                View Project
              </motion.a>
            )}
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs py-2.5 px-5 cursor-none"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <GithubIcon />
              Source
            </motion.a>
          </div>
        </div>

        {/* Visual side — flush to card edge, full height */}
        <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'} relative`}>
          <ProjectVisual project={project} />
        </div>
      </div>
    </motion.article>
  )
}

function ProjectVisual({ project }) {
  const [hovered, setHovered] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [imgError, setImgError] = useState(false)
  const screenshotSrc = `/assets/projects/project-${project.number}.png`

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  // Desktop-only: overlay shows on genuine pointer hover.
  // Touch devices never set hovered (no onMouseEnter bound) and
  // never show the overlay — static buttons render below the image instead.
  // Only show overlay if there is a live link.
  const showOverlay = !isTouch && hovered && project.live

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        minHeight: '280px',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
      }}
      // Only attach hover listeners on non-touch devices
      onMouseEnter={!isTouch ? () => setHovered(true) : undefined}
      onMouseLeave={!isTouch ? () => setHovered(false) : undefined}
    >
      {/* Accent glow — bleeds behind image edge */}
      <div
        className="absolute -inset-8 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${project.color}22 0%, transparent 65%)`,
          opacity: hovered ? 1 : 0.5,
        }}
      />

      {/* Screenshot or decorative placeholder */}
      {!imgError ? (
        <img
          src={screenshotSrc}
          alt={`${project.title} preview`}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-top"
          style={{
            display: 'block',
            // Scale effect only on desktop — no transform on touch (avoids jank)
            transform: (!isTouch && hovered) ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
          }}
          loading="lazy"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${project.color}20 0%, var(--bg-primary) 75%)`,
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(${project.color}30 1px, transparent 1px),
                                linear-gradient(90deg, ${project.color}30 1px, transparent 1px)`,
              backgroundSize: '28px 28px',
            }}
          />
          <div className="relative text-center select-none">
            <div
              className="font-display font-bold leading-none mb-2"
              style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', color: project.color, opacity: 0.3 }}
            >
              {project.number}
            </div>
            <div className="font-mono text-[11px] tracking-widest uppercase" style={{ color: project.color, opacity: 0.45 }}>
              {project.category}
            </div>
            <div className="mt-3 flex justify-center gap-1.5">
              {project.tech.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-mono px-2 py-1 rounded"
                  style={{ background: `${project.color}15`, color: project.color }}
                >
                  {t.split(' ')[0]}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop overlay — hidden on touch, shown on hover */}
      {!isTouch && (
        <div
          className="absolute inset-0 flex items-center justify-center gap-3"
          style={{
            background: 'rgba(0,0,0,0.62)',
            backdropFilter: 'blur(6px)',
            opacity: showOverlay ? 1 : 0,
            transition: 'opacity 0.25s ease',
            pointerEvents: showOverlay ? 'auto' : 'none',
          }}
        >
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-none"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--accent)',
                color: '#080a0f',
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: '13px',
                padding: '9px 20px',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <ExternalIcon />
              View Project
            </a>
          )}
        </div>
      )}
    </div>
  )
}


function ProjectCard({ project, index }) {
  const [ref, inView] = useInView()
  const [hovered, setHovered] = useState(false)
  const [imgHovered, setImgHovered] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  // showOverlay is desktop-only: never driven by isTouch.
  // Touch devices use the static button row at the bottom of the card instead.
  // Only show overlay if there is a live link.
  const showOverlay = !isTouch && imgHovered && project.live

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      // Hover listeners only on non-touch — prevents synthetic pointer events
      // from firing during scroll on iOS/Android
      onMouseEnter={!isTouch ? () => setHovered(true) : undefined}
      onMouseLeave={!isTouch ? () => setHovered(false) : undefined}
      className="group glass rounded-2xl border border-[var(--border)] flex flex-col relative overflow-hidden"
      style={{
        // Scale/shadow only on desktop hover — no transform on touch
        transform: (!isTouch && hovered) ? 'translateY(-3px) scale(1.03)' : 'translateY(0) scale(1)',
        boxShadow: (!isTouch && hovered)
          ? `0 20px 60px rgba(0,0,0,0.45), 0 0 0 1px ${project.color}22, 0 0 40px ${project.color}10`
          : '0 4px 24px rgba(0,0,0,0.2)',
        transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
      }}
    >
      {/* ── Image preview — 16:9 ─────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: '3/2', background: 'var(--bg-secondary)' }}
        onMouseEnter={!isTouch ? () => setImgHovered(true) : undefined}
        onMouseLeave={!isTouch ? () => setImgHovered(false) : undefined}
      >
        {/* Screenshot — tries /assets/projects/project-NN.png first */}
        {!imgError ? (
          <img
            src={`/assets/projects/project-${project.number}.png`}
            alt={`${project.title} preview`}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          /* Decorative placeholder — shown when screenshot is missing */
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${project.color}18 0%, var(--bg-primary) 70%)`,
            }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `linear-gradient(${project.color}30 1px, transparent 1px),
                                  linear-gradient(90deg, ${project.color}30 1px, transparent 1px)`,
                backgroundSize: '28px 28px',
              }}
            />
            <div className="relative text-center select-none">
              <div
                className="font-display font-bold leading-none mb-1"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', color: project.color, opacity: 0.35 }}
              >
                {project.number}
              </div>
              <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: project.color, opacity: 0.5 }}>
                {project.category}
              </div>
            </div>
          </div>
        )}

        {/* Desktop-only hover overlay — completely absent from DOM on touch */}
        {!isTouch && (
          <div
            className="absolute inset-0 flex items-center justify-center gap-3"
            style={{
              background: 'rgba(0,0,0,0.62)',
              backdropFilter: 'blur(6px)',
              opacity: showOverlay ? 1 : 0,
              transition: 'opacity 0.25s ease',
              pointerEvents: showOverlay ? 'auto' : 'none',
            }}
          >
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-none"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--accent)',
                  color: '#080a0f',
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 600,
                  fontSize: '12px',
                  letterSpacing: '0.02em',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <ExternalIcon />
                View Project
              </a>
            )}
          </div>
        )}

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`, opacity: 0.6 }}
        />
      </div>

      {/* ── Card body ────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category + number */}
        <div className="flex items-start justify-between mb-3">
          <span
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: project.color }}
          >
            {project.category}
          </span>
          <span className="font-mono font-bold text-xl opacity-10 text-[var(--text-primary)] select-none">
            {project.number}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-2 leading-snug transition-colors duration-200">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed mb-3 flex-1 line-clamp-3">
          {project.description}
        </p>

        {/* Impact pill */}
        <div
          className="text-xs font-body px-3 py-2 rounded-lg mb-4 leading-snug"
          style={{
            background: `${project.color}08`,
            color: project.color,
            border: `1px solid ${project.color}18`,
          }}
        >
          {project.impact}
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((t) => (
            <span key={t} className="tag text-[10px] px-2 py-1">{t}</span>
          ))}
          {project.tech.length > 4 && (
            <span className="tag text-[10px] px-2 py-1 opacity-50">+{project.tech.length - 4}</span>
          )}
        </div>

        {/* Action Buttons (Always visible) */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-[var(--border)]">
          {project.live && (
            <motion.a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs py-2 px-4 cursor-none flex items-center justify-center gap-1.5 flex-1"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <ExternalIcon />
              View Project
            </motion.a>
          )}
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs py-2 px-4 cursor-none flex items-center justify-center gap-1.5 flex-1"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <GithubIcon />
            Source
          </motion.a>
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const [headRef, headInView] = useInView()
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <section id="projects" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <p className="section-label mb-4">Projects</p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white leading-tight mb-4">
            Selected <span className="gradient-text">work</span>
          </h2>
          <p className="text-silver-400 font-body max-w-xl mx-auto">
            Real-world applications built with clean architecture, modern tooling, and attention to impact.
          </p>
        </motion.div>

        {/* Featured projects */}
        <div className="space-y-6 mb-16">
          {featured.map((p, i) => (
            <FeaturedCard key={p.id} project={p} index={i} />
          ))}
        </div>

        {/* Grid projects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}

          {/* GitHub CTA card */}
          <motion.a
            href="https://github.com/RithwikBandi"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="glass glass-hover rounded-2xl p-6 border border-dashed border-white/10 flex flex-col items-center justify-center text-center gap-4 cursor-none group min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent-DEFAULT/40 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-silver-400 group-hover:text-accent-DEFAULT transition-colors">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <div>
              <p className="font-display font-semibold text-white text-sm mb-1">More on GitHub</p>
              <p className="font-body text-silver-500 text-xs">Follow for latest projects</p>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
