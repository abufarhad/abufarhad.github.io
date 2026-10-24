import { useInView, useReducedMotion } from 'motion/react'
import { BrainCircuit, Cloud, Code2, Database, Workflow } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { languages, skillGroups } from '../data/profile'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { useSpotlight } from '../lib/useSpotlight'

type Group = (typeof skillGroups)[number]
type GroupId = Group['id']

const ICONS: Record<GroupId, LucideIcon> = {
  backend: Code2,
  distributed: Workflow,
  data: Database,
  infra: Cloud,
  ai: BrainCircuit,
}

// ── Constellation (decorative + synced with the cards; no item labels → nothing can overlap) ──
const S = 600
const C = S / 2

function Constellation({ active, onSelect }: { active: GroupId; onSelect: (id: GroupId) => void }) {
  const layout = useMemo(
    () =>
      skillGroups.map((g, gi) => {
        const a = ((-90 + gi * (360 / skillGroups.length)) * Math.PI) / 180
        const ux = Math.cos(a)
        const uy = Math.sin(a)
        const hx = C + ux * 150
        const hy = C + uy * 150
        const n: number = g.items.length
        const items = g.items.map((label, i) => {
          const t = n === 1 ? 0 : i / (n - 1) - 0.5
          const ia = a + t * 1.7
          const r = i % 2 ? 108 : 72
          return { label, x: hx + Math.cos(ia) * r, y: hy + Math.sin(ia) * r }
        })
        // label sits on the inner side of the hub (toward the core), where no items are drawn
        return { ...g, hx, hy, lx: C + ux * 96, ly: C + uy * 96 + 5, items }
      }),
    [],
  )

  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="h-auto w-full" role="img" aria-label="Technology constellation centred on Go">
      <defs>
        <radialGradient id="core-g">
          <stop offset="0" stopColor="var(--color-cyan)" stopOpacity=".45" />
          <stop offset="1" stopColor="var(--color-cyan)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r="270" fill="none" stroke="rgb(148 170 230 / .08)" strokeDasharray="2 8" />
      <circle cx={C} cy={C} r="150" fill="none" stroke="rgb(148 170 230 / .07)" />

      {layout.map((g) => {
        const on = g.id === active
        return (
          <g key={g.id} style={{ cursor: 'pointer' }} onMouseEnter={() => onSelect(g.id)} onClick={() => onSelect(g.id)}>
            <line
              x1={C} y1={C} x2={g.hx} y2={g.hy}
              strokeDasharray={on ? '4 6' : undefined}
              style={{ stroke: on ? 'rgb(94 231 245 / .6)' : 'rgb(148 170 230 / .14)', transition: 'stroke .6s' }}
            >
              {on && <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="1.2s" repeatCount="indefinite" />}
            </line>
            {g.items.map((it) => (
              <line
                key={it.label}
                x1={g.hx} y1={g.hy} x2={it.x} y2={it.y}
                style={{ stroke: on ? 'rgb(91 140 255 / .5)' : 'rgb(148 170 230 / .08)', transition: 'stroke .6s' }}
              />
            ))}
            {g.items.map((it, i) => (
              <g key={it.label + 'n'}>
                {on && <circle cx={it.x} cy={it.y} r="11" fill="rgb(94 231 245 / .12)" />}
                <circle
                  cx={it.x} cy={it.y} r={on ? 5 : 3}
                  style={{ fill: on ? 'var(--color-cyan)' : 'rgb(148 170 230 / .4)', transition: `all .5s ${on ? i * 0.03 : 0}s` }}
                >
                  <title>{it.label}</title>
                </circle>
              </g>
            ))}
            <circle
              cx={g.hx} cy={g.hy} r={on ? 15 : 11}
              style={{
                fill: on ? (g.id === 'ai' ? 'rgb(232 140 255 / .25)' : 'rgb(91 140 255 / .25)') : g.id === 'ai' ? 'rgb(232 140 255 / .08)' : 'rgb(255 255 255 / .04)',
                stroke: on ? (g.id === 'ai' ? 'var(--color-pink)' : 'var(--color-cyan)') : g.id === 'ai' ? 'rgb(232 140 255 / .55)' : 'rgb(148 170 230 / .3)',
                transition: 'all .5s',
              }}
            />
            <text
              x={g.lx} y={g.ly} textAnchor="middle" fontSize="15" fontWeight="500" fontFamily="Geist, sans-serif"
              style={{ fill: on ? 'var(--color-fg)' : g.id === 'ai' ? 'var(--color-lav)' : 'var(--color-dim)', transition: 'fill .5s' }}
            >
              {g.short}
            </text>
          </g>
        )
      })}

      <circle cx={C} cy={C} r="62" fill="url(#core-g)">
        <animate attributeName="r" values="54;70;54" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx={C} cy={C} r="32" fill="var(--color-surface2)" stroke="var(--color-cyan)" strokeOpacity=".7" />
      <text x={C} y={C + 7} textAnchor="middle" fontSize="20" fontWeight="600" fontFamily="Geist, sans-serif" fill="var(--color-fg)">
        Go
      </text>
    </svg>
  )
}

