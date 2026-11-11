import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Paper } from '../components/Receipt'
import { Camera } from '../components/Cine'
import { Fade, Lines } from '../components/Type'
import { EASE } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * Competition, as a hiring decision (merges the old "AI, you're fired" slide).
 * 0 four candidate files · 1 the agency · 2 eGrow · 3 the generic chatbot (FIRED)
 * 4 RetailyAI (HIRED)
 * Competitor descriptions follow the pitch deck's comparison table.
 */

/** The files are dealt from one pile, bottom centre of the frame. */
const DEAL_X = 960 - 195

type Candidate = {
  name: string
  kind: string
  gets: ReactNode[]
  win: string
  stamp?: { text: string; color: string }
}

const CANDIDATES: Candidate[] = [
  {
    name: 'Confirmation agency',
    kind: 'People on phones',
    gets: ['15–25 DH per delivered order', 'Daytime only, inconsistent', 'No data on what sells'],
    win: 'A flat monthly plan, 24/7, and every conversation captured.',
    stamp: { text: 'TOO EXPENSIVE', color: '#5b6475' },
  },
  {
    name: 'eGrow',
    kind: 'Generic chatbot',
    gets: ['Basic guardrails', 'Doesn’t build the order from an ad lead', 'Built for MENA in general'],
    win: 'The full loop, from ad lead to confirmed COD order, made deep for Morocco.',
  },
  {
    name: 'Generic AI chatbot',
    kind: 'What merchants tried, then quit',
    gets: [
      <>Said “Only 99 DH!” (real price: 249)</>,
      <>Shipped to “near Si Ahmed’s shop”</>,
      <>Answered “I want a human” with best sellers</>,
    ],
    win: 'It asks before it acts: approval cards, address checks, handoffs.',
    stamp: { text: 'FIRED', color: '#5b6475' },
  },
]

function Stamp({ text, color, on, big = false }: { text: string; color: string; on: boolean; big?: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-[205px] -translate-x-1/2 whitespace-nowrap rounded-[14px] border-[7px] px-5 py-1"
      style={{ color, borderColor: color, rotate: -12, fontWeight: 900, fontSize: big ? 92 : 46, lineHeight: 1, letterSpacing: '0.02em', mixBlendMode: 'multiply' }}
      initial={false}
      animate={on ? { opacity: 0.5, scale: 1 } : { opacity: 0, scale: 2.4 }}
      transition={on ? { type: 'spring', bounce: 0.3, duration: 0.45, delay: 1.4 } : { duration: 0.2 }}
    >
      {text}
    </motion.div>
  )
}

