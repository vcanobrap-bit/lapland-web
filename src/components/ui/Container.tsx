import { cn } from '@/lib/cn'

type ContainerProps = {
  children: React.ReactNode
  className?: string
  /** `narrow` para bloques de texto largo, donde una línea ancha se lee mal. */
  width?: 'default' | 'narrow'
}

/** Ancho máximo y padding lateral del sitio, en un solo lugar. */
export function Container({ children, className, width = 'default' }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-6 md:px-8',
        width === 'narrow' ? 'max-w-3xl' : 'max-w-6xl',
        className,
      )}
    >
      {children}
    </div>
  )
}
