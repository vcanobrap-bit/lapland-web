'use client'

import Image from 'next/image'

import { useCarousel } from '@/hooks/useCarousel'
import { cn } from '@/lib/cn'

/**
 * Forma mínima que necesita el slider. El Server Component la arma a partir de
 * los documentos de Media para no mandar al cliente campos que no se usan.
 */
export type HeroSlide = {
  id: string
  url: string
  alt: string
  width: number
  height: number
  title?: string | null
  text?: string | null
}

/**
 * Client Component: es el único punto del hero que necesita estado.
 *
 * La pista es un contenedor con scroll-snap, así que funciona sin JavaScript
 * —scroll nativo y swipe en móvil— y la hidratación solo agrega autoplay,
 * flechas e indicadores.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const { goTo, index, setIsPaused, trackRef } = useCarousel({ count: slides.length })
  const hasControls = slides.length > 1

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      aria-roledescription="carrusel"
    >
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, position) => (
          <figure
            key={slide.id}
            className="relative w-full shrink-0 snap-center"
            aria-roledescription="slide"
            aria-label={`${position + 1} de ${slides.length}`}
          >
            <div className="bg-subtle relative aspect-16/9 w-full overflow-hidden md:aspect-21/9">
              <Image
                alt={slide.alt}
                src={slide.url}
                fill
                sizes="100vw"
                priority={position === 0}
                className="object-cover"
              />
            </div>

            {slide.title || slide.text ? (
              <figcaption className="mt-4 space-y-1">
                {slide.title ? <p className="text-ink font-medium">{slide.title}</p> : null}
                {slide.text ? <p className="text-muted text-sm">{slide.text}</p> : null}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      {hasControls ? (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Slide anterior"
            className="border-line text-muted hover:border-ink hover:text-ink flex size-9 items-center justify-center rounded-full border transition-colors"
          >
            ←
          </button>

          <ul className="flex items-center gap-2">
            {slides.map((slide, position) => (
              <li key={slide.id}>
                <button
                  type="button"
                  onClick={() => goTo(position)}
                  aria-label={`Ir al slide ${position + 1}`}
                  aria-current={position === index}
                  className={cn(
                    'block size-2 rounded-full transition-colors',
                    position === index ? 'bg-ink' : 'bg-line hover:bg-muted',
                  )}
                />
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Slide siguiente"
            className="border-line text-muted hover:border-ink hover:text-ink flex size-9 items-center justify-center rounded-full border transition-colors"
          >
            →
          </button>
        </div>
      ) : null}
    </div>
  )
}
