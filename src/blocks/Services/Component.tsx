import type { ServicesBlock } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { MediaImage } from '@/components/ui/MediaImage'
import { Section } from '@/components/ui/Section'

type ServicesProps = ServicesBlock & { anchorId: string }

/** Server Component: solo obtiene y muestra contenido, sin estado ni interacción. */
export function Services({ anchorId, items, title }: ServicesProps) {
  if (!items?.length) return null

  return (
    <Section id={anchorId}>
      <h2 className="text-ink text-3xl font-medium tracking-tight text-balance md:text-4xl">
        {title}
      </h2>

      <ul className="mt-14 grid gap-x-12 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, position) => (
          <li key={item.id ?? `${item.title}-${position}`}>
            {item.icon ? (
              <MediaImage media={item.icon} sizes="48px" className="mb-5 size-10 object-contain" />
            ) : null}

            <h3 className="text-ink text-lg font-medium">{item.title}</h3>
            <RichText data={item.description} className="mt-3 text-sm" />
          </li>
        ))}
      </ul>
    </Section>
  )
}
