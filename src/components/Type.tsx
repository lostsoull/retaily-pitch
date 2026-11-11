import { AnimatePresence, motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { EASE, EASE_IN, useReduced } from '../deck/motion'

type LinesProps = {
  /** Change this to swap the text with an exit/enter. */
  k: string | number
  lines: ReactNode[]
  className?: string
  style?: CSSProperties
  delay?: number
  stagger?: number
}

/**
 * Masked line reveal. Each line swings up from behind its own baseline, hinged
 * on its left foot; on swap the old lines lift away and go soft first.
 * Used for every headline.
 */
export function Lines({ k, lines, className = '', style, delay = 0, stagger = 0.09 }: LinesProps) {
  const reduced = useReduced()
  return (
    <AnimatePresence mode="wait" initial={true}>
      <motion.div key={k} className={className} style={style}>
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em] pr-[0.1em]">
            <motion.span
              className="inline-block"
              style={{ transformOrigin: '0% 100%' }}
              initial={reduced ? { opacity: 0 } : { y: '115%', rotate: 5, opacity: 0 }}
              animate={{ y: '0%', rotate: 0, opacity: 1, transition: { duration: 1.05, ease: EASE, delay: delay + i * stagger } }}
              exit={{
                y: reduced ? 0 : '-75%',
                opacity: 0,
                filter: reduced ? 'none' : 'blur(6px)',
                transition: { duration: 0.32, ease: EASE_IN, delay: i * 0.04 },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

/** Supporting copy: comes into focus, leaves soft. */
export function Fade({
  k,
  children,
  className = '',
  delay = 0.25,
}: {
  k: string | number
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduced = useReduced()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={k}
        className={className}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE, delay }, transitionEnd: { filter: 'none' } }}
        exit={{ opacity: 0, y: reduced ? 0 : -10, filter: reduced ? 'none' : 'blur(6px)', transition: { duration: 0.24 } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
