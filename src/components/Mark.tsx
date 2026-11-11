import { motion } from 'motion/react'
import { EASE } from '../deck/motion'

/**
 * RetailyAI mark: two overlapping speech-bubble shapes (from the product logo),
 * recoloured for the stage. `draw` animates the two halves sliding together.
 */
export function Mark({
  size = 64,
  back = '#9cc0ff',
  front = '#1e6bff',
  draw = false,
  delay = 0,
}: {
  size?: number
  back?: string
  front?: string
  draw?: boolean
  delay?: number
}) {
  const t = { duration: 1.1, ease: EASE, delay }
  return (
    <svg width={size} height={(size * 83.2) / 114.56} viewBox="3.72 19.40 114.56 83.20" aria-hidden>
      <motion.path
        fill={back}
        d="M36.960 22.400 H43.680 A30.240 30.240 0 0 1 73.920 52.640 V59.360 A30.240 30.240 0 0 1 43.680 89.600 H12.320 A5.600 5.600 0 0 1 6.720 84.000 V52.640 A30.240 30.240 0 0 1 36.960 22.400 Z"
        initial={draw ? { x: -18, opacity: 0 } : false}
        animate={{ x: 0, opacity: 1 }}
        transition={t}
      />
      <motion.path
        fill={front}
        d="M68.320 22.400 H75.040 A30.240 30.240 0 0 1 105.280 52.640 V84.000 A5.600 5.600 0 0 1 99.680 89.600 H68.320 A30.240 30.240 0 0 1 38.080 59.360 V52.640 A30.240 30.240 0 0 1 68.320 22.400 Z"
        initial={draw ? { x: 18, opacity: 0 } : false}
        animate={{ x: 0, opacity: 1 }}
        transition={{ ...t, delay: delay + 0.12 }}
      />
    </svg>
  )
}

export function Wordmark({ color = 'currentColor', size = 40 }: { color?: string; size?: number }) {
  return (
    <span
      style={{ color, fontSize: size, fontWeight: 760, fontStretch: '92%', letterSpacing: '-0.03em' }}
      className="leading-none"
    >
      RetailyAI
    </span>
  )
}
