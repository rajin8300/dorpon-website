/**
 * ---------------------------------------------------------------------------
 *  PHOTO IMPORT / OPTIMISER
 * ---------------------------------------------------------------------------
 *  Reads your original portfolio photos, creates optimised WebP copies inside
 *  `public/photos`, and writes the gallery manifest used by the website.
 *
 *  It NEVER renames, moves, edits or deletes your original files. It only
 *  reads them and writes new derivative files into this project.
 *
 *  Usage
 *  -----
 *    npm run import-photos                       # uses the default source folder
 *    npm run import-photos -- --src "D:\\My Pics"  # custom source folder
 *    npm run import-photos -- --hero "FB_IMG_1.jpg"  # pick a specific hero image
 *    npm run import-photos -- --force            # rebuild everything from scratch
 *
 *  Optional files (create them next to this script):
 *    - photo-alt.json   : { "<original filename or slug>": "Alt text", ... }
 *    - photos.config.json : { "src": "D:\\Poritflo photos", "hero": "<filename>" }
 * ---------------------------------------------------------------------------
 */

import { readFile, writeFile, mkdir, readdir, rm, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff', '.tif'])
const DEFAULT_SRC = 'D:\\Poritflo photos'

const OUT_DIR = path.join(projectRoot, 'public', 'photos')
const THUMB_DIR = path.join(OUT_DIR, 'thumbs')
const HEROES_DIR = path.join(OUT_DIR, 'heroes')
const MANIFEST_PATH = path.join(projectRoot, 'src', 'data', 'gallery.json')

/* ------------------------------ helpers ------------------------------- */

function parseArgs(argv) {
  const args = { force: false, src: null, hero: null }
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i]
    if (a === '--force') args.force = true
    else if (a === '--src') args.src = argv[++i] ?? null
    else if (a.startsWith('--src=')) args.src = a.slice('--src='.length)
    else if (a === '--hero') args.hero = argv[++i] ?? null
    else if (a.startsWith('--hero=')) args.hero = a.slice('--hero='.length)
  }
  return args
}

async function readJsonIfExists(file) {
  if (!existsSync(file)) return null
  try {
    return JSON.parse(await readFile(file, 'utf8'))
  } catch (err) {
    console.warn(`! Could not parse ${path.basename(file)}: ${err.message}`)
    return null
  }
}

