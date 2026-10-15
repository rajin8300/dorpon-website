import { site } from '../config/site'

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-20 sm:py-28 lg:py-36">
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12">
        <div className="reveal lg:col-span-5">
          <p className="mb-4 text-[0.68rem] font-medium uppercase tracking-label text-sand">About</p>
          <h2
            id="about-title"
            className="font-display text-[1.75rem] font-normal leading-[1.15] tracking-[-0.01em] text-ink sm:text-4xl lg:text-[2.75rem]"
          >
            A Little About Dorpon
          </h2>
        </div>

        <div className="reveal lg:col-span-7 lg:pt-2">
          <p className="text-lg leading-relaxed text-ink-soft sm:text-xl sm:leading-relaxed">
            <span lang="bn" className="text-ink">
              {site.brand.full}
            </span>{' '}
            is a photography and videography brand based in Rajbari, Bangladesh. We focus on capturing
            meaningful moments and turning them into timeless visual stories.
          </p>
        </div>
      </div>
    </section>
  )
}