function File({ c, i, step }: { c: Candidate; i: number; step: number }) {
  const open = step >= i + 1
  const current = step === i + 1
  return (
    <motion.div
      className="absolute w-[390px]"
      style={{ left: 140 + i * 416, top: 300 }}
      initial={{ opacity: 0, x: DEAL_X - (140 + i * 416), y: 640, rotate: 14 - i * 9 }}
      animate={{ opacity: step > i + 1 ? 0.55 : 1, x: 0, y: current ? -14 : 0, rotate: current ? 0 : [-2, 1.5, -1][i], scale: current ? 1.04 : 1 }}
      transition={{ type: 'spring', bounce: 0.18, duration: 1.2, delay: step === 0 ? 0.3 + i * 0.16 : 0 }}
    >
      <Paper className="px-8 pt-7" style={{ minHeight: 640 }}>
        <div className="text-[18px] text-ink-3">CANDIDATE 0{i + 1}</div>
        <div className="mt-1 font-sans text-[34px] font-bold leading-tight text-ink">{c.name}</div>
        <div className="font-sans text-[22px] text-ink-3">{c.kind}</div>
        <div className="mt-5 border-t-[3px] border-dashed border-line" />
        <motion.div initial={false} animate={{ opacity: open ? 1 : 0 }} transition={{ duration: 0.4, delay: current ? 0.4 : 0 }}>
          <div className="mt-5 text-[19px] text-ink-3">WHAT YOU GET</div>
          <div className="mt-2 space-y-3 font-sans text-[22px] leading-snug text-ink">
            {c.gets.map((g, k) => (
              <motion.div
                key={k}
                className="flex gap-3"
                initial={false}
                animate={{ opacity: open ? 1 : 0, x: open ? 0 : -8 }}
                transition={{ duration: 0.4, delay: current ? 0.5 + k * 0.25 : 0 }}
              >
                <span className="text-loss">✕</span>
                <span>{g}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 border-t-[3px] border-dashed border-line" />
          <motion.div
            className="mt-5 rounded-2xl bg-electric-soft px-4 py-3"
            initial={false}
            animate={{ opacity: open ? 1 : 0, y: open ? 0 : 10 }}
            transition={{ duration: 0.5, ease: EASE, delay: current ? 2.0 : 0 }}
          >
            <div className="text-[17px] font-semibold text-electric">HOW RETAILYAI WINS</div>
            <div className="mt-1 font-sans text-[21px] font-semibold leading-snug text-ink">{c.win}</div>
          </motion.div>
        </motion.div>
      </Paper>
      {c.stamp && <Stamp text={c.stamp.text} color={c.stamp.color} on={open} big={c.stamp.text === 'FIRED'} />}
    </motion.div>
  )
}

export default function S14Compete({ step }: SceneProps) {
  const hired = step >= 4
  return (
    <div className="absolute inset-0 overflow-hidden bg-paper">
      <motion.div className="absolute left-[140px] top-[110px] text-[26px] font-semibold text-electric" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Competition
      </motion.div>
      <div className="absolute left-[140px] top-[160px] w-[1640px]">
        <Lines k="h" lines={['Who should talk to your customers?']} className="display text-[96px] text-ink" delay={0.2} />
      </div>

      <Camera>
      {CANDIDATES.map((c, i) => (
        <File key={c.name} c={c} i={i} step={step} />
      ))}

      {/* RetailyAI's file */}
      <motion.div
        className="absolute w-[390px]"
        style={{ left: 140 + 3 * 416, top: 300 }}
        initial={{ opacity: 0, x: DEAL_X - (140 + 3 * 416), y: 640, rotate: -16 }}
        animate={{ opacity: 1, x: 0, y: hired ? -14 : 0, rotate: hired ? 0 : 2, scale: hired ? 1.05 : 1 }}
        transition={{ type: 'spring', bounce: 0.18, duration: 1.2, delay: step === 0 ? 0.3 + 3 * 0.16 : 0 }}
      >
        <div className={`relative min-h-[640px] rounded-[26px] px-8 pt-7 text-white transition-colors duration-500 ${hired ? 'bg-electric' : 'bg-ink'}`}>
          <div className="font-mono text-[18px] text-white/60">CANDIDATE 04</div>
          <div className="mt-1 text-[34px] font-bold leading-tight">RetailyAI</div>
          <div className="text-[22px] text-white/70">An AI operator with brakes</div>
          <div className="mt-5 border-t-[3px] border-dashed border-white/25" />
          <motion.div initial={false} animate={{ opacity: hired ? 1 : 0 }} transition={{ duration: 0.5, delay: hired ? 0.3 : 0 }}>
            <div className="mt-5 font-mono text-[19px] text-white/60">WHAT YOU GET</div>
            <div className="mt-2 space-y-3 text-[22px] leading-snug">
              {['Builds the order from the chat, ad lead to COD', 'Asks before it acts, hands off when unsure', 'Made for Moroccan COD: Darija, real towns, local carriers', 'A flat monthly plan, 24/7'].map((g, k) => (
                <motion.div
                  key={g}
                  className="flex gap-3"
                  initial={false}
                  animate={{ opacity: hired ? 1 : 0.4, x: hired ? 0 : -6 }}
                  transition={{ duration: 0.4, delay: hired ? 0.5 + k * 0.2 : 0 }}
                >
                  <span className="text-brake">✓</span>
                  <span>{g}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[520px] -translate-x-1/2 rounded-[14px] border-[7px] border-white px-6 py-1 text-white"
          style={{ rotate: -8, fontWeight: 900, fontSize: 76, lineHeight: 1 }}
          initial={false}
          animate={hired ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 2.4 }}
          transition={hired ? { type: 'spring', bounce: 0.35, duration: 0.5, delay: 1.5 } : { duration: 0.2 }}
        >
          HIRED
        </motion.div>
      </motion.div>

      </Camera>

      <div className="absolute bottom-[60px] left-[140px] w-[1640px]">
        {hired && (
          <Fade k="f" delay={2.0} className="lede text-[32px] text-ink-2">
            Merchants didn’t quit AI over missing features. They quit over trust. That’s what we built first.
          </Fade>
        )}
      </div>
    </div>
  )
}
