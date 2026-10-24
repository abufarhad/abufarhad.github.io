import { motion } from 'motion/react'
import { ArrowDown, ArrowRight, Download } from 'lucide-react'
import { hero, profile } from '../data/profile'
import { EASE } from '../lib/motion'
import { GithubIcon, LinkedinIcon, MediumIcon } from '../components/icons'
import { Magnetic } from '../components/Magnetic'
import { Terminal } from '../components/Terminal'
import { Decrypt } from '../components/Decrypt'

const BASE = 0.9 // wait for the intro veil
const ms = (s: number) => Math.round((BASE + s) * 1000)

const fade = (d: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay: BASE + d },
})

const Cursor = () => <span className="ml-1 inline-block h-[0.85em] w-[0.45em] translate-y-[0.08em] bg-cyan [animation:blink_1s_steps(1)_infinite]" />

export function Hero() {
  const [l1, l2] = hero.headline

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col pt-[4.5rem] sm:pt-[5.25rem]">
      <div className="container-x grid flex-1 content-start items-start gap-10 pt-[clamp(1rem,4.5vh,3rem)] pb-[clamp(0.5rem,3vh,2rem)] lg:grid-cols-12 lg:gap-12">
        <div className="relative lg:col-span-7">
          {/* soft scrim so the animated terrain never competes with the text */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -inset-y-10 -z-10 lg:-inset-x-16"
            style={{ background: 'radial-gradient(60% 55% at 35% 50%, var(--scrim-strong), var(--scrim-soft) 60%, transparent 80%)' }}
          />
          {/* status row */}
          <motion.div {...fade(0)} className="flex flex-wrap items-center gap-2">
            <span className="glass inline-flex items-center gap-2 rounded-full py-1 pl-2 pr-3">
              <span className="relative grid h-2.5 w-2.5 place-items-center">
                <span className="absolute h-2 w-2 rounded-full bg-ok [animation:pulse-ring_2s_ease-out_infinite]" />
                <span className="h-1.5 w-1.5 rounded-full bg-ok" />
              </span>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-fg2">
                <span className="xl:hidden">Open to international roles</span>
                <span className="hidden xl:inline">{profile.availability}</span>
              </span>
            </span>
            <a
              href="#research"
              className="group inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] py-1 pl-1 pr-3 text-[0.72rem] text-fg2 transition hover:border-cyan/50"
            >
              <span className="rounded-full bg-cyan px-1.5 py-px font-mono text-[0.56rem] font-medium uppercase text-ink">New</span>
              Paper accepted · IEEE BECITHCON 2026
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          {/* headline */}
          <h1 className="mt-[clamp(1.25rem,5vh,3rem)] font-mono text-[clamp(1.7rem,min(4.2vw,7.6vh),3.7rem)] font-medium leading-[1.06] tracking-[-0.045em] [&>span]:whitespace-nowrap">
            <span className="block text-fg">
              <span className="text-cyan/80">&gt; </span>
              <Decrypt text={l1} delay={ms(0.2)} />
            </span>
            <span className="block">
              <span className="invisible">&gt; </span>
              <Decrypt text={l2} delay={ms(0.7)} className="text-gradient" />
              <Cursor />
            </span>
          </h1>

          {/* summary */}
          <motion.p {...fade(0.5)} className="mt-[clamp(0.9rem,3vh,1.75rem)] max-w-[34rem] text-pretty text-[1rem] leading-relaxed text-muted sm:text-[1.08rem]">
            {hero.summary}
          </motion.p>

          {/* overview facts */}
          <motion.dl {...fade(0.6)} className="mt-[clamp(0.75rem,4.5vh,2.75rem)] grid max-w-[38rem] grid-cols-2 gap-x-5 sm:gap-x-8 gap-y-[clamp(0.6rem,2.6vh,1.5rem)]">
            {hero.facts.map((f) => {
              const hi = 'highlight' in f && f.highlight
              return (
                <div key={f.k} className={`min-w-0 border-l pl-4 ${hi ? 'col-span-2 border-violet/60' : 'border-line-strong'}`}>
                  <dt className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-dim">{f.k}</dt>
                  {hi ? (
                    <dd className="mt-1 text-[clamp(1.05rem,1.6vw,1.4rem)] font-semibold tracking-[-0.02em] text-white">
                      <span className="mr-2.5 inline-block h-2 w-2 -translate-y-0.5 rounded-full bg-ok shadow-[0_0_8px_rgb(74_222_155/0.9)]" />
                      {f.v.split(' · ')[0]} <span className="mx-1 font-normal text-dim">·</span>
                      <span className="whitespace-nowrap bg-gradient-to-r from-cyan to-blue bg-clip-text text-transparent">{f.v.split(' · ')[1]}</span>
                    </dd>
                  ) : (
                    <dd className="mt-1 text-[0.86rem] leading-snug text-fg2 sm:text-[0.98rem]">{f.v}</dd>
                  )}
                </div>
              )
            })}
          </motion.dl>

          {/* actions */}
          <motion.div {...fade(0.7)} className="mt-[clamp(0.9rem,5.5vh,3.25rem)] flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href="#work" className="btn btn-primary group !h-11">
                Explore My Work
                <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={profile.resume} download className="btn btn-ghost !h-11">
                <Download size={15} /> Resume
              </a>
            </Magnetic>
            <div className="flex items-center gap-2">
              <a href={profile.links.github} target="_blank" rel="noreferrer" className="icon-btn !h-11 !w-11" aria-label="GitHub profile">
                <GithubIcon size={17} />
              </a>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="icon-btn !h-11 !w-11" aria-label="LinkedIn profile">
                <LinkedinIcon size={17} />
              </a>
              <a href={profile.links.medium} target="_blank" rel="noreferrer" className="icon-btn !h-11 !w-11" aria-label="Medium articles">
                <MediumIcon size={17} />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: BASE + 0.5 }}
          className="hidden lg:col-span-5 lg:mt-[clamp(3.5rem,12vh,7.5rem)] lg:block"
        >
          <Terminal />
        </motion.div>
      </div>

      <motion.div {...fade(0.9)} className="container-x pb-4 [@media(max-height:720px)]:hidden">
        <div className="hairline mb-4" />
        <div className="flex items-center justify-between gap-6 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-dim">
          <a href="#now" className="hidden transition hover:text-fg sm:inline">
            Now · Backend + AI Engineer @ Rooya
          </a>
          <a href="#about" className="group flex items-center gap-2.5 text-muted transition hover:text-fg" aria-label="Scroll to About">
            <span className="relative flex h-7 w-[18px] justify-center rounded-full border border-line-strong pt-1.5">
              <span className="h-1.5 w-0.5 rounded-full bg-cyan [animation:scroll-dot_1.8s_ease-in-out_infinite]" />
            </span>
            Scroll
            <ArrowDown size={11} className="transition group-hover:translate-y-0.5" />
          </a>
          <span className="hidden sm:inline">{profile.yearsOfExperience} yrs · Go · Distributed Systems</span>
        </div>
      </motion.div>
    </section>
  )
}
