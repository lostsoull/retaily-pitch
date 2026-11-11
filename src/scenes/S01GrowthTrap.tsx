import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, type ReactNode } from 'react'
import silver from '../assets/watch-silver.webp'
import watch from '../assets/ad-watch.webp'
import { Bubble } from '../components/Chat'
import { BOX, Camera, Numeral } from '../components/Cine'
import { cardCls } from '../components/Feature'
import { Dashes, Paper, Row } from '../components/Receipt'
import { Fade, Lines } from '../components/Type'
import { EASE, EASE_IN, rand, useReduced } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * The growth trap, one problem at a time, each with its own picture:
 * 0 time: 20 minutes per order, by hand (a stopwatch and the checklist it eats)
 * 1 slow replies: the chat goes cold while the clock spins
 * 2 missed upsells: the second item nobody offered dissolves
 * 3 no 24/7: messages arrive all night, nobody answers, orders lost by morning
 * 4 cost: an agency takes 15 DH from every order, 9,000 DH a month at 20 a day
 * 5 verdict: small, you burn time; big, you burn cash
 */

const PROBLEMS = ['Time', 'Slow replies', 'Missed upsells', 'Nights', 'Cost'] as const
const HEAD = [
  ['20 minutes,', 'per order.'],
  ['Reply late,', 'lose the sale.'],
  ['They wanted', 'more.'],
  ['Nobody’s awake', 'at 02:14.'],
  ['15 DH an order,', 'to an agency.'],
]
const SUB = [
  'Alone, every order is done by hand: read, ask, check, call, type, book. You are the bottleneck.',
  'Chats wait while you work. By the time you answer, the customer has bought somewhere else.',
  'A customer ready for a second item leaves with one. Nobody had the time to offer it.',
  'Ads run all night and customers write at midnight. By morning, those orders are gone.',
  'Grow into a team or an agency and every order pays a toll. At just 20 orders a day, that’s 9,000 DH a month.',
]

/* ---------- small shared pieces ---------- */

function useCount(to: number, duration: number, delay: number) {
  const reduced = useReduced()
  const mv = useMotionValue(reduced ? to : 0)
  useEffect(() => {
    if (reduced) return
    const c = animate(mv, to, { duration, delay, ease: [0.3, 0, 0.2, 1] })
    return () => c.stop()
  }, [mv, to, duration, delay, reduced])
  return mv
}

