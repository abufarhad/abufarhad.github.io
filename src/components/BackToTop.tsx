import { AnimatePresence, motion, useScroll } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export function BackToTop() {
  const { scrollYProgress } = useScroll()
  const [show, setShow] = useState(false)
  useEffect(() => scrollYProgress.on('change', (v) => setShow(v > 0.12)), [scrollYProgress])

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#top"
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          className="glass fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full text-fg transition hover:border-cyan/50"
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden>
            <motion.circle cx="24" cy="24" r="22.5" fill="none" stroke="url(#btt)" strokeWidth="1.5" style={{ pathLength: scrollYProgress }} />
            <defs>
              <linearGradient id="btt">
                <stop offset="0" stopColor="var(--color-blue)" />
                <stop offset="1" stopColor="var(--color-cyan)" />
              </linearGradient>
            </defs>
          </svg>
          <ArrowUp size={17} />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
