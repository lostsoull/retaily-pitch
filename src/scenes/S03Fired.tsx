import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Bubble } from '../components/Chat'
import { Dashes, Paper } from '../components/Receipt'
import { Fade, Lines } from '../components/Type'
import { EASE } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * "AI, you're fired." A termination slip for the chatbot merchants tried,
 * with three exhibits: the reasons merchants gave us for quitting.
 * 0 intro, 1-3 one exhibit each, 4 FIRED stamp.
 */

const HEAD = [
  'Merchants tried AI chatbots.',
  'It guessed.',
  'It shipped to nowhere.',
  'It never knew when to stop.',
  'AI, you’re fired.',
]

const REASONS = [
  'Guessed answers it didn’t know',
  'Copied bad addresses into delivery',
  'Replied when it shouldn’t have',
]

function Exhibit({ show, label, children, note }: { show: boolean; label: string; children: ReactNode; note: string }) {
  return (
    <motion.div
      className="relative rounded-[26px] bg-[#efeae2] p-6"
      initial={false}
      animate={{ opacity: show ? 1 : 0, x: show ? 0 : 60 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="mb-3 text-[21px] font-semibold text-ink-3">{label}</div>
      <div className="flex flex-col gap-2.5">{children}</div>
      <motion.div
        className="absolute -right-3 top-3 rotate-[2deg] rounded-xl bg-loss px-4 py-2 text-[23px] font-semibold text-white shadow-lg"
        initial={false}
        animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.6 }}
        transition={{ type: 'spring', bounce: 0.5, duration: 0.5, delay: show ? 0.7 : 0 }}
      >
        {note}
      </motion.div>
    </motion.div>
  )
}

export default function S03Fired({ step }: SceneProps) {
  const fired = step >= 4
  return (
    <div className="absolute inset-0 bg-paper">
      <div className="absolute left-[140px] top-[84px] w-[1640px]">
        <Lines k={step} lines={[HEAD[step]]} className={`display text-[112px] ${fired ? 'text-loss' : 'text-ink'}`} />
      </div>

      {/* termination slip */}
      <motion.div
        className="absolute left-[140px] top-[285px] w-[640px]"
        initial={{ opacity: 0, y: 40, rotate: -1.5 }}
        animate={fired ? { opacity: 1, y: 0, rotate: -1.5, x: [0, -10, 8, -4, 0] } : { opacity: 1, y: 0, rotate: -1.5, x: 0 }}
        transition={{ duration: 0.8, ease: EASE, x: { duration: 0.4, delay: 0.18 } }}
      >
        <Paper className="px-12 pt-10">
          <div className="text-[28px] font-semibold tracking-[0.08em]">NOTICE OF TERMINATION</div>
          <Dashes className="mt-5" />
          <div className="mt-5 space-y-1 text-[23px] text-ink-2">
            <div>Employee: AI chatbot</div>
            <div>Position: Customer support</div>
            <div>Signed: Moroccan merchants</div>
          </div>
          <Dashes className="mt-5" />
          <div className="mt-5 text-[23px] text-ink-3">Grounds for dismissal</div>
          <div className="mt-3 h-[190px] space-y-3 text-[25px] font-medium">
            {REASONS.map((r, i) => (
              <motion.div
                key={r}
                className="flex gap-3"
                initial={false}
                animate={{ opacity: step > i ? 1 : 0 }}
                transition={{ duration: 0.4, delay: step === i + 1 ? 0.3 : 0 }}
              >
                <span className="text-loss">{i + 1}.</span>
                <span>{r}</span>
              </motion.div>
            ))}
          </div>
          <Dashes className="mt-4" />
          <div className="mt-4 pb-6 text-[23px] text-ink-3">Effective immediately.</div>
        </Paper>

        {/* the stamp */}
        <motion.div
          className="pointer-events-none absolute left-[110px] top-[70px] rounded-[18px] border-[10px] border-loss px-8 py-1 text-loss"
          style={{ rotate: -12, fontWeight: 900, fontSize: 132, lineHeight: 1, letterSpacing: '0.02em', mixBlendMode: 'multiply' }}
          initial={false}
          animate={fired ? { opacity: 0.92, scale: 1, fontStretch: '118%' } : { opacity: 0, scale: 2.6, fontStretch: '70%' }}
          transition={fired ? { type: 'spring', bounce: 0.3, duration: 0.45, fontStretch: { duration: 0.35 } } : { duration: 0.2 }}
        >
          FIRED
        </motion.div>
      </motion.div>

      {/* exhibits */}
      <div className="absolute left-[880px] top-[285px] flex w-[900px] flex-col gap-6">
        <Exhibit show={step >= 1} label="Exhibit A: the price" note="Real price: 249 DH">
          <Bubble side="in" size={24}>Ch7al had l’montre?</Bubble>
          <Bubble side="out" size={24} className="self-end">Only 99 DH! Free delivery included 😊</Bubble>
        </Exhibit>
        <Exhibit show={step >= 2} label="Exhibit B: the address" note="Sent to the courier as-is">
          <Bubble side="in" size={24}>Sifto l dar, 9rib l’hanout dyal Si Ahmed</Bubble>
          <Bubble side="out" size={24} className="self-end">Order shipped to: “near Si Ahmed’s shop” ✅</Bubble>
        </Exhibit>
        <Exhibit show={step >= 3} label="Exhibit C: the handoff" note="Should have handed off">
          <Bubble side="in" size={24}>Bghit nhder m3a chi bnadem, machi robot</Bubble>
          <Bubble side="out" size={24} className="self-end">I’m happy to help! Here are our best sellers ✨</Bubble>
        </Exhibit>
      </div>

      {fired && (
        <Fade k="f" delay={0.9} className="absolute bottom-[56px] left-[140px] lede text-[34px] text-ink-2">
          They didn’t quit over missing features. They quit over trust.
        </Fade>
      )}
    </div>
  )
}
