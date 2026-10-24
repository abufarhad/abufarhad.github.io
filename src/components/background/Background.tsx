import { useEffect, useRef, useState } from 'react'
import type { Quality, Universe } from './universe'

function detectQuality(): Quality | null {
  if (typeof window === 'undefined') return null
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  if (conn?.saveData) return null
  try {
    const c = document.createElement('canvas')
    if (!(c.getContext('webgl2') || c.getContext('webgl'))) return null
  } catch {
    return null
  }
  const small = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches
  const weak = (navigator.hardwareConcurrency || 8) <= 4
  return small || weak ? 'low' : 'high'
}

/**
 * Layered background:
 *  1. CSS midnight gradient + drifting aurora (always on, the static fallback)
 *  2. Lazy-loaded WebGL universe (skipped for reduced motion / no WebGL / save-data)
 *  3. Cursor-following volumetric light
 *  4. Vignette + film grain
 */
export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lightRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const veilRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const quality = detectQuality()
    let universe: Universe | null = null
    let cancelled = false

    const start = () => {
      if (!quality || !canvasRef.current) return
      import('./universe').then(({ createUniverse }) => {
        if (cancelled || !canvasRef.current) return
        try {
          universe = createUniverse(canvasRef.current, quality)
          requestAnimationFrame(() => setReady(true))
        } catch {
          /* WebGL context failed, CSS fallback remains */
        }
      })
    }
    // Defer heavy work until the browser is idle so first paint stays instant.
    const hasIdle = 'requestIdleCallback' in window
    const idleId = hasIdle ? window.requestIdleCallback(start, { timeout: 600 }) : window.setTimeout(start, 120)

    let lx = window.innerWidth / 2
    let ly = window.innerHeight * 0.3
    let cx = lx
    let cy = ly
    let raf = 0
    const fine = window.matchMedia('(pointer: fine)').matches

    const onMove = (e: PointerEvent) => {
      lx = e.clientX
      ly = e.clientY
      universe?.setPointer((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
    }
    const onLeave = () => universe?.setPointer(NaN, NaN)
    const loop = () => {
      cx += (lx - cx) * 0.12
      cy += (ly - cy) * 0.12
      if (lightRef.current) lightRef.current.style.transform = `translate3d(${cx - 400}px, ${cy - 400}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    const onScroll = () => {
      const h = window.innerHeight
      const p = Math.min(window.scrollY / (h * 1.1), 1)
      universe?.setScroll(p)
      wrapRef.current?.style.setProperty('--dim', String(1 - p * 0.65))
      veilRef.current?.style.setProperty('opacity', String(p * 0.45))
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    if (fine) raf = requestAnimationFrame(loop)
    onScroll()

    return () => {
      cancelled = true
      if (hasIdle) window.cancelIdleCallback(idleId)
      else clearTimeout(idleId)
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', onScroll)
      universe?.dispose()
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      {/* 1. gradient + aurora */}
      <div className="bg-base absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#0d1838_0%,#060a17_45%,#04060c_75%)]" />
      <div
        className="bg-aurora absolute -left-[20%] -top-[30%] h-[80vh] w-[80vw] rounded-full opacity-50 blur-[120px] [animation:aurora_22s_ease-in-out_infinite]"
        style={{ background: 'radial-gradient(closest-side, rgb(91 140 255 / 0.35), transparent)' }}
      />
      <div
        className="bg-aurora absolute -right-[15%] top-[10%] h-[70vh] w-[60vw] rounded-full opacity-40 blur-[120px] [animation:aurora_28s_ease-in-out_infinite_reverse]"
        style={{ background: 'radial-gradient(closest-side, rgb(155 140 255 / 0.28), transparent)' }}
      />
      <div
        className="bg-aurora absolute bottom-[-30%] left-[20%] h-[60vh] w-[60vw] rounded-full opacity-30 blur-[140px] [animation:aurora_34s_ease-in-out_infinite]"
        style={{ background: 'radial-gradient(closest-side, rgb(94 231 245 / 0.22), transparent)' }}
      />

      {/* 2. WebGL universe */}
      <div ref={wrapRef} className="absolute inset-0 transition-opacity duration-300" style={{ opacity: 'var(--dim, 1)' }}>
      <div className="bg-canvas-wrap absolute inset-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-[1600ms] ease-out"
        style={{ opacity: ready ? 1 : 0 }}
      />
      </div>
      </div>

      {/* 3. cursor light */}
      <div
        ref={lightRef}
        className="bg-light absolute left-0 top-0 hidden h-[800px] w-[800px] rounded-full opacity-60 mix-blend-screen [@media(pointer:fine)]:block"
        style={{ background: 'radial-gradient(closest-side, rgb(94 140 255 / 0.12), rgb(94 231 245 / 0.04) 45%, transparent 70%)' }}
      />

      {/* 4. vignette, readability veil, grain */}
      <div className="bg-vignette absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(2_3_8/0.65)_100%)]" />
      <div ref={veilRef} className="absolute inset-0 bg-ink transition-opacity duration-500" style={{ opacity: 0 }} />
      <div className="grain" />
    </div>
  )
}
