import type { ListBlock } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { Section } from '@/components/ui/Section'
import { cn } from '@/lib/cn'

type ListProps = ListBlock & { anchorId: string }

/** Server Component: solo obtiene y muestra contenido, sin estado ni interacción. */
export function List({ anchorId, intro, items, surface, title }: ListProps) {
  if (!items?.length) return null

  const isAnchor = surface === 'anchor'
  const rule = isAnchor ? 'border-on-anchor/25' : 'border-fog'

  return (
    <Section id={anchorId} surface={surface}>
      <div className="grid gap-12 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-20">
        <div>
          <h2 className="font-editorial text-h1 text-balance">{title}</h2>
          <RichText data={intro} className="mt-8" onAnchor={isAnchor} />
        </div>

        <ul className={cn('grid grid-cols-1 border-t sm:grid-cols-2', rule)}>
          {items.map((item, position) => (
            <li
              key={item.id ?? `${item.label}-${position}`}
              className={cn('font-ui text-h4 border-b py-5', rule)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
