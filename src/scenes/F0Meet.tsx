import { motion } from 'motion/react'
import { FEATURES } from '../components/Feature'
import { Mark } from '../components/Mark'
import { Fade, Lines } from '../components/Type'
import { EASE } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * The turn of the story, kept simple: the solution, named, and its seven chapters,
 * laid out like a contents page. The chapters that follow are numbered the same.
 */

export default function F0Meet(_: SceneProps) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-paper text-ink">
      <motion.div
        className="absolute left-[140px] top-[150px] flex items-center gap-4"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
      >
        <Mark size={56} draw delay={0.3} />
        <span className="text-[26px] font-semibold text-electric">The solution</span>
      </motion.div>
      <div className="absolute left-[140px] top-[230px] w-[1640px]">
        <Lines k="meet" lines={['Meet RetailyAI.']} className="display text-[140px]" delay={0.3} />
        <Fade k="meet-sub" delay={0.9} className="lede mt-8 max-w-[1150px] text-[34px] text-ink-2">
          In every customer chat, day and night, in the customer’s own language. From the first “Salam” to the parcel at the door.
        </Fade>
      </div>

      {/* the chapters, like a contents page */}
      <div className="absolute left-[140px] top-[600px] grid w-[1640px] grid-cols-4 gap-x-12">
        {FEATURES.map((f, i) => (
          <div key={f} className="relative py-6">
            <motion.span
              className="absolute inset-x-0 top-0 h-px bg-ink/20"
              style={{ originX: 0 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, ease: EASE, delay: 1.1 + i * 0.08 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 1.3 + i * 0.08 }}
            >
              <div className="text-[56px] leading-none text-electric tabular" style={{ fontWeight: 220, fontStretch: '78%', letterSpacing: '-0.04em' }}>
                0{i + 1}
              </div>
              <div className="mt-3 text-[30px] font-medium leading-tight">{f}</div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  )
}
