import { ArrowUpRight, BookOpen, FileText, GraduationCap, Medal, Trophy } from 'lucide-react'
import { achievements, education, profile, publications, research } from '../data/profile'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { MediumIcon } from '../components/icons'
import { useSpotlight } from '../lib/useSpotlight'

function ScanVisual() {
  // Abstract MRI slice with a segmentation contour, purely illustrative.
  return (
    <svg viewBox="0 0 220 220" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="scan-g" cx="50%" cy="45%">
          <stop offset="0" stopColor="var(--color-muted)" stopOpacity=".28" />
          <stop offset=".7" stopColor="var(--color-blue)" stopOpacity=".08" />
          <stop offset="1" stopColor="var(--color-blue)" stopOpacity="0" />
        </radialGradient>
        <clipPath id="scan-c">
          <ellipse cx="110" cy="110" rx="78" ry="92" />
        </clipPath>
      </defs>
      <ellipse cx="110" cy="110" rx="78" ry="92" fill="url(#scan-g)" stroke="rgb(148 170 230 / .3)" />
      <path d="M110 22 C 104 60, 116 90, 110 110 C 104 140, 116 170, 110 200" stroke="rgb(148 170 230 / .2)" fill="none" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M ${50 + i * 4} ${70 + i * 18} q 30 ${-10 + i * 3} 60 0 q 30 ${10 - i * 3} 60 0`} stroke="rgb(148 170 230 / .12)" fill="none" />
      ))}
      <path
        d="M128 76 C 146 70, 160 84, 156 100 C 153 114, 140 120, 128 116 C 116 112, 112 96, 116 86 C 118 80, 122 78, 128 76 Z"
        fill="rgb(94 231 245 / .14)"
        stroke="var(--color-cyan)"
        strokeWidth="1.4"
        strokeDasharray="3 3"
        className="animate-[dash_8s_linear_infinite]"
      />
      <g clipPath="url(#scan-c)">
        <rect x="20" y="0" width="180" height="2" fill="var(--color-cyan)" opacity=".5">
          <animate attributeName="y" values="18;202;18" dur="5s" repeatCount="indefinite" />
        </rect>
      </g>
      <text x="162" y="70" fill="var(--color-cyan)" fontSize="8" fontFamily="Geist Mono, monospace">ROI</text>
    </svg>
  )
}

export function Research() {
  const onMove = useSpotlight<HTMLDivElement>()
  return (
    <section id="research" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeading
          index="07"
          label="Research & achievements"
          title={
            <>
              Research <span className="text-gradient">& competition</span>
            </>
          }
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-12">
          {/* Publications */}
          {publications.map((pub) => (
            <Reveal key={pub.title} className="lg:col-span-12">
              <article className="relative overflow-hidden rounded-3xl border border-cyan/25 bg-gradient-to-br from-surface/90 via-surface2/85 to-surfacev/85 p-6 sm:p-10">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/70 to-transparent" />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-40 blur-3xl"
                  style={{ background: 'radial-gradient(closest-side, rgb(94 231 245 / .35), transparent)' }}
                />
                <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end">
                  <div className="lg:col-span-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-cyan">
                        <FileText size={12} /> Publication
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-ok/30 bg-ok/10 px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ok">
                        ● {pub.status}
                      </span>
                    </div>
                    <h3 className="mt-6 text-balance text-[clamp(1.5rem,3vw,2.4rem)] font-medium leading-[1.12] tracking-[-0.03em]">
                      {pub.title}
                    </h3>
                    <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-muted">{pub.summary}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {pub.tags.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 lg:col-span-4 lg:items-end lg:text-right">
                    <div>
                      <div className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-dim">Venue</div>
                      <div className="mt-1 text-[1.4rem] font-medium tracking-tight">{pub.venue}</div>
                      <div className="font-mono text-[0.75rem] text-muted">{profile.name} · {pub.year}</div>
                    </div>
                    {pub.url && (
                      <a href={pub.url} target="_blank" rel="noreferrer" className="btn btn-ghost !h-11">
                        Read paper <ArrowUpRight size={15} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}

          {/* Research */}
          <Reveal className="lg:col-span-7">
            <div onPointerMove={onMove} className="spot flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-surface/85 to-surface2/80">
              <div className="grid gap-6 p-6 sm:grid-cols-[1fr_190px] sm:p-8">
                <div>
                  <div className="flex items-center gap-2 text-cyan">
                    <BookOpen size={15} />
                    <span className="eyebrow !text-cyan">{research.role}</span>
                  </div>
                  <h3 className="mt-5 text-balance text-[clamp(1.35rem,2.3vw,1.8rem)] font-medium leading-snug tracking-[-0.025em]">
                    {research.title}
                  </h3>
                  <p className="mt-3 text-[0.92rem] text-muted">
                    {research.org} · <span className="font-mono text-[0.8rem] text-dim">{research.period}</span>
                  </p>
                </div>
                <div className="mx-auto h-44 w-44 sm:h-auto sm:w-full">
                  <ScanVisual />
                </div>
              </div>
              <div className="mt-auto grid grid-cols-2 border-t border-line sm:grid-cols-3">
                {research.metrics.map((m) => (
                  <div key={m.label} className="border-r border-line p-6 sm:p-8">
                    <div className="text-gradient font-mono text-[clamp(1.8rem,3.2vw,2.6rem)] font-medium leading-none">{m.value}</div>
                    <div className="mt-2 text-[0.82rem] text-dim">{m.label}</div>
                  </div>
                ))}
                <div className="col-span-2 border-t border-line p-6 sm:col-span-1 sm:border-t-0 sm:p-8">
                  <div className="text-gradient font-mono text-[clamp(1.8rem,3.2vw,2.6rem)] font-medium leading-none">89%</div>
                  <div className="mt-2 text-[0.82rem] text-dim">Vertebrae detection accuracy · two-stage CNN at MyMedicalHUB</div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Achievements */}
          <Reveal className="lg:col-span-5" delay={1}>
            <div className="flex h-full flex-col rounded-3xl border border-line bg-gradient-to-b from-surface/85 to-surface2/80 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-cyan">
                <Trophy size={15} />
                <span className="eyebrow !text-cyan">Competitive programming & hackathons</span>
              </div>
              <ul className="mt-6 flex-1">
                {achievements.map((a) => {
                  const inner = (
                    <>
                      <span className="w-[4.5rem] shrink-0 font-mono text-[0.72rem] text-dim">{a.date}</span>
                      <span className="flex-1">
                        <span className="block text-[1.02rem] font-medium tracking-tight text-fg">{a.title}</span>
                        <span className="block text-[0.86rem] text-muted">
                          {a.event} · {a.place}
                        </span>
                      </span>
                      {a.href ? <ArrowUpRight size={16} className="text-dim transition group-hover:text-cyan" /> : <Medal size={16} className="text-dim" />}
                    </>
                  )
                  return (
                    <li key={a.event} className="border-t border-line first:border-t-0">
                      {a.href ? (
                        <a href={a.href} target="_blank" rel="noreferrer" className="group flex items-start gap-4 py-4 transition hover:translate-x-1">
                          {inner}
                        </a>
                      ) : (
                        <div className="flex items-start gap-4 py-4">{inner}</div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </Reveal>

          {/* Education */}
          <Reveal className="lg:col-span-7">
            <a
              href={education.url}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col justify-between gap-6 rounded-3xl border border-line bg-node/75 p-6 transition hover:border-line-strong hover:bg-white/[0.03] sm:flex-row sm:items-center sm:p-8"
            >
              <div className="flex items-center gap-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line-strong text-cyan">
                  <GraduationCap size={20} strokeWidth={1.6} />
                </span>
                <div>
                  <div className="text-[1.1rem] font-medium tracking-tight">{education.degree}</div>
                  <div className="text-[0.9rem] text-muted">{education.school}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 font-mono text-[0.75rem] text-dim">
                {education.period}
                <ArrowUpRight size={16} className="transition group-hover:text-cyan" />
              </div>
            </a>
          </Reveal>

          {/* Writing */}
          <Reveal className="lg:col-span-5" delay={1}>
            <a
              href="#blog"
              className="group flex h-full items-center justify-between gap-6 rounded-3xl border border-line bg-node/75 p-6 transition hover:border-line-strong hover:bg-white/[0.03] sm:p-8"
            >
              <div className="flex items-center gap-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line-strong">
                  <MediumIcon size={20} />
                </span>
                <div>
                  <div className="text-[1.1rem] font-medium tracking-tight">Writing on Medium</div>
                  <div className="text-[0.9rem] text-muted">Notes on engineering & backend systems</div>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-dim transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
