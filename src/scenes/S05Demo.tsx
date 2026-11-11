import { AnimatePresence, motion } from 'motion/react'
import { ApprovalCard } from '../components/ApprovalCard'
import { Bubble, Cursor, Phone } from '../components/Chat'
import { EASE } from '../deck/motion'
import { useDeckNav } from '../deck/nav'
import type { SceneProps } from '../deck/types'
import inbox from '../assets/inbox.png'

/*
 * Product demo: the AI proposes, the merchant decides.
 * 0  customer asks to change the address
 * 1  RetailyAI answers and raises an approval card (before / after)
 * 2  a tap on Approve; card turns green; customer gets the confirmation
 * 3  pull back to the real RetailyAI inbox
 */

const NOTES = [
  { at: 1, y: 380, text: 'Every change arrives as a before and after.' },
  { at: 1, y: 560, text: 'The new address is validated first.' },
  { at: 2, y: 800, text: 'Nothing changes until the merchant taps.' },
]

export default function S05Demo({ step }: SceneProps) {
  const { next } = useDeckNav()
  const proposed = step >= 1
  const approved = step >= 2
  const real = step >= 3

  return (
    <div className="absolute inset-0 overflow-hidden bg-paper">
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ scale: real ? 0.9 : 1, opacity: real ? 0.25 : 1, filter: real ? 'blur(6px)' : 'blur(0px)' }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        {/* headline */}
        <div className="absolute left-[140px] top-[78px] display flex gap-[0.28em] text-[118px] text-ink">
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE }}>
              It proposes.
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className="block text-[#2f6a4c]"
              initial={false}
              animate={{ y: approved ? '0%' : '105%' }}
              transition={{ duration: 0.8, ease: EASE, delay: approved ? 1.4 : 0 }}
            >
              You decide.
            </motion.span>
          </span>
        </div>

        {/* phone, cropped by the bottom edge */}
        <motion.div
          className="absolute left-[140px] top-[270px]"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <Phone title="Boutique Salma" subtitle="WhatsApp Business" height={940}>
            <Bubble side="in" size={24} time="21:45" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5, ease: EASE }}>
              Salam, 3afak bdl liya l’adresse dyal la commande
            </Bubble>
            <Bubble side="in" size={24} time="21:46" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.5, ease: EASE }}>
              Daba ana f Maarif: 14 Rue Ibnou Mounir, Casa
            </Bubble>
            <AnimatePresence>
              {proposed && (
                <Bubble
                  key="ai1"
                  side="out"
                  size={24}
                  time="21:46"
                  ticks
                  className="self-end"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
                >
                  Wakha! Ghadi nsifet t‑tabdil l l’magasin bach ytconfirma. Dqi9a.
                </Bubble>
              )}
              {approved && (
                <Bubble
                  key="ai2"
                  side="out"
                  size={24}
                  time="21:47"
                  ticks
                  className="self-end"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 1.2, duration: 0.5, ease: EASE }}
                >
                  Tbddlat l’adresse ✓ La commande ghadi twslk l Maarif.
                </Bubble>
              )}
            </AnimatePresence>
          </Phone>
        </motion.div>

        {/* approval card */}
        <motion.div
          className="absolute left-[700px] top-[270px]"
          initial={false}
          animate={{ opacity: proposed ? 1 : 0, x: proposed ? 0 : 80, scale: proposed ? 1 : 0.96 }}
          transition={{ duration: 0.8, ease: EASE, delay: proposed && step === 1 ? 0.6 : 0 }}
        >
          <ApprovalCard approved={approved} showAfter={proposed} approveDelay={0.85} onApprove={() => step === 1 && next()} />

          {/* demonstrated tap: the cursor glides in, presses Approve, leaves */}
          <motion.div
            className="pointer-events-none absolute left-0 top-0"
            initial={false}
            animate={
              approved
                ? { opacity: [0, 1, 1, 1, 0], x: [560, 309, 309, 309, 350], y: [760, 542, 542, 542, 600], scale: [1, 1, 0.82, 1, 1] }
                : { opacity: 0, x: 560, y: 760 }
            }
            transition={approved ? { duration: 1.7, times: [0, 0.42, 0.5, 0.6, 1], ease: EASE } : { duration: 0.2 }}
          >
            <Cursor />
          </motion.div>
          <motion.div
            className="pointer-events-none absolute left-[288px] top-[516px] h-16 w-16 rounded-full border-4 border-go"
            initial={false}
            animate={approved ? { opacity: [0, 0.9, 0], scale: [0.4, 0.9, 2.4] } : { opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.7, delay: approved ? 0.78 : 0 }}
          />
        </motion.div>

        {/* margin notes */}
        {NOTES.map((n) => (
          <motion.div
            key={n.text}
            className="absolute left-[1400px] flex w-[400px] gap-4 text-[30px] font-medium leading-snug text-ink-2"
            style={{ top: n.y }}
            initial={false}
            animate={{ opacity: step >= n.at ? 1 : 0, x: step >= n.at ? 0 : 20 }}
            transition={{ duration: 0.6, ease: EASE, delay: step === n.at ? (n.at === 2 ? 1.6 : 1.2 + n.y / 1000) : 0 }}
          >
            <span className="mt-[14px] h-[3px] w-10 shrink-0 bg-electric" />
            <span>{n.text}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* the real product */}
      <AnimatePresence>
        {real && (
          <motion.div
            className="absolute left-[210px] top-[80px] w-[1500px]"
            initial={{ opacity: 0, y: 80, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 1, ease: EASE, delay: 0.3 }}
          >
            <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_60px_120px_-50px_rgba(6,16,43,0.6),0_0_0_1px_rgba(6,16,43,0.08)]">
              <div className="flex h-11 items-center gap-2.5 border-b border-line bg-paper px-5">
                <span className="h-3.5 w-3.5 rounded-full bg-[#ff5f57]" />
                <span className="h-3.5 w-3.5 rounded-full bg-[#febc2e]" />
                <span className="h-3.5 w-3.5 rounded-full bg-[#28c840]" />
                <span className="ml-6 text-[18px] text-ink-3">RetailyAI · Conversations</span>
              </div>
              <div className="relative">
                <img src={inbox} alt="The RetailyAI inbox with a live WhatsApp conversation answered by the AI" className="block w-full" />
                {/* customer phone number: masked, never shown on stage */}
                <div
                  className="absolute rounded-md bg-white"
                  style={{ left: '80.6%', top: '60.4%', width: '7.4%', height: '2.9%' }}
                >
                  <div className="h-full w-full rounded-md bg-[repeating-linear-gradient(90deg,#d7dbe7_0_10px,#e9ecf3_10px_14px)]" />
                </div>
              </div>
            </div>
            <div className="mt-5 text-[26px] text-ink-2">The real RetailyAI inbox, deployed with pilot merchants.</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
