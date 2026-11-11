import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { Bubble } from '../components/Chat'
import { Fade, Lines } from '../components/Type'
import { EASE, EASE_IN, rand, useReduced } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * Cold open: a quick test. The room plays along before the pitch starts.
 * 0 "Raise your hand if you've ever tried COD e-commerce." A giant WhatsApp bubble types out
 *   "ch7al?", the first message every COD seller gets.
 * 1 "Keep it up if you've ever answered this all night." The first bubble recedes; every
 *   spelling of the same question is thrown at the screen, piling up faster and faster while
 *   the screen shakes, to 247 unread.
 * 2 Freeze: "Hands down. We've all been buried here."
 *
 * Composition: electric stage. The question sits top-left; the bubble, monument-sized,
 * hangs below it, offset right and tilted. The storm fills everything except the question.
 */

const WORD = 'ch7al?'
const BLUE = '#1e6bff'
const PAPER = '#f4f7fb'
const G = { x: 380, y: 450 } // giant bubble anchor (its tail corner)

/* every way the same question arrives (Darija, Arabic script, French) */
const ASKS = [
  'ch7al?', 'شحال؟', 'Prix svp', 'bch7al?', 'Combien?', 'ch7al l’livraison?', 'chhal?', 'بشحال هادي؟',
  'Prix stp 🙏', 'ch7al???', 'Salam, ch7al?', 'Taman?', 'C combien?', 'ch7al f Casa?', 'شحال الثمن؟', '7al?',
  'prix?', 'Ch7al l’montre?', 'Kayna? ch7al?', 'Allo?? ch7al',
]
/* the merchant, trying to keep up */
const REPLIES = ['249 DH', 'Livraison fabor', '199 DH ✓', '259 DH']

type Storm = { text: string; side: 'in' | 'out'; x: number; y: number; size: number; rot: number; t: number; time: string; fx: number; fy: number; fr: number }

/*
 * Deterministic storm: frustration, not a table. Messages are thrown in from every
 * edge, land at angles and pile on top of each other, small and far, big and close,
 * faster and faster. Only the question block (top-left) and the counter stay clear.
 */
function buildStorm(n: number): Storm[] {
  const out: Storm[] = []
  for (let i = 0; i < n; i++) {
    const side = i % 8 === 5 ? 'out' : 'in'
    const text = side === 'out' ? REPLIES[Math.floor(i / 8) % REPLIES.length] : ASKS[i % ASKS.length]
    // depth: most messages mid-size, some far and small, a few big and close
    const d = rand(i, 1)
    const size = Math.round(d < 0.25 ? 22 + d * 24 : d < 0.85 ? 30 + (d - 0.25) * 22 : 46 + (d - 0.85) * 120)
    const w = text.length * size * 0.5 + size * 3.4
    let x = 0
    let y = 0
    for (let k = 0; k < 40; k++) {
      x = -40 + rand(i, 10 + k) * (1960 - w)
      y = 40 + rand(i, 60 + k) * (1060 - size * 2.4)
      const inQuestion = x < 1450 && y < 390
      const inCounter = x + w > 1330 && y < 240
      if (!inQuestion && !inCounter) break
    }
    const a = rand(i, 9) * Math.PI * 2 // the direction it's thrown from
    const m = 14 + i * 3
    out.push({
      text,
      side,
      x,
      y,
      size,
      rot: (rand(i, 7) - 0.5) * 26,
      t: 0.3 + 3.9 * Math.pow(i / n, 0.6), // gaps shrink: it accelerates
      time: `${21 + Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`,
      fx: Math.cos(a) * 900,
      fy: Math.sin(a) * 650,
      fr: (rand(i, 11) - 0.5) * 120,
    })
  }
  return out
}
const STORM = buildStorm(58)

/* the phone in your pocket that won't stop: the shake builds with the storm */
const SHAKE_X = [0, 0, -2, 3, -4, 5, -7, 8, -10, 11, -13, 13, -12, 0]
const SHAKE_Y = [0, 0, 1, -2, 3, -3, 4, -5, 6, -6, 7, -7, 5, 0]

/** The unread badge: 1 while the room answers, then racing to 247. */
function Unread({ step }: { step: number }) {
  const reduced = useReduced()
  const mv = useMotionValue(step >= 2 ? 247 : 1)
  const text = useTransform(() => Math.round(mv.get()).toString())
  useEffect(() => {
    if (step === 0) {
      mv.set(1)
      return
    }
    if (reduced || step >= 2) {
      mv.set(247)
      return
    }
    const c = animate(mv, 247, { duration: 3.6, ease: [0.55, 0, 0.9, 0.6], delay: 0.5 })
    return () => c.stop()
  }, [step, mv, reduced])
  return <motion.span className="tabular">{text}</motion.span>
}

