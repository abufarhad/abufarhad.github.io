import { useCallback } from 'react'
import type { PointerEvent } from 'react'

/** Writes cursor position into --mx / --my so `.spot` cards can glow under the pointer. */
export function useSpotlight<T extends HTMLElement>() {
  return useCallback((e: PointerEvent<T>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }, [])
}
