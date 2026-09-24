'use client'

import { useEffect, useRef } from 'react'

/**
 * Client Component: dispara la entrada de la sección de datos.
 *
 * Marca la sección con `data-reveal` y a cada pieza (encabezado y tarjetas)
 * con `data-in` cuando aparece en pantalla; las transiciones viven en
 * stats.css. Se observa pieza por pieza porque en móvil las tarjetas van
 * apiladas y la segunda entra bastante después que la primera.
 *
 * Sin JS o con `prefers-reduced-motion` no marca nada y todo se ve quieto.
 */
export function StatsReveal({
  children,
  className,
  id,
  labelledBy,
}: {
  children: React.ReactNode
  className?: string
  id?: string
  labelledBy?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = ref.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const pieces = section.querySelectorAll<HTMLElement>('[data-reveal-piece]')
    section.dataset.reveal = ''

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const piece = entry.target as HTMLElement
          piece.dataset.in = ''
          observer.unobserve(piece)
        }
      },
      { threshold: 0.15 },
    )
    pieces.forEach((piece) => observer.observe(piece))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} id={id} className={className} aria-labelledby={labelledBy}>
      {children}
    </section>
  )
}
