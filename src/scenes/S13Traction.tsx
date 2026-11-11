import { AnimatePresence, motion } from 'motion/react'
import { useMemo, type ReactNode } from 'react'
import watch from '../assets/ad-watch.webp'
import { Bubble } from '../components/Chat'
import { Mark } from '../components/Mark'
import { Fade, Lines } from '../components/Type'
import { TRACTION as T } from '../data/traction'
import { EASE, EASE_IN, useReduced } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * Traction as a journey, one story per click. A road draws itself along the foot of
 * the frame as we go, and a delivery van drives from stop to stop.
 * 0 June: we built the MVP · 1 we demoed it to merchants · 2 feedback became the next
 * version · 3 we ran Meta ads on e-commerce products to test the agent · 4 pilots live
 * Numbers live in src/data/traction.ts; unconfirmed ones render as an amber marker.
 */

/** A number, or an unmistakable placeholder if it hasn't been confirmed. */
function Num({ v, suffix = '' }: { v: number | string | null; suffix?: string }) {
  if (v === null)
    return (
      <span className="inline-flex items-center rounded-xl border-[3px] border-dashed border-brake bg-brake-soft px-3 py-0.5 align-middle text-[0.55em] font-semibold tracking-normal text-[#7a5a1c]">
        to confirm
      </span>
    )
  return (
    <span>
      {typeof v === 'number' ? v.toLocaleString('en-US') : v}
      {suffix}
    </span>
  )
}

/* ---------- the road ---------- */

const STOPS: [number, number][] = [
  [250, 935],
  [610, 862],
  [970, 945],
  [1330, 858],
  [1690, 925],
]
const ROUTE: [number, number][] = [[-60, 975], ...STOPS, [1990, 880]]

