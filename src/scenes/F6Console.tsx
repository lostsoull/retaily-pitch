import { AnimatePresence, motion } from 'motion/react'
import { BOX } from '../components/Cine'
import { FeatureFrame } from '../components/Feature'
import { EASE, useReduced } from '../deck/motion'
import type { SceneProps } from '../deck/types'
import overview from '../assets/overview.jpeg'
import inbox from '../assets/inbox.png'

/*
 * 6 · Owner's console (the real overview screen)
 * 0 the live screen orbits into place
 * 1 the two things that matter: the live numbers, and what needs a human right now
 * 2 the real inbox slides over it
 *
 * Composition: the screen is the hero, flush with BOX's top and bleeding off
 * the right edge of the frame (square corners on that side).
 */

const SPOTS = [
  { left: '20.6%', top: '10.6%', width: '73.8%', height: '20.6%', label: 'Every chat, order and parcel, live' },
  { left: '57.9%', top: '32.8%', width: '36.6%', height: '31.4%', label: 'What needs a human, right now' },
]

const SCREEN_W = 1920 - BOX.x

function Chrome({ title }: { title?: string }) {
  return (
    <div className="flex h-9 items-center gap-2 border-b border-line bg-paper px-4">
      <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
      <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
      <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      {title && <span className="ml-4 text-[16px] text-ink-3">{title}</span>}
    </div>
  )
}

export default function F6Console({ step }: SceneProps) {
  const reduced = useReduced()
  const focus = step === 1
  const inboxOn = step >= 2
  return (
    <FeatureFrame
      n={7}
      headline={['The whole shop,', 'one screen.']}
      subKey={step}
      sub={
        inboxOn
          ? 'And every conversation in one inbox, with the agent’s replies right there. This is the real product, live with pilot merchants.'
          : focus
            ? 'A short list of what needs you. Everything else, the agent already handled.'
            : 'One live screen with every chat, order and parcel.'
      }
    >
      {/* the overview: orbits in, then recedes when the inbox arrives */}
      <motion.div
        className="absolute"
        style={{ left: BOX.x, top: BOX.y, width: SCREEN_W, transformPerspective: 2200, transformOrigin: '0% 50%' }}
        initial={reduced ? { opacity: 0 } : { opacity: 0, x: 260, rotateY: -28, rotateX: 8, scale: 0.92, filter: 'blur(14px)' }}
        animate={{
          opacity: inboxOn ? 0.55 : 1,
          x: 0,
          rotateY: 0,
          rotateX: 0,
          scale: inboxOn ? 0.94 : 1,
          filter: inboxOn ? 'blur(3px)' : 'blur(0px)',
        }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
      >
        <div className="overflow-hidden rounded-l-[20px] bg-white shadow-[0_40px_80px_-40px_rgba(6,16,43,0.35),0_0_0_1px_rgba(6,16,43,0.08)]">
          <Chrome />
          <div className="relative">
            <img src={overview} alt="The RetailyAI overview: revenue, confirmed orders, autonomy rate, cost per order, orders per day and the needs-attention list" className="block w-full" />
            {/* dim everything except the two spots */}
            <motion.svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              initial={false}
              animate={{ opacity: focus ? 1 : 0 }}
              transition={{ duration: 0.8 }}
              aria-hidden
            >
              <path
                fillRule="evenodd"
                fill="rgba(6,16,43,0.6)"
                d={`M0 0H100V100H0Z ${SPOTS.map((s) => {
                  const [x, y, w, h] = [s.left, s.top, s.width, s.height].map(parseFloat)
                  return `M${x} ${y}h${w}v${h}h${-w}Z`
                }).join(' ')}`}
              />
            </motion.svg>
            {SPOTS.map((s, i) => (
              <motion.div
                key={s.label}
                className="absolute rounded-xl border-[4px] border-electric"
                style={{ left: s.left, top: s.top, width: s.width, height: s.height }}
                initial={false}
                animate={{ opacity: focus ? 1 : 0, scale: focus ? 1 : 1.12 }}
                transition={{ duration: 0.7, ease: EASE, delay: focus ? 0.4 + i * 0.45 : 0 }}
              >
                <div
                  className={`absolute left-0 whitespace-nowrap rounded-full bg-electric px-4 py-1.5 text-[21px] font-semibold text-white ${
                    i === 0 ? '-top-[52px]' : 'top-[calc(100%+12px)]'
                  }`}
                >
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div className="mt-5 text-[22px] text-ink-3" initial={{ opacity: 0 }} animate={{ opacity: inboxOn ? 0 : 1 }} transition={{ delay: inboxOn ? 0 : 1.4 }}>
          The real RetailyAI overview.
        </motion.div>
      </motion.div>

      {/* the real inbox slides over it, offset down and right */}
      <AnimatePresence>
        {inboxOn && (
          <motion.div
            key="inbox"
            className="absolute z-10 overflow-hidden rounded-l-[20px] bg-white shadow-[0_50px_90px_-30px_rgba(6,16,43,0.45),0_0_0_1px_rgba(6,16,43,0.08)]"
            style={{ left: BOX.x + 60, top: BOX.y + 90, width: SCREEN_W - 60, transformPerspective: 2200, transformOrigin: '100% 50%' }}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 400, rotateY: 22, filter: 'blur(12px)' }}
            animate={{ opacity: 1, x: 0, rotateY: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
            exit={{ opacity: 0, x: 200, transition: { duration: 0.35 } }}
            transition={{ duration: 1.3, ease: EASE, delay: 0.25 }}
          >
            <Chrome title="RetailyAI · Conversations" />
            <div className="relative">
              <img src={inbox} alt="The RetailyAI inbox with a live WhatsApp conversation answered by the AI" className="block w-full" />
              {/* customer phone number: masked, never shown on stage */}
              <div className="absolute rounded-sm bg-[repeating-linear-gradient(90deg,#d7dbe7_0_6px,#e9ecf3_6px_9px)]" style={{ left: '80.6%', top: '60.4%', width: '7.4%', height: '2.9%' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </FeatureFrame>
  )
}
