import { createContext, useContext } from 'react'
import type { Transition } from 'motion/react'

/** House curve: fast out, long settle. */
export const EASE = [0.16, 1, 0.3, 1] as const
export const EASE_IN = [0.7, 0, 0.84, 0] as const

export const enter = (delay = 0, duration = 0.8): Transition => ({ duration, delay, ease: EASE })

export const spring = (delay = 0, bounce = 0.25, duration = 0.7): Transition => ({
  type: 'spring',
  bounce,
  duration,
  delay,
})

/** True when the deck runs in reduced-motion mode (OS setting or the M key). */
export const ReducedMotion = createContext(false)
export const useReduced = () => useContext(ReducedMotion)

/** Deterministic pseudo-random in [0, 1) for index i: same layout every render. */
export function rand(i: number, salt = 1) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}
