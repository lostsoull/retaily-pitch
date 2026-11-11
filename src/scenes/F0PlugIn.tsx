import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import ad from '../assets/ad-watch.webp'
import { BOX, GAP, Reveal } from '../components/Cine'
import { FeatureFrame, cardCls } from '../components/Feature'
import { Mark } from '../components/Mark'
import { EASE, EASE_IN, useReduced } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * 1 · Plug in, connect: the first thing a merchant does.
 * 0 plug in your store: the store is the hero; its products and orders stream into RetailyAI
 * 1 your own number, never blocked: connected through Meta's verified WhatsApp API,
 *   next to the unofficial tools that get numbers banned
 */

const STORE_W = 460
const TILE = { w: 190, h: 196, gap: 20 }
const PRODUCTS = [
  { name: 'Montre Atlas', price: '249 DH', img: true, tint: '#1f2228' },
  { name: 'Robe à fleurs', price: '199 DH', tint: '#e7c9c2' },
  { name: 'Survêtement', price: '259 DH', tint: '#b9c3d6' },
  { name: 'Pyjama licorne', price: '149 DH', tint: '#e5d5ea' },
  { name: 'Ensemble lin', price: '250 DH', tint: '#e8dcc6' },
  { name: 'Sac cabas', price: '189 DH', tint: '#cfc4b3' },
]
const ORB = 260
const ORB_X = BOX.r - ORB
const ORB_Y = 540 - ORB / 2

const tilePos = (i: number) => ({
  x: BOX.x + 30 + (i % 2) * (TILE.w + TILE.gap),
  y: BOX.b - 30 - (3 * TILE.h + 2 * TILE.gap) + Math.floor(i / 2) * (TILE.h + TILE.gap),
})

/** Products and orders leaving the store for RetailyAI, on a loop. */
function Stream() {
  const reduced = useReduced()
  if (reduced) return null
  const items = [...PRODUCTS.map((p) => `${p.name} · ${p.price}`), 'Order #2087', 'Order #2088']
  return (
    <>
      {items.map((s, i) => {
        const from = tilePos(i % PRODUCTS.length)
        return (
          <motion.div
            key={s}
            className="absolute left-0 top-0 z-20 whitespace-nowrap rounded-full bg-ink px-4 py-1.5 text-[19px] font-semibold text-white shadow-[0_12px_24px_-12px_rgba(6,16,43,0.6)]"
            initial={{ x: from.x + 40, y: from.y + 80, opacity: 0, scale: 0.8 }}
            animate={{
              x: [from.x + 40, from.x + 300, ORB_X - 40, ORB_X + ORB / 2 - 60],
              y: [from.y + 80, from.y + 60, ORB_Y + ORB / 2 - 20, ORB_Y + ORB / 2 - 16],
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1, 1, 0.4],
            }}
            transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.6, delay: 1.6 + i * 0.52, ease: 'easeInOut', times: [0, 0.25, 0.8, 1] }}
          >
            {s}
          </motion.div>
        )
      })}
    </>
  )
}

