import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { ApprovalCard } from '../components/ApprovalCard'
import { BrakeTrack } from '../components/BrakeTrack'
import { Bubble, Cursor } from '../components/Chat'
import { BOX, GAP } from '../components/Cine'
import { FeatureFrame, Pop, cardCls } from '../components/Feature'
import { EASE, EASE_IN, useReduced } from '../deck/motion'
import { useDeckNav } from '../deck/nav'
import type { SceneProps } from '../deck/types'

/*
 * 4 · Handoffs and permissions
 * 0 the owner sets permissions · 1 autopilot, with brakes (the address change waits)
 * 2 it proposes: the waiting change arrives as an approval card · 3 you decide: one tap
 * 4 it knows when to call you: take over, hand back
 *
 * Composition: every step is one shot that fills BOX. The camera pans down the
 * story: each shot rises in from below while the last one lifts out of frame.
 */

const OPTIONS = ['Do it alone', 'Ask me first', 'Leave it to me']
const ACTIONS: [string, number][] = [
  ['Confirm an order', 0],
  ['Change the quantity', 0],
  ['Reschedule a delivery', 0],
  ['Change the address', 1],
  ['Cancel an order', 1],
]

const CARD_W = 620
const THREAD_X = CARD_W + GAP
// the Approve button's centre inside an ApprovalCard of BOX.h height
const TAP = { x: CARD_W / 2, y: BOX.h - 192 + 24 + 36 }

function Segmented({ value, d }: { value: number; d: number }) {
  const W = 190
  return (
    <div className="relative flex rounded-2xl bg-paper p-1.5">
      <motion.div
        className={`absolute top-1.5 h-[calc(100%-12px)] rounded-xl ${value === 0 ? 'bg-electric' : value === 1 ? 'bg-brake' : 'bg-ink'}`}
        style={{ width: W }}
        initial={{ x: 2 * W, opacity: 0 }}
        animate={{ x: value * W, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.25, duration: 0.9, delay: d }}
      />
      {OPTIONS.map((o, i) => (
        <motion.div
          key={o}
          className="relative z-10 py-2.5 text-center text-[20px] font-semibold"
          style={{ width: W }}
          initial={{ color: '#687286' }}
          animate={{ color: i === value ? (value === 1 ? '#0b1324' : '#ffffff') : '#687286' }}
          transition={{ duration: 0.3, delay: d + 0.3 }}
        >
          {o}
        </motion.div>
      ))}
    </div>
  )
}

function Banner({ text, tone, d }: { text: string; tone: 'brake' | 'electric'; d: number }) {
  return (
    <Pop delay={d} className="self-center">
      <div className={`rounded-full px-5 py-2 text-[20px] font-semibold ${tone === 'brake' ? 'bg-brake text-ink' : 'bg-electric text-white'}`}>{text}</div>
    </Pop>
  )
}

