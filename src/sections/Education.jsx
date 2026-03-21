import { motion } from 'framer-motion'
import { useInView } from '../components/useInView'
import { certifications } from '../data'

// ─── Updated education data (replaces data/index.js entries visually) ────────
// We define inline so data/index.js stays untouched per strict rules.
const educationData = [
  {
    period: '2023 — 2027',
    status: 'In Progress',
    institution: 'SR University, Warangal',
    degree: 'Bachelor of Technology (B.Tech)',
    field: 'Computer Science & Engineering',
    location: 'Warangal, Telangana',
    description:
      'Pursuing a Bachelor of Technology in Computer Science & Engineering with a strong academic focus on core computer science principles and their application in real-world software projects. The program emphasizes problem-solving, system-level understanding, and structured software development.',
    subjects: [
      'Data Structures & Algorithms (DSA)',
      'Design and Analysis of Algorithms (DAA)',
      'Database Management Systems (DBMS)',
      'Operating Systems (OS)',
      'Computer Networks',
      'Object-Oriented Programming (Python)',
    ],
    grade: 'CGPA: 8.92',
    tags: [
      'B.Tech Computer Science',
      'Data Structures & Algorithms',
      'Database Management Systems',
      'Operating Systems',
      'Software Engineering Fundamentals',
      'Computer Networks',
    ],
  },
  {
    period: '2021 — 2023',
    status: 'Completed',
    institution: 'SR Intermediate College (MPC)',
    degree: 'Mathematics, Physics & Chemistry',
    field: 'MPC Stream',
    location: 'Hanamkonda, Telangana',
    description:
      'Completed intermediate education with a strong emphasis on mathematics and core sciences, building analytical thinking, quantitative reasoning, and a disciplined academic approach that supported later studies in computer science.',
    subjects: [],
    grade: 'Grade: 92.1%',
    tags: ['Mathematics', 'Physics', 'Chemistry'],
  },
  {
    period: '2020',
    status: 'Completed',
    institution: 'SPR School Of Excellence',
    degree: 'State Board',
    field: 'Secondary Education',
    location: 'Hanamkonda, Telangana',
    description:
      'Built a strong academic foundation across core subjects while developing discipline, consistency, and early interest in technology.',
    subjects: [],
    grade: 'Grade: 10 / 10',
    tags: [],
  },
]

// ─── Location pin icon ────────────────────────────────────────────────────────
const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

// ─── Single timeline entry ────────────────────────────────────────────────────
function TimelineItem({ item, index }) {
  const [ref, inView] = useInView()
  const isActive = item.status === 'In Progress'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className="relative pl-10 pb-12 last:pb-0"
    >
      {/* ── Vertical line ── */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{ background: 'var(--border)', marginLeft: '5px' }}
      />

      {/* ── Node ── */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.15 + index * 0.1, type: 'spring', stiffness: 220, damping: 18 }}
        className="absolute top-1"
        style={{ left: 0 }}
      >
        {/* Outer ring */}
        <div
          className="w-[11px] h-[11px] rounded-full border-2 flex items-center justify-center"
          style={{
            borderColor: 'var(--accent)',
            background: 'var(--bg-primary)',
          }}
        >
          {/* Inner dot — filled only for active */}
          {isActive && (
            <div
              className="w-[5px] h-[5px] rounded-full"
              style={{ background: 'var(--accent)' }}
            />
          )}
        </div>
        {/* Pulse ring — active entry only */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: 'var(--accent)', opacity: 0.25 }}
          />
        )}
      </motion.div>

      {/* ── Card ── */}
      <div
        className="glass rounded-2xl p-6 border transition-colors duration-300"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* Row 1: period + status badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span
            className="font-mono text-xs tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            {item.period}
          </span>

          <span
            className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border"
            style={
              isActive
                ? {
                    color: 'var(--accent)',
                    borderColor: 'var(--accent)',
                    background: 'rgba(110,231,183,0.07)',
                  }
                : {
                    color: 'var(--text-muted)',
                    borderColor: 'var(--border)',
                    background: 'transparent',
                  }
            }
          >
            {isActive && (
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: 'var(--accent)' }}
              />
            )}
            {item.status}
          </span>
        </div>

        {/* Row 2: institution */}
        <h3
          className="font-display font-bold text-xl leading-tight mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {item.institution}
        </h3>

        {/* Row 3: degree */}
        <p
          className="font-body font-medium text-sm mb-0.5"
          style={{ color: 'var(--accent)' }}
        >
          {item.degree}
        </p>

        {/* Row 4: field */}
        <p
          className="font-mono text-xs mb-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          {item.field}
        </p>

        {/* Row 5: location */}
        <div
          className="inline-flex items-center gap-1.5 font-mono text-[11px] mb-4"
          style={{ color: 'var(--text-muted)' }}
        >
          <PinIcon />
          {item.location}
        </div>

        {/* Row 6: description */}
        <p
          className="font-body text-sm leading-relaxed mb-5"
          style={{ color: 'var(--text-secondary)' }}
        >
          {item.description}
        </p>

        {/* Row 7: subjects (bullet list) — only when present */}
        {item.subjects.length > 0 && (
          <div className="mb-5">
            <p
              className="font-mono text-[10px] tracking-widest uppercase mb-2.5"
              style={{ color: 'var(--text-muted)' }}
            >
              Key Subjects
            </p>
            <ul className="space-y-1.5">
              {item.subjects.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2 font-body text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span
                    className="mt-[7px] w-1 h-1 rounded-full shrink-0"
                    style={{ background: 'var(--accent)' }}
                  />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Row 8: tags/chips — only when present */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.tags.map((t) => (
              <span key={t} className="tag text-[10px] px-2 py-1">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Row 9: grade pill */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs"
          style={{
            background: 'rgba(110,231,183,0.06)',
            borderColor: 'rgba(110,231,183,0.18)',
            color: 'var(--accent)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          {item.grade}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────
export default function Education() {
  const [headRef, headInView] = useInView()

  return (
    <section id="education" className="relative py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <p className="section-label mb-4">Education</p>
          <h2
            className="font-display font-bold text-4xl lg:text-5xl leading-tight mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Academic{' '}
            <span className="gradient-text">Foundation</span>
          </h2>
          <p
            className="font-body text-base max-w-xl leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Academic training focused on core computer science fundamentals, reinforced through
            hands-on projects and practical application.
          </p>
        </motion.div>

        {/* Two-column layout: timeline left, certifications right */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Left: Timeline ── */}
          <div>
            {educationData.map((item, i) => (
              <TimelineItem key={item.institution} item={item} index={i} />
            ))}
          </div>

          {/* ── Right: Certifications (unchanged) ── */}
          <div>
            <p className="section-label mb-8">Certifications</p>
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass glass-hover rounded-2xl p-6 border border-white/6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={cert.badge}
                      alt={cert.title + ' badge'}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <h3
                      className="font-display font-bold text-lg"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {cert.title}
                    </h3>
                    <p className="font-body text-sm mt-0.5" style={{ color: 'var(--accent)' }}>
                      {cert.subtitle}
                    </p>
                    <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Issued by {cert.issuer}
                    </p>
                  </div>
                </div>
                <p
                  className="font-body text-sm leading-relaxed mb-4"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {cert.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {cert.skills.map((s) => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>
                <a
                  href={cert.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs py-2 px-4 cursor-none inline-flex items-center gap-1.5"
                >
                  View Certificate
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
