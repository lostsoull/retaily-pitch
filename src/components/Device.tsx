import type { CSSProperties, ReactNode } from 'react'

/*
 * A realistic phone: titanium rim, black bezel, dynamic island, side buttons,
 * an iOS status bar, a home indicator. Everything scales from `width`.
 * Used wherever the deck shows a phone, so they all read as the same device.
 */

const IOS_FONT = '-apple-system, "SF Pro Text", "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif'

export function phoneMetrics(width: number) {
  const rim = 4
  const bezel = Math.round(width * 0.026)
  const status = Math.round(width * 0.118)
  const screenW = width - 2 * rim - 2 * bezel
  return { rim, bezel, status, screenW, radius: Math.round(width * 0.165) }
}

function StatusBar({ time, h, w, dark }: { time: string; h: number; w: number; dark?: boolean }) {
  const c = dark ? '#ffffff' : '#000000'
  const s = w / 520 // icon scale
  return (
    <div className="relative flex shrink-0 items-center justify-between" style={{ height: h, padding: `0 ${w * 0.085}px 0 ${w * 0.1}px`, color: c, fontFamily: IOS_FONT }}>
      <span style={{ fontSize: 19 * s, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 4 * s }}>{time}</span>
      <span className="flex items-center" style={{ gap: 6 * s, marginTop: 4 * s }}>
        {/* signal */}
        <svg width={19 * s} height={12 * s} viewBox="0 0 19 12" fill={c} aria-hidden>
          <rect x="0" y="8" width="3.2" height="4" rx="1" />
          <rect x="5" y="5.5" width="3.2" height="6.5" rx="1" />
          <rect x="10" y="3" width="3.2" height="9" rx="1" />
          <rect x="15" y="0" width="3.2" height="12" rx="1" />
        </svg>
        {/* wifi */}
        <svg width={17 * s} height={12 * s} viewBox="0 0 17 12" fill={c} aria-hidden>
          <path d="M8.5 2.3c2.3 0 4.4.9 6 2.4l1.2-1.2A10.2 10.2 0 0 0 8.5.6 10.2 10.2 0 0 0 1.3 3.5l1.2 1.2a8.5 8.5 0 0 1 6-2.4Z" />
          <path d="M8.5 5.7c1.4 0 2.6.5 3.6 1.4l1.2-1.2a6.9 6.9 0 0 0-9.6 0l1.2 1.2c1-.9 2.2-1.4 3.6-1.4Z" />
          <path d="M8.5 9c.5 0 1 .2 1.3.5L8.5 11.8 7.2 9.5c.3-.3.8-.5 1.3-.5Z" />
        </svg>
        {/* battery */}
        <svg width={27 * s} height={13 * s} viewBox="0 0 27 13" aria-hidden>
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.6" fill="none" stroke={c} strokeOpacity="0.4" />
          <rect x="2" y="2" width="16" height="9" rx="2.2" fill={c} />
          <path d="M25 4.5v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2Z" fill={c} fillOpacity="0.45" />
        </svg>
      </span>
    </div>
  )
}

/**
 * The device. `children` fill the screen under the status bar.
 * `height` is the outer height; the screen grows to fill it.
 */
