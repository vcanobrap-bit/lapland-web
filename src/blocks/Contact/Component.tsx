import type { ContactBlock, SiteSetting } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { Section } from '@/components/ui/Section'
import { cn } from '@/lib/cn'

import { ContactForm } from './ContactForm'

type ContactProps = ContactBlock & { settings: SiteSetting; anchorId: string }

/**
 * Server Component. Los datos de contacto no son campos de este bloque: vienen
 * de SiteSettings, para que el cliente los edite una vez y valgan en todo el
 * sitio.
 *
 * Lo único que cruza al cliente es el formulario, y solo si está activado.
 */
export function Contact({ anchorId, settings, showForm, surface, text, title }: ContactProps) {
  const { address, email, phone } = settings.contact ?? {}
  const isAnchor = surface === 'anchor'

  const labelClass = cn('text-caption uppercase', isAnchor ? 'text-on-anchor/55' : 'text-ink/50')
  const linkClass = 'underline underline-offset-4 transition-opacity hover:opacity-70'

  return (
    <Section id={anchorId} surface={surface}>
      <div className="grid gap-16 md:grid-cols-2 md:gap-20">
        <div>
          <h2 className="font-editorial text-h1 text-balance">{title}</h2>
          <RichText data={text} className="mt-8" onAnchor={isAnchor} />

          <dl className="mt-12 space-y-7">
            {email ? (
              <div>
                <dt className={labelClass}>Email</dt>
                <dd className="text-body mt-1.5">
                  <a href={`mailto:${email}`} className={linkClass}>
                    {email}
                  </a>
                </dd>
              </div>
            ) : null}

            {phone ? (
              <div>
                <dt className={labelClass}>Teléfono</dt>
                <dd className="text-body mt-1.5">
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className={linkClass}>
                    {phone}
                  </a>
                </dd>
              </div>
            ) : null}

            {address ? (
              <div>
                <dt className={labelClass}>Dirección</dt>
                <dd className="text-body mt-1.5 whitespace-pre-line">{address}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        {showForm ? <ContactForm onAnchor={isAnchor} /> : null}
      </div>
    </Section>
  )
}
