// Keyboard navigation test: node scripts/navtest.mjs <url>
import { chromium } from 'playwright'

const url = process.argv[2]
const base = url.replace(/#.*$/, '')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
await page.goto(url)
await page.waitForTimeout(500)

const hash = () => page.evaluate(() => location.hash || '#0')
const attr = (n) => page.evaluate((n) => document.querySelector(`[data-${n}]`)?.getAttribute(`data-${n}`), n)
let fails = 0
const expect = async (label, got, want) => {
  const ok = got === want
  if (!ok) fails++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}: ${got}${ok ? '' : ` (want ${want})`}`)
}
const press = async (k, n = 1) => {
  for (let i = 0; i < n; i++) {
    await page.keyboard.press(k)
    await page.waitForTimeout(40)
  }
}

// Running order: 0 title (1 step), 1 cold open (3 steps), 2 growth trap (6), 3 meet,
// 4 plug in, 5-10 features, 11 market, 12 model, 13 traction, 14 competition, 15 go-to-market, 16 close.
await expect('start', await hash(), '#0')
await press('ArrowRight')
await expect('→ walks into scene 1', await hash(), '#1')
await press('ArrowRight')
await expect('→ reveals', await hash(), '#1.1')
await press('Space')
await expect('Space reveals', await hash(), '#1.2')
await press('PageUp')
await expect('PageUp steps back', await hash(), '#1.1')
await press('ArrowRight', 2)
await expect('→ walks into scene 2', await hash(), '#2')
await press('ArrowLeft')
await expect('← lands on last step of scene 1', await hash(), '#1.2')
await press('ArrowLeft')
await expect('← previous scene', await hash(), '#0')
await press('7')
await press('Enter')
await expect('7 + Enter jumps', await hash(), '#7')
await press('1')
await press('5')
await press('Enter')
await expect('15 + Enter jumps', await hash(), '#15')
await press('ArrowRight', 5)
await expect('end clamps', await hash(), '#16.1')
await press('r')
await expect('R restarts', await hash(), '#0')
await press('g')
await expect('G opens overview', await attr('overview'), 'on')
await page.click('button:has-text("3 · Address check")')
await page.waitForTimeout(300)
await expect('overview click jumps', await hash(), '#6')
await expect('overview closes', await attr('overview'), 'off')
const before = await attr('reduced')
await press('m')
await expect('M toggles reduced motion', await attr('reduced'), before === 'on' ? 'off' : 'on')
await page.goto(base + '#8.2')
await page.waitForTimeout(2500)
await page.click('button:has-text("Approve")')
await page.waitForTimeout(200)
await expect('on-stage Approve advances', await hash(), '#8.3')
await page.goto(base + '#2.2')
await page.waitForTimeout(300)
await expect('deep link', await hash(), '#2.2')
await page.mouse.click(640, 360)
await page.waitForTimeout(200)
await expect('click advances', await hash(), '#2.3')

console.log(errors.length ? `PAGE ERRORS:\n${errors.join('\n')}` : 'no page errors')
console.log(fails ? `${fails} FAILED` : 'ALL PASSED')
await browser.close()
process.exit(fails ? 1 : 0)
