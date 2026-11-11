import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Bubble } from '../components/Chat'
import { Lines } from '../components/Type'
import { EASE } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * Competition as one message sent to four systems.
 * 0 the message, 1 agency, 2 rule-based, 3 generic AI, 4 RetailyAI (others recede)
 */

type Col = {
  who: string
  reply: ReactNode
  verdict: string
  tone: 'muted' | 'loss' | 'electric'
}

const COLS: Col[] = [
  {
    who: 'Confirmation agency',
    reply: 'Merci, on vous rappelle demain matin.',
    verdict: 'People on phones. Daytime only, 15–25 DH an order.',
    tone: 'muted',
  },
  {
    who: 'Rule-based automation',
    reply: 'Sorry, I didn’t understand. Reply 1 for order status.',
    verdict: 'Predictable, but it can’t hold a conversation.',
    tone: 'muted',
  },
  {
    who: 'Generic AI chatbot',
    reply: 'Done! Your address is updated ✅',
    verdict: 'It changed the order. Nobody checked.',
    tone: 'loss',
  },
  {
    who: 'RetailyAI',
    reply: (
      <span>
        Wakha! Ghadi nsifet t‑tabdil l l’magasin bach ytconfirma.
        <span className="mt-3 flex items-center gap-2 rounded-xl bg-brake-soft px-3 py-2 text-[20px] font-semibold text-ink">
          <span className="h-3 w-3 shrink-0 rounded-full bg-brake" />
          Change proposed. Waiting for the merchant.
        </span>
      </span>
    ),
    verdict: 'Holds the conversation. Asks before it acts.',
    tone: 'electric',
  },
]

export default function S08Compete({ step }: SceneProps) {
  const focus = step >= 4
  return (
    <div className="absolute inset-0 bg-paper">
      <div className="absolute left-[140px] top-[84px]">
        <Lines
          k={focus ? 'b' : 'a'}
          lines={[focus ? 'Everyone automates. Who asks first?' : 'Same message. Four answers.']}
          className="display text-[104px] text-ink"
        />
      </div>

      {/* the customer's message */}
      <motion.div
        className="absolute left-[140px] top-[250px] flex items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
      >
        <Bubble side="in" size={32} className="shadow-[0_20px_40px_-24px_rgba(6,16,43,0.5)]">
          Bdl liya l’adresse, ana daba f Casa.
        </Bubble>
        <span className="text-[26px] text-ink-3">“Change my address, I’m in Casa now.”</span>
      </motion.div>

      <div className="absolute left-[140px] top-[440px] grid w-[1640px] grid-cols-4 gap-7">
        {COLS.map((c, i) => {
          const show = step >= i + 1
          const dim = focus && i < 3
          const isUs = i === 3
          return (
            <motion.div
              key={c.who}
              className={`flex flex-col rounded-[28px] p-7 ${isUs ? 'bg-white ring-4 ring-electric' : 'bg-white'}`}
              initial={false}
              animate={{ opacity: show ? (dim ? 0.4 : 1) : 0, y: show ? 0 : 40, scale: isUs && focus ? 1.03 : 1 }}
              transition={{ duration: 0.7, ease: EASE, delay: show && step === i + 1 ? 0.15 : 0 }}
            >
              <div className={`text-[28px] font-semibold ${isUs ? 'text-electric' : 'text-ink'}`}>{c.who}</div>
              <div className="mt-6 flex h-[250px] flex-col justify-center rounded-2xl bg-[#efeae2] p-4">
                <Bubble side="out" size={23} className="ml-auto">
                  {c.reply}
                </Bubble>
              </div>
              <div
                className={`mt-6 text-[25px] font-medium leading-snug ${
                  c.tone === 'loss' ? 'text-loss' : c.tone === 'electric' ? 'text-electric' : 'text-ink-2'
                }`}
              >
                {c.verdict}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
