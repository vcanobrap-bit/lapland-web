import type { CSSProperties } from 'react'
import Image from 'next/image'

import { cn } from '@/lib/cn'

/**
 * Capas del pictograma de la marca (public/brand/personas), recortadas de la
 * pieza original de 975 × 227 px. Posición y tamaño van en % de esa franja,
 * así la composición escala sin moverse.
 *
 * La primera capa es la persona Boreas con su disco. Encima va un "fantasma":
 * una persona gris en su lugar, que entra con las demás y se desvanece cuando
 * la Boreas se enciende (stats.css).
 */
const HIGHLIGHT = { src: 'destacada', x: 0, y: 0, w: 20.41, h: 100, width: 199, height: 227 }

const FIGURES = [
  { src: 'persona-4', x: 6.769, w: 7.487, ghost: true },
  { src: 'persona-2', x: 20.205, w: 7.59 },
  { src: 'persona-3', x: 32.513, w: 7.385 },
  { src: 'persona-4', x: 44.41, w: 7.487 },
  { src: 'persona-5', x: 56.41, w: 7.487 },
  { src: 'persona-6', x: 68.513, w: 7.385 },
  { src: 'persona-7', x: 80.513, w: 7.487 },
  { src: 'persona-8', x: 92.308, w: 7.487 },
]

const FIGURE_TOP = 9.251
const FIGURE_HEIGHT = 87.665

/** Server Component: 1 de cada 8 personas, con el pictograma en acuarela de la marca. */
export function PeoplePictogram() {
  return (
    <div className="people" aria-hidden="true">
      <Image
        className="people__hit"
        src={`/brand/personas/${HIGHLIGHT.src}.webp`}
        alt=""
        width={HIGHLIGHT.width}
        height={HIGHLIGHT.height}
        unoptimized
        style={{
          left: `${HIGHLIGHT.x}%`,
          top: `${HIGHLIGHT.y}%`,
          width: `${HIGHLIGHT.w}%`,
          height: `${HIGHLIGHT.h}%`,
        }}
      />
      {FIGURES.map((figure, index) => (
        <Image
          key={`${figure.src}-${index}`}
          className={cn('people__fig', figure.ghost && 'people__ghost')}
          src={`/brand/personas/${figure.src}.webp`}
          alt=""
          width={73}
          height={199}
          unoptimized
          style={
            {
              left: `${figure.x}%`,
              top: `${FIGURE_TOP}%`,
              width: `${figure.w}%`,
              height: `${FIGURE_HEIGHT}%`,
              '--i': index,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