const Icon = {
  chat: <path d="M4 5h16v11H9l-5 4V5Z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </>
  ),
  phone: <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" />,
  keyboard: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <path d="M6 10h1M9.5 10h1M13 10h1M16.5 10h1M7 14h10" />
    </>
  ),
  truck: (
    <>
      <path d="M2 6h12v10H2zM14 10h4l3 3v3h-7" />
      <circle cx="6" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />,
  bag: (
    <>
      <path d="M5 8h14l-1 13H6L5 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="9" cy="7" rx="6" ry="2.5" />
      <path d="M3 7v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V7" />
      <path d="M9 16.5c3.3 0 6-1.1 6-2.5M15 11.2c3 .3 6 1.3 6 2.8v4c0 1.4-2.7 2.5-6 2.5-2.4 0-4.5-.6-5.4-1.4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  snow: <path d="M12 2v20M3.3 7l17.4 10M3.3 17l17.4-10M9 4l3 2 3-2M9 20l3-2 3 2" />,
}

function Ico({ d, size = 26, className = '' }: { d: ReactNode; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {d}
    </svg>
  )
}

/* ---------- 0 · time: the stopwatch and the checklist ---------- */

const TASKS: [string, ReactNode][] = [
  ['Read the chat', Icon.chat],
  ['Ask name and phone', Icon.user],
  ['Check the address', Icon.pin],
  ['Call to confirm', Icon.phone],
  ['Type the order', Icon.keyboard],
  ['Book the delivery', Icon.truck],
]

function Time() {
  const R = 170
  const C = 2 * Math.PI * R
  const mins = useCount(20, 3.4, 0.9)
  const label = useTransform(() => `${String(Math.floor(mins.get())).padStart(2, '0')}:00`)
  return (
    <>
      {/* the stopwatch */}
      <div className="absolute" style={{ left: BOX.x, top: BOX.y + 120, width: 460, height: 520 }}>
        <div className="absolute left-1/2 top-0 h-9 w-16 -translate-x-1/2 rounded-t-xl bg-ink" />
        <div className="absolute left-1/2 top-7 h-6 w-7 -translate-x-1/2 bg-ink" />
        <div className="absolute left-0 top-[52px] grid h-[460px] w-[460px] place-items-center rounded-full bg-white shadow-[0_40px_80px_-40px_rgba(6,16,43,0.5),0_0_0_1px_rgba(6,16,43,0.06)]">
          <svg width="420" height="420" viewBox="-210 -210 420 420" className="absolute" aria-hidden>
            {Array.from({ length: 60 }, (_, i) => (
              <line key={i} x1="0" y1={-196} x2="0" y2={i % 5 === 0 ? -182 : -189} stroke={i % 5 === 0 ? '#0b1324' : '#a2abbb'} strokeWidth={i % 5 === 0 ? 3 : 1.5} transform={`rotate(${i * 6})`} />
            ))}
            <circle r={R} fill="none" stroke="#e7edf5" strokeWidth="22" />
            <motion.circle
              r={R}
              fill="none"
              stroke="#1e6bff"
              strokeWidth="22"
              strokeLinecap="round"
              strokeDasharray={C}
              transform="rotate(-90)"
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C * (1 - 20 / 60) }}
              transition={{ duration: 3.4, delay: 0.9, ease: [0.3, 0, 0.2, 1] }}
            />
            <motion.line
              x1="0"
              y1="20"
              x2="0"
              y2="-150"
              stroke="#0b1324"
              strokeWidth="5"
              strokeLinecap="round"
              initial={{ rotate: 0 }}
              animate={{ rotate: 120 }}
              transition={{ duration: 3.4, delay: 0.9, ease: [0.3, 0, 0.2, 1] }}
            />
            <circle r="10" fill="#0b1324" />
          </svg>
          <div className="relative mt-40 text-center">
            <motion.div className="text-[64px] font-bold leading-none tracking-[-0.03em] text-ink tabular">{label}</motion.div>
            <div className="mt-1 text-[20px] text-ink-3">per order, by hand</div>
          </div>
        </div>
      </div>

      {/* the checklist it eats */}
      <div className={`${cardCls} absolute flex flex-col px-8 py-8`} style={{ left: BOX.x + 500, top: BOX.y, width: BOX.w - 500, height: BOX.h }}>
        <div className="text-[22px] font-semibold text-ink-3">One order, by hand</div>
        <div className="mt-4 flex flex-1 flex-col justify-between">
          {TASKS.map(([t, d], k) => (
            <motion.div
              key={t}
              className="flex items-center gap-4"
              initial={{ opacity: 0.25 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.9 + k * 0.55 }}
            >
              <motion.span
                className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
                initial={{ backgroundColor: '#e7edf5', color: '#a2abbb' }}
                animate={{ backgroundColor: '#e3edff', color: '#1e6bff' }}
                transition={{ duration: 0.4, delay: 0.9 + k * 0.55 }}
              >
                <Ico d={d} />
              </motion.span>
              <span className="flex-1 text-[24px] font-medium text-ink">{t}</span>
              <motion.span
                className="text-[18px] font-semibold text-ink-3 tabular"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 + k * 0.55 }}
              >
                ~3 min
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ---------- 1 · slow replies: the chat goes cold ---------- */

function Cold() {
  const reduced = useReduced()
  const MSG: { side: 'in' | 'out'; text: string; t: string; d: number }[] = [
    { side: 'in', text: 'Salam, ch7al l’montre?', t: '14:02', d: 0.7 },
    { side: 'in', text: '??', t: '14:09', d: 1.3 },
    { side: 'in', text: 'Allo, kayn chi had?', t: '14:21', d: 1.9 },
    { side: 'in', text: 'Safi, chrit mn 3and wa7ed akhor.', t: '14:38', d: 2.6 },
    { side: 'out', text: '249 DH, livraison fabor', t: '16:10', d: 3.6 },
  ]
  const minutes = useCount(128, 3.0, 0.7)
  const wait = useTransform(() => `${Math.floor(minutes.get() / 60)} h ${String(Math.round(minutes.get() % 60)).padStart(2, '0')}`)
  return (
    <>
      {/* the chat */}
      <div className={`${cardCls} absolute flex flex-col overflow-hidden`} style={{ left: BOX.x, top: BOX.y, width: 560, height: BOX.h, background: '#efeae2' }}>
        <div className="flex items-center gap-3 bg-[#f6f6f6] px-6 py-4">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[linear-gradient(135deg,#f5a46b,#e0715b)] text-[20px] font-semibold text-white">K</div>
          <div>
            <div className="text-[22px] font-semibold text-[#111b21]">Khadija B.</div>
            <motion.div className="text-[17px] text-[#667781]" initial={{ opacity: 1 }} animate={{ opacity: [1, 1, 0.6] }} transition={{ duration: 3, times: [0, 0.8, 1] }}>
              last seen today at 14:38
            </motion.div>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-end gap-3 p-6">
          {MSG.map((m) => (
            <motion.div
              key={m.t}
              className={m.side === 'out' ? 'self-end' : ''}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: m.d }}
            >
              <Bubble side={m.side} size={24} time={m.t} ticks={m.side === 'out'}>
                {m.text}
              </Bubble>
            </motion.div>
          ))}
        </div>
        {/* frost creeping in from the edges */}
        {!reduced && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 80% 75% at 50% 55%, transparent 62%, rgba(214,232,255,0.95) 100%)' }}
            initial={{ opacity: 0, scale: 1.25 }}
            animate={{ opacity: 0.9, scale: 1 }}
            transition={{ duration: 1.6, ease: EASE, delay: 3.0 }}
          />
        )}
        <motion.div
          className="absolute left-1/2 top-[38%] flex -translate-x-1/2 items-center gap-3 rounded-2xl border-[5px] border-[#5c95ff] bg-white/80 px-6 py-2 text-[44px] font-black uppercase tracking-[0.04em] text-[#5c95ff]"
          style={{ rotate: -8 }}
          initial={{ opacity: 0, scale: 2.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.35, duration: 0.5, delay: 4.0 }}
        >
          <Ico d={Icon.snow} size={40} /> Gone cold
        </motion.div>
      </div>

      {/* the clock, spinning while she waits */}
      <div className={`${cardCls} absolute flex flex-col items-center justify-center`} style={{ left: BOX.x + 584, top: BOX.y, width: BOX.w - 584, height: BOX.h }}>
        <svg width="250" height="250" viewBox="-110 -110 220 220" aria-hidden>
          <circle r="100" fill="#f4f7fb" stroke="#0b1324" strokeWidth="5" />
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1="0" y1="-88" x2="0" y2="-76" stroke="#0b1324" strokeWidth="4" strokeLinecap="round" transform={`rotate(${i * 30})`} />
          ))}
          <motion.line x1="0" y1="10" x2="0" y2="-50" stroke="#0b1324" strokeWidth="7" strokeLinecap="round" initial={{ rotate: 61 }} animate={{ rotate: 61 + 64 }} transition={{ duration: 3, delay: 0.7, ease: [0.3, 0, 0.2, 1] }} />
          <motion.line x1="0" y1="14" x2="0" y2="-78" stroke="#1e6bff" strokeWidth="4" strokeLinecap="round" initial={{ rotate: 12 }} animate={{ rotate: 12 + 768 }} transition={{ duration: 3, delay: 0.7, ease: [0.3, 0, 0.2, 1] }} />
          <circle r="7" fill="#0b1324" />
        </svg>
        <motion.div className="mt-8 text-[64px] font-bold leading-none tracking-[-0.03em] text-ink tabular">{wait}</motion.div>
        <div className="mt-2 text-[22px] text-ink-3">until she got an answer</div>
        <div className="mt-8 rounded-full bg-paper px-5 py-2 text-[20px] font-semibold text-ink-2">14:02 → 16:10</div>
      </div>
    </>
  )
}