export function IPhone({
  width,
  height,
  time = '02:14',
  statusBg = '#ffffff',
  dark = false,
  className = '',
  style,
  children,
}: {
  width: number
  height: number
  time?: string
  statusBg?: string
  dark?: boolean
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const m = phoneMetrics(width)
  const innerR = m.radius - m.rim
  const screenR = innerR - m.bezel
  const btn = (side: 'l' | 'r', top: number, h: number) => (
    <div
      className="absolute"
      style={{
        [side === 'l' ? 'left' : 'right']: -3,
        top: `${top}%`,
        width: 4,
        height: `${h}%`,
        borderRadius: 2,
        background: 'linear-gradient(90deg, #6b707a, #a9aeb6 50%, #5c6069)',
      }}
    />
  )
  return (
    <div className={`relative ${className}`} style={{ width, height, ...style }}>
      {btn('l', 15, 4.2)}
      {btn('l', 22, 8)}
      {btn('l', 32, 8)}
      {btn('r', 25, 12)}
      {/* titanium rim */}
      <div
        className="relative h-full w-full"
        style={{
          borderRadius: m.radius,
          padding: m.rim,
          background: 'linear-gradient(145deg, #c4c8ce 0%, #6d727b 22%, #2b2f36 50%, #7b808a 78%, #d3d6db 100%)',
          boxShadow: '0 60px 110px -40px rgba(6,16,43,0.65), 0 18px 34px -18px rgba(6,16,43,0.5)',
        }}
      >
        {/* bezel */}
        <div className="h-full w-full" style={{ borderRadius: innerR, padding: m.bezel, background: '#050506' }}>
          {/* screen */}
          <div className="relative flex h-full w-full flex-col overflow-hidden" style={{ borderRadius: screenR, background: statusBg }}>
            <StatusBar time={time} h={m.status} w={width} dark={dark} />
            <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
            {/* dynamic island */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bg-black"
              style={{ top: width * 0.022, width: width * 0.29, height: width * 0.083, borderRadius: 999 }}
            />
            {/* home indicator */}
            <div className="absolute bottom-2 left-1/2 h-[5px] -translate-x-1/2 rounded-full bg-black/80" style={{ width: width * 0.34 }} />
            {/* glass: one soft reflection across the screen */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 32%)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* WhatsApp (iOS, light), as the merchant sees a customer's chat. */

const WA_FONT_UI = IOS_FONT

/** WhatsApp's chat wallpaper: warm beige with a faint doodle pattern. */
export const WA_WALLPAPER: CSSProperties = {
  backgroundColor: '#efeae2',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23b9ad9c' stroke-opacity='.28' stroke-width='1.6' stroke-linecap='round'%3E%3Cpath d='M18 22c4-6 12-6 16 0'/%3E%3Ccircle cx='86' cy='20' r='7'/%3E%3Cpath d='M60 58l6 10h-12z'/%3E%3Cpath d='M14 84h14M21 77v14'/%3E%3Cpath d='M92 82c0-6 10-6 10 0s-10 10-10 10'/%3E%3Crect x='44' y='96' width='14' height='10' rx='3'/%3E%3Cpath d='M100 48l4 4 8-8'/%3E%3C/g%3E%3C/svg%3E")`,
  backgroundSize: '120px 120px',
}

export function WaHeader({ name, sub = 'online', w }: { name: string; sub?: string; w: number }) {
  const s = w / 504
  const ink = '#111b21'
  return (
    <div className="flex shrink-0 items-center border-b border-black/10 bg-[#f6f6f6]" style={{ gap: 10 * s, padding: `${8 * s}px ${14 * s}px ${10 * s}px ${8 * s}px`, fontFamily: WA_FONT_UI }}>
      <svg width={13 * s} height={22 * s} viewBox="0 0 13 22" aria-hidden>
        <path d="M11 2 2 11l9 9" fill="none" stroke={ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="grid shrink-0 place-items-center rounded-full font-semibold text-white" style={{ width: 40 * s, height: 40 * s, fontSize: 17 * s, background: 'linear-gradient(135deg,#f5a46b,#e0715b)' }}>
        {name[0]}
      </div>
      <div className="min-w-0 flex-1 leading-tight">
        <div className="truncate font-semibold" style={{ fontSize: 18 * s, color: ink }}>
          {name}
        </div>
        <div style={{ fontSize: 14 * s, color: '#667781' }}>{sub}</div>
      </div>
      {/* video, call */}
      <svg width={26 * s} height={18 * s} viewBox="0 0 26 18" fill="none" stroke={ink} strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
        <rect x="1" y="2" width="16" height="14" rx="3.5" />
        <path d="M17 7.5 24 3.5v11L17 10.5" />
      </svg>
      <svg width={20 * s} height={20 * s} viewBox="0 0 24 24" fill="none" stroke={ink} strokeWidth="1.8" strokeLinejoin="round" aria-hidden style={{ marginLeft: 12 * s }}>
        <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" />
      </svg>
    </div>
  )
}

/** The date pill WhatsApp floats at the top of a day. */
export function WaDay({ label = 'Today', w }: { label?: string; w: number }) {
  const s = w / 504
  return (
    <div className="mx-auto rounded-lg bg-white/90 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]" style={{ padding: `${3 * s}px ${10 * s}px`, fontSize: 13 * s, color: '#54656f', fontFamily: WA_FONT_UI, fontWeight: 500 }}>
      {label}
    </div>
  )
}

/** An outgoing image message: photo, caption, time and read ticks. */
export function WaImage({ src, caption, time, w, imgH }: { src: string; caption: string; time: string; w: number; imgH: number }) {
  const s = w / 504
  return (
    <div className="relative self-end rounded-[10px] bg-[#d9fdd3] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]" style={{ width: w * 0.66, padding: 3 * s, borderTopRightRadius: 0 }}>
      <svg aria-hidden viewBox="0 0 8 13" width={8 * s * 1.3} height={13 * s * 1.3} style={{ position: 'absolute', top: 0, right: -8 * s * 1.3 + 0.5 }}>
        <path fill="#d9fdd3" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1Z" transform="translate(0,-1)" />
      </svg>
      <img src={src} alt="" className="block w-full rounded-[7px] object-cover" style={{ height: imgH, objectPosition: '50% 40%' }} />
      <div className="flex items-end justify-between" style={{ padding: `${5 * s}px ${6 * s}px ${3 * s}px`, fontFamily: WA_FONT_UI, color: '#111b21' }}>
        <span style={{ fontSize: 17 * s, lineHeight: 1.3 }}>{caption}</span>
        <span className="flex shrink-0 items-center" style={{ gap: 3 * s, fontSize: 12 * s, color: '#667781', marginLeft: 8 * s }}>
          {time}
          <svg width={16 * s} height={11 * s} viewBox="0 0 16 11" fill="#53bdeb" aria-hidden>
            <path d="M11.07.65a.46.46 0 0 0-.69.08L4.2 8.36 1.79 6.1a.46.46 0 0 0-.68 0l-.31.31a.45.45 0 0 0 0 .68l3 3a.72.72 0 0 0 1.04-.06l6.65-8.42a.5.5 0 0 0-.08-.67l-.34-.28Z" />
            <path d="M15.07.65a.46.46 0 0 0-.69.08L8.2 8.36l-.73-.69-.62.79 1 1a.72.72 0 0 0 1.04-.06l6.65-8.42a.5.5 0 0 0-.08-.67l-.34-.28Z" />
          </svg>
        </span>
      </div>
    </div>
  )
}
