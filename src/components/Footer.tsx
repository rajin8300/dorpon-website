import { site } from '../config/site'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-cream py-10 sm:py-12">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <div>
          <p lang="bn" className="text-lg font-semibold tracking-[0.02em] text-ink">
            {site.brand.full}
          </p>
          <p className="mt-1 text-sm text-muted">
            {site.location} · {site.label}
          </p>
        </div>

        <p className="text-sm text-muted">
          &copy; {year} {site.brand.full}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