/* ---------- 2 · missed upsells: the second item dissolves ---------- */

function Upsell() {
  const reduced = useReduced()
  const DIS = 2.6 // when the offer that never happened dissolves
  return (
    <>
      {/* the order, as printed */}
      <div className="absolute" style={{ left: BOX.x, top: BOX.y, width: 430 }}>
        <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>
          <Paper className="px-8 pt-8" style={{ minHeight: BOX.h - 10 }}>
            <div className="text-center text-[24px] font-semibold tracking-[0.12em]">BOUTIQUE SALMA</div>
            <div className="text-center text-[17px] text-ink-3">Order #3112</div>
            <Dashes className="mt-5" />
            <div className="mt-5 flex items-center gap-4">
              <img src={watch} alt="" className="h-16 w-16 rounded-lg object-cover" />
              <Row className="flex-1 text-[22px]" label="Montre Atlas" value="249.00" />
            </div>
            {/* the line that could have been */}
            <motion.div
              className="mt-4 flex items-center gap-4 rounded-lg border-2 border-dashed border-electric/50 px-2 py-2 text-electric"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0.25] }}
              transition={{ duration: DIS + 0.6, times: [0, 0.3, 0.8, 1], delay: 0.6 }}
            >
              <img src={silver} alt="" className="h-14 w-14 rounded-lg object-cover" />
              <Row className="flex-1 text-[20px]" label="+ Montre Argent" value="229.00" />
            </motion.div>
            <Dashes className="mt-5" />
            <div className="relative mt-5 h-[60px]">
              <motion.div
                className="absolute inset-x-0 flex items-baseline justify-between text-[30px] font-semibold text-electric tabular"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: DIS + 0.8, times: [0, 0.3, 0.75, 1], delay: 0.6 }}
              >
                <span className="text-[20px]">COULD HAVE BEEN</span>
                <span>478.00</span>
              </motion.div>
              <motion.div
                className="absolute inset-x-0 flex items-baseline justify-between border-t-[3px] border-ink pt-2 text-[30px] font-semibold tabular"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: DIS + 1.2 }}
              >
                <span className="text-[20px]">TOTAL</span>
                <span>249.00</span>
              </motion.div>
            </div>
          </Paper>
        </motion.div>
      </div>

      {/* the offer nobody made: it waits, then breaks apart */}
      <div className="absolute" style={{ left: BOX.x + 470, top: BOX.y + 100, width: BOX.w - 470 }}>
        <motion.div
          className="relative overflow-hidden rounded-[26px] bg-white p-6 shadow-[0_40px_80px_-40px_rgba(30,107,255,0.6),0_0_0_3px_rgba(30,107,255,0.35)]"
          initial={{ opacity: 0, x: 80, rotate: 4 }}
          animate={
            reduced
              ? { opacity: [0, 1, 1, 0.35] }
              : { opacity: [0, 1, 1, 0.35], x: [80, 0, 0, 0], rotate: [4, 2, 2, 2], filter: ['grayscale(0) blur(0px)', 'grayscale(0) blur(0px)', 'grayscale(0) blur(0px)', 'grayscale(1) blur(1.5px)'] }
          }
          transition={{ duration: DIS + 0.9, times: [0, 0.2, 0.75, 1], delay: 0.5 }}
        >
          <div className="text-[18px] font-semibold uppercase tracking-[0.14em] text-electric">Often bought together</div>
          <img src={silver} alt="" className="mt-4 h-[260px] w-full rounded-2xl object-cover object-[50%_40%]" />
          <div className="mt-4 flex items-baseline justify-between text-[28px] font-semibold text-ink">
            <span>Montre Argent</span>
            <span className="tabular">229 DH</span>
          </div>
          <div className="mt-1 text-[20px] text-ink-3">Never offered. Nobody had the time.</div>
        </motion.div>
        {/* the pieces it breaks into */}
        {!reduced &&
          Array.from({ length: 36 }, (_, i) => (
            <motion.span
              key={i}
              className="absolute block rounded-[3px] bg-electric"
              style={{ left: 30 + rand(i, 2) * 330, top: 60 + rand(i, 3) * 400, width: 8 + rand(i, 4) * 12, height: 8 + rand(i, 4) * 12 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0], x: [0, 120 + rand(i, 5) * 260], y: [0, (rand(i, 6) - 0.7) * 300], rotate: [0, (rand(i, 7) - 0.5) * 360] }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: DIS + 0.2 + rand(i, 8) * 0.4 }}
            />
          ))}
        {/* what it cost: stamped over the ghost */}
        <motion.div
          className="absolute left-1/2 top-[44%] flex -translate-x-1/2 items-center gap-4 whitespace-nowrap rounded-[22px] bg-ink px-7 py-4 text-white shadow-[0_30px_60px_-24px_rgba(6,16,43,0.7)]"
          style={{ rotate: -4 }}
          initial={{ opacity: 0, scale: 1.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.35, duration: 0.55, delay: DIS + 1.2 }}
        >
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-sky">
            <Ico d={Icon.bag} size={30} />
          </span>
          <span>
            <span className="block text-[44px] font-bold leading-none tracking-[-0.02em] tabular">229 DH</span>
            <span className="text-[20px] text-white/70">left on the table</span>
          </span>
        </motion.div>
      </div>
    </>
  )
}

