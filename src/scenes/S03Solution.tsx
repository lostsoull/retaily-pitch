import { motion } from 'motion/react'
import { Bubble } from '../components/Chat'
import { Mark } from '../components/Mark'
import { EASE } from '../deck/motion'
import { Pipeline, type Stations } from '../components/Pipeline'
import { Fade, Lines } from '../components/Type'
import type { SceneProps } from '../deck/types'

/*
 * The solution, on the exact pipeline the audience just watched leak.
 * Each click seals the matching leak, in the same order the problems appeared.
 * 0 recap (all broken) · 1 barrier lifts, gap bridged · 2 upsell sticks
 * 3 night answered, toll replaced by a flat plan · 4 verdict: hours, sales, margin back
 */

const STATES: Stations[] = [
  { gate: 'broken', hole: 'broken', upsell: 'broken', night: 'broken', toll: 'broken' },
  { gate: 'fixed', hole: 'fixed', upsell: 'broken', night: 'broken', toll: 'broken' },
  { gate: 'fixed', hole: 'fixed', upsell: 'fixed', night: 'broken', toll: 'broken' },
  { gate: 'fixed', hole: 'fixed', upsell: 'fixed', night: 'fixed', toll: 'fixed' },
  { gate: 'fixed', hole: 'fixed', upsell: 'fixed', night: 'fixed', toll: 'fixed' },
]

const SUB = [
  'Same orders, same day. Now watch each leak close.',
  'Every chat answered in seconds, from the merchant’s own catalog and rules.',
  'It suggests the matching item while the customer is still in the chat.',
  'Awake at 02:14. One flat monthly plan, not a fee on every order.',
  'Small, you get your hours back. Big, you keep your margin. No lead goes unanswered.',
]

export default function S03Solution({ step }: SceneProps) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-paper">
      <div className="absolute left-[140px] top-[80px] flex items-center gap-8">
        <Mark size={104} draw delay={0.1} />
        <Lines k="h" lines={['RetailyAI seals every leak.']} className="display text-[112px] text-ink" />
      </div>
      <div className="absolute left-[140px] top-[208px] w-[1640px]">
        <Fade k={step} className="lede text-[36px] text-ink-2" delay={0.4}>
          {SUB[step]}
        </Fade>
      </div>

      <Pipeline s={STATES[step]} verdict={step >= 4 ? 'solution' : null}>
        {/* the answers that used to wait */}
        <motion.div
          className="absolute left-[140px] top-[700px] flex flex-col items-start gap-2"
          initial={false}
          animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 16 }}
          transition={{ duration: 0.6, ease: EASE, delay: step === 1 ? 1.1 : 0 }}
        >
          <Bubble side="in" size={23} time="14:02">
            Salam, ch7al?
          </Bubble>
          <Bubble side="out" size={23} time="14:02" ticks className="ml-14">
            249 DH, livraison fabor. Nconfirmi lik?
          </Bubble>
        </motion.div>
        <motion.div
          className="absolute right-[140px] top-[700px] flex flex-col items-end gap-2"
          initial={false}
          animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : 16 }}
          transition={{ duration: 0.6, ease: EASE, delay: step === 3 ? 1.2 : 0 }}
        >
          <Bubble side="in" size={23} time="02:14" className="mr-14">
            Wach mazal kayna?
          </Bubble>
          <Bubble side="out" size={23} time="02:14" ticks>
            Kayna! Nconfirmi lik daba?
          </Bubble>
        </motion.div>
      </Pipeline>
    </div>
  )
}
