import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { Bubble } from '../components/Chat'
import { Camera } from '../components/Cine'
import { Fade, Lines } from '../components/Type'
import { EASE, useReduced } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * Go-to-market in three beats, simple enough to say in one breath:
 * 0 start them free: 200 credits on their own real chats · now: 3 pilots
 * 1 the numbers sell it: the same 30 deliveries, agency ≈ 600 DH vs Launch 190 MAD (−68%) · Q1: ~25
 * 2 merchants bring merchants · Q4: 100 paying merchants
 * The wall of 100 storefronts lights up as we reach them. Counts are the plan, not results.
 */

const COUNTS = [3, 25, 100]
const MILESTONES = [
  ['Now', '3'],
  ['Q1', '~25'],
  ['Q4', '100'],
]
const COLS = 10
const CELL = 56
const GAP = 12
const GX = 1100
const GY = 232

const cohortColor = (i: number) => (i < 3 ? '#b88a2e' : i < 25 ? '#1e6bff' : '#1450d9')

const HEAD = [
  ['Start them', 'free.'],
  ['The numbers', 'sell it.'],
  ['Merchants bring', 'merchants.'],
]
const SUB = [
  'Every merchant starts with 200 free credits on their own real chats. Nothing to sign, nothing to risk.',
  'Merchants already know what confirmation costs them. Next to an agency, a plan saves 68 to 78%. The math takes a minute.',
  'Results travel fast in COD communities. The goal: 100 paying merchants in 12 months.',
]

/** A storefront tile: awning on top, door below. */
function Store({ i, lit, delay }: { i: number; lit: boolean; delay: number }) {
  const c = cohortColor(i)
  return (
    <motion.div
      className="relative overflow-hidden rounded-[10px]"
      style={{ width: CELL, height: CELL }}
      initial={false}
      animate={{ backgroundColor: lit ? c : '#e7edf5', scale: lit ? [0.6, 1.12, 1] : 1 }}
      transition={{ duration: lit ? 0.5 : 0.2, delay: lit ? delay : 0, ease: EASE }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[14px]"
        style={{ background: lit ? 'repeating-linear-gradient(90deg, rgba(255,255,255,.55) 0 7px, transparent 7px 14px)' : 'repeating-linear-gradient(90deg, #d6deea 0 7px, transparent 7px 14px)' }}
      />
      <div className={`absolute bottom-0 left-1/2 h-[22px] w-[16px] -translate-x-1/2 rounded-t-[4px] ${lit ? 'bg-white/70' : 'bg-[#d6deea]'}`} />
    </motion.div>
  )
}

function Counter({ to }: { to: number }) {
  const reduced = useReduced()
  const mv = useMotionValue(to)
  const text = useTransform(() => Math.round(mv.get()).toString())
  useEffect(() => {
    if (reduced) {
      mv.set(to)
      return
    }
    const c = animate(mv, to, { duration: 1.4, ease: EASE, delay: 0.4 })
    return () => c.stop()
  }, [to, mv, reduced])
  return <motion.span className="tabular">{text}</motion.span>
}

/** 0 · the free start: the Free recharge card, its 200 credits ticking into a real chat. */
function FreeStart() {
  const credits = useMotionValue(200)
  const text = useTransform(() => Math.round(credits.get()).toString())
  const reduced = useReduced()
  useEffect(() => {
    if (reduced) return
    const c = animate(credits, [200, 200, 197], { duration: 2.6, times: [0, 0.6, 1], delay: 0.8 })
    return () => c.stop()
  }, [credits, reduced])
  return (
    <div className="flex items-stretch gap-6">
      <motion.div
        className="relative w-[230px] shrink-0 overflow-hidden rounded-[24px] bg-electric-soft px-6 py-6 text-electric-deep"
        style={{ boxShadow: 'inset 0 0 0 2px rgba(30,107,255,0.35)', transformPerspective: 1400 }}
        initial={{ opacity: 0, rotateY: -40, x: -60 }}
        animate={{ opacity: 1, rotateY: 0, x: 0, rotate: -3 }}
        transition={{ type: 'spring', bounce: 0.25, duration: 1.1, delay: 0.7 }}
      >
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border-[12px] border-current opacity-10" />
        <div className="text-[22px] font-semibold">Free</div>
        <div className="mt-3 text-[54px] font-bold leading-none tracking-[-0.03em] tabular">
          <motion.span>{text}</motion.span>
        </div>
        <div className="mt-1 text-[17px] opacity-70">credits to start</div>
        <div className="mt-5 w-fit rounded-full bg-electric px-3 py-1 text-[16px] font-semibold text-white">0 MAD</div>
      </motion.div>
      <div className="flex flex-1 flex-col justify-center gap-3">
        {[
          { side: 'in' as const, text: 'Salam, ch7al?', d: 1.4 },
          { side: 'out' as const, text: '249 DH, livraison fabor', d: 1.9 },
          { side: 'in' as const, text: 'Bghit wa7da', d: 2.4 },
        ].map((m) => (
          <motion.div
            key={m.text}
            className={m.side === 'out' ? 'self-end' : ''}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE, delay: m.d }}
          >
            <Bubble side={m.side} size={22} ticks={m.side === 'out'}>
              {m.text}
            </Bubble>
          </motion.div>
        ))}
        <motion.div className="text-[19px] font-semibold text-ink-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.9 }}>
          Their own customers, their own chats, from day one.
        </motion.div>
      </div>
    </div>
  )
}

