import { AnimatePresence, motion } from 'motion/react'
import { Bubble } from '../components/Chat'
import { BOX, GAP, Reveal } from '../components/Cine'
import { FeatureFrame, cardCls } from '../components/Feature'
import { EASE, EASE_IN, useReduced } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * 2 · Address check
 * 0 a loose address becomes a checked one: name, phone, town matched against real towns
 * 1 an unclear town: the order cannot ship until a person confirms it
 *
 * Composition: the customer's words overlap the ticket's top-left corner and
 * poke into the gutter; the ticket and the verdict bar share BOX's bottom edge.
 * Each step flips to the next ticket.
 */

const TOWNS = ['Agadir', 'Béni Mellal', 'Berrechid', 'Casablanca', 'El Jadida', 'Fès', 'Kénitra', 'Marrakech', 'Meknès', 'Oujda', 'Rabat', 'Tanger']
const ROW = 54
const REEL_H = 340
const BAR_H = 104
const CARD_TOP = BOX.y + 40
const CARD_H = BOX.b - BAR_H - GAP - CARD_TOP

function TownReel({ target }: { target: number }) {
  const reduced = useReduced()
  const y0 = REEL_H / 2 - ROW / 2
  return (
    <div className="relative overflow-hidden rounded-2xl bg-paper" style={{ height: REEL_H }}>
      <div className="pointer-events-none absolute inset-x-3 top-1/2 z-10 -translate-y-1/2 rounded-xl border-[3px] border-electric" style={{ height: ROW + 6 }} />
      <motion.div
        className="absolute inset-x-0"
        style={{ filter: reduced ? undefined : 'blur(0px)' }}
        initial={{ y: y0 + 4 * ROW }}
        animate={{ y: y0 - target * ROW }}
        transition={reduced ? { duration: 0 } : { duration: 2.0, ease: [0.2, 0.7, 0.15, 1], delay: 1.3 }}
      >
        {TOWNS.map((t, i) => (
          <div key={t} className={`flex items-center px-6 text-[26px] ${i === target ? 'font-semibold text-ink' : 'text-ink-4'}`} style={{ height: ROW }}>
            {t}
          </div>
        ))}
      </motion.div>
      {/* the reel fades at its ends, like a real drum */}
      <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(#f4f7fb 0%, transparent 28%, transparent 72%, #f4f7fb 100%)' }} />
    </div>
  )
}

function Field({ label, value, ok, d, tone = 'go' }: { label: string; value: string; ok: string; d: number; tone?: 'go' | 'brake' }) {
  return (
    <Reveal delay={d} shot="rise" duration={0.8} className="flex flex-1 items-center justify-between gap-4 border-t border-line">
      <div>
        <div className="text-[19px] text-ink-3">{label}</div>
        <div className="text-[26px] font-semibold text-ink">{value}</div>
      </div>
      <span className={`shrink-0 rounded-full px-4 py-1.5 text-[19px] font-semibold ${tone === 'go' ? 'bg-go-soft text-[#2f6a4c]' : 'bg-brake-soft text-[#7a5a1c]'}`}>{ok}</span>
    </Reveal>
  )
}

export default function F2Address({ step }: SceneProps) {
  const unclear = step >= 1
  const reduced = useReduced()
  return (
    <FeatureFrame
      n={3}
      headline={['No more parcels', 'to nowhere.']}
      subKey={step}
      sub={
        unclear
          ? 'If the town is unclear, the order cannot ship until a person confirms it.'
          : 'Every delivery town is matched against a list of real Moroccan towns. A name and a phone number are required.'
      }
    >
      {/* the ticket, flipping to the next order on each step */}
      <div className="absolute" style={{ left: BOX.x, top: CARD_TOP, width: BOX.w, height: CARD_H, perspective: 2000 }}>
        <AnimatePresence mode="wait" initial={true}>
          <motion.div
            key={step}
            className={`${cardCls} flex h-full flex-col px-9 pb-7 pt-[72px]`}
            style={{ transformOrigin: '50% 0%' }}
            initial={reduced ? { opacity: 0 } : { opacity: 0, rotateX: 60, y: 90, filter: 'blur(10px)' }}
            animate={{ opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)', transition: { duration: 1.1, ease: EASE, delay: 0.25 }, transitionEnd: { filter: 'none' } }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, rotateX: -50, y: -60, transition: { duration: 0.4, ease: EASE_IN } }}
          >
            <div className="flex items-baseline justify-between">
              <div className="text-[30px] font-semibold text-ink">Shipping details</div>
              <div className="text-[24px] text-ink-3 tabular">Order #{unclear ? '3127' : '3112'}</div>
            </div>
            <div className="mt-5 grid flex-1 grid-cols-[1fr_340px] gap-8">
              <div className="flex flex-col">
                <Field label="Name" value={unclear ? 'Hamza' : 'Khadija B.'} ok="Required ✓" d={0.8} />
                <Field label="Phone" value={unclear ? 'Missing' : '06 12 •• •• 78'} ok={unclear ? 'Ask customer' : 'Required ✓'} tone={unclear ? 'brake' : 'go'} d={1.0} />
                <Field
                  label="Town"
                  value={unclear ? '“Sidi”' : '“Kaza” → Casablanca'}
                  ok={unclear ? '3 possible towns' : 'Matched ✓'}
                  tone={unclear ? 'brake' : 'go'}
                  d={unclear ? 2.0 : 3.1}
                />
              </div>
              <div className="flex flex-col">
                <div className="mb-2 text-[19px] text-ink-3">Real Moroccan towns</div>
                {unclear ? (
                  <div className="flex flex-col justify-center gap-3 rounded-2xl bg-paper px-5" style={{ height: REEL_H }}>
                    {['Sidi Bennour', 'Sidi Kacem', 'Sidi Slimane'].map((t, i) => (
                      <Reveal key={t} delay={1.3 + i * 0.22} shot="right" duration={0.9} className="rounded-xl border-2 border-dashed border-brake px-4 py-2.5 text-[24px] font-semibold text-ink">
                        {t}?
                      </Reveal>
                    ))}
                  </div>
                ) : (
                  <TownReel target={3} />
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* the satellite: the customer's own words, overlapping the ticket's corner */}
      <div className="absolute z-10" style={{ left: BOX.x - 36, top: BOX.y, width: BOX.w - 60 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: -120, rotate: -3, filter: 'blur(12px)' }}
            animate={{ opacity: 1, x: 0, rotate: -1.5, filter: 'blur(0px)', transition: { duration: 1.0, ease: EASE, delay: 0.5 }, transitionEnd: { filter: 'none' } }}
            exit={{ opacity: 0, x: -40, transition: { duration: 0.3 } }}
          >
            <Bubble side="in" size={28} time={unclear ? '15:02' : '11:40'} style={{ boxShadow: '0 24px 40px -22px rgba(6,16,43,0.5)' }}>
              {unclear ? 'Ana f Sidi, 7da l’marché, Hamza' : 'Khadija, 0612••••78, Hay Hassani 9rib l’hanout, Kaza'}
            </Bubble>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* the verdict, printed across the box's foot */}
      <motion.div
        key={`res-${step}`}
        className={`absolute flex items-center justify-between rounded-[22px] px-9 text-[30px] font-semibold ${unclear ? 'bg-brake text-ink' : 'bg-go text-white'}`}
        style={{ left: BOX.x, top: BOX.b - BAR_H, width: BOX.w, height: BAR_H }}
        initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0% 100% 0% 0%)' }}
        animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: unclear ? 2.4 : 3.6 }}
      >
        <span>{unclear ? 'On hold: a person confirms the town before it ships' : 'Ready to ship'}</span>
        <motion.span
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.6, delay: (unclear ? 2.4 : 3.6) + 0.7 }}
        >
          {unclear ? (
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          ) : (
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m4 12.5 5 5L20 6.5" />
            </svg>
          )}
        </motion.span>
      </motion.div>
    </FeatureFrame>
  )
}
