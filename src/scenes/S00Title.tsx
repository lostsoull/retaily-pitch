import { motion } from 'motion/react'
import watch from '../assets/ad-watch.webp'
import { Bubble } from '../components/Chat'
import { IPhone, WA_WALLPAPER, WaDay, WaHeader, WaImage, phoneMetrics } from '../components/Device'
import { Mark } from '../components/Mark'
import { Lines } from '../components/Type'
import { EASE, useReduced } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * The opener. One idea, shown not said: conversation in, order out.
 * Left: the promise. Right: one phone, tilted toward the room, bleeding off the
 * bottom of the frame. A customer asks, the agent answers with the product,
 * she orders, the agent writes the order into the chat, and that order lifts
 * out of the phone into the room.
 */

const PHONE = { x: 1130, y: 132, w: 520 }
const SCREEN_W = phoneMetrics(PHONE.w).screenW
const CHAT: { side: 'in' | 'out'; text: string; t: string; img?: boolean }[] = [
  { side: 'in', text: 'Salam, ch7al l’montre?', t: '02:14' },
  { side: 'out', text: 'Montre Atlas · 249 DH', t: '02:14', img: true },
  { side: 'in', text: 'Bghit wa7da f noir, Hay Hassani', t: '02:15' },
]
const AT = (i: number) => 1.9 + i * 0.65
const TYPING = AT(CHAT.length) - 0.3
const ORDER = TYPING + 1.0 // the agent's reply is the order itself
const LIFT = ORDER + 0.9 // and the order leaves the phone

/** The order, as the agent writes it into the chat (the product does exactly this). */
function OrderMessage() {
  return (
    <div className="w-[300px] self-end overflow-hidden rounded-[10px] rounded-tr-none bg-[#d9fdd3] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]" style={{ fontFamily: '-apple-system, "Segoe UI", system-ui, sans-serif' }}>
      <div className="px-3 pt-2 text-[13px] font-semibold text-[#1e6bff]">● RetailyAI</div>
      <div className="px-3 pb-1 pt-1 text-[16px] leading-snug text-[#111b21]">
        <div className="font-semibold">Order #3112</div>
        <div>Montre Atlas, noir · 249 DH</div>
        <div>Hay Hassani, Casablanca</div>
      </div>
      <div className="mx-2 mb-2 mt-1 rounded-md bg-white/70 py-1.5 text-center text-[14px] font-semibold text-[#008069]">✓ Order confirmed</div>
    </div>
  )
}

