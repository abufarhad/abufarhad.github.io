import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Cpu, Radio, Sparkles, Workflow } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { now } from '../data/profile'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { useSpotlight } from '../lib/useSpotlight'

const ROUTES = [
  'M20 210 C 90 200, 110 120, 190 120 S 300 60, 380 40',
  'M10 70 C 80 90, 140 170, 230 170 S 340 210, 400 190',
  'M60 250 C 120 230, 170 240, 220 200 S 280 100, 330 90',
]

const SEVERITY: Record<string, string> = {
  speeding: '#f5b85e',
  'harsh braking': '#f58b5e',
  distraction: 'var(--color-violet)',
  'phone use': 'var(--color-violet)',
  'no seat belt': '#f5b85e',
  fatigue: '#f56b8b',
}

/** Illustrative live view of the kind of data the platform handles, not real fleet data. */
function TelemetryVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-10% 0px' })
  const reduce = useReducedMotion()
  const [feed, setFeed] = useState(() =>
    now.events.slice(0, 4).map((e, i) => ({ id: i, event: e, vehicle: `VH-${String(104 + i * 37).padStart(4, '0')}` })),
  )

  useEffect(() => {
    if (!inView || reduce) return
    let n = 4
    const id = setInterval(() => {
      n++
      const event = now.events[n % now.events.length]
      setFeed((f) => [{ id: n, event, vehicle: `VH-${String((n * 53) % 9000).padStart(4, '0')}` }, ...f].slice(0, 4))
    }, 1900)
    return () => clearInterval(id)
  }, [inView, reduce])

  return (
    <div ref={ref} className="relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-2xl border border-line bg-surface2/90">
      <div className="flex items-center justify-between border-b border-line px-4 py-3 font-mono text-[0.68rem]">
        <span className="flex items-center gap-2 text-fg">
          <span className="relative grid h-2.5 w-2.5 place-items-center">
            <span className="absolute h-2.5 w-2.5 rounded-full bg-ok [animation:pulse-ring_1.8s_ease-out_infinite]" />
            <span className="h-1.5 w-1.5 rounded-full bg-ok" />
          </span>
          LIVE TELEMETRY
        </span>
        <span className="text-dim">illustrative</span>
      </div>

      <div className="relative flex-1">
        <svg viewBox="0 0 410 270" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
          <defs>
            <pattern id="tl-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M24 0H0V24" fill="none" stroke="rgb(148 170 230 / .07)" />
            </pattern>
            <linearGradient id="tl-route" x1="0" x2="1">
              <stop offset="0" stopColor="var(--color-blue)" stopOpacity=".2" />
              <stop offset="1" stopColor="var(--color-cyan)" stopOpacity=".7" />
            </linearGradient>
          </defs>
          <rect width="410" height="270" fill="url(#tl-grid)" />
          {/* geofence */}
          <circle cx="230" cy="170" r="46" fill="rgb(94 231 245 / .04)" stroke="rgb(94 231 245 / .45)" strokeDasharray="4 5" />
          <text x="230" y="114" textAnchor="middle" fill="var(--color-cyan)" fontSize="8.5" fontFamily="Geist Mono, monospace" opacity=".8">
            GEOFENCE · DEPOT
          </text>
          {ROUTES.map((d, i) => (
            <g key={i}>
              <path id={`tl-r${i}`} d={d} fill="none" stroke="url(#tl-route)" strokeWidth="1.4" />
              <path d={d} fill="none" stroke="var(--color-cyan)" strokeOpacity=".5" strokeWidth="1.4" strokeDasharray="2 14" className="animate-[dash_5s_linear_infinite]" />
              <g>
                <circle r="9" fill="rgb(94 231 245 / .15)">
                  <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle r="3.6" fill="var(--color-fg)" stroke="var(--color-cyan)" strokeWidth="1.5" />
                <animateMotion dur={`${9 + i * 3}s`} repeatCount="indefinite" rotate="auto">
                  <mpath href={`#tl-r${i}`} />
                </animateMotion>
              </g>
            </g>
          ))}
          {/* event pings */}
          {[
            [150, 128, '#f5b85e', 0],
            [300, 196, 'var(--color-violet)', 1.3],
            [270, 96, '#f56b8b', 2.4],
          ].map(([x, y, c, d], i) => (
            <circle key={i} cx={x as number} cy={y as number} r="4" fill="none" stroke={c as string}>
              <animate attributeName="r" values="3;16" dur="3s" begin={`${d}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0" dur="3s" begin={`${d}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>

        <div className="absolute left-3 top-3 rounded-lg border border-line bg-ink/80 px-3 py-2 font-mono text-[0.64rem] text-muted backdrop-blur">
          <div className="text-dim">on-device AI</div>
          <div className="text-fg">events → cloud</div>
          <div className="mt-1 text-lav">→ backend + AI engineer</div>
        </div>
      </div>

      <div className="border-t border-line bg-ink/60 p-3">
        <div className="mb-2 flex justify-between px-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-dim">
          <span>Event stream</span>
          <span>AI · dash cam</span>
        </div>
        <ul className="relative flex h-[142px] flex-col gap-1.5 overflow-hidden" aria-hidden>
          <AnimatePresence initial={false} mode="popLayout">
            {feed.map((f) => (
              <motion.li
                key={f.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4 }}
                className="flex shrink-0 items-center gap-3 rounded-md border border-line bg-white/[0.03] px-2.5 py-1.5 font-mono text-[0.68rem]"
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: SEVERITY[f.event] ?? 'var(--color-cyan)' }} />
                <span className="text-fg">{f.event}</span>
                <span className="ml-auto text-dim">{f.vehicle}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  )
}

export function Now() {
  const onMove = useSpotlight<HTMLDivElement>()

  return (
    <section id="now" className="relative py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full opacity-35 blur-[140px]"
        style={{ background: 'radial-gradient(closest-side, rgb(94 231 245 / .25), rgb(91 140 255 / .12), transparent)' }}
      />
      <div className="container-x relative">
        <SectionHeading
          index="02"
          label="Now"
          singleLine
          title={
            <>
              Backend + AI Engineer <span className="text-gradient">@ Rooya</span>
            </>
          }
        />

        <Reveal className="mt-12">
          <div
            onPointerMove={onMove}
            className="spot relative overflow-hidden rounded-[28px] border border-line-strong bg-gradient-to-b from-surface/90 to-surface2/85 p-3 shadow-[0_40px_120px_-40px_rgb(94_231_245/0.25)]"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/70 to-transparent" />
            <div className="grid gap-3 lg:grid-cols-12">
              <div className="flex flex-col p-5 sm:p-7 lg:col-span-7">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-ok/30 bg-ok/10 px-3 py-1 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ok">
                    <Radio size={12} /> Currently
                  </span>
                  <span className="font-mono text-[0.72rem] text-muted">
                    {now.role} · {now.location} · since {now.since}
                  </span>
                </div>

                <h3 className="mt-5 text-[clamp(1.5rem,2.6vw,2.1rem)] font-medium leading-[1.1] tracking-[-0.03em]">{now.productName}</h3>
                <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted">{now.description}</p>

                <ul className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                  {now.aiWork.map((w, i) => {
                    const Icon = [Cpu, Sparkles, Workflow][i]
                    return (
                      <li key={w.title} className="rounded-xl border border-violet/30 bg-violet/[0.07] p-2.5 sm:p-3.5">
                        <Icon size={15} strokeWidth={1.7} className="text-lav" />
                        <div className="mt-2 text-[0.78rem] font-medium leading-tight tracking-tight sm:text-[0.9rem]">{w.title}</div>
                        <div className="mt-1 hidden text-[0.8rem] text-fg2 sm:block">{w.body}</div>
                      </li>
                    )
                  })}
                </ul>

                <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
                  {now.impact.map((m) => (
                    <div key={m.label} className="bg-node px-4 py-3">
                      <div className="text-gradient font-mono text-[1.35rem] font-medium leading-none">{m.metric}</div>
                      <div className="mt-1.5 text-[0.76rem] text-muted">{m.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={now.platformUrl} target="_blank" rel="noreferrer" className="btn btn-primary !h-10 !text-[0.86rem]">
                    Explore the platform <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>

              <div className="hidden lg:col-span-5 lg:block">
                <TelemetryVisual />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
