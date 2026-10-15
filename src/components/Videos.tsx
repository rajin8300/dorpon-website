import { site } from '../config/site'
import SectionIntro from './SectionIntro'

/**
 * Builds a privacy-conscious YouTube embed URL (youtube-nocookie.com).
 * Autoplay stays off — the visitor presses play.
 */
function embedUrl(id: string) {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  })
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`
}

export default function Videos() {
  return (
    <section
      id="videos"
      aria-labelledby="videos-title"
      className="border-y border-line bg-cream-deep py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionIntro
          eyebrow="Film"
          title="Behind the Lens"
          titleId="videos-title"
          description="Watch our stories come to life."
        />

        <div className="reveal mt-14 grid gap-6 sm:mt-16 lg:grid-cols-2 lg:gap-8">
          {site.videos.map((video) => (
            <figure key={video.id}>
              <div className="relative aspect-video w-full overflow-hidden bg-ink/5">
                <iframe
                  src={embedUrl(video.id)}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
              <figcaption className="mt-3 text-[0.7rem] font-medium uppercase tracking-label text-muted">
                {video.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
