import { useLayoutEffect, useState, type ReactNode } from 'react'

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export const W = 1920
export const H = 1080

function useFit() {
  const [box, setBox] = useState({ scale: 1, x: 0, y: 0 })
  useLayoutEffect(() => {
    const fit = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const scale = Math.min(vw / W, vh / H)
      setBox({ scale, x: (vw - W * scale) / 2, y: (vh - H * scale) / 2 })
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  return box
}

/**
 * A fixed 1920x1080 canvas scaled to fit the window without cropping.
 * No will-change on the scaled layer: Chrome then re-rasterises text at the
 * final scale, so type stays sharp on a 4K projector.
 */
export function Stage({ bg, children }: { bg: string; children: ReactNode }) {
  const { scale, x, y } = useFit()
  return (
    <div className="fixed inset-0 transition-colors duration-700" style={{ background: bg }}>
      <div
        data-stage
        className="absolute left-0 top-0 overflow-hidden"
        style={{
          width: W,
          height: H,
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        {children}
        {/* paper grain over everything: the stage reads as a printed surface, not a screen */}
        <div className="pointer-events-none absolute inset-0 z-[90] opacity-[0.05] mix-blend-multiply" style={{ backgroundImage: GRAIN }} aria-hidden />
      </div>
    </div>
  )
}
