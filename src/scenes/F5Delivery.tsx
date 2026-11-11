import { motion } from 'motion/react'
import { BOX, GAP, Reveal } from '../components/Cine'
import { FeatureFrame, cardCls } from '../components/Feature'
import { Dashes, Paper, Row } from '../components/Receipt'
import { EASE, useReduced } from '../deck/motion'
import type { SceneProps } from '../deck/types'
import olivraisonLogo from '../assets/carriers/olivraison.png'
import ozonLogo from '../assets/carriers/ozon-express.png'
import speedafLogo from '../assets/carriers/speedaf.png'

/*
 * 5 · Delivery
 * 0 confirmed order → the parcel flies to one of several delivery companies → booked
 * 1 the waybill prints out of the slot under the order
 * 2 live delivery updates light up on the order, no courier website
 *
 * Composition: two columns on BOX, 420 | 476. Left: order, then the waybill,
 * printing past the bottom of the frame. Right: carriers, then the live track,
 * which is on stage from the start and lands on BOX's foot.
 */

const L_W = 420
const R_X = BOX.x + L_W + GAP
const R_W = BOX.r - R_X
const ORDER_H = 150
const SLOT_Y = BOX.y + ORDER_H + 30
/* real Moroccan delivery companies, with their own logos (taken from their websites) */
const CARRIERS: { name: string; logo: string; wordmark?: boolean }[] = [
  { name: 'Ozon Express', logo: ozonLogo },
  { name: 'Olivraison', logo: olivraisonLogo },
  { name: 'Speedaf', logo: speedafLogo, wordmark: true },
]
const CARR_H = 300
const TRACK_Y = BOX.y + CARR_H + GAP
const ROW_Y = (i: number) => BOX.y + 26 + 42 + i * 76 // carrier row tops

const TRACK = [
  ['Booked', 'Mon 02:16'],
  ['Picked up', 'Mon 10:30'],
  ['In transit', 'Mon 14:05'],
  ['Out for delivery', 'Tue 09:12'],
  ['Delivered · 249 DH collected', 'Tue 13:40'],
]

function Barcode() {
  const bars = Array.from({ length: 44 }, (_, i) => ((i * 7919) % 5) + 1)
  return (
    <div className="flex h-[70px] items-stretch gap-[3px]">
      {bars.map((w, i) => (
        <div key={i} className="bg-ink" style={{ width: w }} />
      ))}
    </div>
  )
}

