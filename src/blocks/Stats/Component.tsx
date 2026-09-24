import type { CSSProperties } from 'react'

import type { StatsBlock } from '@/payload-types'

import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/cn'
import { splitHighlight } from '@/lib/highlight'

import { ONE_TRILLION } from './constants'
import { PeoplePictogram } from './PeoplePictogram'
import { StatsReveal } from './StatsReveal'
import { YearCost } from './YearCost'

type StatsProps = StatsBlock & { anchorId: string }
type StatItem = NonNullable<StatsBlock['items']>[number]

/** Las tarjetas entran una tras otra. */
const CARD_STEP_MS = 140

/** La cifra completa, con la parte elegida en el color de la tarjeta. */
function Figure({ accent, highlight, value }: Pick<StatItem, 'accent' | 'highlight' | 'value'>) {
  const word = highlight?.trim()
  const parts = word ? splitHighlight(value, word) : null
  if (!parts) return <>{value}</>

  return (
    <>
      {parts.before}
      <span className={cn('stat-card__mark', `stat-card__mark--${accent ?? 'boreas'}`)}>
        {parts.match}
      </span>
      {parts.after}
    </>
  )
}

function Visual({ item }: { item: StatItem }) {
  if (item.visual === 'people') return <PeoplePictogram />
  if (item.visual === 'yearCost')
    return <YearCost annualAmount={item.annualAmount ?? ONE_TRILLION} />
  return null
}

/**
 * Server Component. Cifras en tarjetas: cada una se lee como una frase que sale
 * del número ("En el mundo, 1 de cada 8 personas vive…") y abajo lleva el
 * gráfico que la vuelve visible. Al cliente solo bajan la entrada en pantalla y
 * el contador del año.
 */
export function Stats({ anchorId, eyebrow, items, source, title }: StatsProps) {
  if (!items?.length) return null

  const titleId = `${anchorId}-titulo`

  return (
    <StatsReveal id={anchorId} className="stats" labelledBy={title ? titleId : undefined}>
      <Container>
        {eyebrow || title || source ? (
          <header className="stats__head" data-reveal-piece>
            <div>
              {eyebrow ? <p className="stats__eyebrow">{eyebrow}</p> : null}
              {title ? (
                <h2 id={titleId} className="stats__title">
                  {title}
                </h2>
              ) : null}
            </div>
            {source ? <p className="stats__source">{source}</p> : null}
          </header>
        ) : null}

        <ul className="stats__cards" data-count={items.length}>
          {items.map((item, index) => {
            const hasVisual = item.visual === 'people' || item.visual === 'yearCost'

            return (
              <li
                key={item.id ?? `${item.value}-${index}`}
                className="stat-card"
                data-reveal-piece
                style={{ '--d': `${index * CARD_STEP_MS}ms` } as CSSProperties}
              >
                {item.lead ? <p className="stat-card__lead">{item.lead}</p> : null}
                {/* La cifra sube desde su propia máscara, como el titular del hero. */}
                <p className="stat-card__value">
                  <span>
                    <Figure accent={item.accent} highlight={item.highlight} value={item.value} />
                  </span>
                </p>
                <p className="stat-card__text">{item.label}</p>
                {hasVisual ? (
                  <div className="stat-card__visual">
                    <Visual item={item} />
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      </Container>
    </StatsReveal>
  )
}
