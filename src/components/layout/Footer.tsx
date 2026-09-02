import type { SiteSetting } from '@/payload-types'

import { Container } from '@/components/ui/Container'
import { MediaImage } from '@/components/ui/MediaImage'

/** Derivado del schema: agregar una red en Payload rompe el build hasta etiquetarla acá. */
type SocialPlatform = NonNullable<SiteSetting['socials']>[number]['platform']

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  x: 'X',
  youtube: 'YouTube',
  tiktok: 'TikTok',
}

/**
 * Server Component: solo recibe datos y los muestra. La consulta a Payload
 * ocurre en el layout, no acá.
 */
export function Footer({ settings }: { settings: SiteSetting }) {
  const { brand, contact, footer, socials } = settings
  const year = new Date().getFullYear()

  // El global puede estar sin publicar todavía: los tipos generados marcan
  // `contact` como requerido, pero en la base recién creada llega vacío.
  const email = contact?.email

  return (
    <footer className="border-line mt-24 border-t py-16">
      <Container className="flex flex-col gap-12 md:flex-row md:justify-between">
        <div className="space-y-6">
          {brand?.logo ? (
            <MediaImage media={brand.logo} className="h-8 w-auto" sizes="200px" />
          ) : (
            <p className="text-ink text-base font-medium tracking-tight">{brand?.name}</p>
          )}

          {brand?.tagline ? <p className="text-muted text-sm">{brand.tagline}</p> : null}

          <address className="text-muted space-y-1 text-sm not-italic">
            {email ? (
              <p>
                <a href={`mailto:${email}`} className="hover:text-ink transition-colors">
                  {email}
                </a>
              </p>
            ) : null}
            {contact?.phone ? (
              <p>
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                  className="hover:text-ink transition-colors"
                >
                  {contact.phone}
                </a>
              </p>
            ) : null}
            {contact?.address ? <p className="whitespace-pre-line">{contact.address}</p> : null}
          </address>
        </div>

        <div className="flex flex-col gap-6 md:items-end">
          {socials?.length ? (
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {socials.map((social) => (
                <li key={social.id ?? social.url}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-muted hover:text-ink transition-colors"
                  >
                    {PLATFORM_LABELS[social.platform]}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}

          {footer?.copyright ? (
            <p className="text-muted text-sm">
              © {year} {footer.copyright}
            </p>
          ) : null}
        </div>
      </Container>
    </footer>
  )
}
