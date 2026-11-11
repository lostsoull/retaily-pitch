import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { Bubble } from '../components/Chat'
import { BOX, Camera, GAP, Reveal } from '../components/Cine'
import { Fade, Lines } from '../components/Type'
import { EASE, EASE_IN, useReduced } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * Business model, told like prepaid phone credit (every Moroccan knows "recharge").
 * 0 one reply = one credit: each AI reply ticks the balance down
 * 1 a free tier (200 credits) and four monthly plans, dealt like recharge cards
 *   (prices, credits, deliveries and savings vs an agency from the pitch deck)
 * 2 ran out? top up: the balance runs low, a scratch card is thrown over the plans and refills it
 * Balance figures are illustrative; plan prices are real.
 *
 * Composition: the balance spans BOX's top band; the lower band is always filled
 * edge to edge (chat, then four full-height cards). The top-up is the one thrown object.
 */

/* plans from the pitch deck; one credit = one AI reply, WhatsApp template fees included */
type Plan = { name: string; price: string; credits: string; deliveries?: string; save?: string; free?: boolean }
const PLANS: Plan[] = [
  { name: 'Free', price: '0', credits: '200', free: true },
  { name: 'Launch', price: '190', credits: '600', deliveries: '30', save: '−68%' },
  { name: 'Starter', price: '390', credits: '1,400', deliveries: '70', save: '−72%' },
  { name: 'Growth', price: '790', credits: '3,200', deliveries: '160', save: '−75%' },
  { name: 'Scale', price: '1,800', credits: '8,000', deliveries: '400', save: '−78%' },
]

const BAL_H = 250
const LOW_Y = BOX.y + BAL_H + GAP
const LOW_H = BOX.b - LOW_Y
const PLAN_GAP = 18
const PLAN_W = (BOX.w - (PLANS.length - 1) * PLAN_GAP) / PLANS.length
const TOPUP_W = 470

const CHAT: { side: 'in' | 'out'; text: string }[] = [
  { side: 'in', text: 'Salam, ch7al?' },
  { side: 'out', text: '249 DH, livraison fabor.' },
  { side: 'in', text: 'Kayna f noir?' },
  { side: 'out', text: 'Ah kayna! Bghiti wa7da?' },
  { side: 'in', text: 'Ah, Hay Hassani, Casa' },
  { side: 'out', text: 'Tconfirmat la commande ✓' },
]
const REPLY_AT = (i: number) => 0.9 + i * 0.55 // when bubble i appears

