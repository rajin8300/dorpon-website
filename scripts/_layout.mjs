import sharp from 'sharp'
import path from 'node:path'

const p = path.resolve('brand-src/logo-black.png')
const { data, info } = await sharp(p).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info
const GX = 12, GY = 6
const cov = Array.from({ length: GY }, () => Array(GX).fill(0))
const cnt = Array.from({ length: GY }, () => Array(GX).fill(0))
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels
    const gx = Math.min(GX - 1, Math.floor((x / width) * GX))
    const gy = Math.min(GY - 1, Math.floor((y / height) * GY))
    cnt[gy][gx]++
    if (data[i + 3] > 128) cov[gy][gx]++
  }
}
console.log('ink coverage grid (12x6), each cell 0-9:')
for (let gy = 0; gy < GY; gy++) {
  console.log(cov[gy].map((c, gx) => Math.round((c / cnt[gy][gx]) * 9)).join(' '))
}

// column profile (24 buckets) to see horizontal structure
const cols = 24
const colCov = Array(cols).fill(0)
const colCnt = Array(cols).fill(0)
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels
    const c = Math.min(cols - 1, Math.floor((x / width) * cols))
    colCnt[c]++
    if (data[i + 3] > 128) colCov[c]++
  }
}
console.log('column ink profile (24 buckets):')
console.log(colCov.map((c, i) => Math.round((c / colCnt[i]) * 9)).join(' '))
