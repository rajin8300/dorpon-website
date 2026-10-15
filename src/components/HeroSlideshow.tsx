import { useEffect, useMemo, useState } from 'react'
import type { Slide } from '../data/gallery'

type HeroSlideshowProps = {
  /** Slideshow images. Add or remove entries to change what is shown. */
  slides: Slide[]
  /** How long each photo stays on screen (ms). */
  intervalMs?: number
  /** Crossfade duration (ms). */
  fadeMs?: number
  className?: string
  /** Show minimal dot indicators near the bottom. */
  showIndicators?: boolean
}

/** Fisher–Yates shuffle — returns a new array, never mutates the input. */
function shuffle<T>(array: T[]): T[] {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Full-bleed automatic photo slideshow with a smooth crossfade.
 *
 * - Starts on a randomly selected photo (the order is shuffled once per mount).
 * - Advances on a repeating interval; because every photo appears once per
 *   cycle, consecutive frames are never the same image (when there are ≥ 2).
 * - Preloads the upcoming photo so transitions never flicker.
 * - Images that fail to load are dropped so they cannot stall the show.
 * - When `prefers-reduced-motion: reduce` is set, auto-advance and fades are
 *   disabled; visitors can still step through photos with the indicators.
 */
export default function HeroSlideshow({
  slides,
  intervalMs = 5000,
  fadeMs = 1000,
  className = '',
  showIndicators = true,
}: HeroSlideshowProps) {
  // Shuffle once per unique `slides` list so the show begins on a random photo.
  const order = useMemo(() => shuffle(slides), [slides])

  const [failed, setFailed] = useState<ReadonlySet<string>>(() => new Set<string>())
  // Prime the first photo (and the one after it) so there is no empty first frame.
  const [activated, setActivated] = useState<ReadonlySet<string>>(
    () => new Set(order.slice(0, 2).map((s) => s.key)),
  )
  const [index, setIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Drop any photo whose file could not be loaded, so it never blocks the show.
  const available = useMemo(() => order.filter((s) => !failed.has(s.key)), [order, failed])
  const count = available.length
  const currentIndex = count > 0 ? ((index % count) + count) % count : 0
  const nextIndex = count > 1 ? (currentIndex + 1) % count : -1

  const currentKey = count > 0 ? available[currentIndex].key : undefined
  const nextKey = nextIndex >= 0 ? available[nextIndex].key : undefined

  // Remember which photos have ever been scheduled so their <img> keeps its src
  // (once loaded they stay cached, and the next photo is always preloaded).
  useEffect(() => {
    if (!currentKey) return
    setActivated((prev) => {
      const updated = new Set(prev)
      updated.add(currentKey)
      if (nextKey) updated.add(nextKey)
      return updated
    })
  }, [currentKey, nextKey])

  // Respect the visitor's reduced-motion preference.
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Auto-advance. Cleared on unmount and whenever the interval changes.
  useEffect(() => {
    if (reducedMotion || count < 2) return
    const id = window.setInterval(() => setIndex((i) => i + 1), intervalMs)
    return () => window.clearInterval(id)
  }, [reducedMotion, count, intervalMs])

  if (count === 0) return null

  return (
    <div className={`absolute inset-0 h-full w-full overflow-hidden bg-ink ${className}`}>
      {available.map((slide, i) => {
        const isActive = i === currentIndex
        const hasSrc = activated.has(slide.key)
        return (
          <img
            key={slide.key}
            src={hasSrc ? slide.src1920 : undefined}
            srcSet={hasSrc ? `${slide.src1280} 1280w, ${slide.src1920} 1920w` : undefined}
            sizes="100vw"
            alt={isActive ? slide.alt : ''}
            aria-hidden={isActive ? undefined : true}
            width={slide.width}
            height={slide.height}
            fetchPriority={isActive ? 'high' : 'auto'}
            loading={isActive ? 'eager' : 'lazy'}
            decoding="async"
            onError={() =>
              setFailed((prev) => {
                const updated = new Set(prev)
                updated.add(slide.key)
                return updated
              })
            }
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              transition: reducedMotion ? 'none' : `opacity ${fadeMs}ms ease-in-out`,
              opacity: isActive ? 1 : 0,
            }}
          />
        )
      })}

      {/* Subtle scrim so the heading and buttons stay legible over any photo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/35"
      />

      {showIndicators && count > 1 && (
        <div className="absolute inset-x-0 bottom-5 z-10 flex items-center justify-center gap-1.5 sm:bottom-6 lg:bottom-8">
          {available.map((slide, i) => (
            <button
              key={slide.key}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1} of ${count}`}
              aria-current={i === currentIndex ? 'true' : undefined}
              className="group -m-1.5 rounded-full p-1.5 focus-visible:outline-cream"
            >
              <span
                className={`block h-1.5 w-6 rounded-full transition-colors duration-300 ${
                  i === currentIndex ? 'bg-cream' : 'bg-cream/40 group-hover:bg-cream/70'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
