import { motion } from 'framer-motion'
import { personal } from '../data'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

const socialLinks = [
  { label: 'GitHub', href: personal.github },
  { label: 'LinkedIn', href: personal.linkedin },
  { label: 'LeetCode', href: personal.leetcode },
  { label: 'Twitter', href: personal.twitter },
  { label: 'Medium', href: personal.medium },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="font-display font-bold text-2xl tracking-tight cursor-none inline-block mb-4"
            >
              RB<span className="text-accent-DEFAULT">.</span>
            </a>
            <p className="font-body text-sm text-silver-500 leading-relaxed max-w-[240px]">
              {personal.title} · Building systems that scale and products that matter.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="font-mono text-xs text-silver-600 uppercase tracking-widest mb-5">Navigation</p>
            <div className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <button
                  key={l.href}
                  onClick={() => {
                    const el = document.getElementById(l.href.replace('#', ''))
                    el?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-left text-sm font-body text-silver-500 hover:text-white transition-colors cursor-none"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="font-mono text-xs text-silver-600 uppercase tracking-widest mb-5">Connect</p>
            <div className="flex flex-col gap-3">
              {socialLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-body text-silver-500 hover:text-white transition-colors cursor-none"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs text-silver-600">
            © {year} Rithwik Bandi. All rights reserved.
          </p>
          <p className="font-mono text-xs text-silver-600">
            Designed & Built by{' '}
            <span className="text-accent-DEFAULT">Rithwik Bandi</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
