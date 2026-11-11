import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE, useReduced } from '../deck/motion'

/*
 * The order pipeline shared by the problem and the solution scenes.
 * Orders flow left to right, from WhatsApp to "Confirmed". Five stations sit on
 * the lane; each can be off, broken (the manual way) or fixed (RetailyAI), and the
 * orders' journeys are computed from those states: they queue, fall, lose an
 * upsell, vanish at night or shed a coin.
 */

export type St = 'off' | 'broken' | 'fixed'
export type Stations = { gate: St; hole: St; upsell: St; night: St; toll: St }

const LANE_Y = 600
const LANE_H = 112
const X0 = 150
const END = 1680
const G = { gate: 430, hole: 710, upsell: 990, night: 1260, toll: 1530 }
const SPEED = 240 // px per second
const TOTAL = 10.5 // seconds per loop
const N = 7 // orders on the lane at once
const TW = 104 // order card width

type Frame = { t: number; x: number; y: number; o: number }
type Key = [number, number] // [time, value]

function journey(i: number, s: Stations) {
  const f: Frame[] = [
    { t: 0, x: X0 - 50, y: 0, o: 0 },
    { t: 0.3, x: X0, y: 0, o: 1 },
  ]
  let t = 0.3
  let x = X0
  const go = (nx: number) => {
    t += Math.max(nx - x, 0) / SPEED
    x = nx
    f.push({ t, x, y: 0, o: 1 })
  }
  const hold = (d: number) => {
    t += d
    f.push({ t, x, y: 0, o: 1 })
  }
  let tU: number | undefined
  let tT: number | undefined

  if (s.gate === 'broken') {
    go(G.gate - TW - 18 - (i % 3) * 12)
    hold(2.3)
  }
  if (s.hole === 'broken' && i % 3 === 1) {
    go(G.hole - TW / 2)
    t += 0.7
    f.push({ t, x: x + 26, y: 190, o: 0 })
  } else {
    go(G.upsell - TW / 2)
    tU = t
    if (s.night === 'broken' && i % 3 === 2) {
      go(G.night - TW / 2 - 30)
      t += 0.8
      f.push({ t, x: x + 50, y: 0, o: 0 })
    } else {
      go(G.toll - TW / 2)
      tT = t
      go(END - TW)
      t += 0.35
      f.push({ t, x: END - TW + 20, y: 0, o: 0 })
    }
  }
  const last = f[f.length - 1]
  if (last.t < TOTAL) f.push({ ...last, t: TOTAL })
  return { f, tU, tT }
}

/** Keyframes from [time, value] pairs, with strictly increasing normalised times. */
function keys(pts: Key[]) {
  const out: Key[] = []
  for (const [t, v] of pts) {
    const tt = Math.min(Math.max(t, out.length ? out[out.length - 1][0] + 0.001 : 0), TOTAL)
    out.push([tt, v])
  }
  if (out[out.length - 1][0] < TOTAL) out.push([TOTAL, out[out.length - 1][1]])
  return { values: out.map((k) => k[1]), times: out.map((k) => k[0] / TOTAL) }
}

