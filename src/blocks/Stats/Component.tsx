import type { StatsBlock } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { Section } from '@/components/ui/Section'

type StatsProps = StatsBlock & { anchorId: string; tone: 'default' | 'subtle' }

/** Server Component: solo obtiene y muestra contenido, sin estado ni interacción. */
export function Stats({ anchorId, intro, items, title, tone }: StatsProps) {
  if (!items?.length) return null

  return (
    <Section id={anchorId} tone={tone}>
      {title ? (
        <h2 className="text-ink max-w-2xl text-3xl font-medium tracking-tight text-balance md:text-4xl">
          {title}
        </h2>
      ) : null}

      <RichText data={intro} className="mt-6 max-w-2xl" />

      <dl className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-3">
        {items.map((item, position) => (
          <div key={item.id ?? `${item.value}-${position}`}>
            {/* La cifra es lo que se lee primero: va antes en el DOM y en tamaño. */}
            <dt className="text-ink text-4xl font-medium tracking-tight md:text-5xl">
              {item.value}
            </dt>
            <dd className="text-muted mt-3 text-sm leading-relaxed text-pretty">
              {item.label}
              {item.source ? (
                <span className="text-muted/70 mt-2 block text-xs">{item.source}</span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
