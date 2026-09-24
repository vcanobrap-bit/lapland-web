'use client'

import { useEffect, useRef } from 'react'

/**
 * Client Component: desplaza apenas la escena del hero siguiendo el puntero,
 * para darle profundidad. Solo con mouse y sin `prefers-reduced-motion`.
 *
 * Las imágenes llegan como children ya renderizadas en el servidor.
 */
export function HeroParallax({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5
      const y = event.clientY / window.innerHeight - 0.5
      element.style.translate = `${x * -14}px ${y * -10}px`
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {children}
    </div>
  )
}
