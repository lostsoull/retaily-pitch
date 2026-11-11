import { motion, type TargetAndTransition } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { EASE, EASE_IN, useReduced } from '../deck/motion'

/*
 * The cinematic layer: one composition box and a small vocabulary of "shots".
 *
 * Layout rule: on every content scene the right-hand stage fills BOX. Objects
 * inside it align to its edges (tops on BOX.y, bottoms on BOX.b), so nothing
 * ends at a random height. Asymmetry is deliberate: unequal column splits, one
 * hero that may bleed off the frame, at most one satellite overlapping it.
 */
export const BOX = { x: 860, y: 150, w: 920, h: 780, r: 1780, b: 930 } as const
export const GAP = 24

/** Slow-in, slow-out for wipes and camera moves. */
export const WIPE = [0.76, 0, 0.24, 1] as const

export type Shot = 'focus' | 'lift' | 'wipe' | 'rise' | 'left' | 'right' | 'drop' | 'swing'

const SOFT = { filter: 'blur(0px)' }
const SHOTS: Record<Shot, { from: TargetAndTransition; to: TargetAndTransition }> = {
  // a focus pull: arrives soft and slightly large, settles sharp
  focus: { from: { opacity: 0, scale: 1.12, filter: 'blur(18px)' }, to: { opacity: 1, scale: 1, ...SOFT } },
  // stands up toward the camera from below
  lift: { from: { opacity: 0, y: 140, rotateX: 34, scale: 0.94, filter: 'blur(10px)' }, to: { opacity: 1, y: 0, rotateX: 0, scale: 1, ...SOFT } },
  // unfolds top to bottom behind a mask
  wipe: { from: { clipPath: 'inset(0% 0% 100% 0%)', y: -30 }, to: { clipPath: 'inset(0% 0% 0% 0%)', y: 0 } },
  // a short, sharp rise for small things
  rise: { from: { opacity: 0, y: 44, filter: 'blur(8px)' }, to: { opacity: 1, y: 0, ...SOFT } },
  left: { from: { opacity: 0, x: -180, filter: 'blur(14px)' }, to: { opacity: 1, x: 0, ...SOFT } },
  right: { from: { opacity: 0, x: 220, filter: 'blur(14px)' }, to: { opacity: 1, x: 0, ...SOFT } },
  drop: { from: { opacity: 0, y: -160, rotate: -5, filter: 'blur(10px)' }, to: { opacity: 1, y: 0, rotate: 0, ...SOFT } },
  // turns in like a door, hinged on its left edge
  swing: { from: { opacity: 0, rotateY: -50, x: 80, filter: 'blur(8px)' }, to: { opacity: 1, rotateY: 0, x: 0, ...SOFT } },
}

/**
 * Anything that enters the frame. `on` toggles it with a step; leaving is quick
 * and falls away, arriving is slow and settles.
 */
export function Reveal({
  on = true,
  shot = 'lift',
  delay = 0,
  duration = 1.15,
  className = '',
  style,
  origin,
  children,
}: {
  on?: boolean
  shot?: Shot
  delay?: number
  duration?: number
  className?: string
  style?: CSSProperties
  /** transform-origin, e.g. '0% 50%' for a swing hinged on the left */
  origin?: string
  children: ReactNode
}) {
  const reduced = useReduced()
  const s = SHOTS[shot]
  const from = reduced ? { opacity: 0 } : s.from
  const to = reduced ? { opacity: 1 } : s.to
  const end: Record<string, string> | undefined = shot === 'wipe' ? { clipPath: 'none' } : 'filter' in s.to ? { filter: 'none' } : undefined
  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 1600, transformOrigin: origin ?? (shot === 'swing' ? '0% 50%' : '50% 100%'), ...style }}
      initial={from}
      animate={
        on
          ? { ...to, transition: { duration, ease: EASE, delay }, transitionEnd: end }
          : { ...from, transition: { duration: 0.35, ease: EASE_IN } }
      }
    >
      {children}
    </motion.div>
  )
}

/**
 * Chapter numeral, anchored bottom-left of the caption column. The last digit
 * rolls in from the previous chapter, so the six feature scenes read as one reel.
 */
export function Numeral({ n, of, dark = false }: { n: number; of: number; dark?: boolean }) {
  const reduced = useReduced()
  const S = 230
  return (
    <motion.div
      className="pointer-events-none absolute left-[128px] flex items-end gap-5"
      style={{ top: BOX.b - S * 0.86 + 20 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      aria-hidden
    >
      <div
        className={`flex leading-none ${dark ? 'text-white' : 'text-ink'}`}
        style={{ fontSize: S, fontWeight: 220, fontStretch: '78%', letterSpacing: '-0.04em', height: S * 0.86 }}
      >
        <span style={{ lineHeight: 0.86 }}>0</span>
        <span className="block overflow-hidden" style={{ height: S * 0.86 }}>
          <motion.span
            className="flex flex-col"
            initial={{ y: reduced ? -S * 0.86 : 0 }}
            animate={{ y: -S * 0.86 }}
            transition={{ duration: 1.4, ease: WIPE, delay: 0.5 }}
          >
            {[n - 1, n].map((d) => (
              <span key={d} style={{ lineHeight: 0.86, height: S * 0.86, opacity: d === n ? 1 : 0.25 }}>
                {d}
              </span>
            ))}
          </motion.span>
        </span>
      </div>
      <span className={`mb-3 text-[26px] font-semibold tabular ${dark ? 'text-white/50' : 'text-ink-4'}`}>/ 0{of}</span>
    </motion.div>
  )
}

/** The slow camera settle every scene opens on: a dolly back to rest. */
export function Camera({
  children,
  x = 0,
  y = 0,
  scale = 1,
  origin = '70% 45%',
  className = 'absolute inset-0',
}: {
  children: ReactNode
  x?: number
  y?: number
  scale?: number
  origin?: string
  className?: string
}) {
  const reduced = useReduced()
  return (
    <motion.div
      className={className}
      style={{ transformOrigin: origin }}
      initial={reduced ? false : { scale: scale * 1.06, x: x + 70, y }}
      animate={{ scale, x, y }}
      transition={{ duration: 2.0, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
