import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE } from '../deck/motion'

/*
 * "Autopilot, with brakes", compact: routine orders run through the checkpoint
 * and confirm themselves; an action set to "Ask me first" stops at the barrier
 * and waits for the owner. Lives in a 920 x 340 box.
 */

const W = 920
const TRACK_Y = 250 // card bottoms rest here
const GATE_X = 560
const CARD_W = 280

const ROUTINE = [
  { id: '#2091', item: 'Robe fille à fleurs', price: '199 DH' },
  { id: '#2092', item: 'Survêtement garçon', price: '259 DH' },
  { id: '#2093', item: 'Pyjama licorne', price: '149 DH' },
]

function OrderCard({ id, item, price, chip, tone }: { id: string; item: string; price: string; chip: ReactNode; tone: 'new' | 'ai' | 'brake' }) {
  const t = { new: 'bg-paper text-ink-3', ai: 'bg-electric text-white', brake: 'bg-brake text-ink' }[tone]
  return (
    <div className="rounded-[20px] bg-white px-5 py-4 shadow-[0_24px_40px_-26px_rgba(6,16,43,0.5),0_0_0_1px_rgba(6,16,43,0.07)]" style={{ width: CARD_W }}>
      <div className="flex items-center justify-between text-[18px] text-ink-3">
        <span className="font-mono">{id}</span>
        <span className="font-semibold text-ink tabular">{price}</span>
      </div>
      <div className="mt-1 truncate text-[22px] font-semibold text-ink">{item}</div>
      <div className={`mt-3 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[17px] font-semibold ${t}`}>{chip}</div>
    </div>
  )
}

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
)

function Routine({ n }: { n: number }) {
  const o = ROUTINE[n]
  const d = 0.4 + n * 0.7
  const park = W - CARD_W - (2 - n) * 18
  return (
    <motion.div
      className="absolute left-0"
      style={{ top: TRACK_Y - 128 - n * 0, zIndex: 3 - n }}
      initial={{ x: -CARD_W - 40, y: 0 }}
      animate={{ x: [-CARD_W - 40, GATE_X - CARD_W - 16, GATE_X + 30, park], y: [0, 0, 0, -n * 16] }}
      transition={{ duration: 2.0, delay: d, times: [0, 0.45, 0.62, 1], ease: ['easeOut', 'linear', 'easeOut'] }}
    >
      <div className="relative">
        <OrderCard {...o} chip="Confirm order" tone="new" />
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1] }}
          transition={{ duration: 2.0, delay: d, times: [0, 0.5, 0.58] }}
        >
          <OrderCard
            {...o}
            tone="ai"
            chip={
              <>
                <Check /> Done alone
              </>
            }
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export function BrakeTrack() {
  const riskyDelay = 2.4
  return (
    <div className="relative overflow-hidden" style={{ width: W, height: 340 }}>
      {/* track */}
      <div className="absolute inset-x-0 h-[6px] rounded-full bg-line" style={{ top: TRACK_Y + 12 }} />

      {/* checkpoint post and barrier */}
      <div className="absolute" style={{ left: GATE_X - 14, top: TRACK_Y - 150 }}>
        <div className="h-[168px] w-[28px] rounded-t-xl bg-ink" />
        <motion.div
          className="absolute top-[14px] h-[24px] w-[250px] rounded-full"
          style={{
            left: 14 - 250 + 12,
            background: 'repeating-linear-gradient(90deg, #0b1324 0 36px, #b88a2e 36px 72px)',
            transformOrigin: '238px 12px',
          }}
          initial={{ rotate: 90 }}
          animate={{ rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.4, duration: 0.8, delay: riskyDelay + 1.0 }}
        />
        <div className="absolute left-[3px] top-[15px] h-[22px] w-[22px] rounded-full border-4 border-ink bg-brake" />
      </div>

      {ROUTINE.map((_, n) => (
        <Routine key={n} n={n} />
      ))}

      {/* the action that needs the owner */}
      <motion.div
        className="absolute left-0"
        style={{ top: TRACK_Y - 128, zIndex: 5 }}
        initial={{ x: -CARD_W - 60 }}
        animate={{ x: GATE_X - CARD_W - 44 }}
        transition={{ type: 'spring', bounce: 0.16, duration: 1.5, delay: riskyDelay }}
      >
        <OrderCard
          id="#2094"
          item="Ensemble lin, beige"
          price="250 DH"
          tone="brake"
          chip={
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
                <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
                <circle cx="12" cy="9.5" r="2.4" />
              </svg>
              Change address
            </>
          }
        />
        <motion.div
          className="mt-5 flex items-center gap-3 text-[24px] font-semibold text-ink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: riskyDelay + 1.5 }}
        >
          <span className="relative flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brake opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-brake" />
          </span>
          Waiting for you
        </motion.div>
      </motion.div>
    </div>
  )
}
