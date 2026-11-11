import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import convo from '../assets/phone_convo.mp4'
import { Bubble } from '../components/Chat'
import { BOX, GAP } from '../components/Cine'
import { IPhone, WaHeader, phoneMetrics } from '../components/Device'
import { FeatureFrame, cardCls } from '../components/Feature'
import { EASE, EASE_IN, useReduced } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * 1 · Conversation agent, shown with a real recording from the product.
 * 0 the recording plays in the phone, with sound: voice notes in, voice notes out,
 *   all the way to order R-006. Beside it, a live log of what the agent did fills as
 *   the video runs; at 0:24 the order lifts out of the phone into the log's last slot.
 * 1 the follow-ups fly out of the same phone: a change, a cancellation, "where is my parcel?"
 *
 * Composition: the phone is the hero and bleeds off the bottom of the frame; the
 * right column (log, then follow-ups) fills BOX edge to edge.
 */

/* the recording: 1080 x 1920, the phone screen sits at x 124-955, y 324-1835 */
/* cropped below the recording's own WhatsApp header (and its rounded corners): we draw the header ourselves */
const SRC = { w: 1080, h: 1920, sx: 124, sy: 446, sw: 832, sh: 1389 }
const HEADER_H = 64
const PHONE_W = 540
const PM = phoneMetrics(PHONE_W)
const SCREEN_W = PM.screenW
const K = SCREEN_W / SRC.sw
const SCREEN_H = Math.round(SRC.sh * K) // the recording's screen, under the status bar
const PHONE_H = SCREEN_H + HEADER_H + PM.status + 2 * (PM.rim + PM.bezel)
const SCREEN_X = BOX.x + PM.rim + PM.bezel
const SCREEN_Y = BOX.y + PM.rim + PM.bezel + PM.status + HEADER_H
const COL_X = BOX.x + PHONE_W + 44
const COL_W = BOX.r - COL_X
const END = 25.9
const POSTER = 0.6 // the first real frame: the product photo and the agent's voice note

/* what happens in the recording, and when (seconds) */
type Beat = { t: number; who: 'Agent' | 'Customer'; voice?: boolean; text: string }
const BEATS: Beat[] = [
  { t: 0.4, who: 'Agent', voice: true, text: 'Sends the linen set, 199 MAD' },
  { t: 1.2, who: 'Customer', voice: true, text: '“Which colours do you have?”' },
  { t: 2.6, who: 'Agent', text: 'Shows both colours in stock' },
  { t: 5.4, who: 'Customer', voice: true, text: '“I love the green. I’ll order.”' },
  { t: 13.1, who: 'Agent', voice: true, text: 'Asks for the size' },
  { t: 22.4, who: 'Customer', voice: true, text: '“L, please.”' },
]
const ORDER_AT = 24.0

/** Plays the recording on step 0 (sound on when the browser allows), rests on its last frame after. */
function useRecording(step: number) {
  const ref = useRef<HTMLVideoElement>(null)
  const [t, setT] = useState(step >= 1 ? END : 0)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(step >= 1)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const seek = (to: number) => {
      const go = () => (v.currentTime = to)
      if (v.readyState >= 1) go()
      else v.addEventListener('loadedmetadata', go, { once: true })
    }
    if (step === 0) {
      // rest on the first real frame (the recording opens on black) until the presenter presses play
      setT(0)
      setStarted(false)
      setPlaying(false)
      v.pause()
      seek(POSTER)
      const onTime = () => setT(v.currentTime)
      const onPlay = () => setPlaying(true)
      const onPause = () => setPlaying(false)
      v.addEventListener('timeupdate', onTime)
      v.addEventListener('play', onPlay)
      v.addEventListener('pause', onPause)
      return () => {
        v.pause()
        v.removeEventListener('timeupdate', onTime)
        v.removeEventListener('play', onPlay)
        v.removeEventListener('pause', onPause)
      }
    }
    v.pause()
    setT(END)
    setStarted(true)
    seek(Math.max(0, (v.duration || END) - 0.05))
  }, [step])

  /** Play from where it rests (sound on: the click or key press is the user gesture), or pause. */
  const toggle = () => {
    const v = ref.current
    if (!v || step !== 0) return
    if (!v.paused) {
      v.pause()
      return
    }
    if (v.ended || v.currentTime >= (v.duration || END) - 0.1) v.currentTime = POSTER
    setStarted(true)
    v.muted = false
    v.play().catch(() => {
      v.muted = true
      v.play().catch(() => {})
    })
  }

  // P plays and pauses, so a clicker-holding presenter can start it from the keyboard
  useEffect(() => {
    if (step !== 0) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') toggle()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return { ref, t: started ? t : 0, playing, started, toggle }
}

function Mic() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  )
}

