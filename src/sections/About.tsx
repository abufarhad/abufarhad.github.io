import { stats } from '../data/profile'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { CountUp } from '../components/CountUp'
import { SystemMap } from '../components/SystemMap'

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          index="01"
          label="About"
          title={
            <>
              Beyond <span className="text-gradient">writing code</span>
            </>
          }
        />

        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="space-y-4 text-[1.05rem] leading-relaxed text-muted">
              <Reveal as="p">
                <span className="text-fg">I build the backends people never see</span> but rely on every day.
              </Reveal>
              <Reveal as="p" delay={1}>
                Telematics, vehicle services, logistics and health-tech: fast, reliable systems in Go.
              </Reveal>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i} className="bg-ink-2/90 px-5 py-4">
                  <div className="font-mono text-[clamp(1.5rem,2.6vw,2.1rem)] font-medium tracking-tight">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-[0.78rem] leading-snug text-dim">{s.label}</div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={2}>
              <div className="mt-6 border-l border-pink/50 pl-4">
                <div className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-pink">What you’re seeing</div>
                <p className="mt-1.5 text-[0.92rem] leading-relaxed text-muted">
                  A live trace of a system I build: edge AI to cloud. Each stop is a skill, each number is real.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal className="min-w-0 lg:col-span-8" delay={1}>
            <SystemMap />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
