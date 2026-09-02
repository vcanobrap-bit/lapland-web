import type { ContactBlock, SiteSetting } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { Section } from '@/components/ui/Section'

type ContactProps = ContactBlock & { settings: SiteSetting }

/**
 * Server Component. Los datos de contacto no son campos de este bloque: vienen
 * de SiteSettings, para que el cliente los edite una vez y valgan en todo el
 * sitio. El bloque solo aporta el título y el texto de la sección.
 */
export function Contact({ settings, text, title }: ContactProps) {
  const { address, email, phone } = settings.contact ?? {}

  return (
    <Section id="contacto" tone="subtle">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="text-ink text-3xl font-medium tracking-tight text-balance md:text-4xl">
            {title}
          </h2>
          <RichText data={text} className="mt-6" />
        </div>

        <dl className="space-y-6 text-sm md:pt-2">
          {email ? (
            <div>
              <dt className="text-muted text-xs tracking-wide uppercase">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${email}`} className="text-ink underline underline-offset-4">
                  {email}
                </a>
              </dd>
            </div>
          ) : null}

          {phone ? (
            <div>
              <dt className="text-muted text-xs tracking-wide uppercase">Teléfono</dt>
              <dd className="mt-1">
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="text-ink underline underline-offset-4"
                >
                  {phone}
                </a>
              </dd>
            </div>
          ) : null}

          {address ? (
            <div>
              <dt className="text-muted text-xs tracking-wide uppercase">Dirección</dt>
              <dd className="text-ink mt-1 whitespace-pre-line">{address}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </Section>
  )
}
