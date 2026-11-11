import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { Fade, Lines } from '../components/Type'
import { EASE, useReduced } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * Business model. One vertical scale for everything: 9,000 DH = 600px.
 * 0  agency: 15 DH x 20 orders a day x 30 days = 9,000 DH a month
 * 1  RetailyAI monthly plans on the same scale
 * 2  internal cost, set apart: what an AI-handled order costs us (not a price)
 */

const BASE = 860 // y of the shared baseline
const PX_PER_DH = 600 / 9000

const PLANS = [
  { name: 'Launch', price: 190 },
  { name: 'Starter', price: 390 },
  { name: 'Growth', price: 790 },
  { name: 'Scale', price: 1800 },
]

function Count({ to, show }: { to: number; show: boolean }) {
  const reduced = useReduced()
  const mv = useMotionValue(0)
  const text = useTransform(() => Math.round(mv.get()).toLocaleString('en-US'))
  useEffect(() => {
    if (reduced) {
      mv.set(show ? to : 0)
      return
    }
    const c = animate(mv, show ? to : 0, { duration: 2, ease: [0.3, 0, 0.2, 1], delay: 0.5 })
    return () => c.stop()
  }, [to, show, mv, reduced])
  return <motion.span className="tabular">{text}</motion.span>
}

export default function S07Model({ step }: SceneProps) {
  const agencyH = 9000 * PX_PER_DH
  return (
    <div className="absolute inset-0 bg-paper">
      <div className="absolute left-[140px] top-[84px]">
        <Lines k="h" lines={['Priced per month,', 'not per order.']} className="display text-[112px] text-ink" />
      </div>

      {/* shared baseline */}
      <div className="absolute left-[140px] right-[140px] h-[3px] bg-ink" style={{ top: BASE }} />

      {/* agency tower */}
      <div className="absolute left-[1000px] w-[220px]" style={{ top: BASE - agencyH }}>
        <motion.div
          className="absolute bottom-0 left-0 w-full origin-bottom rounded-t-[14px]"
          style={{
            height: agencyH,
            top: 0,
            background: 'repeating-linear-gradient(180deg, #5b6475 0 8px, #8a8d94 8px 10px)',
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 2, ease: [0.3, 0, 0.2, 1], delay: 0.5 }}
        />
      </div>
      <div className="absolute left-[1240px] w-[520px]" style={{ top: BASE - agencyH - 10 }}>
        <div className="text-[64px] font-bold leading-none text-loss">
          <Count to={9000} show /> DH
        </div>
        <div className="mt-3 text-[28px] leading-snug text-ink-2">
          a month to a confirmation agency, at 15 DH an order and 20 orders a day.
        </div>
      </div>
      <div className="absolute left-[1000px] w-[220px] pt-4 text-center text-[26px] font-semibold text-ink" style={{ top: BASE }}>
        Agency
      </div>

      {/* RetailyAI plans, same scale */}
      <div className="absolute left-[140px] flex items-end gap-5" style={{ top: BASE - 1800 * PX_PER_DH - 70, height: 1800 * PX_PER_DH + 70 }}>
        {PLANS.map((p, i) => {
          const h = Math.max(p.price * PX_PER_DH, 6)
          const show = step >= 1
          return (
            <div key={p.name} className="flex w-[170px] flex-col items-center justify-end">
              <motion.div
                className="mb-2 text-[30px] font-bold text-electric tabular"
                initial={false}
                animate={{ opacity: show ? 1 : 0 }}
                transition={{ duration: 0.4, delay: show ? 0.4 + i * 0.12 : 0 }}
              >
                {p.price.toLocaleString('en-US')}
              </motion.div>
              <motion.div
                className="w-full origin-bottom rounded-t-[10px] bg-electric"
                style={{ height: h }}
                initial={false}
                animate={{ scaleY: show ? 1 : 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: show ? 0.2 + i * 0.12 : 0 }}
              />
            </div>
          )
        })}
      </div>
      <motion.div
        className="absolute left-[140px] flex gap-5 pt-4 text-[24px] font-semibold text-ink"
        style={{ top: BASE }}
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0 }}
        transition={{ duration: 0.4, delay: step >= 1 ? 0.5 : 0 }}
      >
        {PLANS.map((p) => (
          <div key={p.name} className="w-[170px] text-center">
            {p.name}
          </div>
        ))}
      </motion.div>
      <motion.div
        className="absolute left-[140px] w-[760px] text-[28px] leading-snug text-ink-2"
        style={{ top: BASE - 1800 * PX_PER_DH - 190 }}
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0 }}
        transition={{ duration: 0.5, delay: step >= 1 ? 0.9 : 0 }}
      >
        <span className="font-semibold text-electric">RetailyAI plans, MAD per month.</span> Sized by AI replies, priced against agency labor.
      </motion.div>

      {/* internal economics, deliberately set apart */}
      <div className="absolute bottom-[54px] left-[140px] right-[140px]">
        {step >= 2 && (
          <Fade k="cost" delay={0.2} className="flex items-baseline gap-8 border-t-2 border-dashed border-ink-4 pt-5">
            <span className="shrink-0 rounded-lg bg-ink px-3 py-1 text-[22px] font-semibold text-white">Our side of the counter</span>
            <span className="lede text-[28px] text-ink-2">
              An AI-handled order costs us 2–6 DH. That gap is our ~65% gross margin, not a price the merchant pays.
            </span>
          </Fade>
        )}
      </div>
    </div>
  )
}
