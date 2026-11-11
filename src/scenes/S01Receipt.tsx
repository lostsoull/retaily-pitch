import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { Dashes, Paper, Row } from '../components/Receipt'
import { Fade, Lines } from '../components/Type'
import { EASE, rand, useReduced } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * HERO SCENE. One sale = 150 one-dirham cells on a thermal receipt.
 * 0  the sale prints                     "One order. 150 dirhams."
 * 1  costs grey out, 30 cells stay blue  "30 dirhams are yours."
 * 2  confirmation call: 15 cells fall    "Then one call takes 15."
 * 3  the day's stack fans out            "Half the margin. Every order."
 */

const COLS = 15
const CELL = 26
const GAP = 6
const TOTAL = 150
const COST = 120
const CALL = 15

const HEAD = [
  ['One order.', '150 dirhams.'],
  ['30 dirhams', 'are yours.'],
  ['Then one call', 'takes 15.'],
  ['Half the margin.', 'Every order.'],
]

const SUB = [
  'A cash-on-delivery sale, ordered on WhatsApp.',
  'What is left after product, ads and delivery.',
  'Confirming an order by phone costs 15 to 25 DH.',
  null,
]

const C = {
  ink: '#0b1324',
  cost: '#e1ded6',
  margin: '#1e6bff',
  loss: '#5b6475',
}

function cellColor(i: number, step: number) {
  if (step === 0) return C.ink
  if (i < COST) return C.cost
  if (step >= 2 && i >= TOTAL - CALL) return C.loss
  return C.margin
}

function Cell({ i, step }: { i: number; step: number }) {
  const row = Math.floor(i / COLS)
  const col = i % COLS
  const falls = i >= TOTAL - CALL
  const fallen = falls && step >= 2
  const k = i - (TOTAL - CALL) // 0..14 for the falling row
  const fallDelay = 0.55 + rand(i, 3) * 0.35 + k * 0.035
  return (
    <motion.div
      className="rounded-[7px]"
      style={{ width: CELL, height: CELL }}
      initial={{ opacity: 0, scale: 0.4, backgroundColor: C.ink }}
      animate={{
        opacity: fallen ? 0 : 1,
        scale: 1,
        backgroundColor: cellColor(i, step),
        y: fallen ? 620 + rand(i, 1) * 260 : 0,
        x: fallen ? (rand(i, 2) - 0.5) * 220 : 0,
        rotate: fallen ? (rand(i, 4) - 0.5) * 260 : 0,
      }}
      transition={{
        // print-in: row by row, like a thermal head
        default: { duration: 0.5, ease: EASE, delay: 0.75 + row * 0.06 + col * 0.008 },
        backgroundColor: {
          duration: 0.45,
          ease: 'easeOut',
          delay: step === 1 ? (row * COLS + col) * 0.004 : fallen ? k * 0.02 : 0,
        },
        y: fallen
          ? { duration: 1.25, ease: [0.55, 0, 0.9, 0.45], delay: fallDelay }
          : { type: 'spring', bounce: 0.2, duration: 0.8, delay: k * 0.02 },
        x: fallen ? { duration: 1.25, ease: 'easeOut', delay: fallDelay } : { duration: 0.6, ease: EASE },
        rotate: fallen ? { duration: 1.25, ease: 'easeIn', delay: fallDelay } : { duration: 0.6, ease: EASE },
        opacity: fallen ? { duration: 0.35, delay: fallDelay + 0.9 } : { duration: 0.3, delay: step === 0 ? 0.75 + row * 0.06 : 0 },
      }}
    />
  )
}

function MarginValue({ step }: { step: number }) {
  const reduced = useReduced()
  const target = step === 0 ? 150 : step === 1 ? 30 : 15
  const mv = useMotionValue(target)
  const text = useTransform(() => mv.get().toFixed(2))
  useEffect(() => {
    if (reduced) {
      mv.set(target)
      return
    }
    const c = animate(mv, target, { duration: step >= 2 ? 1.4 : 0.9, ease: EASE, delay: step >= 2 ? 0.6 : 0.2 })
    return () => c.stop()
  }, [target, step, mv, reduced])
  return <motion.span>{text}</motion.span>
}