function GroupCard({ g, i, on, onSelect, featured, highlight, current }: { g: Group; i: number; on: boolean; onSelect: () => void; featured?: boolean; highlight?: boolean; current?: boolean }) {
  const onMove = useSpotlight<HTMLDivElement>()
  const Icon = ICONS[g.id]
  return (
    <Reveal delay={i % 2} className={featured ? 'sm:col-span-2' : ''}>
      <div
        onPointerMove={onMove}
        onMouseEnter={onSelect}
        onFocus={onSelect}
        tabIndex={0}
        className={`spot h-full rounded-3xl border p-6 transition-[border-color,background-color,box-shadow] duration-500 sm:p-7 ${
          highlight
            ? 'border-violet/40 bg-gradient-to-br from-surfacev/90 via-surfacev/85 to-surface2/85 shadow-[0_30px_90px_-40px_rgb(155_140_255/0.55)]'
            : on
            ? 'border-cyan/40 bg-gradient-to-b from-surface/90 to-surface2/85 shadow-[0_20px_60px_-30px_rgb(94_231_245/0.45)]'
            : 'border-line bg-gradient-to-b from-surface/85 to-surface2/80'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <span
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition-colors duration-500 ${
              on ? 'border-cyan/50 bg-cyan/10 text-cyan' : 'border-line-strong bg-white/[0.04] text-fg2'
            }`}
          >
            <Icon size={19} strokeWidth={1.6} />
          </span>
          {highlight || current ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-ok/30 bg-ok/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ok">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" /> Working on now
            </span>
          ) : (
            <span className="font-mono text-[0.7rem] text-dim">
              0{i + 1} · {g.items.length} skills
            </span>
          )}
        </div>
        <h3 className={`mt-5 font-medium tracking-[-0.025em] ${featured ? 'text-[clamp(1.5rem,2.6vw,2rem)]' : 'text-[1.3rem]'}`}>{g.label}</h3>
        <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{g.blurb}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {g.items.map((s) => (
            <li key={s} className={`chip !text-[0.76rem] transition-colors duration-500 ${on ? '!border-cyan/25 !text-fg' : ''}`}>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

export function Expertise() {
  const [active, setActive] = useState<GroupId>('backend')
  const [auto, setAuto] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-20% 0px' })
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!auto || !inView || reduce) return
    const id = setInterval(() => {
      setActive((cur) => {
        const i = skillGroups.findIndex((g) => g.id === cur)
        return skillGroups[(i + 1) % skillGroups.length].id
      })
    }, 3200)
    return () => clearInterval(id)
  }, [auto, inView, reduce])

  const select = (id: GroupId) => {
    setAuto(false)
    setActive(id)
  }

  return (
    <section id="expertise" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeading
          index="05"
          label="Expertise"
          title={
            <>
              Core <span className="text-gradient">expertise</span>
            </>
          }
          intro="What I’ve shipped to production. No skill bars."
        />

        <div ref={ref} className="mt-16 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {skillGroups
              .filter((g) => g.id !== 'ai')
              .flatMap((g, i) => {
                const card = <GroupCard key={g.id} g={g} i={i === 0 ? 0 : i + 1} featured={i === 0} current={i === 0} on={g.id === active} onSelect={() => select(g.id)} />
                if (i !== 0) return [card]
                const ai = skillGroups.find((x) => x.id === 'ai')!
                return [card, <GroupCard key={ai.id} g={ai} i={1} featured highlight on={ai.id === active} onSelect={() => select(ai.id)} />]
              })}
            <Reveal delay={1}>
              <div className="flex h-full flex-col gap-4 rounded-3xl border border-line bg-node/75 p-6 sm:p-7">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-cyan">Languages</span>
                <p className="text-[0.92rem] leading-relaxed text-muted">Go first, and fluent across the stack.</p>
                <ul className="flex flex-wrap gap-2">
                  {languages.map((l) => (
                    <li key={l} className="chip !text-[0.8rem] !text-fg">
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <Reveal delay={1}>
                <Constellation active={active} onSelect={select} />
                <p className="mt-2 text-center font-mono text-[0.68rem] uppercase tracking-[0.18em] text-dim">
                  Hover a card to explore the constellation
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