function Balance({ step }: { step: number }) {
  const reduced = useReduced()
  const mv = useMotionValue(1240)
  const text = useTransform(() => Math.round(mv.get()).toLocaleString('en-US'))
  const pct = useTransform(() => `${Math.min(100, (mv.get() / 1240) * 100)}%`)
  const low = useTransform(() => (mv.get() < 100 ? '#5b6475' : '#1e6bff'))
  useEffect(() => {
    if (reduced) {
      mv.set(step === 2 ? 1012 : 1237)
      return
    }
    if (step === 0) {
      // three AI replies, one credit each
      const c = animate(mv, [1240, 1240, 1239, 1239, 1238, 1238, 1237], {
        duration: REPLY_AT(5) + 0.6,
        times: [0, REPLY_AT(1) / 4, REPLY_AT(1) / 4 + 0.03, REPLY_AT(3) / 4, REPLY_AT(3) / 4 + 0.03, REPLY_AT(5) / 4.1, 1],
        ease: 'linear',
      })
      return () => c.stop()
    }
    if (step === 1) {
      mv.set(1237)
      return
    }
    // a busy month: down to 12, then the top-up lands
    const c = animate(mv, [1237, 12, 12, 1012], { duration: 3.8, times: [0, 0.3, 0.66, 0.84], ease: 'easeInOut' })
    return () => c.stop()
  }, [step, mv, reduced])

  return (
    <div className="flex flex-col justify-between rounded-[30px] bg-ink px-10 py-8 text-white shadow-[0_40px_80px_-40px_rgba(6,16,43,0.7)]" style={{ height: BAL_H }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[24px] text-white/60">Reply credits</div>
          <motion.div className="mt-1 text-[110px] font-bold leading-none tracking-[-0.03em] tabular" style={{ color: '#fff' }}>
            {text}
          </motion.div>
        </div>
        <AnimatePresence mode="wait">
          {step === 2 ? (
            <motion.div
              key="low"
              className="mt-2 rounded-full bg-loss px-5 py-2 text-[20px] font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.0, times: [0, 0.25, 0.85, 1], delay: 0.6 }}
            >
              Credits are almost exhausted
            </motion.div>
          ) : (
            <motion.div key="ok" className="mt-2 rounded-full bg-white/10 px-5 py-2 text-[20px] font-semibold text-white/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              1 AI reply = 1 credit
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full rounded-full" style={{ width: pct, background: low }} />
      </div>
    </div>
  )
}

/** A plan, styled as a prepaid recharge card, dealt in from the right. */
function PlanCard({ p, i, dim }: { p: Plan; i: number; dim: boolean }) {
  const reduced = useReduced()
  const dark = i === PLANS.length - 1
  const n = PLANS.length
  const tone = p.free
    ? { bg: '#e3edff', fg: '#1450d9', line: 'rgba(30,107,255,0.25)', chip: 'bg-electric text-white' }
    : dark
      ? { bg: '#0b1324', fg: '#ffffff', line: 'rgba(255,255,255,0.16)', chip: 'bg-white/15 text-white' }
      : { bg: '#ffffff', fg: '#0b1324', line: 'rgba(6,16,43,0.1)', chip: 'bg-electric-soft text-electric' }
  return (
    <motion.div
      className="relative flex flex-col overflow-hidden rounded-[24px] px-5 pb-5 pt-6"
      style={{
        width: PLAN_W,
        height: LOW_H,
        background: tone.bg,
        color: tone.fg,
        boxShadow: p.free ? 'inset 0 0 0 2px rgba(30,107,255,0.35)' : '0 30px 60px -34px rgba(6,16,43,0.45), 0 0 0 1px rgba(6,16,43,0.08)',
        transformPerspective: 1600,
      }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: 760 - i * 170, y: -80, rotate: 16 - i * 3, rotateY: -35 }}
      animate={{ opacity: dim ? 0.35 : 1, x: 0, y: 0, rotate: 0, rotateY: 0 }}
      transition={{ type: 'spring', bounce: 0.2, duration: 1.2, delay: dim ? 0 : 0.5 + (n - 1 - i) * 0.13 }}
    >
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border-[14px] border-current opacity-10" />
      <div className="text-[23px] font-semibold">{p.name}</div>
      <div className="mt-4 text-[46px] font-bold leading-none tracking-[-0.03em] tabular">{p.price}</div>
      <div className="mt-1.5 text-[16px] opacity-60">{p.free ? 'MAD, to start' : 'MAD / month'}</div>

      <div className="mt-auto border-t pt-4" style={{ borderColor: tone.line }}>
        <div className="text-[30px] font-semibold leading-none tabular">{p.credits}</div>
        <div className="mt-1 text-[16px] opacity-60">credits</div>
        <div className="mt-3 text-[18px] font-medium">{p.deliveries ? `≈ ${p.deliveries} deliveries` : 'Try it on real chats'}</div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-[17px] font-semibold tabular ${tone.chip}`}>{p.save ?? 'Freemium'}</span>
        {p.save && <span className="text-[15px] leading-tight opacity-60">vs agency</span>}
      </div>
    </motion.div>
  )
}

/** The top-up, as a scratch card, thrown over the plans. */
function TopUp() {
  const reduced = useReduced()
  return (
    <motion.div
      className="relative flex flex-col overflow-hidden rounded-[26px] bg-white pb-7 shadow-[0_50px_80px_-30px_rgba(6,16,43,0.6),0_0_0_1px_rgba(6,16,43,0.08)]"
      style={{ width: TOPUP_W, height: LOW_H }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: 460, y: -140, rotate: 20 }}
      animate={{ opacity: 1, x: 0, y: 0, rotate: -3 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', bounce: 0.25, duration: 1.2, delay: 1.3 }}
    >
      <div className="px-7 pt-7 text-[30px] font-semibold text-ink">Top-up</div>
      <div className="mt-1 px-7 text-[21px] text-ink-3">Added to your balance instantly</div>
      <div className="relative mx-7 mt-auto h-[170px] overflow-hidden rounded-2xl bg-electric-soft">
        <div className="grid h-full place-items-center text-[52px] font-bold text-electric">+ credits ✓</div>
        {/* the silver scratch layer, wiped away left to right */}
        <motion.div
          className="absolute inset-0"
          style={{ background: 'repeating-linear-gradient(135deg,#c9cfdc 0 10px,#b7bfd0 10px 20px)' }}
          initial={{ clipPath: 'inset(0 0 0 0%)' }}
          animate={{ clipPath: 'inset(0 0 0 100%)' }}
          transition={{ duration: 0.9, ease: 'easeInOut', delay: 2.3 }}
        />
      </div>
      <div className="mx-7 mt-6 text-[22px] text-ink-3">Same plan, no interruption. The agent keeps answering.</div>
    </motion.div>
  )
}

const HEAD = [
  ['You pay', 'per reply.'],
  ['Pick a monthly', 'plan.'],
  ['Ran out?', 'Top up.'],
]
const SUB = [
  'Every message the agent sends uses one credit: an answer, a confirmation, a follow-up. Nothing is charged per order.',
  'Start free with 200 credits. Plans are sold in deliveries per month, the unit merchants already think in. WhatsApp fees included.',
  'Like recharging your phone. Top up in a tap and the agent never stops mid-conversation.',
]

export default function S12Model({ step }: SceneProps) {
  const reduced = useReduced()
  return (
    <div className="absolute inset-0 overflow-hidden bg-paper">
      <Camera>
        {/* the balance, always on top */}
        <Reveal shot="drop" delay={0.2} duration={1.3} className="absolute" style={{ left: BOX.x, top: BOX.y, width: BOX.w }}>
          <Balance step={step} />
        </Reveal>

        {/* 0 · replies spend credits */}
        <AnimatePresence>
          {step === 0 && (
            <motion.div
              key="chat"
              className="absolute flex flex-col justify-end gap-3 rounded-[26px] p-6"
              style={{ left: BOX.x, top: LOW_Y, width: BOX.w, height: LOW_H, background: '#efeae2' }}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 160, rotateX: 30, transformPerspective: 1600 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 200, filter: 'blur(10px)', transition: { duration: 0.5, ease: EASE_IN } }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.35 }}
            >
              {CHAT.map((m, i) => (
                <motion.div
                  key={i}
                  className={`relative flex items-center gap-4 ${m.side === 'out' ? 'self-end' : ''}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE, delay: REPLY_AT(i) }}
                >
                  {m.side === 'out' && (
                    <motion.span
                      className="rounded-full bg-electric px-3 py-1 text-[18px] font-bold text-white"
                      initial={{ opacity: 0, y: 0, scale: 0.6 }}
                      animate={{ opacity: [0, 1, 1, 0], y: [0, 0, -40, -300], scale: [0.6, 1, 1, 0.7] }}
                      transition={{ duration: 1.4, times: [0, 0.2, 0.5, 1], delay: REPLY_AT(i) + 0.3 }}
                    >
                      −1 credit
                    </motion.span>
                  )}
                  <Bubble side={m.side} size={24} ticks={m.side === 'out'}>
                    {m.text}
                  </Bubble>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1-2 · plans as recharge cards, filling the lower band */}
        {step >= 1 && (
          <div className="absolute flex" style={{ left: BOX.x, top: LOW_Y, gap: PLAN_GAP }}>
            {PLANS.map((p, i) => (
              <PlanCard key={p.name} p={p} i={i} dim={step === 2} />
            ))}
          </div>
        )}

        {/* 2 · the top-up, thrown over the plans */}
        <AnimatePresence>
          {step === 2 && (
            <motion.div key="topup" className="absolute z-10" style={{ left: BOX.r - TOPUP_W + 20, top: LOW_Y }}>
              <TopUp />
            </motion.div>
          )}
        </AnimatePresence>
      </Camera>

      <motion.div
        className="absolute left-[140px] top-[150px] text-[26px] font-semibold text-electric"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
      >
        Business model
      </motion.div>
      <div className="absolute left-[140px] top-[210px] w-[640px]">
        <Lines k={step} lines={HEAD[step]} className="display text-[104px] text-ink" delay={0.25} />
        <Fade k={`s${step}`} delay={0.8} className="lede mt-10 text-[31px] text-ink-2">
          {SUB[step]}
        </Fade>
      </div>
    </div>
  )
}
