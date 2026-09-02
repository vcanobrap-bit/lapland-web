import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/cn'

type SectionProps = {
  children: React.ReactNode
  className?: string
  /** Ancla para los enlaces internos del sitio. */
  id?: string
  tone?: 'default' | 'subtle'
  width?: 'default' | 'narrow'
}

/** Ritmo vertical del sitio. Una sola definición del "mucho espacio en blanco". */
export function Section({ children, className, id, tone = 'default', width }: SectionProps) {
  return (
    <section id={id} className={cn('py-20 md:py-28', tone === 'subtle' && 'bg-subtle', className)}>
      <Container width={width}>{children}</Container>
    </section>
  )
}
