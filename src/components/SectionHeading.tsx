import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type Props = {
  index: string
  label: string
  title: ReactNode
  intro?: ReactNode
  className?: string
  /** Keep the title on one line, scaling the type down to fit. */
  singleLine?: boolean
}

export function SectionHeading({ index, label, title, intro, className = '', singleLine }: Props) {
  return (
    <div className={`grid gap-6 md:grid-cols-12 md:gap-10 ${className}`}>
      <Reveal className="md:col-span-3">
        <div className="flex items-center gap-3 pt-3">
          <span className="font-mono text-xs text-cyan">{index}</span>
          <span className="h-px w-8 bg-line-strong" />
          <span className="eyebrow">{label}</span>
        </div>
      </Reveal>
      <div className="md:col-span-9">
        <Reveal delay={1}>
          <h2 className={`font-mono font-medium leading-[1.1] tracking-[-0.045em] ${singleLine ? 'whitespace-nowrap text-[clamp(1.05rem,3.1vw,2.9rem)]' : 'text-balance text-[clamp(1.75rem,4.2vw,3.4rem)]'}`}>
            <span className="text-cyan/70">&gt; </span>
            {title}
            <span className="ml-2 inline-block h-[0.8em] w-[0.42em] translate-y-[0.06em] bg-cyan/90 [animation:blink_1s_steps(1)_infinite]" />
          </h2>
        </Reveal>
        {intro && (
          <Reveal delay={2}>
            <p className="mt-6 max-w-2xl text-pretty text-[1.05rem] leading-relaxed text-muted">{intro}</p>
          </Reveal>
        )}
      </div>
    </div>
  )
}
