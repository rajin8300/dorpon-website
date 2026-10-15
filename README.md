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

---

## 3. Your photos (important)

Your **original photographs in `D:\Poritflo photos` are never modified.** The import script only
*reads* them and writes new, optimised WebP copies into this project.

What the import produces:

```
public/photos/
├── hero-1280.webp        ← hero background (small screen)
├── hero-1920.webp        ← hero background (large screen)
├── hero.jpg              ← 1200×630 social/Open Graph preview
├── <photo-name>.webp     ← full-size (max 1800px) used by the lightbox
└── thumbs/<photo-name>.webp  ← grid thumbnails (max 1000px), lazy-loaded
src/data/gallery.json     ← the gallery manifest the website reads
```

- Filenames with spaces or Bangla characters are safely converted to plain ASCII slugs.
  Your absolute local path is never written into the website.
- Every image gets a tiny inline blur placeholder so the grid fades in smoothly.

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

### Replace the hero image

The hero automatically uses the **first landscape photo** it finds. To choose a specific one:

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

## 4. Editing business details

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
  },
  videos: [ /* YouTube video ids + labels */ ],
  nav: [ /* navigation links */ ],
}
```

Change a phone number, email, WhatsApp link, the YouTube videos or the nav items there — nowhere else.

### Before you publish: update the public URL

The page title, meta description, favicon and Open Graph tags live in **`index.html`**. Replace the
placeholder `https://example.com/` values (`rel="canonical"`, `og:url`) with your real domain, and
check `og:image` (`/photos/hero.jpg` is generated for you).

---

## 5. Website sections

| Section          | Content                                                              |
| ---------------- | -------------------------------------------------------------------- |
| Header           | Brand wordmark, nav (Home / Portfolio / About / Contact), Contact button, mobile menu |
| Hero             | Label, “Every Frame Tells a Story.”, supporting line, two buttons, full-bleed photo |
| Portfolio        | “Our Selected Works” — masonry gallery with blur-up loading and a keyboard-accessible lightbox |
| Behind the Lens  | Two responsive 16:9 YouTube embeds (privacy-friendly `youtube-nocookie.com`, no autoplay) |
| About            | “A Little About Dorpon” — short and factual                          |
| Contact          | Phone (`tel:`), email (`mailto:`), WhatsApp button, location         |
| Footer           | Brand, location, “Photography & Videography”, dynamic copyright year |

There is **no contact form** — every contact row is a real, working link instead, so nothing can
silently fail to send.

---

## 6. Project structure

```
dorpon-website/
├── index.html                  ← page title, meta description, Open Graph, fonts
├── vite.config.ts
├── tsconfig.json
├── scripts/
│   ├── import-photos.mjs       ← photo optimiser / gallery generator
│   ├── photo-alt.json          ← optional alt-text overrides
│   └── photos.config.json      ← optional source folder + hero override
├── public/
│   ├── favicon.svg
│   └── photos/                 ← generated images (created by the import script)
└── src/
    ├── config/site.ts          ← all business details (edit me)
    ├── data/gallery.ts         ← typed access to the generated manifest
    ├── data/gallery.json       ← generated by the import script
    ├── hooks/useReveal.ts      ← gentle scroll-in animation
    ├── components/
    │   ├── Header.tsx  Hero.tsx  Portfolio.tsx  Lightbox.tsx
    │   ├── Videos.tsx  About.tsx  Contact.tsx  Footer.tsx
    │   ├── SectionIntro.tsx  Icons.tsx
    │   └── ...
    ├── index.css               ← design tokens (colors, fonts, reveal animation)
    ├── App.tsx
    └── main.tsx
```

---

## 7. Design notes

- **Colours & fonts are tokens** in `src/index.css` (`@theme`). Change `--color-cream`, `--color-ink`,
  `--color-sand`, etc. to re-skin the whole site.
- **Typography:** *Hind Siliguri* (supports Bangla + Latin) and *Fraunces* (editorial serif for
  headings), loaded from Google Fonts, with system fallbacks so the site still looks right offline.
- **Accessibility:** semantic landmarks, a skip link, visible focus outlines, `alt` text on every
  photo, labelled iframes and buttons, Escape/arrow-key support in the lightbox, and full
  `prefers-reduced-motion` support.
- **Performance:** lazy-loaded thumbnails, inline blur placeholders, `fetchpriority="high"` on the
  hero, and no unnecessary dependencies (only React + Tailwind).

---

## 8. Publishing the website

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

### GitHub Pages

1. Push the project to a GitHub repository.
2. Build and publish the `dist` folder (for example with the `gh-pages` package), or use
   GitHub Actions with `actions/upload-pages-artifact`.

### After deploying

- Point your own domain (e.g. `dorpon.com`) at the host from its dashboard.
- Update the canonical/OG URL in `index.html` to that domain and redeploy so link previews work.
- Optionally add a `robots.txt` / `sitemap.xml` — nice for a single-page site.

---

## 9. Notes

- The site works fully offline/without a backend.
- The two videos are embedded from YouTube; they need an internet connection to play.
- If `D:\Poritflo photos` is moved or renamed, update `scripts/photos.config.json` or pass
  `--src` to the import command. The generated images already inside `public/photos` keep working
  either way.
