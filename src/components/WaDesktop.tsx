import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import { rand, useReduced } from '../deck/motion'
import { Bubble, WA_FONT } from './Chat'

/*
 * WhatsApp Desktop, dark theme, during an evening rush.
 * Left: the chat list. New chats push in at the top, faster and faster, each with
 * a green unread badge. Right: one customer who will not stop sending messages.
 * Everything runs off fixed keyframes, so it plays the same every time.
 */

const C = {
  panel: '#111b21',
  header: '#202c33',
  chat: '#0b141a',
  line: '#222d34',
  text: '#e9edef',
  sub: '#8696a0',
  green: '#00a884',
  chipOn: '#0a332c',
}

const FLOOD = 4.6 // seconds until the list is buried
const ROW = 104
const LIST_TOP = 268

const PEOPLE = [
  ['Aicha', '#c9468b'], ['Youssef', '#0e8f6f'], ['Salma', '#7b5cd6'], ['Karim', '#d16b2a'], ['Imane', '#2a7fd1'],
  ['Hamza', '#b7432f'], ['Fatima Zahra', '#3c9a46'], ['Omar', '#a8562f'], ['Nadia', '#5b6ee0'], ['Mehdi', '#147d8f'],
  ['Sara', '#c2457a'], ['Anas', '#6b8e23'], ['Khadija', '#8a4fd0'], ['Yassir', '#1f8a70'], ['Meryem', '#cf5c36'],
  ['Ilyas', '#3d6fd8'], ['Hajar', '#a33d7d'], ['Zakaria', '#2e8b57'], ['Soukaina', '#d0632f'], ['Reda', '#4169c9'],
] as const

const PREVIEWS = [
  'Salam, ch7al?', 'واش متوفر؟', 'Prix svp', 'Kayna f noir?', 'Mazal ma wslatni la commande', 'Bghit nbdl la taille, 38 machi 40',
  'Allo??', 'Livraison l Tanger ch7al?', 'كيفاش نخلص؟', 'Wach kayn promo?', 'Bdl liya l’adresse 3afak', 'Bonjour, c’est toujours dispo ?',
  'Wach original?', 'Ana f Agadir, katwsl?', '🎤 Voice message (0:42)', 'Fin wslat la commande dyali?', 'Kayn size L?', 'Je veux annuler',
  '📷 Photo', 'شحال التوصيل لمراكش؟', 'Rani sifet lik 3 messages', 'Allo wach kayn chi had?',
]

const N = 30
const ARRIVE = Array.from({ length: N }, (_, i) => 0.5 + FLOOD * Math.sqrt(i / (N - 1)))
const DUR = ARRIVE[N - 1] + 0.6

const ROWS = ARRIVE.map((a, i) => {
  const [name, color] = PEOPLE[(i * 7) % PEOPLE.length]
  const badge = 1 + Math.floor(rand(i, 4) * (3 + (i / N) * 11))
  const m = 14 + Math.floor((i / N) * 44)
  return { i, a, name, color, preview: PREVIEWS[(i * 5) % PREVIEWS.length], badge, time: `21:${String(m).padStart(2, '0')}` }
})

/** How long the list takes to snap down when chat j arrives. */
const PUSH = ARRIVE.map((a, j) => Math.min(0.12, ((ARRIVE[j + 1] ?? DUR) - a) * 0.5))

/**
 * Keyframes for row i: invisible until the list has snapped down for it, then it
 * appears at the top and is pushed down one row by every later arrival.
 */
function rowKeys(i: number) {
  const a = ARRIVE[i]
  const y: number[] = [0, 0, 0]
  const o: number[] = [0, 0, 1]
  const t: number[] = [0, a + PUSH[i], a + PUSH[i] + 0.06]
  for (let j = i + 1; j < N; j++) {
    const k = j - i
    t.push(ARRIVE[j], ARRIVE[j] + PUSH[j])
    y.push((k - 1) * ROW, k * ROW)
    o.push(1, 1)
  }
  t.push(DUR)
  y.push(y[y.length - 1])
  o.push(1)
  // strictly increasing times
  for (let k = 1; k < t.length; k++) if (t[k] <= t[k - 1]) t[k] = t[k - 1] + 0.0005
  return { y, o, times: t.map((v) => Math.min(v / t[t.length - 1], 1)) }
}

const KEYS = ROWS.map((r) => rowKeys(r.i))

const CONVO = [
  'Salam',
  'Ch7al l’ensemble lin?',
  'Kayn f beige?',
  'Allo?',
  'Salam??',
  'Wach kayn chi had?',
  'Ana ghadi nakhod jouj',
  'Livraison l Casa ch7al?',
  '???',
  'Rani sifet lik 5 messages',
  'Khoya jawbni 3afak',
  'Safi ila ma jawbtich ghadi nchri mn 3and chi wa7ed akhor',
]
const CONVO_AT = CONVO.map((_, i) => 0.9 + (FLOOD - 0.4) * Math.sqrt(i / (CONVO.length - 1)))

function Avatar({ name, color, size = 62 }: { name: string; color: string; size?: number }) {
  return (
    <div className="grid shrink-0 place-items-center rounded-full font-semibold text-white" style={{ width: size, height: size, background: color, fontSize: size * 0.42 }}>
      {name[0]}
    </div>
  )
}

