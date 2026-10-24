const ITEMS = ['Go', 'Distributed Systems', 'PostgreSQL', 'Kafka', 'gRPC', 'Redis', 'Kubernetes', 'Docker', 'AWS', 'Azure', 'Microservices', 'Event-Driven', 'Databricks', 'Python', 'C#', 'Terraform']

export function Marquee() {
  const row = [...ITEMS, ...ITEMS]
  return (
    <div
      aria-hidden
      className="relative overflow-hidden border-y border-line bg-ink/40 py-5 backdrop-blur-sm [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
    >
      <div className="flex w-max [animation:marquee_45s_linear_infinite] hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 pr-8 text-[clamp(1.1rem,2vw,1.6rem)] font-medium tracking-tight text-dim">
            {t}
            <svg width="10" height="10" viewBox="0 0 10 10" className="text-cyan/60">
              <path d="M5 0 6.2 3.8 10 5 6.2 6.2 5 10 3.8 6.2 0 5 3.8 3.8Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}
