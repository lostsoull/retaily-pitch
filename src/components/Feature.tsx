import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE } from '../deck/motion'
import { Camera, Numeral, Reveal } from './Cine'
import { Fade, Lines } from './Type'

/** The six capabilities, in the order the chapter tells them. */
export const FEATURES = [
  'Plug in, connect',
  'Conversation agent',
  'Address check',
  'Product Q&A',
  'Handoffs and permissions',
  'Delivery',
  'Owner’s console',
] as const

/**
 * Shared frame for a feature story: chapter marker, headline and one line of
 * substance in the caption column, the chapter numeral anchoring its foot; the
 * scene's own visual story fills BOX on the right, under a slow camera.
 */
export function FeatureFrame({
  n,
  headline,
  sub,
  subKey = 0,
  dark = false,
  camera,
  children,
}: {
  n: number
  headline: string[]
  sub: ReactNode
  subKey?: string | number
  dark?: boolean
  /** Per-step camera move over the right-hand stage. */
  camera?: { x?: number; y?: number; scale?: number }
  children: ReactNode
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${dark ? 'bg-ink text-white' : 'bg-paper text-ink'}`}>
      <Camera {...camera}>{children}</Camera>

      <motion.div
        className="absolute left-[140px] top-[150px] flex items-center gap-4"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
      >
        <div className="flex gap-1.5">
          {FEATURES.map((_, i) => (
            <motion.span
              key={i}
              className={`h-2.5 rounded-full ${i + 1 === n ? 'bg-electric' : dark ? 'bg-white/25' : 'bg-ink/15'}`}
              initial={{ width: i + 1 === n ? 10 : i + 2 === n ? 40 : 10 }}
              animate={{ width: i + 1 === n ? 40 : 10 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
            />
          ))}
        </div>
        <span className="text-[26px] font-semibold text-electric">{FEATURES[n - 1]}</span>
      </motion.div>

      <div className="absolute left-[140px] top-[210px] w-[640px]">
        <Lines k={headline.join()} lines={headline} className="display text-[96px]" delay={0.25} />
        <Fade k={subKey} delay={0.8} className={`lede mt-10 text-[31px] ${dark ? 'text-white/75' : 'text-ink-2'}`}>
          {sub}
        </Fade>
      </div>

      <Numeral n={n} of={FEATURES.length} dark={dark} />
    </div>
  )
}

/** A small thing arriving with a step. Kept for older scenes; new work uses Reveal. */
export function Pop({
  on = true,
  delay = 0,
  className = '',
  style,
  children,
}: {
  on?: boolean
  delay?: number
  className?: string
  style?: React.CSSProperties
  children: ReactNode
  y?: number
}) {
  return (
    <Reveal on={on} delay={delay} shot="rise" duration={0.9} className={className} style={style}>
      {children}
    </Reveal>
  )
}

export const cardCls = 'rounded-[26px] bg-white shadow-[0_30px_60px_-34px_rgba(6,16,43,0.45),0_0_0_1px_rgba(6,16,43,0.06)]'
