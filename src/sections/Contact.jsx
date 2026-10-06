import { useEffect, useState } from 'react'
import Arrow from '../components/Arrow.jsx'
import { ExtLink } from '../components/TLink.jsx'
import { site } from '../data/site.js'
import cursors from '../data/cursors.json'

// While the form is sending, the pointer becomes the animated busy bat (frames come from the cursor pack).
function useBusyCursor(active) {
  useEffect(() => {
    if (!active) return
    const { frames, ms } = cursors.busy
    const root = document.documentElement
    let i = 0
    const apply = () => {
      const [x, y] = frames[i]
      root.style.setProperty('--busy-cursor', `-webkit-image-set(url('/cursors/busy-${i}.png') 1x, url('/cursors/busy-${i}@2x.png') 2x) ${x} ${y}, progress`)
      i = (i + 1) % frames.length
    }
    root.classList.add('is-busy')
    apply()
    const id = setInterval(apply, Math.max(ms, 80))
    return () => { clearInterval(id); root.classList.remove('is-busy'); root.style.removeProperty('--busy-cursor') }
  }, [active])
}

// Web3Forms access keys are public by design (they only authorise sending to my inbox).
const ACCESS_KEY = '736068e1-f99f-4397-a46c-0a47569c4222'

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [copied, setCopied] = useState(false)
  useBusyCursor(status === 'sending')

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable: the mailto link still works */ }
  }

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    if (data.botcheck) return // honeypot
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: 'New message from rithwikbandi.tech',
          from_name: 'Portfolio',
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setStatus('sent')
        form.reset()
      } else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">06 / Contact</p>
          <h2 id="contact-title">Let’s work together</h2>
        </header>

        <div className="contact__mailrow" data-reveal>
          <a className="contact__mail" href={`mailto:${site.email}`}>{site.email}</a>
          <button type="button" className="btn btn--sm" onClick={copyEmail}>
            {copied ? 'Copied' : 'Copy'}
          </button>
          <span className="sr-only" aria-live="polite">{copied ? 'Email address copied' : ''}</span>
        </div>

        <div className="contact__grid">
          <div className="contact__side" data-reveal>
            <p>
              I’m open to roles and freelance work: a product to build, or the marketing and sales around one. Tell me what you’re making and who it’s for. You can also write to{' '}
              <a className="ulink" href={`mailto:${site.emailAlt}`}>{site.emailAlt}</a>.
            </p>
            <ul className="contact__links">
              {site.links.map((l) => (
                <li key={l.label}>
                  <ExtLink href={l.href} className="ext">
                    <span>{l.label}</span>
                    <span className="mono">{l.handle}</span>
                    <Arrow dir="ne" />
                  </ExtLink>
                </li>
              ))}
            </ul>
          </div>

          <form className="form" onSubmit={onSubmit} data-reveal>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" autoComplete="name" required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={4} required />
            </div>
            <input type="checkbox" name="botcheck" className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="form__actions">
              <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message'} <Arrow />
              </button>
              <p className={`form__msg mono form__msg--${status}`} role="status" aria-live="polite">
                {status === 'sent' && 'Sent. I will reply soon.'}
                {status === 'error' && `Something went wrong. Email ${site.email} instead.`}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
