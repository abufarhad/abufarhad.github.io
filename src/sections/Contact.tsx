import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ArrowUpRight, BrainCircuit, Check, Copy, Download, Network, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { navItems, profile } from '../data/profile'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { GithubIcon, LinkedinIcon, MediumIcon } from '../components/icons'

const YEAR = new Date().getFullYear()

const OFFER = [
  { icon: Network, title: 'End-to-end backend', body: 'System design to production, in Go' },
  { icon: ShieldCheck, title: 'Scale & reliability', body: 'Fast, observable, always on' },
  { icon: BrainCircuit, title: 'AI integration', body: 'Models and LLMs in your product', ai: true },
]

const handle = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

function LinkRow({ href, icon, label, detail, download }: { href: string; icon: ReactNode; label: string; detail: string; download?: boolean }) {
  return (
    <a
      href={href}
      {...(download ? { download: true } : { target: '_blank', rel: 'noreferrer' })}
      className="group flex items-center gap-3.5 border-t border-line py-3.5 first:border-t-0"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line-strong bg-white/[0.04] text-fg2 transition-colors group-hover:border-cyan/50 group-hover:text-cyan">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.95rem] font-medium tracking-tight text-fg">{label}</span>
        <span className="block truncate font-mono text-[0.72rem] text-dim">{detail}</span>
      </span>
      <ArrowUpRight size={16} className="text-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan" />
    </a>
  )
}

export function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      // Fallback for browsers without async clipboard permission
      const ta = document.createElement('textarea')
      ta.value = profile.email
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const subject = encodeURIComponent("Let's talk: backend + AI for our team")
  const mailto = `mailto:${profile.email}?subject=${subject}`

  return (
    <section id="contact" className="relative overflow-hidden pt-24 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[25%] h-[70vh] w-[90vw] -translate-x-1/2 rounded-full opacity-40 blur-[140px]"
        style={{ background: 'radial-gradient(closest-side, rgb(91 140 255 / .3), rgb(232 140 255 / .08), transparent)' }}
      />
      <div className="container-x relative">
        <SectionHeading
          index="09"
          label="Contact"
          title={
            <>
              Have an interesting <span className="text-gradient">problem</span> to solve?
            </>
          }
        />

        <Reveal className="mt-12">
          <div className="relative overflow-hidden rounded-[28px] border border-line-strong bg-gradient-to-br from-surface/95 via-surface2/90 to-surfacev/90 shadow-[0_40px_120px_-50px_rgb(155_140_255/0.45)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/70 to-transparent" />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-40 blur-3xl"
              style={{ background: 'radial-gradient(closest-side, rgb(232 140 255 / .3), transparent)' }}
            />

            <div className="relative grid lg:grid-cols-12">
              {/* offer */}
              <div className="p-7 sm:p-10 lg:col-span-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-ok/30 bg-ok/10 px-3 py-1 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ok">
                  <span className="relative grid h-2 w-2 place-items-center">
                    <span className="absolute h-2 w-2 rounded-full bg-ok [animation:pulse-ring_2s_ease-out_infinite]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-ok" />
                  </span>
                  Available for global roles
                </span>

                <h3 className="mt-6 font-mono text-[clamp(1.4rem,2.5vw,2.1rem)] font-medium leading-[1.2] tracking-[-0.04em] text-fg">
                  Your backend, handled.
                  <br />
                  Your <span className="text-gradient">AI, shipped.</span>
                </h3>
                <p className="mt-4 max-w-lg text-[1rem] leading-relaxed text-muted">
                  From system design to production, I’ll build, scale and run your entire backend, and integrate AI where it moves the
                  needle.
                </p>

                <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                  {OFFER.map((o) => {
                    const Icon = o.icon
                    return (
                      <li
                        key={o.title}
                        className={`flex items-center gap-3 rounded-2xl border p-3.5 sm:block sm:p-4 ${o.ai ? 'border-pink/30 bg-pink/[0.06]' : 'border-line bg-white/[0.03]'}`}
                      >
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${
                            o.ai ? 'border-pink/40 bg-pink/10 text-pink' : 'border-cyan/30 bg-cyan/10 text-cyan'
                          }`}
                        >
                          <Icon size={17} strokeWidth={1.6} />
                        </span>
                        <div>
                          <div className="text-[0.95rem] font-medium tracking-tight text-fg sm:mt-3">{o.title}</div>
                          <div className="mt-0.5 text-[0.82rem] leading-snug text-muted">{o.body}</div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* reach me */}
              <div className="border-t border-line bg-surface2/60 p-7 sm:p-10 lg:col-span-5 lg:border-l lg:border-t-0">
                <div className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-dim">Reach me</div>

                <div className="mt-4 flex items-center gap-2 rounded-2xl border border-line-strong bg-white/[0.03] p-1.5 pl-4">
                  <a href={mailto} className="link-underline min-w-0 flex-1 truncate font-mono text-[0.95rem] text-fg">
                    {profile.email}
                  </a>
                  <button
                    type="button"
                    onClick={copy}
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-white/[0.06] px-3 text-[0.8rem] font-medium transition hover:bg-white/[0.1]"
                    aria-label={copied ? 'Email copied' : 'Copy email address'}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {copied ? (
                        <motion.span key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-flex items-center gap-1.5 text-ok">
                          <Check size={14} /> Copied
                        </motion.span>
                      ) : (
                        <motion.span key="copy" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-flex items-center gap-1.5">
                          <Copy size={14} /> Copy
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
                <span className="sr-only" role="status" aria-live="polite">
                  {copied ? 'Email address copied to clipboard' : ''}
                </span>

                <a href={mailto} className="btn btn-primary group mt-4 flex w-full">
                  Let’s connect
                  <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
                </a>

                <div className="mt-6">
                  <LinkRow href={profile.links.linkedin} icon={<LinkedinIcon size={16} />} label="LinkedIn" detail={handle(profile.links.linkedin)} />
                  <LinkRow href={profile.links.github} icon={<GithubIcon size={16} />} label="GitHub" detail={handle(profile.links.github)} />
                  <LinkRow href={profile.links.medium} icon={<MediumIcon size={16} />} label="Medium" detail={handle(profile.links.medium)} />
                  <LinkRow href={profile.resume} icon={<Download size={16} />} label="Resume" detail="PDF download" download />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Footer */}
        <footer className="mt-24 border-t border-line py-10 sm:mt-32">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="text-[1.05rem] font-medium tracking-tight">{profile.name}</div>
              <p className="mt-2 max-w-sm text-[0.9rem] text-muted">Backend + AI Engineer · System Design</p>
            </div>
            <nav aria-label="Footer" className="md:col-span-4">
              <ul className="grid grid-cols-2 gap-y-2 text-[0.9rem] text-muted">
                {navItems.map((n) => (
                  <li key={n.id}>
                    <a href={`#${n.id}`} className="link-underline hover:text-fg">
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-start gap-2 md:col-span-3 md:justify-end">
              <a href={profile.links.github} target="_blank" rel="noreferrer" className="icon-btn" aria-label="GitHub">
                <GithubIcon />
              </a>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="icon-btn" aria-label="LinkedIn">
                <LinkedinIcon />
              </a>
              <a href={profile.links.medium} target="_blank" rel="noreferrer" className="icon-btn" aria-label="Medium">
                <MediumIcon />
              </a>
            </div>
          </div>
          <div className="mt-10 flex flex-col justify-between gap-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-dim sm:flex-row">
            <span>© {YEAR} {profile.name}</span>
            <span>Designed & engineered with care</span>
          </div>
        </footer>
      </div>

    </section>
  )
}
