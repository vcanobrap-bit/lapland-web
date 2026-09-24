import Image from 'next/image'
import Link from 'next/link'

import type { HeroBlock, Media } from '@/payload-types'

import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/cn'
import { resolveMedia, toImageSrc } from '@/lib/media'

import { AuroraCanvas } from './AuroraCanvas'
import { HeroParallax } from './HeroParallax'

type HeroProps = HeroBlock & { anchorId: string }

/** Entrada escalonada: cada línea del titular, y después el resto. */
const FIRST_LINE_MS = 200
const LINE_STEP_MS = 160

/** El punto de enfoque de la imagen, cargado en el admin, decide el encuadre. */
const focalPosition = (media: Media) => `${media.focalX ?? 50}% ${media.focalY ?? 50}%`

/** Separa la palabra destacada de su línea, sin distinguir mayúsculas. */
const splitHighlight = (line: string, highlight: string) => {
  const start = line.toLocaleLowerCase('es').indexOf(highlight.toLocaleLowerCase('es'))
  if (start === -1) return null
  const end = start + highlight.length
  return { before: line.slice(0, start), match: line.slice(start, end), after: line.slice(end) }
}

/**
 * Trazo a mano bajo la palabra destacada, en los tonos claros de Verde, Teal y
 * Boreas. Se dibuja por CSS después de la entrada y el degradado deriva lento.
 */
function AuroraStroke({ id }: { id: string }) {
  return (
    <svg
      className="hero__stroke"
      viewBox="0 0 300 20"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--lap-brand-verde-mid)' }} />
          <stop offset="0.5" style={{ stopColor: 'var(--lap-brand-teal-mid)' }} />
          <stop offset="1" style={{ stopColor: 'var(--lap-brand-boreas-mid)' }} />
          <animate attributeName="x1" values="0;-0.35;0" dur="11s" repeatCount="indefinite" />
          <animate attributeName="x2" values="1;0.65;1" dur="11s" repeatCount="indefinite" />
        </linearGradient>
      </defs>
      <path
        d="M3 12 C 50 6, 95 15, 150 10 S 250 5, 297 9"
        pathLength={1}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={3}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function Arrow({ direction }: { direction: 'right' | 'down' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={direction === 'right' ? 'M1 8h13M9 3l5 5-5 5' : 'M8 1v13M3 9l5 5 5-5'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Server Component. El texto, los botones y las imágenes se renderizan en el
 * servidor; al cliente solo bajan la aurora (WebGL) y el desplazamiento con el
 * puntero.
 *
 * La escena son tres capas: fondo, aurora y primer plano recortado. Con primer
 * plano, la aurora pasa por detrás de las montañas; sin él, se posa sobre la
 * foto. Sin foto, queda la aurora sobre el degradado de la marca.
 *
 * `data-hero-overlay` le indica al encabezado que flote transparente encima.
 */
export function Hero({
  anchorId,
  aurora,
  background,
  cta,
  foreground,
  highlight,
  secondaryCta,
  subtitle,
  title,
}: HeroProps) {
  const backgroundMedia = resolveMedia(background)
  const foregroundMedia = resolveMedia(foreground)
  // Ambas capas comparten encuadre: si no, las montañas recortadas no calzan.
  const objectPosition = backgroundMedia ? focalPosition(backgroundMedia) : undefined

  const lines = title
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const word = highlight?.trim()
  const afterTitleMs = FIRST_LINE_MS + lines.length * LINE_STEP_MS + 100

  const hasCta = Boolean(cta?.label && cta.href)
  const hasSecondary = Boolean(secondaryCta?.label && secondaryCta.href)
  // La flecha apunta hacia donde lleva: abajo si es una sección de la página.
  const secondaryIsAnchor = secondaryCta?.href?.startsWith('#') ?? false

  return (
    <section id={anchorId} className="hero" data-hero-overlay>
      {/* Decorativa: el mensaje está en el texto, no en la foto. */}
      <HeroParallax className="hero__media">
        <div className="hero__scene">
          {backgroundMedia?.url ? (
            <Image
              src={toImageSrc(backgroundMedia.url)}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition }}
            />
          ) : null}

          {aurora !== false ? <AuroraCanvas className="hero__aurora" /> : null}

          {foregroundMedia?.url ? (
            <Image
              src={toImageSrc(foregroundMedia.url)}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition }}
            />
          ) : null}
        </div>
      </HeroParallax>
      <div className="hero__veil" aria-hidden="true" />

      <Container className="text-center">
        <h1 className="hero__title">
          {lines.map((line, index) => {
            const parts = word ? splitHighlight(line, word) : null

            return (
              <span key={index} className={cn('hero__line', parts && 'hero__line--marked')}>
                <span style={{ animationDelay: `${FIRST_LINE_MS + index * LINE_STEP_MS}ms` }}>
                  {parts ? (
                    <>
                      {parts.before}
                      <em className="hero__mark">
                        {parts.match}
                        <AuroraStroke id={`${anchorId}-trazo-${index}`} />
                      </em>
                      {parts.after}
                    </>
                  ) : (
                    line
                  )}
                </span>
              </span>
            )
          })}
        </h1>

        {subtitle ? (
          <p className="hero__lede hero__reveal" style={{ animationDelay: `${afterTitleMs}ms` }}>
            {subtitle}
          </p>
        ) : null}

        {hasCta || hasSecondary ? (
          <div
            className="hero__actions hero__reveal"
            style={{ animationDelay: `${afterTitleMs + 180}ms` }}
          >
            {hasCta && cta?.href ? (
              <Link href={cta.href} className="hero-cta">
                {cta.label}
                <span className="hero-cta__icon" aria-hidden="true">
                  <Arrow direction="right" />
                </span>
              </Link>
            ) : null}

            {hasSecondary && secondaryCta?.href ? (
              <Link
                href={secondaryCta.href}
                className={cn('hero-link', !secondaryIsAnchor && 'hero-link--forward')}
              >
                {secondaryCta.label}
                <Arrow direction={secondaryIsAnchor ? 'down' : 'right'} />
              </Link>
            ) : null}
          </div>
        ) : null}
      </Container>
    </section>
  )
}