export default function S00Title(_: SceneProps) {
  const reduced = useReduced()
  return (
    <div className="absolute inset-0 overflow-hidden bg-navy text-white">
      {/* the light: azure rising behind the phone */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 45% 70% at 72% 30%, rgba(30,107,255,0.7), transparent 70%), radial-gradient(ellipse 40% 45% at 5% 105%, rgba(127,178,255,0.16), transparent 70%), linear-gradient(160deg, #06102b 0%, #0a1b4f 100%)',
        }}
        initial={reduced ? false : { opacity: 0, scale: 1.15, x: 160 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 2.6, ease: EASE }}
      />
      {/* a fine dot grid, lit only where the light falls */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.16) 1.2px, transparent 1.6px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse 40% 55% at 72% 35%, #000 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 40% 55% at 72% 35%, #000 0%, transparent 75%)',
        }}
      />

      {/* brand */}
      <motion.div
        className="absolute left-[140px] top-[120px] flex items-center gap-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.2 }}
      >
        <Mark size={58} back="#7fb2ff" front="#ffffff" draw delay={0.3} />
        <span className="text-[34px] font-semibold tracking-[-0.02em]" style={{ fontStretch: '94%' }}>
          RetailyAI
        </span>
      </motion.div>

      {/* the promise */}
      <div className="absolute left-[140px] top-[250px] w-[900px]">
        <Lines
          k="t"
          delay={0.5}
          stagger={0.12}
          lines={['Turn', 'conversations', <span key="o" style={{ color: '#7fb2ff' }}>into orders.</span>]}
          style={{ fontSize: 158, fontWeight: 540, fontStretch: '86%', letterSpacing: '-0.05em', lineHeight: 0.93 }}
        />
        <motion.div
          className="mt-12 max-w-[700px] text-[32px] leading-snug text-white/65"
          initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
          transition={{ duration: 1, ease: EASE, delay: 1.2 }}
        >
          The AI agent that sells inside WhatsApp, for Moroccan cash-on-delivery merchants.
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-[64px] left-[140px] text-[22px] text-white/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
      >
        Sifeddine Nehhas · Yassine Abdourabbih
      </motion.div>

      {/* the phone, turned toward the room */}
      <motion.div
        className="absolute z-10"
        style={{ left: PHONE.x, top: PHONE.y, transformPerspective: 2200, transformOrigin: '50% 100%' }}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 420, rotateX: 20, rotateY: -18 }}
        animate={{ opacity: 1, y: 0, rotateX: 4, rotateY: -12 }}
        transition={{ duration: 1.8, ease: EASE, delay: 0.9 }}
      >
        <IPhone width={PHONE.w} height={1060} time="02:14" statusBg="#f6f6f6">
          <WaHeader name="Khadija B." sub="online" w={SCREEN_W} />
          <div className="flex flex-1 flex-col gap-2.5 px-4 pt-3" style={WA_WALLPAPER}>
            <WaDay w={SCREEN_W} />
            {CHAT.map((m, i) => (
              <motion.div
                key={i}
                className={m.side === 'out' ? 'self-end' : ''}
                style={{ originX: m.side === 'out' ? 1 : 0, originY: 1 }}
                initial={{ opacity: 0, y: 16, scale: 0.88 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: EASE, delay: AT(i) }}
              >
                {m.img ? (
                  <WaImage src={watch} caption={m.text} time={m.t} w={SCREEN_W} imgH={150} />
                ) : (
                  <Bubble side={m.side} size={21} time={m.t} ticks={m.side === 'out'}>
                    {m.text}
                  </Bubble>
                )}
              </motion.div>
            ))}
            {/* the agent typing, then the order written into the chat */}
            {/* one slot: the typing dots, replaced by the order itself */}
            <div className="grid self-end">
              <motion.div
                className="flex w-fit items-center gap-1.5 self-start justify-self-end rounded-[10px] rounded-tr-none bg-[#d9fdd3] px-4 py-3 [grid-area:1/1]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.0, times: [0, 0.15, 0.8, 1], delay: TYPING }}
              >
                {[0, 1, 2].map((d) => (
                  <motion.span key={d} className="block h-2 w-2 rounded-full bg-[#8696a0]" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }} />
                ))}
              </motion.div>
              <motion.div
                className="[grid-area:1/1]"
                style={{ originX: 1, originY: 0 }}
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: EASE, delay: ORDER }}
              >
                <OrderMessage />
              </motion.div>
            </div>
          </div>
        </IPhone>
      </motion.div>

      {/* the order, lifted out of the phone into the room */}
      <motion.div
        className="absolute z-30 w-[420px] overflow-hidden rounded-[26px] bg-white text-ink shadow-[0_60px_100px_-30px_rgba(0,0,0,0.75)]"
        style={{ transformPerspective: 1600 }}
        initial={reduced ? { left: 860, top: 760, opacity: 0, rotate: -4 } : { left: 1330, top: 860, opacity: 0, scale: 0.7, rotate: 0, rotateY: -12 }}
        animate={
          reduced
            ? { opacity: 1 }
            : {
                left: [1330, 1330, 980, 860],
                top: [860, 830, 700, 760],
                opacity: [0, 1, 1, 1],
                scale: [0.7, 0.75, 1.08, 1],
                rotate: [0, 0, -9, -4],
                rotateY: [-12, -12, 0, 0],
              }
        }
        transition={{ duration: 1.9, ease: EASE, delay: LIFT, times: [0, 0.15, 0.7, 1] }}
      >
        <div className="flex items-center justify-between bg-electric px-6 py-3.5 text-[22px] font-semibold text-white">
          <span>Order #3112</span>
          <span className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m4 12.5 5 5L20 6.5" />
            </svg>
            COD confirmed
          </span>
        </div>
        <div className="flex items-center gap-4 px-6 py-5">
          <img src={watch} alt="" className="h-16 w-16 rounded-xl object-cover object-[50%_40%]" />
          <div className="flex-1">
            <div className="flex items-baseline justify-between text-[24px] font-semibold">
              <span>Montre Atlas</span>
              <span className="tabular">249 DH</span>
            </div>
            <div className="text-[19px] text-ink-3">Khadija B. · Hay Hassani, Casablanca</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
