import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { MAP } from '../assets/mapData'
import { Fade, Lines } from '../components/Type'
import { EASE, useReduced } from '../deck/motion'
import type { SceneProps } from '../deck/types'

/*
 * The market, on the map. Morocco is drawn as one territory, Sahara included.
 * 0 how many: merchant dots spread from Casablanca across the real cities → 30K–50K
 * 1 what it is worth: a 145–240M MAD market a year, 38–58M reachable today
 * 2 the region: the map zooms out, MENA and francophone Africa light up
 * Numbers: the pitch deck's bottom-up sizing.
 */

const FW = 1100 // map frame on stage
const FH = 960
const FX = 790
const FY = 60

/** The map "camera": interpolate between the Morocco and region view boxes. */
function lerpBox(t: number) {
  return MAP.vbMorocco.map((a, i) => a + (MAP.vbRegion[i] - a) * t).join(' ')
}
const [cx0, cy0] = [MAP.cities[0].x, MAP.cities[0].y] // Casablanca
const DOTS = MAP.dots
  .map(([x, y]) => ({ x, y, d: Math.hypot(x - cx0, y - cy0) }))
  .sort((a, b) => a.d - b.d)
const maxD = DOTS[DOTS.length - 1].d

/** Projected point → stage pixels for a given viewBox. */
function toStage(x: number, y: number, box: readonly number[]) {
  return { left: FX + ((x - box[0]) / box[2]) * FW, top: FY + ((y - box[1]) / box[3]) * FH }
}

const FILL = {
  base: '#e2e8f0',
  mena: '#1e6bff',
  franco: '#8fb6ff',
}

export default function S11Market({ step }: SceneProps) {
  const reduced = useReduced()
  const region = step >= 2
  const zoom = useMotionValue(region ? 1 : 0)
  const viewBox = useTransform(() => lerpBox(zoom.get()))
  useEffect(() => {
    const c = animate(zoom, region ? 1 : 0, { duration: reduced ? 0 : 2.2, ease: [0.65, 0, 0.35, 1] })
    return () => c.stop()
  }, [region, reduced, zoom])

  return (
    <div className="absolute inset-0 overflow-hidden bg-paper text-ink">
      {/* the map */}
      <div
        className="absolute"
        style={{
          left: FX,
          top: FY,
          width: FW,
          height: FH,
          maskImage: 'radial-gradient(ellipse 72% 70% at 50% 50%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 72% 70% at 50% 50%, #000 60%, transparent 100%)',
        }}
      >
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox={viewBox}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        aria-label="Map of Morocco, including its Sahara"
      >
        <g>
        {MAP.countries.map((c, i) => (
          <motion.path
            key={`${c.id}-${i}`}
            d={c.d}
            vectorEffect="non-scaling-stroke"
            stroke="#f4f7fb"
            strokeWidth={1.2}
            initial={false}
            animate={{ fill: region && c.group !== 'base' ? FILL[c.group] : FILL.base, fillOpacity: region && c.group !== 'base' ? 0.55 : 1 }}
            transition={{ duration: 0.8, delay: region && c.group !== 'base' ? 1.8 + (c.group === 'franco' ? 0.6 : 0) + (i % 7) * 0.08 : 0 }}
          />
        ))}

        {/* Morocco, one territory */}
        <path d={MAP.morocco} fill="#dce8ff" stroke="#1e6bff" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        <motion.path
          d={MAP.morocco}
          fill="#1e6bff"
          initial={false}
          animate={{ fillOpacity: region ? 1 : 0 }}
          transition={{ duration: 0.8, delay: region ? 1.2 : 0 }}
        />

        {/* merchants, spreading out from Casablanca */}
        <g opacity={region ? 0 : 1} style={{ transition: 'opacity .6s' }}>
          {DOTS.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={1.5}
              fill="#1e6bff"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 + (p.d / maxD) * 2.4 }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
          ))}
        </g>

        {/* cities */}
        {MAP.cities.map((c) => (
          <circle key={c.name} cx={c.x} cy={c.y} r={2.6} fill="#0b1324" opacity={region ? 0 : 1} style={{ transition: 'opacity .5s' }} />
        ))}
        </g>
      </motion.svg>
      </div>

      {/* city labels (HTML, so they stay crisp and readable) */}
      {!region &&
        MAP.cities
          .filter((c) => c.label && c.name !== 'Rabat')
          .map((c, i) => {
            const p = toStage(c.x, c.y, MAP.vbMorocco)
            return (
              <motion.div
                key={c.name}
                className="pointer-events-none absolute whitespace-nowrap text-[22px] font-semibold text-ink"
                style={{ left: p.left + 12, top: p.top - 16 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.12 }}
              >
                {c.name}
              </motion.div>
            )
          })}

      {/* region labels */}
      <AnimatePresence>
        {region && (
          <>
            {[
              { t: 'Morocco', x: MAP.cities[0].x - 60, y: MAP.cities[0].y + 120, cls: 'text-white text-[26px]' },
              { t: 'MENA', x: 1500, y: 420, cls: 'text-ink text-[34px]' },
              { t: 'Francophone Africa', x: 560, y: 1050, cls: 'text-ink-2 text-[30px]' },
            ].map((l, i) => {
              const p = toStage(l.x, l.y, MAP.vbRegion)
              return (
                <motion.div
                  key={l.t}
                  className={`pointer-events-none absolute whitespace-nowrap font-bold ${l.cls}`}
                  style={{ left: p.left, top: p.top }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: 2.4 + i * 0.3 }}
                >
                  {l.t}
                </motion.div>
              )
            })}
          </>
        )}
      </AnimatePresence>

      {/* the numbers */}
      <div className="absolute left-[140px] top-[150px] w-[620px]">
        <motion.div
          className="text-[26px] font-semibold text-electric"
          
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          The market
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="count" exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}>
              <Lines k="n" lines={['30K–50K']} className="display mt-4 text-[150px]" delay={1.2} />
              <Fade k="n-l" delay={1.6} className="mt-2 text-[40px] font-semibold leading-tight">
                COD merchants in Morocco
              </Fade>
              <Fade k="n-s" delay={2.2} className="lede mt-8 text-[28px] text-ink-3">
                Our bottom-up estimate, anchored on ~3,544 live YouCan stores plus the sellers who run on ads and WhatsApp alone.
              </Fade>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="value" exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}>
              <Lines k="v" lines={['145–240M MAD']} className="display mt-4 text-[104px]" delay={0.2} />
              <Fade k="v-l" delay={0.6} className="mt-2 text-[38px] font-semibold leading-tight">
                a year, the Moroccan COD market
              </Fade>
              <div className="mt-12 space-y-6">
                {[
                  ['38–58M MAD', 'a year we can reach today', 'text-electric'],
                ].map(([n, l, c], i) => (
                  <motion.div
                    key={n}
                    className="border-t border-line pt-5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 1.2 + i * 0.5 }}
                  >
                    <div className={`text-[56px] font-bold leading-none tracking-[-0.02em] ${c}`}>{n}</div>
                    <div className="mt-2 text-[26px] text-ink-3">{l}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="region" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
              <Lines k="r" lines={['Morocco is', 'the beachhead.']} className="display mt-4 w-[700px] text-[92px]" delay={0.3} />
              <Fade k="r-s" delay={2.6} className="lede mt-8 text-[32px] text-ink-2">
                The same COD-on-WhatsApp playbook carries across MENA and francophone Africa.
              </Fade>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}