/* ---------- 3 · no 24/7: the night ---------- */

function Night() {
  const reduced = useReduced()
  const MORNING = 3.4
  const NOTES = [
    { who: 'Khadija', text: 'Salam, ch7al l’montre?', t: '02:14', d: 0.9 },
    { who: 'Youssef', text: 'Kayna f noir? Bghit wa7da', t: '03:07', d: 1.6 },
    { who: 'Sara', text: 'Bghit nkoumandi daba', t: '04:30', d: 2.3 },
  ]
  // each hour holds the stage until the next one rolls in
  const HOURS = [
    { h: '02:14', from: 0, to: 1.6 },
    { h: '03:07', from: 1.6, to: 2.3 },
    { h: '04:30', from: 2.3, to: MORNING },
    { h: '09:12', from: MORNING, to: 99 },
  ]
  return (
    <motion.div
      className="absolute overflow-hidden rounded-[26px] shadow-[0_40px_80px_-40px_rgba(6,16,43,0.6)]"
      style={{ left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.h }}
      initial={{ background: 'linear-gradient(180deg,#050b1f,#0b1f5c)' }}
      animate={{ background: ['linear-gradient(180deg,#050b1f,#0b1f5c)', 'linear-gradient(180deg,#050b1f,#0b1f5c)', 'linear-gradient(180deg,#8fb6ff,#f4f7fb)'] }}
      transition={{ duration: MORNING + 1.2, times: [0, 0.75, 1] }}
    >
      {/* stars */}
      {!reduced &&
        Array.from({ length: 40 }, (_, i) => (
          <motion.span
            key={i}
            className="absolute block rounded-full bg-white"
            style={{ left: `${rand(i, 1) * 100}%`, top: `${rand(i, 2) * 55}%`, width: 2 + rand(i, 3) * 3, height: 2 + rand(i, 3) * 3 }}
            animate={{ opacity: [0.2, 1, 0.2, 0] }}
            transition={{ duration: MORNING + 1, times: [0, 0.3, 0.7, 1], delay: rand(i, 4) * 0.8 }}
          />
        ))}
      {/* moon, setting */}
      <motion.div
        className="absolute left-14 top-12 text-[#e8d3a0]"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: [1, 1, 0], y: [0, 0, 80] }}
        transition={{ duration: MORNING + 1, times: [0, 0.7, 1] }}
      >
        <svg width="90" height="90" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          {Icon.moon}
        </svg>
      </motion.div>
      {/* the hour */}
      <div className="absolute right-14 top-10 text-right">
        <div className="relative h-[110px] w-[330px] overflow-hidden">
          {HOURS.map((o, i) => {
            const last = i === HOURS.length - 1
            const span = o.to - o.from
            return (
              <motion.div
                key={o.h}
                className="absolute right-0 text-[104px] font-bold leading-none tracking-[-0.04em] tabular"
                style={{ color: last ? '#0b1324' : '#ffffff' }}
                initial={{ y: i === 0 ? 0 : 110, opacity: i === 0 ? 1 : 0 }}
                animate={
                  last
                    ? { y: [110, 0], opacity: [0, 1] }
                    : i === 0
                      ? { y: [0, 0, -110], opacity: [1, 1, 0] }
                      : { y: [110, 0, 0, -110], opacity: [0, 1, 1, 0] }
                }
                transition={
                  last
                    ? { duration: 0.5, ease: EASE, delay: o.from }
                    : i === 0
                      ? { duration: o.to + 0.3, times: [0, o.to / (o.to + 0.3), 1] }
                      : { duration: span + 0.3, times: [0, 0.3 / (span + 0.3), span / (span + 0.3), 1], delay: o.from - 0.3 }
                }
              >
                {o.h}
              </motion.div>
            )
          })}
        </div>
        <motion.div className="text-[22px] font-semibold" initial={{ color: 'rgba(255,255,255,0.6)' }} animate={{ color: ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)', 'rgba(11,19,36,0.6)'] }} transition={{ duration: MORNING + 1, times: [0, 0.75, 1] }}>
          You wake up
        </motion.div>
      </div>
      {/* lock-screen notifications, piling up through the night */}
      <div className="absolute inset-x-14 top-[230px] flex flex-col gap-4">
        {NOTES.map((n, i) => (
          <motion.div
            key={n.t}
            className="flex items-center gap-5 rounded-[24px] px-6 py-5 backdrop-blur-xl"
            initial={{ opacity: 0, y: -40, scale: 0.96, backgroundColor: 'rgba(255,255,255,0.14)' }}
            animate={{ opacity: 1, y: 0, scale: 1, backgroundColor: ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.14)', 'rgba(255,255,255,0.9)'] }}
            transition={{ duration: 0.6, ease: EASE, delay: n.d, backgroundColor: { duration: MORNING + 1 - n.d, times: [0, 0.7, 1], delay: n.d } }}
          >
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-wa-green text-white">
              <Ico d={Icon.chat} size={28} />
            </span>
            <div className="min-w-0 flex-1">
              <motion.div className="flex justify-between text-[20px] font-semibold" initial={{ color: '#ffffff' }} animate={{ color: ['#ffffff', '#ffffff', '#0b1324'] }} transition={{ duration: MORNING + 1 - n.d, times: [0, 0.7, 1], delay: n.d }}>
                <span>WhatsApp · {n.who}</span>
                <span className="tabular opacity-60">{n.t}</span>
              </motion.div>
              <motion.div className="text-[24px]" initial={{ color: 'rgba(255,255,255,0.85)' }} animate={{ color: ['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.85)', '#3c4558'] }} transition={{ duration: MORNING + 1 - n.d, times: [0, 0.7, 1], delay: n.d }}>
                {n.text}
              </motion.div>
            </div>
            <motion.span
              className="shrink-0 rounded-full bg-ink px-4 py-1.5 text-[18px] font-semibold text-white"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.4, duration: 0.5, delay: MORNING + 0.6 + i * 0.2 }}
            >
              No reply · lost
            </motion.span>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="absolute bottom-12 left-14 text-[30px] font-semibold text-ink"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: MORNING + 1.3 }}
      >
        3 orders, gone before breakfast.
      </motion.div>
    </motion.div>
  )
}