/** Catmull-Rom through the points, as cubic Béziers. */
function smooth(p: [number, number][]) {
  let d = `M${p[0][0]} ${p[0][1]}`
  for (let i = 0; i < p.length - 1; i++) {
    const [p0, p1, p2, p3] = [p[i - 1] ?? p[i], p[i], p[i + 1], p[i + 2] ?? p[i + 1]]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`
  }
  return d
}
const ROAD = smooth(ROUTE)

/** How far along the road each stop sits (0..1), measured once in the browser. */
function useStopFractions() {
  return useMemo(() => {
    const ns = 'http://www.w3.org/2000/svg'
    const el = document.createElementNS(ns, 'path')
    const len = (d: string) => {
      el.setAttribute('d', d)
      return el.getTotalLength()
    }
    const total = len(ROAD)
    return STOPS.map((_, i) => len(smooth(ROUTE.slice(0, i + 2))) / total)
  }, [])
}

function Van() {
  return (
    <svg width="96" height="62" viewBox="0 0 96 62" aria-hidden>
      <ellipse cx="48" cy="58" rx="40" ry="4" fill="rgba(6,16,43,0.25)" />
      <path d="M4 12a6 6 0 0 1 6-6h46v42H4z" fill="#1e6bff" />
      <path d="M56 18h18l14 14v16H56z" fill="#1450d9" />
      <path d="M62 22h11l9 9H62z" fill="#dce8ff" />
      <rect x="10" y="14" width="40" height="18" rx="4" fill="rgba(255,255,255,0.2)" />
      <path d="M20 20l6 6 12-12" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" transform="translate(-2 -1)" />
      <circle cx="22" cy="49" r="8" fill="#0b1324" />
      <circle cx="22" cy="49" r="3" fill="#d6deea" />
      <circle cx="72" cy="49" r="8" fill="#0b1324" />
      <circle cx="72" cy="49" r="3" fill="#d6deea" />
    </svg>
  )
}

const TAGS = ['June', 'Demos', 'Feedback', 'Meta ads', 'Pilots']

function Road({ step }: { step: number }) {
  const reduced = useReduced()
  const F = useStopFractions()
  const f = F[step]
  return (
    <div className="pointer-events-none absolute inset-0">
      <svg className="absolute inset-0" width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden>
        <defs>
          <mask id="built" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080">
            <motion.path
              d={ROAD}
              fill="none"
              stroke="#fff"
              strokeWidth="60"
              initial={{ pathLength: step === 0 ? 0 : F[step - 1] }}
              animate={{ pathLength: f }}
              transition={{ duration: reduced ? 0 : 1.6, ease: EASE, delay: 0.2 }}
            />
          </mask>
        </defs>
        {/* the road still to build */}
        <path d={ROAD} fill="none" stroke="#d6deea" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 18" />
        {/* the road we built */}
        <g mask="url(#built)">
          <path d={ROAD} fill="none" stroke="#0b1324" strokeWidth="40" strokeLinecap="round" />
          <path d={ROAD} fill="none" stroke="#f4f7fb" strokeWidth="3" strokeDasharray="22 18" />
        </g>
      </svg>

      {/* the stops */}
      {STOPS.map(([x, y], i) => {
        const reached = i <= step
        const here = i === step
        return (
          <div key={i} className="absolute" style={{ left: x, top: y }}>
            <motion.span
              className="absolute -left-[15px] -top-[15px] block h-[30px] w-[30px] rounded-full border-[6px]"
              initial={false}
              animate={{ borderColor: reached ? '#1e6bff' : '#d6deea', backgroundColor: reached ? '#ffffff' : '#f4f7fb', scale: here ? [1, 1.5, 1] : 1 }}
              transition={{ duration: 0.5, delay: here ? 1.5 : 0 }}
            />
            {/* the signpost, raised when we get there */}
            <motion.div
              className="absolute bottom-[14px] left-0 flex -translate-x-1/2 flex-col items-center"
              style={{ originY: 1 }}
              initial={{ opacity: reached && !here ? 1 : 0, scaleY: reached && !here ? 1 : 0 }}
              animate={{ opacity: reached ? 1 : 0, scaleY: reached ? 1 : 0 }}
              transition={{ type: 'spring', bounce: 0.4, duration: 0.6, delay: here ? 1.5 : 0 }}
            >
              <span className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[19px] font-semibold ${here ? 'bg-electric text-white' : 'bg-white text-ink-2 shadow-[0_8px_18px_-10px_rgba(6,16,43,0.4)]'}`}>
                {i + 1} · {TAGS[i]}
              </span>
              <span className="h-[64px] w-[3px] bg-ink/25" />
            </motion.div>
          </div>
        )
      })}

      {/* the van, driving the built road */}
      <div
        className="absolute left-0 top-0"
        style={{
          offsetPath: `path('${ROAD}')`,
          offsetRotate: 'auto',
          offsetAnchor: '50% 90%',
          offsetDistance: `${f * 100}%`,
          transition: reduced ? undefined : 'offset-distance 1.6s cubic-bezier(0.16,1,0.3,1) 0.2s',
        }}
      >
        <Van />
      </div>
    </div>
  )
}

/* ---------- the five pictures, all in one frame: x 900..1780, y 140..730 ---------- */

const PIC = { left: 900, top: 140, width: 880, height: 590 }
const card = 'rounded-[26px] bg-white shadow-[0_30px_60px_-34px_rgba(6,16,43,0.45),0_0_0_1px_rgba(6,16,43,0.06)]'

