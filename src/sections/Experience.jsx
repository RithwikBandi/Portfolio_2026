import { motion } from 'framer-motion'
import { useInView } from '../components/useInView'
import { experience } from '../data'

function TimelineItem({ item, index }) {
  const [ref, inView] = useInView()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className="relative pl-10 pb-14 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-white/6" />

      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: 0.2 + index * 0.1, type: 'spring', stiffness: 200 }}
        className="absolute left-0 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-accent-DEFAULT bg-obsidian-950"
      />

      {/* Card */}
      <div className="glass glass-hover rounded-2xl p-7 border border-white/6 group">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="section-label text-[10px]">{item.type}</span>
              {item.status === 'active' && (
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-accent-DEFAULT">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-DEFAULT opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-DEFAULT" />
                  </span>
                  Active
                </span>
              )}
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-1">{item.role}</h3>
            <p className="font-body text-accent-DEFAULT text-sm font-medium">{item.project}</p>
          </div>
          <span className="font-mono text-xs text-silver-500 shrink-0 mt-1">{item.period}</span>
        </div>

        <p className="text-silver-400 font-body text-sm leading-relaxed mb-5">{item.description}</p>

        <ul className="space-y-2 mb-6">
          {item.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-silver-400 font-body">
              <span className="text-accent-DEFAULT mt-1 shrink-0">›</span>
              {h}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          {item.tech.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Experience() {
  const [headRef, headInView] = useInView()

  return (
    <section id="experience" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <p className="section-label mb-4">Experience</p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white leading-tight">
            Where I've Built &{' '}
            <span className="gradient-text">Learned</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl">
          {experience.map((item, i) => (
            <TimelineItem key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