/** Simplified back copies of the receipt that fan out in the last step. */
function Ghost({ n, show }: { n: number; show: boolean }) {
  const angle = [-8, -4, 5, 9.5, 2][n]
  const dx = [-90, -40, 130, 250, 60][n]
  const dy = [60, 25, 35, 80, -12][n]
  return (
    <motion.div
      className="absolute left-0 top-0 w-full"
      initial={false}
      animate={show ? { opacity: 1, x: dx, y: dy, rotate: angle } : { opacity: 0, x: 0, y: 0, rotate: 0 }}
      transition={{ type: 'spring', bounce: 0.18, duration: 1.0, delay: show ? 0.15 + n * 0.07 : 0 }}
    >
      <Paper className="px-12 pt-11" style={{ height: 900 }} shadow="0 16px 26px rgba(6,16,43,0.13)">
        <div className="space-y-5 opacity-60">
          <div className="h-5 w-56 rounded bg-paper-2" />
          <div className="h-4 w-40 rounded bg-paper-2" />
          <div className="h-4 w-full rounded bg-paper-2" />
        </div>
        <div className="mt-[520px] text-right text-[34px] font-semibold text-loss tabular">-15.00</div>
      </Paper>
    </motion.div>
  )
}

export default function S01Receipt({ step }: SceneProps) {
  const fan = step >= 3
  return (
    <div className="absolute inset-0 bg-paper">
      {/* copy column */}
      <div className="absolute left-[140px] top-[300px] w-[940px]">
        <Lines k={step} lines={HEAD[step]} className="display text-ink text-[124px]" />
        <div className="mt-12 h-[150px]">
          {SUB[step] ? (
            <Fade k={step} className="lede text-ink-2 text-[40px] max-w-[760px]">
              {SUB[step]}
            </Fade>
          ) : (
            <Fade k="quote" className="max-w-[820px]" delay={0.5}>
              <p className="lede text-ink text-[40px]">
                “My store did 20 orders a day. That was 300 DH a day spent on phone calls.”
              </p>
              <p className="mt-5 text-[28px] text-ink-3">Sifeddine, Founder, before RetailyAI</p>
            </Fade>
          )}
        </div>
      </div>

      {/* printer slot */}
      <motion.div
        className="absolute left-[1110px] top-[34px] h-[30px] w-[668px] rounded-full bg-ink"
        initial={{ opacity: 0, scaleX: 0.6 }}
        animate={{ opacity: fan ? 0 : 1, scaleX: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      />

      {/* receipt; clipped only at the top so it emerges from the slot, while falling cells escape below */}
      <motion.div
        className="absolute left-[1144px] top-[49px] w-[600px]"
        initial={false}
        animate={{
          clipPath: fan ? 'inset(-400px -600px -1200px -600px)' : 'inset(0px -600px -1200px -600px)',
          scale: fan ? 0.84 : 1,
          x: fan ? 30 : 0,
          y: fan ? 50 : 0,
        }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ transformOrigin: '50% 30%' }}
      >
        {[0, 1, 2, 3, 4].map((n) => (
          <Ghost key={n} n={n} show={fan} />
        ))}

        <motion.div
          initial={{ y: -980 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.3, ease: [0.3, 0.7, 0.2, 1] }}
          className="relative"
        >
          <Paper className="px-12 pt-10">
            <div className="text-center">
              <div className="text-[30px] font-semibold tracking-[0.12em]">BOUTIQUE SALMA</div>
              <div className="mt-1 text-[22px] text-ink-3">Casablanca</div>
            </div>
            <Row className="mt-6 text-[22px] text-ink-3" label="ORDER #2087" value="COD" />
            <Dashes className="mt-5" />
            <Row className="mt-5 text-[30px] font-medium" label="Linen set, beige" value="150.00" />

            <div className="mt-6 grid" style={{ gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`, gap: GAP }}>
              {Array.from({ length: TOTAL }, (_, i) => (
                <Cell key={i} i={i} step={step} />
              ))}
            </div>
            <div className="mt-3 text-[20px] text-ink-3">1 square = 1 DH</div>

            <Dashes className="mt-5" />
            <div className="mt-4 h-[84px] text-[25px]">
              <motion.div initial={false} animate={{ opacity: step >= 1 ? 1 : 0, x: step >= 1 ? 0 : -12 }} transition={{ duration: 0.5, ease: EASE, delay: step === 1 ? 0.35 : 0 }}>
                <Row label="Product, ads, delivery" value="-120.00" className="text-ink-3" />
              </motion.div>
              <motion.div initial={false} animate={{ opacity: step >= 2 ? 1 : 0, x: step >= 2 ? 0 : -12 }} transition={{ duration: 0.5, ease: EASE, delay: step === 2 ? 0.15 : 0 }}>
                <Row label="Confirmation call" value="-15.00" className="mt-2 font-semibold text-loss" />
              </motion.div>
            </div>
            <div className="mt-3 border-t-[3px] border-ink" />
            <Row
              className="mt-4 pb-8 text-[38px] font-semibold"
              label={step === 0 ? 'SALE' : 'MARGIN'}
              value={
                <span className={step >= 2 ? 'text-loss' : step === 1 ? 'text-electric' : ''}>
                  <MarginValue step={step} />
                </span>
              }
            />
          </Paper>
        </motion.div>
      </motion.div>
    </div>
  )
}
