import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../components/useInView'
import { personal } from '../data'

const socials = [
  {
    label: 'GitHub',
    href: personal.github,
    handle: '@RithwikBandi',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: personal.linkedin,
    handle: 'rithwik-bandi',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: personal.twitter,
    handle: '@RickyBandi56',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
      </svg>
    ),
  },
  {
    label: 'LeetCode',
    href: personal.leetcode,
    handle: 'BandiRithwik',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
      </svg>
    ),
  },
]

// Apple-style field component — clean focus ring, visible in both themes
function Field({ id, label, type = 'text', placeholder, value, onChange, as: As = 'input', rows }) {
  const [focused, setFocused] = useState(false)

  const sharedProps = {
    id,
    placeholder,
    value,
    onChange,
    required: true,
    onFocus: () => setFocused(true),
    onBlur:  () => setFocused(false),
    className: 'contact-field',
    style: { cursor: 'none' },
  }

  return (
    <div>
      <label htmlFor={id} className="contact-field-label">{label}</label>
      <div className={`contact-field-wrap${focused ? ' focused' : ''}`}>
        {As === 'textarea'
          ? <textarea {...sharedProps} rows={rows} />
          : <input    {...sharedProps} type={type} />
        }
      </div>
    </div>
  )
}

export default function Contact() {
  const [headRef, headInView] = useInView()
  const [formRef, formInView] = useInView()
  const [status, setStatus]   = useState('idle')
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const set = (key) => (e) => setFormData(p => ({ ...p, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ access_key: '736068e1-f99f-4397-a46c-0a47569c4222', ...formData }),
      })
      const data = await res.json()
      if (data.success) { setStatus('success'); setFormData({ name: '', email: '', message: '' }) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  return (
    <section id="contact" className="relative py-32">
      {/* Ambient glow */}
      <div className="absolute right-0 bottom-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(110,231,183,0.04) 0%, transparent 65%)' }} />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="section-label mb-4">Contact</p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white leading-tight mb-4">
            Let's build something <span className="gradient-text">great</span>
          </h2>
          <p className="text-silver-400 font-body max-w-xl mx-auto">
            Open to internships, entry-level roles, and remote opportunities. Reach out — I reply fast.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* ── Left: contact info ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            {/* Email cards — neutral icon, no accent background */}
            {[personal.email, personal.email2].map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="glass glass-hover rounded-2xl p-5 border border-white/6 flex items-center gap-4 group cursor-none block"
              >
                {/* ✅ FIXED: neutral icon container — not accent-coloured in light mode */}
                <div className="contact-email-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <p className="font-mono text-xs text-silver-500 mb-0.5">Email</p>
                  <p className="font-body text-white text-sm group-hover:text-accent-DEFAULT transition-colors break-all">
                    {email}
                  </p>
                </div>
              </a>
            ))}

            {/* Social links card */}
            <div className="glass rounded-2xl p-5 border border-white/6">
              <p className="font-mono text-xs text-silver-500 mb-4 uppercase tracking-wider">Find me on</p>
              <div className="grid grid-cols-2 gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 cursor-none group/s"
                  >
                    <div className="contact-social-icon group-hover/s:contact-social-icon-hover">
                      {s.icon}
                    </div>
                    <div>
                      <p className="font-body text-xs font-semibold text-white leading-none mb-0.5 group-hover/s:text-accent-DEFAULT transition-colors">{s.label}</p>
                      <p className="font-mono text-[10px] text-silver-600">{s.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Right: form ──────────────────────────────────────────── */}
          <motion.form
            ref={formRef}
            initial={{ opacity: 0, x: 24 }}
            animate={formInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-8 border border-white/6 space-y-5"
          >
            <Field id="name"    label="Name"    placeholder="Your name"              value={formData.name}    onChange={set('name')} />
            <Field id="email"   label="Email"   placeholder="you@example.com" type="email" value={formData.email}   onChange={set('email')} />
            <Field id="message" label="Message" placeholder="Tell me about your project or opportunity…"
              as="textarea" rows={5} value={formData.message} onChange={set('message')} />

            <motion.button
              type="submit"
              disabled={status === 'sending'}
              className="btn-primary w-full justify-center py-3.5 disabled:opacity-60"
              whileHover={status !== 'sending' ? { scale: 1.01 } : {}}
              whileTap={status !== 'sending'   ? { scale: 0.98 } : {}}
            >
              <AnimatePresence mode="wait" initial={false}>
                {status === 'sending' ? (
                  <motion.span
                    key="sending"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                      style={{ display: 'inline-block', lineHeight: 1 }}
                    >⟳</motion.span>
                    Sending…
                  </motion.span>
                ) : (
                  <motion.span
                    key="send"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    Send Message
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-center text-sm font-body text-accent-DEFAULT"
                >
                  ✓ Message sent — I'll get back to you soon!
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-center text-sm font-body text-red-400"
                >
                  Something went wrong. Email me directly instead.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
