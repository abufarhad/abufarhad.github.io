import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { fadeUp } from '../lib/motion'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'p' | 'span' | 'h2' | 'h3' | 'article'
}

export function Reveal({ children, className, delay = 0, as = 'div' }: Props) {
  const M = motion[as]
  return (
    <M
      className={className}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      {children}
    </M>
  )
}