function Store() {
  return (
    <>
      <Reveal shot="lift" delay={0.2} duration={1.4} className={`${cardCls} absolute flex flex-col`} style={{ left: BOX.x, top: BOX.y, width: STORE_W, height: BOX.h }}>
        <div className="flex items-center justify-between px-7 pt-7">
          <div>
            <div className="text-[19px] text-ink-3">Your store</div>
            <div className="text-[30px] font-semibold">Boutique Salma</div>
          </div>
          <motion.div
            className="inline-flex items-center gap-2 rounded-full bg-go-soft px-3 py-1 text-[18px] font-semibold text-go"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.55, duration: 0.6, delay: 1.2 }}
          >
            <span className="h-2 w-2 rounded-full bg-go" /> Connected
          </motion.div>
        </div>
        <div className="mt-auto grid grid-cols-2 gap-5 p-[30px] pt-0" style={{ gridAutoRows: TILE.h }}>
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.name}
              className="flex flex-col overflow-hidden rounded-2xl bg-paper"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.6 + i * 0.08 }}
            >
              <div className="flex-1" style={{ background: p.tint }}>
                {p.img && <img src={ad} alt="" className="h-full w-full object-cover object-[50%_40%]" />}
              </div>
              <div className="px-3 py-2 text-[18px] leading-tight">
                <div className="truncate font-semibold">{p.name}</div>
                <div className="text-ink-3 tabular">{p.price}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Reveal>

      {/* RetailyAI, smaller, on the frame's horizon */}
      <Reveal
        shot="focus"
        delay={0.6}
        duration={1.4}
        className="absolute grid place-items-center rounded-full bg-white shadow-[0_40px_70px_-36px_rgba(6,16,43,0.5),0_0_0_1px_rgba(6,16,43,0.06)]"
        style={{ left: ORB_X, top: ORB_Y, width: ORB, height: ORB }}
      >
        <div className="text-center">
          <Mark size={110} draw delay={0.9} />
          <div className="mt-3 text-[22px] font-semibold text-ink-2">RetailyAI</div>
        </div>
      </Reveal>

      {/* the dotted path the stream follows */}
      <motion.div
        className="absolute h-0 border-t-[3px] border-dotted border-ink-4"
        style={{ left: BOX.x + STORE_W + 30, top: 540, width: ORB_X - BOX.x - STORE_W - 60, originX: 0 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: EASE, delay: 1.1 }}
      />
      <Stream />
      <motion.div
        className="absolute text-center text-[20px] text-ink-3"
        style={{ left: ORB_X - 40, top: ORB_Y + ORB + 24, width: ORB + 80 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        Products and orders, imported on their own
      </motion.div>
    </>
  )
}

/* ---------- 1 · your own number, on Meta's verified API ---------- */

