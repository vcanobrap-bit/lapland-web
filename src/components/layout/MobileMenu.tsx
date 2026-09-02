'use client'

import { useEffect, useState } from 'react'

import type { SiteSetting } from '@/payload-types'

import { cn } from '@/lib/cn'

type NavItem = NonNullable<SiteSetting['nav']>[number]

/**
 * Client Component: necesita estado de abierto/cerrado. Es la única parte del
 * encabezado que cruza al cliente.
 */
export function MobileMenu({ items }: { items: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false)

  // Con el menú abierto el fondo no debe poder desplazarse.
  useEffect(() => {
    if (!isOpen) return

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="menu-movil"
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        className="text-ink flex size-10 items-center justify-center"
      >
        <span aria-hidden="true" className="relative block h-3 w-5">
          <span
            className={cn(
              'bg-ink absolute left-0 block h-px w-full transition-transform',
              isOpen ? 'top-1.5 rotate-45' : 'top-0',
            )}
          />
          <span
            className={cn(
              'bg-ink absolute left-0 block h-px w-full transition-transform',
              isOpen ? 'top-1.5 -rotate-45' : 'top-3',
            )}
          />
        </span>
      </button>

      <div
        id="menu-movil"
        hidden={!isOpen}
        className="border-fog bg-surface absolute inset-x-0 top-(--header-height) border-b px-6 py-10"
      >
        <nav aria-label="Principal" className="flex flex-col gap-6">
          {items.map((item) => (
            <a
              key={item.id ?? `${item.label}-${item.href}`}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'font-ui text-h4',
                item.highlight ? 'text-ink font-medium' : 'text-ink/70 hover:text-ink',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}