/** djb2 hash -> base36, used as a stable fallback for non-latin filenames. */
function hash(input) {
  let h = 5381
  for (let i = 0; i < input.length; i += 1) h = ((h << 5) + h + input.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

/**
 * Filesystem-safe, ASCII-only slug. Bangla / accented / spaced filenames are
 * safely reduced to a stable slug (never a Windows path).
 */
function slugify(filename) {
  const base = filename.replace(/\.[^.]+$/, '')
  const slug = base
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || `photo-${hash(base)}`
}

/** Natural-ish sort so IMG_2 comes before IMG_10. */
function naturalCompare(a, b) {
  return a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' })
}

async function listSourceImages(srcDir) {
  const entries = await readdir(srcDir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (!entry.isFile()) continue
    const ext = path.extname(entry.name).toLowerCase()
    if (SUPPORTED.has(ext)) files.push(entry.name)
  }
  files.sort(naturalCompare)
  return files
}

/* ------------------------------ main --------------------------------- */

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const fileConfig = (await readJsonIfExists(path.join(__dirname, 'photos.config.json'))) ?? {}
  const srcDir = path.resolve(args.src ?? process.env.PHOTO_SRC ?? fileConfig.src ?? DEFAULT_SRC)

  console.log('Dorpon photo import')
  console.log(`  source : ${srcDir}`)
  console.log(`  output : ${path.relative(projectRoot, OUT_DIR)}`)

  if (!existsSync(srcDir)) {
    console.error('\n✖ Source folder not found.')
    console.error('  Check the path and try again, e.g.:')
    console.error('    npm run import-photos -- --src "D:\\Poritflo photos"')
    process.exitCode = 1
    return
  }

  const files = await listSourceImages(srcDir)
  if (files.length === 0) {
    console.error('\n✖ No supported images (JPG, PNG, WebP) found in that folder.')
    process.exitCode = 1
    return
  }

  const altOverrides = (await readJsonIfExists(path.join(__dirname, 'photo-alt.json'))) ?? {}
  const heroRequest = args.hero ?? fileConfig.hero ?? null

  if (args.force) {
    await rm(OUT_DIR, { recursive: true, force: true })
  }
  await mkdir(THUMB_DIR, { recursive: true })
  await mkdir(HEROES_DIR, { recursive: true })

  /** @type {Array<{slug:string,file:string,src:string,thumb:string,width:number,height:number,blur:string,alt:string,ratio:number}>} */
  const photos = []
  /** @type {Array<{key:string,src1280:string,src1920:string,width:number,height:number,alt:string}>} */
  const slides = []
  const usedSlugs = new Set()

  for (const [index, file] of files.entries()) {
    const abs = path.join(srcDir, file)
    let slug = slugify(file)
    while (usedSlugs.has(slug)) slug = `${slug}-${hash(file)}`
    usedSlugs.add(slug)

    const fullPath = path.join(OUT_DIR, `${slug}.webp`)
    const thumbPath = path.join(THUMB_DIR, `${slug}.webp`)

    const pipeline = () => sharp(abs, { failOn: 'none' }).rotate()

    const fullInfo = await pipeline()
      .resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(fullPath)

    await pipeline()
      .resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 78, effort: 4 })
      .toFile(thumbPath)

    const blurBuffer = await pipeline()
      .resize({ width: 20 })
      .webp({ quality: 35 })
      .toBuffer()

    // Hero-sized variants for the slideshow. We keep the original aspect ratio
    // (fit: 'inside') so each photo's composition is preserved — the browser
    // crops with `object-cover` only as much as the viewport requires.
    await pipeline()
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toFile(path.join(HEROES_DIR, `${slug}-1280.webp`))
    const heroInfo = await pipeline()
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toFile(path.join(HEROES_DIR, `${slug}-1920.webp`))

    const alt =
      altOverrides[file] ??
      altOverrides[slug] ??
      `Photograph ${index + 1} from the Dorpon photography portfolio.`

    photos.push({
      slug,
      file,
      src: `/photos/${slug}.webp`,
      thumb: `/photos/thumbs/${slug}.webp`,
      width: fullInfo.width,
      height: fullInfo.height,
      ratio: Number((fullInfo.width / fullInfo.height).toFixed(4)),
      blur: `data:image/webp;base64,${blurBuffer.toString('base64')}`,
      alt,
    })

    slides.push({
      key: slug,
      src1280: `/photos/heroes/${slug}-1280.webp`,
      src1920: `/photos/heroes/${slug}-1920.webp`,
      width: heroInfo.width,
      height: heroInfo.height,
      alt,
    })

    console.log(`  ✓ ${file}  →  ${slug}.webp (${fullInfo.width}×${fullInfo.height})`)
  }

  /* ---------------------------- hero image ---------------------------- */

  const heroPick =
    (heroRequest && photos.find((p) => p.file === heroRequest || p.slug === slugify(heroRequest))) ||
    photos.find((p) => p.ratio >= 1.25) ||
    photos[0]

  const heroAbs = path.join(srcDir, heroPick.file)
  await sharp(heroAbs, { failOn: 'none' })
    .rotate()
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 80, effort: 4 })
    .toFile(path.join(OUT_DIR, 'hero-1280.webp'))
  const heroInfo = await sharp(heroAbs, { failOn: 'none' })
    .rotate()
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 80, effort: 4 })
    .toFile(path.join(OUT_DIR, 'hero-1920.webp'))
  // 1200×630 JPEG for Open Graph / social previews (universally supported).
  await sharp(heroAbs, { failOn: 'none' })
    .rotate()
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82 })
    .toFile(path.join(OUT_DIR, 'hero.jpg'))

  const hero = {
    slug: heroPick.slug,
    src1280: '/photos/hero-1280.webp',
    src1920: '/photos/hero-1920.webp',
    poster: '/photos/hero.jpg',
    // Intrinsic size of the widest hero image, used for width/height attributes
    // so the browser reserves the correct space before the photo loads.
    width: heroInfo.width,
    height: heroInfo.height,
    alt: altOverrides[heroPick.file] ?? 'Photograph from the Dorpon photography portfolio.',
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    hero,
    slideshow: slides,
    photos: photos.map(({ file: _file, ratio: _ratio, ...rest }) => rest),
  }

  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true })
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

  const totalBytes = (
    await Promise.all(
      [
        ...photos.map((p) => stat(path.join(OUT_DIR, `${p.slug}.webp`))),
        stat(path.join(OUT_DIR, 'hero-1920.webp')),
        ...photos.map((p) => stat(path.join(HEROES_DIR, `${p.slug}-1280.webp`))),
        ...photos.map((p) => stat(path.join(HEROES_DIR, `${p.slug}-1920.webp`))),
      ],
    )
  ).reduce((sum, s) => sum + s.size, 0)

  console.log('\nDone.')
  console.log(`  images  : ${photos.length}`)
  console.log(`  hero    : ${heroPick.file} → hero-1920.webp + hero.jpg`)
  console.log(`  slideshow: ${slides.length} hero-sized images in public/photos/heroes/`)
  console.log(`  manifest: ${path.relative(projectRoot, MANIFEST_PATH)}`)
  console.log(`  total   : ${(totalBytes / 1024 / 1024).toFixed(2)} MB of optimised images`)
  console.log('\nTip: add real captions in scripts/photo-alt.json and re-run for better alt text.')
}

main().catch((err) => {
  console.error('\n✖ Import failed:', err)
  process.exitCode = 1
})
