import Link from 'next/link'

import type { SiteSetting } from '@/payload-types'

import { Container } from '@/components/ui/Container'
import { MediaImage } from '@/components/ui/MediaImage'
import { cn } from '@/lib/cn'
import { resolveMedia } from '@/lib/media'

import { HeaderFrame } from './HeaderFrame'
import { MobileMenu } from './MobileMenu'

/**
 * Server Component. El menú y los logos salen del CMS; al cliente cruzan solo
 * el marco que sigue el scroll y el menú móvil, que tiene estado.
 *
 * Sobre un hero con foto flota transparente y en blanco; al bajar, o en páginas
 * sin hero, es sólido. Los estados viven en hero.css.
 */
export function Header({ settings }: { settings: SiteSetting }) {
  const { brand, nav } = settings
  const items = nav ?? []
  const name = brand?.name ?? 'Lapland'
  const logo = resolveMedia(brand?.logo)
  const logoLight = resolveMedia(brand?.logoLight)

  return (
    <HeaderFrame>
      <Container className="flex h-full items-center justify-between gap-6">
        <Link href="/" className="site-header__brand" aria-label={name}>
          {logo ? (
            <>
              <MediaImage
                media={logo}
                sizes="120px"
                priority
                className={cn(
                  'site-header__logo',
                  logoLight ? 'site-header__logo--dark' : 'site-header__logo--solo',
                )}
              />
              {logoLight ? (
                <MediaImage
                  media={logoLight}
                  sizes="120px"
                  priority
                  className="site-header__logo site-header__logo--light"
                />
              ) : null}
            </>
          ) : (
            <span className="site-header__name">{name}</span>
          )}
        </Link>

        {items.length > 0 ? (
          <>
            <nav
              aria-label="Principal"
              className="site-nav hidden items-center gap-6 md:flex lg:gap-10"
            >
              {items.map((item) => (
                <a
                  key={item.id ?? `${item.label}-${item.href}`}
                  href={item.href}
                  className={cn(item.highlight && 'is-pill')}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <MobileMenu
              items={items}
              logo={
                logo ? (
                  <MediaImage media={logo} sizes="120px" />
                ) : (
                  <span className="mobile-menu__name">{name}</span>
                )
              }
            />
          </>
        ) : null}
      </Container>
    </HeaderFrame>
  )
}