/** 0 · the MVP build: a terminal that writes the first version. */
function Build() {
  const LINES = [
    { t: '$ retailyai build --market morocco', c: 'text-white/55' },
    { t: '✓ Answers customers on WhatsApp', c: 'text-white' },
    { t: '✓ Replies from the product catalog', c: 'text-white' },
    { t: '✓ Speaks Darija, French and Arabic', c: 'text-white' },
    { t: '✓ Builds the order from the chat', c: 'text-white' },
  ]
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[26px] bg-[#0b1324] shadow-[0_40px_80px_-36px_rgba(6,16,43,0.7)]">
      <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">
        <span className="h-3.5 w-3.5 rounded-full bg-[#ff5f57]" />
        <span className="h-3.5 w-3.5 rounded-full bg-[#febc2e]" />
        <span className="h-3.5 w-3.5 rounded-full bg-[#28c840]" />
        <span className="ml-4 font-mono text-[17px] text-white/50">retailyai · v0.1</span>
      </div>
      <div className="flex-1 space-y-4 px-9 py-8 font-mono text-[25px]">
        {LINES.map((l, i) => (
          <motion.div
            key={l.t}
            className={`${l.c} whitespace-nowrap`}
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 0.6, ease: 'linear', delay: 0.9 + i * 0.5 }}
          >
            {l.t.startsWith('✓') ? (
              <>
                <span className="text-[#5be38f]">✓</span>
                {l.t.slice(1)}
              </>
            ) : (
              l.t
            )}
          </motion.div>
        ))}
      </div>
      <motion.div
        className="m-6 mt-0 flex items-center justify-between rounded-2xl bg-electric px-7 py-5 text-white"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.35, duration: 0.7, delay: 3.6 }}
      >
        <span className="flex items-center gap-4">
          <Mark size={46} back="#9cc0ff" front="#ffffff" />
          <span className="text-[30px] font-semibold">MVP ready</span>
        </span>
        <span className="text-[24px] font-semibold text-white/80">June</span>
      </motion.div>
    </div>
  )
}

/* what merchants asked in the demos, carried into the next step as feedback */
const ASKS = ['Can it answer voice notes?', 'What if the address is wrong?', 'It must ask me before changing an order.', 'Can it send the product photos?']
const SHIPPED = ['Voice notes in Darija', 'Address check before shipping', 'Approval before any change', 'Product photos in the chat']

/** 1 · the demo: the agent on a screen, merchants' questions popping up around it. */
function Demo() {
  return (
    <div className="relative h-full">
      <div className={`${card} absolute flex flex-col overflow-hidden`} style={{ left: 290, top: 20, width: 300, height: 550 }}>
        <div className="flex items-center justify-between bg-[#f6f6f6] px-5 py-3">
          <span className="text-[19px] font-semibold text-ink">Live demo</span>
          <span className="flex items-center gap-2 text-[16px] font-semibold text-[#d93a3a]">
            <motion.span className="h-2.5 w-2.5 rounded-full bg-[#d93a3a]" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
            REC
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-end gap-2.5 p-4" style={{ background: '#efeae2' }}>
          {[
            { s: 'in' as const, t: 'Salam, ch7al?', d: 0.9 },
            { s: 'out' as const, t: '249 DH, livraison fabor', d: 1.4 },
            { s: 'in' as const, t: 'Kayna f noir?', d: 1.9 },
            { s: 'out' as const, t: 'Ah kayna! Bghiti wa7da?', d: 2.4 },
          ].map((m) => (
            <motion.div key={m.t} className={m.s === 'out' ? 'self-end' : ''} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE, delay: m.d }}>
              <Bubble side={m.s} size={19} ticks={m.s === 'out'}>
                {m.t}
              </Bubble>
            </motion.div>
          ))}
        </div>
      </div>
      {/* the questions merchants asked, around the screen */}
      {ASKS.map((q, i) => {
        const pos = [
          { left: 0, top: 40 },
          { left: 610, top: 120 },
          { left: 0, top: 330 },
          { left: 610, top: 400 },
        ][i]
        return (
          <motion.div
            key={q}
            className="absolute flex w-[270px] items-start gap-3 rounded-[20px] bg-white px-4 py-3.5 shadow-[0_20px_40px_-22px_rgba(6,16,43,0.55),0_0_0_1px_rgba(6,16,43,0.06)]"
            style={pos}
            initial={{ opacity: 0, scale: 0.6, rotate: i % 2 ? 6 : -6 }}
            animate={{ opacity: 1, scale: 1, rotate: i % 2 ? 2 : -2 }}
            transition={{ type: 'spring', bounce: 0.4, duration: 0.6, delay: 2.0 + i * 0.45 }}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-paper text-[17px] font-bold text-ink-2">M{i + 1}</span>
            <span className="text-[20px] font-medium leading-snug text-ink">“{q}”</span>
          </motion.div>
        )
      })}
    </div>
  )
}

