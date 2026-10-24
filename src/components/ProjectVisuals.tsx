/* Hand-built, lightweight SVG/HTML previews, one distinct visual language per project. */

const flow = 'animate-[dash_6s_linear_infinite]'

export function PipelineVisual() {
  const sources = ['events', 'shipments', 'telemetry']
  return (
    <svg viewBox="0 0 560 260" className="h-full w-full" role="img" aria-label="Data pipeline: sources flow through ETL into a lake and live dashboards">
      <defs>
        <linearGradient id="pv-a" x1="0" x2="1">
          <stop offset="0" stopColor="var(--color-blue)" />
          <stop offset="1" stopColor="var(--color-cyan)" />
        </linearGradient>
        <linearGradient id="pv-bar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="var(--color-blue)" stopOpacity=".2" />
          <stop offset="1" stopColor="var(--color-cyan)" />
        </linearGradient>
      </defs>
      {sources.map((s, i) => {
        const y = 60 + i * 70
        return (
          <g key={s}>
            <rect x="20" y={y - 16} width="104" height="32" rx="8" fill="rgb(255 255 255 / .03)" stroke="rgb(148 170 230 / .2)" />
            <circle cx="36" cy={y} r="3" fill="var(--color-cyan)" />
            <text x="46" y={y + 4} fill="var(--color-muted)" fontSize="11" fontFamily="Geist Mono, monospace">{s}</text>
            <path d={`M124 ${y} C 170 ${y}, 170 130, 214 130`} fill="none" stroke="url(#pv-a)" strokeOpacity=".5" strokeDasharray="4 6" className={flow} />
          </g>
        )
      })}
      <rect x="214" y="96" width="120" height="68" rx="12" fill="rgb(91 140 255 / .08)" stroke="rgb(94 231 245 / .45)" />
      <text x="274" y="124" textAnchor="middle" fill="var(--color-fg)" fontSize="12" fontWeight="500" fontFamily="Geist, sans-serif">Databricks ETL</text>
      <text x="274" y="143" textAnchor="middle" fill="var(--color-dim)" fontSize="10" fontFamily="Geist Mono, monospace">clean · transform</text>
      <path d="M334 130 H 380" stroke="url(#pv-a)" strokeDasharray="4 6" className={flow} />
      <g>
        <ellipse cx="404" cy="108" rx="24" ry="7" fill="none" stroke="rgb(155 140 255 / .6)" />
        <path d="M380 108 V 152 A 24 7 0 0 0 428 152 V 108" fill="rgb(155 140 255 / .06)" stroke="rgb(155 140 255 / .6)" />
        <text x="404" y="175" textAnchor="middle" fill="var(--color-dim)" fontSize="10" fontFamily="Geist Mono, monospace">lake</text>
      </g>
      <path d="M428 130 H 452" stroke="url(#pv-a)" strokeDasharray="4 6" className={flow} />
      <rect x="452" y="70" width="92" height="120" rx="10" fill="rgb(255 255 255 / .03)" stroke="rgb(148 170 230 / .2)" />
      {[38, 62, 48, 80, 56, 92].map((h, i) => (
        <rect key={i} x={464 + i * 13} y={176 - h} width="8" height={h} rx="2" fill="url(#pv-bar)">
          <animate attributeName="height" values={`${h};${h * 0.6};${h}`} dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="y" values={`${176 - h};${176 - h * 0.6};${176 - h}`} dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
        </rect>
      ))}
      <text x="498" y="88" textAnchor="middle" fill="var(--color-muted)" fontSize="9.5" fontFamily="Geist Mono, monospace">live insights</text>
    </svg>
  )
}