/** The log of what the agent did, filled live by the recording. */
function Log({ t }: { t: number }) {
  const progress = Math.min(1, t / ORDER_AT)
  const ordered = t >= ORDER_AT
  return (
    <motion.div
      className="absolute flex flex-col"
      style={{ left: COL_X, top: BOX.y, width: COL_W, height: BOX.h }}
      initial={{ opacity: 0, x: 60, filter: 'blur(10px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      exit={{ opacity: 0, x: 40, filter: 'blur(8px)', transition: { duration: 0.4, ease: EASE_IN } }}
      transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
    >
      <div className="flex items-center justify-between pb-4 text-[20px] font-semibold text-ink-3">
        <span className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            {!ordered && t > 0 && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric opacity-60" />}
            <span className="relative inline-flex h-3 w-3 rounded-full bg-electric" />
          </span>
          What the agent did
        </span>
        <span className="tabular">0:{String(Math.floor(Math.min(t, ORDER_AT + 1))).padStart(2, '0')}</span>
      </div>

      <div className="relative flex flex-1 flex-col justify-between pb-6">
        {/* the line, filled by the recording */}
        <div className="absolute bottom-10 left-[9px] top-3 w-[3px] rounded-full bg-line" />
        <motion.div
          className="absolute bottom-10 left-[9px] top-3 w-[3px] origin-top rounded-full bg-electric"
          animate={{ scaleY: progress }}
          transition={{ duration: 0.35, ease: 'linear' }}
        />
        {BEATS.map((b) => {
          const lit = t >= b.t
          const agent = b.who === 'Agent'
          return (
            <motion.div
              key={b.t}
              className="relative flex items-start gap-4"
              initial={false}
              animate={{ opacity: lit ? 1 : 0.28, x: lit ? 0 : 6 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <motion.span
                className="relative z-10 mt-1 h-[21px] w-[21px] shrink-0 rounded-full border-[4px]"
                initial={false}
                animate={{
                  borderColor: lit ? (agent ? '#1e6bff' : '#0b1324') : '#d6deea',
                  backgroundColor: lit && agent ? '#1e6bff' : '#ffffff',
                  scale: lit ? [1.5, 1] : 1,
                }}
                transition={{ duration: 0.45 }}
              />
              <div className="min-w-0">
                <div className={`flex items-center gap-1.5 text-[17px] font-semibold ${agent ? 'text-electric' : 'text-ink-3'}`}>
                  {b.who}
                  {b.voice && (
                    <>
                      <span className="text-ink-4">·</span>
                      <Mic /> voice note
                    </>
                  )}
                </div>
                <div className="text-[22px] font-medium leading-snug text-ink">{b.text}</div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* the order's landing slot: holds its place until the order arrives */}
      <div className="relative h-[150px] rounded-[22px] border-2 border-dashed border-line">
        {!ordered && <div className="grid h-full place-items-center text-[20px] text-ink-4">The order lands here</div>}
      </div>
    </motion.div>
  )
}

/** Order R-006, lifted out of the phone (where it appears in the recording) into the log. */
function OrderCard({ fly }: { fly: boolean }) {
  const reduced = useReduced()
  const from = { left: SCREEN_X + 0.46 * SCREEN_W, top: SCREEN_Y + 0.7 * SCREEN_H }
  const to = { left: COL_X, top: BOX.b - 150 }
  return (
    <motion.div
      className="absolute z-30 flex h-[150px] flex-col justify-between overflow-hidden rounded-[22px] bg-electric px-6 py-5 text-white shadow-[0_40px_70px_-30px_rgba(30,107,255,0.8)]"
      style={{ width: COL_W }}
      initial={fly && !reduced ? { ...from, opacity: 0, scale: 0.55, rotate: 0 } : { ...to, opacity: 0 }}
      animate={
        fly && !reduced
          ? { left: [from.left, from.left, to.left], top: [from.top, from.top - 60, to.top], opacity: [0, 1, 1], scale: [0.55, 0.7, 1], rotate: [0, -4, 0] }
          : { ...to, opacity: 1 }
      }
      transition={fly && !reduced ? { duration: 1.3, ease: EASE, times: [0, 0.25, 1] } : { duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[26px] font-semibold">Order R-006</span>
        <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[17px] font-semibold">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m4 12.5 5 5L20 6.5" />
          </svg>
          Created
        </span>
      </div>
      <div>
        <div className="text-[22px] font-medium">Linen set · Olive Green · L</div>
        <div className="text-[20px] text-white/75 tabular">199.00 MAD, cash on delivery</div>
      </div>
    </motion.div>
  )
}

const FOLLOW = [
  { label: 'A change', q: 'Bghit jouj machi wa7da', a: 'Safi: 2 ensembles, 398 MAD' },
  { label: 'A cancellation', q: 'Smh lia, bghit nlghi', a: 'Mafihach, tlghat R-006.' },
  { label: '“Where is my parcel?”', q: 'Fin wslat la commande?', a: 'F triq! Twslk lyouma.' },
]
const CARD_H = (BOX.h - 2 * GAP) / 3

/** A follow-up conversation, launched out of the phone toward its slot. */
function FollowUp({ i, label, q, a }: { i: number; label: string; q: string; a: string }) {
  const reduced = useReduced()
  return (
    <motion.div
      className={`${cardCls} absolute flex flex-col justify-center gap-2 px-5`}
      style={{ left: COL_X, top: BOX.y + i * (CARD_H + GAP), width: COL_W, height: CARD_H, background: '#efeae2', transformPerspective: 1600 }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: -380, y: 260 - i * 200, scale: 0.55, rotateY: -30, filter: 'blur(14px)' }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      transition={{ duration: 1.25, ease: EASE, delay: 0.55 + i * 0.32 }}
    >
      <div className="text-[19px] font-semibold text-ink-3">{label}</div>
      <Bubble side="in" size={20}>
        {q}
      </Bubble>
      <Bubble side="out" size={20} ticks className="self-end">
        {a}
      </Bubble>
    </motion.div>
  )
}

export default function F1Conversation({ step }: SceneProps) {
  const follow = step >= 1
  const { ref, t, playing, started, toggle } = useRecording(step)
  const ordered = t >= ORDER_AT
  return (
    <FeatureFrame
      n={2}
      headline={['It sells while', 'you sleep.']}
      subKey={step}
      sub={
        follow
          ? 'Then it handles every follow-up: a change, a cancellation, “where is my parcel?”.'
          : 'Recorded in the product. Voice notes in, voice notes out, in Darija, all the way to the order.'
      }
    >
      {/* the hero: the real recording, in the deck's phone, bleeding off the bottom of the frame */}
      <motion.div
        className="absolute"
        style={{ left: BOX.x, top: BOX.y, transformPerspective: 1800, transformOrigin: '50% 100%' }}
        initial={{ opacity: 0, y: 160, rotateX: 22, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
      >
        <IPhone width={PHONE_W} height={PHONE_H} time="21:46" statusBg="#f6f6f6">
          <div style={{ height: HEADER_H }} className="flex flex-col justify-center bg-[#f6f6f6]">
            <WaHeader name="Client #1002" sub="online" w={SCREEN_W} />
          </div>
          <div className="relative overflow-hidden bg-[#fffef4]" style={{ width: SCREEN_W, height: SCREEN_H }}>
            <video
              ref={ref}
              src={convo}
              playsInline
              preload="auto"
              className="absolute block"
              style={{ width: SRC.w * K, height: SRC.h * K, left: -SRC.sx * K, top: -SRC.sy * K, maxWidth: 'none' }}
            />
            {/* play: the presenter starts the recording (and its sound) when ready to talk over it */}
            <AnimatePresence>
              {!follow && !playing && t < END - 0.2 && (
                <motion.div
                  key="play"
                  className="absolute inset-0 grid place-items-center"
                  style={{ background: 'linear-gradient(180deg, rgba(6,16,43,0.05), rgba(6,16,43,0.35))' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.5, delay: started ? 0 : 1.2 }}
                >
                  <div className="flex flex-col items-center">
                    <motion.button
                      type="button"
                      data-interactive
                      onClick={toggle}
                      aria-label={started ? 'Resume the recording' : 'Play the recording'}
                      className="relative grid h-[132px] w-[132px] place-items-center rounded-full bg-electric text-white shadow-[0_30px_60px_-20px_rgba(30,107,255,0.9)] outline-none"
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      {/* a soft pulse, inviting the click */}
                      <motion.span
                        className="absolute inset-0 rounded-full border-4 border-electric"
                        animate={{ scale: [1, 1.45], opacity: [0.7, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                      />
                      <svg width="54" height="54" viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ marginLeft: 6 }}>
                        <path d="M7 4.5v15l13-7.5z" />
                      </svg>
                    </motion.button>
                    <div className="mt-5 rounded-full bg-white/95 px-5 py-2 text-[20px] font-semibold text-ink shadow-[0_10px_24px_-12px_rgba(6,16,43,0.5)]">
                      {started ? 'Resume' : 'Play the conversation'} <span className="font-medium text-ink-3">· or press P</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </IPhone>
      </motion.div>

      {/* the satellite: this is the real thing, sound on */}
      <motion.div
        className="absolute z-20 flex items-center gap-3 rounded-full bg-ink px-5 py-2.5 text-[20px] font-semibold text-white shadow-[0_24px_40px_-20px_rgba(6,16,43,0.6)]"
        style={{ left: 140, top: 580 }}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: follow ? 0 : 1, x: follow ? -40 : 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: follow ? 0 : 1.1 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
        Real recording · sound on
      </motion.div>

      <AnimatePresence>{!follow && <Log key="log" t={t} />}</AnimatePresence>
      <AnimatePresence>{!follow && ordered && <OrderCard key="order" fly={step === 0 && playing} />}</AnimatePresence>

      {/* the follow-ups: equal cells filling the right column, edge to edge */}
      {follow && FOLLOW.map((f, i) => <FollowUp key={f.label} i={i} {...f} />)}
    </FeatureFrame>
  )
}
