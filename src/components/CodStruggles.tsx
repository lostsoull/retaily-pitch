import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE } from '../deck/motion'
import { Bubble } from './Chat'

/*
 * Visual breaks for the cold open, shown while the presenter speaks.
 * CallScreen: the confirmation call nobody picks up (for those who did COD).
 * Struggles: a collage of the everyday COD failures (for those who never did).
 */

export function CallScreen() {
  return (
    <motion.div
      className="relative w-[500px] overflow-hidden rounded-[56px] bg-[#111b21] p-10 text-white shadow-[0_60px_120px_-40px_rgba(0,0,0,0.8)]"
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, transition: { duration: 0.3 } }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
    >
      <div className="text-center text-[24px] text-white/55">Calling…</div>
      <div className="relative mx-auto mt-8 grid h-[170px] w-[170px] place-items-center">
        {[0, 1, 2].map((k) => (
          <motion.span
            key={k}
            className="absolute inset-0 rounded-full border-4 border-brake"
            initial={{ opacity: 0.7, scale: 0.7 }}
            animate={{ opacity: 0, scale: 1.7 }}
            transition={{ duration: 2.4, repeat: Infinity, delay: k * 0.8, ease: 'easeOut' }}
          />
        ))}
        <div className="grid h-[150px] w-[150px] place-items-center rounded-full bg-[#2a3942] text-[64px] font-semibold">K</div>
      </div>
      <div className="mt-8 text-center text-[38px] font-semibold">Khadija B.</div>
      <div className="mt-1 text-center text-[24px] text-white/55">Order #2087 · 249 DH · COD</div>
      <div className="mt-9 space-y-3 text-[24px]">
        {[
          ['10:02', 'No answer'],
          ['13:40', 'No answer'],
          ['18:15', 'Calling, 3rd attempt'],
        ].map(([t, s], i) => (
          <motion.div
            key={t}
            className="flex justify-between rounded-2xl bg-white/5 px-5 py-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.2 + i * 0.35 }}
          >
            <span className="text-white/55 tabular">{t}</span>
            <span className={i === 2 ? 'text-brake' : 'text-loss'}>{s}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function Pop({ x, y, r, d, children }: { x: number; y: number; r: number; d: number; children: ReactNode }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.6, rotate: r * 2 }}
      animate={{ opacity: 1, scale: 1, rotate: r }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      transition={{ type: 'spring', bounce: 0.4, duration: 0.6, delay: d }}
    >
      {children}
    </motion.div>
  )
}

const card = 'rounded-[22px] bg-white text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]'

export function Struggles() {
  const d0 = 0.7
  const gap = 0.45
  return (
    <>
      {/* the courier gives up */}
      <Pop x={880} y={110} r={-3} d={d0}>
        <div className={`${card} w-[420px] px-7 py-5`}>
          <div className="text-[20px] text-ink-3">Courier update · #2081</div>
          <div className="mt-1 text-[30px] font-semibold">Client injoignable</div>
          <div className="mt-3 inline-block rounded-full bg-loss-soft px-4 py-1 text-[21px] font-semibold text-loss">Returned to sender</div>
        </div>
      </Pop>

      {/* the order that was never real */}
      <Pop x={1380} y={180} r={4} d={d0 + gap}>
        <div className={`${card} w-[380px] px-7 py-5 font-mono text-[22px]`}>
          <div className="text-ink-3">ORDER #2093</div>
          <div className="mt-2">Name: test test</div>
          <div>Phone: 0600000000</div>
          <div>Address: ok</div>
          <div className="mt-3 font-sans text-[21px] font-semibold text-loss">Fake order</div>
        </div>
      </Pop>

      {/* the address no courier can find */}
      <Pop x={960} y={420} r={2} d={d0 + gap * 2}>
        <div className="w-[470px]">
          <Bubble side="in" theme="dark" size={28} time="17:40">
            Sifto l dar, 9rib l’hanout dyal Si Ahmed
          </Bubble>
          <div className="ml-6 mt-3 inline-block rounded-full bg-brake px-4 py-1 text-[21px] font-semibold text-ink">Address not found</div>
        </div>
      </Pop>

      {/* the parcel refused at the door */}
      <Pop x={1470} y={520} r={-5} d={d0 + gap * 3}>
        <div className="relative w-[330px] rounded-[18px] bg-[#c8a274] p-6 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]">
          <div className="rounded-lg bg-white/90 px-4 py-3 text-[21px]">
            <div className="font-semibold">COD · 249 DH</div>
            <div className="text-ink-3">Hay Hassani, Casa</div>
          </div>
          <div className="absolute -right-4 top-14 rotate-[-14deg] rounded-lg border-[5px] border-loss px-3 py-0.5 text-[34px] font-black tracking-wide text-loss">
            REFUSÉ
          </div>
        </div>
      </Pop>

      {/* the customer who will "think about it" */}
      <Pop x={900} y={700} r={-2} d={d0 + gap * 4}>
        <div className="w-[440px]">
          <Bubble side="in" theme="dark" size={28} time="22:05">
            Ghadi nchouf w nrd 3lik…
          </Bubble>
          <div className="ml-6 mt-2 text-[21px] text-white/45">Last seen 3 days ago</div>
        </div>
      </Pop>

      {/* the ad that paid for nothing */}
      <Pop x={1420} y={830} r={3} d={d0 + gap * 5}>
        <div className={`${card} w-[380px] px-7 py-5`}>
          <div className="text-[20px] text-ink-3">Ads, yesterday</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-[30px] font-semibold">41 chats</span>
            <span className="text-[30px] font-semibold text-loss">6 orders</span>
          </div>
          <div className="mt-1 text-[20px] text-ink-3">The rest never got a reply</div>
        </div>
      </Pop>
    </>
  )
}