/* ---------- 4 · cost: the agency's toll ---------- */

function Toll() {
  const reduced = useReduced()
  const paid = useCount(9000, 3.6, 0.8)
  const label = useTransform(() => Math.round(paid.get()).toLocaleString('en-US'))
  const fill = useTransform(() => `${(paid.get() / 9000) * 100}%`)
  const LANE_Y = 330
  const BOOTH_X = 380
  return (
    <div className={`${cardCls} absolute overflow-hidden`} style={{ left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.h }}>
      <div className="px-10 pt-9">
        <div className="text-[22px] font-semibold text-ink-3">Paid to the agency this month</div>
        <div className="mt-1 flex items-baseline gap-3">
          <motion.span className="text-[110px] font-bold leading-none tracking-[-0.04em] text-ink tabular">{label}</motion.span>
          <span className="text-[40px] font-semibold text-ink-3">DH</span>
        </div>
        <div className="mt-2 text-[20px] text-ink-3">20 orders a day × 15 DH × 30 days</div>
      </div>

      {/* the lane, the booth, and the orders passing through it */}
      <div className="absolute inset-x-0 h-[8px] bg-line" style={{ top: LANE_Y + 150 }} />
      <div className="absolute flex flex-col items-center" style={{ left: BOOTH_X, top: LANE_Y - 10 }}>
        <div className="rounded-t-2xl bg-ink px-6 py-2 text-[20px] font-semibold text-white">Agency</div>
        <div className="h-[130px] w-[150px] rounded-b-xl border-x-[6px] border-b-[6px] border-ink bg-[repeating-linear-gradient(135deg,#e7edf5_0_10px,#f4f7fb_10px_20px)]" />
      </div>
      {!reduced &&
        Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ top: LANE_Y + 70 }}
            initial={{ x: -260 }}
            animate={{ x: [-260, BOOTH_X - 40, BOOTH_X - 40, 980] }}
            transition={{ duration: 3.2, times: [0, 0.4, 0.55, 1], repeat: Infinity, delay: 0.6 + i * 0.65, ease: 'easeInOut' }}
          >
            <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[19px] font-semibold text-ink shadow-[0_14px_28px_-16px_rgba(6,16,43,0.55),0_0_0_1px_rgba(6,16,43,0.08)]">
              <span className="h-2.5 w-2.5 rounded-full bg-go" /> Order ✓
            </div>
            {/* its 15 DH, knocked off into the agency's jar */}
            <motion.span
              className="absolute -top-2 left-1/2 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full bg-brake text-[15px] font-bold text-white shadow-[0_6px_14px_-6px_rgba(0,0,0,0.5)]"
              animate={{ opacity: [0, 0, 1, 1, 0], y: [0, 0, -70, 60, 230], x: [0, 0, 20, 200, 330] }}
              transition={{ duration: 3.2, times: [0, 0.42, 0.5, 0.75, 0.95], repeat: Infinity, delay: 0.6 + i * 0.65 }}
            >
              −15
            </motion.span>
          </motion.div>
        ))}

      {/* the jar */}
      <div className="absolute" style={{ right: 70, top: LANE_Y + 190 }}>
        <div className="relative h-[220px] w-[200px] overflow-hidden rounded-b-[40px] rounded-t-[16px] border-[6px] border-ink bg-white">
          <motion.div className="absolute inset-x-0 bottom-0 bg-[repeating-linear-gradient(0deg,#b88a2e_0_14px,#d1a24a_14px_28px)]" style={{ height: fill }} />
        </div>
        <div className="mt-2 text-center text-[20px] font-semibold text-ink">
          <Ico d={Icon.coins} size={22} className="mr-1 inline" /> the agency’s cut
        </div>
      </div>
      <div className="absolute bottom-10 left-10 max-w-[480px] text-[22px] text-ink-3">15–25 DH per delivered order, daytime only. And it grows with every order you sell.</div>
    </div>
  )
}

