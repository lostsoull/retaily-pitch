import { AnimatePresence, MotionConfig, motion, type Variants } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { WIPE } from './components/Cine'
import { ReducedMotion } from './deck/motion'
import { DeckNav } from './deck/nav'
import { H, Stage, W } from './deck/Stage'
import { useDeck } from './deck/useDeck'
import { SCENES } from './scenes'

/*
 * Scene cut: the next scene wipes in from the side we're travelling to and
 * pushes the old one away under it, slightly receding.
 */
const CUT_T = { duration: 1.15, ease: WIPE }
const CUT: Variants = {
  enter: (d: number) => ({ clipPath: d > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)', x: d > 0 ? 180 : -180, zIndex: 2 }),
  center: { clipPath: 'inset(0% 0% 0% 0%)', x: 0, zIndex: 2, transition: CUT_T, transitionEnd: { clipPath: 'none' } },
  exit: (d: number) => ({ x: d > 0 ? -260 : 260, scale: 0.96, opacity: 0.25, zIndex: 1, transition: CUT_T }),
}
const FADE: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.4 } },
}
const EDGE: Variants = {
  enter: (d: number) => ({ x: d > 0 ? W : 0, opacity: 1 }),
  center: (d: number) => ({ x: d > 0 ? 0 : W, opacity: [1, 1, 0], transition: { ...CUT_T, opacity: { duration: 1.15, times: [0, 0.8, 1] } } }),
}

const prefersReduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
  else document.documentElement.requestFullscreen().catch(() => {})
}

export default function App() {
  const deck = useDeck(SCENES)
  const [reduced, setReduced] = useState(prefersReduced)
  const [overview, setOverview] = useState(false)
  const [help, setHelp] = useState(false)
  const [typed, setTyped] = useState('')
  const [chrome, setChrome] = useState(false)
  const chromeTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key
      if (/^[0-9]$/.test(k)) {
        setTyped((t) => (t + k).slice(-2))
        return
      }
      if (k === 'Enter' && typed) {
        deck.goto(Number(typed))
        setTyped('')
        setOverview(false)
        return
      }
      setTyped('')
      switch (k) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault()
          if (e.shiftKey && k === ' ') deck.prevStep()
          else deck.next()
          setOverview(false)
          break
        case 'PageUp':
        case 'ArrowUp':
        case 'Backspace':
          e.preventDefault()
          deck.prevStep()
          break
        case 'ArrowLeft':
          e.preventDefault()
          deck.prevScene()
          break
        case 'ArrowDown':
          e.preventDefault()
          deck.next()
          break
        case 'f':
        case 'F':
          toggleFullscreen()
          break
        case 'r':
        case 'R':
          deck.goto(0)
          setOverview(false)
          break
        case 'm':
        case 'M':
          setReduced((r) => !r)
          break
        case 'g':
        case 'G':
          setOverview((o) => !o)
          break
        case 'Escape':
          setOverview((o) => !o)
          setHelp(false)
          break
        case '?':
        case 'h':
        case 'H':
          setHelp((h) => !h)
          break
        case 'Home':
          deck.goto(0)
          break
        case 'End':
          deck.goto(SCENES.length - 1, 'last')
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [deck, typed])

  const [navHover, setNavHover] = useState(false)
  const pokeChrome = () => {
    setChrome(true)
    window.clearTimeout(chromeTimer.current)
    chromeTimer.current = window.setTimeout(() => setChrome(false), 1800)
  }

  const S = SCENES[deck.scene]
  const nav = useMemo(() => ({ next: deck.next }), [deck.next])

  // direction of travel, so the cut wipes forward or back
  const lastScene = useRef(deck.scene)
  const dir = deck.scene >= lastScene.current ? 1 : -1
  useEffect(() => {
    lastScene.current = deck.scene
  }, [deck.scene])

  return (
    <ReducedMotion.Provider value={reduced}>
      <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
        <div
          className="h-full w-full"
          data-reduced={reduced ? 'on' : 'off'}
          data-overview={overview ? 'on' : 'off'}
          onMouseMove={pokeChrome}
          style={{ cursor: chrome ? 'default' : 'none' }}
          onClick={(e) => {
            // Click anywhere to advance, unless the click hit something interactive.
            if ((e.target as HTMLElement).closest('button, a, [data-interactive]')) return
            deck.next()
          }}
        >
          <Stage bg={S.bg}>
            {/* initial stays on: with initial={false}, Motion skips every entrance inside the
                scene that's on screen at page load (the cold open), not just this wrapper's */}
            <AnimatePresence custom={dir}>
              <motion.div
                key={S.id}
                className="absolute inset-0"
                custom={dir}
                variants={reduced ? FADE : CUT}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <DeckNav.Provider value={nav}>
                  <S.Component step={deck.step} />
                </DeckNav.Provider>
                {/* the cut: one electric line rides the wipe's edge */}
                {!reduced && (
                  <motion.div
                    data-edge
                    className="pointer-events-none absolute inset-y-0 left-0 z-[80] w-[5px] bg-electric"
                    custom={dir}
                    variants={EDGE}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </Stage>
        </div>

        {/* the navigation bar: appears when the mouse moves, stays while hovered */}
        <NavBar
          visible={(chrome || navHover) && !overview}
          scene={deck.scene}
          step={deck.step}
          onHover={setNavHover}
          onPrevStep={deck.prevStep}
          onNext={deck.next}
          onPrevScene={deck.prevScene}
          onNextScene={() => deck.goto(Math.min(SCENES.length - 1, deck.scene + 1))}
          onJump={(i) => deck.goto(i)}
          onOverview={() => setOverview(true)}
        />

        {/* progress, shown only while the mouse moves */}
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 flex h-1 gap-1 px-1 pb-1 transition-opacity duration-500"
          style={{ opacity: chrome || overview ? 1 : 0 }}
        >
          {SCENES.map((s, i) => (
            <div key={s.id} className="h-1 flex-1 rounded-full bg-white/20 mix-blend-difference">
              <div
                className="h-full rounded-full bg-white"
                style={{
                  width: i < deck.scene ? '100%' : i > deck.scene ? '0%' : `${((deck.step + 1) / s.steps) * 100}%`,
                }}
              />
            </div>
          ))}
        </div>

        {typed && (
          <div className="fixed right-6 top-6 rounded-xl bg-ink/90 px-5 py-3 text-2xl font-semibold text-white">
            Go to {typed}, press Enter
          </div>
        )}

        <AnimatePresence>{overview && <Overview current={deck.scene} onPick={(i) => { deck.goto(i); setOverview(false) }} />}</AnimatePresence>
        <AnimatePresence>{help && <Help reduced={reduced} onClose={() => setHelp(false)} />}</AnimatePresence>
      </MotionConfig>
    </ReducedMotion.Provider>
  )
}

/* ---------- on-screen navigation ---------- */

function NavBtn({ label, onClick, children, disabled }: { label: string; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-11 w-11 place-items-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  )
}

const ico = (d: React.ReactNode) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d}
  </svg>
)