/** 2 · feedback: each ask moves across the board and ships. */
function Board() {
  return (
    <div className={`${card} flex h-full flex-col p-8`}>
      <div className="grid grid-cols-2 gap-8 text-[19px] font-semibold uppercase tracking-[0.12em] text-ink-3">
        <span>What merchants asked</span>
        <span className="text-electric">In the next version</span>
      </div>
      <div className="relative mt-5 flex-1">
        <div className="absolute inset-y-0 left-1/2 w-px bg-line" />
        {ASKS.map((q, i) => (
          <div key={q} className="absolute inset-x-0" style={{ top: i * 96 }}>
            {/* the ask, fading as it's picked up */}
            <motion.div
              className="absolute left-0 w-[380px] rounded-2xl border-2 border-dashed border-brake bg-brake-soft px-4 py-3 text-[19px] font-medium text-[#7a5a1c]"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0.35 }}
              transition={{ duration: 0.4, delay: 1.0 + i * 0.55 }}
            >
              “{q}”
            </motion.div>
            {/* the shipped card, carried across */}
            <motion.div
              className="absolute right-0 flex w-[380px] items-center gap-3 rounded-2xl bg-electric px-4 py-3 text-[20px] font-semibold text-white shadow-[0_16px_30px_-16px_rgba(30,107,255,0.8)]"
              initial={{ opacity: 0, x: -420, rotate: -4 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 1.0 + i * 0.55 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m4 12.5 5 5L20 6.5" />
              </svg>
              {SHIPPED[i]}
            </motion.div>
          </div>
        ))}
      </div>
      <motion.div
        className="flex items-center justify-between rounded-2xl bg-paper px-6 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 3.4 }}
      >
        <span className="text-[22px] font-semibold text-ink-2">June 4 → June 8</span>
        <span className="text-[40px] font-bold leading-none tracking-[-0.03em] text-ink">
          <Num v={T.discoveryToShippedDays} /> days
        </span>
      </motion.div>
    </div>
  )
}

