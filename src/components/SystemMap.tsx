import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { Activity, BrainCircuit, Camera, Cloud, Database, GitBranch, Network, ShieldCheck, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

/**
 * A live trace through the kind of system I build, from edge AI to cloud.
 * It narrates itself stop by stop; every metric comes from the CV.
 */

type Key = 'edge' | 'gateway' | 'svc' | 'kafka' | 'ai' | 'llm' | 'alerts' | 'data' | 'cloud'

const STEPS: { key: Key; icon: LucideIcon; title: string; say: string; metric: string; unit: string }[] = [
  { key: 'edge', icon: Camera, title: 'Edge AI', say: 'Dash cams run AI on-device and stream events.', metric: 'AI', unit: 'on-device' },
  { key: 'gateway', icon: GitBranch, title: 'System design & APIs', say: 'Events enter through REST and gRPC APIs.', metric: 'gRPC', unit: '+ REST' },
  { key: 'svc', icon: Activity, title: 'Concurrency', say: 'Go services process them concurrently.', metric: '−40%', unit: 'latency' },
  { key: 'kafka', icon: Network, title: 'Distributed systems', say: 'Kafka fans events out to every consumer.', metric: '95k+', unit: 'daily users' },
  { key: 'ai', icon: BrainCircuit, title: 'AWS SageMaker', say: 'Driver identification runs async off Kafka.', metric: '~60%', unit: 'faster trip-end' },
  { key: 'llm', icon: Sparkles, title: 'LLM integrations', say: 'LLMs turn raw signals into insight.', metric: 'LLM', unit: 'in Go services' },
  { key: 'alerts', icon: ShieldCheck, title: 'Reliability', say: 'Critical alerts go out in real time.', metric: '−50%', unit: 'incidents' },
  { key: 'data', icon: Database, title: 'Database optimisation', say: 'Writes hit the primary, reads hit replicas.', metric: '+60%', unit: 'DB throughput' },
  { key: 'cloud', icon: Cloud, title: 'Cloud & infrastructure', say: 'All of it on Kubernetes, AWS and Azure.', metric: 'K8s', unit: 'AWS · Azure' },
]
const STEP_MS = 3200
const IDLE_MS = 7000
const AI_KEYS: Key[] = ['edge', 'ai', 'llm']

type Node = { id: string; key: Key; x: number; y: number; label: string; sub: string; w?: number; ai?: boolean }
const NODES: Node[] = [
  { id: 'edge', key: 'edge', x: 62, y: 205, label: 'Edge AI', sub: 'dash cams', w: 96, ai: true },
  { id: 'gateway', key: 'gateway', x: 205, y: 205, label: 'API gateway', sub: 'REST · gRPC' },
  { id: 'svc', key: 'svc', x: 350, y: 205, label: 'Go services', sub: 'goroutines' },
  { id: 'alerts', key: 'alerts', x: 205, y: 318, label: 'Alerts', sub: 'real-time' },
  { id: 'kafka', key: 'kafka', x: 488, y: 110, label: 'Kafka', sub: 'event bus' },
  { id: 'ai', key: 'ai', x: 640, y: 74, label: 'AWS SageMaker', sub: 'driver ID', w: 124, ai: true },
  { id: 'llm', key: 'llm', x: 640, y: 160, label: 'LLM layer', sub: 'integrations', w: 124, ai: true },
  { id: 'primary', key: 'data', x: 488, y: 305, label: 'PostgreSQL', sub: 'primary · writes' },
  { id: 'replica', key: 'data', x: 640, y: 305, label: 'Read replica', sub: 'reads', w: 124 },
]

type Kind = 'event' | 'ai' | 'write' | 'read' | 'repl'
type Edge = { id: string; d: string; from: Key; to: Key; kind: Kind; dur: number }
const EDGES: Edge[] = [
  { id: 'e1', d: 'M62 205 H 205', from: 'edge', to: 'gateway', kind: 'ai', dur: 1.6 },
  { id: 'e2', d: 'M205 205 H 350', from: 'gateway', to: 'svc', kind: 'event', dur: 1.6 },
  { id: 'e3', d: 'M350 205 C 420 205, 420 110, 488 110', from: 'svc', to: 'kafka', kind: 'event', dur: 2 },
  { id: 'e4', d: 'M488 110 C 560 110, 570 74, 640 74', from: 'kafka', to: 'ai', kind: 'ai', dur: 1.8 },
  { id: 'e5', d: 'M640 74 V 160', from: 'ai', to: 'llm', kind: 'ai', dur: 1.4 },
  { id: 'e6', d: 'M350 205 C 350 290, 270 318, 205 318', from: 'svc', to: 'alerts', kind: 'event', dur: 1.8 },
  { id: 'e7', d: 'M350 205 C 420 205, 420 305, 488 305', from: 'svc', to: 'data', kind: 'write', dur: 2.2 },
  { id: 'e8', d: 'M488 305 H 640', from: 'data', to: 'data', kind: 'repl', dur: 2.4 },
  { id: 'e9', d: 'M640 305 C 620 380, 420 380, 350 205', from: 'data', to: 'svc', kind: 'read', dur: 2.6 },
]

const KIND: Record<Kind, { stroke: string; dot: string }> = {
  event: { stroke: 'rgb(91 140 255 / ', dot: 'var(--color-blue)' },
  ai: { stroke: 'rgb(232 140 255 / ', dot: 'var(--color-pink)' },
  write: { stroke: 'rgb(155 140 255 / ', dot: 'var(--color-lav)' },
  read: { stroke: 'rgb(94 231 245 / ', dot: 'var(--color-cyan)' },
  repl: { stroke: 'rgb(155 140 255 / ', dot: 'var(--color-lav)' },
}

export function SystemMap() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-15% 0px' })
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [pausedAt, setPausedAt] = useState(0)

  // auto-advance; a manual pick pauses it, then it resumes on its own
  useEffect(() => {
    if (!inView || reduce) return
    const wait = pausedAt ? IDLE_MS : STEP_MS
    const id = setTimeout(() => {
      setPausedAt(0)
      setI((n) => (n + 1) % STEPS.length)
    }, wait)
    return () => clearTimeout(id)
  }, [i, pausedAt, inView, reduce])

  const pick = (k: Key) => {
    setPausedAt(Date.now())
    setI(STEPS.findIndex((s) => s.key === k))
  }

  const step = STEPS[i]
  const active = step.key
  const Icon = step.icon
  const isAi = AI_KEYS.includes(active)
  const cloudOn = active === 'cloud'
  const edgeOn = (e: Edge) => cloudOn || e.from === active || e.to === active
  const aiZoneOn = active === 'ai' || active === 'llm'

  return (
    <div ref={ref} className="overflow-hidden rounded-3xl border border-line-strong bg-gradient-to-b from-surface/90 to-surface2/90 shadow-[0_40px_120px_-50px_rgb(155_140_255/0.4)]">
      <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[0.68rem]">
        <span className="flex items-center gap-2 text-fg">
          <span className="relative grid h-2.5 w-2.5 place-items-center">
            <span className="absolute h-2.5 w-2.5 rounded-full bg-ok [animation:pulse-ring_1.8s_ease-out_infinite]" />
            <span className="h-1.5 w-1.5 rounded-full bg-ok" />
          </span>
          trace · edge AI → cloud
        </span>
        <span className="hidden items-center gap-3.5 text-dim sm:flex">
          {(['ai', 'event', 'write', 'read'] as const).map((k) => (
            <span key={k} className="flex items-center gap-1.5">
              <i className="h-1.5 w-1.5 rounded-full" style={{ background: KIND[k].dot }} />
              {k === 'event' ? 'events' : k === 'write' ? 'writes' : k === 'read' ? 'reads' : 'ai'}
            </span>
          ))}
        </span>
      </div>

      <div className="overflow-x-auto [scrollbar-width:none]">
        <svg viewBox="0 0 760 400" className="block h-auto w-full min-w-[600px]" role="img" aria-label="Live system trace: edge AI dash cams, API gateway, Go services, Kafka, AWS SageMaker, LLM layer, alerts and PostgreSQL with a read replica">
          <defs>
            <pattern id="sm-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="rgb(148 170 230 / .12)" />
            </pattern>
          </defs>
          <rect width="760" height="400" fill="url(#sm-grid)" />

          {/* cloud boundary */}
          <g role="button" tabIndex={0} aria-label="Cloud & infrastructure" onMouseEnter={() => pick('cloud')} onFocus={() => pick('cloud')} onClick={() => pick('cloud')} style={{ cursor: 'pointer' }}>
            <rect x="130" y="22" width="618" height="360" rx="22" fill={cloudOn ? 'rgb(94 231 245 / .04)' : 'transparent'} stroke={cloudOn ? 'rgb(94 231 245 / .6)' : 'rgb(148 170 230 / .18)'} strokeDasharray="6 7" style={{ transition: 'all .5s' }} />
            <rect x="148" y="12" width="150" height="20" rx="10" fill="var(--color-node)" stroke={cloudOn ? 'rgb(94 231 245 / .6)' : 'rgb(148 170 230 / .2)'} />
            <text x="223" y="26" textAnchor="middle" fontSize="10" fontFamily="Geist Mono, monospace" fill={cloudOn ? 'var(--color-cyan)' : 'var(--color-dim)'}>
              k8s · aws / azure
            </text>
          </g>

          {/* AI layer zone */}
          <rect x="566" y="38" width="148" height="160" rx="16" fill={aiZoneOn ? 'rgb(232 140 255 / .07)' : 'rgb(232 140 255 / .03)'} stroke={`rgb(232 140 255 / ${aiZoneOn ? 0.6 : 0.28})`} strokeDasharray="4 5" style={{ transition: 'all .5s' }} />
          <text x="640" y="32" textAnchor="middle" fontSize="9.5" fontFamily="Geist Mono, monospace" letterSpacing="1.5" fill={aiZoneOn ? 'var(--color-pink)' : 'var(--color-lav)'}>
            AI LAYER
          </text>

          {/* edges + packets */}
          {EDGES.map((e) => {
            const on = edgeOn(e)
            const k = KIND[e.kind]
            return (
              <g key={e.id}>
                <path id={`sm-${e.id}`} d={e.d} fill="none" stroke={`${k.stroke}${on ? 0.8 : 0.22})`} strokeWidth={on ? 1.6 : 1.1} strokeDasharray={e.kind === 'repl' ? '4 5' : undefined} style={{ transition: 'all .5s' }} />
                {!reduce &&
                  [0, 1].map((n) => (
                    <circle key={n} r={on ? 3.4 : 2.2} fill={k.dot} opacity={on ? 1 : 0.5}>
                      <animateMotion dur={`${e.dur}s`} begin={`${n * (e.dur / 2)}s`} repeatCount="indefinite">
                        <mpath href={`#sm-${e.id}`} />
                      </animateMotion>
                    </circle>
                  ))}
              </g>
            )
          })}

          {/* nodes */}
          {NODES.map((n) => {
            const on = active === n.key || cloudOn
            const w = n.w ?? 116
            const accent = n.ai ? 'var(--color-pink)' : 'var(--color-cyan)'
            return (
              <g key={n.id} role="button" tabIndex={0} aria-label={n.label} onMouseEnter={() => pick(n.key)} onFocus={() => pick(n.key)} onClick={() => pick(n.key)} style={{ cursor: 'pointer' }}>
                {active === n.key && (
                  <rect x={n.x - w / 2 - 6} y={n.y - 29} width={w + 12} height={58} rx="16" fill={n.ai ? 'rgb(232 140 255 / .1)' : 'rgb(94 231 245 / .08)'}>
                    <animate attributeName="opacity" values=".4;1;.4" dur="2s" repeatCount="indefinite" />
                  </rect>
                )}
                <rect x={n.x - w / 2} y={n.y - 23} width={w} height={46} rx="12" fill="var(--color-node)" stroke={on ? accent : n.ai ? 'rgb(232 140 255 / .35)' : 'rgb(148 170 230 / .28)'} strokeWidth={on ? 1.4 : 1} style={{ transition: 'stroke .4s' }} />
                <text x={n.x} y={n.y - 2} textAnchor="middle" fontSize="12.5" fontWeight="500" fontFamily="Geist, sans-serif" fill={on ? 'var(--color-fg)' : 'var(--color-fg2)'}>
                  {n.label}
                </text>
                <text x={n.x} y={n.y + 13} textAnchor="middle" fontSize="9.5" fontFamily="Geist Mono, monospace" fill={on ? accent : 'var(--color-dim)'}>
                  {n.sub}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* narration */}
      <div className="relative border-t border-line bg-surface2/80 px-5 py-4 sm:px-6">
        <div className="absolute inset-x-0 top-0 h-px bg-line">
          {!reduce && (
            <motion.div
              key={`${i}-${pausedAt}`}
              className={`h-full ${isAi ? 'bg-pink' : 'bg-cyan'}`}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: (pausedAt ? IDLE_MS : STEP_MS) / 1000, ease: 'linear' }}
            />
          )}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-4"
          >
            <span className="hidden font-mono text-[0.72rem] text-dim sm:block">
              {String(i + 1).padStart(2, '0')}/{String(STEPS.length).padStart(2, '0')}
            </span>
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${isAi ? 'border-pink/40 bg-pink/10 text-pink' : 'border-cyan/40 bg-cyan/10 text-cyan'}`}>
              <Icon size={18} strokeWidth={1.6} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[1rem] font-medium tracking-tight">{step.title}</div>
              <div className="truncate font-mono text-[0.8rem] text-muted">
                <span className="text-cyan">&gt;</span> {step.say}
              </div>
            </div>
            <div className="text-right">
              <div className="text-gradient font-mono text-[1.5rem] font-medium leading-none">{step.metric}</div>
              <div className="mt-1 hidden text-[0.72rem] text-dim sm:block">{step.unit}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
