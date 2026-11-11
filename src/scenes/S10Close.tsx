import { motion } from 'motion/react'
import { QR_RETAILY } from '../assets/qrRetaily'
import { Mark } from '../components/Mark'
import { Dashes, Paper, Row } from '../components/Receipt'

/** retaily.ai as a QR code, the RetailyAI mark in its centre (error correction H allows it). */
function QR() {
  const n = QR_RETAILY.size
  const q = 2 // quiet zone, in modules
  return (
    <div className="relative">
      <svg viewBox={`${-q} ${-q} ${n + 2 * q} ${n + 2 * q}`} className="block w-full" shapeRendering="crispEdges" role="img" aria-label="QR code for retaily.ai">
        <rect x={-q} y={-q} width={n + 2 * q} height={n + 2 * q} fill="#ffffff" />
        <path d={QR_RETAILY.path} fill="#0b1324" />
      </svg>
      <div className="absolute left-1/2 top-1/2 grid h-[64px] w-[64px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[16px] bg-white shadow-[0_0_0_6px_#ffffff]">
        <Mark size={48} />
      </div>
    </div>
  )
}
import { Camera } from '../components/Cine'
import { Lines } from '../components/Type'
import { EASE } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * 0  the team: the founder is the customer
 * 1  electric wipe: the ask
 */

const PEOPLE = [
  {
    name: 'Sifeddine Nehhas',
    role: 'Founder and CTO',
    line: 'Ran his own Moroccan COD store and lost the margin to confirmation. Backend and AI engineer; built the whole system.',
  },
  {
    name: 'Yassine Abdourabbih',
    role: 'CPO',
    line: 'Owns the product and the console merchants actually touch: the dashboard, the inbox, onboarding.',
  },
]

export default function S10Close({ step }: SceneProps) {
  const ask = step >= 1
  return (
    <div className="absolute inset-0 bg-paper">
      <div className="absolute left-[140px] top-[84px]">
        <Lines k="t" lines={['The founder was the customer.']} className="display text-[104px] text-ink" />
      </div>

      <Camera>
      <div className="absolute left-[140px] top-[330px] grid w-[1640px] grid-cols-2 gap-16">
        {PEOPLE.map((p, i) => (
          <motion.div
            key={p.name}
            className="border-t-[6px] border-ink pt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.4 + i * 0.15 }}
          >
            <div className="text-[64px] font-bold leading-none tracking-[-0.02em] text-ink" style={{ fontStretch: '90%' }}>
              {p.name}
            </div>
            <div className="mt-4 text-[32px] font-semibold text-electric">{p.role}</div>
            <div className="lede mt-6 max-w-[700px] text-[32px] text-ink-2">{p.line}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="display absolute bottom-[100px] left-[140px] text-[64px] text-electric"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        You can’t hire lived pain. It’s where we started.
      </motion.div>

      </Camera>

      {/* the ask */}
      <motion.div
        className="absolute inset-0 bg-navy text-white"
        style={{
          // the same night stage as the title: the deck closes where it opened
          background:
            'radial-gradient(ellipse 55% 65% at 80% -5%, rgba(30,107,255,0.75), transparent 70%), radial-gradient(ellipse 45% 50% at 8% 105%, rgba(127,178,255,0.22), transparent 70%), linear-gradient(180deg, #06102b 0%, #0b1f5c 100%)',
        }}
        initial={false}
        animate={{ clipPath: ask ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      >
        {ask && (
          <>
            <div className="absolute left-[140px] top-[170px]">
              <Lines
                k="ask"
                delay={0.5}
                lines={[
                  'Know a merchant',
                  'drowning in',
                  <span key="m" style={{ color: '#7fb2ff' }}>
                    messages?
                  </span>,
                ]}
                style={{ fontSize: 140, fontWeight: 540, fontStretch: '88%', letterSpacing: '-0.045em', lineHeight: 0.96 }}
              />
            </div>
            <motion.div
              className="lede absolute left-[140px] top-[620px] max-w-[940px] text-[42px] text-white/90"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 1.1 }}
            >
              Introduce us. We’ll set up a pilot on their store and show the numbers.
            </motion.div>

            {/* the QR, printed on a thermal receipt: their next order is a pilot */}
            <div className="absolute left-[1250px] top-[96px] z-10 h-[16px] w-[500px] rounded-full bg-black/70 shadow-[0_2px_0_rgba(255,255,255,0.08)]" />
            <div className="absolute left-[1275px] top-[104px] h-[900px] w-[450px] overflow-hidden">
              <motion.div initial={{ y: -900 }} animate={{ y: 0 }} transition={{ duration: 2.0, ease: [0.3, 0.7, 0.2, 1], delay: 0.9 }}>
                <Paper className="px-9 pt-8" shadow="0 30px 40px rgba(0,0,0,0.45)">
                  <div className="text-center text-[26px] font-semibold tracking-[0.14em]">RETAILYAI</div>
                  <div className="text-center text-[17px] text-ink-3">Casablanca · 11.11.2026</div>
                  <Dashes className="mt-4" />
                  <Row className="mt-4 text-[19px] text-ink-3" label="YOUR NEXT ORDER" value="#0001" />
                  <Row className="mt-3 text-[21px]" label="1 × pilot on your store" value="✓" />
                  <Row className="mt-1 text-[21px]" label="200 credits to start" value="0.00" />
                  <Dashes className="mt-4" />
                  <div className="relative mx-auto mt-6 w-[300px]">
                    <QR />
                    {/* the scanner beam, once the code has printed */}
                    <motion.div
                      className="absolute inset-x-[-10px] h-[4px] rounded-full bg-electric shadow-[0_0_18px_4px_rgba(30,107,255,0.55)]"
                      initial={{ top: 0, opacity: 0 }}
                      animate={{ top: [0, 296, 0], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 1.8, ease: 'easeInOut', delay: 3.1, times: [0, 0.5, 1] }}
                    />
                  </div>
                  <div className="mt-5 text-center text-[20px] font-semibold tracking-[0.2em]">SCAN TO START</div>
                  <div className="mt-1 pb-6 text-center font-sans text-[30px] font-bold tracking-[-0.02em] text-electric">retaily.ai</div>
                </Paper>
              </motion.div>
            </div>
            <motion.div
              className="absolute bottom-[90px] left-[140px] flex items-center gap-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              <div className="flex items-center gap-5">
                <Mark size={84} back="#9cc0ff" front="#ffffff" />
                <span className="text-[56px] font-bold tracking-[-0.03em]" style={{ fontStretch: '92%' }}>
                  retaily.ai
                </span>
              </div>
              <div className="border-l border-white/20 pl-14 text-[28px] leading-snug text-white/75">
                Sifeddine Nehhas
                <br />
                Find us after the session
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  )
}