/** 3 · Meta ads on a real product: taps on "Send message" become chats the agent answers. */
function Ads() {
  const reduced = useReduced()
  const CHATS = ['Salam, ch7al?', 'Kayna f noir?', 'Livraison l Rabat?', 'Bghit wa7da', 'Prix svp']
  return (
    <div className="relative h-full">
      {/* the ad, in the feed */}
      <motion.div
        className={`${card} absolute overflow-hidden`}
        style={{ left: 0, top: 0, width: 330 }}
        initial={{ opacity: 0, y: 40, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{ type: 'spring', bounce: 0.3, duration: 0.9, delay: 0.5 }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-[16px] font-bold text-white">S</span>
          <div className="leading-tight">
            <div className="text-[18px] font-semibold text-ink">Test store</div>
            <div className="text-[15px] text-ink-3">Sponsored</div>
          </div>
          <span className="ml-auto rounded-full bg-electric-soft px-2.5 py-1 text-[14px] font-semibold text-electric">Meta ad</span>
        </div>
        <img src={watch} alt="" className="block h-[290px] w-full object-cover object-[50%_40%]" />
        <div className="px-4 py-3">
          <div className="text-[19px] font-semibold text-ink">Montre Atlas · 249 DH</div>
          <div className="text-[16px] text-ink-3">Livraison fabor, paiement à la livraison</div>
          <div className="relative mt-3 overflow-hidden rounded-xl bg-[#25d366] py-2.5 text-center text-[18px] font-semibold text-white">
            Send message
            {!reduced && (
              <motion.span
                className="absolute left-1/2 top-1/2 block h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60"
                animate={{ scale: [0, 2.6], opacity: [0.8, 0] }}
                transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 0.25, delay: 1.6 }}
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* taps travelling to the agent */}
      {!reduced &&
        [0, 1, 2, 3].map((k) => (
          <motion.span
            key={k}
            className="absolute block h-4 w-4 rounded-full bg-[#25d366] shadow-[0_0_0_6px_rgba(37,211,102,0.18)]"
            style={{ left: 330, top: 470 }}
            animate={{ x: [0, 150], y: [0, -150 + k * 40], opacity: [0, 1, 0] }}
            transition={{ duration: 1.15, repeat: Infinity, delay: 1.7 + k * 0.29, ease: 'easeInOut' }}
          />
        ))}

      {/* the agent's inbox, filling up and answering */}
      <motion.div
        className={`${card} absolute flex flex-col overflow-hidden`}
        style={{ left: 500, top: 30, width: 380, height: 430 }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
      >
        <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
          <Mark size={34} />
          <span className="text-[19px] font-semibold text-ink">RetailyAI agent</span>
          <span className="ml-auto flex items-center gap-1.5 text-[15px] font-semibold text-go">
            <span className="h-2 w-2 rounded-full bg-go" /> live
          </span>
        </div>
        <div className="flex-1 divide-y divide-line">
          {CHATS.map((c, i) => (
            <motion.div
              key={c}
              className="flex items-center gap-3 px-5 py-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: 1.9 + i * 0.4 }}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper text-[15px] font-semibold text-ink-3">{'KYSOH'[i]}</span>
              <span className="flex-1 truncate text-[18px] text-ink">{c}</span>
              <motion.span
                className="rounded-full bg-electric-soft px-2.5 py-0.5 text-[14px] font-semibold text-electric"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5, duration: 0.4, delay: 2.3 + i * 0.4 }}
              >
                Answered
              </motion.span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* the numbers */}
      <motion.div
        className="absolute grid grid-cols-2 gap-4"
        style={{ left: 500, top: 480, width: 380 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 3.8 }}
      >
        <div className="rounded-2xl bg-paper px-4 py-3">
          <div className="text-[32px] font-bold leading-none text-ink">
            <Num v={T.adCampaigns} />
          </div>
          <div className="mt-1 text-[16px] text-ink-3">Meta campaigns</div>
        </div>
        <div className="rounded-2xl bg-paper px-4 py-3">
          <div className="text-[32px] font-bold leading-none text-ink">
            <Num v={T.conversations} />
          </div>
          <div className="mt-1 text-[16px] text-ink-3">chats handled</div>
        </div>
      </motion.div>
    </div>
  )
}

/** 4 · the results: three storefronts switch on. */
function Pilots() {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="grid grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${card} relative overflow-hidden px-6 pb-6 pt-0`}
            initial={{ opacity: 0, y: 60, rotateX: 30 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            style={{ transformPerspective: 1400, transformOrigin: '50% 100%' }}
            transition={{ duration: 1, ease: EASE, delay: 0.7 + i * 0.25 }}
          >
            {/* the awning */}
            <motion.div
              className="-mx-6 h-[54px]"
              initial={{ background: 'repeating-linear-gradient(90deg, #d6deea 0 34px, #f4f7fb 34px 68px)' }}
              animate={{ background: 'repeating-linear-gradient(90deg, #1e6bff 0 34px, #e3edff 34px 68px)' }}
              transition={{ duration: 0.5, delay: 1.8 + i * 0.3 }}
            />
            <div className="mt-6 text-[19px] text-ink-3">Pilot merchant</div>
            <div className="text-[30px] font-semibold text-ink">COD store {i + 1}</div>
            <motion.div
              className="mt-5 flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-[18px] font-semibold"
              initial={{ backgroundColor: '#e7edf5', color: '#687286' }}
              animate={{ backgroundColor: '#e0ebe4', color: '#2f6a4c' }}
              transition={{ duration: 0.4, delay: 1.8 + i * 0.3 }}
            >
              <motion.span
                className="h-2.5 w-2.5 rounded-full"
                initial={{ backgroundColor: '#a2abbb' }}
                animate={{ backgroundColor: '#3a7a5a' }}
                transition={{ duration: 0.4, delay: 1.8 + i * 0.3 }}
              />
              Live on RetailyAI
            </motion.div>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="grid grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 2.8 }}
      >
        <div className={`${card} px-7 py-6`}>
          <div className="text-[56px] font-bold leading-none tracking-[-0.03em] text-ink">
            <Num v={T.testSuccessPct} suffix="%" />
          </div>
          <div className="mt-2 text-[20px] text-ink-3">success on our internal test suite</div>
        </div>
        <div className={`${card} px-7 py-6`} style={{ background: '#0b1324' }}>
          <div className="text-[56px] font-bold leading-none tracking-[-0.03em] text-white">{T.pipelinePerWeek}</div>
          <div className="mt-2 text-[20px] text-white/60">new merchants onboarding a week</div>
        </div>
      </motion.div>
    </div>
  )
}

/* ---------- the stories ---------- */

const STORIES: { head: string[]; text: ReactNode; Pic: () => ReactNode }[] = [
  {
    head: ['We built', 'the MVP.'],
    text: 'June: the first RetailyAI. An agent that answers customers on WhatsApp and builds the order from the chat.',
    Pic: Build,
  },
  {
    head: ['We put it in front', 'of merchants.'],
    text: 'We met COD merchants and demoed it live, on their own products. And we listened to every question.',
    Pic: Demo,
  },
  {
    head: ['Their feedback,', 'our next version.'],
    text: 'We started working on the next version from the feedback we got from our first customers. Four days later, it shipped.',
    Pic: Board,
  },
  {
    head: ['We ran', 'Meta ads.'],
    text: 'A Meta ad campaign on real e-commerce products, to test our AI agent on real customers, at real volume.',
    Pic: Ads,
  },
  {
    head: [`${T.pilots ?? '3'} pilots,`, 'live today.'],
    text: 'Merchants are running RetailyAI on their own stores, and more are joining every week.',
    Pic: Pilots,
  },
]

export default function S13Traction({ step }: SceneProps) {
  const reduced = useReduced()
  const s = STORIES[step]
  return (
    <div className="absolute inset-0 overflow-hidden bg-paper text-ink">
      <Road step={step} />

      {/* the story's picture: each one arrives like the next stop coming into view */}
      <div className="absolute" style={PIC}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="absolute inset-0"
            style={{ transformPerspective: 2000, transformOrigin: '0% 50%' }}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 200, rotateY: -20, filter: 'blur(12px)' }}
            animate={{ opacity: 1, x: 0, rotateY: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -160, scale: 0.96, filter: 'blur(10px)', transition: { duration: 0.4, ease: EASE_IN } }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
          >
            <s.Pic />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* the caption column */}
      <motion.div className="absolute left-[140px] top-[150px] flex items-center gap-4" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: EASE }}>
        <div className="flex gap-1.5">
          {STORIES.map((_, i) => (
            <motion.span
              key={i}
              className={`h-2.5 rounded-full ${i <= step ? 'bg-electric' : 'bg-ink/15'}`}
              initial={false}
              animate={{ width: i === step ? 40 : 10 }}
              transition={{ duration: 0.6, ease: EASE }}
            />
          ))}
        </div>
        <span className="text-[26px] font-semibold text-electric">Traction · already on the road</span>
      </motion.div>
      <div className="absolute left-[140px] top-[210px] w-[720px]">
        <Lines k={step} lines={s.head} className="display text-[88px]" delay={0.2} />
        <Fade k={`t${step}`} delay={0.7} className="lede mt-9 max-w-[660px] text-[30px] text-ink-2">
          {s.text}
        </Fade>
      </div>
    </div>
  )
}
