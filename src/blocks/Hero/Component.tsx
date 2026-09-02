import type { HeroBlock } from '@/payload-types'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/cn'
import { resolveMedia, toImageSrc } from '@/lib/media'

import { HeroSlider, type HeroSlide } from './HeroSlider'

type HeroProps = HeroBlock & { anchorId: string }

/**
 * Server Component. El título, el subtítulo y el botón no necesitan JavaScript,
 * así que se renderizan en el servidor; al cliente solo baja el slider.
 *
 * El titular usa el rol `display` del design system —Fraunces, el registro de
 * máxima autoridad— reservado justamente para portadas y heros.
 */
export function Hero({ anchorId, cta, slides, subtitle, surface, title }: HeroProps) {
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

  const isAnchor = surface === 'anchor'

  return (
    <section
      id={anchorId}
      className={cn('pt-hero pb-section', isAnchor && 'bg-anchor text-on-anchor on-anchor')}
    >
      <Container className="mb-component">
        <h1 className="font-editorial text-display max-w-4xl text-balance">{title}</h1>

        {subtitle ? (
          <p
            className={cn(
              'text-body-lg mt-6 max-w-2xl text-pretty',
              isAnchor ? 'text-on-anchor/80' : 'text-ink/80',
            )}
          >
            {subtitle}
          </p>
        ) : null}

        {cta?.label && cta.href ? (
          <Button href={cta.href} variant={isAnchor ? 'secondary' : 'primary'} className="mt-10">
            {cta.label}
          </Button>
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
