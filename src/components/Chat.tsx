import { motion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'

type Theme = 'light' | 'dark'

const THEME = {
  light: { in: '#ffffff', out: '#d9fdd3', text: '#111b21', time: '#667781' },
  dark: { in: '#202c33', out: '#005c4b', text: '#e9edef', time: '#8696a0' },
}

const isArabic = (s: ReactNode) => typeof s === 'string' && /[؀-ۿ]/.test(s)

/** WhatsApp's own UI font stack (system fonts: nothing to download). */
export const WA_FONT = '"Segoe UI", "Helvetica Neue", Helvetica, "Lucida Grande", Arial, "IBM Plex Sans Arabic", sans-serif'

/*
 * WhatsApp message bubble, built to WhatsApp's own proportions, scaled from its
 * 14.2px base: 7.5px radius, a tail on the first message of a group, the time
 * sitting inline at the bottom-right, the real light and dark colors.
 */
export function Bubble({
  side = 'in',
  theme = 'light',
  time,
  name,
  nameColor,
  children,
  className = '',
  size = 26,
  ticks,
  tail = true,
  style,
  ...rest
}: {
  side?: 'in' | 'out'
  theme?: Theme
  time?: string
  name?: string
  nameColor?: string
  children: ReactNode
  className?: string
  size?: number
  ticks?: boolean
  /** First message in a group gets WhatsApp's corner tail. */
  tail?: boolean
} & HTMLMotionProps<'div'>) {
  const t = THEME[theme]
  const ar = isArabic(children)
  const k = size / 14.2
  const bg = side === 'in' ? t.in : t.out
  const r = 7.5 * k
  // room for the time (and ticks) on the last line, as WhatsApp does
  const spacer = time ? (time.length * 6.4 + (ticks ? 21 : 0) + 6) * k : 0
  return (
    <motion.div
      className={`${className.includes('absolute') ? '' : 'relative'} w-fit max-w-full ${className}`}
      style={{
        background: bg,
        color: t.text,
        borderRadius: r,
        borderTopLeftRadius: tail && side === 'in' ? 0 : r,
        borderTopRightRadius: tail && side === 'out' ? 0 : r,
        padding: `${6 * k}px ${7 * k}px ${8 * k}px ${9 * k}px`,
        fontSize: size,
        lineHeight: 19 / 14.2,
        fontFamily: WA_FONT,
        boxShadow: '0 1px 0.5px rgba(11,20,26,0.13)',
        ...style,
      }}
      {...rest}
    >
      {tail && (
        <svg
          aria-hidden
          viewBox="0 0 8 13"
          width={8 * k}
          height={13 * k}
          style={{ position: 'absolute', top: 0, [side === 'in' ? 'left' : 'right']: -8 * k + 0.5 }}
        >
          <path
            fill={bg}
            d={side === 'in' ? 'M1.533 3.568 8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568Z' : 'M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1Z'}
            transform="translate(0,-1)"
          />
        </svg>
      )}
      {name && (
        <div style={{ color: nameColor, fontSize: 12.8 * k, fontWeight: 600, lineHeight: 22 / 12.8 }}>{name}</div>
      )}
      <div className={ar ? 'ar' : ''} style={{ fontWeight: 400, overflowWrap: 'anywhere' }}>
        {children}
        {time && !ar && <span aria-hidden style={{ display: 'inline-block', width: spacer, height: 1 }} />}
      </div>
      {time && (
        <div
          className="flex items-center whitespace-nowrap"
          style={{
            gap: 3 * k,
            color: t.time,
            fontSize: 11 * k,
            lineHeight: 15 / 11,
            ...(ar ? { justifyContent: 'flex-end', marginTop: 2 * k } : { position: 'absolute', right: 7 * k, bottom: 4 * k }),
          }}
        >
          {time}
          {ticks && <DoubleTick size={16 * k} />}
        </div>
      )}
    </motion.div>
  )
}

/** WhatsApp's read receipt: two blue checks. */
export function DoubleTick({ size = 18, color = '#53bdeb' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={(size * 11) / 16} viewBox="0 0 16 11" fill={color} aria-hidden>
      <path d="M11.07.65a.46.46 0 0 0-.69.08L4.2 8.36 1.79 6.1a.46.46 0 0 0-.68 0l-.31.31a.45.45 0 0 0 0 .68l3 3a.72.72 0 0 0 1.04-.06l6.65-8.42a.5.5 0 0 0-.08-.67l-.34-.28Z" />
      <path d="M15.07.65a.46.46 0 0 0-.69.08L8.2 8.36l-.73-.69-.62.79 1 1a.72.72 0 0 0 1.04-.06l6.65-8.42a.5.5 0 0 0-.08-.67l-.34-.28Z" />
    </svg>
  )
}

/** A simple phone with a WhatsApp light-theme screen. */
export function Phone({
  title,
  subtitle,
  children,
  width = 470,
  height = 900,
  className = '',
}: {
  title: string
  subtitle?: string
  children: ReactNode
  width?: number
  height?: number
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden bg-ink p-[12px] shadow-[0_50px_80px_-40px_rgba(6,16,43,0.55)] ${className}`}
      style={{ width, height, borderRadius: 64 }}
    >
      <div className="relative flex h-full flex-col overflow-hidden" style={{ borderRadius: 52, background: '#efeae2' }}>
        <div className="flex items-center gap-4 bg-white px-7 pb-4 pt-12">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[#dfe5e7] text-[22px] font-semibold text-[#54656f]">
            {title[0]}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[25px] font-semibold text-[#111b21]">{title}</div>
            {subtitle && <div className="text-[19px] text-[#667781]">{subtitle}</div>}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 px-5 py-6">{children}</div>
      </div>
    </div>
  )
}

/** Pointer cursor used to demonstrate a tap. */
export function Cursor({ size = 54 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
      <path d="M5 2.5v17.2l4.6-4.3 3 6.6 3-1.4-3-6.4h6.2L5 2.5z" fill="#0b1324" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}
