import { motion } from 'motion/react'
import { Lines } from '../components/Type'
import { EASE } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * Proof. The four days, then the two numbers, each clearly labelled.
 * 0  June 4 → June 8: discovery to production
 * 1  3 pilot merchants · 92% on the internal production test suite (10x10 grid callback to the receipt)
 */

const DAYS = [{ d: 4 }, { d: 5 }, { d: 6 }, { d: 7 }, { d: 8 }]
const TILE = 196
const GAP = 22
const LEFT = 140
const TOP = 380

export default function S09Proof({ step }: SceneProps) {
  const nums = step >= 1
  const x0 = LEFT + TILE / 2
  const x1 = LEFT + 4 * (TILE + GAP) + TILE / 2
  return (
    <div className="absolute inset-0 bg-paper">
      <div className="absolute left-[140px] top-[84px]">
        <Lines k="p" lines={['Discovery to production', 'in four days.']} className="display text-[104px] text-ink" />
      </div>

      {/* calendar strip */}
      <div className="absolute flex" style={{ left: LEFT, top: TOP + 40, gap: GAP }}>
        {DAYS.map((day, i) => {
          const edge = i === 0 || i === 4
          return (
            <motion.div
              key={day.d}
              className={`flex flex-col items-center justify-center rounded-[26px] ${edge ? 'bg-ink text-white' : 'bg-white text-ink'}`}
              style={{ width: TILE, height: TILE }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.4 + i * 0.08 }}
            >
              <div className={`text-[24px] ${edge ? 'text-white/60' : 'text-ink-3'}`}>June</div>
              <div className="mt-1 text-[96px] font-bold leading-none tabular">{day.d}</div>
            </motion.div>
          )
        })}
      </div>

      {/* the line across the days */}
      <svg className="absolute left-0" style={{ top: TOP + 40 + TILE + 24 }} width="1920" height="40" aria-hidden>
        <motion.line
          x1={x0}
          y1="20"
          x2={x1}
          y2="20"
          stroke="#1e6bff"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1], delay: 1.0 }}
        />
        <circle cx={x0} cy="20" r="12" fill="#1e6bff" />
        <motion.circle cx={x1} cy="20" r="12" fill="#1e6bff" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5, delay: 2.3 }} />
      </svg>
      <div className="absolute text-[28px] font-semibold text-ink" style={{ left: LEFT, top: TOP + 40 + TILE + 80, width: 420 }}>
        Met two merchants
      </div>
      <motion.div
        className="absolute text-right text-[28px] font-semibold text-ink"
        style={{ left: x1 + TILE / 2 - 420, top: TOP + 40 + TILE + 80, width: 420 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.5 }}
      >
        Shipped their full ask
      </motion.div>
      <motion.div
        className="absolute text-[26px] text-ink-3"
        style={{ left: LEFT, top: TOP + 40 + TILE + 130, width: 1060 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.7, duration: 0.5 }}
      >
        Zero sales spend.
      </motion.div>

      {/* numbers, right column */}
      <div className="absolute left-[1290px] top-[370px] w-[490px]">
        <motion.div initial={false} animate={{ opacity: nums ? 1 : 0, y: nums ? 0 : 20 }} transition={{ duration: 0.7, ease: EASE, delay: nums ? 0.1 : 0 }}>
          <div className="flex items-baseline gap-5">
            <span className="display text-[150px] text-ink">3</span>
            <span className="text-[32px] font-semibold leading-tight text-ink">pilot merchants</span>
          </div>
        </motion.div>

        <motion.div
          className="mt-10"
          initial={false}
          animate={{ opacity: nums ? 1 : 0, y: nums ? 0 : 20 }}
          transition={{ duration: 0.7, ease: EASE, delay: nums ? 0.5 : 0 }}
        >
          <div className="flex items-center gap-8">
            <div className="grid grid-cols-10 gap-[5px]">
              {Array.from({ length: 100 }, (_, i) => (
                <motion.div
                  key={i}
                  className="h-[17px] w-[17px] rounded-[4px]"
                  initial={false}
                  animate={{ backgroundColor: nums && i < 92 ? '#1e6bff' : '#e1ded6' }}
                  transition={{ duration: 0.3, delay: nums ? 0.8 + i * 0.012 : 0 }}
                />
              ))}
            </div>
            <span className="display text-[104px] text-electric">92%</span>
          </div>
          <div className="mt-5 text-[28px] font-semibold leading-snug text-ink">success on our production test suite</div>
          <div className="mt-2 text-[23px] leading-snug text-ink-3">Internal test results, not live-customer metrics.</div>
        </motion.div>
      </div>
    </div>
  )
}
