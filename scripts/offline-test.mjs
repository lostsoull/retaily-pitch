// Offline check: opens dist/index.html over file:// with the network blocked,
// walks every step, and reports any request that tried to leave the machine.
import { chromium } from 'playwright'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const file = pathToFileURL(resolve('dist/index.html')).href
const out = process.argv[2]
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, offline: true })
const page = await ctx.newPage()
const external = []
const errors = []
await ctx.route('**/*', (route) => {
  const u = route.request().url()
  if (u.startsWith('file:') || u.startsWith('data:') || u.startsWith('blob:')) return route.continue()
  external.push(u)
  return route.abort()
})
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

await page.goto(file)
await page.waitForTimeout(1500)
const fonts = await page.evaluate(async () => {
  await document.fonts.ready
  return [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family)
})
console.log('fonts loaded:', [...new Set(fonts)].join(', ') || 'NONE')

let steps = 0
let prev = ''
for (let i = 0; i < 100; i++) {
  const h = await page.evaluate(() => location.hash)
  if (h === prev) break
  prev = h
  steps++
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(250)
}
console.log('steps walked:', steps, 'final:', prev)
if (out) {
  await page.goto(file + '#5.3')
  await page.waitForTimeout(3500)
  await page.screenshot({ path: `${out}/offline-5-3.png` })
  await page.goto(file + '#1.3')
  await page.waitForTimeout(4000)
  await page.screenshot({ path: `${out}/offline-1-3.png` })
}
console.log(external.length ? `EXTERNAL REQUESTS:\n${external.join('\n')}` : 'no external requests')
console.log(errors.length ? `ERRORS:\n${errors.join('\n')}` : 'no errors')
await browser.close()
