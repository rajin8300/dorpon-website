/**
 * Brand asset URLs. Photo/logo files live in `public/` and are copied as-is,
 * so we prefix them with the deploy base path (see src/data/gallery.ts).
 */
const BASE = import.meta.env.BASE_URL

const asset = (path: string) => `${BASE}${path.replace(/^\/+/, '')}`

export const brandAssets = {
  /** Black lockup — for light (cream) backgrounds. */
  logoBlack: asset('/logo/logo-black.webp'),
  /** Cream lockup — for dark backgrounds (e.g. the header over the hero). */
  logoCream: asset('/logo/logo-cream.webp'),
  /** White lockup — alternative for dark backgrounds. */
  logoWhite: asset('/logo/logo-white.webp'),
}
