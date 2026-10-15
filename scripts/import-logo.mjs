/**
 * ---------------------------------------------------------------------------
 *  LOGO IMPORT / OPTIMISER
 * ---------------------------------------------------------------------------
 *  Turns the brand master files in `brand-src/` into the small, optimised
 *  assets the website uses (header/footer logo + favicons).
 *
 *  It NEVER edits the masters — it only writes new derivative files into
 *  `public/logo/` and `public/`.
 *
 *  Usage
 *  -----
 *    npm run import-logo                       # rebuild all logo assets
 *    npm run import-logo -- --src "D:\\Brand"    # use a different masters folder
 *
 *  Masters expected in the source folder:
 *    logo-black.png  logo-cream.png  logo-white.png  logo-gold.png  (transparent lockups)
 *    logo-mark.png   (a square-ish icon card — the favicon source)
 *
 *  The masters are trimmed copies of the original artwork, committed so the
 *  site can be rebuilt without the original Google Drive files.
 * ---------------------------------------------------------------------------
 */
import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdir, access } from 'node:fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

const args = (() => {
  const out = {}
  const argv = process.argv.slice(2)
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--src') out.src = argv[++i]
  }
  return out
})()

const SRC_DIR = args.src ? path.resolve(args.src) : path.join(projectRoot, 'brand-src')
const LOGO_DIR = path.join(projectRoot, 'public', 'logo')
const PUBLIC_DIR = path.join(projectRoot, 'public')

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function master(name) {
  const p = path.join(SRC_DIR, name)
  if (!(await exists(p))) throw new Error(`Missing master file: ${name} (looked in ${SRC_DIR})`)
  return p
}

/**
 * Find the bounding box of the artwork inside an icon image by looking for
 * pixels that differ from the border/background colour, then return a square
 * crop around it (with padding) so the artwork fills the icon legibly.
 */
async function contentSquareCrop(input, { pad = 0.16, threshold = 60 } = {}) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const lumAt = (i) => 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]

  // Background colour ≈ the average luminance of the four corners.
  const corners = [
    (0 * width + 0) * channels,
    (0 * width + (width - 1)) * channels,
    ((height - 1) * width + 0) * channels,
    ((height - 1) * width + (width - 1)) * channels,
  ]
  const bg = corners.reduce((s, i) => s + lumAt(i), 0) / corners.length

  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0
  let found = false
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels
      if (Math.abs(lumAt(i) - bg) > threshold) {
        found = true
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }
  if (!found) return null

  const contentW = maxX - minX + 1
  const contentH = maxY - minY + 1
  const cx = minX + contentW / 2
  const cy = minY + contentH / 2
  const side = Math.round(Math.max(contentW, contentH) * (1 + pad * 2))
  let left = Math.round(cx - side / 2)
  let top = Math.round(cy - side / 2)
  left = Math.max(0, Math.min(left, width - side))
  top = Math.max(0, Math.min(top, height - side))
  const size = Math.min(side, width, height)
  return { left, top, width: size, height: size }
}

async function main() {
  await mkdir(LOGO_DIR, { recursive: true })

  const lockups = [
    ['logo-black.png', 'logo-black.webp'],
    ['logo-cream.png', 'logo-cream.webp'],
    ['logo-white.png', 'logo-white.webp'],
  ]
  for (const [src, out] of lockups) {
    const info = await sharp(await master(src))
      .trim({ threshold: 10 })
      .resize({ width: 640, withoutEnlargement: true })
      .webp({ quality: 90, effort: 5 })
      .toFile(path.join(LOGO_DIR, out))
    console.log(`  ✓ ${src}  →  logo/${out} (${info.width}×${info.height})`)
  }

  // Favicons come from the icon card: crop to the artwork so it reads at 16px.
  const markPath = await master('logo-mark.png')
  const crop = await contentSquareCrop(markPath)
  if (!crop) throw new Error('Could not find any artwork inside logo-mark.png')
  const square = await sharp(markPath).extract(crop).png().toBuffer()

  for (const size of [32, 192, 512]) {
    await sharp(square)
      .resize({ width: size, height: size, fit: 'cover' })
      .png({ compressionLevel: 9 })
      .toFile(path.join(PUBLIC_DIR, `favicon-${size}.png`))
    console.log(`  ✓ logo-mark.png  →  favicon-${size}.png (${size}×${size})`)
  }
  await sharp(square)
    .resize({ width: 180, height: 180, fit: 'cover' })
    .flatten({ background: '#faf7f2' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'))
  console.log('  ✓ logo-mark.png  →  apple-touch-icon.png (180×180)')

  console.log('\nDone. Logo assets written to public/logo and public/.')
}

main().catch((err) => {
  console.error('\n✖ Logo import failed:', err.message)
  process.exitCode = 1
})
