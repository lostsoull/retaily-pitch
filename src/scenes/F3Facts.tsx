import { AnimatePresence, motion } from 'motion/react'
import { Bubble } from '../components/Chat'
import { BOX, GAP, Reveal } from '../components/Cine'
import { FeatureFrame, cardCls } from '../components/Feature'
import { EASE, useReduced } from '../deck/motion'
import type { SceneProps } from '../deck/types'
import ad from '../assets/ad-watch.webp'

/*
 * 3 · Product Q&A
 * 0 a question with no approved fact: the agent asks the owner instead of guessing
 * 1 the owner answers once; the answer flies up into the approved facts,
 *   the waiting customer and every next one get it
 *
 * Composition: two rows on BOX. Top row splits 3:2 (product, chat), same height;
 * the owner's card spans the bottom row and lands on BOX's foot.
 */

const ROW1_H = 440
const PROD_W = 548
const CHAT_X = BOX.x + PROD_W + GAP
const ROW2_Y = BOX.y + ROW1_H + GAP

function Fact({ k, v, state }: { k: string; v: string; state: 'ok' | 'missing' | 'new' }) {
  return (
    <div
      className={`flex h-[54px] items-center justify-between gap-3 rounded-xl px-4 text-[22px] ${
        state === 'missing' ? 'border-2 border-dashed border-brake bg-brake-soft' : state === 'new' ? 'bg-electric-soft' : 'bg-paper'
      }`}
    >
      <span className="text-ink-3">{k}</span>
      <span className={`font-semibold ${state === 'missing' ? 'text-[#7a5a1c]' : 'text-ink'}`}>{v}</span>
    </div>
  )
}

export default function F3Facts({ step }: SceneProps) {
  const answered = step >= 1
  const reduced = useReduced()
  return (
    <FeatureFrame
      n={4}
      headline={['It never makes', 'things up.']}
      subKey={step}
      sub={
        answered
          ? 'You answer once. The waiting customer gets it, and so does every customer after.'
          : 'It only states facts you approved. When a fact is missing, it asks you instead of guessing.'
      }
    >
      {/* the product and its approved facts */}
      <Reveal shot="lift" delay={0.2} className={`${cardCls} absolute flex flex-col p-7`} style={{ left: BOX.x, top: BOX.y, width: PROD_W, height: ROW1_H }}>
        <div className="flex items-center gap-4">
          <img src={ad} alt="" className="h-20 w-20 rounded-2xl object-cover object-[50%_40%]" />
          <div>
            <div className="text-[30px] font-semibold text-ink">Montre Atlas</div>
            <div className="text-[20px] text-ink-3">Approved facts</div>
          </div>
        </div>
        <div className="mt-auto space-y-2.5">
          <Fact k="Price" v="249 DH" state="ok" />
          <Fact k="Colors" v="Noir, argenté" state="ok" />
          <Fact k="Delivery" v="Free" state="ok" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={answered ? 'a' : 'm'}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE, delay: answered ? 1.95 : 0 } }}
              exit={{ opacity: 0, transition: { duration: 0.2, delay: answered ? 1.7 : 0 } }}
            >
              {answered ? <Fact k="Waterproof" v="3 ATM, splash-proof" state="new" /> : <Fact k="Waterproof?" v="Not approved yet" state="missing" />}
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>

      {/* the chat, same height, the narrower column */}
      <Reveal
        shot="swing"
        delay={0.45}
        className={`${cardCls} absolute flex flex-col justify-end gap-3 p-5`}
        style={{ left: CHAT_X, top: BOX.y, width: BOX.r - CHAT_X, height: ROW1_H, background: '#efeae2' }}
      >
        <Bubble side="in" size={21} time="20:41" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5, ease: EASE }}>
          Wach l’montre katdir l’ma?
        </Bubble>
        <Bubble side="out" size={21} time="20:41" ticks className="self-end" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.5, ease: EASE }}>
          Ghadi nt2ked lik mn l’magasin w nrje3 lik daba.
        </Bubble>
        {answered && (
          <Bubble side="out" size={21} time="20:47" ticks className="self-end" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.3, duration: 0.5, ease: EASE }}>
            Ah, katdir l’ma: 3 ATM, ma tkhafich mn chta ✓
          </Bubble>
        )}
      </Reveal>

      {/* the owner, asked once: spans the bottom row */}
      <Reveal shot="wipe" delay={0.8} duration={1.2} className={`${cardCls} absolute flex flex-col p-7`} style={{ left: BOX.x, top: ROW2_Y, width: BOX.w, height: BOX.b - ROW2_Y }}>
        <div className="flex items-center justify-between">
          <div className={`text-[20px] font-semibold ${answered ? 'text-electric' : 'text-[#7a5a1c]'}`}>
            {answered ? 'Answered · saved as an approved fact' : 'Waiting for your answer · 1 customer waiting'}
          </div>
          <div className="text-[20px] text-ink-3">Montre Atlas</div>
        </div>
        <div className="mt-2 text-[32px] font-semibold text-ink">Is the watch waterproof?</div>
        <div className={`mt-4 rounded-2xl border-2 px-5 py-3 text-[24px] ${answered ? 'border-electric text-ink' : 'border-line text-ink-4'}`}>
          {answered ? (
            <motion.span initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }} transition={{ duration: 0.8, ease: 'linear', delay: 0.3 }} className="inline-block">
              Oui, 3 ATM. Résiste aux éclaboussures, pas à la douche.
            </motion.span>
          ) : (
            'Type the answer once…'
          )}
        </div>
        {/* the next customer, answered from the saved fact */}
        <div className="mt-auto flex items-center gap-5">
          {answered && (
            <>
              <Reveal shot="rise" delay={2.8} duration={0.8}>
                <Bubble side="in" size={21} time="Next day">
                  L’montre katdir l’ma?
                </Bubble>
              </Reveal>
              <Reveal shot="left" delay={3.1} duration={0.8} className="flex items-center gap-5">
                <svg width="40" height="24" viewBox="0 0 40 24" aria-hidden>
                  <path d="M2 12h32M26 4l8 8-8 8" fill="none" stroke="#1e6bff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <Bubble side="out" size={21} ticks time="Instantly">
                  Ah, 3 ATM, ma tkhafich mn chta ✓
                </Bubble>
              </Reveal>
            </>
          )}
        </div>
      </Reveal>

      {/* the answer itself, carried up from the owner's card into the approved facts */}
      {answered && !reduced && (
        <motion.div
          className="pointer-events-none absolute z-20 whitespace-nowrap rounded-xl bg-electric px-4 py-2 text-[22px] font-semibold text-white shadow-[0_20px_40px_-16px_rgba(48,71,201,0.7)]"
          initial={{ left: BOX.x + 30, top: ROW2_Y + 130, opacity: 0, scale: 0.9 }}
          animate={{
            left: [BOX.x + 30, BOX.x + 30, BOX.x + 300, BOX.x + 300],
            top: [ROW2_Y + 130, ROW2_Y + 130, BOX.y + ROW1_H - 82, BOX.y + ROW1_H - 82],
            opacity: [0, 1, 1, 0],
            scale: [0.9, 1.06, 1, 0.96],
          }}
          transition={{ duration: 1.3, delay: 1.0, times: [0, 0.15, 0.75, 1], ease: EASE }}
        >
          3 ATM, splash-proof
        </motion.div>
      )}
    </FeatureFrame>
  )
}
