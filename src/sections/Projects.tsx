import { ArrowUpRight, Lock } from 'lucide-react'
import type { ComponentType } from 'react'
import { projects } from '../data/profile'
import type { Project } from '../data/profile'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { GithubIcon } from '../components/icons'
import { DashcamVisual, EventBusVisual, LayersVisual, ModulesVisual, PipelineVisual, TuiVisual } from '../components/ProjectVisuals'
import { useSpotlight } from '../lib/useSpotlight'

const VISUALS: Record<Project['id'], ComponentType> = {
  rooya: DashcamVisual,
  rtvp: PipelineVisual,
  carservice: EventBusVisual,
  gomail: TuiVisual,
  gostarter: LayersVisual,
  wellteam: ModulesVisual,
}

// Asymmetric bento layout.
const LAYOUT: Record<Project['id'], string> = {
  rooya: 'lg:col-span-12',
  rtvp: 'lg:col-span-7',
  carservice: 'lg:col-span-5',
  gomail: 'lg:col-span-5',
  gostarter: 'lg:col-span-7',
  wellteam: 'lg:col-span-12',
}

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const onMove = useSpotlight<HTMLElement>()
  const Visual = VISUALS[p.id]
  const wide = p.id === 'wellteam' || p.id === 'rooya'
  const current = p.id === 'rooya'

  return (
    <Reveal delay={i % 2} className={LAYOUT[p.id]}>
      <article
        onPointerMove={onMove}
        className={`spot group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-surface/85 to-surface2/80 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 ${
          wide ? 'lg:grid lg:grid-cols-12' : ''
        }`}
      >
        <div
          className={`relative overflow-hidden border-b border-line bg-[radial-gradient(80%_100%_at_50%_0%,rgb(91_140_255/0.12),transparent_70%)] ${
            wide ? `h-56 sm:h-64 lg:h-auto lg:border-b-0 lg:border-r ${current ? 'lg:col-span-6' : 'lg:col-span-5'}` : 'h-56 sm:h-64'
          }`}
        >
          <div
            className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgb(148_170_230/0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(148_170_230/0.07)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]"
            aria-hidden
          />
          <div className="relative h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
            <Visual />
          </div>
          <span className="absolute left-4 top-4 font-mono text-[0.66rem] text-dim">/{String(i + 1).padStart(2, '0')}</span>
          {current && (
            <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-ok/30 bg-ok/10 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ok">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" /> Live · current role
            </span>
          )}
        </div>

        <div className={`flex flex-1 flex-col p-6 sm:p-8 ${wide ? (current ? 'lg:col-span-6' : 'lg:col-span-7') : ''}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="eyebrow !text-[0.66rem]">{p.kind}</span>
            <span className="font-mono text-[0.68rem] text-dim">
              {p.period}{p.location && ` · ${p.location}`}
            </span>
          </div>
          <h3 className="mt-4 text-[clamp(1.5rem,2.6vw,2rem)] font-medium leading-tight tracking-[-0.03em]">{p.title}</h3>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">{p.description}</p>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5">
            {p.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-[0.9rem] text-fg2">
                <span className="h-1 w-1 shrink-0 rounded-full bg-cyan" />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-7">
            <div className="flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
            {p.repo ? (
              <a
                href={p.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[0.84rem] font-medium transition hover:border-cyan/50 hover:bg-cyan/[0.07]"
              >
                <GithubIcon size={15} /> View source <ArrowUpRight size={14} />
              </a>
            ) : p.site ? (
              <a
                href={p.site}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[0.84rem] font-medium transition hover:border-cyan/50 hover:bg-cyan/[0.07]"
              >
                {current ? 'Explore the platform' : 'Visit product'} <ArrowUpRight size={14} />
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] text-dim">
                <Lock size={12} /> Private client work · case study
              </span>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  )
}

export function Projects() {
  return (
    <section id="work" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeading
          index="04"
          label="Selected work"
          title={
            <>
              Built for <span className="text-gradient">scale</span>
            </>
          }
        />
        <div className="mt-16 grid gap-5 lg:grid-cols-12">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
