import type { ServicesBlock } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { MediaImage } from '@/components/ui/MediaImage'
import { Section } from '@/components/ui/Section'
import { cn } from '@/lib/cn'

type ServicesProps = ServicesBlock & { anchorId: string }

/** Server Component: solo obtiene y muestra contenido, sin estado ni interacción. */
export function Services({ anchorId, items, surface, title }: ServicesProps) {
  if (!items?.length) return null

  const isAnchor = surface === 'anchor'

  return (
    <Section id={anchorId} surface={surface}>
      <h2 className="font-editorial text-h1 max-w-3xl text-balance">{title}</h2>

      <ul className="mt-16 grid gap-x-12 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, position) => (
          <li key={item.id ?? `${item.title}-${position}`}>
            {item.icon ? (
              <MediaImage media={item.icon} sizes="48px" className="mb-6 size-8 object-contain" />
            ) : (
              // Regla de separación del design system: la línea aparece donde
              // el contenido la necesita para no confundirse con el de al lado.
              <span
                className={cn('mb-6 block h-px w-10', isAnchor ? 'bg-on-anchor/40' : 'bg-moss')}
                aria-hidden="true"
              />
            )}

            <h3 className="font-ui text-h4">{item.title}</h3>
            <RichText data={item.description} className="text-body-sm mt-3" onAnchor={isAnchor} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
