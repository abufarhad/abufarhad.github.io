import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { EASE } from '../lib/motion'

/** Brief intro veil (~1s). Content renders underneath immediately; skipped for reduced motion & repeat visits. */
export function Loader() {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    try {
      return !sessionStorage.getItem('intro-seen')
    } catch {
      return true
    }
  })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!show) return
    try {
      sessionStorage.setItem('intro-seen', '1')
    } catch {
      /* ignore */
    }
    const start = performance.now()
    let raf = 0
    const step = (t: number) => {
      const p = Math.min((t - start) / 900, 1)
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) raf = requestAnimationFrame(step)
      else setTimeout(() => setShow(false), 180)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[200] grid place-items-center bg-ink"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="w-[min(320px,70vw)]">
            <div className="flex items-end justify-between font-mono text-xs text-muted">
              <span>initialising system</span>
              <span className="text-fg tabular-nums">{String(n).padStart(3, '0')}%</span>
            </div>
            <div className="mt-3 h-px w-full overflow-hidden bg-line">
              <div className="h-full bg-gradient-to-r from-blue via-cyan to-violet" style={{ width: `${n}%` }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
