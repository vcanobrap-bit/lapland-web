import type { HeroBlock } from '@/payload-types'

import { Container } from '@/components/ui/Container'
import { resolveMedia, toImageSrc } from '@/lib/media'

import { HeroSlider, type HeroSlide } from './HeroSlider'

type HeroProps = HeroBlock & { anchorId: string }

/**
 * Server Component. El título, el subtítulo y el botón no necesitan JavaScript,
 * así que se renderizan en el servidor; al cliente solo baja el slider.
 */
export function Hero({ anchorId, cta, slides, subtitle, title }: HeroProps) {
  // Cada slide se reduce a lo que el slider realmente usa: mandar el documento
  // de Media completo infla el payload de RSC sin ningún beneficio.
  const clientSlides: HeroSlide[] = (slides ?? []).flatMap((slide, position) => {
    const image = resolveMedia(slide.image)
    if (!image?.url) return []

    return [
      {
        id: slide.id ?? String(position),
        url: toImageSrc(image.url),
        alt: image.alt,
        width: image.width ?? 1920,
        height: image.height ?? 1080,
        title: slide.title,
        text: slide.text,
      },
    ]
  })

  const hasCta = Boolean(cta?.label && cta.href)

  return (
    <section id={anchorId} className="pt-24 pb-16 md:pt-32">
      <Container className="mb-14">
        <h1 className="text-ink max-w-3xl text-4xl font-medium tracking-tight text-balance md:text-6xl">
          {title}
        </h1>

        {subtitle ? (
          <p className="text-muted mt-6 max-w-2xl text-lg leading-relaxed text-pretty">
            {subtitle}
          </p>
        ) : null}

        {hasCta && cta?.href ? (
          <a
            href={cta.href}
            className="bg-ink mt-10 inline-flex items-center rounded-full px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {cta.label}
          </a>
        ) : null}
      </Container>

      {clientSlides.length > 0 ? (
        <Container>
          <HeroSlider slides={clientSlides} />
        </Container>
      ) : null}
    </section>
  )
}