/** WhatsApp's "typing…" dots, before the word lands. */
function Typing() {
  return (
    <motion.div
      className="absolute flex items-center gap-4 rounded-[44px] rounded-tl-none bg-white px-12 py-9"
      style={{ left: G.x, top: G.y }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.8] }}
      transition={{ duration: 1.5, times: [0, 0.2, 0.85, 1], delay: 0.6 }}
    >
      {[0, 1, 2].map((d) => (
        <motion.span
          key={d}
          className="block h-6 w-6 rounded-full bg-[#8696a0]"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  )
}

/** The word, at monument scale: a real WhatsApp bubble, set in the deck's display face. */
function Giant({ step }: { step: number }) {
  const reduced = useReduced()
  const storm = step >= 1
  const LAND = 1.95
  return (
    <motion.div
      className="absolute z-10"
      style={{ left: G.x, top: G.y, originX: 0, originY: 0 }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.25, rotate: -10, filter: 'blur(0px)' }}
      animate={
        storm
          ? // the first message recedes into soft focus: the storm builds in front of it
            { opacity: reduced ? 0.4 : 0.55, scale: 0.74, rotate: -2.5, x: 300, y: 10, filter: reduced ? 'none' : 'blur(7px)' }
          : { opacity: 1, scale: 1, rotate: -2.5, x: 0, y: 0, filter: 'blur(0px)' }
      }
      transition={storm ? { duration: 1.4, ease: EASE } : { type: 'spring', bounce: 0.32, duration: 0.9, delay: LAND }}
    >
      <div className="relative rounded-[64px] rounded-tl-none bg-white pb-20 pl-16 pr-20 pt-4 shadow-[0_80px_140px_-50px_rgba(6,16,43,0.75)]">
        {/* WhatsApp's tail, scaled up */}
        <svg className="absolute -left-[46px] top-0" width="48" height="78" viewBox="0 0 8 13" aria-hidden>
          <path fill="#ffffff" d="M1.533 3.568 8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568Z" transform="translate(0,-1)" />
        </svg>
        <div className="text-ink" style={{ fontSize: 330, fontWeight: 820, fontStretch: '76%', letterSpacing: '-0.045em', lineHeight: 1.02 }}>
          {WORD.split('').map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: reduced ? 0 : 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE, delay: LAND + 0.35 + i * 0.11 }}
            >
              {ch}
            </motion.span>
          ))}
        </div>
        <div className="absolute bottom-7 right-12 text-[40px] text-[#667781]" style={{ fontFamily: 'var(--font-sans)' }}>
          21:14
        </div>
        {/* the first unread: one message (the counter takes over in step 1) */}
        <motion.div
          className="absolute -right-10 -top-12 grid h-[112px] min-w-[112px] place-items-center rounded-full bg-wa-green px-7 text-[54px] font-bold text-white shadow-[0_20px_40px_-14px_rgba(0,0,0,0.5)]"
          initial={{ scale: 0 }}
          animate={{ scale: storm ? 0 : 1 }}
          transition={storm ? { duration: 0.3 } : { type: 'spring', bounce: 0.55, duration: 0.6, delay: LAND + 1.2 }}
        >
          1
        </motion.div>
      </div>
    </motion.div>
  )
}

const ASK: Record<number, string[]> = {
  0: ['Raise your hand if you’ve', 'ever tried COD e-commerce.'],
  1: ['Keep it up if you’ve ever', 'answered this all night.'],
}

