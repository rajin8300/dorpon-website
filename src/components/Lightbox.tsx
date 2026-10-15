import { useCallback, useEffect, useRef, useState } from 'react'
import type { Photo } from '../data/gallery'
import { IconArrowLeft, IconArrowRight, IconClose } from './Icons'

interface LightboxProps {
  photos: Photo[]
  /** Index of the open photo, or null when the lightbox is closed. */
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const isOpen = index !== null
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const [loaded, setLoaded] = useState(false)

  const total = photos.length
  const current = isOpen ? photos[index] : null

  const goTo = useCallback(
    (next: number) => onNavigate((next + total) % total),
    [onNavigate, total],
  )

  const handlePrev = useCallback(() => goTo((index ?? 0) - 1), [goTo, index])
  const handleNext = useCallback(() => goTo((index ?? 0) + 1), [goTo, index])

  // Keyboard support + focus management + scroll lock while open.
  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowLeft') handlePrev()
      else if (event.key === 'ArrowRight') handleNext()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused.current?.focus()
    }
  }, [isOpen, onClose, handlePrev, handleNext])

  // Reset the loading state whenever a different photo is shown.
  useEffect(() => {
    setLoaded(false)
  }, [index])

  // Preload the neighbouring images for instant navigation.
  useEffect(() => {
    if (!isOpen || total < 2) return
    const neighbours = [(index + 1) % total, (index - 1 + total) % total]
    neighbours.forEach((i) => {
      const img = new Image()
      img.src = photos[i].src
    })
  }, [isOpen, index, photos, total])

  if (!isOpen || !current) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Image preview: ${current.alt}`}
      tabIndex={-1}
      className="fixed inset-0 z-[60] flex flex-col bg-ink/96 outline-none backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-8">
        <p className="text-[0.7rem] font-medium uppercase tracking-label text-cream/60">
          {index + 1} / {total}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close image preview"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
        >
          <IconClose className="h-6 w-6" />
        </button>
      </div>

      <div
        className="flex flex-1 items-center justify-center px-3 pb-2 sm:px-8"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        <img
          key={current.src}
          src={current.src}
          alt={current.alt}
          onLoad={() => setLoaded(true)}
          style={loaded ? undefined : { backgroundImage: `url(${current.blur})` }}
          className={[
            'max-h-[76svh] w-auto max-w-full bg-cover bg-center object-contain transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        />
      </div>

      <div className="flex items-center justify-between gap-4 px-4 pb-6 pt-2 sm:px-8">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous image"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-cream/85 transition-colors hover:bg-cream/10 hover:text-cream"
        >
          <IconArrowLeft className="h-5 w-5" />
        </button>

        <p className="hidden max-w-xl text-center text-sm text-cream/65 sm:block">{current.alt}</p>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next image"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-cream/85 transition-colors hover:bg-cream/10 hover:text-cream"
        >
          <IconArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
