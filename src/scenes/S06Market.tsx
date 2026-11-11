import { motion } from 'motion/react'
import { Bubble } from '../components/Chat'
import { Fade, Lines } from '../components/Type'
import { EASE } from '../deck/motion'
import type { SceneProps } from '../deck/types'
import ad from '../assets/ad-watch.webp'

/*
 * The Moroccan funnel, as a customer lives it: an ad, a chat, a COD order.
 * 0 ad, 1 chat, 2 order, 3 grounded sizing (labelled as our estimate)
 */

const TOP = 300

function Connector({ x, show }: { x: number; show: boolean }) {
  return (
    <svg className="absolute" style={{ left: x, top: TOP + 250 }} width="150" height="40" viewBox="0 0 150 40" aria-hidden>
      <motion.path
        d="M6 20 H128"
        stroke="#1e6bff"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        initial={false}
        animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      />
      <motion.path
        d="M118 8 L138 20 L118 32"
        stroke="#1e6bff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={false}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.3, delay: show ? 0.45 : 0 }}
      />
    </svg>
  )
}

const appear = (show: boolean, delay = 0.5) => ({
  initial: false as const,
  animate: { opacity: show ? 1 : 0, y: show ? 0 : 40, scale: show ? 1 : 0.96 },
  transition: { duration: 0.8, ease: EASE, delay: show ? delay : 0 },
})

export default function S06Market({ step }: SceneProps) {
  return (
    <div className="absolute inset-0 bg-paper">
      <div className="absolute left-[140px] top-[84px]">
        <Lines k="m" lines={['In Morocco, the checkout is a chat.']} className="display text-[108px] text-ink" />
      </div>

      {/* 1 · the ad */}
      <motion.div className="absolute left-[140px] w-[440px]" style={{ top: TOP }} {...appear(true, 0.4)}>
        <div className="flex h-[502px] flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_30px_60px_-30px_rgba(6,16,43,0.4)]">
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-ink text-[18px] font-bold text-white">A</div>
            <div>
              <div className="text-[22px] font-semibold text-ink">Atlas Watches</div>
              <div className="text-[18px] text-ink-3">Sponsored</div>
            </div>
          </div>
          <img src={ad} alt="" className="block min-h-0 w-full flex-1 object-cover object-[50%_40%]" />
          <div className="flex items-center justify-between gap-3 whitespace-nowrap py-4 pl-5 pr-4">
            <div className="text-[21px] font-semibold text-ink">Montre Atlas, 249 DH</div>
            <div className="flex items-center gap-2 rounded-xl bg-wa-green px-3.5 py-2.5 text-[20px] font-semibold text-wa-night">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
              </svg>
              Send message
            </div>
          </div>
        </div>
        <div className="mt-5 text-[30px] font-semibold text-ink">An ad click</div>
      </motion.div>

      <Connector x={600} show={step >= 1} />

      {/* 2 · the chat */}
      <motion.div className="absolute left-[770px] w-[440px]" style={{ top: TOP }} {...appear(step >= 1)}>
        <div className="flex h-[502px] flex-col justify-end gap-3 rounded-[26px] bg-[#efeae2] p-5 shadow-[0_30px_60px_-30px_rgba(6,16,43,0.4)]">
          <Bubble side="in" size={24}>Salam, ch7al l’montre?</Bubble>
          <Bubble side="out" size={24} className="self-end">249 DH, livraison gratuite. Kayna f noir w argenté.</Bubble>
          <Bubble side="in" size={24}>Bghit wa7da f noir</Bubble>
          <Bubble side="out" size={24} className="self-end">Smiya w l’adresse 3afak?</Bubble>
        </div>
        <div className="mt-5 text-[30px] font-semibold text-ink">becomes a WhatsApp chat</div>
      </motion.div>

      <Connector x={1230} show={step >= 2} />

      {/* 3 · the order */}
      <motion.div className="absolute left-[1400px] w-[380px]" style={{ top: TOP }} {...appear(step >= 2)}>
        <div className="flex h-[502px] flex-col rounded-[26px] bg-white p-7 shadow-[0_30px_60px_-30px_rgba(6,16,43,0.4)]">
          <div className="flex items-center justify-between text-[22px] text-ink-3">
            <span className="font-mono">#3112</span>
            <span>Cash on delivery</span>
          </div>
          <div className="mt-4 text-[30px] font-semibold text-ink">Montre Atlas, noir</div>
          <div className="mt-1 text-[22px] text-ink-3">Qty 1</div>
          <div className="mt-6 space-y-2 text-[22px] text-ink-2">
            <div>Khadija B.</div>
            <div>Hay Hassani, Casablanca</div>
          </div>
          <div className="mt-auto flex items-end justify-between border-t-2 border-dashed border-line pt-5">
            <span className="text-[22px] text-ink-3">Paid at the door</span>
            <span className="text-[40px] font-bold text-ink tabular">249 DH</span>
          </div>
        </div>
        <div className="mt-5 text-[30px] font-semibold text-ink">and a COD order</div>
      </motion.div>

      {/* grounded sizing */}
      <div className="absolute bottom-[70px] left-[140px] w-[1640px]">
        {step >= 3 && (
          <Fade k="size" className="lede text-[32px] text-ink-2" delay={0.2}>
            <p>
              Our bottom-up estimate: <b className="font-semibold text-electric">38–58M MAD a year</b> reachable today, starting from{' '}
              <b className="font-semibold text-ink">~3,544 live YouCan stores</b> and the sellers who run on ads alone, with no website.
            </p>
          </Fade>
        )}
      </div>
    </div>
  )
}
