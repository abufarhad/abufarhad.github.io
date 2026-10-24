import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { profile } from '../data/profile'

type Line = { k: string; label: string; value: string; tone?: 'ok' | 'live' }

// Every value here is taken from the CV.
const LINES: Line[] = [
  { k: 'now', label: 'working_on', value: 'backend + ai engineer @ rooya', tone: 'live' },
  { k: 'now', label: 'building', value: 'rooya ai telemetry', tone: 'ok' },
  { k: 'rooya', label: 'db.read_write_split', value: '+60% throughput', tone: 'ok' },
  { k: 'rooya', label: 'go.concurrency', value: '−40% latency', tone: 'ok' },
  { k: 'cafu', label: 'daily_active_users', value: '95k+', tone: 'ok' },
  { k: 'research', label: 'paper', value: 'ieee becithcon 2026', tone: 'ok' },
  { k: 'status', label: 'open_to', value: 'global roles', tone: 'live' },
]

function useClock(tz: string) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now.toLocaleTimeString('en-GB', { timeZone: tz, hour12: false })
}

function useFps() {
  const [fps, setFps] = useState(60)
  useEffect(() => {
    let frames = 0, last = performance.now(), raf = 0
    const loop = (t: number) => {
      frames++
      if (t - last >= 1000) {
        setFps(Math.min(120, Math.round((frames * 1000) / (t - last))))
        frames = 0
        last = t
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
  return fps
}

export function Terminal() {
  const reduce = useReducedMotion()
  const [typed, setTyped] = useState(reduce ? 999 : 0)
  const [shown, setShown] = useState(reduce ? LINES.length : 0)
  const cmd = 'farhad --status --verbose'
  const time = useClock(profile.timezone)
  const fps = useFps()

  useEffect(() => {
    if (reduce) return
    let i = 0
    const startDelay = setTimeout(() => {
      const id = setInterval(() => {
        i++
        setTyped(i)
        if (i >= cmd.length) {
          clearInterval(id)
          let s = 0
          const id2 = setInterval(() => {
            s++
            setShown(s)
            if (s >= LINES.length) clearInterval(id2)
          }, 260)
        }
      }, 42)
    }, 1500)
    return () => clearTimeout(startDelay)
  }, [reduce])

  return (
    <div className="glass relative overflow-hidden rounded-2xl shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.02)_inset]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <span className="font-mono text-[0.68rem] tracking-wider text-dim">~/systems · zsh</span>
        <span className="font-mono text-[0.68rem] text-dim tabular-nums">{time}</span>
      </div>
      <div className="space-y-1.5 p-4 font-mono text-[0.74rem] leading-relaxed sm:p-5 sm:text-[0.78rem]">
        <div className="text-fg">
          <span className="text-cyan">❯</span> {cmd.slice(0, typed)}
          {typed < cmd.length && <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-cyan [animation:blink_1s_steps(1)_infinite]" />}
        </div>
        {LINES.slice(0, shown).map((l) => (
          <motion.div
            key={l.label}
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3"
          >
            {l.tone === 'live' ? (
              <span className="relative grid h-3 w-3 place-items-center">
                <span className="absolute h-2 w-2 rounded-full bg-ok [animation:pulse-ring_1.8s_ease-out_infinite]" />
                <span className="h-1.5 w-1.5 rounded-full bg-ok" />
              </span>
            ) : (
              <span className={l.tone === 'ok' ? 'text-ok' : 'text-dim'}>{l.tone === 'ok' ? '✓' : '·'}</span>
            )}
            <span className="truncate text-muted">
              <span className="text-dim">{l.k}.</span>
              {l.label}
            </span>
            <span className={l.tone === 'live' ? 'text-ok' : 'text-fg'}>{l.value}</span>
          </motion.div>
        ))}
        {shown >= LINES.length && (
          <div className="pt-2 text-dim">
            <span className="text-cyan">❯</span>{' '}
            <span className="inline-block h-3.5 w-1.5 translate-y-0.5 bg-cyan/80 [animation:blink_1s_steps(1)_infinite]" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[0.66rem] text-dim">
        <span>render loop · <span className="text-muted tabular-nums">{fps} fps</span></span>
        <span>backend + ai engineer</span>
      </div>
    </div>
  )
}