export function EventBusVisual() {
  const services = [
    { label: 'car wash', a: -150 },
    { label: 'oil change', a: -90 },
    { label: 'battery', a: -30 },
    { label: 'tyres', a: 30 },
    { label: 'PostgreSQL', a: 90 },
    { label: 'S3 · SNS', a: 150 },
  ]
  const cx = 230
  const cy = 130
  return (
    <svg viewBox="0 0 460 260" className="h-full w-full" role="img" aria-label="Event-driven microservices around a central event bus">
      <circle cx={cx} cy={cy} r="96" fill="none" stroke="rgb(148 170 230 / .1)" strokeDasharray="2 6" />
      <circle cx={cx} cy={cy} r="60" fill="none" stroke="rgb(148 170 230 / .08)" />
      {services.map((s, i) => {
        const r = (s.a * Math.PI) / 180
        const x = cx + Math.cos(r) * 150
        const y = cy + Math.sin(r) * 92
        return (
          <g key={s.label}>
            <path id={`eb-${i}`} d={`M${cx} ${cy} L${x} ${y}`} stroke="rgb(94 231 245 / .25)" />
            <circle r="2.6" fill="var(--color-cyan)">
              <animateMotion dur={`${2.4 + i * 0.35}s`} repeatCount="indefinite" keyPoints={i % 2 ? '0;1' : '1;0'} keyTimes="0;1" calcMode="linear">
                <mpath href={`#eb-${i}`} />
              </animateMotion>
            </circle>
            <rect x={x - 46} y={y - 14} width="92" height="28" rx="14" fill="var(--color-node)" stroke="rgb(148 170 230 / .22)" />
            <text x={x} y={y + 4} textAnchor="middle" fill="var(--color-fg2)" fontSize="10.5" fontFamily="Geist Mono, monospace">{s.label}</text>
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r="34" fill="var(--color-node)" />
      <circle cx={cx} cy={cy} r="34" fill="rgb(91 140 255 / .12)" stroke="rgb(94 231 245 / .55)" />
      <circle cx={cx} cy={cy} r="34" fill="none" stroke="var(--color-cyan)" strokeOpacity=".5">
        <animate attributeName="r" values="34;54" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values=".5;0" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <text x={cx} y={cy - 2} textAnchor="middle" fill="var(--color-fg)" fontSize="11" fontWeight="500" fontFamily="Geist, sans-serif">Go services</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--color-dim)" fontSize="9" fontFamily="Geist Mono, monospace">event-driven</text>
    </svg>
  )
}

export function TuiVisual() {
  const rows = [
    { f: 'GitHub', s: 'Your pull request was merged', d: '09:41', u: true },
    { f: 'Kubernetes', s: 'Weekly cluster digest', d: '08:12', u: true },
    { f: 'Go Weekly', s: 'Generics, iterators & more', d: 'Mon' },
    { f: 'Medium', s: 'Your story has new readers', d: 'Sun' },
  ]
  return (
    <div className="flex h-full w-full items-center justify-center p-6" aria-hidden>
      <div className="w-full max-w-[420px] overflow-hidden rounded-lg border border-line-strong bg-surface2 font-mono text-[10.5px] leading-[1.7] shadow-2xl">
        <div className="flex justify-between bg-blue/15 px-3 py-1 text-fg2">
          <span>gomail · INBOX</span>
          <span className="text-cyan">IMAP ● connected</span>
        </div>
        <div className="px-1 py-1">
          {rows.map((r, i) => (
            <div key={r.f} className={`grid grid-cols-[14px_80px_1fr_36px] gap-2 rounded px-2 ${i === 0 ? 'bg-cyan/10 text-fg' : 'text-muted'}`}>
              <span className="text-cyan">{r.u ? '●' : ' '}</span>
              <span className="truncate">{r.f}</span>
              <span className="truncate">{r.s}</span>
              <span className="text-right text-dim">{r.d}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 border-t border-line px-3 py-1 text-dim">
          <span><b className="text-fg">j/k</b> move</span>
          <span><b className="text-fg">↵</b> open</span>
          <span><b className="text-fg">c</b> compose</span>
          <span className="ml-auto"><span className="inline-block h-2.5 w-1.5 translate-y-0.5 bg-cyan [animation:blink_1s_steps(1)_infinite]" /></span>
        </div>
      </div>
    </div>
  )
}

export function LayersVisual() {
  const rings = [
    { r: 112, label: 'frameworks & drivers', c: 'rgb(155 140 255 / .35)' },
    { r: 84, label: 'interface adapters', c: 'rgb(91 140 255 / .45)' },
    { r: 56, label: 'use cases', c: 'rgb(94 231 245 / .5)' },
  ]
  return (
    <svg viewBox="0 0 460 260" className="h-full w-full" role="img" aria-label="Clean architecture rings: entities, use cases, adapters, frameworks">
      <defs>
        {rings.map((r, i) => (
          <path key={i} id={`ring-${i}`} d={`M ${230 - r.r} 130 A ${r.r} ${r.r} 0 1 1 ${230 + r.r} 130 A ${r.r} ${r.r} 0 1 1 ${230 - r.r} 130`} />
        ))}
      </defs>
      {rings.map((r, i) => (
        <g key={r.label}>
          <circle cx="230" cy="130" r={r.r} fill="rgb(255 255 255 / .012)" stroke={r.c} />
          <g style={{ transformOrigin: '230px 130px', animation: `spin ${60 + i * 20}s linear infinite ${i % 2 ? 'reverse' : ''}` }}>
            <text fill="var(--color-muted)" fontSize="10" fontFamily="Geist Mono, monospace" letterSpacing="2">
              <textPath href={`#ring-${i}`} startOffset="4%">{r.label.toUpperCase()}</textPath>
            </text>
          </g>
        </g>
      ))}
      <circle cx="230" cy="130" r="30" fill="rgb(94 231 245 / .1)" stroke="var(--color-cyan)" strokeOpacity=".7" />
      <text x="230" y="134" textAnchor="middle" fill="var(--color-fg)" fontSize="11" fontWeight="500" fontFamily="Geist, sans-serif">entities</text>
      <path d="M352 30 L 340 30 L 254 116" fill="none" stroke="rgb(148 170 230 / .25)" strokeDasharray="3 4" />
      <text x="356" y="33" fill="var(--color-dim)" fontSize="9.5" fontFamily="Geist Mono, monospace">deps point inward</text>
    </svg>
  )
}

export function ModulesVisual() {
  const mods = ['nutrition plans', 'fitness coaching', 'online programs']
  return (
    <div className="grid h-full w-full grid-cols-3 content-center gap-2.5 p-6" aria-hidden>
      {mods.map((m, i) => (
        <div
          key={m}
          className="rounded-xl border border-line bg-white/[0.025] px-3 py-3 font-mono text-[10.5px] text-muted"
          style={{ animation: `float-y ${5 + i}s ease-in-out ${i * 0.4}s infinite` }}
        >
          <span className="mb-2 block h-1 w-6 rounded-full bg-gradient-to-r from-blue to-cyan" />
          {m}
        </div>
      ))}
      <div className="col-span-3 mt-1 flex items-center justify-between rounded-xl border border-violet/30 bg-violet/[0.06] px-3 py-2.5 font-mono text-[10.5px] text-lav">
        <span>MySQL</span>
        <span className="text-dim">go microservices</span>
      </div>
    </div>
  )
}

export function DashcamVisual() {
  return (
    <svg viewBox="0 0 600 260" className="h-full w-full" role="img" aria-label="AI dash cam events streaming into Go services, PostgreSQL and real-time alerts">
      <defs>
        <linearGradient id="dc-a" x1="0" x2="1">
          <stop offset="0" stopColor="var(--color-blue)" />
          <stop offset="1" stopColor="var(--color-cyan)" />
        </linearGradient>
        <clipPath id="dc-clip">
          <rect x="24" y="40" width="230" height="160" rx="12" />
        </clipPath>
      </defs>
      {/* camera frame */}
      <rect x="24" y="40" width="230" height="160" rx="12" fill="var(--color-surface2)" stroke="rgb(148 170 230 / .25)" />
      <g clipPath="url(#dc-clip)">
        <path d="M24 150 L 139 108 L 254 150" fill="none" stroke="rgb(148 170 230 / .15)" />
        <path d="M60 200 L 132 110 M218 200 L 146 110" stroke="rgb(148 170 230 / .3)" />
        <path d="M139 200 L 139 112" stroke="rgb(148 170 230 / .35)" strokeDasharray="8 10" className="animate-[dash_2s_linear_infinite]" />
        <rect x="112" y="122" width="44" height="30" rx="3" fill="rgb(94 231 245 / .08)" stroke="var(--color-cyan)" strokeWidth="1.3">
          <animate attributeName="opacity" values="1;.55;1" dur="2.4s" repeatCount="indefinite" />
        </rect>
        <text x="112" y="117" fill="var(--color-cyan)" fontSize="9" fontFamily="Geist Mono, monospace">vehicle</text>
        <rect x="24" y="40" width="230" height="2" fill="var(--color-cyan)" opacity=".35">
          <animate attributeName="y" values="40;198;40" dur="4s" repeatCount="indefinite" />
        </rect>
      </g>
      <circle cx="44" cy="58" r="4" fill="#f56b8b">
        <animate attributeName="opacity" values="1;.2;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <text x="54" y="61" fill="var(--color-muted)" fontSize="9" fontFamily="Geist Mono, monospace">REC · on-device AI</text>
      <text x="139" y="222" textAnchor="middle" fill="var(--color-dim)" fontSize="9.5" fontFamily="Geist Mono, monospace">AI dash cam</text>

      {/* events → services */}
      <path d="M254 120 H 330" stroke="url(#dc-a)" strokeDasharray="4 6" className="animate-[dash_3s_linear_infinite]" />
      {[0, 1, 2].map((i) => (
        <circle key={i} r="3" fill="var(--color-cyan)">
          <animateMotion dur="2.4s" begin={`${i * 0.8}s`} repeatCount="indefinite" path="M254 120 H 330" />
        </circle>
      ))}
      <rect x="330" y="92" width="112" height="56" rx="12" fill="rgb(91 140 255 / .1)" stroke="rgb(94 231 245 / .5)" />
      <text x="386" y="117" textAnchor="middle" fill="var(--color-fg)" fontSize="12" fontWeight="500" fontFamily="Geist, sans-serif">Go services</text>
      <text x="386" y="134" textAnchor="middle" fill="var(--color-dim)" fontSize="9.5" fontFamily="Geist Mono, monospace">real-time ingest</text>

      <path d="M442 106 C 470 106, 470 70, 498 70" fill="none" stroke="url(#dc-a)" strokeOpacity=".7" strokeDasharray="4 6" className="animate-[dash_3s_linear_infinite]" />
      <path d="M442 134 C 470 134, 470 170, 498 170" fill="none" stroke="url(#dc-a)" strokeOpacity=".7" strokeDasharray="4 6" className="animate-[dash_3s_linear_infinite]" />
      <rect x="498" y="52" width="86" height="36" rx="10" fill="var(--color-node)" stroke="rgb(155 140 255 / .5)" />
      <text x="541" y="74" textAnchor="middle" fill="var(--color-lav)" fontSize="10.5" fontFamily="Geist Mono, monospace">PostgreSQL</text>
      <path d="M442 120 H 498" stroke="var(--color-violet)" strokeOpacity=".8" strokeDasharray="4 6" className="animate-[dash_3s_linear_infinite]" />
      <rect x="498" y="102" width="86" height="36" rx="10" fill="rgb(155 140 255 / .14)" stroke="rgb(155 140 255 / .75)" />
      <text x="541" y="124" textAnchor="middle" fill="var(--color-lav)" fontSize="10.5" fontWeight="500" fontFamily="Geist Mono, monospace">SageMaker</text>
      <rect x="498" y="152" width="86" height="36" rx="10" fill="var(--color-node)" stroke="rgb(74 222 155 / .45)" />
      <text x="541" y="174" textAnchor="middle" fill="var(--color-ok)" fontSize="10.5" fontFamily="Geist Mono, monospace">alerts</text>
          </svg>
  )
}