/** 1 · the math that sells it: the same 30 deliveries, at an agency and on Launch (−68%, from the pricing). */
function NapkinMath() {
  const ROWS = [
    { k: 'Confirmation agency', sub: '30 deliveries × ~20 DH', v: '≈ 600 DH', w: 1, dark: true },
    { k: 'RetailyAI · Launch', sub: '600 credits ≈ 30 deliveries', v: '190 MAD', w: 0.32, dark: false },
  ]
  return (
    <div className="rounded-[24px] bg-white p-7 shadow-[0_30px_50px_-34px_rgba(6,16,43,0.5),0_0_0_1px_rgba(6,16,43,0.06)]">
      <div className="text-[19px] font-semibold uppercase tracking-[0.14em] text-ink-3">The same month, 30 deliveries</div>
      <div className="mt-5 space-y-5">
        {ROWS.map((r, i) => (
          <div key={r.k}>
            <div className="flex items-baseline justify-between">
              <span className="text-[22px] font-semibold text-ink">{r.k}</span>
              <span className="text-[26px] font-bold text-ink tabular">{r.v}</span>
            </div>
            <div className="text-[17px] text-ink-3">{r.sub}</div>
            <div className="mt-2 h-5 overflow-hidden rounded-full bg-paper">
              <motion.div
                className={`h-full rounded-full ${r.dark ? 'bg-ink' : 'bg-electric'}`}
                style={{ originX: 0 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: r.w }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.9 + i * 0.4 }}
              />
            </div>
          </div>
        ))}
      </div>
      <motion.div
        className="mt-6 flex items-center gap-3"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', bounce: 0.4, duration: 0.5, delay: 2.2 }}
      >
        <span className="rounded-full bg-electric px-4 py-1.5 text-[24px] font-bold text-white tabular">−68%</span>
        <span className="text-[19px] text-ink-3">up to −78% on bigger plans</span>
      </motion.div>
    </div>
  )
}


export default function S15GoToMarket({ step }: SceneProps) {
  const count = COUNTS[step]
  const prev = step > 0 ? COUNTS[step - 1] : 0

  return (
    <div className="absolute inset-0 overflow-hidden bg-paper">
      <motion.div className="absolute left-[140px] top-[150px] text-[26px] font-semibold text-electric" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Go-to-market
      </motion.div>
      <div className="absolute left-[140px] top-[200px] w-[780px]">
        <Lines k={step} lines={HEAD[step]} className="display text-[92px] text-ink" delay={0.2} />
        <Fade k={`s${step}`} delay={0.6} className="lede mt-8 max-w-[640px] text-[28px] text-ink-2">
          {SUB[step]}
        </Fade>
      </div>

      {/* the lower-left panel: one simple picture per beat */}
      <div className="absolute left-[140px] top-[590px] w-[640px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.25 } }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
          >
            {step === 0 && <FreeStart />}
            {step === 1 && <NapkinMath />}
            {step === 2 && (
              <div className="flex flex-wrap gap-3">
                {['Referrals from happy merchants', 'COD merchant communities', '3–5 new merchants a week', '> 70% retention'].map((t, i) => (
                  <motion.div
                    key={t}
                    className="rounded-full bg-ink px-5 py-2.5 text-[22px] font-semibold text-white"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.4, duration: 0.5, delay: 0.8 + i * 0.12 }}
                  >
                    {t}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <Camera>
        {/* the counter */}
        <div className="absolute flex items-baseline gap-4" style={{ left: GX, top: 132 }}>
          <span className="text-[72px] font-bold leading-none tracking-[-0.03em] text-ink">
            <Counter to={count} />
          </span>
          <span className="text-[30px] font-semibold text-ink-3">/ 100 merchants</span>
        </div>

        {/* the wall */}
        <div className="absolute grid" style={{ left: GX, top: GY, gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`, gap: GAP }}>
          {Array.from({ length: 100 }, (_, i) => (
            <Store key={i} i={i} lit={i < count} delay={0.4 + Math.max(0, i - prev) * (1.4 / Math.max(1, count - prev))} />
          ))}
        </div>

        {/* the plan */}
        <div className="absolute flex justify-between" style={{ left: GX, top: GY + 10 * CELL + 9 * GAP + 26, width: 10 * CELL + 9 * GAP }}>
          {MILESTONES.map(([q, n], i) => (
            <div key={q} className={i === 0 ? 'text-left' : i === 2 ? 'text-right' : 'text-center'}>
              <div className={`text-[24px] font-semibold ${i === step ? 'text-electric' : i < step ? 'text-ink' : 'text-ink-4'}`}>{q}</div>
              <div className={`text-[30px] font-bold tabular ${i === step ? 'text-electric' : i < step ? 'text-ink' : 'text-ink-4'}`}>{n}</div>
            </div>
          ))}
        </div>
        <div className="absolute text-[20px] text-ink-3" style={{ left: GX, top: GY + 10 * CELL + 9 * GAP + 112 }}>
          Amber: pilots today. Blue: our plan for the next 12 months.
        </div>
      </Camera>
    </div>
  )
}
