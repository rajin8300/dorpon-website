import sharp from 'sharp'
import path from 'node:path'

const DIR = 'C:\\Users\\E-Learning\\AppData\\Local\\Temp\\opencode\\dorpon-logo\\preview'
const load = (f) => sharp(path.join(DIR, f))

const topMeta = await load('shot-top.png').metadata()
const midMeta = await load('shot-mid.png').metadata()
const botMeta = await load('shot-bottom.png').metadata()

const W = topMeta.width
const HEADH = 120
const FOOTH = 260

const strips = [
  { file: 'shot-top.png', top: 0, height: HEADH, label: 'Header - top of page (over the hero)' },
  { file: 'shot-mid.png', top: 0, height: HEADH, label: 'Header - after scrolling (cream background)' },
  { file: 'shot-bottom.png', top: botMeta.height - FOOTH, height: FOOTH, label: 'Footer' },
]

const LABEL_H = 34
const GAP = 14
const totalH = strips.reduce((s, r) => s + r.height + LABEL_H + GAP, 0) + 10

const composites = [{ input: { create: { width: W, height: totalH, channels: 4, background: '#d9d9d9' } }, left: 0, top: 0 }]

let y = 10
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${totalH}">`
for (const s of strips) {
  const crop = await load(s.file).extract({ left: 0, top: s.top, width: W, height: s.height }).toBuffer()
  composites.push({ input: crop, left: 0, top: y + LABEL_H })
  svg += `<text x="14" y="${y + 24}" font-family="Segoe UI, Arial" font-size="17" font-weight="600" fill="#1b1916">${s.label}</text>`
  y += s.height + LABEL_H + GAP
}
svg += '</svg>'
composites.push({ input: Buffer.from(svg), left: 0, top: 0 })

const out = path.join(DIR, 'site-logo-review.png')
await sharp({ create: { width: W, height: totalH, channels: 4, background: '#d9d9d9' } })
  .composite(composites)
  .png()
  .toFile(out)
console.log(out, `(${W}x${totalH})`)
