import type { CSSProperties, ReactNode } from 'react'

function tornPolygon(tear: number, teeth = 28) {
  const pts: string[] = ['0% 0%', '100% 0%']
  for (let i = teeth; i >= 0; i--) {
    pts.push(`${(i / teeth) * 100}% ${i % 2 === 0 ? `calc(100% - ${tear}px)` : '100%'}`)
  }
  return `polygon(${pts.join(',')})`
}

/**
 * Thermal-paper slip with a torn zigzag foot. The paper shape lives in a
 * background layer, so the content is never clipped (cells can fall out of it)
 * and the drop-shadow follows the torn edge.
 */
export function Paper({
  children,
  className = '',
  style,
  tear = 14,
  shadow = '0 26px 34px rgba(6,16,43,0.16)',
}: {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  tear?: number
  shadow?: string
}) {
  const [x, y, b, c] = shadow.split(/\s(?![^(]*\))/)
  return (
    <div className={`relative font-mono text-ink ${className}`} style={{ paddingBottom: tear + 8, ...style }}>
      <div className="absolute inset-0" style={{ filter: `drop-shadow(${x} ${y} ${b} ${c})` }} aria-hidden>
        <div
          className="h-full w-full"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fbfaf7 70%, #f6f5f1 100%)',
            clipPath: tornPolygon(tear),
          }}
        />
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}

export function Dashes({ className = '' }: { className?: string }) {
  return <div className={`h-0 border-t-[3px] border-dashed border-line ${className}`} />
}

export function Row({
  label,
  value,
  className = '',
  style,
}: {
  label: ReactNode
  value: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={`flex items-baseline justify-between gap-6 tabular ${className}`} style={style}>
      <span>{label}</span>
      <span className="shrink-0">{value}</span>
    </div>
  )
}
