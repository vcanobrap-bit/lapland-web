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
/** Se invierten sobre la superficie de anclaje, igual que el botón. */
const ARROW_CLASS =
  'border-fog text-ink/60 hover:border-ink hover:text-ink rounded-button [.on-anchor_&]:border-on-anchor/40 [.on-anchor_&]:text-on-anchor/70 [.on-anchor_&]:hover:border-on-anchor [.on-anchor_&]:hover:text-on-anchor flex size-10 items-center justify-center border transition-colors'

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
            <div className="bg-card rounded-card relative aspect-16/9 w-full overflow-hidden md:aspect-21/9">
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
                {slide.title ? (
                  <p className="font-ui text-h4 text-ink [.on-anchor_&]:text-on-anchor">
                    {slide.title}
                  </p>
                ) : null}
                {slide.text ? (
                  <p className="text-body-sm text-ink/70 [.on-anchor_&]:text-on-anchor/70">
                    {slide.text}
                  </p>
                ) : null}
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
            className={ARROW_CLASS}
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
                    position === index
                      ? 'bg-ink [.on-anchor_&]:bg-on-anchor'
                      : 'bg-fog hover:bg-moss [.on-anchor_&]:bg-on-anchor/35',
                  )}
                />
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Slide siguiente"
            className={ARROW_CLASS}
          >
            →
          </button>
        </div>
      ) : null}
    </div>
  )
}
