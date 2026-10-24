import { AnimatePresence, motion } from 'motion/react'
import { Download, Mail, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navItems, profile } from '../data/profile'
import { useActiveSection } from '../lib/useActiveSection'
import { EASE } from '../lib/motion'
import { GithubIcon, LinkedinIcon } from './icons'
import { ThemeToggle } from './ThemeToggle'

const ids = navItems.map((n) => n.id)

export function Nav() {
  const active = useActiveSection(ids)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.6 }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4"
      >
        <nav
          aria-label="Primary"
          className={`flex w-full max-w-[1180px] items-center justify-between rounded-full border px-2 py-2 pl-4 transition-all duration-500 ${
            scrolled ? 'glass border-line shadow-[0_10px_40px_-20px_rgb(0_0_0/0.8)]' : 'border-transparent'
          }`}
        >
          <a href="#top" className="group flex items-center gap-2.5" aria-label={`${profile.name}, home`}>
            <span className="relative grid h-8 w-8 place-items-center rounded-lg border border-line-strong bg-white/[0.03]">
              <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden>
                <defs>
                  <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="var(--color-blue)" />
                    <stop offset=".55" stopColor="var(--color-cyan)" />
                    <stop offset="1" stopColor="var(--color-violet)" />
                  </linearGradient>
                </defs>
                <path d="M14 46V18l12 16 12-16v28" fill="none" stroke="url(#lg)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="48" cy="42" r="4.5" fill="var(--color-cyan)" />
              </svg>
            </span>
            <span className="text-[0.95rem] font-medium tracking-tight">
              {profile.name}
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className={`relative rounded-full px-3.5 py-2 text-[0.86rem] transition-colors ${
                    active === n.id ? 'text-fg' : 'text-muted hover:text-fg'
                  }`}
                  aria-current={active === n.id ? 'true' : undefined}
                >
                  {active === n.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-line-strong bg-white/[0.06]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {n.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href={profile.resume}
              download
              className="hidden h-10 items-center gap-2 rounded-full border border-line-strong bg-white/[0.04] px-4 text-[0.84rem] font-medium transition hover:border-cyan/50 hover:bg-cyan/[0.07] sm:inline-flex"
            >
              <Download size={15} /> Resume
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="icon-btn lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[70] flex flex-col bg-ink/90 px-6 pb-8 pt-5 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="eyebrow">Menu</span>
              <button type="button" onClick={() => setOpen(false)} className="icon-btn" aria-label="Close menu" autoFocus>
                <X size={18} />
              </button>
            </div>
            <ul className="mt-12 flex flex-col gap-1">
              {navItems.map((n, i) => (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.05 + i * 0.05 }}
                >
                  <a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-line py-4 text-4xl font-medium tracking-tight"
                  >
                    <span className="font-mono text-xs text-cyan">0{i + 1}</span>
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex items-center gap-2">
              <a href={profile.resume} download className="btn btn-primary flex-1">
                <Download size={16} /> Download Resume
              </a>
              <a href={profile.links.github} target="_blank" rel="noreferrer" className="icon-btn shrink-0" aria-label="GitHub">
                <GithubIcon />
              </a>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="icon-btn shrink-0" aria-label="LinkedIn">
                <LinkedinIcon />
              </a>
              <a href={`mailto:${profile.email}`} className="icon-btn shrink-0" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
