import { BrainCircuit, Eye, Feather, Gauge, Layers, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { principles } from '../data/profile'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { useSpotlight } from '../lib/useSpotlight'

const ICONS: Record<(typeof principles)[number]['icon'], LucideIcon> = {
  feather: Feather,
  gauge: Gauge,
  shield: ShieldCheck,
  eye: Eye,
  brain: BrainCircuit,
  layers: Layers,
}

function Principle({ p, i }: { p: (typeof principles)[number]; i: number }) {
  const onMove = useSpotlight<HTMLDivElement>()
  const Icon = ICONS[p.icon]
  return (
    <Reveal delay={i % 3}>
      <div
        onPointerMove={onMove}
        className={`spot group h-full rounded-2xl border p-6 transition-[border-color,transform] duration-500 hover:-translate-y-1 sm:p-7 ${
          p.ai ? 'border-pink/30 bg-gradient-to-br from-surfacev/90 to-surface2/85' : 'border-line bg-gradient-to-b from-surface/85 to-surface2/80 hover:border-line-strong'
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`grid h-11 w-11 place-items-center rounded-xl border transition-colors duration-500 ${
              p.ai ? 'border-pink/40 bg-pink/10 text-pink' : 'border-line-strong bg-white/[0.04] text-cyan group-hover:border-cyan/50'
            }`}
          >
            <Icon size={19} strokeWidth={1.6} />
          </span>
          <span className="font-mono text-[0.72rem] text-dim">0{i + 1}</span>
        </div>
        <h3 className="mt-6 text-[1.25rem] font-medium tracking-[-0.02em] text-fg">{p.title}</h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{p.body}</p>
      </div>
    </Reveal>
  )
}

export function Principles() {
  return (
    <section id="principles" className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] top-1/2 h-[60vh] w-[60vw] -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
        style={{ background: 'radial-gradient(closest-side, rgb(155 140 255 / .35), transparent)' }}
      />
      <div className="container-x relative">
        <SectionHeading
          index="06"
          label="Principles"
          title={
            <>
              How I <span className="text-gradient">engineer</span>
            </>
          }
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => (
            <Principle key={p.title} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
