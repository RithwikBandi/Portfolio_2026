import { motion } from 'framer-motion'
import { personal } from '../data'

const socialLinks = [
  {
    label: 'GitHub',
    href: personal.github,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: personal.linkedin,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'LeetCode',
    href: personal.leetcode,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: personal.twitter,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
      </svg>
    ),
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg"
    >
      {/* Ambient glow orbs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(110,231,183,0.04) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full py-32 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen lg:min-h-0">

          {/* Left: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            {/* Status badge */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center gap-2.5 glass rounded-full px-4 py-2 border border-accent-DEFAULT/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-DEFAULT opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-DEFAULT" />
                </span>
                <span className="text-xs font-mono text-silver-300 tracking-wide">{personal.status}</span>
              </div>
            </motion.div>

            {/* Greeting */}
            <motion.p
              variants={itemVariants}
              className="section-label mb-4"
            >
              Hello, I'm
            </motion.p>

            {/* Name */}
            <motion.h1
              variants={itemVariants}
              className="font-display font-bold leading-[0.9] tracking-tight mb-6"
              style={{ fontSize: 'clamp(56px, 8vw, 96px)' }}
            >
              <span className="text-white">Rithwik</span>
              <br />
              <span className="gradient-text">Bandi</span>
            </motion.h1>

            {/* Title */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-accent-DEFAULT opacity-60" />
              <p className="font-mono text-sm text-silver-400 tracking-widest uppercase">
                {personal.title}
              </p>
            </motion.div>

            {/* Tagline */}
            <motion.p
              variants={itemVariants}
              className="text-silver-400 font-body text-lg leading-relaxed mb-10 max-w-xl text-balance"
            >
              {personal.tagline}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-12">
              <motion.button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Projects
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </motion.button>
              <motion.button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Me
              </motion.button>
            </motion.div>

            {/* Social links */}
            <motion.div variants={itemVariants} className="flex items-center gap-5">
              <span className="text-xs font-mono text-silver-500 tracking-wider">FIND ME</span>
              <div className="w-6 h-px bg-white/10" />
              <div className="flex gap-4">
                {socialLinks.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-silver-500 hover:text-accent-DEFAULT transition-colors duration-200 cursor-none"
                    whileHover={{ y: -2, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Visual element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="hidden lg:flex items-center justify-center relative"
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-mono text-silver-600 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-accent-DEFAULT/50 to-transparent"
        />
      </motion.div>
    </section>
  )
}

function HeroVisual() {
  const codeLines = [
    { text: 'const rithwik = {', indent: 0, color: '#6ee7b7' },
    { text: '  role: "Full Stack & AI Eng",', indent: 1, color: '#94a3b8' },
    { text: '  stack: ["React", "Node", "FastAPI"],', indent: 1, color: '#94a3b8' },
    { text: '  passion: "building at scale",', indent: 1, color: '#94a3b8' },
    { text: '  status: "open to work",', indent: 1, color: '#6ee7b7' },
    { text: '  cgpa: 8.92,', indent: 1, color: '#94a3b8' },
    { text: '}', indent: 0, color: '#6ee7b7' },
  ]

  return (
    <div className="relative w-full max-w-[460px]">
      {/* Glow behind card */}
      <div
        className="absolute inset-0 rounded-2xl blur-3xl opacity-20"
        style={{ background: 'radial-gradient(ellipse, #6ee7b7 0%, transparent 70%)' }}
      />

      {/* Main code card */}
      <div className="relative glass rounded-2xl overflow-hidden border border-white/8">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-3 text-xs font-mono text-silver-500">profile.ts</span>
        </div>

        {/* Code content */}
        <div className="p-6 font-mono text-sm leading-7">
          {codeLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.5 }}
              style={{ color: line.color }}
            >
              <span className="text-silver-600 select-none mr-4 text-xs">{String(i + 1).padStart(2, '0')}</span>
              {line.text}
              {i === codeLines.length - 2 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-accent-DEFAULT ml-0.5 align-middle"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating stat cards */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-5 -right-8 glass rounded-xl px-4 py-3 border border-white/8 text-center"
      >
        <div className="text-2xl font-display font-bold text-accent-DEFAULT">8.92</div>
        <div className="text-xs font-mono text-silver-500 mt-0.5">CGPA</div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -bottom-5 -left-8 glass rounded-xl px-4 py-3 border border-white/8"
      >
        <div className="text-2xl font-display font-bold text-accent-DEFAULT">5+</div>
        <div className="text-xs font-mono text-silver-500 mt-0.5">Projects</div>
      </motion.div>
    </div>
  )
}
