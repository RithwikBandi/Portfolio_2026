import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../components/useInView'
import { personal } from '../data'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function About() {
  const [ref, inView] = useInView()
  const [imgHovered, setImgHovered] = useState(false)

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(110,231,183,0.03) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-2 gap-20 items-center"
        >
          {/* Left: Profile image */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center lg:justify-start"
          >
            <motion.div
              className="relative group"
              onMouseEnter={() => setImgHovered(true)}
              onMouseLeave={() => setImgHovered(false)}
              animate={imgHovered
                ? { scale: 1.04, rotateY: 3, rotateX: -2 }
                : { scale: 1, rotateY: 0, rotateX: 0 }
              }
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              style={{ transformStyle: 'preserve-3d', perspective: 800 }}
            >
              {/* Outer glow ring */}
              <div
                className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(110,231,183,0.18) 0%, transparent 70%)' }}
              />

              {/* Glass frame */}
              <div
                className="relative rounded-3xl overflow-hidden border border-white/10"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  boxShadow: imgHovered
                    ? '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(110,231,183,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                    : '0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)',
                  transition: 'box-shadow 0.4s ease',
                }}
              >
                {/* Profile image */}
                <img
                  src="/assets/profile/profile_pic.png"
                  alt="Rithwik Bandi"
                  className="w-72 h-72 lg:w-80 lg:h-80 object-cover object-[center_35%] block"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                {/* Initials fallback — hidden until image fails */}
                <div className="hidden w-72 h-72 lg:w-80 lg:h-80 flex items-center justify-center">
                  <span className="font-display font-bold text-6xl gradient-text select-none">RB</span>
                </div>

                {/* Glass reflection sweep — animates on hover */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={imgHovered
                    ? { x: ['−100%', '200%'], opacity: [0, 0.18, 0] }
                    : { x: '-100%', opacity: 0 }
                  }
                  transition={{ duration: 0.52, ease: 'easeInOut' }}
                  style={{
                    background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)',
                    transform: 'skewX(-12deg)',
                  }}
                />

                {/* Persistent inner border highlight */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)',
                  }}
                />
              </div>

              {/* Floating accent dot */}
              <motion.div
                className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full border-2 border-obsidian-950"
                style={{ background: 'var(--accent)' }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>

          {/* Right: Text */}
          <div>
            <motion.p variants={itemVariants} className="section-label mb-4">About Me</motion.p>

            <motion.h2
              variants={itemVariants}
              className="font-display font-bold text-4xl lg:text-5xl text-white leading-tight mb-8"
            >
              Crafting software that{' '}
              <span className="gradient-text">matters</span>
            </motion.h2>

            <motion.div variants={itemVariants} className="space-y-4 text-silver-400 font-body leading-relaxed mb-8">
            <p>I'm Rithwik Bandi, a Computer Science undergraduate currently pursuing my B.Tech at SR University. I’m a student developer who believes in learning software engineering by building real projects and understanding systems from the ground up.</p>

            <p>My interests center around full-stack and application development, with a focus on building well-structured, usable, and maintainable software. I enjoy developing features end-to-end while strengthening my understanding of application flow, system design, and modern web technologies.</p>

            <p>This portfolio brings together the projects I’ve built, the concepts I’ve explored, and the skills I’m actively developing as a Computer Science student preparing for a career in software development.</p>
            </motion.div>

            {/* Details */}
            <motion.div variants={itemVariants} className="flex flex-col gap-3 mb-8">
              {[
                { icon: '📍', text: personal.location },
                { icon: '🎓', text: `${personal.degree} · ${personal.university}` },
                { icon: '✉️', text: personal.email },
              ].map((d) => (
                <div key={d.text} className="flex items-center gap-3 text-sm text-silver-400">
                  <span className="text-base">{d.icon}</span>
                  <span className="font-body">{d.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <motion.button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get in Touch
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </motion.button>
              <motion.a
                href={personal.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary cursor-none"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Resume
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
