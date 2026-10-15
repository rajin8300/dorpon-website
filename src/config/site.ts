/**
 * ---------------------------------------------------------------------------
 *  SITE CONFIGURATION  —  edit this file to update brand & contact details.
 * ---------------------------------------------------------------------------
 *  Everything the visitor sees about the business (name, phone, email,
 *  location, WhatsApp link, video embeds) lives here so there is only one
 *  place to update it.
 *
 *  NOTE: When you publish the site you should also update the public URL and
 *  Open Graph tags inside `index.html` (title, description, og:url, og:image).
 * ---------------------------------------------------------------------------
 */

export const site = {
  brand: {
    /** Brand name in Bangla. */
    bn: 'দর্পণ',
    /** Brand name in English. */
    en: 'Dorpon',
    /** Full wordmark used in the header and footer. */
    full: 'দর্পণ – Dorpon',
  },

  /** Short business label used in small caps. */
  label: 'Photography & Videography',
  /** Location shown in the hero eyebrow and contact section. */
  location: 'Rajbari, Bangladesh',

  contact: {
    /** Human-readable phone number. */
    phoneDisplay: '01740-744170',
    /** Clickable tel: link (international format works on mobile). */
    phoneHref: 'tel:+8801740744170',
    /** Email address. */
    email: 'rajin8300@gmail.com',
    /** Clickable mailto: link. */
    emailHref: 'mailto:rajin8300@gmail.com',
    /** WhatsApp deep link using the international number without "+" or spaces. */
    whatsapp: 'https://wa.me/8801740744170',
    /** Facebook page URL. */
    facebook: 'https://www.facebook.com/dorpon830',
    /** Facebook handle shown in the contact section. */
    facebookHandle: '@dorpon830',
    /** Instagram profile URL. */
    instagram: 'https://www.instagram.com/rajin.830',
    /** Instagram handle shown in the contact section. */
    instagramHandle: '@rajin.830',
  },

  /** The two YouTube videos shown in the "Behind the Lens" section. */
  videos: [
    {
      id: 'jSOv5qngcmE',
      /** Neutral, factual label. Replace with a real title if you have one. */
      title: 'Dorpon — Film 01',
    },
    {
      id: 'DwekfgRtHe8',
      title: 'Dorpon — Film 02',
    },
  ],

  /** Navigation links for the single-page layout. */
  nav: [
    { label: 'Home', href: '#home' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
} as const

export type SiteVideo = (typeof site.videos)[number]