function Check({ ok }: { ok: boolean }) {
  return ok ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

function Row({ ok, children, d }: { ok: boolean; children: ReactNode; d: number }) {
  return (
    <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: EASE, delay: d }}>
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${ok ? 'bg-white/15 text-white' : 'bg-paper text-ink-3'}`}>
        <Check ok={ok} />
      </span>
      <span className="text-[22px] leading-snug">{children}</span>
    </motion.div>
  )
}

const TOP_H = 300

function Number() {
  const reduced = useReduced()
  return (
    <>
      {/* the merchant's own number, verified */}
      <Reveal shot="lift" delay={0.2} className={`${cardCls} absolute flex items-center gap-8 px-10`} style={{ left: BOX.x, top: BOX.y, width: BOX.w, height: TOP_H }}>
        <div className="grid h-[120px] w-[120px] shrink-0 place-items-center rounded-[32px] bg-[#25d366] text-white">
          <svg width="66" height="66" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.4 4.8 5-1.3A9.8 9.8 0 1 0 12 2.2Zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2c0 1.2.9 2.3 1 2.5.1.2 1.7 2.6 4.2 3.7 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.4Z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[22px] text-ink-3">Your WhatsApp number</div>
          <div className="mt-1 text-[60px] font-bold leading-none tracking-[-0.02em] text-ink tabular">+212 6•• ••• •78</div>
          <motion.div
            className="mt-4 inline-flex items-center gap-2.5 rounded-full bg-electric px-4 py-2 text-[20px] font-semibold text-white"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.6, delay: 1.3 }}
          >
            {/* the verified seal */}
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 1.8l2.4 1.8 3-.2.9 2.9 2.5 1.7-1 2.8 1 2.8-2.5 1.7-.9 2.9-3-.2L12 22.2l-2.4-1.8-3 .2-.9-2.9-2.5-1.7 1-2.8-1-2.8 2.5-1.7.9-2.9 3 .2z" fill="#fff" />
              <motion.path d="m8 12.3 2.7 2.7L16.3 9.4" fill="none" stroke="#1e6bff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.7 }} />
            </svg>
            Verified · Meta’s official WhatsApp API
          </motion.div>
        </div>
        {/* connected to the agent */}
        <div className="flex shrink-0 items-center gap-4">
          <div className="relative h-[6px] w-[90px] rounded-full bg-paper">
            {!reduced &&
              [0, 1].map((k) => (
                <motion.span
                  key={k}
                  className="absolute top-1/2 block h-3 w-3 -translate-y-1/2 rounded-full bg-electric"
                  animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: 1.8 + k * 0.7, ease: 'easeInOut', times: [0, 0.15, 0.85, 1] }}
                />
              ))}
          </div>
          <div className="grid h-[96px] w-[96px] place-items-center rounded-full bg-white shadow-[0_0_0_1px_rgba(6,16,43,0.08),0_20px_40px_-24px_rgba(6,16,43,0.5)]">
            <Mark size={56} />
          </div>
        </div>
      </Reveal>

      {/* the comparison: unofficial tools vs the official API */}
      <Reveal
        shot="rise"
        delay={0.7}
        className={`${cardCls} absolute flex flex-col p-8`}
        style={{ left: BOX.x, top: BOX.y + TOP_H + GAP, width: 400, height: BOX.h - TOP_H - GAP }}
      >
        <div className="text-[19px] font-semibold uppercase tracking-[0.14em] text-ink-3">Unofficial tools</div>
        <div className="mt-5 space-y-4 text-ink-2">
          <Row ok={false} d={1.0}>Hack WhatsApp Web</Row>
          <Row ok={false} d={1.2}>Numbers get blocked</Row>
          <Row ok={false} d={1.4}>Chats and customers lost</Row>
        </div>
        <motion.div
          className="mt-auto w-fit rounded-xl border-[5px] border-ink-3 px-4 py-1 text-[34px] font-black uppercase tracking-[0.04em] text-ink-3"
          style={{ rotate: -7 }}
          initial={{ opacity: 0, scale: 2 }}
          animate={{ opacity: 0.8, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.35, duration: 0.5, delay: 2.0 }}
        >
          Blocked
        </motion.div>
      </Reveal>
      <Reveal
        shot="rise"
        delay={0.9}
        className="absolute flex flex-col rounded-[26px] bg-electric p-8 text-white shadow-[0_40px_70px_-34px_rgba(30,107,255,0.8)]"
        style={{ left: BOX.x + 400 + GAP, top: BOX.y + TOP_H + GAP, width: BOX.w - 400 - GAP, height: BOX.h - TOP_H - GAP }}
      >
        <div className="flex items-center gap-3 text-[19px] font-semibold uppercase tracking-[0.14em] text-white/70">
          <Mark size={30} back="#9cc0ff" front="#ffffff" /> RetailyAI
        </div>
        <div className="mt-5 space-y-4">
          <Row ok d={1.6}>Meta’s verified WhatsApp Business API</Row>
          <Row ok d={1.8}>Your own number, kept by you</Row>
          <Row ok d={2.0}>No risk of getting blocked</Row>
        </div>
        <motion.div
          className="mt-auto text-[26px] font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 2.4 }}
        >
          Safe at any volume.
        </motion.div>
      </Reveal>
    </>
  )
}

const HEAD = [
  ['Plug in', 'your store.'],
  ['Your number,', 'never blocked.'],
]
const SUB = [
  'Products and orders import from your online store in minutes. No website? Add your products by hand.',
  'RetailyAI connects through Meta’s verified WhatsApp API. Merchants keep their own number, without the bans unofficial tools get.',
]

export default function F0PlugIn({ step }: SceneProps) {
  const reduced = useReduced()
  return (
    <FeatureFrame n={1} headline={HEAD[step]} subKey={step} sub={SUB[step]}>
      <AnimatePresence mode="wait" initial={true}>
        <motion.div
          key={step}
          className="absolute inset-0"
          initial={reduced || step === 0 ? { opacity: 1 } : { opacity: 0, y: 160, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -200, filter: 'blur(10px)', transition: { duration: 0.6, ease: EASE_IN } }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          {step === 0 ? <Store /> : <Number />}
        </motion.div>
      </AnimatePresence>
    </FeatureFrame>
  )
}