function UnreadCount({ frozen }: { frozen: boolean }) {
  const reduced = useReduced()
  const [settled] = useState(frozen) // deep link straight to the freeze: show the final count
  const mv = useMotionValue(settled ? 247 : 0)
  const text = useTransform(() => Math.round(mv.get()).toString())
  useEffect(() => {
    if (reduced || settled) {
      mv.set(247)
      return
    }
    const c = animate(mv, 247, { duration: FLOOD, ease: [0.5, 0, 0.9, 0.6], delay: 0.5 })
    return () => c.stop()
  }, [mv, reduced, settled])
  return <motion.span className="tabular">{text}</motion.span>
}

function Row({ r }: { r: (typeof ROWS)[number] }) {
  const k = KEYS[r.i]
  return (
    <motion.div
      className="absolute inset-x-0 top-0 flex items-center gap-5 pl-6 pr-7"
      style={{ height: ROW, background: C.panel, zIndex: r.i }}
      initial={{ y: k.y[0], opacity: 0 }}
      animate={{ y: k.y, opacity: k.o }}
      transition={{ duration: DUR, times: k.times, ease: 'linear' }}
    >
      <Avatar name={r.name} color={r.color} />
      <div className="flex h-full min-w-0 flex-1 flex-col justify-center border-b" style={{ borderColor: C.line }}>
        <div className="flex items-baseline justify-between gap-3">
          <span className="truncate text-[26px]" style={{ color: C.text }}>
            {r.name}
          </span>
          <span className="shrink-0 text-[18px] font-semibold" style={{ color: C.green }}>
            {r.time}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between gap-3">
          <span className="truncate text-[21px]" style={{ color: C.sub }}>
            {r.preview}
          </span>
          <span className="grid h-[30px] min-w-[30px] shrink-0 place-items-center rounded-full px-2 text-[17px] font-bold" style={{ background: C.green, color: C.panel }}>
            {r.badge}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export function WaDesktop({ frozen }: { frozen: boolean }) {
  return (
    <div className="absolute inset-0 flex" style={{ fontFamily: WA_FONT, background: C.panel }}>
      {/* nav rail */}
      <div className="flex w-[76px] flex-col items-center gap-7 pt-7" style={{ background: C.header }}>
        {[0, 1, 2, 3].map((k) => (
          <div key={k} className="relative h-9 w-9 rounded-xl border-[3px]" style={{ borderColor: k === 0 ? C.text : C.sub }}>
            {k === 0 && <span className="absolute -right-3 -top-3 h-5 w-5 rounded-full" style={{ background: C.green }} />}
          </div>
        ))}
      </div>

      {/* chat list */}
      <div className="relative w-[640px] overflow-hidden border-r" style={{ borderColor: C.line }}>
        <div className="flex items-center justify-between px-7 pt-7">
          <span className="text-[36px] font-bold" style={{ color: C.text }}>
            Chats
          </span>
          <span className="rounded-full px-5 py-1.5 text-[28px] font-bold" style={{ background: C.green, color: C.panel }}>
            <UnreadCount frozen={frozen} />
          </span>
        </div>
        <div className="mx-7 mt-5 flex h-[54px] items-center rounded-xl px-5 text-[21px]" style={{ background: C.header, color: C.sub }}>
          Search or start a new chat
        </div>
        <div className="mx-7 mt-4 flex gap-3 text-[20px] font-medium">
          {['All', 'Unread', 'Favourites', 'Groups'].map((c) => (
            <span
              key={c}
              className="rounded-full px-4 py-1.5"
              style={c === 'Unread' ? { background: C.chipOn, color: C.green } : { background: C.header, color: C.sub }}
            >
              {c}
            </span>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0" style={{ top: LIST_TOP }}>
          {ROWS.map((r) => (
            <Row key={r.i} r={r} />
          ))}
        </div>
      </div>

      {/* the open conversation */}
      <div className="relative flex flex-1 flex-col" style={{ background: C.chat }}>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(#e9edef 1.2px, transparent 1.3px)', backgroundSize: '28px 28px' }}
        />
        <div className="relative flex h-[104px] items-center gap-5 px-7" style={{ background: C.header }}>
          <Avatar name="Salma" color="#7b5cd6" size={58} />
          <div>
            <div className="text-[26px]" style={{ color: C.text }}>
              Salma
            </div>
            <motion.div
              className="text-[19px]"
              style={{ color: C.green }}
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              typing…
            </motion.div>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col justify-end gap-[6px] overflow-hidden px-[110px] pb-6">
          <div className="mx-auto mb-3 rounded-lg px-4 py-1.5 text-[18px]" style={{ background: '#182229', color: C.sub }}>
            TODAY
          </div>
          <div className="mx-auto mb-3 rounded-lg px-5 py-1.5 text-[18px]" style={{ background: '#182229', color: C.sub }}>
            {CONVO.length} UNREAD MESSAGES
          </div>
          {CONVO.map((m, i) => (
            <motion.div
              key={i}
              className="overflow-hidden"
              style={{ paddingLeft: 12 }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.22, delay: CONVO_AT[i], ease: 'easeOut' }}
            >
              <Bubble side="in" theme="dark" size={25} tail={i === 0} time={`21:${40 + i}`} className="max-w-[640px]">
                {m}
              </Bubble>
            </motion.div>
          ))}
        </div>

        <div className="relative flex h-[96px] items-center gap-5 px-7" style={{ background: C.header }}>
          <div className="h-9 w-9 rounded-full border-[3px]" style={{ borderColor: C.sub }} />
          <div className="flex h-[58px] flex-1 items-center rounded-xl px-6 text-[22px]" style={{ background: '#2a3942', color: C.sub }}>
            Type a message
          </div>
        </div>
      </div>
    </div>
  )
}
