'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import type { SiteSetting } from '@/payload-types'

import { cn } from '@/lib/cn'

type NavItem = NonNullable<SiteSetting['nav']>[number]

/**
 * Client Component: necesita estado de abierto/cerrado.
 *
 * La pantalla del menú se monta en <body> con un portal. Dentro del encabezado
 * quedaría atrapada: su `backdrop-filter` convierte al encabezado en el
 * contenedor de cualquier hijo con `position: fixed`.
 *
 * Mientras está abierto marca `data-menu-open` en <html>, para que el
 * encabezado oculte su logo y deje solo la X (hero.css).
 */
export function MobileMenu({ items, logo }: { items: NavItem[]; logo: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => setIsMounted(true), [])

  useEffect(() => {
    if (!isOpen) return

    const menuElement = menuRef.current
    const toggle = toggleRef.current
    const root = document.documentElement
    const { overflow } = document.body.style
    root.setAttribute('data-menu-open', '')
    // Con el menú abierto el fondo no debe poder desplazarse.
    document.body.style.overflow = 'hidden'

    // El foco entra al menú cuando los enlaces ya empezaron a aparecer.
    const focusTimer = window.setTimeout(() => {
      menuElement?.querySelector('a')?.focus({ preventScroll: true })
    }, 250)

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    // Si la ventana crece hasta escritorio, el menú móvil deja de tener sentido.
    const desktop = window.matchMedia('(min-width: 768px)')
    const closeOnDesktop = () => {
      if (desktop.matches) setIsOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    desktop.addEventListener('change', closeOnDesktop)

    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', closeOnEscape)
      desktop.removeEventListener('change', closeOnDesktop)
      root.removeAttribute('data-menu-open')
      document.body.style.overflow = overflow
      // Al cerrar, el foco vuelve a la X en vez de perderse en un menú oculto.
      if (menuElement?.contains(document.activeElement)) {
        toggle?.focus({ preventScroll: true })
      }
    }
  }, [isOpen])

  const menu = (
    <div
      ref={menuRef}
      id="menu-movil"
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      className={cn('mobile-menu', isOpen && 'is-open')}
    >
      <div className="mobile-menu__logo">{logo}</div>

      <nav aria-label="Principal" className="mobile-menu__nav">
        {items.map((item, index) => (
          <a
            key={item.id ?? `${item.label}-${item.href}`}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={cn(item.highlight && 'is-pill')}
            // Orden de entrada: cada enlace aparece un poco después del anterior.
            style={{ '--i': index } as CSSProperties}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* La acuarela de montañas de la portada del manual. */}
      <Image
        src="/brand/montanas-acuarela.webp"
        alt=""
        width={1000}
        height={278}
        sizes="100vw"
        className="mobile-menu__art"
      />
    </div>
  )

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="menu-movil"
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        className="menu-toggle md:hidden"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      {isMounted ? createPortal(menu, document.body) : null}
    </>
  )
}
