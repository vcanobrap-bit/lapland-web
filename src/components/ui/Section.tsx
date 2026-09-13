import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/cn'

export type SurfaceKind = 'primary' | 'anchor'

type SectionProps = {
  children: React.ReactNode
  className?: string
  /** Ancla para los enlaces internos del sitio. */
  id?: string
  surface?: SurfaceKind | null
  width?: 'default' | 'narrow'
}

/**
 * Ritmo vertical del sitio.
 *
 * Usa el token que el sistema describe como "padding vertical de secciones"
 * (64px). Dos secciones contiguas suman 128px de aire, que es la separación
 * editorial que el sistema busca y la misma medida del padding del hero.
 *
 * La separación entre secciones la da el aire, no un cambio de fondo: el
 * sistema es explícito en que el off-white es la superficie protagonista y el
 * verde noche un recurso de anclaje puntual.
 */
export function Section({ children, className, id, surface = 'primary', width }: SectionProps) {
  const isAnchor = surface === 'anchor'

  return (
    <section
      id={id}
      className={cn(
        'py-section',
        // `on-anchor` invierte el color del foco visible sobre fondo oscuro.
        isAnchor && 'bg-anchor text-on-anchor on-anchor',
        className,
      )}
    >
      <Container width={width}>{children}</Container>
    </section>
  )
}
