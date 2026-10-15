import { useState } from 'react'
import { photos } from '../data/gallery'
import type { Photo } from '../data/gallery'
import Lightbox from './Lightbox'
import SectionIntro from './SectionIntro'

interface PhotoTileProps {
  photo: Photo
  index: number
  onOpen: () => void
}

function PhotoTile({ photo, index, onOpen }: PhotoTileProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <figure
      className="reveal mb-4 break-inside-avoid sm:mb-5"
      // Gentle stagger so a column of photos doesn't pop in all at once.
      style={{ transitionDelay: `${Math.min(index, 5) * 70}ms` }}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View larger image: ${photo.alt}`}
        className="group relative block w-full cursor-zoom-in overflow-hidden"
      >
        {/* Tiny inline WebP stretched as a blur-up placeholder */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${photo.blur})` }}
        />
        <img
          src={photo.thumb}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={[
            'relative block h-auto w-full object-cover transition-[opacity,transform] duration-700 ease-out',
            'group-hover:scale-[1.03] group-focus-visible:scale-[1.03]',
            loaded ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10"
        />
      </button>
    </figure>
  )
}

export default function Portfolio() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="py-20 sm:py-28 lg:py-36">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionIntro
          eyebrow="Portfolio"
          title="Our Selected Works"
          titleId="portfolio-title"
          description="A collection of moments, stories, and memories captured through our lens."
        />

        {/* Masonry-inspired column layout — each photo keeps its own aspect ratio. */}
        <div className="mt-14 columns-1 gap-4 sm:mt-16 sm:columns-2 sm:gap-5 lg:columns-3">
          {photos.map((photo, index) => (
            <PhotoTile key={photo.slug} photo={photo} index={index} onOpen={() => setActiveIndex(index)} />
          ))}
        </div>
      </div>

      <Lightbox
        photos={photos}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </section>
  )
}
