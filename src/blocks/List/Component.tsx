import type { ListBlock } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { Section } from '@/components/ui/Section'

type ListProps = ListBlock & { anchorId: string; tone: 'default' | 'subtle' }

/** Server Component: solo obtiene y muestra contenido, sin estado ni interacción. */
export function List({ anchorId, intro, items, title, tone }: ListProps) {
  if (!items?.length) return null

  return (
    <Section id={anchorId} tone={tone}>
      <div className="grid gap-12 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-20">
        <div>
          <h2 className="text-ink text-3xl font-medium tracking-tight text-balance md:text-4xl">
            {title}
          </h2>
          <RichText data={intro} className="mt-6" />
        </div>

        <ul className="border-line grid grid-cols-1 border-t sm:grid-cols-2">
          {items.map((item, position) => (
            <li
              key={item.id ?? `${item.label}-${position}`}
              className="border-line text-ink border-b py-4 text-sm"
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