export default function F5Delivery({ step }: SceneProps) {
  const reduced = useReduced()
  const label = step >= 1
  const live = step >= 2
  return (
    <FeatureFrame
      n={6}
      headline={['From chat', 'to waybill.']}
      subKey={step}
      sub={
        live
          ? 'Live delivery updates on every order. You never open the delivery company’s website.'
          : label
            ? 'It creates the shipping label, ready for pickup.'
            : 'Several delivery companies, more than one at once if you like. It books the parcel itself.'
      }
    >
      {/* the confirmed order */}
      <Reveal shot="drop" delay={0.2} className={`${cardCls} absolute flex flex-col justify-center px-7`} style={{ left: BOX.x, top: BOX.y, width: L_W, height: ORDER_H, zIndex: 3 }}>
        <div className="flex items-center justify-between">
          <span className="text-[26px] font-semibold text-ink">Order #3112</span>
          <span className="rounded-full bg-electric px-3 py-1 text-[18px] font-semibold text-white">COD confirmed</span>
        </div>
        <div className="mt-2 text-[21px] text-ink-3">Montre Atlas, noir · 249 DH · Casablanca</div>
      </Reveal>

      {/* the printer slot, and the waybill printing out of it past the frame */}
      <Reveal shot="rise" delay={0.5} className="absolute h-[14px] rounded-full bg-ink" style={{ left: BOX.x - 10, top: SLOT_Y, width: L_W + 20, zIndex: 2 }}>
        <span />
      </Reveal>
      {/* where the label will print: keeps the column whole before step 1 */}
      <Reveal
        shot="wipe"
        delay={0.6}
        className="absolute grid place-items-center rounded-b-[22px] border-2 border-t-0 border-dashed border-line text-center text-[22px] text-ink-4"
        style={{ left: BOX.x + 10, top: SLOT_Y + 14, width: L_W - 20, height: BOX.b - SLOT_Y - 14 }}
      >
        Shipping label
        <br />
        prints here
      </Reveal>
      <div className="absolute overflow-hidden" style={{ left: BOX.x + 10, top: SLOT_Y + 7, width: L_W - 20, height: 1080 - SLOT_Y }}>
        {label && (
        <motion.div
          initial={{ y: -760 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.8, ease: [0.3, 0.7, 0.2, 1], delay: 0.4 }}
        >
          <Paper className="px-7 pt-7" style={{ minHeight: 1080 - SLOT_Y + 60 }}>
            <div className="flex items-baseline justify-between">
              <span className="text-[30px] font-semibold tracking-[0.1em]">WAYBILL</span>
              <span className="flex items-center gap-2 font-sans text-[20px] font-semibold text-ink-2">
                <img src={olivraisonLogo} alt="" className="h-8 w-auto" />
                Olivraison
              </span>
            </div>
            <Dashes className="mt-4" />
            <div className="mt-4 text-[19px] text-ink-3">FROM</div>
            <div className="text-[22px]">Boutique Salma, Casablanca</div>
            <div className="mt-3 text-[19px] text-ink-3">TO</div>
            <div className="text-[22px]">Khadija B.</div>
            <div className="text-[22px]">Hay Hassani, Casablanca</div>
            <Dashes className="mt-4" />
            <Row className="mt-4 text-[24px] font-semibold" label="COD TO COLLECT" value="249.00" />
            <div className="mt-5">
              <Barcode />
            </div>
            <div className="mt-2 text-center text-[19px] tracking-[0.2em]">OL 0311 2026 1102</div>
            <Dashes className="mt-5" />
            <Row className="mt-4 text-[19px] text-ink-3" label="PICKUP" value="MON 10:30" />
          </Paper>
        </motion.div>
        )}
      </div>

      {/* the carriers */}
      <Reveal shot="swing" delay={0.45} className={`${cardCls} absolute px-6 pt-[26px]`} style={{ left: R_X, top: BOX.y, width: R_W, height: CARR_H }}>
        <div className="mb-3 h-[30px] text-[20px] font-semibold text-ink-3">Your delivery companies</div>
        <div className="space-y-3">
          {CARRIERS.map((c, i) => (
            <motion.div
              key={c.name}
              className="flex h-16 items-center justify-between rounded-2xl border-[3px] px-5 text-[23px] font-semibold"
              initial={{ borderColor: 'rgba(0,0,0,0)', color: '#687286', backgroundColor: '#f4f7fb' }}
              animate={i === 1 ? { borderColor: '#1e6bff', color: '#0b1324', backgroundColor: '#ffffff' } : {}}
              transition={{ duration: 0.4, delay: 2.15 }}
            >
              <span className="flex items-center gap-3">
                <img src={c.logo} alt={c.wordmark ? c.name : ''} className={c.wordmark ? 'h-[38px] w-auto' : 'h-10 w-10 object-contain'} />
                {!c.wordmark && c.name}
              </span>
              {i === 1 && (
                <motion.span className="text-[19px] text-electric" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 2.3 }}>
                  Parcel booked ✓
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      </Reveal>

      {/* the parcel, carried from the order to the carrier that books it */}
      {!reduced && step === 0 && (
        <motion.div
          className="pointer-events-none absolute z-20 grid h-14 w-14 place-items-center rounded-xl bg-[#c8a274] shadow-[0_18px_30px_-12px_rgba(6,16,43,0.5)]"
          initial={{ left: BOX.x + L_W - 90, top: BOX.y + 40, opacity: 0, scale: 0.6, rotate: 0 }}
          animate={{
            left: [BOX.x + L_W - 90, BOX.x + L_W - 90, R_X + R_W - 120, R_X + R_W - 120],
            top: [BOX.y + 40, BOX.y - 40, ROW_Y(1) + 4, ROW_Y(1) + 4],
            opacity: [0, 1, 1, 0],
            scale: [0.6, 1, 0.9, 0.5],
            rotate: [0, -8, 6, 0],
          }}
          transition={{ duration: 1.3, delay: 1.0, times: [0, 0.2, 0.8, 1], ease: EASE }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#8a6a43" strokeWidth="1.8" aria-hidden>
            <path d="M3 8l9 4 9-4M12 12v9M3 8v9l9 4 9-4V8l-9-4-9 4Z" />
          </svg>
        </motion.div>
      )}

      {/* live delivery updates: on stage from the start, lit at step 2 */}
      <Reveal shot="lift" delay={0.7} className={`${cardCls} absolute flex flex-col p-7`} style={{ left: R_X, top: TRACK_Y, width: R_W, height: BOX.b - TRACK_Y }}>
        <div className="flex items-center justify-between">
          <div className="text-[22px] font-semibold text-ink">On the order, live</div>
          <motion.span
            className="flex items-center gap-2 text-[18px] font-semibold"
            initial={false}
            animate={{ color: live ? '#3a7a5a' : '#a2abbb' }}
            transition={{ duration: 0.4, delay: live ? 0.3 : 0 }}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${live ? 'animate-pulse bg-go' : 'bg-ink-4'}`} /> {live ? 'Tracking' : 'Waiting for pickup'}
          </motion.span>
        </div>
        <div className="relative mt-5 flex flex-1 flex-col justify-between">
          <div className="absolute bottom-3 left-[11px] top-3 w-[3px] bg-line" />
          <motion.div
            className="absolute left-[11px] top-3 w-[3px] origin-top bg-electric"
            style={{ bottom: 12 }}
            initial={false}
            animate={{ scaleY: live ? 1 : 0 }}
            transition={{ duration: live ? 2.2 : 0.3, ease: 'linear', delay: live ? 0.5 : 0 }}
          />
          {TRACK.map(([s, t], i) => {
            const last = i === TRACK.length - 1
            const lit = live || i === 0
            const d = live ? 0.5 + i * 0.5 : 0
            return (
              <div key={s} className="relative flex items-start gap-5">
                <motion.span
                  className="relative z-10 mt-1 h-[25px] w-[25px] shrink-0 rounded-full border-[5px]"
                  initial={false}
                  animate={{ borderColor: lit ? (last ? '#3a7a5a' : '#1e6bff') : '#d6deea', backgroundColor: lit && last ? '#3a7a5a' : '#ffffff', scale: live && i > 0 ? [1, 1.35, 1] : 1 }}
                  transition={{ duration: 0.45, delay: d }}
                />
                <motion.div initial={false} animate={{ opacity: lit ? 1 : 0.4 }} transition={{ duration: 0.4, delay: d }}>
                  <div className={`text-[23px] font-semibold ${last && live ? 'text-[#2f6a4c]' : 'text-ink'}`}>{s}</div>
                  <div className="text-[19px] text-ink-3 tabular">{lit ? t : '—'}</div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </Reveal>
    </FeatureFrame>
  )
}
