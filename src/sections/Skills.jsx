import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../components/useInView'
import { skills } from '../data'

function SkillCard({ category, index }) {
  const [ref, inView] = useInView()
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="glass glass-hover rounded-2xl p-6 border border-white/6 relative overflow-hidden group"
    >
      {/* Hover accent glow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(110,231,183,0.6), transparent)' }}
      />

      <div className="flex items-center gap-3 mb-5">
        <span className="text-xl">{category.icon}</span>
        <h3 className="font-display font-semibold text-white text-sm tracking-wide">
          {category.category}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {category.items.map((skill, si) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 + index * 0.07 + si * 0.04, duration: 0.4 }}
            whileHover={{ scale: 1.06, y: -1 }}
            className="tag cursor-default"
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const [headRef, headInView] = useInView()

  return (
    <section id="skills" className="relative py-32">
      {/* Background accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(110,231,183,0.03) 0%, transparent 65%)' }} />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <p className="section-label mb-4">Skills</p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white leading-tight">
            Technologies &{' '}
            <span className="gradient-text">tools</span>
          </h2>
        </motion.div>

        {/* Skills grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {skills.map((cat, i) => (
            <SkillCard key={cat.category} category={cat} index={i} />
          ))}
        </div>

        {/* LeetCode banner */}
        <motion.a
          href="https://leetcode.com/u/BandiRithwik/"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 glass glass-hover rounded-2xl p-6 border border-white/6 flex flex-wrap items-center justify-between gap-4 cursor-none group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFA116]/10 border border-[#FFA116]/20 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFA116">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
              </svg>
            </div>
            <div>
              <p className="font-display font-semibold text-white text-sm">Sharpening DSA on LeetCode</p>
              <p className="font-body text-silver-500 text-xs mt-0.5">Daily algorithmic challenges · Problem solving</p>
            </div>
          </div>
          <span className="flex items-center gap-2 text-sm font-body text-silver-400 group-hover:text-accent-DEFAULT transition-colors">
            View Profile
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </motion.a>
      </div>
    </section>
  )
}