/** One shot of the pan: rises in from below, lifts out the top. */
function Shot({ children }: { children: ReactNode }) {
  const reduced = useReduced()
  return (
    <motion.div
      className="absolute"
      style={{ left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.h }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 520, scale: 0.96, filter: 'blur(14px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 1.3, ease: EASE, delay: 0.15 }, transitionEnd: { filter: 'none' } }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -620, scale: 1.02, filter: 'blur(10px)', transition: { duration: 0.9, ease: EASE_IN } }}
    >
      {children}
    </motion.div>
  )
}

const HEAD = [
  ['You decide', 'what it can do.'],
  ['Autopilot,', 'with brakes.'],
  ['It proposes.', 'You decide.'],
  ['It proposes.', 'You decide.'],
  ['It knows when', 'to call you.'],
]
const SUB = [
  'For every kind of action, you choose: do it alone, ask me first, or leave it to me.',
  'Routine actions run on their own. Anything set to “Ask me first” stops at the barrier and waits for you.',
  'The waiting change arrives as a before and after. Nothing changes until you tap.',
  'One tap. The order updates and the customer hears back right away.',
  'You step into the same chat, and hand it back to the agent when you’re done.',
]

export default function F4Permissions({ step }: SceneProps) {
  const { next } = useDeckNav()
  const approved = step >= 3
  const phase = step === 0 ? 'rules' : step === 1 ? 'brakes' : step <= 3 ? 'approval' : 'handoff'
  return (
    <FeatureFrame n={5} headline={HEAD[step]} subKey={step} sub={SUB[step]}>
      <AnimatePresence initial={true}>
        {phase === 'rules' && (
          <Shot key="rules">
            <div className={`${cardCls} flex h-full flex-col px-10 py-9`}>
              <div className="text-[30px] font-semibold text-ink">What can the agent do on its own?</div>
              <div className="mt-6 flex flex-1 flex-col divide-y divide-line">
                {ACTIONS.map(([a, v], i) => (
                  <motion.div
                    key={a}
                    className="flex flex-1 items-center justify-between"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.7 + i * 0.12 }}
                  >
                    <span className="text-[27px] text-ink">{a}</span>
                    <Segmented value={v} d={1.1 + i * 0.22} />
                  </motion.div>
                ))}
              </div>
            </div>
          </Shot>
        )}

        {phase === 'brakes' && (
          <Shot key="brakes">
            <div className={`${cardCls} flex h-full flex-col overflow-hidden`}>
              <div className="flex items-center justify-between px-10 pt-9">
                <div className="text-[30px] font-semibold text-ink">Today’s orders</div>
                <div className="flex gap-3 text-[20px] font-semibold">
                  <span className="rounded-full bg-electric px-4 py-1.5 text-white">Do it alone</span>
                  <span className="rounded-full bg-brake px-4 py-1.5 text-ink">Ask me first</span>
                </div>
              </div>
              <div className="flex flex-1 items-center">
                <BrakeTrack />
              </div>
              <div className="border-t border-line px-10 py-6 text-[22px] text-ink-3">Routine orders drive through the checkpoint. The address change stops and waits.</div>
            </div>
          </Shot>
        )}

        {phase === 'approval' && (
          <Shot key="approval">
            <div className="relative h-full">
              <ApprovalCard approved={approved} showAfter width={CARD_W} height={BOX.h} approveDelay={0.85} onApprove={() => step === 2 && next()} />

              {/* the demonstrated tap */}
              <motion.div
                className="pointer-events-none absolute left-0 top-0 z-10"
                initial={false}
                animate={
                  approved
                    ? { opacity: [0, 1, 1, 1, 0], x: [TAP.x + 260, TAP.x - 11, TAP.x - 11, TAP.x - 11, TAP.x + 40], y: [TAP.y + 220, TAP.y - 6, TAP.y - 6, TAP.y - 6, TAP.y + 60], scale: [1, 1, 0.82, 1, 1] }
                    : { opacity: 0, x: TAP.x + 260, y: TAP.y + 220 }
                }
                transition={approved ? { duration: 1.7, times: [0, 0.42, 0.5, 0.6, 1], ease: EASE } : { duration: 0.2 }}
              >
                <Cursor />
              </motion.div>
              <motion.div
                className="pointer-events-none absolute z-10 h-16 w-16 rounded-full border-4 border-go"
                style={{ left: TAP.x - 32, top: TAP.y - 32 }}
                initial={false}
                animate={approved ? { opacity: [0, 0.9, 0], scale: [0.4, 0.9, 2.4] } : { opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.7, delay: approved ? 0.78 : 0 }}
              />

              {/* the customer's side of the same change: the narrow column, same height */}
              <div className={`${cardCls} absolute top-0 flex h-full flex-col justify-end gap-3 p-4`} style={{ left: THREAD_X, width: BOX.w - THREAD_X, background: '#efeae2' }}>
                <Bubble side="in" size={20} time="21:45" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5, ease: EASE }}>
                  Bdl liya l’adresse: 14 Rue Ibnou Mounir, Maarif
                </Bubble>
                <Bubble side="out" size={20} time="21:46" ticks className="self-end" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.5, ease: EASE }}>
                  Wakha! Ghadi nsifet t‑tabdil l l’magasin.
                </Bubble>
                {approved && (
                  <Bubble side="out" size={20} time="21:47" ticks className="self-end" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.5, ease: EASE }}>
                    Tbddlat l’adresse ✓ Twslk l Maarif.
                  </Bubble>
                )}
              </div>
            </div>
          </Shot>
        )}

        {phase === 'handoff' && (
          <Shot key="handoff">
            <div className={`${cardCls} flex h-full flex-col overflow-hidden`} style={{ background: '#efeae2' }}>
              <div className="flex items-center gap-4 bg-white px-7 py-5">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-[#dfe5e7] text-[22px] font-semibold text-[#54656f]">K</div>
                <div>
                  <div className="text-[25px] font-semibold text-[#111b21]">Khadija</div>
                  <div className="text-[19px] text-[#667781]">Order #3112 · Montre Atlas</div>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-end gap-4 px-8 py-7">
                <Bubble side="in" size={24} time="16:20" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5, ease: EASE }}>
                  Bghit nhder m3a chi bnadem 3afak
                </Bubble>
                <Banner text="The agent handed this chat to you · customer asked for a person" tone="brake" d={1.4} />
                <Bubble side="out" size={24} time="16:22" className="self-end" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1, duration: 0.5, ease: EASE }}>
                  <span className="mb-1 block text-[18px] font-semibold text-[#2f6a4c]">You</span>
                  Salam Khadija, ana Salma. Kifach n3awnk?
                </Bubble>
                <Banner text="Handed back to the agent ✓" tone="electric" d={2.8} />
              </div>
            </div>
          </Shot>
        )}
      </AnimatePresence>
    </FeatureFrame>
  )
}
