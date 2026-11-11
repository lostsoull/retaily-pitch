// Visual QA: node scripts/shoot.mjs <baseUrl> <outDir> [targets...] [--wait=ms] [--scale=1|2] [--reduced]
// targets look like "1.2" (scene.step). Default: every step of every scene.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const args = process.argv.slice(2)
const flags = Object.fromEntries(
  args.filter((a) => a.startsWith('--')).map((a) => {
    const [k, v] = a.slice(2).split('=')
    return [k, v ?? 'true']
  }),
)
const [base, out, ...targets] = args.filter((a) => !a.startsWith('--'))
const wait = Number(flags.wait ?? 3200)
const scale = Number(flags.scale ?? 1)
mkdirSync(out, { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: scale,
  reducedMotion: flags.reduced !== undefined ? 'reduce' : 'no-preference',
})
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

let list = targets
if (!list.length) {
  await page.goto(base)
  await page.waitForTimeout(300)
  // Walk the deck with the keyboard to discover every step.
  list = []
  let prev = ''
  for (let i = 0; i < 200; i++) {
    const h = (await page.evaluate(() => location.hash)).slice(1) || '0'
    if (h === prev) break
    list.push(h.includes('.') ? h : `${h}.0`)
    prev = h
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(60)
  }
}

for (const t of list) {
  await page.goto('about:blank')
  if (flags.from) {
    // Live transition: settle on another state, then switch in place.
    await page.goto(`${base}#${flags.from}`)
    await page.waitForTimeout(2800)
    await page.evaluate((h) => (location.hash = h), t)
  } else {
    await page.goto(`${base}#${t}`)
  }
  await page.waitForTimeout(wait)
  // Clipping check: text nodes that overflow the 1920x1080 stage.
  const clipped = await page.evaluate(() => {
    const stage = document.querySelector('[data-stage]')
    if (!stage) return []
    const sr = stage.getBoundingClientRect()
    const k = sr.width / 1920
    const bad = []
    for (const el of stage.querySelectorAll('*')) {
      if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue
      const r = el.getBoundingClientRect()
      if (r.width === 0 || !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue
      if (r.right > sr.right + 2 || r.left < sr.left - 2 || r.bottom > sr.bottom + 2 || r.top < sr.top - 2)
        bad.push(`${el.textContent.trim().slice(0, 40)} @ ${Math.round((r.left - sr.left) / k)},${Math.round((r.top - sr.top) / k)} ${Math.round(r.width / k)}x${Math.round(r.height / k)}`)
    }
    return bad
  })
  await page.screenshot({ path: `${out}/s${t.replace('.', '-')}.png` })
  console.log(t, clipped.length ? `CLIPPED: ${clipped.join(' | ')}` : 'ok')
}
if (errors.length) console.log('ERRORS:\n' + errors.join('\n'))
await browser.close()