function OrderToken({ i, s }: { i: number; s: Stations }) {
  const reduced = useReduced()
  const { f, tU, tT } = journey(i, s)
  const loop = { duration: TOTAL, ease: 'linear' as const, repeat: Infinity, delay: -(i * TOTAL) / N }

  if (reduced) {
    // Static frame: park orders in the gaps between stations.
    const x = [230, 500, 800, 1380, 1560][i]
    if (x === undefined) return null
    return (
      <div className="absolute" style={{ left: x, top: LANE_Y - 26 }}>
        <Card />
      </div>
    )
  }

  const times = f.map((k) => k.t / TOTAL)
  const badge =
    tU === undefined || s.upsell === 'off'
      ? null
      : s.upsell === 'broken'
        ? keys([[0, 0], [tU, 0], [tU + 0.15, 1], [tU + 0.8, 1], [tU + 1.3, 0]])
        : keys([[0, 0], [tU, 0], [tU + 0.2, 1]])
  const coin = tT === undefined || s.toll !== 'broken' ? null : keys([[0, 0], [tT, 0], [tT + 0.08, 1], [tT + 1.0, 0]])
  const coinY = tT === undefined || s.toll !== 'broken' ? null : keys([[0, 0], [tT, 0], [tT + 1.0, 120]])

  return (
    <motion.div
      className="absolute left-0"
      style={{ top: LANE_Y - 26 }}
      initial={{ opacity: 0 }}
      animate={{ x: f.map((k) => k.x), y: f.map((k) => k.y), opacity: f.map((k) => k.o) }}
      transition={{ ...loop, times }}
    >
      <Card />
      {badge && (
        <motion.div
          className={`absolute -right-5 -top-6 rounded-full px-2.5 py-0.5 text-[18px] font-bold ${
            s.upsell === 'broken' ? 'border-2 border-dashed border-loss bg-white text-loss line-through' : 'bg-electric text-white'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: badge.values }}
          transition={{ ...loop, times: badge.times }}
        >
          +89
        </motion.div>
      )}
      {coin && coinY && (
        <motion.div
          className="absolute left-8 top-2 grid h-11 w-11 place-items-center rounded-full bg-loss text-[16px] font-bold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: coin.values, y: coinY.values }}
          transition={{ ...loop, times: coin.times }}
        >
          −15
        </motion.div>
      )}
    </motion.div>
  )
}

function Card() {
  return (
    <div
      className="flex h-[52px] items-center gap-2 rounded-[14px] bg-white px-3 shadow-[0_8px_16px_-8px_rgba(6,16,43,0.45),0_0_0_1px_rgba(6,16,43,0.08)]"
      style={{ width: TW }}
    >
      <span className="h-3 w-3 shrink-0 rounded-full bg-wa-green" />
      <span className="text-[20px] font-bold text-ink tabular">249</span>
      <span className="text-[14px] font-semibold text-ink-3">DH</span>
    </div>
  )
}

/* ---------- stations ---------- */

const fade = (on: boolean, delay = 0) => ({
  initial: false as const,
  animate: { opacity: on ? 1 : 0 },
  transition: { duration: 0.5, delay: on ? delay : 0 },
})

function Gate({ st }: { st: St }) {
  return (
    <motion.div className="absolute" style={{ left: G.gate - 9, top: LANE_Y - LANE_H / 2 - 40 }} {...fade(st !== 'off')}>
      <div className="h-[40px] w-[18px] rounded-t-md bg-ink" />
      <motion.div
        className="absolute left-0 top-[34px] h-[124px] w-[18px] rounded-full"
        style={{
          transformOrigin: '9px 6px',
          background: st === 'fixed' ? '#1e6bff' : 'repeating-linear-gradient(180deg,#0b1324 0 22px,#b88a2e 22px 44px)',
        }}
        initial={false}
        animate={{ rotate: st === 'fixed' ? -100 : 0 }}
        transition={{ type: 'spring', bounce: 0.35, duration: 0.8 }}
      />
    </motion.div>
  )
}

function Hole({ st }: { st: St }) {
  return (
    <motion.div className="absolute" style={{ left: G.hole - 60, top: LANE_Y - LANE_H / 2 }} {...fade(st !== 'off')}>
      <div className="h-[112px] w-[120px] bg-paper" style={{ boxShadow: 'inset 6px 0 0 #0b1324, inset -6px 0 0 #0b1324' }} />
      <motion.div
        className="absolute inset-x-[-6px] top-[38px] h-[36px] rounded-lg bg-electric"
        initial={false}
        animate={{ scaleX: st === 'fixed' ? 1 : 0, opacity: st === 'fixed' ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      />
    </motion.div>
  )
}

function UpsellMark({ st }: { st: St }) {
  return (
    <motion.div
      className={`absolute h-[96px] w-[96px] rounded-full border-[5px] ${st === 'fixed' ? 'border-electric' : 'border-dashed border-loss'}`}
      style={{ left: G.upsell - 48, top: LANE_Y - 48 }}
      {...fade(st !== 'off')}
    />
  )
}

function Night({ st }: { st: St }) {
  const fixed = st === 'fixed'
  return (
    <motion.div
      className="absolute overflow-hidden rounded-[18px]"
      style={{ left: G.night - 95, top: LANE_Y - LANE_H / 2 - 8, width: 190, height: LANE_H + 16 }}
      {...fade(st !== 'off')}
    >
      <div className="absolute inset-0 bg-wa-night" />
      <motion.div
        className="absolute inset-0 rounded-[18px] border-[5px] border-electric"
        initial={false}
        animate={{ opacity: fixed ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
      <svg className="absolute right-3 top-2" width="30" height="30" viewBox="0 0 24 24" aria-hidden>
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="#b88a2e" />
      </svg>
      <div className="absolute bottom-2 left-3 text-[18px] font-semibold text-white/70 tabular">02:14</div>
    </motion.div>
  )
}

function Toll({ st }: { st: St }) {
  const broken = st === 'broken'
  return (
    <>
      <motion.div
        className={`absolute grid h-[64px] w-[124px] place-items-center rounded-xl text-[22px] font-bold transition-colors duration-500 ${
          broken ? 'bg-ink text-loss' : 'bg-electric text-white'
        }`}
        style={{ left: G.toll - 62, top: LANE_Y - LANE_H / 2 - 64 }}
        {...fade(st !== 'off')}
      >
        {broken ? '−15 DH' : '0 DH'}
      </motion.div>
      {/* the pile of coins the agency keeps */}
      <motion.div className="absolute" style={{ left: G.toll - 60, top: LANE_Y + LANE_H / 2 + 14 }} {...fade(broken, 0.6)}>
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <div
            key={k}
            className="absolute h-[18px] w-[46px] rounded-[50%] border-2 border-[#3c4558] bg-loss"
            style={{ left: (k % 3) * 34, top: 40 - Math.floor(k / 3) * 14 - (k % 2) * 4 }}
          />
        ))}
      </motion.div>
    </>
  )
}

/* ---------- annotations ---------- */

type Note = { stat: string; caption: string; tone: 'ink' | 'loss' | 'electric' }

const NOTES: Record<keyof Stations, { broken: Note; fixed: Note }> = {
  gate: {
    broken: { stat: '20+ min', caption: 'per order, by hand', tone: 'ink' },
    fixed: { stat: 'Seconds', caption: 'to confirm, in the chat', tone: 'electric' },
  },
  hole: {
    broken: { stat: 'Slow replies', caption: '“I’ll reply later…”', tone: 'ink' },
    fixed: { stat: 'Instant replies', caption: 'from your own catalog', tone: 'electric' },
  },
  upsell: {
    broken: { stat: 'Missed upsells', caption: 'and lost impulse buys', tone: 'loss' },
    fixed: { stat: 'Upsells offered', caption: 'while the buyer is still here', tone: 'electric' },
  },
  night: {
    broken: { stat: 'No 24/7', caption: 'humans need sleep', tone: 'ink' },
    fixed: { stat: '24/7', caption: 'answers at 02:14 too', tone: 'electric' },
  },
  toll: {
    broken: { stat: '15+ DH', caption: 'per order to an agency', tone: 'loss' },
    fixed: { stat: 'One flat plan', caption: 'monthly, not per order', tone: 'electric' },
  },
}

const TONE = { ink: 'text-ink', loss: 'text-loss', electric: 'text-electric' }

function Annotation({ k, st, delay }: { k: keyof Stations; st: St; delay: number }) {
  const n = st === 'off' ? null : NOTES[k][st]
  const x = G[k]
  return (
    <>
      <motion.div
        className={`absolute w-[3px] ${st === 'fixed' ? 'bg-electric' : 'bg-ink-4'}`}
        style={{ left: x - 1, top: 452, height: LANE_Y - LANE_H / 2 - 452 - (k === 'toll' || k === 'gate' ? 70 : 6) }}
        {...fade(!!n, delay)}
      />
      <div className="absolute w-[264px]" style={{ left: x - 132, top: 340 }}>
        <AnimatePresence mode="wait">
          {n && (
            <motion.div
              key={st}
              className="text-center"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay } }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            >
              <div className={`text-[38px] font-bold leading-none tracking-[-0.02em] ${TONE[n.tone]}`}>{n.stat}</div>
              <div className="mt-2 text-[23px] leading-snug text-ink-3">{n.caption}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

/* ---------- verdict brackets ---------- */

export type Verdict = null | 'problem' | 'solution'

function Bracket({ from, to, title, line, tone, on, delay }: { from: number; to: number; title: string; line: string; tone: string; on: boolean; delay: number }) {
  return (
    <motion.div className="absolute" style={{ left: from, top: 880, width: to - from }} {...fade(on, delay)}>
      <div className={`h-[18px] border-x-[4px] border-b-[4px] ${tone === 'loss' ? 'border-loss' : tone === 'electric' ? 'border-electric' : 'border-ink'}`} />
      <div className={`mt-4 text-center text-[32px] font-bold leading-none ${TONE[tone as keyof typeof TONE]}`}>{title}</div>
      <div className="mt-2 text-center text-[22px] text-ink-3">{line}</div>
    </motion.div>
  )
}

const VERDICTS = {
  problem: [
    { from: G.gate - 130, to: G.hole + 130, title: 'Burnout', line: 'Solo founder, 5–10 orders a day', tone: 'ink' },
    { from: G.upsell - 120, to: G.upsell + 120, title: 'Lost sales', line: 'at every size', tone: 'loss' },
    { from: G.night - 130, to: G.toll + 130, title: 'Cash burn', line: 'Team or agency, 100+ orders a day', tone: 'loss' },
  ],
  solution: [
    { from: G.gate - 130, to: G.hole + 130, title: 'Hours back', line: 'for the solo founder', tone: 'electric' },
    { from: G.upsell - 120, to: G.upsell + 120, title: 'More sales', line: 'from the same chats', tone: 'electric' },
    { from: G.night - 130, to: G.toll + 130, title: 'Margin back', line: 'for the scaling merchant', tone: 'electric' },
  ],
}

/* ---------- the whole thing ---------- */

export function Pipeline({ s, verdict, children }: { s: Stations; verdict: Verdict; children?: ReactNode }) {
  const sig = `${s.gate}${s.hole}${s.upsell}${s.night}${s.toll}`
  return (
    <>
      {/* lane */}
      <div
        className="absolute rounded-[22px] bg-paper-2"
        style={{ left: X0 - 40, top: LANE_Y - LANE_H / 2, width: END - X0 + 40, height: LANE_H }}
      />
      <svg className="absolute left-0" style={{ top: LANE_Y - 3 }} width="1920" height="6" aria-hidden>
        <line x1={X0} y1="3" x2={END - 20} y2="3" stroke="#c9c5bc" strokeWidth="3" strokeDasharray="3 18" strokeLinecap="round" />
      </svg>

      {/* source and destination */}
      <div className="absolute grid h-[84px] w-[84px] place-items-center rounded-full bg-wa-green" style={{ left: X0 - 100, top: LANE_Y - 42 }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="#0b141a" aria-hidden>
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
        </svg>
      </div>
      <div className="absolute text-center" style={{ left: END + 4, top: LANE_Y - 60, width: 130 }}>
        <div className="mx-auto grid h-[84px] w-[84px] place-items-center rounded-[22px] bg-ink text-white">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m4 12.5 5 5L20 6.5" />
          </svg>
        </div>
        <div className="mt-2 text-[21px] font-semibold text-ink">Confirmed</div>
      </div>

      <Hole st={s.hole} />
      <UpsellMark st={s.upsell} />
      <Night st={s.night} />
      <Toll st={s.toll} />

      {Array.from({ length: N }, (_, i) => (
        <OrderToken key={`${sig}-${i}`} i={i} s={s} />
      ))}

      <Gate st={s.gate} />

      <Annotation k="gate" st={s.gate} delay={0.2} />
      <Annotation k="hole" st={s.hole} delay={0.4} />
      <Annotation k="upsell" st={s.upsell} delay={0.2} />
      <Annotation k="night" st={s.night} delay={0.2} />
      <Annotation k="toll" st={s.toll} delay={0.4} />

      {children}

      {(['problem', 'solution'] as const).map((v) =>
        VERDICTS[v].map((b, i) => <Bracket key={`${v}${i}`} {...b} on={verdict === v} delay={0.3 + i * 0.25} />),
      )}
    </>
  )
}

export const PIPE = { LANE_Y, G, X0, END }
