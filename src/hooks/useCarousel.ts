'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type UseCarouselOptions = {
  count: number
  /** Milisegundos entre slides. 0 desactiva el autoplay. */
  autoplayMs?: number
}

/**
 * Controla un carrusel construido sobre scroll nativo con scroll-snap.
 *
 * El índice se deriva del scroll real del contenedor, no de un estado propio:
 * así queda sincronizado tanto si el usuario arrastra con el dedo como si usa
 * los controles, sin dos fuentes de verdad.
 */
export function useCarousel({ count, autoplayMs = 6000 }: UseCarouselOptions) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const goTo = useCallback(
    (next: number) => {
      const track = trackRef.current
      if (!track || count === 0) return

      // Módulo positivo: permite avanzar desde el último al primero y viceversa.
      const target = ((next % count) + count) % count
      const slide = track.children[target]

      if (slide instanceof HTMLElement) {
        track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' })
      }
    },
    [count],
  )

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame = 0
    const handleScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const width = track.clientWidth
        if (width > 0) setIndex(Math.round(track.scrollLeft / width))
      })
    }

    track.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (!autoplayMs || isPaused || count < 2) return
    // Quien pidió menos movimiento en su sistema no recibe autoplay.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setInterval(() => goTo(index + 1), autoplayMs)
    return () => window.clearInterval(timer)
  }, [autoplayMs, count, goTo, index, isPaused])

  return { goTo, index, isPaused, setIsPaused, trackRef }
}
