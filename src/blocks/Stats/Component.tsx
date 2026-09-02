import type { StatsBlock } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { Section } from '@/components/ui/Section'
import { cn } from '@/lib/cn'

type StatsProps = StatsBlock & { anchorId: string }

/**
 * Server Component. Sigue el componente `stat-highlight` del design system: la
 * cifra en Fraunces, su explicación en Inter. El dato no existe sin el contexto
 * que lo justifica, así que ambos van siempre juntos.
 */
export function Stats({ anchorId, intro, items, surface, title }: StatsProps) {
  if (!items?.length) return null

  const isAnchor = surface === 'anchor'

  return (
    <Section id={anchorId} surface={surface}>
      {title ? <h2 className="font-editorial text-h1 max-w-2xl text-balance">{title}</h2> : null}

      <RichText data={intro} className="mt-6 max-w-2xl" onAnchor={isAnchor} />

      <dl className="mt-16 grid gap-x-12 gap-y-14 md:grid-cols-3">
        {items.map((item, position) => (
          <div key={item.id ?? `${item.value}-${position}`}>
            {/* La cifra se lee primero: va antes en el DOM y en la jerarquía. */}
            <dt className="font-editorial text-display leading-none">{item.value}</dt>
            <dd
              className={cn(
                'text-body mt-5 max-w-[40ch] text-pretty',
                isAnchor ? 'text-on-anchor/80' : 'text-ink/75',
              )}
            >
              {item.label}
              {item.source ? (
                <span
                  className={cn(
                    'text-caption mt-2 block',
                    isAnchor ? 'text-on-anchor/55' : 'text-ink/50',
                  )}
                >
                  {item.source}
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