export default function S02Chaos({ step }: SceneProps) {
  const reduced = useReduced()
  const storm = step >= 1
  const frozen = step >= 2
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: BLUE }}>
      {/* everything on the phone: the word and, later, the storm that buries it */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        style={{ willChange: 'transform' }}
        animate={{ scale: frozen ? 1.04 : storm ? 1.06 : 1 }}
        transition={{ duration: frozen ? 1.2 : 4.5, ease: frozen ? EASE : [0.4, 0, 0.6, 1] }}
      >
        {step === 0 && <Typing />}
        <Giant step={step} />
        <motion.div
          className="absolute inset-0"
          initial={{ x: 0, y: 0 }}
          animate={storm && !frozen && !reduced ? { x: SHAKE_X, y: SHAKE_Y } : { x: 0, y: 0 }}
          transition={storm && !frozen ? { duration: 4.6, delay: 0.3, ease: 'linear' } : { duration: 0.4 }}
        >
          {storm &&
            STORM.map((b, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: b.x, top: b.y, zIndex: 20 + i, maxWidth: 760, originX: 0.5, originY: 0.5 }}
                initial={reduced ? { opacity: 0 } : { opacity: 0, x: b.fx, y: b.fy, rotate: b.rot + b.fr, scale: 1.35 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: b.rot, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.28, duration: 0.75, delay: b.t, opacity: { duration: 0.15, delay: b.t } }}
              >
                <Bubble
                  side={b.side}
                  size={b.size}
                  time={b.time}
                  ticks={b.side === 'out'}
                  style={{ boxShadow: b.size > 44 ? '0 40px 60px -24px rgba(6,16,43,0.7)' : '0 18px 30px -16px rgba(6,16,43,0.55)' }}
                >
                  {b.text}
                </Bubble>
              </motion.div>
            ))}
        </motion.div>
      </motion.div>

      {/* the unread counter, above the storm: it leaves the bubble's corner and races */}
      <AnimatePresence>
        {storm && !frozen && (
          <motion.div
            key="unread"
            className="absolute right-[90px] top-[90px] z-[92] flex items-center gap-5 rounded-full bg-wa-green py-4 pl-5 pr-10 text-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]"
            style={{ originX: 1 }}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.3, x: -380, y: 330 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ type: 'spring', bounce: 0.3, duration: 0.9, delay: 0.15 }}
          >
            <span className="grid h-[92px] min-w-[150px] place-items-center rounded-full bg-white px-5 text-[64px] font-bold leading-none text-[#0b8a45]">
              <Unread step={step} />
            </span>
            <span className="text-[40px] font-semibold leading-none">unread</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* the question to the room */}
      <AnimatePresence>
        {!frozen && (
          <motion.div
            key="ask"
            className="absolute left-[140px] top-[96px] z-[90]"
            style={{ color: PAPER }}
            exit={{ opacity: 0, y: -30, filter: 'blur(8px)', transition: { duration: 0.4, ease: EASE_IN } }}
          >
            <motion.div
              className="flex items-center gap-4 text-[24px] font-semibold uppercase tracking-[0.22em] text-white/60"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            >
              <span className="h-[3px] w-12 bg-white/60" />
              First, a quick test
            </motion.div>
            {/* a soft plate behind the question once the storm arrives, so it always reads */}
            <motion.div
              className="absolute -inset-x-10 -bottom-8 top-12 -z-10 rounded-[40px]"
              style={{ background: BLUE }}
              initial={false}
              animate={{ opacity: storm ? 0.94 : 0 }}
              transition={{ duration: 0.6 }}
            />
            <Lines
              k={step}
              lines={ASK[Math.min(step, 1)]}
              className="mt-6"
              style={{ fontSize: 100, fontWeight: 760, fontStretch: '82%', letterSpacing: '-0.035em', lineHeight: 0.96 }}
              delay={0.3}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* freeze: the room is buried */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[95]"
        style={{
          background: 'rgba(11,19,36,0.8)',
          // the freeze blurs what's behind it; only mounted once the storm has stopped moving
          backdropFilter: frozen && !reduced ? 'blur(6px) saturate(0.3)' : undefined,
          WebkitBackdropFilter: frozen && !reduced ? 'blur(6px) saturate(0.3)' : undefined,
        }}
        initial={false}
        animate={{ opacity: frozen ? 1 : 0 }}
        transition={{ duration: 1.0, ease: EASE }}
      />
      {frozen && (
        <div className="absolute inset-x-[140px] top-[330px] z-[96]" style={{ color: PAPER }}>
          <Lines
            k="frozen"
            delay={0.5}
            lines={['Hands down.', 'We’ve all been buried here.']}
            style={{ fontSize: 140, fontWeight: 760, fontStretch: '82%', letterSpacing: '-0.035em', lineHeight: 0.96 }}
          />
          <Fade k="sub" delay={1.2} className="lede mt-12 max-w-[1150px] text-[40px] text-white/75">
            Every ping is a sale waiting to be confirmed, by hand. For a merchant, that’s 5–6 hours a day inside WhatsApp.
          </Fade>
        </div>
      )}
    </div>
  )
}
