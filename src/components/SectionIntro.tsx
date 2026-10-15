interface SectionIntroProps {
  /** Optional small label shown above the title. */
  eyebrow?: string
  title: string
  /** id applied to the <h2> so sections can be labelled by their heading. */
  titleId?: string
  description?: string
  align?: 'left' | 'center'
}

/**
 * Shared heading block used by the Portfolio, Video, About and Contact
 * sections so spacing and typography stay consistent.
 */
export default function SectionIntro({
  eyebrow,
  title,
  titleId,
  description,
  align = 'left',
}: SectionIntroProps) {
  const centered = align === 'center'

  return (
    <div className={`reveal max-w-2xl ${centered ? 'mx-auto text-center' : ''}`}>
      {eyebrow ? (
        <p className="mb-4 text-[0.68rem] font-medium uppercase tracking-label text-sand">{eyebrow}</p>
      ) : null}
      <h2
        id={titleId}
        className="font-display text-[1.75rem] font-normal leading-[1.15] tracking-[-0.01em] text-ink sm:text-4xl lg:text-[2.75rem]"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-[1.0625rem]">{description}</p>
      ) : null}
    </div>
  )
}