/* ---------- 5 · verdict ---------- */

function Verdict() {
  const TILES = [
    { k: 'Burnout', who: 'Solo founder, 5–10 orders a day', icons: [Icon.clock, Icon.snow], quote: 'I can’t grow. I’m stuck in DMs.' },
    { k: 'Lost sales', who: 'At every size', icons: [Icon.bag, Icon.moon], quote: 'They wrote at night. Nobody answered.' },
    { k: 'Cash burn', who: 'Team or agency, 100+ orders a day', icons: [Icon.coins], quote: 'We can’t keep up with the volume!' },
  ]
  return (
    <div className="absolute grid grid-cols-3 gap-6" style={{ left: 140, top: 470, width: 1640, height: 460 }}>
      {TILES.map((t, i) => (
        <motion.div
          key={t.k}
          className={`${cardCls} flex flex-col p-8 ${i === 2 ? 'text-white' : ''}`}
          style={{ transformPerspective: 1600, transformOrigin: '50% 100%', ...(i === 2 ? { background: '#0b1324' } : {}) }}
          initial={{ opacity: 0, y: 120, rotateX: 30 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.5 + i * 0.15 }}
        >
          <div className="flex gap-3">
            {t.icons.map((d, k) => (
              <span key={k} className={`grid h-16 w-16 place-items-center rounded-2xl ${i === 2 ? 'bg-white/10 text-brake' : 'bg-electric-soft text-electric'}`}>
                <Ico d={d} size={32} />
              </span>
            ))}
          </div>
          <div className="mt-6 text-[56px] font-bold leading-none tracking-[-0.03em]">{t.k}</div>
          <div className={`mt-2 text-[22px] ${i === 2 ? 'text-white/60' : 'text-ink-3'}`}>{t.who}</div>
          <div className="mt-auto">
            <Bubble side="out" size={22}>
              {t.quote}
            </Bubble>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/* ---------- the scene ---------- */

const PICTURES = [Time, Cold, Upsell, Night, Toll]

export default function S01GrowthTrap({ step }: SceneProps) {
  const reduced = useReduced()
  const verdict = step >= 5
  const Pic = PICTURES[Math.min(step, 4)]
  return (
    <div className="absolute inset-0 overflow-hidden bg-paper text-ink">
      {/* the picture for this problem: each one turns in like a page */}
      <Camera key={verdict ? 'v' : 'p'}>
        <AnimatePresence mode="wait">
          {!verdict && (
            <motion.div
              key={step}
              className="absolute inset-0"
              style={{ transformPerspective: 2000, transformOrigin: '0% 50%' }}
              initial={reduced ? { opacity: 0 } : { opacity: 0, rotateY: -24, x: 160, filter: 'blur(12px)' }}
              animate={{ opacity: 1, rotateY: 0, x: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: -120, scale: 0.96, filter: 'blur(10px)', transition: { duration: 0.4, ease: EASE_IN } }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              <Pic />
            </motion.div>
          )}
        </AnimatePresence>
        {verdict && <Verdict />}
      </Camera>

      {/* the caption column */}
      <motion.div className="absolute left-[140px] top-[150px] flex items-center gap-4" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}>
        <div className="flex gap-1.5">
          {PROBLEMS.map((_, i) => (
            <motion.span
              key={i}
              className={`h-2.5 rounded-full ${i <= step ? 'bg-electric' : 'bg-ink/15'}`}
              initial={false}
              animate={{ width: i === step ? 40 : 10 }}
              transition={{ duration: 0.6, ease: EASE }}
            />
          ))}
        </div>
        <span className="text-[26px] font-semibold text-electric">{verdict ? 'The growth trap' : `The growth trap · ${PROBLEMS[step]}`}</span>
      </motion.div>

      {verdict ? (
        <div className="absolute left-[140px] top-[210px] w-[1640px]">
          <Lines k="verdict" lines={['Small, you burn time.', 'Big, you burn cash.']} className="display text-[96px]" delay={0.2} />
          <Fade k="vs" delay={0.8} className="lede mt-6 text-[32px] text-ink-2">
            Either way, sales slip through.
          </Fade>
        </div>
      ) : (
        <>
          <div className="absolute left-[140px] top-[210px] w-[680px]">
            <Lines k={step} lines={HEAD[step]} className="display text-[92px]" delay={0.25} />
            <Fade k={`s${step}`} delay={0.8} className="lede mt-10 max-w-[640px] text-[30px] text-ink-2">
              {SUB[step]}
            </Fade>
          </div>
          <Numeral key={step} n={step + 1} of={5} />
        </>
      )}
    </div>
  )
}
