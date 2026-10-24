import { useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

const GLYPHS = '!<>-_\\/[]{}=+*^?#$%&01ABCDEFX'

/** Text that scrambles through random glyphs, then resolves left to right. */
export function Decrypt({ text, delay = 0, speed = 28, className }: { text: string; delay?: number; speed?: number; className?: string }) {
  const reduce = useReducedMotion()
  const [out, setOut] = useState(reduce ? text : '')

  useEffect(() => {
    if (reduce) return
    let frame = 0
    let id = 0
    const start = window.setTimeout(() => {
      id = window.setInterval(() => {
        frame++
        const revealed = Math.floor(frame / 2)
        const next = text
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' '
            if (i < revealed) return ch
            if (i < revealed + 6) return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            return ''
          })
          .join('')
        setOut(next)
        if (revealed >= text.length) window.clearInterval(id)
      }, speed)
    }, delay)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(id)
    }
  }, [text, delay, speed, reduce])

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{out || ' '}</span>
    </span>
  )
}

/** Types a string once, character by character. */
export function TypeOnce({ text, delay = 0, speed = 55, onDone }: { text: string; delay?: number; speed?: number; onDone?: () => void }) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? text.length : 0)

  useEffect(() => {
    if (reduce) {
      onDone?.()
      return
    }
    let i = 0
    let id = 0
    const start = window.setTimeout(() => {
      id = window.setInterval(() => {
        i++
        setN(i)
        if (i >= text.length) {
          window.clearInterval(id)
          onDone?.()
        }
      }, speed)
    }, delay)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(id)
    }
    // onDone is intentionally excluded so the animation runs once
  }, [text, delay, speed, reduce]) // eslint-disable-line react-hooks/exhaustive-deps

  return <>{text.slice(0, n)}</>
}
