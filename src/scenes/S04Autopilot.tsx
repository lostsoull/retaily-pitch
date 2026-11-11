import { motion } from 'motion/react'
import { Fade } from '../components/Type'
import { EASE } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * "Autopilot, with brakes."
 * 0  routine orders run through the checkpoint and confirm themselves (blue = done by the AI)
 * 1  an address change arrives: the barrier drops, the card stops, amber "Waiting for you"
 */

const TRACK_Y = 640
const GATE_X = 1180
const CARD_W = 380

const ROUTINE = [
  { id: '#2091', item: 'Robe fille à fleurs', price: '199 DH' },
  { id: '#2092', item: 'Survêtement garçon', price: '259 DH' },
  { id: '#2093', item: 'Pyjama licorne', price: '149 DH' },
]

function OrderCard({
  id,
  item,
  price,
  chip,
  chipTone,
}: {
  id: string
  item: string
  price: string
  chip: React.ReactNode
  chipTone: 'new' | 'ai' | 'brake'
}) {
  const tone = {
    new: 'bg-paper text-ink-3',
    ai: 'bg-electric text-white',
    brake: 'bg-brake text-ink',
  }[chipTone]
  return (
    <div
      className="rounded-[24px] bg-white px-7 py-6 shadow-[0_30px_50px_-30px_rgba(6,16,43,0.45),0_0_0_1px_rgba(6,16,43,0.06)]"
      style={{ width: CARD_W }}
    >
      <div className="flex items-center justify-between text-[22px] text-ink-3">
        <span className="font-mono">{id}</span>
        <span className="font-semibold text-ink tabular">{price}</span>
      </div>
      <div className="mt-2 truncate text-[27px] font-semibold text-ink">{item}</div>
      <div className={`mt-4 inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 text-[21px] font-semibold ${tone}`}>{chip}</div>
    </div>
  )
}

function Routine({ n }: { n: number }) {
  const o = ROUTINE[n]
  const parkX = 1380 + n * 26
  const parkY = -n * 22
  const d = 0.5 + n * 0.75
  return (
    <motion.div
      className="absolute"
      style={{ left: 0, top: TRACK_Y - 90, zIndex: 3 - n }}
      initial={{ x: -420, y: 0, opacity: 1 }}
      animate={{ x: [-420, GATE_X - CARD_W - 20, GATE_X + 30, parkX], y: [0, 0, 0, parkY] }}
      transition={{ duration: 2.2, delay: d, times: [0, 0.45, 0.62, 1], ease: ['easeOut', 'linear', 'easeOut'] }}
    >
      <div className="relative">
        <OrderCard id={o.id} item={o.item} price={o.price} chip="New order" chipTone="new" />
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1] }}
          transition={{ duration: 2.2, delay: d, times: [0, 0.5, 0.58] }}
        >
          <OrderCard
            id={o.id}
            item={o.item}
            price={o.price}
            chipTone="ai"
            chip={
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m4 12.5 5 5L20 6.5" />
                </svg>
                Confirmed by RetailyAI
              </>
            }
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function S04Autopilot({ step }: SceneProps) {
  const brake = step >= 1
  return (
    <div className="absolute inset-0 bg-paper">
      {/* headline builds: "Autopilot" then ", with brakes." */}
      <div className="absolute left-[140px] top-[110px] display text-[150px] text-ink">
        <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span className="inline-block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}>
            Autopilot
          </motion.span>
        </span>
        <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block text-ink"
            initial={false}
            animate={{ y: brake ? '0%' : '105%', opacity: brake ? 1 : 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: brake ? 0.9 : 0 }}
          >
            , with brakes.
          </motion.span>
        </span>
      </div>

      {/* track */}
      <div className="absolute left-0 right-0 h-[6px] rounded-full bg-line" style={{ top: TRACK_Y + 90 }} />
      <svg className="absolute left-0" style={{ top: TRACK_Y + 88 }} width="1920" height="10" aria-hidden>
        <line x1="0" y1="5" x2="1920" y2="5" stroke="#c9c5bc" strokeWidth="3" strokeDasharray="2 22" strokeLinecap="round" />
      </svg>

      {/* checkpoint post and barrier arm */}
      <div className="absolute" style={{ left: GATE_X - 16, top: TRACK_Y - 150 }}>
        <div className="h-[246px] w-[32px] rounded-t-xl bg-ink" />
        <motion.div
          className="absolute top-[14px] h-[28px] w-[330px] rounded-full"
          style={{
            left: 16 - 330 + 14,
            background: 'repeating-linear-gradient(90deg, #0b1324 0 44px, #b88a2e 44px 88px)',
            transformOrigin: '316px 14px',
          }}
          initial={false}
          animate={{ rotate: brake ? 0 : 90 }}
          transition={brake ? { type: 'spring', bounce: 0.4, duration: 0.8, delay: 1.25 } : { duration: 0.4, ease: EASE }}
        />
        <div className="absolute left-[4px] top-[16px] h-[24px] w-[24px] rounded-full border-4 border-ink bg-brake" />
      </div>

      {ROUTINE.map((_, n) => (
        <Routine key={n} n={n} />
      ))}

      {/* the risky one */}
      <motion.div
        className="absolute"
        style={{ left: 0, top: TRACK_Y - 90, zIndex: 5 }}
        initial={false}
        animate={{ x: brake ? GATE_X - CARD_W - 60 : -460, opacity: brake ? 1 : 0 }}
        transition={brake ? { type: 'spring', bounce: 0.18, duration: 1.6, delay: 0.2 } : { duration: 0.5, ease: EASE }}
      >
        <OrderCard
          id="#2094"
          item="Ensemble lin, beige"
          price="250 DH"
          chipTone="brake"
          chip={
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
                <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
                <circle cx="12" cy="9.5" r="2.4" />
              </svg>
              Address change
            </>
          }
        />
        <motion.div
          className="mt-6 flex items-center gap-3 text-[28px] font-semibold text-ink"
          initial={false}
          animate={{ opacity: brake ? 1 : 0 }}
          transition={{ duration: 0.5, delay: brake ? 1.7 : 0 }}
        >
          <span className="relative flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brake opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-brake" />
          </span>
          Waiting for you
        </motion.div>
      </motion.div>

      <div className="absolute bottom-[96px] left-[140px] w-[1100px]">
        <Fade k={step} className="lede text-[38px] text-ink-2" delay={brake ? 1.9 : 3.2}>
          {brake
            ? 'Anything risky stops and waits for the merchant. It never changes an order on its own.'
            : 'Routine questions and confirmations run on their own, from the merchant’s own data.'}
        </Fade>
      </div>
    </div>
  )
}
