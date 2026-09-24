'use client'

import { useEffect, useState } from 'react'

/** Desde cuántos píxeles de scroll el encabezado pasa a su versión compacta. */
const SCROLL_THRESHOLD = 24

/**
 * Client Component: la única parte del encabezado que necesita saber del
 * scroll. Marca `data-scrolled` y el CSS hace el resto (hero.css). El logo y
 * el menú llegan como children renderizados en el servidor.
 */
export function HeaderFrame({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header className="site-header" data-scrolled={isScrolled}>
      {children}
    </header>
  )
}