function NavBar({
  visible,
  scene,
  step,
  onHover,
  onPrevStep,
  onNext,
  onPrevScene,
  onNextScene,
  onJump,
  onOverview,
}: {
  visible: boolean
  scene: number
  step: number
  onHover: (h: boolean) => void
  onPrevStep: () => void
  onNext: () => void
  onPrevScene: () => void
  onNextScene: () => void
  onJump: (i: number) => void
  onOverview: () => void
}) {
  const S = SCENES[scene]
  const first = scene === 0 && step === 0
  const last = scene === SCENES.length - 1 && step === S.steps - 1
  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="nav"
          aria-label="Slide navigation"
          className="fixed bottom-5 left-1/2 z-[60] w-[min(1100px,calc(100vw-32px))] -translate-x-1/2 rounded-[22px] bg-[#0b1324]/85 p-2.5 text-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          style={{ cursor: 'default' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24, transition: { duration: 0.25 } }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => onHover(true)}
          onMouseLeave={() => onHover(false)}
          onClick={(e) => e.stopPropagation()}
        >
          {/* every slide, clickable */}
          <div className="flex gap-1 px-2 pb-2.5 pt-1">
            {SCENES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                title={`${i} · ${s.title}`}
                aria-label={`Go to slide ${i}: ${s.title}`}
                aria-current={i === scene ? 'step' : undefined}
                onClick={() => onJump(i)}
                className="group flex h-4 flex-1 items-center"
              >
                <span
                  className={`h-1.5 w-full rounded-full transition-all group-hover:h-2.5 ${i === scene ? 'bg-[#7fb2ff]' : i < scene ? 'bg-white/55' : 'bg-white/20 group-hover:bg-white/45'}`}
                />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <NavBtn label="Previous slide (←)" onClick={onPrevScene} disabled={scene === 0}>
              {ico(<path d="M11 18 5 12l6-6M19 18l-6-6 6-6" />)}
            </NavBtn>
            <NavBtn label="Previous step (↑)" onClick={onPrevStep} disabled={first}>
              {ico(<path d="m15 18-6-6 6-6" />)}
            </NavBtn>
            <div className="mx-3 flex min-w-0 flex-1 items-center gap-4">
              <span className="shrink-0 text-[15px] font-semibold tabular-nums text-white/55">
                {scene + 1} / {SCENES.length}
              </span>
              <span className="truncate text-[17px] font-semibold">{S.title}</span>
              {S.steps > 1 && (
                <span className="ml-auto flex shrink-0 gap-1.5">
                  {Array.from({ length: S.steps }, (_, k) => (
                    <span key={k} className={`h-2 rounded-full transition-all ${k === step ? 'w-6 bg-[#7fb2ff]' : k < step ? 'w-2 bg-white/60' : 'w-2 bg-white/25'}`} />
                  ))}
                </span>
              )}
            </div>
            <NavBtn label="Next step (→)" onClick={onNext} disabled={last}>
              {ico(<path d="m9 18 6-6-6-6" />)}
            </NavBtn>
            <NavBtn label="Next slide" onClick={onNextScene} disabled={scene === SCENES.length - 1}>
              {ico(<path d="m13 18 6-6-6-6M5 18l6-6-6-6" />)}
            </NavBtn>
            <span className="mx-1 h-6 w-px bg-white/15" />
            <NavBtn label="All slides (G)" onClick={onOverview}>
              {ico(
                <>
                  <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
                  <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
                  <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
                  <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
                </>,
              )}
            </NavBtn>
            <NavBtn label="Fullscreen (F)" onClick={toggleFullscreen}>
              {ico(<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />)}
            </NavBtn>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

function Overview({ current, onPick }: { current: number; onPick: (i: number) => void }) {
  const tileW = 400
  const s = tileW / W
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-auto bg-[#111214] p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <ReducedMotion.Provider value={true}>
      <MotionConfig reducedMotion="always">
        <div className="mx-auto grid max-w-[1760px] grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-8">
          {SCENES.map((sc, i) => (
            <button
              key={sc.id}
              onClick={() => onPick(i)}
              className={`group text-left outline-none ${i === current ? '' : 'opacity-80 hover:opacity-100'}`}
            >
              <div
                className={`relative overflow-hidden rounded-xl ring-4 ${i === current ? 'ring-electric' : 'ring-transparent group-hover:ring-white/40 group-focus-visible:ring-white'}`}
                style={{ width: tileW, height: H * s, background: sc.bg }}
              >
                <div className="pointer-events-none absolute left-0 top-0" style={{ width: W, height: H, transform: `scale(${s})`, transformOrigin: '0 0' }}>
                  <sc.Component step={sc.steps - 1} />
                </div>
              </div>
              <div className="mt-3 flex gap-3 text-lg text-white/85">
                <span className="tabular text-white/50">{i}</span>
                <span>{sc.title}</span>
              </div>
            </button>
          ))}
        </div>
      </MotionConfig>
      </ReducedMotion.Provider>
    </motion.div>
  )
}

function Help({ reduced, onClose }: { reduced: boolean; onClose: () => void }) {
  const rows: [string, string][] = [
    ['→  Space  PageDown  click', 'Next step'],
    ['PageUp  ↑', 'Previous step'],
    ['←', 'Previous scene'],
    ['G  Esc', 'Scene overview'],
    ['0–10, Enter', 'Jump to scene'],
    ['F', 'Fullscreen'],
    ['R', 'Restart'],
    ['M', `Reduced motion (${reduced ? 'on' : 'off'})`],
  ]
  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-[#111214]/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="rounded-2xl bg-white p-10 text-ink shadow-2xl">
        <div className="mb-6 text-3xl font-bold">Controls</div>
        <div className="grid grid-cols-[auto_auto] gap-x-12 gap-y-3 text-xl">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <span className="font-mono text-ink-2">{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
