import Link from 'next/link'

import type { SiteSetting } from '@/payload-types'

import { Container } from '@/components/ui/Container'
import { MediaImage } from '@/components/ui/MediaImage'
import { cn } from '@/lib/cn'

import { MobileMenu } from './MobileMenu'

/**
 * Server Component. El menú y el logo salen del CMS; lo único que cruza al
 * cliente es el desplegable móvil, que necesita estado de abierto/cerrado.
 */
export function Header({ settings }: { settings: SiteSetting }) {
  const { brand, nav } = settings
  const items = nav ?? []

  return (
    <header className="border-fog/60 bg-surface/90 sticky top-0 z-50 border-b backdrop-blur-md">
      <Container className="flex h-(--header-height) items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label={brand?.name ?? 'Inicio'}>
          {brand?.logo ? (
            <MediaImage media={brand.logo} sizes="200px" className="h-7 w-auto" />
          ) : (
            <span className="font-editorial text-h4 text-ink">{brand?.name}</span>
          )}
        </Link>

        {items.length > 0 ? (
          <>
            <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
              {items.map((item) => (
                <a
                  key={item.id ?? `${item.label}-${item.href}`}
                  href={item.href}
                  className={cn(
                    'font-ui text-body-sm transition-colors',
                    item.highlight
                      ? 'bg-anchor text-on-anchor rounded-button px-5 py-2.5 font-medium hover:opacity-88'
                      : 'text-ink/70 hover:text-ink',
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <MobileMenu items={items} />
          </>
        ) : null}
      </Container>
    </header>
  )
}
