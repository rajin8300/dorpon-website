import { site } from '../config/site'
import { hero } from '../data/gallery'

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-[92svh] items-end overflow-hidden bg-ink">
      {/* Main visual — the first landscape portfolio photograph */}
      <img
        src={hero.src1920}
        srcSet={`${hero.src1280} 1280w, ${hero.src1920} 1920w`}
        sizes="100vw"
        alt={hero.alt}
        width={hero.width}
        height={hero.height}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Subtle scrim so the text stays legible over any photograph */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/35"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-16 pt-32 sm:px-8 sm:pb-20 md:pb-24 lg:px-12 lg:pb-28">
        <p className="mb-6 text-[0.68rem] font-medium uppercase tracking-label text-cream/75 sm:text-[0.72rem]">
          {site.label} &middot; Rajbari
        </p>

        <h1 className="max-w-3xl font-display text-[2.5rem] font-normal leading-[1.06] tracking-[-0.02em] text-cream sm:text-6xl lg:text-[4.5rem]">
          Every Frame Tells a Story.
        </h1>

        <p className="mt-7 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
          Capturing meaningful moments through photography and cinematic storytelling.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <a
            href="#portfolio"
            className="inline-flex items-center justify-center rounded-full bg-cream px-7 py-3.5 text-[0.75rem] font-medium uppercase tracking-label text-ink transition-transform duration-300 hover:-translate-y-0.5"
          >
            Explore Our Work
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full border border-cream/50 px-7 py-3.5 text-[0.75rem] font-medium uppercase tracking-label text-cream transition-colors duration-300 hover:bg-cream hover:text-ink"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  )
}
