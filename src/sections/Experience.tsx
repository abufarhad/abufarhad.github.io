import { motion, useScroll, useSpring } from 'motion/react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { useRef } from 'react'
import { experience } from '../data/profile'
import type { Role } from '../data/profile'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { useSpotlight } from '../lib/useSpotlight'

function RoleCard({ r, i }: { r: Role; i: number }) {
  const onMove = useSpotlight<HTMLDivElement>()
  return (
    <article className="relative grid gap-6 pl-10 md:grid-cols-12 md:gap-10 md:pl-0">
      {/* node on the rail */}
      <span className="absolute left-[3px] top-2 md:left-[calc(25%-6px)] md:top-3" aria-hidden>
        <span className="relative grid h-3 w-3 place-items-center">
          <span className="absolute h-3 w-3 rounded-full bg-cyan/30 blur-[3px]" />
          <span className="h-2 w-2 rounded-full border border-cyan bg-ink" />
        </span>
      </span>

      <Reveal className="md:col-span-3 md:pr-10 md:text-right">
        <div className="md:sticky md:top-28">
          <div className="font-mono text-xs text-cyan">{r.period}</div>
          <div
            className="mt-2 hidden select-none text-[4.2rem] font-semibold leading-none tracking-[-0.06em] text-transparent md:block"
            style={{ WebkitTextStroke: '1px rgb(148 170 230 / 0.22)' }}
            aria-hidden
          >
            {r.start}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[0.8rem] text-dim md:justify-end">
            <MapPin size={12} /> {r.location}
          </div>
        </div>
      </Reveal>

      <div className="md:col-span-9 md:pl-6">
        <Reveal delay={1}>
          <div
            onPointerMove={onMove}
            className="spot group rounded-3xl border border-line bg-gradient-to-b from-surface/85 to-surface2/80 p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-[clamp(1.6rem,3vw,2.3rem)] font-medium leading-tight tracking-[-0.03em]">
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-cyan">
                      {r.company}
                      <ArrowUpRight size={20} className="text-dim transition group-hover:text-cyan" />
                    </a>
                  ) : (
                    r.company
                  )}
                </h3>
                <p className="mt-1 text-[0.98rem] text-fg2">{r.role}</p>
              </div>
              <span className="font-mono text-[0.68rem] text-dim">0{i + 1} / 0{experience.length}</span>
            </div>

            <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-muted">{r.summary}</p>

            <ul className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {r.highlights.map((h) => (
                <li key={h.text} className="flex flex-col gap-1.5 border-t border-line pt-4 sm:flex-row sm:gap-4">
                  {h.metric ? (
                    <span className="text-gradient min-w-[4.2rem] font-mono text-[1.15rem] font-medium leading-tight">{h.metric}</span>
                  ) : (
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
                  )}
                  <span className="text-[0.92rem] leading-relaxed text-fg2">{h.text.charAt(0).toUpperCase() + h.text.slice(1)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-2">
              {r.stack.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </article>
  )
}

export function Experience() {
  const rail = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: rail, offset: ['start 70%', 'end 60%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <section id="experience" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeading
          index="03"
          label="Experience"
          title={
            <>
              Systems <span className="text-gradient">in production</span>
            </>
          }
        />

        <div ref={rail} className="relative mt-20 space-y-14 sm:space-y-20">
          <div className="absolute bottom-0 left-[8px] top-0 w-px bg-line md:left-[25%]" aria-hidden>
            <motion.div style={{ scaleY }} className="h-full w-full origin-top bg-gradient-to-b from-cyan via-blue to-violet" />
          </div>
          {experience.map((r, i) => (
            <RoleCard key={r.company} r={r} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
