import { useEffect, useRef, useState } from 'react'

/** Dot + lagging ring; ring grows over interactive elements. Desktop / fine pointer only. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [enabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine) and (hover: hover)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (!enabled) return
    
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0
    let hover = false, down = false, visible = false

    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      if (!visible) {
        visible = true
        rx = x
        ry = y
        dot.current?.style.setProperty('opacity', '1')
        ring.current?.style.setProperty('opacity', '1')
      }
      const t = e.target as HTMLElement | null
      hover = !!t?.closest('a, button, [role="button"], input, textarea, [data-cursor="hover"]')
    }
    const onLeave = () => {
      visible = false
      dot.current?.style.setProperty('opacity', '0')
      ring.current?.style.setProperty('opacity', '0')
    }
    const onDown = () => (down = true)
    const onUp = () => (down = false)

    const loop = () => {
      rx += (x - rx) * 0.38
      ry += (y - ry) * 0.38
      if (ring.current) {
        const s = (hover ? 1.9 : 1) * (down ? 0.8 : 1)
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${s})`
        ring.current.dataset.hover = String(hover)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 rounded-full border border-cyan/40 opacity-0 transition-[opacity,background-color,border-color] duration-300 data-[hover=true]:border-cyan/80 data-[hover=true]:bg-cyan/[0.08]"
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101] h-1 w-1 rounded-full bg-cyan opacity-0 shadow-[0_0_10px_2px_rgb(94_231_245/0.6)] transition-opacity duration-300"
      />
    </>
  )
}
