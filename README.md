# দর্পণ – Dorpon · Portfolio Website

A minimal, premium, single-page portfolio website for **দর্পণ – Dorpon**, a photography and
videography brand based in **Rajbari, Bangladesh**.

Built with **React + Vite + TypeScript + Tailwind CSS v4**. No backend, no database — the whole
site is static and can be hosted anywhere.

---

## 1. Requirements

- [Node.js](https://nodejs.org) 20 or newer (you have v26)
- npm (comes with Node)

Check with:

```bash
node -v
npm -v
```

> On Windows, if `npm` is blocked by a PowerShell execution policy, use `npm.cmd` instead of `npm`,
> or run the commands from Command Prompt / Git Bash.

---

## 2. Run the website locally

```bash
cd C:\Users\E-Learning\Downloads\dorpon-website
npm install          # only needed the first time
npm run dev          # starts the dev server and opens http://localhost:5173
```

Other useful commands:

| Command               | What it does                                                    |
| --------------------- | --------------------------------------------------------------- |
| `npm run dev`         | Dev server with hot reload at http://localhost:5173             |
| `npm run build`       | Type-checks and creates the production site in `dist/`          |
| `npm run preview`     | Serves the built `dist/` locally at http://localhost:4173       |
| `npm run typecheck`   | Runs the TypeScript compiler only (no output)                   |
| `npm run import-photos` | Re-optimises your photos and rebuilds the gallery (see below) |
| `npm run import-logo`   | Rebuilds the logo assets + favicons from `brand-src/` (see below) |

> `npm run dev` serves the site at <http://localhost:5173/>. `npm run preview` serves the production
> build exactly as GitHub Pages will, at <http://localhost:4173/dorpon-website/>.

---

## 3. Your photos (important)

Your **original photographs in `D:\Poritflo photos` are never modified.** The import script only
*reads* them and writes new, optimised WebP copies into this project.

What the import produces:

```
public/photos/
├── hero-1280.webp        ← social/legacy hero (small screen)
├── hero-1920.webp        ← social/legacy hero (large screen)
├── hero.jpg              ← 1200×630 social/Open Graph preview
├── heroes/               ← one hero-sized pair per photo, used by the hero slideshow
│   └── <photo-name>-1280.webp + <photo-name>-1920.webp
├── <photo-name>.webp     ← full-size (max 1800px) used by the lightbox
└── thumbs/<photo-name>.webp  ← grid thumbnails (max 1000px), lazy-loaded
src/data/gallery.json     ← the gallery manifest the website reads
```

- Filenames with spaces or Bangla characters are safely converted to plain ASCII slugs.
  Your absolute local path is never written into the website.
- Every image gets a tiny inline blur placeholder so the grid fades in smoothly.
- The hero slideshow uses **every** photo you import (the `heroes/` images keep each photo's
  original aspect ratio, so nothing is squashed).

### Add more photos later

1. Drop the new JPG/PNG/WebP files into `D:\Poritflo photos` (or any folder).
2. Run:

   ```bash
   npm run import-photos
   ```

   Using a different folder? Pass it in:

   ```bash
   npm run import-photos -- --src "D:\Some\Other Folder"
   ```

3. Reload the site. The new photos appear in the gallery automatically.

To rebuild everything from scratch (e.g. after changing settings):

```bash
npm run import-photos -- --force
```

### The hero slideshow

The top of the page shows an automatic, full-width photo slideshow drawn from **all** the photos you
import — it starts on a random photo, crossfades to the next every 5 seconds, never repeats the same
photo twice in a row, and preloads each upcoming image so transitions never flicker.

You don't need to configure anything: adding or removing photos in `D:\Poritflo photos` and running
`npm run import-photos` updates the slideshow automatically. It is implemented as a reusable
component (`src/components/HeroSlideshow.tsx`), so the timing and behaviour can be tweaked by the
props on `<HeroSlideshow />` in `src/components/Hero.tsx`:

| Prop             | Default | Meaning                                             |
| ---------------- | ------- | --------------------------------------------------- |
| `slides`         | —       | the photos to rotate through                        |
| `intervalMs`     | `5000`  | how long each photo stays on screen                 |
| `fadeMs`         | `1000`  | crossfade duration                                  |
| `showIndicators` | `true`  | show the minimal dot indicators near the bottom     |

Visitors whose device requests **reduced motion** get a single static photo (no auto-advance, no
fade) — they can still step through the photos with the dots.

The `hero-1280/1920.webp` and `hero.jpg` files are still generated and are used for the social/Open
Graph preview image. To force a particular default hero for those, pick one:

```bash
npm run import-photos -- --hero "FB_IMG_1792035421088.jpg"
```

You can also set it permanently in `scripts/photos.config.json`:

```json
{ "src": "D:\\Poritflo photos", "hero": "FB_IMG_1792035421088.jpg" }
```

### Write real descriptions for your photos (alt text)

For accessibility and SEO, each photo has alt text. By default it is neutral
("Photograph 1 from the Dorpon photography portfolio."). Replace it with a short description of
what the photo shows in `scripts/photo-alt.json`, then re-run the import:

```json
{
  "FB_IMG_1792035302547.jpg": "Bride and groom during a golden-hour portrait session in Rajbari.",
  "FB_IMG_1792035421088.jpg": "Wide shot of a riverside ceremony at sunset."
}
```

Keys can be either the original filename or the generated slug.

---

## 4. Your logo (brand assets)

The original logo files are **never modified**. Trimmed master copies live in `brand-src/`, and the
website only ever loads the small, optimised versions in `public/logo/` and `public/`.

Where the logo appears:

| Spot                        | File used               | Why                                                   |
| --------------------------- | ----------------------- | ----------------------------------------------------- |
| Header, top of the page     | `logo-cream.webp`       | the header is transparent over the dark hero          |
| Header, once you scroll     | `logo-black.webp`       | the header turns cream, so the black lockup is used   |
| Mobile menu panel           | `logo-black.webp`       | cream background                                      |
| Footer                      | `logo-black.webp`       | cream background                                      |
| Browser tab / home screen   | `favicon-*.png`, `apple-touch-icon.png` | cropped from the icon mark             |

The header swaps between the cream and black lockups with a short fade, matching the header's existing
colour change. To use a different colour there, change the `src` in `src/components/Header.tsx`.

### Changing the logo later

1. Put your new masters in `brand-src/`, keeping the same file names:

   ```
   brand-src/
   ├── logo-black.png   ← transparent lockup, dark ink (used on light backgrounds)
   ├── logo-cream.png   ← transparent lockup, warm cream (used on dark backgrounds)
   ├── logo-white.png   ← transparent lockup, pure white (spare)
   ├── logo-gold.png    ← transparent lockup, gold (spare)
   └── logo-mark.png    ← square-ish icon card used for the favicon
   ```

2. Rebuild the site assets:

   ```bash
   npm run import-logo
   ```

   Using a different folder? Pass it in: `npm run import-logo -- --src "D:\Brand"`.

3. Rebuild / push. The favicons are generated automatically: the script finds the artwork inside
   `logo-mark.png` and crops a square around it, so the icon stays legible at 16 px.

> The `logo-gold`, `logo-white` and `logo-cream` lockups are generated but only the ones that are
> referenced (`logo-cream`, `logo-black`) end up being requested by the browser.

---

## 5. Editing business details

**All contact details live in one file: `src/config/site.ts`.**

```ts
export const site = {
  brand: { bn: 'দর্পণ', en: 'Dorpon', full: 'দর্পণ – Dorpon' },
  label: 'Photography & Videography',
  location: 'Rajbari, Bangladesh',
  contact: {
    phoneDisplay: '01740-744170',
    phoneHref: 'tel:+8801740744170',
    email: 'rajin8300@gmail.com',
    emailHref: 'mailto:rajin8300@gmail.com',
    whatsapp: 'https://wa.me/8801740744170',
    facebook: 'https://www.facebook.com/dorpon830',
    facebookHandle: '@dorpon830',
    instagram: 'https://www.instagram.com/rajin.830',
    instagramHandle: '@rajin.830',
  },
  videos: [ /* YouTube video ids + labels */ ],
  nav: [ /* navigation links */ ],
}
```

Change a phone number, email, WhatsApp, Facebook or Instagram link, the YouTube videos or the nav
items there — nowhere else.

### The public URL (already filled in)

The page title, meta description, favicon and Open Graph tags live in **`index.html`**. They already
point at the live URL, `https://rajin8300.github.io/dorpon-website/`.

If you later move to a custom domain (e.g. `dorpon.com`) or another host:

1. Update `rel="canonical"`, `og:url`, `og:image` and `twitter:image` in `index.html`.
2. Rebuild with the matching base path (see §9) — `BASE_PATH=/ npm run build` for a domain root.

---

## 6. Website sections

| Section          | Content                                                              |
| ---------------- | -------------------------------------------------------------------- |
| Header           | Logo (cream over the hero, black once scrolled), nav (Home / Portfolio / About / Contact), Contact button, mobile menu |
| Hero             | Full-width automatic photo slideshow (random start, 5s crossfade), label, “Every Frame Tells a Story.”, supporting line, two buttons |
| Portfolio        | “Our Selected Works” — masonry gallery with blur-up loading and a keyboard-accessible lightbox |
| Behind the Lens  | Two responsive 16:9 YouTube embeds (privacy-friendly `youtube-nocookie.com`, no autoplay) |
| About            | “A Little About Dorpon” — short and factual                          |
| Contact          | Phone (`tel:`), email (`mailto:`), Facebook & Instagram profile links, WhatsApp button, location |
| Footer           | Logo, location, “Photography & Videography”, dynamic copyright year |

There is **no contact form** — every contact row is a real, working link instead, so nothing can
silently fail to send.

---

## 7. Project structure

```
dorpon-website/
├── .github/workflows/deploy.yml ← builds & deploys to GitHub Pages
├── index.html                  ← page title, meta description, favicons, Open Graph, fonts
├── vite.config.ts              ← includes the GitHub Pages base path
├── tsconfig.json
├── brand-src/                  ← trimmed logo masters (source for `npm run import-logo`)
├── scripts/
│   ├── import-photos.mjs       ← photo optimiser / gallery generator
│   ├── import-logo.mjs         ← logo optimiser / favicon generator
│   ├── photo-alt.json          ← optional alt-text overrides
│   └── photos.config.json      ← optional source folder + hero override
├── public/
│   ├── favicon-32.png  favicon-192.png  favicon-512.png  apple-touch-icon.png
│   ├── logo/                   ← generated header/footer logos (created by import-logo)
│   ├── robots.txt
│   ├── sitemap.xml
│   └── photos/                 ← generated images (created by the import script)
└── src/
    ├── config/site.ts          ← all business details (edit me)
    ├── data/brand.ts           ← logo asset URLs (base-path aware)
    ├── data/gallery.ts         ← typed access to the generated manifest
    ├── data/gallery.json       ← generated by the import script
    ├── hooks/useReveal.ts      ← gentle scroll-in animation
    ├── components/
    │   ├── Header.tsx  Hero.tsx  HeroSlideshow.tsx  Portfolio.tsx  Lightbox.tsx
    │   ├── Videos.tsx  About.tsx  Contact.tsx  Footer.tsx
    │   ├── SectionIntro.tsx  Icons.tsx
    │   └── ...
    ├── index.css               ← design tokens (colors, fonts, reveal animation)
    ├── App.tsx
    └── main.tsx
```

---

## 8. Design notes

- **Colours & fonts are tokens** in `src/index.css` (`@theme`). Change `--color-cream`, `--color-ink`,
  `--color-sand`, etc. to re-skin the whole site.
- **Typography:** *Hind Siliguri* (supports Bangla + Latin) and *Fraunces* (editorial serif for
  headings), loaded from Google Fonts, with system fallbacks so the site still looks right offline.
- **Accessibility:** semantic landmarks, a skip link, visible focus outlines, `alt` text on every
  photo, a labelled link for the logo, labelled iframes and buttons, Escape/arrow-key support in the
  lightbox, and full `prefers-reduced-motion` support.
- **Performance:** lazy-loaded thumbnails, inline blur placeholders, `fetchpriority="high"` on the
  hero, and no unnecessary dependencies (only React + Tailwind).

---

## 9. Publishing the website

The build output is a plain static folder (`dist/`), so any static host works. Run `npm run build`
first, then pick one:

### Netlify (easiest drag-and-drop)

1. Run `npm run build`.
2. Go to <https://app.netlify.com/drop> and drag the `dist` folder in.
3. (Optional) For automatic deploys, connect the Git repo and set:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Vercel

```bash
npm i -g vercel
vercel          # follow the prompts; Vercel detects Vite automatically
vercel --prod   # deploy to production
```

### Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`

### GitHub Pages — this site is already live ✅

**Live at <https://rajin8300.github.io/dorpon-website/>**

The repository is <https://github.com/rajin8300/dorpon-website>. Deployment is automatic:

- `.github/workflows/deploy.yml` runs on every push to `main`.
- It installs with `npm ci`, runs `npm run build`, and publishes `dist/` with GitHub Pages.
- Pages is configured with **Source: GitHub Actions** (not a branch folder).

To publish a change, just commit and push:

```bash
git add -A
git commit -m "Update site"
git push
```

Then watch the run at <https://github.com/rajin8300/dorpon-website/actions>, or from the terminal:

```bash
gh run watch --repo rajin8300/dorpon-website
```

> **Why is the base path `/dorpon-website/`?** GitHub Pages serves project sites from a sub-path
> (`https://<user>.github.io/<repo>/`). `vite.config.ts` sets `base` to match, so every asset URL
> gets that prefix automatically. Locally, `npm run dev` still works at <http://localhost:5173/>.
>
> If you rename the repository, update `base` in `vite.config.ts` (the `BASE_PATH` constant) **and**
> the URL in `index.html` to match. For a custom domain served from the root, build with
> `BASE_PATH=/ npm run build`.

### After deploying

- Point your own domain (e.g. `dorpon.com`) at the host from its dashboard.
- Update the canonical/OG URL in `index.html` to that domain, rebuild with `BASE_PATH=/`, and
  redeploy so link previews keep working.

---

## 10. Notes

- The site works fully offline/without a backend.
- The two videos are embedded from YouTube; they need an internet connection to play.
- If `D:\Poritflo photos` is moved or renamed, update `scripts/photos.config.json` or pass
  `--src` to the import command. The generated images already inside `public/photos` keep working
  either way.
